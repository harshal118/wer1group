import { expect, test } from '@playwright/test';
for (const width of [1920,1440,1024,768,430,390,360]) {
  test(`contact layout and actions at ${width}`, async ({page}) => {
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.setViewportSize({width,height:1000});
    await page.goto('/contact');
    const main = page.locator('main');
    await expect(main.locator('h1')).toHaveText("Let's Build Something Meaningful.");
    await expect(main.locator('h2')).toHaveText(['Our Office','Start a Conversation']);
    await expect(main.locator('address')).toHaveText('VTP Altitude, 5th Floor, Office No. 526,Aundh–Ravet BRTS Road, Wakad,Pune – 411033, Maharashtra, India.');
    await expect(main.locator('a[href^="tel:"], .instagram-link')).toHaveCount(0);
    await expect(page.locator('footer a[href="tel:+917350004455"]')).toHaveText('+91 7350004455');
    await expect(page.locator('footer a[href^="tel:"]')).toHaveCount(1);
    await expect(page.locator('footer .instagram-link linearGradient')).toHaveCount(1);
    await expect(page.locator('footer a[href="mailto:wer1infra@gmail.com"]')).toBeVisible();
    const cta = main.getByRole('link',{name:'Send Us an Email',exact:true});
    await expect(cta).toHaveAttribute('href','mailto:wer1infra@gmail.com');
    const whatsapp = main.getByRole('link', { name: 'Discuss Your Project Requirements', exact: true });
    await expect(whatsapp).toHaveAttribute('href', (await page.locator('.whatsapp-button').getAttribute('href'))!);
    await expect(whatsapp).toHaveAttribute('target', '_blank');
    await expect(whatsapp).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(main.locator('.contact-conversation a')).toHaveCount(2);
    await page.evaluate(() => document.fonts.ready);
    // Finish the existing entrance animation before comparing geometry.
    await main.locator('.contact-page-grid').evaluate(async element => {
      await Promise.all(element.getAnimations().map(animation => animation.finished));
    });
    const center = await main.locator('.contact-conversation').evaluate(element => {
      const box = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      const left = parseFloat(style.borderLeftWidth) + parseFloat(style.paddingLeft);
      const right = parseFloat(style.borderRightWidth) + parseFloat(style.paddingRight);
      return box.x + left + (box.width - left - right) / 2;
    });
    const first = (await cta.boundingBox())!;
    const second = (await whatsapp.boundingBox())!;
    if (width >= 1024) {
      expect(first.y).toBeCloseTo(second.y, 1);
      expect(first.height).toBeCloseTo(second.height, 1);
      expect((first.x + second.x + second.width) / 2).toBeCloseTo(center, 1);
    } else {
      expect(first.width).toBeCloseTo(second.width, 1);
      expect(second.y - first.y - first.height).toBeCloseTo(16, 1);
      expect(first.x + first.width / 2).toBeCloseTo(center, 1);
    }
    await cta.focus();
    await expect(cta.locator('.brand-story-border path')).toHaveCSS('stroke-dashoffset','0px');
    await expect(cta).toHaveCSS('outline-style','solid');
    await cta.blur();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await main.screenshot({path:`test-results/contact-refinement-${width}.png`});
    await page.emulateMedia({reducedMotion:'reduce'});
    await expect(main.locator('.contact-introduction')).toHaveCSS('animation-name','none');
    await expect(cta.locator('.brand-story-border path')).toHaveCSS('transition-duration','0s');
    expect(errors).toEqual([]);
  });
}
