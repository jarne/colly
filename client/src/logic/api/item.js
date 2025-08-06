/**
 * Colly | collection item API logic
 */

import qs from "qs"

import InternalAPI from "./../../util/InternalAPI"
import { generateValidationErrorMessage } from "./util/errorCodeHandling"

/**
 * Create item
 * @param {object} item item object
 * @param {string} workspace workspace ID
 * @param {string} accessToken API access token
 */
export const createItem = async (item, workspace, accessToken) => {
    let res
    try {
        const resp = await fetch(
            `${InternalAPI.API_ENDPOINT}/workspace/${workspace}/item`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(item),
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
            case "duplicate_entry":
                throw new Error("An item with this name already exists!")
            case "insufficient_permission":
                throw new Error(
                    "You do not have permission to create items in this workspace!"
                )
            default:
                throw new Error("Unknown error!")
        }
    }
}

/**
 * Update item
 * @param {string} id item ID
 * @param {object} item item object
 * @param {string} workspace workspace ID
 * @param {string} accessToken API access token
 */
export const updateItem = async (id, item, workspace, accessToken) => {
    let res
    try {
        const resp = await fetch(
            `${InternalAPI.API_ENDPOINT}/workspace/${workspace}/item/${id}`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(item),
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
                    "You do not have permission to update this item!"
                )
            default:
                throw new Error("Unknown error!")
        }
    }
}

/**
 * Delete item
 * @param {string} id item ID
 * @param {string} workspace workspace ID
 * @param {string} accessToken API access token
 */
export const deleteItem = async (id, workspace, accessToken) => {
    let res
    try {
        const resp = await fetch(
            `${InternalAPI.API_ENDPOINT}/workspace/${workspace}/item/${id}`,
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
                    "You do not have permission to delete this item!"
                )
            default:
                throw new Error("Unknown error!")
        }
    }
}

/**
 * Find items
 * @param {object} query Query parameters
 * @param {string} workspace workspace ID
 * @param {string} accessToken API access token
 * @returns {Array} item objects
 */
export const findItems = async (query, workspace, accessToken) => {
    const queryStr = qs.stringify(query, {
        encode: false,
    })

    const resp = await fetch(
        `${InternalAPI.API_ENDPOINT}/workspace/${workspace}/item?${queryStr}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    )
    const res = await resp.json()

    if (res.error) {
        throw new Error(res.error.code)
    }

    return res.data
}

/**
 * Get metadata preview of an item URL
 * @param {string} url item URL
 * @param {string} workspace workspace ID
 * @param {string} accessToken API access token
 * @returns {object} metadata preview info (page title and description)
 */
export const generatePreview = async (url, workspace, accessToken) => {
    const resp = await fetch(
        `${InternalAPI.API_ENDPOINT}/workspace/${workspace}/item/meta`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                url,
            }),
        }
    )
    const res = await resp.json()

    if (res.error) {
        throw new Error(res.error.code)
    }

    return res.meta
}

/**
 * Trigger meta data image update of an item
 * @param {string} id item ID
 * @param {string} workspace workspace ID
 * @param {string} accessToken API access token
 */
export const updateMetaImage = async (id, workspace, accessToken) => {
    let res
    try {
        const resp = await fetch(
            `${InternalAPI.API_ENDPOINT}/workspace/${workspace}/item/${id}/updateMetaImage`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )
        if (resp.status !== 204) {
            res = await resp.json()
        }
    } catch {
        throw new Error("Error while communicating with the server!")
    }

    if (res && res.error) {
        switch (res.error.code) {
            case "insufficient_permission":
                throw new Error(
                    "You do not have permission to update the meta image of this item!"
                )
            default:
                throw new Error("Unknown error!")
        }
    }
}
