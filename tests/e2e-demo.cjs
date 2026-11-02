// Dữ liệu mẫu lần mở đầu. Chạy: python3 -m http.server <cổng> rồi node tests/e2e-demo.cjs <thư-mục-ảnh> [http://localhost:<cổng>/]
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const shots = process.argv[2] || '.';
const BASE = (process.argv[3] || 'http://localhost:8765/') + 'index.html';
let failed = 0;
const ok = (c, m) => { if (c) console.log('✓', m); else { failed++; console.log('✗', m); } };
const EXPECT = { ai: [105, 0], coffee: [64, 0], edu: [112, 0], beauty: [40, 14], wedding: [86, 0], finance: [118, 0] };
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1400, height: 900 } });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => m.type() === 'error' && !/fonts|net::|Failed to load/.test(m.text()) && errs.push(m.text()));
  p.on('dialog', d => d.accept());
  const cards = async () => { if (await p.isVisible('[data-tab="events"]')) { await p.click('[data-tab="events"]'); await p.waitForTimeout(300); } return p.$$eval('.event-card', l => l.length); };

  // Trình duyệt tự động không có ?demo=1 → không gieo
  await p.goto(BASE);
  ok(await p.evaluate(() => localStorage.getItem('ep_events')) === null, 'webdriver không có ?demo=1 → không gieo dữ liệu mẫu');

  // Lần đầu có ?demo=1
  await p.evaluate(() => localStorage.clear());
  await p.goto(BASE + '?demo=1');
  ok(await p.isVisible('#view-templates'), 'mở Thư viện mẫu đầu tiên'); await p.click('[data-tab="events"]'); await p.waitForTimeout(300);
  ok(await cards() === 6, 'danh sách có 6 sự kiện');
  ok(await p.isVisible('#demo-banner') && (await p.textContent('#demo-banner')).includes('dữ liệu mẫu'), 'banner dữ liệu mẫu hiện');
  ok(await p.isVisible('#demo-restore') && await p.isVisible('#demo-remove'), 'chân trang có Khôi phục / Xoá dữ liệu mẫu');
  await p.waitForTimeout(600);
  await p.screenshot({ path: shots + '/demo-events.png' });

  const data = await p.evaluate(() => {
    const ev = JSON.parse(localStorage.ep_events), out = {};
    Object.keys(ev).forEach(id => { out[id] = { s: ev[id], regs: JSON.parse(localStorage['ep_regs_' + id] || '[]'), m: JSON.parse(localStorage['ep_metrics_' + id] || 'null') }; });
    return { out, brands: JSON.parse(localStorage.ep_brands), cur: JSON.parse(localStorage.ep_current_id) };
  });
  const ids = Object.keys(data.out);
  ok(ids.length === 6 && ids.every(i => i.startsWith('demo_')), '6 sự kiện id demo_*');
  const now = Date.now(), vnPhone = /^0(3|5|7|8|9)\d{8}$/, mail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const LEAD = ['new', 'contacted', 'won', 'lost'];
  for (const k of Object.keys(EXPECT)) {
    const d = data.out['demo_evt_' + k];
    ok(!!d, 'có sự kiện ' + k);
    if (!d) continue;
    const regs = d.regs, e = d.s.event;
    const nNew = regs.filter(r => r.status === 'new').length, nWait = regs.filter(r => r.status === 'waitlist').length;
    ok(nNew === EXPECT[k][0] && nWait === EXPECT[k][1], k + ': ' + nNew + ' đã đăng ký, ' + nWait + ' chờ');
    ok(regs.every(r => vnPhone.test(r.phone) && mail.test(r.email) && LEAD.includes(r.leadStatus)), k + ': SĐT, email, leadStatus hợp lệ');
    ok(new Set(regs.map(r => r.phone)).size === regs.length && new Set(regs.map(r => r.email)).size === regs.length, k + ': không trùng SĐT/email');
    ok(regs.every(r => new Date(r.createdAt).getTime() <= now), k + ': thời gian đăng ký không ở tương lai');
    ok(regs.every(r => /\p{L}/u.test(r.name) && r.name.split(' ').length >= 2), k + ': họ tên đầy đủ');
    ok(d.m && d.m.views > d.m.ctaClicks && d.m.ctaClicks > nNew, k + ': views > bấm nút > đăng ký');
    ok(e.published === false && e.seo && e.seo.title && e.agenda.length >= 4 && d.s.content.benefits.length === 3, k + ': published=false, SEO, agenda ≥4, 3 lợi ích');
    // Ngày CỐ ĐỊNH: không phụ thuộc lần mở đầu; các sự kiện chưa diễn ra nằm sau 20/11/2026 (kỳ chấm 09-17/11)
    if (k === 'finance') ok(e.startAt === '2026-10-25T20:00', 'finance: đã diễn ra (cố định 25/10/2026)');
    else {
      ok(e.startAt >= '2026-11-27' && e.startAt <= '2026-12-31', k + ': ngày cố định ' + e.startAt);
      ok(!e.earlyBirdUntil || (e.earlyBirdUntil > '2026-11-20' && e.earlyBirdUntil < e.startAt), k + ': hạn ưu đãi sau 20/11 và trước ngày diễn ra');
    }
    if (k === 'coffee') ok(e.startAt === '2026-11-28T08:00', 'Mộc Coffee khai trương cố định 08:00 28/11/2026');
  }
  ok(Object.keys(data.brands).length === 3, '3 Brand DNA trong storage');
  ok(data.out.demo_evt_ai.s.event.brand && data.out.demo_evt_coffee.s.event.brandId === 'demo_brand_moc', 'sự kiện áp Brand DNA');

  // Tương phản màu thương hiệu
  const lum = h => { const c = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
  const cr = (a, c) => { const x = lum(a), y = lum(c); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  Object.values(data.brands).forEach(br => ok(cr(br.textColor, br.bgColor) >= 4.5 && cr('#ffffff', br.primary) >= 4.5, 'tương phản ' + br.name));

  // Mở từng sự kiện trong trình soạn
  for (const k of Object.keys(EXPECT)) {
    await p.click('[data-tab="events"]');
    const name = data.out['demo_evt_' + k].s.event.name;
    await p.locator('.event-card', { hasText: name }).getByText('Mở / sửa').click();
    await p.waitForSelector('.lp-headline');
    const h = await p.textContent('.lp-headline');
    ok(h && h.length > 20, k + ': trang hiển thị tiêu đề "' + h.slice(0, 40) + '…"');
    ok(await p.$$eval('.lp-agenda li', l => l.length) >= 4, k + ': agenda hiển thị');
    if (k === 'ai') { await p.evaluate(() => { document.getElementById('toast').hidden = true; }); await p.waitForTimeout(500); await p.screenshot({ path: shots + '/demo-landing.png' }); }
    await p.click('[data-tab="admin"]');
    await p.waitForTimeout(250);
    if (await p.isVisible('#btn-admin-back')) { await p.click('#btn-admin-back'); await p.waitForTimeout(200); }
    const pick = p.locator('.admin-pick[data-event-id="demo_evt_' + k + '"]');
    ok(await pick.count() === 1, k + ': màn chọn trang có sự kiện này');
    if (k === 'finance') await p.evaluate(() => { document.querySelector('details[data-group="ended"]').open = true; });
    await pick.click();
    await p.waitForTimeout(250);
    const rows = await p.$$eval('#admin-rows tr', l => l.length);
    ok(rows === EXPECT[k][0] + EXPECT[k][1], k + ': tab quản trị có ' + rows + ' dòng');
    const title = await p.textContent('#admin-title');
    ok(title.includes('(' + EXPECT[k][0] + ' người)'), k + ': tiêu đề "' + title.slice(-30) + '"');
    ok(await p.$$eval('#metric-grid .metric', l => l.length) >= 5, k + ': có số liệu phễu');
    if (k === 'ai') { await p.evaluate(() => { document.getElementById('toast').hidden = true; }); await p.waitForTimeout(800); await p.screenshot({ path: shots + '/demo-admin.png' }); }
  }

  // Brand
  await p.click('[data-tab="brand"]');
  ok(await p.$$eval('#brand-list .brand-item', l => l.length) === 3, 'tab Brand DNA có 3 thương hiệu');
  await p.screenshot({ path: shots + '/demo-brand.png' });

  // Tải lại không nhân đôi
  await p.reload();
  ok(await cards() === 6, 'tải lại vẫn 6 sự kiện (không nhân đôi)');
  ok(await p.evaluate(() => Object.keys(JSON.parse(localStorage.ep_brands)).length) === 3, 'tải lại vẫn 3 thương hiệu');

  // Thêm dữ liệu riêng, rồi Xoá dữ liệu mẫu
  await p.evaluate(() => {
    const ev = JSON.parse(localStorage.ep_events);
    ev.user_1 = { event: { id: 'user_1', name: 'Sự kiện của tôi', startAt: '2099-01-01T09:00', location: 'X', capacity: 10, speakers: [{ name: 'A', title: '' }], agenda: [{ time: '09:00', title: 'Mở đầu' }], templateId: 'tech' }, content: { headline: 'Tiêu đề', description: 'Mô tả', benefits: ['a', 'b', 'c'], source: 'manual' }, updatedAt: new Date().toISOString() };
    localStorage.ep_events = JSON.stringify(ev);
    const br = JSON.parse(localStorage.ep_brands); br.user_b = { id: 'user_b', name: 'Của tôi' }; localStorage.ep_brands = JSON.stringify(br);
    localStorage.ep_regs_user_1 = JSON.stringify([{ id: 'r1', name: 'Tôi', phone: '0912345678', email: 'a@gmail.com', status: 'new', createdAt: new Date().toISOString() }]);
  });
  await p.reload();
  ok(await cards() === 7, 'thêm 1 sự kiện riêng → 7');
  await p.click('#demo-remove');
  await p.waitForLoadState('load'); await p.waitForTimeout(800);
  ok(await cards() === 1, 'Xoá dữ liệu mẫu: chỉ còn sự kiện của người dùng');
  const left = await p.evaluate(() => ({ keys: Object.keys(localStorage).filter(k => k.includes('demo_evt') || k.includes('demo_reg')), brands: Object.keys(JSON.parse(localStorage.ep_brands)), regs: localStorage.ep_regs_user_1 !== null }));
  ok(left.keys.length === 0, 'không còn khoá demo trong localStorage');
  ok(left.brands.join() === 'user_b' && left.regs, 'giữ thương hiệu và đăng ký của người dùng');
  await p.reload();
  ok(await cards() === 1, 'tải lại sau khi xoá không gieo lại');

  // Khôi phục
  await p.click('#demo-restore');
  await p.waitForLoadState('load'); await p.waitForTimeout(800);
  ok(await cards() === 7, 'Khôi phục dữ liệu mẫu: 6 mẫu + 1 của người dùng');
  ok(await p.evaluate(() => localStorage.ep_regs_user_1 !== null && !!JSON.parse(localStorage.ep_events).user_1), 'dữ liệu người dùng không bị đè');

  // Nâng cấp bản mẫu cũ: chỉ thay mục demo_, giữ dữ liệu người dùng; không nâng cấp nếu đã xoá mẫu
  await p.evaluate(() => {
    const ev = JSON.parse(localStorage.ep_events);
    ev.demo_evt_coffee.event.startAt = '2026-01-01T08:00'; ev.demo_evt_coffee.content.headline = 'Khai trương Mộc Coffee – Trải nghiệm đẳng cấp';
    ev.user_1.content.headline = 'Tiêu đề của tôi';
    localStorage.ep_events = JSON.stringify(ev);
    localStorage.removeItem('ep_demo_version');
  });
  await p.goto(BASE);
  const up = await p.evaluate(() => { const ev = JSON.parse(localStorage.ep_events); return { start: ev.demo_evt_coffee.event.startAt, head: ev.demo_evt_coffee.content.headline, user: ev.user_1 && ev.user_1.content.headline, n: Object.keys(ev).length, v: localStorage.ep_demo_version }; });
  ok(up.start === '2026-11-28T08:00' && !/đẳng cấp/.test(up.head), 'demo cũ (thiếu version) được nâng cấp lên ngày/nội dung mới');
  ok(up.user === 'Tiêu đề của tôi' && up.n === 7 && up.v === '"3"' , 'nâng cấp không động vào sự kiện của người dùng, version = 3');
  await p.click('#demo-remove'); await p.waitForLoadState('load'); await p.waitForTimeout(500);
  await p.evaluate(() => localStorage.removeItem('ep_demo_version'));
  await p.goto(BASE);
  ok(await cards() === 1, 'đã xoá dữ liệu mẫu → không nâng cấp/gieo lại dù version cũ');

  // Đã có dữ liệu → không gieo khi mở lần đầu
  await p.evaluate(() => { const u = JSON.parse(localStorage.ep_events).user_1; localStorage.clear(); localStorage.ep_events = JSON.stringify({ user_1: u }); });
  await p.goto(BASE + '?demo=1');
  ok(await cards() === 1, 'đã có sự kiện riêng → không gieo dữ liệu mẫu');

  ok(errs.length === 0, 'không có lỗi JS' + (errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''));
  await b.close();
  console.log(failed ? failed + ' FAILED' : 'ALL OK');
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
