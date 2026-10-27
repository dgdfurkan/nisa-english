// Bütün kelimeler tek sözlükte: kimlik, ünite ve kategori bilgisiyle

import { U1_CATS } from './u1-words.js';
import { U2_CATS } from './u2-words.js';

export const slug = (s) => String(s).toLowerCase().replace(/'/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const POS = {
  adj: 'sıfat',
  n: 'isim',
  v: 'fiil',
  adv: 'zarf',
  phr: 'kalıp',
  prep: 'edat',
  det: 'belirleyici',
};

function build(unit, cats) {
  return cats.map((c) => ({
    ...c,
    unit,
    words: c.words.map(([en, tr, pos, say, ex, exTr, extra = {}]) => ({
      id: slug(en),
      en,
      tr,
      pos,
      say,
      ex,
      exTr,
      unit,
      cat: c.id,
      ...extra,
    })),
  }));
}

export const CATS = {
  1: build(1, U1_CATS),
  2: build(2, U2_CATS),
};

export const WORDS = [...CATS[1], ...CATS[2]].flatMap((c) => c.words);
export const WORD = new Map(WORDS.map((w) => [w.id, w]));
export const wordsOf = (unit) => WORDS.filter((w) => w.unit === unit);
export const catOf = (w) => CATS[w.unit].find((c) => c.id === w.cat);
