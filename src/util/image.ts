/**
 * Colly | image-related util functions
 */

import sharp from "sharp"
import InvalidImageTypeError from "./exception/invalidImageTypeError.js"
import UnknownImageFormatError from "./exception/unknownImageFormatError.js"
import logger from "./logger.js"

type ImageDimensions = {
    width?: number
    height?: number
}

const TYPE_LOGO = "logo"
const TYPE_IMAGE = "image"

const HTTP_DETECTOR = "http"
const DATA_URL_DETECTOR = ";base64,"

/**
 * Download image from HTTP URL
 * @param {string} url Image URL
 * @returns {Promise<ArrayBuffer>} Original image buffer
 */
const parseFromHttpUrl = async (url: string): Promise<ArrayBuffer> => {
    let imgBuf
    try {
        const res = await fetch(url)
        imgBuf = await res.arrayBuffer()
    } catch (e) {
        if (e instanceof Error) {
            logger.error(`http_image_meta_fetch_error`, {
                url,
                error: e.message,
            })
        }

        throw e
    }

    return imgBuf
}

/**
 * Extract image from data URL string
 * @param {string} data Image data URL
 * @returns {Buffer} Original image buffer
 */
const parseFromDataUrl = (data: string): Buffer => {
    const encodedImg = data.split(DATA_URL_DETECTOR).pop()

    if (encodedImg === undefined) {
        throw new InvalidImageTypeError("invalid base64 image format")
    }

    return Buffer.from(encodedImg, "base64")
}

/**
 * Read image source from URL or base64 data URL to target format
 * @param {string} attr Image source attribute value
 * @param {string} type Image type identifier
 * @returns {Promise<Buffer>} Processed image buffer
 */
export const parseImgAttribute = async (
    attr: string,
    type: string
): Promise<Buffer> => {
    let origBuffer
    if (attr.startsWith(HTTP_DETECTOR)) {
        origBuffer = await parseFromHttpUrl(attr)
    } else if (attr.includes(DATA_URL_DETECTOR)) {
        origBuffer = parseFromDataUrl(attr)
    } else {
        throw new UnknownImageFormatError("neither URL nor base64 image")
    }

    const dimensions: ImageDimensions = {}
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
        if (e instanceof Error) {
            logger.error(`meta_${type}_processing_error`, {
                error: e.message,
            })
        }

        throw e
    }

    return buf
}
