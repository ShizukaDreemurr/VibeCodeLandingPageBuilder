// Unit test nhanh bằng node `vm` (khoảng 1 giây, không cần trình duyệt/Playwright).
// Chép thành tests/<feature>.cjs rồi đổi: FILES (file js cần nạp) và các assert.
// Chạy từ gốc dự án:  node tests/<feature>.cjs
// Nguyên tắc: logic tính số nằm trong HÀM THUẦN (đưa vào EP.<feature>.<hàm>), test ở đây; giao diện để Playwright.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');
// Nạp theo thứ tự như index.html. Thêm 'features/<tên>/feature.js' của bạn vào cuối.
const FILES = ['js/config.js', 'features/_unit-demo.js'];

// EP giả tối thiểu: đủ để file feature chạy phần định nghĩa hàm (không cần DOM).
const noop = () => {};
const sandbox = {
  console,
  EP: { register: noop, collection: () => ({ list: () => [], add: noop, update: noop, remove: noop, get: noop, onChange: noop }),
        demo: { register: noop }, ui: {}, form: {}, charts: {}, ai: { generate: async () => ({}) }, aiSpecs: {} },
};
sandbox.window = sandbox; sandbox.globalThis = sandbox;
vm.createContext(sandbox);

// Hàm thuần mẫu, dùng khi chưa có file thật (xoá khi đã có feature của bạn).
const DEMO = `
(function (root) {
  var EP = root.EP; EP.demo_calc = {
    // Tỷ lệ chuyển đổi: mẫu số = 0 thì trả "Không đủ dữ liệu" (không 0%/NaN)
    rate: function (orders, clicks) { return clicks > 0 ? Math.round(orders / clicks * 1000) / 10 : 'Không đủ dữ liệu'; }
  };
})(window);`;

for (const f of FILES) {
  const full = path.join(ROOT, f);
  const code = fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : (f === 'features/_unit-demo.js' ? DEMO : null);
  if (code === null) throw new Error('Không thấy ' + f);
  vm.runInContext(code, sandbox, { filename: f });
}

const { EP } = sandbox;
let n = 0;
const t = (name, fn) => { fn(); n++; console.log('  ok  ', name); };

t('tỷ lệ bình thường', () => assert.strictEqual(EP.demo_calc.rate(5, 50), 10));
t('mẫu số = 0 -> Không đủ dữ liệu', () => assert.strictEqual(EP.demo_calc.rate(5, 0), 'Không đủ dữ liệu'));
t('không bao giờ NaN/Infinity', () => assert.ok(!/NaN|Infinity/.test(String(EP.demo_calc.rate(0, 0)))));

console.log(n + ' test đạt');
