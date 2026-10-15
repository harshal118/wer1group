import assert from 'node:assert/strict';

const base = process.argv[2];
assert(base, 'Usage: node scripts/check-delivery.mjs http://localhost:4174 (Cloudflare Pages, not Vite preview)');
const get = path => fetch(new URL(path, base));
const home = await get('/');
assert.equal(home.status, 200);
const html = await home.text();
const assets = [...new Set([...html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)"/g)].map(match => match[1]))];
assert(assets.some(path => path.endsWith('.css')) && assets.some(path => path.endsWith('.js')));
for (const path of assets) {
  const response = await get(path);
  assert.equal(response.status, 200, path);
  const type = response.headers.get('content-type');
  assert(type && !type.includes('text/html'), `${path}: ${type}`);
  if (path.endsWith('.css')) assert(type.includes('text/css'), path);
  if (path.endsWith('.js')) assert(/(?:javascript|ecmascript)/.test(type), path);
  assert.match(response.headers.get('cache-control') ?? '', /max-age=31536000.*immutable/, path);
  assert(!/^\s*<!doctype html/i.test(await response.text()), path);
}
for (const path of ['/', '/about', '/about/', '/contact', '/contact/', '/projects', '/projects/', '/projects?filter=ongoing']) {
  const response = await get(path);
  assert.equal(response.status, 200, path);
  const expected = new URL(path, base);
  const actual = new URL(response.url);
  assert.equal(actual.pathname.replace(/\/$/, ''), expected.pathname.replace(/\/$/, ''), `Unexpected page redirect: ${path}`);
  assert.equal(actual.search, expected.search, `Query lost: ${path}`);
  assert.match(response.headers.get('content-type') ?? '', /text\/html/, path);
  assert.match(response.headers.get('cache-control') ?? '', /max-age=0.*must-revalidate/, path);
  assert.equal(await response.text(), html, path);
}
for (const path of ['/assets/missing-delivery-check.css', '/assets/missing-delivery-check.js', '/media/missing-delivery-check.webp', '/missing-page-delivery-check']) {
  const response = await get(path);
  assert.equal(response.status, 404, path);
  assert(!/immutable|31536000/.test(response.headers.get('cache-control') ?? ''), path);
  assert.notEqual(await response.text(), html, path);
}
console.log(`Delivery passed: ${assets.length} assets, all page routes, cache policies, and missing-resource 404s.`);
