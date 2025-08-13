/**
 * Colly | workspace controller
 */

import mongoose from "mongoose"
import crudController from "./common/crud.js"
import logger from "./../util/logger.js"

const Workspace = mongoose.model("Workspace")

const crud = crudController(Workspace)

/**
 * Check if a user has permission to perform an action on a workspace
 * @param {string} wsId Workspace ID
 * @param {string} userId User ID
 * @param {string} action action to perform (admin, write or read level)
 * @returns {boolean} access allowed
 */
const hasPermission = async (wsId, userId, action) => {
    let ws
    try {
        ws = await Workspace.findById(wsId)
    } catch (e) {
        logger.error("workspace_get_error", {
            id: wsId,
            error: e.message,
        })

        throw e
    }
    if (!ws) {
        return false
    }

    for (const membership of ws.members) {
        if (membership.user.toString() === userId) {
            if (action === "admin") {
                return membership.permissionLevel === "admin"
            } else if (action === "write") {
                return (
                    membership.permissionLevel === "admin" ||
                    membership.permissionLevel === "write"
                )
            } else if (action === "read") {
                return (
                    membership.permissionLevel === "admin" ||
                    membership.permissionLevel === "write" ||
                    membership.permissionLevel === "read"
                )
            }
        }
    }

    return false
}

export default {
    create: crud.create,
    update: crud.update,
    del: crud.del,
    getById: crud.getById,
    find: crud.find,
    hasPermission,
}
