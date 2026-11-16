#!/usr/bin/env node
// nop-bai.mjs: một lệnh lúc chốt bài. Kiểm tra, chụp minh chứng, đóng gói, in 4 món nộp.
//
// Cách dùng (chạy ở thư mục gốc dự án, sau khi đã commit + push bản cuối):
//   node scripts/nop-bai.mjs --url https://xclipsex.github.io/Xclipse-ChungKet/
//   node scripts/nop-bai.mjs --url http://localhost:8236/ --dry-run      thử: không ghi vào repo
//   node scripts/nop-bai.mjs --no-shots                                   bỏ bước chụp ảnh
//
// Cờ:
//   --url <URL>        link demo cần chụp (mặc định: link Pages của đội)
//   --no-shots         bỏ chụp ảnh minh chứng
//   --no-demo          không thêm ?demo=1 khi chụp (mặc định có, để ảnh có số liệu mẫu)
//   --dry-run          chỉ thử: ghi ảnh và ZIP vào thư mục tạm, lỗi git chỉ là LƯU Ý
//   --out <thư-mục>    thư mục gốc để ghi ảnh (mặc định docs/minh-chung/ trong repo)
//   --zip-dir <thư-mục> nơi đặt ZIP (mặc định: thư mục cha của repo, KHÔNG nằm trong repo)
//
// Việc làm theo thứ tự: 1) git sạch và đã push · 2) hash + giờ ISO (Asia/Ho_Chi_Minh) · 3) scan-secrets
// 4) README đủ mục bắt buộc · 5) ảnh minh chứng có thanh chú thích · 6) ZIP mã nguồn · 7) in 4 món nộp.
// Mã thoát: 0 = ổn · 1 = có mục LỖI (không nộp được) · 2 = sai cách dùng.

import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const argv = process.argv.slice(2);
const flag = (n) => argv.includes(n);
const val = (n, d) => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };
const DEFAULT_URL = "https://xclipsex.github.io/Xclipse-ChungKet/";
const URL_DEMO = val("--url", DEFAULT_URL);
const DRY = flag("--dry-run");
const NO_SHOTS = flag("--no-shots");
const NO_DEMO = flag("--no-demo");
const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
if (flag("-h") || flag("--help")) { console.log(fs.readFileSync(fileURLToPath(import.meta.url), "utf8").split("\n").slice(1, 19).map((l) => l.replace(/^\/\/ ?/, "")).join("\n")); process.exit(0); }
if (!/^https?:\/\//.test(URL_DEMO)) { console.error("--url phải bắt đầu bằng http:// hoặc https://"); process.exit(2); }

let failed = 0, warned = 0;
const ok = (m) => console.log(`[ ĐẠT ]    ${m}`);
const warn = (m) => { warned++; console.log(`[ LƯU Ý ]  ${m}`); };
const fail = (m) => { if (DRY) return warn(`${m} (chạy thử nên chỉ là lưu ý)`); failed++; console.log(`[ LỖI ]    ${m}`); };
const sh = (cmd, args, opt = {}) => {
  try { return { ok: true, out: execFileSync(cmd, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 30000, ...opt }).trim() }; }
  catch (e) { return { ok: false, out: String(e.stderr || e.message || "").trim().split("\n")[0] }; }
};
const step = (t) => console.log(`\n== ${t}`);

// ---- thư mục gốc repo
const top = sh("git", ["rev-parse", "--show-toplevel"]);
if (!top.ok) { console.error("Không ở trong repo git. Chạy lệnh này ở thư mục dự án."); process.exit(2); }
const ROOT = top.out;
process.chdir(ROOT);
const repoName = path.basename(ROOT);

// ---- giờ ISO theo Asia/Ho_Chi_Minh (UTC+7, không đổi giờ mùa hè)
function hcm(d = new Date()) {
  const t = new Date(d.getTime() + 7 * 3600 * 1000).toISOString();
  return { iso: t.slice(0, 19) + "+07:00", stamp: t.slice(0, 19).replace(/[-:]/g, "").replace("T", "-") };
}

