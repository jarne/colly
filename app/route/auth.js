/**
 * Colly | auth routes
 */

import express from "express"
import passport from "passport"

import userController from "./../controller/user.js"
import logger from "./../util/logger.js"

const router = express.Router()

/**
 * Login as a user
 */
router.post("/login", (req, res) => {
    passport.authenticate("local", { session: false }, (err, user) => {
        if (err) {
            logger.error("auth_internal_error", { error: err.message })
            return res.status(400).json({
                error: true,
                error_code: "internal_error",
            })
        }

        if (!user) {
            logger.warn("auth_user_not_found")
            return res.status(401).json({
                error: true,
                error_code: "invalid_credentials",
            })
        }

        req.login(user, { session: false }, async (err) => {
            if (err) {
                logger.error("auth_internal_login_error", {
                    error: err.message,
                })
                return res.status(500).json({
                    error: true,
                    error_code: "internal_error",
                })
            }

            const token = userController.generateToken(user)

            logger.verbose("auth_successful", { uid: user.id })
            return res.json({
                user: {
                    username: user.username,
                },
                token,
            })
        })
    })(req, res)
})

/**
 * Get information about the current user
 */
router.get(
    "/me",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        return res.json({
            user: {
                username: req.user.username,
            },
        })
    }
)

export default router
