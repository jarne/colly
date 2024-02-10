/**
 * Colly | image-related util functions
 */

import imageType from "image-type"

import UnknownImageFormatError from "./exception/unknownImageFormatError.js"
import logger from "./logger.js"

const HTTP_DETECTOR = "http"
const DATA_URL_DETECTOR = ";base64,"

/**
 * Download image from HTTP URL
 * @param {string} url Image URL
 * @returns File extension and image buffer
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

    let imgExt
    try {
        const imgType = await imageType(imgBuf)
        imgExt = imgType.ext
    } catch (e) {
        logger.error(`image_meta_type_determine_error`, {
            url,
            error: e.message,
        })

        throw e
    }

    return {
        buffer: imgBuf,
        fileExtension: imgExt,
    }
}

/**
 * Find file extension of image by MIME type
 * based on this list:
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#image_types
 * @param {string} mime MIME type
 * @returns File extension
 */
const fileExtByMimeType = (mime) => {
    switch (mime) {
        case "image/apng":
            return "apng"
        case "image/avif":
            return "avif"
        case "image/gif":
            return "gif"
        case "image/jpeg":
            return "jpeg"
        case "image/png":
            return "png"
        case "image/svg+xml":
            return "svg"
        case "image/webp":
            return "webp"
    }
}

/**
 * Extract image from data URL string
 * @param {string} data Image data URL
 * @returns File extension and image buffer
 */
const parseFromDataUrl = async (data) => {
    const dataParts = data.split(DATA_URL_DETECTOR)

    const mimeType = dataParts[0].replace("data:", "")
    const encodedImg = dataParts[1]

    return {
        buffer: Buffer.from(encodedImg, "base64"),
        fileExtension: fileExtByMimeType(mimeType),
    }
}

/**
 * Parse image source to fetch from URL or base64 data URL
 * @param {string} attr Image source attribute value
 * @returns File extension and image buffer
 */
export const parseImgAttribute = async (attr) => {
    if (attr.startsWith(HTTP_DETECTOR)) {
        return await parseFromHttpUrl(attr)
    } else if (attr.includes(DATA_URL_DETECTOR)) {
        return await parseFromDataUrl(attr)
    } else {
        throw new UnknownImageFormatError("neither URL nor base64 image")
    }
}
