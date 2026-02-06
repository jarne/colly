/**
 * Colly | tag API logic
 */

import qs from "qs"

import InternalAPI from "./../../util/InternalAPI"
import { generateValidationErrorMessage } from "./util/errorCodeHandling"

type Tag = {
    name: string
    firstColor: string
    secondColor: string
    workspace: string
}

export type TagRes = {
    _id: string
} & Tag

/**
 * Create tag
 * @param {Tag} tag tag object
 * @param {string} workspace workspace ID
 * @param {string} accessToken API access token
 */
export const createTag = async (
    tag: Tag,
    workspace: string,
    accessToken: string
) => {
    let res
    try {
        const resp = await fetch(
            `${InternalAPI.API_ENDPOINT}/workspace/${workspace}/tag`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(tag),
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
                throw new Error("A tag with this name already exists!")
            case "insufficient_permission":
                throw new Error(
                    "You do not have permission to create tags in this workspace!"
                )
            default:
                throw new Error("Unknown error!")
        }
    }
}

/**
 * Update tag
 * @param {string} id tag ID
 * @param {Tag} tag tag object
 * @param {string} workspace workspace ID
 * @param {string} accessToken API access token
 */
export const updateTag = async (
    id: string,
    tag: Tag,
    workspace: string,
    accessToken: string
) => {
    let res
    try {
        const resp = await fetch(
            `${InternalAPI.API_ENDPOINT}/workspace/${workspace}/tag/${id}`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(tag),
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
                    "You do not have permission to update this tag!"
                )
            default:
                throw new Error("Unknown error!")
        }
    }
}

/**
 * Delete tag
 * @param {string} id tag ID
 * @param {string} workspace workspace ID
 * @param {string} accessToken API access token
 */
export const deleteTag = async (
    id: string,
    workspace: string,
    accessToken: string
) => {
    let res
    try {
        const resp = await fetch(
            `${InternalAPI.API_ENDPOINT}/workspace/${workspace}/tag/${id}`,
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
                    "You do not have permission to delete this tag!"
                )
            default:
                throw new Error("Unknown error!")
        }
    }
}

/**
 * Find tags
 * @param {object} query Query parameters
 * @param {string} workspace workspace ID
 * @param {string} accessToken API access token
 * @returns {Promise<TagRes[]>} tag objects
 */
export const findTags = async (
    query: object,
    workspace: string,
    accessToken: string
): Promise<TagRes[]> => {
    const queryStr = qs.stringify(query, {
        encode: false,
    })

    const resp = await fetch(
        `${InternalAPI.API_ENDPOINT}/workspace/${workspace}/tag?${queryStr}`,
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
