import { test, expect } from '@playwright/test';

for (const width of [1440,834,390,360]) test(`company sections and contact at ${width}px`,async({browser})=>{
  const context=await browser.newContext({viewport:{width,height:1000},hasTouch:width<1024});
  const page=await context.newPage();
  const errors:string[]=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  await page.goto('/');
  const ids=['home','about','what-we-do','team','why-choose','projects','contact'];
  const positions=await page.evaluate(ids=>ids.map(id=>document.getElementById(id)!.getBoundingClientRect().top),ids);
  positions.slice(1).forEach((top,index)=>expect(top).toBeGreaterThan(positions[index]));
  await expect(page.locator('#what-we-do .company-item')).toHaveCount(4);
  await expect(page.locator('#team .company-item')).toHaveCount(2);
  await expect(page.locator('#why-choose .company-item')).toHaveCount(4);
  await expect(page.locator('#team')).toContainText("Holding master's degrees");
  await expect(page.locator('#team')).toContainText('5+ years of hands-on field experience');
  for(const id of ['what-we-do','team','why-choose','contact']){
    await page.locator(`#${id}`).evaluate(el=>el.scrollIntoView());
    const layout=await page.evaluate(id=>{
      const section=document.getElementById(id)!;
      const grid=section.querySelector('.company-grid, .contact-details')!;
      return {overflow:document.documentElement.scrollWidth>innerWidth,columns:getComputedStyle(grid).gridTemplateColumns.split(' ').length,clipped:[...section.querySelectorAll('h2,h3,p,a')].some(el=>el.getBoundingClientRect().right>innerWidth+1)};
    },id);
    expect(layout.overflow).toBe(false);expect(layout.clipped).toBe(false);
    expect(layout.columns).toBe(width<768?1:id==='why-choose'&&width>=1024?4:2);
    await page.screenshot({path:`test-results/company-${width}-${id}.png`});
  }
  if(width<768){await page.getByRole('button',{name:'Menu',exact:true}).click();await page.getByRole('dialog').getByRole('link',{name:'Enquire'}).click();}
  else await page.getByRole('navigation').getByRole('link',{name:'Enquire'}).click();
  await expect(page.locator('#contact')).toBeFocused();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.locator('#contact a').nth(0)).toHaveAttribute('href','tel:+919011881133');
  await expect(page.locator('#contact a').nth(1)).toHaveAttribute('href','tel:+917887700722');
  await expect(page.locator('#contact a').nth(2)).toHaveAttribute('href','mailto:wer1infra@gmail.com');
  await expect(page.locator('footer')).toHaveText('WER1 INFRA · CONSTRUCTING HAPPINESS');
  if(width<768){await page.getByRole('button',{name:'Menu',exact:true}).click();await page.getByRole('dialog').getByRole('link',{name:'Home',exact:true}).click();}
  else await page.getByRole('navigation').getByRole('link',{name:'Home',exact:true}).click();
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(0);
  expect(errors).toEqual([]);
  await context.close();
});
