/**
 * Colly | item routes
 */

import express from "express"

import controller from "./../controller/item.js"
import { getBasicMetadata } from "./../controller/itemPreview.js"
import crudRoutes from "./common/crud.js"
import { handleError } from "./../routes.js"

const router = express.Router()

const { create, update, del, find } = crudRoutes(controller, true)

/**
 * Create new item
 */
router.post("/", create)

/**
 * Update item
 */
router.patch("/:id", update)

/**
 * Delete an item
 */
router.delete("/:id", del)

/**
 * Get items
 */
router.get("/", find)

/**
 * Generate basic metadata preview for URL
 */
router.post("/meta", async (req, res) => {
    const url = req.body.url

    let meta
    try {
        meta = await getBasicMetadata(url)
    } catch (e) {
        return handleError(e, res)
    }

    return res.json({
        meta,
    })
})

export default router
