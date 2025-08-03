/**
 * Colly | CRUD router
 */

import { handleError } from "./../../routes.js"
import { parseFieldsArray } from "./../util/queryParser.js"
import workspace from "./../../controller/workspace.js"

export const CHECK_USER_PERMISSIONS = 1
export const CHECK_WORKSPACE_PERMISSIONS = 2

/**
 * Common CRUD routes
 * @param {object} controller Controller for model
 * @param {number} permissionChecks Use workspace permission checks or user and owner relations for controller
 * @returns {Function} CRUD functions
 */
const crud = (controller, permissionChecks = -1) => {
    /**
     * Create operation
     * @param {object} req Request
     * @param {object} res Result
     * @returns {object} Result
     */
    const create = async (req, res) => {
        const data = req.body

        if (permissionChecks === CHECK_WORKSPACE_PERMISSIONS) {
            let permCheck = false
            if (data.workspace) {
                permCheck = await workspace.hasPermission(
                    data.workspace.toString(),
                    req.user.id,
                    "write"
                )
            }
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

        if (
            permissionChecks === CHECK_WORKSPACE_PERMISSIONS ||
            permissionChecks === CHECK_USER_PERMISSIONS
        ) {
            const permCheck = await controller.hasPermission(
                id,
                req.user.id,
                "write"
            )
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

        if (
            permissionChecks === CHECK_WORKSPACE_PERMISSIONS ||
            permissionChecks === CHECK_USER_PERMISSIONS
        ) {
            const permCheck = await controller.hasPermission(
                id,
                req.user.id,
                "write"
            )
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

        if (
            permissionChecks === CHECK_WORKSPACE_PERMISSIONS ||
            permissionChecks === CHECK_USER_PERMISSIONS
        ) {
            const permCheck = await controller.hasPermission(
                id,
                req.user.id,
                "read"
            )
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
        if (permissionChecks === CHECK_USER_PERMISSIONS) {
            filter = {
                $and: [
                    {
                        owner: req.user.id,
                    },
                    req.query.filter || {},
                ],
            }
        } else if (permissionChecks === CHECK_WORKSPACE_PERMISSIONS) {
            const wsId = req.params.wsId
            if (!wsId) {
                return res.status(403).json({
                    error: {
                        code: "insufficient_permission",
                    },
                })
            }

            filter = {
                $and: [
                    {
                        workspace: wsId,
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
