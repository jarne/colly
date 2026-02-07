/**
 * Colly | item preview controller
 */

import { PutObjectCommand } from "@aws-sdk/client-s3"
import metascraper from "metascraper"
import mDescr from "metascraper-description"
import mImage from "metascraper-image"
import mLogo from "metascraper-logo"
import mFavicon from "metascraper-logo-favicon"
import mTitle from "metascraper-title"
import { v4 as uuid } from "uuid"
import Item from "../model/item.js"
import { parseImgAttribute } from "../util/image.js"
import logger from "../util/logger.js"
import { s3Client } from "../util/s3Storage.js"

type BasicMetadataType = {
    title: string | null
    description: string | null
}

type S3StorageReferencesType = {
    logo: string | undefined
    image: string | undefined
}

const TYPE_LOGO = "logo"
const TYPE_IMAGE = "image"

const STORAGE_FILE_EXT = "webp"
const STORAGE_MIME_TYPE = "image/webp"

const ms = metascraper([mTitle(), mDescr(), mLogo(), mFavicon(), mImage()])

/**
 * Fetch metadata from URL
 * @param {string} url URL to fetch metadata from
 * @returns {metascraper.Metadata} Metadata object
 */
const fetchMetadata = async (url: string): Promise<metascraper.Metadata> => {
    let pageContent
    try {
        const res = await fetch(url)
        pageContent = await res.text()
    } catch (e) {
        if (e instanceof Error) {
            logger.error("preview_url_fetch_error", {
                url,
                error: e.message,
            })
        }

        throw e
    }

    let meta
    try {
        meta = await ms({
            url,
            html: pageContent,
        })
    } catch (e) {
        if (e instanceof Error) {
            logger.error("preview_meta_extract_error", {
                url,
                error: e.message,
            })
        }

        throw e
    }

    return meta
}

/**
 * Persist meta data image of item, save to S3
 * @param {string} attr Image source attribute value
 * @param {string} type Image type identifier
 * @returns {Promise<string>} S3 storage reference
 */
const saveMetaImage = async (attr: string, type: string): Promise<string> => {
    let imgBuf
    try {
        imgBuf = await parseImgAttribute(attr, type)
    } catch (e) {
        if (e instanceof Error) {
            logger.error(`preview_${type}_parse_error`, {
                error: e.message,
            })
        }

        throw e
    }

    const imgUuid = uuid()

    const s3Key = getS3StorageKey(type, imgUuid)

    try {
        s3Client.send(
            new PutObjectCommand({
                Bucket: process.env.S3_BUCKET,
                Key: s3Key,
                Body: imgBuf,
                ContentType: STORAGE_MIME_TYPE,
            })
        )
    } catch (e) {
        if (e instanceof Error) {
            logger.error(`preview_${type}_s3_upload_error`, {
                error: e.message,
            })
        }

        throw e
    }

    return imgUuid
}

/**
 * Get S3 storage key for a specific image
 * @param {string} type Image asset type
 * @param {string} imgUuid UUID of the image
 * @returns {string} S3 storage key
 */
export const getS3StorageKey = (type: string, imgUuid: string): string => {
    return `item_meta/${type}/${imgUuid}.${STORAGE_FILE_EXT}`
}

/**
 * Get basic metadata, such as page title and description, used for creation suggestions
 * @param {string} url URL to fetch from
 * @returns {Promise<BasicMetadataType>} Basic metadata object
 */
export const getBasicMetadata = async (
    url: string
): Promise<BasicMetadataType> => {
    let meta
    try {
        meta = await fetchMetadata(url)
    } catch (e) {
        if (e instanceof Error) {
            logger.error("preview_fetch_error", {
                url,
                error: e.message,
            })
        }

        throw e
    }

    return {
        title: meta.title || null,
        description: meta.description || null,
    }
}

/**
 * Fetch and store image metadata on S3 storage (logo, article image) of an item
 * @param {string} itemId Item ID
 * @returns {Promise<S3StorageReferencesType>} S3 storage references
 */
export const saveImageMetadata = async (
    itemId: string
): Promise<S3StorageReferencesType> => {
    let item
    try {
        item = await Item.findById(itemId)
    } catch (e) {
        if (e instanceof Error) {
            logger.error("item_get_error", {
                id: itemId,
                error: e.message,
            })
        }

        throw e
    }
    if (item === null) {
        const msg = "item not found"

        logger.error("item_get_error", {
            id: itemId,
            error: msg,
        })
        throw new Error(msg)
    }

    let meta
    try {
        meta = await fetchMetadata(item.url)
    } catch (e) {
        if (e instanceof Error) {
            logger.error("preview_fetch_error", {
                url: item.url,
                error: e.message,
            })
        }

        throw e
    }

    const logo = meta.logo
    const image = meta.image

    let logoId
    if (logo) {
        try {
            logoId = await saveMetaImage(logo, TYPE_LOGO)
        } catch (e) {
            if (e instanceof Error) {
                logger.warn("preview_logo_fetch_error", {
                    error: e.message,
                })
            }
        }
    }

    let imageId
    if (image) {
        try {
            imageId = await saveMetaImage(image, TYPE_IMAGE)
        } catch (e) {
            if (e instanceof Error) {
                logger.warn("preview_image_fetch_error", {
                    error: e.message,
                })
            }
        }
    }

    try {
        await Item.findByIdAndUpdate(itemId, {
            logo: logoId,
            image: imageId,
        })

        logger.verbose("item_updated_meta_img", { id: itemId })
    } catch (e) {
        if (e instanceof Error) {
            logger.error("item_meta_img_update_error", {
                id: itemId,
                error: e.message,
            })
        }

        throw e
    }

    return {
        logo: logoId,
        image: imageId,
    }
}

/**
 * Try to call the function to fetch and store image metadata of an item
 * @param {string} itemId Item ID
 */
export const trySaveImageMetadata = async (itemId: string): Promise<void> => {
    try {
        await saveImageMetadata(itemId)
    } catch (e) {
        if (e instanceof Error) {
            logger.warn("item_image_meta_fetch_error", {
                id: itemId,
                error: e.message,
            })
        }
    }
}
