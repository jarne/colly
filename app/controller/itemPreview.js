/**
 * Colly | item preview controller
 */

import metascraper from "metascraper"
import mTitle from "metascraper-title"
import mDescr from "metascraper-description"
import mLogo from "metascraper-logo"
import mFavicon from "metascraper-logo-favicon"
import mImage from "metascraper-image"
import { PutObjectCommand } from "@aws-sdk/client-s3"

import Item from "./../model/item.js"
import { parseImgAttribute } from "./../util/image.js"
import { s3Client } from "./../util/s3Storage.js"
import logger from "./../util/logger.js"

const ms = metascraper([mTitle(), mDescr(), mLogo(), mFavicon(), mImage()])

/**
 * Fetch metadata from URL
 * @param {string} url URL to fetch metadata from
 * @returns Metadata object
 */
const fetchMetadata = async (url) => {
    let pageContent
    try {
        const res = await fetch(url)
        pageContent = await res.text()
    } catch (e) {
        logger.error("preview_url_fetch_error", {
            url,
            error: e.message,
        })

        throw e
    }

    let meta
    try {
        meta = await ms({
            url,
            html: pageContent,
        })
    } catch (e) {
        logger.error("preview_meta_extract_error", {
            url,
            error: e.message,
        })

        throw e
    }

    return meta
}

/**
 * Persist meta data image of item, save to S3
 * @param {string} attr Image source attribute value
 * @param {string} itemId Associated item ID
 * @param {string} type Image type identifier
 * @returns S3 storage reference
 */
const saveMetaImage = async (attr, itemId, type) => {
    let parsedImg
    try {
        parsedImg = await parseImgAttribute(attr)
    } catch (e) {
        logger.error(`preview_${type}_parse_error`, {
            attr,
            error: e.message,
        })

        throw e
    }

    const imgBuf = parsedImg.buffer
    const imgExt = parsedImg.fileExtension

    const s3Key = `meta/${type}/${itemId}.${imgExt}`

    try {
        s3Client.send(
            new PutObjectCommand({
                Bucket: process.env.S3_BUCKET,
                Key: s3Key,
                Body: imgBuf,
            })
        )
    } catch (e) {
        logger.error(`preview_${type}_s3_upload_error`, {
            error: e.message,
        })

        throw e
    }

    return s3Key
}

/**
 * Get basic metadata, such as page title and description, used for creation suggestions
 * @param {string} url URL to fetch from
 * @returns Basic metadata object
 */
export const getBasicMetadata = async (url) => {
    let meta
    try {
        meta = await fetchMetadata(url)
    } catch (e) {
        logger.error("preview_fetch_error", {
            url,
            error: e.message,
        })

        throw e
    }

    return {
        title: meta.title,
        description: meta.description,
    }
}

/**
 * Fetch and store image metadata on S3 storage (logo, article image) of an item
 * @param {string} itemId Item ID
 * @returns S3 storage references
 */
export const saveImageMetadata = async (itemId) => {
    let item
    try {
        item = await Item.findById(itemId)
    } catch (e) {
        logger.error("item_get_error", {
            id: itemId,
            error: e.message,
        })

        throw e
    }

    let meta
    try {
        meta = await fetchMetadata(item.url)
    } catch (e) {
        logger.error("preview_fetch_error", {
            url: item.url,
            error: e.message,
        })

        throw e
    }

    const logo = meta.logo
    const image = meta.image

    let logoKey
    if (logo) {
        try {
            logoKey = await saveMetaImage(logo, itemId, "logo")
        } catch (e) {
            logger.warn("preview_logo_fetch_error", {
                logo,
                error: e.message,
            })
        }
    }

    let imageKey
    if (image) {
        try {
            imageKey = await saveMetaImage(image, itemId, "image")
        } catch (e) {
            logger.warn("preview_image_fetch_error", {
                image,
                error: e.message,
            })
        }
    }

    return {
        logo: logoKey,
        image: imageKey,
    }
}
