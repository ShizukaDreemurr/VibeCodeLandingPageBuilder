/* ux-lucian.js — vài thành phần giao diện chuyển thể từ Lucian Lab UI (MIT, © 2026 Seokwoooo).
   Mỗi phần có một dòng ghi nguồn. Dùng token của app (--accent, --surface, --text…), tôn trọng
   prefers-reduced-motion và html.motion-off qua EP.motion.reduce(). */
(function (root) {
  var EP = root.EP = root.EP || {};
  var ux = EP.ux = EP.ux || {};
  var doc = root.document;
  function reduced() { return EP.motion ? EP.motion.reduce() : false; }
  function $(s, c) { return (c || doc).querySelector(s); }
  function el(tag, cls, html) { var n = doc.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; }
  var SVG_CHECK = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.4l3 3 6-6.4"/></svg>';

  // ---------- 1. Tab trượt dạng viên thuốc (Lucian 039 sliding pill tabs, MIT © 2026 Seokwoooo) ----------
  // Nâng cấp EP.motion.indicator: viên thuốc mềm + gạch chân trượt theo tab đang chọn, kéo giãn nhẹ khi đổi tab.
  function indicator(nav) {
    if (!nav) return;
    var bar = nav.querySelector('.tab-indicator');
    if (!bar) { bar = el('span', 'tab-indicator'); bar.setAttribute('aria-hidden', 'true'); nav.appendChild(bar); }
    var act = nav.querySelector('.is-active');
    if (!act) { bar.style.opacity = '0'; return; }
    bar.style.opacity = '1';
    bar.style.width = act.offsetWidth + 'px';
    bar.style.transform = 'translateX(' + act.offsetLeft + 'px)';
    if (!reduced() && bar.animate && bar._x != null && Math.abs(bar._x - act.offsetLeft) > 2) {
      bar.animate([{ scale: '1 1' }, { scale: '1.12 0.92', offset: 0.4 }, { scale: '1 1' }], { duration: 380, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
    }
    bar._x = act.offsetLeft;
  }
  if (EP.motion) EP.motion.indicator = indicator;

  // Viên thuốc trượt cho nhóm nút nhỏ (chọn thiết bị) — cùng nguồn 039
  function slidePill(group) {
    if (!group) return;
    var pill = group.querySelector('.ux-pill');
    if (!pill) { pill = el('span', 'ux-pill'); pill.setAttribute('aria-hidden', 'true'); group.insertBefore(pill, group.firstChild); group.classList.add('has-pill'); }
    var act = group.querySelector('button.is-active');
    if (!act || !act.offsetWidth) { pill.style.opacity = '0'; return; }
    pill.style.opacity = '1';
    pill.style.width = act.offsetWidth + 'px'; pill.style.height = act.offsetHeight + 'px';
    pill.style.transform = 'translate(' + act.offsetLeft + 'px,' + act.offsetTop + 'px)';
  }
  ux.slidePill = slidePill;

  // ---------- 2. Toast xếp chồng (Lucian 070 stacking toasts, MIT © 2026 Seokwoooo) ----------
  // Giữ nguyên #toast (API cũ, test dùng): toast mới ở trước, toast cũ lùi ra sau và nhỏ dần.
  // Rê chuột/chạm để trải ra; kéo ngang để gạt đi; Esc đóng.
  var stack = null, timer = null, olds = [], paused = false;
  function ensureStack() { if (!stack) { stack = el('div', 'ux-toast-stack'); stack.setAttribute('aria-hidden', 'true'); doc.body.appendChild(stack); } return stack; }
  function layoutStack(open) {
    if (stack) stack.classList.toggle('is-open', !!open);
    var acc = 0, t = $('#toast');
    if (open) acc = (t ? t.offsetHeight : 40) + 8;
    olds.forEach(function (o, i) {
      o.el.style.setProperty('--k', i + 1);
      o.el.classList.toggle('is-open', !!open);
      if (open) { o.el.style.setProperty('--oy', acc + 'px'); acc += o.el.offsetHeight + 8; }
    });
  }
  function dropOld(o) {
    var i = olds.indexOf(o); if (i < 0) return;
    olds.splice(i, 1); clearTimeout(o.timer); o.el.classList.add('is-leaving');
    setTimeout(function () { o.el.remove(); }, 300);
    layoutStack(stack && stack.classList.contains('is-open'));
  }
  function pushOld(text) {
    var o = { el: el('div', 'ux-toast-old') };
    o.el.textContent = text;
    ensureStack().appendChild(o.el);
    olds.unshift(o);
    while (olds.length > 3) dropOld(olds[olds.length - 1]);
    o.timer = setTimeout(function () { dropOld(o); }, 2600);
    layoutStack(false);
  }
  function hide() { var t = $('#toast'); if (t) { t.hidden = true; t.style.removeProperty('--dx'); t.style.opacity = ''; } olds.slice().forEach(dropOld); }
  function arm(text) {
    clearTimeout(timer);
    timer = setTimeout(function () { if (paused) return arm(text); hide(); }, Math.max(3500, text.length * 60));
  }
  function bindToast(t) {
    t._ux = 1;
    var sx = 0, dx = 0, down = false;
    var open = function () { paused = true; layoutStack(true); };
    var close = function () { paused = false; layoutStack(false); };
    t.addEventListener('pointerenter', open);
    t.addEventListener('pointerleave', function () { if (!down) close(); });
    t.addEventListener('pointerdown', function (e) { down = true; sx = e.clientX; dx = 0; try { t.setPointerCapture(e.pointerId); } catch (x) { /* bỏ qua */ } t.classList.add('is-drag'); open(); });
    t.addEventListener('pointermove', function (e) { if (!down) return; dx = e.clientX - sx; t.style.setProperty('--dx', dx + 'px'); t.style.opacity = Math.max(0.25, 1 - Math.abs(dx) / 260); });
    var end = function () {
      if (!down) return; down = false; t.classList.remove('is-drag'); t.style.opacity = '';
      if (Math.abs(dx) > 80) hide(); else t.style.removeProperty('--dx');
      close();
    };
    t.addEventListener('pointerup', end); t.addEventListener('pointercancel', end);
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !t.hidden && !doc.querySelector('dialog[open], .ux-pal-back')) hide(); });
  }
  ux.toast = function (text) {
    var t = $('#toast'); if (!t) return;
    if (!t.hidden && t.textContent && !reduced()) pushOld(t.textContent);
    t.textContent = text; t.hidden = false;
    t.style.removeProperty('--dx');
    if (!t._ux) bindToast(t);
    t.classList.remove('ux-toast-in'); void t.offsetWidth; if (!reduced()) t.classList.add('ux-toast-in');
    arm(text);
  };
  ux.say = function (t) { ux.toast(t); };

  // ---------- 3. Copy → dấu tick (Lucian 008 copy-to-check, MIT © 2026 Seokwoooo) ----------
  // Bọc EP.motion.morph: khi chữ nút là "Đã copy/Đã sao chép" thì vẽ dấu tick.
  ux.checkMark = function (btn, ms) {
    if (!btn) return;
    btn.classList.add('ux-copied');
    var old = btn.querySelector('.ux-check'); if (old) old.remove();
    var c = el('span', 'ux-check', SVG_CHECK); c.setAttribute('aria-hidden', 'true');
    btn.insertBefore(c, btn.firstChild);
    clearTimeout(btn._uxT);
    btn._uxT = setTimeout(function () { btn.classList.remove('ux-copied'); c.remove(); }, ms || 1600);
  };
  if (EP.motion && EP.motion.morph) {
    var baseMorph = EP.motion.morph;
    EP.motion.morph = function (btn, text, ms) {
      baseMorph(btn, text, ms);
      if (btn && /^Đã (copy|sao chép)/i.test(text || '')) ux.checkMark(btn, ms);
    };
  }
  // Các nút "Copy …"/"Sao chép …" khác tự đổi chữ thành "Đã …": nhận tick sau khi bấm
  doc.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('button');
    if (!b || b.classList.contains('ux-copied')) return;
    var txt = (b.getAttribute('data-label') || b.textContent || '').trim();
    if (/^(Copy|Sao chép)/i.test(txt)) setTimeout(function () { if (!b.classList.contains('ux-copied') && /^Đã/.test(b.textContent.trim())) ux.checkMark(b, 1800); }, 80);
  }, true);

  // ---------- 4. Giữ để xoá (Lucian 003 hold-to-delete, MIT © 2026 Seokwoooo) ----------
  // Bấm thường: giữ nguyên luồng xác nhận. Giữ ~0,9 giây (chuột/chạm/giữ Space/Enter) → xoá thẳng.
  // Bàn phím: Enter/Space một lần vẫn mở hộp xác nhận (cách thay thế không cần giữ).
  ux.holdDelete = function (btn, onHold, ms) {
    if (!btn || btn._uxHold) return btn;
    btn._uxHold = 1; ms = ms || 900;
    btn.classList.add('ux-hold');
    var fill = el('span', 'ux-hold-fill'); fill.setAttribute('aria-hidden', 'true');
    btn.insertBefore(fill, btn.firstChild);
    if (!btn.getAttribute('title')) btn.setAttribute('title', 'Bấm để xoá (có hỏi lại), hoặc giữ để xoá ngay');
    var t0 = 0, raf = 0, suppress = false;
    function frame() {
      var p = Math.min(1, (performance.now() - t0) / ms);
      btn.style.setProperty('--hold', p.toFixed(3));
      if (p >= 1) { finish(); return; }
      raf = requestAnimationFrame(frame);
    }
    function start() { if (t0) return; t0 = performance.now(); btn.classList.add('is-holding'); raf = requestAnimationFrame(frame); }
    function cancel() { if (!t0) return; cancelAnimationFrame(raf); t0 = 0; btn.classList.remove('is-holding'); btn.style.setProperty('--hold', 0); }
    function finish() {
      cancelAnimationFrame(raf); t0 = 0; suppress = true;
      btn.classList.remove('is-holding'); btn.classList.add('is-done');
      setTimeout(function () { btn.classList.remove('is-done'); btn.style.setProperty('--hold', 0); }, 400);
      setTimeout(function () { suppress = false; }, 250);
      onHold();
    }
    btn.addEventListener('pointerdown', function (e) { if (e.button > 0) return; start(); });
    ['pointerup', 'pointerleave', 'pointercancel', 'blur'].forEach(function (n) { btn.addEventListener(n, cancel); });
    btn.addEventListener('keydown', function (e) { if ((e.key === ' ' || e.key === 'Enter') && e.repeat) start(); });
    btn.addEventListener('keyup', cancel);
    btn.addEventListener('click', function (e) { if (suppress && !btn._uxPass) { e.stopImmediatePropagation(); e.preventDefault(); } }, true);
    return btn;
  };

  // ---------- 5. Chỉ báo tự lưu (Lucian 355 autosave indicator, MIT © 2026 Seokwoooo) ----------
  var saveEl = null, saveT = 0;
  function ensureSave() {
    if (saveEl && saveEl.isConnected) return saveEl;
    var host = $('.editor-bar-right'); if (!host) return null;
    saveEl = el('span', 'ux-save', '<span class="ux-save-ic" aria-hidden="true"><i></i>' + SVG_CHECK + '</span><span class="ux-save-tx">Tự động lưu</span>');
    saveEl.setAttribute('role', 'status'); saveEl.setAttribute('aria-live', 'polite'); saveEl.id = 'save-status';
    saveEl.setAttribute('data-state', 'idle');
    host.insertBefore(saveEl, host.firstChild);
    return saveEl;
  }
  ux.saving = function () { var s = ensureSave(); if (!s) return; clearTimeout(saveT); s.setAttribute('data-state', 'saving'); $('.ux-save-tx', s).textContent = 'Đang lưu…'; };
  ux.saved = function (ok) {
    var s = ensureSave(); if (!s) return; clearTimeout(saveT);
    var fin = function () {
      s.setAttribute('data-state', ok === false ? 'error' : 'saved');
      $('.ux-save-tx', s).textContent = ok === false ? 'Chưa lưu được' : 'Đã lưu ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };
    if (reduced()) fin(); else saveT = setTimeout(fin, 450);
  };

  // ---------- 6. Xem trước theo thiết bị (Lucian 257 responsive preview, MIT © 2026 Seokwoooo) ----------
  // Co/giãn mượt khung trang giữa máy tính / tablet / điện thoại thay vì đổi tức thì.
  ux.device = function (frame, update) {
    if (!frame || reduced() || !frame.animate) { update(); return; }
    var z0 = parseFloat(frame.style.zoom) || 1, pw0 = frame.offsetWidth;
    update();
    var pw1 = frame.offsetWidth, z1 = parseFloat(frame.style.zoom) || 1;
    var a = frame.animate([
      { width: pw0 + 'px', zoom: z0, opacity: 0.85 },
      { width: pw1 + 'px', zoom: z1, opacity: 1 }
    ], { duration: 420, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
    frame.classList.add('ux-resizing');
    var end = function () { frame.classList.remove('ux-resizing'); };
    a.onfinish = end; a.oncancel = end;
  };

  // ---------- 7. Khung xương khi đang tải (Lucian 079 skeleton, MIT © 2026 Seokwoooo) ----------
  ux.skeleton = function (host, rows, kind) {
    if (!host) return null;
    var wrap = el('div', 'ux-skel-wrap ux-skel-' + (kind || 'list'));
    wrap.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < (rows || 3); i++) {
      wrap.appendChild(el('div', 'ux-skel-row', kind === 'card'
        ? '<i class="ux-skel ux-skel-img"></i><i class="ux-skel ux-skel-l1"></i><i class="ux-skel ux-skel-l2"></i>'
        : '<i class="ux-skel ux-skel-dot"></i><i class="ux-skel ux-skel-l1"></i><i class="ux-skel ux-skel-l2"></i>'));
    }
    host.appendChild(wrap);
    return wrap;
  };
  ux.skeletonRows = function (tbody, rows) {
    for (var i = 0; i < (rows || 4); i++) {
      var tr = el('tr', 'ux-skel-tr'); var td = el('td'); td.colSpan = 9; td.innerHTML = '<i class="ux-skel ux-skel-l1"></i>'; tr.appendChild(td); tbody.appendChild(tr);
    }
  };

  // ---------- 8. Bảng lệnh Ctrl/Cmd+K (Lucian 046 command palette, MIT © 2026 Seokwoooo) ----------
  var pal = null, palIdx = 0, palItems = [], palList = [];
  function click(sel) { var b = $(sel); if (b) b.click(); return !!b; }
  function buildCommands() {
    var cmds = [];
    doc.querySelectorAll('.tabs .tab').forEach(function (t) {
      cmds.push({ g: 'Chuyển tab', t: 'Mở tab ' + t.textContent.trim(), k: 'tab chuyen ' + t.getAttribute('data-tab'), run: function () { t.click(); } });
    });
    cmds.push({ g: 'Hành động', t: 'Tạo trang mới', k: 'new tao moi trang', run: function () { click('#btn-new'); } });
    cmds.push({ g: 'Hành động', t: 'Tạo sự kiện mới', k: 'new tao su kien', run: function () { click('#btn-new-2') || click('#btn-new'); } });
    cmds.push({ g: 'Hành động', t: 'Xuất file HTML', k: 'export xuat tai html', run: function () { if (!click('#btn-export-html')) ux.toast('Hãy tạo landing page trước khi xuất.'); } });
    cmds.push({ g: 'Hành động', t: 'Xuất bản trang', k: 'publish xuat ban', run: function () {
      var b = $('#btn-publish'); if (b && !b.hidden && !b.disabled) b.click(); else ux.toast('Chưa thể xuất bản: hãy tạo landing page ở tab Thiết kế trang trước.'); } });
    cmds.push({ g: 'Hành động', t: 'Xem trước toàn màn hình', k: 'preview xem truoc', run: function () { click('#btn-preview'); } });
    cmds.push({ g: 'Hành động', t: 'Xuất danh sách đăng ký (CSV)', k: 'csv dang ky export', run: function () { click('#btn-export'); } });
    cmds.push({ g: 'Hành động', t: 'Đổi giao diện sáng / tối', k: 'theme giao dien sang toi dark light mode', run: function () { if (EP.theme) EP.theme.cycle($('#btn-theme')); } });
    ((EP.templates && EP.templates.list) || []).forEach(function (t) {
      cmds.push({ g: 'Dùng mẫu', t: 'Dùng mẫu: ' + t.name, k: 'mau template dung ' + (t.id || ''), run: function () {
        if (ux.hooks && ux.hooks.useTemplate) ux.hooks.useTemplate(t.id); else click('.tpl-card[data-id="' + t.id + '"]'); } });
    });
    return cmds;
  }
  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd'); }
  function renderPal(q) {
    var nq = norm(q).trim();
    palList = palItems.filter(function (c) { return !nq || nq.split(/\s+/).every(function (w) { return norm(c.t + ' ' + c.k + ' ' + c.g).indexOf(w) >= 0; }); }).slice(0, 40);
    var ul = $('.ux-pal-list', pal); ul.innerHTML = '';
    if (!palList.length) ul.appendChild(el('li', 'ux-pal-empty', 'Không có lệnh phù hợp'));
    var g = '';
    palList.forEach(function (c, i) {
      if (c.g !== g) { g = c.g; var h = el('li', 'ux-pal-group'); h.setAttribute('role', 'presentation'); h.textContent = g; ul.appendChild(h); }
      var li = el('li', 'ux-pal-item'); li.setAttribute('role', 'option'); li.id = 'ux-pal-' + i; li.textContent = c.t;
      li.addEventListener('mousemove', function () { if (palIdx !== i) setPalIdx(i, true); });
      li.addEventListener('click', function () { runPal(i); });
      ul.appendChild(li);
    });
    setPalIdx(0);
  }
  function setPalIdx(i, noScroll) {
    palIdx = Math.max(0, Math.min(palList.length - 1, i));
    var items = pal.querySelectorAll('.ux-pal-item');
    items.forEach(function (n, j) { n.setAttribute('aria-selected', j === palIdx ? 'true' : 'false'); });
    var cur = items[palIdx], inp = $('.ux-pal-input', pal);
    if (cur) { inp.setAttribute('aria-activedescendant', cur.id); if (!noScroll) cur.scrollIntoView({ block: 'nearest' }); }
  }
  function runPal(i) { var c = palList[i]; if (!c) return; closePal(true); setTimeout(function () { c.run(); }, 30); }
  function openPal() {
    if (pal) return;
    palItems = buildCommands();
    pal = el('div', 'ux-pal-back');
    pal.innerHTML = '<div class="ux-pal" role="dialog" aria-modal="true" aria-label="Bảng lệnh"><div class="ux-pal-head"><input class="ux-pal-input" type="text" role="combobox" aria-expanded="true" aria-controls="ux-pal-list" autocomplete="off" spellcheck="false" placeholder="Gõ lệnh: chuyển tab, tạo trang, dùng mẫu, xuất bản…" aria-label="Tìm lệnh"><kbd>Esc</kbd></div><ul class="ux-pal-list" id="ux-pal-list" role="listbox"></ul><div class="ux-pal-foot"><span><kbd>↑</kbd><kbd>↓</kbd> chọn</span><span><kbd>Enter</kbd> chạy</span><span><kbd>Esc</kbd> đóng</span></div></div>';
    pal._prev = doc.activeElement;
    doc.body.appendChild(pal);
    var inp = $('.ux-pal-input', pal);
    inp.addEventListener('input', function () { renderPal(inp.value); });
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setPalIdx(palIdx + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setPalIdx(palIdx - 1); }
      else if (e.key === 'Enter') { e.preventDefault(); runPal(palIdx); }
      else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closePal(); }
      else if (e.key === 'Tab') e.preventDefault();
    });
    pal.addEventListener('mousedown', function (e) { if (e.target === pal) closePal(); });
    renderPal('');
    if (!reduced()) pal.classList.add('is-in');
    inp.focus();
  }
  function closePal(noRestore) {
    if (!pal) return;
    var p = pal, prev = p._prev; pal = null;
    p.remove();
    if (!noRestore && prev && prev.focus) { try { prev.focus(); } catch (e) { /* bỏ qua */ } }
  }
  ux.palette = { open: openPal, close: closePal };
  doc.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && (e.key === 'k' || e.key === 'K')) {
      if (doc.querySelector('dialog[open]')) return;
      e.preventDefault(); if (pal) closePal(); else openPal();
    }
  });

  // ---------- Khởi động ----------
  function init() {
    var tg = $('.device-toggle');
    if (tg) {
      slidePill(tg);
      if (root.ResizeObserver) new ResizeObserver(function () { slidePill(tg); }).observe(tg);
      if (root.MutationObserver) {
        var mo = new MutationObserver(function () { slidePill(tg); });
        tg.querySelectorAll('button').forEach(function (b) { mo.observe(b, { attributes: true, attributeFilter: ['class'] }); });
      }
    }
    root.addEventListener('resize', function () { slidePill($('.device-toggle')); });
    ensureSave();
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init); else init();
})(typeof window !== 'undefined' ? window : globalThis);
