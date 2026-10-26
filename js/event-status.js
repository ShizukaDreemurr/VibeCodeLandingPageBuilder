/*
 * event-status.js — tính trạng thái của sự kiện tại một thời điểm.
 * Quy tắc BTC: sự kiện đã qua → hiển thị "Sự kiện đã diễn ra", không đếm ngược số âm.
 */
(function (root) {
  var ALMOST_FULL_RATIO = 0.9; // còn ≤ 10% chỗ → "sắp hết chỗ"

  // now: Date (cho phép truyền thời điểm giả lập để demo "tua thời gian")
  function getStatus(ev, registeredCount, now) {
    now = now || new Date();
    var start = new Date(ev.startAt);
    var capacity = Number(ev.capacity) || 0;

    if (now >= start) {
      return { code: 'ended', label: 'Sự kiện đã diễn ra', canRegister: false, waitlist: false };
    }
    if (capacity && registeredCount >= capacity) {
      return { code: 'full', label: 'Đã hết chỗ – vào danh sách chờ', canRegister: true, waitlist: true };
    }
    if (capacity && registeredCount >= Math.ceil(capacity * ALMOST_FULL_RATIO)) {
      return {
        code: 'almost',
        label: 'Chỉ còn ' + (capacity - registeredCount) + ' chỗ',
        canRegister: true,
        waitlist: false
      };
    }
    return { code: 'open', label: 'Đang mở đăng ký', canRegister: true, waitlist: false };
  }

  function isEarlyBirdActive(ev, now) {
    if (!ev.earlyBird) return false;
    if (!ev.earlyBirdUntil) return true;
    return (now || new Date()) < new Date(ev.earlyBirdUntil);
  }

  // Phần còn lại đến giờ G, null nếu đã qua
  function countdown(ev, now) {
    var ms = new Date(ev.startAt) - (now || new Date());
    if (ms <= 0) return null;
    var s = Math.floor(ms / 1000);
    return {
      days: Math.floor(s / 86400),
      hours: Math.floor((s % 86400) / 3600),
      minutes: Math.floor((s % 3600) / 60),
      seconds: s % 60
    };
  }

  root.EP = root.EP || {};
  root.EP.eventStatus = { getStatus: getStatus, isEarlyBirdActive: isEarlyBirdActive, countdown: countdown };
})(typeof window !== 'undefined' ? window : globalThis);
