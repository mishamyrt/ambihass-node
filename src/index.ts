import { token, host } from '../env.json'
import lamps from '../lamps.json'
import { createColorist } from './modules/hass'
import { createColorSlicer } from './modules/image'
import { handleScreen } from './modules/screen'
import { Screen } from './modules/screen/types'

const screen: Screen = {
    resolution: [426, 240],
    index: 2
}

function createMeter () {
    let last = -1
    return () => {
        const now = Date.now()
        const ops = 1000 / (now - last)
        if (last > 0) {
            console.log(`OPS: ${ops.toFixed(2)}`)
        }
        last = now
    }
}

const tick = createMeter()
const slice = createColorSlicer(...screen.resolution, 4)
const applyColor = createColorist(token, host)

handleScreen(screen, frame => {
    lamps
        .map(lamp => slice(frame))
        .forEach((color, i) => applyColor(lamps[i].entityId, color, lamps[i].brightness))
    tick()
})
