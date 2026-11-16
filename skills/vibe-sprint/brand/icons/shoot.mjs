import { createRequire } from 'node:module'; const { chromium } = createRequire(import.meta.url)('playwright');
const url = process.argv[2] || 'http://localhost:8226/index.html';
const b = await chromium.launch();
const shot = async (w, h, file, sel) => {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  await p.goto(url, { waitUntil: 'networkidle' }).catch(() => {});
  await p.waitForTimeout(500);
  if (sel) await p.locator(sel).screenshot({ path: file }); else await p.screenshot({ path: file, fullPage: true });
  await p.close();
};
await shot(1440, 900, 'preview-desktop.png');
await shot(390, 800, 'preview-mobile.png');
await shot(1200, 800, 'preview-grid.png', '#grid');
await b.close();
