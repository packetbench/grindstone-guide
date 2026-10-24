'use strict';
// Loopback-only preview. Keep the detached process alive while coaches review.
const http = require('node:http'), fs = require('node:fs'), path = require('node:path');
const root = fs.realpathSync(path.resolve(__dirname, '..'));
const port = Number(process.argv[2] || 50784);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw Error('Invalid preview port');
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.svg':'image/svg+xml','.pdf':'application/pdf','.zip':'application/zip','.txt':'text/plain; charset=utf-8','.md':'text/plain; charset=utf-8'};
const within = file => file.toLowerCase().startsWith((root + path.sep).toLowerCase());
http.createServer((req,res) => {
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Content-Type-Options','nosniff');
  if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405); return res.end(); }
  let route;
  try { route = decodeURIComponent(new URL(req.url, 'http://127.0.0.1:' + port).pathname); }
  catch { res.writeHead(400); return res.end('Bad request'); }
  if (route.split(/[\\/]/).some(part => part.startsWith('.'))) { res.writeHead(404); return res.end('Not found'); }
  const file = path.resolve(root, '.' + (route === '/' ? '/index.html' : route));
  if (!within(file)) { res.writeHead(404); return res.end('Not found'); }
  fs.realpath(file, (err, real) => {
    if (err || !within(real)) { res.writeHead(404); return res.end('Not found'); }
    fs.stat(real, (err, stat) => {
      if (err || !stat.isFile()) { res.writeHead(404); return res.end('Not found'); }
      res.writeHead(200, {'Content-Type':types[path.extname(real).toLowerCase()] || 'application/octet-stream','Content-Length':stat.size});
      if (req.method === 'HEAD') return res.end();
      const stream = fs.createReadStream(real); stream.on('error', () => res.destroy()); stream.pipe(res);
    });
  });
}).listen(port, '127.0.0.1', () => console.log('Preview: http://127.0.0.1:' + port + '/'));
