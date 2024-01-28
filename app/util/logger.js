/**
 * Colly | shared app logger
 */

import { createLogger, transports, format } from "winston"
import LokiTransport from "winston-loki"

const APP_NAME = "colly"

const winstonTransports = [new transports.Console()]

if (
    process.env.LOKI_HOST !== undefined &&
    process.env.LOKI_BASIC_AUTH !== undefined
) {
    winstonTransports.push(
        new LokiTransport({
            host: process.env.LOKI_HOST,
            basicAuth: process.env.LOKI_BASIC_AUTH,
            labels: {
                app: APP_NAME,
                env: process.env.NODE_ENV,
            },
            format: format.combine(format.timestamp(), format.json()),
        })
    )
}

const logger = createLogger({
    level: process.env.LOG_LEVEL || "info",
    defaultMeta: {
        version: process.env.npm_package_version,
    },
    transports: winstonTransports,
})

export default logger
