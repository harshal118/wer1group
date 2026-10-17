import { expect, test } from '@playwright/test';

const mappings = [
  ['sukhada-apartment', 'Sukhada'], ['sinclair-place', 'Sinclair'], ['aikyam', 'Aikyam'],
  ['marunji', 'Marunji'], ['chinchwad', 'Chinchwad'],
] as const;
const landscape = (name: string) => `/media/projects/Landscape_Project_Assets/${name}_Landscape.webp`;

for (const width of [1920, 1440, 1366, 1024, 901, 900, 769, 768, 430, 390]) {
  test(`project source selection and preserved containers at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const requests: string[] = [];
    page.on('request', request => requests.push(new URL(request.url()).pathname));
    await page.goto('/');
    for (const [id, name] of mappings) {
      const image = page.locator(`[data-project-id="${id}"] img`);
      await image.scrollIntoViewIfNeeded();
      const expected = landscape(name);
      await expect.poll(() => image.evaluate(img => new URL((img as HTMLImageElement).currentSrc, document.baseURI).pathname)).toBe(expected);
      await expect.poll(() => image.evaluate(img => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0)).toBe(true);
      await expect(image).toHaveAttribute('src', `/media/projects/${id}.webp`);
      await expect(image).toHaveCSS('object-fit', 'cover');
      const card = await page.locator(`[data-project-id="${id}"] .project-card-visual`).boundingBox();
      expect(card!.width / card!.height).toBeCloseTo(4 / 3, 2);
      expect(await image.evaluate(img => [(img as HTMLImageElement).naturalWidth, (img as HTMLImageElement).naturalHeight])).toEqual([1672, 941]);
    }
    const background = page.locator('.about-preview-background');
    await background.scrollIntoViewIfNeeded();
    await expect.poll(() => background.evaluate(img => new URL((img as HTMLImageElement).currentSrc, document.baseURI).pathname))
      .toBe(width > 900 ? landscape('Sinclair') : '/media/projects/sinclair-place.webp');
    const heroImages = page.locator('.hero-slide img');
    expect(await heroImages.evaluateAll(images => images.map(img => new URL((img as HTMLImageElement).currentSrc, document.baseURI).pathname)))
      .toEqual(['Aikyam', 'Chinchwad', 'Sinclair', 'Sukhada', 'Marunji'].map(name => landscape(name)));
    await expect(page.locator('[data-project-id="punawale"] img')).toHaveCount(0);
    if (width > 768) expect(requests).not.toContain('/media/projects/aikyam.webp');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('project cards retain landscape sources across viewport changes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/projects');
  const image = page.locator('[data-project-id="aikyam"] img');
  await image.scrollIntoViewIfNeeded();
  for (const width of [390, 1440, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => image.evaluate(img => new URL((img as HTMLImageElement).currentSrc, document.baseURI).pathname))
      .toBe(landscape('Aikyam'));
  }
});

for (const width of [1440, 768, 390]) {
  test(`Projects page filters retain landscape images at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/projects');
    const filters = page.getByRole('group', { name: 'Filter projects' });
    for (const [status, ids] of [
      ['Completed', ['sukhada-apartment', 'sinclair-place', 'aikyam']],
      ['Ongoing', ['marunji', 'chinchwad']],
      ['Upcoming', ['punawale']],
    ] as const) {
      await filters.getByRole('button', { name: status, exact: true }).click();
      await expect(page.locator('.project-card')).toHaveCount(ids.length);
      for (const id of ids) {
        const card = page.locator(`[data-project-id="${id}"]`);
        if (id === 'punawale') {
          await expect(card.locator('img')).toHaveCount(0);
          await expect(card.locator('.coming-soon-copy')).toBeVisible();
          continue;
        }
        const image = card.locator('img');
        await image.scrollIntoViewIfNeeded();
        await expect.poll(() => image.evaluate(img => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth === 1672)).toBe(true);
        expect(await image.evaluate(img => new URL((img as HTMLImageElement).currentSrc).pathname))
          .toBe(landscape(mappings.find(([mapped]) => mapped === id)![1]));
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
