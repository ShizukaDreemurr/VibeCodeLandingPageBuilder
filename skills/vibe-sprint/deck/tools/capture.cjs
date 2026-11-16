#!/usr/bin/env node
/* capture.cjs — chụp ảnh màn hình app cho slide (Playwright, chạy offline với app chạy local).
 *
 * Cách 1 (nhanh, 1 màn hình):
 *   node tools/capture.cjs --url http://localhost:8202/ --name home
 *   node tools/capture.cjs --url http://localhost:8202/ --name form --click '#btn-sample' --selector '#view-builder'
 *
 * Cách 2 (nhiều màn hình, khuyên dùng): file cấu hình JSON
 *   node tools/capture.cjs tools/capture.example.json
 *
 * Cấu hình JSON:
 * {
 *   "base": "http://localhost:8202/",        // gốc URL; mỗi view có thể dùng "url" tương đối hoặc tuyệt đối
 *   "out": "../assets",                      // thư mục ảnh (tính từ file cấu hình); mặc định deck/assets
 *   "desktop": [1600, 1000], "mobile": [390, 844],
 *   "reduceMotion": true,                    // tắt animation cho ảnh sạch (mặc định true)
 *   "views": [
 *     { "name": "home", "url": "index.html?demo=1",
 *       "steps": [ {"click":"#btn"}, {"fill":["#f-name","Tên"]}, {"select":["select[name=status]","done"]}, {"press":"Enter"}, {"wait":800},
 *                  {"waitFor":".card"}, {"hide":".popup"}, {"scroll":"#section"}, {"eval":"document.title='x'"},
 *                  {"storage":{"key":"value"}} ],       // storage: đặt localStorage TRƯỚC khi mở trang
 *       "selector": "#view-editor",            // (tuỳ chọn) chỉ chụp phần tử này
 *       "fullPage": false,
 *       "devices": ["desktop","mobile"]        // mặc định ["desktop"]; ảnh mobile đặt tên <name>-m.png
 *     }
 *   ]
 * }
 * Ảnh ra: <out>/<name>.png (1600x1000) và <out>/<name>-m.png (390x844, deviceScaleFactor 2).
 */
const fs = require('fs'), path = require('path'), cp = require('child_process');

function loadPlaywright() {
  const tries = [() => require('playwright'), () => require(path.join(cp.execSync('npm root -g').toString().trim(), 'playwright')),
    () => require('playwright-core'), () => require(path.join(cp.execSync('npm root -g').toString().trim(), 'playwright-core'))];
  for (const t of tries) { try { return t(); } catch (e) { /* thử tiếp */ } }
  console.error('Không tìm thấy Playwright. Cài: npm i -g playwright && npx playwright install chromium'); process.exit(1);
}

function parseArgs(argv) {
  const a = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (t.startsWith('--')) { const k = t.slice(2); const v = (argv[i + 1] && !argv[i + 1].startsWith('--')) ? argv[++i] : true; if (a[k] === undefined) a[k] = v; else a[k] = [].concat(a[k], v); }
    else a._.push(t);
  }
  return a;
}

async function runSteps(page, steps) {
  for (const s of steps || []) {
    if (s.click) await page.click(s.click, { timeout: 8000 });
    else if (s.fill) await page.fill(s.fill[0], s.fill[1]);
    else if (s.select) await page.selectOption(s.select[0], s.select[1]);
    else if (s.press) await page.keyboard.press(s.press);
    else if (s.wait) await page.waitForTimeout(s.wait);
    else if (s.waitFor) await page.waitForSelector(s.waitFor, { timeout: 10000 });
    else if (s.hide) await page.addStyleTag({ content: `${s.hide}{display:none!important}` });
    else if (s.scroll) await page.$eval(s.scroll, el => el.scrollIntoView({ block: 'start' }));
    else if (s.eval) await page.evaluate(s.eval);
    else if (s.optionalClick) { try { await page.click(s.optionalClick, { timeout: 1500 }); } catch (e) { /* bỏ qua */ } }
  }
}

(async () => {
  const args = parseArgs(process.argv.slice(2));
  let cfg, cfgDir = process.cwd();
  if (args._[0]) { const f = path.resolve(args._[0]); cfg = JSON.parse(fs.readFileSync(f, 'utf8')); cfgDir = path.dirname(f); }
  else if (args.url) {
    cfg = { views: [{ name: args.name || 'screen', url: args.url, selector: args.selector, fullPage: !!args.fullPage,
      steps: [].concat(args.click || []).map(c => ({ click: c })), devices: args.mobile ? ['desktop', 'mobile'] : ['desktop'] }] };
    if (args.out) cfg.out = path.resolve(args.out);
  } else { console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0]); process.exit(args.help ? 0 : 1); }

  const deckDir = path.resolve(__dirname, '..');
  const out = cfg.out ? path.resolve(cfgDir, cfg.out) : path.join(deckDir, 'assets');
  fs.mkdirSync(out, { recursive: true });
  const D = cfg.desktop || [1600, 1000], M = cfg.mobile || [390, 844];
  const { chromium } = loadPlaywright();
  const browser = await chromium.launch();
  let fail = 0;
  for (const v of cfg.views) {
    for (const dev of (v.devices || ['desktop'])) {
      const mobile = dev === 'mobile', vp = mobile ? M : D;
      const ctx = await browser.newContext({
        viewport: { width: vp[0], height: vp[1] }, deviceScaleFactor: mobile ? 2 : 1,
        isMobile: mobile, hasTouch: mobile, locale: 'vi-VN', timezoneId: 'Asia/Ho_Chi_Minh',
        reducedMotion: cfg.reduceMotion === false ? 'no-preference' : 'reduce'
      });
      const steps = v.steps || [];
      const store = steps.filter(s => s.storage).reduce((o, s) => Object.assign(o, s.storage), {});
      if (Object.keys(store).length) await ctx.addInitScript(o => { for (const k in o) { try { localStorage.setItem(k, o[k]); } catch (e) {} } }, store);
      const page = await ctx.newPage();
      page.on('dialog', d => d.accept());
      const url = /^https?:|^file:/.test(v.url || '') ? v.url : (cfg.base || '') + (v.url || '');
      const file = path.join(out, v.name + (mobile ? '-m' : '') + '.png');
      try {
        await page.goto(url, { waitUntil: 'load', timeout: 30000 });
        await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
        await page.waitForTimeout(v.settle || 900);
        await runSteps(page, steps.filter(s => !s.storage));
        await page.waitForTimeout(v.after || 600);
        if (v.selector) await (await page.waitForSelector(v.selector, { timeout: 10000 })).screenshot({ path: file });
        else await page.screenshot({ path: file, fullPage: !!v.fullPage });
        console.log('OK  ', path.relative(process.cwd(), file) || file, `(${vp[0]}x${vp[1]}${mobile ? ' @2x' : ''})`);
      } catch (e) { fail++; console.error('LỖI ', v.name, dev, '-', e.message.split('\n')[0]); }
      await ctx.close();
    }
  }
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
