// Alıştırma setleri: her ünitede konuya göre ayrılmış, her açılışta yeniden üretilen sorular

import * as G from './gen.js';
import { shuffle } from '../lib/dom.js';

const mix = (...lists) => shuffle(lists.flat());

export const SETS = [
  { id: 'u1-vocab', unit: 1, pic: '🔤', title: 'Kelime Testi', desc: 'İngilizce ve Türkçe anlamlar', make: () => G.vocab(1, 10) },
  { id: 'u1-listen', unit: 1, pic: '🎧', title: 'Dinle ve Bul', desc: 'Duyduğun kelimeyi seç', make: () => G.listen(1, 10) },
  { id: 'u1-opp', unit: 1, pic: '↔️', title: 'Zıt Anlamlılar', desc: 'Eşleştir ve seç', make: () => [G.oppMatch(1), ...G.oppMC(1, 6), G.oppMatch(1)] },
  { id: 'u1-who', unit: 1, pic: '🕵️', title: 'Kim Kim?', desc: 'Tarifi oku, kişiyi bul', make: () => mix(G.personPick(5), G.personDescribe(5)) },
  { id: 'u1-behave', unit: 1, pic: '💭', title: 'Davranıştan Kişiliğe', desc: 'Ne yapıyor, nasıl biri?', make: () => G.behaviour(10) },
  { id: 'u1-looklike', unit: 1, pic: '👯', title: 'look like mı, be like mı?', desc: 'Karıştırılan kalıplar', make: () => G.lookLike(10) },
  { id: 'u1-comp', unit: 1, pic: '⚖️', title: 'Karşılaştırma Ustası', desc: 'taller, more generous, better', make: () => [...G.compForm(1, 4), ...G.compNumbers(1, 4), ...G.compCorrect(1, 2)] },
  { id: 'u1-order', unit: 1, pic: '🧩', title: 'Cümle Kur', desc: 'Kelimeleri sıraya koy', make: () => G.order(1, 8) },
  { id: 'u1-fill', unit: 1, pic: '✏️', title: 'Boşluk Doldur', desc: 'Cümleyi tamamla', make: () => G.fillBlank(1, 10) },
  { id: 'u1-mix', unit: 1, pic: '🎲', title: 'Karışık Tekrar', desc: 'Ünitenin her yerinden', make: () => mix(G.vocab(1, 3), G.personDescribe(2), G.behaviour(2), G.lookLike(2), G.compForm(1, 1), G.compNumbers(1, 1), G.order(1, 1)) },

  { id: 'u2-vocab', unit: 2, pic: '🔤', title: 'Kelime Testi', desc: 'İngilizce ve Türkçe anlamlar', make: () => G.vocab(2, 10) },
  { id: 'u2-listen', unit: 2, pic: '🎧', title: 'Dinle ve Bul', desc: 'Duyduğun kelimeyi seç', make: () => G.listen(2, 10) },
  { id: 'u2-pdg', unit: 2, pic: '🏅', title: 'Play, Do, Go', desc: 'Sporları doğru fiille kullan', make: () => [G.pdgSort(), ...G.pdgMC(6), G.pdgSort()] },
  { id: 'u2-freq', unit: 2, pic: '📅', title: 'Sıklık Zarfları', desc: 'always, never, twice a week', make: () => [...G.freqMeaning(2), G.freqScale(), ...G.freqPos(4), ...G.howOften(3)] },
  { id: 'u2-chart', unit: 2, pic: '📊', title: 'Tablo Okuma', desc: 'Sınav tipi tablo soruları', make: () => G.chart(8) },
  { id: 'u2-likes', unit: 2, pic: '❤️', title: 'Severim, Sevmem', desc: 'love, enjoy, good at + -ing', make: () => G.likes(10) },
  { id: 'u2-present', unit: 2, pic: '🔁', title: 'Simple Present', desc: 'plays, does, goes; do / does', make: () => G.present(10) },
  { id: 'u2-kit', unit: 2, pic: '🎾', title: 'Malzeme ve Yerler', desc: 'racket, court, referee', make: () => [G.kitMatch(), ...G.kit(8)] },
  { id: 'u2-order', unit: 2, pic: '🧩', title: 'Cümle Kur', desc: 'Kelimeleri sıraya koy', make: () => G.order(2, 8) },
  { id: 'u2-fill', unit: 2, pic: '✏️', title: 'Boşluk Doldur', desc: 'Cümleyi tamamla', make: () => G.fillBlank(2, 10) },
  { id: 'u2-mix', unit: 2, pic: '🎲', title: 'Karışık Tekrar', desc: 'Ünitenin her yerinden', make: () => mix(G.vocab(2, 3), G.pdgMC(2), G.freqPos(1), G.chart(2), G.likes(2), G.present(2), G.kit(1)) },
];

export const setById = (id) => SETS.find((s) => s.id === id);
export const setsOf = (unit) => SETS.filter((s) => s.unit === Number(unit));
