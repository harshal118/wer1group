import { expect, test } from '@playwright/test';

for (const [width, travel] of [[1440, 260], [1024, 220]]) {
  test(`background-only parallax travels ${travel}px at ${width}px without gaps`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.mouse.move(0, 0);
    const section = page.locator('#about-preview');
    const background = section.locator('.about-preview-background');
    const geometry = await section.evaluate(el => ({ top: el.getBoundingClientRect().top + scrollY, height: el.getBoundingClientRect().height }));
    const read = () => background.evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m42);
    let cardOffset: number | undefined;
    const offsets: number[] = [];
    for (const progress of [.01, .5, .99, .5, .01]) {
      await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), geometry.top - 900 + progress * (900 + geometry.height));
      const expected = travel / 2 * Math.tanh((progress - .5) * (900 + geometry.height) * .45 / (travel / 2));
      await expect.poll(read).toBeCloseTo(expected, 0);
      offsets.push(await read());
      const sectionBox = (await section.boundingBox())!;
      const imageBox = (await background.boundingBox())!;
      expect(imageBox.y).toBeLessThanOrEqual(sectionBox.y);
      expect(imageBox.y + imageBox.height).toBeGreaterThanOrEqual(sectionBox.y + sectionBox.height);
      const relativeTop = (await section.locator('.about-preview-card').first().boundingBox())!.y - sectionBox.y;
      if (cardOffset === undefined) cardOffset = relativeTop;
      expect(relativeTop).toBeCloseTo(cardOffset, 1);
      await expect(section).toHaveCSS('transform', 'none');
      await expect(section.locator('.about-preview-grid')).toHaveCSS('transform', 'none');
    }
    expect(offsets[2] - offsets[0]).toBeGreaterThan(travel * .95);
    expect(offsets[4]).toBeCloseTo(offsets[0], 1);
    // Small wheel steps in both directions check the central 0.45 speed factor.
    const centerScroll = geometry.top - 900 + .5 * (900 + geometry.height);
    await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), centerScroll);
    await expect.poll(read).toBeCloseTo(0, 0);
    const startScroll = await page.evaluate(() => scrollY);
    let previous = await read();
    let wheelDistance = 0;
    for (const delta of [...Array(8).fill(12), ...Array(8).fill(-12)] as number[]) {
      wheelDistance += delta;
      await page.mouse.wheel(0, delta);
      await expect.poll(() => page.evaluate(() => scrollY)).toBe(startScroll + wheelDistance);
      const expected = travel / 2 * Math.tanh((startScroll + wheelDistance - centerScroll) * .45 / (travel / 2));
      await expect.poll(read).toBeCloseTo(expected, 1);
      const current = await read();
      expect((current - previous) * Math.sign(delta)).toBeGreaterThan(4);
      expect(Math.abs(current - previous)).toBeLessThan(5.5);
      previous = current;
    }
    await expect.poll(read).toBeCloseTo(0, 0);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(background).toHaveCSS('transform', 'none');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.setViewportSize({ width: 390, height: 900 });
    await section.scrollIntoViewIfNeeded();
    await expect(background).toHaveCSS('transform', 'none');
    expect(errors).toEqual([]);
  });
}

test('About introduction flows straight into preserved detailed sections without link strip', async ({ page }) => {
  await page.goto('/about');
  await expect(page.getByRole('navigation', { name: 'About page sections' })).toHaveCount(0);
  await expect(page.locator('.wer1-about-section-links, .about-contents')).toHaveCount(0);
  await expect(page.locator('.wer1-about-introduction + #our-evolution + #philosophy')).toHaveCount(1);
  await expect(page.locator('.wer1-about-introduction-body p')).toHaveCount(2);
  await expect(page.locator('#approach, [href$="#approach"]')).toHaveCount(0);
  await expect(page.locator('.wer1-about-construction img')).toHaveAttribute('src', '/media/about/construct.jpg');
  for (const id of ['philosophy', 'values', 'expertise']) await expect(page.locator(`#${id}`)).toHaveCount(1);
});

for (const width of [1920, 1440, 1024, 768, 430, 390]) {
  test(`three preview cards at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const section = page.locator('#projects + #about-preview');
    await expect(section).toHaveCount(1);
    const cards = section.locator('a');
    await expect(cards).toHaveCount(3);
    await expect(cards.locator('h2')).toHaveText(['Our Philosophy', 'Our Values', 'Our Expertise']);
    for (const description of await cards.locator('p').allTextContents()) expect(description.trim().split(/\s+/).length).toBeLessThanOrEqual(30);
    await expect(page.locator('[href$="#approach"], #approach')).toHaveCount(0);
    await expect(cards.first().locator('p')).toHaveCSS('text-align', 'justify');
    await expect(cards.first().locator('p')).toHaveCSS('text-align-last', 'left');
    await section.scrollIntoViewIfNeeded();
    const boxes = await cards.evaluateAll(elements => elements.map(el => { const b = el.getBoundingClientRect(); return { x: b.x, y: b.y, width: b.width, height: b.height }; }));
    expect(new Set(boxes.map(box => Math.round(box.x))).size).toBe(width > 900 ? 3 : 1);
    expect(Math.max(...boxes.map(b => b.width)) - Math.min(...boxes.map(b => b.width))).toBeLessThan(1);
    expect(new Set(boxes.map(box => Math.round(box.height))).size).toBe(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await section.screenshot({ path: `test-results/preview-cards-${width}.png` });
  });
}

test('only hovered card turns white, resets on leave, and keyboard focus matches', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('.about-preview-card');
  const initial = await cards.first().evaluate(el => getComputedStyle(el).backgroundColor);
  await cards.first().hover();
  await expect(cards.first()).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(cards.first()).toHaveCSS('color', 'rgb(15, 15, 16)');
  await expect(cards.nth(1)).toHaveCSS('background-color', initial);
  await cards.nth(1).hover();
  await expect(cards.first()).toHaveCSS('background-color', initial);
  await expect(cards.nth(1)).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await page.mouse.move(0, 0);
  await expect(cards.nth(1)).toHaveCSS('background-color', initial);
  await cards.first().focus();
  await page.keyboard.press('Tab');
  await expect(cards.nth(1)).toBeFocused();
  await expect(cards.nth(1)).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(cards.nth(1)).toHaveCSS('transition-duration', '0s');
  await expect(cards.nth(1)).toHaveCSS('transform', 'none');
});

for (const id of ['philosophy', 'values', 'expertise']) {
  test(`preview navigates to About ${id}, including direct URLs`, async ({ page }) => {
    await page.goto('/');
    await page.locator(`.about-preview-card[href="/about#${id}"]`).click();
    await expect(page).toHaveURL(`/about#${id}`);
    await expect(page.locator(`#${id}`)).toBeInViewport();
    await page.reload();
    await expect(page.locator(`#${id}`)).toBeInViewport();
    await expect(page.locator('.wer1-about-construction svg')).toHaveCount(0);
  });
}
