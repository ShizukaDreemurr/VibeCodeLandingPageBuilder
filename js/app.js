/*
 * app.js — nối form nhập, AI, landing page và danh sách đăng ký.
 */
(function (root) {
  var EP = root.EP;
  var B = EP.brands;
  var S = EP.storage;
  var V = EP.validators;
  var $ = function (sel) { return document.querySelector(sel); };

  var form = $('#event-form');
  var landingEl = $('#landing');
  var aiMsg = $('#ai-msg');
  var state = loadState(); // { event, content, tone, updatedAt }
  var renderer = null;
  var regenSeed = 0;
  var remoteCount = null; // số đăng ký trên Google Sheet (null = chưa lấy được)
  var SYNC_INTERVAL_MS = 15000;
  var C = EP.cloud;
  var cloudStats = null;   // { count, waitlist } từ Firebase, cập nhật tức thì
  var stopWatch = null;
  var adminRows = [];      // danh sách đang hiển thị ở tab quản trị (dùng để xuất CSV)
  var publicEventId = new URLSearchParams(root.location.search).get('e');
  var TPL = EP.templates;
  var currentTemplateId = (state && state.event.templateId) || 'tech';
  var MAX_IMAGE_BYTES = 900000; // giới hạn 1MB/tài liệu của Firestore, chừa chỗ cho nội dung
  var IMAGE_TYPES = { hero: 'hero', speaker: 'avatar', gallery: 'gallery' };
  var APP_URL = /^https?:$/.test(root.location.protocol) ? root.location.origin + root.location.pathname : null;

  // ---------- Lưu nhiều sự kiện trên trình duyệt ----------
  // events: { [id]: state }, current_id: sự kiện đang mở
  function loadState() {
    var all = S.read('events', {});
    var id = S.read('current_id', null);
    if (id && all[id]) return all[id];
    var legacy = S.read('current', null); // dữ liệu của bản cũ (1 sự kiện)
    if (legacy && legacy.event) {
      all[legacy.event.id] = legacy;
      S.write('events', all);
      S.write('current_id', legacy.event.id);
      S.remove('current');
      return legacy;
    }
    return null;
  }

  function saveState() {
    var all = S.read('events', {});
    state.updatedAt = new Date().toISOString();
    all[state.event.id] = state;
    S.write('current_id', state.event.id);
    return S.write('events', all);
  }

  // ---------- Đọc / ghi form ----------
  function parseLines(text, mapper) {
    return String(text || '').split('\n').map(function (l) { return l.trim(); }).filter(Boolean).map(mapper);
  }

  // "Tên - Chức danh" (chấp nhận cả dấu – và —)
  function splitDash(line) {
    var m = line.match(/^(.*?)\s+[-–—]\s+(.*)$/);
    return m ? [m[1].trim(), m[2].trim()] : [line, ''];
  }

  function readForm(existingId) {
    var f = form.elements;
    return {
      id: existingId || S.newId('evt'),
      name: V.clean(f.name.value),
      startAt: f.startAt.value,
      location: V.clean(f.location.value),
      capacity: f.capacity.value === '' ? '' : Number(f.capacity.value),
      speakers: parseLines(f.speakers.value, function (l) { var p = splitDash(l); return { name: p[0], title: p[1] }; }),
      agenda: parseLines(f.agenda.value, function (l) { var p = splitDash(l); return { time: p[0], title: p[1] || p[0] }; }),
      earlyBird: V.clean(f.earlyBird.value),
      earlyBirdUntil: f.earlyBirdUntil.value,
      sheetUrl: V.clean(f.sheetUrl.value),
      templateId: currentTemplateId,
      studioName: currentTemplateId === 'wedding' ? V.clean(f.studioName.value) : '',
      studioUrl: currentTemplateId === 'wedding' ? V.clean(f.studioUrl.value) : '',
      images: (state && state.event.images) || {},
      sections: (state && state.event.sections) || null,
      style: (state && state.event.style) || null,
      texts: (state && state.event.texts) || null,
      elStyles: (state && state.event.elStyles) || null,
      elStylesBy: (state && state.event.elStylesBy) || null,
      rich: (state && state.event.rich) || null,
      blocks: (state && state.event.blocks) || null,
      brandId: $('#f-brand') ? $('#f-brand').value : '',
      brand: (state && state.event.brand) || null
    };
  }

  function fillForm(ev) {
    var f = form.elements;
    if ($('#f-brand')) { refreshBrandSelects(); $('#f-brand').value = ev.brandId && EP.brands.get(ev.brandId) ? ev.brandId : ''; }
    f.name.value = ev.name || '';
    f.startAt.value = ev.startAt || '';
    f.location.value = ev.location || '';
    f.capacity.value = ev.capacity === '' || ev.capacity == null ? '' : ev.capacity;
    f.speakers.value = (ev.speakers || []).map(function (s) { return s.title ? s.name + ' - ' + s.title : s.name; }).join('\n');
    f.agenda.value = (ev.agenda || []).map(function (a) { return a.time === a.title ? a.time : a.time + ' - ' + a.title; }).join('\n');
    f.earlyBird.value = ev.earlyBird || '';
    f.earlyBirdUntil.value = ev.earlyBirdUntil || '';
    f.sheetUrl.value = ev.sheetUrl || '';
    f.studioName.value = ev.studioName || '';
    f.studioUrl.value = ev.studioUrl || '';
    if (ev.templateId) setTemplate(ev.templateId);
  }

  // ---------- Thư viện mẫu ----------
  function setTemplate(id) {
    currentTemplateId = TPL.get(id).id;
    var t = TPL.get(currentTemplateId);
    $('#tpl-name').textContent = t.name;
    $('#tpl-swatch').style.setProperty('--sw1', t.theme.primary);
    $('#tpl-swatch').style.setProperty('--sw2', t.theme.accent);
    $('#studio-box').hidden = !t.wedding;
    $('#tpl-name-2').textContent = t.name;
    $('#tpl-swatch-2').style.setProperty('--sw1', t.theme.primary);
    $('#tpl-swatch-2').style.setProperty('--sw2', t.theme.accent);
  }

  function buildTemplateFilters() {
    var box = $('#tpl-filters');
    Object.keys(TPL.FILTERS).forEach(function (key) {
      var f = TPL.FILTERS[key];
      var label = document.createElement('label');
      label.textContent = f.label;
      var sel = document.createElement('select');
      sel.setAttribute('data-filter', key);
      var all = document.createElement('option');
      all.value = ''; all.textContent = 'Tất cả';
      sel.appendChild(all);
      Object.keys(f.options).forEach(function (v) {
        var o = document.createElement('option');
        o.value = v; o.textContent = f.options[v];
        sel.appendChild(o);
      });
      sel.addEventListener('change', renderTemplateGrid);
      label.appendChild(sel);
      box.appendChild(label);
    });
  }

  function renderTemplateGrid() {
    var filters = {};
    document.querySelectorAll('#tpl-filters select').forEach(function (sel) { filters[sel.getAttribute('data-filter')] = sel.value; });
    var grid = $('#tpl-grid');
    grid.innerHTML = '';
    TPL.search(filters).forEach(function (r) {
      var t = r.template;
      var card = document.createElement('button');
      card.type = 'button';
      card.className = 'tpl-card' + (t.id === currentTemplateId ? ' is-current' : '');
      var thumb = document.createElement('div');
      thumb.className = 'tpl-thumb';
      thumb.style.background = t.theme.primary;
      var title = document.createElement('span');
      title.className = 'tpl-thumb-title'; title.textContent = t.name;
      if (t.theme.headingFont) title.style.fontFamily = t.theme.headingFont;
      var pill = document.createElement('span');
      pill.className = 'tpl-thumb-btn'; pill.textContent = TPL.labels(t.id).submit;
      pill.style.background = t.theme.accent; pill.style.color = '#fff';
      thumb.appendChild(title); thumb.appendChild(pill);
      var body = document.createElement('div');
      body.className = 'tpl-card-body';
      var tags = document.createElement('span');
      tags.textContent = Object.keys(t.tags).map(function (k) {
        return t.tags[k].map(function (v) { return TPL.FILTERS[k].options[v]; }).join(', ');
      }).join(' · ');
      body.appendChild(tags);
      if (r.score.total) {
        var sc = document.createElement('span');
        sc.className = 'tpl-score';
        sc.textContent = 'Phù hợp ' + r.score.hit + '/' + r.score.total;
        body.appendChild(sc);
      }
      card.appendChild(thumb); card.appendChild(body);
      card.addEventListener('click', function () { applyTemplate(t.id); });
      grid.appendChild(card);
    });
    EP.motion.stagger(grid.children);
  }

  function openTemplates() {
    renderTemplateGrid();
    var dlg = $('#tpl-dialog');
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  }

  function closeTemplates() {
    var dlg = $('#tpl-dialog');
    if (dlg.close) dlg.close(); else dlg.removeAttribute('open');
  }

  // Đổi mẫu: giữ nguyên nội dung, chỉ đổi giao diện; form trống thì điền dữ liệu mẫu của mẫu đó
  function applyTemplate(id) {
    setTemplate(id);
    closeTemplates();
    if (!form.elements.name.value.trim()) fillSample();
    if (state) {
      state.event.templateId = currentTemplateId;
      if (currentTemplateId !== 'wedding') { state.event.studioName = ''; state.event.studioUrl = ''; }
      // Đổi mẫu → dùng màu & font của mẫu mới, giữ các tuỳ chỉnh bố cục khác
      if (state.event.style) { delete state.event.style.primary; delete state.event.style.accent; delete state.event.style.headingFont; }
      persist();
    }
    swapLanding();
    toast('Đã chuyển sang mẫu "' + TPL.get(id).name + '".');
  }

  // ---------- Ảnh tuỳ chỉnh ----------
  function pickImage(slot) {
    var parts = slot.split(':');
    var kind = parts[0];
    var index = Number(parts[1]);
    EP.images.pick(IMAGE_TYPES[kind]).then(function (dataUrl) {
      var info = EP.images.lastInfo();
      var images = JSON.parse(JSON.stringify(state.event.images || {}));
      if (kind === 'hero') images.hero = dataUrl;
      if (kind === 'speaker') { images.speakers = images.speakers || {}; images.speakers[index] = dataUrl; }
      if (kind === 'gallery') { images.gallery = images.gallery || []; images.gallery[index] = dataUrl; }
      var budget = MAX_IMAGE_BYTES - ((state.event.brand && state.event.brand.logo) || '').length;
      // Vượt giới hạn trang: tự nén lại các ảnh nặng nhất cho vừa, không bắt người dùng bỏ ảnh
      var fit = EP.images.totalBytes(images) > budget ? EP.images.shrinkToFit(images, budget) : Promise.resolve({ images: images, count: 0, fits: true });
      return fit.then(function (r) {
        if (!r.fits) { toast('Trang đã quá nhiều ảnh, nén thêm sẽ mờ. Hãy bớt một vài ảnh album.'); return; }
        state.event.images = r.images;
        persist();
        var target = kind === 'hero' ? landingEl.querySelector('.lp-hero')
          : landingEl.querySelector('[data-slot="' + slot + '"]') && landingEl.querySelector('[data-slot="' + slot + '"]').parentElement;
        EP.motion.replay(target, 'mo-img-in');
        var msg = 'Đã cập nhật ảnh' + (info ? ' (tự nén ' + kb(info.before) + ' → ' + kb(info.after) + ')' : '') + '.';
        if (r.count) msg += ' Đã nén lại thêm ' + r.count + ' ảnh khác để trang vừa dung lượng.';
        toast(msg);
      });
    }).catch(function (e) {
      if (e.message !== 'Chưa chọn ảnh.') toast(e.message);
    });
  }
  function kb(n) { return n >= 1048576 ? (n / 1048576).toFixed(1).replace('.', ',') + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB'; }

  // Lưu trạng thái, vẽ lại trang, và cập nhật bản công khai nếu đã xuất bản
  function persist() {
    recordHistory();
    if (!saveState()) toast('Trình duyệt không lưu được dữ liệu (có thể do ảnh quá lớn).');
    renderLanding();
    if (isCloudEvent() && C.currentUser()) {
      C.publishEvent(state.event, state.content, false).catch(function (e) { toast('Chưa cập nhật được trang công khai: ' + e.message); });
    }
  }

  function showErrors(errors) {
    form.querySelectorAll('[data-error-for]').forEach(function (p) {
      var k = p.getAttribute('data-error-for');
      p.textContent = errors[k] || '';
      var input = form.elements[k];
      if (input) { if (errors[k]) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid'); }
    });
    var firstKey = Object.keys(errors)[0];
    if (firstKey && form.elements[firstKey]) form.elements[firstKey].focus();
  }

  function setMsg(text, kind) {
    aiMsg.textContent = text || '';
    aiMsg.className = 'form-msg' + (kind ? ' is-' + kind : '');
    if (text) EP.motion.replay(aiMsg, 'mo-pop');
  }

  function toast(text) {
    var t = $('#toast');
    t.textContent = text;
    t.hidden = false;
    clearTimeout(toast.timer);
    toast.timer = setTimeout(function () { t.hidden = true; }, Math.max(3500, text.length * 60));
  }

  // ---------- Dựng landing page ----------
  // ---------- Xem thử trạng thái (không đổi dữ liệu thật) ----------
  var simState = '';
  var SIM_TEXT = {
    almost: 'Đang xem thử: sắp hết chỗ',
    full: 'Đang xem thử: hết chỗ (khách sẽ vào danh sách chờ)',
    earlybird: 'Đang xem thử: đã hết hạn ưu đãi đăng ký sớm',
    ended: 'Đang xem thử: sự kiện đã diễn ra'
  };

  function simNow() {
    var ev = state.event;
    if (simState === 'ended') return new Date(new Date(ev.startAt).getTime() + 60000);
    if (simState === 'earlybird' && ev.earlyBirdUntil) return new Date(new Date(ev.earlyBirdUntil).getTime() + 60000);
    return new Date();
  }

  function simCount() {
    var cap = Number(state.event.capacity) || 0;
    if (simState === 'almost' && cap) return Math.max(0, cap - Math.max(1, Math.floor(cap * 0.05)));
    if (simState === 'full' && cap) return cap;
    return currentCount();
  }

  function syncSimUi() {
    var wrap = $('#sim-wrap');
    wrap.hidden = !state;
    if (!state) return;
    var sel = $('#sim-state');
    var hasCap = !!Number(state.event.capacity);
    sel.querySelector('[value="almost"]').disabled = !hasCap;
    sel.querySelector('[value="full"]').disabled = !hasCap;
    sel.querySelector('[value="earlybird"]').disabled = !state.event.earlyBirdUntil;
    if (sel.selectedOptions[0] && sel.selectedOptions[0].disabled) { sel.value = ''; simState = ''; }
    var banner = $('#sim-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'sim-banner';
      banner.className = 'sim-banner';
      $('#landing').parentNode.insertBefore(banner, $('#landing'));
    }
    banner.hidden = !simState;
    banner.textContent = SIM_TEXT[simState] || '';
  }

  // ---------- Bố cục: thứ tự / ẩn hiện các phần ----------
  function currentSections() { return EP.landingRenderer.normalizeSections(state.event.sections); }


  var flashKey = null; // phần vừa đổi → nháy sáng trên bản xem trước

  function moveSection(from, to) {
    var list = currentSections();
    if (to < 0 || to >= list.length) return;
    var item = list.splice(from, 1)[0];
    list.splice(to, 0, item);
    state.event.sections = list;
    flashKey = item.key;
    persist();
  }

  // Đặt lại thứ tự theo danh sách chỉ số đang hiển thị (phần bị ẩn khỏi danh sách giữ nguyên chỗ)
  function reorderSections(shownOrder) {
    var list = currentSections();
    var slots = shownOrder.slice().sort(function (a, b) { return a - b; });
    var next = list.slice();
    slots.forEach(function (slot, k) { next[slot] = list[shownOrder[k]]; });
    state.event.sections = next;
    persist();
  }

  // FLIP: ghi vị trí cũ → đổi DOM → trượt từ vị trí cũ về vị trí mới
  function rectsOf(ol) {
    var r = {};
    Array.prototype.forEach.call(ol.children, function (li) { if (li.dataset.key) r[li.dataset.key] = li.getBoundingClientRect().top; });
    return r;
  }
  function playFlip(ol, before, skip) {
    if (EP.motion.reduce()) return;
    Array.prototype.forEach.call(ol.children, function (li) {
      var old = before[li.dataset.key];
      if (old == null || li === skip) return;
      var dy = old - li.getBoundingClientRect().top;
      if (!dy) return;
      li.animate([{ transform: 'translateY(' + dy + 'px)' }, { transform: 'none' }], { duration: 220, easing: 'cubic-bezier(.2,.8,.2,1)' });
    });
  }

  function highlightPreview(key, on) {
    var el = landingEl.querySelector('[data-section="' + key + '"]');
    if (el) el.classList.toggle('lp-hover', on);
  }

  // Kéo thả bằng con trỏ (chuột + cảm ứng): thẻ được "nhấc lên" đi theo tay, các thẻ khác trượt nhường chỗ
  function startDrag(e, li, ol) {
    if (e.button !== undefined && e.button !== 0) return;
    if (e.target.closest('button, input, label, .sec-settings')) return;
    var startY = e.clientY, dragging = false, ghost, holder, offsetY, lastTop, baseTop, raf = 0;
    function begin() {
      dragging = true;
      var r = li.getBoundingClientRect();
      offsetY = startY - r.top;
      holder = document.createElement('li');
      holder.className = 'section-placeholder';
      holder.style.height = r.height + 'px';
      ol.insertBefore(holder, li);
      ghost = li;
      ghost.classList.add('is-lifted');
      ghost.style.width = r.width + 'px';
      ghost.style.left = r.left + 'px';
      ghost.style.top = r.top + 'px';
      ghost.style.willChange = 'transform';
      baseTop = r.top;
      document.body.appendChild(ghost);
      document.body.classList.add('is-sorting');
    }
    function move(ev) {
      if (!dragging) { if (Math.abs(ev.clientY - startY) < 5) return; begin(); }
      ev.preventDefault();
      lastTop = ev.clientY - offsetY;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () { ghost.style.transform = 'translate3d(0,' + (lastTop - baseTop) + 'px,0) scale(1.02)'; });
      var items = Array.prototype.filter.call(ol.children, function (x) { return x !== holder; });
      var target = null;
      for (var k = 0; k < items.length; k++) {
        var rr = items[k].getBoundingClientRect();
        if (ev.clientY < rr.top + rr.height / 2) { target = items[k]; break; }
      }
      if ((target || null) !== holder.nextSibling || (!target && holder !== ol.lastChild)) {
        var before = rectsOf(ol);
        ol.insertBefore(holder, target);
        playFlip(ol, before);
    justOpened = false;
      }
      // Tự cuộn khi kéo gần mép
      var box = ol.closest('.ws-gbody');
      if (box) {
        var br = box.getBoundingClientRect();
        if (ev.clientY < br.top + 40) box.scrollTop -= 8; else if (ev.clientY > br.bottom - 40) box.scrollTop += 8;
      }
    }
    function end() {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', end);
      document.removeEventListener('pointercancel', end);
      if (!dragging) return;
      var dest = holder.getBoundingClientRect();
      function finish() {
        ghost.classList.remove('is-lifted');
        ghost.removeAttribute('style');
        ol.replaceChild(ghost, holder);
        document.body.classList.remove('is-sorting');
        var order = Array.prototype.map.call(ol.children, function (x) { return Number(x.getAttribute('data-index')); });
        var changed = order.some(function (v, k) { return k > 0 && v < order[k - 1]; });
        if (changed) { flashKey = ghost.dataset.key; reorderSections(order); toast('Đã đổi thứ tự bố cục.'); }
      }
      if (EP.motion.reduce()) return finish();
      cancelAnimationFrame(raf);
      var a = ghost.animate([
        { transform: 'translate3d(0,' + (lastTop - baseTop) + 'px,0) scale(1.02)' },
        { transform: 'translate3d(0,' + (dest.top - baseTop) + 'px,0) scale(1)' }
      ], { duration: 200, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' });
      a.onfinish = function () { a.cancel(); finish(); };
    }
    document.addEventListener('pointermove', move, { passive: false });
    document.addEventListener('pointerup', end);
    document.addEventListener('pointercancel', end);
  }

  var justOpened = false;
  var openSettings = null; // phần đang mở bảng tuỳ chỉnh nhỏ
  function sectionSettings(key) {
    var PS = EP.pageStyle;
    var cur = (getStyle().sections[key]) || {};
    var box = document.createElement('div');
    box.className = 'sec-settings';
    [['bg', 'Nền', PS.OPTIONS.sectionBg], ['align', 'Căn lề', PS.OPTIONS.sectionAlign]].forEach(function (row) {
      box.appendChild(chipRow(row[1], row[2], cur[row[0]] || 'auto', function (v) {
        var st = getStyle(); var secs = Object.assign({}, st.sections); secs[key] = Object.assign({}, secs[key]); secs[key][row[0]] = v;
        flashKey = key; setStyle('sections', secs);
      }));
    });
    function setSec(field) {
      return function (v, commit) {
        var st = getStyle(); var secs = Object.assign({}, st.sections); secs[key] = Object.assign({}, secs[key]); secs[key][field] = v;
        setStyle('sections', secs, commit);
      };
    }
    box.appendChild(colorField('Màu nền riêng', cur.bgColor, '', '', setSec('bgColor')));
    box.appendChild(colorField('Màu chữ riêng', cur.textColor, '', '', setSec('textColor'), function () { return getStyle().sections[key] && getStyle().sections[key].bgColor; }));
    return box;
  }

  function renderSectionList() {
    var box = $('#layout-box');
    box.hidden = !state;
    if (!state) return;
    var meta = {};
    EP.landingRenderer.SECTIONS.forEach(function (s) { meta[s.key] = s; });
    var isWedding = TPL.get(state.event.templateId).wedding;
    var labels = TPL.labels(state.event.templateId);
    var ol = $('#section-list');
    var before = rectsOf(ol);
    var firstTime = !ol.children.length;
    ol.innerHTML = '';
    var list = currentSections();
    list.forEach(function (s, i) {
      if (s.key === 'gallery' && !isWedding) return;
      var m = meta[s.key];
      if (m.block && !s.visible) return; // khối chưa thêm: nằm ở panel Khối
      var li = document.createElement('li');
      li.className = 'section-item' + (s.visible ? '' : ' is-hidden') + (firstTime ? ' is-entering' : '');
      if (firstTime) li.style.animationDelay = (ol.children.length * 35) + 'ms';
      li.setAttribute('data-index', i);
      li.dataset.key = s.key;
      var grip = document.createElement('span'); grip.className = 'grip'; grip.innerHTML = EP.icon('grip'); grip.setAttribute('aria-hidden', 'true');
      var name = document.createElement('label'); name.className = 'name';
      var cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = s.visible; cb.disabled = !!m.locked;
      cb.addEventListener('change', function () {
        var l = currentSections(); l[i].visible = cb.checked; state.event.sections = l;
        if (cb.checked) { flashKey = s.key; persist(); return; }
        // Ẩn: thu gọn phần đó trên bản xem trước rồi mới vẽ lại
        EP.motion.collapse(landingEl.querySelector('[data-section="' + s.key + '"]'), persist);
      });
      var title = labels[s.key] && s.key !== 'countdown' && s.key !== 'register' ? labels[s.key] : m.label;
      name.appendChild(cb);
      name.appendChild(document.createTextNode(' ' + title));
      if (m.locked) { var lk = EP.icons.node('lock', 14); lk.classList.add('lock'); lk.setAttribute('aria-label', 'bắt buộc'); name.appendChild(lk); }
      var up = document.createElement('button'); up.type = 'button'; up.innerHTML = EP.icon('chevron-up'); up.disabled = i === 0; up.setAttribute('aria-label', 'Đưa lên');
      var down = document.createElement('button'); down.type = 'button'; down.innerHTML = EP.icon('chevron-down'); down.disabled = i === list.length - 1; down.setAttribute('aria-label', 'Đưa xuống');
      up.addEventListener('click', function () { moveSection(i, i - 1); });
      down.addEventListener('click', function () { moveSection(i, i + 1); });
      li.addEventListener('pointerdown', function (e) { startDrag(e, li, ol); });
      li.addEventListener('mouseenter', function () { highlightPreview(s.key, true); });
      li.addEventListener('mouseleave', function () { highlightPreview(s.key, false); });
      var gear = document.createElement('button'); gear.type = 'button'; gear.innerHTML = EP.icon('sliders'); gear.className = 'gear';
      gear.setAttribute('aria-label', 'Tuỳ chỉnh phần này'); gear.setAttribute('aria-expanded', openSettings === s.key ? 'true' : 'false');
      gear.addEventListener('click', function () { openSettings = openSettings === s.key ? null : s.key; justOpened = true; renderSectionList(); });
      li.appendChild(grip); li.appendChild(name); if (editorMode === 'studio') li.appendChild(gear); li.appendChild(up); li.appendChild(down);
      if (openSettings === s.key && editorMode === 'studio') {
        var ss = sectionSettings(s.key);
        if (justOpened) ss.classList.add('is-opening');
        li.appendChild(ss);
      }
      ol.appendChild(li);
    });
    playFlip(ol, before);
    if (flashKey) setTimeout(flashChanged.bind(null, ol, flashKey), 0); // chờ bản xem trước vẽ xong
    flashKey = null;
  }

  function flashChanged(ol, key) {
    {
      var flashKey = key;
      var moved = ol.querySelector('[data-key="' + flashKey + '"]');
      if (moved) moved.classList.add('is-moved');
      var sec = landingEl.querySelector('[data-section="' + flashKey + '"]');
      if (sec) {
        sec.classList.add('lp-flash');
        var wrap = landingEl.closest('.preview-wrap');
        if (wrap && !$('#view-editor').hidden) sec.scrollIntoView({ behavior: EP.motion.reduce() ? 'auto' : 'smooth', block: 'nearest' });
      }
    }
  }

  // ---------- Bảng Giao diện ----------
  function getStyle() { return EP.pageStyle.normalize(state && state.event.style); }
  // commit=false: chỉ vẽ lại để xem trước (đang kéo thanh trượt/chọn màu); commit=true: lưu + ghi lịch sử
  function setStyle(key, value, commit) {
    if (!state) return;
    var st = Object.assign({}, state.event.style || {});
    st[key] = value;
    state.event.style = st;
    if (commit === false) { liveRender(); return; }
    persist();
  }

  function chipRow(label, options, current, onPick) {
    var row = document.createElement('div'); row.className = 'st-row';
    var l = document.createElement('span'); l.className = 'st-label'; l.textContent = label; row.appendChild(l);
    var g = document.createElement('div'); g.className = 'chips'; g.setAttribute('role', 'radiogroup'); g.setAttribute('aria-label', label);
    options.forEach(function (o) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'chip' + (o[0] === current ? ' is-active' : '');
      b.textContent = o[1]; b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', o[0] === current ? 'true' : 'false');
      b.addEventListener('click', function () { onPick(o[0]); });
      g.appendChild(b);
    });
    row.appendChild(g);
    return row;
  }

  function group(title, open, children) {
    var d = document.createElement('details'); d.className = 'st-group'; d.open = !!open;
    d.setAttribute('data-group', title);
    var sm = document.createElement('summary'); sm.textContent = title; d.appendChild(sm);
    sm.addEventListener('click', function () { d.classList.add('is-toggled'); });
    var body = document.createElement('div'); body.className = 'st-body';
    children.forEach(function (c) { if (c) body.appendChild(c); });
    d.appendChild(body);
    return d;
  }

  // Chế độ chỉnh: 'simple' (tối giản) hoặc 'studio' (đầy đủ thông số) — nhớ theo trình duyệt
  var editorMode = S.read('editor_mode', 'simple') === 'studio' ? 'studio' : 'simple';
  function setEditorMode(m) {
    editorMode = m;
    S.write('editor_mode', m);
    document.body.classList.toggle('mode-studio', m === 'studio');
    if (m === 'simple') openSettings = null;
    if (state) { renderSectionList(); renderStylePanel(); EP.motion.replay($('#style-panel'), 'mo-swap'); }
    toast(m === 'studio' ? 'Chế độ Studio: chỉnh được mọi thông số.' : 'Chế độ Đơn giản: chỉ giữ những lựa chọn chính.');
  }

  // Ô màu Studio: bảng chọn + ô chữ nhận hex/rgb/rgba/hsl/tên màu + hút màu + về mặc định
  function colorField(label, current, fallback, hint, onSet, contrastWith) {
    var PS = EP.pageStyle;
    var row = document.createElement('div'); row.className = 'st-row color-field';
    var head = document.createElement('div'); head.className = 'st-label';
    head.hidden = !label && !contrastWith; // ô màu không nhãn (trong thanh chỉnh) thì bỏ dòng trống
    head.appendChild(document.createTextNode(label));
    var badge = document.createElement('span'); badge.className = 'cr-badge';
    head.appendChild(badge);
    row.appendChild(head);
    var line = document.createElement('div'); line.className = 'color-line';
    var sw = document.createElement('input'); sw.type = 'color'; sw.setAttribute('aria-label', label + ' – bảng chọn');
    var tx = document.createElement('input'); tx.type = 'text'; tx.spellcheck = false; tx.setAttribute('aria-label', label + ' – mã màu');
    tx.placeholder = fallback ? fallback + ' (mặc định)' : 'Mặc định';
    function show(v) {
      tx.value = v || '';
      sw.value = PS.solidHex(v || fallback) || '#000000';
      tx.classList.remove('is-invalid');
      if (contrastWith) {
        var bg = v || fallback, fg = contrastWith();
        if (bg && fg) {
          var r = PS.contrast(PS.solidHex(bg), PS.solidHex(fg));
          badge.textContent = r.toFixed(1) + ':1';
          badge.className = 'cr-badge ' + (r >= 4.5 ? 'is-ok' : 'is-warn');
          badge.title = r >= 4.5 ? 'Đạt chuẩn tương phản WCAG AA' : 'Tương phản thấp – chữ có thể khó đọc';
        }
      }
    }
    show(current);
    sw.addEventListener('input', function () { tx.value = sw.value; onSet(sw.value, false); });
    sw.addEventListener('change', function () { onSet(sw.value, true); });
    var committed = current || '';
    function fromText(commit) {
      var raw = tx.value.trim();
      if (!raw) { tx.classList.remove('is-invalid'); if (commit && committed !== '') { committed = ''; onSet('', true); } return; }
      var v = PS.normalizeColor(raw);
      tx.classList.toggle('is-invalid', !v);
      if (!v) return;
      sw.value = PS.solidHex(v);
      // Enter rồi rời ô sẽ bắn "change" lần hai: không lưu lại giá trị đã lưu (tránh vẽ lại cả bảng)
      if (commit && v === committed) { tx.value = v; return; }
      onSet(v, commit);
      if (commit) { tx.value = v; committed = v; }
    }
    tx.addEventListener('input', function () { fromText(false); });
    tx.addEventListener('change', function () { fromText(true); });
    tx.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); fromText(true); } });
    line.appendChild(sw); line.appendChild(tx);
    if (root.EyeDropper) {
      var eye = document.createElement('button'); eye.type = 'button'; eye.className = 'icon-btn'; eye.innerHTML = EP.icon('droplet'); eye.setAttribute('aria-label', 'Hút màu trên màn hình'); eye.title = 'Hút màu trên màn hình';
      eye.addEventListener('click', function () {
        new root.EyeDropper().open().then(function (r) { show(r.sRGBHex); onSet(r.sRGBHex, true); }).catch(function () {});
      });
      line.appendChild(eye);
    }
    var rs = document.createElement('button'); rs.type = 'button'; rs.className = 'icon-btn'; rs.innerHTML = EP.icon('reset'); rs.title = 'Về mặc định'; rs.setAttribute('aria-label', 'Về mặc định');
    rs.addEventListener('click', function () { show(''); onSet('', true); });
    line.appendChild(rs);
    row.appendChild(line);
    if (hint) { var h = document.createElement('small'); h.className = 'hint'; h.textContent = hint; row.appendChild(h); }
    var err = document.createElement('small'); err.className = 'color-err'; err.textContent = 'Không đọc được mã màu. Ví dụ: #1e2a78, rgb(30, 42, 120), hsl(232 60% 30%), tomato';
    row.appendChild(err);
    return row;
  }

  // Thanh trượt Studio, có ô số và nút về mặc định
  function rangeField(key, value) {
    var R = EP.pageStyle.RANGES[key];
    var row = document.createElement('div'); row.className = 'st-row range-field';
    var head = document.createElement('div'); head.className = 'st-label'; head.textContent = R[4];
    var line = document.createElement('div'); line.className = 'range-line';
    var rg = document.createElement('input'); rg.type = 'range'; rg.min = R[0]; rg.max = R[1]; rg.step = R[2]; rg.setAttribute('aria-label', R[4]);
    var nb = document.createElement('input'); nb.type = 'number'; nb.min = R[0]; nb.max = R[1]; nb.step = R[2]; nb.setAttribute('aria-label', R[4] + ' (số)');
    var unit = document.createElement('span'); unit.className = 'unit'; unit.textContent = R[3];
    var rs = document.createElement('button'); rs.type = 'button'; rs.className = 'icon-btn'; rs.innerHTML = EP.icon('reset'); rs.title = 'Về mặc định'; rs.setAttribute('aria-label', 'Về mặc định');
    function show(v) { var isSet = v != null && v !== ''; rg.value = isSet ? v : R[0]; nb.value = isSet ? v : ''; nb.placeholder = '–'; nb.title = 'Để trống = tự động'; row.classList.toggle('is-unset', !isSet); }
    show(value);
    rg.addEventListener('input', function () { nb.value = rg.value; row.classList.remove('is-unset'); setStyle(key, Number(rg.value), false); });
    rg.addEventListener('change', function () { setStyle(key, Number(rg.value)); });
    nb.addEventListener('change', function () {
      if (nb.value === '') return setStyle(key, null);
      var v = Math.max(R[0], Math.min(R[1], Number(nb.value)));
      show(v); setStyle(key, v);
    });
    rs.addEventListener('click', function () { show(null); setStyle(key, null); });
    line.appendChild(rg); line.appendChild(nb); line.appendChild(unit); line.appendChild(rs);
    row.appendChild(head); row.appendChild(line);
    return row;
  }

  // Ô chọn font dạng combobox: bấm để xem danh sách font phổ biến (mỗi tên hiện bằng chính font đó),
  // gõ để lọc; gõ tên font Google bất kỳ rồi Enter để dùng (app kiểm tra font có tồn tại và có dấu tiếng Việt).
  var previewLoaded = {};
  function loadPreviews(names) {
    var need = names.filter(function (n) { return !previewLoaded[n]; });
    if (!need.length) return;
    need.forEach(function (n) { previewLoaded[n] = true; });
    // Mỗi lần tải tối đa 20 font, chỉ các ký tự của tên font (rất nhẹ)
    for (var i = 0; i < need.length; i += 20) {
      var chunk = need.slice(i, i + 20);
      var text = Array.from(new Set(chunk.join('').split(''))).join('');
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?' + chunk.map(function (n) { return 'family=' + encodeURIComponent(n).replace(/%20/g, '+'); }).join('&') + '&text=' + encodeURIComponent(text) + '&display=swap';
      document.head.appendChild(link);
    }
  }
  // Kiểm tra font có trên Google Fonts không (thẻ <link> báo lỗi khi tên sai) và có dấu tiếng Việt không
  function checkGoogleFont(name) {
    return new Promise(function (resolve) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(name).replace(/%20/g, '+') + '&display=swap';
      var done = false;
      function finish(r) { if (done) return; done = true; resolve(r); }
      link.onerror = function () { link.remove(); finish({ exists: false }); };
      link.onload = function () {
        var vi = null;
        try {
          vi = Array.prototype.some.call(link.sheet.cssRules, function (rule) { return /U\+1EA0|U\+1EA[0-9A-F]-/i.test(rule.cssText); });
        } catch (e) { vi = null; } // trình duyệt chặn đọc CSS khác nguồn: bỏ qua bước kiểm tra dấu
        finish({ exists: true, vi: vi });
      };
      document.head.appendChild(link);
      setTimeout(function () { finish({ exists: null }); }, 8000);
    });
  }

  var openCombo = null;
  // o: { id, label, value (tên font hoặc ''), allowDefault, onPick(name) } → { wrap, note }
  function fontCombo(o) {
    var PS = EP.pageStyle;
    var id = o.id, label = o.label, allowDefault = o.allowDefault;
    var wrap = document.createElement('div'); wrap.className = 'combo';
    var input = document.createElement('input');
    input.type = 'text'; input.id = id; input.className = 'combo-input'; input.autocomplete = 'off'; input.spellcheck = false;
    input.setAttribute('role', 'combobox'); input.setAttribute('aria-autocomplete', 'list'); input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-label', label);
    var curName = o.value || '';
    input.value = curName || (allowDefault ? '' : 'Be Vietnam Pro');
    input.placeholder = allowDefault ? 'Theo mẫu – gõ để tìm font…' : 'Gõ để tìm font…';
    if (curName) input.style.fontFamily = "'" + curName + "', var(--font)";
    var caret = document.createElement('span'); caret.className = 'combo-caret'; caret.innerHTML = EP.icon('chevron-down', 14);
    wrap.appendChild(input); wrap.appendChild(caret);
    var note = document.createElement('small'); note.className = 'hint combo-note';

    var list = document.createElement('div'); list.className = 'combo-list'; list.setAttribute('role', 'listbox'); list.id = id + '-list';
    input.setAttribute('aria-controls', list.id);
    var items = [], active = -1;

    function choose(name) {
      close();
      o.onPick(name);
      var e = name && PS.catalogEntry(name);
      if (e && e.vi === false) toast('"' + name + '" chưa có đủ dấu tiếng Việt – chữ có dấu sẽ hiện bằng font dự phòng.');
    }
    function build(q) {
      list.innerHTML = ''; items = []; active = -1;
      q = (q || '').trim().toLowerCase();
      var norm = function (x) { return x.toLowerCase(); };
      var shown = [];
      if (allowDefault && (!q || 'theo mẫu'.indexOf(q) >= 0)) addOption('', 'Theo mẫu', null);
      Object.keys(PS.FONT_CATS).forEach(function (c) {
        var group = PS.CATALOG.filter(function (f) { return f.cat === c && (!q || norm(f.name).indexOf(q) >= 0); });
        if (!group.length) return;
        var h = document.createElement('div'); h.className = 'combo-group'; h.textContent = PS.FONT_CATS[c]; h.setAttribute('role', 'presentation');
        list.appendChild(h);
        group.forEach(function (f) { addOption(f.name, f.name, f); shown.push(f.name); });
      });
      var typed = input.value.trim();
      if (q && !PS.catalogEntry(typed)) {
        if (/^[A-Za-z0-9 ]{2,40}$/.test(typed)) addOption(typed, 'Dùng font Google "' + typed + '"', { custom: true });
        else if (!items.length) { var em = document.createElement('div'); em.className = 'combo-empty'; em.textContent = 'Không có font khớp. Tên font chỉ gồm chữ không dấu, số và dấu cách.'; list.appendChild(em); }
      }
      loadPreviews(shown);
      highlight(items.length ? 0 : -1);
    }
    function addOption(value, text, f) {
      var o = document.createElement('div');
      o.className = 'combo-opt' + (value === curName || (!value && !curName) ? ' is-current' : '');
      o.setAttribute('role', 'option'); o.id = id + '-o' + items.length;
      o.dataset.value = value;
      var t = document.createElement('span'); t.className = 'combo-name'; t.textContent = text;
      if (value && !(f && f.custom)) t.style.fontFamily = "'" + value + "', var(--font)";
      o.appendChild(t);
      if (f && f.vi === false) { var b = document.createElement('span'); b.className = 'combo-tag'; b.textContent = 'thiếu dấu TV'; o.appendChild(b); }
      if (value === curName && value) { var c = document.createElement('span'); c.className = 'combo-check'; c.innerHTML = EP.icon('check', 14); o.appendChild(c); }
      o.addEventListener('mousedown', function (e) { e.preventDefault(); });
      o.addEventListener('click', function () { pick(o); });
      o.addEventListener('mousemove', function () { highlight(items.indexOf(o)); });
      list.appendChild(o); items.push(o);
    }
    function highlight(i) {
      items.forEach(function (o, k) { o.classList.toggle('is-active', k === i); o.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
      active = i;
      if (i >= 0) {
        input.setAttribute('aria-activedescendant', items[i].id);
        // Cuộn trong danh sách (không dùng scrollIntoView để khỏi cuộn cả trang)
        var o = items[i], top = o.offsetTop, bottom = top + o.offsetHeight;
        if (top < list.scrollTop + 28) list.scrollTop = Math.max(0, top - 28);
        else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight;
      }
      else input.removeAttribute('aria-activedescendant');
    }
    function pick(o) {
      var v = o.dataset.value;
      if (o.textContent.indexOf('Dùng font Google') === 0) {
        note.textContent = 'Đang kiểm tra "' + v + '" trên Google Fonts…';
        checkGoogleFont(v).then(function (r) {
          if (r.exists === false) { note.textContent = 'Không tìm thấy font "' + v + '" trên Google Fonts. Kiểm tra lại tên (ví dụ: Pacifico, Lobster).'; EP.motion.replay(wrap, 'mo-shake'); return; }
          choose(v);
          if (r.exists && r.vi === false) toast('"' + v + '" chưa có đủ dấu tiếng Việt – chữ có dấu sẽ hiện bằng font dự phòng.');
        });
        close();
        return;
      }
      choose(v);
    }
    function position() {
      var r = input.getBoundingClientRect();
      var below = root.innerHeight - r.bottom - 12;
      var h = Math.min(320, Math.max(160, below));
      list.style.left = r.left + 'px';
      list.style.width = Math.max(r.width, 240) + 'px';
      if (below < 180 && r.top > below) { list.style.top = ''; list.style.bottom = (root.innerHeight - r.top + 4) + 'px'; list.style.maxHeight = Math.min(320, r.top - 12) + 'px'; }
      else { list.style.bottom = ''; list.style.top = (r.bottom + 4) + 'px'; list.style.maxHeight = h + 'px'; }
    }
    function open() {
      if (openCombo && openCombo.close !== close) openCombo.close();
      openCombo = { close: close, position: position, input: input };
      document.body.appendChild(list);
      input.setAttribute('aria-expanded', 'true');
      wrap.classList.add('is-open');
      build(input.value === curName ? '' : input.value);
      position();
    }
    function close() {
      if (!list.parentNode) return;
      list.remove();
      input.setAttribute('aria-expanded', 'false');
      wrap.classList.remove('is-open');
      if (openCombo && openCombo.close === close) openCombo = null;
    }
    // Bấm vào ô: bôi đen tên font hiện tại để gõ đè ngay (giữ vùng bôi đen qua lần nhả chuột đầu)
    var keepSelection = false;
    input.addEventListener('focus', function () { open(); input.select(); keepSelection = true; });
    input.addEventListener('mouseup', function (e) { if (keepSelection) { e.preventDefault(); input.select(); keepSelection = false; } });
    input.addEventListener('click', function () { if (!list.parentNode) open(); });
    caret.addEventListener('mousedown', function (e) {
      e.preventDefault();
      if (list.parentNode) close();
      else if (document.activeElement === input) open();
      else input.focus();
    });
    input.addEventListener('input', function () { if (!list.parentNode) open(); build(input.value); position(); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); if (!list.parentNode) open(); highlight(Math.min(items.length - 1, active + 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); highlight(Math.max(0, active - 1)); }
      else if (e.key === 'Enter') { e.preventDefault(); if (active >= 0 && items[active]) pick(items[active]); }
      else if (e.key === 'Escape') { e.preventDefault(); input.value = curName; close(); }
    });
    input.addEventListener('blur', function () { setTimeout(function () { if (document.activeElement !== input) { close(); input.value = curName || (allowDefault ? '' : 'Be Vietnam Pro'); } }, 120); });
    return { wrap: wrap, note: note };
  }

  // Ô số có nút − / + (cỡ chữ, giãn dòng…): kẹp trong [min, max]; để trống = tự động
  function stepper(o) {
    var box = document.createElement('div'); box.className = 'stepper';
    var minus = document.createElement('button'); minus.type = 'button'; minus.innerHTML = EP.icon('minus', 14); minus.setAttribute('aria-label', 'Giảm ' + o.label.toLowerCase());
    var inp = document.createElement('input'); inp.type = 'number'; inp.min = o.min; inp.max = o.max; inp.step = o.step;
    // Để trống = tự động (hiện gạch ngang xám, chú thích khi rê chuột)
    inp.setAttribute('aria-label', o.label); inp.placeholder = o.placeholder || '–'; inp.title = 'Để trống = tự động';
    inp.value = o.value == null || o.value === '' ? '' : o.value;
    var plus = document.createElement('button'); plus.type = 'button'; plus.innerHTML = EP.icon('plus', 14); plus.setAttribute('aria-label', 'Tăng ' + o.label.toLowerCase());
    var unit = document.createElement('span'); unit.className = 'stepper-unit'; unit.textContent = o.unit || '';
    function clampV(v) { var d = String(o.step).split('.')[1]; return Number(Math.max(o.min, Math.min(o.max, v)).toFixed(d ? d.length : 0)); }
    function commit(v) { inp.value = v === '' ? '' : v; o.onChange(v === '' ? null : v); }
    function base() { return inp.value === '' ? (o.base != null ? o.base : o.min) : Number(inp.value); }
    minus.addEventListener('click', function () { commit(clampV(base() - o.step)); });
    plus.addEventListener('click', function () { commit(clampV(base() + o.step)); });
    inp.addEventListener('change', function () { commit(inp.value === '' ? '' : clampV(Number(inp.value))); });
    box.appendChild(minus); box.appendChild(inp); box.appendChild(unit); box.appendChild(plus);
    return box;
  }
  function weightSelect(label, value, onChange, allowAuto) {
    var sel = document.createElement('select'); sel.className = 'weight-select'; sel.setAttribute('aria-label', label);
    if (allowAuto) sel.add(new Option('Đậm: tự động', ''));
    EP.pageStyle.WEIGHTS.forEach(function (w) { var op = new Option(w[1] + ' ' + w[0], String(w[0])); op.style.fontWeight = w[0]; sel.add(op); });
    sel.value = value == null || value === '' ? '' : String(value);
    sel.addEventListener('change', function () { onChange(sel.value === '' ? null : Number(sel.value)); });
    return sel;
  }

  // Ô font của bảng Giao diện: chọn font + cỡ chữ + độ đậm ngay bên dưới (như thanh định dạng của Word)
  function fontField(label, key, customKey, current, custom, keys, allowDefault, sizeKey, weightKey, sizeLabel, sizeBase) {
    var PS = EP.pageStyle;
    var row = document.createElement('div'); row.className = 'st-row font-field';
    var id = 'fc-' + key;
    var head = document.createElement('label'); head.className = 'st-label'; head.textContent = label; head.htmlFor = id;
    var combo = fontCombo({
      id: id, label: label, allowDefault: allowDefault,
      value: custom || (current && PS.FONTS[current] ? PS.FONTS[current].google : ''),
      onPick: function (name) {
        var st = Object.assign({}, state.event.style || {});
        if (!name) { st[key] = allowDefault ? '' : 'be-vietnam'; st[customKey] = ''; }
        else {
          var k = PS.keyForFamily(name);
          if (k) { st[key] = k; st[customKey] = ''; }
          else { st[key] = allowDefault ? '' : 'be-vietnam'; st[customKey] = name; }
        }
        state.event.style = st;
        persist();
      }
    });
    row.appendChild(head); row.appendChild(combo.wrap);
    if (sizeKey || weightKey) {
      var bar = document.createElement('div'); bar.className = 'typebar';
      var cur = getStyle();
      if (sizeKey) {
        var R = PS.RANGES[sizeKey];
        bar.appendChild(stepper({ label: sizeLabel || 'Cỡ chữ', min: R[0], max: R[1], step: R[2], unit: 'px', value: cur[sizeKey], base: sizeBase, onChange: function (v) { setStyle(sizeKey, v); } }));
      }
      if (weightKey) bar.appendChild(weightSelect(label + ' – độ đậm', cur[weightKey], function (v) { setStyle(weightKey, v); }, true));
      row.appendChild(bar);
    }
    row.appendChild(combo.note);
    return row;
  }
  // Cuộn trang/panel: danh sách bám theo ô; ô ra khỏi màn hình thì đóng
  root.addEventListener('scroll', function (e) {
    if (!openCombo || (e.target.closest && e.target.closest('.combo-list'))) return;
    var r = openCombo.input.getBoundingClientRect();
    if (r.bottom < 0 || r.top > root.innerHeight) openCombo.close(); else openCombo.position();
  }, true);
  root.addEventListener('resize', function () { if (openCombo) openCombo.close(); });

  function renderStylePanel() {
    var box = $('#style-panel');
    if (!box) return;
    document.body.classList.toggle('mode-studio', editorMode === 'studio');
    document.querySelectorAll('.mode-btn').forEach(function (b) {
      var on = b.getAttribute('data-mode') === editorMode;
      b.classList.toggle('is-active', on); b.setAttribute('aria-checked', on ? 'true' : 'false');
    });
    if (!state) { box.innerHTML = '<p class="hint">Tạo trang trước để tuỳ chỉnh giao diện.</p>'; return; }
    var PS = EP.pageStyle, O = PS.OPTIONS, st = getStyle();
    var theme = TPL.get(state.event.templateId).theme;
    var openGroups = {};
    box.querySelectorAll('details').forEach(function (d) { openGroups[d.getAttribute('data-group')] = d.open; });
    var isOpen = function (t, def) { return t in openGroups ? openGroups[t] : def; };
    var focusedId = document.activeElement && box.contains(document.activeElement) ? document.activeElement.getAttribute('aria-label') : null;
    box.innerHTML = '';
    var pick = function (key) { return function (v) { setStyle(key, v); }; };
    var heroDefault = TPL.get(state.event.templateId).wedding ? 'center' : 'left';

    var pal = document.createElement('div'); pal.className = 'palettes';
    PS.PALETTES.forEach(function (p) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'palette';
      b.title = p.name; b.setAttribute('aria-label', 'Bảng màu ' + p.name);
      b.style.setProperty('--sw1', p.primary);
      b.style.setProperty('--sw2', p.accent);
      if (st.primary === p.primary && st.accent === p.accent) b.classList.add('is-active');
      b.addEventListener('click', function () {
        state.event.style = Object.assign({}, state.event.style || {}, { primary: p.primary, accent: p.accent, freeColors: false });
        persist();
      });
      pal.appendChild(b);
    });

    var cta = document.createElement('div'); cta.className = 'st-row';
    cta.innerHTML = '<label class="st-label">Chữ trên nút chính</label>';
    var ctaIn = document.createElement('input'); ctaIn.type = 'text'; ctaIn.maxLength = 32; ctaIn.setAttribute('aria-label', 'Chữ trên nút chính');
    ctaIn.placeholder = TPL.labels(state.event.templateId).submit; ctaIn.value = (state.event.texts && state.event.texts['hero.cta']) || st.ctaText;
    ctaIn.addEventListener('change', function () {
      var t = Object.assign({}, state.event.texts || {});
      if (ctaIn.value.trim()) t['hero.cta'] = ctaIn.value.trim(); else delete t['hero.cta'];
      state.event.texts = t;
      if (state.event.style) delete state.event.style.ctaText;
      persist();
    });
    cta.appendChild(ctaIn);

    if (editorMode === 'simple') {
      // Đơn giản: một cột, ít lựa chọn, màu tự đảm bảo dễ đọc
      var simpleColor = function (label, key, fb) {
        return colorField(label, st[key], fb, '', function (v, commit) {
          state.event.style = Object.assign({}, state.event.style || {}, { freeColors: false });
          setStyle(key, v, commit);
        });
      };
      [
        sectionTitle('Bảng màu'), pal,
        simpleColor('Màu chính', 'primary', theme.primary),
        simpleColor('Màu nhấn', 'accent', theme.accent),
        fontField('Font tiêu đề', 'headingFont', 'headingFontCustom', st.headingFont, st.headingFontCustom, null, true, 'h1Size', 'headingWeight', 'Cỡ tiêu đề lớn', 44),
        chipRow('Kiểu nút', O.button, st.button, pickChip('button')),
        chipRow('Bo góc', O.radius, st.radius, pickChip('radius')),
        chipRow('Căn chữ phần đầu trang', O.heroAlign, st.heroAlign || heroDefault, pick('heroAlign')),
        cta,
        simpleNote()
      ].forEach(function (el) { box.appendChild(el); });
      restoreFocus();
      return;
    }

    // ----- Studio -----
    var studioColor = function (key, label, hint, fb, against) {
      return colorField(label, st[key], fb, hint, function (v, commit) {
        var o = {}; o[key] = v; if (key === 'primary') o.freeColors = true;
        state.event.style = Object.assign({}, state.event.style || {}, o);
        if (commit === false) liveRender(); else persist();
      }, against);
    };
    var cur = function (k, fb) { return function () { return getStyle()[k] || fb; }; };
    var heroBg = st.primary || theme.primary;
    box.appendChild(group('Màu sắc', isOpen('Màu sắc', true), [
      pal,
      studioColor('primary', 'Màu chính', 'Nền phần đầu trang, tiêu đề', theme.primary, cur('heroTextColor', '#ffffff')),
      studioColor('accent', 'Màu nhấn', 'Nút đăng ký, số đếm, biểu tượng', theme.accent, cur('btnTextColor', PS.textOn(st.accent || theme.accent))),
      studioColor('heroTextColor', 'Màu chữ phần đầu trang', '', '#ffffff', function () { return getStyle().primary || theme.primary; }),
      studioColor('btnTextColor', 'Màu chữ trên nút', '', PS.textOn(st.accent || theme.accent), function () { return getStyle().accent || theme.accent; }),
      studioColor('textColor', 'Màu chữ nội dung', '', theme.text, cur('bgColor', '#ffffff')),
      studioColor('mutedColor', 'Màu chữ phụ', 'Chức danh, chú thích', theme.muted, cur('bgColor', '#ffffff')),
      studioColor('bgColor', 'Màu nền trang', 'Để trống để dùng lựa chọn "Nền trang" bên dưới', '#ffffff'),
      chipRow('Nền trang', O.pageBg, st.pageBg, pickChip('pageBg')),
      studioColor('surfaceColor', 'Màu nền khối nhạt', 'Khối lợi ích, phần đếm ngược', theme.surface),
      studioColor('overlayColor', 'Màu lớp phủ ảnh bìa', '', '#0a0a14')
    ]));
    var allFonts = Object.keys(PS.FONTS);
    box.appendChild(group('Chữ', isOpen('Chữ', false), [
      fontField('Font tiêu đề', 'headingFont', 'headingFontCustom', st.headingFont, st.headingFontCustom, allFonts, true, 'h1Size', 'headingWeight', 'Cỡ tiêu đề lớn', 44),
      rangeField('h2Size', st.h2Size), rangeField('headingLineHeight', st.headingLineHeight), rangeField('letterSpacing', st.letterSpacing),
      chipRow('Kiểu chữ tiêu đề', O.headingUpper, st.headingUpper, pick('headingUpper')),
      chipRow('Dáng chữ tiêu đề', O.headingItalic, st.headingItalic, pick('headingItalic')),
      fontField('Font nội dung', 'bodyFont', 'bodyFontCustom', st.bodyFont, st.bodyFontCustom, allFonts, false, 'bodySize', 'bodyWeight', 'Cỡ chữ nội dung', 16),
      rangeField('lineHeight', st.lineHeight), rangeField('bodyLetterSpacing', st.bodyLetterSpacing), rangeField('wordSpacing', st.wordSpacing),
      rangeField('textIndent', st.textIndent), rangeField('paraSpacing', st.paraSpacing),
      chipRow('Căn lề nội dung', O.bodyAlign, st.bodyAlign, pick('bodyAlign'))
    ]));
    box.appendChild(group('Phần đầu trang', isOpen('Phần đầu trang', false), [
      chipRow('Căn chữ', O.heroAlign, st.heroAlign || heroDefault, pick('heroAlign')),
      chipRow('Chiều cao nhanh', O.heroHeight, st.heroHeight, pickChip('heroHeight')),
      rangeField('heroMinH', st.heroMinH), rangeField('heroPad', st.heroPad), rangeField('heroOverlay', st.heroOverlay),
      cta
    ]));
    box.appendChild(group('Nút & hình khối', isOpen('Nút & hình khối', false), [
      chipRow('Kiểu nút', O.button, st.button, pickChip('button')),
      rangeField('btnRadiusPx', st.btnRadiusPx), rangeField('radiusPx', st.radiusPx), rangeField('shadowLevel', st.shadowLevel),
      chipRow('Biểu tượng lợi ích', O.bullet, st.bullet, pick('bullet')),
      chipRow('Đồng hồ đếm ngược', O.countdown, st.countdown, pick('countdown'))
    ]));
    box.appendChild(group('Bố cục & hiệu ứng', isOpen('Bố cục & hiệu ứng', false), [
      rangeField('sectionPad', st.sectionPad), rangeField('maxWidth', st.maxWidth),
      chipRow('Hiệu ứng khi khách xem', O.motion, st.motion, pick('motion'))
    ]));
    var tip = document.createElement('p'); tip.className = 'hint';
    tip.textContent = 'Mẹo: bấm biểu tượng tuỳ chỉnh trên từng phần ở cột trái, hoặc bấm thẳng vào phần đó trên trang, để đổi màu nền, màu chữ, căn lề riêng.';
    box.appendChild(tip);
    restoreFocus();

    function restoreFocus() {
      if (!focusedId) return;
      var el = box.querySelector('[aria-label="' + focusedId.replace(/"/g, '\\"') + '"]');
      if (el && el.focus) el.focus();
    }
    function sectionTitle(t) { var h = document.createElement('p'); h.className = 'st-label'; h.textContent = t; return h; }
    function simpleNote() {
      var p = document.createElement('p'); p.className = 'hint';
      p.textContent = 'Cần chỉnh cỡ chữ, khoảng cách, màu từng phần…? Chuyển sang chế độ Studio.';
      return p;
    }
  }

  // Chọn nhanh ở chế độ Đơn giản: xoá thông số Studio đè lên lựa chọn đó
  function pickChip(key) {
    return function (v) {
      var st = Object.assign({}, state.event.style || {});
      st[key] = v;
      (EP.pageStyle.CHIP_CLEARS[key] || []).forEach(function (k) { delete st[k]; });
      state.event.style = st;
      persist();
    };
  }

  // ---------- Hoàn tác / làm lại ----------
  var undoStack = [], redoStack = [], lastSnap = null;
  function snapshot() { return JSON.stringify({ event: state.event, content: state.content }); }
  function resetHistory() { undoStack = []; redoStack = []; lastSnap = null; updateHistoryUi(); }
  function recordHistory() {
    if (!state) return;
    var snap = snapshot();
    if (lastSnap && snap !== lastSnap) {
      undoStack.push(lastSnap);
      if (undoStack.length > 60) undoStack.shift();
      redoStack = [];
    }
    lastSnap = snap;
    updateHistoryUi();
  }
  function restore(snap) {
    var d = JSON.parse(snap);
    state.event = d.event; state.content = d.content;
    lastSnap = snap;
    saveState();
    setTemplate(state.event.templateId);
    renderLanding();
    if (isCloudEvent() && C.currentUser()) C.publishEvent(state.event, state.content, false).catch(function () {});
    updateHistoryUi();
  }
  function undo() { if (!undoStack.length || !state) return; redoStack.push(snapshot()); restore(undoStack.pop()); swapLanding(); toast('Đã hoàn tác.'); }
  function redo() { if (!redoStack.length || !state) return; undoStack.push(snapshot()); restore(redoStack.pop()); swapLanding(); toast('Đã làm lại.'); }
  function updateHistoryUi() {
    var u = $('#btn-undo'), r = $('#btn-redo');
    if (u) u.disabled = !undoStack.length;
    if (r) r.disabled = !redoStack.length;
  }

  // Sửa chữ của các phần tử khác (tiêu đề phần, nhãn, nút…) → ev.texts
  // html: bản có định dạng (đậm, nghiêng, link…) đã lọc; null = chữ thường
  function setRich(key, plain, html) {
    var r = Object.assign({}, state.event.rich || {});
    if (html) r[key] = { plain: plain, html: html }; else delete r[key];
    state.event.rich = Object.keys(r).length ? r : null;
  }
  function editText(key, value, html) {
    var t = Object.assign({}, state.event.texts || {});
    t[key] = value;
    state.event.texts = t;
    setRich(key, value, html);
    persist();
    toast('Đã lưu chỉnh sửa.');
  }

  // Sửa chữ trực tiếp trên trang
  function editContent(field, value, html) {
    var c = JSON.parse(JSON.stringify(state.content));
    if (field.indexOf('benefits:') === 0) c.benefits[Number(field.split(':')[1])] = value;
    else c[field] = value;
    state.content = c;
    setRich(field, value, html);
    persist();
    toast('Đã lưu chỉnh sửa.');
  }

  // Thiết bị xem trước (bề rộng thật của trang) và mức thu phóng; 'fit' = tự vừa khung
  var DEVICE_W = { desktop: 1280, tablet: 768, mobile: 390 };
  var ZOOMS = [0.25, 0.4, 0.5, 0.6, 0.75, 0.9, 1, 1.2, 1.5];
  var view = S.read('ws_view', {});
  var device = DEVICE_W[view.device] ? view.device : 'desktop';
  var zoom = view.zoom === 'fit' || ZOOMS.indexOf(view.zoom) >= 0 ? view.zoom : 'fit';
  function currentZoom() {
    if (zoom !== 'fit') return zoom;
    var wrap = landingEl.parentNode;
    var avail = (wrap ? wrap.clientWidth : 0) - 32;
    return avail > 0 ? Math.min(1, avail / DEVICE_W[device]) : 1;
  }
  function applyDevice() {
    ['desktop', 'tablet', 'mobile'].forEach(function (d) { landingEl.classList.toggle('device-' + d, d === device); });
    landingEl.style.width = DEVICE_W[device] + 'px';
    var z = currentZoom();
    landingEl.style.zoom = z;
    var sel = $('#zoom-select');
    if (sel) {
      var fitOpt = sel.querySelector('option[value="fit"]');
      fitOpt.textContent = 'Vừa khung (' + Math.round(z * 100) + '%)';
      sel.value = zoom === 'fit' ? 'fit' : String(zoom);
    }
    document.querySelectorAll('.device-toggle [data-device]').forEach(function (x) { x.classList.toggle('is-active', x.getAttribute('data-device') === device); });
  }
  function saveView() { S.write('ws_view', { device: device, zoom: zoom }); }
  function setDevice(d) {
    if (d === device) return;
    EP.motion.transition(function () { device = d; saveView(); applyDevice(); }, 'device');
    if (EP.inspector) setTimeout(EP.inspector.refresh, 360);
  }
  function setZoom(z) {
    EP.motion.transition(function () { zoom = z; saveView(); applyDevice(); }, 'device');
    if (EP.inspector) setTimeout(EP.inspector.refresh, 360);
  }
  function stepZoom(dir) {
    var cur = currentZoom(), next;
    if (dir > 0) next = ZOOMS.filter(function (v) { return v > cur + 0.001; })[0] || ZOOMS[ZOOMS.length - 1];
    else next = ZOOMS.filter(function (v) { return v < cur - 0.001; }).pop() || ZOOMS[0];
    setZoom(next);
  }

  // Cả trang đổi (tạo mới, đổi mẫu, hoàn tác, xem thử trạng thái): hiệu ứng chuyển mượt
  function swapLanding() { EP.motion.replay(landingEl, 'mo-swap'); }

  // Xem trước tức thì khi kéo thanh trượt / chọn màu: chỉ vẽ lại trang, giữ nguyên bảng điều khiển
  // Gộp các lần kéo trong cùng một khung hình: vẽ lại tối đa 1 lần/khung, không bị khựng khi kéo màu
  var livePreview = false, liveRaf = 0;
  function liveRender() {
    if (liveRaf) return;
    liveRaf = requestAnimationFrame(function () {
      liveRaf = 0;
      livePreview = true;
      try { renderLanding(); } finally { livePreview = false; }
    });
  }

  function renderLanding() {
    if (!state) return;
    $('#mock-note').hidden = state.content.source !== 'mock';
    syncSimUi();
    if (!livePreview) {
      renderSectionList();
      renderStylePanel();
    }
    var scroller = landingEl.parentNode, keepTop = scroller ? scroller.scrollTop : 0;
    renderer = EP.landingRenderer.render(landingEl, {
      event: state.event,
      content: state.content,
      now: simNow,
      getCount: simCount,
      editable: true,
      onPickImage: pickImage,
      onEditContent: editContent,
      onEditText: editText,
      appUrl: APP_URL,
      onRegister: function (data) {
        if (simState) return { ok: false, errors: { form: 'Đang ở chế độ xem thử trạng thái. Chọn "Hiện tại" để đăng ký thật.' } };
        if (isCloudEvent()) return cloudRegister(state.event, data);
        var r = EP.registrations.register(state.event, data, new Date(), currentCount());
        if (!r.ok) {
          if (r.duplicate) toast('Bạn đã đăng ký rồi bằng số điện thoại hoặc email này.');
          return r;
        }
        if (!state.event.sheetUrl) {
          toast(r.waitlist ? 'Đã thêm vào danh sách chờ.' : 'Có thêm 1 người đăng ký!');
          return r;
        }
        // Có Google Sheet: chờ Sheet xác nhận (kiểm tra trùng trên mọi thiết bị, số chỗ chung)
        return syncRecord(r.record).then(function (data) {
          if (data.duplicate) {
            return { ok: false, duplicate: true, errors: { form: 'Bạn đã đăng ký rồi bằng số điện thoại hoặc email này.' } };
          }
          var waitlist = data.status === 'waitlist';
          toast(waitlist ? 'Đã thêm vào danh sách chờ.' : 'Có thêm 1 người đăng ký!');
          return { ok: true, waitlist: waitlist, record: r.record };
        }, function () {
          // Mất kết nối: vẫn nhận đăng ký, lưu trên máy và tự gửi lại sau
          toast('Đã lưu đăng ký. Sẽ tự gửi lên Google Sheet khi có kết nối.');
          return r;
        });
      }
    });
    applyDevice();
    if (scroller && scroller.scrollTop !== keepTop) scroller.scrollTop = keepTop;
    if (EP.inspector) EP.inspector.refresh();
    if (!livePreview) { renderBlockLib(); renderLayers(); }
    $('#btn-regenerate').disabled = false;
    updatePublishUi();
  }

  // ---------- Firebase: xuất bản, đăng ký dùng chung mọi thiết bị ----------
  function isCloudEvent() { return !!(state && state.event.published && C.available); }

  function startWatch(eventId) {
    if (stopWatch) stopWatch();
    cloudStats = null;
    stopWatch = C.watchStats(eventId, function (st) {
      cloudStats = st;
      if (renderer) renderer.update();
    });
  }

  // Đăng ký qua Firebase (dùng cho cả trang công khai lẫn bản xem trước đã xuất bản)
  function cloudRegister(ev, data) {
    var errors = V.validateRegistration(data);
    if (Object.keys(errors).length) return { ok: false, errors: errors };
    var count = cloudStats ? cloudStats.count : 0;
    if (!EP.eventStatus.getStatus(ev, count, new Date()).canRegister) {
      return { ok: false, errors: { form: 'Sự kiện đã diễn ra, không thể đăng ký thêm.' } };
    }
    var rec = { name: V.clean(data.name), phone: V.normalizePhone(data.phone), email: V.clean(data.email).toLowerCase() };
    return C.register(ev, rec).then(function (res) {
      if (!res.ok) {
        return { ok: false, duplicate: true, errors: { form: 'Bạn đã đăng ký rồi bằng số điện thoại hoặc email này.' } };
      }
      // Gửi thêm bản sao sang Google Sheet nếu ban tổ chức có kết nối (không chặn người dùng)
      if (ev.sheetUrl) {
        EP.sheetSync.send(ev.sheetUrl, ev, {
          id: rec.phone, name: rec.name, phone: rec.phone, email: rec.email, createdAt: new Date().toISOString()
        }).catch(function () { /* Sheet lỗi không ảnh hưởng đăng ký chính */ });
      }
      toast(res.waitlist ? 'Đã thêm vào danh sách chờ.' : 'Đăng ký thành công!');
      return { ok: true, waitlist: res.waitlist };
    }, function (e) {
      return { ok: false, errors: { form: e.message } };
    });
  }

  function shareUrl(eventId) {
    return root.location.origin + root.location.pathname + '?e=' + encodeURIComponent(eventId);
  }

  function showShare() {
    var box = $('#share-box');
    if (!isCloudEvent()) { box.hidden = true; return; }
    var url = shareUrl(state.event.id);
    var isFile = root.location.protocol === 'file:';
    box.hidden = false;
    $('#share-url').value = isFile ? '(Cần mở app qua GitHub Pages để có link chia sẻ)' : url;
    $('#btn-open-link').href = isFile ? '#' : url;
    $('#share-note').textContent = 'Số người đăng ký trên trang cập nhật tức thì trên mọi thiết bị.';
    var qrBox = $('#share-qr');
    qrBox.innerHTML = '';
    if (!isFile && root.qrcode) {
      var qr = root.qrcode(0, 'M');
      qr.addData(url);
      qr.make();
      var img = document.createElement('img');
      img.src = qr.createDataURL(6, 2);
      img.alt = 'Mã QR mở trang đăng ký';
      qrBox.appendChild(img);
    }
  }

  function updatePublishUi() {
    var btn = $('#btn-publish');
    btn.hidden = !C.available || !state;
    btn.disabled = !state;
    btn.classList.remove('is-loading');
    btn.innerHTML = EP.icon('send') + (isCloudEvent() ? 'Cập nhật trang' : 'Xuất bản');
    var pill = $('#editor-status');
    pill.textContent = isCloudEvent() ? 'Đã xuất bản' : 'Bản nháp';
    pill.className = 'pill' + (isCloudEvent() ? ' is-positive' : '');
    $('#editor-title').textContent = state ? state.event.name : 'Thiết kế trang';
    showShare();
  }

  // ---------- Kiểm tra trước khi xuất bản ----------
  // level: ok | warn (vẫn xuất bản được) | block (phải sửa)
  function runChecklist() {
    var ev = state.event;
    var c = state.content;
    var items = [];
    function add(ok, okText, badText, level) { items.push({ level: ok ? 'ok' : level, text: ok ? okText : badText }); }
    add(new Date(ev.startAt) > new Date(), 'Thời gian sự kiện ở tương lai', 'Thời gian sự kiện đã qua – khách sẽ không đăng ký được', 'block');
    add(c.headline.length <= 90, 'Tiêu đề ngắn gọn (≤ 90 ký tự)', 'Tiêu đề dài ' + c.headline.length + ' ký tự – nên rút gọn để dễ đọc trên điện thoại', 'warn');
    add(c.benefits.length === 3 && c.benefits.every(Boolean), 'Đủ 3 lợi ích khi tham dự', 'Thiếu lợi ích khi tham dự', 'block');
    add(ev.agenda && ev.agenda.length > 0, 'Có chương trình (agenda)', 'Chưa có chương trình – khách khó hình dung buổi sự kiện', 'warn');
    add(!!Number(ev.capacity), 'Đã đặt số chỗ tối đa (' + ev.capacity + ')', 'Chưa đặt số chỗ – trang sẽ không báo sắp hết chỗ / danh sách chờ', 'warn');
    add(!!(ev.images && ev.images.hero), 'Có ảnh bìa', 'Chưa có ảnh bìa – trang dùng nền màu mặc định', 'warn');
    var docBytes = JSON.stringify({ e: ev, c: c }).length;
    add(docBytes < 1000000, 'Dung lượng trang vừa đủ để xuất bản (' + Math.round(docBytes / 1024) + ' KB)', 'Trang quá nặng (' + Math.round(docBytes / 1024) + ' KB, tối đa khoảng 970 KB) – bớt ảnh hoặc dùng logo nhẹ hơn', 'block');
    add(c.source !== 'mock', 'Nội dung do AI thật viết hoặc đã chỉnh tay', 'Nội dung đang là bản AI mô phỏng – nên đọc lại hoặc sửa trực tiếp trước khi gửi khách', 'warn');
    if (TPL.get(ev.templateId).wedding) {
      add(!!ev.studioName, 'Có ghi nguồn studio ảnh cưới', 'Chưa ghi tên studio – thiệp sẽ không có nút "Đặt lịch chụp"', 'warn');
    }
    return items;
  }

  function confirmChecklist() {
    var items = runChecklist();
    var blocked = items.some(function (i) { return i.level === 'block'; });
    var ul = $('#checklist');
    ul.innerHTML = '';
    items.forEach(function (i) {
      var li = document.createElement('li');
      li.className = 'is-' + i.level;
      li.textContent = i.text;
      ul.appendChild(li);
    });
    $('#check-note').textContent = blocked ? 'Cần sửa các mục đánh dấu đỏ trước khi xuất bản.' : 'Các mục màu vàng là gợi ý, bạn vẫn có thể xuất bản.';
    $('#btn-check-ok').disabled = blocked;
    var dlg = $('#check-dialog');
    return new Promise(function (resolve) {
      function done(ok) {
        $('#btn-check-ok').onclick = null;
        $('#btn-check-cancel').onclick = null;
        if (dlg.close) dlg.close(); else dlg.removeAttribute('open');
        resolve(ok);
      }
      $('#btn-check-ok').onclick = function () { done(true); };
      $('#btn-check-cancel').onclick = function () { done(false); };
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    });
  }

  function publish() {
    if (!state) return;
    confirmChecklist().then(function (ok) { if (ok) doPublish(); });
  }

  function doPublish() {
    var go = function () {
      var isNew = !state.event.published;
      var btn = $('#btn-publish');
      btn.disabled = true;
      btn.textContent = 'Đang xuất bản…';
      btn.classList.add('is-loading');
      return C.publishEvent(state.event, state.content, isNew).then(function () {
        state.event.published = true;
        state.event.ownerUid = C.currentUser().uid;
        saveState();
        startWatch(state.event.id);
        renderLanding();
        openSidePane('publish');
        toast(isNew ? 'Đã xuất bản! Gửi link hoặc mã QR cho khách.' : 'Đã cập nhật trang.');
      }, function (e) {
        toast('Không xuất bản được: ' + e.message);
      }).then(updatePublishUi);
    };
    if (C.currentUser()) return go();
    toast('Đang mở cửa sổ đăng nhập Google…');
    C.signIn().then(go, function (e) { toast(e.message); });
  }

  function updateAuthUi(user) {
    $('#btn-auth').hidden = !C.available;
    $('#btn-auth').textContent = user ? 'Đăng xuất' : 'Đăng nhập Google';
    $('#user-email').hidden = !user;
    $('#user-email').textContent = user ? (user.email || 'Đã đăng nhập') : '';
    if (user) EP.motion.replay($('#user-email'), 'mo-pop');
    if (!$('#view-admin').hidden) renderAdmin();
  }

  // ---------- Đồng bộ Google Sheet ----------
  function currentCount() {
    var id = state.event.id;
    if (isCloudEvent()) return cloudStats ? cloudStats.count : 0;
    var local = EP.registrations.confirmedCount(id);
    if (!state.event.sheetUrl || remoteCount == null) return local;
    // Số trên Sheet + những người vừa đăng ký trên máy này nhưng chưa gửi được
    var pending = EP.registrations.unsynced(id).filter(function (r) { return r.status === 'new'; }).length;
    return remoteCount + pending;
  }

  function setSheetStatus(text, kind) {
    var el = $('#sheet-status');
    el.hidden = !text;
    el.textContent = text || '';
    el.className = 'sheet-status' + (kind ? ' is-' + kind : '');
  }

  function syncedNow() {
    return 'Google Sheet: đã đồng bộ lúc ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }

  function syncRecord(record) {
    var ev = state.event;
    return EP.sheetSync.send(ev.sheetUrl, ev, record).then(function (data) {
      if (data.duplicate) {
        EP.registrations.update(ev.id, record.id, { synced: true, status: 'duplicate' });
      } else {
        EP.registrations.update(ev.id, record.id, { synced: true, status: data.status });
      }
      if (typeof data.count === 'number') remoteCount = data.count;
      setSheetStatus(syncedNow(), 'ok');
      if (renderer) renderer.update();
      return data;
    }, function (e) {
      setSheetStatus('Google Sheet: chưa gửi được (đã lưu trên máy, sẽ tự gửi lại). ' + e.message, 'error');
      throw e;
    });
  }

  // Gửi lại các bản ghi chưa đồng bộ, rồi lấy số đăng ký chung
  function syncAll() {
    // Trang đã xuất bản dùng Firebase làm nguồn chính; Sheet chỉ nhận bản sao
    if (!state || !state.event.sheetUrl || isCloudEvent()) return Promise.resolve();
    var ev = state.event;
    var chain = Promise.resolve();
    EP.registrations.unsynced(ev.id).forEach(function (r) {
      chain = chain.then(function () { return syncRecord(r); });
    });
    return chain.then(function () {
      return EP.sheetSync.getCount(ev.sheetUrl, ev.id);
    }).then(function (data) {
      if (!state || state.event.id !== ev.id) return;
      remoteCount = data.count;
      setSheetStatus(syncedNow(), 'ok');
      if (renderer) renderer.update();
      if (!$('#view-admin').hidden) renderAdmin();
    }).catch(function (e) {
      setSheetStatus('Google Sheet: mất kết nối, đang dùng dữ liệu trên máy. ' + e.message, 'error');
    });
  }

  function testSheet() {
    var url = V.clean(form.elements.sheetUrl.value);
    var msg = $('#sheet-msg');
    msg.className = 'form-msg';
    if (!url) { msg.textContent = 'Hãy dán đường dẫn Apps Script trước.'; msg.classList.add('is-error'); return; }
    if (!EP.sheetSync.isValidUrl(url)) {
      msg.textContent = 'Đường dẫn phải có dạng https://script.google.com/macros/s/.../exec';
      msg.classList.add('is-error');
      return;
    }
    msg.textContent = 'Đang kiểm tra…';
    EP.sheetSync.ping(url).then(function () {
      msg.textContent = 'Kết nối thành công! Bấm "Tạo landing page" để lưu cấu hình.';
      msg.classList.add('is-success');
    }, function (e) {
      msg.textContent = e.message + ' Kiểm tra lại bước "Triển khai" với quyền "Bất kỳ ai".';
      msg.classList.add('is-error');
    });
  }

  function saveAndRender(ev, content, tone) {
    if (!state || state.event.sheetUrl !== ev.sheetUrl) { remoteCount = null; setSheetStatus(''); }
    if (state && state.event.id === ev.id && state.event.published) {
      ev.published = true;
      ev.ownerUid = state.event.ownerUid;
    }
    if (state && state.event.id === ev.id) {
      if (state.event.style && !ev.style) ev.style = state.event.style;
    } else resetHistory();
    // Brand DNA chọn ở bước 1: áp dụng khi mới chọn (hoặc đổi) thương hiệu; "Không dùng" thì gỡ ra
    var prevBrand = state && state.event.id === ev.id ? state.event.brandId : null;
    if (!ev.brandId) { ev.brand = null; }
    else if (ev.brandId !== prevBrand && B.get(ev.brandId)) B.applyTo(ev, B.get(ev.brandId));
    state = { event: ev, content: content, tone: tone };
    recordHistory();
    if (!saveState()) setMsg('Không lưu được dữ liệu vào trình duyệt.', 'error');
    renderLanding();
    swapLanding();
    syncAll();
    switchTab('editor');
    // Trang đã xuất bản: tự cập nhật bản công khai
    if (isCloudEvent() && C.currentUser()) {
      C.publishEvent(ev, content, false).then(function () { toast('Đã cập nhật trang công khai.'); }, function (e) { toast('Chưa cập nhật được trang công khai: ' + e.message); });
    }
  }

  // ---------- Sinh nội dung theo chế độ AI ----------
  function currentMode() { return form.querySelector('input[name="aiMode"]:checked').value; }

  function generate(isRegenerate) {
    var ev = readForm(state && state.event ? state.event.id : null);
    var errors = V.validateEvent(ev);
    showErrors(errors);
    if (Object.keys(errors).length) { setMsg('Vui lòng kiểm tra lại các ô được đánh dấu đỏ.', 'error'); return; }

    var tone = form.elements.tone.value;
    var mode = currentMode();
    var btn = $('#btn-generate');

    if (mode === 'mock') {
      regenSeed = isRegenerate ? regenSeed + 1 : 0;
      EP.motion.replay(isRegenerate ? $('#btn-regenerate-2') : btn, 'mo-sparkle');
      saveAndRender(ev, EP.contentGenerator.generate(ev, tone, regenSeed), tone);
      setMsg('Đã tạo nội dung bằng AI mô phỏng (offline).', 'success');
      return;
    }

    if (mode === 'copy') {
      var pasted = $('#f-paste').value;
      if (!pasted.trim()) { setMsg('Hãy dán kết quả JSON từ AI vào ô bên trên, hoặc bấm một nền tảng để lấy prompt.', 'error'); return; }
      try {
        var parsed = EP.ai.parseAIResponse(pasted, ev, tone);
        saveAndRender(ev, parsed.content, tone);
        setMsg(parsed.warnings.length ? 'Đã dùng kết quả AI. Lưu ý: ' + parsed.warnings.join(' ') : 'Đã dùng kết quả AI bạn dán vào.', parsed.warnings.length ? 'warn' : 'success');
      } catch (e) {
        setMsg('Không đọc được kết quả: ' + e.message + ' Hãy copy lại đúng khối JSON AI trả về.', 'error');
      }
      return;
    }

    // Gemini API
    var key = $('#f-apikey').value.trim();
    if (!key) { setMsg('Vui lòng nhập Gemini API key, hoặc chọn chế độ Mô phỏng.', 'error'); $('#f-apikey').focus(); return; }
    if ($('#f-remember-key').checked) S.write('gemini_key', key); else S.remove('gemini_key');
    btn.disabled = true;
    btn.textContent = 'Đang viết nội dung…';
    btn.classList.add('is-loading');
    landingEl.classList.add('is-generating');
    setMsg('Gemini đang viết nội dung, thường mất 3–10 giây.', '');
    EP.ai.callGemini(key, $('#f-model').value.trim() || 'gemini-2.5-flash', EP.ai.buildPrompt(ev, tone))
      .then(function (text) {
        var parsed = EP.ai.parseAIResponse(text, ev, tone);
        saveAndRender(ev, parsed.content, tone);
        setMsg(parsed.warnings.length ? 'Đã tạo bằng Gemini. Lưu ý: ' + parsed.warnings.join(' ') : 'Đã tạo nội dung bằng Gemini.', parsed.warnings.length ? 'warn' : 'success');
      })
      .catch(function (e) {
        setMsg(e.message + ' Thông tin bạn nhập vẫn được giữ nguyên.', 'error');
      })
      .then(function () {
        btn.disabled = false;
        btn.classList.remove('is-loading');
        landingEl.classList.remove('is-generating');
        btn.innerHTML = EP.icon('wand') + 'Tạo landing page';
      });
  }

  // ---------- Copy prompt sang nền tảng khác ----------
  function copyText(text) {
    if (navigator.clipboard && root.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      if (ok) resolve(); else reject(new Error('copy failed'));
    });
  }

  function buildPlatformButtons() {
    var box = $('#platforms');
    Object.keys(EP.ai.PLATFORMS).forEach(function (id) {
      var p = EP.ai.PLATFORMS[id];
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn btn-ghost btn-small';
      b.textContent = 'Copy prompt & mở ' + p.label;
      b.addEventListener('click', function () {
        var ev = readForm();
        var errors = V.validateEvent(ev);
        showErrors(errors);
        if (Object.keys(errors).length) { setMsg('Điền đủ thông tin sự kiện trước khi lấy prompt.', 'error'); return; }
        var prompt = EP.ai.buildPrompt(ev, form.elements.tone.value);
        copyText(prompt).then(function () {
          setMsg('Đã copy prompt. Dán vào ' + p.label + ' (Ctrl+V), rồi copy kết quả JSON về ô bên trên.', 'success');
        }, function () {
          $('#f-paste').value = prompt;
          setMsg('Trình duyệt chặn copy tự động. Prompt đã được đặt vào ô dán, hãy tự copy (Ctrl+A, Ctrl+C).', 'warn');
        });
        root.open(p.url, '_blank', 'noopener');
      });
      box.appendChild(b);
    });
  }

  // ---------- Danh sách đăng ký (quản trị) ----------
  var STATUS_TEXT = { new: 'Đã đăng ký', waitlist: 'Danh sách chờ', duplicate: 'Trùng (đã có trên Sheet)' };

  function syncText(r) {
    if (isCloudEvent()) return state.event.sheetUrl ? 'Firebase + Sheet' : 'Firebase';
    if (!state.event.sheetUrl) return 'Trên máy';
    return r.synced === false ? 'Chờ gửi' : 'Đã gửi';
  }

  function adminMessage(text) {
    $('#admin-rows').innerHTML = '';
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    td.colSpan = 9; td.className = 'empty'; td.textContent = text;
    tr.appendChild(td);
    $('#admin-rows').appendChild(tr);
  }

  // ---------- Số liệu phễu + chăm sóc lead ----------
  var LEAD_TEXT = { new: 'Mới', contacted: 'Đã liên hệ', won: 'Chốt tham dự', lost: 'Huỷ' };

  function drawMetrics(regs, m) {
    var grid = $('#metric-grid');
    grid.innerHTML = '';
    var confirmed = regs.filter(function (r) { return r.status === 'new'; }).length;
    var waitlist = regs.filter(function (r) { return r.status === 'waitlist'; }).length;
    var won = regs.filter(function (r) { return r.leadStatus === 'won'; }).length;
    var cards = [['Đã đăng ký', confirmed], ['Danh sách chờ', waitlist], ['Đã chốt tham dự', won]];
    if (m) {
      cards.unshift(['Lượt xem trang', m.views]);
      cards.push(['Tỉ lệ chuyển đổi', m.views ? (confirmed / m.views * 100).toFixed(1).replace('.', ',') + '%' : '—']);
      cards.push(['Bấm nút đăng ký ở đầu trang', m.ctaClicks]);
      if (TPL.get(state.event.templateId).wedding) cards.push(['Bấm "Đặt lịch studio"', m.studioClicks]);
      cards.push(['Bấm "Tạo trang như thế này"', m.appClicks]);
    }
    cards.forEach(function (c) {
      var d = document.createElement('div'); d.className = 'metric';
      var sp = document.createElement('span'); sp.textContent = c[0];
      var st = document.createElement('strong'); st.textContent = typeof c[1] === 'number' ? c[1].toLocaleString('vi-VN') : c[1];
      d.appendChild(sp); d.appendChild(st); grid.appendChild(d);
      if (typeof c[1] === 'number') EP.motion.countUp(st, c[1]);
      if (c[0] === 'Đã đăng ký' && c[1] > 0) st.classList.add('is-data'); // chỉ tô màu khi có dữ liệu thật
    });
    EP.motion.stagger(grid.children);
  }

  function setLead(r, value) {
    r.leadStatus = value;
    if (isCloudEvent()) {
      C.updateLead(state.event.id, r.id, value).then(function () { toast('Đã cập nhật trạng thái chăm sóc.'); }, function (e) { toast('Chưa lưu được: ' + e.message); });
    } else {
      EP.registrations.update(state.event.id, r.id, { leadStatus: value });
      toast('Đã cập nhật trạng thái chăm sóc.');
    }
    drawMetrics(adminRows, lastMetrics);
  }

  var lastMetrics = null;

  function renderAdmin() {
    adminRows = [];
    lastMetrics = null;
    $('#metric-grid').innerHTML = '';
    $('#admin-source').textContent = isCloudEvent()
      ? 'Dữ liệu lưu trên máy chủ Firebase, xem được trên mọi thiết bị khi đăng nhập đúng tài khoản.'
      : 'Dữ liệu chỉ lưu trên trình duyệt này (localStorage). Xuất bản trang để nhận đăng ký từ mọi thiết bị.';
    if (!state) {
      $('#admin-title').textContent = 'Danh sách đăng ký';
      return adminMessage('Chưa có sự kiện nào. Hãy tạo landing page trước.');
    }
    if (isCloudEvent()) {
      var user = C.currentUser();
      if (!user) return adminMessage('Trang đã xuất bản: đăng nhập Google (tài khoản đã xuất bản trang) để xem danh sách đăng ký.');
      if (user.uid !== state.event.ownerUid) return adminMessage('Tài khoản này không phải chủ sự kiện nên không xem được danh sách.');
      adminMessage('Đang tải danh sách…');
      C.listRegistrations(state.event.id).then(function (regs) {
        drawAdmin(regs);
        return C.getMetrics(state.event.id).then(function (m) { lastMetrics = m; drawMetrics(regs, m); }, function () {});
      }, function (e) { adminMessage('Không tải được danh sách: ' + e.message); });
      return;
    }
    drawAdmin(EP.registrations.list(state.event.id));
  }

  function drawAdmin(regs) {
    var tbody = $('#admin-rows');
    adminRows = regs;
    var confirmed = regs.filter(function (r) { return r.status === 'new'; }).length;
    $('#admin-title').textContent = 'Danh sách đăng ký – ' + state.event.name + ' (' + confirmed + ' người)';
    drawMetrics(regs, lastMetrics);
    tbody.innerHTML = '';
    if (!regs.length) return adminMessage('Chưa có ai đăng ký.');
    regs.forEach(function (r, i) {
      var tr = document.createElement('tr');
      function cell(v) { var td = document.createElement('td'); if (v instanceof Node) td.appendChild(v); else td.textContent = v; tr.appendChild(td); }
      cell(i + 1); cell(r.name); cell(r.phone); cell(r.email);
      cell(new Date(r.createdAt).toLocaleString('vi-VN')); cell(STATUS_TEXT[r.status] || r.status);
      var sel = document.createElement('select');
      sel.className = 'lead-select';
      sel.setAttribute('aria-label', 'Trạng thái chăm sóc của ' + r.name);
      Object.keys(LEAD_TEXT).forEach(function (k) {
        var o = document.createElement('option'); o.value = k; o.textContent = LEAD_TEXT[k];
        if ((r.leadStatus || 'new') === k) o.selected = true;
        sel.appendChild(o);
      });
      sel.addEventListener('change', function () { setLead(r, sel.value); EP.motion.replay(tr, 'mo-flash'); });
      cell(sel);
      var links = document.createElement('span');
      links.className = 'contact-links';
      var tel = document.createElement('a'); tel.href = 'tel:' + r.phone; tel.textContent = 'Gọi';
      var zalo = document.createElement('a'); zalo.href = 'https://zalo.me/' + r.phone; zalo.target = '_blank'; zalo.rel = 'noopener'; zalo.textContent = 'Zalo';
      links.appendChild(tel); links.appendChild(zalo);
      cell(links);
      cell(syncText(r));
      tbody.appendChild(tr);
    });
    EP.motion.stagger(tbody.children, 20);
  }

  function csvCell(v) {
    var s = String(v == null ? '' : v);
    if (/^[=+\-@]/.test(s)) s = "'" + s; // chặn công thức độc hại khi mở bằng Excel
    return '"' + s.replace(/"/g, '""') + '"';
  }

  function exportCsv() {
    if (!state) return toast('Chưa có sự kiện để xuất.');
    var regs = adminRows;
    if (!regs.length) return toast('Chưa có ai đăng ký để xuất.');
    var rows = [['STT', 'Họ tên', 'Số điện thoại', 'Email', 'Thời gian đăng ký', 'Trạng thái', 'Chăm sóc']].concat(regs.map(function (r, i) {
      return [i + 1, r.name, r.phone, r.email, new Date(r.createdAt).toLocaleString('vi-VN'), STATUS_TEXT[r.status] || r.status, LEAD_TEXT[r.leadStatus || 'new']];
    }));
    // ﻿ để Excel đọc đúng tiếng Việt
    var blob = new Blob(['﻿' + rows.map(function (r) { return r.map(csvCell).join(','); }).join('\r\n')], { type: 'text/csv;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'dang-ky-' + state.event.name.replace(/[^\wÀ-ỹ]+/g, '-').toLowerCase() + '.csv';
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    EP.motion.morph($('#btn-export'), 'Đã tải file');
  }

  // ---------- Tạo trang mới ----------
  function resetAll(skipConfirm) {
    if (state && skipConfirm !== true && !root.confirm('Tạo trang mới cho sự kiện khác? Trang hiện tại vẫn được lưu trong "Sự kiện của tôi".')) return;
    clearEditor();
    switchTab('builder');
    form.elements.name.focus();
    toast('Đã sẵn sàng tạo trang mới.');
  }

  // Đóng sự kiện đang mở (không xoá dữ liệu)
  function clearEditor() {
    S.remove('current_id');
    state = null;
    resetHistory();
    openSettings = null;
    renderStylePanel();
    renderer = null;
    remoteCount = null;
    if (stopWatch) { stopWatch(); stopWatch = null; }
    cloudStats = null;
    $('#share-box').hidden = true;
    $('#btn-publish').hidden = true;
    simState = '';
    $('#sim-state').value = '';
    $('#sim-wrap').hidden = true;
    if ($('#sim-banner')) $('#sim-banner').hidden = true;
    setSheetStatus('');
    $('#sheet-msg').textContent = '';
    regenSeed = 0;
    form.reset();
    syncModeBoxes(); // form.reset() không phát sự kiện change cho radio
    $('#f-paste').value = '';
    showErrors({});
    setMsg('');
    $('#btn-regenerate').disabled = true;
    $('#mock-note').hidden = true;
    landingEl.innerHTML = '<div class="empty-state"><p class="empty-title">Landing page sẽ hiện ở đây</p><p>Nhập thông tin sự kiện ở tab <strong>Thông tin &amp; nội dung</strong> rồi bấm <strong>Tạo landing page</strong>.</p></div>';
  }

  // ---------- Sự kiện của tôi ----------
  function fmtShort(local) {
    var d = new Date(local);
    return isNaN(d) ? '' : d.toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' });
  }

  function openEvent(saved) {
    clearEditor();
    state = saved;
    resetHistory();
    saveState();
    fillForm(state.event);
    if (state.tone) form.elements.tone.value = state.tone;
    if (isCloudEvent()) startWatch(state.event.id);
    renderLanding();
    syncAll();
    switchTab('editor');
  }

  function duplicateEvent(saved) {
    var copy = JSON.parse(JSON.stringify(saved));
    copy.event.id = S.newId('evt');
    copy.event.name = saved.event.name + ' (bản sao)';
    delete copy.event.published;
    delete copy.event.ownerUid;
    openEvent(copy);
    toast('Đã nhân bản. Sửa ngày giờ rồi bấm "Tạo landing page" để cập nhật.');
  }

  function deleteEvent(saved, card) {
    var msg = 'Xoá "' + saved.event.name + '" khỏi trình duyệt này? Danh sách đăng ký lưu trên máy cũng bị xoá.';
    if (saved.event.published) msg += ' Trang đã xuất bản vẫn hoạt động; đăng nhập trên thiết bị khác vẫn mở lại được.';
    if (!root.confirm(msg)) return;
    var all = S.read('events', {});
    delete all[saved.event.id];
    S.write('events', all);
    EP.registrations.removeAll(saved.event.id);
    if (state && state.event.id === saved.event.id) clearEditor();
    EP.motion.collapse(card, renderEvents);
    toast('Đã xoá sự kiện.');
  }

  function eventCard(item, actions) {
    var t = TPL.get(item.templateId);
    var card = document.createElement('div');
    card.className = 'event-card';
    var bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.setProperty('--sw1', t.theme.primary);
    bar.style.setProperty('--sw2', t.theme.accent);
    var body = document.createElement('div');
    body.className = 'body';
    var h3 = document.createElement('h3'); h3.textContent = item.name;
    var meta = document.createElement('div'); meta.className = 'meta'; meta.textContent = fmtShort(item.startAt) + ' · ' + t.name;
    var badges = document.createElement('div'); badges.className = 'badges';
    item.badges.forEach(function (b) { var s = document.createElement('span'); s.className = 'badge ' + (b.cls || ''); s.textContent = b.text; badges.appendChild(s); });
    body.appendChild(h3); body.appendChild(meta); body.appendChild(badges);
    var act = document.createElement('div'); act.className = 'actions';
    actions.forEach(function (a) {
      var btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'btn btn-small ' + (a.cls || 'btn-ghost'); btn.textContent = a.text;
      btn.addEventListener('click', a.fn);
      act.appendChild(btn);
    });
    card.appendChild(bar); card.appendChild(body); card.appendChild(act);
    return card;
  }

  function renderEvents() {
    var grid = $('#event-grid');
    grid.innerHTML = '';
    var all = S.read('events', {});
    var list = Object.keys(all).map(function (k) { return all[k]; })
      .sort(function (a, b) { return String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')); });
    var localIds = {};
    list.forEach(function (saved) {
      var ev = saved.event;
      localIds[ev.id] = true;
      var badges = [{ text: ev.published ? 'Đã xuất bản' : 'Bản nháp', cls: ev.published ? 'is-live' : '' }];
      if (new Date(ev.startAt) <= new Date()) badges.push({ text: 'Đã diễn ra', cls: 'is-ended' });
      if (!ev.published) badges.push({ text: EP.registrations.confirmedCount(ev.id) + ' đăng ký (trên máy)' });
      grid.appendChild(eventCard({ name: ev.name, startAt: ev.startAt, templateId: ev.templateId, badges: badges }, [
        { text: 'Mở / sửa', cls: 'btn-primary', fn: function () { openEvent(all[ev.id]); } },
        { text: 'Nhân bản', fn: function () { duplicateEvent(all[ev.id]); } },
        { text: 'Xoá', cls: 'btn-danger', fn: function (e) { deleteEvent(all[ev.id], e.target.closest('.event-card')); } }
      ]));
    });
    EP.motion.stagger(grid.children);
    if (!list.length) {
      var empty = document.createElement('p');
      empty.className = 'hint';
      empty.textContent = 'Chưa có sự kiện nào. Bấm "+ Tạo sự kiện mới" để bắt đầu.';
      grid.appendChild(empty);
    }
    // Trang đã xuất bản từ thiết bị khác (cần đăng nhập)
    if (C.available && C.currentUser()) {
      C.listMyEvents().then(function (remote) {
        remote.filter(function (r) { return !localIds[r.id]; }).forEach(function (r) {
          grid.appendChild(eventCard({ name: r.name, startAt: r.startAt, templateId: r.templateId, badges: [{ text: 'Trên đám mây', cls: 'is-live' }] }, [
            { text: 'Mở trên máy này', cls: 'btn-primary', fn: function () {
              C.loadEvent(r.id).then(function (data) {
                openEvent({ event: data.event, content: data.content, tone: 'formal' });
              }, function (e) { toast(e.message); });
            } }
          ]));
        });
      }).catch(function () { /* mất mạng: chỉ hiện sự kiện trên máy */ });
    }
  }

  // ---------- Dữ liệu mẫu để demo ----------
  // Dữ liệu mẫu theo mẫu trang đang chọn
  function fillSample() {
    var sample = TPL.get(currentTemplateId).sample();
    sample.templateId = currentTemplateId;
    sample.sheetUrl = form.elements.sheetUrl.value;
    fillForm(sample);
    showErrors({});
  }

  // ---------- Tab ----------
  var TAB_ORDER = ['events', 'builder', 'editor', 'admin', 'brand'];
  var currentTab = null;
  function switchTab(name) {
    var dir = currentTab && currentTab !== name ? (TAB_ORDER.indexOf(name) > TAB_ORDER.indexOf(currentTab) ? 'forward' : 'back') : null;
    currentTab = name;
    doSwitchTab(name);
    // Màn mới trượt vào theo hướng của tab (sang phải: từ phải vào, sang trái: từ trái vào)
    if (dir) EP.motion.replay($('#view-' + name), 'tab-in-' + dir);
  }
  function doSwitchTab(name) {
    document.querySelectorAll('.tab').forEach(function (t) {
      var on = t.getAttribute('data-tab') === name;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    EP.motion.indicator($('.tabs'));
    root.scrollTo(0, 0);
    $('#view-builder').hidden = name !== 'builder';
    $('#view-editor').hidden = name !== 'editor';
    $('#view-admin').hidden = name !== 'admin';
    $('#view-events').hidden = name !== 'events';
    $('#view-brand').hidden = name !== 'brand';
    if (name === 'brand') renderBrandView();
    if (name === 'admin') renderAdmin();
    if (name === 'events') renderEvents();
  }

  function syncModeBoxes() {
    var mode = currentMode();
    document.querySelectorAll('.ai-box').forEach(function (b) { b.hidden = b.getAttribute('data-mode') !== mode; });
  }

  // ---------- Khởi động ----------
  form.addEventListener('submit', function (e) { e.preventDefault(); generate(false); });
  $('#btn-regenerate').addEventListener('click', function () { generate(true); });
  $('#btn-regenerate-2').addEventListener('click', function () { generate(true); });
  $('#btn-tpl-2').addEventListener('click', openTemplates);
  EP.inspector.init({
    landing: landingEl,
    getState: function () { return state; },
    getMode: function () { return editorMode; },
    persist: persist,
    liveRender: liveRender,
    toast: toast,
    colorField: colorField,
    fontCombo: fontCombo,
    stepper: stepper,
    weightSelect: weightSelect,
    getDevice: function () { return device; },
    getCount: simCount,
    getBlockApi: function () { return blockApi; },
    onSelect: markLayerSelection,
    vars: EP.lpUtils.VARS,
    themeColors: function () {
      var th = TPL.get(state.event.templateId).theme, st = getStyle();
      return [st.primary || th.primary, st.accent || th.accent, st.textColor || th.text, st.mutedColor || th.muted, '#ffffff', '#16193a']
        .map(function (c) { return EP.pageStyle.normalizeColor(c); })
        .filter(function (c, i, a) { return c && a.indexOf(c) === i; });
    },
    sectionApi: {
      get: function (key) { return getStyle().sections[key] || {}; },
      set: function (key, field, v, commit) {
        var secs = Object.assign({}, getStyle().sections); secs[key] = Object.assign({}, secs[key]); secs[key][field] = v;
        setStyle('sections', secs, commit);
      },
      chips: chipRow,
      move: function (key, dir) {
        var list = currentSections(), i = list.map(function (x) { return x.key; }).indexOf(key);
        var j = i + dir;
        // bỏ qua phần đang ẩn/không có trên trang
        while (j >= 0 && j < list.length && !landingEl.querySelector('[data-section="' + list[j].key + '"]')) j += dir;
        if (j < 0 || j >= list.length) { toast(dir < 0 ? 'Phần này đã ở trên cùng.' : 'Phần này đã ở dưới cùng.'); return; }
        moveSection(i, j);
      },
      locked: function (key) { return EP.landingRenderer.SECTIONS.some(function (x) { return x.key === key && x.locked; }); },
      hide: function (key) {
        var l = currentSections(); l.forEach(function (x) { if (x.key === key) x.visible = false; });
        state.event.sections = l; persist();
        toast('Đã ẩn phần này. Bật lại ở danh sách Bố cục bên trái.');
      }
    }
  });
  document.querySelectorAll('.mode-btn').forEach(function (b) {
    b.addEventListener('click', function () { if (b.getAttribute('data-mode') !== editorMode) setEditorMode(b.getAttribute('data-mode')); });
  });
  $('#btn-undo').addEventListener('click', undo);
  $('#btn-redo').addEventListener('click', redo);
  document.addEventListener('keydown', function (e) {
    if ($('#view-editor').hidden || !(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== 'z') return;
    var t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return; // để ô nhập tự hoàn tác chữ
    e.preventDefault();
    if (e.shiftKey) redo(); else undo();
  });
  $('#btn-style-reset').addEventListener('click', function () {
    if (!state || !state.event.style) return;
    state.event.style = null;
    persist();
    toast('Đã về giao diện gốc của mẫu. Bấm ↶ nếu muốn lấy lại.');
  });
  function openSidePane(name) { EP.workspace.show(name); }
  $('#btn-back-info').addEventListener('click', function () { switchTab('builder'); });
  document.querySelectorAll('.device-toggle [data-device]').forEach(function (b) {
    b.addEventListener('click', function () { setDevice(b.getAttribute('data-device')); });
  });
  $('#zoom-select').addEventListener('change', function (e) { setZoom(e.target.value === 'fit' ? 'fit' : Number(e.target.value)); });
  $('#btn-zoom-in').addEventListener('click', function () { stepZoom(1); });
  $('#btn-zoom-out').addEventListener('click', function () { stepZoom(-1); });
  if (root.ResizeObserver) new ResizeObserver(function () { if (zoom === 'fit') applyDevice(); }).observe($('#view-editor .preview-wrap'));
  document.addEventListener('keydown', function (e) {
    if ($('#view-editor').hidden || !(e.ctrlKey || e.metaKey)) return;
    if (e.key === '=' || e.key === '+') { e.preventDefault(); stepZoom(1); }
    else if (e.key === '-') { e.preventDefault(); stepZoom(-1); }
    else if (e.key === '0') { e.preventDefault(); setZoom('fit'); }
    else if (e.key === '1' && e.shiftKey) { e.preventDefault(); setZoom(1); }
  });

  // ---------- Thư viện khối: thêm/gỡ khối, thêm/bớt mục ----------
  var BLOCK_DESC = {
    faq: 'Câu hỏi & trả lời, khách bấm để mở',
    testimonials: 'Trích cảm nhận của khách cũ',
    sponsors: 'Dải tên nhà tài trợ, đối tác',
    video: 'Nhúng video YouTube hoặc Vimeo',
    map: 'Google Maps theo địa điểm',
    cta2: 'Lời kêu gọi kèm số chỗ còn lại tự cập nhật'
  };
  function sectionVisible(key) { return currentSections().some(function (x) { return x.key === key && x.visible; }); }
  function revealSection(key) {
    setTimeout(function () {
      var el = landingEl.querySelector('[data-section="' + key + '"]');
      if (!el) return;
      el.scrollIntoView({ behavior: EP.motion.reduce() ? 'auto' : 'smooth', block: 'center' });
      EP.motion.replay(el, 'mo-block-in');
      if (EP.inspector) EP.inspector.select('section.' + key);
    }, 30);
  }
  function toggleBlock(key) {
    var l = currentSections(), i = l.map(function (x) { return x.key; }).indexOf(key);
    if (i < 0) return;
    if (l[i].visible) {
      l[i].visible = false;
      if (EP.inspector) EP.inspector.close();
      EP.motion.collapse(landingEl.querySelector('[data-section="' + key + '"]'), function () { state.event.sections = l; persist(); toast('Đã gỡ khối. Ctrl+Z để lấy lại.'); });
      return;
    }
    // Thêm: đặt ngay trước form đăng ký
    var item = l.splice(i, 1)[0];
    item.visible = true;
    var ri = l.map(function (x) { return x.key; }).indexOf('register');
    l.splice(ri < 0 ? l.length : ri, 0, item);
    state.event.sections = l;
    flashKey = key;
    persist();
    revealSection(key);
    toast('Đã thêm khối "' + EP.landingRenderer.SECTIONS.filter(function (x) { return x.key === key; })[0].label + '".');
  }
  function renderBlockLib() {
    var box = $('#block-lib');
    if (!box || !state) return;
    var first = !box.children.length;
    box.innerHTML = '';
    EP.landingRenderer.SECTIONS.filter(function (x) { return x.block; }).forEach(function (b, i) {
      var on = sectionVisible(b.key);
      var card = document.createElement('button');
      card.type = 'button';
      card.className = 'block-card' + (on ? ' is-on' : '') + (first ? ' is-entering' : '');
      if (first) card.style.animationDelay = (i * 40) + 'ms';
      card.setAttribute('data-block', b.key);
      card.setAttribute('aria-pressed', on ? 'true' : 'false');
      card.innerHTML = '<span class="block-thumb block-thumb-' + b.key + '" aria-hidden="true"><i></i><i></i><i></i></span>' +
        '<span class="block-text"><strong></strong><small></small></span><span class="block-state">' + EP.icon(on ? 'check2' : 'plus', 14) + '</span>';
      card.querySelector('strong').textContent = b.label;
      card.querySelector('small').textContent = on ? 'Đang có trên trang · bấm để gỡ' : BLOCK_DESC[b.key];
      card.addEventListener('click', function () { toggleBlock(b.key); });
      card.addEventListener('mouseenter', function () { if (on) highlightPreview(b.key, true); });
      card.addEventListener('mouseleave', function () { if (on) highlightPreview(b.key, false); });
      box.appendChild(card);
    });
  }
  var blockApi = {
    isBlock: function (key) { return EP.landingRenderer.SECTIONS.some(function (x) { return x.key === key && x.block; }); },
    isList: function (key) { return !!EP.landingRenderer.BLOCK_ITEMS[key]; },
    count: function (key) { return EP.landingRenderer.blockCount(state.event, key); },
    max: EP.landingRenderer.MAX_ITEMS,
    get: function (key) { return (state.event.blocks || {})[key] || {}; },
    set: function (key, field, v) {
      var b = Object.assign({}, state.event.blocks || {});
      b[key] = Object.assign({}, b[key]);
      if (v === '' || v == null) delete b[key][field]; else b[key][field] = v;
      state.event.blocks = b;
      persist();
    },
    addItem: function (key) {
      var n = blockApi.count(key);
      if (n >= blockApi.max) { toast('Tối đa ' + blockApi.max + ' mục.'); return; }
      blockApi.set(key, 'count', n + 1);
      var list = landingEl.querySelector('[data-block-list="' + key + '"]');
      if (list && list.lastElementChild) EP.motion.replay(list.lastElementChild, 'mo-block-in');
    },
    removeItem: function (key) {
      var n = blockApi.count(key);
      if (n <= 1) { toast('Khối cần ít nhất 1 mục. Muốn bỏ cả khối thì bấm "Ẩn phần".'); return; }
      var list = landingEl.querySelector('[data-block-list="' + key + '"]');
      EP.motion.collapse(list && list.lastElementChild, function () { blockApi.set(key, 'count', n - 1); });
    },
    videoOk: function (url) { return !!EP.landingRenderer.videoEmbed(url); }
  };

  // ---------- Panel Cấu trúc: cây phần tử của trang ----------
  var layerOpen = {};
  function renderLayers() {
    var tree = $('#layer-tree');
    if (!tree || !state) return;
    var sel = EP.inspector ? EP.inspector.selected() : null;
    tree.innerHTML = '';
    function walk(parent, ul, depth) {
      Array.prototype.forEach.call(parent.children, function (c) {
        if (c.tagName === 'STYLE' || c.classList.contains('lp-img-btn')) return;
        if (!c.hasAttribute('data-el')) { walk(c, ul, depth); return; }
        var key = c.getAttribute('data-el'), kind = c.getAttribute('data-el-kind');
        var li = document.createElement('li');
        li.setAttribute('role', 'treeitem');
        li.className = 'layer' + (key === sel ? ' is-selected' : '') + (c.classList.contains('lp-el-hidden') ? ' is-hidden' : '');
        li.dataset.key = key;
        var row = document.createElement('div');
        row.className = 'layer-row';
        row.style.paddingLeft = (6 + depth * 14) + 'px';
        var sub = document.createElement('ul');
        sub.setAttribute('role', 'group');
        walk(c, sub, depth + 1);
        var hasKids = !!sub.children.length;
        var open = layerOpen[key] != null ? layerOpen[key] : (sel && sel !== key && sel.indexOf(key) === 0) || (sel && c.querySelector('[data-el="' + sel.replace(/["\\]/g, '') + '"]'));
        var caret = document.createElement('button');
        caret.type = 'button'; caret.className = 'layer-caret';
        if (hasKids) {
          caret.innerHTML = EP.icon('chevron-down', 12);
          caret.setAttribute('aria-label', open ? 'Thu gọn' : 'Mở rộng');
          li.setAttribute('aria-expanded', open ? 'true' : 'false');
          caret.addEventListener('click', function () { layerOpen[key] = !(li.getAttribute('aria-expanded') === 'true'); li.setAttribute('aria-expanded', layerOpen[key] ? 'true' : 'false'); });
        } else caret.disabled = true;
        var name = document.createElement('button');
        name.type = 'button'; name.className = 'layer-name layer-' + kind;
        name.textContent = (c.getAttribute('data-el-label') || key).replace(/^Phần: /, '');
        name.addEventListener('click', function () {
          var n = landingEl.querySelector('[data-el="' + key.replace(/["\\]/g, '') + '"]');
          if (n) n.scrollIntoView({ behavior: EP.motion.reduce() ? 'auto' : 'smooth', block: 'center' });
          EP.inspector.select(key);
        });
        row.addEventListener('mouseenter', function () { c.classList.add('lp-hovered'); });
        row.addEventListener('mouseleave', function () { c.classList.remove('lp-hovered'); });
        row.appendChild(caret); row.appendChild(name);
        if (!c.hasAttribute('data-el-required') || kind === 'section') {
          var locked = kind === 'section' && EP.landingRenderer.SECTIONS.some(function (x) { return 'section.' + x.key === key && x.locked; });
          if (!locked) {
            var hidden = c.classList.contains('lp-el-hidden');
            var eye = document.createElement('button');
            eye.type = 'button'; eye.className = 'layer-eye';
            eye.innerHTML = EP.icon(hidden ? 'eye-off' : 'eye', 13);
            eye.setAttribute('aria-label', (hidden ? 'Hiện ' : 'Ẩn ') + name.textContent);
            eye.addEventListener('click', function () {
              if (kind === 'section') { var k = key.replace('section.', ''); if (blockApi.isBlock(k)) toggleBlock(k); else blockHide(k); return; }
              var all = Object.assign({}, state.event.elStyles || {}), cur = Object.assign({}, all[key] || {});
              if (hidden) delete cur.hidden; else cur.hidden = true;
              if (Object.keys(cur).length) all[key] = cur; else delete all[key];
              state.event.elStyles = all; persist();
            });
            row.appendChild(eye);
          }
        }
        li.appendChild(row);
        if (hasKids) li.appendChild(sub);
        ul.appendChild(li);
      });
    }
    walk(landingEl, tree, 0);
    var cur = tree.querySelector('.layer.is-selected > .layer-row');
    if (cur && cur.scrollIntoViewIfNeeded) cur.scrollIntoViewIfNeeded(false);
  }
  function blockHide(k) {
    var l = currentSections(); l.forEach(function (x) { if (x.key === k) x.visible = false; });
    EP.motion.collapse(landingEl.querySelector('[data-section="' + k + '"]'), function () { state.event.sections = l; persist(); });
  }
  function markLayerSelection(key) {
    var tree = $('#layer-tree');
    if (!tree) return;
    tree.querySelectorAll('.layer.is-selected').forEach(function (x) { x.classList.remove('is-selected'); });
    if (!key) return;
    var li = tree.querySelector('.layer[data-key="' + key.replace(/["\\]/g, '') + '"]');
    if (!li) return;
    li.classList.add('is-selected');
    for (var p = li.parentElement; p && p !== tree; p = p.parentElement) if (p.classList.contains('layer')) p.setAttribute('aria-expanded', 'true');
    var row = li.querySelector('.layer-row');
    if (row && EP.workspace.isVisible('layers')) row.scrollIntoView({ block: 'nearest' });
  }

  // ---------- Xem trước toàn màn hình (như khách thấy) ----------
  var pv = null;
  function openPreview() {
    if (!state) return;
    var a = document.activeElement;
    if (a && a.isContentEditable) a.blur();
    if (EP.inspector) EP.inspector.close();
    if (!pv) {
      pv = { root: document.createElement('div') };
      pv.root.className = 'pv-overlay';
      pv.root.setAttribute('role', 'dialog');
      pv.root.setAttribute('aria-modal', 'true');
      pv.root.setAttribute('aria-label', 'Xem trước toàn màn hình');
      pv.root.innerHTML = '<div class="pv-bar"><strong class="pv-title">Xem trước</strong><span class="pv-note">Đây là trang khách sẽ thấy. Form không gửi đăng ký thật.</span>' +
        '<div class="device-toggle pv-devices" role="group" aria-label="Thiết bị xem trước">' +
        ['desktop:monitor:Máy tính', 'tablet:tablet:Máy tính bảng', 'mobile:phone:Điện thoại'].map(function (d) { var p = d.split(':'); return '<button type="button" data-pv-device="' + p[0] + '" aria-label="' + p[2] + '" title="' + p[2] + '">' + EP.icon(p[1], 16) + '</button>'; }).join('') +
        '</div><button type="button" class="btn btn-ghost btn-small pv-close">' + EP.icon('x', 14) + 'Thoát (Esc)</button></div>' +
        '<div class="pv-stage"><div class="pv-frame"><div class="landing"></div></div></div>';
      document.body.appendChild(pv.root);
      pv.frame = pv.root.querySelector('.pv-frame');
      pv.landing = pv.root.querySelector('.landing');
      pv.root.querySelector('.pv-close').addEventListener('click', closePreview);
      pv.root.querySelectorAll('[data-pv-device]').forEach(function (b) {
        b.addEventListener('click', function () { setPreviewDevice(b.getAttribute('data-pv-device')); });
      });
    }
    pv.device = pv.device || device;
    var r = EP.landingRenderer.render(pv.landing, {
      event: state.event, content: state.content, now: simNow, getCount: simCount, editable: false, appUrl: APP_URL,
      onRegister: function () { return { ok: false, errors: { form: 'Đây là bản xem trước – khách đăng ký trên trang đã xuất bản.' } }; }
    });
    clearInterval(pv.timer);
    pv.timer = setInterval(r.update, 1000);
    applyPreviewDevice();
    pv.root.hidden = false;
    pv.root.classList.remove('is-leaving');
    EP.motion.replay(pv.root, 'is-entering');
    pv.root.querySelector('.pv-stage').scrollTop = 0;
    pv.lastFocus = a;
    pv.root.querySelector('.pv-close').focus();
  }
  function applyPreviewDevice() {
    pv.frame.style.width = pv.device === 'desktop' ? '' : DEVICE_W[pv.device] + 'px';
    pv.frame.className = 'pv-frame is-' + pv.device;
    pv.root.querySelectorAll('[data-pv-device]').forEach(function (b) { b.classList.toggle('is-active', b.getAttribute('data-pv-device') === pv.device); });
  }
  function setPreviewDevice(d) {
    if (!pv || d === pv.device) return;
    EP.motion.transition(function () { pv.device = d; applyPreviewDevice(); }, 'device');
  }
  function closePreview() {
    if (!pv || pv.root.hidden) return;
    clearInterval(pv.timer);
    pv.root.classList.add('is-leaving');
    setTimeout(function () { if (pv.root.classList.contains('is-leaving')) { pv.root.hidden = true; pv.root.classList.remove('is-leaving'); pv.landing.innerHTML = ''; } }, EP.motion.reduce() ? 0 : 200);
    var back = $('#btn-preview');
    if (back) back.focus();
  }
  function previewOpen() { return !!(pv && !pv.root.hidden && !pv.root.classList.contains('is-leaving')); }

  // ---------- Xuất file HTML độc lập ----------
  function slugify(s) {
    return String(s || 'landing').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'landing';
  }
  function escHtml(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function buildExportHtml(css) {
    var shell = document.createElement('div');
    shell.style.cssText = 'position:fixed;left:-20000px;top:0;width:1280px;visibility:hidden';
    var box = document.createElement('div');
    shell.appendChild(box);
    document.body.appendChild(shell);
    try {
      EP.landingRenderer.render(box, {
        event: state.event, content: state.content, now: function () { return new Date(); }, getCount: currentCount, editable: false, appUrl: APP_URL,
        onRegister: function () { return { ok: false, errors: {} }; }
      });
      box.querySelectorAll('.lp-reveal').forEach(function (x) { x.classList.remove('lp-reveal'); });
      box.querySelectorAll('form').forEach(function (f) { f.hidden = false; });
      var fonts = [];
      document.querySelectorAll('link[rel="stylesheet"][href^="https://fonts.googleapis.com"]').forEach(function (l) { if (fonts.indexOf(l.href) < 0) fonts.push(l.href); });
      var data = { start: state.event.startAt, url: isCloudEvent() ? $('#share-url').value : '' };
      var script = '(function(){var S=' + JSON.stringify(data).replace(/</g, '\\u003c') + ';var start=new Date(S.start);' +
        'var boxes=document.querySelectorAll(".lp-cd-num");function pad(n){return String(n).padStart(2,"0")}' +
        'function tick(){var ms=Math.max(0,start-new Date()),s=Math.floor(ms/1000),v=[Math.floor(s/86400),Math.floor(s%86400/3600),Math.floor(s%3600/60),s%60];' +
        'boxes.forEach(function(b,i){b.textContent=pad(v[i])});document.querySelectorAll(\'.lp-var[data-var="dem_nguoc"]\').forEach(function(x){x.textContent=Math.ceil(ms/86400000)})}' +
        'tick();setInterval(tick,1000);document.querySelectorAll(".lp-form").forEach(function(f){f.addEventListener("submit",function(e){e.preventDefault();' +
        'if(S.url){location.href=S.url;return}var m=f.querySelector(".lp-form-msg");if(m){m.textContent="Đây là bản trang tĩnh. Vui lòng liên hệ ban tổ chức để đăng ký.";m.className="lp-form-msg is-error"}})})})();';
      var desc = (state.content.description || '').slice(0, 160);
      return '<!doctype html>\n<html lang="vi">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
        '<title>' + escHtml(state.event.name || 'Sự kiện') + '</title>\n<meta name="description" content="' + escHtml(desc) + '">\n' +
        '<meta name="generator" content="Xclipse">\n' +
        fonts.map(function (h) { return '<link rel="stylesheet" href="' + escHtml(h) + '">\n'; }).join('') +
        '<style>\nhtml,body{margin:0}\n' + css + '\n</style>\n</head>\n<body>\n' + box.outerHTML + '\n<script>' + script + '<\/script>\n</body>\n</html>\n';
    } finally { shell.remove(); }
  }
  function exportHtml() {
    if (!state) return;
    var a = document.activeElement;
    if (a && a.isContentEditable) a.blur();
    fetch('css/landing.css').then(function (r) { if (!r.ok) throw new Error(); return r.text(); }).then(function (css) {
      var html = buildExportHtml(css);
      var blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      var link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = slugify(state.event.name) + '.html';
      document.body.appendChild(link); link.click(); link.remove();
      setTimeout(function () { URL.revokeObjectURL(link.href); }, 4000);
      toast('Đã tải file ' + link.download + ' (' + kb(blob.size) + ').');
    }).catch(function () { toast('Không đọc được kiểu trang để xuất. Thử tải lại trang rồi xuất lại.'); });
  }
  EP.exportHtml = function () { return fetch('css/landing.css').then(function (r) { return r.text(); }).then(buildExportHtml); };

  $('#btn-preview').addEventListener('click', openPreview);
  $('#btn-preview-2').addEventListener('click', openPreview);
  $('#btn-export-html').addEventListener('click', exportHtml);
  document.addEventListener('keydown', function (e) {
    if (previewOpen()) {
      if (e.key === 'Escape') { e.preventDefault(); closePreview(); }
      return;
    }
    if (e.altKey && !e.ctrlKey && (e.key === 'p' || e.key === 'P' || e.code === 'KeyP') && !$('#view-editor').hidden) { e.preventDefault(); openPreview(); }
  });

  // ---------- Workspace: panel cửa sổ + thanh menu ----------
  function menuDevice(d, label, key) { return { icon: { desktop: 'monitor', tablet: 'tablet', mobile: 'phone' }[d], label: label, shortcut: key, checked: function () { return device === d; }, action: function () { setDevice(d); } }; }
  function menuZoom(z, label) { return { icon: z === 'fit' ? 'fit' : 'percent', label: label, checked: function () { return zoom === z; }, action: function () { setZoom(z); } }; }
  EP.workspace.init({
    root: $('#ws'),
    stash: $('.ws-panels'),
    menubar: $('#menubar'),
    onChange: function () { if (zoom === 'fit') applyDevice(); if (EP.inspector) EP.inspector.refresh(); },
    menus: [
      { label: 'Tệp', items: [
        { icon: 'plus', label: 'Tạo trang mới', action: function () { resetAll(); } },
        { icon: 'folder', label: 'Sự kiện của tôi…', action: function () { switchTab('events'); } },
        { icon: 'layout', label: 'Đổi mẫu trang…', action: openTemplates },
        { icon: 'palette', label: 'Brand DNA…', action: function () { switchTab('brand'); } },
        '-',
        { icon: 'send', label: 'Xuất bản / cập nhật trang', disabled: function () { return !state || !C.available; }, action: publish },
        { icon: 'external', label: 'Mở trang đã xuất bản', disabled: function () { return !isCloudEvent(); }, action: function () { root.open($('#share-url').value, '_blank', 'noopener'); } },
        { icon: 'code', label: 'Tải trang dạng file HTML', disabled: function () { return !state; }, action: exportHtml },
        { icon: 'table', label: 'Xuất danh sách đăng ký (CSV)', disabled: function () { return !state; }, action: function () { switchTab('admin'); exportCsv(); } }
      ] },
      { label: 'Sửa', items: [
        { icon: 'undo', label: 'Hoàn tác', shortcut: 'Ctrl+Z', disabled: function () { return !undoStack.length; }, action: undo },
        { icon: 'redo', label: 'Làm lại', shortcut: 'Ctrl+Shift+Z', disabled: function () { return !redoStack.length; }, action: redo },
        '-',
        { icon: 'pencil', label: 'Sửa thông tin & nội dung', action: function () { switchTab('builder'); } },
        { icon: 'wand', label: 'AI viết lại nội dung', disabled: function () { return !state; }, action: function () { generate(true); } },
        { icon: 'reset', label: 'Về giao diện gốc của mẫu', disabled: function () { return !state || !state.event.style; }, action: function () { $('#btn-style-reset').click(); } }
      ] },
      { label: 'Xem', items: function () {
        return [
          { icon: 'expand', label: 'Xem trước toàn màn hình', shortcut: 'Alt+P', disabled: function () { return !state; }, action: openPreview },
          '-',
          { heading: 'Thu phóng' },
          { icon: 'zoom-in', label: 'Phóng to', shortcut: 'Ctrl +', action: function () { stepZoom(1); } },
          { icon: 'zoom-out', label: 'Thu nhỏ', shortcut: 'Ctrl −', action: function () { stepZoom(-1); } },
          menuZoom('fit', 'Vừa khung'), menuZoom(1, '100%'),
          '-',
          { heading: 'Thiết bị' },
          menuDevice('desktop', 'Máy tính (1280px)'), menuDevice('tablet', 'Máy tính bảng (768px)'), menuDevice('mobile', 'Điện thoại (390px)'),
          '-',
          { heading: 'Hiệu ứng chuyển động' },
          { icon: 'motion', label: 'Bật', checked: function () { return EP.motion.pref() === 'on'; }, action: function () { EP.motion.setPref('on'); toast('Đã bật hiệu ứng.'); } },
          { icon: 'settings', label: 'Theo cài đặt của máy', checked: function () { return EP.motion.pref() === 'system'; }, action: function () { EP.motion.setPref('system'); toast(EP.motion.reduce() ? 'Máy đang bật "giảm chuyển động" nên hiệu ứng tắt.' : 'Hiệu ứng theo cài đặt của máy.'); } },
          { icon: 'pause', label: 'Tắt', checked: function () { return EP.motion.pref() === 'off'; }, action: function () { EP.motion.setPref('off'); toast('Đã tắt hiệu ứng.'); } },
          '-',
          { heading: 'Chế độ chỉnh' },
          { icon: 'sliders', label: 'Đơn giản', checked: function () { return editorMode === 'simple'; }, action: function () { if (editorMode !== 'simple') setEditorMode('simple'); } },
          { icon: 'palette', label: 'Studio', checked: function () { return editorMode === 'studio'; }, action: function () { if (editorMode !== 'studio') setEditorMode('studio'); } }
        ];
      } },
      { label: 'Cửa sổ', items: function () {
        var list = [{ heading: 'Panel' }];
        EP.workspace.panels().forEach(function (pn) {
          list.push({ icon: { layout: 'grip', blocks: 'blocks', layers: 'layers', style: 'palette', publish: 'send' }[pn.id] || 'float', label: pn.title, checked: function () { return EP.workspace.isVisible(pn.id); }, action: function () { EP.workspace.toggle(pn.id); } });
        });
        list.push('-', { heading: 'Bố cục' },
          { icon: 'columns', label: 'Mặc định (trái + phải)', action: function () { EP.workspace.preset('default'); } },
          { icon: 'dock-right', label: 'Tất cả bên phải, gộp tab', action: function () { EP.workspace.preset('right'); } },
          { icon: 'layout', label: 'Chia hai bên', action: function () { EP.workspace.preset('split'); } },
          { icon: 'focus', label: 'Tập trung vào trang (ẩn panel)', action: function () { EP.workspace.preset('focus'); } },
          '-',
          { icon: 'refresh', label: 'Khôi phục bố cục ban đầu', action: function () { EP.workspace.reset(); toast('Đã khôi phục bố cục.'); } });
        return list;
      } },
      { label: 'Trợ giúp', items: [
        { icon: 'keyboard', label: 'Phím tắt & mẹo', action: function () { $('#help-dialog').showModal(); } }
      ] }
    ]
  });
  $('#btn-new').addEventListener('click', resetAll);
  $('#btn-new-2').addEventListener('click', function () { resetAll(true); });
  $('#btn-sample').addEventListener('click', fillSample);
  $('#btn-sheet-test').addEventListener('click', testSheet);
  $('#btn-export').addEventListener('click', exportCsv);
  $('#btn-clear-regs').addEventListener('click', function () {
    if (!state) return;
    if (!root.confirm('Xoá toàn bộ danh sách đăng ký của sự kiện này? Không thể hoàn tác.')) return;
    if (isCloudEvent()) {
      C.clearRegistrations(state.event.id).then(renderAdmin, function (e) { toast('Không xoá được: ' + e.message); });
      return;
    }
    EP.registrations.removeAll(state.event.id);
    renderAdmin();
    if (renderer) renderer.update();
  });
  document.querySelectorAll('.tab').forEach(function (t) {
    t.addEventListener('click', function () { switchTab(t.getAttribute('data-tab')); });
  });
  form.querySelectorAll('input[name="aiMode"]').forEach(function (r) { r.addEventListener('change', syncModeBoxes); });

  var savedKey = S.read('gemini_key', '');
  if (savedKey) { $('#f-apikey').value = savedKey; $('#f-remember-key').checked = true; }

  $('#btn-publish').addEventListener('click', publish);
  $('#btn-auth').addEventListener('click', function () {
    if (C.currentUser()) { C.signOut(); return; }
    toast('Đang mở cửa sổ đăng nhập Google…');
    C.signIn().then(function () { toast('Đã đăng nhập.'); }, function (e) { toast(e.message); });
  });
  $('#btn-copy-link').addEventListener('click', function () {
    copyText($('#share-url').value).then(function () { EP.motion.morph($('#btn-copy-link'), 'Đã copy'); toast('Đã copy link.'); }, function () { $('#share-url').select(); });
  });

  // ---------- Trang công khai cho khách: ?e=<mã sự kiện> ----------
  if (publicEventId) {
    document.body.classList.add('is-public');
    $('#view-public').hidden = false;
    var publicEl = $('#public-landing');
    C.loadEvent(publicEventId).then(function (data) {
      document.title = data.event.name;
      var pub = data.event;
      stopWatch = C.watchStats(pub.id, function (st) { cloudStats = st; if (renderer) renderer.update(); });
      // Đếm 1 lượt xem cho mỗi phiên trình duyệt
      try {
        if (!sessionStorage.getItem('xc_viewed_' + pub.id)) {
          sessionStorage.setItem('xc_viewed_' + pub.id, '1');
          C.track(pub.id, 'views');
        }
      } catch (err) { C.track(pub.id, 'views'); }
      renderer = EP.landingRenderer.render(publicEl, {
        event: pub,
        content: data.content,
        now: function () { return new Date(); },
        getCount: function () { return cloudStats ? cloudStats.count : 0; },
        appUrl: APP_URL,
        onFunnel: function (field) { C.track(pub.id, field); },
        onRegister: function (d) { return cloudRegister(pub, d); }
      });
    }, function (e) {
      publicEl.innerHTML = '';
      var box = document.createElement('div');
      box.className = 'empty-state';
      var t = document.createElement('p'); t.className = 'empty-title'; t.textContent = 'Không mở được trang sự kiện';
      var m = document.createElement('p'); m.textContent = e.message;
      box.appendChild(t); box.appendChild(m); publicEl.appendChild(box);
    });
    setInterval(function () { if (renderer) renderer.update(); }, 1000);
    return;
  }

  buildPlatformButtons();
  buildTemplateFilters();
  setTemplate(currentTemplateId);
  syncModeBoxes();
  C.onAuth(updateAuthUi);
  $('#btn-tpl').addEventListener('click', openTemplates);
  $('#sim-state').addEventListener('change', function (e) { simState = e.target.value; renderLanding(); swapLanding(); });
  $('#btn-tpl-close').addEventListener('click', closeTemplates);

  if (state) {
    fillForm(state.event);
    if (state.tone) form.elements.tone.value = state.tone;
    if (isCloudEvent()) startWatch(state.event.id);
    renderLanding();
    syncAll();
  }

  // Mở app: có sự kiện thì vào "Sự kiện của tôi", chưa có thì vào màn tạo trang

  // ---------- Brand DNA ----------
  var brandId = null; // thương hiệu đang mở trong màn Brand DNA
  var TONE_OPTS = [['formal', 'Trang trọng'], ['young', 'Trẻ trung'], ['urgent', 'Gấp rút']];

  function refreshBrandSelects() {
    var list = B.list();
    ['#f-brand', '#ed-brand'].forEach(function (sel) {
      var el = $(sel); if (!el) return;
      var keep = el.value;
      el.innerHTML = '';
      el.add(new Option('Không dùng thương hiệu', ''));
      list.forEach(function (b) { el.add(new Option(b.name || '(Chưa đặt tên)', b.id)); });
      el.value = list.some(function (b) { return b.id === keep; }) ? keep : '';
    });
    if (state && $('#ed-brand')) $('#ed-brand').value = state.event.brandId && B.get(state.event.brandId) ? state.event.brandId : '';
  }

  function renderBrandView() {
    var list = B.list();
    if (!brandId || !B.get(brandId)) brandId = list[0] ? list[0].id : null;
    var nav = $('#brand-list');
    nav.innerHTML = '';
    list.forEach(function (b) {
      var a = document.createElement('button'); a.type = 'button';
      a.className = 'brand-item' + (b.id === brandId ? ' is-active' : '');
      var sw = document.createElement('span'); sw.className = 'brand-sw'; sw.style.setProperty('--sw1', b.primary || '#131416'); sw.style.setProperty('--sw2', b.accent || b.primary || '#d6336c');
      if (b.logo) { sw.classList.add('has-logo'); sw.style.backgroundImage = 'url("' + b.logo + '")'; }
      var t = document.createElement('span'); t.className = 'brand-item-text';
      var n = document.createElement('strong'); n.textContent = b.name || '(Chưa đặt tên)';
      var m = document.createElement('small'); m.textContent = b.tagline || 'Chưa có khẩu hiệu';
      t.appendChild(n); t.appendChild(m);
      a.appendChild(sw); a.appendChild(t);
      a.addEventListener('click', function () { brandId = b.id; renderBrandView(); });
      nav.appendChild(a);
    });
    EP.motion.stagger(nav.children);
    var ed = $('#brand-editor'), pv = $('#brand-preview');
    if (!brandId) {
      ed.innerHTML = '<div class="empty-state"><p class="empty-title">Chưa có thương hiệu nào</p><p>Bấm <strong>Tạo thương hiệu</strong> để thiết lập màu, font, logo và giọng văn một lần, rồi áp dụng cho mọi landing page.</p></div>';
      pv.innerHTML = '';
      return;
    }
    buildBrandEditor(B.get(brandId));
  }

  function buildBrandEditor(b) {
    var ed = $('#brand-editor');
    ed.innerHTML = '';
    var stamp = document.createElement('span'); stamp.className = 'save-stamp'; stamp.setAttribute('role', 'status');
    function saveField(k, v, quiet) {
      b[k] = v;
      B.save(b);
      drawPreview(b);
      if (!quiet) { stamp.textContent = 'Đã lưu'; EP.motion.replay(stamp, 'mo-pop'); refreshBrandSelects(); var it = $('#brand-list .brand-item.is-active strong'); if (it && k === 'name') it.textContent = v || '(Chưa đặt tên)'; }
    }
    function section(title, desc) {
      var sec = document.createElement('section'); sec.className = 'brand-sec';
      var h = document.createElement('h2'); h.className = 'panel-title'; h.textContent = title; sec.appendChild(h);
      if (desc) { var d = document.createElement('p'); d.className = 'hint'; d.textContent = desc; sec.appendChild(d); }
      ed.appendChild(sec);
      return sec;
    }
    function textField(sec, label, k, opts) {
      opts = opts || {};
      var f = document.createElement('div'); f.className = 'field';
      var id = 'bf-' + k;
      var l = document.createElement('label'); l.htmlFor = id; l.textContent = label;
      if (opts.required) { var r = document.createElement('span'); r.className = 'req'; r.textContent = ' *'; l.appendChild(r); }
      var inp = document.createElement(opts.multiline ? 'textarea' : 'input');
      if (!opts.multiline) inp.type = opts.type || 'text'; else inp.rows = 2;
      inp.id = id; inp.value = b[k] || ''; inp.maxLength = opts.max || 120; if (opts.placeholder) inp.placeholder = opts.placeholder;
      var err = document.createElement('p'); err.className = 'error';
      inp.addEventListener('input', function () { b[k] = inp.value; drawPreview(b); });
      inp.addEventListener('change', function () {
        var v = inp.value.trim();
        var msg = opts.validate ? opts.validate(v) : '';
        err.textContent = msg || '';
        inp.toggleAttribute('aria-invalid', !!msg);
        if (msg) return;
        saveField(k, v);
      });
      f.appendChild(l); f.appendChild(inp);
      if (opts.hint) { var h = document.createElement('p'); h.className = 'hint'; h.textContent = opts.hint; f.appendChild(h); }
      f.appendChild(err);
      sec.appendChild(f);
      return inp;
    }

    // Thanh tiêu đề form: tên + dấu "Đã lưu"
    var head = document.createElement('div'); head.className = 'brand-ed-head';
    var h2 = document.createElement('p'); h2.className = 'hint'; h2.textContent = 'Mọi thay đổi tự lưu.';
    head.appendChild(h2); head.appendChild(stamp);
    ed.appendChild(head);

    var s1 = section('Nhận diện');
    textField(s1, 'Tên thương hiệu', 'name', { required: true, max: 60, placeholder: 'Ví dụ: FPT Polytechnic', validate: function (v) { return v ? '' : 'Vui lòng nhập tên thương hiệu.'; } });
    textField(s1, 'Khẩu hiệu', 'tagline', { max: 100, placeholder: 'Ví dụ: Thực học – Thực nghiệp' });
    var logoRow = document.createElement('div'); logoRow.className = 'field';
    var ll = document.createElement('span'); ll.className = 'field-label'; ll.textContent = 'Logo';
    var lbox = document.createElement('div'); lbox.className = 'logo-box';
    var thumb = document.createElement('div'); thumb.className = 'logo-thumb';
    function drawThumb() { thumb.innerHTML = ''; if (b.logo) { var im = document.createElement('img'); im.src = b.logo; im.alt = 'Logo ' + (b.name || ''); thumb.appendChild(im); } else thumb.textContent = 'Chưa có logo'; }
    drawThumb();
    var up = document.createElement('button'); up.type = 'button'; up.className = 'btn btn-ghost btn-small'; up.innerHTML = EP.icon('image') + (b.logo ? 'Đổi logo' : 'Tải logo lên');
    up.addEventListener('click', function () {
      EP.images.pick('logo').then(function (data) {
        var li = EP.images.lastInfo();
        if (li) toast('Đã tự nén logo ' + kb(li.before) + ' → ' + kb(li.after) + (EP.images.webp ? ' (WebP, giữ nền trong suốt).' : '.'));
        saveField('logo', data); drawThumb(); up.innerHTML = EP.icon('image') + 'Đổi logo'; EP.motion.replay(thumb, 'mo-img-in'); renderBrandView();
      }, function (e) { if (e.message !== 'Chưa chọn ảnh.') toast(e.message); });
    });
    var rm = document.createElement('button'); rm.type = 'button'; rm.className = 'btn btn-ghost btn-small'; rm.textContent = 'Bỏ logo'; rm.hidden = !b.logo;
    rm.addEventListener('click', function () { saveField('logo', ''); renderBrandView(); });
    lbox.appendChild(thumb); lbox.appendChild(up); lbox.appendChild(rm);
    logoRow.appendChild(ll); logoRow.appendChild(lbox);
    var lh = document.createElement('p'); lh.className = 'hint'; lh.textContent = 'Nên dùng PNG nền trong suốt. Logo hiện ở đầu landing page.'; logoRow.appendChild(lh);
    s1.appendChild(logoRow);

    var s2 = section('Màu sắc', 'Để trống để dùng màu của mẫu trang. Ô màu nhận mọi mã: #hex, rgb(), hsl(), tên màu.');
    var col = function (label, k, fb, hint, against) {
      s2.appendChild(colorField(label, b[k], fb, hint, function (v, commit) { if (commit === false) { b[k] = v; drawPreview(b); } else saveField(k, v); }, against));
    };
    col('Màu chính', 'primary', '#1e2a78', 'Nền phần đầu trang, tiêu đề', function () { return '#ffffff'; });
    col('Màu nhấn', 'accent', '#d6336c', 'Nút đăng ký, số đếm', function () { return EP.pageStyle.textOn(b.accent || '#d6336c'); });
    col('Màu chữ', 'textColor', '#131416', '', function () { return b.bgColor || '#ffffff'; });
    col('Màu nền trang', 'bgColor', '#ffffff', '');

    var s3 = section('Chữ');
    [['Font tiêu đề', 'headingFont'], ['Font nội dung', 'bodyFont']].forEach(function (f) {
      var row = document.createElement('div'); row.className = 'field';
      var l = document.createElement('label'); l.className = 'field-label'; l.htmlFor = 'bc-' + f[1]; l.textContent = f[0];
      var c = fontCombo({ id: 'bc-' + f[1], label: f[0], allowDefault: true, value: b[f[1]] || '', onPick: function (name) { saveField(f[1], name || ''); buildBrandEditor(b); } });
      row.appendChild(l); row.appendChild(c.wrap); row.appendChild(c.note);
      s3.appendChild(row);
    });

    var s4 = section('Nút & hình khối');
    s4.appendChild(chipRow('Kiểu nút', [['', 'Theo mẫu']].concat(EP.pageStyle.OPTIONS.button), b.button || '', function (v) { saveField('button', v); buildBrandEditor(b); }));
    s4.appendChild(chipRow('Bo góc', [['', 'Theo mẫu']].concat(EP.pageStyle.OPTIONS.radius), b.radius || '', function (v) { saveField('radius', v); buildBrandEditor(b); }));
    textField(s4, 'Chữ trên nút đăng ký', 'ctaText', { max: 32, placeholder: 'Ví dụ: Giữ chỗ ngay' });

    var s5 = section('Giọng văn', 'AI viết nội dung theo đúng giọng này cho mọi sự kiện của thương hiệu.');
    s5.appendChild(chipRow('Giọng văn mặc định', TONE_OPTS, b.tone || 'formal', function (v) { saveField('tone', v); buildBrandEditor(b); }));
    textField(s5, 'Khách hàng mục tiêu', 'audience', { multiline: true, max: 200, placeholder: 'Ví dụ: sinh viên năm 2–4 ngành kinh tế, quan tâm việc làm' });
    textField(s5, 'Từ / cách nói nên dùng', 'voiceUse', { max: 200, placeholder: 'Ví dụ: thực chiến, cơ hội, đồng hành' });
    textField(s5, 'Từ / cách nói nên tránh', 'voiceAvoid', { max: 200, placeholder: 'Ví dụ: giá rẻ, siêu hot, cam kết 100%' });

    var s6 = section('Liên hệ', 'Hiện ở chân landing page.');
    textField(s6, 'Hotline', 'hotline', { type: 'tel', max: 20, placeholder: '0912 345 678', validate: function (v) { return !v || /^\+?[\d\s.\-()]{8,20}$/.test(v) ? '' : 'Số điện thoại chưa đúng.'; } });
    textField(s6, 'Website', 'website', { max: 120, placeholder: 'fpt.edu.vn', validate: function (v) { return !v || B.safeUrl(v) ? '' : 'Địa chỉ website chưa đúng.'; } });
    textField(s6, 'Fanpage', 'fanpage', { max: 160, placeholder: 'facebook.com/tenfanpage', validate: function (v) { return !v || B.safeUrl(v) ? '' : 'Địa chỉ fanpage chưa đúng.'; } });

    var s7 = section('Xoá thương hiệu', 'Các landing page đã áp dụng vẫn giữ nguyên giao diện và thông tin thương hiệu.');
    var del = document.createElement('button'); del.type = 'button'; del.className = 'btn btn-danger'; del.innerHTML = EP.icon('trash') + 'Xoá "' + (b.name || 'thương hiệu này') + '"';
    del.addEventListener('click', function () {
      if (!root.confirm('Xoá thương hiệu "' + (b.name || '') + '"? Không thể hoàn tác.')) return;
      EP.motion.collapse($('#brand-list .brand-item.is-active'), function () { B.remove(b.id); brandId = null; refreshBrandSelects(); renderBrandView(); toast('Đã xoá thương hiệu.'); });
    });
    s7.appendChild(del);
    drawPreview(b);
  }

  // Xem trước: một khối đầu trang thu nhỏ theo đúng màu, font, logo, nút của thương hiệu
  function drawPreview(b) {
    var pv = $('#brand-preview');
    var PS = EP.pageStyle;
    var primary = b.primary ? PS.solidHex(b.primary) : '#1e2a78';
    var accent = b.accent || '#d6336c';
    var hf = b.headingFont ? PS.fontFamilyName('', b.headingFont) : null;
    var bf = b.bodyFont ? PS.fontFamilyName('', b.bodyFont) : null;
    if (hf) PS.loadFont(hf); if (bf) PS.loadFont(bf);
    pv.innerHTML = '';
    var label = document.createElement('p'); label.className = 'st-label'; label.textContent = 'Xem trước';
    var card = document.createElement('div'); card.className = 'bp-card';
    card.style.setProperty('--bp-primary', primary);
    card.style.setProperty('--bp-accent', accent);
    card.style.setProperty('--bp-accent-ink', PS.textOn(accent));
    card.style.setProperty('--bp-text', b.textColor || '#131416');
    card.style.setProperty('--bp-bg', b.bgColor || '#ffffff');
    card.style.setProperty('--bp-hfont', hf ? "'" + hf.google + "', " + hf.fallback : 'inherit');
    card.style.setProperty('--bp-bfont', bf ? "'" + bf.google + "', " + bf.fallback : 'inherit');
    card.style.setProperty('--bp-radius', { square: '2px', soft: '10px', round: '20px' }[b.radius] || '10px');
    var hero = document.createElement('div'); hero.className = 'bp-hero';
    if (b.logo) { var im = document.createElement('img'); im.className = 'bp-logo'; im.src = b.logo; im.alt = ''; hero.appendChild(im); }
    var h = document.createElement('p'); h.className = 'bp-title'; h.textContent = 'Workshop ' + (b.name || 'thương hiệu của bạn') + ' 2026';
    var btn = document.createElement('span'); btn.className = 'bp-btn is-' + (b.button || 'solid'); btn.textContent = b.ctaText || 'Đăng ký tham gia';
    hero.appendChild(h); hero.appendChild(btn);
    var body = document.createElement('div'); body.className = 'bp-body';
    var p = document.createElement('p'); p.textContent = 'Đoạn giới thiệu sẽ hiện bằng font nội dung và màu chữ của thương hiệu.';
    var f = document.createElement('p'); f.className = 'bp-foot';
    f.textContent = 'Tổ chức bởi ' + (b.name || '…') + (b.hotline ? ' · ' + b.hotline : '') + (b.website ? ' · ' + b.website.replace(/^https?:\/\//, '') : '');
    body.appendChild(p);
    if (b.tagline) { var tg = document.createElement('p'); tg.className = 'bp-tag'; tg.textContent = b.tagline; body.appendChild(tg); }
    body.appendChild(f);
    card.appendChild(hero); card.appendChild(body);
    pv.appendChild(label); pv.appendChild(card);
    var tone = document.createElement('p'); tone.className = 'hint';
    tone.textContent = 'Giọng văn: ' + (TONE_OPTS.filter(function (t) { return t[0] === (b.tone || 'formal'); })[0][1]) + (b.audience ? ' · cho ' + b.audience : '');
    pv.appendChild(tone);
  }

  function newBrand() {
    var b = B.blank();
    b.name = 'Thương hiệu mới';
    B.save(b);
    brandId = b.id;
    refreshBrandSelects();
    if ($('#view-brand').hidden) switchTab('brand'); else renderBrandView();
    setTimeout(function () { var i = $('#bf-name'); if (i) { i.focus(); i.select(); } }, 60);
  }

  // Áp dụng thương hiệu vào trang đang mở (trang Thiết kế)
  function applyBrandToPage(id) {
    if (!state) return;
    if (!id) {
      state.event.brandId = ''; state.event.brand = null;
      persist(); swapLanding(); toast('Đã bỏ thương hiệu khỏi trang.');
      return;
    }
    var b = B.get(id);
    if (!b) return;
    B.applyTo(state.event, b);
    if (b.tone) { form.elements.tone.value = b.tone; state.tone = b.tone; }
    $('#f-brand').value = id;
    persist(); swapLanding();
    toast('Đã áp dụng Brand DNA "' + b.name + '": màu, font, logo, nút và liên hệ.');
  }

  $('#btn-brand-new').addEventListener('click', newBrand);
  $('#link-brand').addEventListener('click', function (e) { e.preventDefault(); switchTab('brand'); });
  $('#f-brand').addEventListener('change', function () {
    var b = B.get(this.value);
    if (b && b.tone) form.elements.tone.value = b.tone;
  });
  $('#btn-apply-brand').addEventListener('click', function () { applyBrandToPage($('#ed-brand').value); });
  refreshBrandSelects();

  EP.icons.hydrate();
  switchTab(Object.keys(S.read('events', {})).length ? 'events' : 'builder');
  root.addEventListener('resize', function () { EP.motion.indicator($('.tabs')); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { EP.motion.indicator($('.tabs')); });
  C.onAuth(function () { if (!$('#view-events').hidden) renderEvents(); });

  setInterval(syncAll, SYNC_INTERVAL_MS);

  // Đếm ngược mỗi giây + cập nhật khi tab khác có người đăng ký
  setInterval(function () { if (renderer) renderer.update(); }, 1000);
  S.onChange(function (key) {
    if (!state) return;
    if (key === EP.registrations.storageKey(state.event.id)) {
      if (renderer) renderer.update();
      if (!$('#view-admin').hidden) renderAdmin();
    }
  });
})(window);
