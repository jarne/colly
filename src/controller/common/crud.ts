/**
 * Colly | CRUD controller
 */

import { Model, type SortOrder, type UpdateQuery } from "mongoose"
import logger from "../../util/logger.js"
import NotFoundError from "../exception/notFoundError.js"

export type CrudControllerType<S, D> = {
    create: (data: S) => Promise<D>
    update: (id: string, data: UpdateQuery<S>) => Promise<D>
    del: (id: string) => Promise<void>
    getById: (id: string) => Promise<D | null>
    find: (
        filter?: object,
        populate?: string[],
        sort?: Record<string, SortOrder>,
        select?: string[],
        limit?: number,
        lean?: boolean
    ) => Promise<D[]>
}

const DEFAULT_RESULT_LIMIT = 100

/**
 * Common CRUD operations
 * @param {Model} model Mongoose database model
 * @returns {CrudControllerType} CRUD functions
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const crud = <S, D>(model: Model<any>): CrudControllerType<S, D> => {
    const modelName = model.modelName.toLowerCase()

    /**
     * Create operation
     * @param {S} data Object data
     * @returns {Promise<T>} Created model object
     */
    const create = async (data: S): Promise<D> => {
        const obj = new model(data)

        try {
            const saved = await obj.save()
            logger.verbose(`${modelName}_created`, { id: saved.id })

            return saved
        } catch (e) {
            if (e instanceof Error) {
                logger.error(`${modelName}_create_error`, {
                    error: e.message,
                })
            }

            throw e
        }
    }

    /**
     * Update operation
     * @param {string} id Object ID
     * @param {UpdateQuery<S>} data Object data
     * @returns {Promise<D>} Updated model object
     */
    const update = async (id: string, data: UpdateQuery<S>): Promise<D> => {
        try {
            const updated = await model.findByIdAndUpdate(id, data, {
                returnDocument: "after",
                runValidators: true,
            })

            if (updated === null) {
                throw new NotFoundError(
                    "object with specified ID does not exist"
                )
            }

            logger.verbose(`${modelName}_updated`, { id: updated.id })
            return updated
        } catch (e) {
            if (e instanceof Error) {
                logger.error(`${modelName}_update_error`, {
                    id,
                    error: e.message,
                })
            }

            throw e
        }
    }

    /**
     * Delete operation
     * @param {string} id Object ID
     */
    const del = async (id: string) => {
        try {
            await model.findByIdAndDelete(id)
            logger.verbose(`${modelName}_deleted`, { id })
        } catch (e) {
            if (e instanceof Error) {
                logger.error(`${modelName}_delete_error`, {
                    id,
                    error: e.message,
                })
            }

            throw e
        }
    }

    /**
     * Get operation
     * @param {string} id Object ID
     * @returns {Promise<D | null>} Model object
     */
    const getById = async (id: string): Promise<D | null> => {
        try {
            return await model.findById(id)
        } catch (e) {
            if (e instanceof Error) {
                logger.error(`${modelName}_get_error`, {
                    id,
                    error: e.message,
                })
            }

            throw e
        }
    }

    /**
     * Find operation
     * @param {object} filter Filter
     * @param {string[]} populate Fields to populate
     * @param {object} sort Sorting
     * @param {string[]} select Fields to select
     * @param {number} limit Limit amount of results
     * @param {boolean} lean Return lean object
     * @returns {Promise<D[]>} Found model objects
     */
    const find = async (
        filter: object = {},
        populate: string[] = [],
        sort: Record<string, SortOrder> = {},
        select: string[] = [],
        limit: number = DEFAULT_RESULT_LIMIT,
        lean: boolean = false
    ): Promise<D[]> => {
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

            if (limit) {
                query.limit(limit)
            }

            if (lean) {
                query.lean()
            }

            return await query.exec()
        } catch (e) {
            if (e instanceof Error) {
                logger.error(`${modelName}_find_error`, {
                    error: e.message,
                })
            }

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
