/**
 * Colly | auth routes
 */

import express from "express"
import passport from "passport"
import mongoose from "mongoose"

import userController from "./../controller/user.js"
import { handleError } from "./../routes.js"
import logger from "./../util/logger.js"

const router = express.Router()
const User = mongoose.model("User")

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
                    isAdmin: user.isAdmin,
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

/**
 * Change password of the current user
 */
router.patch(
    "/me/passwordChange",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        let user
        try {
            user = await User.findById(req.user.id)
        } catch {
            return res.status(403).json({
                error: {
                    code: "invalid_token",
                },
            })
        }

        if (!user) {
            return res.status(403).json({
                error: {
                    code: "invalid_token",
                },
            })
        }

        const existingPassword = req.body.existingPassword
        const newPassword = req.body.newPassword

        if (existingPassword === undefined || newPassword === undefined) {
            return res.status(400).json({
                error: {
                    code: "missing_required_arguments",
                },
            })
        }

        const passwordCheck = await user.checkPassword(existingPassword)

        if (!passwordCheck) {
            return res.status(400).json({
                error: {
                    code: "existing_password_incorrect",
                },
            })
        }

        try {
            await user.setPassword(newPassword)
            await user.save()
        } catch (e) {
            return handleError(e, res)
        }

        return res.status(204).send()
    }
)

export default router
