#!/usr/bin/env node
/* export.cjs — xuất deck.html (với file dữ liệu chỉ định) ra PDF (1 trang/slide), PNG từng slide, và PPTX (nếu có pptxgenjs).
 *
 *   node tools/export.cjs                      # dùng deck.data.js
 *   node tools/export.cjs example.data.js      # dùng file dữ liệu khác (đường dẫn tính từ thư mục deck/)
 *   node tools/export.cjs deck.data.js --out out --name Xclipse --no-pptx --scale 1
 *
 * Kết quả trong deck/out/ (hoặc --out):  <name>.pdf, png/slide-01.png ..., <name>.pptx (nếu pptxgenjs có sẵn)
 * PNG 1920x1080 (--scale 2 cho 3840x2160). PDF kích thước 1920x1080 px, giữ chữ thật, QR là vector.
 * PPTX: mỗi slide là 1 ảnh PNG (không sửa chữ được) + ghi chú trình bày. Cài: npm i pptxgenjs (trong thư mục deck/).
 */
const fs = require('fs'), path = require('path'), cp = require('child_process');
const deckDir = path.resolve(__dirname, '..');

function loadMod(name) {
  const g = () => cp.execSync('npm root -g').toString().trim();
  const tries = [() => require(name), () => require(path.join(deckDir, 'node_modules', name)), () => require(path.join(g(), name))];
  for (const t of tries) { try { return t(); } catch (e) { /* thử tiếp */ } }
  return null;
}
const args = (() => { const a = { _: [] }, v = process.argv.slice(2); for (let i = 0; i < v.length; i++) { if (v[i].startsWith('--')) { const k = v[i].slice(2); a[k] = (v[i + 1] && !v[i + 1].startsWith('--')) ? v[++i] : true; } else a._.push(v[i]); } return a; })();

(async () => {
  const pw = loadMod('playwright') || loadMod('playwright-core');
  if (!pw) { console.error('Không tìm thấy Playwright. Cài: npm i -g playwright && npx playwright install chromium'); process.exit(1); }
  const dataFile = args._[0] || 'deck.data.js';
  if (!fs.existsSync(path.join(deckDir, dataFile))) { console.error('Không thấy file dữ liệu: ' + dataFile); process.exit(1); }
  const name = args.name || path.basename(dataFile).replace(/\.data\.js$|\.js$/, '') || 'deck';
  const out = path.resolve(args.out || path.join(deckDir, 'out'));
  const pngDir = path.join(out, 'png');
  fs.mkdirSync(pngDir, { recursive: true });
  const scale = Number(args.scale) || 1;

  const browser = await pw.chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: scale, locale: 'vi-VN', reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  // phục vụ qua file:// để chạy offline, không cần server (ảnh trong assets/ là đường dẫn tương đối)
  const url = 'file://' + path.join(deckDir, 'deck.html') + '?export=1&data=' + encodeURIComponent(dataFile);
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForSelector('html[data-ready="1"]', { timeout: 15000 });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all([...document.images].map(i => i.complete ? 1 : new Promise(r => { i.onload = i.onerror = r; }))));
  await page.waitForTimeout(500);

  const slides = await page.$$('.slide');
  const notes = await page.evaluate(() => (window.DECK && window.DECK.slides || []).map(s => s.notes || ''));
  const broken = await page.evaluate(() => [...document.querySelectorAll('.shot.missing')].map(e => e.dataset.missing));
  if (broken.length) console.warn('CẢNH BÁO ảnh thiếu / không tải được:\n  - ' + broken.join('\n  - '));

  // PNG từng slide
  const pngs = [];
  for (let i = 0; i < slides.length; i++) {
    const f = path.join(pngDir, 'slide-' + String(i + 1).padStart(2, '0') + '.png');
    await slides[i].screenshot({ path: f }); pngs.push(f);
  }
  console.log('PNG  ', slides.length, 'slide ->', path.relative(process.cwd(), pngDir) || pngDir);

  // PDF: 1 slide = 1 trang 1920x1080 px
  const pdf = path.join(out, name + '.pdf');
  await page.emulateMedia({ media: 'print' });
  await page.pdf({ path: pdf, width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  console.log('PDF  ', path.relative(process.cwd(), pdf) || pdf);
  await browser.close();

  // PPTX (tuỳ chọn)
  if (!args['no-pptx']) {
    const Pptx = loadMod('pptxgenjs');
    if (!Pptx) console.log('PPTX  bỏ qua: chưa có pptxgenjs (cd deck && npm i pptxgenjs để bật).');
    else {
      const p = new Pptx(); p.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5 in (16:9)
      pngs.forEach((f, i) => { const s = p.addSlide(); s.addImage({ path: f, x: 0, y: 0, w: 13.333, h: 7.5 }); if (notes[i]) s.addNotes(notes[i]); });
      const f = path.join(out, name + '.pptx'); await p.writeFile({ fileName: f });
      console.log('PPTX ', path.relative(process.cwd(), f) || f, '(mỗi slide là một ảnh)');
    }
  }
  if (errors.length) console.warn('Lỗi JS trong trang:', errors.join(' | '));
})().catch(e => { console.error(e); process.exit(1); });
