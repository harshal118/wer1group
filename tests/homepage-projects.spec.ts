import { expect, test } from '@playwright/test';

const order = ['Sukhada Apartment', 'Sinclair Place', 'Aikyam', 'Marunji', 'Punawale', 'Chinchwad'];

test('project filters preserve six-entry order and accurate fields', async ({ page }) => {
  await page.goto('/');
  const names = page.locator('.project-card h3');
  await expect(names).toHaveText(order);
  await expect(page.locator('.project-facts')).toContainText(Array(6).fill('Residential + Complex'));
  await expect(page.locator('.project-card .project-status')).toHaveText(['Completed', 'Completed', 'Completed', 'Ongoing', 'Upcoming', 'Ongoing']);
  for (const [index, year] of [2023, 2024, 2025, 2027, 2027, 2028].entries()) {
    const facts = page.locator('.project-facts').nth(index);
    await expect(facts).toContainText(String(year));
    await expect(facts.locator('div').filter({ has: page.locator('dt', { hasText: 'Land Area' }) }).locator('dd')).toHaveText(['5,400 sq. ft.', '6,000 sq. ft.', '17,400 sq. ft.', '4,300 sq. ft.', '50,000 sq. ft.', '11,300 sq. ft.'][index]);
    await expect(facts.locator('div').filter({ has: page.locator('dt', { hasText: 'Total Units' }) }).locator('dd')).toHaveText(['10', '16', '60', '20', 'Details Coming Soon', '50'][index]);
  }
  await expect(page.locator('.project-description')).toHaveCount(6);
  const filters = page.getByRole('group', { name: 'Filter projects' });
  await filters.getByRole('button', { name: 'Completed', exact: true }).click();
  await expect(names).toHaveText(order.slice(0, 3));
  await filters.getByRole('button', { name: 'Ongoing', exact: true }).click();
  await expect(names).toHaveText(['Marunji', 'Chinchwad']);
  await filters.getByRole('button', { name: 'Upcoming', exact: true }).click();
  await expect(names).toHaveText(['Punawale']);
  await expect(page.locator('.project-card img')).toHaveCount(0);
  await expect(page.locator('.coming-soon-copy')).toContainText('Coming soon');
  await expect(page.locator('.coming-soon-copy')).toContainText('Expected Completion 2027');
  await filters.getByRole('button', { name: 'All Projects' }).click();
  await expect(names).toHaveText(order);
});

test('hero has separate image order and never loads Punawale photographs or old logos', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/');
  await expect(page.locator('.slide-dots button')).toHaveCount(5);
  await expect(page.locator('.hero-slide')).toHaveCount(5);
  expect(await page.locator('.hero-slide img').evaluateAll(images => images.every(image => Boolean(image.getAttribute('alt'))))).toBe(true);
  const files = await page.locator('.hero-slide img').evaluateAll(images => images.map(image => image.getAttribute('src')));
  expect(files).toEqual(['aikyam', 'chinchwad', 'sinclair-place', 'sukhada-apartment', 'marunji'].map(id => `/media/projects/${id}.webp`));
  for (const id of ['sukhada-apartment', 'sinclair-place', 'aikyam', 'marunji', 'chinchwad']) {
    const image = page.locator(`[data-project-id="${id}"] img`);
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveAttribute('src', `/media/projects/${id}.webp`);
    await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  }
  expect(requests.some(url => /punawale-phase-[12]|wer1-logo\.jpg/.test(url))).toBe(false);
  await expect(page.locator('main')).not.toContainText(/Punawale Phase|Punawale 1 and 2/);
  const favicon = await page.locator('link[rel="icon"]').getAttribute('href');
  expect(favicon).toMatch(/WER1_Logo.*\.png/);
});

test('client messaging, five expertise categories and distinct philosophy sections', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.about-copy')).toContainText('At WeR1 Group, we are committed to developing spaces');
  await expect(page.locator('.about-preview-card h2')).toHaveText(['Our Philosophy', 'Our Expertise', 'Our Values', 'Our Approach']);
  await expect(page.locator('.values-grid article')).toHaveCount(0);
  await expect(page.locator('.approach-grid li')).toHaveCount(0);
  await expect(page.locator('.credibility-pillar p')).toHaveCount(5);
  await expect(page.locator('.credibility-pillar h3')).toHaveText(['Comprehensive Development Capabilities', 'A Customer-Centric Approach', 'Collaborative Partnerships', 'Quality-Focused Execution', 'A Vision for Better Living']);
  await expect(page.locator('footer a[href="mailto:wer1infra@gmail.com"]')).toBeVisible();
  await expect(page.locator('a[href*="enquiry@wer1group.in"]')).toHaveCount(0);
  await expect(page.locator('.project-card a')).toHaveCount(0);
  expect(await page.locator('main > section').evaluateAll(sections => sections.map(section => section.id)))
    .toEqual(['home-showcase', 'about', 'projects', 'about-preview', 'why-wer1']);
});

test('image failure uses shared fallback without unrelated pictures', async ({ page }) => {
  await page.route(/\/media\/projects\/(?:aikyam\.webp|Landscape_Project_Assets\/Aikyam_Landscape\.webp)$/, route => route.abort());
  await page.goto('/');
  await expect(page.locator('.hero-slide.is-active .hero-placeholder')).toContainText('Image forthcoming');
  await page.locator('[data-project-id="aikyam"]').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-project-id="aikyam"] .hero-placeholder')).toContainText('Image forthcoming');
});

for (const width of [1440, 390]) {
  test(`contact direct URL at ${width}px has verified contacts and safe Instagram links`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.setViewportSize({ width, height: 900 });
    const response = await page.goto('/contact');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle('Contact WER1 Group | Constructing Happiness');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://wer1group.in/contact');
    await expect(page.locator('main address')).toContainText('VTP Altitude, 5th Floor, Office No. 526,Aundh–Ravet BRTS Road, Wakad,Pune – 411033, Maharashtra, India.');
    await expect(page.locator('footer address')).toContainText('VTP Altitude');
    await expect(page.locator('footer a[href="tel:+917350004455"]')).toBeVisible();
    await expect(page.locator('footer a[href="tel:+917887700722"]')).toBeVisible();
    const instagram = page.locator('footer .instagram-link');
    await expect(instagram).toHaveAttribute('href', 'https://www.instagram.com/wer1_group?vrfl=amszYmQ3cGVmbnk1');
    await expect(instagram).toHaveAttribute('target', '_blank');
    await expect(instagram).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(page.locator('footer .instagram-link')).toBeVisible();
    await expect(page.locator('a[href*="enquiry@wer1group.in"]')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `test-results/contact-${width}.png`, fullPage: true });
    expect(errors).toEqual([]);
  });
}
