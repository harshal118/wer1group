import { expect, test } from '@playwright/test';
const all = ['Sukhada Apartment', 'Sinclair Place', 'Aikyam', 'Jija Heights', 'Punawale', 'Chinchwad'];

for (const [query, active, names] of [
  ['', 'All Projects', all], ['?filter=all', 'All Projects', all],
  ['?filter=completed', 'Completed', all.slice(0, 3)],
  ['?filter=upcoming', 'Upcoming', ['Punawale']],
  ['?filter=invalid', 'All Projects', all], ['?filter=__proto__', 'All Projects', all],
] as const) {
  test(`direct project filter ${query || 'default'} survives refresh`, async ({ page }) => {
    await page.goto(`/projects${query}`);
    for (let refresh = 0; refresh < 2; refresh++) {
      await expect(page.locator('.project-card h3')).toHaveText([...names]);
      await expect(page.getByRole('group', { name: 'Filter projects' }).getByRole('button', { name: active, exact: true })).toHaveAttribute('aria-pressed', 'true');
      if (active === 'Upcoming') await expect(page.locator('.coming-soon-copy')).toContainText('Punawale');
      if (!refresh) await page.reload();
    }
    await expect(page.locator('#projects')).toBeInViewport();
  });
}

test('desktop dropdown filters without reload and supports Back/Forward and filter buttons', async ({ page }) => {
  await page.goto('/projects');
  await page.evaluate(() => { (window as unknown as { navigationMarker: string }).navigationMarker = 'preserved'; });
  const trigger = page.getByRole('button', { name: 'Projects', exact: true });
  const dropdown = page.locator('#projects-navigation-options');
  await trigger.hover();
  await expect(dropdown.getByRole('link')).toHaveText(['All Projects', 'Completed', 'Upcoming']);
  await dropdown.getByRole('link', { name: 'Completed', exact: true }).click();
  await expect(page).toHaveURL('/projects?filter=completed');
  await expect(page.locator('.project-card h3')).toHaveText(all.slice(0, 3));
  await trigger.hover();
  await dropdown.getByRole('link', { name: 'Upcoming', exact: true }).click();
  await expect(page.locator('.project-card h3')).toHaveText(['Punawale']);
  await page.goBack();
  await expect(page.locator('.project-card h3')).toHaveText(all.slice(0, 3));
  await page.goForward();
  await expect(page.locator('.project-card h3')).toHaveText(['Punawale']);
  await page.getByRole('group', { name: 'Filter projects' }).getByRole('button', { name: 'Ongoing', exact: true }).click();
  await expect(page).toHaveURL('/projects?filter=ongoing');
  await expect(page.locator('.project-card h3')).toHaveText(['Jija Heights', 'Chinchwad']);
  await trigger.hover();
  await dropdown.getByRole('link', { name: 'All Projects', exact: true }).click();
  await expect(page.locator('.project-card h3')).toHaveText(all);
  expect(await page.evaluate(() => (window as unknown as { navigationMarker: string }).navigationMarker)).toBe('preserved');
  await expect(page.locator('.project-card .clockwise-border')).toHaveCount(6);
  await expect(dropdown).toBeHidden();
  const heading = (await page.locator('#projects-title').boundingBox())!;
  expect(heading.y).toBeGreaterThanOrEqual(96);
});

for (const route of ['/', '/about', '/contact']) {
  test(`mobile dropdown from ${route} closes after selecting a filter`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await page.getByRole('button', { name: 'Projects', exact: true }).click();
    const dropdown = page.locator('#projects-navigation-options');
    await expect(dropdown.getByRole('link')).toHaveText(['All Projects', 'Completed', 'Upcoming']);
    await dropdown.getByRole('link', { name: 'Upcoming', exact: true }).click();
    await expect(page).toHaveURL('/projects?filter=upcoming');
    await expect(page.locator('.project-card h3')).toHaveText(['Punawale']);
    await expect(page.getByRole('button', { name: 'Open navigation' })).toHaveAttribute('aria-expanded', 'false');
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await page.getByRole('button', { name: 'Projects', exact: true }).click();
    await dropdown.getByRole('link', { name: 'Completed', exact: true }).click();
    await expect(page.locator('.project-card h3')).toHaveText(all.slice(0, 3));
    await expect(page.getByRole('button', { name: 'Open navigation' })).toHaveAttribute('aria-expanded', 'false');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('keyboard disclosure, Escape and native links remain accessible', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Projects', exact: true });
  const dropdown = page.locator('#projects-navigation-options');
  await trigger.focus();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('ArrowDown');
  await expect(dropdown.getByRole('link', { name: 'All Projects', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dropdown.getByRole('link', { name: 'Completed', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(dropdown).toBeHidden();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/projects?filter=all');
  await expect(page.locator('.project-card h3')).toHaveText(all);
});
