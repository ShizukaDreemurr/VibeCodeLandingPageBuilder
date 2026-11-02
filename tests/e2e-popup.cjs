// Popup: chào mừng một lần, xác nhận xoá, popup sau khi tạo trang, popup đăng ký trên landing (.ics), Esc, focus trap, 390px.
// Chạy: python3 -m http.server 8000 rồi `node tests/e2e-popup.cjs [url] [thư-mục-ảnh]`
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs');
const BASE = (process.argv[2] || 'http://localhost:8000/').replace(/index\.html$/, '');
const shots = process.argv[3];
let failed = 0;
const ok = (name, cond, extra) => { if (cond) console.log('✓', name); else { failed++; console.log('✗', name, extra === undefined ? '' : JSON.stringify(extra)); } };
const shot = async (p, name) => { if (shots) { fs.mkdirSync(shots, { recursive: true }); await p.screenshot({ path: shots + '/' + name + '.png' }); } };
const POP = 'dialog.ep-pop[open]';

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 860 }, acceptDownloads: true });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  let native = 0; p.on('dialog', d => { native++; d.dismiss(); });

  // Tự động hoá bỏ qua popup nếu không có ?popup=1
  const q = await b.newPage(); await q.goto(BASE + '?demo=1'); await q.waitForTimeout(1200);
  ok('chạy tự động (không ?popup=1) không hiện popup', (await q.locator(POP).count()) === 0);
  await q.close();

  // 1. Chào mừng một lần
  await p.goto(BASE + '?popup=1&demo=1');
  await p.waitForSelector(POP, { timeout: 5000 }).catch(() => {});
  ok('popup chào mừng hiện lần đầu', (await p.locator(POP).count()) === 1);
  ok('chào mừng có 3 bước', (await p.locator(POP + ' ol li').count()) === 3);
  ok('có aria-labelledby trỏ tới tiêu đề', await p.evaluate(() => { const d = document.querySelector('dialog.ep-pop'); const t = document.getElementById(d.getAttribute('aria-labelledby')); return !!t && /Chào mừng/.test(t.textContent); }));
  await shot(p, 'popup-welcome-desktop');
  // focus trap: Tab nhiều lần vẫn ở trong popup
  let inside = true;
  for (let i = 0; i < 8; i++) { await p.keyboard.press('Tab'); inside = inside && await p.evaluate(() => !!document.activeElement.closest('dialog.ep-pop')); }
  ok('focus bị giữ trong popup khi Tab', inside);
  for (let i = 0; i < 4; i++) { await p.keyboard.press('Shift+Tab'); inside = inside && await p.evaluate(() => !!document.activeElement.closest('dialog.ep-pop')); }
  ok('focus bị giữ trong popup khi Shift+Tab', inside);
  await p.keyboard.press('Escape'); await p.waitForTimeout(400);
  ok('Esc đóng popup', (await p.locator(POP).count()) === 0);
  await p.reload(); await p.waitForTimeout(1500);
  ok('chào mừng không hiện lại', (await p.locator(POP).count()) === 0);
  ok('đã nhớ ep_pop_welcome', await p.evaluate(() => localStorage.getItem('ep_pop_welcome') === '1'));

  // nút "Xem landing page mẫu"
  await p.evaluate(() => localStorage.removeItem('ep_pop_welcome'));
  await p.reload(); await p.waitForSelector(POP);
  await p.click(POP + ' button:has-text("Xem landing page mẫu")'); await p.waitForTimeout(900);
  ok('"Xem landing page mẫu" mở trình soạn', await p.evaluate(() => !document.getElementById('view-editor').hidden));

  // 5. Xác nhận xoá: huỷ giữ, đồng ý xoá
  await p.click('[data-tab="events"]');
  const n0 = await p.locator('.event-card').count();
  await p.locator('.event-card').first().locator('button:has-text("Xoá")').click();
  await p.waitForSelector(POP);
  ok('xoá sự kiện hiện popup cảnh báo (không phải confirm gốc)', (await p.locator(POP + '.is-warn').count()) === 1 && native === 0);
  await shot(p, 'popup-confirm-desktop');
  await p.click(POP + ' button:has-text("Huỷ")'); await p.waitForTimeout(400);
  ok('Huỷ giữ nguyên sự kiện', (await p.locator('.event-card').count()) === n0);
  await p.locator('.event-card').first().locator('button:has-text("Xoá")').click();
  await p.waitForSelector(POP);
  await p.click(POP + ' button:has-text("Xoá sự kiện")'); await p.waitForTimeout(900);
  ok('Đồng ý xoá sự kiện', (await p.locator('.event-card').count()) === n0 - 1, [n0, await p.locator('.event-card').count()]);

  // 2 + 3. Dùng mẫu → popup; tạo trang → celebrate
  await p.click('[data-tab="templates"]');
  await p.locator('.tpl-use-cta').first().click(); await p.waitForSelector(POP);
  ok('"Dùng mẫu này" hiện popup thành công', (await p.locator(POP + '.is-success').count()) === 1);
  await p.click(POP + ' button'); await p.waitForTimeout(400);
  await p.check('input[value="mock"]');
  await p.click('#btn-generate'); await p.waitForSelector(POP + '.is-celebrate');
  ok('tạo xong hiện popup celebrate có canvas confetti', (await p.locator(POP + ' canvas.ep-pop-confetti').count()) === 1);
  ok('popup nêu tiêu đề trang', (await p.locator(POP + ' .ep-pop-quote').innerText()).length > 3);
  await shot(p, 'popup-generated-desktop');
  await p.click(POP + ' button:has-text("Chỉnh giao diện")'); await p.waitForTimeout(400);
  ok('"Chỉnh giao diện" đóng popup, ở tab thiết kế', (await p.locator(POP).count()) === 0 && await p.evaluate(() => !document.getElementById('view-editor').hidden));

  // 4. Popup xuất bản (gọi trực tiếp bằng API chung, đăng nhập Google không chạy được ở test)
  await p.evaluate(() => { EP.popup.open({ tone: 'celebrate', title: 'Đã xuất bản!', body: 'x', actions: [{ label: 'Mở trang', primary: true }] }); });
  ok('API EP.popup.open trả Promise và hiện', (await p.locator(POP + '.is-celebrate').count()) === 1);
  await p.keyboard.press('Escape'); await p.waitForTimeout(400);

  // 6. Popup đăng ký trên landing (render công khai, không chế độ soạn)
  const lp = async (waitlist, vp) => {
    await p.setViewportSize(vp);
    await p.evaluate((wl) => {
      document.querySelectorAll('#lp-test').forEach(e => e.remove());
      const box = document.createElement('div'); box.id = 'lp-test'; box.style.cssText = 'position:fixed;inset:0;z-index:50;overflow:auto;background:#fff';
      document.body.appendChild(box);
      const st = JSON.parse(localStorage.getItem('ep_events')); const saved = st[Object.keys(st)[0]];
      saved.event.startAt = new Date(Date.now() + 5 * 86400000).toISOString();
      EP.landingRenderer.render(box, { event: saved.event, content: saved.content, now: () => new Date(), getCount: () => 10, editable: false,
        onRegister: () => ({ ok: true, waitlist: wl }) });
    }, waitlist);
    await p.fill('#lp-test #lp-name', 'Nguyễn Văn A'); await p.fill('#lp-test #lp-phone', '0912345678'); await p.fill('#lp-test #lp-email', 'a@example.com');
    await p.check('#lp-test input[name=consent]');
    await p.click('#lp-test .lp-submit'); await p.waitForSelector('dialog.lp-pop[open]');
  };
  await lp(false, { width: 1280, height: 860 });
  ok('landing: popup "Đăng ký thành công!"', /Đăng ký thành công/.test(await p.locator('dialog.lp-pop h2').innerText()));
  ok('landing: có tên sự kiện + ngày + nơi', (await p.locator('dialog.lp-pop .lp-pop-meta li').count()) === 2);
  await shot(p, 'popup-landing-desktop');
  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('dialog.lp-pop button:has-text("Thêm vào lịch")')]);
  const ics = fs.readFileSync(await dl.path(), 'utf8');
  ok('landing: tải được file .ics hợp lệ', /\.ics$/.test(dl.suggestedFilename()) && /BEGIN:VEVENT/.test(ics) && /DTSTART:\d{8}T\d{6}Z/.test(ics) && /SUMMARY:/.test(ics), ics.slice(0, 120));
  let li = true;
  for (let i = 0; i < 6; i++) { await p.keyboard.press('Tab'); li = li && await p.evaluate(() => !!document.activeElement.closest('dialog.lp-pop')); }
  ok('landing: focus bị giữ trong popup', li);
  await p.keyboard.press('Escape'); await p.waitForTimeout(200);
  ok('landing: Esc đóng popup', (await p.locator('dialog.lp-pop').count()) === 0);
  await lp(true, { width: 1280, height: 860 });
  ok('landing: danh sách chờ dùng biến thể riêng', /danh sách chờ/.test(await p.locator('dialog.lp-pop h2').innerText()) && (await p.locator('dialog.lp-pop.is-waitlist').count()) === 1);
  await p.keyboard.press('Escape');

  // 390px
  await lp(false, { width: 390, height: 844 });
  await shot(p, 'popup-landing-390');
  ok('390: landing popup không tràn ngang', await p.evaluate(() => { const c = document.querySelector('.lp-pop-card').getBoundingClientRect(); return c.left >= 0 && c.right <= innerWidth + 1 && document.documentElement.scrollWidth <= innerWidth; }));
  await p.keyboard.press('Escape');
  await p.evaluate(() => document.getElementById('lp-test').remove());
  await p.evaluate(() => { EP.popup.open({ tone: 'warn', title: 'Xoá sự kiện này?', body: 'Nội dung dài '.repeat(15), actions: [{ label: 'Huỷ' }, { label: 'Xoá sự kiện', danger: true }] }); });
  await p.waitForSelector(POP);
  await p.waitForTimeout(700);
  await shot(p, 'popup-confirm-390');
  ok('390: popup app dạng bottom sheet, không tràn ngang', await p.evaluate(() => { const c = document.querySelector('.ep-pop-card').getBoundingClientRect(); return Math.abs(c.bottom - innerHeight) < 2 && c.width >= innerWidth - 1 && document.documentElement.scrollWidth <= innerWidth; }));
  await p.keyboard.press('Escape'); await p.waitForTimeout(400);
  await p.evaluate(() => localStorage.removeItem('ep_pop_tpl_used'));
  await p.click('[data-tab="templates"]');
  await p.locator('.tpl-use-cta').first().click(); await p.waitForSelector(POP); await p.waitForTimeout(500);
  await shot(p, 'popup-template-390');
  ok('390: popup chọn mẫu không tràn ngang', await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await p.click(POP + ' button').catch(() => {});
  await p.evaluate(() => document.documentElement.classList.add('motion-off'));
  await p.evaluate(() => { EP.popup.open({ tone: 'celebrate', title: 'T', actions: [{ label: 'OK', primary: true }] }); });
  ok('motion-off: popup không animation', await p.evaluate(() => getComputedStyle(document.querySelector('.ep-pop-card')).animationName === 'none'));

  ok('không có lỗi trang', errs.length === 0, errs.slice(0, 3));
  await b.close();
  console.log(failed ? '\n' + failed + ' LỖI' : '\nALL OK');
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
