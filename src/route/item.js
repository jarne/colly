/**
 * Colly | item routes
 */

import express from "express"

import controller from "./../controller/item.js"
import tag from "./../controller/tag.js"
import { getBasicMetadata } from "./../controller/itemPreview.js"
import crudRoutes, { CHECK_WORKSPACE_PERMISSIONS } from "./common/crud.js"
import sanitizeSchemas from "./sanitize/item.js"
import { handleError } from "./../routes.js"
import { trySaveImageMetadata } from "./../controller/itemPreview.js"

const router = express.Router({
    mergeParams: true,
})

const { create, update, del, find } = crudRoutes(controller, {
    permissionChecks: CHECK_WORKSPACE_PERMISSIONS,
    sanitizeSchemas,
})

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

    for (const tagId of itemData.tags) {
        const tagPermCheck = await tag.hasPermission(tagId, userId, "read")

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
    const data = req.body

    const tagPermCheck = await checkTagPermissions(data, req.user.id)
    if (!tagPermCheck) {
        return res.status(403).json({
            error: {
                code: "insufficient_permission",
            },
        })
    }

    return await create(req, res)
})

/**
 * Update item
 */
router.patch("/:id", async (req, res) => {
    const tagPermCheck = await checkTagPermissions(req.body, req.user.id)

    if (!tagPermCheck) {
        return res.status(403).json({
            error: {
                code: "insufficient_permission",
            },
        })
    }

    return await update(req, res)
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

/**
 * Trigger meta data image update
 */
router.post("/:id/updateMetaImage", async (req, res) => {
    const id = req.params.id

    const permCheck = await controller.hasPermission(id, req.user.id, "write")

    if (!permCheck) {
        return res.status(403).json({
            error: {
                code: "insufficient_permission",
            },
        })
    }

    trySaveImageMetadata(id)

    return res.status(204).send()
})

export default router
