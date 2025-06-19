const geo = require('../index.js')

const testCases = [
    { ip: '134.209.184.245', label: 'Orca Scan'},
    { ip: '212.145.34.191', label: 'Regus Malaga'},
    { ip: '134.209.54.235', label: 'Digital Ocean London' }
];

testCases.forEach(({ ip, label }) => {
    describe(`allData() with ${ip} (${label})`, () => {
        const result = geo.allData(ip);

        it('should return city level information', () => {
            expect(result.city).toBeDefined();
            expect(typeof result.city).toBe('string');
        });

        it('should return state level information', () => {
            expect(result.state).toBeDefined();
            expect(typeof result.state).toBe('string');
        });

        it('should return country level information', () => {
            expect(result.country).toBeDefined();
            expect(typeof result.country).toBe('string');
        });

        it('should return continent level information', () => {
            expect(result.continent).toBeDefined();
            expect(typeof result.continent).toBe('string');
        });

        it('should return location information', () => {
            expect(result.location).toBeDefined();
            expect(typeof result.location).toBe('object');
            expect(typeof result.location.latitude).toBe('number');
            expect(typeof result.location.longitude).toBe('number');
            expect(typeof result.location.accuracy_radius).toBe('number');
            expect(typeof result.location.time_zone).toBe('string');
        });

        it('should return a valid postal code', () => {
            expect(result.postal).toBeDefined();
            expect(typeof result.postal).toBe('string');
        });

        it('should include state ISO code in result.code', () => {
            expect(result.code).toBeDefined();
            expect(typeof result.code.state).toBe('string');
        });

        it('should include country ISO code in result.code', () => {
            expect(result.code).toBeDefined();
            expect(typeof result.code.country).toBe('string');
        });

        it('should include continent code in result.code', () => {
            expect(result.code).toBeDefined();
            expect(typeof result.code.continent).toBe('string');
        });
    });
});