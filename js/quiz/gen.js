// Alıştırma soruları: verilerden üretilenler ve elle yazılmış havuzlar
// Soru türleri: mc (çoktan seçmeli), match (eşleştirme), order (cümle kurma), sort (gruplama)

import { WORDS, WORD, wordsOf } from '../data/words.js';
import { AUDIO } from '../data/audio.js';
import { shuffle, pick, randInt } from '../lib/dom.js';
import { wordBox } from '../lib/store.js';
import { describe, fill as fillPerson, isMale } from '../ui/person.js';

/* ---------- Yardımcılar ---------- */

const senses = (tr) => tr.toLocaleLowerCase('tr').replace(/\(.*?\)/g, '').split(/[,;/]/).map((s) => s.trim()).filter(Boolean);
const overlap = (a, b) => a.en === b.en || senses(a.tr).some((x) => senses(b.tr).includes(x));
export const shortTr = (w) => w.tr.split(';')[0].replace(/\s*\(.*?\)\s*/g, ' ').trim();

function mc(correct, wrongs, extra) {
  const uniq = [];
  for (const w of wrongs) if (w !== correct && !uniq.includes(w)) uniq.push(w);
  const opts = shuffle([correct, ...uniq]);
  return { type: 'mc', opts, a: opts.indexOf(correct), ...extra };
}

function distractors(w, pool, n, test = () => true) {
  const same = shuffle(pool.filter((x) => x.id !== w.id && x.cat === w.cat && !overlap(x, w) && test(x)));
  const other = shuffle(pool.filter((x) => x.id !== w.id && x.cat !== w.cat && x.pos === w.pos && !overlap(x, w) && test(x)));
  const out = [];
  for (const x of [...same, ...other]) {
    if (out.length >= n) break;
    if (!out.some((o) => overlap(o, x) || shortTr(o) === shortTr(x))) out.push(x);
  }
  return out;
}

// Az bilinen kelimeler önce gelsin
function pickWords(list, n) {
  const scored = shuffle(list).map((w) => ({ w, s: wordBox(w.id) + Math.random() * 1.5 }));
  scored.sort((a, b) => a.s - b.s);
  return scored.slice(0, n).map((x) => x.w);
}

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* ---------- Kelime ---------- */

export function vocab(unit, n = 10) {
  const pool = wordsOf(unit);
  return pickWords(pool, n).map((w, i) => {
    const toTr = i % 5 !== 1 && i % 5 !== 3;
    const ws = distractors(w, pool, 3);
    const why = `**${w.en}** = ${w.tr}\n*${w.ex}*`;
    if (toTr) return mc(shortTr(w), ws.map(shortTr), { q: w.en, big: true, sub: 'Bu kelimenin Türkçesi hangisi?', audio: `w-${w.id}`, why, ref: w.id, topic: 'vocab' });
    return mc(w.en, ws.map((x) => x.en), { q: shortTr(w), big: true, sub: 'İngilizcesi hangisi?', why, ref: w.id, topic: 'vocab' });
  });
}

export function listen(unit, n = 10) {
  const pool = wordsOf(unit).filter((w) => AUDIO.has(`w-${w.id}`));
  if (pool.length < 4) return vocab(unit, n);
  return pickWords(pool, n).map((w) => {
    const ws = distractors(w, pool, 3, (x) => x.en.length > 2);
    return mc(w.en, ws.map((x) => x.en), { q: '', listen: true, sub: 'Dinle ve duyduğun kelimeyi seç.', audio: `w-${w.id}`, autoplay: true, why: `Duyduğun kelime **${w.en}**: ${w.tr}`, ref: w.id, topic: 'vocab' });
  });
}

export function fillBlank(unit, n = 10) {
  const pool = wordsOf(unit);
  const usable = pool.filter((w) => new RegExp(`\\b${w.en.replace(/[-]/g, '\\-')}\\b`, 'i').test(w.ex));
  const withOpts = usable.filter((w) => distractors(w, pool, 3, (x) => x.pos === w.pos).length === 3);
  return pickWords(withOpts, n).map((w) => {
    const re = new RegExp(`\\b${w.en.replace(/[-]/g, '\\-')}\\b`, 'i');
    const sentence = w.ex.replace(re, '______');
    const ws = distractors(w, pool, 3, (x) => x.pos === w.pos);
    return mc(w.en, ws.map((x) => x.en), { q: sentence, hint: w.exTr, sub: 'Boşluğa hangisi gelir? (Türkçesi ipucu)', why: `**${w.en}** = ${w.tr}\n*${w.ex}*`, ref: w.id, topic: 'vocab' });
  });
}

/* ---------- Zıt anlamlılar ---------- */

const OPP = {
  1: [['tall', 'short'], ['young', 'old'], ['fat', 'thin'], ['strong', 'weak'], ['straight', 'curly'], ['fair', 'dark'], ['beautiful', 'ugly'], ['friendly', 'unfriendly'], ['hard-working', 'lazy'], ['generous', 'selfish'], ['polite', 'rude'], ['outgoing', 'shy'], ['talkative', 'quiet'], ['patient', 'impatient'], ['careful', 'careless'], ['tidy', 'messy'], ['cheerful', 'grumpy'], ['honest', 'dishonest'], ['calm', 'nervous'], ['modest', 'arrogant'], ['funny', 'serious'], ['kind', 'cruel'], ['similar', 'different']],
  2: [['exciting', 'boring'], ['dangerous', 'safe'], ['expensive', 'cheap'], ['difficult', 'easy'], ['fast', 'slow'], ['win', 'lose'], ['indoor', 'outdoor'], ['love', 'hate'], ['always', 'never'], ['relaxing', 'tiring'], ['like', 'dislike']],
};

export function oppMatch(unit, n = 5) {
  const pairs = shuffle(OPP[unit]).slice(0, n);
  return { type: 'match', q: 'Zıt anlamlıları eşleştir.', sub: 'Soldan bir kelime, sağdan zıt anlamlısını seç.', pairs, why: pairs.map(([a, b]) => `${a} ↔ ${b}`).join(', '), topic: 'opposites' };
}

