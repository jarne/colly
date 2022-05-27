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

app = registerRoutes(app)

/* Export app */

export default app
