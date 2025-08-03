/**
 * Colly | routes registration
 */

import passport from "passport"

import authRoutes from "./route/auth.js"
import userRoutes from "./route/user.js"
import workspaceRoutes from "./route/workspace.js"
import tagRoutes from "./route/tag.js"
import itemRoutes from "./route/item.js"
import clientRoutes from "./route/client.js"

/**
 * Register API routes
 * @param {object} app Express app object
 * @returns {object} Express app object
 */
export const registerRoutes = (app) => {
    app.use("/api/auth", authRoutes)
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
    app.use(
        "/api/tag",
        passport.authenticate("jwt", { session: false }),
        tagRoutes
    )
    app.use(
        "/api/item",
        passport.authenticate("jwt", { session: false }),
        itemRoutes
    )

    app.use("/", clientRoutes)

    return app
}

/**
 * Handle an API request error
 * @param {Error} e Error object
 * @param {object} res Request result
 * @returns {object} Result object
 */
export const handleError = (e, res) => {
    if (e.name === "ValidationError") {
        let subErrors = []
        for (const errField in e.errors) {
            const subErr = e.errors[errField]

            subErrors.push({
                name: errField,
                message: subErr.message,
            })
        }

        return res.status(400).json({
            error: {
                code: "validation_error",
                fields: subErrors,
            },
        })
    }

    if (e.name === "MongoServerError" && e.code === 11000) {
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
