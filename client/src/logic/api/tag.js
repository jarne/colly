/**
 * Colly | tag API logic
 */

import InternalAPI from "./../../util/InternalAPI"

/**
 * Create a new tag
 *
 * @param {string} name Tag name
 * @param {string} firstColor First gradient color
 * @param {string} secondColor Second gradient color
 * @param {string} accessToken API access token
 *
 * @returns error or nothing
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
                name: name,
                firstColor: firstColor,
                secondColor: secondColor,
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
 * Update a tag
 *
 * @param {string} id Tag ID
 * @param {string} name Tag name
 * @param {string} firstColor First gradient color
 * @param {string} secondColor Second gradient color
 * @param {string} accessToken API access token
 *
 * @returns error or nothing
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
                name: name,
                firstColor: firstColor,
                secondColor: secondColor,
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
 * Get all tags
 *
 * @returns List of all Tag objects
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
