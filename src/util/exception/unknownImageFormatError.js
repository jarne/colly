/**
 * Colly | unknown image format error
 */

class UnknownImageFormatError extends Error {
    constructor(msg) {
        super(msg)

        this.name = "UnknownImageFormatError"
    }
}

export default UnknownImageFormatError
