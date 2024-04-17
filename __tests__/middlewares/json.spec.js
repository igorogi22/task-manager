import { json } from '../../src/middlewares/json.js';

describe('JSON Middleware', () => {
    it('should parse JSON body', async () => {
        const requestBody = { nome: "John Doe" };

        const request = {
            [Symbol.asyncIterator]: () => ({
                next: jest.fn()
                    .mockResolvedValueOnce({ done: false, value: Buffer.from(JSON.stringify(requestBody)) })
                    .mockResolvedValueOnce({ done: true }),
            }),
        };

        const response = {
            setHeader: jest.fn(),
        };
        await json(request, response);

        expect(request.body).toEqual(requestBody);
        expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    });

    it('should set body as null if request has no body', async () => {
        const request = {
            [Symbol.asyncIterator]: () => ({
                next: jest.fn()
                    .mockResolvedValueOnce({ done: true }),
            }),
        };

        const response = {
            setHeader: jest.fn(),
        };
        await json(request, response);

        expect(request.body).toBeNull();
        expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    });
});
