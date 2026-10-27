/*
 * version.js — phiên bản app, hiện ở chân trang để dễ theo dõi bản đang chạy.
 * Mỗi lần phát hành: tăng VERSION, sửa DATE và NOTES. Mã commit được lấy tự động từ GitHub (nếu có mạng).
 */
(function (root) {
  var INFO = {
    version: '1.9.0',
    date: '2026-10-27',
    notes: 'Trình chỉnh ảnh: cắt, xoay tuỳ ý, thu phóng, sáng/tương phản/bão hoà, lật; thanh trượt + nhập số',
    repo: 'ShizukaDreemurr/VibeCodeLandingPageBuilder',
    branch: 'claude/serene-ramanujan-7wxqwr' // nhánh GitHub Pages đang xuất bản
  };
  function fmtDate(iso) {
    var d = new Date(iso);
    return isNaN(d) ? iso : d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
  function fmtTime(iso) {
    var d = new Date(iso);
    return isNaN(d) ? '' : d.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  }
  // Commit mới nhất của nhánh đang xuất bản (lưu tạm 10 phút để không gọi GitHub liên tục)
  function latestCommit() {
    var KEY = 'ep_build_commit';
    try {
      var c = JSON.parse(sessionStorage.getItem(KEY) || 'null');
      if (c && Date.now() - c.at < 600000) return Promise.resolve(c);
    } catch (e) { /* bỏ qua */ }
    if (!root.fetch) return Promise.reject(new Error('no fetch'));
    return fetch('https://api.github.com/repos/' + INFO.repo + '/commits/' + INFO.branch, { headers: { Accept: 'application/vnd.github+json' } })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (d) {
        var c = { sha: String(d.sha || '').slice(0, 7), date: d.commit && d.commit.committer && d.commit.committer.date, url: d.html_url, at: Date.now() };
        try { sessionStorage.setItem(KEY, JSON.stringify(c)); } catch (e) { /* bỏ qua */ }
        return c;
      });
  }
  function mount(el) {
    if (!el) return;
    el.querySelector('[data-v="version"]').textContent = 'v' + INFO.version;
    el.querySelector('[data-v="date"]').textContent = fmtDate(INFO.date);
    el.querySelector('[data-v="version"]').title = INFO.notes;
    var src = el.querySelector('[data-v="source"]');
    src.href = 'https://github.com/' + INFO.repo;
    // Chạy trên máy (localhost / file) thì không hỏi GitHub
    if (!/github\.io$/.test(root.location.hostname)) return;
    latestCommit().then(function (c) {
      if (!c.sha) return;
      var a = el.querySelector('[data-v="commit"]');
      a.textContent = 'commit ' + c.sha + (c.date ? ' · ' + fmtTime(c.date) : '');
      a.href = c.url || src.href;
      a.hidden = false;
      a.previousElementSibling.hidden = false;
    }).catch(function () { /* không có mạng hoặc hết lượt GitHub: chỉ hiện số phiên bản */ });
  }
  root.EP = root.EP || {};
  root.EP.version = { info: INFO, mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
