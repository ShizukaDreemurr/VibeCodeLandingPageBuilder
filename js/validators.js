/*
 * validators.js — quy tắc kiểm tra dữ liệu nhập (form sự kiện và form đăng ký).
 * Mỗi hàm trả về chuỗi lỗi tiếng Việt, hoặc '' nếu hợp lệ.
 */
(function (root) {
  // Đầu số di động Việt Nam hiện hành: 03, 05, 07, 08, 09
  var VN_MOBILE = /^0(3|5|7|8|9)\d{8}$/;
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function clean(value) {
    return String(value == null ? '' : value).trim();
  }

  // +84 912 345 678 / 84912345678 / 0912.345.678 → 0912345678
  function normalizePhone(value) {
    var digits = clean(value).replace(/[\s.\-()]/g, '');
    if (digits.indexOf('+84') === 0) digits = '0' + digits.slice(3);
    else if (/^84\d{9}$/.test(digits)) digits = '0' + digits.slice(2);
    return digits;
  }

  function required(value, label) {
    return clean(value) ? '' : 'Vui lòng nhập ' + label + '.';
  }

  function phone(value) {
    if (!clean(value)) return 'Vui lòng nhập số điện thoại.';
    if (!VN_MOBILE.test(normalizePhone(value))) {
      return 'Số điện thoại không hợp lệ (ví dụ: 0912345678 hoặc +84912345678).';
    }
    return '';
  }

  function email(value) {
    if (!clean(value)) return 'Vui lòng nhập email.';
    return EMAIL.test(clean(value)) ? '' : 'Email không đúng định dạng (ví dụ: ten@gmail.com).';
  }

  function maxLength(value, max, label) {
    return clean(value).length > max ? label + ' tối đa ' + max + ' ký tự.' : '';
  }

  // Kiểm tra form tạo sự kiện. Trả về { tenTruong: 'lỗi' }
  function validateEvent(ev) {
    var errors = {};
    var err;
    if ((err = required(ev.name, 'tên sự kiện') || maxLength(ev.name, 120, 'Tên sự kiện'))) errors.name = err;
    if (!ev.startAt) errors.startAt = 'Vui lòng chọn thời gian bắt đầu.';
    else if (isNaN(new Date(ev.startAt).getTime())) errors.startAt = 'Thời gian không hợp lệ.';
    if ((err = required(ev.location, 'địa điểm'))) errors.location = err;
    if (!ev.speakers || !ev.speakers.length) errors.speakers = 'Vui lòng nhập ít nhất 1 diễn giả.';
    if (ev.capacity !== '' && ev.capacity != null) {
      var n = Number(ev.capacity);
      if (!Number.isInteger(n) || n < 1 || n > 100000) errors.capacity = 'Số chỗ phải là số nguyên từ 1 đến 100.000.';
    }
    if (ev.earlyBirdUntil && ev.startAt && new Date(ev.earlyBirdUntil) > new Date(ev.startAt)) {
      errors.earlyBirdUntil = 'Hạn ưu đãi phải trước giờ bắt đầu sự kiện.';
    }
    if (ev.sheetUrl && root.EP.sheetSync && !root.EP.sheetSync.isValidUrl(ev.sheetUrl)) {
      errors.sheetUrl = 'Đường dẫn phải có dạng https://script.google.com/macros/s/.../exec';
    }
    return errors;
  }

  // Kiểm tra form đăng ký của người tham dự
  function validateRegistration(reg) {
    var errors = {};
    var err;
    if ((err = required(reg.name, 'họ tên') || maxLength(reg.name, 80, 'Họ tên'))) errors.name = err;
    if ((err = phone(reg.phone))) errors.phone = err;
    if ((err = email(reg.email))) errors.email = err;
    if (!reg.consent) errors.consent = 'Vui lòng đồng ý để ban tổ chức liên hệ xác nhận.';
    return errors;
  }

  root.EP = root.EP || {};
  root.EP.validators = {
    clean: clean,
    normalizePhone: normalizePhone,
    phone: phone,
    email: email,
    validateEvent: validateEvent,
    validateRegistration: validateRegistration
  };
})(typeof window !== 'undefined' ? window : globalThis);
