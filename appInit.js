/**
 * Colly | main app file
 */

import express from "express"
import cors from "cors"
import morgan from "morgan"
import "dotenv/config"

import { connectDb } from "./app/init.js"
import { registerRoutes } from "./app/routes.js"
import logger from "./app/util/logger.js"

/* Express initialization */

let app = express()

app.use(express.json())

/* Database connection */

connectDb()

/* Routes */

if (app.get("env") === "development") {
    app.use(cors())
    app.use(
        morgan("combined", {
            stream: {
                write: (str) => logger.http(str),
            },
        })
    )

    logger.info(
        "🚧 Running in development mode, allowing all CORS headers and logging requests"
    )
}

app = registerRoutes(app)

/* Export app */

export default app
