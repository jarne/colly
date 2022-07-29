/**
 * Colly | main app file
 */

import express from "express"
import cors from "cors"
import morgan from "morgan"

import { connectDb } from "./app/init.js"
import { registerRoutes } from "./app/routes.js"

/* Express initialization */

let app = express()

app.use(express.json())

/* Database connection */

connectDb()

/* Routes */

if (app.get("env") === "development") {
    app.use(cors())
    app.use(morgan("combined"))

    console.log(
        "🚧 Running in development mode, allowing all CORS headers and logging requests!"
    )
}

app = registerRoutes(app)

/* Export app */

export default app
