# Hái nắng cho em — World-class UI/UX upgrade

Một single-page interactive web gift dùng React + Vite. Bản nâng cấp này giữ style vẽ tay dễ thương, giữ hệ asset hoa/background hiện tại, nhưng nâng trải nghiệm theo hướng web event thương mại: cinematic reveal, HUD tiến trình, micro-interaction, modal scrapbook, ending reward, responsive polish và fallback an toàn khi asset PNG mới chưa sẵn sàng.

## Điểm nâng cấp chính

- Giữ 10 bông hoa tương tác và flow hái hoa cũ.
- Nâng layer cảnh: ánh nắng, dust sparkle, wind ribbon, parallax foreground, mây PNG trôi chậm.
- Thêm progress HUD dạng event collection, progress bar trong hero, orb trạng thái 10 hoa.
- Nâng flower interaction: hover label, aura, touch ring, focus state, aria-label rõ hơn.
- Nâng quote card: card giấy cao cấp, stamp, 2 action, entrance animation mềm.
- Đổi “túi” thành “rổ hoa” để hợp asset PNG vẽ tay và cảm giác collectible.
- Nâng inventory thành keepsake album có grid + detail card.
- Nâng final gift: bouquet stage, ribbon, love-letter card PNG, cinematic backdrop.
- Thêm keyboard UX: `Esc` đóng modal, `I` mở rổ hoa.
- Thêm fallback CSS cho cloud/basket/letter/petal để layout không vỡ khi chưa có PNG.

## Cài đặt local

```bash
npm install
npm run dev
```

Mở URL Vite hiển thị, thường là:

```bash
http://localhost:5173
```

## Build production

```bash
npm run build
npm run preview
```

## Cấu trúc chỉnh nhanh

```txt
src/App.jsx                 Logic tương tác, modal, HUD, scene layers
src/styles.css              Toàn bộ UI/UX, animation, responsive polish
src/data/content.js         Quote, text, vị trí hoa, asset paths, cloud/petal data
src/utils/storage.js        localStorage save/load/reset
public/assets/README_ASSETS.md
                            Danh sách asset PNG cần đặt đúng tên
docs/AI_ASSET_PROMPTS.md    Prompt tạo PNG vẽ tay bằng AI
```

## Asset PNG cần tạo/thay

Đặt vào `public/assets/` đúng tên:

```txt
cloud-soft-01.png
cloud-soft-02.png
cloud-soft-03.png
cloud-soft-04.png
cloud-soft-05.png
flower-basket-handpainted.png
love-letter-card-handpainted.png
petal-handpainted.png
```

Các asset cũ cần giữ nguyên:

```txt
bg-sunflower-field.png
flower-variant-1.png ... flower-variant-10.png
foreground-field.png
foreground-near-flowers.png
```

## Deploy GitHub Pages

`vite.config.js` hiện dùng:

```js
base: '/sunflower-web-gift/'
```

Nếu repo GitHub của bạn khác tên, đổi `base` theo tên repo. Nếu deploy user site dạng `<username>.github.io`, đổi thành `/`.

## Ghi chú thương mại hóa

- Nên dùng asset PNG cùng một model/style để giữ consistency.
- Tất cả PNG nên có nền trong suốt, cạnh mềm, không chữ, không watermark.
- Test trên mobile thật vì web dạng event thường có lượng truy cập mobile cao.
- Nhạc nền nên để volume thấp, có nút bật/tắt rõ ràng vì browser thường chặn autoplay.
