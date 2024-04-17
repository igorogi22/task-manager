import http from 'node:http';

import { json } from './middlewares/json.js';

const server = http.createServer(async (request, response) => {
    await json(request, response);

    return response
        .writeHead(404)
        .end();
});

server.listen(3333, () => {
    console.log(`Server is running on http://localhost:3333`);
});