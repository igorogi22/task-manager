import http from 'node:http';

import { Logger } from './middlewares/logger.js';
import { json } from './middlewares/json.js';

const logger = new Logger();

const server = http.createServer(async (request, response) => {
    await json(request, response);
    
    console.log(`${request.method} ${request.url} \n`);

    logger.log('request', {
        url: request.url,
        method: request.method,
        headers: request.headers,
        body: request.body,
    });

    logger.log('Not found', {
        url: request.url,
        method: request.method,
        headers: request.headers,
        body: request.body,
    });

    return response
        .writeHead(404)
        .end();
});

server.listen(3333, () => {
    console.log(`Server is running on http://localhost:3000 `);
});