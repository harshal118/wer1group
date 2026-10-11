import { expect, test } from '@playwright/test';

for (const width of [1920, 1440, 1366, 1024, 768, 430, 390]) {
  test(`champagne transition, compact footer and static Why Choose at ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(page.locator('main .closing-section')).toHaveCount(0);
    await expect(page.locator('#why-wer1 a, #why-wer1 button, #why-wer1 svg, #why-wer1 [role="button"]')).toHaveCount(0);
    await expect(page.locator('.credibility-pillar')).toHaveCount(5);
    await expect(footer).toHaveCSS('background-color', 'rgb(0, 0, 0)');
    await expect(footer.locator('.footer-office')).toHaveCount(0);
    await expect(footer.getByText('Visit Our Office', { exact: true })).toHaveCount(0);
    await expect(footer.locator('.footer-bottom a')).toHaveCount(0);
    await expect(footer.locator('address')).toHaveCount(1);
    await expect(footer.locator('.footer-grid > *')).toHaveCount(4);
    const visit = footer.locator('.footer-visit');
    const map = visit.locator('iframe');
    await expect(map).toHaveCSS('height', '160px');
    expect(await visit.evaluate(el => [...el.children].map(child => child.tagName))).toEqual(['P', 'ADDRESS', 'IFRAME']);
    await expect(visit.locator('a')).toHaveCount(0);
    await expect(visit.locator('address br')).toHaveCount(1);
    if (width >= 1366) {
      const addressHeight = await visit.locator('address').evaluate(el => ({ height: el.getBoundingClientRect().height, line: parseFloat(getComputedStyle(el).lineHeight) }));
      expect(addressHeight.height).toBeCloseTo(addressHeight.line * 2, 0);
    }
    await expect(footer.locator('.instagram-link linearGradient stop')).toHaveCount(5);
    await expect(page.locator('.footer-heading h2')).toHaveText("We Don't Just Develop Land. We Create Better Ways to Live.");
    await expect(page.locator('.footer-heading p')).toHaveText('Land holds potential. People give it purpose. Together, we create spaces for a better tomorrow.');
    await expect(page.locator('.footer-heading > *')).toHaveCount(2);
    await expect(page.locator('.footer-heading a, .footer-heading button, .footer-heading svg')).toHaveCount(0);
    const statement = page.locator('.champagne-closing');
    await expect(statement).toHaveCount(1);
    await expect(statement).toHaveCSS('background-color', 'rgb(238, 232, 220)');
    await expect(page.locator('#closing + footer')).toHaveCount(1);
    const statementBox = (await statement.boundingBox())!;
    const whyBox = (await page.locator('#why-wer1').boundingBox())!;
    const footerBox = (await footer.boundingBox())!;
    expect(statementBox.y).toBeCloseTo(whyBox.y + whyBox.height, 0);
    expect(footerBox.y).toBeCloseTo(statementBox.y + statementBox.height, 0);
    await statement.screenshot({ path: `test-results/champagne-statement-${width}.png` });
    const logo = footer.locator('.footer-white-logo');
    await logo.scrollIntoViewIfNeeded();
    await expect(logo).toHaveAttribute('src', '/media/brand/WER1_Logo_white_text.jpg');
    await expect.poll(() => logo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth === 2084 && img.naturalHeight === 2085)).toBe(true);
    const box = (await logo.boundingBox())!;
    expect(box.width / box.height).toBeCloseTo(2084 / 2085, 3);
    await expect(page.locator('header .brand-logo')).toHaveAttribute('src', /WER1_Logo.*\.png/);
    await expect(footer.locator('.footer-navigation a')).toHaveText(['Home', 'About Us', 'Projects', 'Our Expertise', 'Contact Us']);
    await expect(footer.locator('address')).toContainText('VTP Altitude');
    await expect(footer.locator('.instagram-link')).toHaveAttribute('rel', 'noopener noreferrer');
    await footer.locator('a[href="mailto:wer1infra@gmail.com"]').hover();
    await expect(footer.locator('a[href="mailto:wer1infra@gmail.com"]')).toHaveCSS('color', 'rgb(225, 191, 118)');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await footer.screenshot({ path: `test-results/unified-footer-${width}.png` });
    expect(errors).toEqual([]);
  });
}

test('footer expertise link reaches preserved About section', async ({ page }) => {
  await page.goto('/');
  await page.locator('footer').getByRole('link', { name: 'Our Expertise' }).click();
  await expect(page).toHaveURL('/about#expertise');
  await expect(page.locator('#expertise')).toBeInViewport();
});
