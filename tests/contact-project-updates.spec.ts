import { expect, test } from '@playwright/test';

const message = 'Hello WER1 Group, I’m interested in your real estate and infrastructure solutions. I would like to discuss my project requirements and explore how we can work together. Please connect with me.\n\nThank You';
const specs = [
  ['sinclair-place', '4,900 sq. ft.', '12', 'Completed'],
  ['chinchwad', '11,300 sq. ft.', '50', 'Ongoing'],
  ['marunji', '4,300 sq. ft.', '20', 'Ongoing'],
  ['aikyam', '17,400 sq. ft.', '60', 'Completed'],
  ['sukhada-apartment', '5,400 sq. ft.', '10', 'Completed'],
  ['punawale', '50,000 sq. ft.', 'Details Coming Soon', 'Upcoming'],
];

for (const width of [360, 390, 430, 768, 1024, 1440, 1920]) {
  test(`shared contact, WhatsApp and typography at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const route of ['/', '/about', '/projects', '/contact']) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      const wa = page.getByRole('link', { name: 'Chat with WER1 Group on WhatsApp (opens in a new tab)' });
      await expect(wa).toHaveCount(1);
      await expect(wa).toHaveAttribute('href', `https://wa.me/917350004455?text=${encodeURIComponent(message)}`);
      await expect(wa).toHaveAttribute('target', '_blank');
      await expect(wa).toHaveAttribute('rel', 'noopener noreferrer');
      await expect(wa).toHaveCSS('position', 'fixed');
      const box = (await wa.boundingBox())!;
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
      await expect(page.locator('footer a[href="tel:+917350004455"]')).toHaveText('+91 7350004455');
      await expect(page.locator('footer a[href^="tel:"]')).toHaveCount(1);
      if (route === '/') await expect(page.locator('.about-copy > p')).toHaveCSS('text-align', 'justify');
      if (width <= 768) {
        const selectors = route === '/' ? ['.project-description', '.about-preview-card > p', '.credibility-pillar > p']
          : route === '/about' ? ['.wer1-about-introduction-body > p', '.editorial-copy > p', '.service-card > p', '.values-grid p', '.mission-vision-card > p']
          : route === '/projects' ? ['.project-description'] : ['.contact-support'];
        for (const selector of selectors) await expect(page.locator(selector).first()).toHaveCSS('text-align', 'justify');
      }
      for (const progress of [0, .25, .5, .75, 1]) {
        await page.evaluate(value => window.scrollTo({ top: value * (document.documentElement.scrollHeight - innerHeight), behavior: 'instant' }), progress);
        await expect(wa).toBeInViewport();
        const overlaps = await page.evaluate(() => {
          const floating = document.querySelector('.whatsapp-button')!.getBoundingClientRect();
          return [...document.querySelectorAll('main a, main button, footer a')].filter(el => {
            const b = el.getBoundingClientRect();
            return b.width > 0 && b.height > 0 && b.left < floating.right && b.right > floating.left && b.top < floating.bottom && b.bottom > floating.top;
          }).map(el => el.textContent?.trim());
        });
        expect(overlaps, `${route} at scroll ${progress}`).toEqual([]);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await wa.focus();
      await expect(wa).toHaveCSS('outline-style', 'solid');
    }
    expect(errors).toEqual([]);
  });
}

test('approved specifications appear on both shared project listings', async ({ page }) => {
  for (const route of ['/', '/projects']) {
    await page.goto(route);
    for (const [id, area, units, status] of specs) {
      const card = page.locator(`[data-project-id="${id}"]`);
      const fact = (label: string) => card.locator('.project-facts > div').filter({ has: page.locator('dt', { hasText: new RegExp(`^${label}$`) }) }).locator('dd');
      await expect(fact('Land Area')).toHaveText(area);
      await expect(fact('Total Units')).toHaveText(units);
      await expect(card.locator('.project-status')).toHaveText(status);
      if (id === 'punawale') {
        await expect(fact('Residential Space')).toHaveText('250,000 sq. ft.');
        await expect(fact('Commercial Space')).toHaveText('50,000 sq. ft.');
      } else {
        await expect(card.locator('dt', { hasText: 'Residential Space' })).toHaveCount(0);
      }
    }
  }
});

test('WhatsApp opens the exact chat in a safe new tab and supports keyboard/reduced motion', async ({ page, context }) => {
  // Stub the external destination: verify navigation without contacting WhatsApp.
  await context.route('https://wa.me/**', route => route.fulfill({ contentType: 'text/html', body: '<title>WhatsApp destination</title>' }));
  await page.goto('/contact');
  const link = page.locator('.whatsapp-button');
  await link.focus();
  const popupPromise = page.waitForEvent('popup');
  await page.keyboard.press('Enter');
  const popup = await popupPromise;
  await popup.waitForLoadState();
  const url = new URL(popup.url());
  expect(url.origin + url.pathname).toBe('https://wa.me/917350004455');
  expect(url.searchParams.get('text')).toBe(message);
  expect(await popup.evaluate(() => window.opener)).toBeNull();
  await popup.close();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await link.hover();
  await expect(link).toHaveCSS('transform', 'none');
});
