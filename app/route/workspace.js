/**
 * Colly | workspace routes
 */

import express from "express"

import tagRoutes from "./tag.js"
import itemRoutes from "./item.js"
import controller from "./../controller/workspace.js"
import crudRoutes, { CHECK_USER_PERMISSIONS } from "./common/crud.js"

const router = express.Router()

const { create, update, del, find } = crudRoutes(
    controller,
    CHECK_USER_PERMISSIONS
)

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

router.use("/:wsId/tag", tagRoutes)
router.use("/:wsId/item", itemRoutes)

export default router
