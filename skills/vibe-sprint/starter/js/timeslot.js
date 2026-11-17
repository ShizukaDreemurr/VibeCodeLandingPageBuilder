/* timeslot.js - khung giờ, kiểm tra trùng lịch, đếm ngược.
     EP.time.slots('2026-11-20', '08:00', '17:00', 30) -> ['08:00','08:30',...]
     EP.time.overlaps({start:'09:00',end:'10:00'}, {start:'09:30',end:'11:00'}) -> true
     EP.time.freeSlots(day, slots, booked[{date,time}], durationMin) -> các giờ còn trống
     EP.time.countdown(targetISO) -> { done, days, hours, minutes, seconds, text:'2 ngày 03:04:05' }
     EP.time.toMin('09:30') -> 570 ; EP.time.fromMin(570) -> '09:30' */
(function (root) {
  'use strict';
  var EP = root.EP;
  function toMin(t) { var p = String(t).split(':'); return (+p[0]) * 60 + (+p[1] || 0); }
  function fromMin(m) { return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); }
  function pad(n) { return String(n).padStart(2, '0'); }
  EP.time = {
    toMin: toMin, fromMin: fromMin,
    slots: function (day, from, to, step) {
      var out = [], s = toMin(from), e = toMin(to), st = step || 30;
      for (var m = s; m + st <= e; m += st) out.push(fromMin(m));
      return out;
    },
    overlaps: function (a, b) { return toMin(a.start) < toMin(b.end) && toMin(b.start) < toMin(a.end); },
    freeSlots: function (day, slots, booked, dur) {
      dur = dur || 30;
      var busy = (booked || []).filter(function (b) { return b.date === day; }).map(function (b) { return { start: b.time, end: fromMin(toMin(b.time) + (b.duration || dur)) }; });
      return slots.filter(function (t) {
        var s = { start: t, end: fromMin(toMin(t) + dur) };
        return !busy.some(function (b) { return EP.time.overlaps(s, b); });
      });
    },
    isPast: function (day, time) { return new Date(day + 'T' + (time || '23:59') + ':00').getTime() < Date.now(); },
    countdown: function (target, now) {
      var ms = new Date(target).getTime() - (now == null ? Date.now() : now);
      if (isNaN(ms)) return { done: true, days: 0, hours: 0, minutes: 0, seconds: 0, text: '' };
      if (ms <= 0) return { done: true, days: 0, hours: 0, minutes: 0, seconds: 0, text: 'Đã diễn ra' };
      var s = Math.floor(ms / 1000), d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), sec = s % 60;
      return { done: false, days: d, hours: h, minutes: m, seconds: sec, text: (d ? d + ' ngày ' : '') + pad(h) + ':' + pad(m) + ':' + pad(sec) };
    }
  };
})(window);
