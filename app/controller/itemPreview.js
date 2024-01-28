/**
 * Colly | item preview controller
 */

import mongoose from "mongoose"
import captureWebsite from "capture-website"
import { resolve as resolvePath } from "path"
import { access as fsAccess } from "fs/promises"
import { constants as fsConstants } from "fs"
import logger from "./../util/logger.js"

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
        logger.error("item_get_error", {
            id: itemId,
            error: e.message,
        })

        return
    }

    const url = item.url
    const previewPath = getPreviewPath(item.id)

    const captureOpts = {
        width: Number.parseInt(process.env.PREVIEW_WIDTH) || 640,
        height: Number.parseInt(process.env.PREVIEW_HEIGHT) || 400,
        timeout: Number.parseInt(process.env.PREVIEW_TIMEOUT) || 3,
    }

    try {
        await captureWebsite.file(url, previewPath, captureOpts)

        logger.info("preview_generated", {
            id: item.id,
            url,
        })
    } catch (e) {
        logger.error("preview_generation_error", {
            id: item.id,
            url,
            error: e.message,
        })
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
        logger.warning("no_preview_found", {
            previewPath,
            error: e.message,
        })

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
