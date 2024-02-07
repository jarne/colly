/**
 * Colly | CRUD controller
 */

import mongoose from "mongoose"

import NotFoundError from "./../exception/notFoundError.js"
import logger from "./../../util/logger.js"

/**
 * Common CRUD operations
 * @param {mongoose.Model} model Mongoose database model
 */
const crud = (model) => {
    /**
     * Create operation
     * @param {object} data Object data
     * @returns Created database object
     */
    const create = async (data) => {
        const obj = new model(data)

        try {
            const saved = await obj.save()
            logger.verbose("tag_created", { id: saved.id })

            return saved
        } catch (e) {
            logger.error("tag_create_error", {
                error: e.message,
            })

            throw e
        }
    }

    /**
     * Update operation
     * @param {string} id Object ID
     * @param {object} data Object data
     * @returns Updated database object
     */
    const update = async (id, data) => {
        try {
            const updated = await model.findByIdAndUpdate(id, data, {
                returnDocument: "after",
            })

            if (updated === null) {
                throw new NotFoundError()
            }

            logger.verbose("tag_updated", { id: updated.id })
            return updated
        } catch (e) {
            logger.error("tag_update_error", {
                id,
                error: e.message,
            })

            throw e
        }
    }

    /**
     * Delete operation
     * @param {string} id Object ID
     */
    const del = async (id) => {
        try {
            await model.findByIdAndDelete(id)
            logger.verbose("tag_deleted", { id })
        } catch (e) {
            logger.error("tag_delete_error", {
                id,
                error: e.message,
            })

            throw e
        }
    }

    /**
     * Get operation
     * @param {string} id Object ID
     * @returns Database object
     */
    const getById = async (id) => {
        try {
            return await model.findById(id)
        } catch (e) {
            logger.error("tag_get_error", {
                id,
                error: e.message,
            })

            throw e
        }
    }

    /**
     * List operation
     * @returns List of all database objects
     */
    const list = async () => {
        try {
            return await model.find()
        } catch (e) {
            logger.error("tag_list_error", {
                error: e.message,
            })

            throw e
        }
    }

    return {
        create,
        update,
        del,
        getById,
        list,
    }
}

export default crud
