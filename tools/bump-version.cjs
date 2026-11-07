// bump-version.cjs — gắn ?v=<phiên bản> vào mọi file js/css nội bộ trong index.html để trình duyệt
// tải bản mới ngay khi phát hành (không dùng bản cũ trong bộ nhớ đệm).
// Cách dùng: sửa version trong js/version.js rồi chạy  node tools/bump-version.cjs
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const v = fs.readFileSync(path.join(root, 'js/version.js'), 'utf8').match(/version: '([^']+)'/)[1];
const file = path.join(root, 'index.html');
const html = fs.readFileSync(file, 'utf8')
  .replace(/(<script (?:defer )?src="js\/[\w.-]+\.js)(\?v=[^"]*)?"/g, '$1?v=' + v + '"')
  .replace(/(<link rel="stylesheet" href="css\/[\w.-]+\.css)(\?v=[^"]*)?"/g, '$1?v=' + v + '"');
fs.writeFileSync(file, html);
console.log('index.html → v=' + v);
