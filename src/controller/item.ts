/**
 * Colly | item controller
 */

import { GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import mongoose, { type SortOrder } from "mongoose"
import type { ItemDocType, ItemType } from "../model/item.js"
import logger from "../util/logger.js"
import { s3Client } from "../util/s3Storage.js"
import crudController from "./common/crud.js"
import { getS3StorageKey } from "./itemPreview.js"
import workspace from "./workspace.js"

type ItemWithUrlsType = {
    logoUrl?: string
    imageUrl?: string
} & ItemDocType

const TYPE_LOGO = "logo"
const TYPE_IMAGE = "image"

const Item = mongoose.model("Item")
const crud = crudController<ItemType, ItemDocType>(Item)

/**
 * Populate additional fields for signed image asset URL's
 * @param {ItemDocType} item Item object
 * @returns {Promise<ItemWithUrlsType>} Item object (with signed URL's)
 */
const signImageUrls = async (item: ItemDocType): Promise<ItemWithUrlsType> => {
    const itemWithUrls = item as ItemWithUrlsType

    if (item.logo) {
        const s3Key = getS3StorageKey(TYPE_LOGO, item.logo.toString())

        const signedUrl = await getSignedUrl(
            s3Client,
            new GetObjectCommand({
                Bucket: process.env.S3_BUCKET,
                Key: s3Key,
            })
        )

        itemWithUrls.logoUrl = signedUrl
    }

    if (item.image) {
        const s3Key = getS3StorageKey(TYPE_IMAGE, item.image.toString())

        const signedUrl = await getSignedUrl(
            s3Client,
            new GetObjectCommand({
                Bucket: process.env.S3_BUCKET,
                Key: s3Key,
            })
        )

        itemWithUrls.imageUrl = signedUrl
    }

    return itemWithUrls
}

/**
 * Get item
 * @param {string} id Item ID
 * @returns {Promise<ItemWithUrlsType | null>} Item
 */
const getById = async (id: string): Promise<ItemWithUrlsType | null> => {
    try {
        const item = await Item.findById(id)
        if (item === null) {
            return null
        }

        const withSignedUrls = await signImageUrls(item)

        return withSignedUrls
    } catch (e) {
        if (e instanceof Error) {
            logger.error("item_get_error", {
                id,
                error: e.message,
            })
        }

        throw e
    }
}

/**
 * Find items
 * @param {object} filter Filter
 * @param {string[]} populate Fields to populate
 * @param {object} sort Sorting
 * @param {string[]} select Fields to select
 * @param {limit?} limit Limit amount of results
 * @returns {Promise<ItemWithUrlsType[]>} Found items
 */
const find = async (
    filter: object = {},
    populate: string[] = [],
    sort: Record<string, SortOrder> = {},
    select: string[] = [],
    limit?: number
): Promise<ItemWithUrlsType[]> => {
    try {
        const items = await crud.find(
            filter,
            ["tags", ...populate],
            sort,
            select,
            limit,
            true
        )
        const withSignedUrls = await Promise.all(items.map(signImageUrls))

        return withSignedUrls
    } catch (e) {
        if (e instanceof Error) {
            logger.error("item_find_error", {
                error: e.message,
            })
        }

        throw e
    }
}

/**
 * Check if a user has permission to access an item
 * @param {string} itemId Item ID
 * @param {string} userId User ID
 * @param {string} action action to perform (write or read level)
 * @returns {Promise<boolean>} access allowed
 */
const hasPermission = async (
    itemId: string,
    userId: string,
    action: string
): Promise<boolean> => {
    let item
    try {
        item = await Item.findById(itemId)
    } catch (e) {
        if (e instanceof Error) {
            logger.error("item_get_error", {
                id: itemId,
                error: e.message,
            })
        }

        throw e
    }
    if (!item) {
        return false
    }

    return workspace.hasPermission(item.workspace.toString(), userId, action)
}

export default {
    create: crud.create,
    update: crud.update,
    del: crud.del,
    getById,
    find,
    hasPermission,
}
