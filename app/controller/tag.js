/**
 * Colly | tag controller
 */

import mongoose from "mongoose"

import crudController from "./common/crud.js"
import logger from "./../util/logger.js"

const Tag = mongoose.model("Tag")
const crud = crudController(Tag)

/**
 * Check if user has permission to access a tag
 * @param {string} tagId Tag ID
 * @param {string} userId User ID
 * @returns {boolean} access allowed
 */
const hasPermission = async (tagId, userId) => {
    let tag
    try {
        tag = await Tag.findById(tagId)
    } catch (e) {
        logger.error("tag_get_error", {
            id: tagId,
            error: e.message,
        })

        throw e
    }

    return tag.owner.toString() === userId
}

export default {
    create: crud.create,
    update: crud.update,
    del: crud.del,
    getById: crud.getById,
    find: crud.find,
    hasPermission,
}
