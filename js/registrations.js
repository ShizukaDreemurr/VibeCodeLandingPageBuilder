/*
 * registrations.js — lưu danh sách đăng ký theo từng sự kiện.
 * Quy tắc: không đăng ký trùng (cùng SĐT hoặc email), hết chỗ → danh sách chờ,
 * sự kiện đã diễn ra → không nhận đăng ký.
 */
(function (root) {
  var S = root.EP.storage;
  var V = root.EP.validators;

  function key(eventId) { return 'regs_' + eventId; }

  function list(eventId) {
    return S.read(key(eventId), []);
  }

  // Chỉ tính người đã có chỗ, không tính danh sách chờ
  function confirmedCount(eventId) {
    return list(eventId).filter(function (r) { return r.status !== 'waitlist'; }).length;
  }

  function findDuplicate(regs, phone, email) {
    return regs.find(function (r) { return r.phone === phone || r.email === email; });
  }

  // Trả về { ok, errors, duplicate, waitlist, record }
  function register(ev, input, now) {
    var errors = V.validateRegistration(input);
    if (Object.keys(errors).length) return { ok: false, errors: errors };

    var regs = list(ev.id);
    var phone = V.normalizePhone(input.phone);
    var email = V.clean(input.email).toLowerCase();

    if (findDuplicate(regs, phone, email)) {
      return { ok: false, duplicate: true, errors: { form: 'Bạn đã đăng ký rồi bằng số điện thoại hoặc email này.' } };
    }

    var status = root.EP.eventStatus.getStatus(ev, confirmedCount(ev.id), now);
    if (!status.canRegister) {
      return { ok: false, errors: { form: 'Sự kiện đã diễn ra, không thể đăng ký thêm.' } };
    }

    var record = {
      id: S.newId('reg'),
      name: V.clean(input.name),
      phone: phone,
      email: email,
      status: status.waitlist ? 'waitlist' : 'new',
      createdAt: new Date().toISOString()
    };
    regs.push(record);
    if (!S.write(key(ev.id), regs)) {
      return { ok: false, errors: { form: 'Không lưu được dữ liệu (trình duyệt hết dung lượng hoặc chặn lưu trữ).' } };
    }
    return { ok: true, waitlist: status.waitlist, record: record };
  }

  function removeAll(eventId) { S.remove(key(eventId)); }

  root.EP.registrations = {
    list: list,
    confirmedCount: confirmedCount,
    register: register,
    removeAll: removeAll,
    storageKey: key
  };
})(typeof window !== 'undefined' ? window : globalThis);
