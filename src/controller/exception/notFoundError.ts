/**
 * Colly | object not found error
 */

class NotFoundError extends Error {
    constructor(message: string) {
        super(message)

        this.name = "NotFoundError"
    }
}

export default NotFoundError
