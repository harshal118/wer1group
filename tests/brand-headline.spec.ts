import { expect, test } from '@playwright/test';

test('headline loops in order and resumes transitions and reading time after leaving view', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 600 });
  const time = new Date('2026-01-01');
  await page.clock.install({ time });
  await page.clock.pauseAt(time);
  await page.goto('/');
  const phrase = page.locator('.brand-headline-phrase');
  await expect(phrase).toHaveClass(/waiting/);
  await page.clock.runFor(10000);
  await expect(phrase).toHaveClass(/waiting/);
  await page.locator('#about').evaluate(el => el.scrollIntoView({ behavior: 'instant' }));
  await expect(phrase).toHaveClass(/enter/);
  await expect(phrase).toHaveText('Transforming Land.');
  const geometry = await page.locator('#about').boundingBox();
  const headlineHeight = (await page.locator('#about-title').boundingBox())!.height;
  for (const next of ['Elevating Lifestyles.', 'Constructing Happiness.', 'Transforming Land.', 'Elevating Lifestyles.', 'Constructing Happiness.', 'Transforming Land.']) {
    await page.clock.runFor(500);
    await expect(phrase).toHaveClass(/hold/);
    await expect(phrase).toHaveCSS('opacity', '1');
    await page.clock.runFor(1999);
    await expect(phrase).toHaveClass(/hold/);
    await page.clock.runFor(1);
    await expect(phrase).toHaveClass(/exit/);
    await expect(phrase).toHaveCSS('animation-duration', '0.5s');
    await page.clock.runFor(500);
    await expect(phrase).toHaveText(next);
    await expect(phrase).toHaveClass(/enter/);
    expect((await page.locator('#about').boundingBox())!.height).toBe(geometry!.height);
    expect((await page.locator('#about-title').boundingBox())!.height).toBe(headlineHeight);
    await expect(page.locator('.brand-headline-phrase')).toHaveCount(1);
  }
  await page.clock.runFor(200);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(phrase).toHaveCSS('animation-play-state', 'paused');
  await page.clock.runFor(20000);
  await expect(phrase).toHaveClass(/enter/);
  await expect(phrase).toHaveText('Transforming Land.');
  await page.locator('#about').evaluate(el => el.scrollIntoView({ behavior: 'instant' }));
  await expect(phrase).toHaveCSS('animation-play-state', 'running');
  await page.clock.runFor(299);
  await expect(phrase).toHaveClass(/enter/);
  await page.clock.runFor(1);
  await expect(phrase).toHaveClass(/hold/);
  await page.clock.runFor(700);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(phrase).toHaveCSS('animation-play-state', 'paused');
  await page.clock.runFor(10000);
  await expect(phrase).toHaveClass(/hold/);
  await page.locator('#about').evaluate(el => el.scrollIntoView({ behavior: 'instant' }));
  await expect(phrase).toHaveCSS('animation-play-state', 'running');
  await page.clock.runFor(1299);
  await expect(phrase).toHaveClass(/hold/);
  await page.clock.runFor(1);
  await expect(phrase).toHaveClass(/exit/);
});

for (const width of [1920, 1440, 1024, 768, 430, 390]) {
  test(`compact headline fits at ${width}px with reduced motion`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const phrase = page.locator('.brand-headline-phrase');
    await expect(phrase).toHaveText('Constructing Happiness.');
    await expect(phrase).toHaveClass(/done/);
    await expect(phrase).toHaveCSS('animation-name', 'none');
    await page.locator('#about').scrollIntoViewIfNeeded();
    await expect(page.locator('#about .eyebrow')).toHaveCount(0);
    const tagline = page.locator('#about .supporting-statement');
    await expect(tagline).toHaveText('Building Excellence. Creating Happiness.');
    if (width >= 1024) {
      await expect(tagline).toHaveCSS('white-space', 'nowrap');
      const text = (await tagline.boundingBox())!;
      const logo = (await page.locator('#about .brand-logo').boundingBox())!;
      expect(text.x).toBeGreaterThan(logo.x + logo.width);
      expect(Math.abs(text.y + text.height / 2 - logo.y - logo.height / 2)).toBeLessThan(1);
      expect(await tagline.evaluate(el => el.getBoundingClientRect().height <= parseFloat(getComputedStyle(el).lineHeight) + 1)).toBe(true);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const dimensions = await phrase.evaluate(el => ({ width: el.clientWidth, height: el.clientHeight, scrollWidth: el.scrollWidth, scrollHeight: el.scrollHeight }));
    expect(dimensions.scrollWidth, JSON.stringify(dimensions)).toBeLessThanOrEqual(dimensions.width);
    expect(dimensions.scrollHeight, JSON.stringify(dimensions)).toBeLessThanOrEqual(dimensions.height + 1);
    await page.locator('#about').screenshot({ path: `test-results/brand-headline-${width}.png` });
  });
}

test('changing reduced-motion preference cancels an active sequence', async ({ page }) => {
  await page.goto('/');
  await page.locator('#about').scrollIntoViewIfNeeded();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.brand-headline-phrase')).toHaveText('Constructing Happiness.');
  await expect(page.locator('.brand-headline-phrase')).toHaveClass(/done/);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('.brand-headline-phrase')).toHaveText('Transforming Land.');
  await expect(page.locator('.brand-headline-phrase')).toHaveCSS('animation-play-state', 'running');
});

test('single brand story CTA navigates to About', async ({ page }) => {
  await page.goto('/');
  const story = page.locator('#about .brand-story-button');
  await expect(story).toHaveText('Discover the WER1 Story');
  await expect(story).toHaveAttribute('href', '/about');
  await expect(story.locator('.brand-story-arrow')).toHaveCount(1);
  await expect(page.locator('#about a')).toHaveCount(1);
  await story.click();
  await expect(page).toHaveURL('/about');
  await expect(page.locator('h1')).toHaveText('About Us');
});
