/**
 * Colly | health check routes
 */

import express from "express"

import controller from "./../controller/health.js"

const router = express.Router()

/**
 * Check service health
 */
router.get("/", async (req, res) => {
    const status = controller.checkServiceStatus()

    return res.json(status)
})

export default router
