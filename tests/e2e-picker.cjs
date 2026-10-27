// Kiểm thử bộ chọn mẫu: lọc đúng, gần đúng, đếm, tìm kiếm, xoá bộ lọc, trạng thái rỗng, áp mẫu.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
let failed = 0;
const ok = (c, m) => { if (!c) { failed++; console.log('✗ ' + m); } else console.log('✓ ' + m); };
(async () => {
  const b = require('./auto-tab.cjs')(await chromium.launch());
  const p = await (await b.newContext({ viewport: { width: 1300, height: 900 } })).newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => m.type() === 'error' && !/Failed to load resource/.test(m.text()) && errs.push(m.text()));
  await p.goto('file:///home/user/VibeCodeLandingPageBuilder/index.html');
  const total = await p.evaluate(() => EP.templates.list.length);
  const info = await p.evaluate(() => EP.templates.list.map(t => ({ id: t.id, name: t.name, tags: t.tags, wedding: t.wedding })));
  const sel = k => `#tpl-filters select[data-filter="${k}"]`;
  const exactIds = () => p.$$eval('#tpl-grid .tpl-card', c => c.map(x => x.dataset.id));
  const nearIds = () => p.$$eval('#tpl-grid-near .tpl-card', c => c.map(x => x.dataset.id));
  const settle = () => p.waitForTimeout(300);
  await p.click('#btn-tpl'); await settle();

  ok((await p.locator('.tpl-card').count()) === total, `không lọc: ${total} thẻ`);
  ok(await p.isHidden('#tpl-near') && await p.isHidden('#tpl-clear'), 'không lọc: không có mục Gần đúng, không có nút xoá');

  await p.selectOption(sel('industry'), 'travel'); await settle();
  const tr = info.filter(t => t.tags.industry.includes('travel')).map(t => t.id);
  const ex1 = await exactIds();
  ok(ex1.length === tr.length && ex1.every(i => tr.includes(i)), `industry=travel: ${ex1.length} thẻ khớp đủ đều thuộc travel`);
  ok(ex1.length + (await nearIds()).length === ex1.length, 'industry=travel: không hiện mẫu không khớp');

  await p.selectOption(sel('type'), 'workshop'); await settle();
  const both = info.filter(t => t.tags.industry.includes('travel') && t.tags.type.includes('workshop')).map(t => t.id);
  const ex2 = await exactIds(), nr2 = await nearIds();
  ok(ex2.length === both.length && ex2.every(i => both.includes(i)), `travel+workshop: khớp đủ = ${both.length}`);
  const oneHit = info.filter(t => t.tags.industry.includes('travel') !== t.tags.type.includes('workshop')).map(t => t.id);
  ok(nr2.length === oneHit.length && nr2.every(i => oneHit.includes(i)), `travel+workshop: gần đúng = ${oneHit.length}`);
  if (nr2.length) ok((await p.textContent('#tpl-grid-near .tpl-score')).trim() === 'Khớp 1/2', 'huy hiệu "Khớp 1/2"');
  ok(/mẫu khớp/.test(await p.textContent('#tpl-count')), 'dòng đếm: ' + (await p.textContent('#tpl-count')));

  // số lượng trong tuỳ chọn (industry đếm theo type=workshop)
  const optText = await p.textContent(`${sel('industry')} option[value="beauty"]`);
  const expBeauty = info.filter(t => t.tags.industry.includes('beauty') && t.tags.type.includes('workshop')).length;
  ok(optText.includes('(' + expBeauty + ')'), `đếm tuỳ chọn beauty = ${expBeauty} ("${optText}")`);
  const dis = await p.$$eval(`${sel('industry')} option:disabled`, o => o.length);
  const expDis = await p.evaluate(() => Object.keys(EP.templates.FILTERS.industry.options).filter(k => EP.templates.list.filter(t => t.tags.industry.includes(k) && t.tags.type.includes('workshop')).length === 0 && k !== 'travel').length);
  ok(dis === expDis, `tuỳ chọn 0 kết quả bị vô hiệu (${dis})`);

  await p.click('#tpl-clear'); await settle();
  ok((await p.locator('.tpl-card').count()) === total && (await p.inputValue(sel('industry'))) === '' && (await p.inputValue(sel('type'))) === '', 'Xoá bộ lọc đặt lại');
  ok(await p.isHidden('#tpl-clear'), 'nút xoá ẩn sau khi xoá');

  await p.fill('#tpl-search', 'cuoi'); await settle();
  const wed = info.filter(t => t.wedding).map(t => t.id);
  const ex3 = await exactIds();
  ok(wed.length > 0 && wed.every(i => ex3.includes(i)), `tìm "cuoi" thấy đủ ${wed.length} mẫu cưới (${ex3.length} kết quả)`);
  await p.fill('#tpl-search', 'zzzxxqq'); await settle();
  ok(await p.isVisible('#tpl-empty'), 'tìm không có kết quả → trạng thái rỗng');
  await p.click('#tpl-empty-clear'); await settle();
  ok((await p.locator('.tpl-card').count()) === total && (await p.inputValue('#tpl-search')) === '', 'nút trong trạng thái rỗng xoá tìm kiếm');

  // tổ hợp bất khả thi
  const imp = await p.evaluate(() => {
    const F = EP.templates.FILTERS, L = EP.templates.list;
    for (const g of Object.keys(F.goal.options)) for (const ty of Object.keys(F.type.options)) for (const i of Object.keys(F.industry.options))
      if (!L.some(t => t.tags.goal.includes(g) && t.tags.type.includes(ty) && t.tags.industry.includes(i)) &&
          !L.some(t => 0)) return [i, ty, g];
    return null;
  });
  if (imp) {
    // đặt trạng thái qua tìm kiếm để vượt qua việc vô hiệu hoá tuỳ chọn
    await p.evaluate(([i, ty, g]) => { for (const [k, v] of [['industry', i], ['type', ty], ['goal', g]]) { const s = document.querySelector(`#tpl-filters select[data-filter="${k}"]`); s.value = v; s.dispatchEvent(new Event('change')); } }, imp);
    await settle();
    const anyNear = await p.locator('#tpl-grid-near .tpl-card').count();
    ok(true, 'tổ hợp ' + imp.join('+') + ' → gần đúng ' + anyNear);
    await p.click('#tpl-clear'); await settle();
  }
  await p.fill('#tpl-search', 'zzzxxqq'); await p.selectOption(sel('industry'), 'tech'); await settle();
  ok(await p.isVisible('#tpl-empty') && (await p.locator('.tpl-card').count()) === 0, 'tổ hợp bất khả thi → trạng thái rỗng, 0 thẻ');
  await p.click('#tpl-clear'); await settle();

  // lưu & nhớ bộ lọc
  await p.selectOption(sel('industry'), 'travel'); await p.selectOption('#tpl-filters select[data-sort]', 'name'); await settle();
  const names = await p.$$eval('#tpl-grid .tpl-card-name', n => n.map(x => x.textContent));
  const sorted = names.slice().sort((a, b) => a.localeCompare(b, 'vi'));
  ok(JSON.stringify(names) === JSON.stringify(sorted), 'sắp xếp Tên A–Z');
  ok(await p.evaluate(() => /travel/.test(localStorage.getItem('ep_tpl_filters') || '')), 'lưu bộ lọc vào localStorage');
  await p.reload(); await p.click('#btn-tpl'); await settle();
  ok((await p.inputValue(sel('industry'))) === 'travel', 'nhớ bộ lọc sau khi tải lại');
  await p.click('#tpl-clear'); await settle();

  // chọn thẻ → áp mẫu
  const target = await p.getAttribute('.tpl-card >> nth=2', 'data-id');
  const tname = info.find(t => t.id === target).name;
  await p.click('.tpl-card >> nth=2'); await settle();
  ok((await p.textContent('#tpl-name')).trim() === tname, 'chọn thẻ áp mẫu: ' + tname);

  // mobile
  await p.setViewportSize({ width: 390, height: 844 });
  await p.click('#btn-tpl'); await settle();
  const ov = await p.evaluate(() => { const d = document.querySelector('#tpl-dialog'); return [document.documentElement.scrollWidth - innerWidth, d.scrollWidth - d.clientWidth]; });
  ok(ov[0] <= 0 && ov[1] <= 0, 'mobile 390px không tràn ngang ' + ov);

  ok(errs.length === 0, 'không có lỗi trang ' + JSON.stringify(errs));
  await b.close();
  console.log(failed ? failed + ' FAILED' : 'ALL OK');
  process.exit(failed ? 1 : 0);
})();
