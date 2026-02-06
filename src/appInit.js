/**
 * Colly | main app file
 */

import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import morgan from "morgan"
import "dotenv/config"

import { connectDb } from "./init.js"
import { runMigrations } from "./migration/migrations.js"
import { registerRoutes } from "./routes.js"
import logger from "./util/logger.js"

/* Express initialization */

let app = express()

app.set("query parser", "extended")

app.use(express.json())
app.use(cookieParser())

/* Database connection and migrations */

connectDb()
runMigrations()

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
