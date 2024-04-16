import { getDateWithoutTime } from '../../src/utils/date.js';
describe('Date utils', () => {
    describe('getDateWithoutTime', () => {
        it('should return date without time', () => {
            const date = new Date('2024-01-01T12:00:00');
            const dateWithNumbersBiggerThanTen = new Date('2024-11-11T12:00:00');
            expect(getDateWithoutTime(date)).toBe('01-01-2024');
            expect(getDateWithoutTime(dateWithNumbersBiggerThanTen)).toBe('11-11-2024');
        })
    });
});