// Muffin'in sohbet katmanı: selamlaşma, hal hatır, duygular, şaka ve bilmece, çalışma planı,
// konuşmanın bağlamı ("bir örnek daha", "anlamadım", "evet"), İngilizce sohbet modu ve cümle düzeltme.
// Bilgi soruları (kelime anlamı, konu) bilgi bankasına (engine.js) devredilir.

import { store, level, streak, todayXP, isLearned } from '../lib/store.js';
import { displayName, fold, lev } from '../lib/text.js';
import { pick, shuffle } from '../lib/dom.js';
import { WORDS } from '../data/words.js';
import { LESSONS, lineId } from '../data/units.js';
import { lookupToken, findWord } from '../lib/lookup.js';
import { checkSentence, looksEnglish } from './grammar.js';
import { mistakeCount } from '../quiz/mistakes.js';
import { CHAT_EN, PHRASES, JOKES, RIDDLES, STORIES, EN_QS } from '../data/chat-lines.js';

const first = () => displayName(store.get('name'));
const squash = (s) => s.replace(/(.)\1{2,}/g, '$1');
const has = (re, F) => re.test(F);

/* ---------- Muffin'in İngilizce cümleleri (data/chat-lines.js, seslendirilir) ---------- */


const sayLine = (k) => ({ en: CHAT_EN[k][0], tr: CHAT_EN[k][1], id: lineId(CHAT_EN[k][0]) });
const sayRaw = (en, tr) => ({ en, tr, id: lineId(en) });

/* ---------- Kalıp sözlüğü: "how are you ne demek", "nasılsın İngilizce nasıl denir" ---------- */

const PHRASE_EN = new Map(PHRASES.map(([en, tr]) => [fold(en).replace(/\.\.\.$/, '').trim(), { en, tr }]));
const PHRASE_TR = PHRASES.flatMap(([en, tr, keys]) => keys.split('|').map((k) => [k, { en, tr }]));

export function phraseMeaning(term) {
  const f = fold(term).replace(/[?!.]/g, '').trim();
  return PHRASE_EN.get(f) || PHRASE_EN.get(f.replace(/ please$/, '')) || null;
}
export function phraseEnglish(trTerm) {
  const f = fold(trTerm).trim();
  const hit = PHRASE_TR.find(([k]) => f === k);
  return hit ? hit[1] : null;
}

/* ---------- Şakalar, bilmeceler, ilginç bilgiler ---------- */

const FACTS = [
  'İngilizcede en çok kullanılan kelime **the**.',
  '**I** (ben) her zaman büyük harfle yazılır, cümlenin ortasında bile: *My sister and I play tennis.*',
  '**swimming** kelimesinde iki tane m var: swim + m + ing. Kısa fiillerde son harf çiftlenir: *running, swimming*.',
  'Saç (**hair**) sayılamaz: *She has got long hair.* denir, "hairs" denmez.',
  'Futbol İngiltere\'de **football**, Amerika\'da **soccer** diye geçer.',
  'Tenis için **court**, futbol için **pitch**, buz pateni için **rink** denir. Her sporun yeri farklı bir kelime!',
  '**Twins** ikizler demek. İkizlerden biri için **twin** denir: *She is my twin sister.*',
  'İngilizcede "çok" için **very** kullanılır ama karşılaştırmada **much** gelir: *much taller* (çok daha uzun).',
  '**good** kelimesinin karşılaştırması "gooder" değil **better**! Düzensiz sıfatlar ezberlenir.',
  'İngilizcede sıfatlar isimden önce gelir: **a kind girl**. Türkçedeki gibi: "nazik bir kız".',
];
const MOTIVATE = [
  'Her gün 15 dakika bile çalışsan, sınava kadar yüzlerce kelime öğrenirsin. Küçük adımlar büyük fark yaratır! 💪',
  'Hata yapmak öğrenmenin bir parçası. Yanlışlarım defterin aslında en değerli sayfan!',
  'Sen düşündüğünden çok daha iyisin. Bir konu bitirip kendini ödüllendirmeye ne dersin?',
  'Bugün tek bir şey öğrensen bile dünden daha iyisin. Hadi bir alıştırma çözelim!',
  'Zor görünen konular, birkaç örnekten sonra kolaylaşır. Ben hep yanındayım! 😺',
];

/* ---------- İngilizce sohbet modu ---------- */

