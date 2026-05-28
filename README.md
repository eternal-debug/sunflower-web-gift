# Hái nắng cho em

Một single-page interactive web gift dùng React + Vite. Web chạy hoàn toàn static, không cần backend, database, server-side logic hay tài khoản người dùng.

## Tính năng đã có

- Loading screen + curtain reveal mở cảnh.
- Cánh đồng hướng dương vẽ tay bằng placeholder SVG.
- 10 bông hoa tương tác, mỗi bông có quote riêng.
- Quote được random từ mảng khi bắt đầu playthrough mới, không lặp trong cùng một lượt.
- Hover/click animation cho hoa.
- Quote card dạng giấy ghi chú.
- Hoa bay theo đường cong vào túi đồ sau khi được giữ lại.
- Túi đồ có counter, bounce/glow khi nhận hoa.
- Inventory modal dạng scrapbook/keepsake album.
- Click từng bông trong túi để xem lại quote.
- Lưu tiến trình bằng localStorage.
- Ending sequence khi hái đủ 10 bông.
- Living artwork state sau ending: bó hoa, cánh hoa bay, mây trôi, ánh nắng.
- Nút đọc lại lời nhắn, mở túi hoa, ngắm thêm, bắt đầu lại.

## Cài đặt local

```bash
npm install
npm run dev
```

Mở URL mà Vite hiển thị, thường là:

```bash
http://localhost:5173
```

## Build production

```bash
npm run build
npm run preview
```

## Chỉnh nội dung

File chính để chỉnh quote, lời mở đầu, final message, vị trí hoa:

```txt
src/data/content.js
```

Các phần dễ chỉnh:

```js
editableContent.introLine
editableContent.giftTitle
editableContent.finalTitle
editableContent.finalMessage
flowerQuotes
interactiveFlowers
```

## Thay asset AI-generated

Asset placeholder nằm ở:

```txt
public/assets/
```

Bạn có thể thay các file SVG bằng PNG cùng tên, hoặc sửa đường dẫn trong `src/data/content.js`.

Asset hiện tại:

```txt
bg-sunflower-field.svg
flower-variant-1.svg ... flower-variant-10.svg
petal.svg
bag.svg
letter-card.svg
```

## Thêm nhạc nền

```txt
public/assets/music/classical-loop.mp3
```

Hiện project chưa tự bật audio để tránh vấn đề autoplay trên browser. Nếu muốn thêm nhạc, nên thêm nút play/mute thủ công trong UI.

## Deploy GitHub Pages bằng GitHub Actions

Project đã có workflow:

```txt
.github/workflows/deploy.yml
```

Cách deploy:

1. Tạo repo GitHub mới.
2. Push toàn bộ project lên branch `main`.
3. Vào repo Settings → Pages.
4. Ở Build and deployment → Source, chọn `GitHub Actions`.
5. Push lại hoặc chạy workflow thủ công từ tab Actions.
6. Web sẽ được deploy lên dạng:

```txt
https://<username>.github.io/<repo-name>/
```

`vite.config.js` đã tự set `base` theo tên repo khi chạy trong GitHub Actions.

Nếu bạn dùng repo dạng user site như `<username>.github.io`, hãy đổi `base` trong `vite.config.js` thành `/`.


## npm install troubleshooting

If npm tries to fetch from `packages.applied-caas-gateway...internal.api.openai.org`, delete `package-lock.json` and `node_modules`, then run:

```bash
npm config set registry https://registry.npmjs.org/
npm install
```

This project intentionally does not include a package lock file so npm will resolve packages from the public npm registry on your machine.
