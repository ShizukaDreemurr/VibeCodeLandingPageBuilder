// Workspace trang Thiết kế: panel thả nổi, gộp tab, kéo vạch chia, thu phóng, menu Cửa sổ, lưu bố cục
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const SP=process.argv[2]||require('os').tmpdir();
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
const log=(k,v)=>console.log(k.padEnd(28),v);
await p.goto('http://localhost:8000/');await p.click('#btn-sample');await p.click('#btn-generate');await p.waitForTimeout(800);
log('groups',await p.$$eval('.ws-group',g=>g.map(x=>x.getAttribute('aria-label')+'@'+x.parentNode.className).join(' | ')));
log('zoom fit',await p.$eval('#landing',l=>l.style.zoom+' w='+l.style.width)+' '+await p.$eval('#zoom-select',s=>s.selectedOptions[0].textContent));
await p.screenshot({path:SP+'/ws1.png'});
// drag "Xuất bản" tab to middle -> float
const t=await p.locator('.ws-tab[data-tab-panel="publish"]').boundingBox();
await p.mouse.move(t.x+20,t.y+10);await p.mouse.down();for(let i=1;i<=10;i++){await p.mouse.move(t.x+20-60*i,t.y+10+30*i);await p.waitForTimeout(16);}await p.mouse.up();await p.waitForTimeout(300);
log('after float',await p.$$eval('.ws-group',g=>g.map(x=>x.getAttribute('aria-label')+(x.classList.contains('is-floating')?'(float)':'')).join(' | ')));
// drag floating window by header empty area
// merge floating into left group header
const f=await p.locator('.ws-group.is-floating .ws-tab').boundingBox();const lh=await p.locator('.ws-dock[data-dock="left"] .ws-ghead').first().boundingBox();
await p.mouse.move(f.x+10,f.y+10);await p.mouse.down();for(let i=1;i<=12;i++){await p.mouse.move(f.x+10+(lh.x+150-f.x-10)*i/12,f.y+10+(lh.y+18-f.y-10)*i/12);await p.waitForTimeout(16);}await p.mouse.up();await p.waitForTimeout(300);
log('after merge',await p.$$eval('.ws-group',g=>g.map(x=>x.getAttribute('aria-label')).join(' | ')));
// splitter resize left
const sp=await p.locator('.ws-splitter[data-split="left"]').boundingBox();await p.mouse.move(sp.x+4,sp.y+200);await p.mouse.down();await p.mouse.move(sp.x+84,sp.y+200,{steps:5});await p.mouse.up();
log('left width',await p.$eval('.ws-dock[data-dock="left"]',d=>d.style.width));
// zoom
await p.selectOption('#zoom-select','0.5');log('zoom 50',await p.$eval('#landing',l=>l.style.zoom));
await p.click('#btn-zoom-in');log('zoom in',await p.$eval('#landing',l=>l.style.zoom));
await p.keyboard.press('Control+0');log('ctrl0',await p.$eval('#zoom-select',s=>s.value));
// menu
await p.click('.mb-btn:text("Cửa sổ")');await p.waitForTimeout(150);await p.screenshot({path:SP+'/ws-menu.png'});
await p.click('.mb-item:has-text("Giao diện")');log('style hidden',!(await p.$$eval('.ws-group',g=>g.map(x=>x.getAttribute('aria-label')).join())).includes('Giao diện'));
await p.click('.mb-btn:text("Cửa sổ")');await p.click('.mb-item:has-text("Khôi phục")');
log('reset',await p.$$eval('.ws-group',g=>g.map(x=>x.getAttribute('aria-label')).join(' | ')));
await p.reload();await p.click('[data-tab="editor"]');log('persist',await p.$eval('.ws-dock[data-dock="left"]',d=>d.style.width));
await p.screenshot({path:SP+'/ws2.png'});
log('errs',errs);await b.close();})();
