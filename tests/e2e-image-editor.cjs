// Trình chỉnh ảnh: xoay/thu phóng bằng thanh trượt + ô số, cắt, huỷ/Esc, mở từ thanh công cụ, ảnh bìa có sẵn của mẫu, hoàn tác, 390px không tràn ngang.
// Dùng: node tests/e2e-image-editor.cjs <thư-mục-có-photo.jpg> [thư-mục-lưu-ảnh-chụp]
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const SP = process.argv[2] || require('os').tmpdir();
const SHOTS = process.argv[3] || '';
let failed = 0;
const ok = (name, cond, extra) => { if (!cond) failed++; console.log((cond ? '✓ ' : '✗ ') + name + (extra !== undefined ? '  ' + extra : '')); };
(async () => {
  const b = require('./auto-tab.cjs')(await chromium.launch());
  const p = await (await b.newContext({ viewport: { width: 1300, height: 900 } })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const imgs = () => p.evaluate(() => { const id = JSON.parse(localStorage.ep_current_id); return JSON.parse(localStorage.ep_events)[id].event.images || {}; });
  const dlgOpen = () => p.locator('dialog.ie-dialog[open]').count();
  const waitOpen = () => p.waitForSelector('dialog.ie-dialog[open] canvas', { timeout: 8000 });
  const waitClosed = () => p.waitForFunction(() => !document.querySelector('dialog.ie-dialog'), null, { timeout: 5000 });
  const shot = async (name) => { if (SHOTS) await p.screenshot({ path: SHOTS + '/' + name + '.png' }); };

  await p.goto('http://localhost:8000/'); await p.click('[data-tab="builder"]'); await p.click('#btn-sample'); await p.click('#btn-generate'); await p.waitForTimeout(900);

  // 1. Tải ảnh diễn giả → trình chỉnh tự mở, khung 1:1
  const [fc] = await Promise.all([p.waitForEvent('filechooser'), p.click('[data-slot="speaker:0"]')]);
  await fc.setFiles(SP + '/photo.jpg');
  await waitOpen();
  ok('editor opens after picking speaker photo', await dlgOpen() === 1);
  ok('1:1 chip is active', (await p.locator('.ie-chip.is-active').textContent()) === '1:1');
  await p.waitForTimeout(400);
  const cw = await p.inputValue('#ie-crop-w'), ch = await p.inputValue('#ie-crop-h');
  ok('crop box is square', cw === ch && Number(cw) > 0, cw + '×' + ch);
  const A = (await imgs()).speakers[0];
  ok('picked image stored', /^data:image\//.test(A));
  await shot('editor-desktop-avatar');

  // 2. Xoay bằng ô số → thanh trượt theo; thu phóng bằng thanh trượt → ô số theo
  await p.fill('#ie-rot-num', '45'); await p.waitForTimeout(100);
  ok('rotation number → slider', await p.inputValue('#ie-rot') === '45');
  await p.evaluate(() => { const r = document.querySelector('#ie-zoom'); r.value = 200; r.dispatchEvent(new Event('input', { bubbles: true })); });
  await p.waitForTimeout(100);
  ok('zoom slider → number', await p.inputValue('#ie-zoom-num') === '200');
  await p.fill('#ie-bright-num', '500'); await p.press('#ie-bright-num', 'Enter');
  ok('number is clamped to 100', await p.inputValue('#ie-bright-num') === '100' && await p.inputValue('#ie-bright') === '100');
  await p.fill('#ie-bright-num', '10'); await p.press('#ie-bright-num', 'Enter');
  await p.click('text=↻ +90°'); await p.waitForTimeout(500);
  ok('+90° button rotates (45 → 135)', await p.inputValue('#ie-rot') === '135', await p.inputValue('#ie-rot'));
  await p.fill('#ie-rot-num', '20');
  // khung cắt: gõ X → giữ trong ảnh
  await p.fill('#ie-crop-w', '200'); await p.press('#ie-crop-w', 'Enter');
  ok('crop width field (locked 1:1 → height follows)', await p.inputValue('#ie-crop-h') === '200');
  await p.fill('#ie-crop-x', '5'); await p.press('#ie-crop-x', 'Enter');
  ok('crop X field', await p.inputValue('#ie-crop-x') === '5');
  // phím mũi tên dịch khung (Shift = 10px)
  console.log('  crop before nudge', await p.evaluate(() => ['x','y','w','h'].map(f => document.querySelector('#ie-crop-' + f).value).join(',')));
  await p.focus('.ie-stage'); await p.keyboard.press('ArrowRight'); await p.keyboard.press('Shift+ArrowRight'); await p.waitForTimeout(100);
  ok('arrow keys nudge crop (+11px)', await p.inputValue('#ie-crop-x') === '16', await p.inputValue('#ie-crop-x'));
  // kéo khung bằng chuột
  const bb = await p.locator('.ie-crop').boundingBox();
  await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.mouse.down(); await p.mouse.move(bb.x + bb.width / 2 + 25, bb.y + bb.height / 2 + 18, { steps: 4 }); await p.mouse.up(); await p.waitForTimeout(80);
  ok('dragging moves the crop box', await p.inputValue('#ie-crop-x') !== '16');
  // kéo tay nắm góc, khoá 1:1
  const hb = await p.locator('.ie-h-se').boundingBox();
  await p.mouse.move(hb.x + 6, hb.y + 6); await p.mouse.down(); await p.mouse.move(hb.x - 30, hb.y - 30, { steps: 4 }); await p.mouse.up(); await p.waitForTimeout(80);
  ok('corner handle resize keeps 1:1', await p.inputValue('#ie-crop-w') === await p.inputValue('#ie-crop-h'), await p.inputValue('#ie-crop-w') + '×' + await p.inputValue('#ie-crop-h'));
  await p.click('.ie-chip:has-text("Tự do")'); await p.waitForTimeout(300);
  ok('free aspect chip', (await p.locator('.ie-chip.is-active').textContent()) === 'Tự do');
  await p.click('.ie-chip:has-text("1:1")');
  await p.click('.ie-foot button:has-text("Đặt lại")'); await p.waitForTimeout(300);
  ok('reset restores rotation/zoom', await p.inputValue('#ie-rot') === '0' && await p.inputValue('#ie-zoom') === '100');
  await p.fill('#ie-rot-num', '12'); await p.fill('#ie-contrast-num', '30');
  await p.click('.ie-foot button:has-text("Áp dụng")'); await waitClosed();
  const B = (await imgs()).speakers[0];
  ok('apply changes stored image', B !== A && /^data:image\//.test(B));
  ok('stored image ≤ avatar max (40000)', B.length <= 40000, B.length);
  ok('toast confirms', /Đã chỉnh ảnh/.test(await p.textContent('#toast')));

  // 3. Bấm ảnh → thanh công cụ có "Chỉnh ảnh", không có điều khiển chữ
  await p.click('[data-el="speaker.avatar.0"]');
  ok('inspector has Chỉnh ảnh', await p.locator('#inspector button:has-text("Chỉnh ảnh")').count() === 1);
  ok('inspector has Đổi ảnh / Xoá ảnh', await p.locator('#inspector button:has-text("Đổi ảnh")').count() === 1 && await p.locator('#inspector button:has-text("Xoá ảnh")').count() === 1);
  ok('font controls hidden for image', await p.locator('#inspector [aria-label="Cỡ chữ (px)"], #inspector [aria-label="In đậm"]').count() === 0);
  ok('"Chỉnh" button beside image button', await p.locator('.lp-speaker [data-edit-slot="speaker:0"]').count() === 1);

  // 4. Huỷ và Esc không đổi ảnh
  await p.click('#inspector button:has-text("Chỉnh ảnh")'); await waitOpen();
  await p.fill('#ie-rot-num', '90'); await p.click('.ie-foot button:has-text("Huỷ")'); await waitClosed();
  ok('Huỷ leaves image unchanged', (await imgs()).speakers[0] === B);
  await p.click('.lp-speaker [data-edit-slot="speaker:0"]'); await waitOpen();
  await p.fill('#ie-zoom-num', '300'); await p.keyboard.press('Escape'); await waitClosed();
  ok('Esc closes, image unchanged', (await imgs()).speakers[0] === B);
  await p.click('.lp-speaker [data-edit-slot="speaker:0"]'); await waitOpen();
  await p.keyboard.press('Enter'); await waitClosed();
  ok('Enter applies (re-encoded, still ≤ max)', (await imgs()).speakers[0].length <= 40000);
  const B2 = (await imgs()).speakers[0];

  // 5. Ảnh bìa có sẵn của mẫu → Chỉnh ảnh → lưu thành images.hero
  ok('hero has template art, no stored hero', !(await imgs()).hero && await p.locator('.lp-hero.has-art').count() === 1);
  await p.evaluate(() => EP.inspector.select('hero')); await p.waitForTimeout(250);
  ok('hero inspector has Chỉnh ảnh', await p.locator('#inspector button:has-text("Chỉnh ảnh")').count() === 1);
  ok('hero keeps box controls (colours)', await p.locator('#inspector .ins-color').count() > 0);
  ok('no Xoá ảnh while only template art', await p.locator('#inspector button:has-text("Xoá ảnh")').count() === 0);
  await p.click('#inspector button:has-text("Chỉnh ảnh")'); await waitOpen(); await p.waitForTimeout(500);
  ok('hero editor defaults to 16:9', (await p.locator('.ie-chip.is-active').textContent()) === '16:9');
  await shot('editor-desktop-hero');
  await p.click('.ie-chip:has-text("Tự do")');
  await p.fill('#ie-zoom-num', '130');
  await p.click('.ie-foot button:has-text("Áp dụng")'); await waitClosed();
  const H = (await imgs()).hero;
  ok('hero saved as dataURL', /^data:image\//.test(H || ''), H && H.length);
  ok('hero ≤ 320000', H && H.length <= 320000);
  ok('hero now has Xoá ảnh', await (async () => { await p.evaluate(() => { EP.inspector.close(); EP.inspector.select('hero'); }); await p.waitForTimeout(250); return await p.locator('#inspector button:has-text("Xoá ảnh")').count() === 1; })());

  // 6. Hoàn tác: ảnh bìa rồi ảnh diễn giả
  await p.evaluate(() => document.activeElement && document.activeElement.blur());
  await p.keyboard.press('Control+z'); await p.waitForTimeout(300);
  ok('Ctrl+Z removes edited hero', !(await imgs()).hero);
  await p.keyboard.press('Control+z'); await p.waitForTimeout(300);
  ok('Ctrl+Z again restores previous speaker image', (await imgs()).speakers[0] === B);

  // 7. Xoá ảnh diễn giả
  await p.click('[data-el="speaker.avatar.0"]'); await p.click('#inspector button:has-text("Xoá ảnh")'); await p.waitForTimeout(300);
  ok('Xoá ảnh removes speaker image', !(await imgs()).speakers[0] && await p.locator('div.lp-avatar').count() > 0);
  await p.keyboard.press('Control+z'); await p.waitForTimeout(300);
  ok('undo brings it back', !!(await imgs()).speakers[0]);

  // 8. 390px: xếp dọc, không tràn ngang
  await p.setViewportSize({ width: 390, height: 844 });
  const basePage = await p.evaluate(() => document.documentElement.scrollWidth);
  await p.evaluate(() => { EP.inspector.close(); window.__ie = EP.imageEditor.open({ src: Object.values(JSON.parse(localStorage.ep_events)[JSON.parse(localStorage.ep_current_id)].event.images.speakers)[0], aspect: 1, slot: EP.images.SLOTS.avatar }); });
  await waitOpen(); await p.waitForTimeout(600);
  const m = await p.evaluate(() => { const d = document.querySelector('dialog.ie-dialog'), r = d.getBoundingClientRect(); const ok = document.querySelector('.ie-foot .btn-primary').getBoundingClientRect(); return { page: document.documentElement.scrollWidth, win: innerWidth, dlgScroll: d.scrollWidth, dlgClient: d.clientWidth, bodyScroll: document.querySelector('.ie-body').scrollWidth, bodyClient: document.querySelector('.ie-body').clientWidth, right: Math.round(r.right), okVisible: ok.bottom <= innerHeight && ok.right <= innerWidth }; });
  ok('390px: no horizontal overflow', m.page <= Math.max(m.win, basePage) && m.dlgScroll <= m.dlgClient && m.bodyScroll <= m.bodyClient && m.right <= m.win, JSON.stringify(m) + ' base=' + basePage);
  ok('390px: Áp dụng stays visible', m.okVisible);
  await shot('editor-mobile');
  await p.evaluate(() => document.querySelector('.ie-body').scrollTo(0, 9999)); await p.waitForTimeout(200);
  await shot('editor-mobile-scrolled');
  await p.keyboard.press('Escape'); await waitClosed();
  ok('closing resolves null', await p.evaluate(() => window.__ie).then(v => v === null));

  ok('no page errors', errs.length === 0, errs.join(' | '));
  await b.close();
  console.log(failed ? failed + ' FAILED' : 'ALL OK');
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error('✗ crashed', e); process.exit(1); });
