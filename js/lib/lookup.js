// Çekimli kelimeyi sözlükte ya da genel listede bulur (tarayıcıya bağlı değil)

import { WORDS } from '../data/words.js';
import { GLOSS } from '../data/glossary.js';

const BY_EN = new Map(WORDS.map((w) => [w.en.toLowerCase(), w]));

// Çekimli bir kelimeyi sözlükte ya da genel listede bulur: plays → play, taller → tall
export function lookupToken(rawToken) {
  const t = String(rawToken).toLowerCase().replace(/[’]/g, "'").replace(/^'+|'+$/g, '');
  const tries = [t];
  const add = (x) => { if (x && x.length > 1) tries.push(x); };
  if (t.endsWith("'s")) add(t.slice(0, -2));
  if (t.endsWith('ies')) add(`${t.slice(0, -3)}y`);
  if (t.endsWith('es')) add(t.slice(0, -2));
  if (t.endsWith('s')) add(t.slice(0, -1));
  if (t.endsWith('ing')) {
    const b = t.slice(0, -3);
    add(b); add(`${b}e`);
    if (b.length > 2 && b.at(-1) === b.at(-2)) add(b.slice(0, -1));
  }
  if (t.endsWith('ed')) { add(t.slice(0, -2)); add(t.slice(0, -1)); }
  if (t.endsWith('ier')) add(`${t.slice(0, -3)}y`);
  if (t.endsWith('er')) {
    const b = t.slice(0, -2);
    add(b); add(`${b}e`);
    if (b.length > 2 && b.at(-1) === b.at(-2)) add(b.slice(0, -1));
  }
  for (const x of tries) {
    if (BY_EN.has(x)) return { word: BY_EN.get(x), form: t, base: x };
    if (GLOSS.has(x)) return { gloss: x, tr: GLOSS.get(x), form: t, base: x };
  }
  return null;
}

export const findWord = (en) => BY_EN.get(String(en).toLowerCase()) || null;
