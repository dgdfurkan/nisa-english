// İngilizce cümle denetleyicisi: 7. sınıf seviyesindeki tipik hataları bulur, düzeltilmiş cümleyi ve
// Türkçe açıklamasını verir. Ünite 1 ve 2'nin kuralları: -s takısı, has got, karşılaştırma, play/do/go,
// love/like + -ing, sıklık zarfının yeri, look like, saç sıfatlarının sırası, edatlar.

import { WORDS } from '../data/words.js';
import { GLOSS } from '../data/glossary.js';
import { lookupToken } from '../lib/lookup.js';

const VERBS = new Set(['play', 'do', 'go', 'like', 'love', 'hate', 'enjoy', 'watch', 'study', 'live', 'want', 'need', 'have', 'swim', 'run', 'read', 'write', 'help', 'speak', 'eat', 'drink', 'wear', 'look', 'work', 'teach', 'prefer', 'ride', 'practise', 'practice', 'train', 'win', 'lose', 'visit', 'walk', 'cook', 'sing', 'dance', 'listen', 'try', 'think', 'know', 'get', 'make', 'take', 'come', 'sleep', 'wake', 'climb', 'ski', 'jog', 'skate', 'surf', 'cycle', 'fish', 'smile', 'laugh', 'talk', 'tell', 'say', 'give', 'buy', 'kick', 'throw', 'catch', 'hit', 'jump', 'score', 'beat', 'cheer', 'compete', 'exercise', 'join', 'dive', 'resemble', 'mind', 'finish', 'start', 'begin', 'use', 'feel', 'spend', 'meet', 'brush', 'wash', 'carry', 'hurry', 'worry', 'fly', 'cry', 'understand', 'remember', 'forget', 'believe', 'keep', 'stay', 'move', 'open', 'close', 'draw', 'paint', 'clean', 'tidy', 'share', 'support', 'agree']);
// Geçmiş zamanda da aynı yazılan fiiller: "The ball hit the net." yanlış alarm vermesin
const SAME_PAST = new Set(['hit', 'beat', 'put', 'cut', 'read', 'hurt', 'let', 'set', 'cost']);
const NAMES = new Set(['Can', 'Ali', 'Elif', 'Defne', 'Emre', 'Zeynep', 'Selin', 'Ece', 'Deniz', 'Burak', 'Cem', 'Mete', 'Arda', 'Ahmet', 'Ada', 'Emma', 'Tom', 'Sam', 'Anne', 'Mert', 'Ayşe', 'Fatma', 'Mehmet', 'Kerem', 'Efe', 'Eren', 'Yusuf', 'Nisa', 'Saadet', 'Lily', 'Jack', 'Ben', 'Mia', 'Leo', 'Muffin']);
const PRONOUN_AFTER_AUX = new Set(['i', 'you', 'he', 'she', 'it', 'we', 'they']);
const FREQ = new Set(['always', 'usually', 'often', 'sometimes', 'rarely', 'seldom', 'never', 'generally', 'normally', 'frequently']);
const SOFT_ADV = new Set([...FREQ, 'also', 'really', 'just', 'still', 'even', 'only', 'hardly']);
const BE = new Set(['am', 'is', 'are', "i'm", "he's", "she's", "it's", "you're", "we're", "they're", 'was', 'were']);
const AUX = new Set(['do', 'does', 'did', "don't", "doesn't", "didn't", 'can', "can't", 'cannot', 'could', "couldn't", 'will', "won't", 'would', "wouldn't", 'should', "shouldn't", 'must', "mustn't", 'may', 'might', 'to', "let's", 'let', 'please']);
const PLURAL_SUBJ = new Set(['i', 'you', 'we', 'they']);
const THIRD_SUBJ = new Set(['he', 'she', 'it', 'everybody', 'everyone', 'somebody', 'someone', 'nobody', 'nothing', 'everything']);
const DET = new Set(['my', 'your', 'his', 'her', 'our', 'their', 'the', 'a', 'an', 'this', 'that', 'its']);
const IRREG_PLURAL = new Set(['people', 'children', 'men', 'women', 'feet', 'teeth', 'parents', 'twins']);
const SING_S = new Set(['bus', 'class', 'glass', 'boss', 'news', 'gymnastics', 'athletics', 'aerobics', 'tennis', 'chess', 'boxing']);
const CONJ = new Set(['and', 'but', 'because', 'so', 'or', 'when', 'then', 'if', 'while']);
const DOUBLE = new Set(['swim', 'run', 'jog', 'sit', 'get', 'stop', 'shop', 'hit', 'win', 'put', 'begin', 'cut', 'dig', 'chat', 'plan']);
const LOVE_VERBS = new Set(['like', 'likes', 'love', 'loves', 'hate', 'hates', 'enjoy', 'enjoys', 'prefer', 'prefers', 'dislike', 'dislikes']);
const MUST_ING = new Set(['enjoy', 'enjoys', 'mind', 'stand', 'dislike', 'dislikes']);
const HAIR_LEN = new Set(['long', 'short', 'shoulder-length', 'medium-length']);
const HAIR_SHAPE = new Set(['straight', 'curly', 'wavy']);
const HAIR_COLOR = new Set(['black', 'brown', 'blonde', 'blond', 'red', 'grey', 'gray', 'dark', 'fair', 'white']);
const IRREG_COMP = { good: 'better', bad: 'worse', far: 'farther' };
const AN_EXCEPT = new Set(['university', 'uniform', 'one', 'european', 'useful', 'usual', 'unit', 'user', 'unicorn']);
const A_EXCEPT = new Set(['hour', 'honest', 'honour', 'heir']);

