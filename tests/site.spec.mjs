import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {writeFile} from 'node:fs/promises';

for (const width of [320,390,768,1024,1440]) {
  test(`${width}px: complete collection and enquiry journey`,async({page})=>{
    const errors=[]; page.on('pageerror',error=>errors.push(error.message));
    const outbound=[]; page.on('request',request=>{if(request.method()!=='GET'||!request.url().startsWith('http://127.0.0.1:4173/'))outbound.push(request.url());});
    const failed=[]; page.on('response',r=>{if(r.url().includes('/assets/')&&r.status()>=400)failed.push(r.url());});
    await page.setViewportSize({width,height:900});
    await page.goto('/');
    await page.waitForFunction(()=>document.querySelector('#hero-image').complete);
    await expect(page.locator('.hero-demo')).toBeVisible();
    await expect(page.locator('.header-cta')).toHaveCSS('white-space','nowrap');
    const controlSize=await page.locator('#hero-next').boundingBox();
    expect(controlSize.width).toBeGreaterThanOrEqual(44); expect(controlSize.height).toBeGreaterThanOrEqual(44);
    await page.screenshot({path:`review/after-${width}-hero.png`,animations:'disabled'});
    await page.locator('#hero-next').click();
    await expect(page.locator('#slide-index')).toHaveText('02');
    await page.locator('#hero-next').click();
    await expect(page.locator('#slide-index')).toHaveText('03');
    await page.locator('#hero-next').click();
    await expect(page.locator('#slide-index')).toHaveText('01');
    if(width<=800){
      await page.locator('.menu-toggle').click();
      await expect(page.locator('main')).toHaveAttribute('inert','');
      await page.keyboard.press('Tab');
      await expect(page.locator('.nav a').first()).toBeFocused();
      await page.keyboard.press('Shift+Tab');
      await expect(page.locator('.menu-toggle')).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(page.locator('.menu-toggle')).toHaveAttribute('aria-expanded','false');
      await page.locator('.menu-toggle').click();
    }
    await page.locator('.nav a[href="#projects"]').click();
    await expect.poll(async()=>page.locator('#projects').evaluate(el=>el.getBoundingClientRect().top)).toBeGreaterThanOrEqual(width<=480?76:width<=800?80:width<=1100?88:104);
    await page.locator('#projects').scrollIntoViewIfNeeded();
    await page.screenshot({path:`review/after-${width}-collection.png`,animations:'disabled'});
    for(const [category,id] of [['residential','canopy'],['villas','grove'],['commercial','one']]){
      const filter=page.locator(`[data-filter="${category}"]`);
      await filter.click(); await expect(filter).toBeFocused();
      await expect(page.locator('.project-card:visible')).toHaveCount(1);
      await expect(page.locator(`.project-card:visible [data-project="${id}"]`).first()).toBeVisible();
      if(category==='commercial')await page.screenshot({path:`review/after-${width}-filtered.png`,animations:'disabled'});
    }
    await page.locator('[data-filter="all"]').click();
    await expect(page.locator('.project-card:visible')).toHaveCount(3);
    for(const [id,name] of [['canopy','The Canopy Residences'],['grove','The Grove Villas'],['one','Aurelia One']]){
      const trigger=page.locator(`footer [data-project="${id}"]`);
      await trigger.click();
      await expect(page.locator('#project-dialog')).toBeVisible();
      await expect(page.locator('#project-title')).toHaveText(name);
      const cardSrc=await page.locator(`.project-image[data-project="${id}"] img`).getAttribute('srcset');
      await expect(page.locator('#detail-image')).toHaveAttribute('srcset',cardSrc);
      await page.keyboard.press('Shift+Tab');
      expect(await page.evaluate(()=>!!document.activeElement.closest('#project-dialog'))).toBeTruthy();
      await page.locator('#project-dialog .dialog-scroll').evaluate(el=>el.scrollTop=el.scrollHeight);
      const close=await page.locator('#project-dialog .dialog-close').boundingBox();
      expect(close.y).toBeGreaterThanOrEqual(0); expect(close.y+close.height).toBeLessThanOrEqual(900);
      await page.locator('#detail-enquire').click();
      await expect(page.locator('#visit-dialog')).toBeVisible();
      await expect(page.locator('#visit-form select')).toHaveValue(name);
      await page.keyboard.press('Escape');
      await expect(trigger).toBeFocused();
    }
    const form=page.locator('#contact-form');
    await form.locator('[type=submit]').click();
    await expect(form.locator('[name=name]')).toBeFocused();
    await expect(form.locator('[aria-invalid=true]')).toHaveCount(3);
    await form.locator('[name=name]').fill('   ');
    await form.locator('[name=email]').fill('bad-email');
    await form.locator('[name=phone]').fill('abc');
    await form.locator('[type=checkbox]').check();
    await form.locator('[type=submit]').click();
    await expect(form.locator('[aria-invalid=true]')).toHaveCount(3);
    await form.locator('[name=name]').fill('Sample Visitor');
    await form.locator('[name=email]').fill('visitor@example.com');
    await form.locator('[name=phone]').fill('');
    await form.locator('[type=submit]').click();
    await expect(form.locator('.form-status')).toContainText('no enquiry has been sent');
    await form.locator('[name=email]').fill('changed@example.com');
    await expect(form.locator('.form-status')).toBeEmpty();
    await page.locator('.header-cta').click();
    const visit=page.locator('#visit-form');
    await visit.locator('[type=submit]').click();
    await expect(visit.locator('[aria-invalid=true]')).toHaveCount(3);
    await visit.locator('[name=name]').fill('Sample Visitor');
    await visit.locator('[name=email]').fill('visitor@example.com');
    await visit.locator('[name=date]').fill('2020-01-01');
    await visit.locator('[type=submit]').click();
    await expect(visit.locator('[name=date]')).toHaveAttribute('aria-invalid','true');
    await visit.locator('[name=date]').fill('2027-12-10');
    await visit.locator('[type=submit]').click();
    await expect(visit.locator('.form-status')).toContainText('no booking made');
    await page.keyboard.press('Escape');
    await page.locator('[data-gallery]').click();
    await page.locator('#gallery-next').click(); await expect(page.locator('#gallery-count')).toHaveText('2 / 3');
    await page.locator('#gallery-next').click(); await expect(page.locator('#gallery-count')).toHaveText('3 / 3');
    await page.locator('#gallery-next').click(); await expect(page.locator('#gallery-count')).toHaveText('1 / 3');
    await page.locator('#gallery-prev').click(); await expect(page.locator('#gallery-count')).toHaveText('3 / 3');
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-gallery]')).toBeFocused();
    await page.locator('#privacy-button').click(); await expect(page.locator('#privacy-dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('a[href="https://clarigence.in"]')).toBeVisible();
    for(const section of ['#philosophy','#projects','#living','#promise','#contact','footer']){
      await page.locator(section).scrollIntoViewIfNeeded();
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
    }
    expect(await page.locator('main img').evaluateAll(imgs=>imgs.filter(i=>!i.classList.contains('hero-standby')).every(i=>i.complete&&i.naturalWidth>0))).toBeTruthy();
    expect(failed).toEqual([]); expect(errors).toEqual([]); expect(outbound).toEqual([]);
  });
}

test('accessibility scans: page, menu and every modal',async({page})=>{
  await page.setViewportSize({width:390,height:900}); await page.goto('/');
  // Audit after lazy photographs are visible, rather than only their placeholder backgrounds.
  for (const image of await page.locator('main img:not(.hero-standby)').all()) {
    await image.scrollIntoViewIfNeeded(); await image.evaluate(img=>img.decode());
  }
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  const reports=[];
  async function scan(label){
    await page.evaluate(()=>Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>{}))));
    const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    reports.push({label,violations:result.violations});
  }
  await scan('page');
  await page.locator('.menu-toggle').click(); await scan('mobile menu'); await page.keyboard.press('Escape');
  for(const id of ['canopy','grove','one']){
    await page.locator(`footer [data-project="${id}"]`).click(); await scan(id); await page.keyboard.press('Escape');
  }
  await page.locator('.header-cta').click(); await scan('visit form'); await page.keyboard.press('Escape');
  await page.locator('[data-gallery]').click(); await scan('gallery'); await page.keyboard.press('Escape');
  await page.locator('#privacy-button').click(); await scan('demo information');
  await writeFile('review/accessibility.json',JSON.stringify(reports,null,2));
  expect(reports.flatMap(r=>r.violations.map(v=>`${r.label}: ${v.id} ${v.nodes.map(n=>n.target).join(',')}`))).toEqual([]);
});

test('reduced motion and progressive visibility',async({browser})=>{
  const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:320,height:900}});
  const page=await context.newPage(); await page.goto('/');
  expect(await page.evaluate(()=>document.getAnimations().length)).toBe(0);
  await page.locator('#hero-next').click(); await expect(page.locator('#slide-index')).toHaveText('02');
  await page.locator('[data-filter=villas]').click();
  expect(await page.evaluate(()=>document.getAnimations().length)).toBe(0);
  await page.locator('.header-cta').click();
  expect(await page.evaluate(()=>document.getAnimations().length)).toBe(0);
  await context.close();
  const fallback=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:900}});
  const nojs=await fallback.newPage(); await nojs.goto('/');
  await expect(nojs.locator('h1')).toBeVisible(); await expect(nojs.locator('.project-card')).toHaveCount(3);
  await expect(nojs.locator('#contact-form [type=submit]')).toBeDisabled();
  await fallback.close();
});
