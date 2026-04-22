const geo = require('../index.js');

describe('country()', () => {

    it('should be exported as a function', () => {
        expect(typeof geo.country).toBe('function');
    });

    it('should return the country name for a known IP', () => {
        expect(geo.country('134.209.184.245')).toBe('United Kingdom');
    });

    it('should match the country field returned by allData()', () => {
        const ip = '134.209.184.245';
        expect(geo.country(ip)).toBe(geo.allData(ip).country);
    });

    it('should return null for an invalid IP string', () => {
        expect(geo.country('not-an-ip')).toBeNull();
    });

    it('should return null for null input', () => {
        expect(geo.country(null)).toBeNull();
    });

    it('should return null for undefined input', () => {
        expect(geo.country(undefined)).toBeNull();
    });

});