// Ünite kelimelerinden kısa ve uzun sıfatlar
const COMP = new Map();
for (const w of WORDS) if (w.comp) COMP.set(w.en.toLowerCase(), w.comp.toLowerCase());
for (const [a, c] of Object.entries({ tall: 'taller', short: 'shorter', old: 'older', young: 'younger', fast: 'faster', slow: 'slower', big: 'bigger', small: 'smaller', strong: 'stronger', weak: 'weaker', long: 'longer', nice: 'nicer', kind: 'kinder', happy: 'happier', funny: 'funnier', lazy: 'lazier', easy: 'easier', busy: 'busier', heavy: 'heavier', pretty: 'prettier', thin: 'thinner', slim: 'slimmer', fat: 'fatter', hot: 'hotter', cold: 'colder', cheap: 'cheaper', safe: 'safer', clever: 'cleverer', quiet: 'quieter', high: 'higher', hard: 'harder', healthy: 'healthier', noisy: 'noisier', ugly: 'uglier', messy: 'messier', tidy: 'tidier', friendly: 'friendlier', cute: 'cuter', calm: 'calmer', brave: 'braver', rude: 'ruder', mean: 'meaner', smart: 'smarter', large: 'larger', new: 'newer', great: 'greater' })) if (!COMP.has(a)) COMP.set(a, c);
const SHORT_COMP = new Map([...COMP].filter(([, c]) => !c.startsWith('more ')));
const LONG_ADJ = new Set([...COMP].filter(([, c]) => c.startsWith('more ')).map(([a]) => a));
for (const a of ['beautiful', 'intelligent', 'generous', 'interesting', 'exciting', 'dangerous', 'popular', 'expensive', 'difficult', 'boring', 'tiring', 'relaxing', 'enjoyable', 'challenging', 'hard-working', 'hardworking', 'helpful', 'careful', 'careless', 'polite', 'honest', 'patient', 'talkative', 'cheerful', 'confident', 'creative', 'curious', 'ambitious', 'modest', 'arrogant', 'reliable', 'thoughtful', 'energetic', 'emotional', 'outgoing', 'sociable', 'nervous', 'stubborn', 'selfish', 'jealous', 'punctual', 'forgetful', 'attractive', 'handsome', 'famous', 'important', 'comfortable', 'successful', 'serious', 'good-looking', 'well-built', 'easygoing', 'annoying', 'bossy']) if (!SHORT_COMP.has(a)) LONG_ADJ.add(a);
const SPORTS = WORDS.filter((w) => w.verb).map((w) => ({ en: w.en.toLowerCase(), verb: w.verb, parts: w.en.toLowerCase().split(' ') })).sort((a, b) => b.parts.length - a.parts.length);
const ADJ_SET = new Set([...COMP.keys(), ...LONG_ADJ, ...WORDS.filter((w) => w.pos === 'adj').map((w) => w.en.toLowerCase())]);

export function thirdS(v) {
  if (v === 'have') return 'has';
  if (v === 'do') return 'does';
  if (v === 'go') return 'goes';
  if (/(s|sh|ch|x|z|o)$/.test(v)) return `${v}es`;
  if (/[^aeiou]y$/.test(v)) return `${v.slice(0, -1)}ies`;
  return `${v}s`;
}

function baseOf(v) {
  if (v === 'has') return 'have';
  if (v === 'does') return 'do';
  if (v === 'goes') return 'go';
  if (/ies$/.test(v) && VERBS.has(`${v.slice(0, -3)}y`)) return `${v.slice(0, -3)}y`;
  if (/(ches|shes|xes|sses|zes|oes)$/.test(v) && VERBS.has(v.slice(0, -2))) return v.slice(0, -2);
  if (/s$/.test(v) && VERBS.has(v.slice(0, -1))) return v.slice(0, -1);
  return null;
}

