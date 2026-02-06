/**
 * Colly | shared code for fetch requests to the API
 */

/**
 * Check if response of fetch request was successful
 * @param {Response} resp fetch response
 */
export const checkRequestSuccessful = (resp: Response) => {
    if (!resp.ok) {
        switch (resp.status) {
            case 401:
                throw new Error("unauthorized")
            default:
                throw new Error("request_unsuccessful")
        }
    }
}
