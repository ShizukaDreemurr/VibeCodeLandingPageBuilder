#!/usr/bin/env node
// doctor.mjs: kiểm tra máy trước giờ thi. Chỉ cần Node; Playwright là tuỳ chọn (chỉ báo có/không).
//
// Cách dùng:
//   node scripts/doctor.mjs                  kiểm tra mặc định
//   node scripts/doctor.mjs --repo <URL>     đổi repo chung kết (mặc định: repo Xclipse-ChungKet)
//   node scripts/doctor.mjs --json           in kết quả dạng JSON
//
// Mã thoát: 0 = không có FAIL (WARN vẫn là 0) · 1 = có ít nhất một FAIL.
// Mạng bị chặn chỉ cho WARN, không bao giờ FAIL.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";

const argv = process.argv.slice(2);
const val = (n, d) => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };
const JSON_OUT = argv.includes("--json");
const FINALS_REPO = val("--repo", "https://github.com/XclipseX/Xclipse-ChungKet.git");
const BRANCH = "nop-bai";
const WORKER = "https://vibe-gemini-proxy.xclipse.workers.dev/health";
const PAGES = "https://xclipsex.github.io/Xclipse-ChungKet/";
const require = createRequire(import.meta.url);

const rows = [];
const add = (status, name, detail, fix = "") => rows.push({ status, name, detail, fix });
const run = (cmd, args, opt = {}) => {
  try {
    return { ok: true, out: execFileSync(cmd, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 15000, ...opt }).trim() };
  } catch (e) {
    return { ok: false, out: String((e.stderr || e.message || "")).trim().split("\n")[0] };
  }
};
// curl đi qua proxy của môi trường (Node fetch thì không), nên dùng curl cho kiểm tra mạng.
const http = (url) => {
  const r = run("curl", ["-sS", "-L", "-m", "8", "-o", "/dev/null", "-w", "%{http_code}", url]);
  return r.ok ? { code: Number(r.out), err: "" } : { code: 0, err: r.out };
};

// 1. Node
const major = Number(process.versions.node.split(".")[0]);
major >= 18
  ? add("PASS", "Node.js", `v${process.versions.node}`)
  : add("FAIL", "Node.js", `v${process.versions.node} (cần 18 trở lên)`, "Cài Node 18+ từ nodejs.org");

// 2. Git user
const gName = run("git", ["config", "--get", "user.name"]);
const gMail = run("git", ["config", "--get", "user.email"]);
if (!run("git", ["--version"]).ok) add("FAIL", "Git", "chưa cài git", "Cài git rồi chạy lại");
else if (gName.ok && gName.out && gMail.ok && gMail.out) add("PASS", "Git user", `${gName.out} <${gMail.out}>`);
else add("FAIL", "Git user", "thiếu user.name hoặc user.email", 'git config --global user.name "Tên" && git config --global user.email "mail@..."');

// 3. Git chạm được remote
const inRepo = run("git", ["rev-parse", "--is-inside-work-tree"]).ok;
const origin = inRepo ? run("git", ["remote", "get-url", "origin"]) : { ok: false };
const target = origin.ok && origin.out ? origin.out : FINALS_REPO;
const lsRemote = run("git", ["ls-remote", "--heads", target], { timeout: 20000 });
lsRemote.ok
  ? add("PASS", "Git chạm remote", `ls-remote ${origin.ok ? "origin" : "repo chung kết"} được`)
  : add("WARN", "Git chạm remote", `không chạm được remote (${lsRemote.out.slice(0, 70)})`, "Kiểm tra mạng/hotspot, đăng nhập GitHub (gh auth login)");

// 4. Playwright
let pw = null;
try { pw = require.resolve("playwright"); } catch {
  const g = run("npm", ["root", "-g"]);
  if (g.ok && fs.existsSync(path.join(g.out, "playwright"))) pw = path.join(g.out, "playwright");
}
if (pw) {
  let chromiumOk = true;
  try {
    const { chromium } = require(pw);
    chromiumOk = fs.existsSync(chromium.executablePath());
  } catch { chromiumOk = true; }
  chromiumOk
    ? add("PASS", "Playwright", "import được, có trình duyệt Chromium")
    : add("WARN", "Playwright", "có thư viện nhưng thiếu Chromium", "npx playwright install chromium");
} else add("FAIL", "Playwright", "không import được (cần cho kiểm thử và chụp minh chứng)", "npm i -g playwright && npx playwright install chromium");

