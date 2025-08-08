/**
 * Colly | item controller
 */

import mongoose from "mongoose"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { GetObjectCommand } from "@aws-sdk/client-s3"

import crudController from "./common/crud.js"
import workspace from "./workspace.js"
import { getS3StorageKey } from "./itemPreview.js"
import logger from "./../util/logger.js"
import { s3Client } from "./../util/s3Storage.js"

const TYPE_LOGO = "logo"
const TYPE_IMAGE = "image"

const Item = mongoose.model("Item")
const crud = crudController(Item)

/**
 * Populate additional fields for signed image asset URL's
 * @param {object} item Item object
 * @returns {object} Item object (with signed URL's)
 */
const signImageUrls = async (item) => {
    if (item === null) {
        return null
    }

    if (item.logo) {
        const s3Key = getS3StorageKey(TYPE_LOGO, item.logo)

        const signedUrl = await getSignedUrl(
            s3Client,
            new GetObjectCommand({
                Bucket: process.env.S3_BUCKET,
                Key: s3Key,
            })
        )

        item.logoUrl = signedUrl
    }

    if (item.image) {
        const s3Key = getS3StorageKey(TYPE_IMAGE, item.image)

        const signedUrl = await getSignedUrl(
            s3Client,
            new GetObjectCommand({
                Bucket: process.env.S3_BUCKET,
                Key: s3Key,
            })
        )

        item.imageUrl = signedUrl
    }

    return item
}

/**
 * Get item
 * @param {string} id Item ID
 * @returns {object} Item
 */
const getById = async (id) => {
    try {
        const item = await Item.findById(id)
        const withSignedUrls = await signImageUrls(item)

        return withSignedUrls
    } catch (e) {
        logger.error("item_get_error", {
            id,
            error: e.message,
        })

        throw e
    }
}

/**
 * Find items
 * @param {object} filter Filter
 * @param {Array} populate Fields to populate
 * @param {object} sort Sorting
 * @param {Array} select Fields to select
 * @param {number} limit Limit amount of results
 * @returns {object[]} Found items
 */
export const find = async (
    filter = {},
    populate = [],
    sort = {},
    select = [],
    limit
) => {
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
        logger.error("item_find_error", {
            error: e.message,
        })

        throw e
    }
}

/**
 * Check if a user has permission to access an item
 * @param {string} itemId Item ID
 * @param {string} userId User ID
 * @param {string} action action to perform (write or read level)
 * @returns {boolean} access allowed
 */
const hasPermission = async (itemId, userId, action) => {
    let item
    try {
        item = await Item.findById(itemId)
    } catch (e) {
        logger.error("item_get_error", {
            id: itemId,
            error: e.message,
        })

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
