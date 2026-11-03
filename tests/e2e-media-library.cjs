// Thư viện ảnh dùng chung: mở từ 2 nơi, tải 2 ảnh, dùng lại ở ô khác, đổi tên, xoá, còn sau khi tải lại trang.
// Dùng: node tests/e2e-media-library.cjs <thư-mục-ảnh-chụp> <url>
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const SHOTS = process.argv[2], URL_ = process.argv[3] || 'http://localhost:8124/';
(async () => {
  let fail = 0; const ok = (n, c, d) => { console.log((c ? 'PASS ' : 'FAIL ') + n + (d ? ' — ' + d : '')); if (!c) fail++; };
  const b = require('./auto-tab.cjs')(await chromium.launch());
  const ctx = await b.newContext({ viewport: { width: 1400, height: 900 } });
  const p = await ctx.newPage();
  p.__noAutoUpload = true;
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const imgs = () => p.evaluate(() => { const id = JSON.parse(localStorage.ep_current_id); return JSON.parse(localStorage.ep_events)[id].event.images || {}; });
  // Ảnh thử sinh ngay trong trình duyệt
  const make = async (name, color) => {
    const b64 = await p.evaluate((c) => { const cv = document.createElement('canvas'); cv.width = 900; cv.height = 600; const x = cv.getContext('2d'); x.fillStyle = c; x.fillRect(0, 0, 900, 600); x.fillStyle = '#fff'; x.fillRect(100, 100, 300, 200); return cv.toDataURL('image/png').split(',')[1]; }, color);
    return { name, mimeType: 'image/png', buffer: Buffer.from(b64, 'base64') };
  };
  const D = 'dialog.ml-dialog[open]';
  const closeEditor = async () => { if (await p.locator('dialog.ie-dialog[open]').count()) { await p.waitForSelector('dialog.ie-dialog[open] canvas', { timeout: 8000 }); await p.waitForTimeout(300); await p.click('.ie-foot button:has-text("Áp dụng")'); await p.waitForFunction(() => !document.querySelector('dialog.ie-dialog'), null, { timeout: 5000 }); } };

  await p.goto(URL_); await p.click('#btn-sample'); await p.click('#btn-generate'); await p.waitForTimeout(900);
  await p.click('[data-tab="builder"]');
  const a = await make('anh-xanh.png', '#2a6fdb'), c = await make('anh-do.png', '#d33a2c');

  // 1. Mở từ thẻ Hình ảnh (ô album 0)
  await p.click('#img-card .img-tile[data-slot="gallery:0"]');
  await p.waitForSelector(D);
  ok('opens "Thư viện ảnh" dialog from builder card', (await p.textContent(D + ' h2')) === 'Thư viện ảnh');
  ok('is a real <dialog>, empty state shown', await p.evaluate(() => document.querySelector('dialog.ml-dialog').open) && (await p.textContent(D + ' .ml-empty')).includes('Chưa có ảnh'));
  ok('has demo tab', await p.locator(D + ' .ml-tab:has-text("Ảnh mẫu")').count() === 1);
  await p.keyboard.press('Escape');
  await p.waitForFunction(() => !document.querySelector('dialog.ml-dialog'));
  ok('Esc closes dialog', true);

  // 2. Tải 2 ảnh cùng lúc
  await p.click('#img-card .img-tile[data-slot="gallery:0"]'); await p.waitForSelector(D);
  const [fc] = await Promise.all([p.waitForEvent('filechooser'), p.click(D + ' .ml-upload')]);
  ok('file chooser is multiple', await fc.isMultiple());
  await fc.setFiles([a, c]);
  await p.waitForFunction(() => document.querySelectorAll('dialog.ml-dialog .ml-card').length === 2, null, { timeout: 15000 }).catch(async (e) => { console.log('DEBUG', await p.textContent(D + ' .ml-msg'), await p.locator(D + ' .ml-card').count()); throw e; });
  ok('2 uploaded images listed', true);
  ok('names + size shown', (await p.textContent(D + ' .ml-grid')).includes('anh-do') && /KB|MB/.test(await p.textContent(D + ' .ml-grid')));
  ok('newest first', (await p.locator(D + ' .ml-card .ml-name').first().textContent()) === 'anh-do');
  ok('storage used shown', /đã dùng/.test(await p.textContent(D + ' .ml-foot')));
  if (SHOTS) await p.screenshot({ path: SHOTS + '/ml-desktop.png' });
  // tìm kiếm
  await p.fill(D + ' .ml-search', 'xanh');
  ok('search filters', await p.locator(D + ' .ml-card').count() === 1);
  await p.fill(D + ' .ml-search', '');
  // chọn bằng bàn phím
  await p.focus(D + ' .ml-card .ml-item');
  await p.keyboard.press('ArrowRight');
  ok('arrow key moves focus in grid', await p.evaluate(() => document.activeElement.getAttribute('aria-label').includes('anh-xanh')));
  await p.keyboard.press('Enter');
  await p.waitForFunction(() => !document.querySelector('dialog.ml-dialog'));
  await p.waitForFunction(() => { const id = JSON.parse(localStorage.ep_current_id); const g = JSON.parse(localStorage.ep_events)[id].event.images.gallery || []; return /^data:image\//.test(g[0] || ''); }, null, { timeout: 8000 });
  ok('selected image fills gallery slot 0', true);
  await closeEditor();

  // 3. Mở từ nơi thứ hai (ảnh bìa trên canvas / panel) và dùng lại ảnh đã tải
  await p.click('#img-card .img-tile[data-slot="about"]'); await p.waitForSelector(D);
  ok('second entry point opens same library with 2 images', await p.locator(D + ' .ml-card').count() === 2);
  await p.click(D + ' .ml-card:has-text("anh-do") .ml-item');
  await p.waitForFunction(() => !document.querySelector('dialog.ml-dialog'));
  await closeEditor();
  await p.waitForTimeout(500);
  const im = await imgs();
  ok('same upload reused for About slot', /^data:image\//.test(im.about || ''));

  // 4. Đổi tên + xoá
  await p.click('#img-card .img-tile[data-slot="offer"]'); await p.waitForSelector(D);
  await p.hover(D + ' .ml-card:has-text("anh-xanh")');
  await p.click(D + ' .ml-card:has-text("anh-xanh") .ml-more');
  await p.click(D + ' .ml-menu button:has-text("Đổi tên")');
  await p.fill(D + ' .ml-rename', 'logo-xanh'); await p.keyboard.press('Enter');
  await p.waitForSelector(D + ' .ml-card:has-text("logo-xanh")');
  ok('rename works', true);
  await p.click(D + ' .ml-card:has-text("anh-do") .ml-more');
  await p.click(D + ' .ml-menu .is-danger'); await p.click(D + ' .ml-menu .is-danger');
  await p.waitForFunction(() => document.querySelectorAll('dialog.ml-dialog .ml-card').length === 1);
  ok('delete works', true);

  // 5. Ảnh mẫu
  await p.click(D + ' .ml-tab:has-text("Ảnh mẫu")');
  ok('demo tab lists assets/demo images', await p.locator(D + ' .ml-item').count() >= 8);
  await p.keyboard.press('Escape'); await p.waitForFunction(() => !document.querySelector('dialog.ml-dialog'));

  // 6. Còn sau khi tải lại trang
  await p.reload(); await p.waitForTimeout(800);
  await p.click('[data-tab="builder"]');
  await p.click('#img-card .img-tile[data-slot="offer"]'); await p.waitForSelector(D);
  await p.waitForFunction(() => document.querySelectorAll('dialog.ml-dialog .ml-card').length === 1, null, { timeout: 5000 });
  ok('library persists after reload (renamed, deleted state kept)', (await p.textContent(D + ' .ml-grid')).includes('logo-xanh'));
  await p.keyboard.press('Escape');

  // 7. Di động
  await p.setViewportSize({ width: 390, height: 800 });
  await p.click('#img-card .img-tile[data-slot="offer"]'); await p.waitForSelector(D);
  await p.waitForTimeout(600);
  const box = await p.evaluate(() => { const r = document.querySelector('dialog.ml-dialog').getBoundingClientRect(); return [r.width, r.height, innerWidth, innerHeight]; });
  ok('full-screen sheet on mobile', box[0] === box[2] && Math.abs(box[1] - box[3]) < 2, box.join('x'));
  if (SHOTS) await p.screenshot({ path: SHOTS + '/ml-mobile.png' });
  await p.keyboard.press('Escape');

  ok('no page errors', errs.length === 0, errs.join(';'));
  await b.close(); console.log(fail ? fail + ' FAILED' : 'ALL PASS'); process.exit(fail ? 1 : 0);
})();
