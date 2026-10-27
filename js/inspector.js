/*
 * inspector.js — bấm vào bất kỳ phần tử nào trong bản xem trước để chỉnh ngay tại chỗ.
 * Thanh công cụ nổi cạnh phần tử: sửa chữ, màu, cỡ, đậm/nghiêng/gạch chân, căn lề, nền, ẩn/hiện, về mặc định.
 * Chế độ Studio có thêm ô mã màu tự do, độ đậm, giãn chữ.
 * Kiểu riêng lưu ở event.elStyles[mã phần tử], chữ ở event.texts[mã] (renderer đọc lại khi vẽ).
 */
(function (root) {
  var cfg = null;
  var bar = null;
  var selectedKey = null;
  var rafId = 0;
  var openMore = false; // nhớ trạng thái mở mục Khoảng cách & vị trí

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function btn(label, title, onClick, active) {
    var b = el('button', 'ins-btn' + (active ? ' is-active' : ''), label);
    b.type = 'button'; b.title = title; b.setAttribute('aria-label', title);
    if (active != null) b.setAttribute('aria-pressed', active ? 'true' : 'false');
    b.addEventListener('mousedown', function (e) { e.preventDefault(); }); // giữ con trỏ trong chữ đang sửa
    b.addEventListener('click', onClick);
    return b;
  }
  // Nút có icon nét + chữ
  function ibtn(iconName, label, title, onClick) {
    var b = btn(label, title, onClick);
    b.insertAdjacentHTML('afterbegin', EP.icon(iconName, 14));
    return b;
  }
  function sep() { return el('span', 'ins-sep'); }

  function node() { return selectedKey ? cfg.landing.querySelector('[data-el="' + cssEsc(selectedKey) + '"]') : null; }
  function cssEsc(s) { return String(s).replace(/["\\]/g, '\\$&'); }
  // Thiết bị đang xem: máy tính = kiểu gốc; máy tính bảng / điện thoại = kiểu đè riêng (ev.elStylesBy[thiết bị])
  var DEV_LABEL = { tablet: 'máy tính bảng', mobile: 'điện thoại' };
  var BASE_ONLY = { hoverColor: 1, hoverBackground: 1, fontFamily: 1 };
  var styleClip = null; // định dạng đã sao chép (Ctrl+Shift+C)
  function dev() { return cfg.getDevice ? cfg.getDevice() : 'desktop'; }
  function baseStyles() { var ev = cfg.getState().event; return (ev.elStyles && ev.elStyles[selectedKey]) || {}; }
  function devStyles() { var ev = cfg.getState().event; return ((ev.elStylesBy || {})[dev()] || {})[selectedKey] || {}; }
  function styles() { return dev() === 'desktop' ? baseStyles() : Object.assign({}, baseStyles(), devStyles()); }

  // Ghi kiểu cho phần tử đang chọn. live=true: chỉ xem trước (đang kéo màu)
  // Đang gõ chữ trên trang mà bấm nút trên thanh công cụ: lưu chữ trước
  function flushEdit() {
    var a = document.activeElement;
    if (a && a.isContentEditable && cfg.landing.contains(a)) a.blur();
  }
  function setProp(prop, value, live) {
    if (!live) flushEdit();
    var o = {}; o[prop] = value;
    setMany(o, live);
  }
  // Ghi nhiều thuộc tính một lần (vào kiểu gốc, hoặc kiểu riêng của thiết bị đang xem)
  function setMany(obj, live) {
    var ev = cfg.getState().event;
    var d = dev();
    var all = Object.assign({}, ev.elStyles || {});
    var cur = Object.assign({}, all[selectedKey] || {});
    var byAll = Object.assign({}, ev.elStylesBy || {});
    var byDev = Object.assign({}, byAll[d] || {});
    var over = Object.assign({}, byDev[selectedKey] || {});
    Object.keys(obj).forEach(function (prop) {
      var value = obj[prop];
      if (d !== 'desktop' && !BASE_ONLY[prop]) {
        // Thiết bị nhỏ: giữ cả giá trị false để tắt được kiểu gốc (vd. bỏ in nghiêng chỉ trên điện thoại)
        if (value === '' || value == null) delete over[prop]; else over[prop] = value;
      } else if (value === '' || value == null || value === false) delete cur[prop]; else cur[prop] = value;
    });
    if (Object.keys(cur).length) all[selectedKey] = cur; else delete all[selectedKey];
    ev.elStyles = all;
    if (d !== 'desktop') {
      if (Object.keys(over).length) byDev[selectedKey] = over; else delete byDev[selectedKey];
      if (Object.keys(byDev).length) byAll[d] = byDev; else delete byAll[d];
      ev.elStylesBy = Object.keys(byAll).length ? byAll : null;
    }
    if (live) cfg.liveRender(); else cfg.persist();
  }
  function clearDevice() {
    flushEdit();
    var ev = cfg.getState().event, byAll = Object.assign({}, ev.elStylesBy || {}), byDev = Object.assign({}, byAll[dev()] || {});
    delete byDev[selectedKey];
    if (Object.keys(byDev).length) byAll[dev()] = byDev; else delete byAll[dev()];
    ev.elStylesBy = Object.keys(byAll).length ? byAll : null;
    cfg.persist();
    cfg.toast('Đã bỏ chỉnh riêng cho ' + DEV_LABEL[dev()] + '.');
  }
  function setText(value) {
    flushEdit();
    var ev = cfg.getState().event;
    var t = Object.assign({}, ev.texts || {});
    if (value) t[selectedKey] = value; else delete t[selectedKey];
    ev.texts = t;
    cfg.persist();
  }
  function resetEl() {
    flushEdit();
    var ev = cfg.getState().event;
    var a = Object.assign({}, ev.elStyles || {}); delete a[selectedKey]; ev.elStyles = a;
    var t = Object.assign({}, ev.texts || {}); delete t[selectedKey]; ev.texts = t;
    if (ev.rich && ev.rich[selectedKey]) { var r = Object.assign({}, ev.rich); delete r[selectedKey]; ev.rich = r; }
    if (ev.elStylesBy) {
      var by = {};
      Object.keys(ev.elStylesBy).forEach(function (d) { var x = Object.assign({}, ev.elStylesBy[d]); delete x[selectedKey]; if (Object.keys(x).length) by[d] = x; });
      ev.elStylesBy = Object.keys(by).length ? by : null;
    }
    if (selectedKey === 'hero.cta' && ev.style) delete ev.style.ctaText;
    cfg.persist();
    cfg.toast('Đã đưa phần tử về mặc định.');
  }

  // Kích thước chữ hiện tại (px) của phần tử
  function currentSize(n) { return Math.round(parseFloat(root.getComputedStyle(n).fontSize)) || 16; }

  function select(key) {
    if (selectedKey === key && bar && !bar.hidden) return;
    var prev = node();
    if (prev) prev.classList.remove('lp-selected');
    selectedKey = key;
    var n = node();
    if (!n) { close(); return; }
    n.classList.add('lp-selected', 'lp-just-selected');
    build(true);
    if (cfg.onSelect) cfg.onSelect(key);
  }

  function close() {
    var n = node();
    if (n) n.classList.remove('lp-selected');
    selectedKey = null;
    if (cfg && cfg.onSelect) cfg.onSelect(null);
    if (bar && !bar.hidden) {
      bar.classList.add('is-leaving');
      setTimeout(function () { if (!selectedKey) { bar.hidden = true; bar.classList.remove('is-leaving'); } }, 160);
    }
  }

  // Vẽ thanh công cụ cho phần tử đang chọn
  function build(fresh) {
    var n = node();
    if (!n) return close();
    var kind = n.getAttribute('data-el-kind') || 'text';
    var required = n.hasAttribute('data-el-required');
    var studio = cfg.getMode() === 'studio';
    var st = styles();
    var PS = EP.pageStyle;
    bar.innerHTML = '';

    // Đường dẫn: phần chứa › phần tử (bấm để chọn phần cha)
    var crumbs = el('div', 'ins-crumbs');
    var chain = [], p = n.parentElement;
    while (p && p !== cfg.landing) { if (p.hasAttribute('data-el')) chain.unshift(p); p = p.parentElement; }
    chain.forEach(function (a) {
      var c = el('button', 'ins-crumb', a.getAttribute('data-el-label'));
      c.type = 'button';
      c.addEventListener('click', function () { select(a.getAttribute('data-el')); });
      crumbs.appendChild(c);
      crumbs.appendChild(el('span', 'ins-crumb-sep', '›'));
    });
    crumbs.appendChild(el('strong', 'ins-name', n.getAttribute('data-el-label')));
    var cl = btn('', 'Đóng (Esc)', close); cl.innerHTML = EP.icon('x'); crumbs.appendChild(cl);
    bar.appendChild(crumbs);

    if (dev() !== 'desktop' && kind !== 'section') {
      var db = el('div', 'ins-device');
      db.insertAdjacentHTML('afterbegin', EP.icon(dev() === 'mobile' ? 'phone' : 'tablet', 14));
      var has = Object.keys(devStyles()).length;
      db.appendChild(el('span', null, has ? 'Đang có chỉnh riêng cho ' + DEV_LABEL[dev()] + ' – máy tính giữ nguyên.' : 'Chỉnh ở đây chỉ áp dụng trên ' + DEV_LABEL[dev()] + '.'));
      if (has) db.appendChild(btn('Bỏ chỉnh riêng', 'Bỏ mọi chỉnh riêng cho ' + DEV_LABEL[dev()], clearDevice));
      bar.appendChild(db);
    }

    var row = el('div', 'ins-row');
    if (kind === 'section') {
      buildSection(row, n.getAttribute('data-el').replace('section.', ''));
      bar.appendChild(row);
      return finish(fresh);
    }

    if (kind === 'text') {
      row.appendChild(ibtn('pencil', 'Sửa chữ', 'Sửa chữ ngay trên trang', function () {
        n.focus();
        var r = document.createRange(); r.selectNodeContents(n);
        var sel = root.getSelection(); sel.removeAllRanges(); sel.addRange(r);
      }));
      row.appendChild(sep());
    }
    if (kind === 'button') {
      var tIn = el('input', 'ins-text');
      tIn.type = 'text'; tIn.maxLength = 40; tIn.value = n.textContent.trim(); tIn.setAttribute('aria-label', 'Chữ trên nút');
      tIn.addEventListener('change', function () { setText(tIn.value.trim()); });
      tIn.addEventListener('keydown', function (e) { if (e.key === 'Enter') tIn.blur(); });
      row.appendChild(tIn);
      row.appendChild(sep());
    }

    // Cỡ chữ
    var size = st.fontSize || currentSize(n);
    row.appendChild(btn('A−', 'Chữ nhỏ hơn', function () { setProp('fontSize', Math.max(10, size - 2)); }));
    var sz = el('input', 'ins-num'); sz.type = 'number'; sz.min = 10; sz.max = 96; sz.value = size; sz.setAttribute('aria-label', 'Cỡ chữ (px)');
    sz.addEventListener('change', function () { setProp('fontSize', Math.max(10, Math.min(96, Number(sz.value) || size))); });
    row.appendChild(sz);
    row.appendChild(btn('A+', 'Chữ lớn hơn', function () { setProp('fontSize', Math.min(96, size + 2)); }));
    row.appendChild(sep());
    var bold = st.fontWeight ? Number(st.fontWeight) >= 600 : Number(root.getComputedStyle(n).fontWeight) >= 600;
    row.appendChild(btn('B', 'In đậm', function () { setProp('fontWeight', bold ? 400 : 700); }, bold));
    row.appendChild(btn('I', 'In nghiêng', function () { setProp('italic', !st.italic); }, !!st.italic));
    row.appendChild(btn('U', 'Gạch chân', function () { setProp('underline', !st.underline); }, !!st.underline));
    row.appendChild(btn('AA', 'Viết hoa', function () { setProp('upper', !st.upper); }, !!st.upper));
    row.appendChild(sep());
    [['left', 'Căn trái'], ['center', 'Căn giữa'], ['right', 'Căn phải']].forEach(function (a) {
      var ab = btn('', a[1], function () { setProp('align', st.align === a[0] ? '' : a[0]); }, st.align === a[0]);
      ab.innerHTML = EP.icon('align-' + a[0]);
      row.appendChild(ab);
    });
    bar.appendChild(row);
    if (kind === 'text') bar.appendChild(richRow(n));

    // Màu
    var row2 = el('div', 'ins-row');
    row2.appendChild(colorControl('Màu chữ', 'color', st.color, root.getComputedStyle(n).color, studio));
    if (kind === 'button' || kind === 'box') row2.appendChild(colorControl('Màu nền', 'background', st.background, root.getComputedStyle(n).backgroundColor, studio));
    bar.appendChild(row2);
    if (kind === 'button' || (kind === 'box' && n.tagName === 'A')) {
      var rowH = el('div', 'ins-row ins-hover');
      rowH.appendChild(colorControl('Rê chuột · chữ', 'hoverColor', st.hoverColor, root.getComputedStyle(n).color, studio));
      rowH.appendChild(colorControl('Rê chuột · nền', 'hoverBackground', st.hoverBackground, root.getComputedStyle(n).backgroundColor, studio));
      bar.appendChild(rowH);
    }

    // Font riêng + độ đậm (cả hai chế độ)
    var rowF = el('div', 'ins-row ins-font');
    var fc = cfg.fontCombo({
      id: 'ins-font-' + selectedKey.replace(/[^a-z0-9]/gi, '-'), label: 'Font của phần tử', allowDefault: true,
      value: st.fontFamily || '',
      onPick: function (name) { setProp('fontFamily', name || ''); }
    });
    fc.wrap.classList.add('ins-combo');
    rowF.appendChild(fc.wrap);
    rowF.appendChild(cfg.weightSelect('Độ đậm', st.fontWeight, function (v) { setProp('fontWeight', v == null ? '' : v); }, true));
    bar.appendChild(rowF);
    bar.appendChild(fc.note);

    // Khoảng cách & vị trí: giãn dòng/chữ/từ, thụt đầu dòng, lề trên/dưới, dịch ngang/dọc
    var det = el('details', 'ins-more');
    det.open = !!openMore;
    det.addEventListener('toggle', function () { openMore = det.open; position(true); });
    det.appendChild(el('summary', null, 'Khoảng cách & vị trí'));
    var grid = el('div', 'ins-grid');
    [
      ['lineHeight', 'Giãn dòng', 0.8, 3, 0.05, '', 1.5],
      ['letterSpacing', 'Giãn chữ', -0.1, 0.5, 0.01, 'em', 0],
      ['wordSpacing', 'Giãn từ', -0.2, 1, 0.02, 'em', 0],
      ['textIndent', 'Thụt đầu dòng', 0, 120, 2, 'px', 0],
      ['marginTop', 'Lề trên', -40, 160, 2, 'px', 0],
      ['marginBottom', 'Lề dưới', -40, 160, 2, 'px', 0],
      ['offsetX', 'Dịch ngang', -200, 200, 2, 'px', 0],
      ['offsetY', 'Dịch dọc', -200, 200, 2, 'px', 0]
    ].forEach(function (f) {
      var cell = el('label', 'ins-cell');
      cell.appendChild(el('span', 'ins-label', f[1]));
      cell.appendChild(cfg.stepper({ label: f[1], min: f[2], max: f[3], step: f[4], unit: f[5], value: st[f[0]], base: f[6], onChange: function (v) { setProp(f[0], v == null ? '' : v); } }));
      grid.appendChild(cell);
    });
    det.appendChild(grid);
    bar.appendChild(det);

    var row4 = el('div', 'ins-row ins-actions');
    if (!required) row4.appendChild(ibtn(st.hidden ? 'eye' : 'eye-off', st.hidden ? 'Hiện lại' : 'Ẩn', st.hidden ? 'Hiện lại phần tử này' : 'Ẩn phần tử này khỏi trang', function () { setProp('hidden', !st.hidden); cfg.toast(st.hidden ? 'Đã hiện lại.' : 'Đã ẩn – khách sẽ không thấy phần tử này.'); }));
    row4.appendChild(ibtn('reset', 'Mặc định', 'Bỏ mọi chỉnh sửa của phần tử này', resetEl));
    var def = n.getAttribute('data-el-default');
    if (kind === 'text' && def != null && n.getAttribute('data-field') == null) {
      var hint = el('small', 'ins-hint', 'Gốc: ' + (def.length > 40 ? def.slice(0, 40) + '…' : def));
      row4.appendChild(hint);
    }
    bar.appendChild(row4);
    finish(fresh);

    function colorControl(label, prop, value, computed, full) {
      var wrap = el('div', 'ins-color');
      wrap.appendChild(el('span', 'ins-label', label));
      if (full) {
        wrap.appendChild(cfg.colorField('', value, PS.normalizeColor(computed), '', function (v, commit) { setProp(prop, v, commit === false); }));
        return wrap;
      }
      var sw = el('div', 'ins-swatches');
      var theme = cfg.themeColors();
      theme.forEach(function (c) {
        var b = btn('', 'Chọn màu ' + c, function () { setProp(prop, c); }, value === c);
        b.classList.add('ins-swatch'); b.style.background = c;
        sw.appendChild(b);
      });
      var pick = el('input', 'ins-picker'); pick.type = 'color'; pick.value = PS.solidHex(value || computed) || '#000000';
      pick.setAttribute('aria-label', label + ' tuỳ chọn');
      pick.addEventListener('input', function () { setProp(prop, pick.value, true); });
      pick.addEventListener('change', function () { setProp(prop, pick.value); });
      sw.appendChild(pick);
      if (value) { var rb = btn('', 'Bỏ ' + label.toLowerCase(), function () { setProp(prop, ''); }); rb.innerHTML = EP.icon('reset'); sw.appendChild(rb); }
      wrap.appendChild(sw);
      return wrap;
    }
  }

  // Định dạng một đoạn chữ đang bôi đen (đậm, nghiêng, gạch, link) + chèn biến dữ liệu
  function richRow(n) {
    var row = el('div', 'ins-row ins-rich');
    row.appendChild(el('span', 'ins-label', 'Đoạn chọn'));
    function inNode() {
      var s = root.getSelection();
      return s && s.rangeCount && !s.isCollapsed && n.contains(s.anchorNode) && n.contains(s.focusNode);
    }
    function fmt(cmd, arg) {
      if (!inNode()) { cfg.toast('Bôi đen đoạn chữ cần định dạng ngay trên trang trước.'); return; }
      document.execCommand('styleWithCSS', false, false);
      document.execCommand(cmd, false, arg);
    }
    [['bold', 'bold', 'Đậm đoạn chọn (Ctrl+B)'], ['italic', 'italic', 'Nghiêng đoạn chọn (Ctrl+I)'], ['underline', 'underline', 'Gạch chân đoạn chọn (Ctrl+U)'], ['strikeThrough', 'strike', 'Gạch ngang đoạn chọn']].forEach(function (c) {
      var b = btn('', c[2], function () { fmt(c[0]); });
      b.innerHTML = EP.icon(c[1], 14);
      row.appendChild(b);
    });
    var lk = btn('', 'Gắn link cho đoạn chọn', function () {
      if (!inNode()) { cfg.toast('Bôi đen đoạn chữ cần gắn link trước.'); return; }
      var range = root.getSelection().getRangeAt(0).cloneRange();
      var url = root.prompt('Đường dẫn (https://…, mailto:…, tel:…)', 'https://');
      if (url == null) return;
      var safe = EP.lpUtils.safeHref(url.trim());
      if (!safe) { cfg.toast('Đường dẫn chưa hợp lệ. Dùng https://, mailto: hoặc tel:'); return; }
      n.focus();
      var sel = root.getSelection(); sel.removeAllRanges(); sel.addRange(range);
      document.execCommand('createLink', false, safe);
    });
    lk.innerHTML = EP.icon('link', 14);
    row.appendChild(lk);
    var clr = btn('', 'Bỏ định dạng đoạn chọn', function () { fmt('removeFormat'); document.execCommand('unlink'); });
    clr.innerHTML = EP.icon('eraser', 14);
    row.appendChild(clr);
    row.appendChild(sep());
    // Chèn biến: {con_cho}, {so_dang_ky}…
    var vb = btn('', 'Chèn biến dữ liệu tự cập nhật', function () { pop.hidden = !pop.hidden; vb.setAttribute('aria-expanded', String(!pop.hidden)); if (!pop.hidden) EP.motion.replay(pop, 'is-entering'); position(true); });
    vb.innerHTML = EP.icon('braces', 14) + '<span>Biến</span>';
    vb.setAttribute('aria-expanded', 'false');
    row.appendChild(vb);
    var pop = el('div', 'ins-vars');
    pop.hidden = true;
    var ev = cfg.getState().event;
    (cfg.vars || []).forEach(function (v) {
      var b = btn('', 'Chèn ' + v[1], function () { insertVar(n, v[0]); });
      b.classList.add('ins-var');
      b.appendChild(el('code', null, '{' + v[0] + '}'));
      b.appendChild(el('span', null, v[1]));
      b.appendChild(el('small', null, EP.lpUtils.varValue(v[0], ev, cfg.getCount ? cfg.getCount() : 0, new Date()) || '—'));
      pop.appendChild(b);
    });
    var wrap = el('div', 'ins-rich-wrap');
    wrap.appendChild(row); wrap.appendChild(pop);
    return wrap;
  }
  function insertVar(n, name) {
    var s = root.getSelection();
    var inside = s && s.rangeCount && n.contains(s.anchorNode) && document.activeElement === n;
    if (!inside) {
      n.focus();
      var r = document.createRange(); r.selectNodeContents(n); r.collapse(false);
      s.removeAllRanges(); s.addRange(r);
    }
    document.execCommand('insertText', false, '{' + name + '}');
    n.blur(); // lưu ngay → trang vẽ lại, biến hiện giá trị thật
    cfg.toast('Đã chèn biến {' + name + '} – tự cập nhật theo số liệu.');
  }

  // Khối trong thư viện: thêm/bớt mục, link video, địa chỉ bản đồ
  function blockControls(row, key) {
    var B = cfg.getBlockApi && cfg.getBlockApi();
    if (!B || !B.isBlock(key)) return;
    var box = el('div', 'ins-row ins-block');
    if (B.isList(key)) {
      box.appendChild(el('span', 'ins-label', B.count(key) + ' mục'));
      box.appendChild(ibtn('plus', 'Thêm mục', 'Thêm một mục vào khối này', function () { B.addItem(key); }));
      box.appendChild(ibtn('minus', 'Bớt mục', 'Bỏ mục cuối của khối này', function () { B.removeItem(key); }));
    }
    if (key === 'video' || key === 'map') {
      var lab = el('label', 'ins-cell ins-wide');
      lab.appendChild(el('span', 'ins-label', key === 'video' ? 'Link YouTube / Vimeo' : 'Địa chỉ trên bản đồ'));
      var inp = el('input', 'ins-text');
      inp.type = key === 'video' ? 'url' : 'text';
      inp.maxLength = 200;
      inp.value = B.get(key)[key === 'video' ? 'url' : 'query'] || '';
      inp.placeholder = key === 'video' ? 'https://youtu.be/…' : (cfg.getState().event.location || 'Địa điểm sự kiện');
      inp.setAttribute('aria-label', key === 'video' ? 'Link video' : 'Địa chỉ bản đồ');
      inp.addEventListener('change', function () {
        var v = inp.value.trim();
        if (key === 'video' && v && !B.videoOk(v)) { inp.setAttribute('aria-invalid', 'true'); cfg.toast('Chỉ nhận link YouTube hoặc Vimeo.'); return; }
        B.set(key, key === 'video' ? 'url' : 'query', v);
      });
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') inp.blur(); });
      lab.appendChild(inp);
      box.appendChild(lab);
    }
    row.appendChild(box);
  }

  // ---------- Phím tắt khi đang chọn phần tử ----------
  function allEls() { return Array.prototype.slice.call(cfg.landing.querySelectorAll('[data-el]')); }
  function parentEl(x) { var p = x.parentElement; while (p && p !== cfg.landing && !p.hasAttribute('data-el')) p = p.parentElement; return p && p !== cfg.landing ? p : null; }
  function go(target) {
    if (!target) return;
    select(target.getAttribute('data-el'));
    target.scrollIntoView({ block: 'nearest', behavior: EP.motion.reduce() ? 'auto' : 'smooth' });
  }
  function onKey(e) {
    if (!selectedKey || !cfg.landing.classList.contains('is-editable') || cfg.landing.closest('[hidden]')) return;
    var t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (document.querySelector('dialog[open]')) return;
    var n = node();
    if (!n) return;
    var k = e.key;
    if (e.altKey && /^Arrow(Up|Down|Left|Right)$/.test(k)) {
      e.preventDefault();
      if (k === 'ArrowUp') return go(parentEl(n));
      if (k === 'ArrowDown') return go(n.querySelector('[data-el]'));
      var sibs = allEls().filter(function (x) { return parentEl(x) === parentEl(n); });
      var i = sibs.indexOf(n);
      return go(sibs[i + (k === 'ArrowLeft' ? -1 : 1)]);
    }
    if (k === 'Enter' && n.isContentEditable) {
      e.preventDefault();
      n.focus();
      var r = document.createRange(); r.selectNodeContents(n);
      var sel = root.getSelection(); sel.removeAllRanges(); sel.addRange(r);
      return;
    }
    if (k === 'Delete' || k === 'Backspace') {
      e.preventDefault();
      var kind = n.getAttribute('data-el-kind');
      if (kind === 'section') {
        var sk = selectedKey.replace('section.', '');
        if (cfg.sectionApi.locked(sk)) { cfg.toast('Phần này bắt buộc theo đề, không ẩn được.'); return; }
        close(); cfg.sectionApi.hide(sk); return;
      }
      if (n.hasAttribute('data-el-required')) { cfg.toast('Phần tử này bắt buộc, không ẩn được.'); return; }
      setProp('hidden', true);
      cfg.toast('Đã ẩn phần tử. Ctrl+Z để lấy lại.');
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (k === 'C' || k === 'c' || e.code === 'KeyC')) {
      e.preventDefault();
      styleClip = JSON.parse(JSON.stringify(styles()));
      delete styleClip.hidden; delete styleClip.offsetX; delete styleClip.offsetY;
      cfg.toast(Object.keys(styleClip).length ? 'Đã sao chép định dạng. Chọn phần tử khác rồi Ctrl+Shift+V.' : 'Phần tử này chưa có định dạng riêng để sao chép.');
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (k === 'V' || k === 'v' || e.code === 'KeyV')) {
      e.preventDefault();
      if (!styleClip || !Object.keys(styleClip).length) { cfg.toast('Chưa sao chép định dạng nào (Ctrl+Shift+C).'); return; }
      setMany(styleClip);
      cfg.toast('Đã dán định dạng.');
    }
  }

  // Phần lớn (section): nền, căn lề, màu riêng, di chuyển, ẩn
  function buildSection(row, key) {
    var PS = EP.pageStyle;
    var api = cfg.sectionApi;
    var cur = api.get(key);
    row.classList.add('ins-col');
    blockControls(row, key);
    row.appendChild(api.chips('Nền', PS.OPTIONS.sectionBg, cur.bg || 'auto', function (v) { api.set(key, 'bg', v); }));
    row.appendChild(api.chips('Căn lề', PS.OPTIONS.sectionAlign, cur.align || 'auto', function (v) { api.set(key, 'align', v); }));
    if (cfg.getMode() === 'studio') {
      row.appendChild(cfg.colorField('Màu nền riêng', cur.bgColor, '', '', function (v, c) { api.set(key, 'bgColor', v, c); }));
      row.appendChild(cfg.colorField('Màu chữ riêng', cur.textColor, '', '', function (v, c) { api.set(key, 'textColor', v, c); }));
    }
    var acts = el('div', 'ins-row ins-actions');
    acts.appendChild(ibtn('arrow-up', 'Đưa lên', 'Đưa phần này lên trên', function () { api.move(key, -1); }));
    acts.appendChild(ibtn('arrow-down', 'Đưa xuống', 'Đưa phần này xuống dưới', function () { api.move(key, 1); }));
    if (!api.locked(key)) acts.appendChild(ibtn('eye-off', 'Ẩn phần', 'Ẩn cả phần này', function () { close(); api.hide(key); }));
    row.appendChild(acts);
  }

  function finish(fresh) {
    bar.hidden = false;
    bar.classList.remove('is-leaving');
    if (fresh) { bar.classList.remove('is-entering'); void bar.offsetWidth; bar.classList.add('is-entering'); }
    position(!fresh);
  }

  // Đặt thanh công cụ ngay trên (hoặc dưới) phần tử, không tràn khỏi màn hình
  function position(animate) {
    var n = node();
    if (!n || !bar || bar.hidden) return;
    var r = n.getBoundingClientRect();
    var wrap = cfg.landing.getBoundingClientRect();
    var bh = bar.offsetHeight, bw = bar.offsetWidth;
    var top = r.top - bh - 10;
    if (top < 70) top = Math.min(r.bottom + 10, root.innerHeight - bh - 10);
    var left = Math.max(8, Math.min(r.left, Math.min(wrap.right, root.innerWidth) - bw - 8));
    bar.classList.toggle('no-anim', !animate);
    bar.style.top = Math.max(8, top) + 'px';
    bar.style.left = left + 'px';
  }
  function schedule() { cancelAnimationFrame(rafId); rafId = requestAnimationFrame(function () { position(false); }); }

  function init(c) {
    cfg = c;
    bar = el('div', 'inspector');
    bar.id = 'inspector';
    bar.hidden = true;
    bar.setAttribute('role', 'toolbar');
    bar.setAttribute('aria-label', 'Chỉnh phần tử');
    document.body.appendChild(bar);

    cfg.landing.addEventListener('click', function (e) {
      if (!cfg.landing.classList.contains('is-editable')) return;
      if (e.target.closest('.lp-img-btn')) return;
      var t = e.target.closest('[data-el]');
      if (!t || !cfg.landing.contains(t)) return;
      // Chọn phần tử nhỏ nhất được bấm; bấm lần nữa vào phần tử đang chọn thì giữ nguyên
      if (t.matches('input, select, textarea')) return;
      select(t.getAttribute('data-el'));
    });
    // Rê chuột: hiện tên phần tử
    cfg.landing.addEventListener('mouseover', function (e) {
      if (!cfg.landing.classList.contains('is-editable')) return;
      var t = e.target.closest('[data-el]');
      cfg.landing.querySelectorAll('.lp-hovered').forEach(function (x) { if (x !== t) x.classList.remove('lp-hovered'); });
      if (t) t.classList.add('lp-hovered');
    });
    cfg.landing.addEventListener('mouseleave', function () { cfg.landing.querySelectorAll('.lp-hovered').forEach(function (x) { x.classList.remove('lp-hovered'); }); });
    document.addEventListener('mousedown', function (e) {
      if (!selectedKey) return;
      if (bar.contains(e.target) || cfg.landing.contains(e.target) || (e.target.closest && e.target.closest('.combo-list'))) return;
      close();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && selectedKey && !(e.target && e.target.isContentEditable)) close(); });
    document.addEventListener('keydown', onKey);
    root.addEventListener('scroll', schedule, true);
    root.addEventListener('resize', schedule);
  }

  // Gọi sau mỗi lần vẽ lại trang: chọn lại phần tử cũ, cập nhật thanh công cụ
  function refresh() {
    if (!selectedKey || !bar) return;
    var n = node();
    if (!n) { close(); return; }
    n.classList.add('lp-selected');
    if (!bar.contains(document.activeElement)) build(false); else position(true);
  }

  root.EP = root.EP || {};
  root.EP.inspector = { init: init, refresh: refresh, select: select, close: close, selected: function () { return selectedKey; } };
})(typeof window !== 'undefined' ? window : globalThis);
