/*
 * sheet-sync.js — gửi đăng ký lên Google Sheet (qua Apps Script) và lấy số đăng ký chung.
 * localStorage vẫn là nơi lưu chính; Sheet là bản đồng bộ để xem trên mọi thiết bị và làm báo cáo.
 */
(function (root) {
  var TIMEOUT_MS = 10000;
  var APPS_SCRIPT_URL = /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/;
  var LOCAL_TEST_URL = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/\S*$/; // chỉ để chạy thử

  function isValidUrl(url) {
    return APPS_SCRIPT_URL.test(url) || LOCAL_TEST_URL.test(url);
  }

  function withTimeout(promise) {
    return new Promise(function (resolve, reject) {
      var t = setTimeout(function () { reject(new Error('Google Sheet phản hồi quá lâu.')); }, TIMEOUT_MS);
      promise.then(function (v) { clearTimeout(t); resolve(v); }, function (e) { clearTimeout(t); reject(e); });
    });
  }

  function request(url, options) {
    return withTimeout(fetch(url, options).then(function (res) {
      if (!res.ok) throw new Error('Google Sheet trả về lỗi (mã ' + res.status + ').');
      return res.json();
    }, function () {
      throw new Error('Không kết nối được Google Sheet. Kiểm tra mạng hoặc đường dẫn.');
    })).then(function (data) {
      if (!data || (data.ok === false && !data.duplicate)) throw new Error((data && data.error) || 'Google Sheet trả về dữ liệu không hợp lệ.');
      return data;
    });
  }

  function ping(url) {
    return request(url + '?action=ping', { method: 'GET' });
  }

  function getCount(url, eventId) {
    return request(url + '?action=count&eventId=' + encodeURIComponent(eventId), { method: 'GET' });
  }

  // text/plain để trình duyệt không gửi preflight CORS (Apps Script không hỗ trợ OPTIONS)
  function send(url, ev, record) {
    return request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ eventId: ev.id, eventName: ev.name, capacity: ev.capacity || 0, record: record })
    });
  }

  root.EP = root.EP || {};
  root.EP.sheetSync = { isValidUrl: isValidUrl, ping: ping, getCount: getCount, send: send };
})(typeof window !== 'undefined' ? window : globalThis);
