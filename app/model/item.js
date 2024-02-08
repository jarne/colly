/**
 * Colly | collection item DB model
 */

import mongoose from "mongoose"
import validator from "validator"
import { triggerPreviewGeneration } from "./../controller/itemPreview.js"

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
    await triggerPreviewGeneration(item.id)
})

export default mongoose.model("Item", ItemSchema)
