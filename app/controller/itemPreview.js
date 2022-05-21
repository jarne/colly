/**
 * Colly | item preview controller
 */

import mongoose from "mongoose"
import captureWebsite from "capture-website"
import { resolve as resolvePath } from "path"
import { access as fsAccess } from "fs/promises"
import { constants as fsConstants } from "fs"

const Item = mongoose.model("Item")

/**
 * Generate a preview screenshot for an item in background
 *
 * @param {string} itemId Item ID
 */
export const triggerPreviewGeneration = async (itemId) => {
    let item
    try {
        item = await Item.findById(itemId)
    } catch (e) {
        return
    }

    const url = item.url
    const previewPath = getPreviewPath(item._id)

    const captureOpts = {
        width: Number.parseInt(process.env.PREVIEW_WIDTH) || 640,
        height: Number.parseInt(process.env.PREVIEW_HEIGHT) || 400,
        timeout: Number.parseInt(process.env.PREVIEW_TIMEOUT) || 3,
    }

    try {
        await captureWebsite.file(url, previewPath, captureOpts)
    } catch (e) {
        return
    }
}

/**
 * Check if a preview screenshot exists for an item
 *
 * @param {string} previewPath Preview screenshot path
 *
 * @returns Preview screenshot exists (bool)
 */
export const previewExists = async (previewPath) => {
    try {
        await fsAccess(previewPath, fsConstants.R_OK)

        return true
    } catch (e) {
        return false
    }
}

/**
 * Get the path of the preview screenshot for an item
 *
 * @param {string} itemId Item ID
 *
 * @returns Preview screenshot path
 */
export const getPreviewPath = (itemId) => {
    const previewFile = `${
        process.env.PREVIEW_SCREENSHOTS_PATH || "content/previews"
    }/${itemId}.png`
    const previewPath = resolvePath(previewFile)

    return previewPath
}
