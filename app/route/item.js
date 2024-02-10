/**
 * Colly | item routes
 */

import express from "express"

import controller from "./../controller/item.js"
import crudRoutes from "./../route/common/crud.js"
import { handleError } from "./../routes.js"

const router = express.Router()

const { update, del, list } = crudRoutes(controller)

/**
 * Create new item
 */
router.post("/", async (req, res) => {
    let item
    try {
        item = await controller.create({
            ...req.body,
            owner: req.user.id,
        })
    } catch (e) {
        return handleError(e, res)
    }

    return res.json({
        id: item.id,
    })
})

/**
 * Update item
 */
router.patch("/:id", update)

/**
 * Delete an item
 */
router.delete("/:id", del)

/**
 * Get all items
 */
router.get("/", list)

export default router
