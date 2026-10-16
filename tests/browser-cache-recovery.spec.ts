import { expect, test } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';

// URLs from the two prior production builds, kept as independent regression fixtures.
const previousAssets = [
  '/assets/index-Wl1tbQ0K.css', '/assets/index-DIJdseVc.js',
  '/assets/index-delivery-WLWeewB0.css', '/assets/index-delivery-DiNUnv4T.js',
];
const poisonedBody = '<!doctype html><html><body>Old SPA fallback</body></html>';

test('same browser session recovers while invalid immutable asset responses remain cached', async ({ page }) => {
  const html = await readFile('dist/index.html', 'utf8');
  for (const entry of ['index', 'about', 'projects', 'contact']) {
    const document = await readFile(`dist/${entry}.html`, 'utf8');
    for (const oldUrl of previousAssets) expect(document).not.toContain(oldUrl);
  }
  let releaseReady = false;
  const oldRequests = new Map<string, number>();
  const types: Record<string, string> = { '.js': 'application/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg' };
  const server = createServer(async (req, res) => {
    const path = new URL(req.url!, 'http://localhost').pathname;
    if (previousAssets.includes(path)) {
      oldRequests.set(path, (oldRequests.get(path) ?? 0) + 1);
      res.writeHead(200, { 'Content-Type': 'text/html', 'Cache-Control': 'public, max-age=31536000, immutable' });
      res.end(poisonedBody);
      return;
    }
    if (path === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html', 'Cache-Control': 'max-age=0, must-revalidate' });
      res.end(releaseReady ? html : '<!doctype html><title>Previous session</title>');
      return;
    }
    try {
      if (!/^\/(assets|media)\//.test(path) || path.includes('..')) throw new Error('Unknown path');
      const data = await readFile(resolve('dist', `.${path}`));
      res.writeHead(200, { 'Content-Type': types[extname(path)] ?? 'application/octet-stream' });
      res.end(data);
    } catch {
      res.writeHead(404, { 'Cache-Control': 'no-store' });
      res.end('Not found');
    }
  });
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Missing test server address');
  const origin = `http://127.0.0.1:${address.port}`;
  try {
    // No Playwright request routing: it disables the real browser HTTP cache.
    await page.goto(origin);
    for (let pass = 0; pass < 2; pass++) {
      const bodies = await page.evaluate(async urls => Promise.all(urls.map(async url => {
        const response = await fetch(url, { cache: 'force-cache' });
        return response.text();
      })), previousAssets);
      expect(bodies).toEqual(previousAssets.map(() => poisonedBody));
    }
    for (const path of previousAssets) expect(oldRequests.get(path)).toBe(1);

    releaseReady = true;
    const requested: string[] = [];
    const errors: string[] = [];
    page.on('request', request => requested.push(new URL(request.url()).pathname));
    page.on('pageerror', error => errors.push(error.message));
    // Ordinary navigation in the same context: no cache clear, hard refresh, or new browser.
    await page.goto(origin);
    await expect(page.locator('#home-showcase')).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => [...document.styleSheets].some(sheet => sheet.href?.includes('/assets/') && sheet.cssRules.length > 0))).toBe(true);
    for (const oldUrl of previousAssets) expect(requested).not.toContain(oldUrl);
    expect(errors).toEqual([]);
    // Poisoned data is still cached, but the new release never needs it.
    await page.evaluate(async urls => Promise.all(urls.map(url => fetch(url, { cache: 'force-cache' }).then(response => response.text()))), previousAssets);
    for (const path of previousAssets) expect(oldRequests.get(path)).toBe(1);
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
});
