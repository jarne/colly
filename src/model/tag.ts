/**
 * Colly | tag DB model
 */

import mongoose, { type InferSchemaType } from "mongoose"
import validator from "validator"

const Schema = mongoose.Schema

const TagSchema = new Schema({
    name: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, "is required"],
        match: [
            /^[a-zA-Z0-9.\-_]*$/,
            "invalid, may only contain letters, numbers and hyphens",
        ],
        index: true,
    },
    firstColor: {
        type: String,
        required: [true, "is required"],
        validate: {
            validator: validator.isHexColor,
            message: "invalid hex color",
        },
    },
    secondColor: {
        type: String,
        required: [true, "is required"],
        validate: {
            validator: validator.isHexColor,
            message: "invalid hex color",
        },
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
    lastUsed: {
        type: Date,
    },
})

export type TagType = InferSchemaType<typeof TagSchema>
export type TagDocType = mongoose.HydratedDocument<TagType>

export default mongoose.model("Tag", TagSchema)
