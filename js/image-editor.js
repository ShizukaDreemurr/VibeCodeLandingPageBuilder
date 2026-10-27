/*
 * image-editor.js — trình chỉnh ảnh: xoay tuỳ ý, cắt tuỳ ý, thu phóng, sáng/tương phản/bão hoà, lật.
 * EP.imageEditor.open({ src, aspect, title, alpha, slot }) → Promise<dataUrl | null>  (null = huỷ)
 *
 * Mô hình: "sân khấu" (stage) có kích thước bằng ảnh gốc (đổi chiều khi xoay gần 90°/270°). Ảnh được xoay/phóng quanh tâm
 * sân khấu, khung cắt luôn thẳng trục và nằm trong sân khấu; toạ độ X/Y/Rộng/Cao là px của sân khấu (= px ảnh gốc ở mức 100%).
 * Vùng ảnh không phủ tới được tô trắng (hoặc trong suốt với logo). Xem trước vẽ lại trong requestAnimationFrame.
 */
(function (root) {
  var MIN_CROP = 16;
  var PRESETS = [['Tự do', null], ['1:1', 1], ['4:3', 4 / 3], ['16:9', 16 / 9], ['3:4', 3 / 4]];
  var HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
  var HDIR = { nw: [-1, -1], n: [0, -1], ne: [1, -1], e: [1, 0], se: [1, 1], s: [0, 1], sw: [-1, 1], w: [-1, 0] };
  var HAS_FILTER = (function () { try { return 'filter' in document.createElement('canvas').getContext('2d'); } catch (e) { return false; } })();
  var busy = false;

  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function motionOff() { return document.documentElement.classList.contains('motion-off') || (root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches); }
  function wrap180(d) { return ((((d + 180) % 360) + 360) % 360) - 180; }

  // Ảnh nguồn → canvas: ảnh quá lớn thì thu về ≤ 2400px; SVG (ảnh mẫu) vẽ ở ~1600px cho nét
  function rasterize(img, src) {
    var w = img.naturalWidth || 1600, h = img.naturalHeight || 900;
    var long = Math.max(w, h), s = 1;
    if (/\.svg(\?|#|$)|^data:image\/svg/i.test(src)) s = 1600 / long; else if (long > 2400) s = 2400 / long;
    var c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(w * s)); c.height = Math.max(1, Math.round(h * s));
    var x = c.getContext('2d');
    x.imageSmoothingQuality = 'high';
    x.drawImage(img, 0, 0, c.width, c.height);
    return c;
  }

  function open(opts) {
    opts = opts || {};
    if (busy) return Promise.resolve(null);
    busy = true;
    var loader = root.EP.images.load(opts.src);
    return loader.then(function (img) {
      return new Promise(function (resolve, reject) { run(rasterize(img, opts.src), opts, resolve, reject); });
    }).then(function (v) { busy = false; return v; }, function (e) { busy = false; throw e; });
  }

  function run(base, opts, resolve, reject) {
    var cfg = opts.slot && typeof opts.slot === 'object' ? opts.slot : (root.EP.images.SLOTS[opts.slot] || root.EP.images.SLOTS.hero);
    var alpha = !!(opts.alpha || cfg.alpha);
    var S = { rot: 0, zoom: 1, b: 0, c: 0, s: 0, fx: false, fy: false, aspect: opts.aspect || null, crop: { x: 0, y: 0, w: 1, h: 1 } };
    var SW = base.width, SH = base.height;   // kích thước sân khấu hiện tại
    var k = 1;                                // px màn hình / px sân khấu
    var dirtyImg = true, dirtyBox = true, dirtyFields = true, glide = false, rafId = 0, tweenId = 0, done = false;
    var opener = document.activeElement;

    // ---------- Dựng giao diện ----------
    var dlg = el('dialog', 'tpl-dialog ie-dialog');
    dlg.setAttribute('aria-labelledby', 'ie-title');
    var head = el('div', 'tpl-dialog-head');
    var h2 = el('h2', null, opts.title || 'Chỉnh ảnh'); h2.id = 'ie-title';
    var xBtn = el('button', 'icon-btn'); xBtn.type = 'button'; xBtn.setAttribute('aria-label', 'Đóng, không áp dụng');
    xBtn.innerHTML = root.EP.icon('x');
    head.appendChild(h2); head.appendChild(xBtn);

    var body = el('div', 'ie-body');
    // Khu xem trước
    var left = el('div', 'ie-left');
    var wrapEl = el('div', 'ie-stage-wrap');
    var stage = el('div', 'ie-stage' + (alpha ? ' is-alpha' : ''));
    stage.tabIndex = 0;
    stage.setAttribute('role', 'application');
    stage.setAttribute('aria-label', 'Vùng chỉnh ảnh. Mũi tên để dịch khung cắt, giữ Shift để dịch 10px, cuộn chuột để thu phóng.');
    var canvas = el('canvas', 'ie-canvas');
    var box = el('div', 'ie-crop');
    box.appendChild(el('span', 'ie-grid'));
    HANDLES.forEach(function (n) { var hd = el('span', 'ie-h ie-h-' + n); hd.setAttribute('data-h', n); box.appendChild(hd); });
    var tag = el('span', 'ie-size'); tag.setAttribute('aria-hidden', 'true'); box.appendChild(tag);
    stage.appendChild(canvas); stage.appendChild(box);
    wrapEl.appendChild(stage);
    left.appendChild(wrapEl);
    left.appendChild(el('p', 'ie-tip', 'Kéo khung để di chuyển, kéo 8 chấm để đổi cỡ. Cuộn chuột hoặc chụm hai ngón để thu phóng.'));

    // Bảng điều khiển
    var side = el('div', 'ie-side');
    var cidx = 0;
    function group(title) { var g = el('section', 'ie-group'); g.style.setProperty('--i', cidx++); g.appendChild(el('h3', null, title)); side.appendChild(g); return g; }

    // Tỉ lệ khung
    var gAsp = group('Tỉ lệ khung cắt');
    var chips = el('div', 'ie-chips'); chips.setAttribute('role', 'group'); chips.setAttribute('aria-label', 'Tỉ lệ khung cắt');
    var chipBtns = PRESETS.map(function (p) {
      var b = el('button', 'ie-chip', p[0]); b.type = 'button';
      b.addEventListener('click', function () { setAspect(p[1], true); });
      chips.appendChild(b); return b;
    });
    gAsp.appendChild(chips);

    // Ô nhập số
    function numInput(id, label, min, max, step, onValue) {
      var n = el('input', 'ie-num'); n.type = 'number'; n.id = id; n.min = min; n.max = max; n.step = step;
      n.setAttribute('aria-label', label); n.inputMode = 'decimal';
      n.addEventListener('input', function () {
        var v = parseFloat(n.value);
        if (isFinite(v)) onValue(clamp(v, min, max), false);
      });
      n.addEventListener('change', function () {
        var v = parseFloat(n.value);
        if (isFinite(v)) onValue(clamp(v, min, max), true);
        dirtyFields = true; schedule();
      });
      n.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); var v = parseFloat(n.value); if (isFinite(v)) onValue(clamp(v, min, max), true); n.blur(); dirtyFields = true; schedule(); }
      });
      return n;
    }

    // Khung cắt: X, Y, Rộng, Cao
    var gCrop = group('Khung cắt (px)');
    var cgrid = el('div', 'ie-fields');
    var cropFields = {};
    [['x', 'X'], ['y', 'Y'], ['w', 'Rộng'], ['h', 'Cao']].forEach(function (f) {
      var lab = el('label', 'ie-field'); lab.appendChild(el('span', null, f[1]));
      var inp = numInput('ie-crop-' + f[0], 'Khung cắt – ' + f[1] + ' (px)', 0, 99999, 1, function (v, commit) { setCropField(f[0], v); });
      cropFields[f[0]] = inp; lab.appendChild(inp); cgrid.appendChild(lab);
    });
    gCrop.appendChild(cgrid);

    // Thanh trượt + ô số đồng bộ
    var sliders = {};
    function slider(g, id, label, min, max, step, unit, get, set) {
      var row = el('div', 'ie-row');
      var lab = el('label', 'ie-lab', label); lab.setAttribute('for', 'ie-' + id);
      var r = el('input', 'ie-range'); r.type = 'range'; r.id = 'ie-' + id; r.min = min; r.max = max; r.step = step; r.value = get();
      r.setAttribute('aria-label', label);
      var n = numInput('ie-' + id + '-num', label + ' – nhập số', min, max, step, function (v, commit) { r.value = v; set(v); if (commit) n.value = v; });
      r.addEventListener('input', function () { var v = parseFloat(r.value); set(v); if (document.activeElement !== n) n.value = fmt(v); else n.value = fmt(v); });
      var u = el('span', 'ie-unit', unit);
      row.appendChild(lab); row.appendChild(r); row.appendChild(n); row.appendChild(u);
      g.appendChild(row);
      sliders[id] = { sync: function () { var v = get(); r.value = v; if (document.activeElement !== n) n.value = fmt(v); } };
      sliders[id].sync();
      return row;
    }
    function fmt(v) { return String(Math.round(v)); }

    var gRot = group('Xoay và thu phóng');
    slider(gRot, 'rot', 'Xoay', -180, 180, 1, '°', function () { return Math.round(wrap180Soft(S.rot)); }, function (v) { cancelTween(); setRot(v); });
    var rotBtns = el('div', 'ie-btnrow');
    var bL = el('button', 'btn btn-ghost btn-small', '↺ −90°'); bL.type = 'button'; bL.setAttribute('aria-label', 'Xoay trái 90 độ');
    var bR = el('button', 'btn btn-ghost btn-small', '↻ +90°'); bR.type = 'button'; bR.setAttribute('aria-label', 'Xoay phải 90 độ');
    bL.addEventListener('click', function () { tweenRot(-90); }); bR.addEventListener('click', function () { tweenRot(90); });
    rotBtns.appendChild(bL); rotBtns.appendChild(bR);
    gRot.appendChild(rotBtns);
    slider(gRot, 'zoom', 'Thu phóng', 100, 400, 1, '%', function () { return Math.round(S.zoom * 100); }, function (v) { setZoom(v / 100); });

    var gFlip = group('Lật ảnh');
    var flipRow = el('div', 'ie-btnrow');
    var bFx = el('button', 'btn btn-ghost btn-small', '⇋ Lật ngang'); bFx.type = 'button';
    var bFy = el('button', 'btn btn-ghost btn-small', '⇅ Lật dọc'); bFy.type = 'button';
    bFx.addEventListener('click', function () { S.fx = !S.fx; markImg(); });
    bFy.addEventListener('click', function () { S.fy = !S.fy; markImg(); });
    flipRow.appendChild(bFx); flipRow.appendChild(bFy); gFlip.appendChild(flipRow);

    var gCol = group('Màu sắc');
    slider(gCol, 'bright', 'Độ sáng', -100, 100, 1, '', function () { return S.b; }, function (v) { S.b = v; markImg(); });
    slider(gCol, 'contrast', 'Tương phản', -100, 100, 1, '', function () { return S.c; }, function (v) { S.c = v; markImg(); });
    slider(gCol, 'sat', 'Độ bão hoà', -100, 100, 1, '', function () { return S.s; }, function (v) { S.s = v; markImg(); });
    if (!HAS_FILTER) gCol.appendChild(el('p', 'hint', 'Trình duyệt này chưa hỗ trợ chỉnh màu trực tiếp; các thanh màu sẽ không có tác dụng.'));

    body.appendChild(left); body.appendChild(side);

    var foot = el('div', 'ie-foot');
    var bReset = el('button', 'btn btn-ghost', 'Đặt lại'); bReset.type = 'button';
    var spacer = el('span', 'ie-spacer');
    var bCancel = el('button', 'btn btn-ghost', 'Huỷ'); bCancel.type = 'button';
    var bOk = el('button', 'btn btn-primary', 'Áp dụng'); bOk.type = 'button';
    foot.appendChild(bReset); foot.appendChild(spacer); foot.appendChild(bCancel); foot.appendChild(bOk);

    dlg.appendChild(head); dlg.appendChild(body); dlg.appendChild(foot);
    document.body.appendChild(dlg);

    // ---------- Trạng thái ----------
    function wrap180Soft(d) { return d > 180 || d < -180 ? wrap180(d) : d; }
    function dims() { var odd = Math.abs(Math.round(S.rot / 90)) % 2 === 1; return odd ? [base.height, base.width] : [base.width, base.height]; }

    function fitCrop(aspect, cx, cy) {
      var w = SW, h = SH;
      if (aspect) { if (w / h > aspect) w = h * aspect; else h = w / aspect; }
      var x = clamp(cx - w / 2, 0, SW - w), y = clamp(cy - h / 2, 0, SH - h);
      return { x: x, y: y, w: w, h: h };
    }
    function normCrop() {
      var c = S.crop;
      c.w = clamp(c.w, Math.min(MIN_CROP, SW), SW); c.h = clamp(c.h, Math.min(MIN_CROP, SH), SH);
      c.x = clamp(c.x, 0, SW - c.w); c.y = clamp(c.y, 0, SH - c.h);
    }
    function markImg() { dirtyImg = true; dirtyFields = true; schedule(); }
    function markBox(g) { dirtyBox = true; dirtyFields = true; glide = !!g; schedule(); }

    function setRot(v) {
      S.rot = v;
      var d = dims();
      if (d[0] !== SW || d[1] !== SH) {
        // Đổi chiều sân khấu: giữ khung cắt theo tỉ lệ phần trăm
        var fx = d[0] / SW, fy = d[1] / SH, c = S.crop;
        S.crop = { x: c.x * fx, y: c.y * fy, w: c.w * fx, h: c.h * fy };
        SW = d[0]; SH = d[1];
        if (S.aspect) S.crop = fitCrop(S.aspect, S.crop.x + S.crop.w / 2, S.crop.y + S.crop.h / 2);
        normCrop();
        layout();
        markBox(false);
      }
      markImg();
    }
    function setZoom(z) { S.zoom = clamp(z, 1, 4); markImg(); }
    function cancelTween() { if (tweenId) { cancelAnimationFrame(tweenId); tweenId = 0; } }
    function tweenRot(delta) {
      cancelTween();
      var from = S.rot, to = from + delta;
      if (motionOff()) { setRot(wrap180(to)); return; }
      var t0 = performance.now(), dur = 260;
      (function step(now) {
        var t = clamp((now - t0) / dur, 0, 1), e = 1 - Math.pow(1 - t, 3);
        if (t < 1) { setRot(from + (to - from) * e); tweenId = requestAnimationFrame(step); }
        else { tweenId = 0; setRot(wrap180(to)); }
      })(t0);
    }

    function setAspect(a, fromUser) {
      S.aspect = a;
      if (a) { var c = S.crop; S.crop = fitCrop(a, c.x + c.w / 2, c.y + c.h / 2); }
      markBox(true);
    }
    function setCropField(f, v) {
      var c = S.crop, a = S.aspect;
      v = Math.round(v);
      if (f === 'x') c.x = v;
      else if (f === 'y') c.y = v;
      else if (f === 'w') { c.w = Math.max(1, v); if (a) c.h = c.w / a; }
      else { c.h = Math.max(1, v); if (a) c.w = c.h * a; }
      if (f === 'w' || f === 'h') {
        // Không cho tràn mép: thu lại theo tỉ lệ nếu cần
        var over = Math.max((c.x + c.w) / SW, (c.y + c.h) / SH);
        if (a && over > 1) { c.w /= over; c.h /= over; }
        if (a && (c.x + c.w > SW || c.y + c.h > SH)) { c.x = Math.min(c.x, SW - c.w); c.y = Math.min(c.y, SH - c.h); }
      }
      if (c.w < MIN_CROP && SW >= MIN_CROP && f !== 'x' && f !== 'y') { /* chờ Enter/blur mới kẹp tối thiểu */ }
      c.w = clamp(c.w, 1, SW); c.h = clamp(c.h, 1, SH);
      c.x = clamp(c.x, 0, SW - c.w); c.y = clamp(c.y, 0, SH - c.h);
      dirtyBox = true; dirtyFields = true; glide = true; schedule(); // ô đang gõ không bị ghi đè (frame bỏ qua ô đang focus)
    }

    // ---------- Vẽ ----------
    function layout() {
      var r = wrapEl.getBoundingClientRect();
      var availW = Math.max(60, r.width - 2), availH = Math.max(60, r.height - 2);
      k = Math.min(availW / SW, availH / SH);
      stage.style.width = Math.round(SW * k) + 'px';
      stage.style.height = Math.round(SH * k) + 'px';
      var dpr = Math.min(2, root.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.round(SW * k * dpr)); canvas.height = Math.max(1, Math.round(SH * k * dpr));
      dirtyImg = true; dirtyBox = true; schedule();
    }
    function filterStr() {
      return 'brightness(' + (1 + S.b / 100).toFixed(2) + ') contrast(' + (1 + S.c / 100).toFixed(2) + ') saturate(' + (1 + S.s / 100).toFixed(2) + ')';
    }
    // Vẽ ảnh đã biến đổi; scale = px canvas / px sân khấu; ox, oy = góc trên-trái sân khấu cần lấy
    function paint(ctx, scale, ox, oy) {
      ctx.save();
      ctx.setTransform(scale, 0, 0, scale, -ox * scale, -oy * scale);
      if (!alpha) { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, SW, SH); }
      ctx.translate(SW / 2, SH / 2);
      ctx.rotate(S.rot * Math.PI / 180);
      ctx.scale(S.zoom * (S.fx ? -1 : 1), S.zoom * (S.fy ? -1 : 1));
      if (HAS_FILTER && (S.b || S.c || S.s)) ctx.filter = filterStr();
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(base, -base.width / 2, -base.height / 2);
      ctx.restore();
    }
    function schedule() { if (!rafId && !done) rafId = requestAnimationFrame(frame); }
    function frame() {
      rafId = 0;
      if (done) return;
      if (dirtyImg) {
        dirtyImg = false;
        var ctx = canvas.getContext('2d');
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        paint(ctx, canvas.width / SW, 0, 0);
      }
      if (dirtyBox) {
        dirtyBox = false;
        var c = S.crop;
        box.classList.toggle('is-glide', glide && !motionOff());
        box.style.width = c.w * k + 'px'; box.style.height = c.h * k + 'px';
        box.style.translate = c.x * k + 'px ' + c.y * k + 'px';
        tag.textContent = Math.round(c.w) + ' × ' + Math.round(c.h);
        box.classList.toggle('is-small', c.w * k < 90 || c.h * k < 56);
      }
      if (dirtyFields) {
        dirtyFields = false;
        ['x', 'y', 'w', 'h'].forEach(function (f) { if (cropFields[f] !== document.activeElement) cropFields[f].value = Math.round(S.crop[f]); });
        Object.keys(sliders).forEach(function (id) { sliders[id].sync(); });
        chipBtns.forEach(function (b, i) {
          var a = PRESETS[i][1], on = a === null ? !S.aspect : !!S.aspect && Math.abs(S.aspect - a) < 0.005;
          b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        bFx.setAttribute('aria-pressed', S.fx ? 'true' : 'false'); bFx.classList.toggle('is-active', S.fx);
        bFy.setAttribute('aria-pressed', S.fy ? 'true' : 'false'); bFy.classList.toggle('is-active', S.fy);
      }
    }

    // ---------- Kéo khung / thu phóng bằng con trỏ ----------
    var pts = {}, drag = null, pinch = null;
    function stagePt(e, rect) { return { x: (e.clientX - rect.left) / k, y: (e.clientY - rect.top) / k }; }
    stage.addEventListener('pointerdown', function (e) {
      if (e.button != null && e.button > 0 && e.pointerType === 'mouse') return;
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      try { stage.setPointerCapture(e.pointerId); } catch (x) { /* bỏ qua */ }
      var ids = Object.keys(pts);
      if (ids.length === 2) {
        var a = pts[ids[0]], b = pts[ids[1]];
        pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, z: S.zoom };
        drag = null; stage.classList.remove('is-dragging');
        return;
      }
      var hd = e.target.closest && e.target.closest('[data-h]');
      var inBox = e.target.closest && e.target.closest('.ie-crop');
      if (!inBox) return;
      stage.focus({ preventScroll: true });
      e.preventDefault();
      var rect = stage.getBoundingClientRect();
      drag = { mode: hd ? hd.getAttribute('data-h') : 'move', rect: rect, start: stagePt(e, rect), crop: Object.assign({}, S.crop) };
      stage.classList.add('is-dragging');
      box.classList.remove('is-glide'); glide = false;
    });
    stage.addEventListener('pointermove', function (e) {
      if (!pts[e.pointerId]) return;
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      if (pinch) {
        var ids = Object.keys(pts);
        if (ids.length >= 2) { var a = pts[ids[0]], b = pts[ids[1]]; setZoom(pinch.z * (Math.hypot(a.x - b.x, a.y - b.y) / pinch.d)); }
        return;
      }
      if (!drag) return;
      var p = stagePt(e, drag.rect), c0 = drag.crop;
      if (drag.mode === 'move') {
        S.crop = { x: clamp(c0.x + p.x - drag.start.x, 0, SW - c0.w), y: clamp(c0.y + p.y - drag.start.y, 0, SH - c0.h), w: c0.w, h: c0.h };
      } else {
        S.crop = resize(c0, HDIR[drag.mode], p, S.aspect);
      }
      markBox(false);
    });
    function endPtr(e) {
      delete pts[e.pointerId];
      if (Object.keys(pts).length < 2) pinch = null;
      if (!Object.keys(pts).length) { drag = null; stage.classList.remove('is-dragging'); }
    }
    stage.addEventListener('pointerup', endPtr);
    stage.addEventListener('pointercancel', endPtr);
    stage.addEventListener('wheel', function (e) {
      e.preventDefault();
      setZoom(S.zoom * Math.exp(-e.deltaY * 0.0015));
    }, { passive: false });

    // Đổi cỡ khung theo tay nắm d = [dx, dy]; p = toạ độ con trỏ trong sân khấu; a = tỉ lệ khoá (hoặc null)
    function resize(c0, d, p, a) {
      var dx = d[0], dy = d[1];
      var L = c0.x, T = c0.y, R = c0.x + c0.w, B = c0.y + c0.h, cx = L + c0.w / 2, cy = T + c0.h / 2;
      var minW = Math.min(MIN_CROP, SW), minH = Math.min(MIN_CROP, SH);
      if (!a) {
        if (dx < 0) L = clamp(p.x, 0, R - minW); else if (dx > 0) R = clamp(p.x, L + minW, SW);
        if (dy < 0) T = clamp(p.y, 0, B - minH); else if (dy > 0) B = clamp(p.y, T + minH, SH);
        return { x: L, y: T, w: R - L, h: B - T };
      }
      var ax = dx < 0 ? R : dx > 0 ? L : cx, ay = dy < 0 ? B : dy > 0 ? T : cy;
      var nw;
      if (dx !== 0 && dy !== 0) nw = Math.max(Math.abs(p.x - ax), Math.abs(p.y - ay) * a);
      else if (dx !== 0) nw = Math.abs(p.x - ax);
      else nw = Math.abs(p.y - ay) * a;
      var maxW = dx < 0 ? ax : dx > 0 ? SW - ax : 2 * Math.min(cx, SW - cx);
      var maxH = dy < 0 ? ay : dy > 0 ? SH - ay : 2 * Math.min(cy, SH - cy);
      nw = Math.min(nw, maxW, maxH * a);
      nw = Math.max(nw, Math.min(minW, minH * a, maxW, maxH * a));
      var nh = nw / a;
      return { x: dx < 0 ? ax - nw : dx > 0 ? ax : cx - nw / 2, y: dy < 0 ? ay - nh : dy > 0 ? ay : cy - nh / 2, w: nw, h: nh };
    }

    // ---------- Phím tắt ----------
    dlg.addEventListener('keydown', function (e) {
      var t = e.target;
      if (e.ctrlKey || e.metaKey || e.key === 'Escape') e.stopPropagation(); // không để Ctrl+Z, Ctrl+/− … của trang lọt vào khi đang chỉnh ảnh
      var inField = t && t.matches && t.matches('input, textarea, select');
      if (e.key === 'Enter' && !inField && !(t.matches && t.matches('button'))) { e.preventDefault(); apply(); return; }
      if ((t === stage || t === dlg) && /^Arrow/.test(e.key)) {
        e.preventDefault();
        var step = e.shiftKey ? 10 : 1, c = S.crop;
        if (e.key === 'ArrowLeft') c.x -= step; else if (e.key === 'ArrowRight') c.x += step; else if (e.key === 'ArrowUp') c.y -= step; else c.y += step;
        c.x = clamp(c.x, 0, SW - c.w); c.y = clamp(c.y, 0, SH - c.h);
        markBox(false);
      }
    });
    dlg.addEventListener('cancel', function (e) { e.preventDefault(); finish(null); });
    xBtn.addEventListener('click', function () { finish(null); });
    bCancel.addEventListener('click', function () { finish(null); });
    bOk.addEventListener('click', apply);
    bReset.addEventListener('click', function () {
      cancelTween();
      S.rot = 0; S.zoom = 1; S.b = S.c = S.s = 0; S.fx = S.fy = false; S.aspect = opts.aspect || null;
      SW = base.width; SH = base.height; layout();
      S.crop = fitCrop(S.aspect, SW / 2, SH / 2);
      markImg(); markBox(true);
    });

    // ---------- Kết thúc ----------
    function apply() {
      if (done || bOk.disabled) return;
      bOk.disabled = true; bOk.textContent = 'Đang xử lý…';
      requestAnimationFrame(function () { setTimeout(function () {
        try {
          var c = S.crop;
          var ow = Math.max(1, Math.min(cfg.w, Math.round(c.w)));
          var oh = Math.max(1, Math.round(ow * c.h / c.w));
          var out = document.createElement('canvas'); out.width = ow; out.height = oh;
          paint(out.getContext('2d'), ow / c.w, c.x, c.y);
          var res = root.EP.images.compressCanvas(out, cfg);
          finish(res.data);
        } catch (err) { finish(null, err); }
      }, 20); });
    }
    function finish(result, err) {
      if (done) return;
      done = true;
      cancelTween(); cancelAnimationFrame(rafId);
      if (ro) ro.disconnect();
      var close = function () {
        try { dlg.close(); } catch (e) { /* đã đóng */ }
        dlg.remove();
        try { if (opener && opener.focus && document.contains(opener)) opener.focus({ preventScroll: true }); } catch (e) { /* bỏ qua */ }
        if (err) reject(err); else resolve(result);
      };
      if (motionOff()) close(); else { dlg.classList.add('is-closing'); setTimeout(close, 170); }
    }

    // ---------- Mở ----------
    dlg.showModal();
    layout();
    S.crop = fitCrop(S.aspect, SW / 2, SH / 2);
    markBox(false); markImg();
    var ro = root.ResizeObserver ? new root.ResizeObserver(function () { if (!done) layout(); }) : null;
    if (ro) ro.observe(wrapEl);
    dlg.tabIndex = -1; dlg.focus({ preventScroll: true }); // Enter áp dụng, mũi tên dịch khung ngay khi mở
  }

  root.EP = root.EP || {};
  root.EP.imageEditor = { open: open };
})(window);
