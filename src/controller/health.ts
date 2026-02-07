/**
 * Colly | health check controller
 */

import mongoose from "mongoose"

type ServiceHealthType = {
    database: "ok" | "error"
}

/**
 * Check health of services
 * @returns {ServiceHealthType} service health
 */
const checkServiceStatus = (): ServiceHealthType => {
    const dbStatus = checkDatabaseStatus()

    return {
        database: dbStatus ? "ok" : "error",
    }
}

/**
 * Check database connection status
 * @returns {boolean} is database connection healthy
 */
const checkDatabaseStatus = (): boolean => {
    return mongoose.connection.readyState === 1
}

export default {
    checkServiceStatus,
}
