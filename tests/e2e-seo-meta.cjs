// SEO nâng cao: og:title/description, ảnh chia sẻ, canonical, noindex -> form, xem trước, lưu, file HTML xuất, trang ?e= demo.
// Chạy: node tests/e2e-seo-meta.cjs   (cần: python3 -m http.server 8000 ở thư mục gốc repo)
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const BASE = process.env.BASE || 'http://localhost:8000/';
let failed = 0;
function check(n, ok, x) { if (!ok) failed++; console.log((ok ? '✓ ' : '✗ ') + n + (x !== undefined ? '  [' + x + ']' : '')); }
(async () => {
  const b = require('./auto-tab.cjs')(await chromium.launch());
  const p = await (await b.newContext({ viewport: { width: 1400, height: 900 } })).newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto(BASE);
  await p.click('#btn-sample'); await p.click('#btn-generate'); await p.waitForTimeout(800);
  await p.click('[data-tab="editor"]'); await p.evaluate(() => window.EP.workspace.show('publish'));
  const T = 'Workshop AI Marketing 2026 – Học thực chiến TP.HCM';
  await p.fill('#seo-title', T);
  await p.fill('#seo-og-title', 'OG: Workshop AI Marketing');
  await p.fill('#seo-og-desc', 'Mô tả chia sẻ riêng cho Zalo');
  await p.fill('#seo-image', 'https://example.com/share.jpg');
  await p.fill('#seo-canonical', 'https://example.com/ai');
  await p.check('#seo-noindex');
  check('preview Google dùng tiêu đề SEO', (await p.textContent('#serp-title')) === T);
  check('preview Facebook dùng og:title + og:description', (await p.textContent('#fb-title')) === 'OG: Workshop AI Marketing' && (await p.textContent('#fb-desc')) === 'Mô tả chia sẻ riêng cho Zalo');
  check('preview Facebook dùng ảnh chia sẻ', (await p.getAttribute('#fb-img', 'src')) === 'https://example.com/share.jpg');
  await p.waitForTimeout(900);
  await p.reload(); await p.click('[data-tab="editor"]'); await p.evaluate(() => window.EP.workspace.show('publish'));
  check('giữ sau khi tải lại', (await p.inputValue('#seo-og-title')) === 'OG: Workshop AI Marketing' && (await p.inputValue('#seo-canonical')) === 'https://example.com/ai' && await p.isChecked('#seo-noindex'));
  const html = await p.evaluate(() => window.EP.exportHtml());
  const ex = await p.evaluate(h => {
    const d = new DOMParser().parseFromString(h, 'text/html'), m = (s, a) => (d.querySelector(s) || { getAttribute: () => null }).getAttribute(a || 'content');
    return { title: d.title, ogt: m('meta[property="og:title"]'), ogd: m('meta[property="og:description"]'), img: m('meta[property="og:image"]'), tw: m('meta[name="twitter:image"]'), can: m('link[rel=canonical]', 'href'), robots: m('meta[name="robots"]') };
  }, html);
  check('export: title/og/image/canonical/noindex', ex.title === T && ex.ogt === 'OG: Workshop AI Marketing' && ex.ogd === 'Mô tả chia sẻ riêng cho Zalo' && ex.img === 'https://example.com/share.jpg' && ex.tw === ex.img && ex.can === 'https://example.com/ai' && /^noindex/.test(ex.robots), JSON.stringify(ex));
  // Demo ?e= : Mộc Coffee
  await p.goto(BASE + '?e=demo_evt_coffee'); await p.waitForTimeout(1500);
  const dm = await p.evaluate(() => ({ t: document.title, og: (document.querySelector('meta[property="og:image"]') || {}).content, ot: (document.querySelector('meta[property="og:title"]') || {}).content }));
  check('?e= demo: title + og:image tuyệt đối moc-hero.webp', /Mộc/.test(dm.t) && /^https?:\/\/.+assets\/demo\/moc-hero\.webp$/.test(dm.og || '') && /Mộc/.test(dm.ot), JSON.stringify(dm));
  check('không lỗi JS', errs.length === 0, errs.join('|'));
  await b.close();
  process.exit(failed ? 1 : 0);
})();
