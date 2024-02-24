/**
 * Colly | API error code handling logic
 */

/**
 * Generate validation error message based on error object
 * @param {object} error Error object
 * @returns {string} Error message string
 */
export const generateValidationErrorMessage = (error) => {
    const valMsgs = error.fields.map((field) => {
        return `${field.name}: ${field.message}`
    })

    return `Invalid input: ${valMsgs.join(", ")}!`
}
