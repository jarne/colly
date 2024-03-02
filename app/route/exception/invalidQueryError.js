/**
 * Colly | invalid query error
 */

class InvalidQueryError extends Error {
    constructor(msg) {
        super(msg)

        this.name = "InvalidQueryError"
    }
}

export default InvalidQueryError
