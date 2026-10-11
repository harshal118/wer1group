import { expect, test } from '@playwright/test';
for (const width of [1920,1440,1024,768,430,390]) {
  test(`contact layout and actions at ${width}`, async ({page}) => {
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.setViewportSize({width,height:1000});
    await page.goto('/contact');
    const main = page.locator('main');
    await expect(main.locator('h1')).toHaveText("Let's Build Something Meaningful.");
    await expect(main.locator('h2')).toHaveText(['Our Office','Start a Conversation']);
    await expect(main.locator('address')).toHaveText('VTP Altitude,Aundh–Ravet BRTS Road,Wakad, Pune – 411033,Maharashtra, India.');
    await expect(main.locator('a[href^="tel:"]')).toHaveCount(2);
    await expect(main.getByRole('link',{name:'+91 9011881133',exact:true})).toHaveAttribute('href','tel:+919011881133');
    await expect(main.getByRole('link',{name:'+91 7887700722',exact:true})).toHaveAttribute('href','tel:+917887700722');
    await expect(main.locator('iframe')).toHaveCount(0);
    await expect(main.locator('.instagram-link')).toHaveAttribute('href','https://www.instagram.com/wer1_group?vrfl=amszYmQ3cGVmbnk1');
    await expect(main.locator('.instagram-link linearGradient')).toHaveCount(1);
    const cta = main.getByRole('link',{name:'Send Us an Email',exact:true});
    await expect(cta).toHaveAttribute('href','mailto:wer1infra@gmail.com');
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
