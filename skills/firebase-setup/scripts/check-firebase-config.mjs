#!/usr/bin/env node
// Usage: node check-firebase-config.mjs <path to js/config.js | project dir>
// Exit 0 = ok (warnings allowed), 1 = errors, 2 = usage.
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';

const arg = process.argv[2];
if (!arg) { console.error('Cách dùng: node check-firebase-config.mjs <js/config.js | thư-mục-dự-án>'); process.exit(2); }
if (!existsSync(arg)) { console.error('[LỖI] Không thấy: ' + arg); process.exit(1); }

let cfgPath, root;
if (statSync(arg).isDirectory()) { root = arg; cfgPath = join(arg, 'js', 'config.js'); }
else { cfgPath = arg; root = dirname(dirname(arg)); }

const errors = [], warns = [], oks = [];
const E = (m) => errors.push(m), W = (m) => warns.push(m), K = (m) => oks.push(m);

if (!existsSync(cfgPath)) { console.error('[LỖI] Không thấy ' + cfgPath); process.exit(1); }
const src = readFileSync(cfgPath, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

// Find the `firebase: { ... }` block by brace matching.
function block(text, key) {
  const m = new RegExp('\\b' + key + '\\s*:\\s*\\{').exec(text);
  if (!m) return null;
  let i = m.index + m[0].length, depth = 1;
  while (i < text.length && depth) { const c = text[i++]; if (c === '{') depth++; else if (c === '}') depth--; }
  return text.slice(m.index + m[0].length, i - 1);
}
const str = (b, k) => { const m = new RegExp('\\b' + k + '\\s*:\\s*([\'"`])([^\'"`]*)\\1').exec(b); return m ? m[2].trim() : null; };

const fb = block(src, 'firebase');
if (fb == null) { E('js/config.js không có khối `firebase: { ... }`.'); }
else {
  const en = /\benabled\s*:\s*(true|false)/.exec(fb);
  if (!en) W('Không đọc được `enabled` (true/false).');
  else if (en[1] === 'false') W('firebase.enabled = false: app sẽ không dùng Firebase (đặt true sau khi dán config).');
  else K('enabled = true');
  if (/\bemulator\s*:\s*true/.test(fb)) W('emulator = true: nhớ đặt false trước khi deploy lên GitHub Pages.');

  const cfg = block(fb, 'config') ?? '';
  const v = {};
  for (const k of ['apiKey', 'authDomain', 'projectId', 'appId']) {
    v[k] = str(cfg, k);
    if (!v[k]) E(`config.${k} đang trống/thiếu.`);
  }
  if (v.apiKey) /^AIza[0-9A-Za-z_-]{30,}$/.test(v.apiKey) ? K('apiKey đúng dạng AIza...') : E('apiKey không đúng dạng `AIza...` (39 ký tự).');
  if (v.projectId) {
    if (!/^[a-z][a-z0-9-]{4,28}[a-z0-9]$/.test(v.projectId)) E(`projectId "${v.projectId}" không hợp lệ (chữ thường/số/gạch ngang, 6-30 ký tự).`);
    else K('projectId = ' + v.projectId);
    if (v.projectId.startsWith('demo-')) W('projectId bắt đầu bằng `demo-` (project của emulator), không phải project thật.');
  }
  if (v.authDomain) {
    if (!/^[a-z0-9-]+\.(firebaseapp\.com|web\.app)$/.test(v.authDomain)) W(`authDomain "${v.authDomain}" không phải <id>.firebaseapp.com (chỉ ổn nếu bạn chủ đích dùng domain riêng).`);
    if (v.projectId && v.authDomain !== v.projectId + '.firebaseapp.com' && v.authDomain !== v.projectId + '.web.app') E(`authDomain "${v.authDomain}" không khớp projectId (mong đợi ${v.projectId}.firebaseapp.com).`);
    else if (v.projectId) K('authDomain khớp projectId');
  }
  if (v.appId && !/^1:\d+:web:[0-9a-f]+$/.test(v.appId)) W(`appId "${v.appId}" không đúng dạng 1:<số>:web:<hex> (có phải app Android/iOS?).`);
  if (/(private_key|client_email|service[_-]?account)/i.test(src)) E('config.js có dấu hiệu service account/private key. Gỡ ngay, không commit.');
}

const rulesPath = join(root, 'firestore.rules');
if (!existsSync(rulesPath)) E('Không thấy firestore.rules ở ' + root);
else {
  const rules = readFileSync(rulesPath, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  if (/allow\s+[a-z ,]*\b(read|write)\b[a-z ,]*:\s*if\s+true\s*;/.test(rules)) E('firestore.rules có `allow read/write: if true` (mở toàn bộ). Dùng mẫu owner-only.');
  else if (/request\.time\s*<\s*timestamp\.date/.test(rules)) E('firestore.rules đang ở "test mode" (hết hạn theo ngày).');
  else if (!/request\.auth\s*!=\s*null|request\.auth\.uid/.test(rules)) W('firestore.rules không kiểm tra request.auth: kiểm tra lại quyền.');
  else K('firestore.rules có kiểm tra đăng nhập, không có `if true` toàn cục');
}

for (const m of oks) console.log('[OK]   ' + m);
for (const m of warns) console.log('[CẢNH BÁO] ' + m);
for (const m of errors) console.log('[LỖI]  ' + m);
console.log(errors.length ? `\nKết quả: ${errors.length} lỗi, ${warns.length} cảnh báo.` : `\nKết quả: đạt (${warns.length} cảnh báo).`);
process.exit(errors.length ? 1 : 0);
