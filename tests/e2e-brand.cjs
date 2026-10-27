// Brand DNA: tạo thương hiệu (tên, khẩu hiệu, logo, màu, font, nút, giọng văn, liên hệ), xem trước,
// chọn ở bước 1 → trang tự áp dụng; áp dụng/gỡ trong trang Thiết kế; AI prompt có khối thương hiệu; xoá.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const SP = process.argv[2] || require('os').tmpdir();
(async () => {
  const b = require('./auto-tab.cjs')(await chromium.launch());
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept());
  const log = (k, v) => console.log(k.padEnd(30), v);
  await p.goto('http://localhost:8000/');
  await p.click('[data-tab="brand"]');
  log('empty state', await p.textContent('#brand-editor .empty-title'));
  await p.click('#btn-brand-new');
  await p.fill('#bf-name', 'Xclipse Academy'); await p.press('#bf-name', 'Tab');
  await p.fill('#bf-tagline', 'Học thật – Làm thật'); await p.press('#bf-tagline', 'Tab');
  log('saved stamp', await p.textContent('.save-stamp'));
  const [fc] = await Promise.all([p.waitForEvent('filechooser'), p.click('#brand-editor .logo-box .btn')]);
  await fc.setFiles(SP + '/photo.jpg'); await p.waitForTimeout(800);
  log('logo saved', (await p.evaluate(() => Object.values(JSON.parse(localStorage.ep_brands))[0].logo || '')).slice(0, 22));
  const col = async (label, v) => { const i = p.locator('#brand-editor [aria-label="' + label + ' – mã màu"]'); await i.fill(v); await i.press('Enter'); };
  await col('Màu chính', '#0b4f8a'); await col('Màu nhấn', 'rgb(242, 182, 50)');
  await p.click('#bc-headingFont'); await p.keyboard.type('playfair'); await p.keyboard.press('Enter'); await p.waitForTimeout(200);
  await p.click('#brand-editor .chip:text("Viên thuốc")');
  await p.click('#brand-editor .chip:text("Trẻ trung")');
  await p.fill('#bf-ctaText', 'Giữ chỗ ngay'); await p.press('#bf-ctaText', 'Tab');
  await p.fill('#bf-voiceUse', 'thực chiến, đồng hành'); await p.press('#bf-voiceUse', 'Tab');
  await p.fill('#bf-hotline', '0912 345 678'); await p.press('#bf-hotline', 'Tab');
  await p.fill('#bf-website', 'xclipse.vn'); await p.press('#bf-website', 'Tab');
  await p.fill('#bf-fanpage', 'không phải link'); await p.press('#bf-fanpage', 'Tab');
  log('fanpage error', await p.textContent('#bf-fanpage + .error, #brand-editor .error:not(:empty)'));
  log('preview', await p.$eval('.bp-card', c => c.style.getPropertyValue('--bp-primary') + ' ' + c.querySelector('.bp-btn').className + ' ' + c.querySelector('.bp-btn').textContent));
  await p.screenshot({ path: SP + '/brand.png' });

  // Bước 1: chọn thương hiệu → tạo trang
  await p.click('[data-tab="builder"]'); await p.click('#btn-sample');
  const bid = await p.evaluate(() => Object.keys(JSON.parse(localStorage.ep_brands))[0]);
  await p.selectOption('#f-brand', bid);
  log('tone from brand', await p.inputValue('#f-tone'));
  await p.click('#btn-generate'); await p.waitForTimeout(800);
  log('logo on page', await p.locator('#landing .lp-logo').count());
  log('cta', await p.textContent('#landing .lp-cta'));
  log('footer brand', await p.textContent('#landing .lp-brand-line'));
  log('style', await p.$eval('#landing', l => l.style.getPropertyValue('--lp-primary') + ' ' + l.style.getPropertyValue('--lp-heading-font') + ' ' + (l.className.match(/st-button-\w+/) || [''])[0]));
  log('ai prompt brand', await p.evaluate(() => { const s = JSON.parse(localStorage.ep_events); const ev = Object.values(s)[0].event; return EP.ai.buildPrompt(ev, 'young').includes('Nên dùng các từ/cách nói: thực chiến'); }));
  // Trang Thiết kế: gỡ rồi áp dụng lại
  await p.selectOption('#ed-brand', ''); await p.click('#btn-apply-brand'); await p.waitForTimeout(300);
  log('removed', await p.locator('#landing .lp-logo').count() + ' ' + await p.locator('#landing .lp-brand').count());
  await p.selectOption('#ed-brand', bid); await p.click('#btn-apply-brand'); await p.waitForTimeout(300);
  log('reapplied', await p.locator('#landing .lp-logo').count());
  // Xoá thương hiệu: trang vẫn giữ
  await p.click('[data-tab="brand"]'); await p.click('#brand-editor .btn-danger'); await p.waitForTimeout(600);
  log('brands left', await p.evaluate(() => Object.keys(JSON.parse(localStorage.ep_brands)).length));
  await p.click('[data-tab="editor"]');
  log('page keeps brand', await p.locator('#landing .lp-logo').count());
  log('ERRORS', errs);
  await b.close();
})();
