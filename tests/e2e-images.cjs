// Tự nén ảnh: ảnh 16MB → dưới trần của từng loại ô; logo giữ nền trong suốt (WebP);
// thêm nhiều ảnh vượt giới hạn trang → tự nén lại ảnh nặng nhất cho vừa, không từ chối.
// Cần <thư-mục> có big.png (ảnh nhiễu lớn) và logo.png (PNG trong suốt).
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const SP = process.argv[2] || require('os').tmpdir();
(async () => {
  const b = require('./auto-tab.cjs')(await chromium.launch());
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const log = (k, v) => console.log(k.padEnd(30), v);
  const upload = async (sel, file) => { const [fc] = await Promise.all([p.waitForEvent('filechooser'), p.click(sel)]); await fc.setFiles(SP + '/' + file); await p.waitForFunction(() => /nén/.test(document.querySelector('#toast').textContent), null, { timeout: 30000 }); const t = await p.textContent('#toast'); await p.evaluate(() => { document.querySelector('#toast').textContent = ''; }); return t; };
  const imgs = () => p.evaluate(() => { const id = JSON.parse(localStorage.ep_current_id); const ev = JSON.parse(localStorage.ep_events)[id].event; return ev.images; });
  await p.goto('http://localhost:8000/');
  log('webp supported', await p.evaluate(() => EP.images.webp));
  // Logo trong Brand DNA
  await p.click('[data-tab="brand"]'); await p.click('#btn-brand-new');
  log('logo toast', await upload('#brand-editor .logo-box .btn', 'logo.png'));
  log('logo stored', await p.evaluate(() => { const l = Object.values(JSON.parse(localStorage.ep_brands))[0].logo; return l.slice(0, 15) + ' ' + Math.round(l.length / 1024) + 'KB'; }));
  log('logo keeps alpha', await p.evaluate(() => new Promise(r => { const im = new Image(); im.onload = () => { const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0); r(x.getImageData(2, 2, 1, 1).data[3]); }; im.src = Object.values(JSON.parse(localStorage.ep_brands))[0].logo; })));
  // Trang thiệp cưới: ảnh bìa + 4 ảnh album, mỗi ảnh gốc 16MB
  await p.click('[data-tab="builder"]'); await p.click('#btn-tpl'); await p.click('.tpl-card:has-text("cưới")'); await p.click('#btn-sample'); await p.click('#btn-generate'); await p.waitForTimeout(700);
  log('hero toast', await upload('.lp-hero .lp-img-btn', 'big.png'));
  log('hero size', Math.round((await imgs()).hero.length / 1024) + 'KB');
  for (let g = 0; g < 4; g++) log('gallery ' + g, await upload('[data-slot="gallery:' + g + '"]', 'big.png'));
  for (let s = 0; s < 2; s++) log('speaker ' + s, await upload('[data-slot="speaker:' + s + '"]', 'big.png'));
  const all = await imgs();
  const total = JSON.stringify(all).length;
  log('total images', Math.round(total / 1024) + 'KB (budget 879KB) gallery=' + (all.gallery || []).filter(Boolean).length);
  log('ERRORS', errs);
  await b.close();
})();
