/**
 * Colly | user API logic
 */

import InternalAPI from "./../../util/InternalAPI"
import { generateValidationErrorMessage } from "./util/errorCodeHandling"

/**
 * Create user
 * @param {string} username user name
 * @param {string} password temporary password
 * @param {boolean} isAdmin user is admin
 * @param {string} accessToken API access token
 */
export const createUser = async (username, password, isAdmin, accessToken) => {
    let res
    try {
        const resp = await fetch(InternalAPI.API_ENDPOINT + "/user", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
                isAdmin,
            }),
        })
        res = await resp.json()
    } catch (e) {
        throw new Error("Error while communicating with the server!")
    }

    if (res.error) {
        switch (res.error.code) {
            case "validation_error":
                throw new Error(generateValidationErrorMessage(res.error))
            case "duplicate_entry":
                throw new Error("User name is already in use!")
            default:
                throw new Error("Unknown error!")
        }
    }
}

/**
 * Update user
 * @param {string} id user ID
 * @param {string} username user name
 * @param {string} password temporary password
 * @param {boolean} isAdmin user is admin
 * @param {string} accessToken API access token
 */
export const updateUser = async (
    id,
    username,
    password,
    isAdmin,
    accessToken
) => {
    let res
    try {
        const resp = await fetch(`${InternalAPI.API_ENDPOINT}/user/${id}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
                isAdmin,
            }),
        })
        res = await resp.json()
    } catch (e) {
        throw new Error("Error while communicating with the server!")
    }

    if (res.error) {
        switch (res.error.code) {
            case "validation_error":
                throw new Error(generateValidationErrorMessage(res.error))
            default:
                throw new Error("Unknown error!")
        }
    }
}

/**
 * Delete user
 * @param {string} id user ID
 * @param {string} accessToken API access token
 */
export const deleteUser = async (id, accessToken) => {
    let res
    try {
        const resp = await fetch(`${InternalAPI.API_ENDPOINT}/user/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        })
        res = await resp.json()
    } catch (e) {
        throw new Error("Error while communicating with the server!")
    }

    if (res.error) {
        switch (res.error.code) {
            default:
                throw new Error("Unknown error!")
        }
    }
}

/**
 * Get all users
 * @param {string} accessToken API access token
 * @returns {Array} user objects
 */
export const listUsers = async (accessToken) => {
    let res
    try {
        const resp = await fetch(InternalAPI.API_ENDPOINT + "/user", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        res = await resp.json()
    } catch (e) {
        throw new Error()
    }

    if (res.error) {
        throw new Error()
    }

    return res.data
}
