/*
 * popup.js — hộp thoại (popup) dùng chung cho app: EP.popup.open / EP.popup.confirm.
 * Dùng <dialog> (nền mờ, khoá focus, Esc để đóng), hiệu ứng nảy vào, pháo giấy cho tone "celebrate".
 * Trình duyệt tự động (webdriver) bỏ qua popup thông báo và tự đồng ý hộp xác nhận, trừ khi URL có ?popup=1.
 */
(function (root) {
  var EP = root.EP = root.EP || {};
  var seq = 0, openCount = 0;
  var ICONS = { success: '✓', info: 'i', warn: '!', celebrate: '★' };

  function automated() {
    return !!(root.navigator && root.navigator.webdriver) && !/[?&]popup=1\b/.test(root.location.search || '');
  }
  function motionOff() { return document.documentElement.classList.contains('motion-off') || (root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches); }

  function confetti(host) {
    if (motionOff() || !host.getContext) return;
    var dpr = Math.min(root.devicePixelRatio || 1, 2);
    var w = host.clientWidth, hgt = host.clientHeight;
    host.width = w * dpr; host.height = hgt * dpr;
    var ctx = host.getContext('2d'); ctx.scale(dpr, dpr);
    var cs = getComputedStyle(document.documentElement);
    var colors = [cs.getPropertyValue('--accent') || '#d6336c', cs.getPropertyValue('--primary') || '#131416', '#f5b83d', '#2fb67c', '#5b8def'].map(function (c) { return c.trim(); });
    var ps = [];
    for (var i = 0; i < 70; i++) {
      var a = -Math.PI / 2 + (Math.random() - 0.5) * 1.9, v = 6 + Math.random() * 8;
      ps.push({ x: w / 2, y: hgt * 0.3, vx: Math.cos(a) * v, vy: Math.sin(a) * v, s: 4 + Math.random() * 5, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, c: colors[i % colors.length] });
    }
    var t0 = performance.now(), DUR = 1150;
    (function frame(now) {
      var k = (now - t0) / DUR;
      ctx.clearRect(0, 0, w, hgt);
      if (k >= 1 || !host.isConnected) return;
      ctx.globalAlpha = Math.min(1, (1 - k) * 2.2);
      ps.forEach(function (p) {
        p.vy += 0.32; p.vx *= 0.985; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore();
      });
      requestAnimationFrame(frame);
    })(t0);
  }

  /**
   * open({icon, title, body (node|text), actions:[{label, primary, danger, value, onClick}], tone, dismissible, className})
   * → Promise<giá trị của nút đã bấm | 'dismiss'>. onClick trả về false thì popup không đóng.
   */
  function open(o) {
    o = o || {};
    var tone = o.tone || 'info';
    var dismissible = o.dismissible !== false;
    if (automated() && !o.force) return Promise.resolve('auto-skipped');
    var id = 'ep-pop-' + (++seq);
    var dlg = document.createElement('dialog');
    dlg.className = 'ep-pop is-' + tone + (o.className ? ' ' + o.className : '');
    dlg.setAttribute('aria-labelledby', id + '-t');
    if (o.body) dlg.setAttribute('aria-describedby', id + '-b');
    var card = document.createElement('div'); card.className = 'ep-pop-card';
    var ic = document.createElement('div'); ic.className = 'ep-pop-icon'; ic.setAttribute('aria-hidden', 'true');
    var sp = document.createElement('span'); sp.textContent = o.icon || ICONS[tone] || 'i'; ic.appendChild(sp);
    var h = document.createElement('h2'); h.className = 'ep-pop-title'; h.id = id + '-t'; h.textContent = o.title || '';
    card.appendChild(ic); card.appendChild(h);
    if (o.body) {
      var b = document.createElement('div'); b.className = 'ep-pop-body'; b.id = id + '-b';
      if (typeof o.body === 'string') { var p = document.createElement('p'); p.textContent = o.body; b.appendChild(p); } else b.appendChild(o.body);
      card.appendChild(b);
    }
    var bar = document.createElement('div'); bar.className = 'ep-pop-actions';
    var actions = o.actions && o.actions.length ? o.actions : [{ label: 'Đã hiểu', primary: true }];
    var result = 'dismiss', prevFocus = document.activeElement;
    var resolveFn, closed = false;
    var promise = new Promise(function (r) { resolveFn = r; });
    function close() {
      if (closed) return; closed = true;
      var fin = function () {
        if (dlg.close && dlg.open) dlg.close();
        dlg.remove(); openCount--;
        if (prevFocus && prevFocus.focus && prevFocus.isConnected) { try { prevFocus.focus(); } catch (e) {} }
        resolveFn(result);
      };
      if (motionOff()) fin(); else { dlg.classList.add('is-leaving'); setTimeout(fin, 160); }
    }
    var btns = actions.map(function (a, i) {
      var btn = document.createElement('button'); btn.type = 'button';
      btn.className = 'btn ' + (a.danger ? 'btn-danger-solid' : a.primary ? 'btn-primary' : 'btn-ghost');
      btn.textContent = a.label;
      btn.addEventListener('click', function () {
        var keep = a.onClick ? a.onClick(btn, dlg) : undefined;
        if (keep === false) return;
        result = a.value !== undefined ? a.value : i;
        close();
      });
      bar.appendChild(btn);
      return btn;
    });
    card.appendChild(bar);
    if (dismissible) {
      var x = document.createElement('button'); x.type = 'button'; x.className = 'ep-pop-x'; x.setAttribute('aria-label', 'Đóng'); x.innerHTML = '&times;';
      x.addEventListener('click', function () { result = 'dismiss'; close(); });
      card.appendChild(x);
    }
    var cv = null;
    if (tone === 'celebrate') { cv = document.createElement('canvas'); cv.className = 'ep-pop-confetti'; cv.setAttribute('aria-hidden', 'true'); card.appendChild(cv); }
    dlg.appendChild(card);
    document.body.appendChild(dlg);

    dlg.addEventListener('cancel', function (e) { e.preventDefault(); if (dismissible) { result = 'dismiss'; close(); } });
    dlg.addEventListener('mousedown', function (e) { if (e.target === dlg && dismissible) { result = 'dismiss'; close(); } });
    dlg.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = Array.prototype.slice.call(dlg.querySelectorAll('button, a[href], input, select, textarea')).filter(function (n) { return !n.disabled && n.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || !dlg.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || !dlg.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
    });
    openCount++;
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    // Cảnh báo: focus vào nút an toàn (Huỷ); còn lại focus vào nút chính
    var pi = actions.map(function (a) { return !!a.primary || !!a.danger; }).lastIndexOf(true);
    var focusIdx = tone === 'warn' ? 0 : (pi >= 0 ? pi : 0);
    (btns[focusIdx] || btns[0]).focus();
    if (cv) requestAnimationFrame(function () { confetti(cv); });
    return promise;
  }

  // Hỏi xác nhận (thay confirm() gốc): Promise<boolean>
  function confirmPopup(o) {
    o = o || {};
    if (automated()) return Promise.resolve(true);
    var tone = o.tone || 'warn';
    return open({
      tone: tone, icon: o.icon, title: o.title, body: o.body, dismissible: true, force: true,
      actions: [
        { label: o.cancelLabel || 'Huỷ', value: false },
        { label: o.confirmLabel || 'Đồng ý', value: true, danger: tone === 'warn', primary: tone !== 'warn' }
      ]
    }).then(function (v) { return v === true; });
  }

  // Popup chỉ hiện tối đa max lần (đếm trong localStorage, khoá ep_pop_<key>)
  function seen(key) { try { return Number(root.localStorage.getItem('ep_pop_' + key) || 0); } catch (e) { return 0; } }
  function once(key, max, fn) {
    if (automated() || seen(key) >= (max || 1)) return false;
    try { root.localStorage.setItem('ep_pop_' + key, String(seen(key) + 1)); } catch (e) {}
    fn();
    return true;
  }

  EP.popup = { open: open, confirm: confirmPopup, once: once, seen: seen, automated: automated, isOpen: function () { return openCount > 0; } };
})(window);
