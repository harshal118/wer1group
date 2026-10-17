import { chromium, webkit, devices, expect, test } from '@playwright/test';

const all = ['Sukhada Apartment', 'Sinclair Place', 'Aikyam', 'Marunji', 'Punawale', 'Chinchwad'];
const options = [
  { label: 'All Projects', filter: 'all', names: all },
  { label: 'Completed', filter: 'completed', names: all.slice(0, 3) },
  { label: 'Upcoming', filter: 'upcoming', names: ['Punawale'] },
] as const;

for (const browserName of ['chromium', 'webkit'] as const) {
  test.describe(`${browserName} touch navigation`, () => {
    for (const width of [360, 390, 430]) {
      test(`project links, dismissal and history at ${width}px`, async ({ baseURL }) => {
        const browser = await ({ chromium, webkit })[browserName].launch();
        const page = await browser.newPage({ ...devices['iPhone 13'], baseURL });
        try {
        await page.setViewportSize({ width, height: 844 });
        const menu = page.getByRole('button', { name: 'Open navigation' });
        const trigger = page.getByRole('button', { name: 'Projects', exact: true });
        const dropdown = page.locator('#projects-navigation-options');
        const filters = page.getByRole('group', { name: 'Filter projects' });
        const openProjects = async () => {
          await menu.tap();
          await trigger.tap();
          await expect(dropdown).toBeVisible();
        };
        for (const option of options) {
          await page.goto('/');
          await openProjects();
          // Touch devices may leave focus on BODY and emit pointerout before
          // compatibility click activation. Hover dismissal must not hide the link.
          await dropdown.dispatchEvent('pointerout', { pointerType: 'touch', relatedTarget: null });
          await expect(dropdown).toBeVisible();
          await dropdown.getByRole('link', { name: option.label, exact: true }).tap();
          await expect(page).toHaveURL(`/projects?filter=${option.filter}`);
          await expect(filters.getByRole('button', { name: option.label, exact: true })).toHaveAttribute('aria-pressed', 'true');
          await expect(page.locator('.project-card h3')).toHaveText([...option.names]);
          await expect(menu).toHaveAttribute('aria-expanded', 'false');
          await page.goBack();
          await expect(page).toHaveURL('/');
        }
        await page.goto('/projects?filter=all');
        await page.evaluate(() => { (window as unknown as { navigationMarker: string }).navigationMarker = 'preserved'; });
        for (const option of [options[1], options[2], options[0]]) {
          await openProjects();
          await dropdown.getByRole('link', { name: option.label, exact: true }).tap();
          await expect(page).toHaveURL(`/projects?filter=${option.filter}`);
          await expect(page.locator('.project-card h3')).toHaveText([...option.names]);
          await expect(menu).toHaveAttribute('aria-expanded', 'false');
        }
        await page.goBack();
        await expect(page).toHaveURL('/projects?filter=upcoming');
        await expect(filters.getByRole('button', { name: 'Upcoming', exact: true })).toHaveAttribute('aria-pressed', 'true');
        await page.goForward();
        await expect(page).toHaveURL('/projects?filter=all');
        // Ongoing exists in the page filters, but is not a current navbar option.
        await filters.getByRole('button', { name: 'Ongoing', exact: true }).tap();
        await expect(page).toHaveURL('/projects?filter=ongoing');
        await expect(page.locator('.project-card h3')).toHaveText(['Marunji', 'Chinchwad']);
        expect(await page.evaluate(() => (window as unknown as { navigationMarker: string }).navigationMarker)).toBe('preserved');
        } finally { await browser.close(); }
      });
    }
  });
}
