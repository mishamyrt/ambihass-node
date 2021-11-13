const http = require('http')

function calculateBrigthness(color, modifier) {
    const [R, G, B] = color
    return ((R + R + B + G + G + G) / 6) * modifier
}

function createColorist(token, host, port = 8123) {
    const options = {
        hostname: host,
        port,
        path: '/api/services/light/turn_on',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'content-type': 'application/json',
        }
    }

    return (entity, color, modifier) =>
        new Promise((resolve, reject) => {
            const req = http.request(options, res => res.on('data', resolve))
            req.on('error', reject)
            req.write(JSON.stringify({
                entity_id: entity,
                rgb_color: color,
                brightness: calculateBrigthness(color, modifier)
            }))
            req.end()
        })
}

module.exports = {
    createColorist
}