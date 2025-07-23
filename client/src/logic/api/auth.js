/**
 * Colly | auth API logic
 */

import InternalAPI from "./../../util/InternalAPI"
import { checkRequestSuccessful } from "./util/requestHelper"

/**
 * Get information about current user
 * @param {string} accessToken API access token
 * @returns {object} user information
 */
export const getMe = async (accessToken) => {
    const resp = await fetch(`${InternalAPI.API_ENDPOINT}/auth/me`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    checkRequestSuccessful(resp)
    const res = await resp.json()

    if (res.error) {
        throw new Error(res.error_code)
    }

    return res.user
}

/**
 * Log-out the current user session
 * @param {string} accessToken API access token
 */
export const logout = async (accessToken) => {
    const resp = await fetch(`${InternalAPI.API_ENDPOINT}/auth/logout`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    checkRequestSuccessful(resp)
}
