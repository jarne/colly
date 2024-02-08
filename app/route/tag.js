/**
 * Colly | tag routes
 */

import express from "express"

import controller from "./../controller/tag.js"
import crudRoutes from "./../route/common/crud.js"
import { handleError } from "./../routes.js"

const router = express.Router()

const { del, list } = crudRoutes(controller)

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
        tagId: tag.id,
    })
})

/**
 * Update tag
 */
router.patch("/:id", async (req, res) => {
    const tagId = req.params.id

    let tag
    try {
        tag = await controller.update(tagId, {
            ...req.body,
            owner: req.user.id,
        })
    } catch (e) {
        return handleError(e, res)
    }

    return res.json({
        tagId: tag.id,
    })
})

/**
 * Delete a tag
 */
router.delete("/:id", del)

/**
 * Get all tags
 */
router.get("/", list)

export default router
