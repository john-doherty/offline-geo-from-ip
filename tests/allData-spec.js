const geo = require('../index.js');

describe('allData()', () => {

    it('should be exported as a function', () => {
        expect(typeof geo.allData).toBe('function');
    });

    it('should return correct data for 134.209.184.245 (Slough, UK)', () => {
        const result = geo.allData('134.209.184.245');
        expect(result.city).toBe('Slough');
        expect(result.state).toBe('England');
        expect(result.country).toBe('United Kingdom');
        expect(result.continent).toBe('Europe');
        expect(result.postal).toBe('SL1');
        expect(result.code.state).toBe('ENG');
        expect(result.code.country).toBe('GB');
        expect(result.code.continent).toBe('EU');
        expect(result.location.latitude).toBeGreaterThanOrEqual(-90);
        expect(result.location.latitude).toBeLessThanOrEqual(90);
        expect(result.location.longitude).toBeGreaterThanOrEqual(-180);
        expect(result.location.longitude).toBeLessThanOrEqual(180);
        expect(typeof result.location.accuracy_radius).toBe('number');
        expect(typeof result.location.time_zone).toBe('string');
    });

    it('should return correct data for 212.145.34.191 (Madrid, Spain)', () => {
        const result = geo.allData('212.145.34.191');
        expect(result.city).toBe('Madrid');
        expect(result.state).toBe('Madrid');
        expect(result.country).toBe('Spain');
        expect(result.continent).toBe('Europe');
        expect(result.postal).toBe('28017');
        expect(result.code.state).toBe('MD');
        expect(result.code.country).toBe('ES');
        expect(result.code.continent).toBe('EU');
        expect(result.location.latitude).toBeGreaterThanOrEqual(-90);
        expect(result.location.latitude).toBeLessThanOrEqual(90);
        expect(result.location.longitude).toBeGreaterThanOrEqual(-180);
        expect(result.location.longitude).toBeLessThanOrEqual(180);
        expect(typeof result.location.accuracy_radius).toBe('number');
        expect(typeof result.location.time_zone).toBe('string');
    });

    it('should return correct data for 134.209.54.235 (Santa Clara, US)', () => {
        const result = geo.allData('134.209.54.235');
        expect(result.city).toBe('Santa Clara');
        expect(result.state).toBe('California');
        expect(result.country).toBe('United States');
        expect(result.continent).toBe('North America');
        expect(result.postal).toBe('95051');
        expect(result.code.state).toBe('CA');
        expect(result.code.country).toBe('US');
        expect(result.code.continent).toBe('NA');
        expect(result.location.latitude).toBeGreaterThanOrEqual(-90);
        expect(result.location.latitude).toBeLessThanOrEqual(90);
        expect(result.location.longitude).toBeGreaterThanOrEqual(-180);
        expect(result.location.longitude).toBeLessThanOrEqual(180);
        expect(typeof result.location.accuracy_radius).toBe('number');
        expect(typeof result.location.time_zone).toBe('string');
    });

    it('should return ISO country and continent codes in the correct format', () => {
        // Country codes are always 2 uppercase letters (ISO 3166-1 alpha-2)
        // Continent codes are always 2 uppercase letters (AF, AN, AS, EU, NA, OC, SA)
        const result = geo.allData('134.209.184.245');
        expect(result.code.country).toMatch(/^[A-Z]{2}$/);
        expect(result.code.continent).toMatch(/^[A-Z]{2}$/);
    });

    it('should not include error or ip properties on a successful lookup', () => {
        const result = geo.allData('134.209.184.245');
        expect(result.error).toBeUndefined();
        expect(result.ip).toBeUndefined();
    });

    it('should handle an IPv6 address and return country-level data', () => {
        // Google Public DNS (2001:4860:4860::8888) maps to United States
        const result = geo.allData('2001:4860:4860::8888');
        expect(result.error).toBeUndefined();
        expect(result.country).toBe('United States');
        expect(result.continent).toBe('North America');
        expect(result.code.country).toBe('US');
        expect(result.code.continent).toBe('NA');
    });

    it('should handle an IPv4 address ending in .0 without a fallback workaround', () => {
        // The old maxmind-db-reader required a last-octet workaround — maxmind handles this natively
        const result = geo.allData('134.209.184.0');
        expect(typeof result).toBe('object');
    });

    it('should return { error: NA } for an invalid IP string', () => {
        const result = geo.allData('not-an-ip');
        expect(result.error).toBe('NA');
        expect(result.ip).toBe('not-an-ip');
    });

    it('should return { error: NA } for null input', () => {
        expect(geo.allData(null).error).toBe('NA');
    });

    it('should return { error: NA } for undefined input', () => {
        expect(geo.allData(undefined).error).toBe('NA');
    });

    it('should return { error: NA } for an empty string', () => {
        expect(geo.allData('').error).toBe('NA');
    });

    it('should return { error: NA } for a private/local IP', () => {
        expect(geo.allData('192.168.1.1').error).toBe('NA');
    });

});
