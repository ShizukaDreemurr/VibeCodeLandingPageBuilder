/* version.js - phiên bản hiện ra ở chân trang. Chạy `node tools/bump-version.cjs` để tăng số và gắn ?v= cho file js/css. */
(function (root) {
  'use strict';
  root.EP = root.EP || {};
  root.EP.version = { version: '0.1.1', date: '2026-11-16' };
})(window);
