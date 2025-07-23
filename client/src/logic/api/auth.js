/**
 * Colly | auth API logic
 */

import InternalAPI from "./../../util/InternalAPI"
import { checkRequestSuccessful } from "./util/requestHelper"
import { generateValidationErrorMessage } from "./util/errorCodeHandling"

/**
 * Log-in at the back-end
 * @param {string} username username
 * @param {string} password password
 * @returns {object} user information
 */
export const login = async (username, password) => {
    let res
    try {
        const resp = await fetch(InternalAPI.API_ENDPOINT + "/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        })
        res = await resp.json()
    } catch {
        throw new Error("Error while communicating with the login server!")
    }

    if (res.error) {
        switch (res.error_code) {
            case "validation_error":
                throw new Error(generateValidationErrorMessage(res.error))
            case "invalid_credentials":
                throw new Error("Invalid username or password!")
            default:
                throw new Error("Unknown error!")
        }
    }

    return res
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
 * Change password of user
 * @param {string} existingPassword existing password
 * @param {string} newPassword new password to change
 * @param {string} accessToken API access token
 */
export const changePassword = async (
    existingPassword,
    newPassword,
    accessToken
) => {
    let res
    try {
        const resp = await fetch(
            `${InternalAPI.API_ENDPOINT}/auth/me/passwordChange`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    existingPassword,
                    newPassword,
                }),
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
            case "validation_error":
                throw new Error(generateValidationErrorMessage(res.error))
            case "existing_password_incorrect":
                throw new Error("Entered current password is incorrect!")
            default:
                throw new Error("Unknown error!")
        }
    }
}
