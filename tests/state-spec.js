const geo = require('../index.js');

describe('state()', () => {

    it('should be exported as a function', () => {
        expect(typeof geo.state).toBe('function');
    });

    it('should return the state name for a known IP', () => {
        expect(geo.state('134.209.184.245')).toBe('England');
    });

    it('should match the state field returned by allData()', () => {
        const ip = '134.209.184.245';
        expect(geo.state(ip)).toBe(geo.allData(ip).state);
    });

    it('should return null for an invalid IP string', () => {
        expect(geo.state('not-an-ip')).toBeNull();
    });

    it('should return null for null input', () => {
        expect(geo.state(null)).toBeNull();
    });

    it('should return null for undefined input', () => {
        expect(geo.state(undefined)).toBeNull();
    });

});
