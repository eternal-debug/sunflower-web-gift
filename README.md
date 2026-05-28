# Hái nắng cho em

Một trang web nhỏ dùng React + Vite, tạo thành một cánh đồng hướng dương tương tác. Người xem có thể chạm vào từng bông hoa để đọc lời nhắn, giữ hoa vào rổ, rồi mở món quà cuối khi đã hái đủ 10 bông.

## Tính năng

- Cảnh cánh đồng hướng dương với các lớp nền, mây, cánh hoa và hiệu ứng ánh nắng.
- 10 bông hoa có thể tương tác, mỗi bông chứa một lời nhắn riêng.
- Lời nhắn được xáo trộn trong mỗi lượt chơi để tạo cảm giác mới.
- Hiệu ứng hoa bay vào rổ sau khi được giữ lại.
- Rổ hoa lưu lại những bông đã hái.
- Có thể mở rổ hoa để xem lại từng bông và lời nhắn.
- Lưu tiến trình bằng `localStorage`.
- Món quà cuối xuất hiện sau khi hái đủ 10 bông.
- Có nút bật/tắt nhạc nền.
- Giao diện có responsive cho desktop và điện thoại.

## Cài đặt

```bash
npm install
npm run dev
```

Mở đường dẫn Vite hiển thị trong terminal, thường là:

```txt
http://localhost:5173
```

## Build

```bash
npm run build
npm run preview
```

## Cấu trúc chính

```txt
src/App.jsx              Logic tương tác, modal, rổ hoa, ending
src/styles.css           Giao diện, animation, responsive
src/data/content.js      Nội dung lời nhắn, vị trí hoa, đường dẫn asset
src/utils/storage.js     Lưu và xóa tiến trình bằng localStorage
public/assets/           Hình ảnh dùng trong trang
```

## Danh sách asset cần có

Đặt các file hình vào thư mục:

```txt
public/assets/
```

Tên file cần khớp với code:

```txt
bg-sunflower-field.png
foreground-field.png
foreground-near-flowers.png

flower-variant-1.png
flower-variant-2.png
flower-variant-3.png
flower-variant-4.png
flower-variant-5.png
flower-variant-6.png
flower-variant-7.png
flower-variant-8.png
flower-variant-9.png
flower-variant-10.png

cloud-soft-01.png
cloud-soft-02.png
cloud-soft-03.png
cloud-soft-04.png
cloud-soft-05.png

petal-handpainted.png
flower-basket-handpainted.png
love-letter-card-handpainted.png
loading-flower-handpainted.png
final-bouquet-handpainted.png
```

## Chỉnh nội dung

Các nội dung dễ chỉnh nằm trong:

```txt
src/data/content.js
```

Có thể chỉnh:

```txt
editableContent
flowerQuotes
interactiveFlowers
clouds
petals
```

## Nhạc nền

File nhạc mặc định:

```txt
public/audio/classical-loop.mp3
```

Nếu không có file này, nút nhạc vẫn hiển thị nhưng nhạc sẽ không phát. Có thể đổi đường dẫn trong `src/data/content.js`.

## Deploy GitHub Pages

Trong `vite.config.js`, trường `base` đang dùng:

```js
base: "/sunflower-web-gift/";
```

Nếu repo GitHub có tên khác, đổi `sunflower-web-gift` thành tên repo tương ứng.

Nếu deploy dạng user site như:

```txt
https://<username>.github.io/
```

thì đổi thành:

```js
base: "/";
```

Sau khi push lên GitHub, bật Pages bằng GitHub Actions trong phần Settings của repo.

## Ghi chú

- Giữ đúng tên file asset để tránh lỗi mất hình.
- Nên test trên cả desktop và điện thoại.
- Nếu thay ảnh mới, nên xóa cache trình duyệt hoặc mở tab ẩn danh để kiểm tra.

## Responsive upgrade v13

Bản này bổ sung lớp responsive consolidation ở cuối `src/styles.css` và một số hỗ trợ trong `src/App.jsx`:

- Dùng `visualViewport` để cập nhật `--app-height` / `--app-width`, giảm lỗi 100vh trên mobile browser khi thanh địa chỉ co giãn.
- Thêm `viewport-fit=cover` để hỗ trợ safe area trên iPhone tai thỏ / Dynamic Island.
- Khóa scroll ổn định khi modal, rổ hoa hoặc final gift đang mở bằng class `modal-open` trên `html` và `body`.
- Chuẩn hóa layout cho tablet, mobile portrait, điện thoại rất hẹp và landscape thấp.
- Tăng touch target cho hoa và các nút điều khiển.
- Dàn lại vị trí hoa trên mobile để hạn chế bị cắt cạnh, che bởi intro card hoặc đè lên controls.
- Bổ sung fallback `prefers-reduced-motion` cho người dùng hạn chế chuyển động.

Nên test tối thiểu các viewport:

```txt
320x568
375x667
390x844
430x932
768x1024
844x390 landscape
1024x768
1440x900
```
