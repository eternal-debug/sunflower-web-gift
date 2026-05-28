const STORAGE_KEY = 'sunflower-web-gift:v1';

export function loadGameState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveGameState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage may be blocked in private mode. The app can still work in memory.
  }
}

export function clearGameState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
}
