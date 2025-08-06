/**
 * Colly | workspace API logic
 */

import qs from "qs"

import InternalAPI from "./../../util/InternalAPI"
import { generateValidationErrorMessage } from "./util/errorCodeHandling"

/**
 * Create workspace
 * @param {object} workspace workspace object
 * @param {string} accessToken API access token
 * @returns {string} created workspace ID
 */
export const createWorkspace = async (workspace, accessToken) => {
    let res
    try {
        const resp = await fetch(`${InternalAPI.API_ENDPOINT}/workspace`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(workspace),
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

    return res.id
}

/**
 * Update workspace
 * @param {string} id workspace ID
 * @param {object} workspace workspace object
 * @param {string} accessToken API access token
 */
export const updateWorkspace = async (id, workspace, accessToken) => {
    let res
    try {
        const resp = await fetch(
            `${InternalAPI.API_ENDPOINT}/workspace/${id}`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(workspace),
            }
        )
        res = await resp.json()
    } catch {
        throw new Error("Error while communicating with the server!")
    }

    if (res.error) {
        switch (res.error.code) {
            case "validation_error":
                throw new Error(generateValidationErrorMessage(res.error))
            case "insufficient_permission":
                throw new Error(
                    "You do not have permission to update this workspace!"
                )
            default:
                throw new Error("Unknown error!")
        }
    }
}

/**
 * Delete workspace
 * @param {string} id workspace ID
 * @param {string} accessToken API access token
 */
export const deleteWorkspace = async (id, accessToken) => {
    let res
    try {
        const resp = await fetch(
            `${InternalAPI.API_ENDPOINT}/workspace/${id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        )
        res = await resp.json()
    } catch {
        throw new Error("Error while communicating with the server!")
    }

    if (res.error) {
        switch (res.error.code) {
            case "insufficient_permission":
                throw new Error(
                    "You do not have permission to delete this workspace!"
                )
            default:
                throw new Error("Unknown error!")
        }
    }
}

/**
 * Find workspaces
 * @param {object} query Query parameters
 * @param {string} accessToken API access token
 * @returns {Array} workspace objects
 */
export const findWorkspaces = async (query, accessToken) => {
    const queryStr = qs.stringify(query, {
        encode: false,
    })

    const resp = await fetch(
        `${InternalAPI.API_ENDPOINT}/workspace?${queryStr}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    )
    const res = await resp.json()

    if (res.error) {
        throw new Error(res.error_code)
    }

    return res.data
}

/**
 * Get user ID by its username
 * @param {string} username username
 * @param {string} accessToken API access token
 * @returns {Array} workspace objects
 */
export const getUserByUsername = async (username, accessToken) => {
    const resp = await fetch(
        `${InternalAPI.API_ENDPOINT}/workspace/userByUsername/${username}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    )
    const res = await resp.json()

    if (res.error) {
        switch (res.error.code) {
            case "username_not_found":
                throw new Error("No user found with this username!")
            default:
                throw new Error("Unknown error!")
        }
    }

    return res.data
}
