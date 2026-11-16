/* ai.js - EP.ai.generate(spec, { mode: 'mock' | 'gemini' | 'paste' }) -> Promise<{ data, mode, model, notice, warnings, prompt }>
   Ba chế độ cùng một đường ra:
     mock   : chạy spec.mock(input) offline (tất định), luôn kèm MOCK_NOTICE.
     gemini : gọi Gemini generateContent bằng key của người dùng (header x-goog-api-key), tự đổi model khi hết lượt/quá tải,
              rút JSON từ câu trả lời, kiểm tra theo schema, sai thì thử lại 1 lần, vẫn sai/lỗi thì rơi về mock (có cảnh báo).
     (nếu EP.config.ai.proxyUrl có giá trị: gọi qua máy chủ trung gian, không cần key ở trình duyệt, xem proxy/README.md)
     paste  : mở hộp thoại cho copy prompt -> dán trả lời của Claude/ChatGPT/Gemini -> kiểm tra như trên.
   spec = {
     id: 'tom-tat',
     prompt: function (input) { return '...'; } | 'chuỗi',      // phần việc; framework tự thêm yêu cầu JSON + khung schema
     schema: { type: 'object', props: { title: { type: 'string', max: 60 }, tags: { type: 'array', of: { type: 'string' }, min: 3, max: 3 } } },
     mock: function (input) { return {...}; },                    // BẮT BUỘC có để chạy offline
     temperature: 0.8
   }
   Schema: string{min,max,enum,optional} | number{min,max,integer} | boolean | array{of,min,max} | object{props}. Mặc định mọi trường bắt buộc. */
