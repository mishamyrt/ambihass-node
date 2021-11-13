const screenshot = require('screenshot-desktop')
const pixels = require('image-pixels')
const { sliceImage, getRGB } = require('./modules/image')
const { token, host } = require('../env.json')
const { createColorist } = require('./modules/hass')

const writeColor = createColorist(token, host)

const handleFrame = () => screenshot({ screen: 1 })
    .then(pixels)
    .then(image => [
        sliceImage(image, 0.01,),
        sliceImage(image, 0.6),
        sliceImage(image, 0.99),
    ])
    .then(slices => slices.map(getRGB))
    .then(slices => {
        slices[0].then(c => writeColor('light.screen_bar_back', c, 1))
        slices[1].then(c => writeColor('light.screen_back_middle', c, 0.7))
        slices[2].then(c => writeColor('light.desk_backlight', c, 0.5))
    })
    .catch(console.error)

async function main() {
    while (true) {
        await handleFrame()
        console.log(Date.now())
    }
}
main()