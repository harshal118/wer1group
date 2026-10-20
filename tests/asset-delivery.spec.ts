import { expect, test } from '@playwright/test';

for (const path of ['/', '/about', '/projects', '/contact']) {
  test(`production assets and responsive rendering at ${path}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {
      const url = new URL(response.url());
      if (url.origin !== new URL(page.url()).origin) return;
      if (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/media/')) {
        if (!response.ok()) errors.push(`${response.status()} ${url.pathname}`);
        if (response.headers()['content-type']?.includes('text/html')) errors.push(`HTML returned for ${url.pathname}`);
      }
    });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    expect(new URL(page.url()).pathname).toBe(path);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://wer1group.in${path}`);
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => [...document.styleSheets].some(sheet => sheet.href?.includes('/assets/') && sheet.cssRules.length > 0))).toBe(true);
    for (const width of [1920, 1440, 1366, 1024, 768, 430, 390]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    await page.locator('footer').scrollIntoViewIfNeeded();
    const images = await page.locator('img').evaluateAll(elements => elements.filter(image => image.complete && image.currentSrc));
    expect(images.length).toBeGreaterThan(0);
    expect(await page.locator('img').evaluateAll(elements => elements.filter(image => image.complete && image.currentSrc).every(image => image.naturalWidth > 0))).toBe(true);
    expect(errors).toEqual([]);
  });
}

for (const [path, selector] of [
  ['/', '#home-showcase'],
  ['/about', '.wer1-about-page'], ['/about/', '.wer1-about-page'],
  ['/projects', '.projects-page'], ['/projects/', '.projects-page'],
  ['/contact', '.premium-contact'], ['/contact/', '.premium-contact'],
  ['/#home', '#home'], ['/#projects', '#projects'],
  ['/about#expertise', '#expertise'], ['/about/#expertise', '#expertise'],
  ['/about#services', '#services'], ['/about#philosophy', '#philosophy'],
  ['/about#values', '#values'],
  ['/projects/?filter=ongoing', '.projects-page'],
] as const) {
  test(`direct load and refresh preserve ${path}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    let response = await page.goto(path);
    for (let attempt = 0; attempt < 2; attempt++) {
      expect(response?.status()).toBe(200);
      const expected = new URL(path, page.url());
      const actual = new URL(page.url());
      expect(actual.pathname.replace(/\/$/, '')).toBe(expected.pathname.replace(/\/$/, ''));
      expect(actual.search).toBe(expected.search);
      expect(actual.hash).toBe(expected.hash);
      await expect(page.locator(selector)).toBeVisible();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://wer1group.in${actual.pathname.replace(/\/$/, '') || '/'}`);
      if (actual.hash) await expect(page.locator(selector)).toBeInViewport();
      if (actual.search) await expect(page.locator('.project-card h3')).toHaveText(['Avisha', 'Jija Heights']);
      if (!attempt) response = await page.reload();
    }
  });
}
