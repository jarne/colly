/**
 * Colly | client app routes
 */

import type { Request, Response } from "express"
import express, { Router } from "express"
import path from "path"
import { fileURLToPath } from "url"

const router: Router = express.Router()

/* Default route for static client */

const __dirname = path.dirname(fileURLToPath(import.meta.url))

router.use(express.static(path.join(__dirname, "../../client/dist")))

/**
 * Serve static client
 */
router.get("/*splat", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../../client/dist/index.html"))
})

export default router
