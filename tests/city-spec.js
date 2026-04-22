const geo = require('../index.js');

describe('city()', () => {

    it('should be exported as a function', () => {
        expect(typeof geo.city).toBe('function');
    });

    it('should return the city name for a known IP', () => {
        expect(geo.city('134.209.184.245')).toBe('Slough');
    });

    it('should match the city field returned by allData()', () => {
        const ip = '134.209.184.245';
        expect(geo.city(ip)).toBe(geo.allData(ip).city);
    });

    it('should return null for an invalid IP string', () => {
        expect(geo.city('not-an-ip')).toBeNull();
    });

    it('should return null for null input', () => {
        expect(geo.city(null)).toBeNull();
    });

    it('should return null for undefined input', () => {
        expect(geo.city(undefined)).toBeNull();
    });

});
