const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
(async()=>{const b=require('./auto-tab.cjs')(await chromium.launch());const p=await (await b.newContext({viewport:{width:1400,height:900}})).newPage();const errs=[];
 p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()==='error'&&errs.push(m.text()));p.on('dialog',d=>d.accept());const log=(k,v)=>console.log(k.padEnd(30),v);
 await p.goto('file:///home/user/VibeCodeLandingPageBuilder/index.html');
 log('brand',await p.textContent('.brand'));log('first tab (no events)',await p.isVisible('#view-builder'));
 await p.click('#btn-sample');await p.click('#btn-generate');
 await p.fill('#lp-name','Lead Một');await p.fill('#lp-phone','0912345678');await p.fill('#lp-email','l1@gmail.com');await p.check('.lp-consent input');await p.click('.lp-submit');await p.waitForTimeout(300);
 // second event via template
 await p.click('#btn-new');await p.click('#btn-tpl');await p.click('.tpl-card:has-text("Thiệp cưới")');await p.click('#btn-generate');
 await p.reload();log('reload opens events tab',await p.isVisible('#view-events'));
 log('event cards',await p.$$eval('.event-card h3',h=>h.map(x=>x.textContent).join(' | ')));
 log('badges',await p.$$eval('.event-card .badges',h=>h.map(x=>x.textContent).join(' | ')));
 await p.click('.event-card:has-text("Workshop") >> text=Mở / sửa');log('opened',await p.inputValue('#f-name'));
 log('count kept',await p.textContent('.lp-count'));
 await p.click('[data-tab="events"]');await p.click('.event-card:has-text("Workshop") >> text=Nhân bản');
 log('dup name',await p.inputValue('#f-name'));log('dup count reset',await p.textContent('.lp-count'));
 await p.click('[data-tab="events"]');log('3 cards',await p.locator('.event-card').count());
 await p.click('.event-card:has-text("bản sao") >> text=Xoá');await p.waitForTimeout(600);log('after delete',await p.locator('.event-card').count());
 // lead status
 await p.click('.event-card:has-text("Workshop") >> text=Mở / sửa');await p.click('[data-tab="admin"]');
 log('metrics local',await p.$$eval('.metric',m=>m.map(x=>x.textContent).join(' | ')));
 await p.selectOption('.lead-select','won');await p.waitForTimeout(200);
 log('metrics after won',await p.$$eval('.metric',m=>m.map(x=>x.textContent).join(' | ')));
 log('contact links',await p.$$eval('.contact-links a',a=>a.map(x=>x.getAttribute('href')).join(' ')));
 await p.reload();await p.click('[data-tab="admin"]');log('lead persisted',await p.inputValue('.lead-select'));
 // checklist (no Firebase on file:// still shows publish? btn hidden if !available) -> call directly
 await p.click('[data-tab="builder"]');
 log('publish btn visible',await p.isVisible('#btn-publish'));
 await p.click('#btn-publish');await p.waitForTimeout(300);
 log('checklist',await p.$$eval('#checklist li',l=>l.map(x=>x.className.replace('is-','')+':'+x.textContent).join(' || ')));
 log('ok enabled',await p.isEnabled('#btn-check-ok'));await p.click('#btn-check-cancel');
 log('ERRORS',errs);await b.close();})();
