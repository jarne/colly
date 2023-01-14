/**
 * Colly | item API logic
 */

import InternalAPI from "./../../util/InternalAPI"

/**
 * Get all items
 *
 * @returns List of all Item objects
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

    return res.items
}
