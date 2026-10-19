import { expect, test } from '@playwright/test';

for (const width of [1920, 1440, 1366, 1024, 769, 768, 430, 390, 375, 360]) {
  test(`slideshow preserves full landscape images and mobile framing at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const time = new Date('2026-10-17T00:00:00Z');
    await page.clock.install({ time });
    await page.clock.pauseAt(time);
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const frame = page.locator('.hero-images');
    const initial = await frame.boundingBox();
    expect(initial!.width).toBe(width);
    expect(initial!.height).toBeCloseTo(width * 941 / 1672, 1);

    for (const name of ['Aikyam', 'Avisha', 'Sinclair Place', 'Sukhada Apartment', 'Jija Heights']) {
      await page.getByRole('button', { name: `Show ${name}`, exact: true }).click();
      const image = page.locator('.hero-slide.is-active img');
      await expect.poll(() => image.evaluate(img => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0)).toBe(true);
      await expect(image).toHaveCSS('object-fit', 'contain');
      const box = await frame.boundingBox();
      const imageBox = await image.boundingBox();
      expect(box!.height).toBe(initial!.height);
      expect(imageBox).toEqual(box);
      expect(await image.evaluate(img => [(img as HTMLImageElement).naturalWidth, (img as HTMLImageElement).naturalHeight])).toEqual([1672, 941]);
      const toolbar = await page.locator('.hero-toolbar').boundingBox();
      if (width > 768) {
        expect(toolbar!.y).toBeCloseTo(box!.y + box!.height, 1);
        await expect(page.locator('.hero-mobile-caption')).toBeHidden();
      } else {
        const caption = page.locator('.hero-mobile-caption');
        await expect(caption).toBeVisible();
        await expect(caption.locator('.hero-title')).toHaveText(name);
        const captionBox = await caption.boundingBox();
        expect(captionBox!.y).toBeCloseTo(box!.y + box!.height, 1);
        expect(toolbar!.y).toBeCloseTo(captionBox!.y + captionBox!.height, 1);
        await expect(page.locator('.hero-images .hero-caption')).toBeHidden();
      }
      if ([360, 768, 1440].includes(width) && name === 'Sukhada Apartment') {
        await page.locator('#home-showcase').screenshot({ path: `/tmp/wer1-mobile-landscape-${width}.png` });
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    await frame.evaluate(element => {
      const start = new Touch({ identifier: 1, target: element, clientX: 280, clientY: 180 });
      const end = new Touch({ identifier: 1, target: element, clientX: 100, clientY: 180 });
      element.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, touches: [start] }));
      element.dispatchEvent(new TouchEvent('touchend', { bubbles: true, changedTouches: [end] }));
    });
    await expect(page.getByRole('button', { name: 'Show Aikyam', exact: true })).toHaveAttribute('aria-current', 'true');
    expect(errors).toEqual([]);
  });
}
