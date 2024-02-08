/**
 * Colly | item routes
 */

import express from "express"

import controller from "./../controller/item.js"
import {
    triggerPreviewGeneration,
    previewExists,
    getPreviewPath,
} from "./../controller/itemPreview.js"
import crudRoutes from "./../route/common/crud.js"
import { handleError } from "./../routes.js"
import logger from "./../util/logger.js"

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

/**
 * Trigger preview image generation of an item
 */
router.get("/:itemId/requestPreview", async (req, res) => {
    const itemId = req.params.itemId

    let allowed
    try {
        allowed = await controller.hasPermission(itemId, req.user.id)
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
        allowed = await controller.hasPermission(itemId, req.user.id)
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
        logger.warn("preview_not_ready", {
            itemId,
            previewPath,
            exists: scPreviewExists,
        })
        return res.status(404).send("Preview not ready, try again later.")
    }

    return res.sendFile(previewPath)
})

export default router
