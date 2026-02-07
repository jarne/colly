/**
 * Colly | CRUD router
 */

import type { Request, Response } from "express"
import type {
    CrudControllerType,
    CrudControllerWithPermissionsType,
} from "../../controller/common/crud.js"
import workspace from "../../controller/workspace.js"
import { handleError } from "../../routes.js"
import type { ZodType } from "zod"

/* eslint-disable @typescript-eslint/no-explicit-any */
type ControllerParamType =
    | CrudControllerType<any, any>
    | CrudControllerWithPermissionsType<any, any>

type OptionsParamType = {
    // use workspace permission checks or user and owner relations for controller
    permissionChecks: number
    // schemas to sanitize query input in find operation
    sanitizeSchemas: {
        filterSchema: ZodType<any>
        populateSchema: ZodType<any>
        sortSchema: ZodType<any>
        selectSchema: ZodType<any>
        limitSchema: ZodType<any>
    }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

type CrudRouterType = {
    create: (req: Request, res: Response) => Promise<Response>
    update: (req: Request, res: Response) => Promise<Response>
    del: (req: Request, res: Response) => Promise<Response>
    getById: (req: Request, res: Response) => Promise<Response>
    find: (req: Request, res: Response) => Promise<Response>
}

export const NO_PERMISSION_CHECKS = 0
export const CHECK_USER_PERMISSIONS = 1
export const CHECK_WORKSPACE_PERMISSIONS = 2

/**
 * Common CRUD routes
 * @param {ControllerParamType} controller Controller for model
 * @param {OptionsParamType} options CRUD router options
 * @returns {CrudRouterType} CRUD functions
 */
const crud = (
    controller: ControllerParamType,
    {
        permissionChecks = NO_PERMISSION_CHECKS,
        sanitizeSchemas,
    }: OptionsParamType
): CrudRouterType => {
    /**
     * Create operation
     * @param {Request} req Request
     * @param {Response} res Result
     * @returns {Promise<Response>} Result
     */
    const create = async (req: Request, res: Response): Promise<Response> => {
        const data = req.body
        if (req.params.wsId) {
            data.workspace = req.params.wsId
        }

        if (permissionChecks === CHECK_WORKSPACE_PERMISSIONS) {
            let permCheck = false
            if (data.workspace) {
                permCheck = await workspace.hasPermission(
                    data.workspace.toString(),
                    req.user!.id,
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
     * @param {Request} req Request
     * @param {Response} res Result
     * @returns {Promise<Response>} Result
     */
    const update = async (req: Request, res: Response): Promise<Response> => {
        const id = req.params.id
        if (typeof id !== "string") {
            return res.status(400).json({
                error: {
                    code: "parameters_missing",
                },
            })
        }

        if ("hasPermission" in controller) {
            if (
                permissionChecks === CHECK_WORKSPACE_PERMISSIONS ||
                permissionChecks === CHECK_USER_PERMISSIONS
            ) {
                const permCheck = await controller.hasPermission(
                    id,
                    req.user!.id,
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
     * @param {Request} req Request
     * @param {Response} res Result
     * @returns {Promise<Response>} Result
     */
    const del = async (req: Request, res: Response): Promise<Response> => {
        const id = req.params.id
        if (typeof id !== "string") {
            return res.status(400).json({
                error: {
                    code: "parameters_missing",
                },
            })
        }

        if ("hasPermission" in controller) {
            if (
                permissionChecks === CHECK_WORKSPACE_PERMISSIONS ||
                permissionChecks === CHECK_USER_PERMISSIONS
            ) {
                const permCheck = await controller.hasPermission(
                    id,
                    req.user!.id,
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
     * @param {Request} req Request
     * @param {Response} res Result
     * @returns {Promise<Response>} Result
     */
    const getById = async (req: Request, res: Response): Promise<Response> => {
        const id = req.params.id
        if (typeof id !== "string") {
            return res.status(400).json({
                error: {
                    code: "parameters_missing",
                },
            })
        }

        if ("hasPermission" in controller) {
            if (
                permissionChecks === CHECK_WORKSPACE_PERMISSIONS ||
                permissionChecks === CHECK_USER_PERMISSIONS
            ) {
                const permCheck = await controller.hasPermission(
                    id,
                    req.user!.id,
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
     * @param {Request} req Request
     * @param {Response} res Result
     * @returns {Promise<Response>} Result
     */
    const find = async (req: Request, res: Response): Promise<Response> => {
        const sanitizedQuery = {
            filter: sanitizeSchemas.filterSchema.safeParse(req.query.filter),
            populate: sanitizeSchemas.populateSchema.safeParse(
                req.query.populate
            ),
            sort: sanitizeSchemas.sortSchema.safeParse(req.query.sort),
            select: sanitizeSchemas.selectSchema.safeParse(req.query.select),
            limit: sanitizeSchemas.limitSchema.safeParse(
                req.query.limit !== undefined
                    ? Number(req.query.limit)
                    : undefined
            ),
        }

        if (!sanitizedQuery.filter.success) {
            return res.status(400).json({
                error: {
                    code: "invalid_filter_query",
                    issues: sanitizedQuery.filter.error.issues,
                },
            })
        }
        if (!sanitizedQuery.populate.success) {
            return res.status(400).json({
                error: {
                    code: "invalid_populate_query",
                    issues: sanitizedQuery.populate.error.issues,
                },
            })
        }
        if (!sanitizedQuery.sort.success) {
            return res.status(400).json({
                error: {
                    code: "invalid_sort_query",
                    issues: sanitizedQuery.sort.error.issues,
                },
            })
        }
        if (!sanitizedQuery.select.success) {
            return res.status(400).json({
                error: {
                    code: "invalid_select_query",
                    issues: sanitizedQuery.select.error.issues,
                },
            })
        }
        if (!sanitizedQuery.limit.success) {
            return res.status(400).json({
                error: {
                    code: "invalid_limit_query",
                    issues: sanitizedQuery.limit.error.issues,
                },
            })
        }

        let filter
        if (permissionChecks === CHECK_USER_PERMISSIONS) {
            filter = {
                $and: [
                    {
                        members: {
                            $elemMatch: {
                                user: req.user!.id,
                                permissionLevel: {
                                    $in: ["admin", "write", "read"],
                                },
                            },
                        },
                    },
                    sanitizedQuery.filter.data || {},
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
                        workspace: {
                            $eq: wsId,
                        },
                    },
                    sanitizedQuery.filter.data || {},
                ],
            }
        } else {
            filter = sanitizedQuery.filter.data
        }

        let objs
        try {
            objs = await controller.find(
                filter,
                sanitizedQuery.populate.data,
                sanitizedQuery.sort.data,
                sanitizedQuery.select.data,
                sanitizedQuery.limit.data
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
