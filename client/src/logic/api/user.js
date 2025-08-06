/**
 * Colly | user API logic
 */

import qs from "qs"

import InternalAPI from "./../../util/InternalAPI"
import { generateValidationErrorMessage } from "./util/errorCodeHandling"

/**
 * Create user
 * @param {object} user user object
 * @param {string} accessToken API access token
 */
export const createUser = async (user, accessToken) => {
    let res
    try {
        const resp = await fetch(InternalAPI.API_ENDPOINT + "/user", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        })
        res = await resp.json()
    } catch {
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
 * @param {object} user user object
 * @param {string} accessToken API access token
 */
export const updateUser = async (id, user, accessToken) => {
    if (user.password === "") {
        user.password = undefined
    }

    let res
    try {
        const resp = await fetch(`${InternalAPI.API_ENDPOINT}/user/${id}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        })
        res = await resp.json()
    } catch {
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
    } catch {
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
 * Find users
 * @param {object} query find query
 * @param {string} accessToken API access token
 * @returns {Array} user objects
 */
export const findUsers = async (query, accessToken) => {
    const queryStr = qs.stringify(query, {
        encode: false,
    })

    const resp = await fetch(`${InternalAPI.API_ENDPOINT}/user?${queryStr}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    const res = await resp.json()

    if (res.error) {
        throw new Error(res.error_code)
    }

    return res.data
}
