/* ux-lucian-editor.js — giao diện trình thiết kế ("Thiết kế trang") chuyển thể từ Lucian Lab UI.
   Nguồn: lucianLabs UI 100, MIT © 2026 Seokwoooo. Mỗi phần có một dòng ghi nguồn bên dưới.
   Chỉ vẽ lớp giao diện: mọi thao tác đi qua EP.editorApi (js/app.js) nên bấm-sửa trên trang, kéo thả, phím tắt giữ nguyên.
   Tôn trọng prefers-reduced-motion / html.motion-off qua EP.motion.reduce(). CSS: khối "Lucian: editor" cuối css/app.css. */
(function (root) {
  var EP = root.EP = root.EP || {};
  var doc = root.document;
  var ED = EP.edl = {};
  function reduced() { return EP.motion ? EP.motion.reduce() : (root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches); }
  function $(s, c) { return (c || doc).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }
  function el(tag, cls, html) { var n = doc.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; }
  function api() { return EP.editorApi || null; }
  function ready() { var a = api(); return !!(a && a.hasState()); }
  function editorOpen() { var v = $('#view-editor'); return !!(v && !v.hidden); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd'); }
  function copy(t) { try { if (root.navigator.clipboard) root.navigator.clipboard.writeText(t).catch(function () {}); } catch (e) { /* bỏ qua */ } }
  var MAC = /Mac|iPhone|iPad/.test(root.navigator.platform || '');
  var CTRL = MAC ? '⌘' : 'Ctrl ';
  // Chạy fn một lần cho mỗi lần nội dung của node thay đổi (panel được vẽ lại bằng innerHTML)
  function watch(node, fn, opts) {
    if (!node || !root.MutationObserver) return;
    var t = 0, mo = new MutationObserver(function () { clearTimeout(t); t = setTimeout(fn, 0); });
    mo.observe(node, opts || { childList: true, subtree: false });
    fn();
  }
  function ico(path, cls) { return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true">' + path + '</svg>'; }
  var I = {
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>',
    undo: '<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>', redo: '<path d="M15 14l5-5-5-5"/><path d="M20 9H10a6 6 0 0 0 0 12h3"/>',
    up: '<path d="M6 14.5l6-6 6 6"/>', down: '<path d="M6 9.5l6 6 6-6"/>',
    trash: '<path d="M4.5 7h15M9.5 7V4.8h5V7M7 7l.8 12.2h8.4L17 7"/>', eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',
    blocks: '<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>',
    layers: '<path d="M12 4l8.5 4.5L12 13 3.5 8.5z"/><path d="M3.5 12.5L12 17l8.5-4.5M3.5 16.5L12 21l8.5-4.5"/>',
    layout: '<rect x="3.5" y="4.5" width="17" height="15" rx="3"/><path d="M3.5 9.5h17M9.5 9.5v10"/>',
    image: '<rect x="3.5" y="4.5" width="17" height="15" rx="3"/><circle cx="9" cy="10" r="1.8"/><path d="M4 17l5-4.5 4 3.5 3-2.5 4 3.5"/>',
    palette: '<path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.4 0 2-.9 2-1.8 0-1.4-1.4-1.6-1.4-3 0-1 .8-1.7 1.9-1.7H17a3.5 3.5 0 0 0 3.5-3.5C20.5 6.7 16.7 3.5 12 3.5z"/><circle cx="7.8" cy="11" r="1"/><circle cx="10.5" cy="7.3" r="1"/><circle cx="15" cy="7.8" r="1"/>',
    send: '<path d="M20.5 3.5L10 14M20.5 3.5l-6.5 17-3-6.5-6.5-3z"/>', monitor: '<rect x="3" y="4.5" width="18" height="12" rx="2"/><path d="M8 20h8M12 16.5V20"/>',
    tablet: '<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M10.5 17.5h3"/>', phone: '<rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M11 17.5h2"/>',
    zoomin: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5M8.5 11h5M11 8.5v5"/>', zoomout: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5M8.5 11h5"/>',
    fit: '<path d="M4 9V5h4M20 9V5h-4M4 15v4h4M20 15v4h-4"/>', expand: '<path d="M14 4h6v6M20 4l-8 8M10 20H4v-6M4 20l8-8"/>',
    code: '<path d="M8.5 7L3.5 12l5 5M15.5 7l5 5-5 5"/>', pencil: '<path d="M4 20h4L19 9l-4-4L4 16z"/>', wand: '<path d="M5 19L16 8l2 2L7 21zM15 4v3M13.5 5.5h3M19.5 11v2M18.5 12h2"/>',
    reset: '<path d="M4 12a8 8 0 1 0 2.6-5.9M4 4v4.5h4.5"/>', dots: '<circle cx="5.5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18.5" cy="12" r="1.6"/>',
    chev: '<path d="M9.5 6l6 6-6 6"/>', back: '<path d="M14.5 6L8.5 12l6 6"/>', check: '<path d="M5 12.5l4.2 4.2L19 7"/>',
    sliders: '<path d="M5 19.5V13M5 9V4.5M12 19.5V11M12 7V4.5M19 19.5V15M19 11V4.5M3 13h4M10 7h4M17 15h4"/>', home: '<path d="M4 11l8-6.5 8 6.5V19a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1z"/>',
    lock: '<rect x="5" y="10.5" width="14" height="9.5" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>', copy: '<rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>', external: '<path d="M14 4h6v6M20 4l-8 8M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/>'
  };
  ED.icons = I;

  // ======================================================================================
  // 1. Khung thiết bị + thước kéo độ rộng (Lucian 257 responsive preview, MIT © 2026 Seokwoooo)
  //    Thước breakpoint dính trên giếng xem trước; tay kéo đổi độ rộng thật của trang (320–1440px),
  //    chạm mốc thì vạch nháy; nút thiết bị dạng "viên" có chữ px.
  // ======================================================================================
  var RMIN = 320, RMAX = 1440, BP = [[640, 'sm'], [768, 'md'], [1024, 'lg'], [1280, 'xl']];
  var ruler = null, rzone = -1;
  function zoneOf(x) { var z = 0; BP.forEach(function (b, i) { if (x >= b[0]) z = i + 1; }); return z; }
  function rtrackW() { return ruler ? ruler.track.clientWidth : 0; }
  function toPx(v) { return (v - RMIN) / (RMAX - RMIN) * rtrackW(); }
  function toV(p) { return RMIN + p / Math.max(1, rtrackW()) * (RMAX - RMIN); }
  function buildRuler() {
    var wrap = $('#view-editor .preview-wrap');
    if (!wrap || $('.edl-ruler', wrap)) return;
    var r = el('div', 'edl-ruler');
    r.innerHTML = '<div class="edl-r-ticks" aria-hidden="true"></div><div class="edl-r-track"><div class="edl-r-fill" aria-hidden="true"></div>' +
      '<span class="edl-r-hd" role="slider" tabindex="0" aria-label="Độ rộng xem trước (px)" aria-valuemin="' + RMIN + '" aria-valuemax="' + RMAX + '" aria-orientation="horizontal"></span></div>';
    wrap.insertBefore(r, wrap.firstChild);
    ruler = { root: r, ticks: $('.edl-r-ticks', r), track: $('.edl-r-track', r), fill: $('.edl-r-fill', r), hd: $('.edl-r-hd', r), tk: [] };
    BP.forEach(function (b) { var t = el('i'); t.textContent = b[1]; t.setAttribute('data-v', b[0]); ruler.ticks.appendChild(t); ruler.tk.push(t); });
    var lo = el('i', 'edl-r-edge'); lo.textContent = RMIN; ruler.ticks.appendChild(lo);
    var hi = el('i', 'edl-r-edge edl-r-edge-r'); hi.textContent = RMAX; ruler.ticks.appendChild(hi);
    var drag = null, pend = null;
    ruler.hd.addEventListener('pointerdown', function (e) {
      var tr = ruler.track.getBoundingClientRect();
      drag = { left: tr.left }; ruler.root.classList.add('is-drag');
      try { ruler.hd.setPointerCapture(e.pointerId); } catch (x) { /* bỏ qua */ }
    });
    ruler.track.addEventListener('pointerdown', function (e) {
      if (e.target === ruler.hd) return;
      var tr = ruler.track.getBoundingClientRect();
      if (api()) api().setWidth(toV(e.clientX - tr.left), true);
    });
    ruler.hd.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var v = toV(e.clientX - drag.left);
      if (pend != null) { pend = v; return; }
      pend = v;
      root.requestAnimationFrame(function () { var x = pend; pend = null; if (api() && x != null) api().setWidth(x, false); });
    });
    var up = function () { if (!drag) return; drag = null; ruler.root.classList.remove('is-drag'); if (api()) api().setWidth(api().getWidth(), true); };
    ruler.hd.addEventListener('pointerup', up); ruler.hd.addEventListener('pointercancel', up);
    ruler.hd.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 40 : e.key === 'ArrowLeft' ? -40 : e.key === 'Home' ? -9999 : e.key === 'End' ? 9999 : 0;
      if (!d || !api()) return;
      e.preventDefault(); api().setWidth(api().getWidth() + d, true);
    });
    if (root.ResizeObserver) new ResizeObserver(syncRuler).observe(ruler.track);
    syncRuler();
  }
  function syncRuler() {
    if (!ruler || !api()) return;
    var v = api().getWidth(), p = toPx(v);
    ruler.hd.style.left = p + 'px'; ruler.fill.style.width = p + 'px';
    ruler.hd.setAttribute('aria-valuenow', v); ruler.hd.setAttribute('aria-valuetext', v + ' px');
    ruler.tk.forEach(function (t) { t.style.left = toPx(+t.getAttribute('data-v')) + 'px'; });
    var z = zoneOf(v);
    if (rzone >= 0 && z !== rzone && !reduced()) {
      var t = ruler.tk[Math.min(z, rzone)];
      if (t) { t.classList.remove('is-flash'); void t.offsetWidth; t.classList.add('is-flash'); }
    }
    rzone = z;
    var px = $('#edl-px'); if (px) px.textContent = v + 'px';
  }
  function enhanceDevices() {
    var tg = $('#view-editor .device-toggle');
    if (!tg || $('#edl-px')) return;
    var px = el('span', 'edl-px'); px.id = 'edl-px'; px.setAttribute('aria-live', 'polite'); px.title = 'Độ rộng trang đang xem';
    tg.parentNode.insertBefore(px, tg.nextSibling);
    // Rê/chạm vào một thiết bị: hiện luôn độ rộng của nó
    var W = { desktop: 1280, tablet: 768, mobile: 390 };
    $$('button[data-device]', tg).forEach(function (b) { b.title = b.getAttribute('aria-label') + ' · ' + W[b.getAttribute('data-device')] + 'px'; });
    var land = $('#landing');
    if (land && root.MutationObserver) new MutationObserver(syncRuler).observe(land, { attributes: true, attributeFilter: ['style', 'class'] });
    syncRuler();
  }

  // ======================================================================================
  // 2. Bảng lệnh (Lucian 046 command palette, MIT © 2026 Seokwoooo)
  //    Ô tìm nằm trên thanh công cụ; mở ra thành bảng, chọn xong thì bảng thu về thành viên thuốc.
  // ======================================================================================
  var pal = null;
  var PANEL_ICON = { layout: 'layout', images: 'image', blocks: 'blocks', layers: 'layers', style: 'palette', publish: 'send' };
  function palCommands() {
    var a = api(), C = [], st = ready();
    var G = { cmd: 'Lệnh', blk: 'Khối', dev: 'Thiết bị & thu phóng', pan: 'Panel', go: 'Chuyển trang' };
    function add(g, n, ic, run, k, extra) { C.push({ g: g, n: n, ic: ic, run: run, k: k, key: extra || '' }); }
    add(G.cmd, 'Hoàn tác', 'undo', function () { a.undo(); }, CTRL + 'Z', 'undo hoan tac');
    add(G.cmd, 'Làm lại', 'redo', function () { a.redo(); }, CTRL + '⇧Z', 'redo lam lai');
    add(G.cmd, 'Xem trước toàn màn hình', 'expand', function () { a.openPreview(); }, 'Alt P', 'preview xem truoc');
    add(G.cmd, 'Xuất bản / cập nhật trang', 'send', function () { a.publish(); }, '', 'publish xuat ban');
    add(G.cmd, 'Tải trang dạng file HTML', 'code', function () { var b = $('#btn-export-html'); if (b) b.click(); }, '', 'export html tai');
    add(G.cmd, 'Trộn bảng màu mới', 'palette', function () { EP.workspace.show('style'); setTimeout(function () { var b = $('.edl-pg-sh'); if (b) b.click(); }, 120); }, '', 'tron mau palette shuffle');
    add(G.cmd, 'Chế độ Studio (mọi thông số)', 'sliders', function () { var b = $('.mode-btn[data-mode="studio"]'); if (b) b.click(); }, '', 'studio che do');
    add(G.cmd, 'Chế độ Đơn giản', 'sliders', function () { var b = $('.mode-btn[data-mode="simple"]'); if (b) b.click(); }, '', 'don gian che do');
    add(G.cmd, 'AI viết lại nội dung', 'wand', function () { var b = $('#btn-regenerate-2'); if (b) b.click(); }, '', 'ai viet lai noi dung');
    add(G.cmd, 'Về giao diện gốc của mẫu', 'reset', function () { var b = $('#btn-style-reset'); if (b) b.click(); }, '', 'giao dien goc reset');
    add(G.cmd, 'Sửa thông tin & nội dung', 'pencil', function () { var b = $('#btn-back-info'); if (b) b.click(); }, '', 'sua thong tin noi dung');
    if (st) a.sections().filter(function (s) { return s.block; }).forEach(function (s) {
      add(G.blk, (s.visible ? 'Gỡ khối: ' : 'Thêm khối: ') + s.label, s.visible ? 'trash' : 'plus', function () { a.toggleBlock(s.key); }, '', 'khoi block ' + s.key);
    });
    [['desktop', 'Máy tính (1280px)', 'monitor'], ['tablet', 'Máy tính bảng (768px)', 'tablet'], ['mobile', 'Điện thoại (390px)', 'phone']].forEach(function (d) {
      add(G.dev, 'Xem như ' + d[1], d[2], function () { a.setDevice(d[0]); }, '', 'thiet bi device ' + d[0]);
    });
    add(G.dev, 'Phóng to', 'zoomin', function () { a.stepZoom(1); }, CTRL + '+', 'zoom phong to');
    add(G.dev, 'Thu nhỏ', 'zoomout', function () { a.stepZoom(-1); }, CTRL + '−', 'zoom thu nho');
    add(G.dev, 'Vừa khung', 'fit', function () { a.setZoom('fit'); }, '', 'vua khung fit');
    (EP.workspace ? EP.workspace.panels() : []).forEach(function (p) {
      add(G.pan, 'Mở panel ' + p.title, PANEL_ICON[p.id] || 'layout', function () { EP.workspace.show(p.id); }, '', 'panel ' + p.id);
    });
    $$('.tabs .tab').forEach(function (t) { add(G.go, 'Mở tab ' + t.textContent.trim(), 'home', function () { t.click(); }, '', 'tab chuyen'); });
    return C;
  }
  function palOpen() {
    if (pal || !api()) return;
    var pill = $('#edl-palpill'), pr = pill ? pill.getBoundingClientRect() : { left: 80, top: 8, width: 120, height: 36 };
    var vw = root.innerWidth, vh = root.innerHeight, W = Math.min(440, vw - 16), left = Math.max(8, Math.min(pr.left, vw - W - 8));
    var H = Math.min(470, vh - pr.top - 12);
    var r = el('div', 'edl-pal is-closed');
    r.style.cssText = 'left:' + left + 'px;top:' + pr.top + 'px;width:' + W + 'px;height:' + H + 'px;--fh:' + Math.max(36, Math.round(pr.height)) + 'px';
    r.innerHTML = '<div class="edl-pal-in"><label class="edl-pal-field">' + ico(I.search) +
      '<input class="edl-pal-q" type="text" role="combobox" aria-expanded="true" aria-autocomplete="list" aria-controls="edl-pal-list" autocomplete="off" spellcheck="false" placeholder="Tìm lệnh, khối, panel…" aria-label="Tìm lệnh">' +
      '<kbd class="edl-kbd">esc</kbd></label>' +
      '<div class="edl-pal-body"><span class="edl-pal-hl" aria-hidden="true"></span><ul class="edl-pal-list" id="edl-pal-list" role="listbox" aria-label="Lệnh"></ul></div>' +
      '<div class="edl-pal-foot" aria-hidden="true"><span><kbd class="edl-kbd">↑↓</kbd>chọn</span><span><kbd class="edl-kbd">↵</kbd>chạy</span><span class="edl-pal-done"></span></div></div>';
    pal = { root: r, opts: [], act: 0, data: palCommands(), prev: doc.activeElement, doneT: 0, closing: false };
    doc.body.appendChild(r);
    if (pill) pill.classList.add('is-hidden');
    var q = $('.edl-pal-q', r);
    palRender(''); void r.offsetWidth;
    r.classList.remove('is-closed');
    q.focus();
    q.addEventListener('input', function () { palRender(q.value); });
    q.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); palMark(pal.act + (e.key === 'ArrowDown' ? 1 : -1)); }
      else if (e.key === 'Enter' && !e.isComposing && e.keyCode !== 229) { e.preventDefault(); palRun(); }
      else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); palClose(); }
      else if (e.key === 'Tab') e.preventDefault();
    });
    r._out = function (e) { if (pal && !pal.root.contains(e.target) && e.target !== pill && !(pill && pill.contains(e.target))) palClose(true); };
    setTimeout(function () { doc.addEventListener('pointerdown', r._out, true); }, 0);
  }
  function palHit(name, q) {
    if (!q) return esc(name);
    var i = norm(name).indexOf(norm(q));
    if (i < 0) return esc(name);
    return esc(name.slice(0, i)) + '<mark>' + esc(name.slice(i, i + q.length)) + '</mark>' + esc(name.slice(i + q.length));
  }
  function palRender(qv) {
    var q = norm(qv).trim(), ul = $('.edl-pal-list', pal.root), g = '', n = 0, html = '';
    var found = pal.data.filter(function (d) { return !q || q.split(/\s+/).every(function (w) { return norm(d.n + ' ' + d.key + ' ' + d.g).indexOf(w) >= 0; }); }).slice(0, 40);
    found.forEach(function (d) {
      if (d.g !== g) { g = d.g; html += '<li class="edl-pal-g" role="presentation">' + esc(g) + '</li>'; }
      html += '<li class="edl-pal-op" role="option" id="edl-po-' + n + '" data-n="' + n + '" style="--i:' + n + '" aria-selected="false"><span class="edl-pal-ic">' + ico(I[d.ic] || I.layout) + '</span><span class="edl-pal-t">' + palHit(d.n, qv.trim()) + '</span>' + (d.k ? '<kbd class="edl-kbd">' + esc(d.k) + '</kbd>' : '') + '</li>';
      n++;
    });
    if (!n) html = '<li class="edl-pal-empty" role="presentation"><b>Không có “' + esc(qv.trim()) + '”</b>Thử từ khoá khác</li>';
    ul.innerHTML = html;
    pal.found = found;
    pal.opts = $$('.edl-pal-op', ul);
    pal.opts.forEach(function (o, i) {
      o.addEventListener('pointermove', function () { if (pal.act !== i) palMark(i); });
      o.addEventListener('click', function () { palMark(i); palRun(); });
    });
    $('.edl-pal-hl', pal.root).style.opacity = n ? '1' : '0';
    palMark(0, true);
  }
  function palMark(i, instant) {
    var inp = $('.edl-pal-q', pal.root), hl = $('.edl-pal-hl', pal.root), body = $('.edl-pal-body', pal.root);
    if (!pal.opts.length) { inp.removeAttribute('aria-activedescendant'); return; }
    pal.act = (i + pal.opts.length) % pal.opts.length;
    pal.opts.forEach(function (o, k) { o.setAttribute('aria-selected', String(k === pal.act)); });
    inp.setAttribute('aria-activedescendant', pal.opts[pal.act].id);
    var o = pal.opts[pal.act], top = o.offsetTop + 6;
    if (instant) hl.style.transition = 'none';
    hl.style.setProperty('--y', top + 'px');
    if (instant) { void hl.offsetWidth; hl.style.transition = ''; }
    if (top + o.offsetHeight > body.scrollTop + body.clientHeight) body.scrollTo({ top: top + o.offsetHeight - body.clientHeight + 6, behavior: instant ? 'auto' : 'smooth' });
    else if (top < body.scrollTop + 30) body.scrollTo({ top: pal.act === 0 ? 0 : top - 30, behavior: instant ? 'auto' : 'smooth' });
  }
  function palRun() {
    var c = pal && pal.found && pal.found[pal.act], o = pal && pal.opts[pal.act];
    if (!c || !o) return;
    if (o.animate && !reduced()) o.animate([{ transform: 'scale(.97)' }, { transform: 'none' }], { duration: 260, easing: 'ease-out' });
    var d = $('.edl-pal-done', pal.root); d.textContent = '“' + c.n + '” đã chạy'; d.classList.add('show');
    var p = pal; clearTimeout(p.doneT);
    p.doneT = setTimeout(function () { palClose(true); setTimeout(function () { try { c.run(); } catch (e) { /* bỏ qua */ } }, 40); }, reduced() ? 0 : 450);
  }
  function palClose(noRestore) {
    if (!pal || pal.closing) return;
    var p = pal; p.closing = true; pal = null;
    doc.removeEventListener('pointerdown', p.root._out, true);
    p.root.classList.add('is-closed');
    var pill = $('#edl-palpill');
    setTimeout(function () { p.root.remove(); if (pill) pill.classList.remove('is-hidden'); }, reduced() ? 0 : 480);
    if (!noRestore && p.prev && p.prev.focus) { try { p.prev.focus(); } catch (e) { /* bỏ qua */ } }
  }
  function buildPalPill() {
    var bar = $('#view-editor .editor-bar-right');
    if (!bar || $('#edl-palpill')) return;
    var b = el('button', 'edl-palpill');
    b.type = 'button'; b.id = 'edl-palpill'; b.setAttribute('aria-haspopup', 'dialog'); b.setAttribute('aria-label', 'Bảng lệnh (' + CTRL + 'K)'); b.title = 'Bảng lệnh (' + CTRL + 'K)';
    b.innerHTML = ico(I.search) + '<span class="edl-pp-t">Tìm lệnh</span><kbd class="edl-kbd">' + (MAC ? '⌘K' : 'Ctrl K') + '</kbd>';
    b.addEventListener('click', function () { if (pal) palClose(); else palOpen(); });
    bar.insertBefore(b, bar.firstChild);
  }
  // Trong trình thiết kế, Ctrl/Cmd+K mở bảng lệnh riêng này (bảng lệnh chung vẫn dùng ở các tab khác)
  doc.addEventListener('keydown', function (e) {
    if (!((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && (e.key === 'k' || e.key === 'K'))) return;
    if (!editorOpen() || !ready() || doc.querySelector('dialog[open]')) return;
    e.preventDefault(); e.stopImmediatePropagation();
    if (pal) palClose(); else palOpen();
  }, true);

  // ======================================================================================
  // 3. Menu chuột phải trên trang (Lucian 038 context menu from origin, MIT © 2026 Seokwoooo)
  //    Mở tại con trỏ, lật hướng khi sát mép, mục "Thêm khối" trượt sang ngăn con trong cùng hộp; chạm giữ cũng mở.
  // ======================================================================================
  var ctx = null;
  function ctxTarget(t) {
    var n = t && t.closest ? t.closest('[data-el]') : null;
    var sec = t && t.closest ? t.closest('[data-section]') : null;
    return { el: n, sec: sec, key: sec ? sec.getAttribute('data-section') : null };
  }
  function mi(label, ic, cls, kbd, extra) {
    return '<li role="none"><button class="edl-mi' + (cls ? ' ' + cls : '') + '" type="button" role="menuitem"' + (extra || '') + '>' + ico(I[ic] || I.layout) + '<span>' + esc(label) + '</span>' + (kbd ? '<kbd>' + esc(kbd) + '</kbd>' : '') + '</button></li>';
  }
  function ctxClose(refocus) {
    if (!ctx) return;
    var c = ctx; ctx = null;
    c.root.classList.remove('is-open');
    doc.removeEventListener('pointerdown', c.out, true); doc.removeEventListener('keydown', c.kd, true);
    setTimeout(function () { c.root.remove(); }, reduced() ? 0 : 380);
    if (refocus && c.prev && c.prev.focus) { try { c.prev.focus(); } catch (e) { /* bỏ qua */ } }
  }
  function ctxOpen(x, y, target, kb) {
    ctxClose();
    var a = api(); if (!a || !ready()) return;
    var key = target.key, secs = a.sections(), cur = secs.filter(function (s) { return s.key === key; })[0];
    var elKey = target.el ? target.el.getAttribute('data-el') : null;
    if (elKey && EP.inspector) EP.inspector.select(elKey);
    var lab = target.el ? target.el.getAttribute('data-el-label') : '';
    var m = el('div', 'edl-ctx'); m.setAttribute('role', 'menu'); m.setAttribute('aria-label', 'Menu phần tử');
    var main = '';
    if (lab) main += '<li class="edl-ctx-h" role="presentation">' + esc(lab) + '</li>';
    if (cur) {
      main += mi('Chọn cả phần này', 'layout', '', '', ' data-act="selsec"');
      main += mi('Đưa phần lên', 'up', '', 'Alt ↑', ' data-act="up"');
      main += mi('Đưa phần xuống', 'down', '', 'Alt ↓', ' data-act="down"');
    }
    main += '<li role="none"><button class="edl-mi edl-has" type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false">' + ico(I.blocks) + '<span>Thêm / gỡ khối</span>' + ico(I.chev, 'edl-ar') + '</button></li>';
    main += '<li class="edl-sep" role="separator"></li>';
    main += mi('Hoàn tác', 'undo', '', CTRL + 'Z', ' data-act="undo"' + (a.canUndo() ? '' : ' disabled'));
    main += mi('Mở panel Giao diện', 'palette', '', '', ' data-act="style"');
    main += mi('Mở panel Cấu trúc', 'layers', '', '', ' data-act="layers"');
    if (cur && !cur.locked) { main += '<li class="edl-sep" role="separator"></li>'; main += mi('Ẩn phần này', 'trash', 'danger', '', ' data-act="hide"'); }
    var sub = '<li role="none"><button class="edl-mi edl-back" type="button" role="menuitem">' + ico(I.back) + '<span>Khối</span></button></li><li class="edl-sep" role="separator"></li>';
    secs.filter(function (s) { return s.block; }).forEach(function (s) {
      sub += mi((s.visible ? 'Gỡ: ' : 'Thêm: ') + s.label, s.visible ? 'trash' : 'plus', s.visible ? 'danger' : '', '', ' data-blk="' + s.key + '"');
    });
    m.innerHTML = '<div class="edl-track"><ul class="edl-p" role="none">' + main + '</ul><ul class="edl-p" role="none">' + sub + '</ul></div>';
    doc.body.appendChild(m);
    var P = $$('.edl-p', m), vw = root.innerWidth, vh = root.innerHeight, mw = 232;
    var has = $('.edl-has', m), back = $('.edl-back', m);
    function items(i) { return $$('.edl-mi:not([disabled])', P[i]); }
    function fit(i) { m.style.setProperty('--mh', (P[i].offsetHeight + 12) + 'px'); }
    function subOn(on, kbd) {
      m.classList.toggle('is-sub', on); has.setAttribute('aria-expanded', String(on)); fit(on ? 1 : 0);
      if (kbd) setTimeout(function () { (on ? back : has).focus(); }, 60);
    }
    fit(0);
    var mh = P[0].offsetHeight + 12, left = x + mw > vw - 8 ? Math.max(8, x - mw) : x, top = y + mh > vh - 8 ? Math.max(8, y - mh) : y;
    m.style.left = left + 'px'; m.style.top = top + 'px';
    m.style.transformOrigin = (left < x ? 'right' : 'left') + ' ' + (top < y ? 'bottom' : 'top');
    ctx = { root: m, prev: kb ? doc.activeElement : null };
    void m.offsetWidth; m.classList.add('is-open');
    if (kb) setTimeout(function () { var f = items(0)[0]; if (f) f.focus(); }, 40);
    [0, 1].forEach(function (pi) {
      items(pi).forEach(function (b, i, arr) {
        b.addEventListener('click', function () {
          if (b === has) { subOn(true, true); return; }
          if (b === back) { subOn(false, true); return; }
          var act = b.getAttribute('data-act'), blk = b.getAttribute('data-blk');
          ctxClose(false);
          if (blk) { a.toggleBlock(blk); return; }
          if (act === 'selsec' && EP.inspector) EP.inspector.select('section.' + key);
          else if (act === 'up') a.moveSection(key, -1);
          else if (act === 'down') a.moveSection(key, 1);
          else if (act === 'undo') a.undo();
          else if (act === 'style') EP.workspace.show('style');
          else if (act === 'layers') EP.workspace.show('layers');
          else if (act === 'hide') a.hideSection(key);
        });
        b.addEventListener('keydown', function (e) {
          var d = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0;
          if (d) { e.preventDefault(); arr[(i + d + arr.length) % arr.length].focus(); }
          if (e.key === 'ArrowRight' && b === has) { e.preventDefault(); subOn(true, true); }
          if (e.key === 'ArrowLeft' && pi === 1) { e.preventDefault(); subOn(false, true); }
        });
      });
    });
    ctx.out = function (e) { if (ctx && !ctx.root.contains(e.target)) ctxClose(false); };
    ctx.kd = function (e) { if (e.key === 'Escape' && ctx) { e.preventDefault(); e.stopPropagation(); ctxClose(true); } };
    doc.addEventListener('pointerdown', ctx.out, true); doc.addEventListener('keydown', ctx.kd, true);
  }
  function bindContext() {
    var land = $('#landing');
    if (!land || land._edlCtx) return;
    land._edlCtx = 1;
    land.addEventListener('contextmenu', function (e) {
      if (!ready() || !land.classList.contains('is-editable')) return;
      var t = e.target;
      if (t.isContentEditable && root.getSelection && String(root.getSelection()).length) return; // để menu của trình duyệt (sao chép/dán)
      if (t.closest && t.closest('input, textarea, select, a[href^="http"]') && !t.closest('[data-el]')) return;
      e.preventDefault();
      ctxOpen(e.clientX, e.clientY, ctxTarget(t), false);
    });
    // Phím menu / Shift+F10 khi đang chọn một phần tử
    land.addEventListener('keydown', function (e) {
      if (!((e.shiftKey && e.key === 'F10') || e.key === 'ContextMenu')) return;
      var s = $('.lp-selected', land) || (e.target.closest && e.target.closest('[data-el]'));
      if (!s) return;
      e.preventDefault();
      var r = s.getBoundingClientRect();
      ctxOpen(Math.max(8, r.left + 24), Math.max(8, r.top + 24), ctxTarget(s), true);
    });
    // Cảm ứng: chạm giữ để mở menu
    var lp = 0, sx = 0, sy = 0;
    land.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'touch' || !land.classList.contains('is-editable')) return;
      sx = e.clientX; sy = e.clientY;
      var tgt = e.target;
      lp = setTimeout(function () { if (!tgt.isContentEditable || !String(root.getSelection && root.getSelection() || '').length) ctxOpen(sx, sy, ctxTarget(tgt), false); }, 520);
    });
    ['pointerup', 'pointercancel'].forEach(function (t) { land.addEventListener(t, function () { clearTimeout(lp); }); });
    land.addEventListener('pointermove', function (e) { if (Math.abs(e.clientX - sx) > 8 || Math.abs(e.clientY - sy) > 8) clearTimeout(lp); });
  }

  // ======================================================================================
  // 4. Thanh rail mở rộng (Lucian 040 vertical rail expand, MIT © 2026 Seokwoooo)
  //    Rail tối bên trái: biểu tượng các panel, bấm để mở/chuyển; nút mép phải mở rộng thành tên; vạch sáng trượt theo panel đang xem.
  // ======================================================================================
  var rail = null;
  function buildRail() {
    var ws = $('#ws');
    if (!ws || $('.edl-rail', ws) || !EP.workspace) return;
    var ids = EP.workspace.panels();
    if (!ids.length) return;
    var order = ['layout', 'images', 'blocks', 'layers', 'style', 'publish'];
    ids.sort(function (x, y) { return order.indexOf(x.id) - order.indexOf(y.id); });
    var wrap = el('div', 'edl-rail-slot');
    var r = el('nav', 'edl-rail'); r.setAttribute('aria-label', 'Panel thiết kế');
    var html = '<div class="edl-rail-top"><span class="edl-rail-logo" aria-hidden="true"></span><span class="edl-rail-name">Thiết kế</span></div>' +
      '<button class="edl-rail-tog" type="button" aria-expanded="false" aria-label="Mở rộng thanh panel">' + ico(I.chev) + '</button><ul class="edl-rail-nav"><li class="edl-rail-hl" role="presentation"></li>';
    ids.forEach(function (p, i) {
      html += '<li><button class="edl-rail-it" type="button" data-rail="' + p.id + '" style="--i:' + i + '" title="' + esc(p.title) + '">' + ico(I[PANEL_ICON[p.id] || 'layout']) + '<span>' + esc(p.title) + '</span>' + (p.id === 'blocks' ? '<em class="edl-rail-bd" hidden></em>' : '') + '</button></li>';
    });
    html += '</ul><button class="edl-rail-me" type="button" title="Đổi mẫu trang"><i aria-hidden="true"></i><span>Mẫu trang<small></small></span></button>';
    r.innerHTML = html;
    wrap.appendChild(r);
    ws.insertBefore(wrap, ws.firstChild);
    rail = { root: r, hl: $('.edl-rail-hl', r), items: $$('.edl-rail-it', r), tog: $('.edl-rail-tog', r) };
    rail.tog.addEventListener('click', function () {
      var w = !r.classList.contains('is-wide'); r.classList.toggle('is-wide', w);
      rail.tog.setAttribute('aria-expanded', String(w)); rail.tog.setAttribute('aria-label', w ? 'Thu gọn thanh panel' : 'Mở rộng thanh panel');
    });
    rail.items.forEach(function (b, i) {
      b.addEventListener('click', function () { EP.workspace.show(b.getAttribute('data-rail')); setTimeout(syncRail, 60); });
      b.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0;
        if (d) { e.preventDefault(); rail.items[(i + d + rail.items.length) % rail.items.length].focus(); }
      });
    });
    $('.edl-rail-me', r).addEventListener('click', function () { var b = $('#btn-tpl-2'); if (b) b.click(); });
    r.addEventListener('pointerleave', function () { if (r.classList.contains('is-wide') && !r.contains(doc.activeElement)) { /* giữ trạng thái người dùng chọn */ } });
    var mo = new MutationObserver(function () { clearTimeout(rail.t); rail.t = setTimeout(syncRail, 30); });
    mo.observe(ws, { attributes: true, subtree: true, attributeFilter: ['class', 'hidden'], childList: true });
    if (root.ResizeObserver) new ResizeObserver(syncRail).observe(ws);
    syncRail();
  }
  function syncRail() {
    if (!rail) return;
    var act = null;
    rail.items.forEach(function (b) {
      var id = b.getAttribute('data-rail'), tab = $('.ws-tab[data-tab-panel="' + id + '"]'), on = false;
      if (tab) on = tab.classList.contains('is-active');
      else if (EP.workspace.isVisible && EP.workspace.isVisible(id)) on = true;
      b.classList.toggle('is-off', !(EP.workspace.isVisible && EP.workspace.isVisible(id)));
      if (on) { b.setAttribute('aria-current', 'true'); if (!act) act = b; } else b.removeAttribute('aria-current');
    });
    if (act) { rail.hl.style.opacity = '1'; rail.hl.style.setProperty('--y', act.parentNode.offsetTop + 'px'); } else rail.hl.style.opacity = '0';
    var a = api(), bd = $('.edl-rail-bd', rail.root);
    if (bd && a && ready()) { var n = a.sections().filter(function (s) { return s.block && s.visible; }).length; bd.textContent = n; bd.hidden = !n; }
    var nm = $('#tpl-name-2'), sw = $('#tpl-swatch-2'), me = $('.edl-rail-me', rail.root);
    if (nm && me) { $('small', me).textContent = nm.textContent; }
    if (sw && me) { var cs = getComputedStyle(sw); me.style.setProperty('--sw1', cs.getPropertyValue('--sw1') || ''); me.style.setProperty('--sw2', cs.getPropertyValue('--sw2') || ''); }
  }

  // ======================================================================================
  // 5. Bố cục & thư viện khối (Lucian 297 block page builder, MIT © 2026 Seokwoooo)
  //    Hàng bố cục thành khung xương có nhãn; rê chuột hiện nút lên/xuống; đếm khối + "Đã lưu" nháy; thư viện khối là ô chọn dọc.
  // ======================================================================================
  var WFV = { countdown: 'box', about: 'text', benefits: 'cols', speakers: 'avatars', gallery: 'grid', agenda: 'rows', offer: 'cta', register: 'form', faq: 'rows', testimonials: 'quote', sponsors: 'dots', video: 'play', map: 'pin', cta2: 'cta' };
  function wfHtml(k) {
    var v = WFV[k] || 'text';
    var m = {
      text: '<i style="left:6px;top:5px;width:22px;height:4px"></i><i style="left:6px;top:12px;width:30px;height:3px"></i>',
      box: '<i style="left:5px;top:6px;width:7px;height:9px"></i><i style="left:14px;top:6px;width:7px;height:9px"></i><i style="left:23px;top:6px;width:7px;height:9px"></i><i style="left:32px;top:6px;width:7px;height:9px"></i>',
      cols: '<i style="left:5px;right:5px;top:6px;height:10px;background:repeating-linear-gradient(90deg,var(--ux-surface-3) 0 10px,transparent 10px 13px)"></i>',
      avatars: '<i style="left:7px;top:6px;width:9px;height:9px;border-radius:50%"></i><i style="left:19px;top:6px;width:9px;height:9px;border-radius:50%"></i><i style="left:31px;top:6px;width:9px;height:9px;border-radius:50%"></i>',
      grid: '<i style="left:5px;top:4px;width:11px;height:6px"></i><i style="left:18px;top:4px;width:11px;height:6px"></i><i style="left:31px;top:4px;width:9px;height:6px"></i><i style="left:5px;top:12px;width:17px;height:6px"></i><i style="left:24px;top:12px;width:16px;height:6px"></i>',
      rows: '<i style="left:6px;top:4px;width:32px;height:3px"></i><i style="left:6px;top:10px;width:26px;height:3px"></i><i style="left:6px;top:16px;width:30px;height:3px"></i>',
      cta: '<i style="left:6px;top:5px;width:24px;height:4px"></i><i style="left:6px;top:12px;width:14px;height:6px;border-radius:3px;background:var(--ux-accent)"></i>',
      form: '<i style="left:6px;top:4px;width:32px;height:4px"></i><i style="left:6px;top:10px;width:32px;height:4px"></i><i style="left:6px;top:16px;width:14px;height:4px;background:var(--ux-accent)"></i>',
      quote: '<i style="left:6px;top:6px;width:9px;height:9px;border-radius:50%"></i><i style="left:18px;top:8px;width:20px;height:4px"></i>',
      dots: '<i style="left:6px;top:8px;width:8px;height:5px"></i><i style="left:17px;top:8px;width:8px;height:5px"></i><i style="left:28px;top:8px;width:8px;height:5px"></i>',
      play: '<i style="left:17px;top:5px;width:12px;height:12px;border-radius:50%;background:var(--ux-accent)"></i>',
      pin: '<i style="left:18px;top:4px;width:9px;height:9px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:var(--ux-accent)"></i><i style="left:8px;right:8px;top:17px;height:2px"></i>'
    };
    return m[v];
  }
  function enhanceSectionList() {
    var ol = $('#section-list'); if (!ol) return;
    $$('.section-item', ol).forEach(function (li) {
      if (li.querySelector('.edl-mini')) return;
      var mini = el('span', 'edl-mini', wfHtml(li.dataset.key)); mini.setAttribute('aria-hidden', 'true');
      var grip = li.querySelector('.grip'); li.insertBefore(mini, grip ? grip.nextSibling : li.firstChild);
      li.setAttribute('data-wf', WFV[li.dataset.key] || 'text');
    });
    var box = $('#layout-box'); if (!box) return;
    var st = $('.edl-stat', box);
    if (!st) {
      st = el('div', 'edl-stat', '<b class="edl-ct"></b><span class="edl-sv" role="status"></span>');
      var hint = $('.hint', box); if (hint) hint.parentNode.insertBefore(st, hint.nextSibling); else box.insertBefore(st, ol);
    }
    var a = api(), n = $$('.section-item:not(.is-hidden)', ol).length;
    $('.edl-ct', st).textContent = n + ' phần đang hiển thị';
    if (!$('.edl-sv', st).textContent) $('.edl-sv', st).textContent = 'Đã lưu';
  }
  function enhanceBlockLib() {
    var box = $('#block-lib'); if (!box) return;
    var host = box.parentNode, st = $('.edl-stat', host);
    $$('.block-card', box).forEach(function (c) { var sm = c.querySelector('small'); if (sm) c.title = sm.textContent; });
    var cards = $$('.block-card', box), on = cards.filter(function (c) { return c.classList.contains('is-on'); }).length;
    if (!st && cards.length) { st = el('div', 'edl-stat', '<b class="edl-ct"></b><span class="edl-sv" role="status">Đã lưu</span>'); host.insertBefore(st, box); }
    if (st) $('.edl-ct', st).textContent = on + ' / ' + cards.length + ' khối đang dùng';
  }
  function blinkSaved() {
    $$('.edl-sv').forEach(function (s) { s.textContent = 'Đã lưu'; s.classList.remove('is-blink'); void s.offsetWidth; if (!reduced()) s.classList.add('is-blink'); });
  }
  function hookSaved() {
    if (!EP.ux || EP.ux._edlSaved) return;
    EP.ux._edlSaved = 1;
    var base = EP.ux.saved;
    if (typeof base === 'function') EP.ux.saved = function () { var r = base.apply(this, arguments); blinkSaved(); return r; };
  }

  // ======================================================================================
  // 6. Bảng màu trộn (Lucian 266 palette generator, MIT © 2026 Seokwoooo)
  //    Năm cột màu, khoá từng màu, "Trộn màu" làm cả dãy đổi theo làn sóng; chọn xong áp thẳng làm màu chính + màu nhấn của trang.
  // ======================================================================================
  var pg = { P: null, lock: [false, false, false, false, false], sig: '' };
  function hsl(h, s, l) { s /= 100; l /= 100; var a = s * Math.min(l, 1 - l), f = function (n) { var k = (n + h / 30) % 12, c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); return Math.round(c * 255).toString(16).padStart(2, '0'); }; return ('#' + f(0) + f(8) + f(4)).toUpperCase(); }
  function lum(hex) { var n = parseInt(hex.slice(1), 16), c = [n >> 16 & 255, n >> 8 & 255, n & 255].map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; }
  function hex6(v) { v = String(v || '').trim(); if (/^#[0-9a-f]{3}$/i.test(v)) v = '#' + v[1] + v[1] + v[2] + v[2] + v[3] + v[3]; return /^#[0-9a-f]{6}$/i.test(v) ? v.toUpperCase() : ''; }
  function mix(a, b, t) { var x = parseInt(a.slice(1), 16), y = parseInt(b.slice(1), 16), o = ''; [16, 8, 0].forEach(function (s) { var u = x >> s & 255, w = y >> s & 255; o += Math.round(u + (w - u) * t).toString(16).padStart(2, '0'); }); return ('#' + o).toUpperCase(); }
  function pageColors() {
    var land = $('#landing'), cs = land ? getComputedStyle(land) : null;
    return { primary: hex6(cs && cs.getPropertyValue('--lp-primary')) || '#1E2A78', accent: hex6(cs && cs.getPropertyValue('--lp-accent')) || '#E5396E' };
  }
  function scheme() {
    var h = Math.random() * 360, mode = Math.floor(Math.random() * 3), off = mode === 0 ? 25 : mode === 1 ? 180 : 140;
    return [hsl(h, 45, 94), hsl(h + off * 0.3, 55, 78), hsl(h + off * 0.6, 62, 58), hsl(h + off, 58, 42), hsl(h + off * 0.5, 40, 18)];
  }
  function currentP() {
    var c = pageColors();
    if (pg.P && pg.P[3] === c.primary && pg.P[2] === c.accent) return pg.P;
    pg.P = [mix(c.primary, '#FFFFFF', 0.92), mix(c.accent, '#FFFFFF', 0.6), c.accent, c.primary, mix(c.primary, '#000000', 0.55)];
    return pg.P;
  }
  function pgPaint(root_, i) {
    var P = pg.P, c = $$('.edl-pg-cl', root_)[i], hex = P[i], t = lum(hex) > 0.35 ? '#1A1A1A' : '#FFFFFF';
    c.style.setProperty('--c', hex); c.style.setProperty('--t', t); $('code', c).textContent = hex;
    var lk = $('.edl-pg-lk', c); lk.setAttribute('aria-pressed', String(pg.lock[i]));
    lk.setAttribute('aria-label', hex + (pg.lock[i] ? ' — bỏ khoá' : ' — khoá màu này'));
    lk.innerHTML = pg.lock[i] ? ico('<rect x="5" y="10.5" width="14" height="9.5" rx="2.5" fill="currentColor"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none"/>') : ico('<rect x="5" y="10.5" width="14" height="9.5" rx="2.5" fill="currentColor"/><path d="M8 10.5V8a4 4 0 0 1 7.6-1.7" fill="none"/>');
    $('.edl-pg-cp', c).setAttribute('aria-label', 'Sao chép ' + hex);
    root_.style.setProperty('--p' + i, hex);
  }
  function enhancePalette() {
    var box = $('#style-panel'); if (!box || $('.edl-pg', box)) return;
    var pals = $('.palettes', box); if (!pals) return;
    var wrap = el('div', 'edl-pg');
    wrap.innerHTML = '<div class="edl-pg-cs"></div><div class="edl-pg-tb"><button type="button" class="edl-pg-sh">' +
      ico('<path d="M3 7.5h3.2c2.8 0 4.4 1.6 5.8 4.5s3 4.5 5.8 4.5H21M3 16.5h3.2c1.6 0 2.7-.5 3.6-1.4M14.6 8.6c.9-.7 1.9-1.1 3.2-1.1H21M18.5 4.5L21.5 7.5l-3 3M18.5 13.5l3 3-3 3"/>') + 'Trộn màu</button><span class="edl-pg-note">Màu chính + màu nhấn áp ngay vào trang</span></div>' +
      '<div class="edl-pg-pv" aria-hidden="true"><i></i><div><small>Xem trước</small><b>Giữ chỗ ngay hôm nay</b></div><span>Đăng ký</span></div><div class="edl-pg-tt" role="status"></div>';
    var P = currentP(), cs = $('.edl-pg-cs', wrap), tt = $('.edl-pg-tt', wrap);
    P.forEach(function (c, i) {
      var col = el('div', 'edl-pg-cl');
      col.innerHTML = '<button type="button" class="edl-pg-cp"><code></code></button><button type="button" class="edl-pg-lk"></button>';
      $('.edl-pg-lk', col).addEventListener('click', function () { pg.lock[i] = !pg.lock[i]; pgPaint(wrap, i); });
      $('.edl-pg-cp', col).addEventListener('click', function () {
        copy(pg.P[i]); tt.textContent = 'Đã sao chép ' + pg.P[i]; tt.classList.remove('is-on'); void tt.offsetWidth; tt.classList.add('is-on');
        clearTimeout(tt._t); tt._t = setTimeout(function () { tt.classList.remove('is-on'); }, 1400);
      });
      cs.appendChild(col);
    });
    pals.parentNode.insertBefore(wrap, pals);
    P.forEach(function (c, i) { pgPaint(wrap, i); });
    var sh = $('.edl-pg-sh', wrap);
    sh.addEventListener('click', function () {
      var n = scheme(), last = 0;
      // Hai màu đang áp vào trang (cột 3 = màu chính, cột 2 = màu nhấn) giữ nguyên nếu bị khoá
      sh.classList.remove('is-spin'); void sh.offsetWidth; if (!reduced()) sh.classList.add('is-spin');
      var next = pg.P.slice();
      n.forEach(function (hex, i) { if (!pg.lock[i]) next[i] = hex; });
      n.forEach(function (hex, i) { if (pg.lock[i]) return; last = i; setTimeout(function () { pg.P[i] = hex; if (wrap.isConnected) pgPaint(wrap, i); }, reduced() ? 0 : i * 70); });
      setTimeout(function () {
        pg.P = next; pg.refocus = true;
        if (api()) api().patchStyle({ primary: next[3], accent: next[2], freeColors: false });
      }, reduced() ? 0 : last * 70 + 180);
    });
    if (pg.refocus) { pg.refocus = false; sh.focus({ preventScroll: true }); }
    wrap.tabIndex = -1;
    wrap.addEventListener('keydown', function (e) { if (e.key === ' ' && e.target === wrap) { e.preventDefault(); sh.click(); } });
  }

  // ======================================================================================
  // 7. Cặp font + tỉ lệ cỡ chữ (Lucian 303 font pairing, MIT © 2026 Seokwoooo)
  //    Bốn cặp font dựng sẵn + bốn tỉ lệ; xem trước ngay bằng tiêu đề thật của trang, mờ rồi rõ khi đổi; thước cỡ chữ bên cạnh.
  // ======================================================================================
  var FP = [
    { n: 'Hiện đại', h: 'montserrat', b: 'be-vietnam', w: 800 },
    { n: 'Biên tập', h: 'playfair', b: 'be-vietnam', w: 700 },
    { n: 'Công nghệ', h: 'lexend', b: 'inter', w: 700 },
    { n: 'Cổ điển', h: 'lora', b: 'lora', w: 700 }
  ];
  var FS = [[1.125, 34, 20], [1.25, 40, 24], [1.333, 46, 28], [1.5, 54, 32]];
  function enhanceFonts() {
    var box = $('#style-panel'); if (!box || $('.edl-fp', box) || !EP.pageStyle) return;
    var lab = $$('.st-label', box).filter(function (l) { return /^Font tiêu đề/.test(l.textContent.trim()); })[0];
    if (!lab) return;
    var anchor = lab.closest('.st-row') || lab.parentNode;
    var PS = EP.pageStyle, st = api() ? api().getStyle() : {}, F = PS.FONTS;
    var w = el('div', 'edl-fp');
    var headline = ($('#landing .lp-headline') || {}).textContent || 'Tiêu đề trang của bạn';
    w.innerHTML = '<div class="edl-fp-ps" role="radiogroup" aria-label="Cặp font"></div><div class="edl-fp-sr" role="radiogroup" aria-label="Tỉ lệ cỡ chữ"><span>Tỉ lệ cỡ chữ</span></div>' +
      '<div class="edl-fp-pv"><div class="edl-fp-tx"><h3></h3><p></p></div><div class="edl-fp-rl" aria-hidden="true"></div></div>' +
      '<div class="edl-fp-ft"><code></code><button type="button" class="edl-fp-cp">Sao chép CSS</button></div>';
    var ps = $('.edl-fp-ps', w), sr = $('.edl-fp-sr', w), tx = $('.edl-fp-tx', w), rl = $('.edl-fp-rl', w), cs = $('code', w), cp = $('.edl-fp-cp', w);
    $('h3', w).textContent = headline.length > 46 ? headline.slice(0, 44) + '…' : headline;
    $('p', w).textContent = 'Đăng ký trước để giữ chỗ — số lượng có hạn.';
    var cur = -1; FP.forEach(function (p, i) { if (st.headingFont === p.h && st.bodyFont === p.b) cur = i; });
    var sc = -1; FS.forEach(function (s, i) { if (st.h1Size === s[1]) sc = i; });
    function fam(k) { var f = F[k]; return f ? "'" + f.google + "', " + f.fallback : 'system-ui, sans-serif'; }
    FP.forEach(function (p) { if (F[p.h]) PS.loadFont(F[p.h]); if (F[p.b]) PS.loadFont(F[p.b]); });
    var P = FP.map(function (p, i) {
      var b = el('button', 'edl-fp-pr', '<b>Aa</b><span></span>'); b.type = 'button'; b.setAttribute('role', 'radio');
      b.firstChild.style.fontFamily = fam(p.h); b.firstChild.style.fontWeight = p.w; b.lastChild.textContent = p.n;
      b.addEventListener('click', function () { choose(i, sc); });
      ps.appendChild(b); return b;
    });
    var S = FS.map(function (s, i) {
      var b = el('button', 'edl-fp-sc'); b.type = 'button'; b.setAttribute('role', 'radio'); b.textContent = s[0];
      b.addEventListener('click', function () { choose(cur, i); }); sr.appendChild(b); return b;
    });
    var R = ['h1', 'h2', 'p'].map(function () { var s = el('span', null, '<i></i><em></em>'); rl.appendChild(s); return s; });
    function sync() {
      var p = FP[cur < 0 ? 0 : cur], s = FS[sc < 0 ? 1 : sc];
      w.style.setProperty('--hf', fam(p.h)); w.style.setProperty('--hw', p.w); w.style.setProperty('--bf', fam(p.b)); w.style.setProperty('--r', s[0]);
      P.forEach(function (b, i) { b.setAttribute('aria-checked', String(i === cur)); });
      S.forEach(function (b, i) { b.setAttribute('aria-checked', String(i === sc)); });
      [s[1], s[2], PS.OPTIONS && 16].forEach(function (px, i) { R[i].querySelector('i').style.width = Math.min(30, px * 0.6) + 'px'; R[i].querySelector('em').textContent = px; });
      cs.textContent = '--font-head: ' + (F[p.h] ? F[p.h].google : p.h) + '; --scale: ' + s[0] + ';';
    }
    function choose(pi, si) {
      var p = FP[pi < 0 ? 0 : pi], s = FS[si < 0 ? 1 : si];
      if (pi === cur && si === sc) return;
      cur = pi < 0 ? 0 : pi; sc = si < 0 ? 1 : si;
      var go = function () { sync(); tx.classList.remove('is-sw'); if (api()) api().patchStyle({ headingFont: p.h, headingFontCustom: '', bodyFont: p.b, bodyFontCustom: '', headingWeight: p.w, h1Size: s[1], h2Size: s[2] }); };
      if (reduced()) { go(); return; }
      tx.classList.add('is-sw'); setTimeout(go, 190);
    }
    cp.addEventListener('click', function () {
      var p = FP[cur < 0 ? 0 : cur], s = FS[sc < 0 ? 1 : sc];
      copy(':root {\n  --font-head: ' + (F[p.h] ? F[p.h].google : p.h) + ';\n  --font-body: ' + (F[p.b] ? F[p.b].google : p.b) + ';\n  --scale: ' + s[0] + ';\n}');
      cp.classList.add('is-ok'); cp.textContent = 'Đã sao chép'; clearTimeout(cp._t); cp._t = setTimeout(function () { cp.classList.remove('is-ok'); cp.textContent = 'Sao chép CSS'; }, 1500);
    });
    sync();
    anchor.parentNode.insertBefore(w, anchor);
  }

  // ======================================================================================
  // 8. Xem trước SEO (Lucian 249 SEO preview, MIT © 2026 Seokwoooo)
  //    Hai thẻ xem trước đổi qua tab (Google / chia sẻ); thanh đo độ dài đổi xanh – vàng – đỏ theo chữ đang dùng.
  // ======================================================================================
  var SEOMAX = { title: 60, desc: 160 };
  function seoBar(countEl, text, max) {
    if (!countEl) return;
    var b = countEl.nextElementSibling;
    if (!b || !b.classList.contains('edl-br')) { b = el('div', 'edl-br', '<i></i>'); b.setAttribute('aria-hidden', 'true'); countEl.parentNode.insertBefore(b, countEl.nextSibling); }
    var n = (text || '').length, p = n / max, i = b.firstChild;
    i.style.width = Math.min(100, p * 100) + '%'; i.classList.toggle('is-mid', p > 0.85 && p <= 1); i.classList.toggle('is-over', p > 1);
    var tag = countEl.parentNode.querySelector('.edl-len');
    if (!tag) { tag = el('span', 'edl-len'); var lab = countEl.parentNode.querySelector('label'); if (lab) lab.appendChild(tag); }
    tag.textContent = n + ' / ' + max; tag.classList.toggle('is-over', p > 1);
  }
  function syncSeo() {
    seoBar($('#seo-title-count'), ($('#serp-title') || {}).textContent, SEOMAX.title);
    seoBar($('#seo-desc-count'), ($('#serp-desc') || {}).textContent, SEOMAX.desc);
  }
  function enhanceSeo() {
    var pv = $('#side-publish .seo-prev'); if (!pv || $('.edl-tl', pv)) return;
    var tl = el('div', 'edl-tl'); tl.setAttribute('role', 'tablist'); tl.setAttribute('aria-label', 'Loại xem trước');
    var T = ['Kết quả Google', 'Chia sẻ Zalo / Facebook'].map(function (n, i) {
      var b = el('button', 'edl-tb'); b.type = 'button'; b.setAttribute('role', 'tab'); b.textContent = n;
      b.addEventListener('click', function () { tab(i); });
      b.addEventListener('keydown', function (e) { var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (d) { e.preventDefault(); tab((i + d + 2) % 2, true); } });
      tl.appendChild(b); return b;
    });
    function tab(i, focus) {
      pv.classList.toggle('is-og', i === 1);
      T.forEach(function (b, k) { b.setAttribute('aria-selected', String(k === i)); b.tabIndex = k === i ? 0 : -1; });
      if (focus) T[i].focus();
    }
    pv.insertBefore(tl, pv.firstChild); tab(0);
    ['#serp-title', '#serp-desc'].forEach(function (s) { var n = $(s); if (n && root.MutationObserver) new MutationObserver(syncSeo).observe(n, { childList: true, characterData: true, subtree: true }); });
    syncSeo();
  }

  // ======================================================================================
  // 9. Kiểm tra trang (Lucian 287 page speed audit, MIT © 2026 Seokwoooo)
  //    Bốn vòng điểm (SEO, chia sẻ, ảnh, bố cục) vẽ dần + đếm số; thước đo chạy tới vị trí; khung phim là các phần đang có trên trang.
  // ======================================================================================
  var au = { gen: 0 };
  function audit() {
    var a = api(), s = a && a.getState(); if (!s) return null;
    var seo = EP.seo ? EP.seo.resolve(s.event, s.content) : { title: '', description: '', ogTitle: '', ogDescription: '' }, ev = s.event, so = ev.seo || {};
    var tl = (seo.title || '').length, dl = (seo.description || '').length;
    var seoScore = (tl >= 30 && tl <= 60 ? 50 : tl >= 15 && tl <= 70 ? 30 : 10) + (dl >= 70 && dl <= 160 ? 40 : dl >= 40 && dl <= 180 ? 25 : 8) + (so.noindex ? 0 : 10);
    var share = (so.image ? 50 : 25) + ((seo.ogTitle || '').length >= 20 ? 25 : 12) + ((seo.ogDescription || '').length >= 50 ? 25 : 12);
    var imgs = $$('#landing img'), withAlt = imgs.filter(function (i) { return (i.getAttribute('alt') || '').trim().length > 0; }).length;
    var imgScore = imgs.length ? Math.round(withAlt / imgs.length * 100) : 100;
    var vis = a.sections().filter(function (x) { return x.visible; });
    var lay = Math.min(100, 40 + vis.length * 8);
    return { cats: [['SEO', Math.min(100, seoScore)], ['Chia sẻ', Math.min(100, share)], ['Ảnh', imgScore], ['Bố cục', lay]],
      meters: [['Tiêu đề SEO', tl + ' ký tự', Math.min(1, tl / 60), tl < 30 || tl > 60], ['Mô tả SEO', dl + ' ký tự', Math.min(1, dl / 160), dl < 70 || dl > 160], ['Số phần trên trang', vis.length + ' phần', Math.min(1, vis.length / 14), vis.length < 5]],
      frames: vis.map(function (x) { return x.label; }) };
  }
  function auCol(v) { return v >= 90 ? 'var(--success)' : v >= 50 ? 'var(--warn)' : 'var(--danger)'; }
  function enhanceAudit() {
    var side = $('#side-publish'); if (!side || $('.edl-au', side)) return;
    var w = el('section', 'edl-au'); w.setAttribute('aria-label', 'Kiểm tra trang');
    w.innerHTML = '<div class="edl-au-sc"></div><div class="edl-au-fs" aria-hidden="true"><div class="edl-au-fr"></div></div><div class="edl-au-mt"></div><button type="button" class="edl-au-go">Kiểm tra trang</button>';
    side.insertBefore(w, side.firstChild);
    var go = $('.edl-au-go', w);
    go.addEventListener('click', function () { auRun(w); });
    if ('IntersectionObserver' in root) { var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting && ready()) { io.disconnect(); auRun(w); } }); io.observe(w); }
  }
  function auRun(w) {
    var d = audit(), go = $('.edl-au-go', w); if (!d) return;
    var g = ++au.gen, sc = $('.edl-au-sc', w), fr = $('.edl-au-fr', w), mt = $('.edl-au-mt', w), rm = reduced();
    function later(ms, fn) { setTimeout(function () { if (g === au.gen && w.isConnected) fn(); }, rm ? 0 : ms); }
    go.disabled = true; go.textContent = 'Đang kiểm tra…';
    sc.innerHTML = ''; fr.innerHTML = ''; mt.innerHTML = '';
    var R = d.cats.map(function (c) {
      var n = el('div', 'edl-au-c'); n.setAttribute('role', 'img'); n.setAttribute('aria-label', c[0] + ' ' + c[1] + ' điểm'); n.style.setProperty('--c', auCol(c[1]));
      n.innerHTML = '<div class="edl-au-rg"><svg viewBox="0 0 54 54" aria-hidden="true"><circle class="t" cx="27" cy="27" r="23"/><circle class="f" cx="27" cy="27" r="23"/></svg><b>0</b></div><small></small>';
      $('small', n).textContent = c[0]; sc.appendChild(n); return { f: $('.f', n), b: $('b', n), v: c[1] };
    });
    var F = d.frames.slice(0, 8).map(function (name, i) {
      var f = el('div', 'edl-au-fm', '<i style="top:5px;height:4px;width:40%"></i><i style="top:13px;height:3px"></i><i style="top:19px;height:3px;right:12px"></i><span></span>');
      $('span', f).textContent = name; fr.appendChild(f); return f;
    });
    var M = d.meters.map(function (m) {
      var r = el('div', 'edl-au-m', '<span></span><div class="edl-au-br"><i></i></div><b></b>');
      $('span', r).textContent = m[0]; $('b', r).textContent = m[1]; r.style.setProperty('--c', m[3] ? 'var(--warn)' : 'var(--success)');
      mt.appendChild(r); return { i: $('i', r), p: m[2] };
    });
    F.forEach(function (f, i) { later(150 + i * 120, function () { f.classList.add('is-on'); }); });
    later(250 + F.length * 100, function () {
      var t0 = performance.now();
      R.forEach(function (r, k) { r.f.style.transition = rm ? 'none' : 'stroke-dashoffset 1.1s cubic-bezier(.3,.9,.3,1) ' + (k * 0.1) + 's'; r.f.style.strokeDashoffset = (144.5 * (1 - r.v / 100)).toFixed(1); });
      (function f(now) { if (g !== au.gen) return; var q = rm ? 1 : Math.min(1, (now - t0) / 1200), e = 1 - Math.pow(1 - q, 3); R.forEach(function (r) { r.b.textContent = Math.round(r.v * e); }); if (q < 1) root.requestAnimationFrame(f); })(t0);
      M.forEach(function (m) { m.i.style.left = (m.p * 100) + '%'; });
      go.disabled = false; go.textContent = 'Kiểm tra lại';
    });
  }

  // ======================================================================================
  // 10. Nhãn chọn trên trang (Lucian 297 block page builder — thẻ nhãn "small" của khối, MIT © 2026 Seokwoooo)
  //     Phần tử đang chọn/rê có thẻ nhãn ghim góc trên trái viền; theo cuộn và thu phóng.
  // ======================================================================================
  var tagSel = null, tagHov = null, tagRaf = 0;
  function placeTag(tag, node, cls) {
    var wrap = $('#view-editor .preview-wrap');
    if (!node || !wrap) { tag.hidden = true; return; }
    var r = node.getBoundingClientRect(), w = wrap.getBoundingClientRect(), topLimit = w.top + (ruler ? ruler.root.offsetHeight : 0) - 16;
    if (r.bottom < topLimit + 10 || r.top > w.bottom || r.right < w.left || r.left > w.right) { tag.hidden = true; return; }
    tag.hidden = false; tag.textContent = node.getAttribute('data-el-label') || '';
    if (!tag.textContent) { tag.hidden = true; return; }
    tag.style.left = Math.max(w.left + 4, Math.min(r.left + 8, w.right - 40)) + 'px';
    tag.style.top = Math.max(topLimit + 2, r.top - 1) + 'px';
  }
  function updateTags() {
    tagRaf = 0;
    var land = $('#landing'); if (!land || !editorOpen()) { if (tagSel) tagSel.hidden = true; if (tagHov) tagHov.hidden = true; return; }
    var sel = $('.lp-selected', land), hov = $('.lp-hovered:not(.lp-selected)', land);
    placeTag(tagSel, sel); placeTag(tagHov, hov);
  }
  function schedTags() { if (!tagRaf) tagRaf = root.requestAnimationFrame(updateTags); }
  function buildTags() {
    var land = $('#landing'); if (!land || tagSel) return;
    tagSel = el('div', 'edl-tag is-sel'); tagHov = el('div', 'edl-tag is-hov');
    tagSel.hidden = tagHov.hidden = true; tagSel.setAttribute('aria-hidden', 'true'); tagHov.setAttribute('aria-hidden', 'true');
    doc.body.appendChild(tagSel); doc.body.appendChild(tagHov);
    if (root.MutationObserver) new MutationObserver(schedTags).observe(land, { attributes: true, attributeFilter: ['class'], subtree: true, childList: true });
    var wrap = $('#view-editor .preview-wrap'); if (wrap) wrap.addEventListener('scroll', schedTags, { passive: true });
    root.addEventListener('resize', schedTags); root.addEventListener('scroll', schedTags, true);
  }

  // ======================================================================================
  // Khởi động
  // ======================================================================================
  function enhanceAll() {
    enhanceSectionList(); enhanceBlockLib(); enhancePalette(); enhanceFonts();
    enhanceSeo(); enhanceAudit(); syncRuler(); syncRail();
  }
  function init() {
    if (!$('#view-editor')) return;
    doc.documentElement.classList.add('edl');
    buildRuler(); enhanceDevices(); buildPalPill(); bindContext(); buildTags(); hookSaved();
    var late = function () { buildRail(); enhanceAll(); };
    // workspace.js dựng panel sau khi app.js khởi động: chờ rồi gắn
    var tries = 0, t = setInterval(function () {
      tries++;
      if (EP.workspace && $('.ws-group') && $('#style-panel') && api()) { clearInterval(t); late(); wire(); }
      else if (tries > 80) clearInterval(t);
    }, 100);
  }
  function wire() {
    ['#section-list', '#block-lib', '#style-panel', '#layer-tree'].forEach(function (s) {
      var n = $(s); if (!n || !root.MutationObserver) return;
      var tm = 0;
      new MutationObserver(function () { clearTimeout(tm); tm = setTimeout(enhanceAll, 0); }).observe(n, { childList: true, subtree: s === '#style-panel' });
    });
    var land = $('#landing');
    if (land && root.MutationObserver) new MutationObserver(function () { clearTimeout(land._t); land._t = setTimeout(function () { enhanceAll(); }, 60); }).observe(land, { childList: true });
    ED.refresh = enhanceAll;
    var v = $('#view-editor');
    if (v && root.MutationObserver) new MutationObserver(function () { if (!v.hidden) { setTimeout(function () { enhanceAll(); syncRuler(); schedTags(); }, 60); } }).observe(v, { attributes: true, attributeFilter: ['hidden'] });
    doc.addEventListener('click', blinkOnChange, true);
  }
  function blinkOnChange() { /* chỗ móc dự phòng; "Đã lưu" nháy qua EP.ux.saved */ }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init); else init();
})(typeof window !== 'undefined' ? window : globalThis);
