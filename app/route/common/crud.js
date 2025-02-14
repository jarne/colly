/**
 * Colly | CRUD router
 */

import { handleError } from "./../../routes.js"
import { parseFieldsArray } from "./../util/queryParser.js"

/**
 * Common CRUD routes
 * @param {object} controller Controller for model
 * @param {boolean} userPermissions Use permission checks/owner relations for controller
 * @returns {Function} CRUD functions
 */
const crud = (controller, userPermissions = false) => {
    /**
     * Create operation
     * @param {object} req Request
     * @param {object} res Result
     * @returns {object} Result
     */
    const create = async (req, res) => {
        let data
        if (userPermissions) {
            data = {
                ...req.body,
                owner: req.user.id,
            }
        } else {
            data = req.body
        }

        let obj
        try {
            obj = await controller.create(data)
        } catch (e) {
            return handleError(e, res)
        }

        return res.json({
            id: obj.id,
        })
    }

    /**
     * Update operation
     * @param {object} req Request
     * @param {object} res Result
     * @returns {object} Result
     */
    const update = async (req, res) => {
        const id = req.params.id

        if (userPermissions) {
            const permCheck = await controller.hasPermission(id, req.user.id)
            if (!permCheck) {
                return res.status(403).json({
                    error: {
                        code: "insufficient_permission",
                    },
                })
            }
        }

        let obj
        try {
            obj = await controller.update(id, req.body)
        } catch (e) {
            return handleError(e, res)
        }

        return res.json({
            id: obj.id,
        })
    }

    /**
     * Delete operation
     * @param {object} req Request
     * @param {object} res Result
     * @returns {object} Result
     */
    const del = async (req, res) => {
        const id = req.params.id

        if (userPermissions) {
            const permCheck = await controller.hasPermission(id, req.user.id)
            if (!permCheck) {
                return res.status(403).json({
                    error: {
                        code: "insufficient_permission",
                    },
                })
            }
        }

        try {
            await controller.del(id)
        } catch (e) {
            return handleError(e, res)
        }

        return res.json({
            id,
        })
    }

    /**
     * Get operation
     * @param {object} req Request
     * @param {object} res Result
     * @returns {object} Result
     */
    const getById = async (req, res) => {
        const id = req.params.id

        if (userPermissions) {
            const permCheck = await controller.hasPermission(id, req.user.id)
            if (!permCheck) {
                return res.status(403).json({
                    error: {
                        code: "insufficient_permission",
                    },
                })
            }
        }

        let obj
        try {
            obj = await controller.getById(id)
        } catch (e) {
            return handleError(e, res)
        }

        return res.json(obj)
    }

    /**
     * Find operation
     * @param {object} req Request
     * @param {object} res Result
     * @returns {object} Result
     */
    const find = async (req, res) => {
        let filter
        if (userPermissions) {
            filter = {
                $and: [
                    {
                        owner: req.user.id,
                    },
                    req.query.filter || {},
                ],
            }
        } else {
            filter = req.query.filter
        }

        let objs
        try {
            objs = await controller.find(
                filter,
                parseFieldsArray(req.query.populate),
                req.query.sort,
                parseFieldsArray(req.query.select),
                req.query.limit
            )
        } catch (e) {
            return handleError(e, res)
        }

        return res.json({
            data: objs,
        })
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
