/* form.js - form khai báo bằng schema: vẽ HTML (nhãn nổi), kiểm tra dữ liệu, hiện lỗi tiếng Việt ngay dưới từng ô,
   chống bấm đôi. Ví dụ:
     var SCHEMA = {
       name:  { label: 'Họ tên', type: 'text', rules: { required: true, maxLength: 80 } },
       phone: { label: 'Số điện thoại', type: 'tel', rules: { required: true, phone: true } },
       qty:   { label: 'Số lượng', type: 'number', rules: { min: 1, max: 100, integer: true } },
       price: { label: 'Giá (₫)', type: 'money', rules: { min: 0 } },                // gõ tới đâu ra dấu chấm ngăn nghìn tới đó; đọc về là Number
       vip:   { label: 'Khách VIP', type: 'checkbox', switch: true },               // công tắc lò xo thay cho ô tích
       due:   { label: 'Hạn', type: 'date', rules: { date: 'future' } },        // 'future' | 'past' | 'todayOrFuture' | 'todayOrPast'
       kind:  { label: 'Nhóm', type: 'segmented', options: [{ value:'a', label:'A' }], rules: { required: true } },
       note:  { label: 'Ghi chú', type: 'textarea' }
     };
     host.innerHTML = '<form id="f" novalidate class="form">' + EP.form.render(SCHEMA, values) + '</form>';
     var f = EP.form.bind(host.querySelector('form'), SCHEMA, { onSubmit: function (values) { ... } });
   Rules: required, email, phone (SĐT VN), url, minLength, maxLength, min, max, integer, date, pattern (+ patternMsg), custom(value, all)->msg */
