/*
 * brand-ai.js — Tạo Brand DNA từ tài liệu (PDF, TXT, MD, ảnh guideline) bằng Gemini.
 * Phần logic: kiểm tra tệp, soạn prompt, gọi Gemini nhiều phần (inline_data), làm sạch kết quả.
 * Phần giao diện: thẻ "Tạo Brand DNA từ tài liệu" (kéo thả → tiến trình → xem lại guideline → lưu).
 */
(function (root) {
  var EP = root.EP;
  var MAX_FILES = 5, MAX_FILE = 15 * 1048576, MAX_TOTAL = 20 * 1048576;
  var EXT = { pdf: 'application/pdf', txt: 'text/plain', md: 'text/plain', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp' };
  var TONES = ['formal', 'young', 'urgent'];

  function kb(n) { return n >= 1048576 ? (n / 1048576).toFixed(1).replace('.', ',') + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB'; }
  function extOf(name) { var m = /\.([a-z0-9]+)$/i.exec(name || ''); return m ? m[1].toLowerCase() : ''; }
  function mimeOf(f) { return EXT[extOf(f.name)] || ''; }

  // ---------- Kiểm tra tệp: trả về { ok: [File], errors: [string] } ----------
  function validateFiles(current, incoming) {
    var ok = current.slice(), errors = [];
    incoming.forEach(function (f) {
      if (!mimeOf(f)) { errors.push('"' + f.name + '": định dạng chưa hỗ trợ. Chỉ nhận PDF, TXT, MD, PNG, JPG, WebP.'); return; }
      if (f.size > MAX_FILE) { errors.push('"' + f.name + '" nặng ' + kb(f.size) + ', vượt giới hạn 15 MB mỗi tệp.'); return; }
      if (f.size === 0) { errors.push('"' + f.name + '" là tệp rỗng.'); return; }
      if (ok.length >= MAX_FILES) { errors.push('Tối đa ' + MAX_FILES + ' tệp, đã bỏ qua "' + f.name + '".'); return; }
      var total = ok.reduce(function (s, x) { return s + x.size; }, 0) + f.size;
      if (total > MAX_TOTAL) { errors.push('Tổng dung lượng vượt 20 MB, đã bỏ qua "' + f.name + '".'); return; }
      if (ok.some(function (x) { return x.name === f.name && x.size === f.size; })) { errors.push('"' + f.name + '" đã có trong danh sách.'); return; }
      ok.push(f);
    });
    return { ok: ok, errors: errors };
  }

  function toBase64(file) {
    return new Promise(function (res, rej) {
      var r = new FileReader();
      r.onload = function () { var s = String(r.result); res(s.slice(s.indexOf(',') + 1)); };
      r.onerror = function () { rej(new Error('Không đọc được tệp "' + file.name + '".')); };
      r.readAsDataURL(file);
    });
  }

  // ---------- Prompt ----------
  var SCHEMA = '{\n' +
    '  "name": "tên thương hiệu", "tagline": "khẩu hiệu",\n' +
    '  "primary": "#RRGGBB", "accent": "#RRGGBB", "textColor": "#RRGGBB", "bgColor": "#RRGGBB",\n' +
    '  "headingFont": "tên font Google Fonts", "bodyFont": "tên font Google Fonts",\n' +
    '  "button": "solid | outline | pill", "radius": "square | soft | round", "tone": "formal | young | urgent",\n' +
    '  "voiceUse": "các từ nên dùng, ngăn cách bằng dấu phẩy", "voiceAvoid": "các từ nên tránh, ngăn cách bằng dấu phẩy",\n' +
    '  "audience": "khách hàng mục tiêu", "ctaText": "chữ nút đăng ký (tối đa 30 ký tự)",\n' +
    '  "hotline": "", "website": "", "fanpage": "",\n' +
    '  "guideline": {\n' +
    '    "summary": "tóm tắt thương hiệu 2-3 câu", "mission": "sứ mệnh", "values": ["giá trị cốt lõi"],\n' +
    '    "personality": ["tính cách thương hiệu"],\n' +
    '    "colorPalette": [{"name": "tên màu", "hex": "#RRGGBB", "usage": "dùng cho việc gì"}],\n' +
    '    "typography": {"heading": "font tiêu đề", "body": "font nội dung", "notes": "quy tắc dùng chữ"},\n' +
    '    "logoRules": ["quy tắc dùng logo"], "imageryStyle": "phong cách hình ảnh",\n' +
    '    "doWords": ["từ nên dùng"], "dontWords": ["từ nên tránh"], "sampleCopy": ["câu mẫu đúng giọng thương hiệu"]\n' +
    '  }\n}';

  function buildPrompt(names, note) {
    return [
      'Bạn là chuyên gia xây dựng thương hiệu tại Việt Nam.',
      'Hãy đọc kỹ các tài liệu thương hiệu đính kèm' + (names && names.length ? ' (' + names.join(', ') + ')' : '') + ' (brand book, guideline, hồ sơ năng lực, hình ảnh) và soạn một bộ BRAND GUIDELINE hoàn chỉnh bằng tiếng Việt.',
      note ? 'Ghi chú thêm của người dùng: ' + note : '',
      '',
      'QUY TẮC',
      '1. Chỉ dùng thông tin có trong tài liệu. Chỗ nào tài liệu không nói, hãy suy luận hợp lý từ phong cách chung, và để chuỗi rỗng "" cho hotline/website/fanpage nếu không có.',
      '2. Màu phải là mã hex 6 ký tự (#RRGGBB). primary là màu chủ đạo đủ đậm để chữ trắng đọc rõ trên nền đó.',
      '3. Font phải là tên font có trên Google Fonts (ví dụ Be Vietnam Pro, Playfair Display, Montserrat); ưu tiên font hỗ trợ tiếng Việt.',
      '4. button chỉ được là solid, outline hoặc pill. radius chỉ được là square, soft hoặc round. tone chỉ được là formal, young hoặc urgent.',
      '5. colorPalette 3-6 màu; values, personality, doWords, dontWords mỗi mảng 3-8 ý ngắn; sampleCopy 3 câu.',
      '',
      'Chỉ trả về đúng một khối JSON hợp lệ, không giải thích, không markdown, theo mẫu:',
      SCHEMA
    ].filter(function (x, i) { return x !== '' || i !== 1; }).join('\n');
  }

  // ---------- Làm sạch kết quả AI ----------
  function str(v, max) { return typeof v === 'string' || typeof v === 'number' ? String(v).replace(/\s+/g, ' ').trim().slice(0, max) : ''; }
  function arr(v, max, n) {
    if (typeof v === 'string') v = v.split(/[,;\n]/);
    if (!Array.isArray(v)) return [];
    return v.map(function (x) { return str(x, max); }).filter(Boolean).slice(0, n || 8);
  }
  function hex(v) {
    var s = str(v, 40);
    if (!s) return '';
    if (/^[0-9a-f]{6}$/i.test(s) || /^[0-9a-f]{3}$/i.test(s)) s = '#' + s;
    if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(s)) return '';
    return EP.pageStyle.solidHex(s) || '';
  }
  function font(v) {
    var n = str(v, 60).replace(/["'<>;{}]/g, '');
    if (!n) return '';
    var k = EP.pageStyle.keyForFamily(n);
    return k ? EP.pageStyle.FONTS[k].google : n;
  }
  function pick(v, list, def) { v = str(v, 20).toLowerCase(); return list.indexOf(v) >= 0 ? v : def; }
  function join(a, max) { return a.join(', ').slice(0, max); }

  // Trả về { brand, warnings } — brand có đủ trường của Brand DNA + guideline
  function clean(raw) {
    var o = raw && typeof raw === 'object' ? raw : {}, w = [];
    var g = o.guideline && typeof o.guideline === 'object' ? o.guideline : {};
    var PS = EP.pageStyle;
    var b = EP.brands.blank();
    b.name = str(o.name, 60) || 'Thương hiệu mới';
    b.tagline = str(o.tagline, 100);
    b.primary = hex(o.primary); b.accent = hex(o.accent); b.textColor = hex(o.textColor); b.bgColor = hex(o.bgColor);
    if (b.primary && PS.contrast(b.primary, '#ffffff') < 4.5) {
      b.primary = PS.solidHex(PS.ensureDark(b.primary));
      w.push('Màu chính được làm đậm hơn để chữ trắng đọc rõ (tỉ lệ tương phản tối thiểu 4,5:1).');
    }
    if (b.textColor && PS.contrast(b.textColor, b.bgColor || '#ffffff') < 4.5) {
      b.textColor = ''; w.push('Màu chữ đề xuất khó đọc trên nền, đã bỏ để dùng màu chữ mặc định.');
    }
    b.headingFont = font(o.headingFont || (g.typography && g.typography.heading));
    b.bodyFont = font(o.bodyFont || (g.typography && g.typography.body));
    b.button = pick(o.button, ['solid', 'outline', 'pill'], 'solid');
    b.radius = pick(o.radius, ['square', 'soft', 'round'], 'soft');
    b.tone = pick(o.tone, TONES, 'formal');
    var doW = arr(g.doWords, 40), dontW = arr(g.dontWords, 40);
    b.voiceUse = str(typeof o.voiceUse === 'string' ? o.voiceUse : join(arr(o.voiceUse, 40), 200), 200) || join(doW, 200);
    b.voiceAvoid = str(typeof o.voiceAvoid === 'string' ? o.voiceAvoid : join(arr(o.voiceAvoid, 40), 200), 200) || join(dontW, 200);
    b.audience = str(o.audience, 200);
    b.ctaText = str(o.ctaText, 32);
    b.hotline = EP.brands.cleanPhone(o.hotline);
    b.website = EP.brands.safeUrl(o.website); b.fanpage = EP.brands.safeUrl(o.fanpage);
    var pal = (Array.isArray(g.colorPalette) ? g.colorPalette : []).map(function (c) {
      c = c || {}; var h = hex(c.hex); return h ? { name: str(c.name, 30) || h, hex: h, usage: str(c.usage, 80) } : null;
    }).filter(Boolean).slice(0, 8);
    if (!pal.length) [['Màu chính', b.primary], ['Màu nhấn', b.accent], ['Màu chữ', b.textColor], ['Màu nền', b.bgColor]].forEach(function (p) { if (p[1]) pal.push({ name: p[0], hex: p[1], usage: '' }); });
    var ty = g.typography && typeof g.typography === 'object' ? g.typography : {};
    b.guideline = {
      summary: str(g.summary, 500), mission: str(g.mission, 300), values: arr(g.values, 60), personality: arr(g.personality, 40),
      colorPalette: pal,
      typography: { heading: b.headingFont || str(ty.heading, 60), body: b.bodyFont || str(ty.body, 60), notes: str(ty.notes, 300) },
      logoRules: arr(g.logoRules, 140, 6), imageryStyle: str(g.imageryStyle, 300),
      doWords: doW, dontWords: dontW, sampleCopy: arr(g.sampleCopy, 160, 5)
    };
    if (!b.primary) w.push('Tài liệu chưa nêu rõ màu chính, bạn có thể chọn lại trong trình chỉnh sửa.');
    return { brand: b, warnings: w };
  }

  // ---------- Gọi Gemini ----------
  function generate(apiKey, model, files, note, onSwitch) {
    return Promise.all(files.map(function (f) { return toBase64(f).then(function (d) { return { inline_data: { mime_type: mimeOf(f), data: d } }; }); }))
      .then(function (parts) {
        parts.push({ text: buildPrompt(files.map(function (f) { return f.name; }), note) });
        return EP.ai.generate(apiKey, model || EP.ai.DEFAULT_MODEL, parts, onSwitch, { temperature: 0.4, timeout: 120000 });
      })
      .then(function (r) { var c = clean(EP.ai.extractJson(r.text)); c.model = r.model; return c; });
  }

  EP.brandAiCore = { MAX_FILES: MAX_FILES, MAX_FILE: MAX_FILE, MAX_TOTAL: MAX_TOTAL, validateFiles: validateFiles, buildPrompt: buildPrompt, clean: clean, generate: generate, kb: kb, extOf: extOf };

  // ================= Giao diện =================
  var document = root.document;
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function icon(n) { return EP.icon ? EP.icon(n) : ''; }

  function mount(host, hooks) {
    var files = [], result = null, busy = false, mode = 'api', stepTimer = null;
    var S = EP.storage;

    function stop() { clearInterval(stepTimer); stepTimer = null; }
    function go(fn) { EP.motion.transition ? EP.motion.transition(fn) : fn(); }

    function render() {
      stop();
      host.innerHTML = '';
      if (busy) return renderBusy();
      if (result) return renderReview();
      renderIdle();
    }

    // --- Màn chọn tệp ---
    function renderIdle() {
      var head = el('div', 'bai-head');
      var t = el('div'); t.appendChild(el('h2', 'panel-title', 'Tạo Brand DNA từ tài liệu'));
      t.appendChild(el('p', 'hint', 'Tải brand book, guideline hoặc ảnh nhận diện lên. AI đọc và soạn sẵn cả bộ Brand DNA để bạn xem lại rồi lưu.'));
      head.appendChild(t); 
      host.appendChild(head);

      var zone = el('label', 'bai-drop'); zone.id = 'bai-drop'; zone.tabIndex = 0;
      zone.innerHTML = icon('download') + '<strong>Kéo thả tài liệu vào đây</strong><span>hoặc bấm để chọn · PDF, TXT, MD, PNG, JPG, WebP · tối đa 5 tệp, 15 MB mỗi tệp, tổng 20 MB</span>';
      var inp = el('input'); inp.type = 'file'; inp.multiple = true; inp.id = 'bai-file'; inp.className = 'sr-only';
      inp.accept = '.pdf,.txt,.md,.png,.jpg,.jpeg,.webp,application/pdf,text/plain,text/markdown,image/png,image/jpeg,image/webp';
      zone.appendChild(inp);
      zone.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inp.click(); } });
      ['dragenter', 'dragover'].forEach(function (ev) { zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.add('is-over'); }); });
      ['dragleave', 'drop'].forEach(function (ev) { zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.remove('is-over'); }); });
      zone.addEventListener('drop', function (e) { add(Array.prototype.slice.call(e.dataTransfer.files)); });
      inp.addEventListener('change', function () { add(Array.prototype.slice.call(inp.files)); inp.value = ''; });
      host.appendChild(zone);

      var err = el('p', 'error bai-err'); err.id = 'bai-err'; err.setAttribute('role', 'alert'); host.appendChild(err);
      if (files.length) host.appendChild(fileList());

      var note = el('div', 'field');
      var nl = el('label', null, 'Ghi chú thêm cho AI (không bắt buộc)'); nl.htmlFor = 'bai-note';
      var ni = el('input'); ni.id = 'bai-note'; ni.maxLength = 200; ni.placeholder = 'Ví dụ: thương hiệu giáo dục, khách hàng là sinh viên'; ni.value = host._note || '';
      ni.addEventListener('input', function () { host._note = ni.value; });
      note.appendChild(nl); note.appendChild(ni); host.appendChild(note);

      var tabs = el('div', 'bai-modes'); tabs.setAttribute('role', 'tablist');
      [['api', 'Dùng Gemini API key'], ['copy', 'Không có key? Dùng chế độ copy prompt']].forEach(function (m) {
        var b = el('button', 'chip' + (mode === m[0] ? ' is-active' : ''), m[1]); b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', mode === m[0]);
        b.dataset.mode = m[0];
        b.addEventListener('click', function () { mode = m[0]; render(); });
        tabs.appendChild(b);
      });
      host.appendChild(tabs);
      host.appendChild(mode === 'api' ? apiBox() : copyBox());
    }

    function fileList() {
      var ul = el('ul', 'bai-files'); ul.id = 'bai-files';
      files.forEach(function (f, i) {
        var li = el('li', 'bai-file');
        var ext = extOf(f.name), isImg = /^image/.test(mimeOf(f));
        var ic = el('span', 'bai-ficon is-' + (ext === 'pdf' ? 'pdf' : isImg ? 'img' : 'txt'), ext === 'pdf' ? 'PDF' : isImg ? 'IMG' : ext.toUpperCase());
        var nm = el('span', 'bai-fname', f.name), sz = el('small', null, kb(f.size));
        var rm = el('button', 'icon-btn bai-rm'); rm.type = 'button'; rm.innerHTML = icon('x'); rm.setAttribute('aria-label', 'Bỏ tệp ' + f.name);
        rm.addEventListener('click', function () { EP.motion.collapse ? EP.motion.collapse(li, function () { files.splice(i, 1); render(); }) : (files.splice(i, 1), render()); });
        li.appendChild(ic); li.appendChild(nm); li.appendChild(sz); li.appendChild(rm); ul.appendChild(li);
      });
      EP.motion.stagger(ul.children);
      return ul;
    }

    function add(incoming) {
      var r = validateFiles(files, incoming);
      files = r.ok;
      render();
      var e = host.querySelector('#bai-err');
      if (e && r.errors.length) { e.textContent = r.errors.join(' '); EP.motion.replay(e, 'mo-shake'); }
    }

    function apiBox() {
      var box = el('div', 'bai-box');
      var f = el('div', 'field');
      var l = el('label', null, 'Gemini API key'); l.htmlFor = 'bai-key';
      var k = el('input'); k.id = 'bai-key'; k.type = 'password'; k.autocomplete = 'off'; k.placeholder = 'Dán key lấy từ Google AI Studio';
      var existing = S.read('gemini_key', '') || (document.getElementById('f-apikey') || {}).value || '';
      k.value = existing;
      var rem = el('label', 'check'); var rc = el('input'); rc.type = 'checkbox'; rc.id = 'bai-remember'; rc.checked = !!S.read('gemini_key', ''); rem.appendChild(rc); rem.appendChild(document.createTextNode(' Ghi nhớ key trên máy này'));
      var h = el('p', 'hint', 'Key chỉ lưu trong trình duyệt của bạn và chỉ gửi tới Google. Tài liệu được gửi tới Gemini để đọc.');
      f.appendChild(l); f.appendChild(k); f.appendChild(rem); f.appendChild(h);
      var msg = el('p', 'error'); msg.id = 'bai-msg'; msg.setAttribute('role', 'alert');
      var go = el('button', 'btn btn-primary'); go.type = 'button'; go.id = 'bai-go'; go.innerHTML = icon('wand') + 'Tạo Brand DNA bằng AI';
      go.addEventListener('click', function () {
        var key = k.value.trim();
        if (!files.length) { msg.textContent = 'Hãy thêm ít nhất một tài liệu.'; EP.motion.replay(msg, 'mo-shake'); return; }
        if (!key) { msg.textContent = 'Vui lòng dán Gemini API key, hoặc dùng chế độ copy prompt.'; EP.motion.replay(msg, 'mo-shake'); k.focus(); return; }
        if (rc.checked) S.write('gemini_key', key); else S.remove('gemini_key');
        run(key);
      });
      box.appendChild(f); box.appendChild(msg); box.appendChild(go);
      return box;
    }

    function copyBox() {
      var box = el('div', 'bai-box');
      box.appendChild(el('p', 'hint', '1) Copy prompt, 2) dán vào Gemini / ChatGPT / Claude và đính kèm các tài liệu, 3) dán JSON AI trả về vào ô bên dưới.'));
      var prompt = buildPrompt(files.map(function (f) { return f.name; }), host._note);
      var ta = el('textarea', 'bai-prompt'); ta.readOnly = true; ta.rows = 4; ta.value = prompt; ta.id = 'bai-prompt'; ta.setAttribute('aria-label', 'Prompt để copy');
      var cp = el('button', 'btn btn-ghost btn-small'); cp.type = 'button'; cp.id = 'bai-copy'; cp.innerHTML = icon('copy') + 'Copy prompt';
      cp.addEventListener('click', function () {
        function done() { cp.innerHTML = icon('check') + 'Đã copy'; EP.motion.replay(cp, 'mo-pop'); }
        if (root.navigator.clipboard && root.navigator.clipboard.writeText) root.navigator.clipboard.writeText(prompt).then(done, function () { ta.select(); done(); });
        else { ta.select(); try { document.execCommand('copy'); } catch (e) { /* bỏ qua */ } done(); }
      });
      var pl = el('label', null, 'Dán JSON AI trả về'); pl.htmlFor = 'bai-paste';
      var pa = el('textarea'); pa.id = 'bai-paste'; pa.rows = 6; pa.placeholder = '{ "name": "...", "primary": "#...", "guideline": { ... } }';
      var msg = el('p', 'error'); msg.id = 'bai-msg'; msg.setAttribute('role', 'alert');
      var ok = el('button', 'btn btn-primary'); ok.type = 'button'; ok.id = 'bai-parse'; ok.innerHTML = icon('check') + 'Đọc kết quả';
      ok.addEventListener('click', function () {
        try {
          var c = clean(EP.ai.extractJson(pa.value));
          result = c; render();
        } catch (e) { msg.textContent = 'Không đọc được kết quả: ' + e.message + ' Hãy copy lại đúng khối JSON AI trả về.'; EP.motion.replay(msg, 'mo-shake'); }
      });
      box.appendChild(ta); box.appendChild(cp); box.appendChild(pl); box.appendChild(pa); box.appendChild(msg); box.appendChild(ok);
      return box;
    }

    // --- Tiến trình ---
    var STEPS = ['Đang đọc tài liệu…', 'Đang phân tích màu sắc…', 'Đang soạn guideline…'];
    function renderBusy() {
      var wrap = el('div', 'bai-busy'); wrap.id = 'bai-busy'; wrap.setAttribute('role', 'status');
      wrap.appendChild(el('span', 'bai-orb'));
      var ul = el('ul', 'bai-steps');
      STEPS.forEach(function (s, i) { var li = el('li', i === 0 ? 'is-now' : ''); li.appendChild(el('span', 'bai-dot')); li.appendChild(document.createTextNode(s)); ul.appendChild(li); });
      wrap.appendChild(ul);
      var sw = el('p', 'hint'); sw.id = 'bai-switch'; wrap.appendChild(sw);
      host.appendChild(wrap);
      var i = 0;
      stepTimer = setInterval(function () {
        if (i < STEPS.length - 1) { i++; Array.prototype.forEach.call(ul.children, function (li, j) { li.className = j < i ? 'is-done' : j === i ? 'is-now' : ''; }); }
      }, 1600);
    }

    function run(key) {
      busy = true; render();
      var model = (document.getElementById('f-model') || {}).value || EP.ai.DEFAULT_MODEL;
      generate(key, model, files, host._note, function (m) { var s = host.querySelector('#bai-switch'); if (s) s.textContent = 'Đã chuyển sang model ' + m + '…'; })
        .then(function (c) { busy = false; result = c; render(); }, function (e) {
          busy = false; render();
          var m = host.querySelector('#bai-msg'); if (m) { m.textContent = e.message || 'Không tạo được Brand DNA.'; EP.motion.replay(m, 'mo-shake'); }
        });
    }

    // --- Xem lại guideline ---
    function renderReview() {
      var b = result.brand;
      var head = el('div', 'bai-head');
      var t = el('div'); t.appendChild(el('h2', 'panel-title', 'Brand DNA đã sẵn sàng'));
      t.appendChild(el('p', 'hint', 'Xem lại bộ guideline AI vừa soạn' + (result.model ? ' (' + result.model + ')' : '') + ' rồi lưu hoặc chỉnh sửa.'));
      head.appendChild(t); host.appendChild(head);
      result.warnings.forEach(function (w) { host.appendChild(el('p', 'hint is-warn bai-warn', w)); });
      var rv = guidelineView(b, true); rv.id = 'bai-review'; host.appendChild(rv);

      var cloudChk = null;
      if (EP.cloud && EP.cloud.available && EP.cloud.currentUser()) {
        var cl = el('label', 'check'); cloudChk = el('input'); cloudChk.type = 'checkbox'; cloudChk.id = 'bai-cloud'; cloudChk.checked = true;
        cl.appendChild(cloudChk); cl.appendChild(document.createTextNode(' Lưu trên tài khoản Google (dùng được ở thiết bị khác)')); host.appendChild(cl);
      }
      var bar = el('div', 'bai-actions');
      function commit(edit) {
        b.cloud = !!(cloudChk && cloudChk.checked);
        var saved = EP.brands.save(b);
        if (!saved) { toastMsg('Không lưu được: bộ nhớ trình trình duyệt đã đầy.'); return; }
        result = null; files = [];
        hooks.onSaved(saved, edit);
        render();
      }
      var save = el('button', 'btn btn-primary'); save.type = 'button'; save.id = 'bai-save'; save.innerHTML = icon('check') + 'Lưu Brand DNA';
      save.addEventListener('click', function () { commit(false); });
      var ed = el('button', 'btn btn-ghost'); ed.type = 'button'; ed.id = 'bai-edit'; ed.innerHTML = icon('pencil') + 'Chỉnh sửa trước khi lưu';
      ed.addEventListener('click', function () { commit(true); });
      var re = el('button', 'btn btn-ghost'); re.type = 'button'; re.id = 'bai-redo'; re.textContent = 'Làm lại';
      re.addEventListener('click', function () { result = null; render(); });
      bar.appendChild(save); bar.appendChild(ed); bar.appendChild(re); host.appendChild(bar);
      EP.motion.replay(rv, 'mo-pop');
    }
    function toastMsg(t) { if (hooks.toast) hooks.toast(t); }

    render();
    return { render: render, reset: function () { files = []; result = null; busy = false; render(); }, _state: function () { return { files: files.length, result: !!result }; } };
  }

  // Khối hiển thị guideline (dùng ở màn xem lại và ở mục "Brand guideline" của thương hiệu)
  function guidelineView(b, withHead) {
    var g = b.guideline || {};
    var PS = EP.pageStyle;
    var root_ = el('div', 'gl');
    var hf = b.headingFont ? PS.fontFamilyName('', b.headingFont) : null, bf = b.bodyFont ? PS.fontFamilyName('', b.bodyFont) : null;
    if (hf) PS.loadFont(hf); if (bf) PS.loadFont(bf);
    function fam(f) { return f ? "'" + f.google + "', " + f.fallback : 'inherit'; }
    function sec(title) { var s = el('section', 'gl-sec'); s.appendChild(el('h3', 'gl-h', title)); root_.appendChild(s); return s; }
    function chips(s, list, cls) { var w = el('div', 'gl-chips'); list.forEach(function (x) { w.appendChild(el('span', 'gl-chip ' + (cls || ''), x)); }); EP.motion.stagger(w.children, 20); s.appendChild(w); }

    if (withHead) {
      var id = el('div', 'gl-id');
      var sw = el('span', 'gl-logo'); sw.style.background = b.primary || '#131416'; sw.style.color = PS.textOn(b.primary || '#131416'); sw.textContent = (b.name || '?').charAt(0).toUpperCase();
      var tx = el('div'); var nm = el('strong', 'gl-name', b.name); nm.style.fontFamily = fam(hf); tx.appendChild(nm);
      if (b.tagline) tx.appendChild(el('p', 'hint', b.tagline));
      id.appendChild(sw); id.appendChild(tx); root_.appendChild(id);
    }
    if (g.summary || g.mission) {
      var s0 = sec('Tổng quan');
      if (g.summary) s0.appendChild(el('p', 'gl-p', g.summary));
      if (g.mission) { var m = el('p', 'gl-p'); m.appendChild(el('b', null, 'Sứ mệnh: ')); m.appendChild(document.createTextNode(g.mission)); s0.appendChild(m); }
    }
    if (g.colorPalette && g.colorPalette.length) {
      var sc = sec('Bảng màu'); var pal = el('div', 'gl-pal'); pal.id = 'gl-pal';
      g.colorPalette.forEach(function (c) {
        var card = el('div', 'gl-sw'); var chip = el('span', 'gl-swatch'); chip.style.background = c.hex; chip.style.color = PS.textOn(c.hex); chip.textContent = c.hex.toUpperCase();
        card.appendChild(chip); card.appendChild(el('strong', null, c.name)); if (c.usage) card.appendChild(el('small', null, c.usage)); pal.appendChild(card);
      });
      EP.motion.stagger(pal.children, 20); sc.appendChild(pal);
    }
    if (b.headingFont || b.bodyFont || (g.typography && g.typography.notes)) {
      var st = sec('Chữ'); var ty = el('div', 'gl-type');
      var h = el('p', 'gl-t-h', b.headingFont ? 'Tiêu đề · ' + b.headingFont : 'Tiêu đề'); h.style.fontFamily = fam(hf);
      var bd = el('p', 'gl-t-b', 'Nội dung · ' + (b.bodyFont || 'font mặc định') + ' – Học thật, làm thật, cơ hội thật.'); bd.style.fontFamily = fam(bf);
      ty.appendChild(h); ty.appendChild(bd); st.appendChild(ty);
      if (g.typography && g.typography.notes) st.appendChild(el('p', 'hint', g.typography.notes));
    }
    if (g.values && g.values.length) chips(sec('Giá trị cốt lõi'), g.values);
    if (g.personality && g.personality.length) chips(sec('Tính cách thương hiệu'), g.personality, 'is-accent');
    if ((g.doWords && g.doWords.length) || (g.dontWords && g.dontWords.length)) {
      var sv = sec('Giọng văn'); var two = el('div', 'gl-two');
      var d = el('div'); d.appendChild(el('p', 'gl-sub is-do', 'Nên dùng')); chips(d, g.doWords || [], 'is-do');
      var n = el('div'); n.appendChild(el('p', 'gl-sub is-dont', 'Nên tránh')); chips(n, g.dontWords || [], 'is-dont');
      two.appendChild(d); two.appendChild(n); sv.appendChild(two);
      if (b.audience) sv.appendChild(el('p', 'hint', 'Khách hàng mục tiêu: ' + b.audience));
    }
    if (g.sampleCopy && g.sampleCopy.length) {
      var sp = sec('Câu mẫu'); g.sampleCopy.forEach(function (x) { sp.appendChild(el('blockquote', 'gl-quote', x)); });
    }
    if (g.logoRules && g.logoRules.length) { var sl = sec('Quy tắc dùng logo'); var ul = el('ul', 'gl-list'); g.logoRules.forEach(function (x) { ul.appendChild(el('li', null, x)); }); sl.appendChild(ul); }
    if (g.imageryStyle) sec('Phong cách hình ảnh').appendChild(el('p', 'gl-p', g.imageryStyle));
    return root_;
  }

  EP.brandAi = { mount: mount, guidelineView: guidelineView };
})(typeof window !== 'undefined' ? window : globalThis);
