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
  staticAssets,
} from './data/content.js';
import { clearGameState, loadGameState, saveGameState } from './utils/storage.js';

const TOTAL_FLOWERS = interactiveFlowers.length;

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

function LoadingScreen() {
  return (
    <div className="loading-screen" aria-live="polite">
      <div className="loading-card">
        <img src={staticAssets.loadingFlower} alt="" className="loading-flower" />
        <p>Đang mở cánh đồng nhỏ...</p>
        <div className="loading-line"><span /></div>
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
    </div>
  );
}

function CloudsLayer() {
  return (
    <div className="clouds-layer" aria-hidden="true">
      {clouds.map((cloud) => (
        <span
          key={cloud.id}
          className="cloud"
          style={{
            '--cloud-x': `${cloud.x}%`,
            '--cloud-y': `${cloud.y}%`,
            '--cloud-scale': cloud.scale,
            '--cloud-duration': `${cloud.duration}s`,
            '--cloud-delay': `${cloud.delay}s`,
          }}
        />
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
        <img
          key={petal.id}
          src={staticAssets.petal}
          alt=""
          className="floating-petal"
          style={{
            '--petal-left': `${petal.left}%`,
            '--petal-delay': `${petal.delay}s`,
            '--petal-duration': `${petal.duration}s`,
            '--petal-scale': petal.scale,
            '--petal-drift': `${petal.drift}px`,
            '--petal-gust': `${petal.gust ?? 120}px`,
            '--petal-wave': `${petal.wave ?? 42}px`,
            '--petal-spin': `${petal.spin}deg`,
            '--petal-start-rotate': `${petal.startRotate ?? 0}deg`,
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
          className="decorative-flower"
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
        className="flower-empty-spot"
        style={{
          left: `${flower.x}%`,
          top: `${flower.y + 10}%`,
          width: `${flower.size * 0.45}px`,
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <button
      id={`flower-${flower.id}`}
      className="flower-button"
      type="button"
      aria-label={`Hái bông hoa: ${flower.label}`}
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
      <img src={flower.asset} alt="" draggable="false" />
      <span className="flower-aura" />
    </button>
  );
}

function QuoteCard({ flower, quote, onKeep, onClose }) {
  const lines = quote.split(/(?<=[.!?。])\s+/).filter(Boolean);

  return (
    <div className="quote-backdrop" role="dialog" aria-modal="true" aria-labelledby="quote-title">
      <article className="quote-card">
        <button className="soft-close" type="button" onClick={onClose} aria-label="Đóng lời nhắn">×</button>
        <div className="quote-card-flower-wrap">
          <img src={flower.asset} alt="" className="quote-card-flower" />
        </div>
        <p id="quote-title" className="quote-kicker">{flower.label}</p>
        <div className="quote-lines">
          {lines.map((line, index) => (
            <p key={`${line}-${index}`} style={{ animationDelay: `${index * 120 + 120}ms` }}>{line}</p>
          ))}
        </div>
        <button className="primary-note-button" type="button" onClick={onKeep}>
          Giữ bông hoa này
        </button>
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
      aria-label={`Mở túi hoa, đã hái ${count} trên ${total} bông`}
    >
      <span className="bag-glow" />
      <img src={staticAssets.bag} alt="" />
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
      // Browsers usually block audible autoplay until the visitor interacts with the page.
      // The app keeps trying once, then unlocks the music on the first click/key press anywhere.
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
          : 'Nhạc tự bật';

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

function InventoryModal({ collectedFlowers, quoteByFlowerId, selectedId, onSelect, onClose }) {
  const selectedFlower = collectedFlowers.find((flower) => flower.id === selectedId) ?? collectedFlowers[0] ?? null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="inventory-title">
      <section className="inventory-modal">
        <header className="modal-header">
          <div>
            <p className="modal-kicker">keepsake album</p>
            <h2 id="inventory-title">Túi hoa nhỏ của em</h2>
          </div>
          <button className="soft-close" type="button" onClick={onClose} aria-label="Đóng túi hoa">×</button>
        </header>

        {collectedFlowers.length === 0 ? (
          <div className="empty-inventory">
            <img src={staticAssets.bag} alt="" />
            <p>Túi còn trống. Hãy thử hái một bông hướng dương đầu tiên.</p>
          </div>
        ) : (
          <div className="inventory-content">
            <div className="flower-grid" aria-label="Những bông hoa đã hái">
              {collectedFlowers.map((flower, index) => (
                <button
                  key={flower.id}
                  type="button"
                  className={`flower-item ${selectedFlower?.id === flower.id ? 'flower-item-active' : ''}`}
                  onClick={() => onSelect(flower.id)}
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <img src={flower.asset} alt="" />
                  <span>{flower.label}</span>
                </button>
              ))}
            </div>

            {selectedFlower && (
              <article className="flower-detail" key={selectedFlower.id}>
                <img src={selectedFlower.asset} alt="" className="detail-flower" />
                <div>
                  <p className="modal-kicker">lời nhắn trong hoa</p>
                  <h3>{selectedFlower.label}</h3>
                  <p className="detail-quote">“{quoteByFlowerId[selectedFlower.id]}”</p>
                </div>
              </article>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function FinalGiftSequence({ onClose, onOpenInventory, onRestart }) {
  const paragraphs = editableContent.finalMessage.split('\n').filter((line) => line.trim().length > 0);

  return (
    <div className="final-backdrop" role="dialog" aria-modal="true" aria-labelledby="final-title">
      <section className="final-card">
        <div className="bouquet-stage" aria-hidden="true">
          {interactiveFlowers.map((flower, index) => (
            <img
              key={flower.id}
              src={flower.asset}
              alt=""
              className="bouquet-flower"
              style={{
                '--bouquet-rotate': `${-38 + index * 8}deg`,
                '--bouquet-x': `${(index - 4.5) * 19}px`,
                '--bouquet-y': `${Math.sin(index) * 18}px`,
                animationDelay: `${index * 85}ms`,
              }}
            />
          ))}
        </div>

        <article className="letter-card">
          <img src={staticAssets.letterCard} alt="" className="letter-art" />
          <div className="letter-text">
            <p className="modal-kicker">final gift</p>
            <h2 id="final-title">{editableContent.finalTitle}</h2>
            {paragraphs.map((paragraph, index) => (
              <p key={`${paragraph}-${index}`} style={{ animationDelay: `${index * 110 + 300}ms` }}>{paragraph}</p>
            ))}
          </div>
        </article>

        <div className="final-actions">
          <button type="button" className="primary-note-button" onClick={onClose}>Ngắm thêm một chút</button>
          <button type="button" className="secondary-note-button" onClick={onOpenInventory}>Mở túi hoa</button>
          <button type="button" className="secondary-note-button" onClick={onRestart}>Bắt đầu lại</button>
        </div>
      </section>
    </div>
  );
}

function LivingArtworkControls({ onReplayFinal, onOpenInventory, onRestart }) {
  return (
    <div className="living-controls" aria-label="Tùy chọn sau khi hoàn thành">
      <button type="button" onClick={onReplayFinal}>Đọc lại lời nhắn</button>
      <button type="button" onClick={onOpenInventory}>Mở túi hoa</button>
      <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Ngắm thêm một chút</button>
      <button type="button" onClick={onRestart}>Bắt đầu lại</button>
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
  const [showFinal, setShowFinal] = useState(false);
  const [bagPulse, setBagPulse] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
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

  const collectedSet = useMemo(() => new Set(game.collectedIds), [game.collectedIds]);
  const collectedFlowers = useMemo(
    () => interactiveFlowers.filter((flower) => collectedSet.has(flower.id)),
    [collectedSet]
  );

  const sceneStyle = {
    '--parallax-x': `${mouse.x * 10}px`,
    '--parallax-y': `${mouse.y * 6}px`,
    '--scene-bg': `url("${staticAssets.background}")`,
  };

  function handleMouseMove(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    setMouse({ x, y });
  }

  function handlePick(flower) {
    if (activeFlower || flight || collectedSet.has(flower.id)) return;
    setActiveFlower(flower);
  }

  function handleKeepFlower() {
    if (!activeFlower) return;

    const flowerEl = document.getElementById(`flower-${activeFlower.id}`);
    const bagEl = bagRef.current;
    const flowerRect = flowerEl?.getBoundingClientRect();
    const bagRect = bagEl?.getBoundingClientRect();

    if (flowerRect && bagRect) {
      const startX = flowerRect.left + flowerRect.width / 2 - 42;
      const startY = flowerRect.top + flowerRect.height / 2 - 42;
      const endX = bagRect.left + bagRect.width / 2 - startX - 32;
      const endY = bagRect.top + bagRect.height / 2 - startY - 32;
      setFlight({
        id: activeFlower.id,
        asset: activeFlower.asset,
        startX,
        startY,
        endX,
        endY,
        midX: endX * 0.42,
        midY: Math.min(endY * 0.3 - 170, -130),
        width: Math.max(84, activeFlower.size * 0.62),
      });
    }

    setActiveFlower(null);
  }

  function finishFlight() {
    if (!flight) return;

    setGame((current) => {
      if (current.collectedIds.includes(flight.id)) return current;
      const nextCollected = [...current.collectedIds, flight.id];
      const completed = nextCollected.length === TOTAL_FLOWERS;
      const next = {
        ...current,
        collectedIds: nextCollected,
        completed,
        hasSeenFinal: completed ? true : current.hasSeenFinal,
      };
      if (completed) {
        window.setTimeout(() => setShowFinal(true), 650);
      }
      return next;
    });

    setFlight(null);
    setBagPulse(true);
    window.setTimeout(() => setBagPulse(false), 850);
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
    setShowFinal(false);
  }

  const completeScene = game.completed;

  return (
    <>
      {phase === 'loading' && <LoadingScreen />}

      <main
        className={`app-shell ${completeScene ? 'scene-completed' : ''}`}
        onMouseMove={handleMouseMove}
        style={sceneStyle}
      >
        <section className="hero-copy" aria-label="Lời mở đầu">
          <p className="eyebrow">a small field of sunshine</p>
          <h1>{editableContent.giftTitle}</h1>
          <p>{editableContent.introLine}</p>
        </section>

        <div className="sun-layer" />
        <CloudsLayer />
        <div className="field-readability-layer" aria-hidden="true" />
        <DecorativeField />
        <ForegroundLayers />

        <section className="interactive-field" aria-label="Cánh đồng hoa tương tác">
          {interactiveFlowers.map((flower) => (
            <Flower
              key={flower.id}
              flower={flower}
              collected={collectedSet.has(flower.id)}
              quote={game.quoteByFlowerId[flower.id]}
              onPick={handlePick}
            />
          ))}
        </section>

        {completeScene && <div className="completed-bouquet" aria-hidden="true">
          {interactiveFlowers.map((flower, index) => (
            <img
              key={flower.id}
              src={flower.asset}
              alt=""
              style={{
                '--complete-rotate': `${-35 + index * 7.8}deg`,
                '--complete-x': `${(index - 4.5) * 15}px`,
                '--complete-y': `${Math.cos(index) * 13}px`,
              }}
            />
          ))}
        </div>}

        <PetalsLayer />

        <InventoryBag
          count={game.collectedIds.length}
          total={TOTAL_FLOWERS}
          onOpen={openInventory}
          bagRef={bagRef}
          pulse={bagPulse || showFinal}
        />

        <AudioControl shouldAutoPlay={phase === 'ready'} />

        {completeScene && !showFinal && (
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
          quoteByFlowerId={game.quoteByFlowerId}
          selectedId={selectedInventoryId}
          onSelect={setSelectedInventoryId}
          onClose={() => setInventoryOpen(false)}
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
