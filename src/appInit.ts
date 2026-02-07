/**
 * Colly | main app file
 */

import cookieParser from "cookie-parser"
import cors from "cors"
import "dotenv/config"
import type { Express } from "express"
import express from "express"
import morgan from "morgan"
import { connectDb } from "./init.js"
import { runMigrations } from "./migration/migrations.js"
import { registerRoutes } from "./routes.js"
import logger from "./util/logger.js"

/* Express initialization */

let app: Express = express()

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
