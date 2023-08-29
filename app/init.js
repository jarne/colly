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
    // eslint-disable-next-line no-extra-semi
    ;(async () => {
        await connect()
    })()
}

/**
 * Establish connection to database (async)
 */
export const connectDbAsync = async () => {
    await connect()
}
