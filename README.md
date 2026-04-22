# offline-geo-from-ip

Get geo location information from an IP address without an internet connection.

## Installation

```sh
npm install --save offline-geo-from-ip
```

## Usage

```javascript
var geo = require('offline-geo-from-ip');

// Full data for an IP
console.log(geo.allData('199.188.195.120'));
/*
{
  code: { state: 'CA', country: 'US', continent: 'NA' },
  city: 'San Francisco',
  state: 'California',
  country: 'United States',
  continent: 'North America',
  postal: '94103',
  location: {
    accuracy_radius: 10,
    latitude: 37.7758,
    longitude: -122.4128,
    metro_code: 807,
    time_zone: 'America/Los_Angeles'
  }
}
*/

// Convenience helpers (return a single value or null)
geo.city('199.188.195.120');     // 'San Francisco'
geo.country('199.188.195.120');  // 'United States'
geo.state('199.188.195.120');    // 'California'
geo.location('199.188.195.120'); // { latitude: 37.7758, longitude: -122.4128, ... }
```

## Updating the Database

The library ships with a bundled GeoLite2-City database and works **fully offline with no API key required**.

To refresh the database with the latest data from MaxMind:

1. Create a free MaxMind account at https://www.maxmind.com/en/geolite2/signup
2. Generate a license key under **Services → Manage License Keys** in your account portal
3. Run the update script with your credentials:

```sh
MAXMIND_ACCOUNT_ID=123456 MAXMIND_LICENSE_KEY=your_key npm run update-db
```

MaxMind releases updated databases weekly. You are only required to re-run this if you want fresher IP data — the bundled database will continue to work indefinitely without it.

## License

Licensed under [MIT License](LICENSE)
