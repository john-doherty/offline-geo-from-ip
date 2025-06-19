const path = require('path');
const mmdbreader = require('maxmind-db-reader');

const city = mmdbreader.openSync(
    path.resolve(__dirname, './database/geolite2-city.mmdb')
);

/**
 * Attempts to get GeoLite2 data for a given IP, optionally allowing fallback for city info
 * @param {string} ip - The IP address to look up
 * @returns {Object} result - Structured location data (city, state, country, etc.)
 */
function allData(ip) {
    // try primary lookup
    let geodata = city.getGeoDataSync(ip);

    // fallback: retry with x.x.x.0 if city is missing and it's IPv4
    // issue pointed out here -> https://github.com/PaddeK/node-maxmind-db?tab=readme-ov-file#warning
    if ((!geodata || !geodata.city) && isIPv4(ip)) {
        const fallbackIp = replaceLastIPv4OctetWithZero(ip);
        if (fallbackIp !== ip) {
            const fallbackData = city.getGeoDataSync(fallbackIp);
            if (fallbackData && fallbackData.city) {
                geodata = fallbackData; // use fallback data only if it adds city
            }
        }
    }

    const result = {
        code: {}
    };

    if (!geodata) {
        result.error = 'NA';
        result.ip = ip;
        return result;
    }

    result.city = geodata.city?.names?.en || null;

    if (geodata.subdivisions?.length) {
        const state = geodata.subdivisions[0];
        result.state = state.names?.en || null;
        result.code.state = state.iso_code || null;
    }
    else {
        result.state = null;
        result.code.state = null;
    }

    if (geodata.country) {
        result.country = geodata.country.names?.en || null;
        result.code.country = geodata.country.iso_code || null;
    }

    if (geodata.continent) {
        result.continent = geodata.continent.names?.en || null;
        result.code.continent = geodata.continent.code || null;
    }

    if (geodata.postal) {
        result.postal = geodata.postal.code || null;
    }

    if (geodata.location) {
        result.location = geodata.location;
    }

    return result;
}

/**
 * Returns true if given IP is valid IPv4
 * @param {string} ip
 * @returns {boolean}
 */
function isIPv4(ip) {
    return /^\d{1,3}(\.\d{1,3}){3}$/.test(ip);
}

/**
 * Replaces the last octet of an IPv4 address with '0'
 * @param {string} ip
 * @returns {string}
 */
function replaceLastIPv4OctetWithZero(ip) {
    if (!isIPv4(ip)) return ip;
    const parts = ip.split('.');
    parts[3] = '0';
    return parts.join('.');
}

module.exports.allData = allData;