const zlib = require('zlib');
const http = require('http');
const fs = require('fs');



http.createServer((request, response) => {
    const raw = fs.createReadStream(__dirname + '/index.html');
    const acceptEncoding = request.headers['accept-encoding'] || '';
    response.setHeader('Content-Type', 'text/plain');

    if (acceptEncoding.includes('gzip')) {
        response.setHeader('Content-Encoding', 'gzip');
        raw.pipe(zlib.createGzip()).pipe(response);
    } else {
        raw.pipe(response);
    }
}).listen(process.env.PORT || 1337);

