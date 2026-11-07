// Tạo ảnh bằng AI trong Thư viện ảnh: mock fetch (route) cho Gemini ảnh gốc, Imagen, lỗi 429 limit 0, bộ lọc an toàn.
// KHÔNG gọi Google thật. Dùng: node tests/e2e-ai-image.cjs <thư-mục-ảnh-chụp> <url>
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const SHOTS = process.argv[2], URL_ = process.argv[3] || 'http://localhost:8181/';
(async () => {
  let fail = 0; const ok = (n, c, d) => { console.log((c ? 'PASS ' : 'FAIL ') + n + (d ? ' — ' + d : '')); if (!c) fail++; };
  const b = require('./auto-tab.cjs')(await chromium.launch());
  const ctx = await b.newContext({ viewport: { width: 1400, height: 900 } });
  const p = await ctx.newPage(); p.__noAutoUpload = true;
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const png = await p.evaluate(() => { const c = document.createElement('canvas'); c.width = 320; c.height = 180; const x = c.getContext('2d'); x.fillStyle = '#c0602a'; x.fillRect(0, 0, 320, 180); return c.toDataURL('image/png').split(',')[1]; });
  const calls = []; let mode = 'native';
  await p.route('**/generativelanguage.googleapis.com/**', async (route) => {
    const req = route.request(), url = req.url(), body = JSON.parse(req.postData() || '{}');
    calls.push({ url, key: req.headers()['x-goog-api-key'], body });
    const json = (status, o) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(o) });
    if (mode === 'billing') return json(429, { error: { code: 429, status: 'RESOURCE_EXHAUSTED', message: 'You exceeded your current quota. * Quota exceeded for metric: generate_content_free_tier_requests, limit: 0' } });
    if (mode === 'safety') return json(200, { promptFeedback: { blockReason: 'SAFETY' } });
    if (mode === 'badkey') return json(400, { error: { code: 400, status: 'INVALID_ARGUMENT', message: 'API key not valid. Please pass a valid API key.' } });
    if (url.includes(':predict')) return json(200, { predictions: Array.from({ length: body.parameters.sampleCount }, () => ({ mimeType: 'image/png', bytesBase64Encoded: png })) });
    return json(200, { candidates: [{ content: { parts: [{ text: 'Đây là ảnh.' }, { inlineData: { mimeType: 'image/png', data: png } }] } }] });
  });
  const D = 'dialog.ml-dialog[open]';
  const closeEditor = async () => { if (await p.locator('dialog.ie-dialog[open]').count()) { await p.waitForSelector('dialog.ie-dialog[open] canvas', { timeout: 8000 }); await p.waitForTimeout(300); await p.click('.ie-foot button:has-text("Áp dụng")'); await p.waitForFunction(() => !document.querySelector('dialog.ie-dialog'), null, { timeout: 5000 }); } };

  await p.goto(URL_); await p.click('#btn-sample'); await p.click('#btn-generate'); await p.waitForTimeout(900);
  await p.click('[data-tab="builder"]');

  // Mở từ ô album → tab AI
  await p.click('#img-card .img-tile[data-slot="gallery:0"]'); await p.waitForSelector(D);
  ok('has "Tạo bằng AI" tab', await p.locator(D + ' .ml-tab:has-text("Tạo bằng AI")').count() === 1);
  await p.click(D + ' .ml-tab:has-text("Tạo bằng AI")');
  ok('AI panel + notice about labeling', (await p.textContent(D + ' .ml-ai-note')).includes('Ảnh minh hoạ tạo bằng AI'));
  ok('aspect defaults to 4:3 for gallery', (await p.inputValue('#ml-ai-aspect')) === '4:3');
  ok('model list has native + imagen', (await p.locator('#ml-ai-model option').count()) >= 4 && (await p.locator('#ml-ai-model option[value^="imagen"]').count()) >= 1);
  ok('key link to aistudio', (await p.getAttribute(D + ' .ml-ai-hint a', 'href')).includes('aistudio.google.com/apikey'));
  // Chưa có prompt / key
  await p.click(D + ' .ml-ai-go');
  ok('empty prompt error', (await p.textContent(D + ' .ml-ai-err')).includes('mô tả'));
  await p.click(D + ' .ml-ai-sug');
  const pr = await p.inputValue('#ml-ai-prompt'); const evd = await p.evaluate(() => { const id = JSON.parse(localStorage.ep_current_id); return JSON.parse(localStorage.ep_events)[id].event; }); const evName = evd.name, evLoc = evd.location;
  ok('suggested prompt uses event name + location + 4:3', pr.includes(evName) && pr.includes(evLoc.split(',').pop().trim()) && pr.includes('4:3'), pr);
  await p.evaluate(() => { localStorage.removeItem('ep_gemini_key'); document.getElementById('ml-ai-keyin').value = ''; });
  await p.click(D + ' .ml-ai-go');
  ok('missing key → inline error', (await p.textContent(D + ' .ml-ai-err')).includes('API key') && calls.length === 0);

  // Gemini ảnh gốc, 2 ảnh
  await p.fill('#ml-ai-keyin', 'TEST_KEY_123'); await p.check(D + ' .ml-ai-f .check input');
  await p.selectOption('#ml-ai-count', '2');
  await p.click(D + ' .ml-ai-go');
  await p.waitForFunction(() => document.querySelectorAll('dialog.ml-dialog .ml-ai-res .ml-card').length === 2, null, { timeout: 15000 });
  ok('native: 2 results', true);
  ok('native: endpoint generateContent + key header', calls.length === 2 && /models\/gemini-3\.1-flash-image-preview:generateContent$/.test(calls[0].url) && calls[0].key === 'TEST_KEY_123');
  ok('native: responseModalities + aspectRatio', JSON.stringify(calls[0].body.generationConfig.responseModalities) === '["TEXT","IMAGE"]' && calls[0].body.generationConfig.imageConfig.aspectRatio === '4:3');
  ok('key remembered (ep_gemini_key)', (await p.evaluate(() => JSON.parse(localStorage.ep_gemini_key))) === 'TEST_KEY_123');
  if (SHOTS) await p.screenshot({ path: SHOTS + '/ai-image-desktop.png' });
  // Đã lưu vào thư viện
  await p.click(D + ' .ml-tab:has-text("Ảnh AI")');
  await p.waitForFunction(() => document.querySelectorAll('dialog.ml-dialog .ml-card').length === 2, null, { timeout: 8000 });
  ok('saved in "Ảnh AI" tab with "AI –" name + AI badge', (await p.locator(D + ' .ml-card .ml-name').first().textContent()).startsWith('AI – ') && (await p.locator(D + ' .ml-card .ml-badge').count()) === 2);
  ok('tab counts: AI (2), uploads (0)', (await p.textContent(D + ' .ml-tab:has-text("Ảnh AI")')).includes('(2)') && (await p.textContent(D + ' .ml-tab:has-text("Ảnh tải lên")')).includes('(0)'));
  await p.click(D + ' .ml-tab:has-text("Ảnh tải lên")'); await p.waitForTimeout(300);
  ok('AI images NOT in "Ảnh tải lên"', (await p.locator(D + ' .ml-card').count()) === 0);
  await p.click(D + ' .ml-tab:has-text("Ảnh AI")'); await p.waitForTimeout(300);
  await p.fill(D + ' .ml-search', 'zzz');
  ok('search works within AI tab', (await p.locator(D + ' .ml-card').count()) === 0);
  await p.fill(D + ' .ml-search', '');
  ok('records store source:"ai"', (await p.evaluate(() => EP.media.list().then(l => l.filter(r => r.source === 'ai').length))) === 2);
  await p.click(D + ' .ml-tab:has-text("Tạo bằng AI")');

  // Imagen, 3 ảnh, 16:9
  calls.length = 0;
  await p.selectOption('#ml-ai-model', 'imagen-4.0-generate-001'); await p.selectOption('#ml-ai-aspect', '16:9'); await p.selectOption('#ml-ai-count', '3');
  await p.click(D + ' .ml-ai-go');
  await p.waitForFunction(() => document.querySelectorAll('dialog.ml-dialog .ml-ai-res .ml-card').length === 3, null, { timeout: 15000 });
  ok('imagen: 3 results', true);
  ok('imagen: :predict + instances/parameters', calls.length === 1 && /imagen-4\.0-generate-001:predict$/.test(calls[0].url) && calls[0].body.instances[0].prompt.length > 10 && calls[0].body.parameters.sampleCount === 3 && calls[0].body.parameters.aspectRatio === '16:9');

  // 429 limit 0
  mode = 'billing'; calls.length = 0;
  await p.selectOption('#ml-ai-model', 'gemini-3.1-flash-image-preview'); await p.selectOption('#ml-ai-count', '1');
  await p.click(D + ' .ml-ai-go');
  await p.waitForFunction(() => /billing/.test(document.querySelector('dialog.ml-dialog .ml-ai-err').textContent), null, { timeout: 10000 });
  ok('429 limit 0 → billing message', (await p.textContent(D + ' .ml-ai-err')).includes('Model tạo ảnh cần bật thanh toán (billing) cho API key – gói miễn phí không hỗ trợ'));
  ok('button re-enabled after error', await p.isEnabled(D + ' .ml-ai-go'));
  if (SHOTS) await p.screenshot({ path: SHOTS + '/ai-image-error.png' });
  mode = 'safety';
  await p.click(D + ' .ml-ai-go');
  await p.waitForFunction(() => /an toàn/.test(document.querySelector('dialog.ml-dialog .ml-ai-err').textContent), null, { timeout: 10000 });
  ok('safety block message', true);
  mode = 'badkey';
  await p.click(D + ' .ml-ai-go');
  await p.waitForFunction(() => /không hợp lệ/.test(document.querySelector('dialog.ml-dialog .ml-ai-err').textContent), null, { timeout: 10000 });
  ok('invalid key message', true);

  // Dùng ảnh vào ô: tạo lại rồi bấm ảnh
  mode = 'native'; calls.length = 0;
  await p.click(D + ' .ml-ai-go');
  await p.waitForSelector(D + ' .ml-ai-res .ml-card button', { timeout: 10000 });
  await p.click(D + ' .ml-ai-res .ml-card button');
  await p.waitForFunction(() => !document.querySelector('dialog.ml-dialog'));
  await p.waitForFunction(() => { const id = JSON.parse(localStorage.ep_current_id); const g = JSON.parse(localStorage.ep_events)[id].event.images.gallery || []; return /^data:image\//.test(g[0] || ''); }, null, { timeout: 10000 });
  ok('clicking AI result fills the slot', true);
  await closeEditor();

  // Ô hero: tỉ lệ 16:9, màn hình điện thoại
  await p.setViewportSize({ width: 390, height: 800 });
  await p.click('#img-card .img-tile[data-slot="hero"]'); await p.waitForSelector(D);
  await p.click(D + ' .ml-tab:has-text("Tạo bằng AI")');
  ok('hero → 16:9', (await p.inputValue('#ml-ai-aspect')) === '16:9');
  ok('mobile: no horizontal overflow', await p.evaluate(() => { const d = document.querySelector('dialog.ml-dialog'); return d.scrollWidth <= d.clientWidth + 1; }));
  if (SHOTS) await p.screenshot({ path: SHOTS + '/ai-image-mobile.png' });
  await p.keyboard.press('Escape');
  ok('no page errors', errs.length === 0, errs.join('|'));
  await b.close(); process.exit(fail ? 1 : 0);
})();
