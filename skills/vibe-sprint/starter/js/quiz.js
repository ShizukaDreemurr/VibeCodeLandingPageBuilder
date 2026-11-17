/* quiz.js - đố vui có đồng hồ từng câu, điểm theo đúng + tốc độ, bảng xếp hạng Top N (xử lý đồng hạng).
   Engine thuần (test được, không đụng DOM):
     var g = EP.quiz.create({ questions: [{ id, q, options: ['A','B','C'], answer: 1, explain? }], timePerQ: 30, basePoints: 100, speedBonus: 100 });
     g.current() -> câu hiện tại | null ; g.answer(optionIndex, elapsedMs) -> { correct, points, explain, answerIndex } ; g.timeout() ; g.next() ; g.finished ; g.result() -> { score, correct, total, totalMs }
     Điểm câu đúng = basePoints + round(speedBonus * (còn lại / timePerQ)); sai / hết giờ = 0.
   Bảng xếp hạng (localStorage):
     var lb = EP.quiz.leaderboard('quiz1', { limit: 10 }); lb.add({ name, score, correct, total, totalMs }); lb.top() -> [{ rank, ... }]  (điểm bằng nhau -> thời gian ít hơn hơn -> cùng hạng nếu bằng cả hai)
   Giao diện trọn gói:  EP.quiz.mount(el, { title, questions, timePerQ, boardName, intro }) */
