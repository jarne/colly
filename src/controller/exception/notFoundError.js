/**
 * Colly | object not found error
 */

class NotFoundError extends Error {
    constructor(msg) {
        super(msg)

        this.name = "NotFoundError"
    }
}

export default NotFoundError
