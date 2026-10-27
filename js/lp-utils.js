/*
 * lp-utils.js — tiện ích dùng chung cho landing page (renderer, app, file HTML xuất ra):
 *   - sanitizeRich: lọc chữ có định dạng, chỉ giữ đậm / nghiêng / gạch chân / gạch ngang / link / xuống dòng
 *   - biến dữ liệu động {con_cho}, {so_dang_ky}… tự cập nhật theo số đăng ký và thời gian
 *   - cssDecls: kiểu riêng theo thiết bị và khi rê chuột (sinh CSS có !important để thắng kiểu inline)
 */
(function (root) {
  var RICH_TAGS = { B: 'strong', STRONG: 'strong', I: 'em', EM: 'em', U: 'u', S: 's', STRIKE: 's', DEL: 's', A: 'a', BR: 'br' };
  function safeHref(href) {
    href = String(href || '').trim();
    return /^(https?:\/\/[^\s"'<>]+|mailto:[^\s"'<>]+|tel:[\d+\s.\-]+|#[\w-]*)$/i.test(href) ? href : '';
  }
  // Giữ thẻ an toàn, bỏ thẻ khác nhưng giữ chữ bên trong; link chỉ nhận http(s), mailto, tel, #
  function sanitizeRich(html) {
    var tpl = document.createElement('template');
    tpl.innerHTML = String(html || '');
    function clean(node, out) {
      Array.prototype.forEach.call(node.childNodes, function (c) {
        if (c.nodeType === 3) { out.appendChild(document.createTextNode(c.nodeValue)); return; }
        if (c.nodeType !== 1) return;
        var tag = RICH_TAGS[c.tagName];
        if (!tag) { clean(c, out); return; }
        var el = document.createElement(tag);
        if (tag === 'a') {
          var href = safeHref(c.getAttribute('href'));
          if (!href) { clean(c, out); return; }
          el.setAttribute('href', href);
          if (/^https?:/i.test(href)) { el.setAttribute('target', '_blank'); el.setAttribute('rel', 'noopener'); }
        }
        if (tag !== 'br') clean(c, el);
        out.appendChild(el);
      });
      return out;
    }
    return clean(tpl.content, document.createElement('div')).innerHTML;
  }

  var VARS = [
    ['con_cho', 'Số chỗ còn lại'], ['so_dang_ky', 'Số người đã đăng ký'], ['suc_chua', 'Tổng số chỗ'],
    ['dem_nguoc', 'Số ngày còn lại'], ['ngay', 'Ngày diễn ra'], ['gio', 'Giờ bắt đầu'],
    ['dia_diem', 'Địa điểm'], ['ten_su_kien', 'Tên sự kiện'], ['han_uu_dai', 'Hạn ưu đãi']
  ];
  var VAR_RE = /\{(con_cho|so_dang_ky|suc_chua|dem_nguoc|ngay|gio|dia_diem|ten_su_kien|han_uu_dai)\}/g;
  function fmtNum(n) { return Number(n).toLocaleString('vi-VN'); }
  function varValue(name, ev, count, now) {
    var cap = Number(ev.capacity) || 0;
    var d = new Date(ev.startAt);
    switch (name) {
      case 'con_cho': return cap ? fmtNum(Math.max(0, cap - count)) : 'không giới hạn';
      case 'so_dang_ky': return fmtNum(count);
      case 'suc_chua': return cap ? fmtNum(cap) : 'không giới hạn';
      case 'dem_nguoc': return isNaN(d) ? '' : String(Math.max(0, Math.ceil((d - now) / 86400000)));
      case 'ngay': return isNaN(d) ? '' : d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
      case 'gio': return isNaN(d) ? '' : d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      case 'dia_diem': return ev.location || '';
      case 'ten_su_kien': return ev.name || '';
      case 'han_uu_dai': return ev.earlyBirdUntil ? new Date(ev.earlyBirdUntil).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) : '';
    }
    return '';
  }
  // Thay {biến} trong chữ bằng <span class="lp-var">; giá trị điền bởi refreshVars()
  function expandVars(node, editable) {
    var walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    var hits = [];
    while (walker.nextNode()) if (/\{[a-z_]+\}/.test(walker.currentNode.nodeValue)) hits.push(walker.currentNode);
    hits.forEach(function (t) {
      var frag = document.createDocumentFragment(), last = 0, text = t.nodeValue, m;
      VAR_RE.lastIndex = 0;
      while ((m = VAR_RE.exec(text))) {
        if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        var v = document.createElement('span');
        v.className = 'lp-var'; v.setAttribute('data-var', m[1]);
        if (editable) { v.contentEditable = 'false'; v.title = 'Biến {' + m[1] + '} – tự cập nhật'; }
        frag.appendChild(v);
        last = m.index + m[0].length;
      }
      if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      t.parentNode.replaceChild(frag, t);
    });
  }
  function refreshVars(container, ev, count, now) {
    container.querySelectorAll('.lp-var').forEach(function (v) {
      var val = varValue(v.getAttribute('data-var'), ev, count, now);
      if (v.textContent !== val) v.textContent = val;
    });
  }
  // Đọc lại chữ đang sửa: biến → {ten}; trả { plain, html (null nếu không có định dạng) }
  function serialize(node) {
    var c = node.cloneNode(true);
    c.querySelectorAll('.lp-var').forEach(function (v) { v.replaceWith(document.createTextNode('{' + v.getAttribute('data-var') + '}')); });
    c.querySelectorAll('.lp-img-btn').forEach(function (b) { b.remove(); });
    var plain = c.textContent.replace(/\s+/g, ' ').trim();
    var hasFmt = !!c.querySelector('b,strong,i,em,u,s,strike,del,a,br');
    return { plain: plain, html: hasFmt ? sanitizeRich(c.innerHTML).replace(/&nbsp;/g, ' ').trim() : null };
  }

  var COLOR_OK = /^[#a-z0-9(),.%\s/-]+$/i;
  function cssDecls(st, editable) {
    var d = [];
    function n(v, a, b) { v = Number(v); return v === v ? Math.max(a, Math.min(b, v)) : 0; }
    function has(k) { return st[k] != null && st[k] !== ''; }
    if (has('color') && COLOR_OK.test(st.color)) d.push(['color', st.color]);
    if (has('background') && COLOR_OK.test(st.background)) d.push(['background', st.background]);
    if (has('fontSize')) d.push(['font-size', 'min(' + n(st.fontSize, 10, 96) + 'px, 12cqi)']);
    if (has('fontWeight')) d.push(['font-weight', n(st.fontWeight, 100, 900)]);
    if (st.italic != null && st.italic !== '') d.push(['font-style', st.italic ? 'italic' : 'normal']);
    if (st.underline != null && st.underline !== '') d.push(['text-decoration', st.underline ? 'underline' : 'none']);
    if (st.upper != null && st.upper !== '') d.push(['text-transform', st.upper ? 'uppercase' : 'none']);
    if (has('align') && /^(left|center|right)$/.test(st.align)) d.push(['text-align', st.align]);
    if (has('letterSpacing')) d.push(['letter-spacing', n(st.letterSpacing, -0.1, 0.5) + 'em']);
    if (has('lineHeight')) d.push(['line-height', n(st.lineHeight, 0.8, 3)]);
    if (has('wordSpacing')) d.push(['word-spacing', n(st.wordSpacing, -0.2, 1) + 'em']);
    if (has('textIndent')) d.push(['text-indent', n(st.textIndent, 0, 120) + 'px']);
    if (has('marginTop')) d.push(['margin-top', n(st.marginTop, -40, 160) + 'px']);
    if (has('marginBottom')) d.push(['margin-bottom', n(st.marginBottom, -40, 160) + 'px']);
    if (has('offsetX') || has('offsetY')) { d.push(['position', 'relative']); d.push(['left', n(st.offsetX || 0, -200, 200) + 'px']); d.push(['top', n(st.offsetY || 0, -200, 200) + 'px']); }
    if (st.hidden === true) { if (editable) { d.push(['opacity', '0.35']); d.push(['outline', '1px dashed #9a9ca0']); } else d.push(['display', 'none']); }
    if (st.hidden === false) { d.push(['display', 'revert']); d.push(['opacity', '1']); }
    return d.map(function (x) { return x[0] + ':' + x[1] + ' !important'; }).join(';');
  }
  // Ngưỡng bề rộng khung trang cho từng thiết bị (container query)
  var DEVICE_MAX = { tablet: 900, mobile: 560 };
  function sel(scope, key) { return '[data-lp-scope="' + scope + '"] [data-el="' + String(key).replace(/["\\]/g, '') + '"]'; }
  // CSS cho rê chuột (mọi thiết bị) + đè theo máy tính bảng / điện thoại
  function buildCss(scope, ev, editable) {
    var out = [];
    var base = ev.elStyles || {};
    Object.keys(base).forEach(function (k) {
      var st = base[k];
      var hov = [];
      if (st.hoverColor && COLOR_OK.test(st.hoverColor)) hov.push('color:' + st.hoverColor + ' !important');
      if (st.hoverBackground && COLOR_OK.test(st.hoverBackground)) hov.push('background:' + st.hoverBackground + ' !important');
      if (hov.length) out.push(sel(scope, k) + ':hover,' + sel(scope, k) + ':focus-visible{' + hov.join(';') + '}');
    });
    ['tablet', 'mobile'].forEach(function (dev) {
      var by = (ev.elStylesBy || {})[dev] || {};
      var rules = Object.keys(by).map(function (k) { var c = cssDecls(by[k], editable); return c ? sel(scope, k) + '{' + c + '}' : ''; }).filter(Boolean);
      if (rules.length) out.push('@container (max-width: ' + DEVICE_MAX[dev] + 'px){' + rules.join('') + '}');
    });
    return out.join('\n');
  }

  root.EP = root.EP || {};
  root.EP.lpUtils = {
    sanitizeRich: sanitizeRich, safeHref: safeHref, VARS: VARS, varValue: varValue, expandVars: expandVars,
    refreshVars: refreshVars, serialize: serialize, cssDecls: cssDecls, buildCss: buildCss, DEVICE_MAX: DEVICE_MAX
  };
})(typeof window !== 'undefined' ? window : globalThis);
