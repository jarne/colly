/**
 * Colly | database connection
 */

import mongoose from "mongoose"

import logger from "./logger.js"

import "./../model/user.js"
import "./../model/workspace.js"
import "./../model/tag.js"
import "./../model/item.js"

export const connect = async () => {
    try {
        await mongoose.connect(
            `mongodb://${process.env.MONGO_HOST}:${
                process.env.MONGO_PORT || 27017
            }/${process.env.MONGO_DB}`
        )

        logger.info("db_connected")
    } catch (e) {
        logger.error("db_connection_failed", e.message)
    }
}
