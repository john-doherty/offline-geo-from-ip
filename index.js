const fs = require('fs');
const path = require('path');
const maxmind = require('maxmind');

// Load the local GeoLite2 database file into memory once when the module is first required.
// This is a synchronous read — fast on startup and means no file I/O on every lookup.
const dbPath = path.resolve(__dirname, './database/geolite2-city.mmdb');
const db = new maxmind.Reader(fs.readFileSync(dbPath));

/**
 * @typedef {Object} GeoLocation
 * @property {number} latitude - Approximate latitude
 * @property {number} longitude - Approximate longitude
 * @property {number} accuracy_radius - Accuracy radius in km
 * @property {string} [time_zone] - IANA time zone string e.g. 'America/New_York'
 */

/**
 * @typedef {Object} GeoCode
 * @property {string|null} state - ISO code for the state/subdivision e.g. 'CA'
 * @property {string|null} country - ISO country code e.g. 'US'
 * @property {string|null} continent - Continent code e.g. 'NA'
 */

/**
 * @typedef {Object} GeoResult
 * @property {string|null} [city] - City name e.g. 'San Francisco'
 * @property {string|null} [state] - State or subdivision name e.g. 'California'
 * @property {string|null} [country] - Country name e.g. 'United States'
 * @property {string|null} [continent] - Continent name e.g. 'North America'
 * @property {string|null} [postal] - Postal / zip code e.g. '94103'
 * @property {GeoLocation} [location] - Lat/lng and time zone
 * @property {GeoCode} [code] - ISO codes for state, country, and continent
 * @property {string} [error] - Set to 'NA' when no data is found for the IP
 * @property {string} [ip] - The original IP address (only present when error is set)
 */

/**
 * Returns full geo location data for a given IP address.
 * Works fully offline using the bundled GeoLite2 database.
 * Supports both IPv4 and IPv6.
 *
 * @param {string} ip - IPv4 or IPv6 address to look up e.g. '134.209.184.245'
 * @returns {GeoResult} Structured location data, or `{ error: 'NA', ip }` if not found
 *
 * @example
 * const geo = require('offline-geo-from-ip');
 * geo.allData('134.209.184.245');
 * // { city: 'London', state: 'England', country: 'United Kingdom', ... }
 */
function allData(ip) {
    // Reject anything that isn't a valid IP address (IPv4 or IPv6)
    if (!ip || !maxmind.validate(ip)) {
        return { error: 'NA', ip: ip };
    }

    // Query the local database — returns null if the IP has no record
    const geodata = db.get(ip);

    if (!geodata) {
        return { error: 'NA', ip: ip };
    }

    const result = {
        code: {}
    };

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
 * Returns the city name for a given IP address.
 *
 * @param {string} ip - IPv4 or IPv6 address e.g. '134.209.184.245'
 * @returns {string|null} City name, or null if not found
 *
 * @example
 * geo.city('134.209.184.245'); // 'London'
 */
function city(ip) {
    return allData(ip).city || null;
}

/**
 * Returns the country name for a given IP address.
 *
 * @param {string} ip - IPv4 or IPv6 address e.g. '134.209.184.245'
 * @returns {string|null} Country name, or null if not found
 *
 * @example
 * geo.country('134.209.184.245'); // 'United Kingdom'
 */
function country(ip) {
    return allData(ip).country || null;
}

/**
 * Returns the state (subdivision) name for a given IP address.
 *
 * @param {string} ip - IPv4 or IPv6 address e.g. '134.209.184.245'
 * @returns {string|null} State/subdivision name, or null if not found
 *
 * @example
 * geo.state('134.209.184.245'); // 'England'
 */
function state(ip) {
    return allData(ip).state || null;
}

/**
 * Returns the location object (lat/lng, accuracy radius, time zone) for a given IP address.
 *
 * @param {string} ip - IPv4 or IPv6 address e.g. '134.209.184.245'
 * @returns {GeoLocation|null} Location object, or null if not found
 *
 * @example
 * geo.location('134.209.184.245');
 * // { latitude: 51.5, longitude: -0.13, accuracy_radius: 20, time_zone: 'Europe/London' }
 */
function location(ip) {
    return allData(ip).location || null;
}

module.exports = { allData, city, country, state, location };