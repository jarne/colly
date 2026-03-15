/**
 * Colly | API error code handling logic
 */

import i18n from "./../../../util/i18n"

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

    return i18n.t("errors.api.validation", {
        details: valMsgs.join(", "),
    })
}
