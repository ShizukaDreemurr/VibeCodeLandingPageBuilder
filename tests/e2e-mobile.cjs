// Giao diện di động (390 và 360px): không tràn ngang, nút trong màn hình, vùng chạm >=44px, inspector dạng bottom sheet, dải tab tự cuộn
// Chạy: node tests/e2e-mobile.cjs [url]   (mặc định http://localhost:8000/)
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const BASE = (process.argv[2] || 'http://localhost:8000/').replace(/\?.*$/, '');
let failed = 0;
const ok = (c, msg) => { if (c) console.log('  ok ', msg); else { failed++; console.log('  ✗  ' + msg); } };

(async () => {
  const b = await chromium.launch();
  for (const W of [390, 360]) {
    console.log('== ' + W + 'px ==');
    const ctx = await b.newContext({ viewport: { width: W, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    const p = await ctx.newPage(); const errs = [];
    p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(BASE + '?demo=1'); await p.waitForTimeout(800);

    // Hàm đo: cuộn ngang tài liệu + phần tử bị đẩy ra ngoài mép phải (bỏ qua vùng cuộn riêng và landing xem trước)
    const noOverflow = async (name) => {
      const r = await p.evaluate(() => {
        const bad = [];
        document.querySelectorAll('body *').forEach((e) => {
          if (e.closest('.landing, [hidden], .tabs, .tpl-chips, .ws-tabs, svg') || e.closest('dialog:not([open])')) return;
          let a = e.parentElement, scroller = false;
          while (a && a !== document.body) { const o = getComputedStyle(a).overflowX; if (o === 'auto' || o === 'scroll') { scroller = true; break; } a = a.parentElement; }
          if (scroller) return;
          const cs = getComputedStyle(e); if (cs.position === 'fixed' || cs.display === 'none') return;
          const r = e.getBoundingClientRect();
          if (r.width && r.right > innerWidth + 1 && !(e.closest('.preview-wrap') && e !== e.closest('.preview-wrap'))) bad.push((e.id || e.className || e.tagName) + ':' + Math.round(r.right));
        });
        return { sw: document.documentElement.scrollWidth, bw: document.body.scrollWidth, bad: bad.slice(0, 3) };
      });
      ok(r.sw <= W && r.bw <= W && !r.bad.length, name + ': không tràn ngang (scrollWidth ' + r.sw + (r.bad.length ? ', ' + r.bad.join(' | ') : '') + ')');
    };
    const inView = async (sel, name) => {
      const r = await p.locator(sel).first().boundingBox();
      ok(r && r.x >= -0.5 && r.x + r.width <= W + 0.5, name + ' nằm trong màn hình' + (r ? ' (x ' + Math.round(r.x) + '–' + Math.round(r.x + r.width) + ')' : ' (không thấy)'));
    };
    const tall = async (sel, name, min) => {
      const r = await p.locator(sel).first().boundingBox();
      ok(r && r.height >= (min || 44) - 0.5, name + ' cao ≥' + (min || 44) + 'px' + (r ? ' (' + Math.round(r.height) + ')' : ' (không thấy)'));
    };

    // Dải tab
    await p.waitForTimeout(300);
    ok(await p.evaluate(() => { const n = document.querySelector('.tabs'); return getComputedStyle(n).overflowX === 'auto' && n.scrollWidth > n.clientWidth; }), 'dải tab cuộn ngang được');
    ok(await p.evaluate(() => getComputedStyle(document.querySelector('.tabs')).scrollSnapType !== 'none'), 'dải tab có scroll-snap');
    for (const t of ['brand', 'admin', 'editor', 'templates', 'events', 'builder']) {
      await p.click('[data-tab="' + t + '"]'); await p.waitForTimeout(700);
      const vis = await p.evaluate((t) => { const a = document.querySelector('[data-tab="' + t + '"]').getBoundingClientRect(), n = document.querySelector('.tabs').getBoundingClientRect(); return a.left >= n.left - 1 && a.right <= n.right + 1; }, t);
      ok(vis, 'tab ' + t + ' nằm trọn trong dải sau khi chuyển');
    }
    await tall('[data-tab="editor"]', 'tab nav'); await tall('.brand', 'brand link'); await tall('#btn-auth', '#btn-auth');
    await tall('#btn-new', '#btn-new');

    // Mỗi tab
    await p.click('[data-tab="templates"]'); await p.waitForTimeout(500); await noOverflow('Thư viện mẫu');
    await p.click('[data-tab="events"]'); await p.waitForTimeout(500); await noOverflow('Sự kiện của tôi');
    await tall('.event-card .actions .btn', 'nút thẻ sự kiện');
    for (const t of await p.locator('.event-card .actions .btn').allTextContents()) { if (/Mở|Nhân bản|Xoá/.test(t)) ok(true, 'nút "' + t.trim() + '" có mặt'); }
    await p.click('[data-tab="builder"]'); await p.waitForTimeout(300); await noOverflow('Thông tin & nội dung');
    await tall('#btn-sample', '#btn-sample');
    // Toast không che ô nhập: nằm ở nửa trên màn hình
    await p.click('#btn-sample'); await p.waitForTimeout(300);
    await p.evaluate(() => { const t = document.querySelector('#toast'); t.textContent = 'Đã điền dữ liệu mẫu'; t.hidden = false; });
    const tb = await p.locator('#toast').boundingBox();
    ok(tb && tb.y < 100 && tb.x >= 0 && tb.x + tb.width <= W, 'toast ở mép trên, trong màn hình (y ' + Math.round(tb.y) + ')');
    await p.evaluate(() => { document.querySelector('#toast').hidden = true; });
    const fs = await p.evaluate(() => [...document.querySelectorAll('#view-builder input:not([type=checkbox]):not([type=radio]):not([type=file]):not([type=color]):not([type=range]), #view-builder select, #view-builder textarea')].filter(e => e.offsetParent).map(e => parseFloat(getComputedStyle(e).fontSize)).filter(f => f < 16).length);
    ok(fs === 0, 'ô nhập tab Thông tin có font ≥16px (iOS không phóng to)');
    await p.click('#btn-generate'); await p.waitForTimeout(800);

    await p.click('[data-tab="editor"]'); await p.waitForTimeout(700); await noOverflow('Thiết kế trang');
    for (const s of ['#btn-zoom-in', '#btn-zoom-out', '#zoom-select', '#btn-undo', '#btn-preview', '[data-device="mobile"]']) { await inView(s, s); await tall(s, s); }
    ok(await p.evaluate(() => { const s = document.querySelector('#zoom-select'); return s.value === 'fit'; }), 'zoom mặc định "Vừa khung"');
    const ph = await p.evaluate(() => { const l = document.querySelector('#landing').getBoundingClientRect(); return l.right <= innerWidth + 1; });
    ok(ph, 'bản xem trước vừa chiều ngang');
    // Panel xếp dọc dưới bản xem trước
    ok(await p.evaluate(() => document.querySelector('#ws').classList.contains('is-narrow')), 'workspace chuyển sang xếp dọc');

    // Inspector: bottom sheet
    await p.evaluate(() => window.scrollTo(0, 0));
    const el = p.locator('#landing .lp-cta').first();
    await el.scrollIntoViewIfNeeded(); await el.tap(); await p.waitForTimeout(500);
    ok(await p.isVisible('#inspector'), 'inspector hiện khi chạm phần tử');
    const ib = await p.locator('#inspector').boundingBox();
    ok(ib && Math.abs(ib.x) < 1 && Math.abs(ib.width - W) < 1.5, 'inspector rộng bằng màn hình (' + Math.round(ib.width) + ')');
    ok(ib && Math.abs(ib.y + ib.height - 844) < 2, 'inspector dính đáy màn hình');
    ok(ib && ib.height <= 844 * 0.5 + 2, 'inspector cao ≤50vh (' + Math.round(ib.height) + ')');
    const eb = await el.boundingBox();
    ok(eb && eb.y + eb.height <= ib.y + 2, 'phần tử đang chọn không bị inspector che');
    await tall('#inspector [aria-label="Đóng (Esc)"]', 'nút đóng inspector', 40);
    await p.tap('#inspector [aria-label="Đóng (Esc)"]'); await p.waitForTimeout(400);
    ok(!(await p.isVisible('#inspector')), 'nút đóng ẩn inspector');
    await noOverflow('Thiết kế trang (sau inspector)');

    await p.click('[data-tab="admin"]'); await p.waitForTimeout(500); await noOverflow('Danh sách đăng ký: chọn trang');
    const pk = p.locator('.admin-pick').first();
    if (await pk.count()) { await pk.click(); await p.waitForTimeout(1200); await noOverflow('Danh sách đăng ký: chi tiết'); }
    await p.click('[data-tab="brand"]'); await p.waitForTimeout(500); await noOverflow('Brand DNA');
    ok(await p.locator('#view-brand .ai-box, #view-brand [id*="brand-ai"], #view-brand').first().count() > 0, 'Brand DNA hiển thị');

    for (const d of ['#help-dialog', '#check-dialog', '#tpl-dialog']) {
      await p.evaluate((s) => document.querySelector(s).showModal(), d); await p.waitForTimeout(400);
      await noOverflow('hộp thoại ' + d);
      const bb = await p.locator(d).boundingBox();
      ok(bb && bb.x >= 0 && bb.x + bb.width <= W + 0.5, d + ' nằm trong màn hình');
      await p.evaluate((s) => document.querySelector(s).close(), d);
    }
    ok(errs.length === 0, 'không có lỗi trang' + (errs.length ? ': ' + errs[0] : ''));
    await ctx.close();
  }
  await b.close();
  console.log(failed ? failed + ' FAILED' : 'ALL OK');
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error('✗ ' + e.message); process.exit(1); });
