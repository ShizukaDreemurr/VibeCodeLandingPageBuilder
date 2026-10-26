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
  var state = S.read('current', null); // { event, content, tone }
  var renderer = null;
  var regenSeed = 0;
  var remoteCount = null; // số đăng ký trên Google Sheet (null = chưa lấy được)
  var SYNC_INTERVAL_MS = 15000;

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
      sheetUrl: V.clean(f.sheetUrl.value)
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
  }

  function toast(text) {
    var t = $('#toast');
    t.textContent = text;
    t.hidden = false;
    clearTimeout(toast.timer);
    toast.timer = setTimeout(function () { t.hidden = true; }, 3500);
  }

  // ---------- Dựng landing page ----------
  function renderLanding() {
    if (!state) return;
    $('#mock-note').hidden = state.content.source !== 'mock';
    renderer = EP.landingRenderer.render(landingEl, {
      event: state.event,
      content: state.content,
      now: function () { return new Date(); },
      getCount: currentCount,
      onRegister: function (data) {
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
    $('#btn-regenerate').disabled = false;
  }

  // ---------- Đồng bộ Google Sheet ----------
  function currentCount() {
    var id = state.event.id;
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
    if (!state || !state.event.sheetUrl) return Promise.resolve();
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
    state = { event: ev, content: content, tone: tone };
    if (!S.write('current', state)) setMsg('Không lưu được dữ liệu vào trình duyệt.', 'error');
    renderLanding();
    syncAll();
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
        btn.textContent = '✨ Tạo landing page';
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
    if (!state.event.sheetUrl) return '—';
    return r.synced === false ? 'Chờ gửi' : 'Đã gửi';
  }

  function renderAdmin() {
    var tbody = $('#admin-rows');
    tbody.innerHTML = '';
    if (!state) {
      $('#admin-title').textContent = 'Danh sách đăng ký';
      tbody.innerHTML = '<tr><td colspan="7" class="empty">Chưa có sự kiện nào. Hãy tạo landing page trước.</td></tr>';
      return;
    }
    var regs = EP.registrations.list(state.event.id);
    $('#admin-title').textContent = 'Danh sách đăng ký – ' + state.event.name + ' (' + EP.registrations.confirmedCount(state.event.id) + ' người)';
    if (!regs.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty">Chưa có ai đăng ký.</td></tr>';
      return;
    }
    regs.forEach(function (r, i) {
      var tr = document.createElement('tr');
      [i + 1, r.name, r.phone, r.email, new Date(r.createdAt).toLocaleString('vi-VN'), STATUS_TEXT[r.status] || r.status, syncText(r)]
        .forEach(function (v) { var td = document.createElement('td'); td.textContent = v; tr.appendChild(td); });
      tbody.appendChild(tr);
    });
  }

  function csvCell(v) {
    var s = String(v == null ? '' : v);
    if (/^[=+\-@]/.test(s)) s = "'" + s; // chặn công thức độc hại khi mở bằng Excel
    return '"' + s.replace(/"/g, '""') + '"';
  }

  function exportCsv() {
    if (!state) return toast('Chưa có sự kiện để xuất.');
    var regs = EP.registrations.list(state.event.id);
    if (!regs.length) return toast('Chưa có ai đăng ký để xuất.');
    var rows = [['STT', 'Họ tên', 'Số điện thoại', 'Email', 'Thời gian đăng ký', 'Trạng thái']].concat(regs.map(function (r, i) {
      return [i + 1, r.name, r.phone, r.email, new Date(r.createdAt).toLocaleString('vi-VN'), STATUS_TEXT[r.status] || r.status];
    }));
    // ﻿ để Excel đọc đúng tiếng Việt
    var blob = new Blob(['﻿' + rows.map(function (r) { return r.map(csvCell).join(','); }).join('\r\n')], { type: 'text/csv;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'dang-ky-' + state.event.name.replace(/[^\wÀ-ỹ]+/g, '-').toLowerCase() + '.csv';
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  // ---------- Tạo trang mới ----------
  function resetAll() {
    if (state && !root.confirm('Tạo trang mới cho sự kiện khác? Trang hiện tại sẽ được đóng lại (danh sách đăng ký cũ vẫn được giữ trong trình duyệt).')) return;
    S.remove('current');
    state = null;
    renderer = null;
    remoteCount = null;
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
    landingEl.innerHTML = '<div class="empty-state"><p class="empty-title">Landing page sẽ hiện ở đây</p><p>Nhập thông tin sự kiện bên trái rồi bấm <strong>✨ Tạo landing page</strong>.</p></div>';
    switchTab('builder');
    form.elements.name.focus();
    toast('Đã sẵn sàng tạo trang mới.');
  }

  // ---------- Dữ liệu mẫu để demo ----------
  function toLocalInput(date) {
    var d = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return d.toISOString().slice(0, 16);
  }

  function fillSample() {
    var start = new Date(); start.setDate(start.getDate() + 12); start.setHours(9, 0, 0, 0);
    var early = new Date(); early.setDate(early.getDate() + 5); early.setHours(23, 59, 0, 0);
    fillForm({
      name: 'Workshop AI Marketing 2026',
      startAt: toLocalInput(start),
      location: 'Toà nhà FPT, Cầu Giấy, Hà Nội',
      capacity: 150,
      speakers: [{ name: 'Nguyễn Văn An', title: 'Chuyên gia AI Marketing' }, { name: 'Trần Thu Hà', title: 'Growth Director, Agency X' }],
      agenda: [
        { time: '08:30', title: 'Đón khách & check-in' },
        { time: '09:00', title: 'Khai mạc & giới thiệu chương trình' },
        { time: '09:15', title: 'Ứng dụng AI vào lập kế hoạch chiến dịch' },
        { time: '10:30', title: 'Thực hành: tự động hoá nội dung' },
        { time: '11:30', title: 'Hỏi đáp & kết nối' }
      ],
      earlyBird: 'Giảm 30% học phí cho 50 người đăng ký đầu tiên',
      earlyBirdUntil: toLocalInput(early)
    });
    showErrors({});
  }

  // ---------- Tab ----------
  function switchTab(name) {
    document.querySelectorAll('.tab').forEach(function (t) {
      var on = t.getAttribute('data-tab') === name;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    $('#view-builder').hidden = name !== 'builder';
    $('#view-admin').hidden = name !== 'admin';
    if (name === 'admin') renderAdmin();
  }

  function syncModeBoxes() {
    var mode = currentMode();
    document.querySelectorAll('.ai-box').forEach(function (b) { b.hidden = b.getAttribute('data-mode') !== mode; });
  }

  // ---------- Khởi động ----------
  form.addEventListener('submit', function (e) { e.preventDefault(); generate(false); });
  $('#btn-regenerate').addEventListener('click', function () { generate(true); });
  $('#btn-new').addEventListener('click', resetAll);
  $('#btn-sample').addEventListener('click', fillSample);
  $('#btn-sheet-test').addEventListener('click', testSheet);
  $('#btn-export').addEventListener('click', exportCsv);
  $('#btn-clear-regs').addEventListener('click', function () {
    if (!state) return;
    if (root.confirm('Xoá toàn bộ danh sách đăng ký của sự kiện này? Không thể hoàn tác.')) {
      EP.registrations.removeAll(state.event.id);
      renderAdmin();
      if (renderer) renderer.update();
    }
  });
  document.querySelectorAll('.tab').forEach(function (t) {
    t.addEventListener('click', function () { switchTab(t.getAttribute('data-tab')); });
  });
  form.querySelectorAll('input[name="aiMode"]').forEach(function (r) { r.addEventListener('change', syncModeBoxes); });

  var savedKey = S.read('gemini_key', '');
  if (savedKey) { $('#f-apikey').value = savedKey; $('#f-remember-key').checked = true; }

  buildPlatformButtons();
  syncModeBoxes();

  if (state) {
    fillForm(state.event);
    if (state.tone) form.elements.tone.value = state.tone;
    renderLanding();
    syncAll();
  }

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
