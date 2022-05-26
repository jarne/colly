/**
 * Colly | general init functions
 */

import { connect } from "./utils/databaseConnection.js"

import "dotenv/config"
import "./utils/passportStrategies.js"

/**
 * Establish connection to database
 */
export const connectDb = () => {
    (async () => {
        await connect()
    })()
}

/**
 * Establish connection to database (async)
 */
export const connectDbAsync = async () => {
    await connect()
}