// ---- 1. git sạch và đã push
step("1. Git: sạch và đã push");
const branch = sh("git", ["rev-parse", "--abbrev-ref", "HEAD"]).out;
const hash = sh("git", ["rev-parse", "--short", "HEAD"]).out;
const fullHash = sh("git", ["rev-parse", "HEAD"]).out;
const dirty = sh("git", ["status", "--porcelain"]).out;
if (dirty) {
  const lines = dirty.split("\n");
  fail(`còn ${lines.length} thay đổi chưa commit (vd: ${lines.slice(0, 3).join(" | ")}). Commit và push trước khi nộp.`);
} else ok("cây làm việc sạch, không có thay đổi chưa commit");
const originUrl = sh("git", ["remote", "get-url", "origin"]);
let repoHttp = "";
if (originUrl.ok) repoHttp = originUrl.out.replace(/^git@github\.com:/, "https://github.com/").replace(/^https:\/\/[^@/]+@/, "https://").replace(/\.git$/, "");
if (!originUrl.ok) fail("repo chưa có remote origin");
else {
  const ls = sh("git", ["ls-remote", "origin", `refs/heads/${branch}`], { timeout: 25000 });
  if (ls.ok && ls.out) {
    ls.out.split(/\s+/)[0] === fullHash ? ok(`HEAD khớp origin/${branch}`) : fail(`origin/${branch} KHÁC HEAD local: chưa push hoặc push chưa hết (git push origin ${branch})`);
  } else {
    const local = sh("git", ["rev-parse", `origin/${branch}`]);
    if (!ls.ok) {
      if (local.ok && local.out === fullHash) warn(`không chạm được origin (mạng?); bản theo dõi local khớp, chưa xác nhận trên GitHub`);
      else fail(`không xác nhận được đã push (mạng?): ${ls.out.slice(0, 70)}`);
    } else fail(`origin chưa có nhánh ${branch}: git push -u origin ${branch}`);
  }
}

// ---- 2. hash + giờ
step("2. Mốc chốt");
const now = hcm();
console.log(`Commit:  ${hash} (${fullHash})  nhánh ${branch}`);
console.log(`Giờ:     ${now.iso}  (Asia/Ho_Chi_Minh)`);
const verFile = path.join(ROOT, "js/version.js");
let appVer = "";
if (fs.existsSync(verFile)) { const m = fs.readFileSync(verFile, "utf8").match(/version: '([^']+)'/); if (m) { appVer = m[1]; console.log(`Phiên bản app: ${appVer}`); } }

// ---- 3. scan-secrets
step("3. Quét bí mật");
const scan = fs.existsSync(path.join(here, "scan-secrets.mjs")) ? path.join(here, "scan-secrets.mjs") : path.join(ROOT, "scripts/scan-secrets.mjs");
if (!fs.existsSync(scan)) fail("không thấy scan-secrets.mjs");
else {
  const a = [scan, "."]; if (fs.existsSync(path.join(ROOT, ".env.local"))) a.push(".env.local");
  const r = spawnSync(process.execPath, a, { encoding: "utf8", cwd: ROOT });
  const text = ((r.stdout || "") + (r.stderr || "")).trim();
  if (r.status === 0) ok("scan-secrets sạch");
  else { fail("scan-secrets báo có chỗ giống bí mật, dừng và báo đội:"); console.log(text.split("\n").slice(0, 12).map((l) => "           " + l).join("\n")); }
}

// ---- 4. README
step("4. README đủ mục bắt buộc");
const readmePath = path.join(ROOT, "README.md");
if (!fs.existsSync(readmePath)) fail("thiếu README.md");
else {
  const raw = fs.readFileSync(readmePath, "utf8");
  const n = raw.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d");
  const heads = n.split("\n").filter((l) => /^#{1,6}\s/.test(l)).join("\n");
  const checks = [
    ["link demo", /https?:\/\/\S+/.test(raw) && /(demo truc tuyen|link demo|demo online)/.test(n)],
    ["cách chạy", /(cai dat|cach chay|chay local)/.test(heads)],
    ["công nghệ", /cong nghe/.test(heads)],
    ["dữ liệu mẫu/BTC", /du lieu/.test(heads) && /(mau|btc)/.test(n)],
    ["giả định & cách tính", /gia dinh/.test(heads) && /cach tinh/.test(heads)],
    ["khung chuẩn bị trước", /khung chuan bi truoc/.test(heads)],
    ["công cụ AI", /cong cu ai/.test(heads)],
  ];
  for (const [name, pass] of checks) pass ? ok(`README có: ${name}`) : fail(`README thiếu mục: ${name}`);
  const left = (raw.replace(/```[\s\S]*?```/g, "").match(/<[^<>\s`][^<>`]*>|\{\{[^}]*\}\}/g) || []).filter((x) => !/^<\/?(br|b|i|a|img|details|summary|kbd|code)\b/i.test(x));
  left.length ? warn(`README còn ${left.length} chỗ chưa điền, ví dụ: ${left.slice(0, 3).join(" · ")}`) : ok("README không còn chỗ <…> hoặc {{…}}");
}

