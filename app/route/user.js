/**
 * Colly | user routes
 */

import express from "express"

import controller from "./../controller/user.js"
import crudRoutes from "./common/crud.js"

const router = express.Router()

const { create, update, del, find } = crudRoutes(controller)

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
