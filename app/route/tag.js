/**
 * Colly | tag routes
 */

import express from "express"

import { createTag, deleteTag, listTags } from "./../controller/tag.js"
import { handleError } from "./../routes.js"

const router = express.Router()

/**
 * Create new tag
 */
router.post("/", async (req, res) => {
    let tag
    try {
        tag = await createTag(
            req.body.name,
            req.body.firstColor,
            req.body.secondColor,
            req.user.id
        )
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
router.delete("/:tagId", async (req, res) => {
    const tagId = req.params.tagId

    try {
        await deleteTag(tagId)
    } catch (e) {
        return handleError(e, res)
    }

    return res.json({
        tagId: tagId,
    })
})

/**
 * Get all tags
 */
router.get("/", async (req, res) => {
    let tags
    try {
        tags = await listTags()
    } catch (e) {
        return handleError(e, res)
    }

    return res.json({
        tags: tags,
    })
})

export default router
