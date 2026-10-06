import { test, expect } from '@playwright/test';
import { projects } from '../src/data/projects';

test('seven spatial cards sequence independently and leave a clean ending', async ({ page }) => {
  test.setTimeout(90000);
  let moduleUrl = '';
  const errors: string[] = [];
  const requested: string[] = [];
  page.on('request', request => {
    requested.push(request.url());
    if (request.url().includes('/gsap_ScrollTrigger.js')) moduleUrl = request.url();
  });
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/');
  const snapshot = () => page.evaluate(async url => {
    const { ScrollTrigger } = await import(url);
    const cards = ScrollTrigger.getAll().filter((trigger: { vars: { id: string } }) => trigger.vars.id?.endsWith('-card'));
    return {
      cards: cards.map((trigger: { vars: { id: string }; animation: { getChildren: () => { targets: () => Record<string, number>[] }[] } }) => {
        const state = trigger.animation.getChildren()[0].targets()[0];
        return { id: trigger.vars.id, x: state.x, y: state.y, z: state.z, yaw: state.yaw, scale: state.scale, opacity: state.opacity };
      }),
      progress: ScrollTrigger.getById('project-card-window')?.progress,
      buildingRotation: Boolean(ScrollTrigger.getById('building-rotation')),
    };
  }, moduleUrl);
  await expect.poll(async () => (await snapshot()).progress, { timeout: 30000 }).toBe(0);
  await expect.poll(async () => (await snapshot()).cards.find((card: { id: string }) => card.id === `${projects[0].id}-card`)?.opacity).toBe(0);
  expect(requested.filter(url => url.includes('/images/projects/') && url.endsWith('.webp'))).toHaveLength(1);
  const scroll = async (progress: number, id?: string) => {
    await page.evaluate(p => scrollTo(0, p * (document.querySelector('.scroll-container')!.getBoundingClientRect().height - innerHeight)), progress);
    // Native scroll positions are integer CSS pixels.
    const actual = await page.evaluate(() => scrollY / (document.querySelector('.scroll-container')!.getBoundingClientRect().height - innerHeight));
    await expect.poll(async () => (await snapshot()).progress).toBeCloseTo(actual, 5);
    if (id) await expect.poll(async () => (await snapshot()).cards.some((card: { id: string }) => card.id === `${id}-card`)).toBe(true);
    return snapshot();
  };
  for (const project of projects) {
    const [start, end] = project.scrollRange;
    const span = end - start;
    const find = async () => (await snapshot()).cards.find((card: { id: string }) => card.id === `${project.id}-card`)!;
    await scroll(start + span * .09, project.id);
    await expect.poll(async () => (await find()).opacity).toBeGreaterThan(0);
    const entering = await find();
    expect(entering.opacity).toBeLessThan(1);
    expect(entering.z).toBeLessThan(0);
    expect(Math.sign(entering.yaw)).toBe(project.side === 'left' ? -1 : 1);
    await scroll(start + span * .52, project.id);
    await expect.poll(async () => (await find()).z).toBe(4);
    const display = await find();
    expect(display).toMatchObject({ opacity: 1, yaw: 0, scale: 1 });
    expect(Math.sign(display.x)).toBe(project.side === 'left' ? -1 : 1);
    const all = (await snapshot()).cards;
    expect(all.length).toBeLessThanOrEqual(2);
    expect(all.filter((card: { opacity: number }) => card.opacity > .001)).toHaveLength(1);
    await page.screenshot({ path: `test-results/${project.id}-display.png` });
    await scroll(start + span * .68, project.id);
    const linger = await find();
    for (const property of ['x', 'y', 'z', 'yaw', 'scale', 'opacity'] as const) expect(linger[property]).toBe(display[property]);
    await scroll(start + span * .93, project.id);
    const retreat = await find();
    expect(retreat.z).toBeLessThan(-5);
    expect(Math.abs(retreat.x)).toBeLessThan(Math.abs(display.x));
    expect(retreat.opacity).toBeLessThan(1);
    await page.screenshot({ path: `test-results/${project.id}-exit.png` });
  }
  await scroll(1);
  await expect.poll(async () => (await snapshot()).cards.filter((card: { opacity: number }) => card.opacity > .001).length).toBe(0);
  await page.screenshot({ path: 'test-results/projects-clean-end.png' });
  // A reverse jump must remount the correct card without showing neighboring cards.
  await scroll(.26, 'sinclair-place');
  await expect.poll(async () => (await snapshot()).cards.find((card: { id: string }) => card.id === 'sinclair-place-card')?.opacity).toBe(1);
  for (const project of projects) {
    if (project.image) expect(requested.some(url => url.includes(project.image!))).toBe(true);
    else {
      await expect(page.locator(`#project-${project.id} .project-detail-image img`)).toHaveCount(0);
      await expect(page.locator(`#project-${project.id} .project-coming-soon`)).toHaveText('COMING SOON');
    }
    expect(project.type).toBe('Residential + Commercial');
  }
  expect(requested.some(url => /\.(pdf|glb)(?:\?|$)/.test(url))).toBe(false);
  expect((await snapshot()).buildingRotation).toBe(false);
  await expect(page.locator('canvas')).toHaveCount(1);
  expect(errors).toEqual([]);
});
