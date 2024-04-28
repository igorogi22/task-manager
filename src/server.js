import http from 'node:http';

import routes from './routes.js';
import { Logger } from './middlewares/logger.js';
import { json } from './middlewares/json.js';
import { extractQueryParams } from './utils/extract-query-params.js';

const logger = new Logger();

const server = http.createServer(async (request, response) => {
    const { method, url } = request;
    await json(request, response);
    
    console.log(`${method} ${url} \n`);

    const route = routes.find(r => r.method == method && r.path.test(url));

    logger.log('request', {
        url: request.url,
        method: request.method,
        headers: request.headers,
        body: request.body,
    });

    if (route) {
        const { query, ...params } = url.match(route.path).groups;

        request.params = params;
        request.query = query ? extractQueryParams(query) : {};

        return route.handle(request, response);
    }

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