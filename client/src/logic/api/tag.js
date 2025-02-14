/**
 * Colly | tag API logic
 */

import qs from "qs"

import InternalAPI from "./../../util/InternalAPI"
import { generateValidationErrorMessage } from "./util/errorCodeHandling"

/**
 * Create tag
 * @param {object} tag tag object
 * @param {string} accessToken API access token
 */
export const createTag = async (tag, accessToken) => {
    let res
    try {
        const resp = await fetch(InternalAPI.API_ENDPOINT + "/tag", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(tag),
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
                throw new Error("A tag with this name already exists!")
            default:
                throw new Error("Unknown error!")
        }
    }
}

/**
 * Update tag
 * @param {string} id tag ID
 * @param {object} tag tag object
 * @param {string} accessToken API access token
 */
export const updateTag = async (id, tag, accessToken) => {
    let res
    try {
        const resp = await fetch(`${InternalAPI.API_ENDPOINT}/tag/${id}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(tag),
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
 * Delete tag
 * @param {string} id tag ID
 * @param {string} accessToken API access token
 */
export const deleteTag = async (id, accessToken) => {
    let res
    try {
        const resp = await fetch(`${InternalAPI.API_ENDPOINT}/tag/${id}`, {
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
 * Find tags
 * @param {string} accessToken API access token
 * @param {object} query Query parameters
 * @returns {Array} tag objects
 */
export const findTags = async (accessToken, query) => {
    const queryStr = qs.stringify(query, {
        encode: false,
    })

    let res
    try {
        const resp = await fetch(
            `${InternalAPI.API_ENDPOINT}/tag?${queryStr}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )
        res = await resp.json()
    } catch (e) {
        throw new Error()
    }

    if (res.error) {
        throw new Error()
    }

    return res.data
}
