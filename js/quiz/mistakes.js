// Yanlış yapılan sorular defteri: aynı soru iki kez doğru çözülünce defterden çıkar

import { store } from '../lib/store.js';

const MAX = 150;

export function keyOf(q) {
  if (q.id) return q.id;
  const ans = q.type === 'mc' ? (typeof q.opts[q.a] === 'string' ? q.opts[q.a] : JSON.stringify(q.opts[q.a])) : q.type === 'order' ? q.answer : q.type;
  return `${q.type}:${q.q}:${q.hint || ''}:${ans}`.slice(0, 300);
}

// Eşleştirme ve gruplama tahtaları her seferinde yeniden üretildiği için deftere girmez
const keepable = (q) => q.type === 'mc' || q.type === 'order';

export function recordMistake(q) {
  if (!keepable(q)) return;
  const all = { ...store.get('mistakes') };
  const k = keyOf(q);
  const prev = all[k];
  all[k] = { q, n: (prev ? prev.n : 0) + 1, ok: 0, t: Date.now() };
  const keys = Object.keys(all);
  if (keys.length > MAX) {
    keys.sort((a, b) => all[a].t - all[b].t).slice(0, keys.length - MAX).forEach((x) => delete all[x]);
  }
  store.set('mistakes', all);
}

// Defterdeki bir soru doğru çözüldü; ikinci doğrudan sonra defterden silinir
export function recordFix(q) {
  const all = store.get('mistakes');
  const k = keyOf(q);
  if (!all[k]) return false;
  const ok = all[k].ok + 1;
  if (ok >= 2) {
    store.patch('mistakes', k, undefined);
    store.set('fixed', store.get('fixed') + 1);
    return true;
  }
  store.patch('mistakes', k, { ...all[k], ok });
  return false;
}

export const mistakeCount = () => Object.keys(store.get('mistakes')).length;
export const mistakeList = () => Object.values(store.get('mistakes')).sort((a, b) => b.t - a.t);
