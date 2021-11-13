const FastAverageColor = require('fast-average-color');

const fac = new FastAverageColor();

function sliceImage({ data, width, height }, start) {
    const row = 4 * width
    const offset = Math.floor(height * start * row)
    return data.slice(offset, offset + (row * 4))
}

function getRGB(image) {
    return new Promise(resolve =>
        resolve(fac.getColorFromArray4(image, { algorithm: 'dominant' }).slice(0, 3))
    )
}

module.exports = {
    sliceImage,
    getRGB
}