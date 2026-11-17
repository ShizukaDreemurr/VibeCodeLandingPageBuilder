/* match.js - chuẩn hoá tiếng Việt (bỏ dấu), khớp từ khoá, FAQ matcher, tìm kiếm xếp hạng.
     EP.text.normalize('Giá bao nhiêu?') -> 'gia bao nhieu'     EP.text.tokens(text) -> mảng từ đã chuẩn hoá (bỏ stopword)
     EP.text.slug('Áo thun Nam') -> 'ao-thun-nam'
     EP.match.faq(entries, query, { threshold: 0.34 }) -> { entry, score, ranked[] } | null khi không đủ chắc
        entries = [{ id, q: 'Câu hỏi mẫu', keywords: ['giá', 'bao nhiêu'], a: 'Trả lời' }]
     EP.match.search(rows, query, ['name', 'note']) -> các dòng khớp, xếp theo điểm giảm dần */
(function (root) {
  'use strict';
  var EP = root.EP;
  var STOP = ['la', 'va', 'cua', 'co', 'cho', 'cac', 'mot', 'nhung', 'duoc', 'trong', 'voi', 'nay', 'de', 'khong', 'khi', 'da', 'rat', 'cung', 'nhu', 'thi', 'ma', 'toi', 'ban', 'minh', 'oi', 'a', 'ha', 'nhe', 'the', 'nao', 'gi'];
  function normalize(s) {
    return String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function tokens(s, keepStop) { return normalize(s).split(' ').filter(function (w) { return w && (keepStop || STOP.indexOf(w) < 0); }); }
  function slug(s) { return normalize(s).replace(/\s+/g, '-'); }

  /** Điểm khớp 0..1 giữa truy vấn và 1 mục: từ khoá khớp cụm (trọng số cao) + giao các token */
  function scoreEntry(qNorm, qTok, e) {
    var kws = (e.keywords || []).map(normalize), hit = 0, total = Math.max(1, kws.length);
    kws.forEach(function (k) { if (k && (' ' + qNorm + ' ').indexOf(' ' + k + ' ') >= 0) hit++; });
    var base = tokens((e.q || '') + ' ' + kws.join(' ')), set = {}; base.forEach(function (t) { set[t] = 1; });
    var inter = qTok.filter(function (t) { return set[t]; }).length;
    var tokScore = qTok.length ? inter / Math.max(qTok.length, Math.min(base.length, 6)) : 0;
    return Math.min(1, (hit / total) * 0.6 + (hit > 0 ? 0.25 : 0) + tokScore * 0.5);
  }
  EP.text = { normalize: normalize, tokens: tokens, slug: slug };
  EP.match = {
    faq: function (entries, query, opts) {
      var th = opts && opts.threshold != null ? opts.threshold : 0.34, qn = normalize(query), qt = tokens(query);
      if (!qn) return null;
      var ranked = entries.map(function (e) { return { entry: e, score: scoreEntry(qn, qt, e) }; }).sort(function (a, b) { return b.score - a.score; });
      return ranked[0] && ranked[0].score >= th ? { entry: ranked[0].entry, score: ranked[0].score, ranked: ranked } : null;
    },
    search: function (rows, query, keys) {
      var qt = tokens(query, true); if (!qt.length) return rows.slice();
      return rows.map(function (r) {
        var hay = normalize(keys.map(function (k) { return r[k]; }).join(' ')), s = 0, m = 0;
        qt.forEach(function (t) { if (hay.indexOf(t) >= 0) { m++; s += 1 + (hay.indexOf(' ' + t) >= 0 || hay.indexOf(t) === 0 ? .5 : 0); } });
        return { r: r, s: s, m: m };
      }).filter(function (x) { return x.m === qt.length; }).sort(function (a, b) { return b.s - a.s; }).map(function (x) { return x.r; });
    }
  };
})(window);
