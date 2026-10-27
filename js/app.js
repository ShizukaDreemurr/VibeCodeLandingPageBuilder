/*
 * app.js — nối form nhập, AI, landing page và danh sách đăng ký.
 */
(function (root) {
  var EP = root.EP;
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
      elStyles: (state && state.event.elStyles) || null
    };
  }

  function fillForm(ev) {
    var f = form.elements;
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
      var images = JSON.parse(JSON.stringify(state.event.images || {}));
      if (kind === 'hero') images.hero = dataUrl;
      if (kind === 'speaker') { images.speakers = images.speakers || {}; images.speakers[index] = dataUrl; }
      if (kind === 'gallery') { images.gallery = images.gallery || []; images.gallery[index] = dataUrl; }
      if (EP.images.totalBytes(images) > MAX_IMAGE_BYTES) {
        toast('Tổng dung lượng ảnh đã đầy (khoảng 900KB). Hãy bớt ảnh hoặc dùng ảnh đơn giản hơn.');
        return;
      }
      state.event.images = images;
      persist();
      var target = kind === 'hero' ? landingEl.querySelector('.lp-hero')
        : landingEl.querySelector('[data-slot="' + slot + '"]') && landingEl.querySelector('[data-slot="' + slot + '"]').parentElement;
      EP.motion.replay(target, 'mo-img-in');
      toast('Đã cập nhật ảnh.');
    }, function (e) {
      if (e.message !== 'Chưa chọn ảnh.') toast(e.message);
    });
  }

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

  var reduceMotion = root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
    if (reduceMotion) return;
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
    var startY = e.clientY, dragging = false, ghost, holder, offsetY, lastTop;
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
      document.body.appendChild(ghost);
      document.body.classList.add('is-sorting');
    }
    function move(ev) {
      if (!dragging) { if (Math.abs(ev.clientY - startY) < 5) return; begin(); }
      ev.preventDefault();
      lastTop = ev.clientY - offsetY;
      ghost.style.top = lastTop + 'px';
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
      var box = ol.closest('.editor-side');
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
      if (reduceMotion) return finish();
      var a = ghost.animate([{ top: lastTop + 'px' }, { top: dest.top + 'px' }], { duration: 180, easing: 'ease-out' });
      a.onfinish = finish;
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
        if (wrap && !$('#view-editor').hidden) sec.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
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
    function fromText(commit) {
      var raw = tx.value.trim();
      if (!raw) { tx.classList.remove('is-invalid'); if (commit) onSet('', true); return; }
      var v = PS.normalizeColor(raw);
      tx.classList.toggle('is-invalid', !v);
      if (!v) return;
      sw.value = PS.solidHex(v);
      onSet(v, commit);
      if (commit) tx.value = v;
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
    function show(v) { var isSet = v != null && v !== ''; rg.value = isSet ? v : R[0]; nb.value = isSet ? v : ''; nb.placeholder = 'Tự động'; row.classList.toggle('is-unset', !isSet); }
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

  function fontField(label, key, customKey, current, custom, keys, allowDefault) {
    var PS = EP.pageStyle;
    var row = document.createElement('div'); row.className = 'st-row';
    var head = document.createElement('label'); head.className = 'st-label'; head.textContent = label;
    var sel = document.createElement('select'); sel.setAttribute('aria-label', label);
    if (allowDefault) sel.add(new Option('Theo mẫu', ''));
    keys.forEach(function (k) {
      var o = new Option(PS.FONTS[k].label, k);
      o.style.fontFamily = "'" + PS.FONTS[k].google + "'";
      sel.add(o);
    });
    if (customKey) sel.add(new Option('Font Google khác…', '__custom'));
    sel.value = custom && customKey ? '__custom' : (current || '');
    row.appendChild(head); row.appendChild(sel);
    var cin;
    if (customKey) {
      cin = document.createElement('input'); cin.type = 'text'; cin.placeholder = 'Tên font trên Google Fonts, vd: Pacifico';
      cin.value = custom || ''; cin.hidden = sel.value !== '__custom'; cin.setAttribute('aria-label', label + ' – tên font Google');
      cin.addEventListener('change', function () {
        var v = cin.value.trim();
        if (v && !/^[A-Za-z0-9 ]{2,40}$/.test(v)) { toast('Tên font chỉ gồm chữ không dấu, số và dấu cách.'); return; }
        setStyle(customKey, v);
      });
      row.appendChild(cin);
    }
    // Xem trước font ngay khi rê/chọn
    keys.forEach(function (k) { PS.loadFont(PS.FONTS[k]); });
    sel.addEventListener('change', function () {
      if (sel.value === '__custom') { cin.hidden = false; cin.focus(); return; }
      var st = Object.assign({}, state.event.style || {});
      st[key] = sel.value;
      if (customKey) st[customKey] = '';
      state.event.style = st;
      persist();
    });
    return row;
  }

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
        fontField('Font tiêu đề', 'headingFont', null, st.headingFont, '', PS.SIMPLE_FONTS, true),
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
      fontField('Font tiêu đề', 'headingFont', 'headingFontCustom', st.headingFont, st.headingFontCustom, allFonts, true),
      fontField('Font nội dung', 'bodyFont', 'bodyFontCustom', st.bodyFont, st.bodyFontCustom, allFonts, false),
      rangeField('h1Size', st.h1Size), rangeField('h2Size', st.h2Size), rangeField('bodySize', st.bodySize),
      rangeField('lineHeight', st.lineHeight), rangeField('headingWeight', st.headingWeight), rangeField('letterSpacing', st.letterSpacing),
      chipRow('Kiểu chữ tiêu đề', O.headingUpper, st.headingUpper, pick('headingUpper'))
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
  function editText(key, value) {
    var t = Object.assign({}, state.event.texts || {});
    t[key] = value;
    state.event.texts = t;
    persist();
    toast('Đã lưu chỉnh sửa.');
  }

  // Sửa chữ trực tiếp trên trang
  function editContent(field, value) {
    var c = JSON.parse(JSON.stringify(state.content));
    if (field.indexOf('benefits:') === 0) c.benefits[Number(field.split(':')[1])] = value;
    else c[field] = value;
    state.content = c;
    persist();
    toast('Đã lưu chỉnh sửa.');
  }

  var device = 'desktop';
  function applyDevice() {
    ['desktop', 'tablet', 'mobile'].forEach(function (d) { landingEl.classList.toggle('device-' + d, d === device); });
  }

  // Cả trang đổi (tạo mới, đổi mẫu, hoàn tác, xem thử trạng thái): hiệu ứng chuyển mượt
  function swapLanding() { EP.motion.replay(landingEl, 'mo-swap'); }

  // Xem trước tức thì khi kéo thanh trượt / chọn màu: chỉ vẽ lại trang, giữ nguyên bảng điều khiển
  var livePreview = false;
  function liveRender() {
    livePreview = true;
    try { renderLanding(); } finally { livePreview = false; }
  }

  function renderLanding() {
    if (!state) return;
    $('#mock-note').hidden = state.content.source !== 'mock';
    syncSimUi();
    if (!livePreview) {
      renderSectionList();
      renderStylePanel();
    }
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
    if (EP.inspector) EP.inspector.refresh();
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
  function switchTab(name) {
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
  function openSidePane(name) {
    document.querySelectorAll('.side-tab').forEach(function (x) { x.classList.toggle('is-active', x.getAttribute('data-side') === name); });
    $('#side-style').hidden = name !== 'style';
    $('#side-publish').hidden = name !== 'publish';
  }
  document.querySelectorAll('.side-tab').forEach(function (b) {
    b.addEventListener('click', function () { openSidePane(b.getAttribute('data-side')); });
  });
  $('#btn-back-info').addEventListener('click', function () { switchTab('builder'); });
  document.querySelectorAll('.device-toggle [data-device]').forEach(function (b) {
    b.addEventListener('click', function () {
      device = b.getAttribute('data-device');
      document.querySelectorAll('.device-toggle [data-device]').forEach(function (x) { x.classList.toggle('is-active', x === b); });
      applyDevice();
    });
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
