/* export.js - xuất/nhập dữ liệu:
     EP.export.csv('ten.csv', rows, [{ key, label, value?(row) }])  CSV có BOM UTF-8 (Excel đọc đúng tiếng Việt), chống công thức độc hại
     EP.export.json('ten.json', obj)
     EP.export.text('ten.txt', 'nội dung')
     EP.export.backup() / EP.export.restore(file)   sao lưu / khôi phục toàn bộ dữ liệu app (JSON)
     EP.export.print()                                in / lưu PDF (CSS @media print đã ẩn thanh điều hướng)
     EP.export.pickFile('.json') -> Promise<File>
   Excel tiếng Việt đôi khi cần dấu ';' làm phân tách: EP.export.csv(name, rows, cols, { sep: ';' }). */
(function (root) {
  'use strict';
  var EP = root.EP, doc = root.document;

  function download(filename, content, mime) {
    var blob = content instanceof Blob ? content : new Blob([content], { type: mime || 'application/octet-stream' });
    var url = URL.createObjectURL(blob), a = doc.createElement('a');
    a.href = url; a.download = filename; a.rel = 'noopener'; doc.body.appendChild(a); a.click();
    setTimeout(function () { a.remove(); URL.revokeObjectURL(url); }, 500);
  }
  function cell(v, sep) {
    if (v == null) return '';
    if (typeof v === 'object') v = JSON.stringify(v);
    var s = String(v);
    if (/^[=@\t\r]/.test(s) || /^[+\-](?!\d)/.test(s)) s = "'" + s;   // chặn công thức (CSV injection)
    return new RegExp('[",\\r\\n' + (sep === ';' ? ';' : '') + ']').test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }
  function toCsv(rows, columns, sep) {
    sep = sep || ',';
    var cols = columns || Object.keys(rows[0] || {}).map(function (k) { return { key: k, label: k }; });
    var out = [cols.map(function (c) { return cell(c.label || c.key, sep); }).join(sep)];
    rows.forEach(function (r) { out.push(cols.map(function (c) { return cell(c.value ? c.value(r) : r[c.key], sep); }).join(sep)); });
    return out.join('\r\n');
  }

  EP.export = {
    toCsv: toCsv,
    download: download,
    csv: function (filename, rows, columns, opts) {
      download(filename, '﻿' + toCsv(rows, columns, opts && opts.sep), 'text/csv;charset=utf-8');
      EP.ui.toast('Đã xuất ' + rows.length + ' dòng ra ' + filename, { type: 'success' });
    },
    json: function (filename, obj) { download(filename, JSON.stringify(obj, null, 2), 'application/json'); },
    text: function (filename, s) { download(filename, s, 'text/plain;charset=utf-8'); },
    print: function () { root.print(); },
    /** Sao lưu mọi khoá của app (trừ khoá API và cờ giao diện) */
    backup: function () {
      var data = EP.store.all(); delete data.ai_key; delete data.ai_remember;
      var name = (EP.config.prefix + 'backup-' + EP.fmt.today() + '.json').replace(/^_+/, '');
      EP.export.json(name, { app: EP.config.prefix, version: EP.version && EP.version.version, exportedAt: new Date().toISOString(), data: data });
      EP.ui.toast('Đã tạo file sao lưu.', { type: 'success' });
    },
    /** Khôi phục từ File JSON do backup() tạo; ném lỗi tiếng Việt nếu file sai. Trả số khoá đã nạp. */
    restore: function (file) {
      return new Promise(function (resolve, reject) {
        var fr = new FileReader();
        fr.onerror = function () { reject(new Error('Không đọc được file.')); };
        fr.onload = function () {
          var obj;
          try { obj = JSON.parse(fr.result); } catch (e) { return reject(new Error('File không phải JSON hợp lệ.')); }
          if (!obj || typeof obj.data !== 'object' || obj.data === null || Array.isArray(obj.data)) return reject(new Error('File không đúng định dạng sao lưu của ứng dụng.'));
          if (obj.app && obj.app !== EP.config.prefix) return reject(new Error('File sao lưu thuộc ứng dụng khác.'));
          var n = 0;
          Object.keys(obj.data).forEach(function (k) { if (k === 'ai_key' || k === 'ai_remember') return; EP.store.write(k, obj.data[k]); n++; });
          EP.bus.emit('restore', n); resolve(n);
        };
        fr.readAsText(file);
      });
    },
    pickFile: function (accept) {
      return new Promise(function (resolve) {
        var i = doc.createElement('input'); i.type = 'file'; i.accept = accept || ''; i.style.display = 'none';
        i.addEventListener('change', function () { var f = i.files && i.files[0]; i.remove(); if (f) resolve(f); });
        doc.body.appendChild(i); i.click();
      });
    }
  };
})(window);
