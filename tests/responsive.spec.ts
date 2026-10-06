import { test, expect, type Page } from '@playwright/test';
import { projects } from '../src/data/projects';

const viewports = [[1440,900],[1280,800],[1024,768],[834,1112],[768,1024],[430,932],[390,844],[375,812],[360,800]];

async function cardBounds(page: Page, moduleUrl: string, id: string) {
  return page.evaluate(async ({ url, id }) => {
    const { _roots } = await import(url);
    const canvas = document.querySelector('canvas')!;
    const root = _roots.get(canvas)?.store.getState();
    const group = root?.scene.getObjectByName(`${id}-project-card`);
    if (!group?.visible) return null;
    const mesh = group.children[0];
    // Demand rendering updates GPU-visible transforms on the next animation frame.
    // Wait for those matrices, not just the synchronously updated GSAP opacity.
    const matrix = mesh.matrixWorld.elements;
    if (Math.abs(Math.hypot(matrix[0], matrix[1], matrix[2]) - group.scale.x) > .0001
      || Math.abs(matrix[12] - group.position.x) > .0001
      || Math.abs(matrix[13] - group.position.y) > .0001
      || Math.abs(matrix[14] - group.position.z) > .0001) return null;
    const h = mesh.geometry.parameters.height;
    const rect = canvas.getBoundingClientRect();
    const points = [[-.5,-h/2],[.5,-h/2],[.5,h/2],[-.5,h/2],[0,h/4]].map(([x,y]) => {
      const point = group.position.clone().set(x,y,0).applyMatrix4(mesh.matrixWorld).project(root.camera);
      return { x: rect.left + (point.x+1)*rect.width/2, y: rect.top+(1-point.y)*rect.height/2 };
    });
    return { left:Math.min(...points.map(p=>p.x)),right:Math.max(...points.map(p=>p.x)),top:Math.min(...points.map(p=>p.y)),bottom:Math.max(...points.map(p=>p.y)),tap:points[4],opacity:mesh.material.opacity,dpr:root.viewport.dpr,depth:group.position.clone().applyQuaternion(root.camera.quaternion.clone().invert()).z };
  }, { url: moduleUrl, id });
}

