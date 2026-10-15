import { test, expect } from '@playwright/test';
for (const width of [1920, 1440, 1024, 768, 430, 390]) {
  test(`evolution layout ${width}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/about');
    const section = page.locator('#our-evolution');
    await expect(page.locator('.wer1-about-introduction + #mission-vision + #our-evolution')).toHaveCount(1);
    await section.scrollIntoViewIfNeeded();
    await expect(section.locator('.evolution-year')).toHaveText(['2021', '2023', '2025']);
    await expect(section.locator('img')).toHaveCount(3);
    for (const img of await section.locator('img').all()) {
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.waitForTimeout(3500);
    const cards = await section.locator('.evolution-venture').all();
    const first = (await cards[0].boundingBox())!;
    const second = (await cards[1].boundingBox())!;
    if (width > 600) expect(first.y).toBe(second.y);
    else expect(second.y).toBeGreaterThan(first.y + first.height);
    await section.screenshot({path:`test-results/evolution-${width}.png`});
    await expect(page.locator('#philosophy')).toHaveCount(1);
    await expect(page.locator('.wer1-about-construction img')).toHaveAttribute('src', '/media/about/construct.jpg');
    await page.emulateMedia({reducedMotion:'reduce'});
    await expect(section.locator('.evolution-brand')).toHaveCSS('animation-name','none');
    expect(errors).toEqual([]);
  });
}