export function oppMC(unit, n = 6) {
  const list = OPP[unit];
  return shuffle(list.flatMap(([a, b]) => [[a, b, 0], [b, a, 1]])).slice(0, n).map(([x, y, side]) => {
    // Çeldiriciler aynı taraftan seçilir; böylece hiçbiri x'in zıttı olmaz
    const others = shuffle(list.filter(([a, b]) => a !== x && b !== x)).map((p) => p[side]).slice(0, 3);
    const wx = WORD.get(x.replace(/\s+/g, '-'));
    return mc(y, others, { q: `What is the opposite of "${x}"?`, sub: wx ? `${x} = ${shortTr(wx)}` : '', why: `**${x}** ↔ **${y}**`, topic: 'opposites' });
  });
}

/* ---------- Karşılaştırma ---------- */

function wrongComps(base, comp) {
  if (comp.startsWith('more ')) return [`${base}er`, `more ${base}er`, base];
  if (comp.endsWith('ier') && base.endsWith('y')) return [`${base}er`, `more ${base}`, `more ${comp}`];
  if (comp.length === base.length + 3 && comp[base.length] === base.at(-1)) return [`${base}er`, `more ${base}`, `more ${comp}`];
  if (base.endsWith('e')) return [`${base}er`, `more ${base}`, `more ${comp}`];
  return [`more ${base}`, `more ${comp}`, `${base}${base.at(-1)}er`];
}

export function compForm(unit, n = 4) {
  const pool = wordsOf(unit).filter((w) => w.comp && !w.compAlt && !/[-\s]/.test(w.en) && w.pos === 'adj');
  return shuffle(pool).slice(0, n).map((w) => mc(w.comp, wrongComps(w.en, w.comp).slice(0, 3), {
    q: `${w.en} → ?`, big: true, sub: 'Doğru karşılaştırma hali hangisi?', why: compWhy(w), ref: w.id, topic: 'comp',
  }));
}

export function compWhy(w) {
  const b = w.en;
  const c = w.comp;
  if (c.startsWith('more ')) return `**${b}** uzun bir sıfattır, önüne **more** gelir: ${c}.`;
  if (c.endsWith('ier') && b.endsWith('y')) return `**${b}** -y ile biter: y düşer, **-ier** gelir: ${c}.`;
  if (c.length === b.length + 3) return `**${b}** sessiz-sesli-sessiz ile biter, son harf çiftlenir: ${c}.`;
  if (b.endsWith('e')) return `**${b}** -e ile biter, sadece **-r** eklenir: ${c}.`;
  return `**${b}** kısa bir sıfattır, **-er** eklenir: ${c}.`;
}

const NAMES = [['Can', 'he'], ['Ece', 'she'], ['Mert', 'he'], ['Defne', 'she'], ['Kerem', 'he'], ['Ada', 'she'], ['Burak', 'he'], ['Selin', 'she'], ['Emre', 'he'], ['Zeynep', 'she']];

export function compNumbers(unit, n = 4) {
  const out = [];
  const kinds = unit === 1 ? ['age', 'height', 'age', 'height'] : ['price', 'speed', 'price', 'speed'];
  for (let i = 0; i < n; i++) {
    const kind = kinds[i % kinds.length];
    const [[a], [b]] = shuffle(NAMES).slice(0, 2);
    if (kind === 'age') {
      const x = randInt(10, 15);
      let y = randInt(10, 15);
      if (y === x) y = x + 2;
      const older = x > y;
      const c = older ? 'older than' : 'younger than';
      out.push(mc(c, [older ? 'younger than' : 'older than', older ? 'more old than' : 'more young than', 'as old as'], { q: `${a} is ${x} years old. ${b} is ${y} years old.\n${a} is ______ ${b}.`, why: `${a} ${older ? 'daha büyük' : 'daha küçük'}: ${older ? 'old → older' : 'young → younger'} than.`, topic: 'comp' }));
    } else if (kind === 'height') {
      const x = randInt(140, 172);
      let y = randInt(140, 172);
      if (Math.abs(y - x) < 4) y = x + 6;
      const taller = x > y;
      const c = taller ? 'taller than' : 'shorter than';
      const m = (v) => `1.${String(v - 100).padStart(2, '0')} m`;
      out.push(mc(c, [taller ? 'shorter than' : 'taller than', taller ? 'more tall than' : 'more short than', 'as tall as'], { q: `${a} is ${m(x)}. ${b} is ${m(y)}.\n${a} is ______ ${b}.`, why: `${a} ${taller ? 'daha uzun' : 'daha kısa'}: ${taller ? 'tall → taller' : 'short → shorter'} than.`, topic: 'comp' }));
    } else if (kind === 'price') {
      const plural = (x) => /^(Skis|Skates|Trainers|Goggles)$/.test(x);
      const [[ia, pa], [ib, pb]] = shuffle([['Skis', 3200], ['Skates', 900], ['A racket', 1500], ['Trainers', 1100], ['A helmet', 700], ['A surfboard', 4000], ['Goggles', 300]]).slice(0, 2);
      const more = pa > pb;
      const c = more ? 'more expensive than' : 'cheaper than';
      const q = `${ia} ${plural(ia) ? 'cost' : 'costs'} ${pa} TL. ${ib} ${plural(ib) ? 'cost' : 'costs'} ${pb} TL.\n${ia} ${plural(ia) ? 'are' : 'is'} ______ ${ib.toLowerCase()}.`;
      out.push(mc(c, more ? ['cheaper than', 'expensiver than', 'more expensiver than'] : ['more expensive than', 'more cheap than', 'more cheaper than'], { q, why: more ? '"expensive" uzun sıfattır: more expensive than.' : '"cheap" kısa sıfattır: cheaper than.', topic: 'comp' }));
    } else {
      const [[aa, va], [ab, vb]] = shuffle([['A cheetah', 110], ['A horse', 70], ['A tortoise', 1], ['A rabbit', 50], ['A dog', 45]]).slice(0, 2);
      const faster = va > vb;
      const c = faster ? 'faster than' : 'slower than';
      out.push(mc(c, faster ? ['slower than', 'more fast than', 'more faster than'] : ['faster than', 'more slow than', 'more slower than'], { q: `${aa} can run ${va} km/h. ${ab} can run ${vb} km/h.\n${aa} is ______ ${ab.toLowerCase()}.`, why: `${faster ? 'fast → faster' : 'slow → slower'}: kısa sıfatlar -er alır.`, topic: 'comp' }));
    }
  }
  return out;
}

