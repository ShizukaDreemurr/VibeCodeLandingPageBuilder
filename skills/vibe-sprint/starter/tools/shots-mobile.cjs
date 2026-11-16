#!/usr/bin/env node
// Chụp ảnh điện thoại DỌC cho slide: mỗi tab một ảnh, sáng + tối, 390x844 @3x (ảnh PNG 1170x2532).
// Chạy (server đang chạy ở cổng của bạn):
//   node tools/shots-mobile.cjs http://localhost:8211/ shots-mobile            -> shots-mobile/01-home-light.png, 01-home-dark.png, 02-example-light.png ...
//   node tools/shots-mobile.cjs http://localhost:8211/ out --width 360 --height 780   (cỡ khác)
//   node tools/shots-mobile.cjs http://localhost:8211/ out --full                      (cả trang dài, không chỉ màn hình đầu)
//   node tools/shots-mobile.cjs http://localhost:8211/ out --all                       (thêm từng mục con của tab "Mô-đun": NN-playground-<mục>-light.png)
//   node tools/shots-mobile.cjs http://localhost:8211/ out --sheet                     (thêm ảnh hộp thoại dạng bottom sheet của nút [data-act="add"] nếu có)
// Cần Playwright (npm i -D playwright hoặc cài global). Dữ liệu demo tự nạp (?demo=1) nên ảnh luôn có số liệu mẫu.
const fs = require('fs');
const path = require('path');
let chromium;
try { ({ chromium } = require('playwright')); }
catch (e) { ({ chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright')); }

const args = process.argv.slice(2);
const flag = (n) => args.indexOf(n) >= 0;
const val = (n, d) => { const i = args.indexOf(n); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const pos = args.filter((a, i) => !a.startsWith('--') && !['--width', '--height', '--scale'].includes(args[i - 1]));
const URL = (pos.find((a) => /^https?:/.test(a)) || 'http://localhost:8211/').replace(/\/?$/, '/');
const OUT = pos.find((a) => !/^https?:/.test(a)) || 'shots-mobile';
const W = +val('--width', 390), H = +val('--height', 844), SCALE = +val('--scale', 3);
const FULL = flag('--full');
fs.mkdirSync(OUT, { recursive: true });
const pad = (n) => String(n).padStart(2, '0');

(async () => {
  const browser = await chromium.launch();
  let n = 0;
  for (const scheme of ['light', 'dark']) {
    const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: SCALE, isMobile: true, hasTouch: true, colorScheme: scheme, locale: 'vi-VN', timezoneId: 'Asia/Ho_Chi_Minh' });
    const page = await ctx.newPage();
    await page.goto(URL + '?demo=1');
    await page.waitForSelector('html[data-ready="1"]');
    const tabs = await page.evaluate(() => EP.router.list().map((v) => v.id));
    let i = 0;
    // --full: kéo cao khung nhìn bằng chiều cao trang để thanh tab/thanh hành động dính đáy nằm ĐÚNG CHỖ ở cuối ảnh (không bị lơ lửng giữa trang)
    const snap = async (file) => {
      if (FULL) { const h = await page.evaluate(() => Math.max(document.documentElement.scrollHeight, innerHeight)); await page.setViewportSize({ width: W, height: Math.min(h, 8000) }); await page.waitForTimeout(250); }
      await page.screenshot({ path: file });
      if (FULL) { await page.setViewportSize({ width: W, height: H }); await page.waitForTimeout(150); }
      n++;
    };
    const settle = () => page.evaluate(() => (document.fonts && document.fonts.ready) || 1).then(() => page.waitForTimeout(900));
    for (const t of tabs) {
      i++;
      await page.goto(URL + '#/' + t); await settle();
      await page.evaluate(() => window.scrollTo(0, 0));
      await snap(path.join(OUT, pad(i) + '-' + t + '-' + scheme + '.png'));
    }
    if (flag('--all') && tabs.includes('playground')) {
      const segs = await (async () => { await page.goto(URL + '#/playground'); await settle(); return page.$$eval('#view-playground [data-slot="pick"] input', (r) => r.map((x) => x.value)); })();
      let j = 0;
      for (const s of segs) {
        j++;
        await page.goto(URL + '#/playground'); await settle();
        await page.evaluate((v) => { const r = document.querySelector('#view-playground [data-slot="pick"] input[value="' + v + '"]'); r.click(); }, s);
        await settle();
        await snap(path.join(OUT, pad(tabs.indexOf('playground') + 1) + '-playground-' + pad(j) + '-' + s + '-' + scheme + '.png'));
      }
    }
    if (flag('--sheet')) {
      await page.goto(URL + '#/' + (tabs.find((t) => t !== 'home' && t !== 'settings') || 'home')); await settle();
      const add = await page.$('[data-act="add"]');
      if (add) { await add.click(); await page.waitForSelector('dialog[open]'); await settle(); await page.screenshot({ path: path.join(OUT, pad(tabs.length + 1) + '-sheet-' + scheme + '.png') }); n++; }
    }
    await ctx.close();
  }
  await browser.close();
  console.log('Đã chụp ' + n + ' ảnh (' + W + 'x' + H + ' @' + SCALE + 'x) vào ' + OUT + '/');
})().catch((e) => { console.error(e); process.exit(1); });
