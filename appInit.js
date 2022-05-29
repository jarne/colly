/**
 * Colly | main app file
 */

import express from "express"

import { connectDb } from "./app/init.js"
import { registerRoutes } from "./app/routes.js"

/* Express initialization */

let app = express()

app.use(express.json())

/* Database connection */

connectDb()

/* Routes */

if (app.get("env") === "development") {
    app.use("/api", (_req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001")
        res.setHeader("Access-Control-Allow-Headers", [
            "Content-Type",
            "Authorization",
        ])
        res.setHeader("Access-Control-Allow-Methods", "*")
        res.setHeader("Access-Control-Allow-Credentials", "true")

        next()
    })

    console.log(
        "🚧 Access control headers are being added because dev mode is enabled!"
    )
}

app = registerRoutes(app)

/* Export app */

export default app
