/**
 * Colly | item controller
 */

import mongoose from "mongoose"

import NotFoundError from "./exception/notFoundError.js"
import { triggerPreviewGeneration } from "./itemPreview.js"
import logger from "./../util/logger.js"

const Item = mongoose.model("Item")

/**
 * Create a new item
 *
 * @param {string} url Item URL
 * @param {string} name Name of the item
 * @param {string} description Item description
 * @param {string} ownerId Owner user ID
 * @param {Array} tags Assigned tags (ID's)
 *
 * @returns Item object
 */
export const createItem = async (
    url,
    name,
    description,
    ownerId,
    tags = []
) => {
    const item = new Item()
    item.url = url
    item.name = name
    item.description = description
    item.owner = ownerId
    item.tags = tags

    try {
        const savedItem = await item.save()
        triggerPreviewGeneration(savedItem.id)

        logger.info("item_created", { id: savedItem.id })

        return savedItem
    } catch (e) {
        logger.error("item_create_error", {
            error: e.message,
        })

        throw e
    }
}

/**
 * Update an item
 *
 * @param {string} id Item ID
 * @param {string} url Item URL
 * @param {string} name Name of the item
 * @param {string} description Item description
 * @param {string} ownerId Owner user ID
 * @param {Array} tags Assigned tags (ID's)
 *
 * @returns Item object
 */
export const updateItem = async (
    id,
    url,
    name,
    description,
    ownerId,
    tags = []
) => {
    let item
    try {
        item = await Item.findById(id)
    } catch (e) {
        throw e
    }

    if (item === null) {
        throw new NotFoundError()
    }

    item.url = url
    item.name = name
    item.description = description
    item.owner = ownerId
    item.tags = tags

    try {
        const savedItem = await item.save()
        triggerPreviewGeneration(savedItem.id)

        logger.info("item_updated", { id: savedItem.id })

        return savedItem
    } catch (e) {
        logger.error("item_update_error", {
            id,
            error: e.message,
        })

        throw e
    }
}

/**
 * Delete item by ID
 *
 * @param {string} id Item ID
 */
export const deleteItem = async (id) => {
    try {
        await Item.findByIdAndDelete(id)

        logger.info("item_deleted", { id })
    } catch (e) {
        logger.error("item_delete_error", {
            id,
            error: e.message,
        })

        throw e
    }
}

/**
 * Get item by ID
 *
 * @param {string} id Item ID
 *
 * @returns Item object
 */
export const getItem = async (id) => {
    try {
        return await Item.findById(id)
    } catch (e) {
        logger.error("item_get_error", {
            id,
            error: e.message,
        })

        throw e
    }
}

/**
 * Get all items
 *
 * @returns List of all Item objects
 */
export const listItems = async () => {
    try {
        return await Item.find().populate("tags")
    } catch (e) {
        logger.error("item_list_error", {
            error: e.message,
        })

        throw e
    }
}

/**
 * Check if user has permission to access an item
 *
 * @param {string} itemId Item ID
 * @param {string} userId User ID
 *
 * @returns allowed true/false
 */
export const hasPermission = async (itemId, userId) => {
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
