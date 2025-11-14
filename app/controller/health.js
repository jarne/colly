/**
 * Colly | health check controller
 */

import mongoose from "mongoose"

/**
 * Check health of services
 * @returns {object} service health
 */
const checkServiceStatus = () => {
    const dbStatus = checkDatabaseStatus()

    return {
        database: dbStatus ? "ok" : "error",
    }
}

/**
 * Check database connection status
 * @returns {boolean} is database connection healthy
 */
const checkDatabaseStatus = () => {
    return mongoose.connection.readyState === 1
}

export default {
    checkServiceStatus,
}
