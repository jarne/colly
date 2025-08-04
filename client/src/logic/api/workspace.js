/**
 * Colly | workspace API logic
 */

import qs from "qs"

import InternalAPI from "./../../util/InternalAPI"
import { checkRequestSuccessful } from "./util/requestHelper"
import { generateValidationErrorMessage } from "./util/errorCodeHandling"

/**
 * Create workspace
 * @param {object} workspace workspace object
 * @param {string} accessToken API access token
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
    checkRequestSuccessful(resp)
    const res = await resp.json()

    if (res.error) {
        throw new Error(res.error_code)
    }

    return res.data
}
