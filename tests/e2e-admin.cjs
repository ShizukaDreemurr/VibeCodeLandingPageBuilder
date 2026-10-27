// Tab "Danh sách đăng ký": chọn landing page trước, số liệu riêng từng trang.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs');
const URL = 'http://localhost:8000/index.html';
const shots = process.argv[2];
let failed = 0;
const ok = (name, cond, extra) => { if (cond) console.log('✓', name); else { failed++; console.log('✗', name, extra === undefined ? '' : JSON.stringify(extra)); } };

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1400, height: 900 }, acceptDownloads: true });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  p.on('dialog', d => d.accept());
  await p.goto(URL);
  // Sự kiện đang mở trong trình soạn thảo
  await p.click('#btn-sample'); await p.click('#btn-generate');
  const cur = await p.evaluate(() => localStorage.getItem('ep_current_id'));
  const curName = await p.inputValue('#f-name');

  // Nhân thêm 3 trang: A (sắp hết chỗ), B (còn nhiều chỗ), C (đã diễn ra) với đăng ký riêng
  await p.evaluate(() => {
    const all = JSON.parse(localStorage.getItem('ep_events'));
    const base = all[Object.keys(all)[0]];
    const day = 86400000;
    const mk = (id, name, startAt, capacity, location) => {
      const r = JSON.parse(JSON.stringify(base));
      r.event.id = id; r.event.name = name; r.event.startAt = startAt; r.event.capacity = capacity; r.event.location = location;
      delete r.event.published; delete r.event.ownerUid; r.event.sheetUrl = '';
      all[id] = r;
    };
    const iso = ms => new Date(Date.now() + ms).toISOString().slice(0, 16);
    mk('evtA', 'Landing Alpha', iso(5 * day), 10, 'Hà Nội');
    mk('evtB', 'Landing Beta', iso(3 * day), 100, 'Đà Nẵng');
    mk('evtC', 'Landing Cũ', iso(-4 * day), 50, 'Huế');
    localStorage.setItem('ep_events', JSON.stringify(all));
    const reg = (id, i, name, status) => ({ id: 'r' + id + i, name, phone: '09' + (10000000 + i * 111 + id.length).toString().slice(0, 8), email: name.toLowerCase().replace(/\W/g, '') + '@x.vn', status: status || 'new', createdAt: new Date().toISOString(), synced: true });
    localStorage.setItem('ep_regs_evtA', JSON.stringify(['An', 'Bình', 'Chi', 'Dũng', 'Em', 'Phúc', 'Giang', 'Hà', 'Ivy'].map((n, i) => reg('evtA', i, 'Alpha ' + n)).concat([reg('evtA', 20, 'Alpha Chờ', 'waitlist')])));
    localStorage.setItem('ep_regs_evtB', JSON.stringify([reg('evtB', 1, 'Beta Một'), reg('evtB', 2, 'Beta Hai')]));
    localStorage.setItem('ep_regs_evtC', JSON.stringify([reg('evtC', 1, 'Cũ Một')]));
  });
  await p.reload();
  await p.click('[data-tab="admin"]');

  // Màn chọn
  ok('picker shown first', await p.isVisible('#admin-picker') && !(await p.isVisible('#admin-detail')));
  const pickText = id => p.textContent(`.admin-pick[data-event-id="${id}"]`);
  const a = await pickText('evtA'), bb = await pickText('evtB'), c = await pickText('evtC');
  ok('A count 9 + status Sắp hết chỗ', /9\s*đăng ký/.test(a) && a.includes('Sắp hết chỗ') && a.includes('Chỉ trên máy này') && a.includes('Hà Nội'), a);
  ok('B count 2 + Đang mở đăng ký', /2\s*đăng ký/.test(bb) && bb.includes('Đang mở đăng ký'), bb);
  ok('C ended listed under Đã kết thúc', await p.locator('details[data-group="ended"] .admin-pick[data-event-id="evtC"]').count() === 1 && c.includes('Đã diễn ra') && /1\s*đăng ký/.test(c), c);
  ok('ended group collapsed by default', await p.$eval('details[data-group="ended"]', d => !d.open));
  ok('active sorted by start date', JSON.stringify(await p.$$eval('section[data-group="active"] .admin-pick', l => l.map(x => x.dataset.eventId).filter(i => /^evt[AB]$/.test(i)))) === '["evtB","evtA"]');
  ok('no search box for <=6 events', !(await p.isVisible('#admin-search')));
  if (shots) await p.screenshot({ path: shots + '/admin-picker-1400.png', fullPage: true });

  // Mở A
  await p.click('.admin-pick[data-event-id="evtA"]');
  ok('detail title A', (await p.textContent('#admin-title')).startsWith('Danh sách đăng ký – Landing Alpha'));
  const namesA = await p.$$eval('#admin-rows tr td:nth-child(2)', l => l.map(x => x.textContent));
  ok('A table only A rows', namesA.length === 10 && namesA.every(n => n.startsWith('Alpha')), namesA);
  await p.waitForTimeout(900);
  const mA = await p.$$eval('.metric', m => m.map(x => x.textContent.replace(/\s+/g, ' ')));
  ok('A metrics 9 / 1', mA[0].includes('9') && mA[1].includes('1'), mA);
  if (shots) await p.screenshot({ path: shots + '/admin-detail-1400.png', fullPage: true });
  // CSV của A
  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#btn-export')]);
  const csv = fs.readFileSync(await dl.path(), 'utf8');
  ok('CSV filename is A', dl.suggestedFilename() === 'dang-ky-landing-alpha.csv', dl.suggestedFilename());
  ok('CSV has only A', csv.includes('Alpha An') && !csv.includes('Beta') && csv.trim().split(/\r?\n/).length === 11);

  // Quay lại, mở B
  await p.click('#btn-admin-back');
  ok('back shows picker', await p.isVisible('#admin-picker') && !(await p.isVisible('#admin-detail')));
  await p.click('.admin-pick[data-event-id="evtB"]');
  const namesB = await p.$$eval('#admin-rows tr td:nth-child(2)', l => l.map(x => x.textContent));
  ok('B table only B rows', namesB.length === 2 && namesB.every(n => n.startsWith('Beta')), namesB);
  ok('B title', (await p.textContent('#admin-title')).includes('Landing Beta (2 người)'));
  // Đăng ký mới ở trang khác không làm lẫn
  await p.evaluate(() => { const k = 'ep_regs_evtA'; const r = JSON.parse(localStorage.getItem(k)); r.pop(); localStorage.setItem(k, JSON.stringify(r)); });
  ok('B unaffected by A change', (await p.$$eval('#admin-rows tr', l => l.length)) === 2);

  // Nhớ lựa chọn sau khi tải lại
  await p.reload();
  await p.click('[data-tab="admin"]');
  ok('remembered selection after reload', await p.isVisible('#admin-detail') && (await p.textContent('#admin-title')).includes('Landing Beta'));
  // Trang đã nhớ bị xoá → về màn chọn
  await p.evaluate(() => { const all = JSON.parse(localStorage.getItem('ep_events')); delete all.evtB; localStorage.setItem('ep_events', JSON.stringify(all)); });
  await p.click('[data-tab="builder"]'); await p.click('[data-tab="admin"]');
  ok('deleted event falls back to picker', await p.isVisible('#admin-picker') && await p.locator('.admin-pick[data-event-id="evtB"]').count() === 0);

  // Trình soạn thảo không bị đổi
  ok('editor current id unchanged', (await p.evaluate(() => localStorage.getItem('ep_current_id'))) === cur);
  await p.click('[data-tab="editor"]');
  ok('editor still same event', (await p.inputValue('#f-name')) === curName);

  // Menu "Xuất danh sách đăng ký (CSV)" mở thẳng trang đang soạn
  await p.evaluate(() => localStorage.removeItem('ep_admin_event'));
  // Sự kiện đang soạn chưa có đăng ký → chỉ kiểm tra mở đúng chi tiết
  const item = p.locator('.mb-item:has-text("Xuất danh sách đăng ký")');
  let opened = false;
  for (const h of await p.$$('#menubar .mb-btn')) { await h.click().catch(() => {}); if (await item.first().isVisible()) { opened = true; break; } }
  ok('menu item reachable', opened);
  if (opened) {
    await item.first().click();
    await p.waitForTimeout(300);
    ok('menu CSV opens current event detail', await p.isVisible('#admin-detail') && (await p.textContent('#admin-title')).includes(curName), await p.textContent('#admin-title'));
  }

  // Tìm kiếm khi > 6 trang + trạng thái rỗng
  await p.evaluate(() => {
    const all = JSON.parse(localStorage.getItem('ep_events')); const base = all.evtA;
    for (let i = 0; i < 6; i++) { const r = JSON.parse(JSON.stringify(base)); r.event.id = 'evtX' + i; r.event.name = 'Trang phụ ' + i; all['evtX' + i] = r; }
    localStorage.setItem('ep_events', JSON.stringify(all)); localStorage.removeItem('ep_admin_event');
  });
  await p.reload(); await p.click('[data-tab="admin"]');
  ok('search box with >6 events', await p.isVisible('#admin-search'));
  await p.fill('#admin-search', 'phụ 3');
  ok('search filters', await p.locator('.admin-pick').count() === 1);
  await p.fill('#admin-search', '');

  // Mobile
  await p.setViewportSize({ width: 390, height: 844 });
  await p.waitForTimeout(300);
  ok('no horizontal overflow (picker, 390px)', await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth), await p.evaluate(() => document.documentElement.scrollWidth));
  if (shots) await p.screenshot({ path: shots + '/admin-picker-390.png' });
  await p.click('.admin-pick[data-event-id="evtA"]');
  await p.waitForTimeout(900);
  ok('no horizontal overflow (detail, 390px)', await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth), await p.evaluate(() => document.documentElement.scrollWidth));
  if (shots) await p.screenshot({ path: shots + '/admin-detail-390.png' });

  // Trạng thái rỗng
  await p.evaluate(() => { localStorage.setItem('ep_events', '{}'); localStorage.removeItem('ep_admin_event'); localStorage.removeItem('ep_current_id'); });
  await p.reload(); await p.click('[data-tab="admin"]');
  ok('empty state', (await p.textContent('#admin-pick-list')).includes('Chưa có landing page nào'));
  await p.click('#admin-pick-list .btn-primary');
  ok('empty button goes to builder', await p.isVisible('#view-builder'));

  ok('no page errors', errs.length === 0, errs);
  await b.close();
  console.log(failed ? failed + ' FAILED' : 'ALL OK');
  process.exit(failed ? 1 : 0);
})();
