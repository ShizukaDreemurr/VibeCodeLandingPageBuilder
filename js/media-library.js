/*
 * media-library.js — Thư viện ảnh dùng chung (kiểu Canva).
 * Ảnh tải lên được nén (≤2000px, WebP/JPEG) và lưu trong IndexedDB để dùng lại ở mọi sự kiện.
 * EP.media.open() → Promise<File|null>: người dùng chọn 1 ảnh (hoặc tải ảnh mới) rồi quy trình cắt/nén của từng ô ảnh chạy tiếp.
 * Không có IndexedDB (chế độ riêng tư…) → giữ tạm trong bộ nhớ của tab, có báo cho người dùng.
 */
(function (root) {
  var DB = 'ep-media', STORE = 'images', MAX_SIDE = 2000, MAX_INPUT = 25 * 1024 * 1024;
  var DEMOS = [['moc-hero', 'Quán cà phê'], ['moc-about', 'Giới thiệu'], ['moc-acoustic', 'Acoustic'], ['moc-barista', 'Barista'], ['moc-beans', 'Hạt cà phê'], ['moc-gift', 'Quà tặng'], ['moc-opening', 'Khai trương'], ['moc-tasting', 'Thử vị']];

  var dbp = null, mem = [], memMode = false;
  function openDb() {
    if (dbp) return dbp;
    dbp = new Promise(function (resolve) {
      try {
        if (!root.indexedDB) throw new Error('no idb');
        var rq = root.indexedDB.open(DB, 1);
        rq.onupgradeneeded = function () { rq.result.createObjectStore(STORE, { keyPath: 'id' }); };
        rq.onsuccess = function () { resolve(rq.result); };
        rq.onerror = rq.onblocked = function () { memMode = true; resolve(null); };
      } catch (e) { memMode = true; resolve(null); }
    });
    return dbp;
  }
  function tx(mode, fn) {
    return openDb().then(function (db) {
      if (!db) return null;
      return new Promise(function (resolve, reject) {
        var t = db.transaction(STORE, mode), req = fn(t.objectStore(STORE));
        t.oncomplete = function () { resolve(req ? req.result : null); };
        t.onerror = t.onabort = function () { reject(t.error || new Error('Không ghi được thư viện ảnh.')); };
      });
    });
  }
  function list() {
    return tx('readonly', function (s) { return s.getAll(); }).then(function (r) { return memMode ? mem.slice() : (r || []); });
  }
  function put(rec) {
    return openDb().then(function (db) {
      if (!db) { mem = mem.filter(function (x) { return x.id !== rec.id; }); mem.push(rec); return rec; }
      return tx('readwrite', function (s) { return s.put(rec); }).then(function () { return rec; });
    });
  }
  function remove(id) {
    return openDb().then(function (db) {
      if (!db) { mem = mem.filter(function (x) { return x.id !== id; }); return; }
      return tx('readwrite', function (s) { return s.delete(id); });
    });
  }
  function rename(id, name) {
    return list().then(function (all) {
      var rec = all.filter(function (x) { return x.id === id; })[0];
      if (!rec) return null;
      rec.name = name; return put(rec);
    });
  }

  function srcOf(r) { return r && r.source === 'ai' ? 'ai' : 'upload'; } // bản ghi cũ không có source = ảnh tải lên
  function uid() { return 'm' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function checkFile(f) {
    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) return 'Chỉ nhận ảnh JPG, PNG hoặc WebP: ' + f.name;
    if (f.size > MAX_INPUT) return 'Ảnh quá lớn (tối đa 25MB): ' + f.name;
    return '';
  }
  // Nén về ≤2000px: WebP nếu trình duyệt xuất được, không thì JPEG (PNG nhỏ giữ PNG để không mất nền trong suốt)
  function compress(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file), img = new Image();
      img.onload = function () {
        URL.revokeObjectURL(url);
        var w = img.naturalWidth, h = img.naturalHeight, k = Math.min(1, MAX_SIDE / Math.max(w, h));
        var tw = Math.max(1, Math.round(w * k)), th = Math.max(1, Math.round(h * k));
        var webp = root.EP && root.EP.images && root.EP.images.webp;
        if (k === 1 && file.type === 'image/webp' && file.size < 600 * 1024) return resolve({ blob: file, w: w, h: h });
        var c = document.createElement('canvas'); c.width = tw; c.height = th;
        var ctx = c.getContext('2d'); ctx.imageSmoothingQuality = 'high';
        var type = webp ? 'image/webp' : (file.type === 'image/png' && file.size < 1.5 * 1024 * 1024 ? 'image/png' : 'image/jpeg');
        if (type === 'image/jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, tw, th); }
        ctx.drawImage(img, 0, 0, tw, th);
        c.toBlob(function (b) {
          if (!b) return reject(new Error('Không xử lý được ảnh: ' + file.name));
          resolve({ blob: (b.size >= file.size && k === 1) ? file : b, w: tw, h: th });
        }, type, 0.86);
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('Không đọc được ảnh: ' + file.name)); };
      img.src = url;
    });
  }
  function add(file, source) {
    var bad = checkFile(file);
    if (bad) return Promise.reject(new Error(bad));
    return compress(file).then(function (r) {
      var name = (file.name || 'anh').replace(/\.[a-z0-9]+$/i, '');
      return put({ id: uid(), source: source === 'ai' ? 'ai' : 'upload', name: name, blob: r.blob, type: r.blob.type, size: r.blob.size, w: r.w, h: r.h, createdAt: Date.now() });
    });
  }

  function fmtSize(n) { return n >= 1048576 ? (n / 1048576).toFixed(1).replace('.', ',') + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB'; }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function ic(n) { return root.EP && root.EP.icon ? root.EP.icon(n) : ''; }

  // Tỉ lệ ảnh theo ô ảnh đích
  var SLOT_RATIO = { hero: '16:9', about: '4:3', offer: '1:1', gallery: '4:3', og: '16:9', avatar: '1:1', logo: '1:1' };
  var SLOT_DESC = { hero: 'ảnh bìa trang đăng ký, bố cục rộng, chừa khoảng trống ở một bên để đặt tiêu đề', about: 'ảnh minh hoạ phần giới thiệu, bố cục cân đối', offer: 'ảnh sản phẩm/quà tặng chụp cận, nền gọn, chủ thể ở giữa', gallery: 'ảnh không khí sự kiện cho album', og: 'ảnh chia sẻ mạng xã hội, chủ thể rõ ở giữa', avatar: 'chân dung gọn, nền đơn giản', logo: 'biểu tượng đơn giản trên nền phẳng' };
  function currentEvent() {
    try {
      var S = root.EP.storage, all = S.read('events', {}), id = S.read('current_id', ''), st = all && all[id];
      return (st && st.event) || null;
    } catch (e) { return null; }
  }
  // Soạn prompt tiếng Việt chi tiết, ảnh chân thực, từ thông tin sự kiện đang mở
  function suggestPrompt(slot, ratio) {
    var ev = currentEvent() || {}, tpl = '';
    try { (root.EP.templateData || []).forEach(function (t) { if (t.id === ev.templateId) tpl = t.name; }); } catch (e) { /* bỏ qua */ }
    var br = ev.brand || {}, st = ev.style || {}, cols = [st.primary || br.primary, st.accent || br.accent].filter(Boolean);
    var mood = ev.tone === 'young' ? 'trẻ trung, năng động, ấm áp' : 'trang trọng, chuyên nghiệp, tinh tế';
    var p = 'Ảnh chụp chân thực, chất lượng nhiếp ảnh sự kiện chuyên nghiệp, ánh sáng tự nhiên, chi tiết sắc nét. ';
    p += 'Chủ đề: ' + (ev.name ? 'sự kiện "' + ev.name + '"' : 'một sự kiện tại Việt Nam') + (tpl ? ' (loại hình: ' + tpl + ')' : '') + '. ';
    if (ev.location) p += 'Bối cảnh gợi nhớ địa điểm: ' + ev.location + '. ';
    p += 'Không khí ' + mood + '. ';
    if (cols.length) p += 'Tông màu chủ đạo gần với ' + cols.join(' và ') + '. ';
    p += 'Mục đích: ' + (SLOT_DESC[slot] || SLOT_DESC.hero) + ', khổ ' + (ratio || SLOT_RATIO[slot] || '16:9') + '. ';
    p += 'Người Việt Nam, không có chữ, logo hay watermark trong ảnh.';
    return p;
  }

  var active = null;
  // Mở thư viện. Trả về Promise<File|null> — null nếu đóng mà không chọn.
  function open(opts) {
    if (active) return active;
    opts = opts || {};
    var urls = [], tab = 'mine', query = '', sortBy = 'new', items = [], settled = false, resolveFn;
    var promise = new Promise(function (r) { resolveFn = r; });
    var dlg = el('dialog', 'ml-dialog'); dlg.setAttribute('aria-labelledby', 'ml-title');
    var head = el('div', 'ml-head'), title = el('h2', '', 'Thư viện ảnh'); title.id = 'ml-title';
    var closeBtn = el('button', 'btn btn-ghost ml-close'); closeBtn.type = 'button'; closeBtn.setAttribute('aria-label', 'Đóng'); closeBtn.innerHTML = '&times;';
    head.appendChild(title); head.appendChild(closeBtn);
    var tabs = el('div', 'ml-tabs'); tabs.setAttribute('role', 'tablist');
    var tabMine = el('button', 'ml-tab', 'Ảnh tải lên'), tabDemo = el('button', 'ml-tab', 'Ảnh mẫu'), tabAi = el('button', 'ml-tab', 'Tạo bằng AI'), tabGal = el('button', 'ml-tab', 'Ảnh AI');
    var TABS = [['mine', tabMine], ['aigal', tabGal], ['demo', tabDemo], ['ai', tabAi]];
    [tabMine, tabGal, tabDemo, tabAi].forEach(function (t) { t.type = 'button'; t.setAttribute('role', 'tab'); tabs.appendChild(t); });
    var bar = el('div', 'ml-bar');
    var up = el('button', 'btn btn-primary ml-upload'); up.type = 'button'; up.innerHTML = ic('image') + 'Tải ảnh lên';
    var file = document.createElement('input'); file.type = 'file'; file.multiple = true; file.hidden = true; file.accept = 'image/jpeg,image/png,image/webp';
    var search = el('input', 'ml-search'); search.type = 'search'; search.placeholder = 'Tìm theo tên ảnh'; search.setAttribute('aria-label', 'Tìm ảnh');
    var sort = el('select', 'ml-sort'); sort.setAttribute('aria-label', 'Sắp xếp');
    [['new', 'Mới nhất'], ['old', 'Cũ nhất'], ['name', 'Tên A–Z'], ['size', 'Dung lượng lớn nhất']].forEach(function (o) { var op = el('option', '', o[1]); op.value = o[0]; sort.appendChild(op); });
    bar.appendChild(up); bar.appendChild(file); bar.appendChild(search); bar.appendChild(sort);
    var msg = el('p', 'ml-msg'); msg.setAttribute('role', 'status');
    var body = el('div', 'ml-body'), foot = el('p', 'ml-foot');
    var drop = el('div', 'ml-drop', 'Thả ảnh vào đây để tải lên'); drop.hidden = true;
    [head, tabs, bar, msg, body, foot, drop].forEach(function (n) { dlg.appendChild(n); });
    document.body.appendChild(dlg);

    function finish(f) {
      if (settled) return; settled = true;
      urls.forEach(function (u) { URL.revokeObjectURL(u); });
      if (dlg.open) dlg.close();
      dlg.remove(); active = null; resolveFn(f || null);
    }
    function say(t, err) { msg.textContent = t || ''; msg.classList.toggle('is-err', !!err); }
    function toFile(blob, name) { return new File([blob], name, { type: blob.type || 'image/webp' }); }
    function choose(rec) { finish(toFile(rec.blob, rec.name + '.' + (rec.type === 'image/png' ? 'png' : rec.type === 'image/jpeg' ? 'jpg' : 'webp'))); }
    function chooseDemo(d) {
      say('Đang tải ảnh mẫu…');
      fetch('assets/demo/' + d[0] + '.webp').then(function (r) { if (!r.ok) throw new Error(); return r.blob(); })
        .then(function (b) { finish(toFile(b, d[0] + '.webp')); }).catch(function () { say('Không tải được ảnh mẫu.', true); });
    }

    function render(focusId) {
      TABS.forEach(function (t) { var on = tab === t[0]; t[1].setAttribute('aria-selected', String(on)); t[1].tabIndex = on ? 0 : -1; t[1].classList.toggle('is-on', on); });
      var nUp = items.filter(function (r) { return srcOf(r) === 'upload'; }).length, nAi = items.length - nUp;
      tabMine.textContent = 'Ảnh tải lên (' + nUp + ')'; tabGal.textContent = 'Ảnh AI (' + nAi + ')';
      sort.hidden = tab !== 'mine' && tab !== 'aigal'; bar.hidden = tab === 'ai'; up.hidden = tab === 'aigal';
      urls.forEach(function (u) { URL.revokeObjectURL(u); }); urls = [];
      body.innerHTML = '';
      if (tab === 'ai') { body.appendChild(aiPanel()); foot.textContent = 'Ảnh AI chỉ mang tính minh hoạ. Hãy ghi chú "Ảnh minh hoạ tạo bằng AI" khi đăng công khai.'; return; }
      var q = query.trim().toLowerCase(), grid = el('div', 'ml-grid'); grid.setAttribute('role', 'grid'); grid.setAttribute('aria-label', tab === 'mine' ? 'Ảnh tải lên' : tab === 'aigal' ? 'Ảnh AI' : 'Ảnh mẫu');
      if (tab === 'demo') {
        DEMOS.filter(function (d) { return !q || d[1].toLowerCase().indexOf(q) >= 0; }).forEach(function (d) {
          var b = el('button', 'ml-item'); b.type = 'button'; b.setAttribute('aria-label', 'Chọn ảnh mẫu ' + d[1]);
          var im = el('img'); im.src = 'assets/demo/' + d[0] + '.webp'; im.alt = ''; im.loading = 'lazy';
          b.appendChild(im); b.appendChild(el('span', 'ml-name', d[1]));
          b.addEventListener('click', function () { chooseDemo(d); });
          grid.appendChild(b);
        });
        if (!grid.children.length) body.appendChild(el('p', 'ml-empty', 'Không có ảnh mẫu phù hợp.'));
        else body.appendChild(grid);
        foot.textContent = 'Ảnh mẫu miễn phí, dùng thoải mái.';
        return;
      }
      var want = tab === 'aigal' ? 'ai' : 'upload';
      var shown = items.filter(function (r) { return srcOf(r) === want && (!q || r.name.toLowerCase().indexOf(q) >= 0); });
      shown.sort(function (a, b) { return sortBy === 'old' ? a.createdAt - b.createdAt : sortBy === 'name' ? a.name.localeCompare(b.name, 'vi') : sortBy === 'size' ? b.size - a.size : b.createdAt - a.createdAt; });
      if (!shown.length) {
        var e = el('div', 'ml-empty'); e.innerHTML = ic('image');
        var have = items.some(function (r) { return srcOf(r) === want; });
        e.appendChild(el('p', '', have ? 'Không tìm thấy ảnh nào.' : want === 'ai' ? 'Chưa có ảnh AI nào. Vào tab "Tạo bằng AI" để tạo ảnh; ảnh tạo ra được lưu ở đây.' : 'Chưa có ảnh nào. Bấm "Tải ảnh lên" hoặc kéo thả ảnh vào đây. Ảnh được lưu để dùng lại cho mọi sự kiện.'));
        body.appendChild(e);
      } else {
        shown.forEach(function (r) { grid.appendChild(card(r)); });
        body.appendChild(grid);
      }
      var mine = items.filter(function (r) { return srcOf(r) === want; }), total = mine.reduce(function (s, r) { return s + r.size; }, 0);
      foot.textContent = mine.length + ' ảnh · đã dùng ' + fmtSize(total) + (memMode ? ' · Trình duyệt không cho lưu lâu dài, ảnh chỉ giữ đến khi đóng tab.' : '');
      if (focusId) { var f = body.querySelector('[data-id="' + focusId + '"] .ml-item'); if (f) f.focus(); }
    }
    function card(r) {
      var wrap = el('div', 'ml-card'); wrap.setAttribute('role', 'row'); wrap.setAttribute('data-id', r.id);
      var b = el('button', 'ml-item'); b.type = 'button'; b.setAttribute('role', 'gridcell');
      b.setAttribute('aria-label', 'Chọn ảnh ' + r.name + ', ' + fmtSize(r.size));
      var im = el('img'); var u = URL.createObjectURL(r.blob); urls.push(u); im.src = u; im.alt = ''; im.loading = 'lazy';
      var nm = el('span', 'ml-name', r.name), meta = el('span', 'ml-meta', fmtSize(r.size) + ' · ' + r.w + '×' + r.h);
      b.appendChild(im); b.appendChild(nm); b.appendChild(meta);
      if (srcOf(r) === 'ai') { var bd = el('span', 'ml-badge', 'AI'); bd.setAttribute('aria-hidden', 'true'); b.appendChild(bd); }
      b.addEventListener('click', function () { choose(r); });
      var more = el('button', 'ml-more'); more.type = 'button'; more.textContent = '⋯'; more.setAttribute('aria-label', 'Tuỳ chọn cho ảnh ' + r.name); more.setAttribute('aria-haspopup', 'menu'); more.setAttribute('aria-expanded', 'false');
      more.addEventListener('click', function (ev) { ev.stopPropagation(); toggleMenu(wrap, more, r, nm); });
      wrap.appendChild(b); wrap.appendChild(more);
      return wrap;
    }
    function closeMenus() { dlg.querySelectorAll('.ml-menu').forEach(function (m) { var o = m.parentNode && m.parentNode.querySelector('.ml-more'); m.remove(); if (o) o.setAttribute('aria-expanded', 'false'); }); }
    function toggleMenu(wrap, more, r, nm) {
      var had = wrap.querySelector('.ml-menu'); closeMenus(); if (had) return;
      var m = el('div', 'ml-menu'); m.setAttribute('role', 'menu'); more.setAttribute('aria-expanded', 'true');
      var rn = el('button', '', 'Đổi tên'), del = el('button', 'is-danger', 'Xoá');
      [rn, del].forEach(function (x) { x.type = 'button'; x.setAttribute('role', 'menuitem'); m.appendChild(x); });
      rn.addEventListener('click', function () {
        closeMenus();
        var inp = el('input', 'ml-rename'); inp.type = 'text'; inp.value = r.name; inp.setAttribute('aria-label', 'Tên ảnh'); inp.maxLength = 80;
        nm.replaceWith(inp); inp.focus(); inp.select();
        var done = false;
        function commit(save) {
          if (done) return; done = true;
          var v = inp.value.trim();
          if (save && v && v !== r.name) rename(r.id, v).then(function (rec) { if (rec) r.name = v; render(r.id); say('Đã đổi tên ảnh.'); });
          else render(r.id);
        }
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); commit(true); } else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); commit(false); } });
        inp.addEventListener('blur', function () { commit(true); });
      });
      del.addEventListener('click', function () {
        if (!del.getAttribute('data-sure')) { del.setAttribute('data-sure', '1'); del.textContent = 'Bấm lần nữa để xoá'; return; }
        remove(r.id).then(function () { items = items.filter(function (x) { return x.id !== r.id; }); render(); say('Đã xoá ảnh. Ảnh đang dùng trên trang không bị ảnh hưởng.'); });
      });
      wrap.appendChild(m); rn.focus();
      m.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.stopPropagation(); closeMenus(); more.focus(); } });
    }
    // ===== Tab "Tạo bằng AI" (Gemini ảnh / Imagen) =====
    var aiEl = null;
    function aiPanel() {
      if (aiEl) return aiEl;
      var AI = root.EP && root.EP.aiImage, S = root.EP && root.EP.storage;
      var wrap = aiEl = el('div', 'ml-ai');
      if (!AI) { wrap.appendChild(el('p', 'ml-empty', 'Chưa tải được mô-đun tạo ảnh AI.')); return wrap; }
      var slot = opts.slot || 'hero', ratio = SLOT_RATIO[slot] || '16:9';
      function row(label, ctrl, id) { var f = el('div', 'ml-ai-f'), l = el('label', '', label); l.htmlFor = id; ctrl.id = id; f.appendChild(l); f.appendChild(ctrl); return f; }
      var notice = el('p', 'ml-ai-note', 'Ảnh do AI tạo chỉ mang tính minh hoạ, có thể sai chi tiết và không phải ảnh thật của sự kiện. Hãy ghi rõ "Ảnh minh hoạ tạo bằng AI" khi đăng công khai.');
      var prompt = el('textarea', 'ml-ai-prompt'); prompt.rows = 4; prompt.maxLength = 1500; prompt.placeholder = 'Mô tả ảnh muốn tạo, ví dụ: hội trường workshop đông người, ánh sáng ấm, ảnh chụp thực tế…';
      var sug = el('button', 'btn btn-ghost ml-ai-sug'); sug.type = 'button'; sug.textContent = 'Gợi ý prompt từ sự kiện';
      var pf = row('Mô tả ảnh', prompt, 'ml-ai-prompt'); pf.appendChild(sug);
      var model = el('select', 'ml-ai-sel');
      AI.MODELS.forEach(function (m) { var o = el('option', '', m.label); o.value = m.id; o.title = m.note; model.appendChild(o); });
      var asp = el('select', 'ml-ai-sel');
      AI.RATIOS.forEach(function (r) { var o = el('option', '', r); o.value = r; asp.appendChild(o); });
      asp.value = ratio;
      var cnt = el('select', 'ml-ai-sel'); [1, 2, 3, 4].forEach(function (n) { var o = el('option', '', String(n)); o.value = n; cnt.appendChild(o); });
      var opt = el('div', 'ml-ai-opts');
      opt.appendChild(row('Model', model, 'ml-ai-model')); opt.appendChild(row('Tỉ lệ', asp, 'ml-ai-aspect')); opt.appendChild(row('Số ảnh', cnt, 'ml-ai-count'));
      var modelNote = el('p', 'ml-ai-hint');
      function syncNote() { var m = AI.MODELS.filter(function (x) { return x.id === model.value; })[0]; modelNote.textContent = (m ? m.note + '. ' : '') + 'Cần API key đã bật thanh toán (billing); gói miễn phí không tạo được ảnh.'; }
      model.addEventListener('change', syncNote); syncNote();
      var keyIn = el('input', 'ml-ai-key'); keyIn.type = 'password'; keyIn.autocomplete = 'off'; keyIn.placeholder = 'Dán Gemini API key';
      var saved = S ? S.read('gemini_key', '') : '';
      keyIn.value = saved || AI.getKey();
      var rc = el('input'); rc.type = 'checkbox'; rc.checked = !!saved;
      var rl = el('label', 'check'); rl.appendChild(rc); rl.appendChild(document.createTextNode(' Ghi nhớ key trên máy này'));
      var kf = row('Gemini API key', keyIn, 'ml-ai-keyin');
      var kh = el('p', 'ml-ai-hint'); kh.appendChild(document.createTextNode('Key chỉ lưu trong trình duyệt và chỉ gửi tới Google. '));
      var ka = el('a', '', 'Lấy key tại aistudio.google.com/apikey'); ka.href = 'https://aistudio.google.com/apikey'; ka.target = '_blank'; ka.rel = 'noopener noreferrer'; kh.appendChild(ka);
      kf.appendChild(rl); kf.appendChild(kh);
      var capL = el('label', 'check ml-ai-cap'), cap = el('input'); cap.type = 'checkbox'; capL.appendChild(cap); capL.appendChild(document.createTextNode(' In dòng "Ảnh minh hoạ tạo bằng AI" lên góc ảnh'));
      var go = el('button', 'btn btn-primary ml-ai-go'); go.type = 'button'; go.innerHTML = ic('wand') + 'Tạo ảnh';
      var err = el('p', 'ml-ai-err'); err.setAttribute('role', 'alert');
      var res = el('div', 'ml-grid ml-ai-res'); res.setAttribute('aria-live', 'polite');
      [notice, pf, opt, modelNote, kf, capL, go, err, res].forEach(function (n) { wrap.appendChild(n); });

      sug.addEventListener('click', function () { prompt.value = suggestPrompt(slot, asp.value); prompt.focus(); });
      function stamp(blob) {
        return new Promise(function (resolve) {
          var u = URL.createObjectURL(blob), im = new Image();
          im.onload = function () {
            URL.revokeObjectURL(u);
            try {
              var c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight;
              var x = c.getContext('2d'); x.drawImage(im, 0, 0);
              var fs = Math.max(12, Math.round(c.width / 60)), t = 'Ảnh minh hoạ tạo bằng AI';
              x.font = '600 ' + fs + 'px sans-serif'; var w = x.measureText(t).width + fs, h = fs * 1.7;
              x.fillStyle = 'rgba(0,0,0,.6)'; x.fillRect(fs / 2, c.height - h - fs / 2, w, h);
              x.fillStyle = '#fff'; x.textBaseline = 'middle'; x.fillText(t, fs, c.height - h / 2 - fs / 2);
              c.toBlob(function (b) { resolve(b || blob); }, 'image/png');
            } catch (e) { resolve(blob); }
          };
          im.onerror = function () { URL.revokeObjectURL(u); resolve(blob); };
          im.src = u;
        });
      }
      function b64Blob(b64, mime) { var bin = atob(b64), a = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i); return new Blob([a], { type: mime || 'image/png' }); }
      function showResult(r, stampIt) {
        var blob = b64Blob(r.base64, r.mime);
        return (stampIt ? stamp(blob) : Promise.resolve(blob)).then(function (b) {
          var ext = b.type === 'image/jpeg' ? 'jpg' : b.type === 'image/webp' ? 'webp' : 'png';
          var nm = 'AI – ' + prompt.value.trim().replace(/\s+/g, ' ').slice(0, 40);
          return add(new File([b], nm + '.' + ext, { type: b.type }), 'ai').catch(function () { return null; }).then(function (rec) {
            var card = el('div', 'ml-card'), btn = el('button', 'ml-item'); btn.type = 'button'; btn.setAttribute('aria-label', 'Dùng ảnh AI này cho ô ảnh');
            var im = el('img'); im.src = r.dataUrl; im.alt = 'Ảnh AI tạo từ mô tả'; btn.appendChild(im); btn.appendChild(el('span', 'ml-name', 'Dùng ảnh này'));
            btn.addEventListener('click', function () { if (rec) choose(rec); else finish(toFile(b, nm + '.' + ext)); });
            card.appendChild(btn); res.appendChild(card);
            return rec;
          });
        });
      }
      go.addEventListener('click', function () {
        var key = keyIn.value.trim();
        err.textContent = '';
        if (!prompt.value.trim()) { err.textContent = 'Hãy nhập mô tả ảnh hoặc bấm "Gợi ý prompt từ sự kiện".'; prompt.focus(); return; }
        if (!key) { err.textContent = 'Vui lòng dán Gemini API key (lấy tại aistudio.google.com/apikey).'; keyIn.focus(); return; }
        if (S) { if (rc.checked) S.write('gemini_key', key); else S.remove('gemini_key'); }
        go.disabled = true; go.setAttribute('aria-busy', 'true'); go.textContent = 'Đang tạo ảnh…'; res.innerHTML = '';
        for (var i = 0; i < +cnt.value; i++) res.appendChild(el('div', 'ml-ai-skel'));
        AI.generate(prompt.value, { model: model.value, aspectRatio: asp.value, count: +cnt.value, key: key }).then(function (out) {
          if (settled) return;
          res.innerHTML = '';
          return out.images.reduce(function (p, im) { return p.then(function () { return showResult(im, cap.checked); }); }, Promise.resolve()).then(function () {
            reload(); say('Đã tạo ' + out.images.length + ' ảnh và lưu vào tab "Ảnh AI" (tên bắt đầu bằng "AI –"). Bấm vào ảnh để dùng.');
            if (out.model !== model.value) err.textContent = 'Model đã chọn không còn hoạt động, đã dùng ' + out.model + '.';
          });
        }, function (e) { if (!settled) { res.innerHTML = ''; err.textContent = e.message; } })
          .then(function () { go.disabled = false; go.removeAttribute('aria-busy'); go.innerHTML = ic('wand') + 'Tạo ảnh'; });
      });
      return wrap;
    }
    var seq = 0;
    function reload(focusId) { var my = ++seq; return list().then(function (all) { if (my !== seq || settled) return; items = all; render(focusId); }); }

    function upload(files) {
      files = Array.prototype.slice.call(files || []);
      if (!files.length) return;
      tab = 'mine'; say('Đang xử lý ' + files.length + ' ảnh…');
      var added = [], errs = [];
      files.reduce(function (p, f) {
        return p.then(function () { return add(f).then(function (r) { added.push(r); }, function (e) { errs.push(e.message); }); });
      }, Promise.resolve()).then(function () {
        if (added.length === 1 && files.length === 1) return choose(added[0]); // 1 ảnh: dùng luôn cho ô đang mở
        return reload(added[0] && added[0].id).then(function () {
          say(added.length ? 'Đã tải lên ' + added.length + ' ảnh. Bấm vào ảnh để dùng.' + (errs.length ? ' ' + errs.join(' ') : '') : errs.join(' '), !added.length);
        });
      });
    }

    up.addEventListener('click', function () { file.value = ''; file.click(); });
    file.addEventListener('change', function () { upload(file.files); });
    search.addEventListener('input', function () { query = search.value; render(); });
    sort.addEventListener('change', function () { sortBy = sort.value; render(); });
    TABS.forEach(function (t) { t[1].addEventListener('click', function () { tab = t[0]; render(); if (tab === 'mine' || tab === 'aigal') reload(); }); });
    tabs.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        var i = TABS.map(function (t) { return t[0]; }).indexOf(tab), n = (i + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length;
        tab = TABS[n][0]; render(); TABS[n][1].focus();
      }
    });
    closeBtn.addEventListener('click', function () { finish(null); });
    dlg.addEventListener('cancel', function (e) { e.preventDefault(); finish(null); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) return finish(null); if (!e.target.closest('.ml-menu, .ml-more')) closeMenus(); });
    // Kéo thả vào hộp thoại
    var depth = 0;
    dlg.addEventListener('dragenter', function (e) { if (e.dataTransfer && Array.prototype.indexOf.call(e.dataTransfer.types || [], 'Files') >= 0) { e.preventDefault(); depth++; drop.hidden = false; } });
    dlg.addEventListener('dragover', function (e) { e.preventDefault(); });
    dlg.addEventListener('dragleave', function () { depth = Math.max(0, depth - 1); if (!depth) drop.hidden = true; });
    dlg.addEventListener('drop', function (e) { e.preventDefault(); depth = 0; drop.hidden = true; if (e.dataTransfer) upload(e.dataTransfer.files); });
    // Phím mũi tên di chuyển trong lưới
    body.addEventListener('keydown', function (e) {
      var k = e.key; if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].indexOf(k) < 0 || !e.target.classList.contains('ml-item')) return;
      var all = Array.prototype.slice.call(body.querySelectorAll('.ml-item')), i = all.indexOf(e.target), g = body.querySelector('.ml-grid');
      var cols = Math.max(1, getComputedStyle(g).gridTemplateColumns.split(' ').length);
      var n = k === 'ArrowRight' ? i + 1 : k === 'ArrowLeft' ? i - 1 : k === 'ArrowDown' ? i + cols : i - cols;
      if (n >= 0 && n < all.length) { e.preventDefault(); all[n].focus(); }
    });

    active = promise;
    dlg.showModal();
    render();
    reload();
    up.focus();
    return promise;
  }

  root.EP = root.EP || {};
  root.EP.media = { open: open, list: list, add: add, rename: rename, remove: remove, isPersistent: function () { return !memMode; } };
})(window);
