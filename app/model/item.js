/**
 * Colly | collection item DB model
 */

import mongoose from "mongoose"
import validator from "validator"

import { trySaveImageMetadata } from "./../controller/itemPreview.js"
import logger from "./../util/logger.js"

const Schema = mongoose.Schema

const ItemSchema = new Schema({
    url: {
        type: String,
        lowercase: true,
        required: [true, "is required"],
        validate: {
            validator: validator.isURL,
            message: "invalid url",
        },
        index: true,
    },
    name: {
        type: String,
        required: [true, "is required"],
    },
    description: {
        type: String,
        required: [true, "is required"],
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
    logo: Schema.Types.UUID,
    image: Schema.Types.UUID,
})

/**
 * Generate preview after saving item
 */
ItemSchema.post("save", async (item) => {
    trySaveImageMetadata(item.id)
})

export default mongoose.model("Item", ItemSchema)
