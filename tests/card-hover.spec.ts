import { test, expect } from '@playwright/test';
import { projects } from '../src/data/projects';

test('all spatial cards reveal and clear the image hover treatment', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/');
  await page.waitForTimeout(1000);
  for (const project of projects) {
    await page.mouse.move(20, 900);
    const [start, end] = project.scrollRange;
    await page.evaluate(p => scrollTo(0, p * (document.querySelector('.scroll-container')!.getBoundingClientRect().height - innerHeight)), start + (end - start) * .52);
    await page.waitForTimeout(650);
    const normal = await page.screenshot();
    await page.mouse.move(project.side === 'left' ? 300 : 1140, 350);
    await page.waitForTimeout(400);
    const hover = await page.screenshot({ path: `test-results/${project.id}-hover.png` });
    expect(hover.equals(normal)).toBe(false);
    await page.mouse.move(20, 900);
    await page.waitForTimeout(400);
    expect((await page.screenshot()).equals(normal)).toBe(true);
  }
  expect(errors).toEqual([]);
});
