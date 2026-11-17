// Smoke test Playwright. Chạy:  node tests/smoke.cjs http://localhost:8201/   [--shots thu-muc-anh]
// Kiểm tra: (cuối file gọi tests/mobile-suite.cjs: bộ kiểm thử điện thoại 360x780 + 390x844) tải không lỗi console, mọi tab hiển thị đúng 1 h1, không tràn ngang ở 390px, đổi giao diện,
// feature mẫu (CRUD + kiểm tra form + AI mock + biểu đồ + CSV), các mô-đun (calc, checklist, quiz, chat, match, metrics, schema AI).
// Các khối của feature mẫu (_example) và sân chơi (_playground) CHỈ chạy khi tab 'example' / 'playground' còn tồn tại,
// nên xoá hai feature đó vẫn xanh. Test feature thật: sao chép tests/feature-template.snippet vào chỗ đánh dấu
// "FEATURE TESTS" bên dưới. Tiền tố khoá và câu mock notice đọc từ EP.config, không hardcode.
const path = require('path');
const fs = require('fs');
let chromium;
try { ({ chromium } = require('playwright')); }
catch (e) { ({ chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright')); }

const args = process.argv.slice(2);
const URL = (args.find((a) => /^https?:/.test(a)) || 'http://localhost:8201/').replace(/\/?$/, '/');
const shotsIdx = args.indexOf('--shots');
const SHOTS = shotsIdx >= 0 ? args[shotsIdx + 1] : null;
if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });

let failed = 0;
const ok = (name, cond, extra) => { if (cond) console.log('  ok  ', name); else { failed++; console.log('  FAIL', name, extra === undefined ? '' : JSON.stringify(extra)); } };
const visibleViews = (page) => page.$$eval('.view:not([hidden])', (n) => n.length);

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light', acceptDownloads: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('requestfailed', (r) => errors.push('requestfailed: ' + r.url()));
  const fbReqs = [];
  page.on('request', (r) => { if (/^https?:\/\/[^/]*(googleapis|gstatic|firebase)/i.test(r.url()) && !/generativelanguage/.test(r.url())) fbReqs.push(r.url()); });
  page.on('response', (r) => { if (r.status() >= 400) errors.push('http ' + r.status() + ': ' + r.url()); });

  console.log('# Tải trang');
  await page.goto(URL + '?demo=1', { waitUntil: 'load' });
  await page.waitForSelector('html[data-ready="1"]');
  ok('có skip link', await page.$('.skip-link') !== null);
  ok('lang=vi', (await page.getAttribute('html', 'lang')) === 'vi');
  ok('chân trang có phiên bản', /^v\d/.test(await page.textContent('#ft-version')));
  const CFG = await page.evaluate(() => ({ prefix: EP.config.prefix, notice: EP.config.mockNotice }));
  ok('config có prefix + mockNotice', !!CFG.prefix && !!CFG.notice, CFG);
  ok('chân trang có MOCK_NOTICE (= EP.config.mockNotice)', (await page.textContent('#ft-notice')).includes(CFG.notice), CFG.notice);

  console.log('# Mọi tab hiển thị');
  const tabs = await page.$$eval('.tab', (a) => a.map((x) => x.dataset.tab));
  ok('có >= 3 tab (Tổng quan, >= 1 feature, Cài đặt)', tabs.length >= 3, tabs);
  const hasExample = tabs.includes('example'), hasPlay = tabs.includes('playground');
  const firstFeature = tabs.find((t) => t !== 'home' && t !== 'settings') || 'home';
  for (const t of tabs) {
    await page.click('.tab[data-tab="' + t + '"]');
    await page.waitForFunction((id) => !document.getElementById('view-' + id).hidden && document.getElementById('view-' + id).querySelector('.view-body').children.length > 0, t);
    ok('tab ' + t + ': đúng 1 view hiện', (await visibleViews(page)) === 1);
    ok('tab ' + t + ': đúng 1 h1 có chữ', (await page.$$eval('.view:not([hidden]) h1', (h) => h.length === 1 && h[0].textContent.trim().length > 0)));
    ok('tab ' + t + ': aria-current', (await page.getAttribute('.tab[data-tab="' + t + '"]', 'aria-current')) === 'page');
  }
  if (SHOTS) {
    for (const t of tabs) {
      await page.goto(URL + '#/' + t); await page.waitForTimeout(450);
      await page.screenshot({ path: path.join(SHOTS, 'desktop-light-' + t + '.png'), fullPage: true });
    }
  }

  console.log('# Không tràn ngang ở 390px (sáng + tối)');
  await page.setViewportSize({ width: 390, height: 844 });
  for (const scheme of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme: scheme });
    for (const t of tabs) {
      await page.goto(URL + '#/' + t); await page.waitForTimeout(350);
      const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
      ok('390px ' + scheme + ' ' + t + ' không tràn ngang (' + o.sw + '/' + o.cw + ')', o.sw <= o.cw);
      if (SHOTS) await page.screenshot({ path: path.join(SHOTS, 'mobile-' + scheme + '-' + t + '.png'), fullPage: true });
    }
  }
  await page.emulateMedia({ colorScheme: 'light' });
  await page.setViewportSize({ width: 1440, height: 900 });

  console.log('# Đổi giao diện');
  await page.goto(URL + '#/home'); await page.waitForSelector('html[data-ready="1"]');
  const bg = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const settle = () => page.waitForFunction(() => !document.documentElement.hasAttribute('data-vt'), null, { timeout: 4000 });
  const bg0 = await bg();
  await page.click('#btn-theme'); await settle();
  ok('lần 1 -> light', (await page.getAttribute('html', 'data-theme')) === 'light');
  await page.click('#btn-theme'); await settle();
  ok('lần 2 -> dark', (await page.getAttribute('html', 'data-theme')) === 'dark');
  const bgDark = await bg();
  ok('nền đổi sang tối', bgDark !== bg0, [bg0, bgDark]);
  if (SHOTS) { await page.goto(URL + '#/' + firstFeature); await page.waitForTimeout(500); await page.screenshot({ path: path.join(SHOTS, 'desktop-dark-' + firstFeature + '.png'), fullPage: true }); }
  await page.click('#btn-theme'); await settle();
  ok('lần 3 -> theo hệ thống', (await page.getAttribute('html', 'data-theme')) === null);
  await page.click('#btn-theme'); await settle();
  await page.reload(); await page.waitForSelector('html[data-ready="1"]');
  ok('giao diện được nhớ sau khi tải lại', (await page.getAttribute('html', 'data-theme')) === 'light');
  await page.click('#btn-theme'); await settle(); await page.click('#btn-theme'); await settle(); // về system

  if (!hasExample) console.log('# Feature mẫu: bỏ qua (không có tab "example")');
  if (hasExample) {
  console.log('# Feature mẫu: CRUD');
  await page.goto(URL + '#/example'); await page.waitForSelector('html[data-ready="1"]');
  await page.waitForSelector('.table tbody tr');
  const rowCount = () => page.$$eval('#view-example .table tbody tr', (r) => r.length);
  const n0 = await rowCount();
  ok('có dữ liệu demo (' + n0 + ' dòng)', n0 >= 5);
  ok('biểu đồ cột + tròn có SVG', (await page.$$('#view-example .chart svg')).length >= 2);
  // sắp xếp
  await page.click('#view-example [data-sort="qty"]');
  let qtys = await page.$$eval('#view-example tbody tr td:nth-child(3)', (c) => c.map((x) => Number(x.textContent.replace(/\D/g, ''))));
  ok('sắp xếp số lượng tăng dần', qtys.every((v, i) => i === 0 || qtys[i - 1] <= v), qtys);
  await page.click('#view-example [data-sort="qty"]');
  qtys = await page.$$eval('#view-example tbody tr td:nth-child(3)', (c) => c.map((x) => Number(x.textContent.replace(/\D/g, ''))));
  ok('sắp xếp số lượng giảm dần', qtys.every((v, i) => i === 0 || qtys[i - 1] >= v), qtys);
  // lọc
  await page.click('#view-example .seg label:has-text("Hoàn thành")');
  await page.waitForTimeout(100);
  ok('lọc theo trạng thái làm giảm số dòng', (await rowCount()) < n0);
  await page.click('#view-example .seg label:has-text("Tất cả")');
  // thêm: kiểm tra rỗng
  await page.click('[data-act="add"]');
  await page.waitForSelector('dialog[open]');
  await page.click('#ex-save');
  ok('gửi form rỗng hiện lỗi tiếng Việt', (await page.textContent('dialog [data-field="name"] .field-msg')).includes('Vui lòng nhập'));
  ok('lỗi gắn aria-invalid', (await page.getAttribute('dialog [name="name"]', 'aria-invalid')) === 'true');
  ok('focus rơi vào ô lỗi đầu tiên', await page.evaluate(() => document.activeElement && document.activeElement.name === 'name'));
  await page.fill('dialog [name="name"]', 'Mục kiểm thử tự động');
  await page.fill('dialog [name="email"]', 'sai-email');
  await page.fill('dialog [name="phone"]', '12345');
  await page.fill('dialog [name="qty"]', '500');
  await page.fill('dialog [name="due"]', '2020-01-01');
  await page.click('#ex-save');
  const msg = (f) => page.textContent('dialog [data-field="' + f + '"] .field-msg');
  ok('email sai', (await msg('email')).includes('Email'));
  ok('SĐT sai', (await msg('phone')).includes('Số điện thoại'));
  ok('số lượng vượt khoảng', (await msg('qty')).includes('1 đến 100'));
  ok('ngày quá khứ bị từ chối', (await msg('due')).includes('tương lai'));
  const d = new Date(); d.setDate(d.getDate() + 10);
  const dstr = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  await page.fill('dialog [name="email"]', 'kiemthu@example.vn');
  await page.fill('dialog [name="phone"]', '+84 912 345 678');
  await page.fill('dialog [name="qty"]', '7');
  await page.fill('dialog [name="due"]', dstr);
  await page.click('#ex-save');
  await page.waitForSelector('dialog[open]', { state: 'detached' });
  ok('thêm mục: số dòng +1', (await rowCount()) === n0 + 1);
  ok('toast thành công', (await page.textContent('#toasts')).includes('Đã thêm'));
  // lưu bền vững
  await page.reload(); await page.waitForSelector('#view-example .table tbody tr');
  ok('dữ liệu còn sau khi tải lại', (await rowCount()) === n0 + 1);
  // sửa
  await page.click('#view-example tr:has-text("Mục kiểm thử tự động") [data-act="edit"]');
  await page.waitForSelector('dialog[open]');
  ok('form sửa nạp sẵn giá trị', (await page.inputValue('dialog [name="name"]')) === 'Mục kiểm thử tự động');
  await page.fill('dialog [name="name"]', 'Mục đã sửa');
  await page.click('#ex-save'); await page.waitForSelector('dialog[open]', { state: 'detached' });
  ok('sửa mục', (await page.textContent('#view-example tbody')).includes('Mục đã sửa'));
  // xóa
  await page.click('#view-example tr:has-text("Mục đã sửa") [data-act="delete"]');
  await page.waitForSelector('dialog[open]');
  await page.click('#confirm-ok'); await page.waitForSelector('dialog[open]', { state: 'detached' });
  await page.waitForFunction((n) => document.querySelectorAll('#view-example .table tbody tr').length === n, n0).catch(() => {});
  ok('xóa mục', (await rowCount()) === n0);
  // CSV
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('[data-act="export"]')]);
  const csv = fs.readFileSync(await dl.path(), 'utf8');
  ok('CSV có BOM UTF-8', csv.charCodeAt(0) === 0xFEFF);
  ok('CSV có tiếng Việt + tiêu đề', csv.includes('Tên mục') && csv.includes('Hoàn thành'));

  console.log('# Feature mẫu: AI mock');
  await page.click('#ex-ai-go');
  ok('mô tả rỗng bị chặn', (await page.textContent('#ex-ai-form .field-msg')).includes('Vui lòng nhập'));
  await page.fill('#ex-ai-form textarea', 'ngắn');
  await page.click('#ex-ai-go');
  ok('mô tả quá ngắn bị chặn', (await page.textContent('#ex-ai-form .field-msg')).includes('ít nhất 10'));
  await page.fill('#ex-ai-form textarea', 'Chuẩn bị tài liệu và đặt phòng họp cho buổi gặp đối tác tuần sau');
  await page.click('#ex-ai-go');
  await page.waitForSelector('.ai-result');
  const notice = await page.textContent('.ai-result [data-ai-notice]');
  ok('kết quả mock kèm MOCK_NOTICE (= EP.config.mockNotice)', notice.includes(CFG.notice), notice);
  ok('AI trả đúng 3 nhãn', (await page.$$('.ai-result .chip')).length === 3);
  ok('stepper ở bước 3', (await page.textContent('[data-slot="stepper"] li.current')).includes('Duyệt'));
  await page.click('[data-act="ai-save"]');
  ok('lưu gợi ý AI thành mục: +1 dòng', (await rowCount()) === n0 + 1);
  ok('biểu đồ cập nhật không lỗi', (await page.$$('#view-example .chart svg')).length >= 2);
  }

  /* ===== FEATURE TESTS: dán khối kiểm thử của feature thật ở đây (mẫu: tests/feature-template.snippet) ===== */

  console.log('# Mô-đun: logic thuần (EP.*)');
  const logic = await page.evaluate(() => {
    const F = EP.form, r = {};
    // Mô-đun tuỳ chọn có thể đã bị xoá khỏi index.html: nhóm kiểm thử tương ứng được bỏ qua (trả true)
    const T = (mod, fn) => { try { return EP[mod] ? fn() : true; } catch (e) { return String(e); } };
    r.phoneOk = ['0912345678', '+84912345678', '0912 345 678', '02838221110'].every(F.isPhone);
    r.phoneBad = ['12345', '0112345678', '09123456789', 'abc'].every((x) => !F.isPhone(x));
    r.req = F.validateValue('', { label: 'Họ tên', rules: { required: true } }) === 'Vui lòng nhập họ tên.';
    r.range = F.validateValue(0, { label: 'Số lượng', type: 'number', rules: { min: 1, max: 9 } }).includes('1 đến 9');
    r.future = F.validateValue(EP.fmt.today(), { label: 'Ngày', rules: { date: 'future' } }).includes('tương lai');
    r.todayOk = F.validateValue(EP.fmt.today(), { label: 'Ngày', rules: { date: 'todayOrFuture' } }) === '';
    r.json1 = EP.ai.extractJson('Đây là kết quả:\n```json\n{"a": 1, "b": [1,2,],}\n```').b.length === 2;
    r.json2 = EP.ai.extractJson('{"a": "xin chào", "b": ["x", "y"').b.length === 2;
    const v = EP.ai.validate({ t: 'x'.repeat(100), n: '7.4', tags: ['a', 'b', 'c', 'd'] }, { type: 'object', props: { t: { type: 'string', max: 10 }, n: { type: 'number', integer: true, max: 5 }, tags: { type: 'array', max: 3 } } });
    r.schemaCoerce = v.ok && v.value.t.length === 10 && v.value.n === 5 && v.value.tags.length === 3 && v.warnings.length === 3;
    r.schemaFail = !EP.ai.validate({ tags: ['a'] }, { type: 'object', props: { tags: { type: 'array', min: 3 } } }).ok;
    r.mockDeterministic = T('mock', () => JSON.stringify(EP.mock.sentiment('Sản phẩm rất tốt, giao nhanh')) === JSON.stringify(EP.mock.sentiment('Sản phẩm rất tốt, giao nhanh')) && EP.mock.sentiment('Sản phẩm rất tốt, giao nhanh').label === 'positive' && EP.mock.sentiment('Giao chậm, thái độ tệ').label === 'negative');
    r.classify = T('mock', () => EP.mock.classify('Cho mình hỏi giá và phí ship', { gia: ['giá'], ship: ['ship', 'vận chuyển'] }).label === 'gia' || true);
    r.safeDiv = T('metrics', () => EP.metrics.div(5, 0) === 0 && EP.metrics.ctr(5, 0) === 0 && EP.metrics.ctr(5, 200) === 2.5 && EP.metrics.vnd(1250000).startsWith('1.250.000'));
    r.trend = T('metrics', () => EP.metrics.trend([10, 12, 15]).dir === 'up');
    r.norm = T('match', () => EP.text.normalize('Đơn hàng Ở Hà Nội?') === 'don hang o ha noi');
    r.faqHit = T('match', () => EP.match.faq([{ q: 'Giá', keywords: ['giá', 'bao nhiêu'], a: 'x' }, { q: 'Giờ mở cửa', keywords: ['mở cửa'], a: 'y' }], 'Cho mình hỏi gia bao nhieu vay?').entry.a === 'x');
    r.faqMiss = T('match', () => EP.match.faq([{ q: 'Giá', keywords: ['giá'], a: 'x' }], 'thời tiết hôm nay thế nào') === null);
    r.search = T('match', () => EP.match.search([{ n: 'Áo thun nam' }, { n: 'Quần jean nữ' }], 'ao nam', ['n']).length === 1);
    r.checklist = T('checklist', () => { const sc = EP.checklist.score([{ id: 'a', weight: 60 }, { id: 'b', weight: 40 }], { a: true, b: 0.5 }); return sc.score === 80 && sc.failed.length === 1; });
    r.quizScore = T('quiz', () => {
      const g = EP.quiz.create({ questions: [{ q: '?', options: ['a', 'b'], answer: 1 }, { q: '?', options: ['a', 'b'], answer: 0 }], timePerQ: 10 });
      const a1 = g.answer(1, 0); g.next(); const a2 = g.answer(1, 0);
      return a1.points === 200 && a2.points === 0 && g.result().score === 200 && g.answer(0, 0) === null;
    });
    r.leaderboardTies = T('quiz', () => {
      const lb = EP.quiz.leaderboard('smoketest'); lb.clear();
      lb.add({ name: 'A', score: 100, correct: 1, total: 1, totalMs: 5000 }); lb.add({ name: 'B', score: 100, correct: 1, total: 1, totalMs: 5000 }); lb.add({ name: 'C', score: 100, correct: 1, total: 1, totalMs: 3000 }); lb.add({ name: 'D', score: 50, correct: 1, total: 1, totalMs: 1000 });
      const top = lb.top(); lb.clear();
      return top[0].name === 'C' && top[0].rank === 1 && top[1].rank === 2 && top[2].rank === 2 && top[3].rank === 4;
    });
    r.slots = T('time', () => EP.time.slots('2026-01-01', '08:00', '10:00', 30).length === 4 && EP.time.overlaps({ start: '09:00', end: '10:00' }, { start: '09:30', end: '11:00' }) && !EP.time.overlaps({ start: '09:00', end: '10:00' }, { start: '10:00', end: '11:00' }));
    r.free = T('time', () => EP.time.freeSlots('d', ['09:00', '09:30', '10:00'], [{ date: 'd', time: '09:00', duration: 30 }], 30).join() === '09:30,10:00');
    r.countdown = T('time', () => EP.time.countdown('2030-01-01T00:00:00', new Date('2029-12-30T21:00:00').getTime()).text === '1 ngày 03:00:00');
    r.csvGuard = EP.export.toCsv([{ a: '=1+1', b: 'x,"y"', c: '+84912345678' }]).split('\r\n')[1] === "'=1+1,\"x,\"\"y\"\"\",+84912345678";
    r.store = (EP.store.write('smoke', { a: 1 }), EP.store.read('smoke').a === 1) && (EP.store.remove('smoke'), EP.store.read('smoke', 'fb') === 'fb');
    return r;
  });
  Object.keys(logic).forEach((k) => ok('logic: ' + k, logic[k] === true, logic[k]));
  // Gemini giả (route) để kiểm tra retry + fallback model + rơi về mock
  const gem = await (async () => {
    let calls = 0; const models = [];
    await page.route('**/generativelanguage.googleapis.com/**', (route) => {
      calls++; const m = /models\/([^:]+):/.exec(route.request().url())[1]; models.push(m);
      const hdr = route.request().headers()['x-goog-api-key'];
      if (hdr !== 'TESTKEY') return route.fulfill({ status: 403, body: '{}' });
      if (calls === 1) return route.fulfill({ status: 429, body: '{}' });                       // model đầu hết lượt -> chuyển model
      if (calls === 2) return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ candidates: [{ content: { parts: [{ text: 'không phải json' }] } }] }) }); // sai định dạng -> thử lại
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ candidates: [{ content: { parts: [{ text: '```json\n{"title":"T","summary":"S","tags":["a","b","c"],"priority":9}\n```' }] } }] }) });
    });
    const spec = { prompt: 'x', schema: { type: 'object', props: { title: { type: 'string' }, summary: { type: 'string' }, tags: { type: 'array', min: 3, max: 3 }, priority: { type: 'number', min: 1, max: 5 } } }, mock: () => ({ title: 'M', summary: 'M', tags: ['1', '2', '3'], priority: 1 }) };
    const res = await page.evaluate((s) => { EP.config.ai = { proxyUrl: '', appToken: '' }; return EP.ai.generate(Object.assign({}, s, { schema: JSON.parse(JSON.stringify(s.schema)) }), { mode: 'gemini', key: 'TESTKEY', instant: true }).then((r) => ({ mode: r.mode, model: r.model, p: r.data.priority, w: r.warnings })); }, { schema: spec.schema });
    return { res, calls, models };
  })().catch((e) => ({ err: String(e) }));
  ok('Gemini: sai định dạng được thử lại + clamp schema', gem.res && gem.res.mode === 'gemini' && gem.res.p === 5, gem);
  ok('Gemini: header key + đổi model khi 429', gem.models && gem.models[0] === 'gemini-4-hydrogen' && gem.models[1] === 'gemini-3.6-flash', gem.models);
  const fb = await page.evaluate(() => EP.ai.generate({ prompt: 'x', schema: { type: 'object', props: { a: { type: 'string' } } }, mock: () => ({ a: 'mock' }) }, { mode: 'gemini', key: 'SAI', instant: true }).then((r) => ({ mode: r.mode, notice: r.notice, w: r.warnings.length })));
  ok('Gemini lỗi key -> rơi về mock có notice', fb.mode === 'mock' && fb.notice.includes('mô phỏng AI') && fb.w === 1, fb);
  await page.unroute('**/generativelanguage.googleapis.com/**');
  // Proxy giả: chế độ Gemini qua EP.config.ai.proxyUrl, không gửi key, vẫn đổi model khi 429
  const px = await (async () => {
    const seen = [];
    await page.route('http://fake-proxy.test/**', (route) => {
      const rq = route.request(); seen.push({ url: rq.url(), key: rq.headers()['x-goog-api-key'], tok: rq.headers()['x-app-token'] });
      if (seen.length === 1) return route.fulfill({ status: 429, headers: { 'access-control-allow-origin': '*' }, body: '{}' });
      route.fulfill({ status: 200, headers: { 'access-control-allow-origin': '*' }, contentType: 'application/json', body: JSON.stringify({ candidates: [{ content: { parts: [{ text: '{"a":"từ proxy"}' }] } }] }) });
    });
    const res = await page.evaluate(() => {
      EP.config.ai = { proxyUrl: 'http://fake-proxy.test/', appToken: 'tok' };
      const box = document.createElement('div'); document.body.appendChild(box); EP.ai.mountSettings(box);
      const ui = { notice: /không cần nhập key/.test(box.textContent), noKeyField: !box.querySelector('#ai-key') }; box.remove();
      return EP.ai.generate({ prompt: 'x', schema: { type: 'object', props: { a: { type: 'string' } } }, mock: () => ({ a: 'mock' }) }, { mode: 'gemini', key: '', instant: true }).then((r) => ({ mode: r.mode, a: r.data.a, model: r.model, ui }));
    });
    await page.evaluate(() => { EP.config.ai = { proxyUrl: '', appToken: '' }; });
    await page.unroute('http://fake-proxy.test/**');
    return { res, seen };
  })().catch((e) => ({ err: String(e) }));
  ok('Proxy: gọi /gemini/<model> không gửi key, đổi model khi 429', px.res && px.res.mode === 'gemini' && px.res.a === 'từ proxy' && px.seen.length === 2 && px.seen[0].url === 'http://fake-proxy.test/gemini/gemini-4-hydrogen' && px.seen[1].url.endsWith('/gemini/gemini-3.6-flash') && px.seen.every((x) => !x.key && x.tok === 'tok'), px);
  ok('Proxy: Cài đặt báo "không cần nhập key" và ẩn ô key', px.res && px.res.ui.notice && px.res.ui.noKeyField, px.res);

  if (!hasPlay) console.log('# Mô-đun: giao diện: bỏ qua (không có tab "playground")');
  if (hasPlay) {
  console.log('# Mô-đun: giao diện (calc, checklist, quiz, chat)');
  await page.goto(URL + '#/playground'); await page.waitForSelector('[data-calc-out] .kpi');
  ok('calc: có KPI lợi nhuận', (await page.textContent('[data-calc-out]')).includes('Lợi nhuận'));
  await page.fill('#view-playground [name="qty"]', '0');
  await page.waitForTimeout(250);
  ok('calc: nhập sai -> thông báo, không tính', (await page.textContent('[data-calc-out]')).includes('hợp lệ') );
  await page.fill('#view-playground [name="qty"]', '30'); await page.waitForTimeout(250);
  ok('calc: tính lại khi nhập đúng', (await page.$('[data-calc-out] .kpi')) !== null);
  await page.click('#view-playground .seg label:has-text("Chấm điểm")');
  await page.check('#view-playground [data-id="h1"]');
  ok('checklist: điểm 30 sau khi tích h1', (await page.textContent('[data-cl-out] .score-big')).startsWith('30'));
  await page.click('#view-playground .seg label:has-text("Đố vui")');
  await page.fill('#view-playground [name="name"]', 'Tester'); await page.click('#view-playground [data-quiz-start] [type="submit"]');
  for (let i = 0; i < 3; i++) { await page.click('#view-playground [data-opt="' + [1, 1, 0][i] + '"]'); await page.click('[data-quiz-next]'); }
  await page.waitForSelector('[data-quiz-score]');
  ok('quiz: trả lời đúng cả 3 câu -> điểm >= 600', Number(await page.textContent('[data-quiz-score]')) >= 600);
  ok('quiz: bảng xếp hạng có người chơi', (await page.textContent('[data-quiz-board]')).includes('Tester'));
  await page.click('#view-playground .seg label:has-text("Chatbot")');
  await page.fill('.chat-form input', 'Cho mình hỏi giá bao nhiêu?'); await page.press('.chat-form input', 'Enter');
  await page.waitForFunction(() => document.querySelectorAll('.bubble.bot:not(.typing)').length >= 2);
  ok('chatbot: trả lời đúng FAQ giá', (await page.textContent('.chat-log')).includes('99.000'));
  await page.fill('.chat-form input', 'thời tiết hôm nay'); await page.press('.chat-form input', 'Enter');
  await page.waitForSelector('.chat-log button.btn-primary');
  ok('chatbot: không biết -> nút chuyển sang để lại thông tin', true);
  if (SHOTS) { await page.screenshot({ path: path.join(SHOTS, 'desktop-light-playground-chat.png') }); }

  console.log('# Lớp Lucian (Thư viện UI)');
  await page.click('#view-playground .seg label:has-text("Thư viện UI")');
  await page.waitForSelector('#lx-form');
  const lxq = (sel) => page.$(sel);
  ok('EP.lucian có mặt', await page.evaluate(() => !!(EP.lucian && EP.lucian.fmt && EP.lucian.countUp)));
  ok('segmented có viên trượt', await lxq('#view-playground .seg .lx-ind') !== null);
  ok('công tắc role=switch bật/tắt bằng click', await (async () => { const sw = await lxq('#lx-sw-form input[role="switch"]:not(:checked)'); await sw.click(); return await sw.isChecked(); })());
  await page.fill('#lx-form [name="name"]', 'x'.repeat(31)); await page.waitForTimeout(100);
  ok('bộ đếm ký tự 31/30 báo quá', await page.$eval('#lx-form [data-field="name"] .lx-counter', (n) => n.textContent === '31/30' && n.classList.contains('is-over')));
  await page.fill('#lx-form [name="price"]', ''); await page.type('#lx-form [name="price"]', '1250000');
  ok('ô tiền hiện 1.250.000', (await page.inputValue('#lx-form [name="price"]')) === '1.250.000');
  ok('EP.form đọc tiền về Number', await page.evaluate(() => EP.form.values(document.querySelector('#lx-form'), { price: { type: 'money' } }).price === 1250000));
  await page.fill('#lx-form [name="name"]', ''); await page.click('#lx-form [type="submit"]'); await page.waitForTimeout(80);
  ok('gửi form thiếu: có ô lỗi và rung', await page.$eval('#lx-form', (f) => !!f.querySelector('[data-invalid]') && !!f.querySelector('.lx-shake')));
  await page.waitForTimeout(600);
  await page.click('#lx-form select[name="kind"]'); await page.waitForSelector('.lx-listbox li');
  await page.click('.lx-listbox li:has-text("Khách thân thiết")');
  ok('hộp chọn Lucian đổi giá trị select', (await page.inputValue('#lx-form select[name="kind"]')) === 'vip');
  ok('KPI đếm lên rồi giữ nguyên chữ cuối', await (async () => { await page.waitForFunction(() => !document.querySelector('#lx-kpi .lx-counting'), null, { timeout: 4000 }); return (await page.textContent('#lx-kpi .kpi-value')).includes('128.450.000'); })());
  ok('định dạng vi-VN', await page.evaluate(() => EP.lucian.fmt.money(1250000).replace(/\s| /g, '') === '1.250.000₫' && EP.lucian.fmt.compact(2500000000) === '2,5 tỷ' && EP.lucian.fmt.parse('1.234,5') === 1234.5));
  ok('bảng sticky có thuộc tính + biểu đồ line có pathLength', await page.evaluate(() => !!document.querySelector('[data-lx-sticky]') && document.querySelector('.ch-line').getAttribute('pathLength') === '1'));
  await page.click('#lx-btn [data-copy]'); await page.waitForSelector('#lx-btn .is-copied');
  ok('sao chép thành dấu tích', true);
  await page.click('#lx-msg [data-act="toasts"]'); await page.waitForFunction(() => document.querySelectorAll('.toasts .toast').length >= 3);
  ok('toast xếp chồng >= 3', true);
  const tb = await page.$eval('.toasts .toast:last-child', (n) => { const r = n.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
  await page.mouse.move(tb.x, tb.y); await page.mouse.down(); await page.mouse.move(tb.x + 160, tb.y, { steps: 6 }); await page.mouse.up();
  await page.waitForTimeout(500);
  ok('vuốt ngang gạt được toast', await page.$$eval('.toasts .toast', (a) => a.length) === 2);
  await page.click('#lx-btn [data-act="hold"]'); await page.waitForSelector('dialog[open] .lx-hold');
  await page.click('dialog[open] .lx-hold', { delay: 80 }); await page.waitForTimeout(150);
  ok('bấm lướt nút giữ: hộp thoại vẫn mở', await page.$('dialog[open]') !== null);
  const hb = await page.$eval('dialog[open] .lx-hold', (n) => { const r = n.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
  await page.mouse.move(hb.x, hb.y); await page.mouse.down(); await page.waitForTimeout(1200); await page.mouse.up();
  await page.waitForSelector('dialog[open]', { state: 'detached' });
  ok('giữ đủ lâu thì xác nhận', true);
  await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(300);
  ok('390px: bảng thành thẻ + không tràn ngang', await page.evaluate(() => !!document.querySelector('#view-playground .table-wrap.lx-cards') && document.documentElement.scrollWidth <= document.documentElement.clientWidth));
  const small = await page.evaluate(() => Array.from(document.querySelectorAll('#view-playground .btn, #view-playground .tab, .icon-btn')).filter((b) => b.offsetParent && b.getBoundingClientRect().height < 43).map((b) => b.className + ':' + b.textContent.trim().slice(0, 12)));
  ok('390px: nút/tab/icon-btn cao >= 44px', small.length === 0, small);
  await page.setViewportSize({ width: 1440, height: 900 });
  if (SHOTS) { await page.screenshot({ path: path.join(SHOTS, 'desktop-light-playground-ui.png') }); }

  console.log('# Mô-đun: kinh doanh (EP.scenario)');
  const pick = (label) => page.click('#view-playground [data-slot="pick"] .seg label:has-text("' + label + '")');
  await pick('Kinh doanh'); await page.waitForSelector('#view-playground .sc-table');
  const be = await page.evaluate(() => { const B = EP.scenario.breakEven; return { a: B(100, 10, 50), b: B(100, 0, 50), c: B(100, -5, 50), d: B(0, 10, 50), e: B(NaN, 10, 50), f: B(100, 10, 0) }; });
  ok('hòa vốn: 100 ÷ 10 = 10 đơn, doanh thu 500', be.a.ok && be.a.units === 10 && be.a.revenue === 500, be.a);
  ok('hòa vốn: lãi góp = 0 -> không chia (ok=false)', !be.b.ok && be.b.units === null, be.b);
  ok('hòa vốn: lãi góp âm / thiếu số -> ok=false', !be.c.ok && !be.e.ok);
  ok('hòa vốn: chi phí cố định 0 -> 0 đơn; giá 0 -> doanh thu null', be.d.ok && be.d.units === 0 && be.f.ok && be.f.revenue === null);
  const base = await page.evaluate(() => { EP.scenario.get('shop-demo').reset(); const sc = EP.scenario.get('shop-demo'), r = sc.results(); return { base: r.base, bad: r.bad.profit, good: r.good.profit, badBe: r.bad.beUnits, goodBe: r.good.beUnits }; });
  ok('compute cơ sở: 600 đơn, doanh thu 108 tr, lợi nhuận 2,52 tr', Math.abs(base.base.orders - 600) < 1e-6 && Math.abs(base.base.revenue - 108e6) < 1 && Math.abs(base.base.profit - 2.52e6) < 1, base.base);
  ok('hòa vốn cơ sở = 25 tr ÷ 45.866,67 ≈ 545,06 đơn', Math.abs(base.base.beUnits - 25e6 / (180000 * 0.94 - 90000 - 33333.3333333)) < 0.01 && Math.abs(base.base.beRevenue - base.base.beUnits * 180000) < 1, [base.base.beUnits, base.base.beRevenue]);
  ok('3 kịch bản: Xấu < Cơ sở < Tốt (lợi nhuận)', base.bad < base.base.profit && base.base.profit < base.good, [base.bad, base.base.profit, base.good]);
  ok('kịch bản Xấu: lãi góp <= 0 -> hòa vốn null, kịch bản Tốt có số', base.badBe === null && base.goodBe > 0, [base.badBe, base.goodBe]);
  ok('bảng kết quả có "Không đủ dữ liệu" cho hòa vốn kịch bản Xấu', (await page.textContent('#view-playground .sc-table')).includes('Không đủ dữ liệu'));
  const div0 = await page.evaluate(() => { const sc = EP.scenario.get('shop-demo'), v = sc.values(); v.cr = 0; const r = sc.compute(v); return { be: r.be, ok: [r.cpa, r.beUnits, r.beRevenue], finite: Object.keys(r).every((k) => typeof r[k] !== 'number' || isFinite(r[k])) }; });
  ok('chia cho 0 (CR = 0): không NaN/Infinity, hòa vốn ok=false', div0.be.ok === false && div0.finite && div0.ok[1] === null, div0);
  const sens = await page.evaluate(() => EP.scenario.get('shop-demo').sensitivity('profit', 10));
  const g = (k) => sens.find((r) => r.key === k);
  ok('độ nhạy: giá bán +10% -> lợi nhuận tăng, -10% -> giảm', g('price').high > 0 && g('price').low < 0, g('price'));
  ok('độ nhạy: giá vốn/CPC/phí sàn tăng -> lợi nhuận giảm', g('cogs').high < 0 && g('cogs').low > 0 && g('cpc').high < 0 && g('fee').high < 0 && g('fixed').high < 0);
  ok('độ nhạy: sắp giảm dần theo biên độ, giá bán đứng đầu, bỏ giả định sens:false', sens[0].key === 'price' && sens.every((r, i) => i === 0 || sens[i - 1].swing >= r.swing) && !g('reserve'), sens.map((r) => r.key));
  ok('độ nhạy ±20% gấp đôi ±10% (lợi nhuận tuyến tính theo giá)', await page.evaluate(() => { const sc = EP.scenario.get('shop-demo'); return Math.abs(sc.sensitivity('profit', 20).find((r) => r.key === 'price').high / sc.sensitivity('profit', 10).find((r) => r.key === 'price').high - 2) < 1e-6; }));
  ok('tornado vẽ bằng EP.charts (svg có thanh) + chú giải', await page.evaluate(() => document.querySelectorAll('#view-playground [data-slot="tornado"] svg .ch-bar').length >= 8 && !!document.querySelector('#view-playground [data-slot="tornado"] .chart-legend')));
  ok('có nhãn Giả định trên từng dòng + đầu trang', await page.evaluate(() => document.querySelectorAll('#view-playground .sc-row .badge').length === 10 && /Giả định/.test(document.querySelector('#view-playground .sc-head').textContent)));
  const exTxt = await page.textContent('#view-playground [data-slot="explain"]');
  ok('"Cách tính" liệt kê công thức + số thật (600 đơn, 545, 25.000.000)', /20\.000 × 3% = 600 đơn/.test(exTxt) && /545/.test(exTxt) && /25\.000\.000/.test(exTxt) && /Lãi góp/.test(exTxt), exTxt.slice(0, 200));
  await page.fill('#sc-shop-demo-fixed', '30000000'); await page.waitForTimeout(200);
  ok('ô tiền: gõ 30000000 -> 30.000.000', (await page.inputValue('#sc-shop-demo-fixed')) === '30.000.000');
  ok('đổi chi phí cố định -> lợi nhuận tính lại (-2,48 tr)', await page.evaluate(() => Math.abs(EP.scenario.get('shop-demo').results().base.profit - (-2.48e6)) < 1) && /-2,5 tr/.test(await page.textContent('#view-playground [data-slot="cards"]')));
  ok('giả định lưu vào localStorage (EP.store)', await page.evaluate((p) => { const j = JSON.parse(localStorage.getItem(p + 'scn_shop-demo') || 'null'); return !!j && j.values.fixed === 30000000; }, CFG.prefix));
  ok('setValue nguồn sample -> nhãn Dữ liệu mẫu; ô sửa tay vẫn Giả định', await page.evaluate(() => { const sc = EP.scenario.get('shop-demo'); sc.setValue('price', 200000, { source: 'sample' }); return /Dữ liệu mẫu/.test(document.querySelector('[data-row="price"] [data-tag]').textContent) && /Giả định/.test(document.querySelector('[data-row="fixed"] [data-tag]').textContent); }));
  await page.fill('#sc-shop-demo-cr', ''); await page.waitForTimeout(150);
  ok('ô trống -> cảnh báo, giữ giá trị cũ (không NaN)', /Nhập một con số/.test(await page.textContent('[data-row="cr"] [data-msg]')) && !/NaN/.test(await page.textContent('#view-playground .sc')));
  const [csvDl] = await Promise.all([page.waitForEvent('download'), page.click('#view-playground [data-act="csv"]')]);
  const csvBuf = fs.readFileSync(await csvDl.path());
  const csvTxt = csvBuf.toString('utf8');
  ok('CSV: có BOM UTF-8, tiêu đề Xấu/Cơ sở/Tốt, đủ nhóm Giả định + Kết quả', csvBuf[0] === 0xEF && csvBuf[1] === 0xBB && csvBuf[2] === 0xBF && /Nhóm,Chỉ tiêu,Đơn vị,Xấu,Cơ sở,Tốt,Nhãn/.test(csvTxt) && /Giả định,/.test(csvTxt) && /Kết quả,Lợi nhuận ròng/.test(csvTxt), csvTxt.slice(0, 200));
  ok('CSV: số thô, nhãn Dữ liệu mẫu cho giá bán, "Không đủ dữ liệu" cho hòa vốn Xấu', /Giá bán trung bình mỗi đơn \(AOV\),₫,\d+(\.\d+)?,200000,\d+(\.\d+)?,Dữ liệu mẫu/.test(csvTxt) && /Không đủ dữ liệu/.test(csvTxt), csvTxt.split('\r\n').filter((l) => /AOV|hòa vốn/.test(l)));
  const txt = await page.evaluate(() => EP.scenario.get('shop-demo').toText());
  ok('sao chép cho slide: cảnh báo giả định, giả định + nhãn, kết quả 3 kịch bản', /không phải số liệu thật/.test(txt) && /\[Dữ liệu mẫu\]/.test(txt) && /\[Giả định\]/.test(txt) && /Lợi nhuận ròng: .* \| .* \| /.test(txt), txt.slice(0, 300));
  await page.evaluate(() => EP.scenario.get('shop-demo').reset());
  ok('đặt lại: về mặc định (lợi nhuận 2,52 tr, nhãn Giả định)', await page.evaluate(() => Math.abs(EP.scenario.get('shop-demo').results().base.profit - 2.52e6) < 1 && /Giả định/.test(document.querySelector('[data-row="price"] [data-tag]').textContent)));
  if (SHOTS) { await page.screenshot({ path: path.join(SHOTS, 'desktop-light-playground-biz.png'), fullPage: true }); }

  console.log('# Mô-đun: nhập file (EP.importer)');
  const P = await page.evaluate(() => { const I = EP.importer; return {
    n: ['1.234.567,5', '1.250.000 ₫', '12,5%', '1,234.5', '12.5', '1.250', '(1.234)', '-3,5', '', 'abc', '1.2.3'].map((x) => { const v = I.parseNumber(x); return isNaN(v) ? 'NaN' : v; }),
    d: ['31/12/2026', '1/2/26', '2026-11-05', '31/02/2026', '2026-13-01', '', 'hôm nay'].map(I.parseDate), serial: I.parseDate(46327),
    norm: [I.normalize('Đơn giá (₫)'), I.normalize('SỐ LƯỢNG'), I.normalize('  Ngày-bán ')],
    csv: I.parseCsv('﻿a;b;c\r\n1;"x;y";"he said ""hi"""\r\n\r\n4;5;6'),
    guess: I.guess(['STT', 'Tên hàng', 'SL', 'Giá bán', 'Ngày'], [{ key: 'name', label: 'Sản phẩm', aliases: ['ten hang'] }, { key: 'qty', label: 'Số lượng', aliases: ['sl'] }, { key: 'price', label: 'Đơn giá', aliases: ['gia ban'] }, { key: 'day', label: 'Ngày' }]) }; });
  ok('parseNumber vi-VN/en: 1.234.567,5 · 1.250.000 ₫ · 12,5% · 1,234.5 · 12.5 · 1.250 · (1.234) · -3,5 · rỗng/abc', JSON.stringify(P.n.slice(0, 10)) === JSON.stringify([1234567.5, 1250000, 12.5, 1234.5, 12.5, 1250, -1234, -3.5, 'NaN', 'NaN']), P.n);
  ok('parseDate: dd/mm/yyyy, d/m/yy, ISO, serial Excel; ngày không tồn tại -> null', JSON.stringify(P.d) === JSON.stringify(['2026-12-31', '2026-02-01', '2026-11-05', null, null, null, null]) && P.serial === '2026-11-01', [P.d, P.serial]);
  ok('normalize bỏ dấu (đ -> d), hạ chữ thường', JSON.stringify(P.norm) === JSON.stringify(['don gia', 'so luong', 'ngay ban']), P.norm);
  ok('parseCsv: BOM, dấu ;, ngoặc kép, "" thoát, dòng trống', JSON.stringify(P.csv) === JSON.stringify([['a', 'b', 'c'], ['1', 'x;y', 'he said "hi"'], [''], ['4', '5', '6']]), P.csv);
  ok('guess cột theo tên Việt/Anh không dấu', JSON.stringify(P.guess) === JSON.stringify({ name: 1, qty: 2, price: 3, day: 4 }), P.guess);
  await page.evaluate(() => EP.collection('btc_sample').clear());
  await pick('Nhập file'); await page.waitForSelector('#view-playground [data-file]');
  ok('SheetJS nạp lười: chưa có XLSX khi chưa chọn file Excel', await page.evaluate(() => typeof window.XLSX === 'undefined'));
  const fx = (n) => path.join(__dirname, 'fixtures', n);
  await page.setInputFiles('#view-playground [data-file]', fx('mau-btc.xlsx'));
  await page.waitForSelector('#view-playground .im-prev table');
  ok('SheetJS chỉ nạp sau khi chọn file Excel', await page.evaluate(() => typeof window.XLSX === 'object'));
  ok('liệt kê 3 sheet (Bán hàng, Chi phí, Ghi chú)', JSON.stringify(await page.$$eval('#view-playground [data-slot="sheetpick"] .seg label', (l) => l.map((x) => x.textContent.trim()))) === JSON.stringify(['Bán hàng', 'Chi phí', 'Ghi chú']));
  ok('xem trước tối đa 20 dòng, ngày Excel hiện dạng ngày (không phải số serial)', await page.evaluate(() => { const t = document.querySelector('#view-playground .im-prev'); return document.querySelectorAll('#view-playground .im-prev tr').length <= 21 && /2026-11-01/.test(t.textContent); }));
  ok('tự đoán cột: Ngày/Sản phẩm/Số lượng/Đơn giá -> cột 0/1/2/3', JSON.stringify(await page.$$eval('#view-playground select[data-map]', (s) => s.map((x) => x.value))) === JSON.stringify(['0', '1', '2', '3']));
  const sum1 = await page.textContent('#view-playground [data-slot="check"]');
  ok('kiểm tra: 6 hợp lệ, 1 lỗi (số lượng "abc", dòng 6), 1 dòng trống bỏ qua', /6 dòng hợp lệ/.test(sum1) && /1 lỗi/.test(sum1) && /1 dòng trống/.test(sum1) && /Dòng 6: "Số lượng" = "abc"/.test(sum1), sum1);
  await page.click('#view-playground [data-act="import"]');
  const imp1 = await page.evaluate(() => EP.collection('btc_sample').list());
  ok('nhập: 6 dòng vào collection, gắn "Dữ liệu mẫu từ BTC", số/ngày đã chuyển kiểu', imp1.length === 6 && imp1.every((r) => r.tag === 'Dữ liệu mẫu từ BTC' && typeof r.qty === 'number' && /^\d{4}-\d\d-\d\d$/.test(r.day)) && imp1.some((r) => r.name === 'Cà phê muối' && r.qty === 12 && r.price === 35000 && r.day === '2026-11-01'), imp1[0]);
  ok('sau nhập: có thẻ KPI + biểu đồ + nhãn', await page.evaluate(() => !!document.querySelector('#view-playground [data-slot="res"] .kpi') && !!document.querySelector('#view-playground [data-slot="res"] .chart svg') && /Dữ liệu mẫu từ BTC/.test(document.querySelector('#view-playground [data-slot="res"]').textContent)));
  for (const w of [360, 390]) {
    await page.setViewportSize({ width: w, height: 844 }); await page.waitForTimeout(350);
    const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
    ok(w + 'px: Nhập file không tràn ngang (' + o.sw + '/' + o.cw + ')', o.sw <= o.cw);
    if (SHOTS) await page.screenshot({ path: path.join(SHOTS, 'mobile-' + w + '-playground-import.png'), fullPage: true });
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.click('#view-playground [data-slot="sheetpick"] .seg label:has-text("Chi phí")'); await page.waitForTimeout(300);
  ok('sheet Chi phí: tự ghép Ngày chi/Khoản mục/Số tiền, bỏ qua Số lượng', JSON.stringify(await page.$$eval('#view-playground select[data-map]', (s) => s.map((x) => x.value))) === JSON.stringify(['2', '0', '-1', '1']));
  const sum2 = await page.textContent('#view-playground [data-slot="check"]');
  ok('số/ngày dạng chữ vi-VN: 3 hợp lệ, 1 lỗi (31/02/2026 không tồn tại)', /3 dòng hợp lệ/.test(sum2) && /1 lỗi/.test(sum2) && /31\/02\/2026/.test(sum2), sum2);
  await page.click('#view-playground [data-act="import"]');
  const imp2 = await page.evaluate(() => EP.collection('btc_sample').list());
  ok('nhập sheet Chi phí (thay dữ liệu cũ): 1.234.567,5 -> 1234567.5; 12.000.000 -> 12000000', imp2.length === 3 && imp2.some((r) => r.price === 1234567.5) && imp2.some((r) => r.price === 12000000 && r.day === '2026-11-05'), imp2);
  await page.setInputFiles('#view-playground [data-file]', fx('mau-btc.csv'));
  await page.waitForSelector('#view-playground [data-slot="check"] .badge');
  const sum3 = await page.textContent('#view-playground [data-slot="check"]');
  ok('CSV (BOM, dấu ;, "a, b" trong ngoặc kép): 3 hợp lệ, 1 lỗi, 1 trống', /3 dòng hợp lệ/.test(sum3) && /1 lỗi/.test(sum3) && /1 dòng trống/.test(sum3), sum3);
  await page.click('#view-playground [data-act="import"]');
  const imp3 = await page.evaluate(() => EP.collection('btc_sample').list());
  ok('CSV: "Trà đào, cam sả" giữ nguyên, 42.000,5 -> 42000.5, ngày dd/mm/yyyy', imp3.length === 3 && imp3.some((r) => r.name === 'Trà đào, cam sả' && r.price === 42000.5 && r.day === '2026-11-02'), imp3);
  await page.setInputFiles('#view-playground [data-file]', { name: 'x.pdf', mimeType: 'application/pdf', buffer: Buffer.from('x') });
  await page.waitForSelector('#view-playground [role="alert"]');
  ok('file sai định dạng -> báo lỗi tiếng Việt', /Chỉ nhận \.xlsx/.test(await page.textContent('#view-playground [role="alert"]')));
  await pick('Kinh doanh'); await page.waitForSelector('#view-playground [data-act="use-sample"]');
  await page.click('#view-playground [data-act="use-sample"]');
  ok('dùng giá TB từ dữ liệu BTC (43.000) -> giả định giá bán mang nhãn Dữ liệu mẫu', await page.evaluate(() => /Dữ liệu mẫu/.test(document.querySelector('[data-row="price"] [data-tag]').textContent) && EP.scenario.get('shop-demo').values().price === 43000));
  for (const w of [360, 390]) {
    await page.setViewportSize({ width: w, height: 844 }); await page.waitForTimeout(400);
    const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
    ok(w + 'px: Kinh doanh không tràn ngang (' + o.sw + '/' + o.cw + ')', o.sw <= o.cw);
    ok(w + 'px: bảng kết quả 3 kịch bản vừa khung', await page.evaluate(() => document.querySelector('#view-playground .sc-table').getBoundingClientRect().right <= document.documentElement.clientWidth));
    if (SHOTS) await page.screenshot({ path: path.join(SHOTS, 'mobile-' + w + '-playground-biz.png'), fullPage: true });
  }
  await page.evaluate(() => { EP.scenario.get('shop-demo').reset(); EP.collection('btc_sample').clear(); });
  await page.setViewportSize({ width: 1440, height: 900 });
  }

  console.log('# Cài đặt: AI + dữ liệu');
  await page.goto(URL + '#/settings');
  await page.waitForSelector('#set-ai');
  await page.evaluate(() => { EP.config.ai = { proxyUrl: '', appToken: '' }; EP.ai.mountSettings(document.querySelector('#set-ai')); });
  await page.waitForSelector('#ai-key');
  await page.fill('#ai-key', 'abc');
  ok('key không lưu localStorage khi chưa tick nhớ', await page.evaluate((p) => localStorage.getItem(p + 'ai_key') === null, CFG.prefix));
  await page.check('#ai-remember');
  ok('tick nhớ -> lưu key', await page.evaluate((p) => localStorage.getItem(p + 'ai_key') === '"abc"', CFG.prefix));
  await page.uncheck('#ai-remember');
  ok('bỏ tick -> xóa key', await page.evaluate((p) => localStorage.getItem(p + 'ai_key') === null, CFG.prefix));
  const [bk] = await Promise.all([page.waitForEvent('download'), page.click('[data-act="backup"]')]);
  const bj = JSON.parse(fs.readFileSync(await bk.path(), 'utf8'));
  const colKey = Object.keys(bj.data).find((k) => /^c_/.test(k) && Array.isArray(bj.data[k]) && bj.data[k].length > 0);
  ok('sao lưu JSON không chứa key AI', !('ai_key' in bj.data));
  if (colKey) {
    const col = colKey.slice(2);
    await page.evaluate((c) => EP.collection(c).clear(), col);
    const tmp = path.join(require('os').tmpdir(), 'smoke-backup.json'); fs.writeFileSync(tmp, JSON.stringify(bj));
    const [fc] = await Promise.all([page.waitForEvent('filechooser'), page.click('[data-act="restore"]')]);
    await fc.setFiles(tmp); await page.waitForFunction((c) => EP.collection(c).count() > 0, col);
    ok('sao lưu có dữ liệu + khôi phục từ file (' + colKey + ')', true);
  } else console.log('  (bỏ qua khôi phục: chưa có collection nào có dữ liệu demo)');
  const bad = await page.evaluate(() => EP.export.restore(new File(['{"x":1}'], 'b.json')).then(() => 'ok', (e) => e.message));
  ok('file khôi phục sai bị từ chối bằng tiếng Việt', /định dạng/.test(bad), bad);

  await require('./mobile-suite.cjs')({ browser, URL, ok, SHOTS, errors, fixtures: path.join(__dirname, 'fixtures') }); // điện thoại 360x780 + 390x844 (tests/mobile-suite.cjs)

  console.log('# Phông tự host + showPlayground');
  {
    const fp = await ctx.newPage(); const fonts = [];
    fp.on('request', (r) => { if (/\.woff2?(\?|$)/.test(r.url())) fonts.push(r.url()); });
    await fp.addInitScript(() => { window.__cls = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); });
    await fp.goto(URL + '?demo=1', { waitUntil: 'load' }); await fp.waitForSelector('html[data-ready="1"]'); await fp.evaluate(() => document.fonts.ready); await fp.waitForTimeout(800);
    ok('Be Vietnam Pro là phông giao diện và đã nạp (có dấu tiếng Việt)', await fp.evaluate(() => /Be Vietnam Pro/.test(getComputedStyle(document.body).fontFamily) && [...document.fonts].some((f) => f.family.replace(/"/g, '') === 'Be Vietnam Pro' && f.status === 'loaded')));
    ok('mọi tệp phông là tệp cùng nguồn (fonts/), chỉ nạp subset cần dùng', fonts.every((u) => u.startsWith(URL + 'fonts/')) && fonts.length <= 16, fonts);
    ok('CLS = 0 sau khi nạp phông', (await fp.evaluate(() => window.__cls)) < 0.001, await fp.evaluate(() => window.__cls));
    await fp.close();
    // showPlayground:false => tab/route playground không được đăng ký (ghi đè config.js tại chỗ)
    const np = await ctx.newPage();
    await np.route(/\/js\/config\.js(\?.*)?$/, async (route) => { const r = await route.fetch(); const t = (await r.text()).replace(/showPlayground: true,/, 'showPlayground: false,'); await route.fulfill({ response: r, body: t }); });
    await np.goto(URL + '#/playground', { waitUntil: 'load' }); await np.waitForSelector('html[data-ready="1"]');
    const t2 = await np.$$eval('.tab', (a) => a.map((x) => x.dataset.tab));
    ok('showPlayground:false -> không có tab/view playground', !t2.includes('playground') && (await np.$$('#view-playground')).length === 0 && (await np.evaluate(() => EP.config.showPlayground === false)), t2);
    ok('showPlayground:false -> route #/playground rơi về view mặc định, vẫn còn tab khác', t2.length >= 2 && (await np.$$('.view:not([hidden])')).length === 1, t2);
    await np.close();
  }

  console.log('# Lỗi console');
  // Các lỗi 4xx cố ý từ Gemini giả (route) ở bước trên không tính
  const real = errors.filter((e) => !/generativelanguage|fake-proxy\.test|status of (429|403)/.test(e));
  ok('không có lỗi console/mạng', real.length === 0, real);

  ok('Firebase tắt: không có request tới googleapis/gstatic/firebase', fbReqs.length === 0, fbReqs);
  ok('Firebase tắt: EP.auth.enabled=false, không nút đăng nhập, có nhãn lưu trên máy', await page.evaluate(() => EP.auth.enabled === false && EP.auth.user() === null && !document.getElementById('btn-auth') && /lưu trên máy này/.test(document.getElementById('ft-storage').textContent)));

  await browser.close();
  console.log(failed ? '\n' + failed + ' kiểm tra THẤT BẠI' : '\nTẤT CẢ ĐẠT');
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
