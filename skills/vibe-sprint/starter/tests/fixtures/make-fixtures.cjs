// Sinh file mẫu đa-sheet để kiểm thử EP.importer:  node tests/fixtures/make-fixtures.cjs
// Dữ liệu là GIẢ LẬP (không phải số của BTC). Cần js/vendor/xlsx.full.min.js (đã nhúng sẵn).
const path = require('path');
const fs = require('fs');
const XLSX = require(path.join(__dirname, '..', '..', 'js', 'vendor', 'xlsx.full.min.js'));

function d(y, m, day) { return new Date(Date.UTC(y, m - 1, day)); }
const sales = [
  ['Ngày', 'Sản phẩm', 'Số lượng', 'Đơn giá (₫)'],
  [d(2026, 11, 1), 'Cà phê muối', 12, 35000],
  [d(2026, 11, 2), 'Trà đào cam sả', 8, 42000],
  [d(2026, 11, 3), 'Bánh mì que', 20, 12000],
  [],                                              // dòng trống: phải bị bỏ qua
  [d(2026, 11, 4), 'Sinh tố bơ', 'abc', 48000],    // lỗi: số lượng không phải số
  [d(2026, 11, 5), 'Matcha đá xay', 5, 52000],
  [d(2026, 11, 6), 'Xôi xéo', 7, 25000],
  [d(2026, 11, 7), 'Chè khúc bạch', 9, 32000]
];
const ws1 = XLSX.utils.aoa_to_sheet(sales, { cellDates: true });
['A2', 'A3', 'A4', 'A6', 'A7', 'A8', 'A9'].forEach((a) => { if (ws1[a]) ws1[a].z = 'dd/mm/yyyy'; });

// Sheet 2: số và ngày dạng CHỮ kiểu Việt Nam, như file xuất từ phần mềm kế toán
const costs = [
  ['Khoản mục', 'Số tiền', 'Ngày chi', 'Tỉ lệ'],
  ['Thuê mặt bằng', '12.000.000', '05/11/2026', '0,5%'],
  ['Nguyên liệu', '1.234.567,5', '10/11/2026', '12,5%'],
  ['Lương nhân viên', '18.500.000', '30/11/2026', '30%'],
  ['Điện nước', '2.150.000', '31/02/2026', '4%']   // ngày không tồn tại: phải báo lỗi
];
const ws2 = XLSX.utils.aoa_to_sheet(costs);
for (let r = 1; r < costs.length; r++) ['B', 'C', 'D'].forEach((c) => { const cell = ws2[c + (r + 1)]; if (cell) { cell.t = 's'; delete cell.z; } });

const notes = [['Ghi chú của BTC'], ['Dữ liệu giả lập để thử nhập file.'], ['Không phải số liệu thật.']];
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws1, 'Bán hàng');
XLSX.utils.book_append_sheet(wb, ws2, 'Chi phí');
XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(notes), 'Ghi chú');
fs.writeFileSync(path.join(__dirname, 'mau-btc.xlsx'), XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }));

// CSV kiểu Excel tiếng Việt: BOM, phân tách ';', số 1.234,5, ngày dd/mm/yyyy, có ô trong ngoặc kép
const csv = '﻿' + [
  'Ngày;Sản phẩm;Số lượng;Đơn giá (₫)',
  '01/11/2026;Cà phê muối;12;35.000',
  '02/11/2026;"Trà đào, cam sả";8;42.000,5',
  ';;;',
  '03/11/2026;Bánh mì que;abc;12.000',
  '04/11/2026;Matcha;5;52.000'
].join('\r\n');
fs.writeFileSync(path.join(__dirname, 'mau-btc.csv'), csv, 'utf8');
console.log('Đã tạo mau-btc.xlsx và mau-btc.csv');
