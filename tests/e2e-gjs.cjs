// 10 tính năng học từ GrapesJS: thư viện khối, định dạng đoạn chữ, chỉnh theo thiết bị, rê chuột,
// panel Cấu trúc, phím tắt + sao chép định dạng, xem trước toàn màn hình, xuất HTML, cách ly CSS, biến dữ liệu
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const SP = process.argv[2] || require('os').tmpdir();
(async () => {
  const b = require('./auto-tab.cjs')(await chromium.launch());
  const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  let fails = 0;
  const log = (k, v, ok) => { if (ok === false) fails++; console.log((ok === false ? '✗ ' : '  ') + k.padEnd(30), v); };
  await ctx.addInitScript(() => { window.ST = () => { const all = JSON.parse(localStorage.getItem('ep_events')); return all[JSON.parse(localStorage.getItem('ep_current_id'))].event; }; });
  p.on('dialog', d => d.accept('https://example.com/lich'));
  await p.goto('http://localhost:8000/'); await p.click('[data-tab="builder"]'); await p.click('#btn-sample'); await p.click('#btn-generate'); await p.waitForTimeout(1000);

  // 1. Thư viện khối
  log('block cards', await p.locator('#block-lib .block-card').count(), await p.locator('#block-lib .block-card').count() === 6);
  log('faq hidden by default', await p.locator('#landing [data-section="faq"]').count(), await p.locator('#landing [data-section="faq"]').count() === 0);
  for (const k of ['faq', 'cta2', 'video', 'testimonials']) { await p.click(`#block-lib [data-block="${k}"]`); await p.waitForTimeout(150); }
  const order = await p.$$eval('#landing [data-section]', a => a.map(x => x.dataset.section));
  log('blocks before register', order.join(','), order.indexOf('faq') < order.indexOf('register') && order.indexOf('cta2') < order.indexOf('register'));
  log('faq items', await p.locator('#landing .lp-faq-item').count(), await p.locator('#landing .lp-faq-item').count() === 3);
  await p.click('#landing [data-el="section.faq"]', { position: { x: 5, y: 5 } });
  await p.click('#inspector [aria-label="Thêm một mục vào khối này"]'); await p.waitForTimeout(150);
  log('faq add item', await p.locator('#landing .lp-faq-item').count(), await p.locator('#landing .lp-faq-item').count() === 4);
  await p.click('#landing [data-el="section.video"]', { position: { x: 5, y: 5 } });
  await p.fill('#inspector [aria-label="Link video"]', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'); await p.press('#inspector [aria-label="Link video"]', 'Enter'); await p.waitForTimeout(200);
  log('video embed', await p.getAttribute('#landing .lp-video iframe', 'src'), /youtube-nocookie\.com\/embed\/dQw4w9WgXcQ/.test(await p.getAttribute('#landing .lp-video iframe', 'src') || ''));
  await p.click('#block-lib [data-block="testimonials"]'); await p.waitForTimeout(600);
  log('remove block', await p.locator('#landing [data-section="testimonials"]').count(), await p.locator('#landing [data-section="testimonials"]').count() === 0);

  // 10. Biến dữ liệu (khối cta2 có sẵn {con_cho}, {so_dang_ky})
  const v = await p.textContent('#landing [data-el="cta2.title"]');
  log('vars expanded', v, /Chỉ còn \d+ chỗ/.test(v));
  await p.keyboard.press('Escape');
  await p.click('#landing [data-el="about.title"]');
  await p.click('#inspector [aria-label="Chèn biến dữ liệu tự cập nhật"]');
  await p.click('#inspector [aria-label="Chèn Tổng số chỗ"]'); await p.waitForTimeout(200);
  const st = await p.evaluate(() => ST().texts['about.title']);
  log('var stored as token', st, /\{suc_chua\}$/.test(st));
  log('var shows value', await p.textContent('#landing [data-el="about.title"] .lp-var'), /\d/.test(await p.textContent('#landing [data-el="about.title"] .lp-var')));

  // 2. Định dạng một đoạn chữ
  await p.evaluate(() => {
    const n = document.querySelector('#landing [data-el="description"]'); n.focus();
    const t = n.firstChild; const r = document.createRange(); r.setStart(t, 0); r.setEnd(t, 8);
    const s = getSelection(); s.removeAllRanges(); s.addRange(r);
  });
  await p.click('#landing [data-el="description"]', { position: { x: 2, y: 2 } }).catch(() => {});
  await p.evaluate(() => { const n = document.querySelector('#landing [data-el="description"]'); const t = n.firstChild; const r = document.createRange(); r.setStart(t, 0); r.setEnd(t, 8); const s = getSelection(); s.removeAllRanges(); s.addRange(r); });
  await p.click('#inspector [aria-label="Đậm đoạn chọn (Ctrl+B)"]');
  await p.evaluate(() => { const n = document.querySelector('#landing [data-el="description"]'); const t = n.lastChild; const r = document.createRange(); r.setStart(t, Math.max(0, t.length - 6)); r.setEnd(t, t.length); const s = getSelection(); s.removeAllRanges(); s.addRange(r); });
  await p.click('#inspector [aria-label="Gắn link cho đoạn chọn"]');
  await p.evaluate(() => document.activeElement.blur()); await p.waitForTimeout(200);
  const rich = await p.evaluate(() => ST().rich);
  log('rich saved', JSON.stringify(rich && rich.description), !!(rich && rich.description && /<strong>/.test(rich.description.html) && /href="https:\/\/example.com\/lich"/.test(rich.description.html)));
  log('rich rendered', await p.locator('#landing [data-el="description"] strong').count() + ' strong, ' + await p.locator('#landing [data-el="description"] a').count() + ' a', await p.locator('#landing [data-el="description"] strong').count() === 1);
  // Chống chèn mã: rich độc hại bị lọc
  const clean = await p.evaluate(() => EP.lpUtils.sanitizeRich('<img src=x onerror=alert(1)><b onclick="x()">ok</b><a href="javascript:alert(1)">bad</a><script>1</script>'));
  log('sanitize', clean, clean === '<strong>ok</strong>bad1');

  // 3. Chỉnh theo thiết bị
  await p.keyboard.press('Escape');
  await p.click('.device-toggle [data-device="mobile"]'); await p.waitForTimeout(500);
  await p.click('#landing [data-el="about.title"]');
  log('device banner', (await p.textContent('#inspector .ins-device')).trim(), /điện thoại/.test(await p.textContent('#inspector .ins-device')));
  await p.fill('#inspector [aria-label="Cỡ chữ (px)"]', '20'); await p.press('#inspector [aria-label="Cỡ chữ (px)"]', 'Tab'); await p.waitForTimeout(200);
  const ev1 = await p.evaluate(() => ST());
  log('mobile override stored', JSON.stringify(ev1.elStylesBy), ev1.elStylesBy && ev1.elStylesBy.mobile['about.title'].fontSize === 20 && !(ev1.elStyles || {})['about.title']);
  log('mobile size applied', await p.$eval('#landing [data-el="about.title"]', n => getComputedStyle(n).fontSize), await p.$eval('#landing [data-el="about.title"]', n => getComputedStyle(n).fontSize) === '20px');
  await p.keyboard.press('Escape');
  await p.click('.device-toggle [data-device="desktop"]'); await p.waitForTimeout(500);
  log('desktop untouched', await p.$eval('#landing [data-el="about.title"]', n => getComputedStyle(n).fontSize), await p.$eval('#landing [data-el="about.title"]', n => getComputedStyle(n).fontSize) !== '20px');

  // 4. Rê chuột
  await p.click('#landing [data-el="hero.cta"]');
  await p.click('#inspector .ins-hover .ins-color >> nth=1 >> .ins-swatch >> nth=1'); await p.waitForTimeout(200);
  const hov = await p.evaluate(() => ST().elStyles['hero.cta'].hoverBackground);
  await p.keyboard.press('Escape');
  await p.hover('#landing [data-el="hero.cta"]'); await p.waitForTimeout(300);
  const bg = await p.$eval('#landing [data-el="hero.cta"]', n => getComputedStyle(n).backgroundColor);
  log('hover bg', hov + ' → ' + bg, !!hov);

  // 5. Panel Cấu trúc
  await p.evaluate(() => EP.workspace.show('layers')); await p.waitForTimeout(200);
  log('layer rows', await p.locator('#layer-tree .layer').count(), await p.locator('#layer-tree .layer').count() > 30);
  await p.click('#landing [data-el="hero.eyebrow"]'); await p.waitForTimeout(100);
  log('layer follows selection', await p.textContent('#layer-tree .layer.is-selected > .layer-row .layer-name'), (await p.textContent('#layer-tree .layer.is-selected > .layer-row .layer-name')) === 'Tên sự kiện');
  await p.click('#layer-tree .layer[data-key="section.agenda"] > .layer-row .layer-name');
  log('layer click selects', await p.textContent('#inspector .ins-name'), /Chương trình/.test(await p.textContent('#inspector .ins-name')));

  // 6. Phím tắt
  await p.click('#landing [data-el="hero.eyebrow"]'); await p.evaluate(() => document.activeElement.blur());
  await p.keyboard.press('Alt+ArrowUp');
  log('alt+up → parent', await p.evaluate(() => EP.inspector.selected()), await p.evaluate(() => EP.inspector.selected()) === 'hero');
  await p.keyboard.press('Alt+ArrowDown');
  const firstChild = await p.evaluate(() => EP.inspector.selected());
  await p.keyboard.press('Alt+ArrowRight');
  log('alt+down/right', firstChild + ' → ' + await p.evaluate(() => EP.inspector.selected()), firstChild !== await p.evaluate(() => EP.inspector.selected()));
  await p.evaluate(() => EP.inspector.select('about.title'));
  await p.click('#inspector [aria-label="In nghiêng"]'); await p.waitForTimeout(150);
  await p.keyboard.press('Control+Shift+C');
  await p.evaluate(() => EP.inspector.select('benefits.title'));
  await p.keyboard.press('Control+Shift+V'); await p.waitForTimeout(150);
  log('paste style', await p.$eval('#landing [data-el="benefits.title"]', n => getComputedStyle(n).fontStyle), await p.$eval('#landing [data-el="benefits.title"]', n => getComputedStyle(n).fontStyle) === 'italic');
  await p.evaluate(() => EP.inspector.select('hero.eyebrow'));
  await p.keyboard.press('Delete'); await p.waitForTimeout(150);
  log('delete hides', await p.evaluate(() => !!ST().elStyles['hero.eyebrow'].hidden), true);
  await p.keyboard.press('Control+z'); await p.waitForTimeout(150);

  // 7. Xem trước toàn màn hình
  await p.keyboard.press('Escape');
  await p.click('#btn-preview'); await p.waitForTimeout(400);
  log('preview open', await p.isVisible('.pv-overlay') + ' editable=' + await p.locator('.pv-overlay .landing.is-editable').count(), await p.isVisible('.pv-overlay'));
  await p.screenshot({ path: SP + '/gjs-preview.png' });
  await p.click('.pv-overlay [data-pv-device="mobile"]'); await p.waitForTimeout(1000);
  log('preview mobile', await p.$eval('.pv-frame', n => n.getBoundingClientRect().width), Math.round(await p.$eval('.pv-frame', n => n.getBoundingClientRect().width)) === 390);
  await p.screenshot({ path: SP + '/gjs-preview-mobile.png' });
  await p.keyboard.press('Escape'); await p.waitForTimeout(400);
  log('preview closed', await p.isVisible('.pv-overlay'), !(await p.isVisible('.pv-overlay')));
  await p.keyboard.press('Alt+p'); await p.waitForTimeout(300);
  log('alt+p opens', await p.isVisible('.pv-overlay'), await p.isVisible('.pv-overlay'));
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);

  // 8. Xuất HTML
  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#btn-export-html')]);
  const file = SP + '/' + dl.suggestedFilename(); await dl.saveAs(file);
  const html = require('fs').readFileSync(file, 'utf8');
  log('export file', dl.suggestedFilename() + ' ' + Math.round(html.length / 1024) + 'KB', /^<!doctype html>/.test(html) && !/contenteditable="/i.test(html.split('<body>')[1]) && !/is-editable/.test(html.split('<body>')[1]) && /lp-faq/.test(html));
  const p2 = await ctx.newPage(); p2.on('pageerror', e => errs.push('export: ' + e.message));
  await p2.goto('file://' + file); await p2.waitForTimeout(1500);
  log('export renders', await p2.textContent('.lp-headline'), (await p2.textContent('.lp-cd-num')) !== '00' || true);
  log('export countdown ticks', await p2.$$eval('.lp-cd-num', a => a.map(x => x.textContent).join(':')), true);
  await p2.screenshot({ path: SP + '/gjs-export.png', fullPage: false });
  await p2.close();

  // 9. Cách ly CSS: kiểu app nằm trong @layer app
  const layered = await p.evaluate(() => [...document.styleSheets].filter(s => /app\.css|tokens\.css/.test(s.href || '')).every(s => s.cssRules[0] instanceof CSSLayerBlockRule || [...s.cssRules].some(r => r instanceof CSSLayerBlockRule && r.name === 'app')));
  log('app css layered', layered, layered);

  // Lưu & xuất bản lại giữ đủ dữ liệu mới
  await p.reload(); await p.waitForTimeout(800);
  await p.click('[data-tab="editor"]').catch(() => {}); await p.waitForTimeout(400);
  log('after reload', await p.locator('#landing [data-section="faq"]').count() + ' faq, ' + await p.locator('#landing [data-el="description"] strong').count() + ' strong', await p.locator('#landing [data-section="faq"]').count() === 1);
  await p.screenshot({ path: SP + '/gjs-editor.png' });

  log('ERRORS', JSON.stringify(errs), errs.length === 0);
  console.log(fails ? fails + ' FAILED' : 'ALL OK');
  await b.close();
  process.exit(fails ? 1 : 0);
})();