const COMP_SETS = {
  1: [
    ['My brother is taller than me.', 'My brother is more taller than me.', 'My brother is tall than me.', 'My brother is taller from me.'],
    ['Ece is more generous than Ali.', 'Ece is generouser than Ali.', 'Ece is more generouser than Ali.', 'Ece is generous than Ali.'],
    ['This puzzle is easier than that one.', 'This puzzle is easyer than that one.', 'This puzzle is more easy than that one.', 'This puzzle is more easier than that one.'],
    ['My cat is fatter than your cat.', 'My cat is fater than your cat.', 'My cat is more fat than your cat.', 'My cat is fatter then your cat.'],
    ['Your idea is better than mine.', 'Your idea is gooder than mine.', 'Your idea is more good than mine.', 'Your idea is more better than mine.'],
    ['Today is worse than yesterday.', 'Today is badder than yesterday.', 'Today is more bad than yesterday.', 'Today is more worse than yesterday.'],
    ['My sister is more hard-working than me.', 'My sister is hard-workinger than me.', 'My sister is more hard-workinger than me.', 'My sister is hard-working than me.'],
    ['He is funnier than his brother.', 'He is funnyer than his brother.', 'He is more funnier than his brother.', 'He is funny than his brother.'],
  ],
  2: [
    ['Rafting is more exciting than fishing.', 'Rafting is excitinger than fishing.', 'Rafting is more excitinger than fishing.', 'Rafting is exciting than fishing.'],
    ['Running is cheaper than skiing.', 'Running is more cheap than skiing.', 'Running is cheaper from skiing.', 'Running is more cheaper than skiing.'],
    ['Swimming is healthier than watching TV.', 'Swimming is healthyer than watching TV.', 'Swimming is more healthier than watching TV.', 'Swimming is more healthy then watching TV.'],
    ['Boxing is more dangerous than yoga.', 'Boxing is dangerouser than yoga.', 'Boxing is dangerous than yoga.', 'Boxing is more dangerouser than yoga.'],
    ['A cheetah is faster than a horse.', 'A cheetah is more fast than a horse.', 'A cheetah is fastter than a horse.', 'A cheetah is faster from a horse.'],
  ],
};

export function compCorrect(unit, n = 2) {
  return shuffle(COMP_SETS[unit]).slice(0, n).map(([ok, ...bad]) => mc(ok, bad, { q: 'Which sentence is correct?', sub: 'Hangi cümle doğru?', why: 'Kısa sıfatlar **-er**, uzun sıfatlar **more** alır; ikisi birlikte kullanılmaz. Düzensizler: good → better, bad → worse. Karşılaştırmada **than** kullanılır.', topic: 'comp' }));
}

/* ---------- Kişi tarifi (Ünite 1) ---------- */

const KINDS = ['girl', 'boy', 'woman', 'man'];
const COLORS = ['black', 'brown', 'blonde', 'red'];
const LENS_F = ['long', 'shoulder', 'short'];
const TYPES = ['straight', 'curly', 'wavy'];

function randomPerson() {
  const kind = pick(KINDS);
  const male = isMale(kind);
  const p = { kind, hairColor: pick(COLORS), hairLen: male ? (Math.random() < 0.18 && kind === 'man' ? 'bald' : 'short') : pick(LENS_F) };
  p.hairType = p.hairLen === 'short' ? pick(['straight', 'curly']) : pick(TYPES);
  p.glasses = Math.random() < 0.4;
  if (kind === 'man') p.beard = Math.random() < 0.4;
  if (!male) p.freckles = Math.random() < 0.25;
  return p;
}

const FEATURES = ['hairColor', 'hairType', 'hairLen', 'glasses', 'beard', 'freckles'];
function mutate(p) {
  const q = { ...p };
  const male = isMale(p.kind);
  const options = ['hairColor', 'hairType', 'glasses'];
  if (!male) options.push('hairLen');
  if (p.kind === 'man') options.push('beard');
  const f = pick(options);
  if (f === 'hairColor') q.hairColor = pick(COLORS.filter((c) => c !== p.hairColor));
  if (f === 'hairLen') q.hairLen = pick(LENS_F.filter((c) => c !== p.hairLen));
  if (f === 'hairType') q.hairType = pick((q.hairLen === 'short' ? ['straight', 'curly'] : TYPES).filter((c) => c !== p.hairType));
  if (q.hairLen === 'short' && q.hairType === 'wavy') q.hairType = 'straight';
  if (f === 'glasses') q.glasses = !p.glasses;
  if (f === 'beard') q.beard = !p.beard;
  if (q.hairLen === 'bald') q.hairType = p.hairType;
  return q;
}
const keyOf = (p) => { const f = fillPerson(p); return FEATURES.map((k) => String(f[k] ?? '')).join('|') + f.kind; };
const featuresOf = (p) => (p.kind === 'man' ? ['hair', 'glasses', 'beard'] : isMale(p.kind) ? ['hair', 'glasses'] : ['hair', 'glasses', 'freckles']);

export function personPick(n = 5) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const target = randomPerson();
    if (target.hairLen === 'bald') target.hairLen = 'short';
    const set = [target];
    let guard = 0;
    while (set.length < 4 && guard++ < 60) {
      const d = mutate(target);
      if (describe(d, featuresOf(d)) === describe(target, featuresOf(target))) continue;
      if (set.some((s) => keyOf(s) === keyOf(d))) continue;
      set.push(d);
    }
    const opts = shuffle(set);
    out.push({ type: 'mc', pickPeople: true, q: describe(target, featuresOf(target)), sub: 'Tarif edilen kişiyi bul.', opts, a: opts.indexOf(target), why: `${'Resme sırayla bak: saçın uzunluğu, şekli ve rengi; sonra gözlük, sakal ve çil. Her cümleyi resimle tek tek karşılaştır.'} Tarif: *${describe(target, featuresOf(target))}*`, topic: 'appearance' });
  }
  return out;
}

