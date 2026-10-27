// Kalıcı ayarlar ve ilerleme: isim, ses, XP, seri, kelime kutuları, dersler, sınavlar, yanlışlar

const KEY = 'nisa-english/v1';
export const DEFAULT_NAME = 'Saadet Nisa';
const listeners = new Set();

const num = (v, fallback, min = 0, max = 1) => (typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : fallback);
const bool = (v, fallback) => (typeof v === 'boolean' ? v : fallback);
const obj = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});
const arr = (v) => (Array.isArray(v) ? v : []);
export const cleanName = (v) => {
  const s = typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, 24) : '';
  return s || DEFAULT_NAME;
};

function load() {
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(KEY) || '{}') || {};
  } catch {
    saved = {};
  }
  return {
    name: cleanName(saved.name),
    sfx: bool(saved.sfx, true),
    sfxVol: num(saved.sfxVol, 0.7),
    slow: bool(saved.slow, false),
    autoplay: bool(saved.autoplay, true),
    goal: num(saved.goal, 60, 20, 300),
    examMinutes: num(saved.examMinutes, 40, 10, 90),
    geminiKey: typeof saved.geminiKey === 'string' ? saved.geminiKey.trim().slice(0, 200) : '',
    xp: num(saved.xp, 0, 0, 1e9),
    days: obj(saved.days),
    words: obj(saved.words),
    lessons: obj(saved.lessons),
    steps: obj(saved.steps),
    sets: obj(saved.sets),
    readings: obj(saved.readings),
    sheets: obj(saved.sheets),
    exams: arr(saved.exams).slice(-40),
    mistakes: obj(saved.mistakes),
    fav: arr(saved.fav),
    lookups: num(saved.lookups, 0, 0, 1e9),
    asked: num(saved.asked, 0, 0, 1e9),
    fixed: num(saved.fixed, 0, 0, 1e9),
    badges: obj(saved.badges),
    last: saved.last && typeof saved.last.hash === 'string' ? saved.last : null,
    welcomed: bool(saved.welcomed, false),
  };
}

let state = load();

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Gizli sekmede depolama kapalı olabilir; site yine çalışır
  }
}

export const store = {
  get(key) {
    return state[key];
  },
  set(key, value) {
    state = { ...state, [key]: value };
    persist();
    listeners.forEach((fn) => fn(key, value));
  },
  // İç içe nesnelerde tek bir kaydı günceller
  patch(key, id, value) {
    const next = { ...state[key] };
    if (value === undefined) delete next[id];
    else next[id] = value;
    this.set(key, next);
  },
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  reset() {
    const keep = { name: state.name, sfx: state.sfx, sfxVol: state.sfxVol, slow: state.slow, autoplay: state.autoplay, goal: state.goal, geminiKey: state.geminiKey, welcomed: true };
    try {
      localStorage.setItem(KEY, JSON.stringify(keep));
    } catch {
      // yok say
    }
    state = load();
    listeners.forEach((fn) => fn('*', null));
  },
};

/* ---------- Günler ve seri ---------- */

export const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const todayXP = () => state.days[dayKey()] || 0;

export function streak() {
  const d = new Date();
  let n = 0;
  // Bugün henüz çalışılmadıysa seri dünden sayılır
  if (!state.days[dayKey(d)]) d.setDate(d.getDate() - 1);
  while (state.days[dayKey(d)]) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

/* ---------- Seviye ---------- */

const LEVELS = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200, 4000, 5000, 6200, 7600, 9200];
const LEVEL_NAMES = ['Starter', 'Explorer', 'Word Hunter', 'Rising Star', 'Smart Cookie', 'Grammar Guru', 'English Ace', 'Champion', 'Superstar', 'Legend', 'Legend II', 'Legend III', 'Legend IV', 'Legend V', 'Grand Master'];

export function level(xp = state.xp) {
  let i = 0;
  while (i + 1 < LEVELS.length && xp >= LEVELS[i + 1]) i++;
  const from = LEVELS[i];
  const to = LEVELS[i + 1] ?? from + 2000;
  return { n: i + 1, name: LEVEL_NAMES[i], from, to, pct: Math.min(1, (xp - from) / (to - from)) };
}

/* ---------- Kelime kutuları (Leitner) ---------- */

export const wordBox = (id) => (state.words[id] ? state.words[id].b : 0);
export const isLearned = (id) => wordBox(id) >= 3;

export function markWord(id, right) {
  const w = state.words[id] || { b: 0, r: 0, w: 0 };
  const next = right ? { ...w, b: Math.min(5, w.b + 1), r: w.r + 1, t: Date.now() } : { ...w, b: Math.max(0, w.b - 2), w: w.w + 1, t: Date.now() };
  store.patch('words', id, next);
}

export const isFav = (id) => state.fav.includes(id);
export function toggleFav(id) {
  store.set('fav', isFav(id) ? state.fav.filter((x) => x !== id) : [...state.fav, id]);
  return isFav(id);
}
