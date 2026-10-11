import { expect, test } from '@playwright/test';

for (const width of [1920, 1440, 1024, 768, 430, 390]) {
  test(`About banner and construction composition at ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/about');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('About Us');
    await expect(page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    const banner = page.locator('.wer1-about-banner');
    const construction = page.locator('.wer1-about-construction');
    await construction.scrollIntoViewIfNeeded();
    for (const [selector, file] of [['.wer1-about-banner-image', 'about_us_team.png'], ['.wer1-about-construction img', 'construct.jpg']]) {
      const image = page.locator(selector);
      await expect(image).toHaveAttribute('src', `/media/about/${file}`);
      await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    }
    await expect(construction.locator('svg')).toHaveCount(0);
    const imageBox = (await construction.boundingBox())!;
    const textBox = (await page.locator('.wer1-about-introduction-copy').boundingBox())!;
    if (width <= 768) expect(imageBox.y).toBeGreaterThan(textBox.y + textBox.height);
    else expect(imageBox.x).toBeGreaterThan(textBox.x + textBox.width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.locator('.wer1-about-introduction').screenshot({ path: `test-results/about-introduction-${width}.png`, animations: 'disabled' });
    await banner.screenshot({ path: `test-results/about-banner-${width}.png` });
    expect(errors).toEqual([]);
  });
}


test('desktop parallax travels 80–140px without exposing edges', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/about');
  const image = page.locator('.wer1-about-banner-image');
  const translate = () => image.evaluate(element => new DOMMatrix(getComputedStyle(element).transform).m42);
  const before = await translate();
  for (const top of [100, 200, 300, 450]) {
    await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), top);
    await expect.poll(translate).toBeCloseTo(Math.max(-70, Math.min(70, (top - 120) * .4)), 0);
    const layer = (await image.boundingBox())!;
    const banner = (await page.locator('.wer1-about-banner').boundingBox())!;
    expect(layer.y).toBeLessThanOrEqual(banner.y);
    expect(layer.y + layer.height).toBeGreaterThanOrEqual(banner.y + banner.height);
  }
  const travel = (await translate()) - before;
  expect(travel).toBeGreaterThanOrEqual(80);
  expect(travel).toBeLessThanOrEqual(140);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(image).toHaveCSS('transform', 'none');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 390, height: 900 });
  await expect(image).toHaveCSS('transform', 'none');
});

