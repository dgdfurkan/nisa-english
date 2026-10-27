// Sentezlenmiş ses efektleri: kalem tıkı, kâğıt hışırtısı, doğru ve yanlış sesleri

import { getCtx, bus, noiseBuffer, mtof } from './engine.js';

const live = () => {
  const c = getCtx();
  return c && c.state === 'running' ? c : null;
};

function tone(c, { type = 'sine', f, f2, t = c.currentTime, dur = 0.12, vol = 0.2, attack = 0.004 }) {
  const o = c.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(f, t);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g);
  g.connect(bus('sfx'));
  o.start(t);
  o.stop(t + dur + 0.03);
  return o;
}

function hiss(c, { t = c.currentTime, dur = 0.2, vol = 0.1, type = 'bandpass', f = 1500, f2, q = 0.8, attack = 0.004 }) {
  const src = c.createBufferSource();
  src.buffer = noiseBuffer();
  const filt = c.createBiquadFilter();
  filt.type = type;
  filt.Q.value = q;
  filt.frequency.setValueAtTime(f, t);
  if (f2) filt.frequency.exponentialRampToValueAtTime(f2, t + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(filt);
  filt.connect(g);
  g.connect(bus('sfx'));
  src.start(t, Math.random() * 1.1, dur + 0.05);
}

const notes = (c, list, { type = 'triangle', gap = 0.075, dur = 0.26, vol = 0.12, start = 0 } = {}) =>
  list.forEach((m, i) => tone(c, { type, f: mtof(m), t: c.currentTime + start + i * gap, dur, vol }));

export const sfx = {
  tap() {
    const c = live(); if (!c) return;
    tone(c, { type: 'triangle', f: 1250, f2: 900, dur: 0.045, vol: 0.08, attack: 0.002 });
    hiss(c, { dur: 0.03, vol: 0.05, type: 'highpass', f: 4200 });
  },
  soft() {
    const c = live(); if (!c) return;
    tone(c, { type: 'sine', f: 740, f2: 990, dur: 0.08, vol: 0.06 });
  },
  pop() {
    const c = live(); if (!c) return;
    tone(c, { type: 'sine', f: 520, f2: 1040, dur: 0.09, vol: 0.12, attack: 0.002 });
  },
  page() {
    const c = live(); if (!c) return;
    hiss(c, { dur: 0.32, vol: 0.09, f: 900, f2: 3800, q: 0.7, attack: 0.08 });
  },
  flip() {
    const c = live(); if (!c) return;
    hiss(c, { dur: 0.14, vol: 0.1, f: 3000, f2: 1100, q: 1 });
    tone(c, { type: 'sine', f: 300, f2: 180, dur: 0.08, vol: 0.05 });
  },
  right() {
    const c = live(); if (!c) return;
    notes(c, [84, 88], { type: 'sine', gap: 0.09, dur: 0.32, vol: 0.13 });
    notes(c, [96, 100], { type: 'sine', gap: 0.05, dur: 0.2, vol: 0.03, start: 0.16 });
  },
  wrong() {
    const c = live(); if (!c) return;
    const t = c.currentTime;
    tone(c, { type: 'triangle', f: 330, f2: 300, t, dur: 0.16, vol: 0.12 });
    tone(c, { type: 'triangle', f: 247, f2: 220, t: t + 0.15, dur: 0.3, vol: 0.12 });
  },
  combo(n = 1) {
    const c = live(); if (!c) return;
    const base = 76 + Math.min(n, 8);
    notes(c, [base, base + 4, base + 7], { type: 'sine', gap: 0.05, dur: 0.22, vol: 0.07, start: 0.18 });
  },
  stamp() {
    const c = live(); if (!c) return;
    tone(c, { type: 'sine', f: 160, f2: 60, dur: 0.18, vol: 0.3, attack: 0.002 });
    hiss(c, { dur: 0.08, vol: 0.12, type: 'lowpass', f: 1800, q: 0.5, attack: 0.002 });
  },
  pen() {
    const c = live(); if (!c) return;
    hiss(c, { dur: 0.22, vol: 0.06, f: 5000, f2: 2600, q: 2, attack: 0.03 });
  },
  success() {
    const c = live(); if (!c) return;
    notes(c, [72, 76, 79, 84], { gap: 0.08, dur: 0.3, vol: 0.11 });
  },
  fanfare() {
    const c = live(); if (!c) return;
    notes(c, [67, 72, 76, 79, 84], { gap: 0.09, dur: 0.32, vol: 0.11 });
    [72, 76, 79, 84].forEach((m) => tone(c, { type: 'triangle', f: mtof(m), t: c.currentTime + 0.5, dur: 0.9, vol: 0.05 }));
    hiss(c, { t: c.currentTime + 0.5, dur: 1, vol: 0.04, type: 'highpass', f: 6000 });
  },
  sparkle() {
    const c = live(); if (!c) return;
    for (let i = 0; i < 6; i++) tone(c, { type: 'sine', f: 1800 + Math.random() * 2400, t: c.currentTime + i * 0.045, dur: 0.18, vol: 0.04 });
  },
  whoosh() {
    const c = live(); if (!c) return;
    hiss(c, { dur: 0.36, vol: 0.1, f: 500, f2: 3200, q: 0.9, attack: 0.1 });
  },
  tick() {
    const c = live(); if (!c) return;
    tone(c, { type: 'square', f: 2000, dur: 0.02, vol: 0.03, attack: 0.001 });
  },
  meow() {
    const c = live(); if (!c) return;
    const t = c.currentTime;
    const o = tone(c, { type: 'triangle', f: 700, t, dur: 0.38, vol: 0.08, attack: 0.03 });
    o.frequency.setValueAtTime(620, t);
    o.frequency.linearRampToValueAtTime(980, t + 0.12);
    o.frequency.linearRampToValueAtTime(560, t + 0.36);
  },
};
