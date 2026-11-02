// Tab "Danh sách đăng ký" > Tóm tắt: 6 biểu đồ SVG, chuyển Tóm tắt/Danh sách, ô trống, cập nhật trực tiếp, không tràn ngang ở 390px
// Chạy: node tests/e2e-charts.cjs [thư-mục-ảnh]   (cần máy chủ tĩnh: python3 -m http.server <cổng>; đặt CHARTS_URL, mặc định http://localhost:8123/)
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const URL = process.env.CHARTS_URL || 'http://localhost:8123/';
const SP = process.argv[2] || require('os').tmpdir();
let failed = 0;
const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) failed++; };
const sum = a => a.reduce((s, x) => s + x, 0);

// 60 đăng ký: 6 ngày, nhiều khung giờ, trạng thái / chăm sóc / SĐT / email đa dạng
const PH = ['0961234567', '0981234567', '0351234567', '0911234567', '0881234567', '0931234567', '0901234567', '0921234567', '0991234567', '0291234567'];
const CARR = ['Viettel', 'Viettel', 'Viettel', 'Vinaphone', 'Vinaphone', 'Mobifone', 'Mobifone', 'Vietnamobile', 'Gmobile', 'Khác'];
const DOM = ['gmail.com', 'gmail.com', 'gmail.com', 'yahoo.com', 'outlook.com', 'fpt.vn', 'gmail.com', 'icloud.com', 'company.vn', 'hotmail.com', 'zoho.com'];
const LEADS = ['new', 'new', 'contacted', 'won', 'lost'];
const spec = [];
for (let i = 0; i < 60; i++) spec.push({ day: i < 6 ? i : (i < 50 ? (i * 7) % 5 : 5), hour: [9, 9, 10, 14, 20, 21, 9, 13][i % 8], status: i % 5 === 4 ? 'waitlist' : 'new', lead: LEADS[i % 5], phone: PH[i % 10], email: 'u' + i + '@' + DOM[i % 11] });
const count = (arr, f) => arr.reduce((m, x) => { const k = f(x); m[k] = (m[k] || 0) + 1; return m; }, {});

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1400, height: 900 } });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error' && !/favicon|Failed to load resource/.test(m.text())) errs.push(m.text()); });
  await p.goto(URL);
  await p.click('#btn-sample'); await p.click('#btn-generate'); await p.waitForTimeout(600);
  const id = await p.evaluate(() => JSON.parse(localStorage.getItem('ep_current_id')));
  const seed = (rows) => p.evaluate(([id, rows]) => {
    const base = new Date(); base.setHours(0, 0, 0, 0); base.setDate(base.getDate() - 5);
    localStorage.setItem('ep_regs_' + id, JSON.stringify(rows.map((r, i) => ({ id: 'r' + i, name: 'Khách ' + i, phone: r.phone, email: r.email, status: r.status, leadStatus: r.lead,
      createdAt: new Date(base.getFullYear(), base.getMonth(), base.getDate() + r.day, r.hour, 5).toISOString() }))));
  }, [id, rows]);
  const openAdmin = async () => { await p.evaluate(id => localStorage.setItem('ep_admin_event', JSON.stringify(id)), id); await p.reload(); await p.waitForTimeout(500); await p.click('[data-tab="admin"]'); await p.waitForTimeout(500); };
  const vals = sel => p.$$eval(sel, n => n.map(x => +x.dataset.v));
  await seed(spec); await p.reload(); await p.waitForTimeout(500); await openAdmin();

  const cards = await p.$$eval('#admin-summary .ch-card', c => c.map(x => x.dataset.chart));
  ok(cards.join() === 'daily,hours,status,lead,funnel,reach', '6 thẻ biểu đồ: ' + cards.join());
  ok(await p.isVisible('#admin-summary') && !(await p.isVisible('#admin-table')), 'mặc định hiện Tóm tắt, ẩn bảng');
  ok(await p.isVisible('#metric-grid'), 'lưới KPI vẫn hiện');
  for (const c of cards) {
    const lab = await p.$eval(`[data-chart=${c}] svg`, s => s.getAttribute('role') + '|' + !!s.getAttribute('aria-label') + '|' + !!s.querySelector('title')).catch(() => 'none');
    ok(lab === 'img|true|true', `${c}: svg role=img + aria-label + <title>`);
    ok(await p.locator(`[data-chart=${c}] details.ch-data`).count() >= 1, `${c}: có bảng số liệu <details>`);
    ok(((await p.textContent(`[data-chart=${c}] .ch-insight`)) || '').length > 10, `${c}: có câu nhận xét`);
  }
  const daily = await vals('[data-chart=daily] .ch-pt');
  const expDay = Array(6).fill(0); spec.forEach(r => expDay[r.day]++);
  ok(sum(daily) === 60 && daily.length === 6, 'theo ngày: tổng = 60, 6 ngày (' + daily.join(',') + ')');
  ok(JSON.stringify(daily) === JSON.stringify(expDay), 'theo ngày: từng ngày khớp');
  const ins = await p.textContent('[data-chart=daily] .ch-insight');
  ok(ins.includes('(' + Math.max(...expDay) + ' người)'), 'nhận xét ngày nhiều nhất: ' + ins);
  await p.check('[data-chart=daily] .ch-toggle input');
  const cum = await vals('[data-chart=daily] .ch-pt');
  ok(cum[cum.length - 1] === 60 && cum.every((v, i) => !i || v >= cum[i - 1]), 'cộng dồn: tăng dần, cuối = 60');
  await p.uncheck('[data-chart=daily] .ch-toggle input');

  const hrs = await vals('[data-chart=hours] .ch-bargrp');
  const expH = Array(24).fill(0); spec.forEach(r => expH[r.hour]++);
  ok(hrs.length === 24 && JSON.stringify(hrs) === JSON.stringify(expH), 'khung giờ: 24 cột, khớp (tổng ' + sum(hrs) + ')');
  ok(await p.locator('[data-chart=hours] .ch-bar').count() === expH.filter(Boolean).length, 'khung giờ: số cột có giá trị');

  const segs = await vals('[data-chart=status] .ch-seg');
  const nW = spec.filter(r => r.status === 'waitlist').length;
  ok(sum(segs) === 60 && segs.length === 2 && segs.includes(nW), 'donut trạng thái: tổng = 60 (' + segs.join('+') + ')');
  const lg = await p.textContent('[data-chart=status] .ch-legend');
  ok(lg.includes('Danh sách chờ') && lg.includes('Đã đăng ký') && lg.includes('%'), 'donut: chú thích có tên và %');

  const lead = await vals('[data-chart=lead] .ch-hrow');
  const expL = count(spec, r => r.lead);
  ok(lead.length === 4 && sum(lead) === 60 && lead[3] === expL.lost && lead[2] === expL.won, 'chăm sóc: 4 thanh, tổng 60 (' + lead.join(',') + ')');

  const fun = await vals('[data-chart=funnel] .ch-hrow');
  const confirmed = spec.filter(r => r.status === 'new').length;
  ok(fun.length === 1 && fun[0] === confirmed, 'phễu (chưa có lượt xem): chỉ bước đăng ký = ' + confirmed);
  ok((await p.textContent('[data-chart=funnel] .ch-insight')).includes('lượt xem'), 'phễu: nhận xét báo thiếu số liệu lượt xem');
  // phễu đủ 3 bước qua helper
  const f3 = await p.evaluate(() => { const d = document.createElement('div'); document.body.appendChild(d); EP.charts.horizontalBars(d, { items: [{ label: 'A', value: 100 }, { label: 'B', value: 40 }, { label: 'C', value: 10 }], scaleMax: 100, total: 100 }); const r = [...d.querySelectorAll('.ch-hbar')].map(x => +x.getAttribute('width')); d.remove(); return r; });
  ok(f3.length === 3 && f3[0] > f3[1] && f3[1] > f3[2], 'thanh phễu giảm dần theo giá trị');

  const car = await p.$$eval('[data-sub=carrier] .ch-hrow', n => Object.fromEntries(n.map(x => [x.dataset.tip.split(':')[0], +x.dataset.v])));
  const expC = count(spec, r => CARR[PH.indexOf(r.phone)]);
  ok(JSON.stringify(Object.keys(expC).sort().map(k => [k, expC[k]])) === JSON.stringify(Object.keys(car).sort().map(k => [k, car[k]])), 'nhà mạng khớp: ' + JSON.stringify(car));
  ok(sum(Object.values(car)) === 60, 'nhà mạng: tổng = 60');
  const dom = await p.$$eval('[data-sub=domain] .ch-hrow', n => n.map(x => [x.dataset.tip.split(':')[0], +x.dataset.v]));
  ok(sum(dom.map(d => d[1])) === 60 && dom[0][0] === 'gmail.com' && dom.length <= 6, 'tên miền: tổng 60, đầu bảng gmail.com, ≤ 6 dòng (' + dom.map(d => d.join('=')).join(',') + ')');
  ok(await p.evaluate(() => EP.charts.carrierOf('+84 98 123 4567') === 'Viettel' && EP.charts.carrierOf('0592223333') === 'Gmobile' && EP.charts.carrierOf('0123') === 'Khác'), 'carrierOf: +84, Gmobile, Khác');

  // tooltip khi rê chuột
  await p.locator('[data-chart=hours] .ch-bargrp').nth(9).hover(); await p.waitForTimeout(100);
  const tip = await p.textContent('[data-chart=hours] .ch-tip');
  ok(await p.isVisible('[data-chart=hours] .ch-tip') && tip.includes(String(expH[9])), 'tooltip hiện giá trị chính xác: ' + tip);

  // hoạt ảnh
  const an = await p.evaluate(() => ({ line: getComputedStyle(document.querySelector('.ch-line')).animationName, bar: getComputedStyle(document.querySelector('[data-chart=hours] .ch-bar')).animationName, hb: getComputedStyle(document.querySelector('.ch-hbar')).animationName, seg: getComputedStyle(document.querySelector('.ch-seg')).animationName }));
  ok(an.line === 'chDraw' && an.bar === 'chGrowY' && an.hb === 'chGrowX' && an.seg === 'chSweep', 'hoạt ảnh gắn đúng: ' + JSON.stringify(an));
  await p.evaluate(() => document.documentElement.classList.add('motion-off'));
  ok(await p.evaluate(() => getComputedStyle(document.querySelector('.ch-line')).animationName === 'none'), 'motion-off tắt hoạt ảnh');
  await p.evaluate(() => document.documentElement.classList.remove('motion-off'));
  await p.mouse.move(0, 0);
  await p.waitForTimeout(1500);
  await p.screenshot({ path: SP + '/charts-1400.png', fullPage: true });

  // chuyển sang Danh sách và quay lại
  await p.click('[data-admin-view=list]');
  ok(await p.isVisible('#admin-table') && !(await p.isVisible('#admin-summary')), 'bấm "Danh sách": hiện bảng, ẩn biểu đồ');
  ok(await p.locator('#admin-rows tr').count() === 60, 'bảng đủ 60 dòng');
  ok(await p.getAttribute('[data-admin-view=list]', 'aria-pressed') === 'true', 'aria-pressed cập nhật');
  // cập nhật trực tiếp: đổi chăm sóc 1 người sang "won"
  const before = (await vals('[data-chart=lead] .ch-hrow'))[2];
  await p.locator('#admin-rows .lead-select').first().selectOption('won');
  await p.waitForTimeout(300);
  await p.click('[data-admin-view=summary]');
  const after = (await vals('[data-chart=lead] .ch-hrow'))[2];
  ok(after === before + 1, `biểu đồ cập nhật khi đổi trạng thái chăm sóc (${before} -> ${after})`);

  // ô trống: sự kiện không có đăng ký
  await seed([]); await p.reload(); await p.waitForTimeout(500); await openAdmin();
  const emp = await p.locator('#admin-summary .ch-card .ch-empty').count();
  ok(emp >= 6, 'sự kiện 0 đăng ký: mọi biểu đồ có ô trống (' + emp + ')');
  ok(await p.locator('#admin-summary svg').count() === 0, 'không vẽ biểu đồ khi không có dữ liệu');

  // 390px
  await seed(spec); await p.setViewportSize({ width: 390, height: 844 }); await p.reload(); await p.waitForTimeout(500); await openAdmin(); await p.waitForTimeout(1500);
  const ov = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  ok(ov.sw <= ov.cw, `390px: không tràn ngang (${ov.sw} <= ${ov.cw})`);
  ok(await p.evaluate(() => getComputedStyle(document.querySelector('.ch-grid-wrap')).gridTemplateColumns.split(' ').length) === 1, '390px: 1 cột');
  await p.screenshot({ path: SP + '/charts-390.png', fullPage: true });

  ok(errs.length === 0, 'không có lỗi trang/console' + (errs.length ? ': ' + errs.join(' | ') : ''));
  await b.close();
  console.log(failed ? failed + ' FAILED' : 'ALL OK');
  process.exit(failed ? 1 : 0);
})();
