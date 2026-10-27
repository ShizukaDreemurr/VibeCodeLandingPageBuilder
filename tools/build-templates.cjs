// build-templates.cjs — từ tools/templates.json sinh js/templates-data.js và ảnh nền SVG cho MỌI mẫu.
// Chạy: node tools/build-templates.cjs   (sau đó chạy tools/make-thumbs.cjs để chụp ảnh đại diện)
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { draw } = require('./make-art.cjs');
const root = path.join(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'templates.json'), 'utf8'));
fs.writeFileSync(path.join(root, 'js/templates-data.js'),
  '/* templates-data.js — SINH TỰ ĐỘNG từ tools/templates.json bằng tools/build-templates.cjs. Đừng sửa tay. */\n' +
  '(function (root) { root.EP = root.EP || {}; root.EP.templateData = ' + JSON.stringify(data) + '; })(typeof window !== \'undefined\' ? window : globalThis);\n');
// Nạp templates.js như trình duyệt để có đủ danh sách (6 mẫu gốc + 50 mẫu mới)
const ctx = { window: {}, Date };
ctx.window.EP = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, 'js/templates-data.js'), 'utf8'), ctx);
vm.runInContext(fs.readFileSync(path.join(root, 'js/templates.js'), 'utf8'), ctx);
const list = ctx.window.EP.templates.list;
const dir = path.join(root, 'assets/templates');
fs.mkdirSync(dir, { recursive: true });
list.forEach(t => fs.writeFileSync(path.join(dir, t.id + '.svg'), draw(t)));
console.log(list.length + ' mẫu, đã vẽ ' + list.length + ' ảnh nền');