export function personDescribe(n = 5) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const target = randomPerson();
    const right = describe(target, featuresOf(target));
    const wrong = [];
    let guard = 0;
    while (wrong.length < 3 && guard++ < 60) {
      const d = describe(mutate(target), featuresOf(target));
      if (d !== right && !wrong.includes(d)) wrong.push(d);
    }
    out.push(mc(right, wrong, { q: 'Which sentence describes the person?', sub: 'Resimdeki kişiyi hangi cümle anlatıyor?', people: [target], why: 'Resme sırayla bak: saçın uzunluğu, şekli ve rengi; sonra gözlük, sakal ve çil. Her cümleyi resimle tek tek karşılaştır.', topic: 'appearance' }));
  }
  return out;
}

/* ---------- Davranıştan kişilik (Ünite 1) ---------- */

const BEHAVE = [
  ["He always helps his friends with their homework.", 'He', 'helpful', ['lazy', 'rude', 'selfish']],
  ["She never shares her things with anybody.", 'She', 'selfish', ['generous', 'helpful', 'kind']],
  ["My grandfather often buys presents for everybody.", 'He', 'generous', ['selfish', 'mean', 'lazy']],
  ["Ali is never late. He always arrives on time.", 'He', 'punctual', ['forgetful', 'careless', 'lazy']],
  ["Elif often forgets her books at home.", 'She', 'forgetful', ['punctual', 'careful', 'tidy']],
  ["Burak studies for hours every day.", 'He', 'hard-working', ['lazy', 'careless', 'rude']],
  ["My cat sleeps all day and never plays.", 'It', 'lazy', ['hard-working', 'energetic', 'curious']],
  ["Deniz tells jokes and makes everybody laugh.", 'She', 'funny', ['serious', 'shy', 'grumpy']],
  ["He never tells lies.", 'He', 'honest', ['dishonest', 'rude', 'jealous']],
  ["Her room is always clean and everything is in its place.", 'She', 'tidy', ['messy', 'careless', 'lazy']],
  ["Mert doesn't talk much when he meets new people.", 'He', 'shy', ['outgoing', 'talkative', 'sociable']],
  ["Zeynep loves meeting new people and going to parties.", 'She', 'outgoing', ['shy', 'quiet', 'grumpy']],
  ["My sister talks all the time. She never stops!", 'She', 'talkative', ['quiet', 'shy', 'calm']],
  ["He always says \"please\" and \"thank you\".", 'He', 'polite', ['rude', 'selfish', 'arrogant']],
  ["She shouts at people and never says \"sorry\".", 'She', 'rude', ['polite', 'kind', 'modest']],
  ["Our teacher never gets angry. She explains things again and again.", 'She', 'patient', ['impatient', 'nervous', 'grumpy']],
  ["My little brother can't wait for anything.", 'He', 'impatient', ['patient', 'calm', 'careful']],
  ["Firefighters run into burning buildings to save people.", 'They', 'brave', ['shy', 'lazy', 'nervous']],
  ["He always reads the questions twice in exams.", 'He', 'careful', ['careless', 'forgetful', 'lazy']],
  ["She thinks she is better than everybody.", 'She', 'arrogant', ['modest', 'kind', 'shy']],
  ["He is a great player, but he never talks about it.", 'He', 'modest', ['arrogant', 'selfish', 'rude']],
  ["She always paints, writes stories and makes new things.", 'She', 'creative', ['lazy', 'boring', 'careless']],
  ["Grandpa is angry and unhappy every morning.", 'He', 'grumpy', ['cheerful', 'funny', 'easygoing']],
  ["She is always happy and smiling.", 'She', 'cheerful', ['grumpy', 'moody', 'nervous']],
];

export function behaviour(n = 10) {
  return shuffle(BEHAVE).slice(0, n).map(([s, subj, ans, wrong]) => {
    const w = WORD.get(ans) || { tr: '' };
    return mc(ans, wrong, { q: `${s}\n${subj} ${subj === 'They' ? 'are' : 'is'} ______.`, sub: 'Davranışa göre nasıl biri?', why: `**${ans}** = ${w.tr}`, ref: ans, topic: 'personality' });
  });
}

/* ---------- look like / be like (Ünite 1) ---------- */

const LOOKLIKE = [
  ['A: What does your brother look like?\nB: ______', 'He is tall and he has got curly hair.', ['He is very kind and funny.', 'He likes basketball.', 'He is fine, thanks.'], '"look like" dış görünüşü sorar.'],
  ['A: What is your best friend like?\nB: ______', 'She is friendly and helpful.', ['She has got long hair.', 'She is short and slim.', 'She wears glasses.'], '"What is ... like?" kişiliği sorar.'],
  ['A: ______\nB: She looks like her mother.', 'Who does she look like?', ['What does she look like?', 'What is she like?', 'How is she?'], 'Kime benzediğini soran soru: Who does she look like?'],
  ['A: ______\nB: He is short and he has got a beard.', 'What does he look like?', ['What is he like?', 'Who does he look like?', 'How is he?'], 'Cevap dış görünüşü anlatıyor: What does he look like?'],
  ['A: ______\nB: She is generous and honest.', 'What is she like?', ['What does she look like?', 'Who does she look like?', 'How old is she?'], 'Cevap kişiliği anlatıyor: What is she like?'],
  ['A: How is your grandmother?\nB: ______', "She's fine, thanks.", ['She is old and short.', 'She looks like my mum.', 'She has got grey hair.'], '"How is she?" hatır sorar: Nasıl, iyi mi?'],
  ['A: Do you look like your father?\nB: ______. We both have got blue eyes.', 'Yes, I do', ["No, I don't", 'Yes, I am', "No, I'm not"], '"Do you...?" sorusuna "Yes, I do." ile cevap verilir.'],
  ['A: What do your parents look like?\nB: ______', 'My mum is slim and my dad is tall.', ['They are kind and patient.', 'They like hiking.', 'They are fine.'], '"look like" dış görünüşü sorar.'],
  ['Which one asks about personality?', 'What is your teacher like?', ['What does your teacher look like?', 'Who does your teacher look like?', 'How tall is your teacher?'], '"What is ... like?" kişiliği sorar.'],
  ['Which one is correct?', 'What does he look like?', ['What does he looks like?', 'What is he look like?', 'What he does look like?'], 'does + yalın fiil: What does he look like?'],
  ['Choose the correct sentence.', 'I look like my grandfather.', ['I am look like my grandfather.', 'I look like to my grandfather.', 'I looks like my grandfather.'], '"look like" bir fiildir: I look like...'],
  ['My sister ______ like my mum. They have both got red hair.', 'looks', ['look', 'is look', 'looking'], 'She ile fiil -s alır: looks like.'],
];

