/* ui.js - thành phần giao diện dùng lại: icon, toast, hộp thoại, confirm, copy, skeleton, trạng thái trống/lỗi,
   KPI, badge, stepper, segmented, chips, bảng sắp xếp được. Hàm trả về chuỗi HTML đã escape dữ liệu. */
(function (root) {
  'use strict';
  var EP = root.EP, doc = root.document, esc = EP.esc;

  /* ---------- Icon (stroke 2px, 24x24) ---------- */
  var P = {
    plus: '<path d="M12 5v14M5 12h14"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6"/>',
    edit: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
    upload: '<path d="M12 15V3M7 8l5-5 5 5M5 21h14"/>',
    sparkles: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a1 1 0 01-1-1V4a1 1 0 011-1h10a1 1 0 011 1v1"/>',
    check: '<path d="M5 12l5 5 9-10"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/>',
    auto: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 000 18z" fill="currentColor"/>',
    home: '<path d="M3 11l9-8 9 8M5 10v10h14V10"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    settings: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
    alert: '<path d="M12 9v4M12 17h.01M10.3 3.9L2 18a2 2 0 001.7 3h16.6a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    inbox: '<path d="M3 13l3-8h12l3 8M3 13v6h18v-6M3 13h5l1 3h6l1-3h5"/>',
    print: '<path d="M6 9V3h12v6M6 18H4v-7h16v7h-2M6 14h12v7H6z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    send: '<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>',
    chat: '<path d="M21 12a8 8 0 01-11.6 7.1L3 21l1.9-5.4A8 8 0 1121 12z"/>',
    quiz: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 114 2c-.9.6-1.5 1.1-1.5 2.2M12 17h.01"/>',
    calc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>',
    refresh: '<path d="M21 12a9 9 0 01-15.5 6.2M3 12A9 9 0 0118.5 5.8M21 4v5h-5M3 20v-5h5"/>',
    file: '<path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8zM14 3v5h5M9 13h6M9 17h6"/>'
  };
  var warned = {};
  function icon(name, cls) {
    if (!P[name] && name && !warned[name]) { warned[name] = 1; console.warn('[EP.ui.icon] Không có icon "' + name + '" (dùng "info" thay thế). Icon có sẵn: ' + Object.keys(P).join(', ')); }
    return '<svg class="icon ' + (cls || '') + '" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (P[name] || P.info) + '</svg>';
  }

  var ui = EP.ui = { icons: P, icon: icon };

  /* ---------- Toast ---------- */
  /** EP.ui.toast('Đã lưu', { type: 'success'|'error'|'warn'|'info', duration: 4000, action: { label, onClick } }) -> hàm đóng */
  ui.toast = function (msg, opts) {
    opts = opts || {};
    var host = doc.getElementById('toasts');
    if (!host) { host = doc.createElement('div'); host.id = 'toasts'; host.className = 'toasts'; doc.body.appendChild(host); }
    while (host.children.length >= 4) host.firstChild.remove();
    var type = opts.type || 'info', t = doc.createElement('div');
    t.className = 'toast ' + type;
    t.setAttribute('role', type === 'error' ? 'alert' : 'status');
    t.innerHTML = '<span class="t-ico">' + icon(type === 'success' ? 'check' : type === 'error' || type === 'warn' ? 'alert' : 'info') + '</span><span class="t-msg">' + esc(msg) + '</span>' +
      (opts.action ? '<button type="button" data-t-act>' + esc(opts.action.label) + '</button>' : '') +
      '<button type="button" data-t-x aria-label="Đóng thông báo">' + icon('x') + '</button>';
    host.appendChild(t);
    var timer, closed = false;
    function close() {
      if (closed) return; closed = true; clearTimeout(timer);
      t.classList.add('out');
      setTimeout(function () { t.remove(); }, EP.reduced() ? 0 : 200);
    }
    t.querySelector('[data-t-x]').addEventListener('click', close);
    var a = t.querySelector('[data-t-act]');
    if (a) a.addEventListener('click', function () { try { opts.action.onClick(); } finally { close(); } });
    timer = setTimeout(close, opts.duration || (type === 'error' ? 6500 : 3800));
    return close;
  };
  ['success', 'error', 'warn'].forEach(function (k) { ui.toast[k] = function (m, o) { return ui.toast(m, Object.assign({ type: k }, o)); }; });

  /* ---------- Hộp thoại (thẻ <dialog> gốc: tự khoá focus, Esc để đóng) ----------
     var d = EP.ui.dialog({ title, body: html|Node, size: 'wide', actions: [{label, variant:'primary', value, type:'submit', form:'formId', onClick}] })
     d.el, d.body (phần nội dung), d.close(value), d.closed (Promise<value>) */
  ui.dialog = function (o) {
    var dlg = doc.createElement('dialog');
    dlg.className = 'dlg' + (o.size === 'wide' ? ' wide' : '');
    var tid = EP.uid();
    dlg.setAttribute('aria-labelledby', tid);
    dlg.innerHTML = '<div class="dlg-head"><h2 class="dlg-title" id="' + tid + '">' + esc(o.title || '') + '</h2><button type="button" class="icon-btn" data-close aria-label="Đóng">' + icon('x') + '</button></div><div class="dlg-body"></div><div class="dlg-foot"></div>';
    var body = dlg.querySelector('.dlg-body'), foot = dlg.querySelector('.dlg-foot');
    if (typeof o.body === 'string') body.innerHTML = o.body; else if (o.body) body.appendChild(o.body);
    (o.actions || []).forEach(function (a) {
      var b = doc.createElement('button');
      b.type = a.type || 'button';
      b.className = 'btn' + (a.variant ? ' btn-' + a.variant : '');
      if (a.variant === 'danger-solid') b.className = 'btn btn-danger solid';
      if (a.form) b.setAttribute('form', a.form);
      if (a.id) b.id = a.id;
      b.innerHTML = (a.icon ? icon(a.icon) : '') + esc(a.label);
      b.addEventListener('click', function () {
        if (a.onClick) a.onClick(api);
        if (a.value !== undefined) api.close(a.value);
      });
      foot.appendChild(b);
    });
    if (!foot.children.length) foot.remove();
    var resolve, closed = new Promise(function (r) { resolve = r; }), val;
    var api = { el: dlg, body: body, closed: closed, close: function (v) { val = v; if (dlg.open) dlg.close(); else finish(); } };
    function finish() { dlg.remove(); resolve(val); if (o.onClose) o.onClose(val); }
    dlg.addEventListener('close', finish);
    dlg.addEventListener('click', function (e) { if (e.target === dlg || (e.target.closest && e.target.closest('[data-close]'))) api.close(undefined); });
    doc.body.appendChild(dlg);
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    var first = body.querySelector('input,select,textarea') || foot.querySelector('.btn-primary') || foot.querySelector('.btn');
    if (first && o.autofocus !== false && !(root.matchMedia && root.matchMedia('(pointer: coarse)').matches && first.matches('input,textarea'))) first.focus();
    return api;
  };

  /** await EP.ui.confirm({ title, message, confirmLabel, danger }) -> true/false */
  ui.confirm = function (o) {
    var d = ui.dialog({
      title: o.title || 'Xác nhận', body: '<p>' + esc(o.message || 'Bạn chắc chắn chứ?') + '</p>',
      actions: [{ label: o.cancelLabel || 'Hủy', value: false }, { label: o.confirmLabel || 'Đồng ý', variant: o.danger ? 'danger-solid' : 'primary', value: true, id: 'confirm-ok' }]
    });
    return d.closed.then(function (v) { return v === true; });
  };

  /* ---------- Copy ---------- */
  /** EP.ui.copy(text, 'Đã sao chép') -> Promise<boolean>; có fallback khi không có Clipboard API */
  ui.copy = function (text, okMsg) {
    function ok(v) { if (v) ui.toast(okMsg || 'Đã sao chép', { type: 'success' }); else ui.toast('Không sao chép được, hãy chọn và copy thủ công.', { type: 'error' }); return v; }
    function fallback() {
      var ta = doc.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
      doc.body.appendChild(ta); ta.select(); var r = false;
      try { r = doc.execCommand('copy'); } catch (e) { r = false; }
      ta.remove(); return r;
    }
    if (root.navigator.clipboard && root.isSecureContext) return root.navigator.clipboard.writeText(text).then(function () { return ok(true); }, function () { return ok(fallback()); });
    return Promise.resolve(ok(fallback()));
  };

  /* ---------- Skeleton, trạng thái trống/lỗi ---------- */
  ui.skeleton = function (lines) {
    var h = '<div class="skeleton" aria-busy="true" aria-label="Đang tải"><div class="sk title"></div>';
    for (var i = 0; i < (lines || 3); i++) h += '<div class="sk" style="width:' + (92 - i * 14) + '%"></div>';
    return h + '</div>';
  };
  /** EP.ui.empty({ icon, title, text, action: { label, act } }) -> html ; nút có data-act="act" */
  ui.empty = function (o) {
    o = o || {};
    return '<div class="state"><div class="state-ico">' + icon(o.icon || 'inbox') + '</div><h3>' + esc(o.title || 'Chưa có dữ liệu') + '</h3>' +
      (o.text ? '<p>' + esc(o.text) + '</p>' : '') +
      (o.action ? '<div class="row"><button type="button" class="btn btn-primary" data-act="' + esc(o.action.act) + '">' + icon(o.action.icon || 'plus') + esc(o.action.label) + '</button></div>' : '') + '</div>';
  };
  ui.error = function (o) {
    o = o || {};
    return '<div class="state error" role="alert"><div class="state-ico">' + icon('alert') + '</div><h3>' + esc(o.title || 'Có lỗi xảy ra') + '</h3>' +
      (o.text ? '<p>' + esc(o.text) + '</p>' : '') +
      (o.retry ? '<div class="row"><button type="button" class="btn" data-act="' + esc(o.retry) + '">' + icon('refresh') + 'Thử lại</button></div>' : '') + '</div>';
  };
  /** Đặt nút vào trạng thái đang chạy (chống bấm đôi): EP.ui.busy(btn, true/false) */
  ui.busy = function (btn, on) { if (!btn) return; if (on) { btn.setAttribute('aria-busy', 'true'); btn.setAttribute('aria-disabled', 'true'); } else { btn.removeAttribute('aria-busy'); btn.removeAttribute('aria-disabled'); } };

  /* ---------- KPI, badge, stepper ---------- */
  /** EP.ui.kpi({ label, value, hint, delta: +12.5 (%), tone }) */
  ui.kpi = function (k) {
    var d = '';
    if (k.delta != null && isFinite(k.delta)) d = '<span class="delta ' + (k.delta >= 0 ? 'up' : 'down') + '">' + (k.delta >= 0 ? '▲ ' : '▼ ') + Math.abs(k.delta).toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + '%</span>';
    return '<div class="card kpi"><div class="kpi-label">' + esc(k.label) + '</div><div class="kpi-value">' + esc(k.value) + '</div><div class="kpi-foot">' + d + (k.hint ? '<span>' + esc(k.hint) + '</span>' : '') + '</div></div>';
  };
  /** tone: positive | negative | warning | accent | (rỗng = trung tính) */
  ui.badge = function (text, tone) { return '<span class="badge ' + (tone || '') + '">' + esc(text) + '</span>'; };
  /** EP.ui.stepper(['Nhập', 'Tạo', 'Duyệt'], 1) -> current là chỉ số 0-based; >= length là xong hết */
  ui.stepper = function (steps, current) {
    return '<ol class="stepper" aria-label="Các bước">' + steps.map(function (s, i) {
      var c = i < current ? 'done' : i === current ? 'current' : '';
      return '<li class="' + c + '"' + (c === 'current' ? ' aria-current="step"' : '') + '><span><b>' + esc(s) + '</b></span></li>';
    }).join('') + '</ol>';
  };

  /* ---------- Segmented (radio gốc nên có sẵn bàn phím) ----------
     var s = EP.ui.segmented(el, { label, name, options: [{value,label}], value, onChange(v) }); s.get(); s.set(v) */
  ui.segmented = function (el, o) {
    var name = o.name || 'seg-' + EP.uid();
    el.innerHTML = '<div class="seg" role="radiogroup" aria-label="' + esc(o.label || '') + '">' + o.options.map(function (op) {
      return '<label><input type="radio" name="' + esc(name) + '" value="' + esc(op.value) + '"' + (String(op.value) === String(o.value) ? ' checked' : '') + '><span>' + esc(op.label) + '</span></label>';
    }).join('') + '</div>';
    el.addEventListener('change', function (e) { if (e.target.name === name && o.onChange) o.onChange(e.target.value); });
    return {
      get: function () { var c = el.querySelector('input:checked'); return c ? c.value : null; },
      set: function (v) { var i = el.querySelector('input[value="' + String(v).replace(/"/g, '') + '"]'); if (i) i.checked = true; }
    };
  };
  /** Chip bật/tắt: EP.ui.chips(el, { options: [{value,label}], value: [] | 'x', multi, onChange(v) }) */
  ui.chips = function (el, o) {
    var sel = o.multi ? (o.value || []).slice() : [o.value];
    function draw() {
      el.innerHTML = '<div class="chips">' + o.options.map(function (op) {
        return '<button type="button" class="chip" data-v="' + esc(op.value) + '" aria-pressed="' + (sel.indexOf(op.value) >= 0) + '">' + esc(op.label) + '</button>';
      }).join('') + '</div>';
    }
    draw();
    el.addEventListener('click', function (e) {
      var b = e.target.closest('.chip[data-v]'); if (!b) return;
      var v = b.getAttribute('data-v'), i = sel.indexOf(v);
      if (o.multi) { if (i >= 0) sel.splice(i, 1); else sel.push(v); } else sel = [v];
      draw(); if (o.onChange) o.onChange(o.multi ? sel.slice() : sel[0]);
    });
    return { get: function () { return o.multi ? sel.slice() : sel[0]; } };
  };

  /* ---------- Bảng sắp xếp được ----------
     var t = EP.ui.table(el, {
       caption: 'Danh sách', columns: [{ key:'name', label:'Tên', sort:true, type:'text'|'number'|'date', render(row)->html, num:true }],
       rows, rowKey:'id', actions(row)->html (nút có data-act), onAction(act, id, row), empty:{...EP.ui.empty opts}, sort:{key,dir} });
     t.setRows(rows) */
  ui.table = function (el, o) {
    var rows = o.rows || [], sort = o.sort || null, coll = new Intl.Collator('vi', { numeric: true, sensitivity: 'base' });
    function val(r, c) { return c.value ? c.value(r) : r[c.key]; }
    function sorted() {
      if (!sort) return rows;
      var c = o.columns.filter(function (x) { return x.key === sort.key; })[0]; if (!c) return rows;
      var dir = sort.dir === 'desc' ? -1 : 1;
      return rows.map(function (r, i) { return [r, i]; }).sort(function (a, b) {
        var x = val(a[0], c), y = val(b[0], c), r;
        if (x == null || x === '') r = (y == null || y === '') ? 0 : 1; else if (y == null || y === '') r = -1;
        else if (c.type === 'number') r = (Number(x) - Number(y)) * dir;
        else if (c.type === 'date') r = (new Date(x) - new Date(y)) * dir;
        else r = coll.compare(String(x), String(y)) * dir;
        if (x == null || x === '' || y == null || y === '') return r;
        return r || a[1] - b[1];
      }).map(function (p) { return p[0]; });
    }
    function draw() {
      if (!rows.length) { el.innerHTML = o.empty ? ui.empty(o.empty) : ui.empty({}); return; }
      var head = o.columns.map(function (c) {
        var cls = c.num ? ' class="num"' : '', s = sort && sort.key === c.key ? (sort.dir === 'desc' ? 'descending' : 'ascending') : 'none';
        return c.sort ? '<th scope="col"' + cls + ' aria-sort="' + s + '"><button type="button" data-sort="' + esc(c.key) + '">' + esc(c.label) + '</button></th>'
          : '<th scope="col"' + cls + '><span class="th-in">' + esc(c.label) + '</span></th>';
      }).join('') + (o.actions ? '<th scope="col"><span class="sr-only">Thao tác</span></th>' : '');
      var body = sorted().map(function (r) {
        return '<tr data-id="' + esc(r[o.rowKey || 'id']) + '">' + o.columns.map(function (c) {
          var v = c.render ? c.render(r) : esc(val(r, c));
          return '<td' + (c.num ? ' class="num"' : '') + (c.label ? ' data-label="' + esc(c.label) + '"' : '') + '>' + v + '</td>';
        }).join('') + (o.actions ? '<td class="actions">' + o.actions(r) + '</td>' : '') + '</tr>';
      }).join('');
      el.innerHTML = '<div class="table-wrap"><table class="table">' + (o.caption ? '<caption class="sr-only">' + esc(o.caption) + '</caption>' : '') + '<thead><tr>' + head + '</tr></thead><tbody>' + body + '</tbody></table></div>';
    }
    el.addEventListener('click', function (e) {
      var s = e.target.closest('[data-sort]');
      if (s) {
        var k = s.getAttribute('data-sort');
        sort = sort && sort.key === k ? { key: k, dir: sort.dir === 'asc' ? 'desc' : 'asc' } : { key: k, dir: 'asc' };
        draw(); var nb = el.querySelector('[data-sort="' + k + '"]'); if (nb) nb.focus(); return;
      }
      var a = e.target.closest('[data-act]');
      if (a && o.onAction) { var tr = a.closest('tr'); var id = tr && tr.getAttribute('data-id'); o.onAction(a.getAttribute('data-act'), id, rows.filter(function (r) { return String(r[o.rowKey || 'id']) === id; })[0], a); }
      else if (a && el.querySelector('.state') && o.onEmptyAction) o.onEmptyAction(a.getAttribute('data-act'));
    });
    draw();
    return { setRows: function (r) { rows = r || []; draw(); }, getSort: function () { return sort; } };
  };
})(window);
