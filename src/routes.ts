/**
 * Colly | routes registration
 */

import type { Express, Response } from "express"
import passport from "passport"
import authRoutes from "./route/auth.js"
import clientRoutes from "./route/client.js"
import healthRoutes from "./route/health.js"
import userRoutes from "./route/user.js"
import workspaceRoutes from "./route/workspace.js"
import mongoose from "mongoose"

/**
 * Register API routes
 * @param {Express} app Express app object
 * @returns {Express} Express app object
 */
export const registerRoutes = (app: Express): Express => {
    app.use("/api/auth", authRoutes)
    app.use("/api/health", healthRoutes)
    app.use(
        "/api/user",
        passport.authenticate("jwt_admin", { session: false }),
        userRoutes
    )
    app.use(
        "/api/workspace",
        passport.authenticate("jwt", { session: false }),
        workspaceRoutes
    )

    app.use("/", clientRoutes)

    return app
}

/**
 * Handle an API request error
 * @param {unknown} e Error object
 * @param {Response} res Request result
 * @returns {Response} Result object
 */
export const handleError = (e: unknown, res: Response): Response => {
    if (!(e instanceof Error)) {
        return res.status(500).json({
            error: {
                code: "internal_error",
            },
        })
    }

    if (e instanceof mongoose.Error.ValidationError) {
        const subErrors = []
        for (const errField in e.errors) {
            const subErr = e.errors[errField]

            if (subErr !== undefined) {
                subErrors.push({
                    name: errField,
                    message: subErr.message,
                })
            }
        }

        return res.status(400).json({
            error: {
                code: "validation_error",
                fields: subErrors,
            },
        })
    }

    if (e instanceof mongoose.mongo.MongoServerError && e.code === 11000) {
        return res.status(400).json({
            error: {
                code: "duplicate_entry",
            },
        })
    }

    return res.status(500).json({
        error: {
            code: "internal_error",
        },
    })
}
