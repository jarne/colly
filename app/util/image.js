/**
 * Colly | image-related util functions
 */

import sharp from "sharp"

import UnknownImageFormatError from "./exception/unknownImageFormatError.js"
import InvalidImageTypeError from "./exception/invalidImageTypeError.js"
import logger from "./logger.js"

const TYPE_LOGO = "logo"
const TYPE_IMAGE = "image"

const HTTP_DETECTOR = "http"
const DATA_URL_DETECTOR = ";base64,"

/**
 * Download image from HTTP URL
 * @param {string} url Image URL
 * @returns Original image buffer
 */
const parseFromHttpUrl = async (url) => {
    let imgBuf
    try {
        const res = await fetch(url)
        imgBuf = await res.arrayBuffer()
    } catch (e) {
        logger.error(`http_image_meta_fetch_error`, {
            url,
            error: e.message,
        })

        throw e
    }

    return imgBuf
}

/**
 * Extract image from data URL string
 * @param {string} data Image data URL
 * @returns Original image buffer
 */
const parseFromDataUrl = async (data) => {
    const encodedImg = data.split(DATA_URL_DETECTOR).pop()

    return Buffer.from(encodedImg, "base64")
}

/**
 * Read image source from URL or base64 data URL to target format
 * @param {string} attr Image source attribute value
 * @param {string} type Image type identifier
 * @returns Processed image buffer
 */
export const parseImgAttribute = async (attr, type) => {
    let origBuffer
    if (attr.startsWith(HTTP_DETECTOR)) {
        origBuffer = await parseFromHttpUrl(attr)
    } else if (attr.includes(DATA_URL_DETECTOR)) {
        origBuffer = await parseFromDataUrl(attr)
    } else {
        throw new UnknownImageFormatError("neither URL nor base64 image")
    }

    let dimensions = {
        width: null,
        height: null,
    }
    if (type === TYPE_LOGO) {
        dimensions.width = 128
        dimensions.height = 128
    } else if (type === TYPE_IMAGE) {
        dimensions.width = 512
        dimensions.height = 256
    } else {
        throw new InvalidImageTypeError()
    }

    let buf
    try {
        buf = await sharp(origBuffer).resize(dimensions).webp().toBuffer()
        logger.verbose(`meta_${type}_processed`)
    } catch (e) {
        logger.error(`meta_${type}_processing_error`, {
            error: e.message,
        })

        throw e
    }

    return buf
}
