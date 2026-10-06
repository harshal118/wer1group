import { test, expect } from '@playwright/test';

test('supplied hero image and camera remain fixed throughout scrolling', async ({ page }) => {
  let fiberUrl = '';
  const errors: string[] = [];
  const assets: string[] = [];
  page.on('request', request => {
    assets.push(request.url());
    if (request.url().includes('react-three_fiber.js')) fiberUrl = request.url();
  });
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/');
  const state = () => page.evaluate(async url => {
    const { _roots } = await import(url);
    const root = _roots.get(document.querySelector('canvas'))?.store.getState();
    const logo = root?.scene.getObjectByName('static-image-occluder');
    if (!logo) return null;
    return {
      transform: [...logo.matrixWorld.elements], camera: [...root.camera.matrixWorld.elements],
      elements: [logo.name],
      legacy: Boolean(root.scene.getObjectByName('project-stage') || root.scene.getObjectByName('site-landscape')),
    };
  }, fiberUrl);
  await expect.poll(async () => (await state())?.elements).toEqual(['static-image-occluder']);
  await page.waitForTimeout(300);
  const initial = await state();
  const image = page.locator('.hero-image');
  await expect(image).toHaveAttribute('src', '/images/hero/Luxurious_WER1_Group_Gold_Logo.webp');
  const imageBounds = await image.boundingBox();
  await page.screenshot({ path: 'test-results/logo-top.png' });
  for (const progress of [.14, .26, .38, .5, .62, .75, .90, 1]) {
    await page.evaluate(p => scrollTo(0, p * (document.querySelector('.scroll-container')!.getBoundingClientRect().height - innerHeight)), progress);
    await page.waitForTimeout(150);
    expect(await state()).toEqual(initial);
    expect(await image.boundingBox()).toEqual(imageBounds);
  }
  await page.screenshot({ path: 'test-results/logo-end.png' });
  expect(assets.some(url => /\.glb(?:\?|$)/.test(url))).toBe(false);
  expect(initial?.legacy).toBe(false);
  await expect(page.locator('.project-title')).toHaveText('WER1GROUP');
  await expect(page.getByRole('navigation').getByRole('link')).toHaveText(['Home', 'Projects', 'Enquire']);
  expect(errors).toEqual([]);
});
