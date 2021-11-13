export type FrameHandler = (pixels: number[]) => void

export interface Screen {
    index: number,
    resolution: [number, number]
}