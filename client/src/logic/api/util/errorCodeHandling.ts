/**
 * Colly | API error code handling logic
 */

type ValidationError = {
    code: string
    fields: FieldValidationError[]
}

type FieldValidationError = {
    name: string
    message: string
}

/**
 * Generate validation error message based on error object
 * @param {ValidationError} error error info object
 * @returns {string} final error message string
 */
export const generateValidationErrorMessage = (
    error: ValidationError
): string => {
    const valMsgs = error.fields.map((field) => {
        return `${field.name}: ${field.message}`
    })

    return `Invalid input: ${valMsgs.join(", ")}!`
}
