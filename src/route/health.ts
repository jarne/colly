/**
 * Colly | health check routes
 */

import type { Request, Response } from "express"
import express, { Router } from "express"
import controller from "../controller/health.js"

const router: Router = express.Router()

/**
 * Check service health
 */
router.get("/", async (req: Request, res: Response) => {
    const status = controller.checkServiceStatus()

    return res.json(status)
})

export default router
