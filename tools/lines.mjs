// Seslendirilecek satırları verilerden toplar ve tools/voice-lines.json dosyasına yazar.
// Kullanım: node tools/lines.mjs

import { writeFileSync } from 'node:fs';
import { WORDS, slug } from '../js/data/words.js';
import { voiceLines } from '../js/data/units.js';
import { GLOSS } from '../js/data/glossary.js';
import { AUDIO } from '../js/data/audio.js';

const chunk = (list, n) => {
  const out = [];
  for (let i = 0; i < list.length; i += n) out.push(list.slice(i, i + n));
  return out;
};

const words = WORDS.map((w) => [`w-${w.id}`, w.en]);
const sentences = WORDS.map((w) => [`s-${w.id}`, w.ex]);
const extra = voiceLines();
// Genel kelimeler (cümlelerde dokununca çıkan anlam kutusu); ünite kelimesi olanların sesi zaten var
const dictEn = new Set(WORDS.map((w) => w.en.toLowerCase()));
const gloss = [...GLOSS.keys()].filter((en) => !dictEn.has(en)).map((en) => [`g-${slug(en)}`, en === 'i' ? 'I' : en]);
// Ders satırları ve genel kelimelerde yalnızca sesi olmayanlar yeni gruplara girer; hazır grupların önbelleği bozulmaz
const missing = (list) => list.filter(([id]) => !AUDIO.has(id));

const NOTE_WORD = 'These are single dictionary headwords. Read each one on its own, clearly, with a natural falling intonation, exactly as written. Never add any other words.';
const NOTE_SENT = 'These are example sentences in a vocabulary app. Read each sentence as a separate, natural sentence with clear, friendly rhythm, exactly as written.';
const NOTE_TEXT = 'These are lines from English lessons and short reading texts. Read each line naturally and clearly, like a friendly teacher reading to a student, exactly as written.';

const groups = [
  ...chunk(words, 72).map((lines, i) => ({ id: `w${i + 1}`, note: NOTE_WORD, lines })),
  ...chunk(sentences, 48).map((lines, i) => ({ id: `s${i + 1}`, note: NOTE_SENT, lines })),
  ...chunk(missing(extra), 42).map((lines, i) => ({ id: `n${i + 1}`, note: NOTE_TEXT, lines })),
  ...chunk(missing(gloss), 76).map((lines, i) => ({ id: `g${i + 1}`, note: NOTE_WORD, lines })),
];

const cfg = {
  voice: 'Autonoe',
  persona: 'A warm, friendly native English teacher recording pronunciation audio for a 12-year-old Turkish girl\'s English learning app',
  scene: 'A quiet, cosy recording room. She reads words and sentences for her student, who listens and repeats after her. She genuinely likes her student and wants English to feel easy and fun.',
  style: 'Warm, clear and natural, with a gentle smile you can hear. Native, relaxed intonation that moves naturally, never flat, never robotic, never sing-song, never exaggerated, never like an advert.',
  pace: 'A little slower than normal conversation, every sound clearly articulated but still natural. Say one line, then stay completely silent for one full second before the next line.',
  accent: 'Clear modern Standard British English.',
  context: 'Pronunciation models for a student. Every word must be easy to hear and copy.',
  groups,
};

writeFileSync(new URL('./voice-lines.json', import.meta.url), `${JSON.stringify(cfg, null, 1)}\n`);
console.log(groups.map((g) => `${g.id}:${g.lines.length}`).join(' '));
