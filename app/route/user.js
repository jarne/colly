/**
 * Colly | user routes
 */

import express from "express"

import {
    createUser,
    updateUser,
    deleteUser,
    listUsers,
} from "./../controller/user.js"
import { handleError } from "./../routes.js"

const router = express.Router()

/**
 * Create new user
 */
router.post("/", async (req, res) => {
    let user
    try {
        user = await createUser(req.body.username, req.body.password)
    } catch (e) {
        return handleError(e, res)
    }

    return res.json({
        userId: user.id,
    })
})

/**
 * Update user
 */
router.patch("/:userId", async (req, res) => {
    const userId = req.params.userId

    let user
    try {
        user = await updateUser(userId, req.body.username, req.body.isAdmin)
    } catch (e) {
        return handleError(e, res)
    }

    return res.json({
        userId: user.id,
    })
})

/**
 * Delete a user
 */
router.delete("/:userId", async (req, res) => {
    const userId = req.params.userId

    try {
        await deleteUser(userId)
    } catch (e) {
        return handleError(e, res)
    }

    return res.json({
        userId: userId,
    })
})

/**
 * Get all users
 */
router.get("/", async (req, res) => {
    let users
    try {
        users = await listUsers()
    } catch (e) {
        return handleError(e, res)
    }

    return res.json({
        users: users,
    })
})

export default router
