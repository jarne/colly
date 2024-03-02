/**
 * Colly | CRUD controller
 */

import mongoose from "mongoose"

import NotFoundError from "./../exception/notFoundError.js"
import logger from "./../../util/logger.js"

/**
 * Common CRUD operations
 * @param {mongoose.Model} model Mongoose database model
 * @returns {Function} CRUD functions
 */
const crud = (model) => {
    const modelName = model.modelName.toLowerCase()

    /**
     * Create operation
     * @param {object} data Object data
     * @returns {object} Created model object
     */
    const create = async (data) => {
        const obj = new model(data)

        try {
            const saved = await obj.save()
            logger.verbose(`${modelName}_created`, { id: saved.id })

            return saved
        } catch (e) {
            logger.error(`${modelName}_create_error`, {
                error: e.message,
            })

            throw e
        }
    }

    /**
     * Update operation
     * @param {string} id Object ID
     * @param {object} data Object data
     * @returns {object} Updated model object
     */
    const update = async (id, data) => {
        try {
            const updated = await model.findByIdAndUpdate(id, data, {
                returnDocument: "after",
            })

            if (updated === null) {
                throw new NotFoundError()
            }

            logger.verbose(`${modelName}_updated`, { id: updated.id })
            return updated
        } catch (e) {
            logger.error(`${modelName}_update_error`, {
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
            logger.verbose(`${modelName}_deleted`, { id })
        } catch (e) {
            logger.error(`${modelName}_delete_error`, {
                id,
                error: e.message,
            })

            throw e
        }
    }

    /**
     * Get operation
     * @param {string} id Object ID
     * @returns {object} Model object
     */
    const getById = async (id) => {
        try {
            return await model.findById(id)
        } catch (e) {
            logger.error(`${modelName}_get_error`, {
                id,
                error: e.message,
            })

            throw e
        }
    }

    /**
     * Find operation
     * @param {object} filter Filter
     * @param {Array} populate Fields to populate
     * @param {object} sort Sorting
     * @param {Array} select Fields to select
     * @param {boolean} lean Return lean object
     * @returns {object[]} Found model objects
     */
    const find = async (
        filter = {},
        populate = [],
        sort = {},
        select = [],
        lean = false
    ) => {
        try {
            const query = model.find(filter || {})

            if (populate) {
                query.populate(populate)
            }

            if (sort) {
                query.sort(sort)
            }

            if (select) {
                query.select(select)
            }

            if (lean) {
                query.lean()
            }

            return await query.exec()
        } catch (e) {
            logger.error(`${modelName}_find_error`, {
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
        find,
    }
}

export default crud
