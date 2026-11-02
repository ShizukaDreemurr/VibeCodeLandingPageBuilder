// Popup đăng ký trên landing: nút CTA mở popup (trang xem + file HTML xuất), form dùng chung, thanh CTA dính trên điện thoại.
// Chạy: python3 -m http.server 8000 rồi `node tests/e2e-lp-popup.cjs [url] [thư-mục-ảnh]`
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs');
const BASE = (process.argv[2] || 'http://localhost:8000/').replace(/index\.html$/, '');
const shots = process.argv[3];
let failed = 0;
const ok = (name, cond, extra) => { if (cond) console.log('✓', name); else { failed++; console.log('✗', name, extra === undefined ? '' : JSON.stringify(extra)); } };
const shot = async (p, name) => { if (shots) { fs.mkdirSync(shots, { recursive: true }); await p.screenshot({ path: shots + '/' + name + '.png' }); } };
const REG = 'dialog.lp-reg[open]';
const SUCCESS = 'dialog.lp-pop[open]';

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 860 } });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => m.type() === 'error' && !/fonts|net::|Failed to load/.test(m.text()) && errs.push(m.text()));

  await p.goto(BASE + '?demo=1&popup=1');
  await p.waitForSelector('#view-templates, .event-card, header', { timeout: 8000 });
  await p.waitForTimeout(800);
  await p.keyboard.press('Escape'); // đóng popup chào mừng nếu có

  // Dựng landing công khai (không chế độ soạn) ngay trong <body>, dùng đường đăng ký thật (EP.registrations)
  let seq = 0;
  const mount = async (cfg) => {
    seq++;
    await p.evaluate((a) => {
      document.querySelectorAll('#lp-test').forEach(e => e.remove());
      Array.from(document.body.children).forEach(e => { if (e.tagName !== 'SCRIPT' && e.id !== 'lp-test') e.setAttribute('data-hid', '1'), e.style.display = 'none'; });
      const box = document.createElement('div'); box.id = 'lp-test'; document.body.appendChild(box);
      const st = JSON.parse(localStorage.getItem('ep_events')); const saved = st[Object.keys(st)[0]];
      const ev = Object.assign({}, saved.event, { id: 'lpt' + a.seq, capacity: a.capacity, startAt: new Date(Date.now() + a.days * 86400000).toISOString() });
      if (a.noOffer) { ev.earlyBird = ''; ev.earlyBirdUntil = ''; }
      window.__n = a.start; // số đã đăng ký giả lập (chỉ để tính chỗ)
      window.__r = EP.landingRenderer.render(box, { event: ev, content: saved.content, now: () => new Date(), getCount: () => window.__n, editable: false,
        onRegister: (d) => { const r = EP.registrations.register(ev, d, new Date(), window.__n); if (r.ok) window.__n++; return r; } });
    }, Object.assign({ seq, capacity: 100, days: 5, start: 10 }, cfg));
    await p.waitForSelector('#lp-test .lp-hero');
    await p.waitForTimeout(300);
  };
  const fillPop = async (name, phone, email, consent = true) => {
    await p.fill(REG + ' [name=name]', name); await p.fill(REG + ' [name=phone]', phone); await p.fill(REG + ' [name=email]', email);
    if (consent) await p.check(REG + ' input[name=consent]');
  };
  const noOverflow = () => p.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1);

  // 1. Mở popup bằng CTA hero
  await mount({});
  ok('không có popup khi chưa bấm', (await p.locator('dialog.lp-reg').count()) === 0);
  await p.click('#lp-test .lp-hero .lp-cta');
  await p.waitForSelector(REG);
  ok('CTA hero mở popup đăng ký', (await p.locator(REG).count()) === 1);
  ok('popup không cuộn tới form trong trang', await p.evaluate(() => !location.hash));
  ok('role=dialog + aria-modal + aria-labelledby', await p.evaluate(() => { const d = document.querySelector('dialog.lp-reg'); return d.getAttribute('role') === 'dialog' && d.getAttribute('aria-modal') === 'true' && !!document.getElementById(d.getAttribute('aria-labelledby')); }));
  const popText = await p.locator(REG).innerText();
  ok('popup có tên sự kiện, nơi chốn, ưu đãi, câu tin cậy', /Chúng tôi chỉ dùng thông tin để xác nhận chỗ/.test(popText) && (await p.locator(REG + ' .lp-reg-kicker').innerText()).length > 2 && (await p.locator(REG + ' .lp-reg-meta li').count()) === 2 && (await p.locator(REG + ' .lp-reg-offer').count()) === 1);
  ok('popup hiện "Còn 90 chỗ"', /Còn 90 chỗ/.test(await p.locator(REG + ' .lp-reg-seats').innerText()));
  ok('popup có đủ họ tên, SĐT, email, đồng ý, gửi', (await p.locator(REG + ' input').count()) === 4 && (await p.locator(REG + ' .lp-submit').count()) === 1);
  ok('tiêu điểm vào ô họ tên', await p.evaluate(() => document.activeElement && document.activeElement.name === 'name' && !!document.activeElement.closest('dialog.lp-reg')));
  await shot(p, 'lp-popup-desktop');
  // focus trap
  let inside = true;
  for (let i = 0; i < 9; i++) { await p.keyboard.press('Tab'); inside = inside && await p.evaluate(() => !!document.activeElement.closest('dialog.lp-reg')); }
  for (let i = 0; i < 4; i++) { await p.keyboard.press('Shift+Tab'); inside = inside && await p.evaluate(() => !!document.activeElement.closest('dialog.lp-reg')); }
  ok('focus bị giữ trong popup (Tab / Shift+Tab)', inside);
  // 2. Kiểm tra dữ liệu
  await p.click(REG + ' .lp-submit');
  ok('popup: lỗi hiện khi bỏ trống', (await p.locator(REG + ' [data-error-for=name]').innerText()).length > 0 && (await p.locator(REG + ' [data-error-for=phone]').innerText()).length > 0 && (await p.locator(REG + ' [data-error-for=email]').innerText()).length > 0);
  ok('popup vẫn mở sau khi lỗi', (await p.locator(REG).count()) === 1);
  await p.fill(REG + ' [name=phone]', '12345'); await p.fill(REG + ' [name=email]', 'abc'); await p.click(REG + ' .lp-submit');
  ok('popup: SĐT/email sai báo lỗi', (await p.locator(REG + ' [data-error-for=phone]').innerText()).length > 0);
  // 3. Esc + nút đóng + trả tiêu điểm
  await p.keyboard.press('Escape'); await p.waitForTimeout(250);
  ok('Esc đóng popup', (await p.locator('dialog.lp-reg').count()) === 0);
  ok('tiêu điểm trả về nút CTA', await p.evaluate(() => document.activeElement && document.activeElement.classList.contains('lp-cta')));
  await p.click('#lp-test .lp-hero .lp-cta'); await p.waitForSelector(REG);
  await p.click(REG + ' .lp-reg-x'); await p.waitForTimeout(250);
  ok('nút đóng (X) đóng popup', (await p.locator('dialog.lp-reg').count()) === 0);
  // nút cta2 cũng mở (bật khối cta2 trong dữ liệu)
  // 4. Đăng ký thành công → popup thành công
  await p.click('#lp-test .lp-hero .lp-cta'); await p.waitForSelector(REG);
  await fillPop('Nguyễn Văn A', '0912345678', 'a@example.com');
  await p.click(REG + ' .lp-submit'); await p.waitForSelector(SUCCESS, { timeout: 4000 });
  ok('đăng ký thành công: popup đăng ký đóng, popup thành công hiện', (await p.locator('dialog.lp-reg').count()) === 0 && /Đăng ký thành công/.test(await p.locator('dialog.lp-pop h2').innerText()));
  ok('số đã đăng ký tăng (chip hero: 11 người)', /11/.test(await p.locator('#lp-test .lp-chip').innerText()));
  await shot(p, 'lp-popup-success');
  await p.keyboard.press('Escape'); await p.waitForTimeout(250);
  // 5. Trùng
  await p.click('#lp-test .lp-hero .lp-cta'); await p.waitForSelector(REG);
  await fillPop('Người khác', '0912345678', 'khac@example.com');
  await p.click(REG + ' .lp-submit'); await p.waitForTimeout(300);
  ok('trùng SĐT bị chặn, popup còn mở, có thông báo', (await p.locator(REG).count()) === 1 && /đăng ký rồi/.test(await p.locator(REG + ' .lp-form-msg').innerText()));
  await p.keyboard.press('Escape'); await p.waitForTimeout(250);
  // 6. Form trong trang vẫn hoạt động (dùng chung đường gửi)
  await p.fill('#lp-test #lp-name', 'Trần B'); await p.fill('#lp-test #lp-phone', '0987654321'); await p.fill('#lp-test #lp-email', 'b@example.com');
  await p.check('#lp-test .lp-consent input'); await p.click('#lp-test .lp-submit'); await p.waitForSelector(SUCCESS, { timeout: 4000 });
  ok('form trong trang vẫn đăng ký được', /Đăng ký thành công/.test(await p.locator('dialog.lp-pop h2').innerText()));
  await p.keyboard.press('Escape'); await p.waitForTimeout(250);

  // 7. Hết chỗ → danh sách chờ
  await mount({ capacity: 5, start: 5 });
  await p.click('#lp-test .lp-hero .lp-cta'); await p.waitForSelector(REG);
  ok('hết chỗ: nút "Vào danh sách chờ" + nhãn hết chỗ', /danh sách chờ/i.test(await p.locator(REG + ' .lp-submit').innerText()) && /hết chỗ/i.test(await p.locator(REG + ' .lp-reg-seats').innerText()));
  await fillPop('Chờ Một', '0911222333', 'cho@example.com');
  await p.click(REG + ' .lp-submit'); await p.waitForSelector(SUCCESS, { timeout: 4000 });
  ok('hết chỗ: thông báo danh sách chờ', /danh sách chờ/i.test(await p.locator('dialog.lp-pop h2').innerText()));
  await p.keyboard.press('Escape'); await p.waitForTimeout(250);

  // 8. Sự kiện đã diễn ra → thông báo đóng
  await mount({ days: -1 });
  await p.click('#lp-test .lp-hero .lp-cta'); await p.waitForSelector(REG);
  ok('đã diễn ra: popup hiện thông báo đóng, không có form', await p.evaluate(() => { const d = document.querySelector('dialog.lp-reg'); const f = d.querySelector('form'); const c = d.querySelector('.lp-closed'); return f.hidden && !c.hidden && /đã diễn ra/.test(c.textContent); }));
  await p.keyboard.press('Escape'); await p.waitForTimeout(250);

  // 9. Chip + thẻ ưu đãi + thẻ lợi ích
  await mount({});
  ok('hero có chip "N người đã đăng ký"', /10\s+người đã đăng ký/.test(await p.locator('#lp-test .lp-hero .lp-chip').innerText()));
  ok('thẻ ưu đãi có biểu tượng quà + "Còn X ngày"', (await p.locator('#lp-test .lp-offer-card .lp-offer-ico svg').count()) === 1 && /Còn \d+ ngày|Hết hạn/.test(await p.locator('#lp-test .lp-offer-left').innerText()));
  ok('lợi ích dạng thẻ có nền riêng', await p.evaluate(() => { const li = document.querySelector('#lp-test .lp-benefits li'); return parseFloat(getComputedStyle(li).borderTopWidth) >= 1; }));

  // 10. Mobile 390: thanh dính, popup dạng bottom sheet, không tràn ngang
  await p.setViewportSize({ width: 390, height: 844 });
  await mount({});
  const stickyOn = () => p.evaluate(() => { const s = document.querySelector('#lp-test .lp-sticky'); return !!s && s.classList.contains('is-on') && getComputedStyle(s).visibility === 'visible'; });
  ok('390: thanh CTA dính ẩn ở đầu trang', !(await stickyOn()));
  await p.evaluate(() => window.scrollTo(0, document.querySelector('#lp-test .lp-hero').offsetHeight + 400)); await p.waitForTimeout(600);
  ok('390: thanh CTA dính hiện sau khi cuộn qua hero', await stickyOn());
  ok('390: thanh dính có "Còn N chỗ" + đếm ngược', /Còn 90 chỗ/.test(await p.locator('#lp-test .lp-sticky-main').innerText()) && /Còn \d+ (ngày|giờ|phút)/.test(await p.locator('#lp-test .lp-sticky-sub').innerText()));
  const box = await p.locator('#lp-test .lp-sticky').boundingBox();
  ok('390: thanh dính nằm sát đáy màn hình', box && Math.abs(box.y + box.height - 844) < 3, box);
  await shot(p, 'lp-sticky-390');
  await p.click('#lp-test .lp-sticky-btn'); await p.waitForSelector(REG);
  ok('390: nút thanh dính mở popup', (await p.locator(REG).count()) === 1);
  await p.waitForTimeout(600);
  const sheet = await p.locator(REG + ' .lp-reg-card').boundingBox();
  ok('390: popup dạng bottom sheet (rộng 390, sát đáy)', sheet && sheet.width >= 389 && Math.abs(sheet.y + sheet.height - 844) < 3, sheet);
  ok('390: popup không tràn ngang', await noOverflow());
  await shot(p, 'lp-popup-390');
  await p.keyboard.press('Escape'); await p.waitForTimeout(250);
  await p.evaluate(() => document.querySelector('#lp-test #lp-register').scrollIntoView({ block: 'center' })); await p.waitForTimeout(700);
  ok('390: thanh dính ẩn khi tới form đăng ký', !(await stickyOn()));
  await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight)); await p.waitForTimeout(700);
  ok('390: thanh dính ẩn ở chân trang', !(await stickyOn()));
  ok('390: landing không tràn ngang', await noOverflow());

  // 11. Trang soạn (editor preview): bấm CTA KHÔNG mở popup
  await p.setViewportSize({ width: 1400, height: 900 });
  await p.goto(BASE + '?demo=1');
  await p.waitForTimeout(1000);
  await p.evaluate(() => { const t = document.querySelector('[data-tab="events"]'); t && t.click(); });
  await p.waitForSelector('.event-card', { timeout: 5000 });
  await p.evaluate(() => { const c = document.querySelector('.event-card'); (c.querySelector('button, a') || c).click(); });
  await p.waitForSelector('#landing .lp-cta', { state: 'attached', timeout: 8000 });
  await p.evaluate(() => { const t = document.querySelector('[data-tab="design"]'); t && t.click(); });
  await p.waitForTimeout(500);
  const hasPreview = await p.locator('#landing .lp-hero .lp-cta').isVisible().catch(() => false);
  if (hasPreview) await p.locator('#landing .lp-hero .lp-cta').click({ force: true }).catch(() => {});
  else await p.evaluate(() => document.querySelector('#landing .lp-hero .lp-cta').click());
  await p.waitForTimeout(400);
  ok('editor: bấm CTA không mở popup đăng ký', (await p.locator('dialog.lp-reg').count()) === 0);
  ok('editor: không có thanh CTA dính', (await p.locator('#landing .lp-sticky').count()) === 0);

  // 12. File HTML xuất
  const html = await p.evaluate(() => EP.exportHtml());
  ok('xuất HTML có popup đăng ký', /<dialog[^>]*class="lp-reg"/.test(html) && /lp-sticky/.test(html));
  const pe = await ctx.newPage();
  const perrs = [];
  pe.on('pageerror', e => perrs.push(e.message));
  await pe.setViewportSize({ width: 1400, height: 900 });
  await pe.setContent(html, { waitUntil: 'load' });
  await pe.waitForTimeout(400);
  await pe.click('.lp-hero .lp-cta');
  await pe.waitForSelector(REG, { timeout: 3000 }).catch(() => {});
  ok('xuất HTML: CTA mở popup', (await pe.locator(REG).count()) === 1);
  ok('xuất HTML: popup có form + tên sự kiện + dòng tin cậy', (await pe.locator(REG + ' input').count()) === 4 && /Chúng tôi chỉ dùng thông tin/.test(await pe.locator(REG).innerText()));
  await pe.fill(REG + ' [name=name]', 'Khách'); await pe.fill(REG + ' [name=phone]', '0912345678'); await pe.fill(REG + ' [name=email]', 'k@example.com'); await pe.check(REG + ' input[name=consent]');
  await pe.click(REG + ' .lp-submit'); await pe.waitForTimeout(300);
  ok('xuất HTML: gửi form hiện thông báo trang tĩnh', /trang tĩnh/.test(await pe.locator(REG + ' .lp-form-msg').innerText()));
  await shot(pe, 'lp-export-popup-desktop');
  await pe.keyboard.press('Escape'); await pe.waitForTimeout(250);
  ok('xuất HTML: Esc đóng popup', (await pe.locator(REG).count()) === 0);
  await pe.click('.lp-hero .lp-cta'); await pe.waitForSelector(REG);
  await pe.click(REG + ' .lp-reg-x'); await pe.waitForTimeout(250);
  ok('xuất HTML: nút đóng hoạt động', (await pe.locator(REG).count()) === 0);
  await pe.setViewportSize({ width: 390, height: 844 }); await pe.waitForTimeout(300);
  const on = () => pe.evaluate(() => { const s = document.querySelector('.lp-sticky'); return !!s && s.classList.contains('is-on') && getComputedStyle(s).visibility === 'visible'; });
  ok('xuất HTML 390: thanh dính ẩn ở đầu', !(await on()));
  await pe.evaluate(() => window.scrollTo(0, document.querySelector('.lp-hero').offsetHeight + 400)); await pe.waitForTimeout(600);
  ok('xuất HTML 390: thanh dính hiện sau hero', await on());
  await shot(pe, 'lp-export-sticky-390');
  await pe.click('.lp-sticky-btn'); await pe.waitForSelector(REG);
  ok('xuất HTML 390: nút thanh dính mở popup', (await pe.locator(REG).count()) === 1);
  await shot(pe, 'lp-export-popup-390');
  await pe.keyboard.press('Escape'); await pe.waitForTimeout(250);
  await pe.evaluate(() => document.getElementById('lp-register').scrollIntoView({ block: 'center' })); await pe.waitForTimeout(700);
  ok('xuất HTML 390: thanh dính ẩn gần form', !(await on()));
  ok('xuất HTML 390: không tràn ngang', await pe.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1));
  ok('xuất HTML: không lỗi trang', perrs.length === 0, perrs);

  ok('không lỗi trang / console', errs.length === 0, errs);
  await b.close();
  console.log(failed ? '\n' + failed + ' LỖI' : '\nALL OK');
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
