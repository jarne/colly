/**
 * Colly | random color gradient scheme generator
 */

type RGBColor = {
    r: number
    g: number
    b: number
}

/**
 * Generate two random colors for a color gradient
 * @returns {[string, string]} two HEX colors for a gradient
 */
export const generateGradientColors = (): [string, string] => {
    const first = randomHexColor()
    const second = calculateSecondColor(first)

    return [first, second]
}

/**
 * Generate a random HEX color
 * @returns {string} random HEX color
 */
export const randomHexColor = (): string => {
    return (
        "#" +
        Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0")
    )
}

/**
 * Generate a random, second HEX color that is similar to a first one
 * @param {string} firstColor first base color (as HEX)
 * @returns {string} randomized second HEX color
 */
export const calculateSecondColor = (firstColor: string): string => {
    const rgb = hexToRgb(firstColor)
    const factor = Math.random() > 0.5 ? 1.2 : 0.8

    const newRgb = {
        r: Math.min(255, Math.max(0, Math.round(rgb.r * factor))),
        g: Math.min(255, Math.max(0, Math.round(rgb.g * factor))),
        b: Math.min(255, Math.max(0, Math.round(rgb.b * factor))),
    }

    return rgbToHex(newRgb)
}

/**
 * Convert HEX to RGB color
 * @param {string} hex HEX color
 * @returns {RGBColor} RGB color values
 */
export const hexToRgb = (hex: string): RGBColor => {
    const bigInt = parseInt(hex.slice(1), 16)
    return {
        r: (bigInt >> 16) & 255,
        g: (bigInt >> 8) & 255,
        b: bigInt & 255,
    }
}

/**
 * Convert RGB to HEX color
 * @param {RGBColor} rgb RGB color values
 * @returns {string} HEX color
 */
export const rgbToHex = (rgb: RGBColor): string => {
    return (
        "#" +
        ((1 << 24) | (rgb.r << 16) | (rgb.g << 8) | rgb.b).toString(16).slice(1)
    )
}
