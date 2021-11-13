/**
 * Creates image slicer. 
 * @returns Selected length rows of image.
 */
export function createSlicer(width: number, height: number, length: number) {
    const row = 4 * width
    /**
     * @param image - Image pixels in RGBA format.
     * @param position - Percent offset from top.
     */
    return (image: number[], position: number) => {
        const offset = Math.floor(height * position * row)
        return image.slice(offset, offset + (row * length))
    }
}
