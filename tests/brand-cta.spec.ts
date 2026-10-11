import { expect, test } from '@playwright/test';

for (const width of [1440, 1024, 768, 430, 390]) {
  test(`introduction alignment and single CTA at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const section = page.locator('#about');
    await section.scrollIntoViewIfNeeded();
    await expect(section).toHaveCSS('align-items', 'start');
    await expect(section.locator('a')).toHaveCount(1);
    const left = (await section.locator('.intro-heading').boundingBox())!;
    const right = (await section.locator('.about-copy').boundingBox())!;
    if (width > 768) expect(Math.abs(left.y - right.y)).toBeLessThan(1);
    else expect(right.y).toBeGreaterThan(left.y + left.height);
    const button = section.locator('.brand-story-button');
    const bounds = (await button.boundingBox())!;
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
    await expect(button).toHaveCSS('border-radius', '3px');
    const border = (await button.locator('.brand-story-border').boundingBox())!;
    expect(border.width).toBeCloseTo(bounds.width, 0);
    expect(border.height).toBeCloseTo(bounds.height, 0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await section.screenshot({ path: `test-results/brand-cta-${width}.png` });
  });
}

test('single clockwise SVG trace draws, resets, replays and supports keyboard/reduced motion', async ({ page }) => {
  await page.goto('/');
  const button = page.locator('.brand-story-button');
  const path = button.locator('.brand-story-border path');
  await button.scrollIntoViewIfNeeded();
  await expect(path).toHaveCSS('stroke-dashoffset', '1px');
  // Inspect physical path direction: top right, down right, left along bottom, up left.
  expect(await path.evaluate((el: SVGPathElement) => {
    const length = el.getTotalLength();
    const start = el.getPointAtLength(0);
    const top = el.getPointAtLength(20);
    const end = el.getPointAtLength(length - 10);
    return top.x > start.x && Math.abs(top.y - start.y) < 1 && end.y > start.y && end.x < start.x;
  })).toBe(true);
  const before = await button.boundingBox();
  await button.hover();
  await expect(path).toHaveCSS('transition-duration', '0.75s');
  await expect(path).toHaveCSS('stroke-dashoffset', '0px');
  await expect(button.locator('.brand-story-arrow')).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 5, -5)');
  expect(await button.boundingBox()).toEqual(before);
  await page.mouse.move(0, 0);
  await expect(path).toHaveCSS('stroke-dashoffset', '1px');
  await button.hover();
  await expect(path).toHaveCSS('stroke-dashoffset', '0px');
  await page.mouse.move(0, 0);
  await expect(path).toHaveCSS('stroke-dashoffset', '1px');
  await page.keyboard.press('Tab');
  await button.focus();
  await expect(button).toBeFocused();
  await expect(path).toHaveCSS('stroke-dashoffset', '0px');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(path).toHaveCSS('transition-duration', '0s');
  await expect(path).toHaveCSS('stroke-dashoffset', '0px');
});
