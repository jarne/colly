/**
 * Colly | query parser util
 */

import InvalidQueryError from "./../exception/invalidQueryError.js"

export const parseFieldsArray = (input) => {
    if (input === undefined) {
        return []
    }

    if (Array.isArray(input)) {
        return input
    }

    if (typeof input === "string") {
        return input.split(" ")
    }

    throw new InvalidQueryError()
}
