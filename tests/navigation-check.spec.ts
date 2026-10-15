import { test, expect } from '@playwright/test';
for (const width of [1440, 1024, 768, 390]) {
  for (const route of ['/', '/about', '/contact']) {
    test(`${route} expertise navigation at ${width}`, async ({page}) => {
      await page.setViewportSize({width,height:900});
      await page.goto(route);
      const nav = page.getByRole('navigation',{name:'Main navigation'});
      if(width <=768) await page.getByRole('button',{name:'Open navigation'}).click();
      await expect(nav.locator(':scope > a')).toHaveText(['Home','About us','Our Expertise','Contact us']);
      await expect(nav.getByRole('button', {name:'Projects', exact:true})).toBeVisible();
      await expect(nav.getByText('Media',{exact:true})).toHaveCount(0);
      const link = nav.getByRole('link',{name:'Our Expertise'});
      expect(await link.getAttribute('href')).toBe(await page.locator('footer').getByRole('link',{name:'Our Expertise'}).getAttribute('href'));
      await link.click();
      await expect(page).toHaveURL('/about#expertise');
      await expect(page.locator('#expertise')).toBeInViewport();
      await expect(page.locator('#main-navigation a[href="/about#expertise"]')).toHaveAttribute('aria-current','location');
      if(width <=768) await expect(page.getByRole('button',{name:'Open navigation'})).toHaveAttribute('aria-expanded','false');
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    });
  }
}
