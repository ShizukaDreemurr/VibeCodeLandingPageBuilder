/* checklist.js - checklist có trọng số -> điểm /100, xếp loại, danh sách đạt / chưa đạt (kiểu "kiểm tra SEO", "đánh giá hồ sơ").
     var items = [{ id: 'title', label: 'Có thẻ <title> 10-60 ký tự', weight: 20, hint: 'Cách sửa...' }, ...]
     EP.checklist.score(items, { title: true, h1: false }) -> { score, max, passed[], failed[], grade: { label, tone } }
       (answers[id] có thể là true/false hoặc số 0..1 cho đạt một phần)
     EP.checklist.mount(el, { title, items, onChange(result) })  -> tích chọn trực tiếp, thanh điểm tự cập nhật */
(function (root) {
  'use strict';
  var EP = root.EP, esc = EP.esc;
  function grade(score) {
    return score >= 85 ? { label: 'Rất tốt', tone: 'positive' } : score >= 65 ? { label: 'Khá', tone: 'accent' } : score >= 40 ? { label: 'Cần cải thiện', tone: 'warning' } : { label: 'Yếu', tone: 'negative' };
  }
  function score(items, answers) {
    answers = answers || {};
    var total = items.reduce(function (s, i) { return s + (i.weight == null ? 1 : i.weight); }, 0) || 1, got = 0, passed = [], failed = [];
    items.forEach(function (i) {
      var w = i.weight == null ? 1 : i.weight, a = answers[i.id], f = a === true ? 1 : a === false || a == null ? 0 : Math.max(0, Math.min(1, Number(a) || 0));
      got += w * f; (f >= 1 ? passed : failed).push(i);
    });
    var s = Math.round(got / total * 100);
    return { score: s, max: 100, passed: passed, failed: failed, grade: grade(s) };
  }
  function mount(el, o) {
    var ans = {};
    el.innerHTML = '<div class="grid cols-2"><div class="card"><div class="card-head"><h2 class="section-title">' + esc(o.title || 'Danh sách kiểm tra') + '</h2></div><div class="stack">' +
      o.items.map(function (i) { return '<label class="check"><input type="checkbox" data-id="' + esc(i.id) + '"><span>' + esc(i.label) + (i.weight ? ' <span class="muted">(' + i.weight + ' điểm)</span>' : '') + '</span></label>'; }).join('') +
      '</div></div><div class="card" data-cl-out aria-live="polite"></div></div>';
    var out = el.querySelector('[data-cl-out]');
    function draw() {
      var r = score(o.items, ans);
      out.innerHTML = '<div class="card-head"><h2 class="section-title">Điểm</h2>' + EP.ui.badge(r.grade.label, r.grade.tone) + '</div><div class="score-big">' + r.score + '<span class="muted" style="font-size:20px">/100</span></div>' +
        '<div class="meter mt-3" role="progressbar" aria-valuenow="' + r.score + '" aria-valuemin="0" aria-valuemax="100" aria-label="Điểm"><i style="width:' + r.score + '%"></i></div>' +
        (r.failed.length ? '<h3 class="section-title mt-3">Chưa đạt</h3><ul class="list-plain mt-2">' + r.failed.map(function (i) { return '<li class="no">' + EP.ui.icon('x') + '<span style="color:var(--text)">' + esc(i.label) + (i.hint ? '<br><small class="muted">' + esc(i.hint) + '</small>' : '') + '</span></li>'; }).join('') + '</ul>' : '<p class="mt-3">' + EP.ui.icon('check') + ' Đã đạt tất cả tiêu chí.</p>');
      if (o.onChange) o.onChange(r);
    }
    el.addEventListener('change', function (e) { var id = e.target.getAttribute && e.target.getAttribute('data-id'); if (id) { ans[id] = e.target.checked; draw(); } });
    draw();
    return { answers: function () { return Object.assign({}, ans); }, result: function () { return score(o.items, ans); } };
  }
  EP.checklist = { score: score, grade: grade, mount: mount };
})(window);
