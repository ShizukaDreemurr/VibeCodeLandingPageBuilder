/* ux-lucian-form.js — nâng cấp màn "Thông tin & nội dung" và "Brand DNA" bằng thành phần chuyển thể từ Lucian Lab UI
   (MIT, © 2026 Seokwoooo). Chỉ thêm lớp giao diện lên DOM có sẵn: mọi id/name/hành vi của form giữ nguyên.
   Tôn trọng prefers-reduced-motion / html.motion-off qua EP.motion.reduce(). */
(function (root) {
  var EP = root.EP = root.EP || {};
  var doc = root.document;
  function reduced() { return EP.motion ? EP.motion.reduce() : false; }
  function $(s, c) { return (c || doc).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }
  function el(tag, cls, html) { var n = doc.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; }
  var CHECK = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.4l3 3 6-6.4"/></svg>';
  var form = $('#event-form'), view = $('#view-builder');
  if (!form || !view) return;

  // ---------- 1. Thanh bước (Lucian 042 wizard stepper, MIT © 2026 Seokwoooo) ----------
  var STEPS = [
    { name: 'Sự kiện', target: '#f-name', done: function () { return val('#f-name') && val('#f-startAt') && val('#f-location'); } },
    { name: 'Diễn giả & chương trình', target: '#f-speakers', done: function () { return val('#f-speakers'); } },
    { name: 'Mẫu & nội dung AI', target: '#btn-generate', done: function () { return !!($('#btn-regenerate') && !$('#btn-regenerate').disabled); } }
  ];
  function val(sel) { var n = $(sel); return !!(n && n.value && n.value.trim()); }
  var stepNav = el('nav', 'lf-steps'); stepNav.setAttribute('aria-label', 'Các bước nhập thông tin');
  var ol = el('ol', 'lf-steps-list'); stepNav.appendChild(ol);
  var lineLi = el('li', 'lf-steps-line', '<i></i>'); lineLi.setAttribute('aria-hidden', 'true'); ol.appendChild(lineLi);
  var stEls = STEPS.map(function (s, i) {
    var li = el('li', 'lf-st');
    var b = el('button', 'lf-dot', '<span>' + (i + 1) + '</span>' + CHECK.replace('<svg ', '<svg class="lf-ck" '));
    b.type = 'button';
    b.addEventListener('click', function () {
      var t = $(s.target); if (!t) return;
      var host = t.closest('.field, .actions, .pair-table') || t;
      host.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' });
      var f = t.matches('input,textarea,button,select') ? t : $('input,button', t.nextElementSibling || t);
      if (f && f.focus) f.focus({ preventScroll: true });
    });
    li.appendChild(b); li.appendChild(el('small', null, s.name));
    ol.appendChild(li);
    return { li: li, btn: b };
  });
  var titleRow = $('.title-row', view);
  if (titleRow) titleRow.insertAdjacentElement('afterend', stepNav);
  var lastSteps = '';
  function updateSteps() {
    var done = STEPS.map(function (s) { return !!s.done(); });
    var cur = done.indexOf(false); if (cur < 0) cur = STEPS.length - 1;
    var key = done.join() + cur; if (key === lastSteps) return; lastSteps = key;
    var n = done.filter(Boolean).length;
    ol.style.setProperty('--p', (Math.min(n, STEPS.length - 1) / (STEPS.length - 1)).toFixed(3));
    stEls.forEach(function (e, i) {
      e.li.classList.toggle('done', done[i]); e.li.classList.toggle('cur', i === cur && !(done[i] && i === STEPS.length - 1 && false));
      e.btn.setAttribute('aria-label', 'Bước ' + (i + 1) + ': ' + STEPS[i].name + (done[i] ? ', đã xong' : i === cur ? ', đang làm' : ', chưa làm'));
      if (i === cur) e.btn.setAttribute('aria-current', 'step'); else e.btn.removeAttribute('aria-current');
    });
  }

  // ---------- 2. Ô nhập nhãn nổi trên viền + kiểm tra tại chỗ (Lucian 025 notched floating label, MIT © 2026 Seokwoooo) ----------
  var floats = [];
  function floatField(input) {
    var field = input.closest('.field'); if (!field || input.closest('.lf-box') || input.closest('.pair-table')) return;
    var label = field.querySelector('label[for="' + input.id + '"]'); if (!label) return;
    var box = el('div', 'lf-box');
    var line = el('span', 'lf-line', '<i class="l"></i><i class="g"></i><i class="r"></i>'); line.setAttribute('aria-hidden', 'true');
    field.insertBefore(box, input); box.appendChild(input); box.appendChild(line); box.appendChild(label);
    var ok = null;
    if (input.type !== 'datetime-local' && input.type !== 'number') { ok = el('span', 'lf-ok', CHECK); ok.setAttribute('aria-hidden', 'true'); box.appendChild(ok); }
    field.classList.add('lf-f'); if (input.type === 'datetime-local') field.classList.add('is-date');
    var gap = line.querySelector('.g'), lastVal = null, lastW = -1, wasBad = false;
    function lift() {
      var up = doc.activeElement === input || input.value.length > 0 || input.type === 'datetime-local';
      field.classList.toggle('is-up', up);
      var w = label.offsetWidth;
      if (up && w && w !== lastW) { lastW = w; gap.style.width = Math.round(w * 0.8 + 2) + 'px'; }
      if (!up) { lastW = -1; gap.style.width = '0px'; }
    }
    function bad() {
      var b = input.getAttribute('aria-invalid') === 'true';
      field.classList.toggle('is-bad', b);
      if (b) field.classList.remove('is-ok');
      if (b && !wasBad && !reduced()) { field.classList.remove('is-shake'); void field.offsetWidth; field.classList.add('is-shake'); }
      wasBad = b;
    }
    input.addEventListener('focus', function () { field.classList.add('is-focus'); lift(); });
    input.addEventListener('blur', function () {
      field.classList.remove('is-focus'); lift();
      field.classList.toggle('is-ok', !!input.value.trim() && input.getAttribute('aria-invalid') !== 'true' && label.querySelector('.req') != null);
    });
    input.addEventListener('input', function () { lift(); if (field.classList.contains('is-ok') && !input.value.trim()) field.classList.remove('is-ok'); });
    new MutationObserver(bad).observe(input, { attributes: true, attributeFilter: ['aria-invalid'] });
    floats.push(function () { if (input.value !== lastVal) { lastVal = input.value; } lift(); });
    lift(); bad();
  }
  function setupFloats() {
    $$('#event-form .form-main input.lf-candidate, #event-form .form-main .field > input').forEach(function (i) {
      if (i.type === 'checkbox' || i.type === 'radio' || i.type === 'hidden') return;
      floatField(i);
    });
  }

  // ---------- 3. Bảng diễn giả/chương trình: tay nắm kéo + số thứ tự (Lucian 255 drag kanban cards, MIT © 2026 Seokwoooo) ----------
  var GRIP = '<svg viewBox="0 0 12 16" aria-hidden="true"><circle cx="4" cy="3" r="1.3"/><circle cx="8" cy="3" r="1.3"/><circle cx="4" cy="8" r="1.3"/><circle cx="8" cy="8" r="1.3"/><circle cx="4" cy="13" r="1.3"/><circle cx="8" cy="13" r="1.3"/></svg>';
  function fire(row) { var i = row.querySelector('input'); if (i) i.dispatchEvent(new Event('input', { bubbles: true })); }
  function moveRow(row, dir) {
    var sib = dir < 0 ? row.previousElementSibling : row.nextElementSibling;
    if (!sib || sib.classList.contains('pair-head')) return false;
    if (dir < 0) row.parentNode.insertBefore(row, sib); else row.parentNode.insertBefore(sib, row);
    fire(row); return true;
  }
  function gripRow(row) {
    if (row.classList.contains('pair-head') || row.querySelector('.lf-grip')) return;
    var g = el('button', 'lf-grip', '<b class="lf-n"></b>' + GRIP); g.type = 'button';
    g.setAttribute('aria-label', 'Kéo để đổi thứ tự (hoặc Alt + mũi tên lên/xuống)');
    g.addEventListener('keydown', function (e) {
      if (!e.altKey || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return;
      e.preventDefault(); if (moveRow(row, e.key === 'ArrowUp' ? -1 : 1)) g.focus();
    });
    g.addEventListener('pointerdown', function (e) {
      if (e.button) return; e.preventDefault(); g.setPointerCapture(e.pointerId); row.classList.add('is-drag');
      var move = function (ev) {
        var sibs = $$('.pair-row:not(.pair-head)', row.parentNode);
        for (var k = 0; k < sibs.length; k++) {
          var s = sibs[k]; if (s === row) continue; var r = s.getBoundingClientRect();
          if (ev.clientY > r.top && ev.clientY < r.bottom) {
            var after = ev.clientY > r.top + r.height / 2;
            var ref = after ? s.nextElementSibling : s;
            if (ref !== row && row.nextElementSibling !== ref) row.parentNode.insertBefore(row, ref);
            break;
          }
        }
      };
      var up = function () { g.removeEventListener('pointermove', move); g.removeEventListener('pointerup', up); g.removeEventListener('pointercancel', up); row.classList.remove('is-drag'); fire(row); };
      g.addEventListener('pointermove', move); g.addEventListener('pointerup', up); g.addEventListener('pointercancel', up);
    });
    row.insertBefore(g, row.firstChild);
  }
  function setupPairs() {
    $$('.pair-table').forEach(function (t) {
      $$('.pair-row', t).forEach(function (r) {
        if (r.classList.contains('pair-head')) { if (!r.querySelector('.lf-gh')) r.insertBefore(el('span', 'lf-gh'), r.firstChild); }
        else gripRow(r);
      });
      t.classList.add('lf-pairs');
    });
  }

  // ---------- 4. Nhóm chọn dạng viên trượt (Lucian 047 segmented control, MIT © 2026 Seokwoooo) ----------
  function knob(group, items, isOn) {
    if (!group) return;
    var k = group.querySelector(':scope > .lf-knob');
    if (!k) { k = el('span', 'lf-knob'); k.setAttribute('aria-hidden', 'true'); group.insertBefore(k, group.firstChild); group.classList.add('has-knob'); }
    var on = items().filter(isOn)[0];
    if (!on || !on.offsetWidth) { k.style.opacity = '0'; return; }
    var first = k.style.opacity !== '1';
    k.style.opacity = '1';
    var l = on.offsetLeft, t = on.offsetTop;
    if (first) k.style.transition = 'none';
    k.style.width = on.offsetWidth + 'px'; k.style.height = on.offsetHeight + 'px';
    var was = k._l; k._l = l;
    group.classList.toggle('go-r', was != null && l > was); group.classList.toggle('go-l', was != null && l < was);
    k.style.transform = 'translate(' + l + 'px,' + t + 'px)';
    if (first) { void k.offsetWidth; k.style.transition = ''; }
  }
  function setupSeg() {
    var m = $('#ai-mode');
    if (m) knob(m, function () { return $$('label', m); }, function (l) { return l.querySelector('input').checked; });
    $$('#view-brand .chips[role="radiogroup"]').forEach(function (g) {
      knob(g, function () { return $$('.chip', g); }, function (c) { return c.classList.contains('is-active'); });
    });
  }

  // ---------- 5. Nút tạo nội dung: lấp lánh khi bấm, ba chấm "đang viết" (Lucian 086 typing + 280 AI generate, MIT © 2026 Seokwoooo) ----------
  function sparkle(btn) {
    if (!btn || reduced()) return;
    btn.classList.remove('lf-spark'); void btn.offsetWidth; btn.classList.add('lf-spark');
    clearTimeout(btn._lf); btn._lf = setTimeout(function () { btn.classList.remove('lf-spark'); }, 1100);
  }
  ['#btn-generate', '#btn-regenerate', '#btn-regenerate-2'].forEach(function (s) { var b = $(s); if (b) b.addEventListener('click', function () { sparkle(b); }); });
  var gen = $('#btn-generate');
  if (gen) new MutationObserver(function () { form.classList.toggle('is-ai-busy', gen.classList.contains('is-loading')); }).observe(gen, { attributes: true, attributeFilter: ['class'] });

  // ---------- 6. Khung ảnh: vùng thả tệp (Lucian 032 file drop upload, MIT © 2026 Seokwoooo) ----------
  function setupImgCard() {
    var card = $('#img-card'); if (!card || card.querySelector('.lf-dash')) return;
    var dash = el('span', 'lf-dash', '<svg aria-hidden="true"><rect width="100%" height="100%" rx="13"/></svg>');
    card.insertBefore(dash, card.firstChild);
    var title = $('#img-card-title');
    if (title) { title.innerHTML = '<span class="lf-orb" aria-hidden="true"><svg viewBox="0 0 28 28"><path d="M8.5 20.5H7a5 5 0 0 1-.6-10 7 7 0 0 1 13.4-1.6A5.5 5.5 0 0 1 21 20.5h-1.5M14 13v10M10.5 16.5L14 13l3.5 3.5"/></svg></span><span>Hình ảnh</span><em class="lf-count" aria-live="polite"></em>'; }
    var depth = 0;
    function isFiles(e) { return e.dataTransfer && Array.prototype.indexOf.call(e.dataTransfer.types || [], 'Files') >= 0; }
    card.addEventListener('dragenter', function (e) { if (isFiles(e)) { depth++; card.classList.add('is-over'); } });
    card.addEventListener('dragleave', function () { depth = Math.max(0, depth - 1); if (!depth) card.classList.remove('is-over'); });
    card.addEventListener('drop', function () { depth = 0; card.classList.remove('is-over'); });
    card.addEventListener('dragend', function () { depth = 0; card.classList.remove('is-over'); });
  }
  function updateCount() {
    var c = $('#img-card .lf-count'); if (!c) return;
    var tiles = $$('#img-card .img-tile'), n = $$('#img-card .img-tile.has-img').length;
    var t = tiles.length ? n + '/' + tiles.length + ' ảnh' : '';
    if (c.textContent !== t) c.textContent = t;
  }

  // ---------- 7. Brand DNA: bảng màu gợi ý (Lucian 266 palette generator, MIT © 2026 Seokwoooo) ----------
  var ed = $('#brand-editor'), pv = $('#brand-preview');
  function hsl(h, s, l) { h = ((h % 360) + 360) % 360; s /= 100; l /= 100; var a = s * Math.min(l, 1 - l), f = function (n) { var k = (n + h / 30) % 12, c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); return Math.round(c * 255).toString(16).padStart(2, '0'); }; return ('#' + f(0) + f(8) + f(4)).toUpperCase(); }
  function lum(hex) { var n = parseInt(hex.slice(1), 16), c = [n >> 16 & 255, n >> 8 & 255, n & 255].map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; }
  function scheme() {
    var h = Math.random() * 360, mode = Math.floor(Math.random() * 3), off = mode === 0 ? 25 : mode === 1 ? 180 : 140;
    return [hsl(h, 45, 94), hsl(h + off * 0.3, 55, 78), hsl(h + off * 0.6, 62, 52), hsl(h + off, 58, 34), hsl(h + off * 0.5, 40, 14)];
  }
  var PAL = scheme(), LOCK = [false, false, false, false, false];
  var ROLES = ['Nền', 'Phụ', 'Nhấn', 'Chính', 'Chữ'];
  var LK = '<svg viewBox="0 0 12 12" aria-hidden="true"><rect x="2.5" y="5.5" width="7" height="5" rx="1.3" fill="currentColor"/><path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';
  var UL = '<svg viewBox="0 0 12 12" aria-hidden="true"><rect x="2.5" y="5.5" width="7" height="5" rx="1.3" fill="currentColor"/><path d="M4 5.5V4a2 2 0 0 1 3.8-.8" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
  var SHUF = '<svg viewBox="0 0 13 13" aria-hidden="true"><path d="M1.5 4h2.2c1.6 0 2.5.9 3.3 2.5S8.7 9 10.3 9h1.2M1.5 9h2.2c.9 0 1.5-.3 2-.8M8.6 4.8c.5-.5 1-.8 1.7-.8h1.2M10 2.3L11.7 4 10 5.7M10 7.3L11.7 9 10 10.7" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function buildPalette(sec) {
    if (sec.querySelector('.lf-pal')) return;
    var w = el('div', 'lf-pal'); w.setAttribute('role', 'group'); w.setAttribute('aria-label', 'Gợi ý bảng màu');
    var strip = el('div', 'lf-pal-strip');
    var tb = el('div', 'lf-pal-tb');
    var sh = el('button', 'lf-pal-sh', SHUF + 'Trộn màu'); sh.type = 'button';
    var use = el('button', 'lf-pal-use', 'Dùng bảng màu này'); use.type = 'button';
    var kb = el('kbd', null, 'Space'); kb.setAttribute('aria-hidden', 'true');
    var tt = el('div', 'lf-pal-tt'); tt.setAttribute('role', 'status');
    var cols = PAL.map(function (c, i) {
      var col = el('div', 'lf-pal-cl');
      col.innerHTML = '<button type="button" class="lf-pal-cp"><small></small><code></code></button><button type="button" class="lf-pal-lk"></button>';
      var cp = col.querySelector('.lf-pal-cp'), lk = col.querySelector('.lf-pal-lk');
      lk.addEventListener('click', function () { LOCK[i] = !LOCK[i]; paint(i); });
      cp.addEventListener('click', function () {
        try { navigator.clipboard && navigator.clipboard.writeText(PAL[i]).catch(function () {}); } catch (e) {}
        tt.textContent = 'Đã copy ' + PAL[i]; tt.classList.remove('is-on'); void tt.offsetWidth; tt.classList.add('is-on');
        clearTimeout(tt._t); tt._t = setTimeout(function () { tt.classList.remove('is-on'); }, 1400);
      });
      strip.appendChild(col); return { col: col, cp: cp, lk: lk, code: cp.querySelector('code'), role: cp.querySelector('small') };
    });
    function paint(i) {
      var c = cols[i], hex = PAL[i], t = lum(hex) > 0.35 ? '#1A1A1A' : '#FFFFFF';
      c.col.style.setProperty('--c', hex); c.col.style.setProperty('--t', t); c.code.textContent = hex; c.role.textContent = ROLES[i];
      c.lk.innerHTML = LOCK[i] ? LK : UL; c.lk.setAttribute('aria-pressed', String(LOCK[i]));
      c.lk.setAttribute('aria-label', ROLES[i] + ' ' + hex + (LOCK[i] ? ': bỏ khoá' : ': khoá')); c.cp.setAttribute('aria-label', ROLES[i] + ' ' + hex + ': bấm để copy');
      w.style.setProperty('--p' + i, hex);
    }
    function shuffle() {
      var n = scheme();
      sh.classList.remove('is-spin'); void sh.offsetWidth; sh.classList.add('is-spin');
      n.forEach(function (hex, i) { if (LOCK[i]) return; setTimeout(function () { PAL[i] = hex; paint(i); }, reduced() ? 0 : i * 70); });
    }
    sh.addEventListener('click', shuffle);
    w.addEventListener('keydown', function (e) { if (e.key === ' ' && (e.target === w || e.target === sh) && e.target !== sh) { e.preventDefault(); shuffle(); } });
    w.tabIndex = -1;
    use.addEventListener('click', function () {
      var map = [['Màu chính', PAL[3]], ['Màu nhấn', PAL[2]], ['Màu chữ', PAL[4]], ['Màu nền trang', PAL[0]]];
      map.forEach(function (m) {
        var i = $('#brand-editor [aria-label="' + m[0] + ' – mã màu"]'); if (!i) return;
        i.value = m[1]; i.dispatchEvent(new Event('input', { bubbles: true })); i.dispatchEvent(new Event('change', { bubbles: true }));
      });
      var act = $('#brand-list .brand-item.is-active'); if (act) act.click(); // dựng lại form để ô màu + huy hiệu tương phản cập nhật
    });
    tb.appendChild(sh); tb.appendChild(use); tb.appendChild(kb);
    w.appendChild(strip); w.appendChild(tb); w.appendChild(tt);
    PAL.forEach(function (c, i) { paint(i); });
    var h = sec.querySelector('.hint'); sec.insertBefore(w, h ? h.nextSibling : sec.firstChild.nextSibling);
  }

  // ---------- 8. Brand DNA: ô thẻ từ khoá (Lucian 029 tag input, MIT © 2026 Seokwoooo) ----------
  function buildTags(input, tone) {
    var field = input.closest('.field'); if (!field || field.querySelector('.lf-tags')) return;
    var box = el('div', 'lf-tags is-' + tone); box.setAttribute('aria-label', 'Từ khoá đã nhập');
    function parse() { return input.value.split(/[,;\n]/).map(function (s) { return s.trim(); }).filter(Boolean); }
    function draw() {
      box.innerHTML = '';
      var list = parse(); box.hidden = !list.length;
      list.forEach(function (t, i) {
        var chip = el('span', 'lf-tag'); chip.appendChild(doc.createTextNode(t));
        var x = el('button', 'lf-tag-x', '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 2l6 6M8 2L2 8"/></svg>'); x.type = 'button'; x.setAttribute('aria-label', 'Xoá "' + t + '"');
        x.addEventListener('click', function () {
          var l = parse(); l.splice(i, 1); input.value = l.join(', ');
          input.dispatchEvent(new Event('input', { bubbles: true })); input.dispatchEvent(new Event('change', { bubbles: true }));
          draw(); input.focus();
        });
        chip.appendChild(x); box.appendChild(chip);
      });
    }
    input.addEventListener('input', draw); input.addEventListener('change', draw);
    field.appendChild(box); draw();
  }

  // ---------- 9. Brand DNA: thẻ xem trước phát sáng theo con trỏ (Lucian 050 tilt news card + 228 cursor glow, MIT © 2026 Seokwoooo) ----------
  function bindPreview() {
    if (!pv || pv._lf) return; pv._lf = 1;
    pv.addEventListener('pointermove', function (e) {
      var c = e.target.closest ? e.target.closest('.bp-card') : null; if (!c || e.pointerType === 'touch') return;
      var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      c.style.setProperty('--mx', (x * 100).toFixed(1) + '%'); c.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      if (!reduced()) { c.style.setProperty('--rx', ((0.5 - y) * 6).toFixed(2) + 'deg'); c.style.setProperty('--ry', ((x - 0.5) * 8).toFixed(2) + 'deg'); }
      c.classList.add('is-lit');
    });
    pv.addEventListener('pointerleave', function () { $$('.bp-card', pv).forEach(function (c) { c.classList.remove('is-lit'); c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); }); });
  }
  function setupBrand() {
    if (!ed) return;
    $$('.brand-sec', ed).forEach(function (s) { var h = s.querySelector('.panel-title'); if (h && /^Màu sắc/.test(h.textContent)) buildPalette(s); });
    var u = $('#bf-voiceUse'), a = $('#bf-voiceAvoid'); if (u) buildTags(u, 'use'); if (a) buildTags(a, 'avoid');
    setupSeg(); bindPreview();
  }

  // ---------- chạy ----------
  var scheduled = false;
  function run() { scheduled = false; setupFloats(); setupPairs(); setupImgCard(); setupBrand(); setupSeg(); }
  function schedule() { if (!scheduled) { scheduled = true; (root.requestAnimationFrame || setTimeout)(run); } }
  new MutationObserver(schedule).observe(view, { childList: true, subtree: true });
  if (ed) new MutationObserver(schedule).observe(ed, { childList: true, subtree: true });
  if (pv) bindPreview();
  form.addEventListener('input', updateSteps); form.addEventListener('change', updateSteps);
  form.addEventListener('change', function () { setupSeg(); });
  root.addEventListener('resize', function () { lastSteps = ''; floats.forEach(function (f) { f(); }); setupSeg(); });
  // Giá trị gán bằng code (dữ liệu mẫu, mở sự kiện, đổi mẫu) không bắn sự kiện: kiểm tra nhẹ khi màn đang hiện
  setInterval(function () {
    if (!view.hidden) { floats.forEach(function (f) { f(); }); updateSteps(); updateCount(); setupSeg(); }
    else if (ed && ed.offsetParent) setupSeg();
  }, 450);
  run(); updateSteps();
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { floats.forEach(function (f) { f(); }); setupSeg(); });
})(window);
