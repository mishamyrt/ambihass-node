import FastAverageColor from 'fast-average-color'

const fac = new FastAverageColor();

/**
 * Extracts dominant color from pixels
 * @param image - Array of colors in RGBA format
 */
function getDominantColor(image: number[]) {
    return fac.getColorFromArray4(image, { algorithm: 'dominant' })
}

export function getRGB(image): number[] {
    return getDominantColor(image).slice(0, 3)
}
