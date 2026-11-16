/* import.js - EP.importer: nhập .xlsx / .xls / .csv ngoài mạng (file dữ liệu mẫu của BTC) -> chọn sheet -> xem trước 20 dòng ->
   ghép cột với schema đích (tự đoán theo tên cột tiếng Việt/Anh, không phân biệt dấu) -> kiểm tra -> nạp vào EP.collection.
   SheetJS (js/vendor/xlsx.full.min.js, Apache-2.0) chỉ được nạp lười khi gặp file Excel; CSV tự đọc, không cần thư viện.

     EP.importer.mount(el, {
       title: 'Nhập dữ liệu mẫu của BTC',
       collection: EP.collection('btc_sample'),          // nơi nạp vào
       tag: 'Dữ liệu mẫu từ BTC',                         // gắn vào mỗi dòng (hiện thành nhãn)
       fields: [{ key: 'date', label: 'Ngày', type: 'date', required: true, aliases: ['ngay', 'date'] },
                { key: 'name', label: 'Sản phẩm', type: 'text', required: true, aliases: ['san pham', 'ten hang', 'product'] },
                { key: 'qty', label: 'Số lượng', type: 'number', aliases: ['sl', 'quantity'] },
                { key: 'price', label: 'Đơn giá', type: 'money' }],     // type: text | number | money | percent | date
       onImport: function (rows, info) {}                // sau khi nạp xong
     });

   Hàm thuần (kiểm thử được): EP.importer.parseNumber('1.234.567,5') -> 1234567.5 ; parseDate('31/12/2026') -> '2026-12-31' ;
   normalize('Đơn giá') -> 'don gia' ; guess(headers, fields) -> { key: chỉ-số-cột } ; parseCsv(text) -> [[...]] ;
   validate(rows, mapping, fields) -> { rows, errors, empty } ; readFile(file) -> Promise<{ kind, sheets: [{ name, rows }] }>. */
