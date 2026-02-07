/**
 * Colly | user controller
 */

import jwt from "jsonwebtoken"
import mongoose, { type SortOrder, type UpdateQuery } from "mongoose"
import type { UserDocType, UserType } from "../model/user.js"
import logger from "./../util/logger.js"
import crudController from "./common/crud.js"
import NotFoundError from "./exception/notFoundError.js"

const User = mongoose.model("User")
const crud = crudController<UserType, UserDocType>(User)

/**
 * Create user
 * @param {UserType} data User data
 * @returns {Promise<UserDocType>} Created user
 */
const create = async (data: UserType): Promise<UserDocType> => {
    const password = data.password
    data.password = "" // set to invalid value, password is set separately with hashing

    const usr = new User(data)
    await usr.setPassword(password)

    try {
        const saved = await usr.save()
        logger.verbose("user_created", { id: saved.id })

        return saved
    } catch (e) {
        if (e instanceof Error) {
            logger.error("user_create_error", {
                error: e.message,
            })
        }

        throw e
    }
}

/**
 * Update user
 * @param {string} id User ID
 * @param {UpdateQuery<UserType>} data User data
 * @returns {Promise<UserDocType>} Updated user
 */
const update = async (
    id: string,
    data: UpdateQuery<UserType>
): Promise<UserDocType> => {
    let password = null
    if (Object.hasOwn(data, "password")) {
        password = data.password
        delete data.password
    }

    try {
        const updated = await User.findByIdAndUpdate(id, data, {
            returnDocument: "after",
            runValidators: true,
        })

        if (updated === null) {
            throw new NotFoundError("user with specified ID does not exist")
        }

        if (password !== null) {
            await updated.setPassword(password)
            await updated.save()
        }

        logger.verbose("user_updated", { id: updated.id })
        return updated
    } catch (e) {
        if (e instanceof Error) {
            logger.error("user_update_error", {
                id,
                error: e.message,
            })
        }

        throw e
    }
}

/**
 * Find users
 * @param {object} filter Filter
 * @param {string[]} populate Fields to populate
 * @param {object} sort Sorting
 * @param {string[]} select Fields to select
 * @param {limit?} limit Limit amount of results
 * @returns {Promise<UserDocType[]>} Found users
 */
const find = async (
    filter: object = {},
    populate: string[] = [],
    sort: Record<string, SortOrder> = {},
    select: string[] = [],
    limit?: number
): Promise<UserDocType[]> => {
    try {
        return await crud.find(
            filter,
            populate,
            sort,
            [...select, "-password"],
            limit
        )
    } catch (e) {
        if (e instanceof Error) {
            logger.error("user_list_error", {
                error: e.message,
            })
        }

        throw e
    }
}

/**
 * Generate JWT token for user
 * @param {Express.User} user User
 * @returns {string} JWT token
 */
const generateToken = (user: Express.User): string => {
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET!,
        {
            expiresIn: `${Number(process.env.EXPIRES_IN_SEC!) || 86400}s`,
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
