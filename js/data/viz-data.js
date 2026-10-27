// Görsel anlatım bloklarının verileri. Buradaki sabit İngilizce cümleler seslendirilir (voiceLines).

// Kişilik kartları: davranıştan kişiliği bul
export const MOODS = [
  { adj: 'generous', e: '🎁', en: 'He always shares his snacks with his friends.', tr: 'Atıştırmalıklarını hep arkadaşlarıyla paylaşır.', opp: 'selfish' },
  { adj: 'hard-working', e: '📚', en: 'She studies for two hours every day.', tr: 'Her gün iki saat ders çalışır.', opp: 'lazy' },
  { adj: 'shy', e: '😳', en: "He doesn't talk much with new people.", tr: 'Yeni insanlarla pek konuşmaz.', opp: 'outgoing' },
  { adj: 'funny', e: '😂', en: 'She tells jokes and makes everyone laugh.', tr: 'Şaka yapar ve herkesi güldürür.', opp: 'serious' },
  { adj: 'honest', e: '🤞', en: 'He never tells lies.', tr: 'Asla yalan söylemez.', opp: 'dishonest' },
  { adj: 'helpful', e: '🤝', en: 'She always helps her classmates.', tr: 'Sınıf arkadaşlarına hep yardım eder.', opp: 'unhelpful' },
  { adj: 'lazy', e: '😴', en: 'He sleeps all day and never does his homework.', tr: 'Bütün gün uyur ve ödevini hiç yapmaz.', opp: 'hard-working' },
  { adj: 'talkative', e: '🗣️', en: 'She talks all the time, even in class!', tr: 'Hep konuşur, derste bile!', opp: 'quiet' },
  { adj: 'patient', e: '⏳', en: 'He waits calmly and never gets angry.', tr: 'Sakince bekler ve hiç sinirlenmez.', opp: 'impatient' },
  { adj: 'tidy', e: '🧺', en: 'Her room is always clean and neat.', tr: 'Odası her zaman temiz ve düzenli.', opp: 'messy' },
  { adj: 'rude', e: '😛', en: 'He never says please or thank you.', tr: 'Asla lütfen ya da teşekkürler demez.', opp: 'polite' },
  { adj: 'brave', e: '🦁', en: 'She is not afraid of the dark.', tr: 'Karanlıktan korkmaz.', opp: '' },
];

// Dört soru kalıbı
export const QUAD = [
  { e: '👀', q: 'What does she look like?', tr: 'Dış görünüşü nasıl?', a: 'She is tall. She has got long curly hair.', tag: 'Görünüş', c: '#8a6fd1' },
  { e: '💭', q: 'What is she like?', tr: 'Nasıl biri? (kişilik)', a: 'She is kind and funny.', tag: 'Kişilik', c: '#ff7a9c' },
  { e: '👯', q: 'Who does she look like?', tr: 'Kime benziyor?', a: 'She looks like her mother.', tag: 'Benzerlik', c: '#3f9a85' },
  { e: '😊', q: 'How does she look today?', tr: 'Bugün nasıl görünüyor?', a: 'She looks happy today.', tag: 'Şu anki hali', c: '#f7a54a' },
];

// look like / be like aile görseli
export const FAMILY = {
  look: { en: 'Elif looks like her mother.', tr: 'Elif annesine benziyor (dış görünüş).' },
  like: { en: 'Can is like his father. They are both funny.', tr: 'Can babası gibi (kişilik). İkisi de komik.' },
};

// Paragraf planı
export const PARA_PLAN = [
  { e: '👋', t: 'Tanıtım', c: '#8a6fd1', en: "My best friend's name is Defne. She is twelve years old.", tr: 'En iyi arkadaşımın adı Defne. On iki yaşında.' },
  { e: '👀', t: 'Görünüş', c: '#4f9de6', en: 'She is tall and slim. She has got long curly black hair.', tr: 'Uzun boylu ve ince. Uzun kıvırcık siyah saçları var.' },
  { e: '💖', t: 'Kişilik', c: '#ff7a9c', en: 'She is kind and helpful. She always helps me with my homework.', tr: 'Nazik ve yardımsever. Ödevlerimde bana hep yardım eder.' },
  { e: '⚖️', t: 'Karşılaştırma', c: '#f7a54a', en: 'She is taller than me, but I am more talkative than her.', tr: 'Benden daha uzun ama ben ondan daha konuşkanım.' },
  { e: '🌟', t: 'Bitiş', c: '#2fb27a', en: 'I love her because she is a great friend.', tr: 'Onu seviyorum çünkü harika bir arkadaş.' },
];

// Günlük rutin makinesi: I / She, olumlu / olumsuz / soru
export const ROUTINE = [
  { e: '⏰', time: '7:00', i: 'get up', he: 'gets up', heBase: 'get up', you: 'get up', end: 's' },
  { e: '🍳', time: '7:30', i: 'have breakfast', he: 'has breakfast', heBase: 'have breakfast', you: 'have breakfast', end: 'has' },
  { e: '🏫', time: '8:00', i: 'go to school', he: 'goes to school', heBase: 'go to school', you: 'go to school', end: 'es' },
  { e: '🏐', time: '16:00', i: 'play volleyball', he: 'plays volleyball', heBase: 'play volleyball', you: 'play volleyball', end: 's' },
  { e: '📚', time: '18:00', i: 'do my homework', he: 'does her homework', heBase: 'do her homework', you: 'do your homework', end: 'es' },
  { e: '📖', time: '19:00', i: 'study English', he: 'studies English', heBase: 'study English', you: 'study English', end: 'ies' },
  { e: '📺', time: '20:00', i: 'watch TV', he: 'watches TV', heBase: 'watch TV', you: 'watch TV', end: 'es' },
];

