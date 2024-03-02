/**
 * Colly | tag routes
 */

import express from "express"

import controller from "./../controller/tag.js"
import crudRoutes from "./common/crud.js"

const router = express.Router()

const { create, update, del, find } = crudRoutes(controller, true)

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
