// Kiểm thử trang "Thư viện mẫu" (tab đầu tiên): khách mới vào đây, số mẫu thật, lọc/chip, xem trước, "Dùng mẫu này",
// hộp thoại "Đổi mẫu" vẫn dùng được, không tràn ngang ở 390px.
// Chạy: python3 -m http.server 8000 rồi node tests/e2e-template-page.cjs [URL] [thư-mục-lưu-ảnh-chụp]
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const URL = process.argv[2] || 'http://localhost:8000/';
const SHOTS = process.argv[3] || '';
let failed = 0;
const ok = (c, m) => { if (!c) { failed++; console.log('✗ ' + m); } else console.log('✓ ' + m); };
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1400, height: 900 } });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => m.type() === 'error' && !/Failed to load resource/.test(m.text()) && errs.push(m.text()));
  const settle = () => p.waitForTimeout(400);
  const shot = async n => { if (SHOTS) await p.screenshot({ path: SHOTS + '/' + n + '.png' }); };

  await p.goto(URL);
  const total = await p.evaluate(() => EP.templates.list.length);
  const info = await p.evaluate(() => EP.templates.list.map(t => ({ id: t.id, name: t.name, tags: t.tags })));

  // ---- Khách mới: tab Thư viện mẫu là tab đầu và mở sẵn ----
  const tabs = await p.$$eval('.tabs .tab', t => t.map(x => x.getAttribute('data-tab')));
  ok(tabs[0] === 'templates', 'tab đầu tiên là Thư viện mẫu (' + tabs.join(',') + ')');
  ok(await p.isVisible('#view-templates') && await p.isHidden('#view-builder'), 'khách mới vào thẳng Thư viện mẫu');
  ok((await p.getAttribute('.tab[data-tab="templates"]', 'aria-selected')) === 'true', 'tab Thư viện mẫu đang chọn');
  const h1 = (await p.textContent('#view-templates h1')).trim();
  ok(h1 === 'Thư viện mẫu', 'h1 "Thư viện mẫu" (chữ "mẫu" tô gradient): "' + h1 + '"');
  ok((await p.textContent('#view-templates [data-r="total"]')).trim() === String(total), 'dòng meta hiện số mẫu thật: ' + total);
  ok(await p.locator('.lt-title b').count() === 1 && await p.locator('.lt-bar [data-r="sets"] .lt-set').count() >= 2 && await p.locator('.lt-bar [data-r="reel-btn"]').count() === 1, 'có tiêu đề gradient, viên phân đoạn mục đích, nút Reels');
  ok((await p.$$eval('h1', h => h.filter(x => x.getClientRects().length).length)) === 1, 'đúng một h1 hiện');
  await settle();
  ok((await p.locator('.tpl-pcard').count()) === total, `${total} thẻ mẫu`);
  const c0 = await p.locator('.tpl-pcard').first();
  ok(await c0.locator('img').count() === 1 && await c0.locator('.tpl-card-name').count() === 1 && await c0.locator('.tpl-dots i').count() === 2 && await c0.locator('.tpl-ptags .tpl-badge').count() > 0, 'thẻ có ảnh, tên, nhãn, chấm màu');
  ok(await c0.locator('button:has-text("Dùng mẫu này")').count() === 1 && await c0.locator('button:has-text("Xem trước")').count() >= 1, 'thẻ có nút Dùng mẫu này + Xem trước');
  ok(await p.locator('.tpl-chip').count() >= 5 && (await p.textContent('.tpl-chip')).includes(String(total)), 'hàng chip ngành (chip đầu = Tất cả + tổng số)');
  await shot('templates-1400');

  // ---- Lọc: chip ngành + bộ lọc loại + tìm kiếm ----
  const chipKey = await p.getAttribute('.tpl-chip >> nth=1', 'data-chip');
  await p.click('.tpl-chip >> nth=1'); await settle();
  const exp = info.filter(t => t.tags.industry.includes(chipKey)).map(t => t.id);
  const ids = await p.$$eval('#view-templates [data-r="grid"] .tpl-pcard', c => c.map(x => x.dataset.id));
  ok(ids.length === exp.length && ids.every(i => exp.includes(i)), `chip "${chipKey}": ${exp.length} thẻ khớp đủ`);
  ok((await p.inputValue('#view-templates select[data-filter="industry"]')) === chipKey, 'chip đồng bộ với ô lọc Ngành nghề');
  ok((await p.getAttribute('.tpl-chip >> nth=1', 'aria-pressed')) === 'true', 'chip đang chọn có aria-pressed');
  await p.click('#view-templates [data-r="filter-btn"]'); await settle();
  await p.selectOption('#view-templates select[data-filter="type"]', 'workshop'); await settle();
  const both = info.filter(t => t.tags.industry.includes(chipKey) && t.tags.type.includes('workshop')).map(t => t.id);
  const ex2 = await p.$$eval('#view-templates [data-r="grid"] .tpl-pcard', c => c.map(x => x.dataset.id));
  ok(ex2.length === both.length && ex2.every(i => both.includes(i)), `ngành + workshop: khớp đủ ${both.length}`);
  const nearN = await p.locator('#view-templates [data-r="grid-near"] .tpl-pcard').count();
  const oneHit = info.filter(t => t.tags.industry.includes(chipKey) !== t.tags.type.includes('workshop')).length;
  ok(nearN === oneHit, `gần đúng = ${oneHit}`);
  ok(/mẫu khớp/.test(await p.textContent('#view-templates [data-r="count"]')), 'dòng đếm kết quả');
  await p.click('#view-templates [data-r="clear"]'); await settle();
  ok((await p.locator('.tpl-pcard').count()) === total, 'Xoá bộ lọc trả lại đủ ' + total + ' mẫu');
  await p.click('#view-templates [data-r="search-btn"]'); await settle();
  await p.fill('#view-templates [data-r="search"]', 'cuoi'); await settle();
  const wed = info.filter(t => /cưới/i.test(t.name) || t.tags.type.includes('wedding')).length;
  ok((await p.locator('#view-templates [data-r="grid"] .tpl-pcard').count()) >= wed && wed > 0, 'tìm "cuoi" (không dấu) thấy mẫu cưới');
  await p.fill('#view-templates [data-r="search"]', ''); await settle();
  await p.click('#view-templates [data-r="clear"]').catch(() => {}); await settle();

  // ---- Xem trước ----
  const target = await p.getAttribute('.tpl-pcard >> nth=1', 'data-id');
  const tname = info.find(t => t.id === target).name;
  await p.click('.tpl-pcard >> nth=1 >> button:has-text("Xem trước")'); await settle();
  ok(await p.isVisible('.tpl-pv'), 'xem trước mở');
  ok((await p.textContent('.tpl-pv .pv-title')).trim() === tname, 'xem trước đúng mẫu: ' + tname);
  ok(await p.locator('.tpl-pv .landing .lp-headline').count() > 0 && (await p.locator('.tpl-pv .landing section, .tpl-pv .landing .lp-hero').count()) > 0, 'xem trước vẽ trang landing đầy đủ');
  ok(await p.locator('.tpl-pv .landing [contenteditable="true"]').count() === 0, 'xem trước không sửa được (editable:false)');
  ok(await p.isVisible('.tpl-pv .tpv-use'), 'có nút Dùng mẫu này trong xem trước');
  await shot('preview-1400');
  await p.keyboard.press('Escape'); await settle();
  await p.waitForSelector('.tpl-pv', { state: 'hidden', timeout: 3000 }).catch(() => {}); ok(await p.isHidden('.tpl-pv'), 'Esc đóng xem trước');
  await p.click('.tpl-pcard >> nth=1 >> button:has-text("Xem trước")'); await settle();
  await p.click('.tpl-pv .pv-close'); await settle();
  ok(await p.isHidden('.tpl-pv') && await p.locator('.tpl-pv .landing *').count() === 0, 'nút Đóng đóng xem trước');

  // ---- Dùng mẫu này (từ xem trước) ----
  await p.click('.tpl-pcard >> nth=1 >> button:has-text("Xem trước")'); await settle();
  await p.click('.tpl-pv .tpv-use'); await settle();
  ok(await p.isVisible('#view-builder') && await p.isHidden('#view-templates') && await p.isHidden('.tpl-pv'), 'Dùng mẫu này (xem trước) → sang tab Thông tin');
  ok((await p.textContent('#tpl-name')).trim() === tname, 'tên mẫu đã đặt: ' + tname);
  const sampleName = await p.evaluate(id => EP.templates.get(id).sample().name, target);
  ok((await p.inputValue('#f-name')) === sampleName && sampleName.length > 0, 'dữ liệu mẫu đã điền vào form: ' + sampleName);
  ok(await p.locator('.tpl-pcard').count() === 0, 'rời tab thì thẻ trang được dọn');

  // ---- Dùng mẫu này (từ thẻ) khi đã có sự kiện ----
  await p.click('#btn-generate'); await p.waitForTimeout(600);
  ok(await p.isVisible('#view-editor'), 'tạo landing page từ mẫu');
  await p.click('[data-tab="templates"]'); await settle();
  const t2 = await p.getAttribute('.tpl-pcard >> nth=3', 'data-id');
  const n2 = info.find(t => t.id === t2).name;
  await p.click('.tpl-pcard >> nth=3 >> button:has-text("Dùng mẫu này")'); await settle();
  ok(await p.isVisible('#view-builder') && (await p.textContent('#tpl-name')).trim() === n2, 'Dùng mẫu này (thẻ) với sự kiện đang mở → trang mới, mẫu ' + n2);
  ok((await p.inputValue('#f-name')) === await p.evaluate(id => EP.templates.get(id).sample().name, t2), 'form điền dữ liệu mẫu của mẫu mới');
  ok(await p.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('ep_events') || '{}')).length) === 1, 'sự kiện cũ vẫn còn trong "Sự kiện của tôi"');

  // ---- Có sự kiện → vào tab Sự kiện của tôi; tab Thư viện vẫn mở được ----
  await p.reload(); await settle();
  ok(await p.isVisible('#view-templates'), 'đã có sự kiện → vẫn mở Thư viện mẫu đầu tiên');
  await p.click('[data-tab="templates"]'); await settle();
  ok(await p.isVisible('#view-templates') && await p.locator('.tpl-pcard').count() === total, 'tab Thư viện mẫu mở lại đủ thẻ');
  ok((await p.$$eval('h1', h => h.filter(x => x.getClientRects().length).length)) === 1, 'vẫn đúng một h1 hiện');

  // ---- Hộp thoại Đổi mẫu vẫn dùng được ----
  await p.click('[data-tab="builder"]'); await settle();
  await p.click('#btn-tpl'); await settle();
  ok(await p.isVisible('#tpl-dialog'), 'Đổi mẫu mở hộp thoại');
  ok(await p.locator('#tpl-dialog .tpl-card').count() === total && await p.locator('.tpl-pcard').count() === 0, `hộp thoại ${total} thẻ, trang không nhân đôi thẻ`);
  await p.selectOption('#tpl-filters select[data-filter="industry"]', chipKey); await settle();
  ok(await p.locator('#tpl-dialog #tpl-grid .tpl-card').count() === exp.length, 'hộp thoại lọc ngành: ' + exp.length);
  await p.click('#tpl-clear'); await settle();
  const dt = await p.getAttribute('#tpl-dialog .tpl-card >> nth=2', 'data-id');
  await p.click('#tpl-dialog .tpl-card >> nth=2'); await settle();
  ok((await p.textContent('#tpl-name')).trim() === info.find(t => t.id === dt).name && await p.isHidden('#tpl-dialog'), 'chọn thẻ trong hộp thoại áp mẫu');

  // ---- Chuyển động tắt được ----
  await p.click('[data-tab="templates"]'); await settle();
  await p.evaluate(() => document.documentElement.classList.add('motion-off'));
  await p.reload(); await p.click('[data-tab="templates"]'); await settle();
  await p.evaluate(() => document.documentElement.classList.add('motion-off'));
  ok(await p.evaluate(() => getComputedStyle(document.querySelector('.tpl-pcard')).animationName === 'none'), 'motion-off tắt hiệu ứng thẻ');
  await p.evaluate(() => document.documentElement.classList.remove('motion-off'));

  // ---- Mobile 390px ----
  await p.setViewportSize({ width: 390, height: 844 }); await settle();
  await p.click('[data-tab="templates"]'); await settle();
  let ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  ok(ov <= 0, 'mobile 390px: trang Thư viện mẫu không tràn ngang (' + ov + ')');
  await shot('templates-390');
  await p.click('.tpl-pcard >> nth=0 >> button:has-text("Xem trước")'); await settle();
  ov = await p.evaluate(() => { const s = document.querySelector('.tpl-pv .pv-stage'); return [document.documentElement.scrollWidth - innerWidth, s.scrollWidth - s.clientWidth]; });
  ok(ov[0] <= 0 && ov[1] <= 0, 'mobile 390px: xem trước không tràn ngang ' + ov);
  await shot('preview-390');
  await p.keyboard.press('Escape'); await settle();

  ok(errs.length === 0, 'không có lỗi trang ' + JSON.stringify(errs));
  await b.close();
  console.log(failed ? failed + ' FAILED' : 'ALL OK');
  process.exit(failed ? 1 : 0);
})();
