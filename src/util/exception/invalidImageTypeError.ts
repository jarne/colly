/**
 * Colly | invalid image type error
 */

class InvalidImageTypeError extends Error {
    constructor(message: string) {
        super(message)

        this.name = "InvalidImageTypeError"
    }
}

export default InvalidImageTypeError
