// Brand DNA từ tài liệu (AI): tải PDF/PNG, kiểm tra loại/dung lượng/số lượng, Gemini (mock) → xem lại guideline,
// lưu thành thương hiệu có guideline, mở trình chỉnh sửa, chế độ copy prompt dán JSON, độ tương phản, không gọi Gemini thật.
// Chạy: node tests/e2e-brand-ai.cjs [thư-mục-lưu-ảnh] [cổng=8731]  (cần `python3 -m http.server <cổng>` ở thư mục gốc repo)
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs'), path = require('path'), os = require('os');
const SP = process.argv[2] || os.tmpdir();
const PORT = process.argv[3] || '8731';
const URL = 'http://localhost:' + PORT + '/';
let failed = 0, total = 0;
const check = (name, ok, extra) => { total++; if (!ok) failed++; console.log((ok ? 'ok ' : '✗  ') + name + (ok ? '' : '  -> ' + extra)); };
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
const PDF = Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 200 200]>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF');
const CANNED = {
  name: 'Xclipse Academy', tagline: 'Học thật – Làm thật', primary: '#f2b632', accent: '#D6336C', textColor: '#131416', bgColor: '#ffffff',
  headingFont: 'playfair display', bodyFont: 'Be Vietnam Pro', button: 'weird', radius: 'round', tone: 'young',
  voiceUse: 'thực chiến, đồng hành', voiceAvoid: 'giá rẻ', audience: 'Sinh viên năm 2–4', ctaText: 'Giữ chỗ ngay', hotline: '0912 345 678', website: 'xclipse.vn', fanpage: '',
  guideline: {
    summary: 'Học viện đào tạo thực chiến cho người trẻ.', mission: 'Giúp sinh viên sẵn sàng đi làm.', values: ['Thực chiến', 'Tử tế', 'Bền bỉ'], personality: ['Trẻ trung', 'Gần gũi', 'Chuyên nghiệp'],
    colorPalette: [{ name: 'Vàng nắng', hex: '#f2b632', usage: 'Nhấn' }, { name: 'Hồng', hex: '#D6336C', usage: 'Nút' }, { name: 'Lỗi', hex: 'not-a-color', usage: '' }, { name: 'Xanh', hex: '0b4f8a', usage: 'Nền' }],
    typography: { heading: 'Playfair Display', body: 'Be Vietnam Pro', notes: 'Tiêu đề đậm, nội dung thoáng.' },
    logoRules: ['Chừa khoảng trống quanh logo'], imageryStyle: 'Ảnh thật, ánh sáng ấm.', doWords: ['cơ hội', 'đồng hành'], dontWords: ['giá rẻ'], sampleCopy: ['Học thật, làm thật, ra nghề thật.']
  }
};
(async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bai-'));
  const f = (n, buf) => { const p = path.join(dir, n); fs.writeFileSync(p, buf); return p; };
  const pdf = f('brandbook.pdf', PDF), png = f('guide.png', PNG), exe = f('virus.exe', 'MZ'), txt = f('notes.md', '# Brand\nMàu chính xanh'), big = f('huge.pdf', Buffer.alloc(16 * 1048576, 32));
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1400, height: 900 } });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept());
  let gemCalls = [], gemStatus = 200;
  await p.route('**/generativelanguage.googleapis.com/**', async (r) => {
    gemCalls.push({ url: r.request().url(), key: r.request().headers()['x-goog-api-key'], body: JSON.parse(r.request().postData() || '{}') });
    if (gemStatus !== 200) return r.fulfill({ status: gemStatus, contentType: 'application/json', body: '{}' });
    await new Promise(x => setTimeout(x, 2200));
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify(CANNED) }] } }] }) });
  });
  await p.goto(URL);
  await p.click('[data-tab="brand"]');
  await p.evaluate(() => { document.getElementById('brand-ai-wrap').open = true; });
  check('card visible', await p.isVisible('#brand-ai #bai-drop'));

  // --- kiểm tra tệp ---
  await p.setInputFiles('#bai-file', exe);
  check('bad type error', /định dạng chưa hỗ trợ/.test(await p.textContent('#bai-err')), await p.textContent('#bai-err'));
  await p.setInputFiles('#bai-file', big);
  check('oversize error', /vượt giới hạn 15 MB/.test(await p.textContent('#bai-err')), await p.textContent('#bai-err'));
  check('no file added by errors', await p.locator('.bai-file').count() === 0);
  await p.setInputFiles('#bai-file', [pdf, png, txt]);
  check('3 files listed', await p.locator('.bai-file').count() === 3);
  const icons = (await p.locator('.bai-ficon').allTextContents()).join(',');
  check('file icons', icons === 'PDF,IMG,MD', icons);
  await p.click('.bai-file >> nth=2 >> .bai-rm'); await p.waitForTimeout(700);
  check('remove file', await p.locator('.bai-file').count() === 2);
  const many = [1, 2, 3, 4].map(i => f('x' + i + '.txt', 'abc' + i));
  await p.setInputFiles('#bai-file', many);
  check('max 5 files', await p.locator('.bai-file').count() === 5 && /Tối đa 5 tệp/.test(await p.textContent('#bai-err')), await p.textContent('#bai-err'));
  for (let i = 4; i >= 2; i--) { await p.click('.bai-file >> nth=' + i + ' >> .bai-rm'); await p.waitForTimeout(700); }
  check('back to 2 files', await p.locator('.bai-file').count() === 2);

  // --- không có key ---
  await p.click('#bai-go');
  check('missing key message', /API key/.test(await p.textContent('#bai-msg')));
  check('no network yet', gemCalls.length === 0);

  // --- lỗi key ---
  await p.fill('#bai-key', 'TEST-KEY-123'); gemStatus = 403;
  await p.click('#bai-go'); await p.waitForSelector('#bai-msg:not(:empty)', { timeout: 8000 });
  check('bad key error shown', /API key/.test(await p.textContent('#bai-msg')), await p.textContent('#bai-msg'));
  check('files kept after error', await p.locator('.bai-file').count() === 2);

  // --- thành công ---
  gemStatus = 200; gemCalls = [];
  await p.fill('#bai-key', 'TEST-KEY-123');
  await p.click('#bai-go');
  await p.waitForSelector('#bai-busy');
  check('progress shown', /Đang đọc tài liệu/.test(await p.textContent('#bai-busy')));
  await p.waitForTimeout(1900);
  check('steps advance', await p.locator('.bai-steps li.is-done').count() >= 1);
  await p.waitForSelector('#bai-review', { timeout: 15000 });
  const call = gemCalls[gemCalls.length - 1];
  const parts = call.body.contents[0].parts;
  check('uses user key header', call.key === 'TEST-KEY-123');
  const mimes = parts.filter(x => x.inline_data).map(x => x.inline_data.mime_type).join();
  check('inline_data pdf + png', mimes === 'application/pdf,image/png', mimes);
  check('pdf base64 intact', Buffer.from(parts[0].inline_data.data, 'base64').toString().startsWith('%PDF'));
  check('prompt asks strict JSON', /JSON/.test(parts[parts.length - 1].text) && /guideline/.test(parts[parts.length - 1].text));
  check('responseMimeType json', call.body.generationConfig.responseMimeType === 'application/json');
  check('default model', /gemini-3\.5-flash-lite/.test(call.url));
  check('palette swatches (bad hex dropped)', await p.locator('#gl-pal .gl-swatch').count() === 3, await p.locator('#gl-pal .gl-swatch').count());
  check('personality chips', (await p.locator('.gl-chip.is-accent').count()) === 3);
  check('do/dont words', await p.locator('.gl-chip.is-do').count() === 2 && await p.locator('.gl-chip.is-dont').count() === 1);
  check('sample copy', /ra nghề thật/.test(await p.textContent('.gl-quote')));
  const warn = await p.textContent('.bai-warn');
  check('contrast warning (yellow primary darkened)', /tương phản/.test(warn), warn);
  await p.waitForTimeout(700);
  await p.screenshot({ path: SP + '/brand-ai-review-1400.png' });
  check('save + edit buttons', await p.isVisible('#bai-save') && await p.isVisible('#bai-edit'));

  // --- lưu ---
  await p.click('#bai-save'); await p.waitForTimeout(600);
  const saved = await p.evaluate(() => Object.values(JSON.parse(localStorage.ep_brands)));
  check('brand saved', saved.length === 1 && saved[0].name === 'Xclipse Academy');
  const s = saved[0] || {};
  check('primary darkened to AA', await p.evaluate((h) => EP.pageStyle.contrast(h, '#ffffff') >= 4.5, s.primary), s.primary);
  check('fields cleaned', s.button === 'solid' && s.radius === 'round' && s.tone === 'young' && s.headingFont === 'Playfair Display' && s.accent === '#d6336c', JSON.stringify(s));
  check('website normalized', s.website === 'https://xclipse.vn' && s.hotline === '0912345678');
  check('guideline stored', s.guideline && s.guideline.colorPalette.length === 3 && s.guideline.values.length === 3);
  check('guideline section on brand view', await p.isVisible('#brand-guideline'));
  check('editor shows saved name', await p.inputValue('#bf-name') === 'Xclipse Academy');
  check('card reset after save', await p.isVisible('#bai-drop') && await p.locator('.bai-file').count() === 0);
  await p.setViewportSize({ width: 390, height: 844 });
  await p.waitForTimeout(400);
  const sw = await p.evaluate(() => document.documentElement.scrollWidth);
  check('no horizontal scroll 390', sw <= 390, sw);
  await p.locator('#brand-guideline').scrollIntoViewIfNeeded();
  await p.waitForTimeout(500);
  await p.screenshot({ path: SP + '/brand-ai-guideline-390.png' });
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.screenshot({ path: SP + '/brand-ai-card-390.png' });
  await p.setViewportSize({ width: 1400, height: 900 });
  await p.fill('#bf-tagline', 'Đổi khẩu hiệu'); await p.press('#bf-tagline', 'Tab');
  check('guideline survives edit', await p.evaluate(() => Object.values(JSON.parse(localStorage.ep_brands))[0].guideline.summary.length > 5));

  // --- chỉnh sửa trước khi lưu (một ảnh PNG) ---
  await p.setInputFiles('#bai-file', png);
  await p.fill('#bai-key', 'TEST-KEY-123'); await p.click('#bai-go');
  await p.waitForSelector('#bai-review', { timeout: 15000 });
  await p.click('#bai-edit'); await p.waitForTimeout(600);
  check('editor prefilled', await p.inputValue('#bf-ctaText') === 'Giữ chỗ ngay' && await p.inputValue('#bf-voiceUse') === 'thực chiến, đồng hành');
  check('2 brands now', await p.evaluate(() => Object.keys(JSON.parse(localStorage.ep_brands)).length) === 2);

  // --- chế độ copy prompt ---
  await p.click('#brand-ai [data-mode="copy"]');
  check('prompt textarea', /Chỉ trả về đúng một khối JSON/.test(await p.inputValue('#bai-prompt')));
  await p.click('#bai-copy'); await p.waitForTimeout(200);
  check('copy feedback', /Đã copy/.test(await p.textContent('#bai-copy')));
  const before = gemCalls.length;
  await p.fill('#bai-paste', 'khong phai json'); await p.click('#bai-parse');
  check('bad paste error', /Không đọc được kết quả/.test(await p.textContent('#bai-msg')));
  await p.fill('#bai-paste', 'Đây là kết quả:\n```json\n' + JSON.stringify(Object.assign({}, CANNED, { name: 'Từ ChatGPT', primary: '#123456' })) + '\n```');
  await p.click('#bai-parse'); await p.waitForSelector('#bai-review');
  check('paste parsed to review', /Từ ChatGPT/.test(await p.textContent('#bai-review')));
  check('copy mode no api call', gemCalls.length === before);
  await p.click('#bai-save'); await p.waitForTimeout(500);
  check('pasted brand saved', await p.evaluate(() => Object.values(JSON.parse(localStorage.ep_brands)).some(x => x.name === 'Từ ChatGPT' && x.primary === '#123456' && x.guideline)));

  // --- motion-off ---
  await p.evaluate(() => EP.motion.setPref('off'));
  check('motion-off disables transitions', await p.evaluate(() => document.documentElement.classList.contains('motion-off') && getComputedStyle(document.querySelector('.bai-drop')).transitionDuration.startsWith('0')));
  await p.evaluate(() => EP.motion.setPref('on'));

  // --- cloud (khi đăng xuất) và gộp ---
  check('cloud api present', await p.evaluate(() => ['saveBrand', 'listBrands', 'deleteBrand'].every(k => typeof EP.cloud[k] === 'function')));
  check('listBrands signed-out empty', await p.evaluate(() => EP.cloud.listBrands().then(a => a.length === 0)));
  check('mergeCloud newer wins', await p.evaluate(() => { const id = Object.keys(JSON.parse(localStorage.ep_brands))[0]; const n = EP.brands.mergeCloud([{ id, name: 'Cloud tên', updatedAt: '2999-01-01T00:00:00Z' }, { id: 'brand_new', name: 'Mới', updatedAt: '2020-01-01' }]); return n === 2 && EP.brands.get(id).name === 'Cloud tên' && !!EP.brands.get('brand_new'); }));
  check('guideline size limit', await p.evaluate(() => EP.brands.cleanGuideline({ x: 'a'.repeat(13000) }) === null));
  check('only mocked Gemini used', gemCalls.every(c => c.key === 'TEST-KEY-123'));
  check('no page errors', errs.length === 0, errs.join('|'));
  await b.close();
  console.log(failed ? failed + ' FAILED of ' + total : 'ALL OK (' + total + ')');
  process.exit(failed ? 1 : 0);
})();
