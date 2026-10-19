import { expect, test, type Page } from '@playwright/test';

const heroOrder = ['Aikyam', 'Chinchwad', 'Sinclair Place', 'Sukhada Apartment', 'Jija Heights'];

for (const width of [1920, 1440, 1366, 1024, 768, 430, 390]) {
  test(`homepage at ${width}px: brand, layout, navigation and loaded assets`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('h1')).toHaveAttribute('aria-label', 'Constructing Happiness.');
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect.poll(() => page.locator('.hero-slide.is-active img').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width <= 768) {
      await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeHidden();
      await page.getByRole('button', { name: 'Open navigation' }).click();
      await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByRole('button', { name: 'Open navigation' })).toBeFocused();
      await page.getByRole('button', { name: 'Open navigation' }).click();
    }
    await page.getByRole('button', { name: 'Media', exact: true }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(page.locator('.opening-actions .brand-story-button')).toHaveAttribute('href', '/about');
    await page.locator('#projects').scrollIntoViewIfNeeded();
    for (const card of await page.locator('.project-card').all()) {
      await card.scrollIntoViewIfNeeded();
      const image = card.locator('img');
      if (await image.count()) await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    }
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect(page.locator('footer .footer-navigation a[href="/contact"]')).toHaveCount(1);
    await expect(page.locator('footer address')).toContainText('VTP Altitude');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const logo = page.locator('.site-header .brand-logo');
    await expect(logo).toHaveAttribute('src', /WER1_Logo.*\.png/);
    const box = await logo.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width / box!.height).toBeCloseTo(1, 2);
    await expect(logo).toHaveCSS('object-fit', 'contain');
    await expect(page.getByRole('button', { name: /play slideshow|pause slideshow/i })).toHaveCount(0);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({ path: `test-results/home-${width}.png`, fullPage: true });
    expect(errors).toEqual([]);
  });
}

async function openSlideshow(page: Page) {
  const time = new Date('2026-01-01T00:00:00Z');
  await page.clock.install({ time });
  await page.clock.pauseAt(time);
  await page.goto('/');
  await expect.poll(() => page.locator('.hero-images .hero-image').evaluateAll(images =>
    images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0),
  )).toBe(true);
}

async function expectSlide(page: Page, name: string) {
  await expect(page.locator('.project-caption')).toContainText(name);
  await expect(page.locator('.slide-dots [aria-current="true"]')).toHaveAttribute('aria-label', `Show ${name}`);
  await expect(page.locator('.hero-slide.is-active')).toHaveCount(1);
}

test('five-second autoplay follows all five slides and wraps while hovered', async ({ page }) => {
  await openSlideshow(page);
  await expect(page.locator('.slide-dots button')).toHaveCount(5);
  await expectSlide(page, heroOrder[0]);
  await expect(page.locator('.hero-slide.is-active')).toHaveCSS('transition-duration', '0.8s');
  await page.locator('.hero-images').hover();
  await page.clock.runFor(4999);
  await expectSlide(page, heroOrder[0]);
  await page.clock.runFor(1);
  await expectSlide(page, heroOrder[1]);
  for (const name of [...heroOrder.slice(2), heroOrder[0]]) {
    await page.clock.runFor(5000);
    await expectSlide(page, name);
  }
});

test('arrows, dots, keyboard and touch restart autoplay after manual navigation', async ({ page }) => {
  await openSlideshow(page);
  await page.clock.runFor(4000);
  await page.getByRole('button', { name: 'Next project' }).click();
  await expectSlide(page, 'Chinchwad');
  await page.clock.runFor(4999);
  await expectSlide(page, 'Chinchwad');
  await page.clock.runFor(1);
  await expectSlide(page, 'Sinclair Place');
  await page.getByRole('button', { name: 'Previous project' }).click();
  await expectSlide(page, 'Chinchwad');
  await page.getByRole('button', { name: 'Show Aikyam' }).click();
  await expectSlide(page, 'Aikyam');
  await page.clock.runFor(4000);
  await page.getByRole('button', { name: 'Show Aikyam' }).click();
  await page.clock.runFor(4999);
  await expectSlide(page, 'Aikyam');
  await page.clock.runFor(1);
  await expectSlide(page, 'Chinchwad');
  await page.keyboard.press('ArrowLeft');
  await expectSlide(page, 'Aikyam');
  await page.getByRole('button', { name: 'Previous project' }).click();
  await expectSlide(page, 'Jija Heights');
  await page.locator('.hero-images').evaluate(element => {
    const start = new Touch({ identifier: 1, target: element, clientX: 300, clientY: 200 });
    const end = new Touch({ identifier: 1, target: element, clientX: 100, clientY: 205 });
    element.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, touches: [start] }));
    element.dispatchEvent(new TouchEvent('touchend', { bubbles: true, changedTouches: [end] }));
  });
  await expectSlide(page, 'Aikyam');
  await page.clock.runFor(5000);
  await expectSlide(page, 'Chinchwad');
});

test('reduced motion removes animation while autoplay continues', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openSlideshow(page);
  await expect(page.locator('.hero-slide.is-active')).toHaveCSS('transition-duration', '0s');
  await expect(page.locator('h1')).toHaveCSS('animation-name', 'none');
  await page.clock.runFor(5000);
  await expectSlide(page, 'Chinchwad');
});
