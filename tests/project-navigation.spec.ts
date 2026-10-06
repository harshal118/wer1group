import { test, expect } from '@playwright/test';
import { projects } from '../src/data/projects';

test('About precedes Projects and each hero card opens its matching detail', async ({ page }) => {
  const errors: string[] = [];
  let fiberUrl = '';
  page.on('request', request => { if (request.url().includes('react-three_fiber.js')) fiberUrl = request.url(); });
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/');
  await page.waitForTimeout(800);
  const order = await page.evaluate(() => ['.scroll-container', '#about', '#projects'].map(selector => document.querySelector(selector)!.getBoundingClientRect().top));
  expect(order[0]).toBeLessThan(order[1]);
  expect(order[1]).toBeLessThan(order[2]);
  await expect(page.locator('.project-detail')).toHaveCount(7);
  for (const project of projects) {
    await page.mouse.move(20, 900);
    await page.evaluate(p => scrollTo(0, p * (document.querySelector('.scroll-container')!.getBoundingClientRect().height - innerHeight)), project.scrollRange[0] + (project.scrollRange[1] - project.scrollRange[0]) * .52);
    await expect.poll(() => page.evaluate(async ({url,id}) => {
      const { _roots } = await import(url);
      const root = _roots.get(document.querySelector('canvas'))?.store.getState();
      const group = root?.scene.getObjectByName(`${id}-project-card`);
      if (!group?.visible) return false;
      const mesh = group.children[0];
      const matrix = mesh.matrixWorld.elements;
      return mesh.material.opacity === 1 && Math.abs(group.position.clone().applyQuaternion(root.camera.quaternion.clone().invert()).z - 4) < .0001 && Math.abs(matrix[12] - group.position.x) < .0001 && Math.abs(Math.hypot(matrix[0],matrix[1],matrix[2]) - group.scale.x) < .0001;
    }, {url:fiberUrl,id:project.id})).toBe(true);
    await page.mouse.click(project.side === 'left' ? 300 : 1140, 350);
    const target = page.locator(`#project-${project.id}`);
    await expect(target).toBeFocused();
    await expect(target).toHaveAttribute('data-project-focus', 'true');
    await expect.poll(async () => { const y = (await target.boundingBox())!.y; return y >= 119 && y < 400; }).toBe(true);
    await expect(target).toContainText('Residential + Commercial');
    await expect(page).toHaveURL(new RegExp(`#project-${project.id}$`));
  }
  await page.getByRole('link', { name: 'Projects', exact: true }).click();
  await expect(page.locator('#projects')).toBeFocused();
  await expect.poll(async () => Math.round((await page.locator('#projects').boundingBox())!.y)).toBe(90);
  await page.screenshot({ path: 'test-results/projects-section.png' });
  await page.locator('#about').scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'test-results/about-section.png' });
  expect(errors).toEqual([]);
});
