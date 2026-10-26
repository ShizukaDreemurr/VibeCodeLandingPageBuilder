/*
 * storage.js — mọi đọc/ghi dữ liệu đều đi qua file này.
 * Hiện dùng localStorage; muốn chuyển lên cloud (Firebase/Supabase) chỉ cần thay file này.
 */
(function (root) {
  var PREFIX = 'ep_';

  function read(key, fallback) {
    try {
      var raw = root.localStorage.getItem(PREFIX + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      root.localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      // Hết dung lượng hoặc trình duyệt chặn lưu trữ
      return false;
    }
  }

  function remove(key) {
    try { root.localStorage.removeItem(PREFIX + key); } catch (e) { /* bỏ qua */ }
  }

  function newId(prefix) {
    return (prefix || 'id') + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  // Báo cho các tab khác (và tab hiện tại) khi một khoá thay đổi
  function onChange(callback) {
    root.addEventListener('storage', function (e) {
      if (e.key && e.key.indexOf(PREFIX) === 0) callback(e.key.slice(PREFIX.length));
    });
  }

  root.EP = root.EP || {};
  root.EP.storage = { read: read, write: write, remove: remove, newId: newId, onChange: onChange };
})(typeof window !== 'undefined' ? window : globalThis);
