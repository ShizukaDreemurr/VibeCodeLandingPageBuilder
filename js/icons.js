/* icons.js — một bộ icon nét (outline 1.5px, khung 24) dùng chung cho app và landing page.
   EP.icon('plus') trả về <svg>; trong HTML viết <span data-icon="plus"></span> rồi EP.icons.hydrate(). */
(function (root) {
  var P = {
    plus: '<path d="M12 5v14M5 12h14"/>',
    'arrow-left': '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
    redo: '<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>',
    monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
    tablet: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M12 18h.01"/>',
    phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M12 18h.01"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    grip: '<circle cx="9" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="18" r="1"/>',
    'chevron-up': '<path d="m18 15-6-6-6 6"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    'eye-off': '<path d="m3 3 18 18"/><path d="M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3 3.8"/><path d="M6.6 6.6C3.9 8.4 2 12 2 12s3.5 7 10 7c1.9 0 3.5-.5 4.9-1.3"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    reset: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
    pencil: '<path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    palette: '<path d="M12 3a9 9 0 1 0 0 18c1 0 1.5-.8 1.5-1.5 0-.9-.7-1.2-.7-2 0-.8.7-1.5 1.5-1.5H17a4 4 0 0 0 4-4c0-4.4-4-9-9-9z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10.5" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
    send: '<path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4z"/>',
    droplet: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    alert: '<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
    external: '<path d="M15 3h6v6M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    pin: '<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
    wand: '<path d="m3 21 12-12M14 4l1-2 1 2 2 1-2 1-1 2-1-2-2-1zM19 11l.7-1.3L21 9l-1.3-.7L19 7l-.7 1.3L17 9l1.3.7z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    'align-left': '<path d="M3 6h18M3 12h12M3 18h16"/>',
    'align-center': '<path d="M3 6h18M6 12h12M4 18h16"/>',
    'align-right': '<path d="M3 6h18M9 12h12M5 18h16"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
    'arrow-up': '<path d="M12 19V5M5 12l7-7 7 7"/>',
    'arrow-down': '<path d="M12 5v14M19 12l-7 7-7-7"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'
  };

  function icon(name, size) {
    var s = size || 16;
    return '<svg class="ic" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (P[name] || '') + '</svg>';
  }
  // Tạo node (dùng trong JS dựng giao diện)
  function node(name, size) {
    var t = document.createElement('span');
    t.innerHTML = icon(name, size);
    return t.firstChild;
  }
  function hydrate(ctx) {
    (ctx || document).querySelectorAll('[data-icon]').forEach(function (el) {
      if (el.firstChild && el.firstChild.nodeName === 'svg') return;
      el.insertAdjacentHTML('afterbegin', icon(el.getAttribute('data-icon'), Number(el.getAttribute('data-size')) || 16));
    });
  }

  root.EP = root.EP || {};
  root.EP.icon = icon;
  root.EP.icons = { svg: icon, node: node, hydrate: hydrate, names: Object.keys(P) };
})(typeof window !== 'undefined' ? window : globalThis);