export function lookLike(n = 10) {
  return shuffle(LOOKLIKE).slice(0, n).map(([q, ok, bad, why]) => mc(ok, bad, { q, why, topic: 'looklike' }));
}

/* ---------- Cümle kurma ---------- */

const ORDER = {
  1: [
    ['What does your sister look like?', 'Kız kardeşin nasıl görünüyor?'],
    ['She has got long curly hair.', 'Onun uzun kıvırcık saçı var.'],
    ['He is taller than his brother.', 'O, kardeşinden daha uzun boylu.'],
    ['I look like my father.', 'Babama benziyorum.'],
    ['What is your best friend like?', 'En yakın arkadaşın nasıl biri?'],
    ['My grandmother is very kind.', 'Büyükannem çok naziktir.'],
    ['He wears glasses.', 'O gözlük takar.'],
    ['Is she older than you?', 'O, senden daha büyük mü?'],
    ['My uncle has got a long beard.', 'Amcamın uzun bir sakalı var.'],
    ['Ece is more hard-working than me.', 'Ece benden daha çalışkan.'],
    ['Who does she look like?', 'O kime benziyor?'],
    ['The girl with glasses is my cousin.', 'Gözlüklü kız benim kuzenim.'],
  ],
  2: [
    ['I always go swimming.', 'Her zaman yüzmeye giderim.'],
    ['How often do you play tennis?', 'Ne sıklıkla tenis oynarsın?'],
    ["He doesn't like boxing.", 'O boksu sevmez.'],
    ['She does yoga twice a week.', 'Haftada iki kez yoga yapar.', ['Twice a week she does yoga.']],
    ['Do you play volleyball?', 'Voleybol oynar mısın?'],
    ['My brother is good at chess.', 'Ağabeyim satrançta iyidir.'],
    ['I love playing basketball.', 'Basketbol oynamaya bayılırım.'],
    ['We never go skiing.', 'Asla kayağa gitmeyiz.'],
    ['What is your favourite sport?', 'En sevdiğin spor ne?'],
    ['Rafting is more exciting than fishing.', 'Rafting balık tutmaktan daha heyecan verici.'],
    ['She is interested in archery.', 'O okçulukla ilgileniyor.'],
    ['Does your father go jogging?', 'Baban koşuya çıkar mı?'],
  ],
};

export function order(unit, n = 8) {
  return shuffle(ORDER[unit]).slice(0, n).map(([s, tr, alts = []]) => {
    const tokens = s.replace(/[.?!]$/, '').split(' ');
    return { type: 'order', q: 'Kelimeleri sıraya koyarak cümleyi kur.', hint: tr, tokens, answer: s.replace(/[.?!]$/, ''), alts: alts.map((a) => a.replace(/[.?!]$/, '')), end: s.slice(-1), why: s.endsWith('?') ? 'Soru cümlesinde sıra: soru kelimesi + do / does / is + özne + fiil.' : 'Cümle sırası: özne + fiil + nesne + (yer / zaman).', topic: 'order' };
  });
}

/* ---------- PLAY / DO / GO (Ünite 2) ---------- */

const sportsWith = (v) => WORDS.filter((w) => w.verb === v);
const PDG_WHY = {
  play: '**play**: topla ya da rakibe karşı oynanan oyunlar.',
  do: '**do**: dövüş sporları ve topsuz, bireysel etkinlikler.',
  go: '**go**: -ing ile biten, bir yere gidilerek yapılan etkinlikler.',
};
const pdgWhy = (w) => `${w.note ? `${w.note} ` : ''}${PDG_WHY[w.verb]} → **${w.verb} ${w.en}**`;
const third = { play: 'plays', do: 'does', go: 'goes' };

export function pdgMC(n = 6) {
  const all = WORDS.filter((w) => w.verb);
  const exceptions = all.filter((w) => ['boxing', 'wrestling', 'bowling', 'fencing', 'weightlifting'].includes(w.id));
  const list = shuffle([...shuffle(exceptions).slice(0, 2), ...shuffle(all.filter((w) => !exceptions.includes(w))).slice(0, n)]).slice(0, n);
  return list.map((w, i) => {
    if (i % 3 === 2) {
      const [[name, pr]] = shuffle(NAMES);
      return mc(third[w.verb], ['plays', 'does', 'goes'], { q: `${name} ______ ${w.en} at weekends.`, sub: `${pr === 'he' ? 'He' : 'She'} ile fiil -s / -es alır.`, why: pdgWhy(w), topic: 'pdg' });
    }
    return mc(w.verb, ['play', 'do', 'go'], { q: `______ ${w.en}`, big: true, sub: `${w.en} = ${shortTr(w)}`, why: pdgWhy(w), topic: 'pdg' });
  });
}

export function pdgSort() {
  const pick3 = (v) => shuffle(sportsWith(v)).slice(0, 3);
  const items = shuffle([...pick3('play'), ...pick3('do'), ...pick3('go')]).map((w) => ({ text: w.en, bin: w.verb, pic: w.pic }));
  return { type: 'sort', q: 'Sporları doğru fiile yerleştir.', sub: 'Bir spora dokun, sonra PLAY, DO ya da GO kutusuna dokun.', bins: [{ id: 'play', label: 'PLAY' }, { id: 'do', label: 'DO' }, { id: 'go', label: 'GO' }], items, why: 'play: top / rakip · do: dövüş ve bireysel · go: -ing ile biten hareket', topic: 'pdg' };
}

/* ---------- Sıklık (Ünite 2) ---------- */

const FREQ_WORDS = ['always', 'usually', 'often', 'sometimes', 'rarely', 'never'];

export function freqMeaning(n = 3) {
  const pool = WORDS.filter((w) => w.cat === 'frequency' && w.pct != null);
  return shuffle(pool.filter((w) => FREQ_WORDS.includes(w.id))).slice(0, n).map((w) => {
    const wrong = shuffle(pool.filter((x) => x.id !== w.id && x.pct !== w.pct)).slice(0, 3).map(shortTr);
    return mc(shortTr(w), wrong, { q: w.en, big: true, sub: 'Anlamı hangisi?', audio: `w-${w.id}`, why: `**${w.en}** = ${w.tr}`, ref: w.id, topic: 'freq' });
  });
}

