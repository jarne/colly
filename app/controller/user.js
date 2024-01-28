/**
 * Colly | user controller
 */

import mongoose from "mongoose"

import NotFoundError from "./exception/notFoundError.js"

const User = mongoose.model("User")

/**
 * Create a new user
 *
 * @param {string} username New username
 * @param {string} password New user's password
 * @param {boolean} isAdmin User should be admin user (default false)
 *
 * @returns User object
 */
export const createUser = async (username, password, isAdmin = false) => {
    const user = new User()
    user.username = username
    user.isAdmin = isAdmin
    await user.setPassword(password)

    try {
        const savedUser = await user.save()
        logger.info("user_created", { id: savedUser.id })

        return savedUser
    } catch (e) {
        logger.error("user_create_error", {
            error: e.message,
        })

        throw e
    }
}

/**
 * Update a user
 *
 * @param {string} id User ID
 * @param {string} username Username
 * @param {boolean} isAdmin User should be admin user (default false)
 *
 * @returns User object
 */
export const updateUser = async (id, username, isAdmin = false) => {
    let user
    try {
        user = await User.findById(id)
    } catch (e) {
        throw e
    }

    if (user === null) {
        throw new NotFoundError()
    }

    user.username = username
    user.isAdmin = isAdmin

    try {
        const savedUser = await user.save()
        logger.info("user_updated", { id: savedUser.id })

        return savedUser
    } catch (e) {
        logger.error("user_update_error", {
            id,
            error: e.message,
        })

        throw e
    }
}

/**
 * Delete user by ID
 *
 * @param {string} id User ID
 */
export const deleteUser = async (id) => {
    try {
        await User.findByIdAndDelete(id)
        logger.info("user_deleted", { id })
    } catch (e) {
        logger.error("user_delete_error", {
            id,
            error: e.message,
        })

        throw e
    }
}

/**
 * Get user by ID
 *
 * @param {string} id User ID
 *
 * @returns User object
 */
export const getUser = async (id) => {
    try {
        return await User.findById(id)
    } catch (e) {
        logger.error("user_get_error", {
            id,
            error: e.message,
        })

        throw e
    }
}

/**
 * Get all users
 *
 * @returns List of all users
 */
export const listUsers = async () => {
    try {
        return await User.find().select("username isAdmin")
    } catch (e) {
        logger.error("user_list_error", {
            error: e.message,
        })

        throw e
    }
}
