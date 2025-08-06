/**
 * Colly | tag routes
 */

import express from "express"

import controller from "./../controller/tag.js"
import crudRoutes, { CHECK_WORKSPACE_PERMISSIONS } from "./common/crud.js"
import sanitizeSchemas from "./sanitize/tag.js"

const router = express.Router({
    mergeParams: true,
})

const { create, update, del, find } = crudRoutes(controller, {
    permissionChecks: CHECK_WORKSPACE_PERMISSIONS,
    sanitizeSchemas,
})

/**
 * Create new tag
 */
router.post("/", create)

/**
 * Update tag
 */
router.patch("/:id", update)

/**
 * Delete a tag
 */
router.delete("/:id", del)

/**
 * Get tags
 */
router.get("/", find)

export default router