for (const [width,height] of viewports) test(`responsive ${width}x${height}`, async ({ browser }) => {
  test.setTimeout(90000);
  const context = await browser.newContext({ viewport:{width,height},hasTouch:width<1024,isMobile:width<768,deviceScaleFactor:width<1024?2:1 });
  const page = await context.newPage();
  const errors:string[]=[];
  let fiberUrl='';
  page.on('request', request=>{ if(request.url().includes('react-three_fiber.js'))fiberUrl=request.url(); });
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  await page.goto('/');
  await page.locator('.hero-image').evaluate((el:HTMLImageElement)=>el.decode());
  await page.waitForTimeout(500);
  const overflow=()=>page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  expect(await overflow()).toBe(false);
  const hero=await page.locator('.hero-image').boundingBox();
  expect(hero!.x).toBeGreaterThanOrEqual(-1);
  expect(hero!.x+hero!.width).toBeLessThanOrEqual(width+1);
  expect(hero!.width/hero!.height).toBeCloseTo(1672/941,2);
  await page.screenshot({path:`test-results/responsive-${width}-hero.png`});
  if(width<768){
    await page.getByRole('button',{name:'Menu',exact:true}).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByRole('button',{name:'Menu',exact:true})).toBeFocused();
  }
  for(const project of projects){
    const [start,end]=project.scrollRange;
    await page.evaluate(p=>scrollTo(0,p*(document.querySelector('.scroll-container')!.getBoundingClientRect().height-innerHeight)),start+(end-start)*.52);
    await page.waitForTimeout(250);
    await expect.poll(async()=> (await cardBounds(page,fiberUrl,project.id))?.opacity).toBe(1);
    await expect.poll(async()=> (await cardBounds(page,fiberUrl,project.id))?.depth).toBeCloseTo(4, 4);
    const bounds=(await cardBounds(page,fiberUrl,project.id))!;
    expect(bounds.left).toBeGreaterThanOrEqual(-1);
    expect(bounds.right).toBeLessThanOrEqual(width+1);
    expect(bounds.top).toBeGreaterThanOrEqual(72);
    expect(bounds.bottom).toBeLessThanOrEqual(height+1);
    if(width<1024){
      expect(bounds.dpr).toBeLessThanOrEqual(1.25);
      expect(bounds.right-bounds.left).toBeGreaterThan(230);
    }
    if(project.id==='aikyam')await page.screenshot({path:`test-results/responsive-${width}-card.png`});
    if(width<1024 && project.id==='aikyam') {
      for(const [phase,fraction] of [['entry',.09],['exit',.93]] as const) {
        await page.evaluate(p=>scrollTo(0,p*(document.querySelector('.scroll-container')!.getBoundingClientRect().height-innerHeight)),start+(end-start)*fraction);
        await page.waitForTimeout(250);
        const moving=(await cardBounds(page,fiberUrl,project.id))!;
        expect(moving.left).toBeGreaterThanOrEqual(0);
        expect(moving.right).toBeLessThanOrEqual(width);
        expect(moving.top).toBeGreaterThanOrEqual(0);
        expect(moving.bottom).toBeLessThanOrEqual(height);
        await page.screenshot({path:`test-results/responsive-${width}-${phase}.png`});
      }
      await page.evaluate(p=>scrollTo(0,p*(document.querySelector('.scroll-container')!.getBoundingClientRect().height-innerHeight)),start+(end-start)*.52);
      await page.waitForTimeout(250);
    }
    // Verify a real raycast click/tap from every card, at every viewport.
    if(width<1024)await page.touchscreen.tap(bounds.tap.x,bounds.tap.y);
    else await page.mouse.click(bounds.tap.x,bounds.tap.y);
    const target=page.locator(`#project-${project.id}`);
    await expect(target).toBeFocused();
    await expect(target).toHaveAttribute('data-project-focus','true');
    await expect.poll(async()=>{const y=(await target.boundingBox())!.y;return y>=70&&y<height*.6;}).toBe(true);
    await page.waitForTimeout(250);
    expect(await overflow()).toBe(false);
  }
  if(width<768){
    await page.getByRole('button',{name:'Menu',exact:true}).click();
    await page.getByRole('dialog').getByRole('link',{name:'Projects',exact:true}).click();
  } else await page.getByRole('navigation').getByRole('link',{name:'Projects',exact:true}).click();
  await expect(page.locator('#projects')).toBeFocused();
  await expect.poll(async()=> Math.round((await page.locator('#projects').boundingBox())!.y)).toBe(width<768?76:90);
  await page.screenshot({path:`test-results/responsive-${width}-projects.png`});
  await page.locator('#about').evaluate(el=>el.scrollIntoView());
  await page.screenshot({path:`test-results/responsive-${width}-about.png`});
  const layout=await page.evaluate(()=>{
    const title=document.querySelector('#about-title')!.getBoundingClientRect();
    const copy=document.querySelector('.about-copy')!.getBoundingClientRect();
    const image=document.querySelector('.project-detail:nth-child(2) img')!.getBoundingClientRect();
    const info=document.querySelector('.project-detail:nth-child(2) .project-detail-copy')!.getBoundingClientRect();
    const span=document.querySelector('.about-headline-constructing')!;
    const range=document.createRange();range.selectNodeContents(span);
    return {bodyBelow:copy.top>=title.bottom,bodyRight:copy.left>=title.right,projectsStack:info.top>=image.bottom,headlineRight:range.getBoundingClientRect().right,metricColumns:getComputedStyle(document.querySelector('.company-metrics')!).gridTemplateColumns.split(' ').length};
  });
  expect(layout.headlineRight).toBeLessThanOrEqual(width);
  expect(layout.bodyBelow).toBe(width<768);
  if(width>=768)expect(layout.bodyRight).toBe(true);
  expect(layout.projectsStack).toBe(width<768);
  expect(layout.metricColumns).toBe(width<1024?2:4);
  expect(errors).toEqual([]);
  await context.close();
});

test('orientation changes and reduced motion retain usable cards',async({page})=>{
  let fiberUrl='';
  page.on('request',r=>{if(r.url().includes('react-three_fiber.js'))fiberUrl=r.url();});
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  for(const viewport of [{width:390,height:844},{width:844,height:390},{width:390,height:844}]){
    await page.setViewportSize(viewport);
    await page.waitForTimeout(350);
    await page.evaluate(()=>scrollTo(0,.1424*(document.querySelector('.scroll-container')!.getBoundingClientRect().height-innerHeight)));
    await expect.poll(async()=>(await cardBounds(page,fiberUrl,'aikyam'))?.opacity).toBe(1);
    const bounds=(await cardBounds(page,fiberUrl,'aikyam'))!;
    expect(bounds.left).toBeGreaterThan(0);expect(bounds.right).toBeLessThan(viewport.width);
    expect(bounds.bottom).toBeLessThan(viewport.height);
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  const frames=[];
  for(const progress of [.09,.1424,.19]){
    await page.evaluate(p=>scrollTo(0,p*(document.querySelector('.scroll-container')!.getBoundingClientRect().height-innerHeight)),progress);
    await page.waitForTimeout(250);
    frames.push(await cardBounds(page,fiberUrl,'aikyam'));
  }
  for(const frame of frames){expect(frame?.left).toBeCloseTo(frames[0]!.left,3);expect(frame?.top).toBeCloseTo(frames[0]!.top,3);}
  const last=frames[1]!;
  await page.mouse.click(last.tap.x,last.tap.y);
  await expect(page.locator('#project-aikyam')).toBeFocused();
});
