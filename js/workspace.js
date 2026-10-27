/*
 * workspace.js — trang Thiết kế như một phần mềm: panel là "cửa sổ" có thể
 *   - neo (dock) vào cột trái / phải, kéo vạch chia để đổi độ rộng cột;
 *   - gộp nhiều panel thành tab trong một nhóm (kéo tab thả lên đầu nhóm khác);
 *   - thả nổi, kéo đi khắp màn hình, kéo góc để đổi kích thước, bấm để đưa lên trên;
 *   - ẩn / hiện qua menu Cửa sổ; bố cục được lưu trong trình duyệt.
 * Thanh menu (Tệp / Sửa / Xem / Cửa sổ / Trợ giúp) do app.js truyền cấu hình vào.
 * Màn hình hẹp (< 1100px): tắt chế độ cửa sổ, các panel xếp dọc dưới bản xem trước.
 */
(function (root) {
  var KEY = 'ep_ws_layout';
  var DEFAULT = {
    left: { w: 280, groups: [{ tabs: ['layout'], active: 'layout' }] },
    right: { w: 320, groups: [{ tabs: ['style', 'publish'], active: 'style' }] },
    float: [],
    hidden: []
  };
  var MIN_W = 220, MAX_W = 560;
  var ws, stash, panels = {}, layout, zTop = 20, onChange = function () {};

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function icon(name) { return root.EP.icon ? root.EP.icon(name, 14) : ''; }
  function narrow() { return root.innerWidth < 1100; }

  function load() {
    try {
      var saved = JSON.parse(localStorage.getItem(KEY));
      if (saved && saved.left && saved.right) return sanitize(saved);
    } catch (e) { /* hỏng thì dùng mặc định */ }
    return clone(DEFAULT);
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(layout)); } catch (e) { /* bỏ qua */ } }

  // Mỗi panel xuất hiện đúng một chỗ; panel lạ bị bỏ, panel thiếu đưa về chỗ mặc định
  function sanitize(l) {
    var seen = {};
    function clean(groups) {
      return (groups || []).map(function (g) {
        g.tabs = (g.tabs || []).filter(function (t) { if (!panels[t] || seen[t]) return false; seen[t] = true; return true; });
        if (g.tabs.indexOf(g.active) < 0) g.active = g.tabs[0];
        return g;
      }).filter(function (g) { return g.tabs.length; });
    }
    l.left.groups = clean(l.left.groups);
    l.right.groups = clean(l.right.groups);
    l.float = clean(l.float);
    l.hidden = (l.hidden || []).filter(function (t) { if (!panels[t] || seen[t]) return false; seen[t] = true; return true; });
    Object.keys(panels).forEach(function (id) { if (!seen[id]) l.right.groups.push({ tabs: [id], active: id }); });
    l.left.w = clamp(l.left.w || 280, MIN_W, MAX_W);
    l.right.w = clamp(l.right.w || 320, MIN_W, MAX_W);
    return l;
  }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  // ---------- Tìm & gỡ panel khỏi chỗ hiện tại ----------
  function where(id) {
    var res = null;
    ['left', 'right'].forEach(function (side) {
      layout[side].groups.forEach(function (g, gi) { if (g.tabs.indexOf(id) >= 0) res = { side: side, list: layout[side].groups, g: g, gi: gi }; });
    });
    layout.float.forEach(function (g, gi) { if (g.tabs.indexOf(id) >= 0) res = { side: 'float', list: layout.float, g: g, gi: gi }; });
    if (layout.hidden.indexOf(id) >= 0) res = { side: 'hidden' };
    return res;
  }
  function detach(id) {
    var w = where(id);
    if (!w) return;
    if (w.side === 'hidden') { layout.hidden.splice(layout.hidden.indexOf(id), 1); return; }
    w.g.tabs.splice(w.g.tabs.indexOf(id), 1);
    if (!w.g.tabs.length) w.list.splice(w.gi, 1);
    else if (w.g.active === id) w.g.active = w.g.tabs[0];
  }

  // ---------- Thao tác công khai ----------
  function dock(id, side) {
    var from = where(id);
    detach(id);
    layout[side].groups.push({ tabs: [id], active: id });
    commit(id, from && from.side !== side);
  }
  function floatPanel(id, x, y) {
    var r = ws.getBoundingClientRect();
    detach(id);
    layout.float.push({ tabs: [id], active: id, x: x != null ? x : r.left + r.width / 2 - 160, y: y != null ? y : r.top + 60, w: 320, h: 460, z: ++zTop });
    commit(id, true);
  }
  function hide(id) {
    detach(id);
    layout.hidden.push(id);
    commit();
  }
  // Hiện panel (mở lại nếu đã ẩn) và chọn tab của nó
  function show(id) {
    if (!panels[id]) return;
    var w = where(id);
    if (!w || w.side === 'hidden') {
      detach(id);
      var side = layout.right.groups.length || !layout.left.groups.length ? 'right' : 'left';
      if (narrow()) side = 'right';
      layout[side].groups.push({ tabs: [id], active: id });
      w = where(id);
    }
    w.g.active = id;
    if (w.side === 'float') w.g.z = ++zTop;
    commit(id);
  }
  function isVisible(id) { var w = where(id); return !!w && w.side !== 'hidden'; }
  function reset() { layout = sanitize(clone(DEFAULT)); commit(); }
  function preset(name) {
    var all = Object.keys(panels);
    if (name === 'focus') { layout = sanitize({ left: { w: layout.left.w, groups: [] }, right: { w: layout.right.w, groups: [] }, float: [], hidden: all }); }
    else if (name === 'right') { layout = sanitize({ left: { w: 280, groups: [] }, right: { w: 340, groups: [{ tabs: all, active: all[0] }] }, float: [], hidden: [] }); }
    else if (name === 'split') { layout = sanitize({ left: { w: 280, groups: [{ tabs: ['layout'], active: 'layout' }, { tabs: ['publish'], active: 'publish' }] }, right: { w: 320, groups: [{ tabs: ['style'], active: 'style' }] }, float: [], hidden: [] }); }
    else layout = sanitize(clone(DEFAULT));
    commit();
  }

  function commit(flashId, moved) {
    save();
    render();
    if (flashId && moved) {
      var g = ws.querySelector('[data-panel="' + flashId + '"]');
      g = g && g.closest('.ws-group');
      if (g && root.EP.motion) root.EP.motion.replay(g, 'ws-arrive');
    }
    onChange();
  }

  // ---------- Vẽ ----------
  function render() {
    // Trả mọi panel về kho trước khi xếp lại (giữ nguyên DOM và sự kiện bên trong)
    Object.keys(panels).forEach(function (id) { stash.appendChild(panels[id]); });
    ws.querySelectorAll('.ws-group').forEach(function (g) { g.remove(); });
    var isNarrow = narrow();
    ws.classList.toggle('is-narrow', isNarrow);
    ['left', 'right'].forEach(function (side) {
      var d = $('.ws-dock[data-dock="' + side + '"]', ws);
      var groups = layout[side].groups;
      d.hidden = !groups.length;
      $('.ws-splitter[data-split="' + side + '"]', ws).hidden = !groups.length;
      d.style.width = isNarrow ? '' : layout[side].w + 'px';
      groups.forEach(function (g) { d.appendChild(buildGroup(g, side)); });
    });
    layout.float.forEach(function (g) {
      if (isNarrow) { $('.ws-dock[data-dock="right"]', ws).appendChild(buildGroup(g, 'right')); $('.ws-dock[data-dock="right"]', ws).hidden = false; return; }
      var node = buildGroup(g, 'float');
      node.classList.add('is-floating');
      placeFloat(node, g);
      ws.appendChild(node);
    });
  }

  function placeFloat(node, g) {
    g.w = clamp(g.w || 320, 240, root.innerWidth - 16);
    g.h = clamp(g.h || 420, 160, root.innerHeight - 16);
    g.x = clamp(g.x, 8, root.innerWidth - 120);
    g.y = clamp(g.y, 8, root.innerHeight - 48);
    node.style.left = g.x + 'px';
    node.style.top = g.y + 'px';
    node.style.width = g.w + 'px';
    node.style.height = g.h + 'px';
    node.style.zIndex = g.z || 20;
  }

  function buildGroup(g, side) {
    var node = el('section', 'ws-group');
    node.setAttribute('aria-label', g.tabs.map(function (t) { return panels[t].getAttribute('data-title'); }).join(', '));
    var head = el('header', 'ws-ghead');
    var tabs = el('div', 'ws-tabs');
    tabs.setAttribute('role', 'tablist');
    g.tabs.forEach(function (id) {
      var t = el('button', 'ws-tab' + (g.active === id ? ' is-active' : ''), panels[id].getAttribute('data-title'));
      t.type = 'button';
      t.setAttribute('role', 'tab');
      t.setAttribute('aria-selected', g.active === id ? 'true' : 'false');
      t.setAttribute('data-tab-panel', id);
      t.title = 'Kéo để di chuyển panel này';
      t.addEventListener('click', function () { if (t._dragged) return; g.active = id; if (side === 'float') g.z = ++zTop; commit(); });
      t.addEventListener('pointerdown', function (e) { startDrag(e, g, id, node); });
      tabs.appendChild(t);
    });
    head.appendChild(tabs);
    var acts = el('div', 'ws-gacts');
    function act(name, label, fn) {
      var b = el('button', 'ws-act'); b.type = 'button'; b.innerHTML = icon(name);
      b.setAttribute('aria-label', label); b.title = label;
      b.addEventListener('click', function (e) { e.stopPropagation(); fn(); });
      acts.appendChild(b);
    }
    var cur = g.active;
    if (side !== 'left') act('dock-left', 'Neo sang trái', function () { dock(cur, 'left'); });
    if (side !== 'right') act('dock-right', 'Neo sang phải', function () { dock(cur, 'right'); });
    if (side !== 'float') act('float', 'Thả nổi thành cửa sổ', function () { var r = node.getBoundingClientRect(); floatPanel(cur, r.left - 40, r.top + 20); });
    act('x', 'Đóng panel (mở lại ở menu Cửa sổ)', function () { hide(cur); });
    head.appendChild(acts);
    head.addEventListener('pointerdown', function (e) { if (e.target === head || e.target === tabs) startDrag(e, g, null, node); });
    head.addEventListener('dblclick', function (e) { if (side === 'float' && (e.target === head || e.target === tabs)) dock(cur, 'right'); });
    node.appendChild(head);
    var body = el('div', 'ws-gbody');
    g.tabs.forEach(function (id) {
      panels[id].hidden = g.active !== id;
      body.appendChild(panels[id]);
    });
    node.appendChild(body);
    if (side === 'float') {
      var grip = el('div', 'ws-resize'); grip.setAttribute('aria-hidden', 'true');
      grip.addEventListener('pointerdown', function (e) { startResize(e, g, node); });
      node.appendChild(grip);
      node.addEventListener('pointerdown', function () { if (g.z !== zTop) { g.z = ++zTop; node.style.zIndex = g.z; save(); } });
    }
    return node;
  }

  // ---------- Kéo thả ----------
  var dropHint;
  function startDrag(e, g, tabId, node) {
    if (e.button !== 0 || narrow()) return;
    var sx = e.clientX, sy = e.clientY, moving = false, isFloat = node.classList.contains('is-floating');
    var r = node.getBoundingClientRect(), offX = sx - r.left, offY = sy - r.top;
    var wholeFloat = isFloat && (!tabId || g.tabs.length === 1);
    var ghost, target = null, lastX = sx, lastY = sy;
    function move(ev) {
      lastX = ev.clientX; lastY = ev.clientY;
      if (!moving) {
        if (Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) < 6) return;
        moving = true;
        document.body.classList.add('ws-dragging');
        if (!wholeFloat) {
          ghost = el('div', 'ws-ghost', tabId ? panels[tabId].getAttribute('data-title') : node.getAttribute('aria-label'));
          document.body.appendChild(ghost);
        }
        if (!dropHint) { dropHint = el('div', 'ws-drop'); document.body.appendChild(dropHint); }
      }
      ev.preventDefault();
      if (wholeFloat) {
        g.x = ev.clientX - offX; g.y = ev.clientY - offY;
        node.style.left = clamp(g.x, 8, root.innerWidth - 120) + 'px';
        node.style.top = clamp(g.y, 8, root.innerHeight - 48) + 'px';
      } else {
        ghost.style.left = ev.clientX + 12 + 'px';
        ghost.style.top = ev.clientY + 12 + 'px';
      }
      target = findTarget(ev.clientX, ev.clientY, g);
      showHint(target);
    }
    function up() {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      document.removeEventListener('pointercancel', up);
      if (!moving) return;
      if (tabId) { var tb = node.querySelector('[data-tab-panel="' + tabId + '"]'); if (tb) { tb._dragged = true; setTimeout(function () { tb._dragged = false; }, 0); } }
      document.body.classList.remove('ws-dragging');
      if (ghost) ghost.remove();
      showHint(null);
      var ids = tabId ? [tabId] : g.tabs.slice();
      if (target && target.type === 'dock') {
        ids.forEach(function (id) { detach(id); });
        layout[target.side].groups.splice(target.index, 0, { tabs: ids, active: tabId || g.active });
        commit(ids[0], true);
      } else if (target && target.type === 'merge') {
        ids.forEach(function (id) { detach(id); target.group.tabs.push(id); });
        target.group.active = ids[0];
        commit(ids[0], true);
      } else if (wholeFloat) {
        save();
      } else {
        ids.forEach(function (id) { detach(id); });
        layout.float.push({ tabs: ids, active: tabId || g.active, x: lastX - 40, y: lastY - 16, w: Math.max(280, r.width), h: Math.min(Math.max(320, r.height), root.innerHeight - 80), z: ++zTop });
        commit(ids[0], true);
      }
    }
    document.addEventListener('pointermove', move, { passive: false });
    document.addEventListener('pointerup', up);
    document.addEventListener('pointercancel', up);
  }

  // Đích thả: đầu nhóm khác (gộp tab) > cột neo (gần mép hoặc trên cột) > thả nổi
  function findTarget(x, y, self) {
    var heads = ws.querySelectorAll('.ws-ghead');
    for (var i = 0; i < heads.length; i++) {
      var hr = heads[i].getBoundingClientRect();
      if (x >= hr.left && x <= hr.right && y >= hr.top && y <= hr.bottom) {
        var grp = groupOf(heads[i].parentNode);
        if (grp && grp !== self) return { type: 'merge', group: grp, rect: heads[i].parentNode.getBoundingClientRect() };
      }
    }
    var wr = ws.getBoundingClientRect();
    var sides = ['left', 'right'];
    for (var k = 0; k < sides.length; k++) {
      var side = sides[k];
      var d = $('.ws-dock[data-dock="' + side + '"]', ws);
      var dr = d.hidden ? null : d.getBoundingClientRect();
      var nearEdge = side === 'left' ? x < wr.left + 48 : x > wr.right - 48;
      var overDock = dr && x >= dr.left && x <= dr.right && y >= dr.top && y <= dr.bottom;
      if (nearEdge || overDock) {
        // Chèn trên/dưới các nhóm đang neo tuỳ vị trí con trỏ
        var groups = d.querySelectorAll('.ws-group'), index = groups.length;
        for (var j = 0; j < groups.length; j++) { var gr = groups[j].getBoundingClientRect(); if (y < gr.top + gr.height / 2) { index = j; break; } }
        var rect = dr && dr.width ? dr : { left: side === 'left' ? wr.left : wr.right - 300, top: wr.top, width: 300, height: wr.height };
        return { type: 'dock', side: side, index: index, rect: rect };
      }
    }
    return null;
  }
  function groupOf(node) {
    var label = node.querySelector('.ws-tab');
    var id = label && label.getAttribute('data-tab-panel');
    var w = id && where(id);
    return w ? w.g : null;
  }
  function showHint(t) {
    if (!dropHint) return;
    if (!t) { dropHint.hidden = true; return; }
    var r = t.rect;
    dropHint.hidden = false;
    dropHint.className = 'ws-drop is-' + t.type;
    dropHint.style.left = r.left + 'px'; dropHint.style.top = r.top + 'px';
    dropHint.style.width = r.width + 'px'; dropHint.style.height = (t.type === 'merge' ? r.height : r.height) + 'px';
  }

  function startResize(e, g, node) {
    e.preventDefault(); e.stopPropagation();
    var sx = e.clientX, sy = e.clientY, w0 = node.offsetWidth, h0 = node.offsetHeight;
    function move(ev) {
      g.w = clamp(w0 + ev.clientX - sx, 240, root.innerWidth - g.x - 8);
      g.h = clamp(h0 + ev.clientY - sy, 160, root.innerHeight - g.y - 8);
      node.style.width = g.w + 'px'; node.style.height = g.h + 'px';
    }
    function up() { document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up); document.body.classList.remove('ws-resizing'); save(); onChange(); }
    document.body.classList.add('ws-resizing');
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  }

  // Vạch chia: kéo để đổi độ rộng cột neo; bàn phím ← → cũng được
  function bindSplitters() {
    ws.querySelectorAll('.ws-splitter').forEach(function (sp) {
      var side = sp.getAttribute('data-split');
      sp.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        var sx = e.clientX, w0 = layout[side].w, d = $('.ws-dock[data-dock="' + side + '"]', ws);
        sp.classList.add('is-active'); document.body.classList.add('ws-resizing-col');
        function move(ev) {
          var dx = ev.clientX - sx;
          layout[side].w = clamp(side === 'left' ? w0 + dx : w0 - dx, MIN_W, MAX_W);
          d.style.width = layout[side].w + 'px';
          onChange();
        }
        function up() { sp.classList.remove('is-active'); document.body.classList.remove('ws-resizing-col'); document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up); save(); onChange(); }
        document.addEventListener('pointermove', move);
        document.addEventListener('pointerup', up);
      });
      sp.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        e.preventDefault();
        var step = (e.key === 'ArrowRight' ? 16 : -16) * (side === 'left' ? 1 : -1);
        layout[side].w = clamp(layout[side].w + step, MIN_W, MAX_W);
        $('.ws-dock[data-dock="' + side + '"]', ws).style.width = layout[side].w + 'px';
        save(); onChange();
      });
      sp.addEventListener('dblclick', function () { layout[side].w = DEFAULT[side].w; commit(); });
    });
  }

  // ---------- Thanh menu ----------
  function buildMenubar(bar, menus) {
    bar.innerHTML = '';
    var openIdx = -1, roots = [];
    function close() { roots.forEach(function (r) { r.btn.setAttribute('aria-expanded', 'false'); r.list.hidden = true; }); openIdx = -1; }
    function open(i, focusFirst) {
      close();
      openIdx = i;
      var r = roots[i];
      fill(r.list, menus[i].items);
      r.btn.setAttribute('aria-expanded', 'true');
      r.list.hidden = false;
      if (focusFirst) { var f = r.list.querySelector('[role="menuitem"]:not([disabled]),[role="menuitemcheckbox"]:not([disabled])'); if (f) f.focus(); }
    }
    function fill(list, items) {
      list.innerHTML = '';
      (typeof items === 'function' ? items() : items).forEach(function (it) {
        if (it === '-') { var hr = el('div', 'mb-sep'); hr.setAttribute('role', 'separator'); list.appendChild(hr); return; }
        if (it.heading) { list.appendChild(el('div', 'mb-heading', it.heading)); return; }
        var checked = typeof it.checked === 'function' ? it.checked() : it.checked;
        var b = el('button', 'mb-item');
        b.type = 'button';
        b.setAttribute('role', checked != null ? 'menuitemcheckbox' : 'menuitem');
        if (checked != null) b.setAttribute('aria-checked', checked ? 'true' : 'false');
        b.disabled = typeof it.disabled === 'function' ? it.disabled() : !!it.disabled;
        var mark = el('span', 'mb-check'); if (checked) mark.innerHTML = icon('check2');
        b.appendChild(mark);
        b.appendChild(el('span', 'mb-label', it.label));
        if (it.shortcut) b.appendChild(el('kbd', 'mb-kbd', it.shortcut));
        b.addEventListener('click', function () { close(); it.action(); });
        list.appendChild(b);
      });
    }
    menus.forEach(function (m, i) {
      var wrap = el('div', 'mb-root');
      var btn = el('button', 'mb-btn', m.label);
      btn.type = 'button';
      btn.setAttribute('aria-haspopup', 'menu');
      btn.setAttribute('aria-expanded', 'false');
      var list = el('div', 'mb-menu');
      list.setAttribute('role', 'menu');
      list.hidden = true;
      btn.addEventListener('click', function () { if (openIdx === i) close(); else open(i); });
      btn.addEventListener('mouseenter', function () { if (openIdx >= 0 && openIdx !== i) open(i); });
      btn.addEventListener('keydown', function (e) { if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i, true); } });
      list.addEventListener('keydown', function (e) {
        var items = Array.prototype.slice.call(list.querySelectorAll('button:not([disabled])'));
        var k = items.indexOf(document.activeElement);
        if (e.key === 'ArrowDown') { e.preventDefault(); (items[k + 1] || items[0]).focus(); }
        if (e.key === 'ArrowUp') { e.preventDefault(); (items[k - 1] || items[items.length - 1]).focus(); }
        if (e.key === 'ArrowRight') { e.preventDefault(); open((i + 1) % menus.length, true); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); open((i - 1 + menus.length) % menus.length, true); }
        if (e.key === 'Escape') { e.preventDefault(); close(); btn.focus(); }
      });
      wrap.appendChild(btn); wrap.appendChild(list);
      bar.appendChild(wrap);
      roots.push({ btn: btn, list: list });
    });
    document.addEventListener('pointerdown', function (e) { if (openIdx >= 0 && !bar.contains(e.target)) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && openIdx >= 0) close(); });
  }

  function init(opts) {
    ws = opts.root;
    stash = opts.stash;
    onChange = opts.onChange || onChange;
    stash.querySelectorAll('.ws-panel').forEach(function (p) { panels[p.getAttribute('data-panel')] = p; });
    layout = load();
    layout.float.forEach(function (g) { zTop = Math.max(zTop, g.z || 0); });
    bindSplitters();
    if (opts.menubar) buildMenubar(opts.menubar, opts.menus || []);
    var lastNarrow = narrow();
    root.addEventListener('resize', function () {
      if (narrow() !== lastNarrow) { lastNarrow = narrow(); render(); }
      else ws.querySelectorAll('.ws-group.is-floating').forEach(function (n) { var g = groupOf(n); if (g) placeFloat(n, g); });
      onChange();
    });
    render();
  }

  root.EP = root.EP || {};
  root.EP.workspace = {
    init: init, show: show, hide: hide, dock: dock, float: floatPanel, reset: reset, preset: preset,
    isVisible: isVisible, toggle: function (id) { if (isVisible(id)) hide(id); else show(id); },
    panels: function () { return Object.keys(panels).map(function (id) { return { id: id, title: panels[id].getAttribute('data-title') }; }); },
    layout: function () { return clone(layout); }
  };
})(typeof window !== 'undefined' ? window : globalThis);
