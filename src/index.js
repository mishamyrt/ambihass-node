const screenshot = require('screenshot-desktop')
const pixels = require('image-pixels')
const { sliceImage, getRGB } = require('./modules/image')
const { createColorist } = require('./modules/hass')
const { token, host } = require('../env.json')
const lamps = require('../lamps.json')

const writeColor = createColorist(token, host)

const applyColor = (lamp, color) => 
    color.then(c => writeColor(lamp.entityId, c, lamp.brightness))


const handleFrame = (frame) => pixels(frame)
    .then(image => lamps.map(lamp => sliceImage(image, lamp.position)))
    .then(slices => slices.map(getRGB))
    .then(colors => colors.map((color, i) => applyColor(lamps[i], color)))
    .catch(console.error)

async function main() {
    let lastFrame = 0
    while (true) {
        const frame = await screenshot({ screen: 1 })
        await handleFrame(frame)
        const now = Date.now()
        const time = (now - lastFrame) / 1000
        lastFrame = now
        console.log(`Frame time: ${time}`)
    }
}
main()