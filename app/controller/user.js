/**
 * Colly | user controller
 */

import mongoose from "mongoose"
import jwt from "jsonwebtoken"

import crudController from "./common/crud.js"
import NotFoundError from "./exception/notFoundError.js"
import logger from "./../util/logger.js"

const User = mongoose.model("User")
const crud = crudController(User)

/**
 * Create user
 * @param {object} data User data
 * @returns {object} Created user
 */
const create = async (data) => {
    const password = data.password
    delete data.password

    const usr = new User(data)
    await usr.setPassword(password)

    try {
        const saved = await usr.save()
        logger.verbose("user_created", { id: saved.id })

        return saved
    } catch (e) {
        logger.error("user_create_error", {
            error: e.message,
        })

        throw e
    }
}

/**
 * Update user
 * @param {string} id User ID
 * @param {object} data User data
 * @returns {object} Updated user
 */
const update = async (id, data) => {
    let password = null
    if (Object.hasOwn(data, "password")) {
        password = data.password
        delete data.password
    }

    try {
        const updated = await User.findByIdAndUpdate(id, data, {
            returnDocument: "after",
        })

        if (updated === null) {
            throw new NotFoundError()
        }

        if (password !== null) {
            await updated.setPassword(password)
        }

        logger.verbose("user_updated", { id: updated.id })
        return updated
    } catch (e) {
        logger.error("user_update_error", {
            id,
            error: e.message,
        })

        throw e
    }
}

/**
 * Find users
 * @param {object} filter Filter
 * @param {Array} populate Fields to populate
 * @param {object} sort Sorting
 * @param {Array} select Fields to select
 * @param {boolean} lean Return lean object
 * @returns {object[]} Found users
 */
const find = async (filter, populate, sort, select, lean) => {
    try {
        return await crud.find(
            filter,
            populate,
            sort,
            [...select, "-password"],
            lean
        )
    } catch (e) {
        logger.error("user_list_error", {
            error: e.message,
        })

        throw e
    }
}

/**
 * Generate JWT token for user
 * @param {object} user User
 * @returns {string} JWT token
 */
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: `${process.env.EXPIRES_IN_SEC || 86400}s`,
        }
    )
}

export default {
    create,
    update,
    del: crud.del,
    getById: crud.getById,
    find,
    generateToken,
}
