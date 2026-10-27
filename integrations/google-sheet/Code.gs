/**
 * Xclipse — Google Apps Script nhận đăng ký từ landing page và ghi vào Google Sheet.
 * Cách cài: xem docs/huong-dan-google-sheet.md
 *
 * API:
 *   GET  ?action=ping                      → { ok: true }
 *   GET  ?action=count&eventId=...         → { ok: true, count, waitlist }
 *   POST body JSON { eventId, eventName, capacity, record:{id,name,phone,email,createdAt} }
 *        → { ok, duplicate, status: 'new'|'waitlist', count }
 */

var HEADERS = ['Thời gian', 'Mã đăng ký', 'Họ tên', 'Số điện thoại', 'Email', 'Trạng thái', 'Sự kiện'];
var STATUS_TEXT = { new: 'Đã đăng ký', waitlist: 'Danh sách chờ' };

function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.action === 'ping') return json({ ok: true });
  if (p.action === 'count') {
    var sheet = getSheet(p.eventId, false);
    var stats = countRows(sheet);
    return json({ ok: true, count: stats.count, waitlist: stats.waitlist });
  }
  return json({ ok: false, error: 'Thiếu tham số action.' });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); // tránh 2 người đăng ký cùng lúc bị ghi lệch số chỗ
    var body = JSON.parse(e.postData.contents);
    var r = body.record || {};
    if (!body.eventId || !r.id || !r.name || !r.phone || !r.email) {
      return json({ ok: false, error: 'Thiếu dữ liệu đăng ký.' });
    }

    var sheet = getSheet(body.eventId, true, body.eventName);
    var rows = sheet.getLastRow() > 1 ? sheet.getRange(2, 1, sheet.getLastRow() - 1, HEADERS.length).getValues() : [];
    var phone = normalizePhone(r.phone);
    var email = String(r.email).trim().toLowerCase();

    // Đã gửi bản ghi này rồi (gửi lại do mất mạng) → không ghi trùng
    for (var i = 0; i < rows.length; i++) {
      if (rows[i][1] === r.id) return json({ ok: true, duplicate: false, status: statusCode(rows[i][5]), count: countRows(sheet).count });
    }
    for (var j = 0; j < rows.length; j++) {
      if (normalizePhone(rows[j][3]) === phone || String(rows[j][4]).toLowerCase() === email) {
        return json({ ok: false, duplicate: true, count: countRows(sheet).count });
      }
    }

    var confirmed = countRows(sheet).count;
    var capacity = Number(body.capacity) || 0;
    var status = capacity && confirmed >= capacity ? 'waitlist' : 'new';
    // Dấu ' giữ số 0 đầu và chặn chèn công thức
    sheet.appendRow([new Date(r.createdAt || Date.now()), r.id, safe(r.name), "'" + phone, safe(email), STATUS_TEXT[status], safe(body.eventName || '')]);
    return json({ ok: true, duplicate: false, status: status, count: confirmed + (status === 'new' ? 1 : 0) });
  } catch (err) {
    return json({ ok: false, error: 'Lỗi xử lý: ' + err.message });
  } finally {
    lock.releaseLock();
  }
}

function getSheet(eventId, create, eventName) {
  var name = String(eventId || 'chung').slice(0, 90);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet && create) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    if (eventName) sheet.setTabColor('#1e2a78');
  }
  return sheet;
}

function countRows(sheet) {
  if (!sheet || sheet.getLastRow() < 2) return { count: 0, waitlist: 0 };
  var statuses = sheet.getRange(2, 6, sheet.getLastRow() - 1, 1).getValues();
  var waitlist = statuses.filter(function (s) { return s[0] === STATUS_TEXT.waitlist; }).length;
  return { count: statuses.length - waitlist, waitlist: waitlist };
}

function statusCode(text) { return text === STATUS_TEXT.waitlist ? 'waitlist' : 'new'; }

function normalizePhone(v) { return String(v).replace(/^'/, '').replace(/[\s.\-()]/g, '').replace(/^\+84/, '0'); }

function safe(v) {
  var s = String(v == null ? '' : v);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
