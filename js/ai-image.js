/*
 * ai-image.js — tạo ảnh bằng Gemini API (EP.aiImage). Người dùng tự nhập key Google AI Studio (ep_gemini_key).
 * Hai kiểu API:
 *  - Gemini ảnh gốc ("Nano Banana"): POST /v1beta/models/{model}:generateContent, responseModalities TEXT+IMAGE, ảnh nằm ở parts[].inlineData.
 *  - Imagen: POST /v1beta/models/{model}:predict, instances[{prompt}], parameters{sampleCount, aspectRatio}, ảnh ở predictions[].bytesBase64Encoded.
 * Model tạo ảnh KHÔNG có gói miễn phí: key chưa bật billing sẽ nhận 429 "limit: 0".
 * Danh sách model (11/2026) lấy từ nguồn thứ cấp, xem docs/gemini-models.md; model nào đã gỡ (404) sẽ tự thử model kế tiếp.
 */
(function (root) {
  var BASE = 'https://generativelanguage.googleapis.com/v1beta/models/';
  var TIMEOUT_MS = 120000;
  var RATIOS = ['1:1', '3:4', '4:3', '9:16', '16:9'];

  // kind: 'native' (generateContent) | 'imagen' (predict). Thứ tự = thứ tự thử khi model trước đã bị gỡ.
  var MODELS = [
    { id: 'gemini-3.1-flash-image-preview', label: 'Nano Banana 2 (Gemini 3.1 Flash Image)', note: 'Nhanh, chất lượng tốt – khuyên dùng', kind: 'native' },
    { id: 'gemini-3-pro-image-preview', label: 'Nano Banana Pro (Gemini 3 Pro Image)', note: 'Đẹp nhất, chậm và đắt hơn', kind: 'native' },
    { id: 'gemini-2.5-flash-image', label: 'Nano Banana (Gemini 2.5 Flash Image)', note: 'Đời đầu, có thể đã ngừng hoạt động', kind: 'native' },
    { id: 'imagen-4.0-generate-001', label: 'Imagen 4', note: 'Ảnh thực tế, tối đa 4 ảnh/lần', kind: 'imagen' },
    { id: 'imagen-4.0-fast-generate-001', label: 'Imagen 4 Fast', note: 'Rẻ và nhanh hơn Imagen 4', kind: 'imagen' }
  ];

  function fail(msg, kind) { var e = new Error(msg); e.kind = kind; return e; }
  function info(id) { for (var i = 0; i < MODELS.length; i++) if (MODELS[i].id === id) return MODELS[i]; return null; }
  function kindOf(id) { var m = info(id); return m ? m.kind : (/^imagen/i.test(id) ? 'imagen' : 'native'); }
  function getKey() {
    var S = root.EP && root.EP.storage, k = S ? S.read('gemini_key', '') : '';
    if (!k) { var f = document.getElementById('f-apikey'); k = f ? f.value.trim() : ''; }
    return k || '';
  }

  function post(url, body, key, timeout) {
    var ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = ctl && setTimeout(function () { ctl.abort(); }, timeout || TIMEOUT_MS);
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify(body),
      signal: ctl ? ctl.signal : undefined
    }).then(function (res) {
      if (timer) clearTimeout(timer);
      if (res.ok) return res.json();
      return res.text().then(function (t) { throw httpError(res.status, t); });
    }, function (err) {
      if (timer) clearTimeout(timer);
      if (err && err.kind) throw err;
      throw err && err.name === 'AbortError'
        ? fail('Tạo ảnh quá lâu (quá ' + Math.round((timeout || TIMEOUT_MS) / 1000) + ' giây). Thử lại hoặc chọn model nhanh hơn.', 'timeout')
        : fail('Không kết nối được tới Gemini. Kiểm tra mạng.', 'network');
    });
  }

  function httpError(status, text) {
    var msg = '', st = '';
    try { var j = JSON.parse(text); msg = (j.error && j.error.message) || ''; st = (j.error && j.error.status) || ''; } catch (e) { msg = String(text || ''); }
    var low = (msg + ' ' + st).toLowerCase();
    if (status === 429) {
      if (/limit:\s*0|billing|free[_ ]tier|not available on the free/.test(low)) {
        return fail('Model tạo ảnh cần bật thanh toán (billing) cho API key – gói miễn phí không hỗ trợ.', 'billing');
      }
      return fail('Đã vượt giới hạn số lần gọi, thử lại sau ít phút.', 'rate');
    }
    if (status === 400 && /api key|api_key_invalid/.test(low)) return fail('API key không hợp lệ. Kiểm tra lại key trong Google AI Studio.', 'key');
    if (status === 401 || status === 403) return fail('API key không hợp lệ hoặc chưa được cấp quyền tạo ảnh.', 'key');
    if (status === 400 && /safety|blocked|policy|prohibited/.test(low)) return fail('Yêu cầu bị bộ lọc an toàn của Google chặn. Hãy sửa mô tả cho trung tính hơn (tránh người nổi tiếng, nội dung nhạy cảm).', 'safety');
    if (status === 400 && /imageconfig|aspect/.test(low)) return fail('Model không hỗ trợ tỉ lệ khung hình này.', 'aspect');
    if (status === 400) return fail('Yêu cầu không hợp lệ' + (msg ? ': ' + msg.slice(0, 160) : '') + '.', 'bad');
    if (status === 404) return fail('Model này không còn mở cho tài khoản của bạn.', 'model');
    if (status === 500 || status === 503) return fail('Máy chủ Google đang quá tải, thử lại sau.', 'server');
    return fail('Dịch vụ tạo ảnh đang lỗi (mã ' + status + ').', 'server');
  }

  function img(mime, b64) { return { mime: mime || 'image/png', base64: b64, dataUrl: 'data:' + (mime || 'image/png') + ';base64,' + b64 }; }

  function parseNative(data) {
    var out = [], text = '';
    var fb = data && data.promptFeedback;
    if (fb && fb.blockReason) throw fail('Yêu cầu bị bộ lọc an toàn của Google chặn (' + fb.blockReason + '). Hãy sửa mô tả cho trung tính hơn.', 'safety');
    var cands = (data && data.candidates) || [];
    cands.forEach(function (c) {
      ((c.content && c.content.parts) || []).forEach(function (p) {
        var d = p.inlineData || p.inline_data;
        if (d && d.data) out.push(img(d.mimeType || d.mime_type, d.data));
        else if (p.text && !p.thought) text += p.text;
      });
    });
    if (!out.length) {
      var fr = cands[0] && cands[0].finishReason;
      if (/SAFETY|PROHIBITED|BLOCK|RECITATION/.test(fr || '')) throw fail('Ảnh bị bộ lọc an toàn của Google chặn. Hãy sửa mô tả cho trung tính hơn.', 'safety');
      throw fail('Model không trả về ảnh' + (text ? ': ' + text.slice(0, 160) : '') + '. Thử mô tả cụ thể hơn.', 'empty');
    }
    return { images: out, text: text };
  }
  function parseImagen(data) {
    var out = [];
    ((data && data.predictions) || []).forEach(function (p) {
      var b = p.bytesBase64Encoded || (p.image && p.image.bytesBase64Encoded);
      if (b) out.push(img(p.mimeType || 'image/png', b));
    });
    if (!out.length) throw fail('Ảnh bị bộ lọc an toàn của Google chặn hoặc model không trả về ảnh. Hãy sửa mô tả cho trung tính hơn.', 'safety');
    return { images: out, text: '' };
  }

  function callNative(model, prompt, o) {
    var cfg = { responseModalities: ['TEXT', 'IMAGE'] };
    if (o.aspectRatio) cfg.imageConfig = { aspectRatio: o.aspectRatio };
    var url = BASE + encodeURIComponent(model) + ':generateContent';
    function once(config) { return post(url, { contents: [{ parts: [{ text: prompt }] }], generationConfig: config }, o.key, o.timeout).then(parseNative); }
    return once(cfg).catch(function (e) {
      if (e.kind === 'aspect' && cfg.imageConfig) return once({ responseModalities: cfg.responseModalities });
      throw e;
    });
  }
  // generateContent chỉ trả 1 ảnh/lần → gọi song song count lần
  function nativeMany(model, prompt, o) {
    var jobs = [];
    for (var i = 0; i < o.count; i++) jobs.push(callNative(model, prompt, o).then(function (r) { return r.images; }, function (e) { return e; }));
    return Promise.all(jobs).then(function (rs) {
      var imgs = [], err = null;
      rs.forEach(function (r) { if (r instanceof Error) err = err || r; else imgs = imgs.concat(r); });
      if (!imgs.length) throw err;
      return { images: imgs, partialError: err };
    });
  }
  function callImagen(model, prompt, o) {
    var params = { sampleCount: o.count };
    if (o.aspectRatio) params.aspectRatio = o.aspectRatio;
    return post(BASE + encodeURIComponent(model) + ':predict', { instances: [{ prompt: prompt }], parameters: params }, o.key, o.timeout).then(parseImagen);
  }

  // generate(prompt, {model, aspectRatio, count, key, timeout, fallback}) → Promise<{images:[{mime,base64,dataUrl}], model}>
  function generate(prompt, opts) {
    opts = opts || {};
    prompt = String(prompt || '').trim();
    if (!prompt) return Promise.reject(fail('Hãy nhập mô tả ảnh muốn tạo.', 'prompt'));
    var key = (opts.key || getKey()).trim();
    if (!key) return Promise.reject(fail('Chưa có Gemini API key. Lấy key tại aistudio.google.com/apikey (tạo ảnh cần bật billing).', 'nokey'));
    var count = Math.max(1, Math.min(4, parseInt(opts.count, 10) || 1));
    var ratio = RATIOS.indexOf(opts.aspectRatio) >= 0 ? opts.aspectRatio : '';
    var order = [opts.model || MODELS[0].id];
    if (opts.fallback !== false) MODELS.forEach(function (m) { if (order.indexOf(m.id) < 0) order.push(m.id); });
    var o = { key: key, count: count, aspectRatio: ratio, timeout: opts.timeout };
    var i = 0;
    function next() {
      var model = order[i++];
      var p = kindOf(model) === 'imagen'
        ? callImagen(model, prompt, o).then(function (r) { return { images: r.images }; })
        : nativeMany(model, prompt, o);
      return p.then(function (r) { r.model = model; return r; }, function (e) {
        if (e.kind === 'model' && i < order.length) return next(); // model đã gỡ → thử model kế tiếp
        throw e;
      });
    }
    return next();
  }

  root.EP = root.EP || {};
  root.EP.aiImage = { generate: generate, MODELS: MODELS, RATIOS: RATIOS, getKey: getKey, kindOf: kindOf, parseNative: parseNative, parseImagen: parseImagen };
})(window);
