/**
 * Colly | user DB model
 */

import mongoose from "mongoose"
import bcrypt from "bcrypt"

const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, "can't be blank"],
        match: [/^[a-zA-Z0-9.\-_]*$/, "contains invalid characters"],
        index: true,
    },
    password: {
        type: String,
        required: [true, "can't be blank"],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
})

UserSchema.methods.setPassword = async function (password) {
    this.password = await bcrypt.hash(password, 10)
}

UserSchema.methods.checkPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

mongoose.model("User", UserSchema)