export function ingOf(v) {
  if (v === 'ski') return 'skiing';
  if (v === 'die') return 'dying';
  if (/ie$/.test(v)) return `${v.slice(0, -2)}ying`;
  if (DOUBLE.has(v)) return `${v}${v.at(-1)}ing`;
  if (/[^aeiou]e$/.test(v) && v !== 'be' && v !== 'see') return `${v.slice(0, -1)}ing`;
  return `${v}ing`;
}

// Kişi adı mı? Büyük harfle başlayıp sözlükte olmayan kelime ya da bilinen bir ad (Can, Ali...)
const isName = (tok, next) => {
  if (!tok || !/^\p{Lu}\p{Ll}+$/u.test(tok)) return false;
  if (NAMES.has(tok)) return !(tok === 'Can' && next && PRONOUN_AFTER_AUX.has(next.toLowerCase()));
  return !lookupToken(tok) && !ADJ_SET.has(tok.toLowerCase()) && !VERBS.has(tok.toLowerCase());
};
// Cümle başında belirleyicisiz çoğul isim: "Athletes train hard."
const barePlural = (tok) => /^\p{Lu}\p{Ll}+s$/u.test(tok) && !NAMES.has(tok) && !!lookupToken(tok) && !SING_S.has(tok.toLowerCase());

// Cümle başındaki öznenin kaç kelime sürdüğünü ve kişisini bulur
function subjectAt(t, lo, i) {
  const w = lo[i];
  if (w == null) return null;
  let end;
  let person;
  if (PLURAL_SUBJ.has(w)) { end = i + 1; person = w === 'i' ? 'i' : 'pl'; }
  else if (THIRD_SUBJ.has(w)) { end = i + 1; person = 3; }
  else if (DET.has(w)) {
    let j = i + 1;
    let guard = 0;
    while (j < lo.length - 1 && guard++ < 2 && (ADJ_SET.has(lo[j]) || ['best', 'little', 'older', 'younger', 'new', 'favourite', 'favorite', 'other', 'elder'].includes(lo[j]))) j++;
    const noun = lo[j];
    if (!noun || !/^[a-z-]+$/.test(noun) || VERBS.has(noun) || BE.has(noun) || AUX.has(noun) || FREQ.has(noun)) return null;
    end = j + 1;
    person = IRREG_PLURAL.has(noun) || (/s$/.test(noun) && !SING_S.has(noun) && !/ss$/.test(noun)) ? 'pl' : 3;
  } else if (isName(t[i], t[i + 1])) {
    end = i + 1;
    if (t[end] && isName(t[end], t[end + 1])) end++;
    person = 3;
  } else if (barePlural(t[i]) || IRREG_PLURAL.has(w)) {
    end = i + 1;
    person = 'pl';
  } else return null;
  // "Ali and Can", "My mother and I" çoğuldur
  if (lo[end] === 'and') {
    const next = subjectAt(t, lo, end + 1);
    if (next) return { end: next.end, person: 'pl' };
  }
  return { end, person };
}

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const keepCase = (orig, next) => (/^[A-Z]/.test(orig) ? cap(next) : next);

