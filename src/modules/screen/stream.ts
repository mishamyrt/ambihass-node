import { ChildProcessWithoutNullStreams, spawn } from 'child_process'
import { FrameHandler, Screen } from './types'

const processes: ChildProcessWithoutNullStreams[] = []

const words = (s: string) => s.split(' ')

function zeroRGBtoRGBA (b: Buffer): number[] {
    const result = []
    for (let i = 0; i < b.length; i += 4) {
        result.push(
            b[i+1],
            b[i+2],
            b[i+3],
            255,
        )
    }
    return result
}

export function handleScreen ({ resolution, index }: Screen, handler: FrameHandler) {
    const FRAME_LENGTH = resolution.reduce((a, c) => a * c, 1) * 4
    const recorder = spawn(
        'ffmpeg',
        [
            ...words('-pix_fmt 0rgb -r 30'),
            ...words(`-f avfoundation -i ${index}:0 -vf scale=${resolution.join(':')} -f rawvideo`),
            '-'
        ],
        { stdio: 'pipe' }
    )
    const frameBuffer = []
    recorder.stdout.on('data', b => {
        const pixels = zeroRGBtoRGBA(b)
        if (frameBuffer.length < FRAME_LENGTH) {
            if (pixels.length < FRAME_LENGTH - frameBuffer.length) {
                frameBuffer.push(...pixels)
            } else {
                frameBuffer.push(...pixels.slice(0, FRAME_LENGTH - frameBuffer.length))
            }
        }
        if (frameBuffer.length === FRAME_LENGTH) {
            handler(frameBuffer)
            frameBuffer.length = 0
        }
    })
    processes.push(recorder)
}

process.on('exit', () => processes.forEach(p => p.kill(9)))