(function (root) {
  'use strict';
  var EP = root.EP, esc = EP.esc, doc = root.document, libP = null;
  var LIB_URL = 'js/vendor/xlsx.full.min.js';

  /* ---------- hàm thuần ---------- */
  function normalize(s) {
    return String(s == null ? '' : s).toLowerCase().replace(/đ/g, 'd').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  }
  /** Số kiểu vi-VN ('1.234.567,5', '12,5%', '1.250.000 ₫', '(1.234)') và cả kiểu en ('1,234.5'). Không đọc được -> NaN. */
  function parseNumber(v) {
    if (typeof v === 'number') return isFinite(v) ? v : NaN;
    var s = String(v == null ? '' : v).trim();
    if (!s) return NaN;
    var neg = /^\(.*\)$/.test(s) || /^-/.test(s) || /^−/.test(s);
    s = s.replace(/[^\d.,]/g, '');
    if (!/\d/.test(s)) return NaN;
    var lc = s.lastIndexOf(','), ld = s.lastIndexOf('.'), dots = (s.match(/\./g) || []).length, commas = (s.match(/,/g) || []).length;
    if (lc >= 0 && ld >= 0) { s = lc > ld ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, ''); }
    else if (lc >= 0) { s = commas > 1 ? s.replace(/,/g, '') : s.replace(',', '.'); }
    else if (ld >= 0) { if (dots > 1 || /^\d{1,3}\.\d{3}$/.test(s)) s = s.replace(/\./g, ''); }
    var n = Number(s);
    return isFinite(n) ? (neg ? -n : n) : NaN;
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function validYmd(y, m, d) { var t = new Date(Date.UTC(y, m - 1, d)); return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d; }
  /** Ngày dd/mm/yyyy (hoặc - .), yyyy-mm-dd, số serial Excel -> 'yyyy-mm-dd'; sai -> null. */
  function parseDate(v) {
    if (v instanceof Date) return isNaN(v) ? null : v.getFullYear() + '-' + pad(v.getMonth() + 1) + '-' + pad(v.getDate());
    if (typeof v === 'number') {
      if (v < 20000 || v > 80000) return null;
      var d0 = new Date(Math.round((v - 25569) * 86400000));
      return d0.getUTCFullYear() + '-' + pad(d0.getUTCMonth() + 1) + '-' + pad(d0.getUTCDate());
    }
    var s = String(v == null ? '' : v).trim(), m;
    if (!s) return null;
    if ((m = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})(?:[ T].*)?$/.exec(s))) return validYmd(+m[1], +m[2], +m[3]) ? m[1] + '-' + pad(+m[2]) + '-' + pad(+m[3]) : null;
    if ((m = /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2}|\d{4})(?:[ T].*)?$/.exec(s))) {
      var y = +m[3]; if (m[3].length === 2) y += 2000;
      return validYmd(y, +m[2], +m[1]) ? y + '-' + pad(+m[2]) + '-' + pad(+m[1]) : null;
    }
    return null;
  }
  /** Đoán cột cho từng trường: khớp tên chính xác > chứa nhau (không dấu). Mỗi cột chỉ gán một lần. -> { key: index | -1 } */
  function guess(headers, fields) {
    var H = headers.map(normalize), used = {}, out = {};
    fields.forEach(function (f) { out[f.key] = -1; });
    function names(f) { return [f.label, f.key].concat(f.aliases || []).map(normalize).filter(Boolean); }
    [function (h, n) { return h === n; }, function (h, n) { return h.length > 1 && n.length > 2 && (h.indexOf(n) >= 0 || n.indexOf(h) >= 0); }].forEach(function (match) {
      fields.forEach(function (f) {
        if (out[f.key] >= 0) return;
        var ns = names(f);
        for (var i = 0; i < H.length; i++) { if (!used[i] && H[i] && ns.some(function (n) { return match(H[i], n); })) { out[f.key] = i; used[i] = 1; return; } }
      });
    });
    return out;
  }
  /** CSV có ngoặc kép, tự dò dấu phân tách , ; hoặc tab, bỏ BOM. */
  function parseCsv(text) {
    text = String(text || '').replace(/^﻿/, '');
    var first = text.split(/\r?\n/)[0] || '', sep = ',', best = -1;
    [',', ';', '\t'].forEach(function (c) { var n = first.split(c).length; if (n > best) { best = n; sep = c; } });
    var rows = [], row = [], cell = '', q = false, i, ch;
    for (i = 0; i < text.length; i++) {
      ch = text.charAt(i);
      if (q) { if (ch === '"') { if (text.charAt(i + 1) === '"') { cell += '"'; i++; } else q = false; } else cell += ch; }
      else if (ch === '"') q = true;
      else if (ch === sep) { row.push(cell); cell = ''; }
      else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text.charAt(i + 1) === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; }
      else cell += ch;
    }
    if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
    return rows;
  }
  function isBlank(v) { return v == null || String(v).trim() === ''; }

  /** Kiểm tra + chuyển kiểu. mapping = { key: chỉ-số-cột }. Dòng trống hoàn toàn bị bỏ qua (đếm ở `empty`). Dòng lỗi vào `errors`, không vào `rows`. */
  function validate(data, mapping, fields) {
    var rows = [], errors = [], empty = 0;
    data.forEach(function (r, idx) {
      var line = r.__line || idx + 1;
      var any = fields.some(function (f) { return mapping[f.key] >= 0 && !isBlank(r[mapping[f.key]]); });
      if (!any) { empty++; return; }
      var o = {}, bad = false;
      fields.forEach(function (f) {
        var ci = mapping[f.key], raw = ci >= 0 ? r[ci] : '', val = null;
        if (isBlank(raw)) { if (f.required) { errors.push({ line: line, field: f.label, msg: 'thiếu "' + f.label + '"' }); bad = true; } o[f.key] = null; return; }
        if (f.type === 'number' || f.type === 'money' || f.type === 'percent') {
          val = parseNumber(raw);
          if (isNaN(val)) { errors.push({ line: line, field: f.label, msg: '"' + f.label + '" = "' + String(raw).slice(0, 24) + '" không phải số' }); bad = true; val = null; }
        } else if (f.type === 'date') {
          val = parseDate(raw);
          if (!val) { errors.push({ line: line, field: f.label, msg: '"' + f.label + '" = "' + String(raw).slice(0, 24) + '" không phải ngày dd/mm/yyyy' }); bad = true; }
        } else val = String(raw).trim();
        o[f.key] = val;
      });
      if (!bad) rows.push(o);
    });
    return { rows: rows, errors: errors, empty: empty };
  }

  /* ---------- đọc file ---------- */
  function loadLib() {
    if (root.XLSX) return Promise.resolve(root.XLSX);
    if (libP) return libP;
    libP = new Promise(function (resolve, reject) {
      var s = doc.createElement('script'); s.src = EP.importer.libUrl; s.async = true;
      s.onload = function () { root.XLSX ? resolve(root.XLSX) : reject(new Error('Thư viện đọc Excel không nạp được.')); };
      s.onerror = function () { libP = null; reject(new Error('Không nạp được thư viện đọc Excel (js/vendor/xlsx.full.min.js). Hãy lưu file thành CSV rồi nhập lại.')); };
      doc.head.appendChild(s);
    });
    return libP;
  }
  function readText(file) {
    return file.arrayBuffer().then(function (buf) {
      try { return new TextDecoder('utf-8', { fatal: true }).decode(buf); }
      catch (e) { try { return new TextDecoder('windows-1258').decode(buf); } catch (e2) { return new TextDecoder('utf-8').decode(buf); } }
    });
  }
  function sheetRows(X, ws) {
    var ref = ws['!ref']; if (!ref) return [];
    var rng = X.utils.decode_range(ref), out = [], R, C;
    for (R = rng.s.r; R <= rng.e.r; R++) {
      var row = [];
      for (C = rng.s.c; C <= rng.e.c; C++) {
        var c = ws[X.utils.encode_cell({ r: R, c: C })], v = '';
        if (c) {
          if (c.t === 'n' && c.z && X.SSF && X.SSF.is_date(c.z)) { var p = X.SSF.parse_date_code(c.v); v = p ? p.y + '-' + pad(p.m) + '-' + pad(p.d) : c.v; }
          else if (c.t === 'd') v = parseDate(c.v) || '';
          else if (c.t === 'n' || c.t === 's' || c.t === 'b') v = c.v;
          else if (c.t === 'e') v = '';
          else v = c.w != null ? c.w : '';
        }
        row.push(v);
      }
      out.push(row);
    }
    return out;
  }
  function readFile(file) {
    var name = (file && file.name || '').toLowerCase();
    if (!file) return Promise.reject(new Error('Chưa chọn file.'));
    if (/\.(csv|txt|tsv)$/.test(name)) return readText(file).then(function (t) { return { kind: 'csv', sheets: [{ name: 'CSV', rows: parseCsv(t) }] }; });
    if (/\.(xlsx|xlsm|xls)$/.test(name)) {
      return loadLib().then(function (X) {
        return file.arrayBuffer().then(function (buf) {
          var wb; try { wb = X.read(new Uint8Array(buf), { type: 'array', cellNF: true }); } catch (e) { throw new Error('File Excel bị hỏng hoặc đặt mật khẩu.'); }
          return { kind: 'excel', sheets: wb.SheetNames.map(function (n) { return { name: n, rows: sheetRows(X, wb.Sheets[n]) }; }) };
        });
      });
    }
    return Promise.reject(new Error('Chỉ nhận .xlsx, .xls hoặc .csv.'));
  }
  /** Bỏ dòng trống đầu/cuối (giữ dòng trống ở giữa để số dòng báo lỗi khớp với file); cắt cột trống bên phải. */
  function trimRows(rows) {
    var nonEmpty = function (r) { return r.some(function (c) { return !isBlank(c); }); };
    var a = 0, b = rows.length - 1;
    while (a <= b && !nonEmpty(rows[a])) a++;
    while (b >= a && !nonEmpty(rows[b])) b--;
    var out = rows.slice(a, b + 1), w = 0;
    out.forEach(function (r) { for (var i = r.length - 1; i >= 0; i--) { if (!isBlank(r[i])) { w = Math.max(w, i + 1); break; } } });
    return out.map(function (r) { return r.slice(0, w); });
  }

  /* ---------- giao diện ---------- */
  function mount(el, o) {
    var coll = o.collection, tag = o.tag || 'Dữ liệu mẫu từ BTC', fields = o.fields, prev = o.maxPreview || 20;
    var st = { file: null, sheets: [], sheet: 0, header: true, map: {}, check: null };
    el.classList.add('im');
    el.innerHTML = '<div class="card"><div class="card-head"><h2 class="section-title">' + esc(o.title || 'Nhập dữ liệu từ file') + '</h2>' + EP.ui.badge(tag, 'accent') + '</div>' +
      '<p class="muted">Chọn file .xlsx, .xls hoặc .csv (đọc ngay trên máy bạn, không gửi đi đâu). Số kiểu 1.234.567,5 và ngày dd/mm/yyyy được hiểu đúng.</p>' +
      '<label class="im-drop mt-3" data-drop><input type="file" data-file accept=".xlsx,.xls,.xlsm,.csv,.tsv,text/csv" aria-label="Chọn file dữ liệu">' + EP.ui.icon('upload') + '<b>Chọn file hoặc kéo thả vào đây</b><span class="muted">.xlsx · .xls · .csv</span></label>' +
      (o.sampleUrl ? '<div class="row mt-3"><button type="button" class="btn btn-sm" data-act="sample">' + EP.ui.icon('file') + 'Dùng file mẫu có sẵn</button><a class="btn btn-sm btn-ghost" href="' + esc(o.sampleUrl) + '" download>Tải file mẫu</a></div>' : '') +
      '<div data-slot="status" class="mt-3" aria-live="polite"></div>' +
      '<div data-slot="flow"></div></div><div data-slot="done"></div>';
    var $ = function (s) { return el.querySelector('[data-slot="' + s + '"]'); };
    function status(html) { $('status').innerHTML = html || ''; }
    function err(msg) { status('<p class="ai-notice" role="alert">' + EP.ui.icon('alert') + '<span>' + esc(msg) + '</span></p>'); }

    function load(file) {
      status('<p class="muted">Đang đọc ' + esc(file.name) + '...</p>'); $('flow').innerHTML = '';
      readFile(file).then(function (res) {
        st.file = file; st.sheets = res.sheets.map(function (s) { return { name: s.name, rows: trimRows(s.rows) }; });
        var firstGood = st.sheets.findIndex(function (s) { return s.rows.length > 1; }); st.sheet = firstGood < 0 ? 0 : firstGood;
        if (!st.sheets.length || st.sheets.every(function (s) { return !s.rows.length; })) return err('File không có dữ liệu.');
        status('<p>' + EP.ui.badge(file.name, '') + ' ' + st.sheets.length + ' sheet</p>');
        drawFlow();
      }, function (e) { err(e.message); });
    }
    function table(rows) {
      return '<div class="im-prev" tabindex="0" role="region" aria-label="Xem trước"><table><tbody>' + rows.map(function (r, i) {
        return '<tr>' + r.map(function (c) { return (i === 0 && st.header ? '<th scope="col">' : '<td>') + esc(c) + (i === 0 && st.header ? '</th>' : '</td>'); }).join('') + '</tr>';
      }).join('') + '</tbody></table></div>';
    }
    function curRows() { return st.sheets[st.sheet].rows; }
    function headers() { var r = curRows(), w = r.reduce(function (m, x) { return Math.max(m, x.length); }, 0), h = []; for (var i = 0; i < w; i++) h.push(st.header && r[0] && !isBlank(r[0][i]) ? String(r[0][i]) : 'Cột ' + (i + 1)); return h; }
    function drawFlow() {
      var sh = st.sheets[st.sheet], hd = headers();
      st.map = guess(hd, fields);
      $('flow').innerHTML =
        '<div class="im-step"><div class="row between"><h3 class="sc-sub">1. Chọn sheet</h3></div><div class="mt-2" data-slot="sheetpick"></div>' +
        '<label class="check mt-2"><input type="checkbox" data-header ' + (st.header ? 'checked' : '') + '> Dòng đầu tiên là tiêu đề cột</label></div>' +
        '<div class="im-step"><h3 class="sc-sub">2. Xem trước ' + Math.min(prev, sh.rows.length) + '/' + sh.rows.length + ' dòng</h3><div class="mt-2">' + table(sh.rows.slice(0, prev)) + '</div></div>' +
        '<div class="im-step"><h3 class="sc-sub">3. Ghép cột (đã tự đoán, sửa nếu sai)</h3><div class="im-map mt-2">' + fields.map(function (f) {
          var id = 'im-' + f.key + '-' + EP.uid();
          return '<div class="field"><select class="input" id="' + id + '" data-map="' + esc(f.key) + '"><option value="-1">(Bỏ qua)</option>' + hd.map(function (h, i) { return '<option value="' + i + '"' + (st.map[f.key] === i ? ' selected' : '') + '>' + esc(h) + '</option>'; }).join('') + '</select><label class="label" for="' + id + '">' + esc(f.label + (f.required ? ' *' : '')) + '</label></div>';
        }).join('') + '</div></div>' +
        '<div class="im-step"><h3 class="sc-sub">4. Kiểm tra và nhập</h3><div data-slot="check" class="mt-2" aria-live="polite"></div><div class="row mt-3"><button class="btn btn-primary" type="button" data-act="import">' + EP.ui.icon('check') + 'Nhập dữ liệu</button>' +
        '<label class="check"><input type="checkbox" data-replace checked> Thay dữ liệu đã nhập trước đó</label></div></div>';
      EP.ui.segmented($('flow').querySelector('[data-slot="sheetpick"]'), { label: 'Sheet', name: 'im-sheet-' + EP.uid(), value: String(st.sheet), options: st.sheets.map(function (s, i) { return { value: String(i), label: s.name }; }), onChange: function (v) { st.sheet = Number(v); drawFlow(); } });
      runCheck();
    }
    function runCheck() {
      var rows = curRows().slice(st.header ? 1 : 0); rows = rows.map(function (r, i) { var c = r.slice(); c.__line = i + (st.header ? 2 : 1); return c; });
      st.check = validate(rows, st.map, fields);
      var c = st.check, missing = fields.filter(function (f) { return f.required && st.map[f.key] < 0; });
      $('flow').querySelector('[data-slot="check"]').innerHTML =
        '<div class="im-sum">' + EP.ui.badge(c.rows.length + ' dòng hợp lệ', 'positive') + (c.errors.length ? EP.ui.badge(c.errors.length + ' lỗi', 'negative') : '') + (c.empty ? EP.ui.badge(c.empty + ' dòng trống bỏ qua', '') : '') + '</div>' +
        (missing.length ? '<p class="im-errs" role="alert">Chưa ghép cột bắt buộc: ' + esc(missing.map(function (f) { return f.label; }).join(', ')) + '.</p>' : '') +
        (c.errors.length ? '<ul class="im-errs">' + c.errors.slice(0, 8).map(function (e) { return '<li>Dòng ' + e.line + ': ' + esc(e.msg) + '</li>'; }).join('') + (c.errors.length > 8 ? '<li>... và ' + (c.errors.length - 8) + ' lỗi khác.</li>' : '') + '</ul><p class="muted mt-2">Dòng lỗi sẽ không được nhập. Sửa file hoặc ghép lại cột rồi thử lại.</p>' : '');
      var b = $('flow').querySelector('[data-act="import"]'); if (b) { b.disabled = !c.rows.length || !!missing.length; }
    }
    function doImport() {
      var c = st.check; if (!c || !c.rows.length) return;
      var existing = $('flow').querySelector('[data-replace]').checked ? [] : coll.list();
      var now = Date.now(), src = st.file.name + ' / ' + st.sheets[st.sheet].name;
      var rows = c.rows.map(function (r, i) { return Object.assign({ id: EP.uid() + i, createdAt: now }, r, { tag: tag, source: src }); });
      coll.replace(rows.concat(existing));
      status('<p>' + EP.ui.badge('Đã nhập ' + rows.length + ' dòng', 'positive') + ' ' + EP.ui.badge(tag, 'accent') + '</p>');
      EP.ui.toast('Đã nhập ' + rows.length + ' dòng (' + tag + ').', { type: 'success' });
      EP.bus.emit('import:done', { collection: coll.name, count: rows.length, tag: tag });
      if (o.onImport) o.onImport(rows, { source: src, errors: c.errors, empty: c.empty });
    }
    el.addEventListener('change', function (e) {
      var t = e.target;
      if (t.hasAttribute('data-file')) { if (t.files && t.files[0]) load(t.files[0]); }
      else if (t.hasAttribute('data-header')) { st.header = t.checked; drawFlow(); }
      else if (t.hasAttribute('data-map')) { st.map[t.getAttribute('data-map')] = Number(t.value); runCheck(); }
    });
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]'); if (!b) return;
      if (b.getAttribute('data-act') === 'import') doImport();
      else if (b.getAttribute('data-act') === 'sample') {
        fetch(o.sampleUrl).then(function (r) { if (!r.ok) throw new Error('http'); return r.blob(); }).then(function (bl) { var f = new File([bl], o.sampleUrl.split('/').pop(), { type: bl.type }); load(f); }, function () { err('Không mở được file mẫu (cần chạy qua máy chủ web, không mở bằng file://).'); });
      }
    });
    var drop = el.querySelector('[data-drop]');
    ['dragenter', 'dragover'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('is-over'); }); });
    ['dragleave', 'drop'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('is-over'); }); });
    drop.addEventListener('drop', function (e) { var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]; if (f) load(f); });
    return { load: load, state: function () { return st; }, collection: coll };
  }

  EP.importer = { mount: mount, readFile: readFile, parseNumber: parseNumber, parseDate: parseDate, parseCsv: parseCsv, normalize: normalize, guess: guess, validate: validate, loadLib: loadLib, libUrl: LIB_URL };
})(window);
