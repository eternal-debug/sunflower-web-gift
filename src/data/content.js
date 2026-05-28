export const editableContent = {
  introLine: 'Nếu hôm nay em mệt, hãy ở lại cánh đồng này một chút nhé.',
  giftTitle: 'Hái nắng cho em',
  finalTitle: 'Một bó nắng nhỏ dành cho em',
  finalMessage: `Gửi em,

Anh biết hôm nay có thể không phải là một ngày dễ chịu.
Nên anh làm cánh đồng nhỏ này để em có một nơi dừng lại một chút.

Em không cần phải cười ngay.
Không cần phải ổn ngay.
Không cần phải giải thích vì sao mình mệt.

Chỉ cần em biết rằng, dù hôm nay có thế nào, em vẫn luôn rất đáng yêu, rất đáng thương, và rất đáng được dịu dàng.

Anh mong cánh đồng này có thể giữ hộ em một chút nắng, đến khi em thấy lòng mình nhẹ hơn.

— From anh be`,
};

export const audioSettings = {
  src: '/audio/classical-loop.mp3',
  volume: 0.05,
  autoPlay: true,
  autoPlayDelayMs: 220,
  label: 'Nhạc nền cổ điển nhẹ',
};

export const foregroundLayers = [
  {
    id: 'foreground-field',
    kind: 'mid',
    asset: '/assets/foreground-field.png',
    left: 0,
    bottom: -2,
    width: 100,
    opacity: 0.94,
    zIndex: 14,
    parallax: 0.1,
    sway: 1.2,
    delay: -0.4,
  },
  {
    id: 'foreground-near-flowers',
    kind: 'front',
    asset: '/assets/foreground-near-flowers.png',
    left: 0,
    bottom: -5,
    width: 100,
    opacity: 0.55,
    zIndex: 27,
    parallax: 0.18,
    sway: 1.8,
    delay: -1.2,
  },
];

export const flowerQuotes = [
  'Em không cần phải ổn ngay lập tức đâu.',
  'Hôm nay mệt thì mình đi chậm lại một chút cũng được.',
  'Có những ngày chỉ cần cố gắng tồn tại thôi cũng đã rất giỏi rồi.',
  'Em không hề kém. Em chỉ đang mệt thôi.',
  'Nếu thế giới hôm nay hơi ồn, em có thể nghỉ trong cánh đồng này một lát.',
  'Em vẫn luôn đáng yêu, kể cả trong những ngày em không thấy vậy.',
  'Không cần mạnh mẽ mọi lúc đâu. Có lúc yếu mềm cũng rất đáng được thương.',
  'Mọi cảm xúc của em đều xứng đáng được lắng nghe dịu dàng.',
  'Một ngày tệ không làm em trở nên kém quý giá hơn chút nào.',
  'Nếu em quên mất mình đáng được yêu thương, bông hoa này sẽ nhắc em nhớ lại.',
];

export const interactiveFlowers = [
  { id: 'sun-01', label: 'Một chút nắng', asset: '/assets/flower-variant-1.png', x: 13, y: 57, size: 145, tilt: -7, sway: 5.2, delay: -0.3 },
  { id: 'sun-02', label: 'Bình yên nhỏ', asset: '/assets/flower-variant-2.png', x: 25, y: 64, size: 122, tilt: 5, sway: 4.6, delay: -1.1 },
  { id: 'sun-03', label: 'Một hơi thở', asset: '/assets/flower-variant-3.png', x: 36, y: 53, size: 154, tilt: 2, sway: 5.5, delay: -1.8 },
  { id: 'sun-04', label: 'Ngày chậm lại', asset: '/assets/flower-variant-4.png', x: 47, y: 67, size: 126, tilt: -9, sway: 4.1, delay: -0.8 },
  { id: 'sun-05', label: 'Dịu dàng', asset: '/assets/flower-variant-5.png', x: 58, y: 56, size: 164, tilt: 4, sway: 5.8, delay: -2.4 },
  { id: 'sun-06', label: 'Không cần vội', asset: '/assets/flower-variant-6.png', x: 69, y: 65, size: 124, tilt: 8, sway: 4.8, delay: -1.6 },
  { id: 'sun-07', label: 'Một nụ cười', asset: '/assets/flower-variant-7.png', x: 79, y: 54, size: 152, tilt: -4, sway: 5.1, delay: -2.1 },
  { id: 'sun-08', label: 'Cánh gió mềm', asset: '/assets/flower-variant-8.png', x: 18, y: 72, size: 118, tilt: 6, sway: 4.4, delay: -2.7 },
  { id: 'sun-09', label: 'Nắng ở lại', asset: '/assets/flower-variant-9.png', x: 88, y: 70, size: 132, tilt: -6, sway: 4.9, delay: -0.5 },
  { id: 'sun-10', label: 'Bông cuối cùng', asset: '/assets/flower-variant-10.png', x: 51, y: 45, size: 178, tilt: 0, sway: 6.2, delay: -3.0 },
];

export const decorativeFlowers = Array.from({ length: 44 }, (_, index) => {
  const row = Math.floor(index / 11);
  const col = index % 11;
  const jitterX = ((index * 13) % 9) - 4;
  const jitterY = ((index * 17) % 12) - 6;
  const assetIndex = (index % 10) + 1;

  return {
    id: `decor-${index + 1}`,
    asset: `/assets/flower-variant-${assetIndex}.png`,
    x: 4 + col * 9 + jitterX * 0.35,
    y: 61 + row * 8 + jitterY * 0.25,
    size: 52 + ((index * 19) % 46),
    opacity: 0.42 + ((index * 7) % 28) / 100,
    delay: -((index * 0.37) % 4),
    blur: row < 1 ? 0.6 : 0,
  };
});

export const petals = Array.from({ length: 34 }, (_, index) => ({
  id: `petal-${index + 1}`,
  left: (index * 29) % 100,
  delay: -((index * 0.91) % 18),
  duration: 12 + ((index * 7) % 12),
  scale: 0.48 + ((index * 5) % 11) / 20,
  drift: 90 + ((index * 31) % 180),
  spin: 120 + ((index * 47) % 220),
}));

export const clouds = [
  { id: 'cloud-1', x: 5, y: 13, scale: 1.12, duration: 78, delay: -4 },
  { id: 'cloud-2', x: 36, y: 9, scale: 0.86, duration: 95, delay: -28 },
  { id: 'cloud-3', x: 71, y: 16, scale: 1.35, duration: 115, delay: -51 },
  { id: 'cloud-4', x: 84, y: 7, scale: 0.72, duration: 88, delay: -18 },
];
