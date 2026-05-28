import { useEffect, useMemo, useRef, useState } from 'react';
import {
  audioSettings,
  clouds,
  decorativeFlowers,
  editableContent,
  flowerQuotes,
  foregroundLayers,
  interactiveFlowers,
  petals,
  sparkleDust,
  staticAssets,
} from './data/content.js';
import { clearGameState, loadGameState, saveGameState } from './utils/storage.js';

const TOTAL_FLOWERS = interactiveFlowers.length;
const IDLE_HINT_DELAY_MS = 20000;

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createFreshGame() {
  const shuffledQuotes = shuffle(flowerQuotes);
  const quoteByFlowerId = Object.fromEntries(
    interactiveFlowers.map((flower, index) => [flower.id, shuffledQuotes[index]])
  );

  return {
    quoteByFlowerId,
    collectedIds: [],
    completed: false,
    hasSeenFinal: false,
    createdAt: Date.now(),
  };
}

function ArtImage({ src, alt = '', className = '', fallbackClassName = '', ...props }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <span className={`painted-fallback ${fallbackClassName}`} aria-hidden="true" {...props} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      draggable="false"
      onError={() => setHasError(true)}
      {...props}
    />
  );
}

function LoadingScreen() {
  return (
    <div className="loading-screen" aria-live="polite">
      <div className="loading-card">
        <span className="loading-glow" aria-hidden="true" />
        <ArtImage src={staticAssets.loadingFlower} className="loading-flower" fallbackClassName="fallback-flower" />
        <p className="loading-kicker">opening a handmade field</p>
        <h2>Đang mở cánh đồng nhỏ...</h2>
        <div className="loading-line" aria-hidden="true"><span /></div>
      </div>
    </div>
  );
}

function CurtainReveal() {
  return (
    <div className="curtain-reveal" aria-hidden="true">
      <div className="curtain-panel curtain-panel-left" />
      <div className="curtain-panel curtain-panel-right" />
      <div className="curtain-lift" />
      <div className="curtain-sunburst" />
    </div>
  );
}

function AmbientDust() {
  return (
    <div className="ambient-dust" aria-hidden="true">
      {sparkleDust.map((dust) => (
        <span
          key={dust.id}
          className="dust-mote"
          style={{
            left: `${dust.left}%`,
            top: `${dust.top}%`,
            '--dust-delay': `${dust.delay}s`,
            '--dust-duration': `${dust.duration}s`,
            '--dust-scale': dust.scale,
          }}
        />
      ))}
    </div>
  );
}

function CloudsLayer() {
  return (
    <div className="clouds-layer" aria-hidden="true">
      {clouds.map((cloud) => (
        <span
          key={cloud.id}
          className="cloud-wrap"
          style={{
            '--cloud-x': `${cloud.x}%`,
            '--cloud-y': `${cloud.y}%`,
            '--cloud-width': `${cloud.width}px`,
            '--cloud-scale': cloud.scale,
            '--cloud-duration': `${cloud.duration}s`,
            '--cloud-delay': `${cloud.delay}s`,
            '--cloud-opacity': cloud.opacity,
          }}
        >
          <ArtImage src={cloud.asset} className="cloud cloud-art" fallbackClassName="fallback-cloud" />
        </span>
      ))}
    </div>
  );
}

function PetalsLayer() {
  return (
    <div className="petals-layer" aria-hidden="true">
      <span className="wind-ribbon wind-ribbon-1" />
      <span className="wind-ribbon wind-ribbon-2" />
      <span className="wind-ribbon wind-ribbon-3" />
      {petals.map((petal) => (
        <ArtImage
          key={petal.id}
          src={staticAssets.petal}
          className="floating-petal"
          fallbackClassName="fallback-petal"
          style={{
            '--petal-left': `${petal.left}%`,
            '--petal-delay': `${petal.delay}s`,
            '--petal-duration': `${petal.duration}s`,
            '--petal-scale': petal.scale,
            '--petal-drift': `${petal.drift}px`,
            '--petal-gust': `${petal.gust}px`,
            '--petal-wave': `${petal.wave}px`,
            '--petal-spin': `${petal.spin}deg`,
            '--petal-start-rotate': `${petal.startRotate}deg`,
          }}
        />
      ))}
    </div>
  );
}