// ---- 5. ảnh minh chứng
const base = DRY ? fs.mkdtempSync(path.join(os.tmpdir(), "nop-bai-dry-")) : path.resolve(val("--out", path.join(ROOT, "docs/minh-chung")));
const evDir = path.join(base, now.stamp);
let shots = 0;
step("5. Ảnh minh chứng");
if (NO_SHOTS) warn("bỏ qua chụp ảnh (--no-shots); món 4 sẽ thiếu");
else {
  let chromium = null;
  try { ({ chromium } = require("playwright")); } catch {
    const g = sh("npm", ["root", "-g"]);
    try { if (g.ok) ({ chromium } = require(path.join(g.out, "playwright"))); } catch { /* bỏ qua */ }
  }
  if (!chromium) fail("không import được Playwright (npm i -g playwright && npx playwright install chromium)");
  else {
    try {
      fs.mkdirSync(evDir, { recursive: true });
      const shotUrl = NO_DEMO || /[?&]demo=/.test(URL_DEMO) ? URL_DEMO : URL_DEMO + (URL_DEMO.includes("?") ? "&" : "?") + "demo=1";
      const withHash = (route) => shotUrl.replace(/#.*$/, "") + "#/" + route;
      const browser = await chromium.launch();
      const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
      // Dán thanh chú thích (commit, giờ, cỡ máy, URL) dưới ảnh chụp, giữ đúng độ phân giải ảnh.
      async function stamp(buf, w, h, scale, label) {
        const bar = `Xclipse · commit ${hash}${appVer ? " · v" + appVer : ""} · ${now.iso}<br>${label} · ${URL_DEMO}`;
        const ctx2 = await browser.newContext({ viewport: { width: w, height: h + 44 }, deviceScaleFactor: scale });
        const p2 = await ctx2.newPage();
        await p2.setContent(`<body style="margin:0;background:#111"><img src="data:image/png;base64,${buf.toString("base64")}" style="display:block;width:${w}px;height:${h}px"><div style="height:44px;box-sizing:border-box;padding:4px 8px;display:flex;align-items:center;font:600 ${Math.max(8, Math.min(14, Math.round(w / 46)))}px/1.3 system-ui,sans-serif;color:#fff;background:#111;overflow:hidden;word-break:break-all">${bar.split("<br>").map(esc).join("<br>")}</div></body>`);
        await p2.waitForTimeout(80);
        const out = await p2.screenshot({ type: "png" });
        await ctx2.close();
        return out;
      }
      const pad = (n) => String(n).padStart(2, "0");
      const sizes = [[390, 844], [360, 780]];
      let tabsCache = null;
      for (const [w, h] of sizes) for (const scheme of ["light", "dark"]) {
        const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, colorScheme: scheme, locale: "vi-VN", timezoneId: "Asia/Ho_Chi_Minh" });
        const page = await ctx.newPage();
        const errs = []; page.on("pageerror", (e) => errs.push(e.message));
        await page.goto(shotUrl, { waitUntil: "load", timeout: 30000 });
        await page.waitForSelector('html[data-ready="1"]', { timeout: 15000 }).catch(() => {});
        const tabs = tabsCache || (tabsCache = await page.evaluate(() => (window.EP && EP.router && EP.router.list ? EP.router.list().map((v) => v.id) : [])).catch(() => []));
        const routes = tabs.length ? tabs : [null];
        let i = 0;
        for (const t of routes) {
          i++;
          if (t) { await page.goto(withHash(t)); await page.waitForSelector('html[data-ready="1"]', { timeout: 15000 }).catch(() => {}); }
          await page.evaluate(() => (document.fonts && document.fonts.ready) || 1).catch(() => {});
          await page.waitForTimeout(700);
          await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {});
          const buf = await page.screenshot({ type: "png" });
          const label = `${w}×${h} @3x ${scheme === "light" ? "sáng" : "tối"}${t ? " · " + t : ""}`;
          fs.writeFileSync(path.join(evDir, `${pad(i)}-${t || "home"}-${w}x${h}-${scheme}.png`), await stamp(buf, w, h, 3, label));
          shots++;
        }
        if (errs.length) warn(`${w}×${h} ${scheme}: trang báo lỗi JS: ${errs[0].slice(0, 80)}`);
        await ctx.close();
      }
      // 1 ảnh desktop
      const dctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, locale: "vi-VN", timezoneId: "Asia/Ho_Chi_Minh" });
      const dp = await dctx.newPage();
      await dp.goto(shotUrl, { waitUntil: "load", timeout: 30000 });
      await dp.waitForSelector('html[data-ready="1"]', { timeout: 15000 }).catch(() => {});
      await dp.waitForTimeout(900);
      fs.writeFileSync(path.join(evDir, "desktop-1440x900-light.png"), await stamp(await dp.screenshot({ type: "png" }), 1440, 900, 1, "desktop 1440×900"));
      shots++;
      await dctx.close(); await browser.close();
      fs.writeFileSync(path.join(evDir, "manifest.json"), JSON.stringify({ commit: fullHash, shortCommit: hash, branch, version: appVer || null, capturedAt: now.iso, timezone: "Asia/Ho_Chi_Minh", url: URL_DEMO, screenshots: shots }, null, 2) + "\n");
      ok(`đã chụp ${shots} ảnh (390×844 và 360×780 @3x sáng/tối + 1 desktop) vào ${path.relative(ROOT, evDir) || evDir}`);
    } catch (e) { fail(`chụp ảnh thất bại: ${String(e.message).split("\n")[0]}`); }
  }
}

