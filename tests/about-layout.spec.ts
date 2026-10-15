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


test('desktop parallax travels 220px without exposing edges or moving the banner', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/about');
  const image = page.locator('.wer1-about-banner-image');
  const banner = page.locator('.wer1-about-banner');
  const geometry = await banner.evaluate(el => ({ top: el.getBoundingClientRect().top + scrollY, height: el.getBoundingClientRect().height }));
  const translate = () => image.evaluate(element => new DOMMatrix(getComputedStyle(element).transform).m42);
  for (const progress of [0, .25, .5, .75, .99, .5, 0]) {
    await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), geometry.top + progress * geometry.height);
    await expect.poll(translate).toBeCloseTo(-110 + progress * 220, 0);
    const layer = (await image.boundingBox())!;
    const bounds = (await banner.boundingBox())!;
    expect(layer.y).toBeLessThanOrEqual(bounds.y);
    expect(layer.y + layer.height).toBeGreaterThanOrEqual(bounds.y + bounds.height);
    await expect(banner).toHaveCSS('transform', 'none');
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(image).toHaveCSS('transform', 'none');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 390, height: 900 });
  await expect(image).toHaveCSS('transform', 'none');
});
