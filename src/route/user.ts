/**
 * Colly | user routes
 */

import express, { Router } from "express"

import controller from "../controller/user.js"
import crudRoutes, { NO_PERMISSION_CHECKS } from "./common/crud.js"
import sanitizeSchemas from "./sanitize/user.js"

const router: Router = express.Router()

const { create, update, del, find } = crudRoutes(controller, {
    permissionChecks: NO_PERMISSION_CHECKS,
    sanitizeSchemas,
})

/**
 * Create new user
 */
router.post("/", create)

/**
 * Update user
 */
router.patch("/:id", update)

/**
 * Delete a user
 */
router.delete("/:id", del)

/**
 * Get all users
 */
router.get("/", find)

export default router
