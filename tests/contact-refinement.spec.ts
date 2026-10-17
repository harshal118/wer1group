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
    await expect(main.locator('a[href^="tel:"]')).toHaveCount(2);
    await expect(main.getByRole('link',{name:'+91 9011881133',exact:true})).toHaveAttribute('href','tel:+919011881133');
    await expect(main.getByRole('link',{name:'+91 7887700722',exact:true})).toHaveAttribute('href','tel:+917887700722');
    await expect(main.locator('iframe')).toHaveCount(0);
    await expect(main.locator('.instagram-link')).toHaveAttribute('href','https://www.instagram.com/wer1_group?vrfl=amszYmQ3cGVmbnk1');
    await expect(main.locator('.instagram-link linearGradient')).toHaveCount(1);
    const cta = main.getByRole('link',{name:'Send Us an Email',exact:true});
    await expect(cta).toHaveAttribute('href','mailto:wer1infra@gmail.com');
    await expect(main.locator('.contact-link-row').nth(1).locator('a').first()).toHaveAttribute('href','mailto:wer1infra@gmail.com');
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
    for (const row of await main.locator('.contact-link-row').all()) {
      const links = await row.locator('a').all();
      const boxes = await Promise.all(links.map(link => link.boundingBox()));
      for (const link of links) await expect(link).toHaveCSS('font-size', '15px');
      for (const box of boxes) expect(box!.height).toBeGreaterThanOrEqual(44);
      if (width >= 1024) {
        expect(boxes[0]!.y + boxes[0]!.height / 2).toBeCloseTo(boxes[1]!.y + boxes[1]!.height / 2, 1);
        expect((boxes[0]!.x + boxes[1]!.x + boxes[1]!.width) / 2).toBeCloseTo(center, 1);
        expect(boxes[1]!.x).toBeGreaterThan(boxes[0]!.x + boxes[0]!.width);
      } else if (width <= 600) {
        for (const box of boxes) expect(box!.x + box!.width / 2).toBeCloseTo(center, 1);
        expect(boxes[1]!.y).toBeGreaterThanOrEqual(boxes[0]!.y + boxes[0]!.height);
      }
    }
    const buttonBox = (await cta.boundingBox())!;
    const rowsBox = (await main.locator('.contact-page-links').boundingBox())!;
    expect(buttonBox.x + buttonBox.width / 2).toBeCloseTo(center, 1);
    expect(buttonBox.y - rowsBox.y - rowsBox.height).toBeCloseTo(24, 1);
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
