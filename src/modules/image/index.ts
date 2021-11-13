import { getRGB } from "./color"
import { createSlicer } from "./slicer"

export function createColorSlicer(width: number, height: number, length: number) {
    const slice = createSlicer(width, height, length)
    return (image: number[]) => getRGB(image)
}