/*
 * ai-service.js — AI thật (Gemini API) + soạn prompt để copy sang AI khác
 * + đọc và kiểm soát kết quả AI trả về.
 */
(function (root) {
  var GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent';
  var TIMEOUT_MS = 60000;
  // Danh sách model Gemini (AI Studio, 10/2026). tier: free = dùng được với key miễn phí,
  // slow = miễn phí nhưng nghĩ lâu (1–2 phút), paid = cần bật thanh toán trên Google Cloud.
  // Đã thử thật bằng key miễn phí ngày 27/10/2026.
  var MODELS = [
    { id: 'gemini-3.5-flash-lite', label: 'Gemini 3.5 Flash Lite', note: 'Nhanh (~2 giây), miễn phí – khuyên dùng', tier: 'free' },
    { id: 'gemini-flash-lite-latest', label: 'Gemini Flash-Lite mới nhất', note: 'Luôn trỏ tới bản Flash-Lite mới nhất', tier: 'free' },
    { id: 'gemini-3.1-flash-lite', label: 'Gemini 3.1 Flash Lite', note: 'Nhanh, tiết kiệm nhất', tier: 'free' },
    { id: 'gemini-3-flash-preview', label: 'Gemini 3 Flash (preview)', note: 'Bản Flash đời trước', tier: 'free' },
    { id: 'gemini-3.6-flash', label: 'Gemini 3.6 Flash', note: 'Viết kỹ hơn, ~10 giây', tier: 'free' },
    { id: 'gemini-3.8-flash', label: 'Gemini 3.8 Flash', note: 'Thông minh nhất dòng Flash, nhưng có thể mất 1–2 phút', tier: 'slow' },
    { id: 'gemini-flash-latest', label: 'Gemini Flash mới nhất', note: 'Đang trỏ tới 3.8 Flash, có thể mất 1–2 phút', tier: 'slow' },
    { id: 'gemini-4-argon', label: 'Gemini 4 Argon', note: 'Mạnh nhất – cần bật thanh toán', tier: 'paid' },
    { id: 'gemini-3.1-pro-preview', label: 'Gemini 3.1 Pro (preview)', note: 'Cần bật thanh toán', tier: 'paid' },
    { id: 'gemini-pro-latest', label: 'Gemini Pro mới nhất', note: 'Cần bật thanh toán', tier: 'paid' }
  ];
  var DEFAULT_MODEL = 'gemini-3.5-flash-lite';
  // Khi model đã chọn lỗi (hết lượt, cần trả phí, quá lâu…) thì tự thử các model nhanh này
  var FALLBACKS = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-flash-lite-latest'];
  function modelInfo(id) { return MODELS.filter(function (m) { return m.id === id; })[0] || null; }

  var PLATFORMS = {
    claude: { label: 'Claude', url: 'https://claude.ai/new' },
    chatgpt: { label: 'ChatGPT', url: 'https://chatgpt.com/' },
    gemini: { label: 'Gemini', url: 'https://gemini.google.com/app' },
    manus: { label: 'Manus', url: 'https://manus.im/' }
  };

  var TONE_TEXT = {
    formal: 'trang trọng, chuyên nghiệp',
    young: 'trẻ trung, năng động',
    urgent: 'gấp rút, thúc giục đăng ký (không phóng đại, không bịa số liệu)'
  };

  function formatDate(iso) {
    var d = new Date(iso);
    return isNaN(d) ? '' : d.toLocaleString('vi-VN', { dateStyle: 'full', timeStyle: 'short' });
  }

  // Prompt dùng chung cho Gemini API và cho nút "Copy prompt"
  // Brand DNA → thêm khối THƯƠNG HIỆU vào prompt (tên, khẩu hiệu, khách hàng mục tiêu, từ nên dùng/tránh)
  function brandBlock(ev) {
    var b = ev.brand;
    if (!b || !b.name) return [];
    var out = ['', 'THƯƠNG HIỆU TỔ CHỨC', 'Tên: ' + b.name];
    if (b.tagline) out.push('Khẩu hiệu: ' + b.tagline);
    if (b.audience) out.push('Khách hàng mục tiêu: ' + b.audience);
    if (b.voiceUse) out.push('Nên dùng các từ/cách nói: ' + b.voiceUse);
    if (b.voiceAvoid) out.push('TRÁNH các từ/cách nói: ' + b.voiceAvoid);
    out.push('Giữ đúng giọng của thương hiệu này trong mọi câu.');
    return out;
  }

  function buildPrompt(ev, tone) {
    var speakers = (ev.speakers || []).map(function (s) {
      return '- ' + s.name + (s.title ? ' (' + s.title + ')' : '');
    }).join('\n');
    if (ev.templateId === 'wedding') {
      return [
        'Bạn là người viết lời mời cưới tinh tế, ấm áp bằng tiếng Việt.',
        'Viết nội dung cho thiệp cưới online dưới đây.',
        '',
        'THÔNG TIN',
        'Tên sự kiện: ' + ev.name,
        'Thời gian: ' + formatDate(ev.startAt),
        'Địa điểm: ' + ev.location,
        'Cô dâu, chú rể:\n' + (speakers || '- (chưa có)'),
        'Lời nhắn của gia đình: ' + (ev.earlyBird || 'không có'),
      ].concat(brandBlock(ev), [
        '',
        'YÊU CẦU',
        '1. headline: lời mời ngắn gọn, tối đa 90 ký tự.',
        '2. description: lời mời 2–3 câu, trang trọng mà gần gũi, tối đa 350 ký tự.',
        '3. benefits: đúng 3 điểm nhấn của ngày vui khiến khách muốn tới dự, mỗi ý tối đa 110 ký tự.',
        '4. Chỉ dùng thông tin đã cho. KHÔNG bịa thêm ngày giờ, địa điểm hay tên người.',
        '',
        'Chỉ trả về đúng một khối JSON, không giải thích, không markdown:',
        '{"headline": "...", "description": "...", "benefits": ["...", "...", "..."]}'
      ]).join('\n');
    }
    return [
      'Bạn là copywriter marketing sự kiện tại Việt Nam.',
      'Viết nội dung cho landing page sự kiện dưới đây, giọng văn ' + (TONE_TEXT[tone] || TONE_TEXT.formal) + '.',
      '',
      'THÔNG TIN SỰ KIỆN',
      'Tên: ' + ev.name,
      'Thời gian: ' + formatDate(ev.startAt),
      'Địa điểm: ' + ev.location,
      'Diễn giả:\n' + (speakers || '- (chưa có)'),
      'Ưu đãi đăng ký sớm: ' + (ev.earlyBird || 'không có'),
    ].concat(brandBlock(ev), [
      '',
      'YÊU CẦU',
      '1. headline: tối đa 90 ký tự, nêu giá trị chính của sự kiện.',
      '2. description: 2–3 câu, tối đa 350 ký tự.',
      '3. benefits: đúng 3 lợi ích khi tham dự, mỗi ý tối đa 110 ký tự, theo thứ tự: giá trị cốt lõi, tính ứng dụng, giảm rủi ro/công sức.',
      '4. Chỉ dùng thông tin đã cho. KHÔNG bịa thêm ngày giờ, địa điểm, giá vé, số liệu hay tên người.',
      '',
      'Chỉ trả về đúng một khối JSON, không giải thích, không markdown:',
      '{"headline": "...", "description": "...", "benefits": ["...", "...", "..."]}'
    ]).join('\n');
  }

  // Lấy JSON ra khỏi câu trả lời của AI: bỏ ```json, lời dẫn, nháy cong, dấu phẩy thừa
  function extractJson(text) {
    if (!text) throw new Error('AI không trả về nội dung.');
    var s = String(text).replace(/```(?:json)?/gi, '');
    var start = s.indexOf('{');
    var end = s.lastIndexOf('}');
    if (start === -1 || end <= start) throw new Error('Không tìm thấy khối JSON trong kết quả.');
    s = s.slice(start, end + 1)
      .replace(/[“”]/g, '"')
      .replace(/,\s*([}\]])/g, '$1');
    try {
      return JSON.parse(s);
    } catch (e) {
      throw new Error('JSON bị lỗi cú pháp: ' + e.message);
    }
  }

  function trimTo(text, max) {
    text = String(text || '').trim();
    return text.length > max ? text.slice(0, max - 1).trim() + '…' : text;
  }

  // Kiểm soát đầu ra: đủ trường, đúng độ dài, thiếu thì bù bằng bản offline
  function normalizeContent(raw, ev, tone) {
    var fallback = root.EP.contentGenerator.generate(ev, tone);
    var warnings = [];
    var obj = raw || {};
    var headline = obj.headline || obj.title || obj.tieu_de;
    var description = obj.description || obj.desc || obj.mo_ta;
    var benefits = obj.benefits || obj.loi_ich || [];

    if (!headline) { warnings.push('Thiếu headline, đã dùng bản mô phỏng.'); headline = fallback.headline; }
    if (!description) { warnings.push('Thiếu mô tả, đã dùng bản mô phỏng.'); description = fallback.description; }
    if (!Array.isArray(benefits)) benefits = [benefits];
    benefits = benefits.filter(Boolean).map(String);
    if (benefits.length > 3) { warnings.push('AI trả về ' + benefits.length + ' lợi ích, chỉ giữ 3 ý đầu.'); }
    while (benefits.length < 3) {
      warnings.push('Thiếu lợi ích số ' + (benefits.length + 1) + ', đã bù bằng bản mô phỏng.');
      benefits.push(fallback.benefits[benefits.length]);
    }
    return {
      content: {
        headline: trimTo(headline, 120),
        description: trimTo(description, 400),
        benefits: benefits.slice(0, 3).map(function (b) { return trimTo(b, 140); }),
        source: 'ai'
      },
      warnings: warnings
    };
  }

  function parseAIResponse(text, ev, tone) {
    return normalizeContent(extractJson(text), ev, tone);
  }

  // Gọi Gemini thật. Lỗi được dịch sang thông báo dễ hiểu, không lộ khoá API.
  function callGemini(apiKey, model, prompt) {
    var info = modelInfo(model);
    var limit = info && info.tier === 'slow' ? 180000 : TIMEOUT_MS;
    var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = controller && setTimeout(function () { controller.abort(); }, limit);
    return fetch(GEMINI_URL.replace('{model}', encodeURIComponent(model)), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, responseMimeType: 'application/json' }
      }),
      signal: controller ? controller.signal : undefined
    }).then(function (res) {
      if (timer) clearTimeout(timer);
      if (res.status === 400 || res.status === 401 || res.status === 403) throw fail('API key không hợp lệ hoặc chưa được cấp quyền.', 'key');
      if (res.status === 404) throw fail('Model "' + model + '" không còn mở cho tài khoản này.', 'model');
      if (res.status === 429) {
        throw fail(info && info.tier === 'paid'
          ? 'Model "' + model + '" cần bật thanh toán trên Google AI Studio.'
          : 'Model "' + model + '" đã hết lượt miễn phí, thử lại sau ít phút.', 'quota');
      }
      if (res.status === 503 || res.status === 500) throw fail('Model "' + model + '" của Google đang quá tải.', 'server');
      if (!res.ok) throw fail('Dịch vụ AI đang lỗi (mã ' + res.status + ').', 'server');
      return res.json();
    }, function (err) {
      if (timer) clearTimeout(timer);
      if (err && err.kind) throw err;
      throw err && err.name === 'AbortError'
        ? fail('Model "' + model + '" phản hồi quá lâu (quá ' + Math.round(limit / 1000) + ' giây).', 'timeout')
        : fail('Không kết nối được tới Gemini. Kiểm tra mạng.', 'network');
    }).then(function (data) {
      var parts = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts;
      if (!parts || !parts.length) throw new Error('AI không trả về nội dung (có thể bị bộ lọc an toàn chặn).');
      return parts.filter(function (p) { return !p.thought; }).map(function (p) { return p.text || ''; }).join('');
    });
  }
  function fail(msg, kind) { var e = new Error(msg); e.kind = kind; return e; }

  // Gọi model đã chọn; lỗi do model (hết lượt, cần trả phí, quá lâu, máy chủ lỗi) thì tự chuyển model nhanh.
  // Lỗi key / mất mạng thì báo luôn. onSwitch(model, lý do) để app báo cho người dùng.
  function generate(apiKey, model, prompt, onSwitch) {
    var tried = [model];
    function attempt(m) {
      return callGemini(apiKey, m, prompt).then(function (text) { return { text: text, model: m }; }, function (e) {
        if (e.kind === 'key' || e.kind === 'network') throw e;
        var next = FALLBACKS.filter(function (f) { return tried.indexOf(f) < 0; })[0];
        if (!next) throw e;
        tried.push(next);
        if (onSwitch) onSwitch(next, e.message);
        return attempt(next);
      });
    }
    return attempt(model);
  }

  root.EP = root.EP || {};
  root.EP.ai = {
    PLATFORMS: PLATFORMS,
    buildPrompt: buildPrompt,
    extractJson: extractJson,
    parseAIResponse: parseAIResponse,
    callGemini: callGemini,
    generate: generate,
    MODELS: MODELS,
    DEFAULT_MODEL: DEFAULT_MODEL,
    modelInfo: modelInfo
  };
})(typeof window !== 'undefined' ? window : globalThis);
