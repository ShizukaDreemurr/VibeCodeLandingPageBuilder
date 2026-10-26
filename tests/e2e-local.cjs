const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1400, height: 900 } });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type()==='error' && errs.push(m.text()));
  await p.goto('file:///home/user/VibeCodeLandingPageBuilder/index.html');
  const log = (k,v)=>console.log(k.padEnd(28), v);
  // TC: submit empty
  await p.click('#btn-generate');
  log('empty form name error', await p.textContent('[data-error-for="name"]'));
  await p.click('#btn-sample');
  await p.click('#btn-generate');
  log('headline', await p.textContent('.lp-headline'));
  log('badge', await p.textContent('.lp-badge'));
  log('mock note visible', await p.isVisible('#mock-note'));
  log('benefits', await p.$$eval('.lp-benefits li', l=>l.length));
  log('agenda items', await p.$$eval('.lp-agenda li', l=>l.length));
  // register invalid
  await p.fill('#lp-name',''); await p.fill('#lp-phone','12345'); await p.fill('#lp-email','abc');
  await p.click('.lp-submit');
  log('err phone', await p.textContent('[data-error-for="phone"]'));
  log('err email', await p.textContent('.lp-form [data-error-for="email"]'));
  // valid +84
  await p.fill('#lp-name','Nguyễn Văn A'); await p.fill('#lp-phone','+84 912 345 678'); await p.fill('#lp-email','a@gmail.com'); await p.check('.lp-consent input');
  await p.click('.lp-submit');
  log('msg', await p.textContent('.lp-form-msg'));
  log('count', await p.textContent('.lp-count'));
  // duplicate
  await p.fill('#lp-name','B'); await p.fill('#lp-phone','0912345678'); await p.fill('#lp-email','b@gmail.com'); await p.check('.lp-consent input');
  await p.click('.lp-submit');
  log('dup msg', await p.textContent('.lp-form-msg'));
  // second tab realtime
  const p2 = await ctx.newPage(); await p2.goto('file:///home/user/VibeCodeLandingPageBuilder/index.html');await p2.click('[data-tab="builder"]');
  await p2.fill('#lp-name','Trần C'); await p2.fill('#lp-phone','0987654321'); await p2.fill('#lp-email','c@gmail.com'); await p2.check('.lp-consent input');
  await p2.click('.lp-submit'); await p.waitForTimeout(600);
  log('tab1 count after tab2', await p.textContent('.lp-count'));
  await p.screenshot({ path: process.argv[2]+'/shot1.png', fullPage: false });
  // past event
  await p.evaluate(()=>{const id=JSON.parse(localStorage.ep_current_id);const all=JSON.parse(localStorage.ep_events);const s=all[id]; s.event.startAt='2020-01-01T09:00'; all[id]=s;localStorage.ep_events=JSON.stringify(all);});
  await p.reload();await p.click('[data-tab="builder"]');
  log('ended text visible', await p.isVisible('.lp-ended'));
  log('form hidden', await p.isHidden('.lp-form'));
  log('badge', await p.textContent('.lp-badge'));
  // capacity full -> waitlist
  await p.evaluate(()=>{const id=JSON.parse(localStorage.ep_current_id);const all=JSON.parse(localStorage.ep_events);const s=all[id]; s.event.startAt='2099-01-01T09:00'; s.event.capacity=2; all[id]=s;localStorage.ep_events=JSON.stringify(all);});
  await p.reload();await p.click('[data-tab="builder"]');
  log('badge full', await p.textContent('.lp-badge'));
  log('btn', await p.textContent('.lp-submit'));
  await p.fill('#lp-name','D'); await p.fill('#lp-phone','0333444555'); await p.fill('#lp-email','d@gmail.com'); await p.check('.lp-consent input');
  await p.click('.lp-submit');
  log('waitlist msg', await p.textContent('.lp-form-msg'));
  // copy mode parse
  await p.check('input[value="copy"]');
  await p.fill('#f-paste','Đây là kết quả:\n```json\n{“headline”: “Tiêu đề AI”, "description": "Mô tả", "benefits": ["a","b"],}\n```');
  await p.click('#btn-generate');
  log('copy msg', await p.textContent('#ai-msg'));
  log('headline', await p.textContent('.lp-headline'));
  // admin
  await p.click('[data-tab="admin"]');
  log('admin rows', await p.$$eval('#admin-rows tr', l=>l.length));
  // new page
  p.on('dialog', d=>d.accept());
  await p.click('#btn-new');
  log('empty after new', await p.isVisible('.empty-state'));
  // mobile
  await p.setViewportSize({width:390,height:844}); await p.click('#btn-sample'); await p.check('input[value="mock"]'); await p.click('#btn-generate');
  log('h-scroll', await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
  await p.screenshot({ path: process.argv[2]+'/shot-mobile.png', fullPage: true });
  log('ERRORS', errs);
  await b.close();
})();
