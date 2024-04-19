import { extractQueryParams } from "../../src/utils/extract-query-params";

describe('extractQueryParams', () => {
    it('should return an object with the query params', () => {
        const query = '?active=true&limit=10';
        const queryParams = extractQueryParams(query);

        expect(queryParams).toEqual({ active: 'true', limit: '10' });
    });
});