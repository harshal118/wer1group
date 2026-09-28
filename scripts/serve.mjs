import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname } from 'node:path';

// Serve only public site files; never expose .env, .git or source modules.
const root = new URL('../', import.meta.url);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.jpg': 'image/jpeg', '.png': 'image/png' };
const server = createServer(async (request, response) => {
  const path = new URL(request.url, 'http://localhost').pathname;
  const file = path === '/' ? 'index.html' : path.slice(1);
  if (!['GET', 'HEAD'].includes(request.method) || !/^(index\.html|style\.css|assets\/navigation\.js|assets\/images\/[a-z-]+\.jpg|public\/images\/projects\/(completed|ongoing|upcoming)\/[a-z0-9-]+\.png)$/.test(file)) {
    response.writeHead(404); response.end('Not found'); return;
  }
  try {
    const body = await readFile(new URL(file, root));
    response.writeHead(200, { 'Content-Type': mime[extname(file)], 'Cache-Control': 'no-cache' });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch {
    response.writeHead(404); response.end('Not found');
  }
});
server.listen(4173, '127.0.0.1', () => console.log('WER1 preview: http://127.0.0.1:4173'));
