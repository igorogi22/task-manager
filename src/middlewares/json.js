export async function json(request, response) {
    const buffers = [];

    for await (const chunk of request) {
        buffers.push(chunk);
    }
    
    try {
        let boundary = '';
    
        const parts = Buffer.concat(buffers).toString().split(`--${boundary}`);
    
        const contentType = request.headers['content-type'];
        const boundaryIndex = contentType.indexOf('boundary=');
    
        if (boundaryIndex !== -1) {
            boundary = contentType.substring(boundaryIndex + 'boundary='.length);
        }
    
    
        const filePart = parts.find(part => part.includes('filename'));
    
        if (filePart) {
            const [, filename] = filePart.match(/filename="(.+?)"/);
        
            const csvData = filePart.split('\r\n\r\n')[1];
        
            const lines = csvData.trim().split('\n');
    
            request.csvData = lines;
        }
    } catch {
        request.csvData = null;
    }

    try {
        request.body = JSON.parse(Buffer.concat(buffers).toString());
    } catch {
        request.body = null;
    }

    response.setHeader('Content-type', 'application/json');
}