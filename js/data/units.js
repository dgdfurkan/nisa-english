// Üniteler: başlıklar, renkler, dersler, sınav bankası, okuma parçaları

import { U1_LESSONS } from './u1-lessons.js';
import { U2_LESSONS } from './u2-lessons.js';
import { U1_EXAM } from './u1-exam.js';
import { U2_EXAM } from './u2-exam.js';
import { READINGS } from './readings.js';

// Kitaptaki içindekiler sayfasının renkleri
export const UNITS = [
  {
    n: 1,
    title: 'Appearance and Personality',
    tr: 'Dış Görünüş ve Kişilik',
    pages: '9-20',
    color: '#9d86d6',
    deep: '#6b52b8',
    soft: '#ece6fb',
    pic: '🪞',
    goals: [
      'Birinin dış görünüşünü tarif etmek',
      'Birinin kişiliğini anlatmak',
      'look like ve be like farkını bilmek',
      'İki kişiyi karşılaştırmak (taller than)',
      'Bir arkadaşını anlatan paragraf yazmak',
    ],
    lessons: U1_LESSONS,
    exam: U1_EXAM,
  },
  {
    n: 2,
    title: 'Sports',
    tr: 'Sporlar',
    pages: '21-32',
    color: '#3f9a85',
    deep: '#246f5e',
    soft: '#dcf1ea',
    pic: '🏅',
    goals: [
      'Sporları play, do, go ile doğru kullanmak',
      'Rutinleri anlatmak (Simple Present)',
      'Ne sıklıkla yaptığını söylemek (always, twice a week)',
      'Sevdiğin ve sevmediğin sporları anlatmak',
      'Sporları karşılaştırmak ve fikrini söylemek',
    ],
    lessons: U2_LESSONS,
    exam: U2_EXAM,
  },
  { n: 3, title: 'Biographies', tr: 'Biyografiler', pages: '33-44', color: '#5b9bd5', deep: '#3a78b3', soft: '#e0edf9', pic: '📜', locked: true },
  { n: 4, title: 'Wild Animals', tr: 'Vahşi Hayvanlar', pages: '45-56', color: '#5f9e48', deep: '#437a30', soft: '#e3f1dc', pic: '🦁', locked: true },
  { n: 5, title: 'Television', tr: 'Televizyon', pages: '57-70', color: '#e8b923', deep: '#b98d0a', soft: '#fbf1cf', pic: '📺', locked: true },
];

export const unitByN = (n) => UNITS.find((u) => u.n === Number(n) && !u.locked);
export const LESSONS = UNITS.flatMap((u) => (u.lessons || []).map((l) => ({ ...l, unit: u.n })));
export const lessonById = (id) => LESSONS.find((l) => l.id === id);
export const readingsOf = (n) => READINGS.filter((r) => r.unit === Number(n));
export const readingById = (id) => READINGS.find((r) => r.id === id);
export const EXAM_BANK = UNITS.flatMap((u) => (u.exam || []).map((q) => ({ ...q, unit: u.n })));
export { READINGS };

// Metinden kararlı ses kimliği (FNV-1a); tarayıcı ve araç aynı kimliği üretir
export function lineId(text) {
  let h = 0x811c9dc5;
  for (const ch of String(text)) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return `x-${h.toString(36)}`;
}

// Derslerdeki örnekler, diyaloglar ve okuma paragrafları seslendirilir
export function voiceLines() {
  const seen = new Map();
  const add = (text) => {
    const id = lineId(text);
    if (!seen.has(id)) seen.set(id, text);
  };
  for (const l of LESSONS) {
    for (const s of l.steps) {
      for (const b of s.blocks) {
        if (b.t === 'ex') add(b.en);
        if (b.t === 'dialog') b.lines.forEach(([, text]) => add(text));
      }
    }
  }
  for (const r of READINGS) r.paras.forEach(add);
  return [...seen.entries()];
}
