import fs from 'node:fs';

import { Logger } from '../../src/middlewares/logger.js';
import { getDateWithoutTime } from '../../src/utils/date.js';

describe('Logger', () => {
    let logger;

    beforeEach(() => {
        logger = new Logger();
    });

    it('should log a message with the specified type and data', () => {
        const consoleSpy = jest.spyOn(console, 'log');
        const data = { message: 'Some log message' };

        logger.log('info', data);

        expect(consoleSpy).toHaveBeenCalledWith(`[${new Date().toLocaleString()}] [${'info'.toUpperCase()}] ${JSON.stringify(data)}\n`);
    });

    it('should validade if constructor is creating log path', () => {
        fs.rmdirSync('./logs', { recursive: true });

        new Logger();

        expect(fs.existsSync('./logs')).toBe(true);
    });

    it('should should validade if persist is creating log file', () => {
        if (fs.existsSync(`./logs/${getDateWithoutTime()}.txt`)) {
            fs.unlinkSync(`./logs/${getDateWithoutTime()}.txt`);
        }
        
        logger.log('info', 'Some log message');

        expect(fs.existsSync(`./logs/${getDateWithoutTime()}.txt`)).toBe(true);
    });
});
