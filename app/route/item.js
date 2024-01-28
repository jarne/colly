/**
 * Colly | item routes
 */

import express from "express"

import {
    createItem,
    updateItem,
    deleteItem,
    listItems,
    hasPermission,
} from "./../controller/item.js"
import {
    triggerPreviewGeneration,
    previewExists,
    getPreviewPath,
} from "./../controller/itemPreview.js"
import { handleError } from "./../routes.js"
import logger from "./../util/logger.js"

const router = express.Router()

/**
 * Create new item
 */
router.post("/", async (req, res) => {
    let item
    try {
        item = await createItem(
            req.body.url,
            req.body.name,
            req.body.description,
            req.user.id,
            req.body.tags
        )
    } catch (e) {
        return handleError(e, res)
    }

    return res.json({
        itemId: item.id,
    })
})

/**
 * Update item
 */
router.patch("/:itemId", async (req, res) => {
    const itemId = req.params.itemId

    let item
    try {
        item = await updateItem(
            itemId,
            req.body.url,
            req.body.name,
            req.body.description,
            req.user.id,
            req.body.tags
        )
    } catch (e) {
        return handleError(e, res)
    }

    return res.json({
        itemId: item.id,
    })
})

/**
 * Delete an item
 */
router.delete("/:itemId", async (req, res) => {
    const itemId = req.params.itemId

    try {
        await deleteItem(itemId)
    } catch (e) {
        return handleError(e, res)
    }

    return res.json({
        itemId: itemId,
    })
})

/**
 * Get all items
 */
router.get("/", async (req, res) => {
    let items
    try {
        items = await listItems()
    } catch (e) {
        return handleError(e, res)
    }

    return res.json({
        items: items,
    })
})

/**
 * Trigger preview image generation of an item
 */
router.get("/:itemId/requestPreview", async (req, res) => {
    const itemId = req.params.itemId

    let allowed
    try {
        allowed = await hasPermission(itemId, req.user.id)
    } catch (e) {
        logger.error("permission_check_error", { itemId, userId: req.user.id })
        return handleError(e, res)
    }

    if (!allowed) {
        return res.status(403).send("Not allowed to access preview image.")
    }

    triggerPreviewGeneration(itemId)

    return res.status(204).send()
})

/**
 * Get preview image of an item
 */
router.get("/:itemId/preview", async (req, res) => {
    const itemId = req.params.itemId

    let allowed
    try {
        allowed = await hasPermission(itemId, req.user.id)
    } catch (e) {
        logger.error("permission_check_error", { itemId, userId: req.user.id })
        return handleError(e, res)
    }

    if (!allowed) {
        return res.status(403).send("Not allowed to access preview image.")
    }

    const previewPath = getPreviewPath(itemId)
    const scPreviewExists = await previewExists(previewPath)

    if (!scPreviewExists) {
        logger.warning("preview_not_ready", {
            itemId,
            previewPath,
            exists: scPreviewExists,
        })
        return res.status(404).send("Preview not ready, try again later.")
    }

    return res.sendFile(previewPath)
})

export default router
