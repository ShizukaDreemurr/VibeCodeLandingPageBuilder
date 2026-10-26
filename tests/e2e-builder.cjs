const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:1400,height:900}})).newPage();const errs=[];
 p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()==='error'&&errs.push(m.text()));const log=(k,v)=>console.log(k.padEnd(30),v);
 await p.goto('file:///home/user/VibeCodeLandingPageBuilder/index.html');
 await p.click('#btn-sample');await p.click('#btn-generate');
 const order=()=>p.$$eval('#landing .lp-section h2',h=>h.map(x=>x.textContent).join(' | '));
 log('layout list items',await p.locator('.section-item').count());
 log('order before',await order());
 await p.click('.section-item >> nth=2 >> button[aria-label="Đưa lên"]');
 log('after move benefits up',await order());
 await p.uncheck('.section-item:has-text("Diễn giả") input');
 log('after hide speakers',await order());
 log('locked disabled',await p.isDisabled('.section-item:has-text("Form đăng ký") input'));
 await p.reload();log('persist after reload',await order());
 // inline edit
 await p.click('.lp-headline');await p.keyboard.press('Control+A');await p.keyboard.type('Tiêu đề tự sửa');await p.keyboard.press('Enter');await p.waitForTimeout(300);
 log('headline edited',await p.textContent('.lp-headline'));
 await p.reload();log('edit persists',await p.textContent('.lp-headline'));
 // simulation
 for (const v of ['almost','full','earlybird','ended','']) {await p.selectOption('#sim-state',v);await p.waitForTimeout(1200);
   log('sim '+(v||'now'),[await p.textContent('.lp-badge'),await p.isVisible('.lp-ended'),await p.isVisible('.lp-offer'),await p.isVisible('.lp-form'),await p.isVisible('#sim-banner')].join(' / '));}
 await p.selectOption('#sim-state','full');
 await p.fill('#lp-name','A');await p.fill('#lp-phone','0912345678');await p.fill('#lp-email','a@b.com');await p.check('.lp-consent input');await p.click('.lp-submit');await p.waitForTimeout(400);
 log('register blocked in sim',await p.textContent('.lp-form-msg'));
 log('no real reg saved',await p.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('ep_regs')).map(k=>localStorage[k]).join('')||'none'));
 log('ERRORS',errs);await b.close();})();
