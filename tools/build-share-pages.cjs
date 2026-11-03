// Tạo trang chia sẻ tĩnh cho các landing page mẫu: s/<mã>/index.html
// Bot Facebook/Zalo không chạy JavaScript, nên meta (og:title, og:description, og:image) phải nằm sẵn trong HTML.
// Trang tĩnh chứa đủ meta rồi chuyển người xem sang trang thật ?e=<mã>.
// Cách chạy (cần server ở :8000):  node tools/build-share-pages.cjs
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const LOCAL = process.env.BASE || 'http://localhost:8000/';
const PROD = 'https://shizukadreemurr.github.io/VibeCodeLandingPageBuilder/';
const ROOT = path.join(__dirname, '..');

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto(LOCAL + '?demo=1');
  await p.waitForFunction(() => window.EP && EP.demo && EP.demo.publicEvent);
  const keys = [...fs.readFileSync(path.join(ROOT, 'js/demo-data.js'), 'utf8').matchAll(/\{ key: '([a-z0-9_]+)'/g)].map(m => m[1]);
  const ids = await p.evaluate(ks => ks.map(k => 'demo_evt_' + k).filter(id => EP.demo.publicEvent(id)), keys);
  const made = [];
  for (const id of ids) {
    const q = await b.newPage();
    await q.goto(LOCAL + '?e=' + id);
    await q.waitForFunction(() => document.querySelector('meta[property="og:title"]') && document.title && !/^Xclipse/.test(document.title), null, { timeout: 15000 });
    const head = await q.evaluate(() => {
      const metas = [...document.head.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"], meta[name="description"], meta[name="robots"], meta[name="theme-color"]')]
        .map(m => [m.hasAttribute('property') ? 'property' : 'name', m.getAttribute('property') || m.getAttribute('name'), m.getAttribute('content') || '']);
      const ld = [...document.head.querySelectorAll('script[type="application/ld+json"]')].map(s => s.textContent);
      return { title: document.title, metas, ld };
    });
    await q.close();
    // Ảnh chia sẻ JPEG 1200x630 (Zalo/Facebook đọc ổn định nhất), cắt từ ảnh og:image của trang
    const og = head.metas.find(m => m[1] === 'og:image');
    let ogJpg = '';
    if (og && og[2]) {
      const src = og[2].split(PROD).join(LOCAL);
      const shot = await b.newPage({ viewport: { width: 1200, height: 630 } });
      await shot.setContent('<html><body style="margin:0;background:#111"><img src="' + esc(src) + '" style="width:1200px;height:630px;object-fit:cover;display:block"></body></html>');
      await shot.waitForFunction(() => { const i = document.images[0]; return i && i.complete && i.naturalWidth > 0; }, null, { timeout: 15000 }).catch(() => {});
      fs.mkdirSync(path.join(ROOT, 'assets', 'og'), { recursive: true });
      await shot.screenshot({ path: path.join(ROOT, 'assets', 'og', id + '.jpg'), type: 'jpeg', quality: 82 });
      await shot.close();
      ogJpg = PROD + 'assets/og/' + id + '.jpg';
    }
    const page = PROD + '?e=' + encodeURIComponent(id);
    const self = PROD + 's/' + id + '/';
    const fix = v => v.split(LOCAL).join(PROD);
    let html = '<!doctype html>\n<html lang="vi">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n';
    html += '<title>' + esc(head.title) + '</title>\n';
    head.metas.forEach(([a, k, v]) => {
      if (k === 'og:url') v = self;
      if ((k === 'og:image' || k === 'twitter:image') && ogJpg) v = ogJpg;
      if (k === 'og:image:alt' || k === 'twitter:image:alt') v = head.title;
      if (k === 'og:image:type') v = 'image/jpeg';
      html += '<meta ' + a + '="' + k + '" content="' + esc(fix(v)) + '">\n';
    });
    if (!head.metas.some(m => m[1] === 'og:url')) html += '<meta property="og:url" content="' + esc(self) + '">\n';
    html += '<link rel="canonical" href="' + esc(page) + '">\n';
    head.ld.filter(t => t.indexOf('WebApplication') < 0).forEach(t => { html += '<script type="application/ld+json">' + fix(t).replace(/</g, '\\u003c') + '</script>\n'; });
    const rel = '../../?e=' + encodeURIComponent(id); // tương đối: chạy được cả ở localhost lẫn GitHub Pages
    html += '<meta http-equiv="refresh" content="0; url=' + esc(rel) + '">\n';
    html += '<script>location.replace(' + JSON.stringify(rel) + ' + location.hash);</script>\n';
    html += '</head>\n<body><p><a href="' + esc('../../?e=' + encodeURIComponent(id)) + '">' + esc(head.title) + '</a></p></body>\n</html>\n';
    const dir = path.join(ROOT, 's', id);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html);
    made.push(id + '  →  ' + head.title);
  }
  await b.close();
  console.log(made.join('\n'));
})();