const POS_BASE = [
  ['She', 'goes swimming', 'on Sundays'],
  ['I', 'play chess', 'with my grandpa'],
  ['We', 'go camping', 'in summer'],
  ['My dad', 'goes jogging', 'in the morning'],
  ['They', 'play football', 'after school'],
  ['He', 'does karate', 'at the sports club'],
];
const BE_BASE = [['He', 'is', 'late for training'], ['She', 'is', 'happy after a match'], ['They', 'are', 'tired on Mondays'], ['I', 'am', 'hungry after swimming']];

export function freqPos(n = 4) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const adv = pick(['always', 'usually', 'often', 'never', 'rarely']);
    if (i % 2 === 1) {
      const [s, be, rest] = pick(BE_BASE);
      const ok = `${s} ${be} ${adv} ${rest}.`;
      const [first, ...more] = rest.split(' ');
      const bad = [`${s} ${adv} ${be} ${rest}.`, `${s} ${be} ${first} ${adv} ${more.join(' ')}.`];
      out.push(mc(ok, bad, { q: 'Which sentence is correct?', sub: `"${adv}" cümlede nereye gelir?`, why: `am / is / are varsa sıklık zarfı ondan **sonra** gelir: *${ok}*`, topic: 'freq' }));
    } else {
      const [s, vp, rest] = pick(POS_BASE);
      const [verb, ...obj] = vp.split(' ');
      const ok = `${s} ${adv} ${vp} ${rest}.`;
      const bad = [`${s} ${verb} ${adv} ${obj.join(' ')} ${rest}.`, `${s} ${vp} ${adv} ${rest}.`];
      if (adv === 'always' || adv === 'never') bad.push(`${cap(adv)} ${s === 'I' ? 'I' : s.charAt(0).toLowerCase() + s.slice(1)} ${vp} ${rest}.`);
      out.push(mc(ok, bad, { q: 'Which sentence is correct?', sub: `"${adv}" cümlede nereye gelir?`, why: `Sıklık zarfı asıl fiilin **önüne** gelir: *${ok}*`, topic: 'freq' }));
    }
  }
  return out;
}

export function freqScale() {
  return { type: 'order', q: 'Sıklık zarflarını en sıktan (%100) en seyreğe (%0) sırala.', hint: 'her zaman → hiçbir zaman', tokens: FREQ_WORDS.slice(), answer: FREQ_WORDS.join(' '), alts: [], end: '', why: 'always (%100) → usually → often → sometimes → rarely → never (%0)', topic: 'freq', sep: '→' };
}

const HOW_OFTEN = [
  ['A: ______ do you go swimming?\nB: Twice a week.', 'How often', ['What', 'Where', 'Which'], 'Sıklık soran soru: How often?'],
  ['A: ______ does your sister do yoga?\nB: Every morning.', 'How often', ['Who', 'Where', 'What'], 'Cevap bir sıklık: How often?'],
  ['A: How often does Ali play tennis?\nB: ______', 'Once a week.', ['At the park.', 'Yes, he does.', 'With his sister.'], '"How often" sorusunun cevabı bir sıklıktır.'],
  ['A: How often do they go skiing?\nB: ______', 'Three times a year.', ['In Uludağ.', 'Because it is fun.', 'Yes, they do.'], '"How often" sorusunun cevabı bir sıklıktır.'],
  ['Which one means "haftada iki kez"?', 'twice a week', ['two week', 'once a week', 'twice a month'], 'twice = iki kez, a week = haftada'],
  ['Which one means "ayda bir kez"?', 'once a month', ['one month', 'once a week', 'twice a month'], 'once = bir kez, a month = ayda'],
  ['Which one means "yılda üç kez"?', 'three times a year', ['three year', 'thrice a week', 'three times a month'], 'three times = üç kez, a year = yılda'],
  ["I don't like golf. I ______ play it.", 'never', ['always', 'usually', 'often'], 'Sevmediği için asla oynamaz: never.'],
  ['My mum loves yoga. She ______ does it in the morning.', 'always', ['never', 'rarely', 'seldom'], 'Çok sevdiği için her zaman yapar: always.'],
  ["I don't ______ play golf.", 'usually', ['never', 'always never', 'not'], '"never" ile "don\'t" birlikte kullanılmaz.'],
];

export function howOften(n = 3) {
  return shuffle(HOW_OFTEN).slice(0, n).map(([q, ok, bad, why]) => mc(ok, bad, { q, why, topic: 'freq' }));
}

/* ---------- Tablo okuma (Ünite 2) ---------- */

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const COUNT_PHRASE = { 0: 'never', 1: 'once a week', 2: 'twice a week', 3: 'three times a week', 7: 'every day' };
const HOW_ANS = { 0: 'Never.', 1: 'Once a week.', 2: 'Twice a week.', 3: 'Three times a week.', 7: 'Every day.' };

function chartData() {
  const [name, pr] = pick(NAMES);
  const sports = shuffle(WORDS.filter((w) => w.verb && !w.en.includes(' '))).slice(0, 4);
  const [k1, k2] = shuffle([1, 2, 3]);
  const counts = shuffle([7, 0, k1, k2]);
  const rows = sports.map((w, i) => {
    const days = shuffle(DAYS.map((_, d) => d)).slice(0, counts[i]);
    return { w, n: counts[i], ticks: DAYS.map((_, d) => (days.includes(d) ? '✓' : '')) };
  });
  return { name, pr, rows, table: { head: ['', ...DAYS], rows: rows.map((r) => [r.w.en, ...r.ticks]), cap: `${name}'s week` } };
}

function sentenceFor(name, row, n) {
  const v = third[row.w.verb];
  if (n === 7) return `${name} always ${v} ${row.w.en}.`;
  if (n === 0) return `${name} never ${v} ${row.w.en}.`;
  return `${name} ${v} ${row.w.en} ${COUNT_PHRASE[n]}.`;
}

