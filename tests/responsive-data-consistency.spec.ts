import { expect, test } from '@playwright/test';

for (const width of [360, 390, 430, 768, 1024, 1440, 1920]) {
  test(`shared project/contact data survives responsive changes and reload at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/', '/projects']) {
      await page.goto(route);
      const check = async () => {
        const sinclair = page.locator('[data-project-id="sinclair-place"]');
        const fact = (label: string) => sinclair.locator('.project-facts > div').filter({ has: page.locator('dt', { hasText: new RegExp(`^${label}$`) }) }).locator('dd');
        await expect(fact('Land Area')).toHaveText('4,900 sq. ft.');
        await expect(fact('Total Units')).toHaveText('12');
        await expect(sinclair.locator('.project-status')).toHaveText('Completed');
        const punawale = page.locator('[data-project-id="punawale"]');
        await expect(punawale.locator('.project-status')).toHaveText('Upcoming');
        await expect(punawale.locator('.coming-soon-copy')).toContainText('Expected Completion 2030');
        await expect(punawale.locator('.project-facts > div').filter({ has: page.locator('dt', { hasText: 'Expected completion' }) }).locator('dd')).toHaveText('2030');
        for (const link of await page.locator('a[href^="tel:"]').all()) {
          await expect(link).toHaveAttribute('href', 'tel:+917350004455');
          await expect(link).toHaveText('+91 7350004455');
        }
        await expect(page.locator('footer a[href^="tel:"]')).toHaveCount(1);
        expect(new URL((await page.locator('.whatsapp-button').getAttribute('href'))!).pathname).toBe('/917350004455');
      };
      await check();
      await page.setViewportSize({ width: width <= 768 ? 1440 : 390, height: 900 });
      await check();
      await page.setViewportSize({ width, height: 900 });
      await page.reload();
      await check();
      const filters = page.getByRole('group', { name: 'Filter projects' });
      await filters.getByRole('button', { name: 'Completed', exact: true }).click();
      await expect(page.locator('[data-project-id="sinclair-place"]')).toContainText('4,900 sq. ft.');
      await filters.getByRole('button', { name: 'Upcoming', exact: true }).click();
      await expect(page.locator('.coming-soon-copy')).toContainText('Expected Completion 2030');
    }
    for (const route of ['/about', '/contact']) {
      await page.goto(route);
      await expect(page.locator('footer a[href^="tel:"]')).toHaveCount(1);
      for (const link of await page.locator('a[href^="tel:"]').all()) await expect(link).toHaveAttribute('href', 'tel:+917350004455');
    }
  });
}