function tokenize(text) {
  return String(text).replace(/[’`]/g, "'").match(/\p{L}+(?:'\p{L}+)*(?:-\p{L}+)*|\d+|[^\s\p{L}\d]/gu) || [];
}

function join(tokens) {
  return tokens.join(' ').replace(/\s+([.,!?;:)])/g, '$1').replace(/\(\s+/g, '(').replace(/\s+'\s+/g, "'").trim();
}

// Cümleyi denetler: { ok, fixed, notes: [{ wrong, right, why }] }
export function checkSentence(text) {
  let t = tokenize(text);
  const notes = [];
  if (!t.length) return { ok: true, fixed: '', notes };
  const lo = () => t.map((x) => x.toLowerCase());
  const note = (wrong, right, why) => { if (!notes.some((n) => n.why === why && n.right === right)) notes.push({ wrong, right, why }); };

  // i → I
  t = t.map((x) => (x === 'i' ? 'I' : x.replace(/^i'm$/, "I'm")));

  let L = lo();
  // Cümle başlarını bul (ilk kelime, bağlaçlar ve virgülden sonrası)
  const starts = () => {
    const s = [0];
    L.forEach((w, i) => { if ((CONJ.has(w) || w === ',' || w === ';') && i + 1 < L.length) s.push(i + 1); });
    return s;
  };

  // Soru: Do he / Does they
  for (let i = 0; i < L.length - 1; i++) {
    if ((L[i] === 'do' || L[i] === "don't") && (i === 0 || L[i - 1] === ',')) {
      const s = subjectAt(t, L, i + 1);
      if (s && s.person === 3) { const r = L[i] === 'do' ? 'does' : "doesn't"; note(`${t[i]} ${t.slice(i + 1, s.end).join(' ')}`, `${r} ${t.slice(i + 1, s.end).join(' ')}`, 'He, she, it ve tek kişiyle soru **Does** ile kurulur.'); t[i] = keepCase(t[i], r); }
    }
    if ((L[i] === 'does' || L[i] === "doesn't") && (i === 0 || L[i - 1] === ',')) {
      const s = subjectAt(t, L, i + 1);
      if (s && s.person !== 3) { const r = L[i] === 'does' ? 'do' : "don't"; note(`${t[i]} ${t.slice(i + 1, s.end).join(' ')}`, `${r} ${t.slice(i + 1, s.end).join(' ')}`, 'I, you, we, they ile soru **Do** ile kurulur.'); t[i] = keepCase(t[i], r); }
    }
  }
  L = lo();

  // How does she look like? → What does she look like?
  if (L[0] === 'how' && (L[1] === 'does' || L[1] === 'do' || L[1] === 'is') && L.includes('look') && L[L.indexOf('look') + 1] === 'like') {
    note('How ... look like?', 'What ... look like?', 'Dış görünüş sorusu **What** ile başlar: What does she look like?');
    t[0] = 'What';
  }
  // What is she look like? → What does she look like?
  if (L[0] === 'what' && (L[1] === 'is' || L[1] === 'are') && L.includes('look') && L[L.indexOf('look') + 1] === 'like') {
    const s = subjectAt(t, L, 2);
    const r = s && s.person !== 3 ? 'do' : 'does';
    note(`What ${t[1]} ... look like?`, `What ${r} ... look like?`, 'Görünüş sorusunda yardımcı fiil **do / does** olur, is/are olmaz.');
    t[1] = r;
  }
  L = lo();

  // Her yan cümle bir kez denetlenir; "Ali and Can" gibi bir öznenin içindeki "and" yeni cümle sayılmaz
  let from = 0;
  for (let guard = 0; guard < 24; guard++) {
    const st = starts().find((x) => x >= from);
    if (st == null) break;
    from = st + 1;
    let i = st;
    if (FREQ.has(L[i]) && ['always', 'never', 'rarely', 'seldom', 'hardly'].includes(L[i])) {
      // "Always I play" → "I always play"
      const s = subjectAt(t, L, i + 1);
      if (s && L[s.end] && (VERBS.has(L[s.end]) || baseOf(L[s.end]))) {
        const adv = t[i];
        note(`${adv} ${t.slice(i + 1, s.end + 1).join(' ')}`, `${t.slice(i + 1, s.end).join(' ')} ${adv.toLowerCase()} ${t[s.end]}`, `**${adv.toLowerCase()}** cümlenin başına gelmez, asıl fiilin önüne gelir.`);
        const moved = t.slice(i + 1, s.end);
        if (i === 0 && moved[0]) moved[0] = cap(moved[0]);
        t.splice(i, s.end - i, ...moved, adv.toLowerCase());
        L = lo();
      }
    }
    const s = subjectAt(t, L, i);
    if (!s) continue;
    from = s.end;
    let v = s.end;
    // be + sıklık zarfı sırası: "She always is happy" → "She is always happy"
    if (FREQ.has(L[v]) && BE.has(L[v + 1])) {
      note(`${t[v]} ${t[v + 1]}`, `${t[v + 1]} ${t[v]}`, 'Sıklık zarfı **am / is / are**\'dan sonra gelir: She is always happy.');
      [t[v], t[v + 1]] = [t[v + 1], t[v]];
      L = lo();
    }
    while (SOFT_ADV.has(L[v])) v++;
    const verb = L[v];
    if (!verb) continue;
    const subjText = t.slice(i, s.end).join(' ');

    // has got / have got uyumu
    if ((verb === 'have' || verb === 'has') && (L[v + 1] === 'got' || L[v + 1] === 'a' || L[v + 1] === 'an' || ADJ_SET.has(L[v + 1]) || HAIR_COLOR.has(L[v + 1]) || L[v + 1] === 'got')) {
      if (s.person === 3 && verb === 'have') { note(`${subjText} have`, `${subjText} has`, 'He, she, it ve tek kişiyle **has got** kullanılır.'); t[v] = 'has'; }
      if (s.person !== 3 && verb === 'has') { note(`${subjText} has`, `${subjText} have`, 'I, you, we, they ile **have got** kullanılır.'); t[v] = 'have'; }
      L = lo();
      continue;
    }
    // don't / doesn't uyumu
    if (verb === "don't" && s.person === 3) { note(`${subjText} don't`, `${subjText} doesn't`, 'He, she, it ile olumsuz **doesn\'t** olur.'); t[v] = "doesn't"; L = lo(); continue; }
    if (verb === "doesn't" && s.person !== 3) { note(`${subjText} doesn't`, `${subjText} don't`, 'I, you, we, they ile olumsuz **don\'t** olur.'); t[v] = "don't"; L = lo(); continue; }
    // "I am play" → "I play", "She is play" → "She plays" (be + yalın fiil)
    if (BE.has(verb) && L[v + 1] && VERBS.has(L[v + 1]) && !['like', 'look', 'help', 'love', 'tidy', 'clean', 'mind', 'fish', 'smile', 'score', 'run', 'cycle', 'dance', 'swim', 'walk', 'climb', 'surf', 'start', 'drink', 'paint', 'draw', 'support'].includes(L[v + 1]) && !ADJ_SET.has(L[v + 1])) {
      const base = L[v + 1];
      const right = s.person === 3 ? thirdS(base) : base;
      note(`${t[v]} ${t[v + 1]}`, right, 'Geniş zamanda fiilin önüne **am / is / are** gelmez: I play, she plays.');
      t.splice(v, 2, right);
      L = lo();
      continue;
    }
    // am / is / are uyumu
    if (verb === 'am' || verb === 'is' || verb === 'are') {
      const want = s.person === 'i' ? 'am' : s.person === 3 ? 'is' : 'are';
      if (verb !== want) {
        note(`${subjText} ${t[v]}`, `${subjText} ${want}`, s.person === 'i' ? '**I** ile **am** kullanılır.' : s.person === 3 ? 'He, she, it ve tek kişiyle **is** kullanılır.' : 'You, we, they ve çoğul öznelerle **are** kullanılır.');
        t[v] = want;
        L = lo();
      }
      continue;
    }
    if (BE.has(verb)) continue;
    // He play → He plays
    if (s.person === 3 && VERBS.has(verb) && !SAME_PAST.has(verb)) {
      const r = thirdS(verb);
      note(`${subjText} ${t[v]}`, `${subjText} ${r}`, `He, she, it ve tek kişiden sonra fiil **-s** takısı alır: ${verb} → **${r}**.`);
      t[v] = keepCase(t[v], r);
      L = lo();
      continue;
    }
    // I plays → I play
    if (s.person !== 3) {
      const b = baseOf(verb);
      if (b) {
        note(`${subjText} ${t[v]}`, `${subjText} ${b}`, 'I, you, we, they ile fiil **yalın** kalır, -s almaz.');
        t[v] = b;
        L = lo();
      }
    }
  }

  // Yardımcı fiilden sonra yalın fiil: doesn't plays, Does she plays, can plays
  for (let i = 0; i < L.length - 1; i++) {
    if (!AUX.has(L[i]) || L[i] === 'please') continue;
    if (t[i] === 'Can' && isName('Can', t[i + 1])) continue;
    let j = i + 1;
    if (L[i] === 'does' || L[i] === 'do' || L[i] === 'did') {
      const s = subjectAt(t, L, j);
      if (s) j = s.end;
    }
    while (SOFT_ADV.has(L[j])) j++;
    const b = L[j] && baseOf(L[j]);
    if (b && !(L[i] === 'to' && L[j] === 'is')) {
      note(`${t[i]} ... ${t[j]}`, `${t[i]} ... ${b}`, `**${t[i].toLowerCase()}** kelimesinden sonra fiil yalın olur: ${L[j]} → **${b}**.`);
      t[j] = b;
      L = lo();
    }
  }

  // Sıklık zarfı asıl fiilden sonra: "I play always" → "I always play"
  for (let i = 1; i < L.length; i++) {
    if (!FREQ.has(L[i])) continue;
    const prev = L[i - 1];
    const b = VERBS.has(prev) ? prev : baseOf(prev);
    if (b && !BE.has(prev) && i >= 2 && (subjectAt(t, L, i - 2) || subjectAt(t, L, Math.max(0, i - 3)))) {
      note(`${t[i - 1]} ${t[i]}`, `${t[i]} ${t[i - 1]}`, `Sıklık zarfı (**${L[i]}**) asıl fiilin **önüne** gelir.`);
      [t[i - 1], t[i]] = [t[i], t[i - 1]];
      L = lo();
    }
  }

  // Karşılaştırma
  for (let i = 0; i < L.length; i++) {
    const w = L[i];
    const n = L[i + 1];
    if (w === 'more' && n) {
      if (/[a-z]{2,}er$/.test(n) && [...SHORT_COMP.values()].includes(n)) {
        note(`more ${t[i + 1]}`, t[i + 1], `**${n}** zaten "daha" demek. Başına **more** gelmez.`);
        t.splice(i, 1);
        L = lo();
        continue;
      }
      if (IRREG_COMP[n]) {
        note(`more ${t[i + 1]}`, IRREG_COMP[n], `**${n}** düzensizdir: ${n} → **${IRREG_COMP[n]}**.`);
        t.splice(i, 2, IRREG_COMP[n]);
        L = lo();
        continue;
      }
      if (SHORT_COMP.has(n) && (L[i + 2] === 'than' || !L[i + 2] || L[i + 2] === '.' || L[i + 2] === ',')) {
        const c = SHORT_COMP.get(n);
        note(`more ${t[i + 1]}`, c, `**${n}** kısa bir sıfat, **-er** alır: ${n} → **${c}**.`);
        t.splice(i, 2, c);
        L = lo();
        continue;
      }
    }
    if (w === 'gooder' || w === 'badder' || w === 'gooder') {
      const r = w === 'gooder' ? 'better' : 'worse';
      note(t[i], r, `Düzensiz sıfat: ${w === 'gooder' ? 'good' : 'bad'} → **${r}**.`);
      t[i] = r;
      L = lo();
      continue;
    }
    // beautifuler → more beautiful
    const m = w.match(/^([a-z-]+?)(er)$/);
    if (m && L[i + 1] === 'than' && !ADJ_SET.has(w) && ![...SHORT_COMP.values()].includes(w)) {
      const stem = LONG_ADJ.has(m[1]) ? m[1] : LONG_ADJ.has(`${m[1]}e`) ? `${m[1]}e` : null;
      if (stem) {
        note(t[i], `more ${stem}`, `**${stem}** uzun bir sıfat, **more** ile karşılaştırılır.`);
        t.splice(i, 1, 'more', stem);
        L = lo();
        continue;
      }
    }
    // then → than (taller then me)
    if (w === 'then' && i > 0 && ([...SHORT_COMP.values()].includes(L[i - 1]) || L[i - 2] === 'more' || ['better', 'worse'].includes(L[i - 1]))) {
      note(`${t[i - 1]} then`, `${t[i - 1]} than`, 'Karşılaştırmada **than** kullanılır (then = sonra).');
      t[i] = 'than';
      L = lo();
    }
    // taller as / taller from → taller than
    if ((w === 'as' || w === 'from') && i > 0 && ([...SHORT_COMP.values()].includes(L[i - 1]) || ['better', 'worse'].includes(L[i - 1])) && L[i - 2] !== 'as') {
      note(`${t[i - 1]} ${t[i]}`, `${t[i - 1]} than`, 'Karşılaştırmada "-den daha" için **than** kullanılır.');
      t[i] = 'than';
      L = lo();
    }
    // as tall than → as tall as
    if (w === 'as' && L[i + 2] === 'than') {
      note(`as ${t[i + 1]} than`, `as ${t[i + 1]} as`, 'Eşitlikte kalıp **as ... as** olur.');
      t[i + 2] = 'as';
      L = lo();
    }
  }

  // play / do / go + spor
  for (let i = 0; i < L.length - 1; i++) {
    const vb = L[i];
    const fam = /^(play|plays|playing|played)$/.test(vb) ? 'play' : /^(do|does|doing|did)$/.test(vb) ? 'do' : /^(go|goes|going|went)$/.test(vb) ? 'go' : null;
    if (!fam) continue;
    const sport = SPORTS.find((sp) => sp.parts.every((p, k) => L[i + 1 + k] === p));
    if (!sport || sport.verb === fam) continue;
    const form = { play: ['play', 'plays', 'playing', 'played'], do: ['do', 'does', 'doing', 'did'], go: ['go', 'goes', 'going', 'went'] };
    const idx = form[fam].indexOf(vb);
    const r = form[sport.verb][idx];
    const why = sport.verb === 'play' ? 'Top ya da rakip olan oyunlar **play** alır.' : sport.verb === 'do' ? 'Dövüş sporları ve bireysel etkinlikler **do** alır.' : '-ing ile biten, bir yere gidilerek yapılan etkinlikler **go** alır.';
    note(`${t[i]} ${sport.en}`, `${r} ${sport.en}`, why);
    t[i] = keepCase(t[i], r);
    L = lo();
  }

  // love / like / enjoy + -ing
  for (let i = 0; i < L.length - 1; i++) {
    const vb = L[i];
    const isLove = LOVE_VERBS.has(vb) || (vb === 'mind' && L[i - 1] && /n't$/.test(L[i - 1])) || (vb === 'stand' && L[i - 1] === "can't");
    if (!isLove) continue;
    if (vb === 'like' && (L[i - 1] === 'look' || L[i - 1] === 'looks' || L[i - 1] === 'looked' || BE.has(L[i - 1]) || L[i - 1] === 'what' || L[i - 1] === 'would')) continue;
    if (L[i + 1] === 'to' && VERBS.has(L[i + 2])) {
      if (MUST_ING.has(vb) || vb === 'mind' || vb === 'stand') {
        const r = ingOf(L[i + 2]);
        note(`${t[i]} to ${t[i + 2]}`, `${t[i]} ${r}`, `**${vb}** kelimesinden sonra fiil **-ing** alır.`);
        t.splice(i + 1, 2, r);
        L = lo();
      }
      continue;
    }
    const nx = L[i + 1];
    if (nx && VERBS.has(nx) && !['look'].includes(nx) && !(L[i + 2] && ['and', 'but'].includes(L[i + 2]) && false)) {
      // "I like swim" → "I like swimming" (fiilden sonra isim gelebileceği için yalnızca açık fiiller)
      if (['swim', 'run', 'play', 'go', 'do', 'ride', 'read', 'watch', 'ski', 'skate', 'jog', 'surf', 'climb', 'cycle', 'dance', 'cook', 'sing', 'write', 'draw', 'walk', 'fish', 'study', 'win', 'lose', 'sleep', 'eat', 'travel'].includes(nx) && !SPORTS.some((sp) => sp.en === nx)) {
        const r = ingOf(nx);
        note(`${t[i]} ${t[i + 1]}`, `${t[i]} ${r}`, `**${vb}** kelimesinden sonra fiil **-ing** alır: ${t[i]} ${r}.`);
        t[i + 1] = r;
        L = lo();
      }
    }
  }

  // look like
  for (let i = 0; i < L.length - 1; i++) {
    if (!/^(look|looks)$/.test(L[i])) continue;
    const nx = L[i + 1];
    if (['my', 'your', 'his', 'her', 'our', 'their'].includes(nx) || (isName(t[i + 1], t[i + 2]) && L[i - 1] !== 'to')) {
      note(`${t[i]} ${t[i + 1]}`, `${t[i]} like ${t[i + 1]}`, 'Birine benzemek **look like** ile anlatılır: She looks like her mother.');
      t.splice(i + 1, 0, 'like');
      L = lo();
    } else if (nx === 'like' && ADJ_SET.has(L[i + 2]) && (!L[i + 3] || ['.', '!', ',', 'and', 'today'].includes(L[i + 3])) && !['a', 'an'].includes(L[i + 2])) {
      note(`${t[i]} like ${t[i + 2]}`, `${t[i]} ${t[i + 2]}`, 'Sıfattan önce **like** gelmez: She looks happy.');
      t.splice(i + 1, 1);
      L = lo();
    }
  }

  // Saç sıfatlarının sırası ve hairs
  for (let i = 0; i < L.length; i++) {
    if (L[i] !== 'hair' && L[i] !== 'hairs') continue;
    if (L[i] === 'hairs' && L[i - 1] !== 'grey' && L[i - 1] !== 'white') {
      note('hairs', 'hair', 'Baştaki saç için **hair** tekil kullanılır.');
      t[i] = 'hair';
    }
    let j = i - 1;
    const adjs = [];
    while (j >= 0 && (HAIR_LEN.has(L[j]) || HAIR_SHAPE.has(L[j]) || HAIR_COLOR.has(L[j]))) { adjs.unshift(t[j]); j--; }
    if (adjs.length >= 2) {
      const rank = (a) => (HAIR_LEN.has(a.toLowerCase()) ? 0 : HAIR_SHAPE.has(a.toLowerCase()) ? 1 : 2);
      const sorted = adjs.slice().sort((a, b) => rank(a) - rank(b));
      if (sorted.join(' ') !== adjs.join(' ')) {
        note(`${adjs.join(' ')} hair`, `${sorted.join(' ')} hair`, 'Saç anlatırken sıra: **uzunluk + şekil + renk** (long curly black hair).');
        t.splice(j + 1, adjs.length, ...sorted);
      }
    }
    L = lo();
  }

  // İnsan için long → tall
  for (let i = 1; i < L.length; i++) {
    if (L[i] === 'long' && BE.has(L[i - 1]) && !['hair', 'legs', 'arms', 'nails'].includes(L[i + 1]) && (L[i - 2] && (THIRD_SUBJ.has(L[i - 2]) || PLURAL_SUBJ.has(L[i - 2]) || isName(t[i - 2], t[i - 1]) || ['brother', 'sister', 'father', 'mother', 'friend', 'teacher', 'cousin', 'dad', 'mum', 'uncle', 'aunt'].includes(L[i - 2])))) {
      note(`${t[i - 1]} long`, `${t[i - 1]} tall`, 'İnsan boyu için **tall** kullanılır; long saç ve eşyalar içindir.');
      t[i] = 'tall';
      L = lo();
    }
  }

  // Edatlar
  const PREP = [
    [/^good$/, ['in', 'on'], 'at', '**good at** kalıbı: I am good at tennis.'],
    [/^interested$/, ['on', 'at', 'about', 'with'], 'in', '**interested in** kalıbı: She is interested in sports.'],
    [/^keen$/, ['in', 'at', 'about'], 'on', '**keen on** kalıbı: He is keen on football.'],
    [/^fond$/, ['in', 'at', 'about', 'with'], 'of', '**fond of** kalıbı: I am fond of swimming.'],
    [/^crazy$/, ['for', 'at'], 'about', '**crazy about** kalıbı: She is crazy about volleyball.'],
  ];
  for (let i = 0; i < L.length - 1; i++) {
    for (const [re, bad, good, why] of PREP) {
      if (re.test(L[i]) && bad.includes(L[i + 1]) && (BE.has(L[i - 1]) || BE.has(L[i - 2]) || ['very', 'really', 'so'].includes(L[i - 1]))) {
        note(`${t[i]} ${t[i + 1]}`, `${t[i]} ${good}`, why);
        t[i + 1] = good;
      }
    }
  }
  L = lo();

  // I am agree → I agree
  for (let i = 0; i < L.length - 1; i++) {
    if (BE.has(L[i]) && L[i + 1] === 'agree') { note(`${t[i]} agree`, 'agree', '"Katılıyorum" **I agree** olur, am kullanılmaz.'); t.splice(i, 1); L = lo(); }
  }

  // a / an
  for (let i = 0; i < L.length - 1; i++) {
    const nx = L[i + 1];
    if (!/^[a-z]/.test(nx || '')) continue;
    if (L[i] === 'a' && /^[aeiou]/.test(nx) && !AN_EXCEPT.has(nx)) { note(`a ${t[i + 1]}`, `an ${t[i + 1]}`, 'Sesli harfle başlayan kelimeden önce **an** gelir.'); t[i] = keepCase(t[i], 'an'); }
    else if (L[i] === 'a' && A_EXCEPT.has(nx)) { note(`a ${t[i + 1]}`, `an ${t[i + 1]}`, `**${nx}** sesli harfle okunur (h okunmaz), önüne **an** gelir.`); t[i] = keepCase(t[i], 'an'); }
    else if (L[i] === 'an' && /^[^aeiou]/.test(nx) && !A_EXCEPT.has(nx)) { note(`an ${t[i + 1]}`, `a ${t[i + 1]}`, 'Sessiz harfle başlayan kelimeden önce **a** gelir.'); t[i] = keepCase(t[i], 'a'); }
  }

  // Büyük harf ve nokta (yalnızca düzeltilmiş cümlede)
  if (t[0] && /^[a-z]/.test(t[0])) t[0] = cap(t[0]);
  let fixed = join(t);
  if (!/[.!?]$/.test(fixed)) fixed += L[0] && ['what', 'who', 'how', 'where', 'when', 'why', 'which', 'do', 'does', 'is', 'are', 'can', 'have', 'has'].includes(L[0]) ? '?' : '.';
  return { ok: notes.length === 0, fixed, notes };
}

// Metin İngilizce bir cümleye benziyor mu? (Türkçe soru değilse)
const EN_FUNC = new Set(['i', 'you', 'he', 'she', 'it', 'we', 'they', 'is', 'am', 'are', 'the', 'a', 'an', 'my', 'your', 'his', 'her', 'and', 'but', 'like', 'have', 'has', 'got', 'do', 'does', "don't", "doesn't", 'play', 'plays', 'go', 'goes', 'than', 'what', 'who', 'how', 'can', 'to', 'of', 'in', 'on', 'at', 'very', 'this', 'that', 'me', 'our', 'their', 'with', 'love', 'hate', 'always', 'never', 'usually', 'sometimes', 'often', "i'm", "it's", 'yes', 'no', 'not', 'too', 'so', 'because']);
export function looksEnglish(text, isKnown) {
  const toks = tokenize(text).filter((x) => /^\p{L}/u.test(x));
  if (toks.length < 2) return false;
  if (/[çğıöşüÇĞİÖŞÜ]/.test(text)) return false;
  const lo = toks.map((x) => x.toLowerCase());
  const func = lo.filter((x) => EN_FUNC.has(x)).length;
  const known = toks.filter((x, k) => isKnown(x) || isName(x, toks[k + 1])).length;
  return func >= 1 && known >= toks.length * 0.7;
}