// 5. pptxgenjs (chỉ cần khi xuất .pptx từ deck/)
const pptxCandidates = [
  path.join(process.cwd(), "node_modules/pptxgenjs"),
  path.join(process.cwd(), "deck/node_modules/pptxgenjs"),
  path.join(path.dirname(new URL(import.meta.url).pathname), "../deck/node_modules/pptxgenjs"),
];
const gRoot = run("npm", ["root", "-g"]);
if (gRoot.ok) pptxCandidates.push(path.join(gRoot.out, "pptxgenjs"));
const pptx = pptxCandidates.find((p) => fs.existsSync(p));
pptx ? add("PASS", "pptxgenjs", pptx.replace(os.homedir(), "~"))
     : add("WARN", "pptxgenjs", "chưa có (chỉ cần khi xuất .pptx)", "cd deck && npm i pptxgenjs");

// 6. Skill
const skillDir = path.join(os.homedir(), ".claude/skills/vibe-sprint");
fs.existsSync(path.join(skillDir, "SKILL.md"))
  ? add("PASS", "Skill vibe-sprint", skillDir.replace(os.homedir(), "~"))
  : add("WARN", "Skill vibe-sprint", "chưa cài ở ~/.claude/skills/vibe-sprint", "Chép thư mục skills/vibe-sprint vào ~/.claude/skills/");

// 7. Worker proxy AI
const w = http(WORKER);
w.code >= 200 && w.code < 300 ? add("PASS", "Worker proxy AI", `/health trả ${w.code}`)
  : add("WARN", "Worker proxy AI", w.code ? `/health trả ${w.code}` : `không gọi được (${w.err.slice(0, 60) || "mạng bị chặn"})`, "Thiếu mạng thì app tự dùng chế độ mô phỏng; kiểm tra lại khi có mạng");

// 8. Pages
const p = http(PAGES);
p.code >= 200 && p.code < 300 ? add("PASS", "Link GitHub Pages", `${PAGES} trả ${p.code}`)
  : add("WARN", "Link GitHub Pages", p.code ? `${PAGES} trả ${p.code}` : `không mở được (${p.err.slice(0, 60) || "mạng bị chặn"})`, "Settings → Pages → nhánh nop-bai, thư mục / (root); chờ 1–2 phút sau push");

// 9. Nhánh nop-bai trên repo chung kết
const br = run("git", ["ls-remote", "--heads", FINALS_REPO, BRANCH], { timeout: 20000 });
if (br.ok && br.out.includes(`refs/heads/${BRANCH}`)) add("PASS", `Nhánh ${BRANCH}`, "có trên repo chung kết");
else if (br.ok) add("FAIL", `Nhánh ${BRANCH}`, "repo chung kết chưa có nhánh này", `git push -u origin ${BRANCH}`);
else add("WARN", `Nhánh ${BRANCH}`, `không kiểm tra được (${br.out.slice(0, 60) || "mạng bị chặn"})`, "Kiểm tra lại khi có mạng");

// In kết quả
if (JSON_OUT) { console.log(JSON.stringify(rows, null, 2)); }
else {
  const tag = { PASS: "[ ĐẠT ]", WARN: "[ LƯU Ý ]", FAIL: "[ LỖI ]" };
  const w1 = Math.max(...rows.map((r) => r.name.length));
  console.log("\nBÁO CÁO MÁY TRƯỚC GIỜ THI (vibe-sprint doctor)\n" + "-".repeat(78));
  for (const r of rows) {
    console.log(`${tag[r.status].padEnd(9)} ${r.name.padEnd(w1)}  ${r.detail}`);
    if (r.status !== "PASS" && r.fix) console.log(`${" ".repeat(10 + w1 + 2)}→ ${r.fix}`);
  }
  const c = (s) => rows.filter((r) => r.status === s).length;
  console.log("-".repeat(78));
  console.log(`Tổng: ${c("PASS")} đạt · ${c("WARN")} lưu ý · ${c("FAIL")} lỗi`);
  console.log(c("FAIL") ? "Kết luận: CÒN LỖI, sửa các dòng [ LỖI ] trước giờ thi." : c("WARN") ? "Kết luận: dùng được; xem lại các dòng [ LƯU Ý ] khi có mạng." : "Kết luận: sẵn sàng.");
}
process.exit(rows.some((r) => r.status === "FAIL") ? 1 : 0);
