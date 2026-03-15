/**
 * Colly | tag API logic
 */

import qs from "qs"
import i18n from "./../../util/i18n"

import InternalAPI from "./../../util/InternalAPI"
import { generateValidationErrorMessage } from "./util/errorCodeHandling"
import { checkRequestSuccessful } from "./util/requestHelper"

type Tag = {
    name: string
    firstColor: string
    secondColor: string
    workspace: string
    lastUsed: Date
}

export type TagRes = {
    _id: string
} & Tag

/**
 * Create tag
 * @param {Partial<Tag>} tag tag object
 * @param {string} workspace workspace ID
 * @param {string} accessToken API access token
 */
export const createTag = async (
    tag: Partial<Tag>,
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
        throw new Error(i18n.t("errors.api.serverCommunication"))
    }

    if (res.error) {
        switch (res.error.code) {
            case "validation_error":
                throw new Error(generateValidationErrorMessage(res.error))
            case "duplicate_entry":
                throw new Error(i18n.t("errors.api.tag.duplicate"))
            case "insufficient_permission":
                throw new Error(i18n.t("errors.api.tag.createPermission"))
            default:
                throw new Error(i18n.t("errors.api.unknown"))
        }
    }
}

/**
 * Update tag
 * @param {string} id tag ID
 * @param {Partial<Tag>} tag tag object
 * @param {string} workspace workspace ID
 * @param {string} accessToken API access token
 */
export const updateTag = async (
    id: string,
    tag: Partial<Tag>,
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
        throw new Error(i18n.t("errors.api.serverCommunication"))
    }

    if (res.error) {
        switch (res.error.code) {
            case "validation_error":
                throw new Error(generateValidationErrorMessage(res.error))
            case "insufficient_permission":
                throw new Error(i18n.t("errors.api.tag.updatePermission"))
            default:
                throw new Error(i18n.t("errors.api.unknown"))
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
        throw new Error(i18n.t("errors.api.serverCommunication"))
    }

    if (res.error) {
        switch (res.error.code) {
            case "insufficient_permission":
                throw new Error(i18n.t("errors.api.tag.deletePermission"))
            default:
                throw new Error(i18n.t("errors.api.unknown"))
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
    checkRequestSuccessful(resp)
    const res = await resp.json()

    if (res.error) {
        throw new Error(res.error.code)
    }

    return res.data
}
