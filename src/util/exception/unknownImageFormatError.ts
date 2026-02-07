/**
 * Colly | unknown image format error
 */

class UnknownImageFormatError extends Error {
    constructor(message: string) {
        super(message)

        this.name = "UnknownImageFormatError"
    }
}

export default UnknownImageFormatError
