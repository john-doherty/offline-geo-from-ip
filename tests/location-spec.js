const geo = require('../index.js');

describe('location()', () => {

    it('should be exported as a function', () => {
        expect(typeof geo.location).toBe('function');
    });

    it('should return a location object with valid coordinates for a known IP', () => {
        const result = geo.location('134.209.184.245');
        expect(result).not.toBeNull();
        expect(typeof result).toBe('object');
        expect(typeof result.latitude).toBe('number');
        expect(result.latitude).toBeGreaterThanOrEqual(-90);
        expect(result.latitude).toBeLessThanOrEqual(90);
        expect(typeof result.longitude).toBe('number');
        expect(result.longitude).toBeGreaterThanOrEqual(-180);
        expect(result.longitude).toBeLessThanOrEqual(180);
        expect(typeof result.accuracy_radius).toBe('number');
        expect(typeof result.time_zone).toBe('string');
    });

    it('should match the location field returned by allData()', () => {
        const ip = '134.209.184.245';
        expect(geo.location(ip)).toEqual(geo.allData(ip).location);
    });

    it('should return null for an invalid IP string', () => {
        expect(geo.location('not-an-ip')).toBeNull();
    });

    it('should return null for null input', () => {
        expect(geo.location(null)).toBeNull();
    });

    it('should return null for undefined input', () => {
        expect(geo.location(undefined)).toBeNull();
    });

});
