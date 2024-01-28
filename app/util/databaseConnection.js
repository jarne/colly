/**
 * Colly | database connection
 */

import mongoose from "mongoose"

import "./../model/user.js"
import "./../model/tag.js"
import "./../model/item.js"

export const connect = async () => {
    try {
        await mongoose.connect(
            `mongodb://${process.env.MONGO_HOST}:${
                process.env.MONGO_PORT || 27017
            }/${process.env.MONGO_DB}`
        )

        console.log("🗂  Database connected.")
    } catch (e) {
        console.log(`‼️  Database connection failed: ${e.message}!`)
    }
}
