// Ô ảnh mới: giới thiệu, quà tặng, album (mọi mẫu) + thẻ/panel "Hình ảnh" + lightbox + xuất HTML.
// Dùng: node tests/e2e-images-slots.cjs <thư-mục-có-photo.jpg-và-big.png> [URL] [thư-mục-lưu-ảnh-chụp]
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const SP = process.argv[2] || require('os').tmpdir();
const URL_ = process.argv[3] || 'http://localhost:8000/';
const SHOTS = process.argv[4] || '';
let failed = 0;
const ok = (name, cond, extra) => { if (!cond) failed++; console.log((cond ? '✓ ' : '✗ ') + name + (extra !== undefined ? '  ' + extra : '')); };
(async () => {
  const b = require('./auto-tab.cjs')(await chromium.launch());
  const ctx = await b.newContext({ viewport: { width: 1400, height: 900 } });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const imgs = () => p.evaluate(() => { const id = JSON.parse(localStorage.ep_current_id); return JSON.parse(localStorage.ep_events)[id].event.images || {}; });
  const waitClosed = () => p.waitForFunction(() => !document.querySelector('dialog.ie-dialog'), null, { timeout: 5000 });
  const apply = async () => { await p.waitForSelector('dialog.ie-dialog[open] canvas', { timeout: 8000 }); await p.waitForTimeout(300); await p.click('.ie-foot button:has-text("Áp dụng")'); await waitClosed(); };
  const upload = async (sel, file, editor) => {
    const fcp = p.waitForEvent('filechooser', { timeout: 8000 });
    await p.waitForTimeout(150);
    await p.click(sel);
    const fc = await fcp;
    await fc.setFiles(SP + '/' + file);
    if (editor) await apply(); else await p.waitForTimeout(1500);
  };
  const shot = async (name, page) => { if (SHOTS) await (page || p).screenshot({ path: SHOTS + '/' + name + '.png', fullPage: false }); };
  const overflow = (pg) => pg.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

  // 0. Chưa có trang: thẻ có gợi ý, chưa có ô
  await p.goto(URL_); await p.click('[data-tab="builder"]');
  ok('card shows hint before a page exists', (await p.textContent('#img-card')).includes('Tạo landing page trước') && await p.locator('#img-card .img-tile').count() === 0);
  await p.click('#btn-sample'); await p.click('#btn-generate'); await p.waitForTimeout(900);

  // 1. Thẻ ở tab Thông tin: đủ ô
  await p.click('[data-tab="builder"]');
  const tiles = await p.locator('#img-card .img-tile').count();
  const spk = await p.evaluate(() => { const id = JSON.parse(localStorage.ep_current_id); return JSON.parse(localStorage.ep_events)[id].event.speakers; });
  ok('card lists hero/about/offer + speakers + 6 album tiles', tiles === 3 + spk.length + 6, tiles + ' tiles');
  ok('speaker tile labelled by name', (await p.textContent('#img-card')).includes(spk[0].name));
  ok('tiles keyboard-focusable', await p.locator('#img-card .img-tile[tabindex="0"]').count() === tiles);

  // 2. Tải ảnh qua thẻ
  await upload('#img-card .img-tile[data-slot="about"]', 'photo.jpg', true);
  await upload('#img-card .img-tile[data-slot="offer"]', 'photo.jpg', true);
  await upload('#img-card .img-tile[data-slot="gallery:0"]', 'photo.jpg', false);
  let im = await imgs();
  ok('about stored via builder card', /^data:image\//.test(im.about || ''));
  ok('offer stored via builder card', /^data:image\//.test(im.offer || ''));
  ok('gallery[0] stored via builder card', /^data:image\//.test((im.gallery || [])[0] || ''));
  ok('about ≤ ~200KB, offer ≤ ~80KB', im.about.length <= 270000 && im.offer.length <= 110000, Math.round(im.about.length / 1024) + 'KB/' + Math.round(im.offer.length / 1024) + 'KB');
  await p.click('[data-tab="builder"]');
  ok('tile shows thumbnail + KB badge', await p.locator('#img-card .img-tile[data-slot="about"] img').count() === 1 && /KB|MB/.test(await p.textContent('#img-card .img-tile[data-slot="about"] .img-size')));
  ok('tile shows Đổi/Chỉnh/Xoá actions', (await p.locator('#img-card .img-tile[data-slot="about"] .img-acts button').allTextContents()).join() === 'Đổi,Chỉnh,Xoá');

  // 3. Render trong landing đúng ô
  await p.click('[data-tab="editor"]'); await p.waitForTimeout(500);
  ok('about image beside about text', await p.locator('.landing .lp-about.has-media .lp-about-media img').count() === 1);
  ok('offer image inside offer card', await p.locator('.landing .lp-offer-card .lp-offer-photo img').count() === 1);
  ok('gallery section with 1 image', await p.locator('.landing .lp-gallery-section .lp-gallery-item img').count() === 1);
  ok('editor preview has Đổi ảnh / Chỉnh buttons on about', await p.locator('.landing [data-slot="about"]').count() === 1 && await p.locator('.landing [data-edit-slot="about"]').count() === 1);
  const ar = await p.evaluate(() => { const r = document.querySelector('.landing .lp-about-media').getBoundingClientRect(); return r.width / r.height; });
  ok('about aspect 4:3', Math.abs(ar - 4 / 3) < 0.05, ar.toFixed(2));
  const sq = await p.evaluate(() => { const r = document.querySelector('.landing .lp-offer-photo').getBoundingClientRect(); return r.width / r.height; });
  ok('offer thumbnail square', Math.abs(sq - 1) < 0.05, sq.toFixed(2));

  // 4. Tải qua nút ngay trên bản xem trước (album 2, 3), đổi ảnh giới thiệu
  await upload('.landing .lp-gallery-section [data-slot="gallery:1"]', 'photo.jpg', false);
  await upload('.landing .lp-gallery-section [data-slot="gallery:2"]', 'photo.jpg', false);
  im = await imgs();
  ok('gallery 3 images via preview buttons', (im.gallery || []).filter(Boolean).length === 3);
  const before = im.about;
  await upload('.landing [data-slot="about"]', 'big.png', true);
  im = await imgs();
  ok('about replaced via preview button', im.about && im.about !== before);

  // 5. Panel "Hình ảnh" trong workspace
  ok('panel Hình ảnh exists', await p.evaluate(() => EP.workspace.panels().some(x => x.id === 'images' && x.title === 'Hình ảnh')));
  await p.evaluate(() => EP.workspace.show('images'));
  ok('panel visible', await p.evaluate(() => { const pn = document.querySelector('.ws-panel[data-panel="images"]'); return !!pn && !pn.hidden && !pn.closest('.ws-panels') && pn.getBoundingClientRect().width > 0; }));
  ok('panel docked beside Bố cục', await p.evaluate(() => { const a = document.querySelector('.ws-panel[data-panel="images"]'), l = document.querySelector('.ws-panel[data-panel="layout"]'); return !!a && !!l && a.parentElement === l.parentElement; }));
  ok('panel has tiles', await p.locator('.ws-panel[data-panel="images"] .img-tile').count() === tiles);
  const bytes = require('fs').readFileSync(SP + '/photo.jpg').toString('base64');
  const dt = await p.evaluateHandle((b64) => { const bin = atob(b64), a = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i); const d = new DataTransfer(); d.items.add(new File([a], 'd.jpg', { type: 'image/jpeg' })); return d; }, bytes);
  await p.dispatchEvent('.ws-panel[data-panel="images"] .img-tile[data-slot="gallery:3"]', 'drop', { dataTransfer: dt });
  await p.waitForTimeout(900);
  ok('drag & drop file onto tile uploads', (await imgs()).gallery.filter(Boolean).length === 4);
  await p.focus('.ws-panel[data-panel="images"] .img-tile[data-slot="gallery:4"]');
  // đăng ký lắng nghe hộp chọn tệp trước khi bấm phím (tránh chạy đua)
  const fcp = p.waitForEvent('filechooser', { timeout: 5000 });
  await p.waitForTimeout(250);
  await p.keyboard.press('Enter');
  const fc2 = await fcp;
  ok('Enter on focused tile opens file chooser', !!fc2);
  await fc2.setFiles(SP + "/photo.jpg"); await p.waitForFunction(() => { const id = JSON.parse(localStorage.ep_current_id); return ((JSON.parse(localStorage.ep_events)[id].event.images || {}).gallery || []).filter(Boolean).length >= 5; }, null, { timeout: 8000 }).catch(() => {});  ok('5 album images', (await imgs()).gallery.filter(Boolean).length === 5);

  // 6. Bố cục theo số ảnh (trang công khai)
  const pub = async (n) => p.evaluate((n) => {
    const id = JSON.parse(localStorage.ep_current_id), st = JSON.parse(localStorage.ep_events)[id];
    const ev = JSON.parse(JSON.stringify(st.event)); ev.images.gallery = ev.images.gallery.filter(Boolean).slice(0, n);
    const box = document.createElement('div'); document.body.appendChild(box);
    EP.landingRenderer.render(box, { event: ev, content: st.content, now: () => new Date(), getCount: () => 3, editable: false, onRegister: () => ({ ok: false, errors: {} }) });
    const g = box.querySelector('.lp-gallery');
    const r = { has: !!g, count: g && g.getAttribute('data-count'), lazy: g ? [...g.querySelectorAll('img')].every(i => i.loading === 'lazy') : false, alts: g ? [...g.querySelectorAll('img')].map(i => i.alt).join('|') : '', wide: g ? g.querySelector('.lp-gallery-item').getBoundingClientRect().width : 0, total: g ? g.getBoundingClientRect().width : 0 };
    box.remove(); return r;
  }, n);
  const g1 = await pub(1), g3 = await pub(3);
  ok('1 image: full-width item', g1.has && g1.count === '1' && g1.wide > g1.total * 0.9, g1.wide + '/' + g1.total);
  ok('3 images: big first item', g3.count === '3' && g3.wide > g3.total * 0.55, g3.wide + '/' + g3.total);
  ok('lazy-loaded + alt "Hình ảnh sự kiện N"', g3.lazy && g3.alts === 'Hình ảnh sự kiện 1|Hình ảnh sự kiện 2|Hình ảnh sự kiện 3', g3.alts);

  // 7. Trang công khai: ô trống không hiện gì
  const empty = await p.evaluate(() => {
    const id = JSON.parse(localStorage.ep_current_id), st = JSON.parse(localStorage.ep_events)[id];
    const ev = JSON.parse(JSON.stringify(st.event)); ev.images = {};
    const box = document.createElement('div'); document.body.appendChild(box);
    EP.landingRenderer.render(box, { event: ev, content: st.content, now: () => new Date(), getCount: () => 3, editable: false, onRegister: () => ({ ok: false, errors: {} }) });
    const r = { gal: box.querySelectorAll('.lp-gallery-section').length, about: box.querySelectorAll('.lp-about-media').length, offerPhoto: box.querySelectorAll('.lp-offer-photo').length, btn: box.querySelectorAll('.lp-img-btn').length, ico: box.querySelectorAll('.lp-offer-ico').length, aboutText: !!box.querySelector('[data-section="about"] p') };
    box.remove(); return r;
  });
  ok('public, no images: no gallery/about/offer placeholders or buttons', empty.gal === 0 && empty.about === 0 && empty.offerPhoto === 0 && empty.btn === 0 && empty.aboutText, JSON.stringify(empty));
  ok('public, no offer image: keeps gift icon', empty.ico === 1);

  // 8. Xuất HTML: có ảnh + lightbox hoạt động
  const html = await p.evaluate(() => EP.exportHtml());
  ok('export contains about/offer/gallery images', (html.match(/data:image\/[a-z]+;base64/g) || []).length >= 7 && html.includes('lp-about-media') && html.includes('lp-offer-photo') && html.includes('lp-gallery-open'));
  ok('export inlines lightbox script + css', html.includes('lp-lightbox') && html.includes('.lp-lb-img'));
  const q = await ctx.newPage(); q.on('pageerror', e => errs.push('export: ' + e.message));
  await q.setContent(html); await q.waitForTimeout(500);
  const n = await q.locator('.lp-gallery-open').count();
  await q.click('.lp-gallery-open >> nth=0');
  ok('lightbox opens (export)', await q.locator('.lp-lightbox').count() === 1 && (await q.textContent('.lp-lb-count')).trim() === '1 / ' + n);
  await q.click('.lp-lb-next'); ok('next → 2', (await q.textContent('.lp-lb-count')).trim() === '2 / ' + n);
  await q.keyboard.press('ArrowLeft'); ok('ArrowLeft → 1', (await q.textContent('.lp-lb-count')).trim() === '1 / ' + n);
  await q.keyboard.press('ArrowLeft'); ok('prev wraps to last', (await q.textContent('.lp-lb-count')).trim() === n + ' / ' + n);
  await q.keyboard.press('Escape'); await q.waitForTimeout(100);
  ok('Esc closes lightbox, focus returns', await q.locator('.lp-lightbox').count() === 0 && await q.evaluate(() => document.activeElement.classList.contains('lp-gallery-open')));
  await shot('slots-export-1400', q);
  await q.setViewportSize({ width: 390, height: 844 }); await q.waitForTimeout(300);
  ok('export 390px: no horizontal overflow', await overflow(q) <= 0, String(await overflow(q)));
  await q.click('.lp-gallery-open >> nth=0');
  await q.evaluate(() => { const bx = document.querySelector('.lp-lightbox'); const t = (type, x) => { const ev = new Event(type, { bubbles: true }); ev[type === 'touchend' ? 'changedTouches' : 'touches'] = [{ clientX: x }]; bx.dispatchEvent(ev); }; t('touchstart', 300); t('touchend', 100); });
  ok('swipe left → next', (await q.textContent('.lp-lb-count')).trim() === '2 / ' + n);
  await q.waitForTimeout(500);
  await shot('slots-lightbox-390', q);
  await q.close();

  // 9. Xoá ảnh
  await p.click('[data-tab="builder"]');
  await p.hover('#img-card .img-tile[data-slot="offer"]');
  await p.click('#img-card .img-tile[data-slot="offer"] .img-acts button:has-text("Xoá")');
  await p.waitForTimeout(400);
  im = await imgs();
  ok('remove offer via card', !im.offer);
  await p.click('[data-tab="editor"]'); await p.waitForTimeout(400);
  ok('offer back to gift icon after remove', await p.locator('.landing .lp-offer-photo').count() === 0 && await p.locator('.landing .lp-offer-ico').count() === 1);

  // 10. Ngân sách: nhiều ảnh nặng vẫn vừa giới hạn nhờ tự nén
  const budget = await p.evaluate(async () => {
    const id = JSON.parse(localStorage.ep_current_id), st = JSON.parse(localStorage.ep_events)[id];
    const big = st.event.images.about;
    const probe = { about: big, offer: big, gallery: [big, big, big, big, big, big], hero: big };
    const bf = EP.images.totalBytes(probe);
    const r = await EP.images.shrinkToFit(probe, Math.round(bf * 0.5));
    return { before: bf, after: EP.images.totalBytes(r.images), count: r.count, fits: r.fits };
  });
  ok('shrinkToFit covers about/offer/gallery and compresses', budget.after < budget.before && budget.count >= 1, JSON.stringify(budget));

  // 11. Ảnh chụp + 390px
  await p.click('[data-tab="builder"]'); await p.waitForTimeout(300);
  await p.locator('#img-card').scrollIntoViewIfNeeded(); await shot('builder-card-1400');
  await p.click('[data-tab="editor"]'); await p.waitForTimeout(500);
  await p.evaluate(() => document.querySelector('.landing .lp-about').scrollIntoView());
  await p.waitForTimeout(500); await shot('slots-editor-1400');
  const m = await ctx.newPage(); m.on('pageerror', e => errs.push('m: ' + e.message));
  await m.setViewportSize({ width: 390, height: 844 }); await m.goto(URL_); await m.waitForTimeout(600);
  await m.click('[data-tab="builder"]'); await m.waitForTimeout(300);
  ok('builder 390px: no horizontal overflow (with images card)', await overflow(m) <= 0, String(await overflow(m)));
  await m.locator('#img-card').scrollIntoViewIfNeeded(); await shot('builder-card-390', m);
  await m.click('[data-tab="editor"]'); await m.waitForTimeout(600);
  ok('editor 390px: no horizontal overflow', await overflow(m) <= 0, String(await overflow(m)));

  ok('no page errors', errs.length === 0, errs.join(' | '));
  await b.close();
  console.log(failed ? '\n' + failed + ' FAILED' : '\nALL OK');
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
