// bump-version.cjs - tăng số phiên bản trong js/version.js và gắn ?v=<phiên bản> vào mọi file js/css/features trong index.html
// (và 404.html nếu có) để trình duyệt tải bản mới ngay sau khi deploy GitHub Pages (không dùng bản cũ trong cache).
// Cách dùng:  node tools/bump-version.cjs            -> tăng patch (0.1.0 -> 0.1.1)
//             node tools/bump-version.cjs minor      -> 0.2.0     | major -> 1.0.0 | 1.4.2 -> đặt thẳng số này
//             node tools/bump-version.cjs --stamp    -> giữ số, chỉ gắn lại ?v=
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const vfile = path.join(root, 'js/version.js');
let src = fs.readFileSync(vfile, 'utf8');
let v = src.match(/version: '([^']+)'/)[1];
const arg = process.argv[2];
if (arg !== '--stamp') {
  const p = v.split('.').map(Number);
  if (/^\d+\.\d+\.\d+$/.test(arg || '')) v = arg;
  else if (arg === 'major') v = (p[0] + 1) + '.0.0';
  else if (arg === 'minor') v = p[0] + '.' + (p[1] + 1) + '.0';
  else v = p[0] + '.' + p[1] + '.' + (p[2] + 1);
  const d = new Date(), date = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  src = src.replace(/version: '[^']+'/, "version: '" + v + "'").replace(/date: '[^']+'/, "date: '" + date + "'");
  fs.writeFileSync(vfile, src);
}
['index.html', '404.html'].forEach((name) => {
  const file = path.join(root, name);
  if (!fs.existsSync(file)) return;
  const html = fs.readFileSync(file, 'utf8')
    .replace(/(<script (?:defer )?src="(?:js|features)\/[\w./-]+\.js)(\?v=[^"]*)?"/g, '$1?v=' + v + '"')
    .replace(/(<link rel="stylesheet" href="css\/[\w.-]+\.css)(\?v=[^"]*)?"/g, '$1?v=' + v + '"');
  fs.writeFileSync(file, html);
  console.log(name + ' -> v=' + v);
});