// ---- 6. ZIP mã nguồn
step("6. ZIP mã nguồn");
const zipDir = path.resolve(val("--zip-dir", DRY ? base : path.dirname(ROOT)));
fs.mkdirSync(zipDir, { recursive: true });
const zipName = `${repoName}-${hash}.zip`;
const zipPath = path.join(zipDir, zipName);
fs.rmSync(zipPath, { force: true });
let zipped = false;
if (zipDir.startsWith(ROOT + path.sep)) warn("ZIP đang nằm trong repo, đừng commit nó");
const hasZip = sh("zip", ["-v"]).ok;
if (hasZip) {
  const r = spawnSync("zip", ["-r", "-q", zipPath, ".", "-x", ".git/*", "*/.git/*", "node_modules/*", "*/node_modules/*", ".env", ".env.*", "!.env.example", "*.zip", ".DS_Store"], { cwd: ROOT, encoding: "utf8" });
  zipped = r.status === 0;
  // .env.example là tệp được phép (chỉ có tên biến): thêm lại nếu có
  if (zipped && fs.existsSync(path.join(ROOT, ".env.example"))) spawnSync("zip", ["-q", zipPath, ".env.example"], { cwd: ROOT });
}
if (!zipped) {
  const r = sh("git", ["archive", "--format=zip", "-o", zipPath, "HEAD"]);
  zipped = r.ok;
  if (zipped) warn("không có lệnh zip; dùng git archive (chỉ tệp đã commit, không gồm thư mục ảnh minh chứng mới)");
}
if (zipped) ok(`${zipPath} (${(fs.statSync(zipPath).size / 1024).toFixed(0)} KB), không kèm .git, node_modules, .env*`);
else fail("không tạo được ZIP");

// ---- 7. bốn món nộp
step("7. Bốn món nộp (dán vào form)");
const sha = fullHash;
const evRel = path.relative(ROOT, evDir);
const evLink = repoHttp && !DRY && !evRel.startsWith("..") ? `${repoHttp}/tree/${branch}/${evRel.split(path.sep).join("/")}` : "(chưa commit; xem đường dẫn local)";
console.log(`
1) Link demo:      ${URL_DEMO}
2) Mã nguồn:       ${repoHttp ? repoHttp + "/tree/" + sha : "(thiếu remote)"}
                   ZIP: ${zipPath}
3) README:         ${repoHttp ? repoHttp + "/blob/" + sha + "/README.md" : "README.md"}
4) Minh chứng:     ${shots ? evLink : "(chưa chụp)"}
                   local: ${shots ? evDir : "-"}

Commit ${hash}${appVer ? " · v" + appVer : ""} · ${now.iso}`);
if (shots && !DRY) console.log(`
Lưu ý: thư mục minh chứng mới chưa nằm trên GitHub. Để có link ở mục 4:
  git add docs/minh-chung && git commit -m "Minh chứng chốt ${now.stamp}" && git push origin ${branch}
(commit này chỉ thêm ảnh, không đổi mã; hash nộp ở mục 2 vẫn là ${hash}.)`);
if (DRY) console.log("\n(Chạy thử --dry-run: không ghi gì vào repo.)");
console.log(`\nTổng: ${failed} lỗi · ${warned} lưu ý`);
process.exit(failed ? 1 : 0);
