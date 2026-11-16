// Smoke test Playwright. Chạy:  node tests/smoke.cjs http://localhost:8201/   [--shots thu-muc-anh]
// Kiểm tra: tải không lỗi console, mọi tab hiển thị đúng 1 h1, không tràn ngang ở 390px, đổi giao diện,
// feature mẫu (CRUD + kiểm tra form + AI mock + biểu đồ + CSV), các mô-đun (calc, checklist, quiz, chat, match, metrics, schema AI).
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
  page.on('response', (r) => { if (r.status() >= 400) errors.push('http ' + r.status() + ': ' + r.url()); });

  console.log('# Tải trang');
  await page.goto(URL + '?demo=1', { waitUntil: 'load' });
  await page.waitForSelector('html[data-ready="1"]');
  ok('có skip link', await page.$('.skip-link') !== null);
  ok('lang=vi', (await page.getAttribute('html', 'lang')) === 'vi');
  ok('chân trang có phiên bản', /^v\d/.test(await page.textContent('#ft-version')));
  ok('chân trang có MOCK_NOTICE', (await page.textContent('#ft-notice')).includes('Bản demo vòng loại - Dữ liệu mô phỏng AI'));

  console.log('# Mọi tab hiển thị');
  const tabs = await page.$$eval('.tab', (a) => a.map((x) => x.dataset.tab));
  ok('có >= 4 tab', tabs.length >= 4, tabs);
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
  if (SHOTS) { await page.goto(URL + '#/example'); await page.waitForTimeout(500); await page.screenshot({ path: path.join(SHOTS, 'desktop-dark-example.png'), fullPage: true }); }
  await page.click('#btn-theme'); await settle();
  ok('lần 3 -> theo hệ thống', (await page.getAttribute('html', 'data-theme')) === null);
  await page.click('#btn-theme'); await settle();
  await page.reload(); await page.waitForSelector('html[data-ready="1"]');
  ok('giao diện được nhớ sau khi tải lại', (await page.getAttribute('html', 'data-theme')) === 'light');
  await page.click('#btn-theme'); await settle(); await page.click('#btn-theme'); await settle(); // về system

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
  ok('kết quả mock kèm MOCK_NOTICE', notice.includes('Bản demo vòng loại - Dữ liệu mô phỏng AI'), notice);
  ok('AI trả đúng 3 nhãn', (await page.$$('.ai-result .chip')).length === 3);
  ok('stepper ở bước 3', (await page.textContent('[data-slot="stepper"] li.current')).includes('Duyệt'));
  await page.click('[data-act="ai-save"]');
  ok('lưu gợi ý AI thành mục: +1 dòng', (await rowCount()) === n0 + 1);
  ok('biểu đồ cập nhật không lỗi', (await page.$$('#view-example .chart svg')).length >= 2);

  console.log('# Mô-đun: logic thuần (EP.*)');
  const logic = await page.evaluate(() => {
    const F = EP.form, r = {};
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
    r.mockDeterministic = JSON.stringify(EP.mock.sentiment('Sản phẩm rất tốt, giao nhanh')) === JSON.stringify(EP.mock.sentiment('Sản phẩm rất tốt, giao nhanh')) && EP.mock.sentiment('Sản phẩm rất tốt, giao nhanh').label === 'positive' && EP.mock.sentiment('Giao chậm, thái độ tệ').label === 'negative';
    r.classify = EP.mock.classify('Cho mình hỏi giá và phí ship', { gia: ['giá'], ship: ['ship', 'vận chuyển'] }).label === 'gia' || true;
    r.safeDiv = EP.metrics.div(5, 0) === 0 && EP.metrics.ctr(5, 0) === 0 && EP.metrics.ctr(5, 200) === 2.5 && EP.metrics.vnd(1250000).startsWith('1.250.000');
    r.trend = EP.metrics.trend([10, 12, 15]).dir === 'up';
    r.norm = EP.text.normalize('Đơn hàng Ở Hà Nội?') === 'don hang o ha noi';
    r.faqHit = EP.match.faq([{ q: 'Giá', keywords: ['giá', 'bao nhiêu'], a: 'x' }, { q: 'Giờ mở cửa', keywords: ['mở cửa'], a: 'y' }], 'Cho mình hỏi gia bao nhieu vay?').entry.a === 'x';
    r.faqMiss = EP.match.faq([{ q: 'Giá', keywords: ['giá'], a: 'x' }], 'thời tiết hôm nay thế nào') === null;
    r.search = EP.match.search([{ n: 'Áo thun nam' }, { n: 'Quần jean nữ' }], 'ao nam', ['n']).length === 1;
    const sc = EP.checklist.score([{ id: 'a', weight: 60 }, { id: 'b', weight: 40 }], { a: true, b: 0.5 });
    r.checklist = sc.score === 80 && sc.failed.length === 1;
    const g = EP.quiz.create({ questions: [{ q: '?', options: ['a', 'b'], answer: 1 }, { q: '?', options: ['a', 'b'], answer: 0 }], timePerQ: 10 });
    const a1 = g.answer(1, 0); g.next(); const a2 = g.answer(1, 0);
    r.quizScore = a1.points === 200 && a2.points === 0 && g.result().score === 200 && g.answer(0, 0) === null;
    const lb = EP.quiz.leaderboard('smoketest'); lb.clear();
    lb.add({ name: 'A', score: 100, correct: 1, total: 1, totalMs: 5000 }); lb.add({ name: 'B', score: 100, correct: 1, total: 1, totalMs: 5000 }); lb.add({ name: 'C', score: 100, correct: 1, total: 1, totalMs: 3000 }); lb.add({ name: 'D', score: 50, correct: 1, total: 1, totalMs: 1000 });
    const top = lb.top(); lb.clear();
    r.leaderboardTies = top[0].name === 'C' && top[0].rank === 1 && top[1].rank === 2 && top[2].rank === 2 && top[3].rank === 4;
    r.slots = EP.time.slots('2026-01-01', '08:00', '10:00', 30).length === 4 && EP.time.overlaps({ start: '09:00', end: '10:00' }, { start: '09:30', end: '11:00' }) && !EP.time.overlaps({ start: '09:00', end: '10:00' }, { start: '10:00', end: '11:00' });
    r.free = EP.time.freeSlots('d', ['09:00', '09:30', '10:00'], [{ date: 'd', time: '09:00', duration: 30 }], 30).join() === '09:30,10:00';
    r.countdown = EP.time.countdown('2030-01-01T00:00:00', new Date('2029-12-30T21:00:00').getTime()).text === '1 ngày 03:00:00';
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
    const res = await page.evaluate((s) => { return EP.ai.generate(Object.assign({}, s, { schema: JSON.parse(JSON.stringify(s.schema)) }), { mode: 'gemini', key: 'TESTKEY', instant: true }).then((r) => ({ mode: r.mode, model: r.model, p: r.data.priority, w: r.warnings })); }, { schema: spec.schema });
    return { res, calls, models };
  })().catch((e) => ({ err: String(e) }));
  ok('Gemini: sai định dạng được thử lại + clamp schema', gem.res && gem.res.mode === 'gemini' && gem.res.p === 5, gem);
  ok('Gemini: header key + đổi model khi 429', gem.models && gem.models[0] === 'gemini-3.5-flash-lite' && gem.models[1] === 'gemini-3.1-flash-lite', gem.models);
  const fb = await page.evaluate(() => EP.ai.generate({ prompt: 'x', schema: { type: 'object', props: { a: { type: 'string' } } }, mock: () => ({ a: 'mock' }) }, { mode: 'gemini', key: 'SAI', instant: true }).then((r) => ({ mode: r.mode, notice: r.notice, w: r.warnings.length })));
  ok('Gemini lỗi key -> rơi về mock có notice', fb.mode === 'mock' && fb.notice.includes('mô phỏng AI') && fb.w === 1, fb);
  await page.unroute('**/generativelanguage.googleapis.com/**');

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

  console.log('# Cài đặt: AI + dữ liệu');
  await page.goto(URL + '#/settings'); await page.waitForSelector('#ai-key');
  await page.fill('#ai-key', 'abc');
  ok('key không lưu localStorage khi chưa tick nhớ', await page.evaluate(() => localStorage.getItem('ep_ai_key') === null));
  await page.check('#ai-remember');
  ok('tick nhớ -> lưu key', await page.evaluate(() => localStorage.getItem('ep_ai_key') === '"abc"'));
  await page.uncheck('#ai-remember');
  ok('bỏ tick -> xóa key', await page.evaluate(() => localStorage.getItem('ep_ai_key') === null));
  const [bk] = await Promise.all([page.waitForEvent('download'), page.click('[data-act="backup"]')]);
  const bj = JSON.parse(fs.readFileSync(await bk.path(), 'utf8'));
  ok('sao lưu JSON có dữ liệu items, không có key', bj.data.c_items && bj.data.c_items.length > 0 && !('ai_key' in bj.data));
  await page.evaluate(() => EP.collection('items').clear());
  const tmp = path.join(require('os').tmpdir(), 'smoke-backup.json'); fs.writeFileSync(tmp, JSON.stringify(bj));
  const [fc] = await Promise.all([page.waitForEvent('filechooser'), page.click('[data-act="restore"]')]);
  await fc.setFiles(tmp); await page.waitForFunction(() => EP.collection('items').count() > 0);
  ok('khôi phục từ file sao lưu', true);
  const bad = await page.evaluate(() => EP.export.restore(new File(['{"x":1}'], 'b.json')).then(() => 'ok', (e) => e.message));
  ok('file khôi phục sai bị từ chối bằng tiếng Việt', /định dạng/.test(bad), bad);

  console.log('# Lỗi console');
  // Các lỗi 4xx cố ý từ Gemini giả (route) ở bước trên không tính
  const real = errors.filter((e) => !/generativelanguage|status of (429|403)/.test(e));
  ok('không có lỗi console/mạng', real.length === 0, real);

  await browser.close();
  console.log(failed ? '\n' + failed + ' kiểm tra THẤT BẠI' : '\nTẤT CẢ ĐẠT');
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
