// Muffin'in cevap motoru: internete gerek duymadan anında cevap verir.
// Kelime anlamı, Türkçeden İngilizceye, zıt anlam, karşılaştırma hali, play/do/go, örnek cümle,
// konu soruları (bilgi bankası), beni test et, yazım hatası tahmini.

import { WORDS, WORD } from '../data/words.js';
import { GLOSS } from '../data/glossary.js';
import { LESSONS, EXAM_BANK } from '../data/units.js';
import { FAQ, TOPIC_FAQ } from './faq.js';
import { fold, lev, displayName } from '../lib/text.js';
import { store } from '../lib/store.js';
import { lookupToken, findWord } from '../lib/lookup.js';
import { shuffle, pick } from '../lib/dom.js';
import * as G from '../quiz/gen.js';

const FAQ_BY_ID = new Map(FAQ.map((f) => [f.id, f]));
const SPORTS = WORDS.filter((w) => w.verb);

const SUGGEST = ['generous ne demek?', 'look like ile be like farkı', 'Karşılaştırma nasıl yapılır?', 'karate play mi do mu go mu?', 'Sıklık zarfı nereye gelir?', 'çalışkan İngilizcesi ne?', 'Beni test et'];
export const suggestions = () => shuffle(SUGGEST).slice(0, 4);

