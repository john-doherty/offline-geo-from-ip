/**
 * update-db.js
 *
 * Downloads the latest GeoLite2-City database from MaxMind and replaces
 * the bundled database file at ./database/geolite2-city.mmdb.
 *
 * This library works fully offline using the bundled database — you only
 * need to run this script when you want to refresh it with newer data.
 *
 * Prerequisites:
 *   1. Create a free MaxMind account at https://www.maxmind.com/en/geolite2/signup
 *   2. Generate a license key in your account portal under "Manage License Keys"
 *   3. Set the two environment variables below before running the script
 *
 * Usage:
 *   MAXMIND_ACCOUNT_ID=123456 MAXMIND_LICENSE_KEY=xxxx node scripts/update-db.js
 *
 * Or via npm (after adding the credentials to your environment):
 *   npm run update-db
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const zlib = require('zlib');
const tar = require('tar');

const ACCOUNT_ID = process.env.MAXMIND_ACCOUNT_ID;
const LICENSE_KEY = process.env.MAXMIND_LICENSE_KEY;
const DB_PATH = path.resolve(__dirname, '../database/geolite2-city.mmdb');
const DOWNLOAD_URL = 'https://download.maxmind.com/geoip/databases/GeoLite2-City/download?suffix=tar.gz';

if (!ACCOUNT_ID || !LICENSE_KEY) {
    console.error('Error: MAXMIND_ACCOUNT_ID and MAXMIND_LICENSE_KEY environment variables are required.');
    console.error('Get a free license key at https://www.maxmind.com/en/geolite2/signup');
    process.exit(1);
}

/**
 * Downloads the GeoLite2-City tar.gz from MaxMind, extracts the .mmdb file,
 * and writes it to the database directory.
 *
 * @returns {Promise<void>}
 */
function updateDatabase() {
    // Build Basic Auth header from account ID and license key
    const auth = Buffer.from(`${ACCOUNT_ID}:${LICENSE_KEY}`).toString('base64');

    console.log('Downloading GeoLite2-City database from MaxMind...');

    return new Promise((resolve, reject) => {
        /**
         * Makes an HTTPS GET request, following redirects automatically.
         *
         * @param {string} url - The URL to request
         */
        function get(url) {
            const options = {
                headers: {
                    // Use Basic Auth — MaxMind requires account ID + license key
                    Authorization: `Basic ${auth}`
                }
            };

            https.get(url, options, (response) => {
                // MaxMind redirects to a pre-signed CDN URL — follow it
                if (response.statusCode === 302 || response.statusCode === 301) {
                    return get(response.headers.location);
                }

                if (response.statusCode !== 200) {
                    return reject(new Error(`Download failed with HTTP ${response.statusCode}. Check your credentials.`));
                }

                // Pipe: HTTP response → gunzip → tar extract → write .mmdb to disk
                const extract = tar.extract({
                    // Called for each file entry in the tar archive
                    filter: (filePath) => filePath.endsWith('.mmdb'),
                    // Strip the top-level directory from the tar path (e.g. GeoLite2-City_20240101/)
                    strip: 1,
                    cwd: path.dirname(DB_PATH)
                });

                extract.on('finish', () => {
                    console.log(`Database updated successfully: ${DB_PATH}`);
                    resolve();
                });

                extract.on('error', reject);

                response.pipe(zlib.createGunzip()).pipe(extract);
            }).on('error', reject);
        }

        get(DOWNLOAD_URL);
    });
}

updateDatabase().catch((err) => {
    console.error('Failed to update database:', err.message);
    process.exit(1);
});
