/**
 * Colly | user controller
 */

import mongoose from "mongoose"

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

        return savedUser
    } catch (e) {
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
    } catch (e) {
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
        throw e
    }
}
