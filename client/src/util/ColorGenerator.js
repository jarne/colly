/**
 * Colly | random color gradient scheme generator
 */

/**
 * Generate random colors for a color gradient
 * @returns {array} two HEX colors for a color gradient
 */
export const generateGradientColors = () => {
    const first = randomHexColor()
    const second = calculateSecondColor(first)

    return [first, second]
}

/**
 * Generate a random HEX color
 * @returns {string} random HEX color
 */
export const randomHexColor = () => {
    return (
        "#" +
        Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0")
    )
}

/**
 * Generate a random HEX color
 * @returns {string} random HEX color
 */
export const calculateSecondColor = (firstColor) => {
    let rgb = hexToRgb(firstColor)
    let factor = Math.random() > 0.5 ? 1.2 : 0.8

    let newRgb = {
        r: Math.min(255, Math.max(0, Math.round(rgb.r * factor))),
        g: Math.min(255, Math.max(0, Math.round(rgb.g * factor))),
        b: Math.min(255, Math.max(0, Math.round(rgb.b * factor))),
    }

    return rgbToHex(newRgb.r, newRgb.g, newRgb.b)
}

/**
 * Convert HEX to RGB color
 * @param {string} hex HEX color
 * @returns {object} RGB color values
 */
export const hexToRgb = (hex) => {
    let bigint = parseInt(hex.slice(1), 16)
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
    }
}

/**
 * Convert RGB to HEX color
 * @param {number} r red color value of RGB
 * @param {number} g green color value of RGB
 * @param {number} b blue color value of RGB
 * @returns {string} HEX color
 */
export const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)
}
