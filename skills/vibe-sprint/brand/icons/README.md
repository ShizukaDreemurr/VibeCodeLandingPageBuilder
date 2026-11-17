# Bộ icon Xclipse

54 icon (52 icon chức năng + `x-mark` logo + `eclipse`), vanilla, không phụ thuộc.

## Dùng nhanh
```html
<script src="xclipse-icons.js"></script>
<script>
  el.innerHTML = XcIcons.svg('ticket', { size: 20 });             // nét thường
  el.innerHTML = XcIcons.svg('ticket', { size: 24, duo: true });  // duotone
  XcIcons.mount();                                                 // chèn sprite, rồi: <svg><use href="#xc-home"/></svg>
</script>
```
Tên icon: `XcIcons.names`; nhãn tiếng Việt: `XcIcons.labels`. Duotone trong sprite: `#xc-home-duo`.
File lẻ: `svg/*.svg`, `svg/duo/*.svg`; sprite: `sprite.svg`; demo: `index.html`.

## Quy tắc hệ icon
1. **Lưới 24 × 24**, lề 2 px, vùng vẽ 20 × 20. Toạ độ nguyên hoặc nửa pixel.
2. **Nét 1,75**, đầu nét và góc nối bo tròn (`round`), màu `currentColor`. Không tô nền, trừ biến thể duotone.
3. **Bo góc 2** cho mọi khối; chi tiết rất nhỏ được dùng bán kính 1.
4. **Dấu nhật thực** (kín đáo, không lạm dụng): một khoảng cắt tròn hoặc cung lệch ở chỗ tự nhiên (vé, voucher, mặt trăng, ai-sparkle, biểu đồ tròn, glyph `eclipse`, `x-mark` có nét đứt).
5. **Duotone**: lớp nền cùng màu ở độ mờ 18% + tối đa 1 chấm nhấn coral `#FD6E88` (đổi bằng biến CSS `--xc-accent`). Chữ coral nhỏ trên nền sáng dùng `#C93252`.
6. **Đọc rõ ở 16 px và 20 px**: tối đa hai lớp chi tiết, khoảng hở giữa nét >= 2 px.
7. Bảng màu: Ice `#DBF2FC`, Navy `#072D59`, Coral `#FD6E88`.

## Thêm icon / build lại
Sửa `icons-data.mjs` rồi chạy `node build.mjs` (sinh `svg/`, `sprite.svg`, `xclipse-icons.js`, `index.html`).
Chụp ảnh: `node shoot.mjs http://localhost:8226/index.html` (cần Playwright).