(function (root) {
  'use strict';
  var EP = root.EP, esc = EP.esc;

  function create(o) {
    var qs = o.questions.slice(), tpq = (o.timePerQ || 30) * 1000, base = o.basePoints == null ? 100 : o.basePoints, bonus = o.speedBonus == null ? 100 : o.speedBonus;
    var g = { idx: 0, score: 0, correct: 0, totalMs: 0, finished: !qs.length, log: [], answered: false };
    g.current = function () { return g.finished ? null : qs[g.idx]; };
    g.total = qs.length;
    g.timeLimit = tpq;
    function settle(choice, elapsed) {
      var q = qs[g.idx]; if (!q || g.answered) return null;
      g.answered = true; elapsed = Math.max(0, Math.min(tpq, elapsed || 0)); g.totalMs += elapsed;
      var ok = choice === q.answer, pts = ok ? base + Math.round(bonus * (tpq - elapsed) / tpq) : 0;
      if (ok) g.correct++; g.score += pts;
      var res = { correct: ok, points: pts, explain: q.explain || '', answerIndex: q.answer, choice: choice, timedOut: choice == null };
      g.log.push(res); return res;
    }
    g.answer = function (i, elapsedMs) { return settle(i, elapsedMs); };
    g.timeout = function () { return settle(null, tpq); };
    g.next = function () { g.idx++; g.answered = false; if (g.idx >= qs.length) g.finished = true; return g.current(); };
    g.result = function () { return { score: g.score, correct: g.correct, total: qs.length, totalMs: g.totalMs }; };
    return g;
  }

  function leaderboard(name, o) {
    var col = EP.collection('lb_' + name, { limit: 200 }), limit = (o && o.limit) || 10;
    function sorted() {
      return col.list().slice().sort(function (a, b) { return b.score - a.score || a.totalMs - b.totalMs || a.createdAt - b.createdAt; });
    }
    return {
      add: function (r) { return col.add({ name: String(r.name || 'Ẩn danh').slice(0, 30), score: r.score, correct: r.correct, total: r.total, totalMs: r.totalMs }); },
      top: function (n) {
        var rows = sorted(), out = [], prev = null, rank = 0;
        rows.forEach(function (r, i) { if (!prev || r.score !== prev.score || r.totalMs !== prev.totalMs) rank = i + 1; prev = r; out.push(Object.assign({ rank: rank }, r)); });
        return out.slice(0, n || limit);
      },
      clear: col.clear, onChange: col.onChange
    };
  }

  function mount(el, o) {
    var lb = leaderboard(o.boardName || 'quiz', { limit: 10 }), g, timer, deadline, player = '';
    function fmtTime(ms) { return (ms / 1000).toFixed(1) + 's'; }
    function board() {
      var rows = lb.top();
      return '<div class="card"><div class="card-head"><h2 class="section-title">Bảng xếp hạng Top 10</h2></div>' + (rows.length ?
        '<div class="table-wrap"><table class="table" data-quiz-board><thead><tr><th scope="col"><span class="th-in">Hạng</span></th><th scope="col"><span class="th-in">Tên</span></th><th scope="col" class="num"><span class="th-in">Điểm</span></th><th scope="col" class="num"><span class="th-in">Đúng</span></th><th scope="col" class="num"><span class="th-in">Thời gian</span></th></tr></thead><tbody>' +
        rows.map(function (r) { return '<tr><td>' + r.rank + '</td><td>' + esc(r.name) + '</td><td class="num"><b>' + r.score + '</b></td><td class="num">' + r.correct + '/' + r.total + '</td><td class="num">' + fmtTime(r.totalMs) + '</td></tr>'; }).join('') + '</tbody></table></div>'
        : EP.ui.empty({ icon: 'quiz', title: 'Chưa có ai chơi', text: 'Hãy là người đầu tiên!' })) + '</div>';
    }
    var START_SCHEMA = { name: { label: 'Tên của bạn', type: 'text', rules: { required: true, maxLength: 30 } } };
    function start() {
      clearInterval(timer);
      el.innerHTML = '<div class="grid cols-2"><div class="card"><div class="card-head"><h2 class="section-title">' + esc(o.title || 'Đố vui') + '</h2></div>' +
        '<p class="muted">' + esc(o.intro || (o.questions.length + ' câu hỏi, mỗi câu ' + (o.timePerQ || 30) + ' giây. Trả lời càng nhanh điểm càng cao.')) + '</p>' +
        '<form class="form mt-3" novalidate data-quiz-start>' + EP.form.render(START_SCHEMA, { name: player }, { grid: false }) + '<div class="row"><button class="btn btn-primary" type="submit">Bắt đầu chơi</button></div></form></div>' + board() + '</div>';
      EP.form.bind(el.querySelector('[data-quiz-start]'), START_SCHEMA, { onSubmit: function (v) { player = v.name; g = create(o); question(); } });
    }
    function question() {
      var q = g.current();
      if (!q) return finish();
      el.innerHTML = '<div class="card" style="max-width:720px;margin-inline:auto"><div class="row between"><span class="badge accent">Câu ' + (g.idx + 1) + '/' + g.total + '</span><span class="badge" aria-hidden="true">Điểm: ' + g.score + '</span><b data-quiz-clock aria-label="Thời gian còn lại"></b></div>' +
        '<div class="meter mt-3" aria-hidden="true"><i data-quiz-bar style="width:100%;transition:none"></i></div>' +
        '<h2 class="section-title mt-3" style="font-size:20px" id="quiz-q">' + esc(q.q) + '</h2>' +
        '<div class="stack mt-3" role="group" aria-labelledby="quiz-q">' + q.options.map(function (op, i) { return '<button type="button" class="btn" style="width:100%;justify-content:flex-start;white-space:normal;text-align:left;min-height:48px" data-opt="' + i + '">' + String.fromCharCode(65 + i) + '. ' + esc(op) + '</button>'; }).join('') + '</div>' +
        '<div data-quiz-fb class="mt-3" aria-live="assertive"></div></div>';
      deadline = Date.now() + g.timeLimit;
      var clock = el.querySelector('[data-quiz-clock]'), bar = el.querySelector('[data-quiz-bar]');
      function tick() {
        var left = Math.max(0, deadline - Date.now());
        clock.textContent = Math.ceil(left / 1000) + 's'; bar.style.width = (left / g.timeLimit * 100) + '%';
        if (left <= 0) { clearInterval(timer); reveal(g.timeout()); }
      }
      clearInterval(timer); timer = setInterval(tick, 100); tick();
      el.querySelectorAll('[data-opt]').forEach(function (b) {
        b.addEventListener('click', function () { if (g.answered) return; clearInterval(timer); reveal(g.answer(+b.getAttribute('data-opt'), g.timeLimit - (deadline - Date.now()))); });
      });
    }
    function reveal(res) {
      if (!res) return;
      el.querySelectorAll('[data-opt]').forEach(function (b) {
        var i = +b.getAttribute('data-opt'); b.disabled = true;
        if (i === res.answerIndex) { b.style.borderColor = 'var(--success)'; b.style.background = 'var(--pill-positive-bg)'; b.style.color = 'var(--pill-positive-ink)'; }
        else if (i === res.choice) { b.style.borderColor = 'var(--danger)'; b.style.background = 'var(--pill-negative-bg)'; b.style.color = 'var(--pill-negative-ink)'; }
      });
      var last = g.idx + 1 >= g.total;
      el.querySelector('[data-quiz-fb]').innerHTML = '<p><b>' + (res.timedOut ? 'Hết giờ!' : res.correct ? 'Chính xác! +' + res.points + ' điểm' : 'Chưa đúng.') + '</b> ' + esc(res.explain) + '</p>' +
        '<div class="row mt-2"><button type="button" class="btn btn-primary" data-quiz-next>' + (last ? 'Xem kết quả' : 'Câu tiếp theo') + '</button></div>';
      var nb = el.querySelector('[data-quiz-next]'); nb.focus();
      nb.addEventListener('click', function () { g.next(); question(); });
    }
    function finish() {
      var r = g.result(); lb.add({ name: player, score: r.score, correct: r.correct, total: r.total, totalMs: r.totalMs });
      el.innerHTML = '<div class="grid cols-2"><div class="card center"><p class="muted">Kết quả của ' + esc(player) + '</p><div class="score-big mt-2" data-quiz-score>' + r.score + '</div><p class="muted">điểm · đúng ' + r.correct + '/' + r.total + ' câu · ' + fmtTime(r.totalMs) + '</p>' +
        '<div class="row mt-3" style="justify-content:center"><button type="button" class="btn btn-primary" data-quiz-again>Chơi lại</button></div></div>' + board() + '</div>';
      el.querySelector('[data-quiz-again]').addEventListener('click', start);
    }
    start();
    return { restart: start, leaderboard: lb };
  }
  EP.quiz = { create: create, leaderboard: leaderboard, mount: mount };
})(window);
