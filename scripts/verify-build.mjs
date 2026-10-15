import assert from 'node:assert/strict';
import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { resolve, dirname, relative, sep } from 'node:path';

const output = resolve('dist');
const html = await readFile(resolve(output, 'index.html'), 'utf8');
// Explicit route shells preserve the requested URL without Pages' blanket SPA fallback.
for (const route of ['about', 'contact', 'projects']) {
  await writeFile(resolve(output, `${route}.html`), html);
}
const referenced = [...html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)"/g)].map(match => match[1]);
assert(referenced.some(path => path.endsWith('.css')), 'Built HTML must reference a CSS bundle');
assert(referenced.some(path => path.endsWith('.js')), 'Built HTML must reference a JavaScript bundle');

async function verifyFile(path) {
  const file = resolve(output, `.${path}`);
  assert(!relative(output, file).startsWith(`..${sep}`), `Asset escapes dist: ${path}`);
  assert((await stat(file)).size > 0, `Empty asset: ${path}`);
  if (/\.(css|js)$/.test(path)) {
    const text = await readFile(file, 'utf8');
    assert(!/^\s*(?:<!doctype html|<html)/i.test(text), `HTML at asset path: ${path}`);
    if (path.endsWith('.css')) {
      for (const match of text.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)) {
        const url = match[1];
        if (/^(?:data:|https?:|\/\/|#)/.test(url)) continue;
        const target = url.startsWith('/') ? resolve(output, `.${url}`) : resolve(dirname(file), url);
        await stat(target.split(/[?#]/)[0]);
      }
    }
  }
}
for (const path of new Set(referenced)) await verifyFile(path);

// Enumerate actual Vite outputs: a nonexistent asset must never inherit immutable caching.
const assets = (await readdir(resolve(output, 'assets'))).sort();
assert(assets.every(name => /-[\w-]{8,}\.[\w.]+$/.test(name)), 'Unexpected non-fingerprinted asset in dist/assets');
const baseHeaders = await readFile('public/_headers', 'utf8');
assert(baseHeaders.split('\n').filter(line => line.startsWith('/')).length + assets.length <= 100, 'Cloudflare Pages header-rule limit exceeded');
for (const name of assets) await verifyFile(`/assets/${name}`);
await writeFile(resolve(output, '_headers'), `${baseHeaders}\n${assets.map(name => `/assets/${name}\n  Cache-Control: public, max-age=31536000, immutable\n`).join('\n')}`);
assert((await readFile(resolve(output, '404.html'), 'utf8')).includes('Not Found'), '404.html is required to disable implicit SPA fallback');
assert(!(await readFile(resolve(output, '_redirects'), 'utf8')).split('\n').some(line => /^\s*\/\*/.test(line)), 'Do not add a catch-all SPA rewrite');
console.log(`Verified ${new Set(referenced).size} HTML asset references and ${assets.length} fingerprinted files; generated exact asset cache rules.`);