// Kullanıcının yazdığı terimden Türkçe ekleri ve tırnakları temizler
function cleanTerm(t) {
  return String(t)
    .replace(/'(?:[a-z]+)$/g, '')
    .replace(/\b(kelimesi(nin)?|sozcugu(nun)?|ifadesi(nin)?|the word|word)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function wordFromTerm(term) {
  const t = cleanTerm(term);
  if (!t) return null;
  const w = findWord(t);
  if (w) return { word: w };
  const hit = lookupToken(t);
  if (hit) return hit;
  return null;
}

function closest(term) {
  const t = cleanTerm(term);
  if (t.length < 3) return null;
  let best = null;
  let bestD = 99;
  for (const w of WORDS) {
    const d = lev(t, w.en.toLowerCase());
    if (d < bestD) { bestD = d; best = w; }
  }
  const limit = t.length <= 4 ? 1 : t.length <= 7 ? 2 : 3;
  return bestD <= limit ? best : null;
}

function trSearch(q) {
  const f = fold(q).replace(/\b(kelimesi(nin)?|sozcugu(nun)?)\b/g, '').trim();
  if (!f) return [];
  const scored = [];
  for (const w of WORDS) {
    const senses = w.tr.replace(/\(.*?\)/g, '').split(/[,;/]/).map((x) => fold(x)).filter(Boolean);
    let s = 0;
    if (senses.includes(f)) s = 3;
    else if (senses.some((x) => x.startsWith(`${f} `) || x.endsWith(` ${f}`))) s = 2;
    else if (senses.some((x) => x.split(' ').includes(f))) s = 1;
    if (s) scored.push({ w, s });
  }
  scored.sort((a, b) => b.s - a.s);
  const out = scored.slice(0, 6).map((x) => ({ word: x.w }));
  if (out.length < 3) {
    for (const [en, tr] of GLOSS) {
      const senses = tr.replace(/\(.*?\)/g, '').split(/[,;/]/).map((x) => fold(x));
      if (senses.includes(f) && out.length < 6) out.push({ gloss: en, tr });
    }
  }
  return out;
}

const esc = (k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Kısa anahtarlar tam kelime olarak, uzun Türkçe anahtarlar ek almış haliyle de eşleşir
const keyRe = (k) => new RegExp(`(^|\\s)${esc(k)}${k.length >= 5 ? '' : '(?=\\s|$)'}`);

function faqMatch(f) {
  let best = null;
  let bestScore = 0;
  for (const item of FAQ) {
    let s = 0;
    for (const k of item.keys) {
      const parts = k.split(' ');
      if (keyRe(k).test(f)) s += parts.length * 2;
      else if (parts.length > 1 && parts.every((p) => keyRe(p).test(f))) s += parts.length * 1.5;
    }
    if (s > bestScore) { bestScore = s; best = item; }
  }
  return bestScore >= 2 ? best : null;
}

const faqAnswer = (item, extra = {}) => ({ title: item.title, blocks: item.blocks, lesson: item.lesson, ...extra });
export const faqById = (id) => (FAQ_BY_ID.get(id) ? faqAnswer(FAQ_BY_ID.get(id), { chips: suggestions() }) : null);

// Bir kelimeyi içeren ders örneklerini bulur
function moreExamples(w) {
  const re = new RegExp(`\\b${w.en.replace(/[-]/g, '\\-')}`, 'i');
  const list = [];
  for (const l of LESSONS) {
    for (const s of l.steps) {
      for (const b of s.blocks) if (b.t === 'ex' && re.test(b.en) && b.en !== w.ex) list.push({ t: 'ex', en: b.en, tr: b.tr });
    }
  }
  return shuffle(list).slice(0, 2);
}

function quizMe() {
  const unit = pick([1, 2]);
  const makers = unit === 1 ? [() => G.vocab(1, 1), () => G.behaviour(1), () => G.lookLike(1), () => G.compForm(1, 1), () => G.compNumbers(1, 1)] : [() => G.vocab(2, 1), () => G.pdgMC(1), () => G.howOften(1), () => G.likes(1), () => G.present(1)];
  const q = pick(makers)()[0];
  return { text: `Hadi bakalım! Ünite ${unit}'den bir soru:`, quiz: q, chips: ['Beni test et', ...suggestions().slice(0, 2)] };
}

const pdgFor = (w) => ({
  title: `${w.en} → ${w.verb.toUpperCase()}`,
  text: `**${w.verb} ${w.en}** doğru kullanım. ${w.verb === 'play' ? 'Top ya da rakip olan oyunlar **play** alır.' : w.verb === 'do' ? 'Dövüş sporları ve topsuz, bireysel etkinlikler **do** alır.' : '-ing ile biten, bir yere gidilerek yapılan etkinlikler **go** alır.'}${w.note ? ` ${w.note}` : ''}`,
  examples: [{ t: 'ex', en: w.ex, tr: w.exTr, say: `s-${w.id}` }],
  lesson: 'u2-pdg',
  chips: ['play do go istisnaları', 'Beni test et'],
});

/* ---------- Ana fonksiyon ---------- */

export function localAnswer(raw, ctx = {}) {
  const name = displayName(store.get('name'));

  // Alıştırmadaki yanlış bir soru hakkında
  if (ctx.question) {
    const q = ctx.question;
    const f = TOPIC_FAQ[q.topic] && FAQ_BY_ID.get(TOPIC_FAQ[q.topic]);
    const qText = q.type === 'order' ? (q.hint || '') : String(q.q || '').replace(/\n/g, ' / ');
    const word = q.ref && WORD.get(q.ref);
    return {
      text: `Bu soruya birlikte bakalım ${name}.\n**Soru:** ${qText || '(resimli soru)'}\n**Doğru cevap:** ${ctx.answer || ''}`,
      blocks: [
        ...(q.why ? [{ t: 'tip', text: q.why.replace(/\n/g, ' · ') }] : []),
        ...(f ? f.blocks : []),
      ],
      word: word || null,
      lesson: f ? f.lesson : null,
      ai: true,
      chips: [...(f ? [{ label: `${f.title} (konu özeti)`, faq: f.id }] : []), 'Beni test et'],
    };
  }

  const text = String(raw || '').trim();
  const F = fold(text).replace(/\?/g, '').trim();
  if (!F) return { text: 'Bir şey yazmadın gibi. Mesela "generous ne demek?" diye sorabilirsin.', chips: suggestions() };

  // Sohbet
  if (/^(merhaba|selam|slm|mrb|hey|hi|hello|hola|gunaydin|iyi aksamlar)\b/.test(F) && F.split(' ').length <= 4) {
    return { text: `Merhaba ${name}! Ben Muffin. Takıldığın her şeyi sorabilirsin: kelime anlamı, konu, örnek cümle... Hemen cevaplarım!`, chips: suggestions(), mood: 'happy' };
  }
  if (/(tesekkur|sagol|sag ol|thank|eyvallah|cok iyisin)/.test(F)) {
    return { text: `Rica ederim ${name}! Her zaman buradayım. Başka sorun var mı?`, chips: suggestions(), mood: 'happy' };
  }
  if (/(nasilsin|how are you)/.test(F)) return { text: 'Harikayım, teşekkürler! Bugün biraz İngilizce çalışmaya ne dersin?', chips: suggestions(), mood: 'happy' };
  if (/(sen kimsin|kimsin|adin ne|muffin kim)/.test(F)) return { text: 'Ben Muffin! Yuvarlak gözlüklü, İngilizceye bayılan bir kediyim. Sana İngilizce çalışırken yardım ediyorum. Kelime sor, konu sor, beni test et!', chips: suggestions(), mood: 'wink' };

  // Beni test et
  if (/(beni test|test et|soru sor|quiz|bana soru|sinav yap|soru ver)/.test(F)) return quizMe();

  // Zıt anlam
  let m = F.match(/^(.+?)\s+(?:kelimesinin\s+|sozcugunun\s+)?(?:zitti|zit anlamlisi|zit anlami|zit anlamli|tersi|karsiti)\b/) || F.match(/opposite of (.+)/) || F.match(/(?:zitti|zit anlamlisi|tersi)\s+(?:ne(?:dir)?\s+)?(.+)/);
  if (m) {
    const hit = wordFromTerm(m[1]);
    if (hit && hit.word) {
      const w = hit.word;
      if (w.opp) {
        const opps = w.opp.split('/').map((s) => s.trim());
        return { text: `**${w.en}** (${w.tr}) kelimesinin zıt anlamlısı: **${opps.join(' / ')}**`, words: opps.map(findWord).filter(Boolean), chips: [`${opps[0]} ne demek?`, 'Zıt anlam yapan ekler', 'Beni test et'] };
      }
      return { text: `**${w.en}** için listemde bir zıt anlamlı yok. Anlamı: ${w.tr}.`, word: w, chips: suggestions() };
    }
  }

  // Karşılaştırma hali
  m = F.match(/^(.+?)\s+(?:nin |nun |in |un )?(?:karsilastirma|comparative|daha hali|er hali|er mi|more mu|more mi)/) || F.match(/comparative of (.+)/);
  if (m) {
    const term = cleanTerm(m[1]);
    const irr = { good: 'better', bad: 'worse', far: 'farther / further', many: 'more', much: 'more', little: 'less' };
    const common = { big: 'bigger', small: 'smaller', hot: 'hotter', cold: 'colder', happy: 'happier', sad: 'sadder', busy: 'busier', heavy: 'heavier', nice: 'nicer', new: 'newer', large: 'larger', high: 'higher', early: 'earlier', hard: 'harder', clean: 'cleaner', great: 'greater', light: 'lighter', warm: 'warmer', late: 'later' };
    if (common[term]) return { text: `**${term}** → **${common[term]}**`, blocks: FAQ_BY_ID.get('comp').blocks.slice(1, 2), lesson: 'u1-comp', chips: ['-er mi more mu?', 'Beni test et'] };
    if (irr[term]) return { text: `**${term}** düzensizdir: **${irr[term]}**. Ezberlemen gerekir!`, blocks: FAQ_BY_ID.get('irregular').blocks, lesson: 'u1-comp' };
    const hit = wordFromTerm(term);
    if (hit && hit.word && hit.word.comp) {
      const w = hit.word;
      const ex = w.unit === 1 && w.pos === 'adj' ? [{ t: 'ex', en: `My brother is ${w.comp} than me.`, tr: `Ağabeyim benden daha ${w.tr.split(/[,;]/)[0].trim()}.` }] : [];
      return { text: `**${w.en}** → **${w.comp}**${w.compAlt ? ` (ya da ${w.compAlt})` : ''}\n${G.compWhy(w)}`, examples: ex, lesson: 'u1-comp', chips: ['-er mi more mu?', 'Düzensiz karşılaştırmalar', 'Beni test et'] };
    }
  }

  // play / do / go
  if (/\b(play|do|go)\b|hangi fiil|fiil/.test(F) && /(\bmi\b|\bmu\b|hangi|fiil)/.test(F)) {
    const sport = SPORTS.slice().sort((a, b) => b.en.length - a.en.length).find((w) => new RegExp(`(^|\\s)${w.en}(\\s|$)`).test(F));
    if (sport) return pdgFor(sport);
  }

  // Türkçeden İngilizceye
  m = F.match(/^(.+?)\s+(?:kelimesinin\s+)?(?:ingilizcesi|ingilizce(?:de)?\s+(?:ne|nasil|nedir)|nasil denir|ingilizce karsiligi|in english)/) || F.match(/ingilizcede\s+(.+?)\s+(?:nasil denir|ne demek|nedir)/);
  if (m) {
    const res = trSearch(m[1]);
    if (res.length) {
      const top = res[0];
      return {
        text: top.word ? `"${m[1]}" İngilizcede **${top.word.en}** demek.` : `"${m[1]}" İngilizcede **${top.gloss}** demek.`,
        word: top.word || null,
        list: res.slice(1),
        chips: top.word ? [`${top.word.en} örnek cümle`, 'Beni test et'] : suggestions(),
      };
    }
    return { text: `"${m[1]}" için listemde bir karşılık bulamadım. Ünite kelimelerinden birini sorabilirsin.`, ai: true, unknown: true, chips: suggestions() };
  }

  // Örnek cümle
  m = F.match(/^(.+?)\s+(?:ile\s+|icin\s+)?(?:ornek cumle|ornek ver|ornek|cumle kur|cumle icinde)/) || F.match(/(?:ornek cumle|example sentence)\s+(?:ver\s+)?(.+)/);
  if (m) {
    const hit = wordFromTerm(m[1]);
    if (hit && hit.word) {
      const w = hit.word;
      return { text: `**${w.en}** ile örnek cümleler:`, examples: [{ t: 'ex', en: w.ex, tr: w.exTr, say: `s-${w.id}` }, ...moreExamples(w)], chips: [`${w.en} ne demek?`, 'Beni test et'] };
    }
  }

  // Anlam: "X ne demek", "what does X mean"
  m = F.match(/^(.+?)\s+(?:ne demek(?:tir)?|nedir|ne anlama gelir|anlami(?:\s+ne(?:dir)?)?|turkcesi(?:\s+ne(?:dir)?)?|demek ne|ne)$/) || F.match(/what does (.+?) mean/) || F.match(/meaning of (.+)/) || F.match(/^(.+?) means$/);
  if (m) {
    const term = m[1];
    const hit = wordFromTerm(term);
    const faqFirst = faqMatch(F);
    if (faqFirst && term.split(' ').length > 2) return faqAnswer(faqFirst, { chips: suggestions() });
    if (hit) return meaning(hit, term);
    const near = closest(term);
    if (near) return { text: `"${cleanTerm(term)}" diye bir kelime bulamadım. Bunu mu demek istedin: **${near.en}**?`, word: near, chips: [`${near.en} örnek cümle`, 'Beni test et'] };
    const tr = trSearch(term);
    if (tr.length && tr[0].word) return { text: `Bu bir Türkçe kelime sanırım. İngilizcesi: **${tr[0].word.en}**`, word: tr[0].word, list: tr.slice(1) };
    if (tr.length && tr[0].gloss) return { text: `Bu bir Türkçe kelime sanırım. İngilizcesi: **${tr[0].gloss}**`, list: tr.slice(1) };
    if (faqFirst) return faqAnswer(faqFirst);
    return { text: `"${cleanTerm(term)}" kelimesi ünite listelerimde yok.`, ai: true, unknown: true, chips: suggestions() };
  }

  // Tek başına bir kelime ya da kalıp yazıldıysa anlamını göster
  const exact = findWord(F);
  if (exact) return meaning({ word: exact, form: F }, F);
  if (!F.includes(' ')) {
    const h = lookupToken(F);
    if (h) return meaning(h, F);
  }

  // Cümle yapıştırıldıysa: kelime kelime anlam ve yapı tahmini
  const tokens = text.match(/[A-Za-z][A-Za-z'-]*/g) || [];
  const english = tokens.filter((t) => lookupToken(t));
  const turkishQuestion = /(^|\s)(mi|mu|ne|nedir|nasil|ile|fark|farki|demek|hangi|hangisi|neden|niye|icin|zaman|nerede|kac|anlat|acikla)(\s|$)/.test(F);
  if (!turkishQuestion && tokens.length >= 3 && english.length >= tokens.length * 0.75) {
    const parts = [];
    const seen = new Set();
    for (const t of tokens) {
      const h = lookupToken(t);
      if (!h) continue;
      const key = h.word ? h.word.en : h.base;
      if (seen.has(key)) continue;
      seen.add(key);
      parts.push(`**${t}**: ${h.word ? h.word.tr : h.tr}`);
    }
    const grammar = /\bthan\b/i.test(text) ? FAQ_BY_ID.get('comp') : /\blook(s)? like\b/i.test(text) ? FAQ_BY_ID.get('looklike') : /\b(always|usually|often|sometimes|rarely|seldom|never)\b/i.test(text) ? FAQ_BY_ID.get('freq-pos') : /\b(has|have) got\b/i.test(text) ? FAQ_BY_ID.get('hasgot') : null;
    return { text: `Cümledeki kelimeler:\n${parts.join(' · ')}`, blocks: grammar ? grammar.blocks : null, lesson: grammar ? grammar.lesson : null, ai: true, chips: suggestions() };
  }

  // Bilgi bankası
  const faq = faqMatch(F);
  if (faq) return faqAnswer(faq, { ai: true });

  // Yazım hatası tahmini
  if (F.split(' ').length <= 2) {
    const near = closest(F);
    if (near) return { text: `Bunu mu demek istedin: **${near.en}**?`, word: near, chips: [`${near.en} örnek cümle`] };
    const tr = trSearch(F);
    if (tr.length && tr[0].word) return { text: `"${text}" İngilizcede **${tr[0].word.en}** demek.`, word: tr[0].word, list: tr.slice(1) };
  }

  return {
    text: 'Bunu tam anlayamadım. Şöyle sorabilirsin:\n• *generous* ne demek?\n• *çalışkan* İngilizcesi ne?\n• *tall* zıttı ne?\n• *funny* karşılaştırma hali\n• *karate* play mi do mu go mu?\n• look like ile be like farkı',
    ai: true,
    unknown: true,
    mood: 'think',
    chips: suggestions(),
  };
}

function meaning(hit, term) {
  if (hit.word) {
    const w = hit.word;
    const derived = hit.form && hit.form !== w.en.toLowerCase();
    const note = derived ? (w.comp && w.comp.toLowerCase() === hit.form ? `"${hit.form}", **${w.en}** kelimesinin karşılaştırma halidir.` : `"${hit.form}" kelimesinin kökü **${w.en}**.`) : '';
    const chips = [`${w.en} örnek cümle`];
    if (w.opp) chips.push(`${w.en} zıttı ne?`);
    if (w.comp) chips.push(`${w.en} karşılaştırma hali`);
    if (w.verb) chips.push(`${w.en} play mi do mu go mu?`);
    return { text: note, word: w, chips };
  }
  return { text: `**${hit.base}** = ${hit.tr}${hit.form !== hit.base ? `\n("${hit.form}", ${hit.base} kelimesinin çekimli hali.)` : ''}`, chips: suggestions() };
}

export { EXAM_BANK };
