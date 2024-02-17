/**
 * Colly | tag DB model
 */

import mongoose from "mongoose"
import validator from "validator"

const Schema = mongoose.Schema

const TagSchema = new Schema({
    name: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, "tag name may not be empty"],
        match: [
            /^[a-zA-Z0-9.\-_]*$/,
            "invalid tag name, may only contain letters, numbers and hyphens",
        ],
        index: true,
    },
    firstColor: {
        type: String,
        required: true,
        validate: {
            validator: validator.isHexColor,
            message: "invalid hex color",
        },
    },
    secondColor: {
        type: String,
        required: true,
        validate: {
            validator: validator.isHexColor,
            message: "invalid hex color",
        },
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
})

mongoose.model("Tag", TagSchema)
