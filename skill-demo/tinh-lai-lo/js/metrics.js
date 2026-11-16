/* metrics.js - số liệu an toàn (không NaN/Infinity), KPI marketing, tiền VND, xu hướng.
     EP.metrics.div(a, b, fallback=0)           chia an toàn
     EP.metrics.ctr(clicks, impressions)  -> %   | cpc(cost, clicks) | cpa(cost, conv) | roas(revenue, cost) | cr(conv, clicks)
     EP.metrics.margin(price, cost) -> { profit, marginPct, markupPct }
     EP.metrics.change(now, prev) -> % thay đổi (null nếu prev = 0)
     EP.metrics.trend(series) -> { dir: 'up'|'down'|'flat', pct, first, last }
     EP.metrics.sum/avg/min/max(arr, key?) ; EP.metrics.groupSum(rows, groupKey, valueKey) -> [{label,value}]
     EP.metrics.round(n, d) ; EP.metrics.vnd(n) -> '1.250.000 ₫' ; EP.metrics.vndShort(n) -> '1,2 tr' */
(function (root) {
  'use strict';
  var EP = root.EP;
  function num(v) { var n = Number(v); return isFinite(n) ? n : 0; }
  function div(a, b, fb) { b = num(b); return b === 0 ? (fb == null ? 0 : fb) : num(a) / b; }
  function round(n, d) { var p = Math.pow(10, d == null ? 0 : d); return Math.round(num(n) * p) / p; }
  function vals(arr, key) { return (arr || []).map(function (x) { return num(key ? x[key] : x); }); }
  function sum(arr, key) { return vals(arr, key).reduce(function (s, x) { return s + x; }, 0); }
  function change(now, prev) { return num(prev) === 0 ? null : (num(now) - num(prev)) / Math.abs(num(prev)) * 100; }

  EP.metrics = {
    div: div, round: round, num: num, sum: sum, change: change,
    avg: function (arr, key) { return div(sum(arr, key), (arr || []).length); },
    min: function (arr, key) { var v = vals(arr, key); return v.length ? Math.min.apply(null, v) : 0; },
    max: function (arr, key) { var v = vals(arr, key); return v.length ? Math.max.apply(null, v) : 0; },
    ctr: function (clicks, impr) { return div(clicks, impr) * 100; },
    cpc: function (cost, clicks) { return div(cost, clicks); },
    cpa: function (cost, conv) { return div(cost, conv); },
    cr: function (conv, clicks) { return div(conv, clicks) * 100; },
    roas: function (revenue, cost) { return div(revenue, cost); },
    margin: function (price, cost) { var p = num(price) - num(cost); return { profit: p, marginPct: div(p, price) * 100, markupPct: div(p, cost) * 100 }; },
    trend: function (series) {
      var v = vals(series, null).filter(function (x, i) { return series[i] != null; });
      if (v.length < 2) return { dir: 'flat', pct: 0, first: v[0] || 0, last: v[0] || 0 };
      var first = v[0], last = v[v.length - 1], pct = change(last, first);
      return { dir: pct == null || Math.abs(pct) < 1 ? 'flat' : pct > 0 ? 'up' : 'down', pct: pct == null ? 0 : pct, first: first, last: last };
    },
    groupSum: function (rows, groupKey, valueKey) {
      var m = {}, order = [];
      (rows || []).forEach(function (r) { var k = r[groupKey]; if (!(k in m)) { m[k] = 0; order.push(k); } m[k] += num(r[valueKey]); });
      return order.map(function (k) { return { label: k, value: m[k] }; });
    },
    vnd: function (n) { return Math.round(num(n)).toLocaleString('vi-VN') + ' ₫'; },
    vndShort: function (n) {
      n = num(n); var a = Math.abs(n), f = function (x) { return (Math.round(x * 10) / 10).toLocaleString('vi-VN'); };
      return a >= 1e9 ? f(n / 1e9) + ' tỷ' : a >= 1e6 ? f(n / 1e6) + ' tr' : a >= 1e3 ? f(n / 1e3) + 'k' : String(Math.round(n));
    }
  };
})(window);
