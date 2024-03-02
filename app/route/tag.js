/**
 * Colly | tag routes
 */

import express from "express"

import controller from "./../controller/tag.js"
import crudRoutes from "./common/crud.js"
import { handleError } from "./../routes.js"

const router = express.Router()

const { update, del, find } = crudRoutes(controller)

/**
 * Create new tag
 */
router.post("/", async (req, res) => {
    let tag
    try {
        tag = await controller.create({
            ...req.body,
            owner: req.user.id,
        })
    } catch (e) {
        return handleError(e, res)
    }

    return res.json({
        id: tag.id,
    })
})

/**
 * Update tag
 */
router.patch("/:id", update)

/**
 * Delete a tag
 */
router.delete("/:id", del)

/**
 * Get all tags
 */
router.get("/", find)

export default router
