/**
 * Colly | workspace routes
 */

import express from "express"

import controller from "./../controller/workspace.js"
import crudRoutes from "./common/crud.js"

const router = express.Router()

const { create, update, del, find } = crudRoutes(controller, true)

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

export default router
