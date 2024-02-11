/**
 * Colly | invalid image type error
 */

class InvalidImageTypeError extends Error {
    constructor(msg) {
        super(msg)

        this.name = "InvalidImageTypeError"
    }
}

export default InvalidImageTypeError
