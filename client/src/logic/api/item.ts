/**
 * Colly | collection item API logic
 */

import qs from "qs"
import i18n from "./../../util/i18n"
import InternalAPI from "./../../util/InternalAPI"
import type { TagRes } from "./tag"
import { generateValidationErrorMessage } from "./util/errorCodeHandling"
import { checkRequestSuccessful } from "./util/requestHelper"

type Item = {
    url: string
    name: string
    description: string
    tags: TagRes[] | string[]
    isPinned: boolean
    workspace: string
    logo: string
    logoUrl: string
    image: string
    imageUrl: string
    createdAt: string
    updatedAt: string
}

export type ItemRes = {
    _id: string
} & Item

type MetadataPreview = {
    title: string
    description: string
}

/**
 * Create item
 * @param {Partial<Item>} item item object
 * @param {string} workspace workspace ID
 * @param {string} accessToken API access token
 */
export const createItem = async (
    item: Partial<Item>,
    workspace: string,
    accessToken: string
) => {
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
        throw new Error(i18n.t("errors.api.serverCommunication"))
    }

    if (res.error) {
        switch (res.error.code) {
            case "validation_error":
                throw new Error(generateValidationErrorMessage(res.error))
            case "duplicate_entry":
                throw new Error(i18n.t("errors.api.item.duplicate"))
            case "insufficient_permission":
                throw new Error(i18n.t("errors.api.item.createPermission"))
            default:
                throw new Error(i18n.t("errors.api.unknown"))
        }
    }
}

/**
 * Update item
 * @param {string} id item ID
 * @param {Partial<Item>} item item object
 * @param {string} workspace workspace ID
 * @param {string} accessToken API access token
 */
export const updateItem = async (
    id: string,
    item: Partial<Item>,
    workspace: string,
    accessToken: string
) => {
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
        throw new Error(i18n.t("errors.api.serverCommunication"))
    }

    if (res.error) {
        switch (res.error.code) {
            case "validation_error":
                throw new Error(generateValidationErrorMessage(res.error))
            case "insufficient_permission":
                throw new Error(i18n.t("errors.api.item.updatePermission"))
            default:
                throw new Error(i18n.t("errors.api.unknown"))
        }
    }
}

/**
 * Delete item
 * @param {string} id item ID
 * @param {string} workspace workspace ID
 * @param {string} accessToken API access token
 */
export const deleteItem = async (
    id: string,
    workspace: string,
    accessToken: string
) => {
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
        throw new Error(i18n.t("errors.api.serverCommunication"))
    }

    if (res.error) {
        switch (res.error.code) {
            case "insufficient_permission":
                throw new Error(i18n.t("errors.api.item.deletePermission"))
            default:
                throw new Error(i18n.t("errors.api.unknown"))
        }
    }
}

/**
 * Find items
 * @param {object} query Query parameters
 * @param {string} workspace workspace ID
 * @param {string} accessToken API access token
 * @returns {Promise<ItemRes[]>} item objects
 */
export const findItems = async (
    query: object,
    workspace: string,
    accessToken: string
): Promise<ItemRes[]> => {
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
    checkRequestSuccessful(resp)
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
 * @returns {Promise<MetadataPreview>} metadata preview info (page title and description)
 */
export const generatePreview = async (
    url: string,
    workspace: string,
    accessToken: string
): Promise<MetadataPreview> => {
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
export const updateMetaImage = async (
    id: string,
    workspace: string,
    accessToken: string
) => {
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
        throw new Error(i18n.t("errors.api.serverCommunication"))
    }

    if (res && res.error) {
        switch (res.error.code) {
            case "insufficient_permission":
                throw new Error(i18n.t("errors.api.item.metaImagePermission"))
            default:
                throw new Error(i18n.t("errors.api.unknown"))
        }
    }
}
