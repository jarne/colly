/**
 * Colly | item routes
 */

import express from "express"

import controller from "./../controller/item.js"
import tag from "./../controller/tag.js"
import { getBasicMetadata } from "./../controller/itemPreview.js"
import crudRoutes from "./common/crud.js"
import { handleError } from "./../routes.js"

const router = express.Router()

const { del, find } = crudRoutes(controller, true)

/**
 * Check if the user has permission for all used tags of an item
 * @param {object} itemData item object
 * @param {string} userId user ID
 * @returns {boolean} permission for all tags used
 */
const checkTagPermissions = async (itemData, userId) => {
    if (itemData.tags === undefined) {
        return true
    }

    for (const tagId in itemData.tags) {
        const tagPermCheck = await tag.hasPermission(tagId, userId)

        if (!tagPermCheck) {
            return false
        }
    }

    return true
}

/**
 * Create new item
 */
router.post("/", async (req, res) => {
    const data = {
        ...req.body,
        owner: req.user.id,
    }

    const tagPermCheck = await checkTagPermissions(data, req.user.id)
    if (!tagPermCheck) {
        return res.status(403).json({
            error: {
                code: "insufficient_permission",
            },
        })
    }

    let obj
    try {
        obj = await controller.create(data)
    } catch (e) {
        return handleError(e, res)
    }

    return res.json({
        id: obj.id,
    })
})

/**
 * Update item
 */
router.patch("/:id", async (req, res) => {
    const id = req.params.id

    const permCheck = await controller.hasPermission(id, req.user.id)
    const tagPermCheck = await checkTagPermissions(req.body, req.user.id)

    if (!permCheck || !tagPermCheck) {
        return res.status(403).json({
            error: {
                code: "insufficient_permission",
            },
        })
    }

    let obj
    try {
        obj = await controller.update(id, req.body)
    } catch (e) {
        return handleError(e, res)
    }

    return res.json({
        id: obj.id,
    })
})

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
