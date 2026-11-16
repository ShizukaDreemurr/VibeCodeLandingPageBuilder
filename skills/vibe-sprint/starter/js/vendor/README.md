# Thư viện bên thứ ba (nhúng sẵn, chạy offline)

- `xlsx.full.min.js` : SheetJS Community Edition **0.18.5** (bản gốc `xlsx@0.18.5/dist/xlsx.full.min.js`, cùng file với cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js).
  Giấy phép **Apache-2.0**, xem `xlsx.LICENSE.txt`. (c) SheetJS LLC.
  Chỉ được nạp khi người dùng nhập file .xlsx/.xls (`EP.importer`, nạp lười), nên không làm chậm trang.
- Không sửa file này. Muốn bỏ: xoá file + `js/import.js` + dòng `<script>` tương ứng trong index.html.
