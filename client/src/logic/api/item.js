/**
 * Colly | collection item API logic
 */

import InternalAPI from "./../../util/InternalAPI"
import { generateValidationErrorMessage } from "./util/errorCodeHandling"

/**
 * Create item
 * @param {string} url item URL
 * @param {string} name item name
 * @param {string} description item description
 * @param {string} tags associated tags
 * @param {string} accessToken API access token
 */
export const createItem = async (url, name, description, tags, accessToken) => {
    let res
    try {
        const resp = await fetch(InternalAPI.API_ENDPOINT + "/item", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                url,
                name,
                description,
                tags,
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
                throw new Error("An item with this name already exists!")
            default:
                throw new Error("Unknown error!")
        }
    }
}

/**
 * Update item
 * @param {string} id item ID
 * @param {string} url item URL
 * @param {string} name item name
 * @param {string} description item description
 * @param {string} tags associated tags
 * @param {string} accessToken API access token
 */
export const updateItem = async (
    id,
    url,
    name,
    description,
    tags,
    accessToken
) => {
    let res
    try {
        const resp = await fetch(`${InternalAPI.API_ENDPOINT}/item/${id}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                url,
                name,
                description,
                tags,
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
 * Delete item
 * @param {string} id item ID
 * @param {string} accessToken API access token
 */
export const deleteItem = async (id, accessToken) => {
    let res
    try {
        const resp = await fetch(`${InternalAPI.API_ENDPOINT}/item/${id}`, {
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
 * Get all items
 * @param {string} accessToken API access token
 * @returns {Array} item objects
 */
export const listItems = async (accessToken) => {
    let res
    try {
        const resp = await fetch(InternalAPI.API_ENDPOINT + "/item", {
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

/**
 * Get metadata preview of an item URL
 * @param {string} url item URL
 * @param {string} accessToken API access token
 * @returns {object} metadata preview info (page title and description)
 */
export const generatePreview = async (url, accessToken) => {
    let res
    try {
        const resp = await fetch(InternalAPI.API_ENDPOINT + "/item/meta", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                url,
            }),
        })
        res = await resp.json()
    } catch (e) {
        throw new Error()
    }

    if (res.error) {
        throw new Error()
    }

    return res.meta
}
