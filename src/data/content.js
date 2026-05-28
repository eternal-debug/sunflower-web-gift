const BASE = import.meta.env.BASE_URL;

const asset = (path) => `${BASE}${path.replace(/^\//, '')}`;

export const staticAssets = {
  background: asset('/assets/bg-sunflower-field.png'),
  loadingFlower: asset('/assets/loading-flower-handpainted.png'),
  petal: asset('/assets/petal-handpainted.png'),
  basket: asset('/assets/flower-basket-handpainted.png'),
  letterCard: asset('/assets/love-letter-card-handpainted.png'),
  finalBouquet: asset('/assets/final-bouquet-handpainted.png'),
  cloudFallback: asset('/assets/cloud-soft-01.png'),
};

export const editableContent = {
  eyebrow: 'một cánh đồng nắng nhỏ',
  introLine: 'Nếu hôm nay em mệt, hãy ở lại cánh đồng này một chút nhé.',
  giftTitle: 'Hái nắng cho em',
  helperLine: 'Gợi ý nhỏ: chạm vào những bông hoa có viền sáng mềm.',
  progressLabel: 'Bộ sưu tập nắng',
  emptyHint: 'Chạm vào một bông hoa đang đung đưa để mở lời nhắn đầu tiên.',
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
  src: asset('/audio/classical-loop.mp3'),
  volume: 0.05,
  autoPlay: true,
  autoPlayDelayMs: 220,
  label: 'Nhạc nền cổ điển nhẹ',
};

export const foregroundLayers = [
  {
    id: 'foreground-field',
    kind: 'mid',
    asset: asset('/assets/foreground-field.png'),
    left: 0,
    bottom: -2,
    width: 100,
    opacity: 0.9,
    zIndex: 14,
    parallax: 0.1,
    sway: 1.2,
    delay: -0.4,
  },
  {
    id: 'foreground-near-flowers',
    kind: 'front',
    asset: asset('/assets/foreground-near-flowers.png'),
    left: 0,
    bottom: -5,
    width: 100,
    opacity: 0.28,
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
  { id: 'sun-01', label: 'Một chút nắng', asset: asset('/assets/flower-variant-1.png'), x: 12.6, y: 57.5, size: 146, tilt: -7, sway: 5.2, delay: -0.3, depth: 2 },
  { id: 'sun-02', label: 'Bình yên nhỏ', asset: asset('/assets/flower-variant-2.png'), x: 25.2, y: 64.3, size: 124, tilt: 5, sway: 4.6, delay: -1.1, depth: 3 },
  { id: 'sun-03', label: 'Một hơi thở', asset: asset('/assets/flower-variant-3.png'), x: 36.4, y: 53.1, size: 154, tilt: 2, sway: 5.5, delay: -1.8, depth: 2 },
  { id: 'sun-04', label: 'Ngày chậm lại', asset: asset('/assets/flower-variant-4.png'), x: 47.1, y: 67.2, size: 128, tilt: -9, sway: 4.1, delay: -0.8, depth: 4 },
  { id: 'sun-05', label: 'Dịu dàng', asset: asset('/assets/flower-variant-5.png'), x: 58.1, y: 56.2, size: 164, tilt: 4, sway: 5.8, delay: -2.4, depth: 2 },
  { id: 'sun-06', label: 'Không cần vội', asset: asset('/assets/flower-variant-6.png'), x: 69.3, y: 65.1, size: 126, tilt: 8, sway: 4.8, delay: -1.6, depth: 3 },
  { id: 'sun-07', label: 'Một nụ cười', asset: asset('/assets/flower-variant-7.png'), x: 79.4, y: 54.2, size: 152, tilt: -4, sway: 5.1, delay: -2.1, depth: 2 },
  { id: 'sun-08', label: 'Cánh gió mềm', asset: asset('/assets/flower-variant-8.png'), x: 18.2, y: 72.4, size: 118, tilt: 6, sway: 4.4, delay: -2.7, depth: 4 },
  { id: 'sun-09', label: 'Nắng ở lại', asset: asset('/assets/flower-variant-9.png'), x: 88.3, y: 70.2, size: 132, tilt: -6, sway: 4.9, delay: -0.5, depth: 4 },
  { id: 'sun-10', label: 'Bông cuối cùng', asset: asset('/assets/flower-variant-10.png'), x: 51.2, y: 45.4, size: 178, tilt: 0, sway: 6.2, delay: -3.0, depth: 1 },
];

export const decorativeFlowers = Array.from({ length: 24 }, (_, index) => {
  const row = Math.floor(index / 8);
  const col = index % 8;
  const jitterX = ((index * 13) % 11) - 5;
  const jitterY = ((index * 17) % 13) - 6;
  const assetIndex = (index % 10) + 1;

  return {
    id: `decor-${index + 1}`,
    asset: asset(`/assets/flower-variant-${assetIndex}.png`),
    x: 7.2 + col * 12.2 + jitterX * 0.28,
    y: 62.5 + row * 8.6 + jitterY * 0.2,
    size: 30 + ((index * 19) % 42),
    opacity: 0.16 + ((index * 7) % 18) / 100,
    delay: -((index * 0.37) % 5.2),
    blur: row < 1 ? 0.8 : row > 2 ? 0 : 0.25,
    depth: row + 1,
  };
});

export const petals = Array.from({ length: 18 }, (_, index) => ({
  id: `petal-${index + 1}`,
  left: (index * 23) % 100,
  delay: -((index * 0.91) % 22),
  duration: 13 + ((index * 7) % 14),
  scale: 0.42 + ((index * 5) % 13) / 22,
  drift: 80 + ((index * 31) % 220),
  gust: 90 + ((index * 43) % 210),
  wave: 30 + ((index * 37) % 78),
  spin: 120 + ((index * 47) % 260),
  startRotate: -45 + ((index * 29) % 90),
}));

export const clouds = [
  { id: 'cloud-1', asset: asset('/assets/cloud-soft-01.png'), x: 3, y: 10, width: 330, scale: 1.02, duration: 86, delay: -4, opacity: 0.78 },
  { id: 'cloud-2', asset: asset('/assets/cloud-soft-02.png'), x: 32, y: 7, width: 292, scale: 0.9, duration: 105, delay: -28, opacity: 0.68 },
  { id: 'cloud-3', asset: asset('/assets/cloud-soft-03.png'), x: 66, y: 15, width: 390, scale: 1.12, duration: 124, delay: -51, opacity: 0.64 },
  { id: 'cloud-4', asset: asset('/assets/cloud-soft-04.png'), x: 83, y: 6, width: 260, scale: 0.78, duration: 92, delay: -18, opacity: 0.7 },
  { id: 'cloud-5', asset: asset('/assets/cloud-soft-05.png'), x: -12, y: 20, width: 420, scale: 1.16, duration: 138, delay: -76, opacity: 0.46 },
];

export const sparkleDust = Array.from({ length: 18 }, (_, index) => ({
  id: `dust-${index + 1}`,
  left: (index * 37) % 100,
  top: 10 + ((index * 19) % 70),
  delay: -((index * 0.67) % 10),
  duration: 5 + ((index * 11) % 8),
  scale: 0.54 + ((index * 3) % 9) / 10,
}));
