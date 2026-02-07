/**
 * Colly | auth routes
 */

import type { Request, Response } from "express"
import express, { Router } from "express"
import mongoose from "mongoose"
import passport from "passport"
import userController from "../controller/user.js"
import { handleError } from "../routes.js"
import logger from "../util/logger.js"

const router: Router = express.Router()
const User = mongoose.model("User")

/**
 * Login as a user
 */
router.post("/login", (req: Request, res: Response) => {
    passport.authenticate(
        "local",
        { session: false },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err: any, user: Express.User) => {
            if (err) {
                logger.error("auth_internal_error", { error: err.message })
                return res.status(400).json({
                    error: {
                        code: "internal_error",
                    },
                })
            }

            if (!user) {
                logger.warn("auth_user_not_found")
                return res.status(401).json({
                    error: {
                        code: "invalid_credentials",
                    },
                })
            }

            req.login(user, { session: false }, async (err) => {
                if (err) {
                    logger.error("auth_internal_login_error", {
                        error: err.message,
                    })
                    return res.status(500).json({
                        error: {
                            code: "internal_error",
                        },
                    })
                }

                const token = userController.generateToken(user)

                logger.verbose("auth_successful", { uid: user.id })
                res.cookie("token", token, {
                    maxAge:
                        (Number(process.env.EXPIRES_IN_SEC!) || 86400) * 1000,
                    httpOnly: true,
                    secure: process.env.USE_HTTPS
                        ? process.env.USE_HTTPS !== "false"
                        : true,
                    sameSite: "strict",
                })
                return res.json({
                    user: {
                        id: user.id,
                        username: user.username,
                        isAdmin: user.isAdmin,
                    },
                    token,
                })
            })
        }
    )(req, res)
})

/**
 * Log-out the current user by destroying its token cookie
 */
router.post(
    "/logout",
    passport.authenticate("jwt", { session: false }),
    (_, res: Response) => {
        res.clearCookie("token")

        return res.status(204).send()
    }
)

/**
 * Get information about the current user
 */
router.get(
    "/me",
    passport.authenticate("jwt", { session: false }),
    (req: Request, res: Response) => {
        return res.json({
            user: {
                id: req.user!.id,
                username: req.user!.username,
                isAdmin: req.user!.isAdmin,
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
    async (req: Request, res: Response) => {
        let user
        try {
            user = await User.findById(req.user!.id)
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