(function (root) {
  'use strict';
  var EP = root.EP, esc = EP.esc;

  var RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var RE_MOBILE = /^(\+84|0)(3|5|7|8|9)\d{8}$/;     // 0912345678 hoặc +84912345678
  var RE_LANDLINE = /^(\+84|0)2\d{9}$/;              // 02812345678
  /** Chuẩn hoá SĐT: bỏ khoảng trắng . - ( ); +84 -> 0 */
  function normalizePhone(v) { var s = String(v || '').replace(/[\s.\-()]/g, ''); return s.indexOf('+84') === 0 ? '0' + s.slice(3) : s; }
  function isPhone(v) { var s = String(v || '').replace(/[\s.\-()]/g, ''); return RE_MOBILE.test(s) || RE_LANDLINE.test(s); }
  function isEmail(v) { return RE_EMAIL.test(String(v || '').trim()); }
  function isUrl(v) { try { var u = new URL(String(v).trim()); return u.protocol === 'http:' || u.protocol === 'https:'; } catch (e) { return false; } }

  function cmpDate(v, today, mode) {
    if (mode === 'future') return v > today;
    if (mode === 'past') return v < today;
    if (mode === 'todayOrFuture') return v >= today;
    if (mode === 'todayOrPast') return v <= today;
    return true;
  }
  var DATE_MSG = { future: 'phải là ngày trong tương lai', past: 'phải là ngày trong quá khứ', todayOrFuture: 'không được là ngày đã qua', todayOrPast: 'không được là ngày trong tương lai' };

  /** Kiểm tra một giá trị. Trả '' nếu hợp lệ, ngược lại là câu báo lỗi tiếng Việt.
      spec = { label, type, rules } ; all = toàn bộ giá trị (cho rule custom) */
  function validateValue(value, spec, all) {
    var r = spec.rules || {}, label = spec.label || 'Trường này', type = spec.type || 'text';
    var empty = value == null || (typeof value === 'string' && value.trim() === '') || (typeof value === 'number' && isNaN(value));
    if (empty) {
      if (r.required) return (type === 'select' || type === 'segmented' || type === 'date' ? 'Vui lòng chọn ' : 'Vui lòng nhập ') + label.toLowerCase() + '.';
      return '';
    }
    var s = typeof value === 'string' ? value.trim() : value;
    if (r.email && !isEmail(s)) return 'Email chưa đúng định dạng (ví dụ: ten@congty.vn).';
    if (r.phone && !isPhone(s)) return 'Số điện thoại chưa đúng (ví dụ: 0912345678 hoặc +84912345678).';
    if (r.url && !isUrl(s)) return 'Đường dẫn chưa đúng, cần bắt đầu bằng http:// hoặc https://.';
    if (type === 'number' || type === 'money') {
      var n = Number(s);
      if (!isFinite(n)) return label + ' phải là một con số.';
      if (r.integer && Math.floor(n) !== n) return label + ' phải là số nguyên.';
      if (r.min != null && r.max != null && (n < r.min || n > r.max)) return label + ' phải từ ' + r.min + ' đến ' + r.max + '.';
      if (r.min != null && n < r.min) return label + ' phải từ ' + r.min + ' trở lên.';
      if (r.max != null && n > r.max) return label + ' không được vượt quá ' + r.max + '.';
    }
    if (typeof s === 'string') {
      if (r.minLength && s.length < r.minLength) return label + ' cần ít nhất ' + r.minLength + ' ký tự (hiện có ' + s.length + ').';
      if (r.maxLength && s.length > r.maxLength) return label + ' tối đa ' + r.maxLength + ' ký tự (hiện có ' + s.length + ').';
      if (r.pattern && !new RegExp(r.pattern).test(s)) return r.patternMsg || label + ' chưa đúng định dạng.';
    }
    if (r.date) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(s) || isNaN(new Date(s))) return label + ' chưa phải ngày hợp lệ.';
      if (!cmpDate(s, EP.fmt.today(), r.date)) return label + ' ' + (DATE_MSG[r.date] || 'chưa hợp lệ') + '.';
    }
    if (r.custom) { var m = r.custom(s, all || {}); if (m) return m; }
    return '';
  }

  /** Kiểm tra cả form: { ok, errors: { field: message } } */
  function validate(schema, values) {
    var errors = {};
    Object.keys(schema).forEach(function (k) { var m = validateValue(values[k], schema[k], values); if (m) errors[k] = m; });
    return { ok: !Object.keys(errors).length, errors: errors };
  }

  var uid = 0;
  function fieldHtml(name, spec, value, fid) {
    var id = fid + '-' + name, type = spec.type || 'text', r = spec.rules || {}, v = value == null ? '' : value;
    var req = r.required ? ' <span class="req" aria-hidden="true">*</span>' : '';
    var attrs = ' id="' + id + '" name="' + esc(name) + '" aria-describedby="' + id + '-msg"' + (r.required ? ' required' : '') + (spec.autocomplete ? ' autocomplete="' + esc(spec.autocomplete) + '"' : '');
    var hint = '<p class="field-msg" id="' + id + '-msg" data-hint="' + esc(spec.hint || '') + '"' + (spec.hint ? ' title="' + esc(spec.hint) + '"' : '') + '>' + esc(spec.hint || '') + '</p>';
    var cls = 'field' + (spec.span2 ? ' span-2' : '');
    if (type === 'segmented') {
      return '<fieldset class="' + cls + '" data-field="' + esc(name) + '"><legend class="field-legend">' + esc(spec.label) + req + '</legend><div class="seg block" role="radiogroup">' +
        (spec.options || []).map(function (o) { return '<label><input type="radio" name="' + esc(name) + '" value="' + esc(o.value) + '"' + (String(o.value) === String(v) ? ' checked' : '') + '><span>' + esc(o.label) + '</span></label>'; }).join('') +
        '</div>' + hint.replace('id="' + id + '-msg"', 'id="' + id + '-msg"') + '</fieldset>';
    }
    if (type === 'checkbox') {
      var sw = spec.switch ? ' role="switch"' : '';
      return '<div class="' + cls + '" data-field="' + esc(name) + '"><label class="check' + (spec.switch ? ' switch' : '') + '"><input type="checkbox"' + sw + attrs + (v ? ' checked' : '') + '><span>' + esc(spec.label) + '</span></label>' + hint + '</div>';
    }
    var control;
    if (type === 'select') {
      control = '<select class="input"' + attrs + '><option value=""' + (v === '' ? ' selected' : '') + ' hidden></option>' +
        (spec.options || []).map(function (o) { return '<option value="' + esc(o.value) + '"' + (String(o.value) === String(v) ? ' selected' : '') + '>' + esc(o.label) + '</option>'; }).join('') + '</select>';
    } else if (type === 'textarea') {
      control = '<textarea class="input" rows="' + (spec.rows || 3) + '" placeholder=" "' + (r.maxLength ? ' data-max="' + r.maxLength + '"' : '') + attrs + '>' + esc(v) + '</textarea>';
    } else {
      var money = type === 'money';
      var t = money ? 'text' : type === 'tel' ? 'tel' : type === 'email' ? 'email' : type === 'number' ? 'number' : type === 'date' ? 'date' : type === 'url' ? 'url' : type === 'time' ? 'time' : 'text';
      var ex = '';
      if (type === 'number') { if (r.min != null) ex += ' min="' + r.min + '"'; if (r.max != null) ex += ' max="' + r.max + '"'; ex += ' step="' + (r.integer ? 1 : 'any') + '" inputmode="' + (r.integer ? 'numeric' : 'decimal') + '"'; }
      if (type === 'tel') ex += ' inputmode="tel"' + (spec.autocomplete ? '' : ' autocomplete="tel"');
      if (type === 'email') ex += ' inputmode="email" autocapitalize="off" spellcheck="false"' + (spec.autocomplete ? '' : ' autocomplete="email"');
      if (type === 'url') ex += ' inputmode="url" autocapitalize="off" spellcheck="false"';
      if (t !== 'date' && t !== 'time') ex += ' enterkeyhint="next"';
      if (money) ex += ' inputmode="numeric" data-lx-money';
      if (r.maxLength && type !== 'number' && !money) ex += ' data-max="' + r.maxLength + '"';
      if (r.maxLength && type !== 'number') ex += ' maxlength="' + (r.maxLength + 40) + '"'; // cho gõ lố để thấy báo lỗi thay vì bị cắt âm thầm
      if (money && v !== '' && root.EP.lucian) v = root.EP.lucian.fmt.number(v);
      control = '<input class="input" type="' + t + '" placeholder=" " value="' + esc(v) + '"' + ex + attrs + '>';
    }
    return '<div class="' + cls + '" data-field="' + esc(name) + '">' + control + '<label class="label" for="' + id + '">' + esc(spec.label) + req + '</label>' + hint + '</div>';
  }

  /** Vẽ HTML các ô theo schema (đặt trong <form class="form">). Thêm opts.grid = true để chia 2 cột. */
  function render(schema, values, opts) {
    opts = opts || {}; values = values || {};
    var fid = 'f' + (++uid);
    var html = Object.keys(schema).map(function (k) { return fieldHtml(k, schema[k], values[k], fid); }).join('');
    return opts.grid === false ? html : '<div class="form-grid two">' + html + '</div>';
  }

  function readValue(form, name, spec) {
    var type = spec.type || 'text';
    if (type === 'segmented') { var c = form.querySelector('input[name="' + name + '"]:checked'); return c ? c.value : ''; }
    var el = form.elements[name]; if (!el) return '';
    if (type === 'checkbox') return !!el.checked;
    var v = el.value;
    if (type === 'number') return v === '' ? null : Number(v);
    if (type === 'money') { var d = String(v).replace(/[^\d-]/g, ''); return d === '' ? null : Number(d); }
    return typeof v === 'string' ? v.trim() : v;
  }
  function setError(form, name, msg) {
    var wrap = form.querySelector('[data-field="' + name + '"]'); if (!wrap) return;
    var m = wrap.querySelector('.field-msg'), inputs = wrap.querySelectorAll('input,select,textarea');
    if (msg) {
      wrap.setAttribute('data-invalid', ''); wrap.removeAttribute('data-valid');
      inputs.forEach(function (i) { i.setAttribute('aria-invalid', 'true'); });
      if (m) { m.textContent = msg; m.title = msg; }
    } else {
      wrap.removeAttribute('data-invalid');
      inputs.forEach(function (i) { i.removeAttribute('aria-invalid'); });
      if (m) { m.textContent = m.getAttribute('data-hint') || ''; if (m.textContent) m.title = m.textContent; else m.removeAttribute('title'); }
    }
  }

  /** Gắn kiểm tra vào form. opts: { onSubmit(values, ev), onChange(values), submitBusy: true }
      Trả { values(), set(obj), validate(), reset(), errors } */
  function bind(form, schema, opts) {
    opts = opts || {};
    form.setAttribute('novalidate', '');
    (function () { var ins = form.querySelectorAll('input[enterkeyhint], textarea'); var last = ins[ins.length - 1]; if (last && last.tagName !== 'TEXTAREA') last.setAttribute('enterkeyhint', 'done'); })();
    function values() { var o = {}; Object.keys(schema).forEach(function (k) { o[k] = readValue(form, k, schema[k]); }); return o; }
    function checkOne(name, show) {
      var all = values(), msg = validateValue(all[name], schema[name], all);
      if (show) { setError(form, name, msg); var w = form.querySelector('[data-field="' + name + '"]'); if (w && !msg && all[name] !== '' && all[name] != null && schema[name].rules && Object.keys(schema[name].rules).length) w.setAttribute('data-valid', ''); }
      return msg;
    }
    var touched = {};
    function nameOf(e) { var w = e.target.closest && e.target.closest('[data-field]'); return w && w.getAttribute('data-field'); }
    form.addEventListener('focusout', function (e) { var n = nameOf(e); if (n && schema[n]) { touched[n] = true; checkOne(n, true); } });
    form.addEventListener('input', function (e) { var n = nameOf(e); if (n && schema[n] && (touched[n] || e.target.closest('[data-invalid]'))) checkOne(n, true); if (opts.onChange) opts.onChange(values()); });
    form.addEventListener('change', function (e) { var n = nameOf(e); if (n && schema[n]) { touched[n] = true; checkOne(n, true); } });
    var submitting = false;
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (submitting) return;
      var v = values(), res = validate(schema, v);
      Object.keys(schema).forEach(function (k) { touched[k] = true; setError(form, k, res.errors[k] || ''); });
      if (!res.ok) {
        var first = form.querySelector('[data-invalid] input, [data-invalid] select, [data-invalid] textarea');
        if (first) first.focus();
        if (opts.onInvalid) opts.onInvalid(res.errors);
        return;
      }
      if (!opts.onSubmit) return;
      var btn = form.querySelector('[type="submit"]') || (form.id && root.document.querySelector('[type="submit"][form="' + form.id + '"]'));
      var out = opts.onSubmit(v, ev);
      if (out && typeof out.then === 'function') {
        submitting = true; EP.ui.busy(btn, true);
        out.then(null, function () { /* onSubmit tự báo lỗi */ }).then(function () { submitting = false; EP.ui.busy(btn, false); });
      }
    });
    return {
      values: values,
      validate: function () { var res = validate(schema, values()); Object.keys(schema).forEach(function (k) { setError(form, k, res.errors[k] || ''); }); return res; },
      set: function (obj) {
        setTimeout(function () { if (root.EP.lucian) root.EP.lucian.refresh(form); }, 0);
        Object.keys(obj).forEach(function (k) {
          if (!schema[k]) return;
          if (schema[k].type === 'segmented') { var r = form.querySelector('input[name="' + k + '"][value="' + String(obj[k]).replace(/"/g, '') + '"]'); if (r) r.checked = true; }
          else if (schema[k].type === 'checkbox') form.elements[k].checked = !!obj[k];
          else if (form.elements[k]) form.elements[k].value = obj[k] == null ? '' : obj[k];
        });
      },
      reset: function () { form.reset(); setTimeout(function () { if (root.EP.lucian) root.EP.lucian.refresh(form); }, 0); touched = {}; Object.keys(schema).forEach(function (k) { setError(form, k, ''); var w = form.querySelector('[data-field="' + k + '"]'); if (w) w.removeAttribute('data-valid'); }); }
    };
  }

  /** Đọc giá trị từ form đã render (không cần bind): EP.form.values(formEl, SCHEMA) -> { name:'...', qty: 3 }
      Số được ép về Number (rỗng -> null), checkbox -> boolean. Dùng cho xem trước realtime / máy tính. */
  function values(form, schema) { var o = {}; Object.keys(schema).forEach(function (k) { o[k] = readValue(form, k, schema[k]); }); return o; }

  EP.form = { values: values, render: render, bind: bind, validate: validate, validateValue: validateValue, normalizePhone: normalizePhone, isPhone: isPhone, isEmail: isEmail, isUrl: isUrl };
})(window);
