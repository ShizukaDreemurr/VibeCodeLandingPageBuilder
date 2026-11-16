#!/usr/bin/env node
// scan-secrets.mjs: quét một thư mục tìm chuỗi giống bí mật trước khi nộp ZIP hoặc push.
//
// Cách dùng:
//   node scan-secrets.mjs <thư-mục>                    quét theo mẫu (AIza…, AQ., sk-…, token dài 30+ ký tự…)
//   node scan-secrets.mjs <thư-mục> <file .env.local>  thêm: tìm đúng GIÁ TRỊ các biến bí mật trong file env
//
// Chỉ in TÊN mẫu hoặc TÊN biến, vị trí file và số dòng. Không bao giờ in giá trị bí mật.
// Mã thoát: 0 = sạch · 1 = có chỗ lộ · 2 = sai cách dùng.

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
if (args.length < 1 || args.length > 2) {
  console.error("Cách dùng: node scan-secrets.mjs <thư-mục> [<.env.local>]");
  process.exit(2);
}
const [dir, envFile] = args;
if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
  console.error(`Không tìm thấy thư mục: ${dir}`);
  process.exit(2);
}
const root = path.resolve(dir);
const envPath = envFile ? path.resolve(envFile) : null;

// Cấu hình công khai có chủ đích: không tính là lộ, nhưng vẫn in dòng [CHO PHÉP] để người đọc thấy.
// Khớp chính xác đường dẫn tương đối (dấu /), không khớp theo đuôi tên, để bản sao lạc chỗ vẫn bị báo.
const ALLOWLIST = [
  {
    file: "js/firebase-config.js",
    rule: "google-api-key",
    reason: "cấu hình Firebase Web công khai, bảo vệ bằng quy tắc Firestore và Firebase Auth",
  },
];

// Mẫu cụ thể. Chạy trước; mẫu chung chỉ thêm phát hiện chưa được mẫu cụ thể bắt.
const PATTERNS = [
  { name: "google-api-key", re: /AIza[0-9A-Za-z_-]{35}/g },
  { name: "gemini-aq-key", re: /\bAQ\.[A-Za-z0-9_-]{20,}/g },
  { name: "openai-key", re: /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}/g },
  { name: "github-token", re: /\bgh[pousr]_[A-Za-z0-9]{36,}/g },
  { name: "aws-access-key", re: /\bAKIA[0-9A-Z]{16}\b/g },
  { name: "private-key", re: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g },
];

// Mẫu chung: tên biến nghe như bí mật, gán một chuỗi từ 30 ký tự trở lên (kiểu key của EverAI…).
const GENERIC = {
  name: "chuoi-bi-mat-30-ky-tu",
  re: /\b[A-Za-z0-9_]*(?:KEY|SECRET|TOKEN|PASSWORD|PASSWD)[A-Za-z0-9_]*['"]?\s*[:=]\s*['"`]?([A-Za-z0-9_\-+/=.]{30,})/gi,
};
const PLACEHOLDER = /^(x{6,}|your|example|changeme|placeholder|<)/i;
// Key thật gần như luôn có chữ số. Chuỗi chỉ toàn chữ (thông điệp lỗi trong SDK, tên hằng số) bị bỏ qua.
const looksRandom = (v) => /\d/.test(v);

// Biến công khai hoặc không phải bí mật: bỏ qua khi quét theo file env.
const PUBLIC_ENV = /^(NEXT_PUBLIC_.*URL|APP_URL|.*MODEL.*|.*PROVIDER.*|EMAIL_FROM|ADMIN_EMAILS|PRIVACY_CONTACT_EMAIL|NODE_ENV|PORT)$/;

const SKIP_DIRS = new Set(["node_modules", ".git"]);
const MAX_BYTES = 2 * 1024 * 1024;

function* walk(folder) {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(folder, entry.name);
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.isFile()) yield full;
  }
}