(function (root) {
  'use strict';
  var EP = root.EP, cfg = EP.config, esc = EP.esc, doc = root.document;

  var MOCK_NOTICE = cfg.mockNotice || 'Bản demo vòng loại - Dữ liệu mô phỏng AI';
  var GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent';
  var TIMEOUT_MS = 25000;
  // Danh sách model sao chép từ Xclipse (js/ai-service.js). Cập nhật theo tài khoản thật khi đi thi.
  var MODELS = [
    { id: 'gemini-4-hydrogen', label: 'Gemini 4 Hydrogen', note: 'Thế hệ 4, ~10 giây - khuyên dùng', tier: 'free' },
    { id: 'gemini-3.6-flash', label: 'Gemini 3.6 Flash', note: 'Nhanh (~1 giây)', tier: 'free' },
    { id: 'gemini-3.8-flash', label: 'Gemini 3.8 Flash', note: 'Rất chậm, có thể quá 90 giây - chỉ dùng khi rảnh', tier: 'slow' }
  ];
  function proxyUrl() { var u = cfg.ai && cfg.ai.proxyUrl; return u ? String(u).replace(/\/+$/, '') : ''; }
  var DEFAULT_MODEL = 'gemini-4-hydrogen';
  var FALLBACKS = ['gemini-4-hydrogen', 'gemini-3.6-flash', 'gemini-3.8-flash'];
  var PLATFORMS = { claude: ['Claude', 'https://claude.ai/new'], chatgpt: ['ChatGPT', 'https://chatgpt.com/'], gemini: ['Gemini', 'https://gemini.google.com/app'] };
  function modelInfo(id) { return MODELS.filter(function (m) { return m.id === id; })[0] || null; }
  function fail(msg, kind) { var e = new Error(msg); e.kind = kind; return e; }

  /* ---------- Trạng thái: chế độ / model / key (key chỉ lưu khi người dùng chủ động chọn "nhớ") ---------- */
  var state = {
    mode: EP.store.read('ai_mode', cfg.defaultAiMode || 'mock'),
    model: EP.store.read('ai_model', DEFAULT_MODEL),
    remember: !!EP.store.read('ai_remember', false),
    key: ''
  };
  if (state.remember) state.key = EP.store.read('ai_key', '') || '';
  if (['mock', 'gemini', 'paste'].indexOf(state.mode) < 0) state.mode = 'mock';

  /* ---------- Schema validator (đủ dùng, không thư viện) ---------- */
  function trimTo(s, max) { s = String(s).trim(); return max && s.length > max ? s.slice(0, max - 1).trim() + '…' : s; }
  function check(v, sc, path, warns, errs) {
    var type = sc.type || 'string';
    if (v == null || v === '') {
      if (sc.optional) return v == null ? undefined : v;
      errs.push(path + ': thiếu giá trị'); return v;
    }
    if (type === 'string') {
      if (typeof v === 'object') { errs.push(path + ': cần chuỗi'); return v; }
      var s = String(v).trim();
      if (sc.enum && sc.enum.indexOf(s) < 0) {
        var ci = sc.enum.filter(function (e) { return String(e).toLowerCase() === s.toLowerCase(); })[0];
        if (ci) return ci;
        errs.push(path + ': "' + s + '" không thuộc ' + sc.enum.join('/')); return s;
      }
      if (sc.min && s.length < sc.min) errs.push(path + ': quá ngắn (< ' + sc.min + ' ký tự)');
      if (sc.max && s.length > sc.max) { warns.push(path + ': đã cắt bớt còn ' + sc.max + ' ký tự'); s = trimTo(s, sc.max); }
      return s;
    }
    if (type === 'number') {
      var n = typeof v === 'number' ? v : Number(String(v).replace(',', '.'));
      if (!isFinite(n)) { errs.push(path + ': cần là số'); return v; }
      if (sc.integer) n = Math.round(n);
      if (sc.min != null && n < sc.min) { warns.push(path + ': nâng lên ' + sc.min); n = sc.min; }
      if (sc.max != null && n > sc.max) { warns.push(path + ': hạ xuống ' + sc.max); n = sc.max; }
      return n;
    }
    if (type === 'boolean') {
      if (typeof v === 'boolean') return v;
      if (v === 'true') return true; if (v === 'false') return false;
      errs.push(path + ': cần true/false'); return v;
    }
    if (type === 'array') {
      if (!Array.isArray(v)) v = [v];
      if (sc.min && v.length < sc.min) { errs.push(path + ': cần ít nhất ' + sc.min + ' phần tử (có ' + v.length + ')'); }
      if (sc.max && v.length > sc.max) { warns.push(path + ': chỉ giữ ' + sc.max + ' phần tử đầu'); v = v.slice(0, sc.max); }
      return v.map(function (x, i) { return check(x, sc.of || { type: 'string' }, path + '[' + i + ']', warns, errs); });
    }
    if (type === 'object') {
      if (typeof v !== 'object' || Array.isArray(v)) { errs.push(path + ': cần object'); return v; }
      var out = {};
      Object.keys(sc.props || {}).forEach(function (k) {
        var r = check(v[k], sc.props[k], path ? path + '.' + k : k, warns, errs);
        if (r !== undefined) out[k] = r;
      });
      return out;
    }
    return v;
  }
  /** EP.ai.validate(value, schema) -> { ok, errors[], warnings[], value (đã ép kiểu/cắt độ dài) } */
  function validate(value, schema) {
    var warns = [], errs = [], out = schema ? check(value, schema, '', warns, errs) : value;
    return { ok: !errs.length, errors: errs, warnings: warns, value: out };
  }
  /** Mô tả schema thành mẫu JSON để đưa vào prompt */
  function describe(sc) {
    var t = sc.type || 'string';
    if (t === 'string') return sc.enum ? '"' + sc.enum.join(' | ') + '"' : '"..."' + (sc.max ? ' /* tối đa ' + sc.max + ' ký tự */' : '');
    if (t === 'number') return '0' + (sc.min != null || sc.max != null ? ' /* từ ' + (sc.min != null ? sc.min : '-') + ' đến ' + (sc.max != null ? sc.max : '-') + ' */' : '');
    if (t === 'boolean') return 'true';
    if (t === 'array') return '[' + describe(sc.of || { type: 'string' }) + (sc.min > 1 || sc.max > 1 ? ', ...' : '') + ']' + (sc.min || sc.max ? ' /* ' + (sc.min === sc.max ? 'đúng ' + sc.min : (sc.min || 0) + '-' + (sc.max || '?')) + ' phần tử */' : '');
    if (t === 'object') return '{ ' + Object.keys(sc.props || {}).map(function (k) { return '"' + k + '": ' + describe(sc.props[k]); }).join(', ') + ' }';
    return '"..."';
  }

  /* ---------- Rút JSON từ câu trả lời của AI: bỏ ```json, lời dẫn, nháy cong, dấu phẩy thừa; vá JSON bị cụt ---------- */
  function closeBrackets(s) {
    var stack = [], inStr = false, esc2 = false, i, c;
    for (i = 0; i < s.length; i++) {
      c = s[i];
      if (inStr) { if (esc2) esc2 = false; else if (c === '\\') esc2 = true; else if (c === '"') inStr = false; continue; }
      if (c === '"') inStr = true; else if (c === '{' || c === '[') stack.push(c); else if (c === '}' || c === ']') stack.pop();
    }
    if (inStr) s += '"';
    s = s.replace(/,\s*$/, '');
    while (stack.length) s += stack.pop() === '{' ? '}' : ']';
    return s;
  }
  function extractJson(text) {
    if (text == null || !String(text).trim()) throw new Error('AI không trả về nội dung.');
    var s = String(text).replace(/```(?:json)?/gi, '').replace(/^﻿/, '');
    var a = s.indexOf('{'), b = s.indexOf('['), start = a < 0 ? b : b < 0 ? a : Math.min(a, b);
    if (start < 0) throw new Error('Không tìm thấy khối JSON trong kết quả.');
    var end = Math.max(s.lastIndexOf('}'), s.lastIndexOf(']'));
    s = s.slice(start, end > start ? end + 1 : undefined).replace(/[“”]/g, '"').replace(/,\s*([}\]])/g, '$1');
    try { return JSON.parse(s); } catch (e1) {
      try { return JSON.parse(closeBrackets(s)); } catch (e2) { throw new Error('JSON bị lỗi cú pháp: ' + e1.message); }
    }
  }

  /* ---------- Gọi Gemini ---------- */
  function callGemini(apiKey, model, prompt, opts) {
    opts = opts || {};
    var info = modelInfo(model), limit = opts.timeout || (info && info.tier === 'slow' ? 180000 : TIMEOUT_MS);
    var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = controller && setTimeout(function () { controller.abort(); }, limit);
    var px = proxyUrl(), headers = { 'Content-Type': 'application/json' };
    if (px) { if (cfg.ai.appToken) headers['X-App-Token'] = cfg.ai.appToken; } else headers['x-goog-api-key'] = apiKey;
    return fetch(px ? px + '/gemini/' + encodeURIComponent(model) : GEMINI_URL.replace('{model}', encodeURIComponent(model)), {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: opts.temperature == null ? 0.8 : opts.temperature, responseMimeType: 'application/json' }
      }),
      signal: controller ? controller.signal : undefined
    }).then(function (res) {
      if (timer) clearTimeout(timer);
      if (res.status === 400 || res.status === 401 || res.status === 403) throw fail(proxyUrl() ? 'Máy chủ trung gian từ chối yêu cầu (kiểm tra ALLOWED_ORIGINS / token).' : 'API key không hợp lệ hoặc chưa được cấp quyền.', 'key');
      if (res.status === 404) throw fail('Model "' + model + '" không còn mở cho tài khoản này.', 'model');
      if (res.status === 429) throw fail(info && info.tier === 'paid' ? 'Model "' + model + '" cần bật thanh toán trên Google AI Studio.' : 'Model "' + model + '" đã hết lượt miễn phí, thử lại sau ít phút.', 'quota');
      if (res.status === 503 || res.status === 500) throw fail('Model "' + model + '" của Google đang quá tải.', 'server');
      if (!res.ok) throw fail('Dịch vụ AI đang lỗi (mã ' + res.status + ').', 'server');
      return res.json();
    }, function (err) {
      if (timer) clearTimeout(timer);
      if (err && err.kind) throw err;
      throw err && err.name === 'AbortError' ? fail('Model "' + model + '" phản hồi quá lâu (quá ' + Math.round(limit / 1000) + ' giây).', 'timeout') : fail('Không kết nối được tới Gemini. Kiểm tra mạng.', 'network');
    }).then(function (data) {
      var parts = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts;
      if (!parts || !parts.length) throw fail('AI không trả về nội dung (có thể bị bộ lọc an toàn chặn).', 'empty');
      return parts.filter(function (p) { return !p.thought; }).map(function (p) { return p.text || ''; }).join('');
    });
  }
  /** Gọi model đã chọn; lỗi do model thì tự chuyển sang model nhanh khác. Lỗi key/mạng báo ngay. */
  function callWithFallback(apiKey, model, prompt, onSwitch, opts) {
    var tried = [model];
    function attempt(m) {
      return callGemini(apiKey, m, prompt, opts).then(function (text) { return { text: text, model: m }; }, function (e) {
        if (e.kind === 'key' || e.kind === 'network') throw e;
        var next = FALLBACKS.filter(function (f) { return tried.indexOf(f) < 0; })[0];
        if (!next) throw e;
        tried.push(next); if (onSwitch) onSwitch(next, e.message);
        return attempt(next);
      });
    }
    return attempt(model);
  }

  /* ---------- Prompt ---------- */
  function buildPrompt(spec, input) {
    var base = typeof spec.prompt === 'function' ? spec.prompt(input) : String(spec.prompt || '');
    var shape = spec.schema ? '\n\nChỉ trả về đúng một khối JSON hợp lệ theo mẫu sau, không giải thích, không markdown:\n' + describe(spec.schema) : '\n\nChỉ trả về một khối JSON, không giải thích, không markdown.';
    return base + shape + '\nChỉ dùng thông tin đã cho, KHÔNG bịa số liệu, tên người hay sự kiện.';
  }
  function parseAndCheck(text, spec) {
    var res = validate(extractJson(text), spec.schema);
    if (!res.ok) { var e = new Error('Kết quả AI chưa đúng cấu trúc: ' + res.errors.join('; ')); e.kind = 'schema'; throw e; }
    return res;
  }

  /* ---------- Hộp thoại chế độ dán (copy-prompt) ---------- */
  function pasteDialog(prompt, spec) {
    return new Promise(function (resolve, reject) {
      var links = Object.keys(PLATFORMS).map(function (k) { return '<a class="btn btn-sm" target="_blank" rel="noopener" href="' + PLATFORMS[k][1] + '">Mở ' + PLATFORMS[k][0] + '</a>'; }).join('');
      var d = EP.ui.dialog({
        title: 'Dùng AI bên ngoài (copy - dán)', size: 'wide',
        body: '<ol class="stack" style="padding-left:20px"><li>Bấm <b>Sao chép prompt</b>, mở một trợ lý AI và dán vào.</li><li>Sao chép toàn bộ câu trả lời rồi dán vào ô bên dưới.</li></ol>' +
          '<div class="prompt-box" id="paste-prompt" tabindex="0" aria-label="Nội dung prompt">' + esc(prompt) + '</div>' +
          '<div class="row mt-3"><button type="button" class="btn btn-sm" id="paste-copy">' + EP.ui.icon('copy') + 'Sao chép prompt</button>' + links + '</div>' +
          '<div class="field mt-3"><textarea class="input" id="paste-in" rows="6" placeholder=" " name="paste"></textarea><label class="label" for="paste-in">Dán câu trả lời của AI vào đây</label><p class="field-msg" id="paste-msg" role="alert"></p></div>',
        actions: [{ label: 'Hủy', value: null }, { label: 'Dùng kết quả', variant: 'primary', id: 'paste-ok', onClick: function () {
          var msg = d.body.querySelector('#paste-msg'), wrap = msg.parentNode;
          try {
            var res = parseAndCheck(d.body.querySelector('#paste-in').value, spec);
            d.close(res);
          } catch (e) { wrap.setAttribute('data-invalid', ''); msg.textContent = e.message + ' Hãy sao chép lại đủ phần JSON.'; }
        } }]
      });
      d.body.querySelector('#paste-copy').addEventListener('click', function () { EP.ui.copy(prompt, 'Đã sao chép prompt'); });
      d.closed.then(function (v) { if (v && v.ok) resolve(v); else reject(fail('Bạn đã hủy.', 'cancel')); });
    });
  }

  /* ---------- Hàm chính ---------- */
  function mockRun(spec, input, warnings, instant) {
    if (typeof spec.mock !== 'function') return Promise.reject(fail('Tính năng này chưa có bản mô phỏng (spec.mock).', 'nomock'));
    return (instant ? Promise.resolve() : EP.sleep(450 + Math.random() * 350)).then(function () {
      var res = validate(spec.mock(input), spec.schema);
      return { data: res.value, mode: 'mock', model: 'mock', notice: MOCK_NOTICE, warnings: warnings.concat(res.warnings), prompt: buildPrompt(spec, input) };
    });
  }
  /** opts: { mode, input, key, model, instant (bỏ độ trễ giả), fallbackToMock (mặc định true), onSwitch(model, reason) } */
  function generate(spec, opts) {
    opts = opts || {};
    var mode = opts.mode || state.mode, input = opts.input !== undefined ? opts.input : spec.input, warnings = [];
    var prompt = buildPrompt(spec, input);
    if (mode === 'mock') return mockRun(spec, input, warnings, opts.instant);
    if (mode === 'paste') {
      return pasteDialog(prompt, spec).then(function (res) { return { data: res.value, mode: 'paste', model: 'paste', notice: '', warnings: res.warnings, prompt: prompt }; });
    }
    // gemini
    var key = opts.key || state.key, model = opts.model || state.model || DEFAULT_MODEL;
    function degrade(e) {
      if (e && e.kind === 'cancel') throw e;
      if (opts.fallbackToMock === false || typeof spec.mock !== 'function') throw e;
      return mockRun(spec, input, ['AI thật lỗi (' + (e && e.message || 'không rõ') + '), đã dùng dữ liệu mô phỏng.'], opts.instant);
    }
    if (!key && !proxyUrl()) return degrade(fail('Chưa có API key Gemini. Nhập key ở tab Cài đặt hoặc chuyển sang chế độ Mô phỏng.', 'key'));
    var gopts = { temperature: spec.temperature };
    function once(p) {
      return callWithFallback(key, model, p, opts.onSwitch, gopts).then(function (r) {
        var res = parseAndCheck(r.text, spec);
        return { data: res.value, mode: 'gemini', model: r.model, notice: '', warnings: res.warnings, prompt: prompt };
      });
    }
    return once(prompt).catch(function (e) {
      if (e.kind !== 'schema' && !/JSON|nội dung/i.test(e.message)) throw e;
      return once(prompt + '\n\nLần trước bạn trả về sai định dạng (' + e.message + '). Hãy trả lại ĐÚNG một khối JSON theo mẫu, đủ trường, không thêm chữ nào khác.');
    }).catch(degrade);
  }

  /** HTML ghi chú đặt cạnh kết quả: mock -> MOCK_NOTICE; gemini/paste -> nhắc kiểm tra lại */
  function noticeHtml(result) {
    if (!result) return '';
    var w = (result.warnings || []).length ? '<br><small>' + result.warnings.map(esc).join(' | ') + '</small>' : '';
    if (result.mode === 'mock') return '<p class="ai-notice" role="note" data-ai-notice="mock">' + EP.ui.icon('info') + '<span>' + esc(result.notice || MOCK_NOTICE) + w + '</span></p>';
    return '<p class="ai-notice live" role="note" data-ai-notice="' + esc(result.mode) + '">' + EP.ui.icon('sparkles') + '<span>Nội dung do AI tạo' + (result.mode === 'gemini' ? ' (' + esc(result.model) + ')' : '') + ', vui lòng kiểm tra lại trước khi dùng.' + w + '</span></p>';
  }

  /* ---------- UI: chọn chế độ & cài đặt ---------- */
  var MODE_OPTS = [{ value: 'mock', label: 'Mô phỏng' }, { value: 'gemini', label: 'Gemini' }, { value: 'paste', label: 'Copy - dán' }];
  function setMode(m) { state.mode = m; EP.store.write('ai_mode', m); EP.bus.emit('ai:mode', m); }
  /** Thanh chọn chế độ nhỏ (dùng trong feature). Tự đồng bộ với Cài đặt. */
  function mountModePicker(el) {
    var seg = EP.ui.segmented(el, { label: 'Chế độ AI', name: 'ai-mode-' + EP.uid(), options: MODE_OPTS, value: state.mode, onChange: setMode });
    EP.bus.on('ai:mode', function (m) { seg.set(m); });
    return seg;
  }
  function setKey(key, remember) {
    state.key = (key || '').trim(); state.remember = !!remember;
    EP.store.write('ai_remember', state.remember);
    if (state.remember && state.key) EP.store.write('ai_key', state.key); else EP.store.remove('ai_key');
  }
  /** Khối cài đặt AI đầy đủ: chế độ, model, key (+ nhớ), nút thử kết nối */
  function mountSettings(el) {
    el.innerHTML = '<div class="stack"><div data-slot="mode"></div>' +
      '<div class="form-grid two"><div class="field"><select class="input" id="ai-model">' + MODELS.map(function (m) { return '<option value="' + m.id + '"' + (m.id === state.model ? ' selected' : '') + '>' + esc(m.label) + '</option>'; }).join('') + '</select><label class="label" for="ai-model">Model Gemini</label><p class="field-msg" id="ai-model-note"></p></div>' +
      '<div class="field"><input class="input" id="ai-key" type="password" autocomplete="off" spellcheck="false" placeholder=" " value="' + esc(state.key) + '"><label class="label" for="ai-key">API key Gemini</label><p class="field-msg" id="ai-key-msg">Key chỉ nằm trong bộ nhớ trang, mất khi tải lại.</p></div></div>' +
      '<label class="check"><input type="checkbox" id="ai-remember"' + (state.remember ? ' checked' : '') + '><span>Nhớ key trên trình duyệt này (lưu localStorage, chỉ bật trên máy cá nhân)</span></label>' +
      '<div class="row"><button type="button" class="btn btn-sm" id="ai-test">' + EP.ui.icon('sparkles') + 'Thử kết nối</button><a class="btn btn-sm btn-ghost" target="_blank" rel="noopener" href="https://aistudio.google.com/apikey">Lấy key miễn phí</a></div></div>';
    var viaProxy = !!proxyUrl();
    if (viaProxy) {
      el.querySelector('#ai-key').closest('.field').remove(); el.querySelector('#ai-remember').closest('.check').remove();
      el.querySelector('.row').insertAdjacentHTML('beforebegin', '<p class="ai-notice live" role="note" data-ai-proxy="1">' + EP.ui.icon('sparkles') + '<span>Đang dùng máy chủ trung gian của đội — không cần nhập key.</span></p>');
      el.querySelector('.row .btn-ghost').remove();
    }
    mountModePicker(el.querySelector('[data-slot="mode"]'));
    var model = el.querySelector('#ai-model'), key = el.querySelector('#ai-key') || { value: '' }, rem = el.querySelector('#ai-remember') || { checked: false }, note = el.querySelector('#ai-model-note');
    function noteUpd() { var i = modelInfo(model.value); note.textContent = i ? i.note : ''; }
    noteUpd();
    model.addEventListener('change', function () { state.model = model.value; EP.store.write('ai_model', state.model); noteUpd(); });
    function saveKey() { setKey(key.value, rem.checked); }
    if (!viaProxy) key.addEventListener('input', saveKey);
    if (!viaProxy) rem.addEventListener('change', function () { saveKey(); EP.ui.toast(rem.checked ? 'Đã lưu key trên trình duyệt này.' : 'Đã xóa key khỏi trình duyệt.', { type: 'info' }); });
    el.querySelector('#ai-test').addEventListener('click', function (e) {
      var b = e.currentTarget; if (!viaProxy) saveKey();
      if (!viaProxy && !state.key) { EP.ui.toast('Hãy nhập API key trước.', { type: 'warn' }); key.focus(); return; }
      EP.ui.busy(b, true);
      callWithFallback(state.key, state.model, 'Trả về JSON {"ok": true}', null, { temperature: 0 }).then(function (r) { EP.ui.toast('Kết nối tốt (' + r.model + ').', { type: 'success' }); },
        function (err) { EP.ui.toast(err.message, { type: 'error' }); }).then(function () { EP.ui.busy(b, false); });
    });
  }

  EP.ai = {
    MOCK_NOTICE: MOCK_NOTICE, MODELS: MODELS, DEFAULT_MODEL: DEFAULT_MODEL, FALLBACKS: FALLBACKS, PLATFORMS: PLATFORMS,
    state: state, getMode: function () { return state.mode; }, setMode: setMode, setKey: setKey,
    generate: generate, buildPrompt: buildPrompt, validate: validate, describe: describe, extractJson: extractJson,
    callGemini: callGemini, callWithFallback: callWithFallback, modelInfo: modelInfo,
    pasteDialog: pasteDialog, noticeHtml: noticeHtml, mountModePicker: mountModePicker, mountSettings: mountSettings
  };
})(window);