// Haftalık sıklık takvimi
export const WEEK = [
  { w: 'always', days: 7, pct: 100, en: 'I always brush my teeth.', tr: 'Dişlerimi her zaman fırçalarım.' },
  { w: 'usually', days: 6, pct: 90, en: 'I usually walk to school.', tr: 'Okula genellikle yürürüm.' },
  { w: 'often', days: 4, pct: 70, en: 'I often play volleyball.', tr: 'Sık sık voleybol oynarım.' },
  { w: 'sometimes', days: 3, pct: 50, en: 'I sometimes go swimming.', tr: 'Bazen yüzmeye giderim.' },
  { w: 'rarely', days: 1, pct: 10, en: 'I rarely watch football.', tr: 'Nadiren futbol izlerim.' },
  { w: 'never', days: 0, pct: 0, en: 'I never go skiing.', tr: 'Asla kayak yapmaya gitmem.' },
];
export const WEEK_TIMES = [
  { w: 'every day', days: 7, en: 'I play basketball every day.', tr: 'Her gün basketbol oynarım.' },
  { w: 'three times a week', days: 3, en: 'She does yoga three times a week.', tr: 'Haftada üç kez yoga yapar.' },
  { w: 'twice a week', days: 2, en: 'We go swimming twice a week.', tr: 'Haftada iki kez yüzmeye gideriz.' },
  { w: 'once a week', days: 1, en: 'He plays chess once a week.', tr: 'Haftada bir kez satranç oynar.' },
];

// Sevgi ölçeği
export const LOVE = [
  { w: 'love', e: '😍', tr: 'bayılırım', c: '#ff5c8a' },
  { w: 'like', e: '🙂', tr: 'severim', c: '#ff9f5a' },
  { w: "don't mind", e: '😐', tr: 'fark etmez', c: '#e8b923' },
  { w: "don't like", e: '🙁', tr: 'sevmem', c: '#7fa7d9' },
  { w: 'hate', e: '😖', tr: 'nefret ederim', c: '#8a6fd1' },
  { w: "can't stand", e: '😤', tr: 'katlanamam', c: '#5b5f86' },
];
export const LOVE_SPORTS = [
  { e: '⚽', ing: 'playing football' },
  { e: '🏊', ing: 'swimming' },
  { e: '🥋', ing: 'doing karate' },
  { e: '♟️', ing: 'playing chess' },
  { e: '🚴', ing: 'cycling' },
  { e: '🧘', ing: 'doing yoga' },
];

// Spor yerleri ve malzemeleri
export const PLACES = [
  { e: '🎾', sport: 'tennis', place: 'court', kit: [['🎾', 'racket'], ['🟡', 'ball']], en: 'We play tennis on a court with a racket.', tr: 'Tenisi kortta raketle oynarız.' },
  { e: '⚽', sport: 'football', place: 'pitch', kit: [['⚽', 'ball'], ['👟', 'trainers']], en: 'We play football on a pitch.', tr: 'Futbolu sahada oynarız.' },
  { e: '🏊', sport: 'swimming', place: 'swimming pool', kit: [['🥽', 'goggles'], ['🩱', 'swimsuit']], en: 'We go swimming in a swimming pool.', tr: 'Yüzmeye havuza gideriz.' },
  { e: '🥊', sport: 'boxing', place: 'ring', kit: [['🥊', 'gloves'], ['⛑️', 'helmet']], en: 'Boxers wear gloves in the ring.', tr: 'Boksörler ringde eldiven giyer.' },
  { e: '⛸️', sport: 'ice skating', place: 'rink', kit: [['⛸️', 'skates'], ['🧤', 'gloves']], en: 'We go ice skating at the rink.', tr: 'Buz pistinde paten kaymaya gideriz.' },
  { e: '⛷️', sport: 'skiing', place: 'slope', kit: [['🎿', 'skis'], ['🥽', 'goggles']], en: 'We go skiing on a snowy slope.', tr: 'Karlı bir yamaçta kayak yapmaya gideriz.' },
  { e: '🏃', sport: 'running', place: 'track', kit: [['👟', 'trainers'], ['🧥', 'tracksuit']], en: 'Athletes run on a track.', tr: 'Atletler pistte koşar.' },
  { e: '⛳', sport: 'golf', place: 'course', kit: [['🏌️', 'golf club'], ['⚪', 'ball']], en: 'People play golf on a golf course.', tr: 'İnsanlar golfü golf sahasında oynar.' },
];

// win mi beat mi
export const WINBEAT = [
  { gap: 'Our team ___ the match.', a: 'won', other: 'beat', en: 'Our team won the match.', why: 'Maç, kupa, yarış, madalya kazanılır: **win**.' },
  { gap: 'Our team ___ the other team.', a: 'beat', other: 'won', en: 'Our team beat the other team.', why: 'Rakip yenilir: **beat** + takım ya da kişi.' },
  { gap: 'She ___ a gold medal.', a: 'won', other: 'beat', en: 'She won a gold medal.', why: 'Madalya kazanılır: **win**.' },
  { gap: 'Can ___ his brother at chess.', a: 'beat', other: 'won', en: 'Can beat his brother at chess.', why: 'Birini yenmek: **beat** + kişi.' },
];

// Görsel bloklardaki bütün sabit İngilizce cümleler (seslendirme için)
export function vizLines() {
  return [
    ...MOODS.map((m) => m.en),
    ...QUAD.flatMap((q) => [q.q, q.a]),
    FAMILY.look.en, FAMILY.like.en,
    ...PARA_PLAN.map((p) => p.en),
    ...WEEK.map((w) => w.en), ...WEEK_TIMES.map((w) => w.en),
    ...PLACES.map((p) => p.en),
    ...WINBEAT.map((w) => w.en),
  ];
}