const relOf = (file) => path.relative(root, file).split(path.sep).join("/");
const lineOf = (text, index) => text.slice(0, index).split("\n").length;

// Đọc một tệp văn bản; trả về null nếu là tệp nhị phân hoặc quá lớn.
function readText(file) {
  const st = fs.statSync(file);
  if (st.size > MAX_BYTES) return null;
  const buf = fs.readFileSync(file);
  if (buf.subarray(0, 8000).includes(0)) return null;
  return buf.toString("utf8");
}

// Trả về danh sách phát hiện trong một tệp: { rule, line, start, end }.
function scanText(text) {
  const hits = [];
  const taken = [];
  for (const p of PATTERNS) {
    for (const m of text.matchAll(p.re)) {
      hits.push({ rule: p.name, line: lineOf(text, m.index), start: m.index, end: m.index + m[0].length });
      taken.push([m.index, m.index + m[0].length]);
    }
  }
  for (const m of text.matchAll(GENERIC.re)) {
    const value = m[1];
    if (PLACEHOLDER.test(value) || !looksRandom(value)) continue;
    const start = m.index + m[0].length - value.length;
    const end = start + value.length;
    const overlaps = taken.some(([s, e]) => start < e && end > s);
    if (overlaps) continue; // đã được mẫu cụ thể bắt, không báo đôi
    hits.push({ rule: GENERIC.name, line: lineOf(text, start), start, end });
  }
  return hits;
}

const allowed = (rel, rule) => ALLOWLIST.find((a) => a.file === rel && a.rule === rule);

let files = 0;
let skipped = 0;
let flagged = 0;
let allowedCount = 0;

// Quét theo mẫu.
for (const file of walk(root)) {
  if (envPath && file === envPath) continue; // chính file env là nơi hợp lệ để chứa bí mật
  const text = readText(file);
  if (text === null) {
    skipped++;
    continue;
  }
  files++;
  const rel = relOf(file);
  for (const hit of scanText(text)) {
    const ok = allowed(rel, hit.rule);
    if (ok) {
      allowedCount++;
      console.log(`[CHO PHÉP] ${hit.rule} — ${rel}:${hit.line} (${ok.reason})`);
    } else {
      flagged++;
      console.log(`[LỘ] ${hit.rule} — ${rel}:${hit.line}`);
    }
  }
}

// Quét theo giá trị trong file env (tuỳ chọn).
if (envPath) {
  if (!fs.existsSync(envPath)) {
    console.error(`Không tìm thấy file env: ${envFile}`);
    process.exit(2);
  }
  const secrets = fs
    .readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .filter((line) => /^[A-Z0-9_]+=/.test(line))
    .map((line) => {
      const i = line.indexOf("=");
      return [line.slice(0, i), line.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
    })
    .filter(([key, value]) => !PUBLIC_ENV.test(key) && value.length >= 8);

  console.log(`Kiểm tra ${secrets.length} biến từ file env: ${secrets.map(([k]) => k).join(", ") || "(không có)"}`);
  for (const file of walk(root)) {
    if (file === envPath) continue;
    const text = readText(file);
    if (text === null) continue;
    for (const [key, value] of secrets) {
      const at = text.indexOf(value);
      if (at !== -1) {
        flagged++;
        console.log(`[LỘ] biến ${key} — ${relOf(file)}:${lineOf(text, at)}`);
      }
    }
  }
  if (envPath && fileInside(envPath, root)) {
    console.log(`Đã bỏ qua chính file env: ${relOf(envPath)}`);
  }
}

function fileInside(child, parent) {
  const rel = path.relative(parent, child);
  return rel !== "" && !rel.startsWith("..") && !path.isAbsolute(rel);
}

console.log(`Đã quét ${files} tệp văn bản (bỏ qua ${skipped} tệp nhị phân hoặc quá lớn). Lộ: ${flagged} · Cho phép: ${allowedCount}.`);
process.exit(flagged > 0 ? 1 : 0);
