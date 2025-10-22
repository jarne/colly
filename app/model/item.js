/**
 * Colly | collection item DB model
 */

import mongoose from "mongoose"
import validator from "validator"

import { trySaveImageMetadata } from "./../controller/itemPreview.js"

const Schema = mongoose.Schema

const ItemSchema = new Schema(
    {
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
        isPinned: {
            type: Boolean,
            default: false,
        },
        workspace: {
            type: Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        logo: Schema.Types.UUID,
        image: Schema.Types.UUID,
    },
    {
        timestamps: true,
    }
)

ItemSchema.index({
    url: "text",
    name: "text",
    description: "text",
})

ItemSchema.pre("save", function () {
    this.$locals.wasNew = this.isNew
})

/**
 * Generate preview after saving item
 */
ItemSchema.post("save", function (item) {
    if (this.$locals.wasNew) {
        trySaveImageMetadata(item.id)
    }
})

export default mongoose.model("Item", ItemSchema)
