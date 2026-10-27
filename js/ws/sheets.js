// Çalışma kağıtları: her konu için resimli, bol soruluku, yazdırılabilir sayfalar.
// Sorular tohumlu rastgele üretilir: aynı tohum aynı kağıdı verir (yazdırma ve cevap anahtarı uyuşur).
// Bölüm türleri: fill, choice, match, tf, order, table, sort, search, odd, write

import { WORDS } from '../data/words.js';
import { MOODS, PARA_PLAN, WINBEAT } from '../data/viz-data.js';

/* ---------- Tohumlu rastgele ---------- */

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pickR = (R, arr) => arr[Math.floor(R() * arr.length)];
function shuffleR(R, arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(R() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const sample = (R, arr, n) => shuffleR(R, arr).slice(0, n);
const pron = (look) => (['boy', 'man', 'grandpa'].includes(look.kind) ? 'He' : 'She');
const LETTERS = 'ABCDEFGH';

/* ---------- Kişi üretimi ---------- */

const LEN = { long: 'long', shoulder: 'shoulder-length', short: 'short' };
function randomPerson(R, used = new Set()) {
  for (let k = 0; k < 40; k++) {
    const kind = pickR(R, ['girl', 'boy', 'woman', 'man', 'girl', 'boy']);
    const male = ['boy', 'man'].includes(kind);
    const p = {
      kind,
      h: pickR(R, ['tall', 'short']),
      build: pickR(R, ['slim', 'mid', 'plump']),
      hairLen: male ? pickR(R, ['short', 'short', 'shoulder']) : pickR(R, ['long', 'shoulder', 'short']),
      hairType: pickR(R, ['straight', 'wavy', 'curly']),
      hairColor: pickR(R, ['black', 'brown', 'blonde', 'red']),
      eyes: pickR(R, ['blue', 'green', 'brown']),
      glasses: R() < 0.45,
      beard: kind === 'man' && R() < 0.6,
      freckles: R() < 0.3,
    };
    const key = `${p.kind}${p.hairLen}${p.hairColor}${p.glasses}`;
    if (!used.has(key)) {
      used.add(key);
      return p;
    }
  }
  return { kind: 'girl', h: 'tall', hairLen: 'long', hairType: 'curly', hairColor: 'red', eyes: 'green' };
}
const hairOf = (p) => `${LEN[p.hairLen]} ${p.hairType} ${p.hairColor}`;
function descOf(p) {
  const he = pron(p);
  const s = [`${he} is ${p.h}.`, `${he} has got ${hairOf(p)} hair.`];
  s.push(p.glasses ? `${he} wears glasses.` : `${he} doesn't wear glasses.`);
  if (p.beard) s.push(`${he} has got a beard.`);
  return s.join(' ');
}

/* ---------- Bölüm üreticileri ---------- */

function lookWrite(R, n = 2) {
  const used = new Set();
  const people = Array.from({ length: n }, () => randomPerson(R, used));
  const items = [];
  people.forEach((p, i) => {
    const he = pron(p);
    items.push({ look: p, label: LETTERS[i], pre: `${he} is `, post: '.', ans: [p.h] });
    items.push({ pre: `${he} has got `, post: ' hair.', ans: [hairOf(p), hairOf(p).replace('shoulder-length', 'shoulder length')], hint: 'uzunluk + şekil + renk' });
    items.push({ pre: `${he} has got `, post: ' eyes.', ans: [p.eyes] });
    items.push({ pre: `${he} `, post: ' glasses.', ans: p.glasses ? ['wears'] : ["doesn't wear", 'does not wear'] });
  });
  return { type: 'fill', title: 'Look at the pictures and complete the sentences.', tr: 'Resimlere bak ve cümleleri tamamla.', items };
}

function matchPeople(R, n = 4) {
  const used = new Set();
  const people = Array.from({ length: n }, () => randomPerson(R, used));
  const order = shuffleR(R, people.map((_, i) => i));
  return {
    type: 'match',
    title: 'Read and match the descriptions with the pictures.',
    tr: 'Tarifleri oku ve resimlerle eşleştir.',
    keys: people.map((p, i) => ({ key: LETTERS[i], look: p })),
    items: order.map((i) => ({ text: descOf(people[i]), ans: LETTERS[i] })),
  };
}

function choice(R, bank, n, title = 'Circle the correct word.', tr = 'Doğru kelimeyi yuvarlak içine al.') {
  return { type: 'choice', title, tr, items: sample(R, bank, n).map(([pre, opts, post, a]) => { const o = shuffleR(R, opts.map((x, k) => [x, k === a])); return { pre, opts: o.map((x) => x[0]), post, ans: o.findIndex((x) => x[1]) }; }) };
}

function fillBank(R, bank, n, title = 'Complete the sentences with the words in the box.', tr = 'Cümleleri kutudaki kelimelerle tamamla.') {
  const chosen = sample(R, bank, n);
  return { type: 'fill', bank: shuffleR(R, chosen.map((x) => x[1].split('|')[0])), title, tr, items: chosen.map(([s, a]) => { const [pre, post] = s.split('___'); return { pre, post, ans: a.split('|') }; }) };
}

function fillHint(R, bank, n, title, tr) {
  return { type: 'fill', title, tr, items: sample(R, bank, n).map(([s, a, hint, e]) => { const [pre, post] = s.split('___'); return { pre, post, ans: a.split('|'), hint, e }; }) };
}

function orderSec(R, bank, n) {
  return { type: 'order', title: 'Put the words in the correct order.', tr: 'Kelimeleri doğru sıraya koy ve cümleyi yaz.', items: sample(R, bank, n).map((s) => {
    const clean = s.replace(/[.?!]$/, '');
    const words = clean.split(' ').map((w, i) => (i === 0 && !/^(I|Ali|Elif|Can|Defne|Mert|Zeynep|Emre)$/.test(w) ? w.toLowerCase() : w));
    let sh = shuffleR(R, words);
    if (sh.join(' ') === words.join(' ')) sh = sh.slice().reverse();
    return { words: sh, ans: [s] };
  }) };
}

function fixSec(R, bank, n) {
  return { type: 'fill', wide: true, title: 'Find the mistake and write the correct sentence.', tr: 'Hatayı bul ve cümlenin doğrusunu yaz.', items: sample(R, bank, n).map(([bad, good]) => ({ show: bad, pre: '', post: '', ans: [good], long: true })) };
}

function oddSec(R, groups, n, title = 'Circle the odd one out.', tr = 'Gruba uymayanı yuvarlak içine al.') {
  return { type: 'odd', title, tr, items: sample(R, groups, n).map(([opts, odd, why]) => { const o = shuffleR(R, opts); return { opts: o, ans: o.indexOf(odd), why }; }) };
}

function tableSec(R, rows, n, head, title, tr) {
  return { type: 'table', title, tr, head, rows: sample(R, rows, n).map(([a, b]) => ({ cells: [a], ans: b.split(/\s*[|/]\s*/) })) };
}

function tfSec(text, items, people = null) {
  return { type: 'tf', title: 'Read the text. Write T (true) or F (false).', tr: 'Metni oku. Doğruysa T, yanlışsa F işaretle.', text, people, items: items.map(([t, a]) => ({ text: t, ans: a })) };
}

function emojiLabel(R, list, n, title, tr) {
  // İpucu: ilk harf ve harf sayısı kadar çizgi (s _ _ _ _ _ _ _)
  return { type: 'fill', grid: true, title, tr, items: sample(R, list, n).map(([e, en]) => ({ e, pre: '', post: '', ans: [en], hint: [en[0], ...[...en.slice(1)].map((c) => (c === ' ' ? ' ' : '_'))].join(' ') })) };
}

function sortSec(R, cols, words, title, tr) {
  return { type: 'sort', title, tr, cols, words: shuffleR(R, words).map(([w, e, c]) => ({ w, e, col: c })) };
}

// Kelime avı: kelimeler yatay ve dikey yerleştirilir
function searchSec(R, list, size = 10) {
  const grid = Array.from({ length: size }, () => Array(size).fill(''));
  const placed = [];
  for (const [e, w0] of list) {
    const w = w0.replace(/[^a-z]/gi, '').toUpperCase();
    if (w.length > size) continue;
    let ok = false;
    for (let tries = 0; tries < 200 && !ok; tries++) {
      const horiz = R() < 0.5;
      const dir = horiz ? [0, 1] : [1, 0];
      const r = Math.floor(R() * (horiz ? size : size - w.length + 1));
      const c = Math.floor(R() * (horiz ? size - w.length + 1 : size));
      let fits = true;
      for (let i = 0; i < w.length; i++) {
        const ch = grid[r + dir[0] * i][c + dir[1] * i];
        if (ch && ch !== w[i]) { fits = false; break; }
      }
      if (!fits) continue;
      for (let i = 0; i < w.length; i++) grid[r + dir[0] * i][c + dir[1] * i] = w[i];
      placed.push({ e, w: w0, cells: Array.from({ length: w.length }, (_, i) => [r + dir[0] * i, c + dir[1] * i]) });
      ok = true;
    }
  }
  const AB = 'ABCDEFGHIJKLMNOPRSTUVWY';
  for (const row of grid) for (let i = 0; i < size; i++) if (!row[i]) row[i] = AB[Math.floor(R() * AB.length)];
  return { type: 'search', title: 'Find the words in the puzzle.', tr: 'Kelimeleri bulmacada bul: ilk harfe, sonra son harfe dokun.', grid, words: placed };
}

function writeSec(prompt, tr, checklist, lines = 7) {
  return { type: 'write', title: prompt, tr, checklist, lines };
}

/* ---------- Soru bankaları ---------- */

const U1_LOOK_FILL = [
  ["My grandfather hasn't got any hair. He is ___.", 'bald'],
  ["She can't see very well, so she wears ___.", 'glasses'],
  ['My uncle has got a ___ and a moustache.', 'beard'],
  ['Elif has got small brown spots on her nose. She has got ___.', 'freckles'],
  ['My brother is 190 cm. He is very ___.', 'tall'],
  ['He is 120 cm. He is ___.', 'short'],
  ["Her hair isn't straight. It is ___.", 'curly'],
  ["He isn't fat. He is ___.", 'slim'],
  ['My mother is 45 years old. She is ___.', 'middle-aged'],
  ['My grandmother is 82. She is ___.', 'old'],
  ['She wears ___ on her teeth.', 'braces'],
  ['Her hair is yellow. She has got ___ hair.', 'blonde'],
];
const U1_LOOK_CHOICE = [
  ['She ', ['is', 'has got'], ' tall and slim.', 0],
  ['He ', ['is', 'has got'], ' short black hair.', 1],
  ['My grandmother ', ['wears', 'has got'], ' glasses.', 0],
  ['My father is ', ['long', 'tall'], ' and well-built.', 1],
  ['She has got ', ['curly long', 'long curly'], ' hair.', 1],
  ['He has got ', ['blue eyes', 'eyes blue'], '.', 0],
  ['My uncle ', ['is', 'has got'], ' a beard.', 1],
  ['What ', ['is', 'does'], ' your sister look like?', 1],
  ['He ', ['is', 'has got'], ' bald.', 0],
  ['She has got long ', ['hair', 'hairs'], '.', 0],
  ['Ali ', ['wear', 'wears'], ' a cap.', 1],
  ['My sister ', ['have got', 'has got'], ' green eyes.', 1],
  ['I ', ['have got', 'has got'], ' freckles.', 0],
  ['She has got ', ['black short', 'short black'], ' hair.', 1],
];
const APPEAR = ['tall', 'short', 'slim', 'curly', 'blonde', 'bald', 'young', 'old', 'freckles', 'beard', 'plump', 'wavy'];
const PERSONALITY = ['friendly', 'kind', 'generous', 'lazy', 'honest', 'shy', 'funny', 'clever', 'helpful', 'rude', 'patient', 'talkative', 'brave', 'selfish', 'polite', 'cheerful'];
const U1_LOOKLIKE_FILL = [
  ['Defne has got red hair like her mother. She looks ___ her mother.', 'like'],
  ['You ___ tired today. Are you OK?', 'look'],
  ['What ___ your brother like? He is funny.', 'is'],
  ['What ___ your brother look like? He is tall.', 'does'],
  ['Who ___ you look like? I look like my aunt.', 'do'],
  ["Can ___ like his father. They are both quiet.", 'is'],
  ['Who does Elif look ___? She looks like her grandmother.', 'like'],
  ['My sister and I are twins. We look the ___.', 'same'],
];
const U1_QA = [
  ['What does your mother look like?', 'She is tall and she has got short hair.'],
  ['What is your mother like?', 'She is kind and patient.'],
  ['Who do you look like?', 'I look like my father.'],
  ['How does she look today?', 'She looks tired.'],
  ['What is your best friend like?', 'He is funny and generous.'],
  ['What does your grandfather look like?', 'He is old and he has got a white beard.'],
];
const COMP_ROWS = [['tall', 'taller'], ['short', 'shorter'], ['old', 'older'], ['young', 'younger'], ['big', 'bigger'], ['thin', 'thinner'], ['slim', 'slimmer'], ['funny', 'funnier'], ['lazy', 'lazier'], ['happy', 'happier'], ['beautiful', 'more beautiful'], ['intelligent', 'more intelligent'], ['generous', 'more generous'], ['good', 'better'], ['bad', 'worse'], ['strong', 'stronger'], ['nice', 'nicer'], ['easy', 'easier'], ['fast', 'faster'], ['hard-working', 'more hard-working']];
const COMP_CHOICE = [
  ['He is ', ['more tall', 'taller'], ' than me.', 1],
  ['My dog is ', ['better', 'gooder'], ' than your dog.', 0],
  ['Elif is ', ['more beautiful', 'beautifuler'], ' than her sister.', 0],
  ['Can is taller ', ['then', 'than'], ' Ali.', 1],
  ['This test is ', ['easyer', 'easier'], ' than the last one.', 1],
  ['My brother is ', ['bigger', 'biger'], ' than me.', 0],
  ['She is as tall ', ['as', 'than'], ' her mother.', 0],
  ['Ali is ', ['more funny', 'funnier'], ' than Mert.', 1],
  ['My grandfather is ', ['older', 'more old'], ' than my grandmother.', 0],
  ['Football is ', ['worse', 'badder'], ' than tennis for me.', 0],
];
const COMP_ORDER = ['My brother is taller than me.', 'Elif is more generous than Can.', 'My cat is lazier than my dog.', 'Ali is as old as Mert.', 'Your bag is bigger than my bag.', 'She is more hard-working than her sister.', 'My father is older than my mother.'];
const COMP_FIX = [
  ['He is more taller than me.', 'He is taller than me.'],
  ['She is beautifuler than her sister.', 'She is more beautiful than her sister.'],
  ['My cat is gooder than your cat.', 'My cat is better than your cat.'],
  ['Ali is shorter then Can.', 'Ali is shorter than Can.'],
  ['My bag is more big than your bag.', 'My bag is bigger than your bag.'],
  ['Elif is as tall than Defne.', 'Elif is as tall as Defne.'],
];

const SPORTS = WORDS.filter((w) => w.verb && w.pic);
const PDG_CHOICE = SPORTS.filter((w) => ['football', 'basketball', 'tennis', 'chess', 'karate', 'yoga', 'judo', 'gymnastics', 'swimming', 'cycling', 'skiing', 'hiking', 'camping', 'volleyball', 'boxing'].includes(w.en)).map((w) => {
  const subj = ['I', 'We', 'They', 'You'];
  const other = w.verb === 'play' ? 'go' : w.verb === 'do' ? 'play' : 'play';
  return [`${subj[w.en.length % 4]} `, [w.verb, other], ` ${w.en} at weekends.`, 0];
});
const PDG_FILL = [
  ['We ___ volleyball at school.', 'play'], ['I ___ swimming in summer.', 'go'], ['They ___ karate on Fridays.', 'do'], ['You ___ chess with your grandfather.', 'play'],
  ['My friends and I ___ cycling in the park.', 'go'], ['I ___ yoga every morning.', 'do'], ['We ___ camping in the mountains.', 'go'], ['They ___ basketball after school.', 'play'],
  ['I ___ gymnastics at the sports centre.', 'do'], ['We ___ skiing in Erciyes in winter.', 'go'],
];

const PRESENT_FILL = [
  ['She ___ tennis on Mondays.', 'plays', 'play'], ['My father ___ TV every evening.', 'watches', 'watch'], ['Ali ___ English after school.', 'studies', 'study'],
  ['My brother ___ to school by bus.', 'goes', 'go'], ['He ___ breakfast at seven.', 'has', 'have'], ['We ___ our homework in the evening.', 'do', 'do'],
  ['The cat ___ a lot.', 'sleeps', 'sleep'], ['My mum ___ the dishes after dinner.', 'washes', 'wash'], ['They ___ in İzmir.', 'live', 'live'],
  ['Elif ___ her homework every day.', 'does', 'do'], ['My sister ___ volleyball very well.', 'plays', 'play'], ['The bus ___ at 8 am.', 'leaves', 'leave'],
];
const THIRD_ROWS = [['play', 'plays'], ['watch', 'watches'], ['study', 'studies'], ['go', 'goes'], ['do', 'does'], ['have', 'has'], ['fly', 'flies'], ['fix', 'fixes'], ['swim', 'swims'], ['carry', 'carries'], ['brush', 'brushes'], ['enjoy', 'enjoys'], ['wash', 'washes'], ['like', 'likes']];
const NEG_FILL = [
  ["He likes boxing. → He ___ boxing.", "doesn't like|does not like"], ['I play chess. → I ___ chess.', "don't play|do not play"], ['She goes swimming. → She ___ swimming.', "doesn't go|does not go"],
  ['We do yoga. → We ___ yoga.', "don't do|do not do"], ['My brother watches TV. → My brother ___ TV.', "doesn't watch|does not watch"], ['They play golf. → They ___ golf.', "don't play|do not play"],
];
const QUESTION_CHOICE = [
  ['', ['Do', 'Does'], ' she play chess? Yes, she does.', 1], ['', ['Do', 'Does'], ' your friends play basketball?', 0], ['Does Ali ', ['go', 'goes'], ' cycling?', 0],
  ["No, he ", ["don't", "doesn't"], '.', 1], ['', ['Do', 'Does'], ' you like swimming?', 0], ['Yes, they ', ['do', 'does'], '.', 0], ['Where ', ['do', 'does'], ' Elif play tennis?', 1],
];
const PRESENT_FIX = [
  ['She play volleyball.', 'She plays volleyball.'], ["He don't like chess.", "He doesn't like chess."], ['Does she plays tennis?', 'Does she play tennis?'],
  ['My brother watchs TV.', 'My brother watches TV.'], ['Ali studys English.', 'Ali studies English.'], ['I goes to school by bus.', 'I go to school by bus.'],
];
const FREQ_WORDS = [['always', 7], ['usually', 6], ['often', 4], ['sometimes', 3], ['rarely', 1], ['never', 0]];
const FREQ_ORDER = ['I always walk to school.', 'She is never late.', 'We usually play football at weekends.', 'He sometimes goes swimming.', 'My mother is always busy.', 'They often do yoga in the morning.', 'I rarely watch TV.'];
const FREQ_FIX = [
  ['I go always to school.', 'I always go to school.'], ['She always is happy.', 'She is always happy.'], ['Always I play tennis.', 'I always play tennis.'],
  ['He plays never chess.', 'He never plays chess.'], ['We are late often.', 'We are often late.'],
];
const FREQ_CHOICE = [
  ['How ', ['often', 'many'], ' do you go swimming?', 0], ['He plays tennis ', ['twice', 'two'], ' a week.', 0], ['I ', ['never', "don't never"], ' eat fast food.', 0],
  ['She goes to the gym ', ['once', 'one'], ' a week.', 0], ['We ', ['usually play', 'play usually'], ' chess on Sundays.', 0], ['Ali is ', ['always', 'always is'], ' on time.', 0],
];
const LIKE_FILL = [
  ['I ___ swimming.', 'love', '😍'], ['She ___ playing chess.', 'likes|enjoys', '🙂'], ["We ___ doing homework.", "don't mind|do not mind", '😐'], ['He ___ running.', "doesn't like|does not like", '🙁'],
  ['I ___ boxing.', 'hate', '😖'], ['They ___ waiting.', "can't stand|cannot stand", '😤'], ['My dad ___ cycling.', 'loves', '😍'], ['I ___ playing volleyball.', 'like|enjoy', '🙂'],
];
const ING_FILL = [
  ['I enjoy ___ in the sea.', 'swimming', 'swim'], ['She loves ___ her bike.', 'riding', 'ride'], ['Do you like ___ chess?', 'playing', 'play'], ['He hates ___ in the rain.', 'running', 'run'],
  ["We don't mind ___ our homework.", 'doing', 'do'], ['My sister is good at ___.', 'dancing', 'dance'], ['I am interested in ___ photos.', 'taking', 'take'], ['Mert is keen on ___.', 'skiing', 'ski'],
];
const PREP_FILL = [
  ['She is good ___ tennis.', 'at'], ['I am interested ___ sports.', 'in'], ['He is keen ___ football.', 'on'], ['We are fond ___ swimming.', 'of'], ['My brother is crazy ___ basketball.', 'about'], ['Are you good ___ maths?', 'at'],
];
const OPINION_FILL = [
  ['Boxing is ___. You can get hurt.', 'dangerous', '☠️'], ['Football matches are very ___. I love watching them!', 'exciting', '🤩'], ['Golf is ___ for me. Nothing happens!', 'boring', '🥱'],
  ['Yoga is ___. It makes me calm.', 'relaxing', '😌'], ['Running a marathon is very ___.', 'tiring', '😮‍💨'], ['Skiing is ___. You need a lot of money.', 'expensive', '💰'], ['Swimming is ___. It is good for your body.', 'healthy', '🍏'],
];
const KIT = [['🥊', 'gloves'], ['🥽', 'goggles'], ['⛑️', 'helmet'], ['🎿', 'skis'], ['⛸️', 'skates'], ['👟', 'trainers'], ['🩱', 'swimsuit'], ['🥅', 'net'], ['🏏', 'bat'], ['🛹', 'skateboard'], ['🏄', 'surfboard'], ['🏆', 'trophy'], ['🥇', 'medal'], ['📣', 'fan']];
const PLACES_M = [['tennis', 'court'], ['football', 'pitch'], ['swimming', 'pool'], ['boxing', 'ring'], ['ice skating', 'rink'], ['skiing', 'slope'], ['running', 'track'], ['golf', 'course']];
const PEOPLE_FILL = [
  ['The ___ controls the match and blows the whistle.', 'referee'], ['The ___ trains the players.', 'coach'], ['A person who watches and supports a team is a ___.', 'fan'],
  ['The ___ is the leader of the team.', 'captain'], ['The team that wins the tournament is the ___.', 'champion|winner'], ['A person who does sports is an ___.', 'athlete'],
];
const WIN_CHOICE = [
  ['Our team ', ['won', 'beat'], ' the match.', 0], ['We ', ['won', 'beat'], ' the other team.', 1], ['She ', ['won', 'beat'], ' a gold medal.', 0], ['Can ', ['won', 'beat'], ' his brother at chess.', 1],
  ['Galatasaray ', ['won', 'beat'], ' the cup.', 0], ['I always ', ['win', 'beat'], ' my dad at tennis.', 1],
];

/* ---------- Kağıtlar ---------- */

export const SHEETS = [
  {
    id: 'u1-look', unit: 1, lesson: 'u1-look', e: '🪞', title: 'Describing Appearance', tr: 'Dış görünüşü anlatmak',
    make: (R) => [
      lookWrite(R, 2),
      matchPeople(R, 4),
      choice(R, U1_LOOK_CHOICE, 8),
      fillBank(R, U1_LOOK_FILL, 8),
      orderSec(R, ['She has got long curly hair.', 'My father is tall and well-built.', 'He wears glasses.', 'What does your sister look like?', 'My grandmother has got grey hair.', 'He has got a beard and a moustache.'], 4),
      searchSec(R, [['📏', 'tall'], ['👓', 'glasses'], ['🧔', 'beard'], ['💇‍♀️', 'curly'], ['👴', 'old'], ['🧑‍🦰', 'freckles'], ['👶', 'young'], ['👨‍🦲', 'bald']]),
    ],
  },
  {
    id: 'u1-like', unit: 1, lesson: 'u1-like', e: '💭', title: 'Personality', tr: 'Kişiliği anlatmak',
    make: (R) => [
      fillBank(R, MOODS.map((m) => [`${m.en} ${/^He/.test(m.en) ? 'He' : 'She'} is ___.`, m.adj]), 8, 'Read about the people and write the personality adjectives.', 'Kişileri oku ve kişilik sıfatını yaz.'),
      tableSec(R, WORDS.filter((w) => w.unit === 1 && w.opp && PERSONALITY.concat(['hard-working', 'tidy', 'careful', 'outgoing']).includes(w.en)).map((w) => [w.en, w.opp]), 8, ['Adjective', 'Opposite'], 'Write the opposites.', 'Zıt anlamlılarını yaz.'),
      choice(R, MOODS.filter((m) => m.opp).map((m) => [`${m.en} ${/^He/.test(m.en) ? 'He' : 'She'} is `, [m.adj, m.opp], '.', 0]), 6),
      oddSec(R, Array.from({ length: 10 }, (_, i) => { const r2 = rng(i + 7); const per = sample(r2, PERSONALITY, 3); const ap = pickR(r2, APPEAR); return [[...per, ap], ap, `**${ap}** dış görünüşle ilgili, diğerleri kişilik.`]; }), 6),
      sortSec(R, ['Appearance (görünüş)', 'Personality (kişilik)'], [...sample(R, APPEAR, 6).map((w) => [w, '', 0]), ...sample(R, PERSONALITY, 6).map((w) => [w, '', 1])], 'Put the words in the correct group.', 'Kelimeleri doğru gruba koy.'),
      writeSec('Write three sentences about a friend. Use personality adjectives and give an example.', 'Bir arkadaşını üç cümleyle anlat. Kişilik sıfatı kullan ve bir davranış örneği ver.', [['adj', 'Bir kişilik sıfatı'], ['always', 'Bir davranış (always, never...)'], ['because', 'because ya da and']], 4),
    ],
  },
  {
    id: 'u1-looklike', unit: 1, lesson: 'u1-looklike', e: '👯', title: 'look like · be like', tr: 'Benzemek ve nasıl biri',
    make: (R) => {
      const qa = sample(R, U1_QA, 5);
      return [
        { type: 'match', title: 'Match the questions with the answers.', tr: 'Soruları cevaplarla eşleştir.', keys: qa.map((x, i) => ({ key: LETTERS[i], text: x[1] })), items: shuffleR(R, qa.map((x, i) => ({ text: x[0], ans: LETTERS[i] }))) },
        fillBank(R, U1_LOOKLIKE_FILL, 7),
        tfSec("Hi, I'm Zeynep. I look like my mother. We both have got long curly black hair and brown eyes. But I am not like her. My mother is very calm, but I am talkative and energetic. My brother Emre looks like my father. They are tall and they have got blue eyes. Emre is like my mother. He is calm and quiet.", [
          ['Zeynep looks like her mother.', true], ['Zeynep and her mother have got straight hair.', false], ['Zeynep is calm.', false], ['Emre has got blue eyes.', true], ['Emre is like his father.', false], ["Zeynep's mother is calm.", true],
        ], [{ kind: 'woman', hairLen: 'long', hairType: 'curly', hairColor: 'black', eyes: 'brown' }, { kind: 'girl', hairLen: 'long', hairType: 'curly', hairColor: 'black', eyes: 'brown' }, { kind: 'man', h: 'tall', hairColor: 'brown', eyes: 'blue' }, { kind: 'boy', h: 'tall', hairColor: 'brown', eyes: 'blue' }]),
        choice(R, [['What does she ', ['look like', 'like'], '? She is tall.', 0], ['What is he ', ['like', 'look like'], '? He is friendly.', 0], ['She looks ', ['like her father', 'her father'], '.', 0], ['You look ', ['happy', 'like happy'], ' today!', 0], ['Who ', ['does', 'is'], ' Can look like?', 0], ['My sister is ', ['like', 'looks'], ' my mother. They are both kind.', 0]], 6),
        orderSec(R, ['Who do you look like?', 'She looks like her grandmother.', 'What is your teacher like?', 'He looks very tired today.', 'What does your cousin look like?'], 4),
      ];
    },
  },
  {
    id: 'u1-comp', unit: 1, lesson: 'u1-comp', e: '⚖️', title: 'Comparatives', tr: 'Karşılaştırma',
    make: (R) => {
      const ppl = shuffleR(R, [{ name: 'Ali', look: { kind: 'boy', h: 1, hairColor: 'black' }, cm: 165, age: 14 }, { name: 'Elif', look: { kind: 'girl', h: 0.9, hairColor: 'brown', hairType: 'wavy' }, cm: 150, age: 12 }, { name: 'Can', look: { kind: 'boy', h: 0.8, hairColor: 'blonde' }, cm: 138, age: 10 }]);
      const items = [];
      const pairs = [[0, 1], [1, 2], [0, 2], [2, 0], [1, 0], [2, 1]];
      for (const [a, b] of sample(R, pairs, 4)) {
        const A = ppl[a];
        const B = ppl[b];
        items.push({ pre: `${A.name} is `, post: ` than ${B.name}. (tall / short)`, ans: [A.cm > B.cm ? 'taller' : 'shorter'] });
      }
      for (const [a, b] of sample(R, pairs, 2)) {
        const A = ppl[a];
        const B = ppl[b];
        items.push({ pre: `${A.name} is `, post: ` than ${B.name}. (old / young)`, ans: [A.age > B.age ? 'older' : 'younger'] });
      }
      return [
        tableSec(R, COMP_ROWS, 10, ['Adjective', 'Comparative'], 'Complete the table.', 'Tabloyu tamamla.'),
        { type: 'fill', title: 'Look at the picture and complete the sentences.', tr: 'Resme bak ve cümleleri tamamla.', lineup: ppl, items },
        choice(R, COMP_CHOICE, 7),
        orderSec(R, COMP_ORDER, 4),
        fixSec(R, COMP_FIX, 4),
        writeSec('Compare yourself with a friend or a family member. Write three sentences.', 'Kendini bir arkadaşın ya da ailenden biriyle karşılaştır. Üç cümle yaz.', [['than', 'than ile karşılaştırma'], ['er', '-er ile bir sıfat'], ['more', 'more ya da better / worse']], 4),
      ];
    },
  },
  {
    id: 'u1-write', unit: 1, lesson: 'u1-write', e: '✍️', title: 'Writing: My Best Friend', tr: 'Yazma: En iyi arkadaşım',
    make: (R) => {
      const order = shuffleR(R, PARA_PLAN.map((p, i) => [p, i + 1]));
      return [
        { type: 'match', title: 'Put the paragraph in order. Write 1-5.', tr: 'Paragrafı sıraya koy. 1-5 arası numara ver.', keys: [1, 2, 3, 4, 5].map((n) => ({ key: String(n) })), items: order.map(([p, n]) => ({ text: p.en, ans: String(n) })) },
        fillBank(R, [["My best friend's name is Can. He is twelve years ___.", 'old'], ['He is tall and ___. He is not fat.', 'slim'], ['He has got short black hair and brown ___.', 'eyes'], ['He ___ glasses.', 'wears'], ['He is very ___. He always makes me laugh.', 'funny'], ['He is taller ___ me.', 'than'], ['I love him ___ he is a great friend.', 'because'], ['He is ___. He always helps me.', 'helpful']], 8),
        choice(R, [['My friend ', ['is', 'has got'], ' kind and generous.', 0], ['She ', ['always helps', 'helps always'], ' me.', 0], ['I love her ', ['because', 'but'], ' she is funny.', 0], ['He is short, ', ['but', 'and'], ' he is very strong.', 0], ['She is ', ['more talkative', 'talkativer'], ' than me.', 0], ['He ', ['has got', 'is'], ' short black hair.', 0]], 6),
        orderSec(R, ['She is kind and helpful.', 'I love her because she is a great friend.', 'He has got short black hair.', 'My best friend is twelve years old.', 'He is taller than me.'], 4),
        fixSec(R, [...COMP_FIX, ['She have got long hair.', 'She has got long hair.'], ['He help me with my homework.', 'He helps me with my homework.']], 3),
        writeSec('Write a paragraph about your best friend (6-8 sentences).', 'En iyi arkadaşını anlatan bir paragraf yaz (6-8 cümle). Plan: tanıtım → görünüş → kişilik → karşılaştırma → bitiş.', [['is', 'Görünüş (is)'], ['has got', 'Saç ve göz (has got)'], ['adj', 'Kişilik sıfatı'], ['than', 'Karşılaştırma (than)'], ['because', 'because ile bitiş']], 9),
      ];
    },
  },
  {
    id: 'u1-review', unit: 1, lesson: null, e: '🏁', title: 'Unit 1 Review', tr: 'Ünite 1 genel tekrar',
    make: (R) => [
      lookWrite(R, 1),
      choice(R, [...U1_LOOK_CHOICE, ...COMP_CHOICE], 8),
      tableSec(R, WORDS.filter((w) => w.unit === 1 && w.opp && w.pos === 'adj').map((w) => [w.en, w.opp]), 6, ['Adjective', 'Opposite'], 'Write the opposites.', 'Zıt anlamlılarını yaz.'),
      fillBank(R, [...U1_LOOK_FILL, ...U1_LOOKLIKE_FILL], 7),
      tfSec('My name is Mert. I have got a twin brother, Arda. We look the same: we are both tall and we have got short wavy brown hair. But Arda wears glasses and I don\'t. We are very different people. Arda is quiet and hard-working. I am talkative and a bit lazy! Arda is cleverer than me, but I am funnier than him.', [
        ['Mert and Arda are twins.', true], ['They have got curly hair.', false], ['Mert wears glasses.', false], ['Arda is hard-working.', true], ['Mert is funnier than Arda.', true], ['Arda is lazier than Mert.', false],
      ], [{ kind: 'boy', h: 'tall', hairLen: 'short', hairType: 'wavy', hairColor: 'brown', glasses: true }, { kind: 'boy', h: 'tall', hairLen: 'short', hairType: 'wavy', hairColor: 'brown', mood: 'big' }]),
      orderSec(R, [...COMP_ORDER, 'Who do you look like?', 'She has got long curly hair.'], 3),
      fixSec(R, [...COMP_FIX, ['She have got blue eyes.', 'She has got blue eyes.'], ['What is she look like?', 'What does she look like?'], ['He is long.', 'He is tall.']], 4),
    ],
  },
  {
    id: 'u2-pdg', unit: 2, lesson: 'u2-pdg', e: '⚽', title: 'play · do · go', tr: 'Sporlar ve fiilleri',
    make: (R) => [
      emojiLabel(R, SPORTS.filter((w) => !w.en.includes(' ') && w.en.length <= 10).map((w) => [w.pic, w.en]), 8, 'Look at the pictures and write the sports.', 'Resimlere bak ve sporların adını yaz.'),
      sortSec(R, ['PLAY', 'DO', 'GO'], sample(R, SPORTS.filter((w) => w.en.length < 14), 12).map((w) => [w.en, w.pic, ['play', 'do', 'go'].indexOf(w.verb)]), 'Write the sports in the correct column.', 'Sporları doğru sütuna yerleştir.'),
      fillBank(R, PDG_FILL, 8, 'Complete with play, do or go.', 'play, do ya da go ile tamamla.'),
      choice(R, PDG_CHOICE, 6),
      oddSec(R, ['play', 'do', 'go'].flatMap((v) => Array.from({ length: 3 }, (_, i) => { const r2 = rng(v.length * 13 + i); const same = sample(r2, SPORTS.filter((w) => w.verb === v), 3).map((w) => w.en); const odd = pickR(r2, SPORTS.filter((w) => w.verb !== v)); return [[...same, odd.en], odd.en, `**${odd.en}** ile **${odd.verb}** kullanılır, diğerleri **${v}** alır.`]; })), 5),
      searchSec(R, [['⚽', 'football'], ['🏊', 'swimming'], ['🥋', 'karate'], ['🧘', 'yoga'], ['♟️', 'chess'], ['🎾', 'tennis'], ['🥊', 'boxing'], ['⛷️', 'skiing']]),
    ],
  },
  {
    id: 'u2-present', unit: 2, lesson: 'u2-present', e: '⏰', title: 'Simple Present: Routines', tr: 'Geniş zaman ve rutinler',
    make: (R) => [
      fillHint(R, PRESENT_FILL.map(([s, a, h]) => [s, a, h]), 8, 'Complete with the correct form of the verb.', 'Fiilin doğru halini yaz.'),
      tableSec(R, THIRD_ROWS, 8, ['I / You / We', 'He / She / It'], 'Write the he / she / it form.', 'He / she / it halini yaz.'),
      fillBank(R, NEG_FILL, 5, 'Make the sentences negative.', 'Cümleleri olumsuz yap.'),
      choice(R, QUESTION_CHOICE, 6),
      orderSec(R, ['She plays tennis on Mondays.', 'Does he go to school by bus?', "I don't like boxing.", 'My brother watches TV every evening.', 'Do you do your homework after school?', "Ali doesn't play chess."], 4),
      fixSec(R, PRESENT_FIX, 4),
    ],
  },
  {
    id: 'u2-freq', unit: 2, lesson: 'u2-freq', e: '📅', title: 'How often?', tr: 'Sıklık zarfları',
    make: (R) => {
      const people = ['Ali', 'Elif', 'Can'];
      const acts = [['♟️', 'play chess', 'plays chess'], ['🏊', 'go swimming', 'goes swimming'], ['🧘', 'do yoga', 'does yoga'], ['⚽', 'play football', 'plays football']];
      const opts = [0, 1, 2, 3, 7];
      const chart = people.map(() => acts.map(() => pickR(R, opts)));
      const items = [];
      const word = { 0: ['never'], 7: ['always', 'every day'], 1: ['once a week'], 2: ['twice a week'], 3: ['three times a week'] };
      const cells = shuffleR(R, people.flatMap((p, i) => acts.map((a, k) => [i, k])));
      for (const [i, k] of cells.slice(0, 6)) {
        const d = chart[i][k];
        if (d === 0 || d === 7) items.push({ pre: `${people[i]} `, post: ` ${acts[k][2]}.`, ans: [d ? 'always' : 'never'], hint: 'always / never' });
        else items.push({ pre: `${people[i]} ${acts[k][2]} `, post: '.', ans: word[d], hint: 'once / twice / three times a week' });
      }
      return [
        { type: 'fill', grid: true, title: 'Look at the calendars and write the adverbs.', tr: 'Takvimlere bak ve sıklık zarfını yaz.', items: shuffleR(R, FREQ_WORDS).slice(0, 6).map(([w, d]) => ({ week: d, pre: '', post: '', ans: w === 'rarely' ? ['rarely', 'seldom', 'hardly ever'] : [w] })) },
        { type: 'fill', title: 'Look at the chart and complete the sentences.', tr: 'Tabloya bak (haftada kaç gün) ve cümleleri tamamla.', chart: { people, acts: acts.map((a) => [a[0], a[1]]), data: chart }, items },
        orderSec(R, FREQ_ORDER, 4),
        choice(R, [...FREQ_CHOICE, ...QUESTION_CHOICE.slice(0, 3)], 7),
        fixSec(R, FREQ_FIX, 4),
        writeSec('How often do you do these things? Write four sentences.', 'Bunları ne sıklıkla yaparsın? Dört cümle yaz (always, usually, sometimes, never, once a week...).', [['freq', 'Bir sıklık zarfı'], ['week', 'once / twice a week'], ['never', 'never ile bir cümle']], 5),
      ];
    },
  },
  {
    id: 'u2-likes', unit: 2, lesson: 'u2-likes', e: '❤️', title: 'Likes and Dislikes', tr: 'Sevdiklerimiz, fikirlerimiz',
    make: (R) => [
      fillHint(R, LIKE_FILL.map(([s, a, e]) => [s, a, '', e]), 6, 'Look at the faces and complete the sentences.', 'Yüzlere bak: love, like, don\'t mind, don\'t like, hate, can\'t stand.'),
      fillHint(R, ING_FILL, 7, 'Write the -ing form of the verbs.', 'Fiillerin -ing halini yaz.'),
      fillBank(R, PREP_FILL, 5, 'Complete with at, in, on, of or about.', 'at, in, on, of ya da about ile tamamla.'),
      fillHint(R, OPINION_FILL.map(([s, a, e]) => [s, a, '', e]), 6, 'Complete with the opinion adjectives.', 'Fikir sıfatlarıyla tamamla: dangerous, exciting, boring, relaxing, tiring, expensive, healthy.'),
      choice(R, [['I enjoy ', ['swimming', 'swim'], ' in summer.', 0], ['She is good ', ['at', 'in'], ' tennis.', 0], ['Boxing is ', ['more dangerous', 'dangerouser'], ' than golf.', 0], ['I ', ["don't mind", "don't minding"], ' doing homework.', 0], ['He is interested ', ['in', 'on'], ' basketball.', 0], ['I think chess is ', ['boring', 'bored'], '.', 0]], 5),
      writeSec('Write about your favourite sport.', 'En sevdiğin sporu anlat: hangi fiille yapılır, ne sıklıkla yaparsın, neden seversin?', [['love', 'love / like / enjoy + -ing'], ['pdg', 'play, do ya da go'], ['freq', 'Ne sıklıkla (always, twice a week...)'], ['opinion', 'Fikir sıfatı (exciting, healthy...)']], 6),
    ],
  },
  {
    id: 'u2-kit', unit: 2, lesson: 'u2-kit', e: '🎒', title: 'Equipment, Places, People', tr: 'Malzemeler, yerler, kişiler',
    make: (R) => {
      const pl = sample(R, PLACES_M, 6);
      const keys = shuffleR(R, pl.map(([, p], i) => ({ key: LETTERS[i], text: p })));
      return [
        emojiLabel(R, KIT, 8, 'Look and write the sports equipment.', 'Resimlere bak ve malzemelerin adını yaz.'),
        { type: 'match', title: 'Where do we do these sports? Match.', tr: 'Bu sporları nerede yaparız? Eşleştir.', keys, items: pl.map(([s, p]) => ({ text: s, e: (SPORTS.find((w) => w.en === s) || {}).pic, ans: keys.find((k) => k.text === p).key })) },
        fillBank(R, PEOPLE_FILL, 5),
        choice(R, WIN_CHOICE, 5),
        tfSec("Last Saturday was our school sports day. Our class played volleyball against 7B. The referee was our PE teacher, Mr. Kaya. We played very well and we beat 7B 3-1. Our captain, Elif, scored many points. At the end, we won a big trophy. All the fans cheered for us. It was very exciting!", [
          ['The sports day was on Saturday.', true], ['They played basketball.', false], ['The referee was their PE teacher.', true], ['7B beat them.', false], ['Elif is the captain.', true], ['They won a medal.', false],
        ]),
        searchSec(R, [['🥊', 'gloves'], ['🥽', 'goggles'], ['🎾', 'racket'], ['⛑️', 'helmet'], ['🏟️', 'pitch'], ['🎿', 'skis'], ['🏆', 'trophy'], ['🥅', 'net']]),
      ];
    },
  },
  {
    id: 'u2-review', unit: 2, lesson: null, e: '🏆', title: 'Unit 2 Review', tr: 'Ünite 2 genel tekrar',
    make: (R) => [
      sortSec(R, ['PLAY', 'DO', 'GO'], sample(R, SPORTS.filter((w) => w.en.length < 14), 9).map((w) => [w.en, w.pic, ['play', 'do', 'go'].indexOf(w.verb)]), 'Write the sports in the correct column.', 'Sporları doğru sütuna yerleştir.'),
      fillHint(R, PRESENT_FILL, 6, 'Complete with the correct form of the verb.', 'Fiilin doğru halini yaz.'),
      choice(R, [...FREQ_CHOICE, ...QUESTION_CHOICE, ...WIN_CHOICE], 8),
      fillHint(R, [...ING_FILL, ...LIKE_FILL.map(([s, a, e]) => [s, a, '', e])], 6, 'Complete the sentences.', 'Cümleleri tamamla (yüz ipucu varsa love, like... kullan).'),
      fillBank(R, [...PEOPLE_FILL, ...PREP_FILL], 6),
      orderSec(R, [...FREQ_ORDER, 'She plays tennis on Mondays.', 'I love swimming in the sea.'], 4),
      fixSec(R, [...PRESENT_FIX, ...FREQ_FIX], 4),
    ],
  },
];

export const sheetById = (id) => SHEETS.find((s) => s.id === id);

// Kağıdı üretir ve her maddeye kimlik verir
export function buildSheet(id, seed) {
  const sh = sheetById(id);
  if (!sh) return null;
  const R = rng(seed * 7919 + id.length * 104729);
  const sections = sh.make(R).filter(Boolean);
  let n = 0;
  sections.forEach((s, si) => {
    s.no = si + 1;
    if (s.items) s.items.forEach((it, k) => { it.id = `${si}-${k}`; n++; });
    if (s.rows) s.rows.forEach((r, k) => { r.id = `${si}-${k}`; n++; });
    if (s.type === 'sort') { s.words.forEach((w, k) => { w.id = `${si}-${k}`; }); n += s.words.length; }
    if (s.type === 'search') n += s.words.length;
  });
  return { ...sh, sections, total: n, seed };
}

// Cevapları karşılaştırmak için sadeleştirme
export const norm = (s) => String(s || '').toLowerCase().replace(/[’`]/g, "'").replace(/[.?!,]+$/g, '').replace(/\s+/g, ' ').trim();

