# offline-geo-from-ip

Get geo location information from an IP address. This is a forked version of [geo-from-ip](https://github.com/VikramTiwari/geo-from-ip) modified to include a local database.

## Installation

```sh
npm install --save offline-geo-from-ip
```

## Usage

```javascript
var geoIP = require('offline-geo-from-ip');

console.log(geoIP.allData('199.188.195.120'));

/*
{ code: { state: 'CA', country: 'US', continent: 'NA' },
  city: 'San Francisco',
  state: 'California',
  country: 'United States',
  continent: 'North America',
  postal: '94103',
  location:
   { accuracy_radius: 10,
     latitude: 37.7758,
     longitude: -122.4128,
     metro_code: 807,
     time_zone: 'America/Los_Angeles' } }
 */
```

## Credits

Original version created by [Vikram Tiwari](https://vikramtiwari.com)

## License

Licensed under [MIT License](LICENSE)
