import { expect, test } from '@playwright/test';

for (const width of [1440, 1024, 768, 390]) {
  test(`all six project borders fit and trace clockwise at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const cards = page.locator('.project-card');
    await expect(cards).toHaveCount(6);
    await expect(cards.locator('h3')).toHaveText(['Sukhada Apartment', 'Sinclair Place', 'Aikyam', 'Jija Heights', 'Punawale', 'Chinchwad']);
    for (const card of await cards.all()) {
      await card.scrollIntoViewIfNeeded();
      const geometry = await card.evaluate(el => {
        const svg = el.querySelector<SVGSVGElement>('.clockwise-border')!;
        const path = svg.querySelector('path')!;
        const cardBox = el.getBoundingClientRect();
        const borderBox = svg.getBoundingClientRect();
        const w = svg.viewBox.baseVal.width;
        const h = svg.viewBox.baseVal.height;
        const length = path.getTotalLength();
        const start = path.getPointAtLength(0);
        const top = path.getPointAtLength((w - 6) / 2);
        const right = path.getPointAtLength(w - 6 + h / 2);
        const bottom = path.getPointAtLength(w + h - 8 + w / 2);
        const left = path.getPointAtLength(length - h / 2);
        return {
          widthDifference: Math.abs(cardBox.width - borderBox.width),
          heightDifference: Math.abs(cardBox.height - borderBox.height),
          viewWidthDifference: Math.abs(cardBox.width - w),
          viewHeightDifference: Math.abs(cardBox.height - h),
          clockwise: top.x > start.x && top.y < 1 && right.x > w - 1 && bottom.y > h - 1 && left.x < 1,
        };
      });
      expect(geometry.widthDifference).toBeLessThan(1);
      expect(geometry.heightDifference).toBeLessThan(1);
      expect(geometry.viewWidthDifference).toBeLessThan(1);
      expect(geometry.viewHeightDifference).toBeLessThan(1);
      expect(geometry.clockwise).toBe(true);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('project draw, reset and replay match the CTA without layout shifts', async ({ page }) => {
  await page.goto('/');
  const cta = page.locator('.brand-story-button');
  const ctaPath = cta.locator('.clockwise-border path');
  await cta.hover();
  await expect(ctaPath).toHaveCSS('stroke-dashoffset', '0px');
  const reference = await ctaPath.evaluate(el => {
    const s = getComputedStyle(el);
    return { stroke: s.stroke, width: s.strokeWidth, duration: s.transitionDuration, easing: s.transitionTimingFunction };
  });
  const card = page.locator('[data-project-id="punawale"]');
  const path = card.locator('.clockwise-border path');
  await card.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  const before = await card.boundingBox();
  for (let replay = 0; replay < 2; replay++) {
    await card.hover();
    await expect(path).toHaveCSS('stroke-dashoffset', '0px');
    await expect(path).toHaveCSS('stroke', reference.stroke);
    await expect(path).toHaveCSS('stroke-width', reference.width);
    await expect(path).toHaveCSS('transition-duration', reference.duration);
    await expect(path).toHaveCSS('transition-timing-function', reference.easing);
    expect(await card.boundingBox()).toEqual(before);
    await page.mouse.move(0, 0);
    await expect(path).toHaveCSS('stroke-dashoffset', '1px');
    await expect(path).toHaveCSS('transition-duration', '0.5s');
    await expect(path).toHaveCSS('transition-timing-function', 'ease');
  }
  await expect(card.locator('.coming-soon-copy')).toBeVisible();
  await page.setViewportSize({ width: 390, height: 900 });
  await expect.poll(() => card.evaluate(el => Math.abs(el.getBoundingClientRect().width - el.querySelector<SVGSVGElement>('svg')!.viewBox.baseVal.width))).toBeLessThan(1);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await card.hover();
  await expect(path).toHaveCSS('stroke-dashoffset', '0px');
  await expect(path).toHaveCSS('transition-duration', '0s');
});

test('overlay leaves card links clickable and keyboard focus shows a complete border', async ({ page }) => {
  await page.goto('/');
  const card = page.locator('.project-card').first();
  // Current data has no detail URLs. Exercise the supported link case without changing it.
  await card.evaluate(el => {
    const link = document.createElement('a');
    link.href = '#projects';
    link.textContent = 'Test project detail';
    el.querySelector('.project-card-copy')!.append(link);
  });
  const link = card.getByRole('link');
  await link.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await page.keyboard.press('Tab');
  await link.focus();
  await expect(card.locator('.clockwise-border path')).toHaveCSS('stroke-dashoffset', '0px');
  await expect(card.locator('.clockwise-border path')).toHaveCSS('transition-duration', '0s');
  await expect(card.locator('.clockwise-border')).toHaveCSS('pointer-events', 'none');
  await link.click();
  await expect(page).toHaveURL(/#projects$/);
});

test('touch-only devices do not start the project border hover animation', async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/');
  const card = page.locator('.project-card').first();
  await card.tap();
  await expect(card.locator('.clockwise-border path')).toHaveCSS('stroke-dashoffset', '1px');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});
