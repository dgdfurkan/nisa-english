// Önceden üretilmiş doğal telaffuz kayıtları (tools/seslendir.py). Yavaş modda ton korunur.

import { AUDIO } from '../data/audio.js';
import { store } from '../lib/store.js';

let current = null;
let currentBtn = null;
const listeners = new Set();

export const hasAudio = (id) => !!id && AUDIO.has(id);
export const onVoice = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
const emit = (id, playing) => listeners.forEach((fn) => fn(id, playing));

export function stopVoice() {
  if (current) {
    const a = current;
    current = null;
    a.pause();
    emit(a.dataset.id, false);
  }
  if (currentBtn) currentBtn.classList.remove('playing');
  currentBtn = null;
}

// Sesi çalar; bittiğinde ya da kesildiğinde söz çözülür
export function say(id, { slow = store.get('slow'), btn = null } = {}) {
  if (!hasAudio(id)) return Promise.resolve(false);
  stopVoice();
  const a = new Audio(new URL(`../../audio/en/${id}.mp3`, import.meta.url).href);
  a.dataset.id = id;
  a.preservesPitch = true;
  a.playbackRate = slow ? 0.72 : 1;
  current = a;
  if (btn) {
    currentBtn = btn;
    btn.classList.add('playing');
  }
  emit(id, true);
  return new Promise((resolve) => {
    const end = () => {
      if (current === a) {
        current = null;
        if (currentBtn) currentBtn.classList.remove('playing');
        currentBtn = null;
        emit(id, false);
      }
      resolve(true);
    };
    a.addEventListener('ended', end);
    a.addEventListener('error', end);
    a.addEventListener('pause', end);
    const p = a.play();
    if (p && p.catch) p.catch(end);
  });
}

// Sayfadaki [data-say] düğmeleri tek dinleyiciyle çalışır
document.addEventListener('click', (e) => {
  const b = e.target.closest && e.target.closest('[data-say]');
  if (!b) return;
  e.preventDefault();
  e.stopPropagation();
  if (b.classList.contains('playing')) {
    stopVoice();
    return;
  }
  say(b.dataset.say, { btn: b, slow: b.dataset.slow === '1' ? true : undefined });
});