function DecorativeField() {
  return (
    <div className="decorative-field" aria-hidden="true">
      {decorativeFlowers.map((flower) => (
        <img
          key={flower.id}
          src={flower.asset}
          alt=""
          className={`decorative-flower decorative-depth-${flower.depth}`}
          draggable="false"
          style={{
            left: `${flower.x}%`,
            top: `${flower.y}%`,
            width: `${flower.size}px`,
            opacity: flower.opacity,
            filter: `blur(${flower.blur}px)`,
            '--decor-delay': `${flower.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function ForegroundLayers() {
  return (
    <div className="foreground-layers" aria-hidden="true">
      {foregroundLayers.map((layer) => (
        <img
          key={layer.id}
          src={layer.asset}
          alt=""
          className={`foreground-layer foreground-layer-${layer.kind ?? 'mid'}`}
          draggable="false"
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
          style={{
            left: `${layer.left}%`,
            bottom: `${layer.bottom}%`,
            width: `${layer.width}%`,
            opacity: layer.opacity,
            zIndex: layer.zIndex,
            '--foreground-parallax': layer.parallax,
            '--foreground-sway': `${layer.sway ?? 1.6}deg`,
            '--foreground-delay': `${layer.delay ?? 0}s`,
          }}
        />
      ))}
    </div>
  );
}

function Flower({ flower, collected, quote, onPick }) {
  if (collected) {
    return (
      <div
        className={`flower-empty-spot flower-depth-${flower.depth}`}
        style={{
          left: `${flower.x}%`,
          top: `${flower.y + 10}%`,
          width: `${flower.size * 0.46}px`,
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <button
      id={`flower-${flower.id}`}
      className={`flower-button flower-depth-${flower.depth}`}
      type="button"
      aria-label={`Hái bông hoa: ${flower.label}. Lời nhắn: ${quote}`}
      onClick={() => onPick(flower)}
      style={{
        left: `${flower.x}%`,
        top: `${flower.y}%`,
        width: `${flower.size}px`,
        '--flower-tilt': `${flower.tilt}deg`,
        '--sway-amount': `${flower.sway}deg`,
        '--sway-delay': `${flower.delay}s`,
      }}
      title={quote}
    >
      <span className="flower-touch-ring" aria-hidden="true" />
      <img src={flower.asset} alt="" draggable="false" />
      <span className="flower-aura" />
      <span className="flower-label-pop">{flower.label}</span>
    </button>
  );
}

function ProgressHud({ count, total, collectedIds, onOpenInventory }) {
  const percent = Math.round((count / total) * 100);
  const collectedSet = useMemo(() => new Set(collectedIds), [collectedIds]);

  return (
    <aside className="progress-hud" aria-label="Tiến trình hái hoa">
      <button type="button" className="progress-card" onClick={onOpenInventory}>
        <span className="progress-card-kicker">{editableContent.progressLabel}</span>
        <strong>{count}/{total}</strong>
        <span className="progress-bar" aria-hidden="true"><span style={{ width: `${percent}%` }} /></span>
      </button>
      <div className="progress-orbs" aria-hidden="true">
        {interactiveFlowers.map((flower, index) => (
          <span
            key={flower.id}
            className={`progress-orb ${collectedSet.has(flower.id) ? 'progress-orb-done' : ''}`}
            style={{ '--orb-delay': `${index * 80}ms` }}
          />
        ))}
      </div>
    </aside>
  );
}

function QuoteCard({ flower, quote, onKeep, onClose }) {
  const lines = quote.split(/(?<=[.!?。])\s+/).filter(Boolean);

  return (
    <div className="quote-backdrop" role="dialog" aria-modal="true" aria-labelledby="quote-title">
      <article className="quote-card">
        <button className="soft-close" type="button" onClick={onClose} aria-label="Đóng lời nhắn">×</button>
        <div id={`quote-flower-anchor-${flower.id}`} className="quote-card-flower-wrap">
          <img src={flower.asset} alt="" className="quote-card-flower" draggable="false" />
        </div>
        <p id="quote-title" className="quote-kicker">{flower.label}</p>
        <div className="quote-lines">
          {lines.map((line, index) => (
            <p key={`${line}-${index}`} style={{ animationDelay: `${index * 120 + 120}ms` }}>{line}</p>
          ))}
        </div>
        <div className="quote-actions">
          <button className="primary-note-button" type="button" onClick={onKeep}>
            Giữ bông hoa này
          </button>
          <button className="ghost-note-button" type="button" onClick={onClose}>
            Đọc lại sau
          </button>
        </div>
      </article>
    </div>
  );
}

function FlyingFlower({ flight, onDone }) {
  return (
    <img
      src={flight.asset}
      alt=""
      className="flying-flower"
      draggable="false"
      onAnimationEnd={onDone}
      style={{
        left: `${flight.startX}px`,
        top: `${flight.startY}px`,
        width: `${flight.width}px`,
        '--fly-mid-x': `${flight.midX}px`,
        '--fly-mid-y': `${flight.midY}px`,
        '--fly-end-x': `${flight.endX}px`,
        '--fly-end-y': `${flight.endY}px`,
      }}
    />
  );
}

function InventoryBag({ count, total, onOpen, bagRef, pulse }) {
  return (
    <button
      ref={bagRef}
      type="button"
      className={`inventory-bag ${pulse ? 'inventory-bag-pulse' : ''}`}
      onClick={onOpen}
      aria-label={`Mở rổ hoa, đã hái ${count} trên ${total} bông`}
    >
      <span className="bag-glow" />
      <ArtImage src={staticAssets.basket} className="basket-art" fallbackClassName="fallback-basket" />
      <span className="bag-count">{count}/{total}</span>
    </button>
  );
}

function AudioControl({ shouldAutoPlay }) {
  const audioRef = useRef(null);
  const hasTriedAutoPlay = useRef(false);
  const fadeTimer = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioStatus, setAudioStatus] = useState('ready');

  function fadeVolume(targetVolume = audioSettings.volume ?? 0.32) {
    const audio = audioRef.current;
    if (!audio) return;

    window.clearInterval(fadeTimer.current);
    const startVolume = Number.isFinite(audio.volume) ? audio.volume : 0;
    const steps = 18;
    let step = 0;

    fadeTimer.current = window.setInterval(() => {
      step += 1;
      const progress = Math.min(step / steps, 1);
      audio.volume = startVolume + (targetVolume - startVolume) * progress;

      if (progress >= 1) {
        window.clearInterval(fadeTimer.current);
      }
    }, 70);
  }

  async function startAudio({ fromUserGesture = false } = {}) {
    const audio = audioRef.current;
    if (!audio || audioStatus === 'missing') return;

    try {
      audio.loop = true;
      audio.muted = false;
      audio.volume = fromUserGesture ? 0 : Math.min(audioSettings.volume ?? 0.32, 0.18);
      setAudioStatus('ready');
      await audio.play();
      setIsPlaying(true);
      fadeVolume(audioSettings.volume ?? 0.32);
    } catch {
      if (audio.error) {
        setAudioStatus('missing');
      } else {
        setAudioStatus(fromUserGesture ? 'ready' : 'blocked');
      }
      setIsPlaying(false);
    }
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0;
    }

    return () => {
      window.clearInterval(fadeTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!audioSettings.autoPlay || !shouldAutoPlay || hasTriedAutoPlay.current) return;

    hasTriedAutoPlay.current = true;
    const timer = window.setTimeout(() => {
      startAudio();
    }, audioSettings.autoPlayDelayMs ?? 250);

    return () => window.clearTimeout(timer);
  }, [shouldAutoPlay]);

  useEffect(() => {
    if (audioStatus !== 'blocked' || isPlaying) return undefined;

    const unlockAudio = () => {
      startAudio({ fromUserGesture: true });
    };

    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('click', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });

    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, [audioStatus, isPlaying]);

  async function toggleAudio() {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    await startAudio({ fromUserGesture: true });
  }

  const buttonLabel =
    audioStatus === 'missing'
      ? 'Thêm nhạc'
      : isPlaying
        ? 'Tắt nhạc'
        : audioStatus === 'blocked'
          ? 'Bấm để bật nhạc'
          : 'Tắt nhạc';

  return (
    <div className={`audio-control ${audioStatus === 'blocked' ? 'audio-needs-gesture' : ''}`}>
      <audio
        ref={audioRef}
        src={audioSettings.src}
        loop
        autoPlay={audioSettings.autoPlay}
        playsInline
        preload="auto"
        onCanPlay={() => {
          if (audioStatus === 'missing') setAudioStatus('ready');
        }}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onError={() => setAudioStatus('missing')}
      />
      <button
        type="button"
        onClick={toggleAudio}
        aria-pressed={isPlaying}
        title={audioStatus === 'missing' ? `Đặt file nhạc tại ${audioSettings.src}` : audioSettings.label}
      >
        <span aria-hidden="true">{isPlaying ? '♪' : '♫'}</span>
        {buttonLabel}
      </button>
    </div>
  );
}

function FlowerMemoryPopup({ flower, quote, onClose }) {
  if (!flower) return null;

  return (
    <div className="memory-popup-backdrop" role="dialog" aria-modal="true" aria-labelledby="memory-title">
      <article className="memory-popup-card">
        <button className="soft-close" type="button" onClick={onClose} aria-label="Đóng lời nhắn">×</button>
        <div className="memory-flower-stage" aria-hidden="true">
          <img src={flower.asset} alt="" draggable="false" />
        </div>
        <p className="modal-kicker">lời nhắn trong hoa</p>
        <h2 id="memory-title">{flower.label}</h2>
        <p className="memory-quote">“{quote}”</p>
        <button className="primary-note-button" type="button" onClick={onClose}>Quay lại rổ hoa</button>
      </article>
    </div>
  );
}

function InventoryModal({ collectedFlowers, onOpenFlower, onClose }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="inventory-title">
      <section className="inventory-modal inventory-modal-grid-only">
        <header className="modal-header">
          <div>
            <p className="modal-kicker">keepsake album</p>
            <h2 id="inventory-title">Rổ hoa nhỏ của em</h2>
          </div>
          <button className="soft-close" type="button" onClick={onClose} aria-label="Đóng rổ hoa">×</button>
        </header>

        {collectedFlowers.length === 0 ? (
          <div className="empty-inventory">
            <ArtImage src={staticAssets.basket} className="empty-basket-art" fallbackClassName="fallback-basket" />
            <p>{editableContent.emptyHint}</p>
          </div>
        ) : (
          <>
            <p className="inventory-helper">Chạm vào từng bông để mở lại lời chúc.</p>
            <div className="flower-grid flower-grid-only" aria-label="Những bông hoa đã hái">
              {collectedFlowers.map((flower, index) => (
                <button
                  key={flower.id}
                  type="button"
                  className="flower-item"
                  onClick={() => onOpenFlower(flower.id)}
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <img src={flower.asset} alt="" draggable="false" />
                  <span>{flower.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function FinalGiftSequence({ onClose, onOpenInventory, onRestart }) {
  const [stage, setStage] = useState('bouquet');
  const [letterTilt, setLetterTilt] = useState({ rotateX: 0, rotateY: 0, dragging: false });
  const letterDraggingRef = useRef(false);
  const letterResetTimer = useRef(null);
  const paragraphs = editableContent.finalMessage.split('\n').filter((line) => line.trim().length > 0);
  const isLetterStage = stage === 'letter';

  useEffect(() => () => {
    window.clearTimeout(letterResetTimer.current);
  }, []);

  function updateLetterTilt(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;
    const normalizedX = Math.max(-1, Math.min(1, (event.clientX - centerX) / (bounds.width / 2)));
    const normalizedY = Math.max(-1, Math.min(1, (event.clientY - centerY) / (bounds.height / 2)));

    setLetterTilt({
      rotateX: Number((-normalizedY * 18).toFixed(2)),
      rotateY: Number((normalizedX * 22).toFixed(2)),
      dragging: true,
    });
  }

  function resetLetterTilt() {
    letterDraggingRef.current = false;
    window.clearTimeout(letterResetTimer.current);
    setLetterTilt({ rotateX: 0, rotateY: 0, dragging: false });
  }

  function handleLetterPointerDown(event) {
    window.clearTimeout(letterResetTimer.current);
    letterDraggingRef.current = true;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    updateLetterTilt(event);
  }

  function handleLetterPointerMove(event) {
    if (!letterDraggingRef.current) return;
    updateLetterTilt(event);
  }

  function handleLetterKeyDown(event) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    window.clearTimeout(letterResetTimer.current);
    setLetterTilt({ rotateX: -10, rotateY: 16, dragging: true });
    letterResetTimer.current = window.setTimeout(resetLetterTilt, 520);
  }

  return (
    <div
      className={`final-backdrop final-backdrop-${stage}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={isLetterStage ? 'final-title' : 'final-bouquet-title'}
    >
      <section className={`final-card final-card-${stage}`}>
        {!isLetterStage ? (
          <button
            type="button"
            id="final-bouquet-title"
            className="final-bouquet-button"
            onClick={() => setStage('letter')}
            aria-label="Mở lá thư trong bó hoa"
          >
            <ArtImage
              src={staticAssets.finalBouquet}
              className="final-bouquet-art"
              fallbackClassName="fallback-final-bouquet"
            />
          </button>
        ) : (
          <>
            <div
              className={`letter-3d-object ${letterTilt.dragging ? 'letter-3d-object-dragging' : ''}`}
              role="group"
              tabIndex={0}
              aria-label="Tấm thư có thể chạm và kéo để xoay nhẹ"
              onPointerDown={handleLetterPointerDown}
              onPointerMove={handleLetterPointerMove}
              onPointerUp={resetLetterTilt}
              onPointerCancel={resetLetterTilt}
              onLostPointerCapture={resetLetterTilt}
              onKeyDown={handleLetterKeyDown}
              onContextMenu={(event) => event.preventDefault()}
              onDragStart={(event) => event.preventDefault()}
              style={{
                '--letter-tilt-x': `${letterTilt.rotateX}deg`,
                '--letter-tilt-y': `${letterTilt.rotateY}deg`,
              }}
            >
              <article className="letter-card">
                <ArtImage src={staticAssets.letterCard} className="letter-art" fallbackClassName="fallback-letter" />
                <div className="letter-scroll">
                  <div className="letter-text">
                    <p className="modal-kicker">final gift</p>
                    <h2 id="final-title">{editableContent.finalTitle}</h2>
                    {paragraphs.map((paragraph, index) => (
                      <p key={`${paragraph}-${index}`} style={{ animationDelay: `${index * 90 + 120}ms` }}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </article>
            </div>

            <div className="final-actions final-actions-letter">
              <button type="button" className="primary-note-button" onClick={onClose}>Ngắm thêm</button>
              <button type="button" className="secondary-note-button" onClick={onOpenInventory}>Mở rổ hoa</button>
              <button type="button" className="secondary-note-button" onClick={onRestart}>Bắt đầu lại</button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function LivingArtworkControls({ onReplayFinal, onOpenInventory, onRestart }) {
  return (
    <div className="living-controls" aria-label="Tùy chọn sau khi hoàn thành">
      <button type="button" onClick={onReplayFinal}>Đọc lại lời nhắn</button>
      <button type="button" onClick={onOpenInventory}>Mở rổ hoa</button>
      <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Ngắm thêm một chút</button>
      <button type="button" onClick={onRestart}>Bắt đầu lại</button>
    </div>
  );
}

function ViewUiToggle({ hidden, onToggle }) {
  return (
    <button
      type="button"
      className={`view-ui-toggle ${hidden ? 'view-ui-toggle-restore' : ''}`}
      onClick={onToggle}
      aria-pressed={hidden}
      aria-label={hidden ? 'Hiện lại giao diện' : 'Ẩn giao diện để ngắm cánh đồng'}
    >
      <span aria-hidden="true">{hidden ? '☀' : '◌'}</span>
      {hidden ? 'Hiện UI' : 'Ẩn UI'}
    </button>
  );
}

function TapHint({ visible }) {
  if (!visible) return null;

  return (
    <div className="tap-hint" aria-live="polite">
      <span className="tap-hint-ring" aria-hidden="true" />
      <span>{editableContent.helperLine}</span>
    </div>
  );
}

function App() {
  const [phase, setPhase] = useState('loading');
  const [game, setGame] = useState(() => loadGameState() ?? createFreshGame());
  const [activeFlower, setActiveFlower] = useState(null);
  const [flight, setFlight] = useState(null);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [selectedInventoryId, setSelectedInventoryId] = useState(null);
  const [memoryFlowerId, setMemoryFlowerId] = useState(null);
  const [showFinal, setShowFinal] = useState(false);
  const [bagPulse, setBagPulse] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [idleHintVisible, setIdleHintVisible] = useState(false);
  const [interactionNonce, setInteractionNonce] = useState(0);
  const [uiHidden, setUiHidden] = useState(false);
  const bagRef = useRef(null);

  useEffect(() => {
    const loadingTimer = window.setTimeout(() => setPhase('curtain'), 1500);
    const revealTimer = window.setTimeout(() => setPhase('ready'), 3100);
    return () => {
      window.clearTimeout(loadingTimer);
      window.clearTimeout(revealTimer);
    };
  }, []);

  useEffect(() => {
    saveGameState(game);
  }, [game]);

  useEffect(() => {
    function markUserInteraction() {
      setIdleHintVisible(false);
      setInteractionNonce((value) => value + 1);
    }

    window.addEventListener('pointerdown', markUserInteraction, { passive: true });
    window.addEventListener('keydown', markUserInteraction);

    return () => {
      window.removeEventListener('pointerdown', markUserInteraction);
      window.removeEventListener('keydown', markUserInteraction);
    };
  }, []);

  useEffect(() => {
    const canShowIdleHint =
      phase === 'ready' &&
      game.collectedIds.length < TOTAL_FLOWERS &&
      !game.completed &&
      !activeFlower &&
      !flight &&
      !inventoryOpen &&
      !showFinal &&
      !uiHidden;

    setIdleHintVisible(false);

    if (!canShowIdleHint) return undefined;

    const timer = window.setTimeout(() => {
      setIdleHintVisible(true);
    }, IDLE_HINT_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [phase, game.collectedIds.length, game.completed, activeFlower, flight, inventoryOpen, showFinal, uiHidden, interactionNonce]);

  const collectedSet = useMemo(() => new Set(game.collectedIds), [game.collectedIds]);
  const collectedFlowers = useMemo(
    () => interactiveFlowers.filter((flower) => collectedSet.has(flower.id)),
    [collectedSet]
  );

  const memoryFlower = useMemo(
    () => collectedFlowers.find((flower) => flower.id === memoryFlowerId) ?? null,
    [collectedFlowers, memoryFlowerId]
  );

  const sceneStyle = {
    '--parallax-x': `${mouse.x * 10}px`,
    '--parallax-y': `${mouse.y * 6}px`,
    '--scene-bg': `url("${staticAssets.background}")`,
  };

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setActiveFlower(null);
        setInventoryOpen(false);
        setMemoryFlowerId(null);
        if (showFinal) setShowFinal(false);
      }

      if (event.key.toLowerCase() === 'h' && !activeFlower && !showFinal && !inventoryOpen) {
        setUiHidden((value) => !value);
      }

      if (event.key.toLowerCase() === 'i' && !activeFlower && !showFinal && !uiHidden) {
        setInventoryOpen(true);
        setSelectedInventoryId(collectedFlowers[0]?.id ?? null);
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeFlower, collectedFlowers, inventoryOpen, showFinal, uiHidden]);

  function handleMouseMove(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    setMouse({ x, y });
  }

  function handlePick(flower) {
    if (activeFlower || flight || collectedSet.has(flower.id)) return;
    if (uiHidden) setUiHidden(false);
    setActiveFlower(flower);
  }

  function handleKeepFlower() {
    if (!activeFlower) return;

    const pickedFlower = activeFlower;
    const quoteAnchor = document.getElementById(`quote-flower-anchor-${pickedFlower.id}`);
    const fieldFlowerEl = document.getElementById(`flower-${pickedFlower.id}`);
    const bagEl = bagRef.current;
    const startRect = quoteAnchor?.getBoundingClientRect() ?? fieldFlowerEl?.getBoundingClientRect();
    const bagRect = bagEl?.getBoundingClientRect();
    const willComplete = !game.collectedIds.includes(pickedFlower.id) && game.collectedIds.length + 1 === TOTAL_FLOWERS;

    // The original field flower is already hidden while the quote is open.
    // On keep, commit it to the basket immediately, then fly a separate clone
    // from the visible quote flower into the basket so the reward animation is
    // never lost.
    setGame((current) => {
      if (current.collectedIds.includes(pickedFlower.id)) return current;

      const nextCollected = [...current.collectedIds, pickedFlower.id];
      const completed = nextCollected.length === TOTAL_FLOWERS;

      return {
        ...current,
        collectedIds: nextCollected,
        completed,
        hasSeenFinal: completed ? true : current.hasSeenFinal,
      };
    });

    if (startRect && bagRect) {
      const flightWidth = Math.max(84, Math.min(150, pickedFlower.size * 0.66));
      const startCenterX = startRect.left + startRect.width / 2;
      const startCenterY = startRect.top + startRect.height / 2;
      const bagCenterX = bagRect.left + bagRect.width / 2;
      const bagCenterY = bagRect.top + bagRect.height / 2;
      const startX = startCenterX - flightWidth / 2;
      const startY = startCenterY - flightWidth / 2;
      const endX = bagCenterX - startCenterX;
      const endY = bagCenterY - startCenterY;

      setFlight({
        id: pickedFlower.id,
        asset: pickedFlower.asset,
        startX,
        startY,
        endX,
        endY,
        midX: endX * 0.46,
        midY: Math.min(endY * 0.32 - 150, -115),
        width: flightWidth,
        completed: willComplete,
      });
    } else {
      setBagPulse(true);
      window.setTimeout(() => setBagPulse(false), 850);
      if (willComplete) {
        window.setTimeout(() => setShowFinal(true), 650);
      }
    }

    setActiveFlower(null);
  }

  function finishFlight() {
    if (!flight) return;

    const completedAfterFlight = flight.completed;

    setFlight(null);
    setBagPulse(true);
    window.setTimeout(() => setBagPulse(false), 850);

    if (completedAfterFlight) {
      window.setTimeout(() => setShowFinal(true), 650);
    }
  }

  function closeFinal() {
    setShowFinal(false);
    setGame((current) => ({ ...current, hasSeenFinal: true }));
  }

  function openInventory() {
    setInventoryOpen(true);
    setSelectedInventoryId(collectedFlowers[0]?.id ?? null);
  }

  function restartGame() {
    clearGameState();
    setGame(createFreshGame());
    setActiveFlower(null);
    setFlight(null);
    setInventoryOpen(false);
    setSelectedInventoryId(null);
    setMemoryFlowerId(null);
    setShowFinal(false);
    setIdleHintVisible(false);
    setInteractionNonce((value) => value + 1);
    setUiHidden(false);
  }

  const completeScene = game.completed;

  return (
    <>
      {phase === 'loading' && <LoadingScreen />}

      <main
        className={`app-shell ${completeScene ? 'scene-completed' : ''} ${idleHintVisible ? 'idle-hint-visible' : ''} ${uiHidden ? 'ui-hidden' : ''}`}
        onMouseMove={handleMouseMove}
        style={sceneStyle}
      >
        <section className="hero-copy" aria-label="Lời mở đầu">
          <p className="eyebrow">{editableContent.eyebrow}</p>
          <h1>{editableContent.giftTitle}</h1>
          <p>{editableContent.introLine}</p>
          <div className="hero-progress" aria-hidden="true">
            <span style={{ width: `${(game.collectedIds.length / TOTAL_FLOWERS) * 100}%` }} />
          </div>
        </section>


        <div className="sun-layer" />
        <CloudsLayer />
        <AmbientDust />
        <div className="field-readability-layer" aria-hidden="true" />
        <DecorativeField />
        <ForegroundLayers />

        <section className="interactive-field" aria-label="Cánh đồng hoa tương tác">
          {interactiveFlowers.map((flower) => (
            <Flower
              key={flower.id}
              flower={flower}
              collected={collectedSet.has(flower.id) || flight?.id === flower.id || activeFlower?.id === flower.id}
              quote={game.quoteByFlowerId[flower.id]}
              onPick={handlePick}
            />
          ))}
        </section>

        {completeScene && !showFinal && !flight && (
          <div className="completed-bouquet" aria-hidden="true">
            <ArtImage
              src={staticAssets.finalBouquet}
              className="completed-bouquet-art"
              fallbackClassName="fallback-final-bouquet"
            />
          </div>
        )}

        <PetalsLayer />
        <TapHint visible={idleHintVisible} />

        <InventoryBag
          count={game.collectedIds.length}
          total={TOTAL_FLOWERS}
          onOpen={openInventory}
          bagRef={bagRef}
          pulse={bagPulse || showFinal}
        />

        <AudioControl shouldAutoPlay={phase === 'ready'} />

        <ViewUiToggle hidden={uiHidden} onToggle={() => setUiHidden((value) => !value)} />

        {completeScene && !showFinal && !uiHidden && !flight && (
          <LivingArtworkControls
            onReplayFinal={() => setShowFinal(true)}
            onOpenInventory={openInventory}
            onRestart={restartGame}
          />
        )}
      </main>

      {phase === 'curtain' && <CurtainReveal />}

      {activeFlower && (
        <QuoteCard
          flower={activeFlower}
          quote={game.quoteByFlowerId[activeFlower.id]}
          onKeep={handleKeepFlower}
          onClose={() => setActiveFlower(null)}
        />
      )}

      {flight && <FlyingFlower flight={flight} onDone={finishFlight} />}

      {inventoryOpen && (
        <InventoryModal
          collectedFlowers={collectedFlowers}
          onOpenFlower={(flowerId) => {
            setSelectedInventoryId(flowerId);
            setMemoryFlowerId(flowerId);
          }}
          onClose={() => {
            setInventoryOpen(false);
            setMemoryFlowerId(null);
          }}
        />
      )}

      {memoryFlower && (
        <FlowerMemoryPopup
          flower={memoryFlower}
          quote={game.quoteByFlowerId[memoryFlower.id]}
          onClose={() => setMemoryFlowerId(null)}
        />
      )}

      {showFinal && (
        <FinalGiftSequence
          onClose={closeFinal}
          onOpenInventory={() => {
            setShowFinal(false);
            openInventory();
          }}
          onRestart={restartGame}
        />
      )}
    </>
  );
}

export default App;