export function chart(n = 8) {
  const out = [];
  while (out.length < n) {
    const d = chartData();
    const kinds = shuffle(['how', 'how', 'true', 'false']);
    for (const kind of kinds) {
      if (out.length >= n) break;
      if (kind === 'how') {
        const row = pick(d.rows);
        const ok = HOW_ANS[row.n];
        const bad = shuffle(Object.values(HOW_ANS).filter((x) => x !== ok)).slice(0, 3);
        out.push(mc(ok, bad, { q: `Look at the chart.\nHow often does ${d.name} ${row.w.verb} ${row.w.en}?`, table: d.table, why: `${row.w.en} satırında ${row.n} işaret var: ${ok}`, topic: 'freq' }));
      } else {
        const truths = d.rows.map((r) => sentenceFor(d.name, r, r.n));
        const lies = d.rows.map((r) => {
          const alt = r.n === 7 ? 0 : r.n === 0 ? 7 : r.n === 3 ? 1 : r.n + 1;
          return sentenceFor(d.name, r, alt);
        });
        if (kind === 'true') {
          const ok = pick(truths);
          out.push(mc(ok, shuffle(lies).slice(0, 3), { q: 'Look at the chart. Which is TRUE?', table: d.table, why: 'Her satırdaki işaretleri say: 7 gün = **always / every day**, hiç yok = **never**, 1 gün = **once a week**, 2 gün = **twice a week**, 3 gün = **three times a week**.', topic: 'freq' }));
        } else {
          const ok = pick(lies);
          out.push(mc(ok, shuffle(truths).slice(0, 3), { q: 'Look at the chart. Which is FALSE?', table: d.table, why: 'FALSE soruluyor: tabloyla **uyuşmayan** cümleyi arıyoruz. Her satırdaki işaretleri tek tek say.', topic: 'freq' }));
        }
      }
    }
  }
  return out;
}

/* ---------- Sevme bildiren yapılar (Ünite 2) ---------- */

const ING = [
  ['She enjoys ______ in the sea. (swim)', 'swimming', ['to swim', 'swim', 'swims']],
  ["I can't stand ______. (lose)", 'losing', ['to lose', 'lose', 'loses']],
  ["He doesn't mind ______ early. (get up)", 'getting up', ['to get up', 'get up', 'gets up']],
  ["I'm good at ______ chess. (play)", 'playing', ['to play', 'play', 'plays']],
  ['They are crazy about ______ volleyball. (watch)', 'watching', ['to watch', 'watch', 'watches']],
  ['My brother is interested in ______ karate. (do)', 'doing', ['to do', 'do', 'does']],
  ['We enjoy ______ cycling at weekends. (go)', 'going', ['to go', 'go', 'goes']],
  ['Elif is keen on ______ photos. (take)', 'taking', ['to take', 'take', 'takes']],
];
const PREP = [
  ['I am good ______ basketball.', 'at'], ['He is interested ______ extreme sports.', 'in'], ['She is keen ______ cycling.', 'on'],
  ['My grandma is fond ______ gardening.', 'of'], ['Ahmet is crazy ______ football.', 'about'], ['Are you good ______ swimming?', 'at'],
];
const FEEL = [
  ["I ______ swimming. It's my favourite sport!", 'love', ['hate', "can't stand", "don't like"]],
  ["I ______ golf. It's so boring!", "can't stand", ['love', 'enjoy', 'am crazy about']],
  ['She ______ doing yoga. It makes her relaxed.', 'enjoys', ['hates', "can't stand", 'dislikes']],
  ['He ______ boxing. He thinks it is too violent.', 'hates', ['loves', 'enjoys', 'is crazy about']],
  ["A: Do you want to watch tennis or football?\nB: I ______. Both are OK for me.", "don't mind", ['hate', "can't stand", 'dislike']],
  ['Ahmet watches every match. He ______ football.', 'is crazy about', ["can't stand", 'hates', 'dislikes']],
];

export function likes(n = 10) {
  const a = shuffle(ING).slice(0, 4).map(([q, ok, bad]) => mc(ok, bad, { q, sub: 'Doğru fiil hali hangisi?', why: `Bu yapıdan sonra fiil **-ing** alır: ${ok}.`, topic: 'likes' }));
  const b = shuffle(PREP).slice(0, 3).map(([q, ok]) => mc(ok, shuffle(['at', 'in', 'on', 'of', 'about'].filter((x) => x !== ok)).slice(0, 3), { q, sub: 'Hangi edat?', why: `good **at**, interested **in**, keen **on**, fond **of**, crazy **about**`, topic: 'likes' }));
  const c = shuffle(FEEL).slice(0, 3).map(([q, ok, bad]) => mc(ok, bad, { q, why: `Cümlenin anlamına uyan: **${ok}**.`, topic: 'likes' }));
  return shuffle([...a, ...b, ...c]).slice(0, n);
}

/* ---------- Simple Present (Ünite 2) ---------- */

const SUBJ = [['My brother', 3], ['Ali', 3], ['My mum', 3], ['Zeynep', 3], ['The coach', 3], ['I', 1], ['We', 1], ['They', 1], ['My friends', 1], ['You', 1]];
const Q_SUBJ = [['your sister', 3], ['Ali', 3], ['your dad', 3], ['the coach', 3], ['you', 1], ['they', 1], ['your friends', 1], ['your parents', 1]];
const VERBS = [['play', 'plays', 'football'], ['go', 'goes', 'swimming'], ['do', 'does', 'yoga'], ['watch', 'watches', 'tennis on TV'], ['study', 'studies', 'English'], ['have', 'has', 'a karate lesson']];
const ING_FORM = { play: 'playing', go: 'going', do: 'doing', watch: 'watching', study: 'studying', have: 'having' };
const TAILS = ['every day', 'on Sundays', 'at weekends', 'after school', 'twice a week'];

