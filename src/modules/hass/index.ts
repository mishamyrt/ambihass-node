import { request } from 'http'

function calculateBrigthness(color, modifier) {
    const [R, G, B] = color
    return ((R + R + B + G + G + G) / 6) * modifier
}

function debounce(f, ms) {

    let isCooldown = false;

    return function () {
        if (isCooldown) return;

        f.apply(this, arguments);

        isCooldown = true;

        setTimeout(() => isCooldown = false, ms);
    };

}

export function createColorist(token, host, port = 8123) {
    const cooldownTime = 200
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

    let cooldown = false

    return (entity, color, modifier) => {
        if (cooldown) {
            return
        }
        const req = request(options)
        req.write(JSON.stringify({
            entity_id: entity,
            rgb_color: color,
            brightness: calculateBrigthness(color, modifier)
        }))
        cooldown = true
        setTimeout(() => { cooldown = false }, cooldownTime)
        req.end()
    }
}
