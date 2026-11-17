/* mock.js - công cụ viết bản MÔ PHỎNG AI tất định (cùng input -> cùng output) để chạy offline khi API lỗi/không có key.
     EP.mock.hash('chuỗi') -> số nguyên dương ổn định
     EP.mock.rng('hạt giống') -> hàm () => số [0,1) tất định
     EP.mock.pick(arr, seed) / EP.mock.pickN(arr, n, seed)
     EP.mock.keywords(text, n) -> n từ khoá dài/hay lặp (đã bỏ dấu câu)
     EP.mock.sentiment(text) -> { label: 'positive'|'neutral'|'negative', score: -1..1, hits: [...] }  (từ điển tiếng Việt cơ bản)
     EP.mock.classify(text, { nhãn: ['từ khoá', ...] }, fallbackLabel) -> { label, score, matched }
     EP.mock.template('Chào {name}', { name: 'An' })
   Nhớ: mọi kết quả mock phải hiển thị cùng EP.ai.MOCK_NOTICE (EP.ai.noticeHtml làm việc này). */
(function (root) {
  'use strict';
  var EP = root.EP;
  var POS = ['tốt', 'tuyệt', 'hài lòng', 'ngon', 'đẹp', 'nhanh', 'thích', 'yêu', 'chất lượng', 'ok', 'ổn', 'xuất sắc', 'rẻ', 'đáng tiền', 'nhiệt tình', 'chu đáo', 'recommend'];
  var NEG = ['tệ', 'dở', 'chậm', 'kém', 'thất vọng', 'lỗi', 'hỏng', 'đắt', 'bực', 'chán', 'không hài lòng', 'trễ', 'sai', 'thiếu', 'bẩn', 'lừa', 'thái độ'];

  function hash(s) { s = String(s == null ? '' : s); var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0); }
  function rng(seed) { var a = typeof seed === 'number' ? seed >>> 0 : hash(seed); return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function pick(arr, seed) { return arr[hash(seed) % arr.length]; }
  function pickN(arr, n, seed) { var r = rng(seed), a = arr.slice(), out = []; while (out.length < n && a.length) out.push(a.splice(Math.floor(r() * a.length), 1)[0]); return out; }
  var STOP = ['và', 'là', 'của', 'có', 'cho', 'các', 'một', 'những', 'được', 'trong', 'với', 'này', 'để', 'không', 'khi', 'đã', 'rất', 'cũng', 'như', 'nhưng', 'thì', 'mà', 'tôi', 'bạn'];
  function keywords(text, n) {
    var cnt = {}, order = [];
    String(text || '').toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).forEach(function (w) {
      if (w.length < 3 || STOP.indexOf(w) >= 0) return;
      if (!(w in cnt)) { cnt[w] = 0; order.push(w); } cnt[w]++;
    });
    return order.sort(function (a, b) { return cnt[b] - cnt[a] || b.length - a.length; }).slice(0, n || 3);
  }
  function sentiment(text) {
    var t = ' ' + String(text || '').toLowerCase() + ' ', hits = [], p = 0, n = 0;
    POS.forEach(function (w) { if (t.indexOf(w) >= 0 && !/không (hài lòng|ok)/.test(t)) { p++; hits.push('+' + w); } });
    NEG.forEach(function (w) { if (t.indexOf(w) >= 0) { n++; hits.push('-' + w); } });
    if (/không (tốt|ngon|đẹp|nhanh|ổn)/.test(t)) { n++; p = Math.max(0, p - 1); }
    var score = p + n ? (p - n) / (p + n) : 0;
    return { label: score > 0.15 ? 'positive' : score < -0.15 ? 'negative' : 'neutral', score: Math.round(score * 100) / 100, hits: hits };
  }
  function classify(text, map, fallback) {
    var norm = EP.text ? EP.text.normalize(text) : String(text).toLowerCase(), best = null, bestN = 0, matched = [];
    Object.keys(map).forEach(function (label) {
      var m = map[label].filter(function (k) { return norm.indexOf(EP.text ? EP.text.normalize(k) : k) >= 0; });
      if (m.length > bestN) { best = label; bestN = m.length; matched = m; }
    });
    return { label: best || fallback || 'khác', score: best ? Math.min(1, 0.5 + bestN * 0.25) : 0.3, matched: matched };
  }
  function template(s, vars) { return String(s).replace(/\{(\w+)\}/g, function (m, k) { return vars && vars[k] != null ? vars[k] : m; }); }

  EP.mock = { hash: hash, rng: rng, pick: pick, pickN: pickN, keywords: keywords, sentiment: sentiment, classify: classify, template: template };
})(window);
