import fs from 'node:fs';

import { getDateWithoutTime } from '../utils/date.js';

export class Logger {
    constructor() {
        if (!fs.existsSync('./logs')) {
            fs.mkdirSync('./logs');
        }
    }

    #persistLogs(entryLog) {
        if (!fs.existsSync(`./logs/${getDateWithoutTime()}.txt`)) {
            fs.writeFileSync(`./logs/${getDateWithoutTime()}.txt`, '');
        }

        fs.appendFileSync(`./logs/${getDateWithoutTime()}.txt`, entryLog, (error) => {
            if (error) {
                console.error('Fail to write log file:', error);
                console.error('Entry:', entryLog);
            }
        });
    }

    log(type, data) {
        const entryLog = `[${new Date().toLocaleString()}] [${type.toUpperCase()}] ${JSON.stringify(data)}\n`;
        console.log(entryLog);
        this.#persistLogs(entryLog);
    }
}
