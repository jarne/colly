/**
 * Colly | item controller
 */

import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { GetObjectCommand } from "@aws-sdk/client-s3"

import Item from "./../model/item.js"
import crudController from "./common/crud.js"
import { getS3StorageKey } from "./itemPreview.js"
import logger from "./../util/logger.js"
import { s3Client } from "./../util/s3Storage.js"

const TYPE_LOGO = "logo"
const TYPE_IMAGE = "image"

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
 * List items
 * @returns {object[]} All items
 */
export const list = async () => {
    try {
        const items = await Item.find().populate("tags").lean()
        const withSignedUrls = await Promise.all(items.map(signImageUrls))

        return withSignedUrls
    } catch (e) {
        logger.error("item_list_error", {
            error: e.message,
        })

        throw e
    }
}

/**
 * Check if user has permission to access an item
 * @param {string} itemId Item ID
 * @param {string} userId User ID
 * @returns {boolean} access allowed
 */
const hasPermission = async (itemId, userId) => {
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

    return item.owner.toString() === userId
}

export default {
    create: crud.create,
    update: crud.update,
    del: crud.del,
    getById,
    list,
    hasPermission,
}
