import { test, expect } from '@playwright/test';

for (const width of [1440, 390]) {
  test(`About reveals once and finishes visibly at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('/about');
    const targets = page.locator('[data-about-motion], .wer1-about-page .section-heading');
    for (const target of await targets.all()) {
      await target.scrollIntoViewIfNeeded();
      await expect(target).not.toHaveClass(/about-motion-pending/);
    }
    await page.waitForTimeout(3500);
    for (const target of await targets.all()) await expect(target).toHaveCSS('opacity', '1');
    await page.evaluate(() => {
      (window as unknown as { replayCount: number }).replayCount = 0;
      document.querySelector('main')!.addEventListener('animationstart', () => (window as unknown as { replayCount: number }).replayCount++);
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.locator('#our-evolution').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    expect(await page.evaluate(() => (window as unknown as { replayCount: number }).replayCount)).toBe(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}

test('Introduction and purpose use stronger distances, durations and staggering', async ({ page }) => {
  await page.goto('/about');
  const heading = page.locator('.wer1-about-introduction-copy > [data-about-motion]');
  await heading.scrollIntoViewIfNeeded();
  await expect(heading).toHaveCSS('--about-motion-distance', '45px');
  await expect(heading).toHaveCSS('animation-duration', '0.95s');
  const paragraphs = page.locator('.wer1-about-introduction-body > p');
  await paragraphs.first().scrollIntoViewIfNeeded();
  await expect(paragraphs.first()).toHaveCSS('animation-duration', '0.8s');
  await expect(paragraphs.last()).toHaveCSS('text-align', 'justify');
  await page.locator('#mission-vision').scrollIntoViewIfNeeded();
  const cards = page.locator('.mission-vision-card');
  await expect(cards.first()).toHaveClass(/about-motion-entered/);
  await expect(cards.last()).toHaveClass(/about-motion-entered/);
  await expect(cards.first()).toHaveCSS('--about-motion-distance', '50px');
  await expect(cards.first()).toHaveCSS('animation-duration', '0.85s');
  const delays = await cards.evaluateAll(els => els.map(el => parseFloat(getComputedStyle(el).animationDelay)));
  expect(delays[1] - delays[0]).toBeCloseTo(.25, 1);
  await expect(cards.first().locator('svg')).toHaveCSS('animation-name', 'purpose-icon-enter');
  await expect(cards.locator('a, button')).toHaveCount(0);
});

test('Evolution connectors draw before the final brand card', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1800 });
  await page.goto('/about');
  await page.locator('#our-evolution').scrollIntoViewIfNeeded();
  const connector = page.locator('.evolution-connector');
  const brand = page.locator('.evolution-brand');
  await expect(brand).toHaveClass(/about-motion-entered/);
  const delay = (locator: typeof brand) => locator.evaluate(el => parseFloat(getComputedStyle(el).getPropertyValue('--about-motion-delay')));
  expect((await delay(brand)) - (await delay(connector))).toBeGreaterThanOrEqual(699);
  await expect(connector.locator('.evolution-branch')).toHaveCSS('animation-name', 'evolution-draw');
  await expect(brand).toHaveCSS('animation-duration', '0.9s');
  await expect(page.locator('.evolution-venture').first()).toHaveCSS('--about-motion-distance', '45px');
  await page.waitForTimeout(4000);
  await expect(connector.locator('.evolution-stem')).toHaveCSS('stroke-dashoffset', '0px');
  await expect(brand).toHaveCSS('opacity', '1');
});

for (const mode of ['unavailable', 'throws', 'silent', 'reduced'] as const) {
  test(`Content remains available when observer is ${mode}`, async ({ page }) => {
    if (mode === 'reduced') await page.emulateMedia({ reducedMotion: 'reduce' });
    else await page.addInitScript(mode => {
      if (mode === 'unavailable') delete (window as unknown as Record<string, unknown>).IntersectionObserver;
      else window.IntersectionObserver = class {
        constructor() { if (mode === 'throws') throw new Error('Observer unavailable'); }
        observe() {} unobserve() {} disconnect() {} takeRecords() { return []; }
      } as unknown as typeof IntersectionObserver;
    }, mode);
    await page.goto('/about#mission-vision');
    const card = page.locator('.mission-vision-card').first();
    await card.scrollIntoViewIfNeeded();
    await expect(card).toHaveCSS('opacity', '1', { timeout: 5000 });
    await expect(card).not.toHaveClass(/about-motion-pending/);
    await page.reload();
    await expect(card).toHaveCSS('opacity', '1', { timeout: 5000 });
  });
}

test('Switching to reduced motion reveals all pending content', async ({ page }) => {
  await page.goto('/about');
  await expect(page.locator('.about-motion-pending').first()).toHaveCount(1);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.about-motion-pending')).toHaveCount(0);
  await expect(page.locator('.evolution-brand')).toHaveCSS('opacity', '1');
  await expect(page.locator('.evolution-brand')).toHaveCSS('animation-name', 'none');
});