const EXIT_EN = /^(cik|cikis|bitir|bitti|dur|stop|exit|quit|enough|yeter|tamam yeter|turkce konusalim|turkceye don|sohbeti bitir|bye|goodbye|gorusuruz)$/;
const HELP_EN = /^(anlamadim|anlamiyorum|turkcesi|ne demek|ne diyorsun|ipucu|hint|help|yardim|i don't understand|i dont understand|what does it mean|soru ne|turkce|ornek|ornek ver|bir ornek|bir ornek daha|ornek cumle|example)$/;
const SKIP_EN = /^(bilmiyorum|i don't know|i dont know|idk|pas|gec|skip|next|sonraki|baska soru|another question|ornek cevap|cevap|sample)$/;

function nextEnQuestion(convo) {
  const pool = EN_QS.filter((q) => !convo.enAsked.includes(q.en));
  const q = pool.length ? pool[Math.floor(Math.random() * Math.min(pool.length, 4))] : pick(EN_QS);
  if (!pool.length) convo.enAsked = [];
  convo.enAsked.push(q.en);
  convo.enQ = q;
  return q;
}

const qLine = (q) => sayRaw(q.en, q.tr);
const EN_CHIPS = ['Örnek cevap', 'Anlamadım', 'Sohbeti bitir'];

function react(text) {
  const lo = text.toLowerCase();
  const sport = WORDS.filter((w) => w.verb).sort((a, b) => b.en.length - a.en.length).find((w) => lo.includes(w.en.toLowerCase()));
  if (sport && /\b(hate|don't like|dont like|can't stand|dislike)\b/.test(lo)) return /boxing|wrestling|ice hockey|paragliding|mountain|rafting|scuba|skiing|snowboarding/.test(sport.en) ? sayLine('dangerous') : sayLine('sorry');
  if (sport && sport.en === 'swimming' && /\b(love|like|enjoy)\b/.test(lo)) return sayLine('swim');
  if (sport && /\b(love|like|enjoy|favourite|favorite|good at|keen on|crazy about)\b/.test(lo)) return sayLine('sportsGood');
  if (/\b(always|usually|often|every day|twice|once|three times)\b/.test(lo)) return sayLine('healthy');
  if (/\b(dangerous|exciting|boring|tiring)\b/.test(lo)) return sayLine('interesting');
  if (/\b(than|as .* as)\b/.test(lo)) return sayLine('interesting');
  if (/\bfriend\b/.test(lo) && /\b(kind|funny|friendly|helpful|generous|clever|honest|nice|cheerful)\b/.test(lo)) return sayLine('goodFriend');
  if (/^(i am|i'm|i have got|i've got)\b/.test(lo) && /\b(tall|short|slim|hair|eyes|glasses|freckles)\b/.test(lo)) return sayLine('imagine');
  if (/\b(kind|funny|friendly|helpful|generous|clever|honest|cheerful|hard-working|hardworking)\b/.test(lo)) return sayLine('lovely');
  if (/\blook like\b|\blooks like\b/.test(lo)) return sayLine('lovely');
  if (/^(yes|no)\b/.test(lo)) return sayLine('great');
  return sayLine(pick(['great', 'nice']));
}

function enModeTurn(text, F, convo) {
  const q = convo.enQ;
  if (EXIT_EN.test(F)) {
    convo.mode = null;
    const { ok, total } = convo.enScore;
    return { say: [sayLine('chatEnd')], text: total ? `${total} cümle yazdın, **${ok}** tanesi ilk seferde kusursuzdu. Harikasın ${first()}! 🎉` : 'İstediğin zaman yine İngilizce konuşabiliriz.', mood: 'happy', chips: ['İngilizce konuşalım', 'Beni test et', 'Bugün ne çalışayım?'] };
  }
  if (/^(ingilizce sohbete don|sohbete don|devam edelim|continue)$/.test(F)) return { text: 'Kaldığımız yerden devam! Sorum şuydu:', say: [qLine(q)], mood: 'happy', chips: EN_CHIPS };
  if (HELP_EN.test(F)) {
    return { text: `Sorum şuydu: **${q.en}**\nTürkçesi: ${q.tr}\nÖrnek cevap: *${q.model}*\nŞimdi sen kendi cevabını yaz!`, mood: 'wink', chips: ['Sohbeti bitir'] };
  }
  if (SKIP_EN.test(F)) {
    const nq = nextEnQuestion(convo);
    return { text: `Örnek cevap: *${q.model}*\nSıradaki soru:`, say: [qLine(nq)], mood: 'think', chips: EN_CHIPS };
  }
  const english = looksEnglish(text, (x) => !!lookupToken(x) || !!findWord(x));
  if (!english) {
    return { say: [sayLine('tryEn')], text: `İngilizce yazmayı dene! İpucu: *${q.model.split(' / ')[0]}*\nTakılırsan "örnek cevap" yaz.`, mood: 'think', chips: EN_CHIPS };
  }
  const r = checkSentence(text);
  convo.enScore.total++;
  if (r.ok) convo.enScore.ok++;
  const nq = nextEnQuestion(convo);
  const reaction = react(text);
  if (r.ok) {
    return { sayAfter: true, say: [reaction, qLine(nq)], text: pick(['✅ Cümlen kusursuz!', '✅ Hiç hata yok, süpersin!', '✅ Mükemmel bir cümle!']), xp: 5, mood: 'happy', chips: EN_CHIPS };
  }
  return { fix: { original: text, ...r }, say: [reaction, qLine(nq)], text: 'Küçük bir düzeltme yapalım:', xp: 2, mood: 'wink', chips: EN_CHIPS, sayFirstAfterFix: true };
}

/* ---------- Çalışma planı ve ilerleme ---------- */

function studyPlan() {
  const done = store.get('lessons');
  const next = LESSONS.find((l) => !done[l.id]);
  const mis = mistakeCount();
  const learned = WORDS.filter((w) => isLearned(w.id)).length;
  const exams = store.get('exams');
  const links = [];
  const lines = [];
  if (next) {
    lines.push(`**1.** Sıradaki konu: **${next.title}** (${next.minutes} dakika).`);
    links.push({ href: `#/ders/${next.id}`, label: next.title, icon: 'book' });
  } else lines.push('**1.** Bütün konuları bitirmişsin, süper! Şimdi deneme sınavı zamanı.');
  if (mis) {
    lines.push(`**2.** Yanlışlarım defterinde **${mis}** soru var. Onları düzeltmek sınavda en çok puan kazandıran şey.`);
    links.push({ href: '#/yanlislar', label: 'Yanlışlarım', icon: 'redo' });
  } else lines.push(`**2.** Kelime kartlarıyla 10 kelime çalış. Şu an **${learned}** kelime öğrendin.`);
  lines.push(exams.length ? `**3.** Son deneme sınavında **${exams[exams.length - 1].score}** aldın. Bir tane daha çözüp kendini dene!` : '**3.** Bir deneme sınavı çöz, nerede olduğunu gör.');
  links.push({ href: '#/sinav', label: 'Deneme sınavı', icon: 'exam' });
  return { text: `${first()}, bugün için önerim:\n${lines.join('\n')}`, links, mood: 'happy', chips: ['Beni test et', 'İngilizce konuşalım'] };
}

function progress() {
  const lv = level();
  const s = streak();
  const done = Object.keys(store.get('lessons')).length;
  const learned = WORDS.filter((w) => isLearned(w.id)).length;
  return { text: `İşte durumun:\n• Seviye **${lv.n}** (${lv.name}), toplam **${store.get('xp')} XP**\n• Bugün **${todayXP()} / ${store.get('goal')} XP**\n• Seri: **${s} gün**\n• Biten konu: **${done} / ${LESSONS.length}**\n• Öğrenilen kelime: **${learned}**\n${s >= 3 ? 'Serin harika gidiyor! 🔥' : 'Her gün biraz çalışırsan serin büyür. 🔥'}`, mood: 'happy', chips: ['Bugün ne çalışayım?', 'Beni test et'] };
}

/* ---------- Saat ve tarih ---------- */

const DAYS = [['Sunday', 'Pazar'], ['Monday', 'Pazartesi'], ['Tuesday', 'Salı'], ['Wednesday', 'Çarşamba'], ['Thursday', 'Perşembe'], ['Friday', 'Cuma'], ['Saturday', 'Cumartesi']];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const NUM = ['twelve', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];

function timeEn(d) {
  const h = d.getHours();
  const m = d.getMinutes();
  const h12 = h % 12;
  const next = (h + 1) % 12;
  if (m === 0) return `It's ${NUM[h12]} o'clock.`;
  if (m === 15) return `It's quarter past ${NUM[h12]}.`;
  if (m === 30) return `It's half past ${NUM[h12]}.`;
  if (m === 45) return `It's quarter to ${NUM[next]}.`;
  return `It's ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}.`;
}

/* ---------- Basit matematik ---------- */

const EN_NUM = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
function numEn(n) {
  if (n < 0) return `minus ${numEn(-n)}`;
  if (n < 20) return EN_NUM[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? `-${EN_NUM[n % 10]}` : '');
  if (n < 1000) return `${EN_NUM[Math.floor(n / 100)]} hundred${n % 100 ? ` and ${numEn(n % 100)}` : ''}`;
  return String(n);
}

function math(F) {
  const m = F.replace(/\s/g, '').replace(/x/g, '*').match(/^(\d{1,4})([+\-*/])(\d{1,4})(=|\?)*$/);
  if (!m) return null;
  const a = Number(m[1]);
  const b = Number(m[3]);
  const op = m[2];
  const r = op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : b ? a / b : NaN;
  if (!Number.isInteger(r) || r > 9999) return { text: `Cevap: **${Number.isFinite(r) ? +r.toFixed(2) : '?'}**. Ama ben matematikten çok İngilizceyi severim! 😺` };
  const word = { '+': 'plus', '-': 'minus', '*': 'times', '/': 'divided by' }[op];
  return { sayAfter: true, text: `Cevap: **${r}** 🧮\nİngilizcede şöyle söylenir:`, say: [sayRaw(`${numEn(a)[0].toUpperCase()}${numEn(a).slice(1)} ${word} ${numEn(b)} is ${numEn(r)}.`, `${a} ${{ '+': 'artı', '-': 'eksi', '*': 'çarpı', '/': 'bölü' }[op]} ${b} eşittir ${r}.`)], mood: 'wink', chips: ['Beni test et'] };
}

/* ---------- Niyetler ---------- */

const KNOWLEDGE = /(ne demek|nedir|anlami|ingilizcesi|turkcesi|nasil denir|nasil yazilir|zitti|tersi|karsit|karsilastirma|ornek cumle|play mi|do mu|go mu|fark|kural|nasil yapilir|nasil kurulur|hangi fiil|ne zaman kullanilir|nereye gelir|what does|meaning|opposite|comparative)/;
const GREET = /^(merhabalar|merhaba|meraba|mrb|mrhb|selamlar|selam|slm|sa|selamun aleykum|hey|heyy|hi|hii|hello|helo|hallo|hola|hiya|yo|good morning|good afternoon|good evening|morning|gunaydin|gunaydinlar|iyi gunler|iyi aksamlar|tunaydin)\b/;
const ADDRESS = /^(muffin|muffincim|muffin'?cim|kedicik|kedicim|canim|ya|sey|hocam|dostum|arkadasim|my friend|dear)\b/;

const INTENTS = [
  ['howareyou', /(iyi misin|nasilsin|nasil gidiyor|nasilsiniz|keyifler nasil|naber|ne haber|nbr|how are you|how r u|how are u|how're you|hows it going|how is it going|whats up|what's up|what s up|wassup|sup\b|how do you do|how is your day|how's your day)/],
  ['imfine', /^(iyiyim|ben de iyiyim|bende iyiyim|iyi|cok iyiyim|super|harika|harikayim|fena degil|idare eder|iyi sayilir|i'?m fine|im fine|i am fine|fine|i'?m good|im good|i am good|good|great|not bad|so so|i'?m ok|i am ok|okay|i'?m great|i am great|very well)( thanks?| thank you| tesekkurler| sen| ya sen| and you| you)*$/],
  ['imbad', /^(kotuyum|cok kotuyum|iyi degilim|pek iyi degilim|uzgunum|mutsuzum|moralim bozuk|i'?m sad|i am sad|i'?m not (fine|good|ok)|bad|not good|i'?m bad)\b/],
  ['name', /(adin ne|ismin ne|senin adin|adini soyle|what'?s your name|what is your name|whats ur name|your name)/],
  ['who', /(sen kimsin|kimsin sen|^kimsin|nesin sen|who are you|are you a cat|kedi misin|robot musun|yapay zeka misin|are you a robot|are you (an )?ai|ai misin|insan misin|gercek misin|chatgpt|bot musun)/],
  ['age', /(kac yasindasin|yasin kac|kac yasinda|how old are you)/],
  ['where', /(nerelisin|nerede yasiyorsun|nerede oturuyorsun|where are you from|where do you live)/],
  ['myname', /(benim adim|benim ismim|my name is|my name's|call me|bana .+ de$)/],
  ['myage', /(\d{1,2}) (yasindayim|yasinda|years old)/],
  ['thanks', /(tesekkur|tesekkurler|sagol|sag ol|sagolun|eyvallah|thank|thanks|thx|tysm|tyvm|minnettar)/],
  ['bye', /^(bye|bye bye|bay bay|goodbye|good bye|see you|see ya|gorusuruz|gorusmek uzere|hoscakal|hosca kal|bb|bay|kacar|kaciyorum|gitmem lazim|ben gidiyorum|sonra konusuruz)\b/],
  ['night', /(iyi geceler|good night|goodnight|uyuyacagim|uyumaya gidiyorum|yatiyorum)/],
  ['sorry', /^(ozur dilerim|pardon|kusura bakma|sorry|i'?m sorry)\b/],
  ['love', /(seni seviyorum|seni cok seviyorum|i love you|love you|seviyorum seni|ilove you)/],
  ['praise', /(harikasin|cok tatlisin|tatlisin|cok iyisin|en iyisisin|super sin|supersin|bayildim sana|you'?re (the best|great|cute|amazing|awesome)|you are (the best|great|cute|amazing|awesome)|good cat|aferin sana|cok akillisin|akillisin|sevimlisin)/],
  ['insult', /(aptal|salak|gerizekali|mal misin|kotusun|berbatsin|sacma|stupid|idiot|dumb|you suck|hate you|nefret ediyorum senden|bilmiyorsun hicbir sey|hicbir sey bilmiyorsun|isine yaramiyorsun|ise yaramaz)/],
  ['laugh', /^(ha(ha)+|ah(ah)+|hah|hehe+|hihi+|lol|lmao|xd|kjsdf|sdfsd|asdas)$/],
  ['bored', /(sikildim|cok sikildim|canim sikiliyor|sikici|i'?m bored|i am bored|bored)/],
  ['tired', /(yoruldum|cok yoruldum|yorgunum|uykum var|uykum geldi|i'?m tired|i am tired|sleepy)/],
  ['scared', /(korkuyorum|endiseliyim|heyecanliyim|stresliyim|stres|gerginim|kaygi|sinav(dan|a) (korkuyorum|stres)|basaramayacagim|yapamayacagim|yapamiyorum|cok zor|ingilizce zor|zor mu|anlamiyorum hicbir)/],
  ['hungry', /(aciktim|cok aciktim|karnim ac|i'?m hungry|i am hungry)/],
  ['happy', /^(mutluyum|cok mutluyum|sevincliyim|i'?m happy|i am happy|yasasin|yaay|yay)\b/],
  ['joke', /(fikra|saka yap|bir saka|komik bir sey|guldur beni|beni guldur|tell me a joke|joke|espri)/],
  ['riddle', /(bilmece|bilmeca|riddle|tahmin oyunu)/],
  ['fact', /(ilginc bilgi|ilginc bir sey|bilgi ver|fun fact|biliyor muydun|bir bilgi soyle)/],
  ['motivate', /(motive et|motivasyon|cesaret ver|moral ver|beni motive|motivate me)/],
  ['plan', /(ne calisayim|ne calismaliyim|nereden baslayayim|nereden baslamaliyim|bugun ne yapalim|ne yapalim|ne yapayim|ne yapmaliyim|calisma plani|plan yap|nasil calisayim|sinava nasil hazirlanayim|what should i study)/],
  ['progress', /(puanim kac|kac puanim|kac xp|xp'?m|seviyem|seviyem ne|ilerlemem|durumum ne|nasil gidiyorum|kac kelime ogrendim|serim kac)/],
  ['help', /(ne yapabilirsin|neler yapabilirsin|neler sorabilirim|ne sorabilirim|nasil kullanilir|yardim|help me|what can you do|ne ise yararsin|nasil calisiyorsun)/],
  ['favsport', /(en sevdigin spor|hangi sporu seviyorsun|spor yapar misin|favourite sport|favorite sport|do you like sports|do you play)/],
  ['swim', /(yuzme biliyor musun|yuzer misin|can you swim|do you like swimming)/],
  ['muffinlook', /(nasil gorunuyorsun|neye benziyorsun|gorunusun nasil|what do you look like|kendini tarif et|kendini anlat|describe yourself)/],
  ['muffinlike', /(nasil birisin|nasil bir kedisin|kisiligin nasil|what are you like)/],
  ['speakEn', /(ingilizce konusalim|ingilizce konus|ingilizce sohbet|ingilizce yazalim|ingilizce pratik|konusma pratigi|sohbet edelim|let'?s talk|let'?s chat|talk to me|speak english|let'?s speak|chat with me|english chat|pratik yapalim)/],
  ['speakTr', /(turkce biliyor musun|turkce konusabilir misin|can you speak turkish|do you speak turkish)/],
  ['time', /(saat kac|saat ne|what time is it|what'?s the time)/],
  ['date', /(bugun gunlerden ne|bugun ne gunu|hangi gundeyiz|bugunun tarihi|tarih ne|what day is it|what'?s the date|what is the date|ayin kaci)/],
  ['weather', /(hava nasil|hava durumu|weather|yagmur yagiyor mu|hava soguk mu)/],
  ['sing', /(sarki soyle|sarki sooyle|sing a song|sing|sarki)/],
  ['favfood', /(en sevdigin yemek|ne yemeyi seversin|favourite food|favorite food|ne yersin)/],
  ['favcolor', /(en sevdigin renk|favourite colou?r|favorite colou?r|hangi rengi seversin)/],
  ['whatdo', /^(ne yapiyorsun|napiyorsun|what are you doing|ne yapiyon|naptin|ne yaptin)$/],
  ['homework', /(odev|odevim|odevime|homework)/],
  ['examwhen', /(sinav ne zaman|sinavim ne zaman|yazili ne zaman|yazilim ne zaman|sinav kacta)/],
  ['story', /(hikaye anlat|hikaye|masal anlat|masal|tell me a story|story)/],
];

function intents(F) {
  const out = [];
  for (const [id, re] of INTENTS) if (re.test(F)) out.push(id);
  return out;
}

function greetLine(convo) {
  const h = new Date().getHours();
  const n = first();
  if (convo.greeted) return pick([`Yine merhaba ${n}! 😺`, `Selam tekrar ${n}!`, `Buradayım ${n}!`]);
  convo.greeted = true;
  if (h >= 5 && h < 11) return `Günaydın ${n}! ☀️`;
  if (h >= 18 && h < 23) return `İyi akşamlar ${n}! 🌙`;
  if (h >= 23 || h < 5) return `Merhaba ${n}! Bu saatte hâlâ ayaktasın, gece kuşu musun? 🦉`;
  return `Merhaba ${n}! 👋`;
}

// Başka bir cevabın önüne eklenen kısa selam (isim cevabın içinde zaten geçebilir)
function greetShort(convo) {
  convo.greeted = true;
  const h = new Date().getHours();
  if (h >= 5 && h < 11) return 'Günaydın! ☀️';
  if (h >= 18 && h < 23) return 'İyi akşamlar! 🌙';
  return pick(['Merhaba! 👋', 'Selam! 👋']);
}

const MAIN_CHIPS = () => shuffle(['generous ne demek?', 'Beni test et', 'İngilizce konuşalım', 'Bugün ne çalışayım?', 'look like ile be like farkı', 'Bana bir bilmece sor', 'karate play mi do mu?']).slice(0, 4);

function reply(id, F, raw, convo, isEn) {
  const n = first();
  switch (id) {
    case 'howareyou':
      convo.expect = 'mood';
      return isEn ? { say: [sayLine('fine')], text: 'Sen nasılsın? İngilizce cevap verebilirsin: *I\'m fine, thanks!*', mood: 'happy', chips: ["I'm fine, thanks!", 'İyiyim', 'Biraz yorgunum'] }
        : { text: pick([`Çok iyiyim ${n}, teşekkür ederim! Kitaplarımı düzenliyordum. 📚 Sen nasılsın?`, 'Harikayım! Bugün öğrenmeye çok hazırım. Ya sen, nasılsın?', `İyiyim, sorduğun için teşekkürler ${n}! Senin günün nasıl geçiyor?`]), say: [sayLine('fine')], mood: 'happy', chips: ['İyiyim', 'Biraz yorgunum', 'Sıkıldım'] };
    case 'whatdo':
      return { text: pick(['Seni bekliyordum! Bir yandan da sözlüğümdeki 288 kelimeyi tekrar ediyordum. 😺', 'Gözlüklerimi sildim, şimdi soru cevaplamaya hazırım!', 'Biraz kestiriyordum ama sen gelince uyandım! Ne çalışalım?']), mood: 'wink', chips: MAIN_CHIPS() };
    case 'imfine':
      // Tek başına "good", "fine" kelime sorusu da olabilir; hal hatır sorulmadıysa bilgi bankasına bırak
      if (convo.expect !== 'mood' && /^(fine|good|great|okay|super|harika|iyi|very well|not bad|so so)$/.test(F)) return null;
      convo.expect = null;
      return { say: [sayLine('glad')], text: isEn ? `Süper! Bu arada cevabın çok doğruydu: *I'm fine* = İyiyim. 👏\nHadi biraz çalışalım mı?` : 'Buna çok sevindim! O zaman biraz çalışmaya ne dersin?', mood: 'happy', chips: ['Bugün ne çalışayım?', 'Beni test et', 'İngilizce konuşalım'] };
    case 'imbad':
      if (convo.expect !== 'mood' && /^(bad|not good)$/.test(F)) return null;
      convo.expect = null;
      return { say: [sayLine('sorry')], text: `Buna üzüldüm ${n}. 🫂 Bazen böyle günler olur. İstersen bir şaka anlatayım, ya da kolay bir şeyle başlayalım. Kendini zorlama, ben buradayım.`, mood: 'sad', chips: ['Bana bir şaka anlat', 'Kolay bir soru sor', 'Beni motive et'] };
    case 'name':
      return { say: [sayLine('name')], text: 'Benim adım **Muffin**! Sen de bana İngilizce adını söyleyebilirsin: *My name is ...*', mood: 'happy', chips: [`My name is ${n.split(' ')[0]}.`, 'Sen kimsin?', 'Ne yapabilirsin?'] };
    case 'who':
      return { text: `Ben **Muffin**! Yuvarlak gözlüklü, İngilizceye bayılan turuncu bir kediyim. 🐱\nGerçek bir kedi değilim, ${n} için hazırlanmış bir çalışma arkadaşıyım. Ünite 1 ve 2'deki her şeyi biliyorum: kelimeler, kurallar, sınav soruları. İstersen seninle İngilizce de konuşurum!`, mood: 'wink', chips: ['Ne yapabilirsin?', 'İngilizce konuşalım', 'Beni test et'] };
    case 'age':
      return { say: [sayLine('age')], text: 'Kedi yılıyla epey büyüğüm! 😸 Sen kaç yaşındasın? İngilizce söyle: *I am 12 years old.*', mood: 'wink', chips: ['I am 12 years old.', 'I am 13 years old.'] };
    case 'where':
      return { say: [sayLine('from')], text: 'Bu senin İngilizce defterin, ben de onun içinde yaşıyorum! 📒', mood: 'happy', chips: ['Where are you from? ne demek?', 'İngilizce konuşalım'] };
    case 'myname': {
      const m = raw.match(/(?:benim adım|benim adim|benim ismim|my name is|my name's|call me)\s+([\p{L}]+(?:\s[\p{L}]+)?)/iu) || raw.match(/bana\s+([\p{L}]+)\s+de/iu);
      const given = m ? m[1].replace(/[.!?]+$/, '') : '';
      const cap = given ? given.charAt(0).toLocaleUpperCase('tr') + given.slice(1) : '';
      const same = cap && fold(n).includes(fold(cap));
      return { say: [sayLine('meet')], text: same ? `Seni tanıyorum ${n}! 😺 ${isEn ? 'Cümlen de çok doğru: *My name is ...* = Benim adım ...' : ''}` : `Tanıştığıma memnun oldum${cap ? `, ${cap}` : ''}! 😺 Adını değiştirmek istersen **Ayarlar**'dan yapabilirsin.`, links: same ? [] : [{ href: '#ayarlar', label: 'Ayarlar', icon: 'sliders' }], mood: 'happy', chips: ['How are you?', 'İngilizce konuşalım'] };
    }
    case 'myage': {
      const a = Number(F.match(/(\d{1,2})/)[1]);
      return { text: `${a} yaş, İngilizce öğrenmek için harika bir yaş! 🎂\nİngilizcesi: *I am ${numEn(a)} years old.* (yaşı **be** fiiliyle söyleriz, "I have 12 years" denmez!)`, mood: 'happy', chips: ['How old are you?', 'Beni test et'] };
    }
    case 'thanks':
      return { say: [sayLine('thanks')], text: pick([`Rica ederim ${n}! Her zaman buradayım. 😺`, 'Ne demek, ne zaman istersen!', 'Rica ederim! Başka merak ettiğin bir şey var mı?']), mood: 'happy', chips: MAIN_CHIPS() };
    case 'bye':
      return { say: [sayLine('bye')], text: pick([`Görüşürüz ${n}! Bugün çok iyi çalıştın. 👋`, 'Hoşça kal! Yarın da bekliyorum, serini bozma! 🔥', 'Bay bay! Ne zaman takılırsan buradayım.']), mood: 'happy' };
    case 'night':
      return { say: [sayLine('night')], text: `İyi geceler ${n}! Uyumadan önce 5 kelimeye bakmak hafızaya çok iyi gelir. 🌙`, mood: 'happy' };
    case 'sorry':
      return { text: 'Hiç önemli değil! 😺 İngilizcede de böyle deriz: *Never mind!* (Boş ver!)', mood: 'happy', chips: MAIN_CHIPS() };
    case 'love':
      return { say: [sayLine('love')], text: '💛 Hadi bu sevgiyi İngilizceye çevirelim: bugün bir konu bitirelim mi?', mood: 'happy', chips: ['Bugün ne çalışayım?', 'Beni test et'] };
    case 'praise':
      return { text: pick(['Aww, teşekkürler! 😻 Asıl sen harikasın!', 'Utandım şimdi! 😸 Sen de çok çalışkansın: *You are very hard-working!*', 'Teşekkür ederim! İngilizcede biri sana iltifat edince *Thank you, that\'s very kind of you!* diyebilirsin.']), mood: 'happy', chips: MAIN_CHIPS() };
    case 'insult':
      return { text: 'Hmm, bu biraz kırıcı oldu. 😿 Ama sorun değil, bazen sinir bozucu olabilir. Bir şeyi yanlış anladıysam söyle, birlikte düzeltelim. İngilizcede de nazik olmak önemli: *polite* (kibar) ↔ *rude* (kaba). 😉', mood: 'sad', chips: ['Ne yapabilirsin?', 'Bana bir şaka anlat'] };
    case 'laugh':
      return { text: pick(['Hahaha! 😹 Gülmek İngilizcede *laugh*, gülümsemek *smile*.', 'Gülmen beni de güldürdü! 😸 Komik biri İngilizcede *funny*.']), mood: 'happy', chips: ['Bana bir şaka anlat', 'Bana bir bilmece sor'] };
    case 'bored':
      return { say: [sayLine('bored')], text: 'Sıkıldıysan bir oyun yapalım: ya bir bilmece, ya bir şaka, ya da hızlı bir soru! 🎲\nBu arada "sıkıldım" İngilizcede *I am bored*. Sıkıcı bir şey ise *boring*.', mood: 'wink', chips: ['Bana bir bilmece sor', 'Bana bir şaka anlat', 'Beni test et'] };
    case 'tired':
      return { text: `Yorulduysan 5 dakika mola ver, su iç, sonra devam ederiz. 💧 Beyin de dinlenince daha iyi öğrenir!\n"Yoruldum" = *I am tired*. Yorucu bir şey = *tiring*.`, mood: 'happy', chips: ['Kolay bir soru sor', 'Beni motive et'] };
    case 'scared':
      return { text: `${n}, biraz heyecan normal, hatta iyi bir şey! 💛 Sınava hazırlanmanın en iyi yolu:\n• Her gün biraz çalış (15-20 dakika yeter)\n• Önce konu özetlerini oku\n• Deneme sınavı çöz, yanlışlarını düzelt\nSen bunu yapabilirsin, ben de hep yanındayım!`, links: [{ href: '#/ozet/1', label: 'Ünite 1 özeti', icon: 'note' }, { href: '#/ozet/2', label: 'Ünite 2 özeti', icon: 'note' }], mood: 'happy', chips: ['Bugün ne çalışayım?', 'Beni test et'] };
    case 'hungry':
      return { text: 'Ben de acıktım! 🐟 Bir şeyler atıştır, sonra devam ederiz.\n"Acıktım" = *I am hungry*. Susadım = *I am thirsty*.', mood: 'wink', chips: ['Beni test et'] };
    case 'happy':
      return { say: [sayLine('glad')], text: 'Mutlu olman beni de mutlu etti! 😸 Mutlu = *happy*, neşeli = *cheerful*.', mood: 'happy', chips: MAIN_CHIPS() };
    case 'joke': {
      const j = pick(JOKES.filter((x) => x.en !== convo.lastJoke)) || JOKES[0];
      convo.lastJoke = j.en;
      return { say: [sayRaw(j.en, '')], text: `😹 ${j.tr}`, mood: 'happy', chips: ['Bir şaka daha', 'Bana bir bilmece sor'] };
    }
    case 'riddle': {
      const r = pick(RIDDLES.filter((x) => x.en !== (convo.riddle && convo.riddle.en))) || RIDDLES[0];
      convo.riddle = r;
      convo.expect = 'riddle';
      return { say: [sayRaw(r.en, r.tr)], text: 'Cevabını yaz, İngilizce ya da Türkçe olabilir! 🤔', mood: 'think', chips: ['Cevabı söyle', 'İpucu ver'] };
    }
    case 'fact':
      return { text: `💡 Biliyor muydun?\n${pick(FACTS)}`, mood: 'wow', chips: ['Bir bilgi daha', 'Beni test et'] };
    case 'motivate':
      return { text: pick(MOTIVATE), mood: 'happy', chips: ['Bugün ne çalışayım?', 'Beni test et'] };
    case 'plan':
      return studyPlan();
    case 'progress':
      return progress();
    case 'help':
      return { text: 'Benimle şunları yapabilirsin:\n• **Kelime sor:** *generous* ne demek? *çalışkan* İngilizcesi ne?\n• **Konu sor:** look like ile be like farkı, sıklık zarfı nereye gelir?\n• **Cümle kontrolü:** İngilizce bir cümle yaz, hatası varsa düzelteyim.\n• **İngilizce sohbet:** "İngilizce konuşalım" de, sana sorular sorayım.\n• **Kendini dene:** "Beni test et" de.\n• **Mola:** şaka, bilmece, ilginç bilgi. 😺', mood: 'happy', chips: ['İngilizce konuşalım', 'Beni test et', 'Bana bir bilmece sor'] };
    case 'favsport':
      return { say: [sayLine('sport')], text: `Hem de **play table tennis** dediğime dikkat et: top olan sporlar *play* alır! 🏓 Peki senin en sevdiğin spor ne? İngilizce yaz: *My favourite sport is ...*`, mood: 'happy', chips: ['My favourite sport is volleyball.', 'İngilizce konuşalım'] };
    case 'swim':
      return { say: [sayLine('swim')], text: 'Sudan hiç hoşlanmam! 🙀 Ama yüzme için hangi fiil kullanılır biliyor musun? **go swimming**!', mood: 'sad', chips: ['swimming play mi go mu?', 'Beni test et'] };
    case 'muffinlook':
      return { say: [sayLine('look')], text: 'Gördün mü? **has got** ile tüy ve göz, **wear** ile gözlük, **is** ile boy anlattım. Şimdi sen kendini anlat! 😺', mood: 'wink', chips: ['İngilizce konuşalım', 'Görünüş nasıl anlatılır?'] };
    case 'muffinlike':
      return { say: [sayLine('like')], text: 'Kişilik için **What are you like?** diye sorulur, cevabında kişilik sıfatları gelir.', mood: 'wink', chips: ['look like ile be like farkı', 'İngilizce konuşalım'] };
    case 'speakEn': {
      convo.mode = 'en';
      convo.enScore = { ok: 0, total: 0 };
      const q = nextEnQuestion(convo);
      return { say: [sayLine('letsChat'), qLine(q)], text: 'Kısa cümleler yaz; hata yaparsan düzeltirim, doğruysa puan kazanırsın! Bitirmek için "sohbeti bitir" yazman yeterli.', mood: 'happy', chips: EN_CHIPS };
    }
    case 'speakTr':
      return { say: [sayLine('turkish')], text: 'Seninle hem Türkçe hem İngilizce konuşabilirim. İstersen İngilizce pratik yapalım!', mood: 'happy', chips: ['İngilizce konuşalım'] };
    case 'time': {
      const d = new Date();
      return { sayAfter: true, text: `Saat **${d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}** ⏰ İngilizcesi:`, say: [sayRaw(timeEn(d), '')], mood: 'wink', chips: ['Bugün günlerden ne?'] };
    }
    case 'date': {
      const d = new Date();
      const [en, tr] = DAYS[d.getDay()];
      return { sayAfter: true, text: `Bugün **${d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })}** 📅\nİngilizcede günler büyük harfle yazılır: *${en}* = ${tr}.`, say: [sayRaw(`Today is ${en}, the ${d.getDate()}${[, 'st', 'nd', 'rd'][d.getDate() % 10 > 3 || Math.floor(d.getDate() / 10) === 1 ? 0 : d.getDate() % 10] || 'th'} of ${MONTHS[d.getMonth()]}.`, '')], mood: 'happy', chips: ['How often do you play tennis? ne demek?'] };
    }
    case 'weather':
      return { text: 'Pencereden dışarıyı göremiyorum, defterin içindeyim! 😹 Ama hava durumu kelimeleri: *sunny* (güneşli), *rainy* (yağmurlu), *cold* (soğuk), *hot* (sıcak).\nHavaya göre spor: güneşliyse *go cycling*, yağmurluysa *play chess*! ♟️', mood: 'wink', chips: ['Beni test et'] };
    case 'sing':
      return { text: '🎵 Play, do, go, now you know!\n🎵 **Play** with a ball, **do** karate in the hall,\n🎵 **Go** swimming in the sea, that is easy for me!\n\nBu şarkı play/do/go kuralını hatırlatır. 😸', mood: 'happy', chips: ['play do go kuralı', 'Beni test et'] };
    case 'homework':
      return { text: `Ödevine yardım edebilirim ${n}! 📒 Ama cevabı doğrudan vermek yerine birlikte bulalım:\n• Bilmediğin kelimeyi sor: *generous ne demek?*\n• Kuralı sor: *karşılaştırma nasıl yapılır?*\n• Yazdığın cümleyi kontrol ettir: *bu cümle doğru mu: She play tennis*`, mood: 'happy', chips: ['Karşılaştırma nasıl yapılır?', 'Bir cümle kontrol et'] };
    case 'examwhen':
      return { text: 'Sınav tarihini ben bilemiyorum, öğretmenin söyler. 😺 Ama hazırlık için en iyi zaman şimdi! Konu özetleri ve deneme sınavlarıyla başlayabilirsin.', links: [{ href: '#/sinav', label: 'Deneme sınavı', icon: 'exam' }], mood: 'wink', chips: ['Bugün ne çalışayım?'] };
    case 'story': {
      const st = pick(STORIES.filter((x) => x.en[0] !== convo.lastStory)) || STORIES[0];
      convo.lastStory = st.en[0];
      return { title: st.title, say: st.en.map((en, k) => sayRaw(en, st.tr[k])), text: st.q, mood: 'happy', chips: ['Bir hikaye daha', 'Beni test et'] };
    }
    case 'favfood':
      return { text: 'Balık! 🐟 Tabii ki. İngilizcede *My favourite food is fish.* derim. Seninki ne?', mood: 'happy', chips: ['İngilizce konuşalım'] };
    case 'favcolor':
      return { text: 'Turuncu, tıpkı tüylerim gibi! 🧡 *My favourite colour is orange.* İngiliz yazımında **colour**, Amerikan yazımında **color**.', mood: 'happy', chips: ['İngilizce konuşalım'] };
    default:
      return null;
  }
}

function contextual(F, convo) {
  // Bilmece cevabı
  if (convo.expect === 'riddle' && convo.riddle) {
    const r = convo.riddle;
    if (/^(cevabi soyle|cevap ne|cevabi ne|cevabi|bilemedim|bilmiyorum|pes|pes ediyorum|soyle|i give up|tell me|tell me the answer|answer|the answer)$/.test(F)) {
      convo.expect = null;
      return { text: `💡 ${r.ans}`, mood: 'happy', chips: ['Bir bilmece daha', 'Bana bir şaka anlat'] };
    }
    if (/^(ipucu|ipucu ver|hint)/.test(F)) return { text: `İpucu: cevap **${r.a[0].length}** harfli bir İngilizce kelime ve **${r.a[0][0].toUpperCase()}** harfiyle başlıyor. 😉`, mood: 'wink', chips: ['Cevabı söyle'] };
    const words = F.split(' ');
    if (r.a.some((x) => words.includes(x) || F === x || F === `a ${x}` || F === `an ${x}` || words.some((w) => w.length > 3 && lev(w, x) <= 1))) {
      convo.expect = null;
      return { text: `🎉 Bildin! ${r.ans}`, xp: 5, mood: 'happy', chips: ['Bir bilmece daha', 'Beni test et'] };
    }
    if (F.split(' ').length <= 3 && !KNOWLEDGE.test(F) && !intents(F).length && !/^(evet|hayir|tamam|ok)$/.test(F)) return { text: 'Olmadı, tekrar dene! 🤔', mood: 'think', chips: ['İpucu ver', 'Cevabı söyle'] };
    convo.expect = null;
  }
  if (/^(bir saka daha|baska saka|another joke|one more joke)$/.test(F)) return reply('joke', F, F, convo, false);
  if (/^(bir bilmece daha|baska bilmece|another riddle)$/.test(F)) return reply('riddle', F, F, convo, false);
  if (/^(bir bilgi daha|baska bilgi)$/.test(F)) return reply('fact', F, F, convo, false);
  if (/^(bir hikaye daha|baska hikaye|another story)$/.test(F)) return reply('story', F, F, convo, false);
  if (/^(bir cumle kontrol et|bir cumle daha kontrol et|cumle kontrol et)$/.test(F)) return { text: 'Kontrol etmemi istediğin İngilizce cümleyi yaz, hemen bakayım! ✍️\nÖrnek: *She have got blue eyes.*', mood: 'happy' };

  // Anlamadım: son konuyu daha basit anlat
  if (/^(anlamadim|anlayamadim|anlamiyorum|tam anlamadim|hic anlamadim|kafam karisti|nasil yani|ne demek istiyorsun|daha basit anlat|daha basit|basitce anlat|tekrar anlat|bir daha anlat|i don'?t understand|what do you mean)$/.test(F)) {
    if (convo.lastWord) {
      const w = convo.lastWord;
      return { text: `Daha basit anlatayım: **${w.en}** = ${w.tr}.\nÖrnekte nasıl kullanıldığına bak, cümleyi sesli dinle:`, examples: [{ t: 'ex', en: w.ex, tr: w.exTr, say: `s-${w.id}` }], mood: 'happy', chips: [`${w.en} ile başka örnek`, 'Beni test et'] };
    }
    if (convo.lastFaq) return { simplify: convo.lastFaq };
    return { text: 'Hangi kısmı anlamadın? Bir kelimeyi ya da konuyu yazarsan baştan, adım adım anlatırım. 😺', mood: 'think', chips: ['look like ile be like farkı', 'Karşılaştırma nasıl yapılır?', 'play do go kuralı'] };
  }
  // Bir örnek daha
  if (/^(bir ornek daha|baska ornek|baska bir ornek|daha fazla ornek|ornek ver|bir ornek ver|ornek|baska|another example|more examples|example|devam et)$/.test(F)) {
    if (convo.lastWord) return { forward: `${convo.lastWord.en} örnek cümle` };
    if (convo.lastFaq) return { examplesFor: convo.lastFaq };
    return { text: 'Hangi kelime ya da konu için örnek istersin? Mesela: *generous örnek cümle*', chips: ['friendly örnek cümle', 'swimming örnek cümle'] };
  }
  // Bir soru daha
  if (/^(bir soru daha|bir tane daha|baska soru|baska bir soru|yeni soru|devam|tekrar|one more|another one|next|again|kolay bir soru sor|bir soru sor|soru sor)$/.test(F)) return { forward: 'Beni test et' };
  // Zıttı / okunuşu son kelime için
  if (convo.lastWord && /^(zitti ne|zitti|tersi ne|tersi|zit anlamlisi)$/.test(F)) return { forward: `${convo.lastWord.en} zıttı ne` };
  if (convo.lastWord && /^(karsilastirma hali|daha hali|comparative)$/.test(F)) return { forward: `${convo.lastWord.en} karşılaştırma hali` };
  if (convo.lastWord && /^(okunusu|nasil okunur|nasil okunuyor|telaffuzu)$/.test(F)) {
    const w = convo.lastWord;
    return { text: `**${w.en}** şöyle okunur: /${w.say}/\nAşağıdaki hoparlöre dokunup dinle, sonra sen de tekrar et! 🔊`, word: w, mood: 'happy' };
  }
  // Evet / hayır / tamam
  if (/^(evet|evt|yes|yep|yeah|olur|tabii|tabiki|tabii ki|elbette|tamam|tamamdir|ok|okay|okey|peki|hadi|hadi bakalim|let'?s go|sure|of course)$/.test(F)) {
    convo.expect = null;
    return { text: pick(['Süper! 😺 Ne yapalım?', 'Harika! Hadi başlayalım. Bir seçim yap:', 'Tamamdır! Neyle devam edelim?']), mood: 'happy', chips: ['Beni test et', 'İngilizce konuşalım', 'Bugün ne çalışayım?', 'Bana bir bilmece sor'] };
  }
  if (/^(hayir|hayır|yok|no|nope|istemiyorum|sonra|simdi degil|gerek yok|not now)$/.test(F)) {
    convo.expect = null;
    return { text: 'Tamam, sorun değil! Ne zaman istersen buradayım. Aklına bir soru gelirse yazman yeterli. 😺', mood: 'happy', chips: MAIN_CHIPS() };
  }
  if (/^(hmm+|hm+|mm+|uhm|ee+|sey|bilmem|bilmiyorum|emin degilim|i don'?t know)$/.test(F)) {
    return { text: 'Düşünmekte sorun yok! 🤔 İstersen ben bir öneride bulunayım:', mood: 'think', chips: ['Bugün ne çalışayım?', 'Beni test et', 'Bana bir bilmece sor'] };
  }
  return null;
}

/* ---------- Ana fonksiyon ---------- */

// Cevap ya da yönlendirme döner; null ise bilgi bankası cevaplar.
// Dönüş: cevap nesnesi | { forward: 'metin', prefix: 'Merhaba!' } | { simplify: faqId } | { examplesFor: faqId }
export function chatTurn(rawText, convo) {
  const raw = String(rawText || '').trim();
  if (!raw) return null;
  const F0 = squash(fold(raw));
  if (!F0) {
    // Yalnızca emoji ya da noktalama
    if (/\p{Extended_Pictographic}/u.test(raw)) return { text: pick(['😺 Ben de sana bir emoji gönderiyorum: 🐱📚', 'Emojini aldım! 😸 Bir şey sormak istersen buradayım.']), mood: 'happy', chips: MAIN_CHIPS() };
    return null;
  }

  if (convo.mode === 'en') {
    const english = looksEnglish(raw, (x) => !!lookupToken(x) || !!findWord(x)) || /^(yes|no|yeah|nope)\b/.test(F0);
    const special = EXIT_EN.test(F0) || HELP_EN.test(F0) || SKIP_EN.test(F0) || /^(ingilizce sohbete don|sohbete don|devam edelim|continue)$/.test(F0);
    // Türkçe bir soru ya da istek: normal cevap ver, sohbet modu açık kalsın
    const other = !english && !special && (KNOWLEDGE.test(F0) || intents(F0).filter((x) => x !== 'speakEn').length || /\d/.test(F0));
    if (!other) return enModeTurn(raw, F0, convo);
    const res = normalTurn(raw, F0, convo);
    if (!res) return { forward: raw, keepEn: true };
    res.keepEn = true;
    return res;
  }
  return normalTurn(raw, F0, convo);
}

function normalTurn(raw, F0, convo) {
  if (/^(muffin|muffincim|muffin\?)$/.test(F0)) return { text: pick(['Efendim? 😺 Buradayım!', 'Miyav! Buradayım, söyle bakalım. 🐱']), mood: 'happy', chips: MAIN_CHIPS() };
  // "Do you like football?" gibi Muffin'e İngilizce sorulan sorular
  const dl = F0.match(/^do you (like|love|enjoy|play|do|go) (.+?)( muffin)?$/);
  if (dl) {
    const sp = WORDS.filter((w) => w.verb).sort((a, b) => b.en.length - a.en.length).find((w) => dl[2].includes(w.en.toLowerCase()));
    if (sp && sp.en === 'swimming') return reply('swim', F0, raw, convo, true);
    if (sp) {
      const danger = /boxing|wrestling|ice hockey|paragliding|rafting|scuba|snowboarding|mountain/.test(sp.en);
      const en = danger ? `No, I don't. I think ${sp.en} is too dangerous for a cat!` : `Yes, I do! I love ${sp.en === 'chess' ? 'playing chess' : sp.verb === 'go' ? sp.en : `${sp.verb === 'play' ? 'playing' : 'doing'} ${sp.en}`}. It is fun!`;
      return { say: [sayRaw(en, danger ? `Hayır. Bence ${sp.en} bir kedi için fazla tehlikeli!` : `Evet! ${sp.en} çok eğlenceli, bayılırım!`)], text: `Peki ya sen? İngilizce cevap ver: *Yes, I do.* ya da *No, I don't.* 😺`, mood: danger ? 'wow' : 'happy', chips: ['Yes, I do.', "No, I don't.", 'İngilizce konuşalım'] };
    }
  }
  // Basit matematik
  const mm = /\d/.test(F0) && math(raw.toLowerCase());
  if (mm) return mm;

  // Bağlama göre kısa cevaplar
  const c = contextual(F0, convo);
  if (c) return c;

  // Başta selam ya da hitap varsa ayır: "merhaba muffin, generous ne demek?"
  let F = F0;
  let greeted = false;
  for (let k = 0; k < 3; k++) {
    const g = F.match(GREET);
    const a = F.match(ADDRESS);
    if (g) { greeted = true; F = F.slice(g[0].length).trim(); continue; }
    if (a && (greeted || F.split(' ').length > 1)) { F = F.slice(a[0].length).trim(); continue; }
    break;
  }
  const rawRest = greeted ? raw.replace(/^[^,!?.]*?(merhaba(lar)?|selam(lar)?|hello|hi|hey|günaydın|gunaydin|iyi akşamlar|good morning)[\s,!.]*(muffin[\s,!.]*)?/i, '').trim() : raw;
  const isEn = looksEnglish(raw, (x) => !!lookupToken(x) || !!findWord(x)) || /^(hello|hi|hey|good morning|good evening|good night|thanks|thank you|bye|goodbye)\b/.test(F0);

  if (!F) {
    if (/^muffin$/.test(F0)) return { text: 'Efendim? 😺 Buradayım!', mood: 'happy', chips: MAIN_CHIPS() };
    const line = greetLine(convo);
    convo.expect = 'mood';
    const en = /^(hello|hi|hey|hiya|good morning|good evening|good afternoon|morning)\b/.test(F0);
    return { sayAfter: true, text: `${line} ${en ? '' : 'Bugün nasılsın?'}`.trim(), say: en ? [sayLine(/morning/.test(F0) ? 'morning' : /evening/.test(F0) ? 'evening' : 'hiThere')] : [], mood: 'happy', chips: en ? ["I'm fine, thanks!", "I'm great!", 'İngilizce konuşalım'] : ['İyiyim', 'Biraz yorgunum', 'Ne yapabilirsin?', 'Beni test et'] };
  }

  // Kalıp anlamı: "how are you ne demek", "nasılsın İngilizce nasıl denir"
  const pm = F.match(/^(.+?)\s+(?:ne demek(?:tir)?|nedir|ne anlama gelir|anlami ne|turkcesi(?: ne)?)$/) || F.match(/^what does (.+?) mean$/);
  if (pm) {
    const p = phraseMeaning(pm[1]);
    if (p) return { text: `${greeted ? `${greetShort(convo)}\n` : ''}**${p.en}** = ${p.tr}`, say: [sayRaw(p.en, p.tr)], mood: 'happy', chips: MAIN_CHIPS() };
  }
  const pe = F.match(/^(.+?)\s+(?:ingilizcesi(?: ne(?:dir)?)?|ingilizce(?:de)? nasil (?:denir|soylenir)|ingilizce ne demek|in english)$/);
  if (pe) {
    const p = phraseEnglish(pe[1]);
    if (p) return { sayAfter: true, text: `${greeted ? `${greetShort(convo)}\n` : ''}"${p.tr}" İngilizcede:`, say: [sayRaw(p.en, p.tr)], mood: 'happy', chips: MAIN_CHIPS() };
  }

  // Cümle kontrolü isteği
  const ck = rawRest.match(/^(?:bu cümle doğru mu|bu cumle dogru mu|doğru mu|dogru mu|kontrol et|düzelt|duzelt|is this correct|is it correct|check)\s*[:\-]?\s*(.+)$/i) || rawRest.match(/^(.+?)\s*[,:\-]?\s*(?:doğru mu|dogru mu|yanlış mı|yanlis mi|doğru yazmış mıyım|dogru yazmis miyim|is this correct)\??$/i);
  if (ck) {
    const sent = ck[1].replace(/^["“']|["”']$/g, '').trim();
    if (looksEnglish(sent, (x) => !!lookupToken(x) || !!findWord(x)) || sent.split(' ').length >= 2) {
      const r = checkSentence(sent);
      if (r.ok) return { sayAfter: true, text: `✅ Bu cümle doğru! Aferin ${first()}. 👏`, say: [sayRaw(r.fixed, '')], xp: 3, mood: 'happy', chips: ['İngilizce konuşalım', 'Beni test et'] };
      return { fix: { original: sent, ...r }, text: 'Küçük bir düzeltme yapalım:', mood: 'wink', chips: ['Bir cümle daha kontrol et', 'İngilizce konuşalım'] };
    }
  }

  // Niyetler
  const found = intents(F).filter((id) => !(KNOWLEDGE.test(F) && !['plan', 'help', 'progress', 'scared', 'motivate'].includes(id)));
  if (found.length) {
    // Önce en anlamlı niyet; "merhaba nasılsın" gibi birleşimler tek cevapta
    const order = ['speakEn', 'homework', 'examwhen', 'story', 'plan', 'progress', 'help', 'scared', 'imbad', 'joke', 'riddle', 'fact', 'motivate', 'myname', 'myage', 'name', 'who', 'age', 'where', 'muffinlook', 'muffinlike', 'favsport', 'swim', 'favfood', 'favcolor', 'speakTr', 'time', 'date', 'weather', 'sing', 'howareyou', 'whatdo', 'imfine', 'happy', 'bored', 'tired', 'hungry', 'love', 'praise', 'insult', 'sorry', 'thanks', 'night', 'bye', 'laugh'];
    found.sort((a, b) => order.indexOf(a) - order.indexOf(b));
    for (const id of found) {
      const r = reply(id, F, raw, convo, isEn);
      if (!r) continue;
      if (greeted && id !== 'bye') r.text = `${greetShort(convo)} ${r.text || ''}`.trim();
      return r;
    }
  }

  // İngilizce cümle yazdıysa: düzelt ya da öv
  if (isEn && !KNOWLEDGE.test(F) && !/\?$/.test(raw.trim())) {
    const r = checkSentence(rawRest || raw);
    if (!r.ok) return { fix: { original: rawRest || raw, ...r }, text: `${greeted ? `${greetShort(convo)} ` : ''}Cümlende küçük bir hata var, birlikte düzeltelim:`, mood: 'wink', chips: ['İngilizce konuşalım', 'Bir cümle daha kontrol et'] };
    const rx = react(rawRest || raw);
    return { forward: rawRest || raw, prefix: `${greeted ? `${greetShort(convo)} ` : ''}✅ Cümlen doğru, aferin!`, say: [rx], chips: ['İngilizce konuşalım', 'Beni test et'] };
  }

  // İngilizce soru (Muffin'e soruluyorsa) ve tanınmadıysa: konuşma moduna davet
  if (isEn && /\?$/.test(raw.trim()) && /\b(you|your)\b/i.test(raw) && !KNOWLEDGE.test(F)) {
    return { text: `${greeted ? `${greetShort(convo)} ` : ''}Bana İngilizce soru sorman harika! 😻 Bu soruyu tam anlayamadım ama İngilizce sohbet edebiliriz. Ben sorayım, sen cevapla!`, mood: 'wink', chips: ['İngilizce konuşalım', "What's your name?", 'How old are you?'] };
  }

  // Klavye karmaşası
  const toks = F.split(' ');
  if (toks.length <= 2 && toks.every((t) => t.length >= 4 && !/[aeiou]/.test(t))) return { text: 'Klavyenin üstüne kedi mi bastı? 😹 Ben değildim, yemin ederim!', mood: 'wink', chips: MAIN_CHIPS() };

  if (greeted) return { forward: rawRest || F, prefix: greetShort(convo) };
  return null;
}
