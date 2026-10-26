/*
 * ai-service.js — AI thật (Gemini API) + soạn prompt để copy sang AI khác
 * + đọc và kiểm soát kết quả AI trả về.
 */
(function (root) {
  var GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent';
  var TIMEOUT_MS = 30000;

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
        '',
        'YÊU CẦU',
        '1. headline: lời mời ngắn gọn, tối đa 90 ký tự.',
        '2. description: lời mời 2–3 câu, trang trọng mà gần gũi, tối đa 350 ký tự.',
        '3. benefits: đúng 3 điểm nhấn của ngày vui khiến khách muốn tới dự, mỗi ý tối đa 110 ký tự.',
        '4. Chỉ dùng thông tin đã cho. KHÔNG bịa thêm ngày giờ, địa điểm hay tên người.',
        '',
        'Chỉ trả về đúng một khối JSON, không giải thích, không markdown:',
        '{"headline": "...", "description": "...", "benefits": ["...", "...", "..."]}'
      ].join('\n');
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
      '',
      'YÊU CẦU',
      '1. headline: tối đa 90 ký tự, nêu giá trị chính của sự kiện.',
      '2. description: 2–3 câu, tối đa 350 ký tự.',
      '3. benefits: đúng 3 lợi ích khi tham dự, mỗi ý tối đa 110 ký tự, theo thứ tự: giá trị cốt lõi, tính ứng dụng, giảm rủi ro/công sức.',
      '4. Chỉ dùng thông tin đã cho. KHÔNG bịa thêm ngày giờ, địa điểm, giá vé, số liệu hay tên người.',
      '',
      'Chỉ trả về đúng một khối JSON, không giải thích, không markdown:',
      '{"headline": "...", "description": "...", "benefits": ["...", "...", "..."]}'
    ].join('\n');
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
    var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = controller && setTimeout(function () { controller.abort(); }, TIMEOUT_MS);
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
      if (res.status === 400 || res.status === 401 || res.status === 403) throw new Error('API key không hợp lệ hoặc chưa được cấp quyền.');
      if (res.status === 404) throw new Error('Không tìm thấy model "' + model + '". Hãy chọn model khác.');
      if (res.status === 429) throw new Error('Đã vượt giới hạn lượt gọi miễn phí. Thử lại sau ít phút.');
      if (!res.ok) throw new Error('Dịch vụ AI đang lỗi (mã ' + res.status + ').');
      return res.json();
    }, function (err) {
      if (timer) clearTimeout(timer);
      throw new Error(err && err.name === 'AbortError' ? 'AI phản hồi quá lâu (quá 30 giây).' : 'Không kết nối được tới Gemini. Kiểm tra mạng.');
    }).then(function (data) {
      var parts = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts;
      if (!parts || !parts.length) throw new Error('AI không trả về nội dung (có thể bị bộ lọc an toàn chặn).');
      return parts.map(function (p) { return p.text || ''; }).join('');
    });
  }

  root.EP = root.EP || {};
  root.EP.ai = {
    PLATFORMS: PLATFORMS,
    buildPrompt: buildPrompt,
    extractJson: extractJson,
    parseAIResponse: parseAIResponse,
    callGemini: callGemini
  };
})(typeof window !== 'undefined' ? window : globalThis);
