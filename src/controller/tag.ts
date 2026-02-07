/**
 * Colly | tag controller
 */

import mongoose from "mongoose"
import type { TagDocType, TagType } from "../model/tag.js"
import logger from "../util/logger.js"
import crudController from "./common/crud.js"
import workspace from "./workspace.js"

const Tag = mongoose.model("Tag")
const crud = crudController<TagType, TagDocType>(Tag)

/**
 * Check if a user has permission to access a tag
 * @param {string} tagId Tag ID
 * @param {string} userId User ID
 * @param {string} action action to perform (write or read level)
 * @returns {Promise<boolean>} access allowed
 */
const hasPermission = async (
    tagId: string,
    userId: string,
    action: string
): Promise<boolean> => {
    let tag
    try {
        tag = await Tag.findById(tagId)
    } catch (e) {
        if (e instanceof Error) {
            logger.error("tag_get_error", {
                id: tagId,
                error: e.message,
            })
        }

        throw e
    }
    if (!tag) {
        return false
    }

    return workspace.hasPermission(tag.workspace.toString(), userId, action)
}

export default {
    create: crud.create,
    update: crud.update,
    del: crud.del,
    getById: crud.getById,
    find: crud.find,
    hasPermission,
}
