/**
 * Colly | collection item DB model
 */

import mongoose from "mongoose"
import validator from "validator"

import { saveImageMetadata } from "./../controller/itemPreview.js"
import logger from "./../util/logger.js"

const Schema = mongoose.Schema

const ItemSchema = new Schema({
    url: {
        type: String,
        lowercase: true,
        required: true,
        validate: {
            validator: validator.isURL,
            message: "invalid url",
        },
        index: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    tags: [
        {
            type: Schema.Types.ObjectId,
            ref: "Tag",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
})

/**
 * Generate preview after saving item
 */
ItemSchema.post("save", async (item) => {
    try {
        await saveImageMetadata(item.id)
    } catch (e) {
        logger.warn("item_image_meta_fetch_error", {
            id: item.id,
            error: e.message,
        })
    }
})

export default mongoose.model("Item", ItemSchema)
