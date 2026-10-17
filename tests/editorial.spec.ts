import { expect, test } from '@playwright/test';
import { company } from '../src/data/company';

for (const width of [1920, 1440, 1024, 768, 430, 390]) {
  test(`About preserves complete approved content at ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize({ width, height: 1000 });
    expect((await page.goto('/about'))?.status()).toBe(200);
    await expect(page).toHaveTitle('About WER1 Group | Constructing Happiness');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('.editorial-copy p')).toHaveText([...company.philosophy.paragraphs]);
    await expect(page.locator('.service-card p')).toHaveText(company.services.map(item => item.description));
    await expect(page.locator('.values-grid p')).toHaveText(company.values.map(item => item.description));
    await expect(page.locator('#approach, .approach-grid, .stage-number, [href$="#approach"]')).toHaveCount(0);
    for (const selector of ['.wer1-about-introduction-body p', '.editorial-copy p', '.service-card p', '.values-grid p']) {
      await expect(page.locator(selector).first()).toHaveCSS('text-align', 'justify');
      await expect(page.locator(selector).first()).toHaveCSS('text-align-last', 'left');
    }
    await expect(page.locator('.company-purpose, .closing-section')).toHaveCount(0);
    await expect(page.getByRole('region', { name: 'Mission and vision' })).toHaveCount(0);
    await expect(page.locator('#our-evolution .evolution-year')).toHaveText(['2021', '2023', '2025']);
    await expect(page.locator('main > :last-child')).toHaveAttribute('id', 'values');
    await expect(page.locator('main + footer')).toHaveCount(1);
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `test-results/about-${width}.png`, fullPage: true });
    await page.getByRole('navigation', { name: 'Footer navigation' }).getByRole('link', { name: 'Contact Us', exact: true }).click();
    await expect(page).toHaveURL(/\/contact$/);
    expect(errors).toEqual([]);
  });
}

test('editorial links, footer navigation and focus remain usable', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await page.locator('.about-preview-card').first().click();
  await expect(page).toHaveURL(/\/about#philosophy$/);
  await expect(page.locator('#philosophy')).toBeInViewport();
  await page.getByRole('navigation', { name: 'Footer navigation' }).getByRole('link', { name: 'Projects', exact: true }).click();
  await expect(page).toHaveURL(/\/#projects$/);
  await expect(page.locator('#projects-title')).toBeInViewport();
});

test('scroll enhancement never hides content without IntersectionObserver', async ({ page }) => {
  await page.addInitScript(() => { delete (window as unknown as Record<string, unknown>).IntersectionObserver; });
  await page.goto('/');
  await page.locator('.about-preview').scrollIntoViewIfNeeded();
  await expect(page.locator('.about-preview-card h2').first()).toBeVisible();
  await expect(page.locator('.about-preview')).toHaveCSS('opacity', '1');
  await expect(page.locator('.about-preview-card')).toHaveCount(3);
});

test('reduced motion keeps revealed content and project hover still', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.locator('.about-preview').scrollIntoViewIfNeeded();
  await expect(page.locator('.about-preview')).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.about-preview')).toHaveCSS('opacity', '1');
  await expect(page.locator('.project-card img').first()).toHaveCSS('transition-duration', '0s');
});
