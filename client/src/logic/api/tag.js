/**
 * Colly | tag API logic
 */

import InternalAPI from "./../../util/InternalAPI"

/**
 * Create new tag
 *
 * @param {string} name tag name
 * @param {string} firstColor first gradient color
 * @param {string} secondColor second gradient color
 * @param {string} accessToken API access token
 */
export const createTag = async (name, firstColor, secondColor, accessToken) => {
    let res
    try {
        const resp = await fetch(InternalAPI.API_ENDPOINT + "/tag", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                firstColor,
                secondColor,
            }),
        })
        res = await resp.json()
    } catch (e) {
        throw new Error("Error while communicating with the server!")
    }

    if (res.error) {
        switch (res.error.code) {
            case "validation_error":
                const valMsgs = res.error.fields.map((field) => {
                    return field.message
                })
                throw new Error(`Invalid input: ${valMsgs.join(", ")}!`)
            case "duplicate_entry":
                throw new Error("A tag with this name already exists!")
            default:
                throw new Error("Unknown error!")
        }
    }
}

/**
 * Update tag
 *
 * @param {string} id tag ID
 * @param {string} name tag name
 * @param {string} firstColor first gradient color
 * @param {string} secondColor second gradient color
 * @param {string} accessToken API access token
 */
export const updateTag = async (
    id,
    name,
    firstColor,
    secondColor,
    accessToken
) => {
    let res
    try {
        const resp = await fetch(`${InternalAPI.API_ENDPOINT}/tag/${id}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                firstColor,
                secondColor,
            }),
        })
        res = await resp.json()
    } catch (e) {
        throw new Error("Error while communicating with the server!")
    }

    if (res.error) {
        switch (res.error.code) {
            case "validation_error":
                const valMsgs = res.error.fields.map((field) => {
                    return field.message
                })
                throw new Error(`Invalid input: ${valMsgs.join(", ")}!`)
            default:
                throw new Error("Unknown error!")
        }
    }
}

/**
 * Delete tag
 *
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
 * Get all tags
 *
 * @param {string} accessToken API access token
 * @returns list of all tags
 */
export const listTags = async (accessToken) => {
    let res
    try {
        const resp = await fetch(InternalAPI.API_ENDPOINT + "/tag", {
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

    return res.tags
}