export function present(n = 10) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const kind = i % 5;
    if (kind <= 2) {
      const [s, p] = pick(SUBJ);
      const [base, s3, obj] = pick(VERBS);
      const ok = p === 3 ? s3 : base;
      const bad = p === 3 ? [base, ING_FORM[base], `is ${base}`] : [s3, ING_FORM[base], `are ${base}`];
      out.push(mc(ok, bad, { q: `${s} ______ ${obj} ${pick(TAILS)}. (${base})`, sub: 'Fiilin doğru hali hangisi?', why: p === 3 ? `${s} = he / she → fiil **-s / -es** alır: ${s3}.` : `${s} ile fiil yalın kalır: ${base}.`, topic: 'present' }));
    } else if (kind === 3) {
      const [subj, p] = pick(Q_SUBJ);
      const [base, , obj] = pick(VERBS.filter((v) => v[0] !== 'have'));
      const ok = p === 3 ? 'Does' : 'Do';
      out.push(mc(ok, [p === 3 ? 'Do' : 'Does', 'Is', 'Are'], { q: `______ ${subj} ${base} ${obj}?`, sub: 'Soruyu hangisiyle başlatırız?', why: p === 3 ? 'He / she ile soru **Does** ile başlar.' : 'I / you / we / they ile soru **Do** ile başlar.', topic: 'present' }));
    } else {
      const [s, p] = pick(SUBJ);
      const [base, , obj] = pick(VERBS.filter((v) => v[0] !== 'have'));
      const ok = p === 3 ? "doesn't" : "don't";
      out.push(mc(ok, [p === 3 ? "don't" : "doesn't", "isn't", 'not'], { q: `${s} ______ ${base} ${obj}.`, sub: 'Olumsuz hali hangisi?', why: p === 3 ? "He / she ile olumsuz: **doesn't** + yalın fiil." : "I / you / we / they ile olumsuz: **don't** + yalın fiil.", topic: 'present' }));
    }
  }
  return out;
}

/* ---------- Malzeme, yer, kişi (Ünite 2) ---------- */

const KIT = [
  ['tennis', 'racket', ['racket', 'ball', 'net']],
  ['swimming', 'goggles', ['goggles', 'swimsuit']],
  ['boxing', 'gloves', ['gloves']],
  ['skiing', 'skis', ['skis', 'goggles', 'helmet', 'gloves']],
  ['ice skating', 'skates', ['skates', 'gloves', 'helmet']],
  ['running', 'trainers', ['trainers']],
  ['yoga', 'mat', ['mat']],
  ['archery', 'bow and arrow', ['bow and arrow']],
  ['baseball', 'bat', ['bat', 'ball', 'helmet', 'gloves']],
  ['surfing', 'surfboard', ['surfboard', 'swimsuit']],
  ['skateboarding', 'skateboard', ['skateboard', 'helmet']],
];
const ALL_KIT = ['racket', 'goggles', 'gloves', 'skis', 'skates', 'trainers', 'mat', 'bow and arrow', 'bat', 'surfboard', 'skateboard', 'helmet', 'swimsuit'];
const PLACES = [
  ['tennis', 'court'], ['basketball', 'court'], ['football', 'pitch'], ['swimming', 'swimming pool'], ['boxing', 'ring'],
  ['ice skating', 'rink'], ['skiing', 'slope'], ['running', 'track'], ['golf', 'course'],
];
const ALL_PLACES = ['court', 'pitch', 'swimming pool', 'ring', 'rink', 'slope', 'track', 'course'];
const PEOPLE = [
  ['This person stops the game and shows yellow and red cards.', 'referee', ['coach', 'fan', 'captain']],
  ['This person trains a team and helps the players.', 'coach', ['referee', 'fan', 'opponent']],
  ['This person watches the matches and supports a team.', 'fan', ['referee', 'coach', 'captain']],
  ['This player is the leader of the team on the pitch.', 'captain', ['referee', 'fan', 'coach']],
  ['You get this when you win a race. It can be gold, silver or bronze.', 'medal', ['racket', 'helmet', 'whistle']],
  ['The referee blows it to stop the game.', 'whistle', ['medal', 'racket', 'net']],
];
const WIN_BEAT = [
  ['Our team always ______ the matches. We are the champions!', 'wins', ['beats', 'loses', 'cheers'], 'Maç kazanılır: **win**. "beat" rakibi yenmektir.'],
  ['We ______ the other team 3-0 every time!', 'beat', ['win', 'lose', 'score'], 'Rakip yenilir: **beat**.'],
  ['Nobody likes to ______ a match.', 'lose', ['win', 'beat', 'cheer'], 'Kimse maç **kaybetmeyi** (lose) sevmez.'],
  ['The fans ______ for their team in the stadium.', 'cheer', ['beat', 'lose', 'kick'], 'Taraftarlar tezahürat yapar: **cheer**.'],
];

export function kit(n = 8) {
  const a = shuffle(KIT).slice(0, 3).map(([sport, ok, valid]) => {
    const bad = shuffle(ALL_KIT.filter((k) => !valid.includes(k))).slice(0, 3);
    return mc(ok, bad, { q: `What do you need for ${sport}?`, sub: `${sport} için ne gerekir?`, why: `${sport} → **${ok}** (${shortTr(WORD.get(ok.replace(/\s+/g, '-')) || { tr: '' })})`, topic: 'kit' });
  });
  const b = shuffle(PLACES).slice(0, 3).map(([sport, ok]) => {
    const bad = shuffle(ALL_PLACES.filter((p) => p !== ok)).slice(0, 3);
    const v = (WORDS.find((w) => w.en === sport) || { verb: 'play' }).verb;
    return mc(ok, bad, { q: `Where do people ${v} ${sport}?`, sub: `${sport} nerede yapılır?`, why: `${sport} → **${ok}**`, topic: 'kit' });
  });
  const c = shuffle(PEOPLE).slice(0, 2).map(([q, ok, bad]) => mc(ok, bad, { q, why: `**${ok}** = ${shortTr(WORD.get(ok) || { tr: '' })}`, topic: 'kit' }));
  const d = shuffle(WIN_BEAT).slice(0, 1).map(([q, ok, bad, why]) => mc(ok, bad, { q, why, topic: 'kit' }));
  return shuffle([...a, ...b, ...c, ...d]).slice(0, n);
}

export function kitMatch() {
  const pairs = shuffle(KIT).slice(0, 5).map(([sport, item]) => [sport, item]);
  return { type: 'match', q: 'Sporu malzemesiyle eşleştir.', sub: 'Soldan bir spor, sağdan malzemesini seç.', pairs, why: pairs.map(([a, b]) => `${a} → ${b}`).join(', '), topic: 'kit' };
}
