/**
 * Colly | workspace routes
 */

import type { Request, Response } from "express"
import express, { Router } from "express"
import userController from "../controller/user.js"
import controller from "../controller/workspace.js"
import { handleError } from "../routes.js"
import crudRoutes, { CHECK_USER_PERMISSIONS } from "./common/crud.js"
import itemRoutes from "./item.js"
import sanitizeSchemas from "./sanitize/workspace.js"
import tagRoutes from "./tag.js"

const router: Router = express.Router()

const { create, update, del, find } = crudRoutes(controller, {
    permissionChecks: CHECK_USER_PERMISSIONS,
    sanitizeSchemas,
})

/**
 * Create new workspace
 */
router.post("/", create)

/**
 * Update workspace
 */
router.patch("/:id", update)

/**
 * Delete a workspace
 */
router.delete("/:id", del)

/**
 * Get workspaces
 */
router.get("/", find)

/**
 * Get user ID by its username
 */
router.get("/userByUsername/:username", async (req: Request, res: Response) => {
    const username = req.params.username

    let users
    try {
        users = await userController.find(
            {
                username: {
                    $eq: username,
                },
            },
            [],
            {},
            ["_id"]
        )
    } catch (e) {
        return handleError(e, res)
    }

    if (users.length !== 1) {
        return res.status(404).json({
            error: {
                code: "username_not_found",
            },
        })
    }

    return res.json({
        data: users[0],
    })
})

router.use("/:wsId/tag", tagRoutes)
router.use("/:wsId/item", itemRoutes)

export default router
