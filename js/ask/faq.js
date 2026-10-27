// Muffin'in bilgi bankası: konu soruları ve cevapları (ders bloklarıyla aynı biçimde)
// keys: aramada eşleşecek ifadeler (Türkçe karakterler sadeleştirilmiş, küçük harf)

export const FAQ = [
  {
    id: 'looklike', lesson: 'u1-looklike', title: 'look like ve be like farkı',
    keys: ['look like', 'be like', 'is like', 'what is she like', 'what is he like', 'what does she look like', 'what does he look like', 'look like be like', 'nasil biri', 'nasil gorunuyor', 'gorunus kisilik fark'],
    blocks: [
      { t: 'table', head: ['Soru', 'Neyi sorar?', 'Örnek cevap'], rows: [['What does she look like?', 'Dış görünüş', 'She is tall. She has got curly hair.'], ['What is she like?', 'Kişilik', 'She is friendly and kind.'], ['Who does she look like?', 'Kime benziyor?', 'She looks like her mother.']] },
      { t: 'tip', text: '*look like* sorusunun cevabında **boy, vücut, saç, göz** olur. *be like* sorusunun cevabında **kişilik sıfatları** olur.' },
      { t: 'right', ok: 'What does he look like?', bad: 'What does he looks like?', why: '"does" sonrası fiil yalın kalır.' },
    ],
  },
  {
    id: 'whodoes', lesson: 'u1-looklike', title: 'Kime benziyorsun?',
    keys: ['benzemek', 'benziyor', 'kime benz', 'who do you look like', 'who does', 'resemble', 'looks like'],
    blocks: [
      { t: 'p', text: '*look like* + kişi = **görünüşçe birine benzemek**.' },
      { t: 'ex', en: 'I look like my mother.', tr: 'Anneme benziyorum.' },
      { t: 'ex', en: 'Who does Ali look like? He looks like his grandfather.', tr: 'Ali kime benziyor? Dedesine benziyor.' },
      { t: 'tip', text: 'He / she ile *looks like* olur. Soruda *does* varsa fiil yalın kalır: ==Who does she look like?==' },
    ],
  },
  {
    id: 'howis', lesson: 'u1-looklike', title: 'How is she? ne demek?',
    keys: ['how is', 'how is she', 'how is he', 'how are', 'hatir sor'],
    blocks: [
      { t: 'p', text: '==How is she?== kişiliği değil **hatırını** sorar: "Nasıl, iyi mi?"' },
      { t: 'ex', en: "How is your grandmother? She's fine, thanks.", tr: 'Büyükannen nasıl? İyi, teşekkürler.' },
      { t: 'warn', text: 'Kişilik sorusu *How is she like?* değil, ==What is she like?== olur.' },
    ],
  },
  {
    id: 'hasgot', lesson: 'u1-look', title: 'have got / has got',
    keys: ['has got', 'have got', 'hasnt got', 'havent got', 'has mi have mi', 'have mi has mi', 'sahip olmak', 'got ne demek'],
    blocks: [
      { t: 'p', text: '*have got / has got* = **sahip olmak, -si var**. Saç, göz, sakal, çil gibi özellikler için kullanırız.' },
      { t: 'table', head: ['', 'Olumlu', 'Olumsuz', 'Soru'], rows: [['I / You / We / They', 'have got', "haven't got", 'Have you got...?'], ['He / She / It', 'has got', "hasn't got", 'Has she got...?']] },
      { t: 'ex', en: 'She has got blue eyes.', tr: 'Onun mavi gözleri var.' },
      { t: 'ex', en: "Has he got a beard? No, he hasn't.", tr: 'Sakalı var mı? Hayır, yok.' },
    ],
  },
  {
    id: 'is-has', lesson: 'u1-look', title: 'is mi, has got mu?',
    keys: ['is mi has', 'is mi has got', 'is ile has', 'ne zaman is', 'ne zaman has', 'is tall', 'is long hair', 'dis gorunus nasil anlat', 'tarif etmek', 'appearance'],
    blocks: [
      { t: 'table', head: ['Ne anlatıyoruz?', 'Fiil', 'Örnek'], rows: [['boy, vücut, yaş', 'is', 'He is tall / slim / old.'], ['saç, göz, sakal, çil', 'has got', 'He has got short hair.'], ['gözlük, diş teli', 'wears', 'He wears glasses.']] },
      { t: 'right', ok: 'She has got long hair.', bad: 'She is long hair.', why: 'Saça sahip olunur: has got.' },
    ],
  },
  {
    id: 'hairorder', lesson: 'u1-look', title: 'Saçı anlatma sırası',
    keys: ['sac sirasi', 'sifat sirasi', 'hangi sira', 'long curly', 'curly long', 'sac nasil anlat', 'sac', 'hair'],
    blocks: [
      { t: 'p', text: 'Saçı anlatırken sıra: **1. uzunluk → 2. şekil → 3. renk → hair**' },
      { t: 'table', head: ['Uzunluk', 'Şekil', 'Renk', ''], rows: [['long', 'curly', 'black', 'hair'], ['short', 'straight', 'blonde', 'hair'], ['shoulder-length', 'wavy', 'brown', 'hair']] },
      { t: 'warn', text: '*hair* sayılamaz: "long hairs" yanlış. ==Her hair is long.== (are değil)' },
    ],
  },
  {
    id: 'tall-long', lesson: 'u1-look', title: 'tall mı, long mu?',
    keys: ['tall long', 'long tall', 'uzun boylu', 'boy icin', 'tall ne', 'he is long'],
    blocks: [
      { t: 'p', text: 'İnsanın boyu için ==tall==, saç ve eşyalar için ==long== kullanılır.' },
      { t: 'right', ok: 'My brother is tall.', bad: 'My brother is long.', why: 'Boy için tall.' },
      { t: 'ex', en: 'She has got long hair.', tr: 'Onun uzun saçı var.' },
    ],
  },
  {
    id: 'wear', lesson: 'u1-look', title: 'wear (takmak, giymek)',
    keys: ['wear', 'wears', 'gozluk tak', 'giymek', 'takmak', 'wear glasses'],
    blocks: [
      { t: 'p', text: '*wear* = giymek, takmak. Gözlük, küpe, diş teli, kıyafet için kullanılır.' },
      { t: 'ex', en: 'He wears glasses.', tr: 'O gözlük takar.' },
      { t: 'ex', en: 'She wears braces.', tr: 'O diş teli takar.' },
    ],
  },
  {
    id: 'with', lesson: 'u1-look', title: 'with ile tarif',
    keys: ['with ne', 'the girl with', 'the boy with', 'gozluklu', 'sakalli', 'with glasses'],
    blocks: [
      { t: 'p', text: '==with== birini bir özelliğiyle tanıtır: Türkçedeki **-li / -lı** gibi.' },
      { t: 'ex', en: 'The girl with glasses is my cousin.', tr: 'Gözlüklü kız benim kuzenim.' },
      { t: 'ex', en: 'The man with a beard is our neighbour.', tr: 'Sakallı adam bizim komşumuz.' },
    ],
  },
  {
    id: 'comp', lesson: 'u1-comp', title: 'Karşılaştırma (comparatives)',
    keys: ['karsilastirma', 'comparative', 'comparatives', 'daha uzun', 'daha', 'kiyaslama', 'taller than', 'karsilastir'],
    blocks: [
      { t: 'rule', parts: ['A', 'is', 'sıfat-er / more + sıfat', 'than', 'B'] },
      { t: 'table', head: ['Kural', 'Örnek'], rows: [['Kısa sıfat: -er', 'tall → taller'], ['-e ile biten: -r', 'nice → nicer'], ['sessiz-sesli-sessiz: harf çiftlenir', 'big → bigger'], ['-y ile biten: -ier', 'funny → funnier'], ['Uzun sıfat: more', 'beautiful → more beautiful'], ['Düzensiz', 'good → better, bad → worse']] },
      { t: 'ex', en: 'Ali is taller than Ayşe.', tr: 'Ali, Ayşe\'den daha uzun boylu.' },
      { t: 'warn', text: '-er ve more birlikte kullanılmaz: "more taller" yanlış!' },
    ],
  },
  {
    id: 'er-more', lesson: 'u1-comp', title: '-er mi, more mu?',
    keys: ['er mi more', 'more mu er', 'ne zaman more', 'more ne zaman', 'more nedir', 'er eki', 'more mi'],
    blocks: [
      { t: 'p', text: '**Tek heceli** (kısa) sıfatlar ==-er== alır: *tall → taller, old → older, fast → faster*.' },
      { t: 'p', text: '**İki ve daha fazla heceli** sıfatlar ==more== alır: *more beautiful, more generous, more dangerous*.' },
      { t: 'p', text: 'Ama **-y ile biten iki heceli** sıfatlar *-ier* alır: *funny → funnier, easy → easier, happy → happier*.' },
      { t: 'tip', text: 'Sonu ==-ful, -less, -ous, -ing, -ive== olanlar hep more alır: more careful, more boring, more creative.' },
    ],
  },
  {
    id: 'double', lesson: 'u1-comp', title: 'Son harf neden çiftlenir?',
    keys: ['cift', 'ciftlen', 'bigger', 'thinner', 'fatter', 'slimmer', 'iki harf', 'harf tekrar'],
    blocks: [
      { t: 'p', text: 'Tek heceli sıfat **sessiz + sesli + sessiz** harfle bitiyorsa son harf çiftlenir: *b-i-g → bigger, t-h-i-n → thinner, f-a-t → fatter, h-o-t → hotter*.' },
      { t: 'warn', text: 'İki sesli harf yan yanaysa çiftlenmez: ==cheap → cheaper==. Sonu iki sessizle bitiyorsa da çiftlenmez: ==short → shorter==.' },
    ],
  },
  {
    id: 'y-ier', lesson: 'u1-comp', title: '-y ile biten sıfatlar',
    keys: ['y ile biten', 'ier', 'funnier', 'happier', 'easier', 'lazier', 'y harfi'],
    blocks: [
      { t: 'p', text: 'Sonu -y ile biten sıfatlarda *y* düşer, ==-ier== gelir.' },
      { t: 'table', head: ['Sıfat', 'Karşılaştırma'], rows: [['funny', 'funnier'], ['lazy', 'lazier'], ['easy', 'easier'], ['healthy', 'healthier'], ['pretty', 'prettier']] },
    ],
  },
  {
    id: 'irregular', lesson: 'u1-comp', title: 'Düzensiz karşılaştırmalar',
    keys: ['duzensiz', 'good better', 'bad worse', 'better', 'worse', 'gooder', 'far', 'further', 'farther'],
    blocks: [
      { t: 'table', head: ['Sıfat', 'Karşılaştırma', 'Anlamı'], rows: [['good', 'better', 'daha iyi'], ['bad', 'worse', 'daha kötü'], ['far', 'farther / further', 'daha uzak'], ['many / much', 'more', 'daha çok'], ['little', 'less', 'daha az']] },
      { t: 'right', ok: 'My English is better than my Maths.', bad: 'My English is gooder than my Maths.', why: 'good → better' },
    ],
  },
  {
    id: 'than', lesson: 'u1-comp', title: 'than ne demek?',
    keys: ['than', 'than ne', 'than then', 'than from', 'den daha'],
    blocks: [
      { t: 'p', text: '==than== karşılaştırmada **"-den / -dan (daha)"** anlamı verir.' },
      { t: 'ex', en: 'I am taller than my sister.', tr: 'Ben kız kardeşimden daha uzunum.' },
      { t: 'warn', text: '*than* yerine *from* kullanılmaz: "older from" yanlış. *then* (sonra) ile de karıştırma.' },
      { t: 'tip', text: '*than*\'dan sonra ==me / him / her== ya da ==I am / he is== gelebilir: *She is taller than me.*' },
    ],
  },
  {
    id: 'asas', lesson: 'u1-comp', title: 'as ... as (kadar)',
    keys: ['as as', 'as tall as', 'kadar', 'ayni boy', 'not as'],
    blocks: [
      { t: 'p', text: 'İki şey **eşitse** ==as + sıfat + as== kullanırız: "... kadar".' },
      { t: 'ex', en: 'Can is as tall as Cem.', tr: 'Can, Cem kadar uzun boylu.' },
      { t: 'ex', en: 'I am not as tall as my brother.', tr: 'Ağabeyim kadar uzun boylu değilim.' },
    ],
  },
  {
    id: 'prefix', lesson: 'u1-like', title: 'Zıt anlam yapan ekler',
    keys: ['un dis im', 'on ek', 'zit yap', 'olumsuz sifat', 'unfriendly', 'dishonest', 'impatient', 'zit anlam', 'zitlar', 'opposite'],
    blocks: [
      { t: 'p', text: '==un-==, ==dis-==, ==im-== ön ekleri kelimeyi zıt yapar:' },
      { t: 'table', head: ['Kelime', 'Zıttı'], rows: [['friendly', 'unfriendly'], ['kind', 'unkind'], ['honest', 'dishonest'], ['patient', 'impatient'], ['polite', 'impolite']] },
      { t: 'p', text: '==-ful== ve ==-less== da zıttır: *careful → careless*.' },
      { t: 'tip', text: 'Bazı zıtlar tamamen farklı kelimedir: *hard-working ↔ lazy, outgoing ↔ shy, generous ↔ selfish, polite ↔ rude*.' },
    ],
  },
  {
    id: 'degree', lesson: 'u1-like', title: 'very, quite, a bit',
    keys: ['very', 'quite', 'a bit', 'a little', 'biraz', 'oldukca', 'cok'],
    blocks: [
      { t: 'table', head: ['Kelime', 'Anlamı', 'Örnek'], rows: [['very / really / so', 'çok', 'He is very kind.'], ['quite', 'oldukça', 'She is quite shy.'], ['a bit / a little', 'biraz', 'He is a bit lazy.']] },
      { t: 'warn', text: '*quite* (oldukça) ile *quiet* (sessiz) farklı kelimelerdir!' },
    ],
  },
  {
    id: 'behaviour', lesson: 'u1-like', title: 'Davranıştan kişiliği bulmak',
    keys: ['davranis', 'kisilik bul', 'nasil biri oldugunu', 'kisilik sifat', 'personality', 'kisilik'],
    blocks: [
      { t: 'p', text: 'Sınavda birinin **ne yaptığı** anlatılır, sen **nasıl biri** olduğunu bulursun. İpucu kelimelere bak:' },
      { t: 'table', head: ['Davranış', 'Kişilik'], rows: [['always helps', 'helpful'], ['never shares', 'selfish'], ['gives presents', 'generous'], ['always on time', 'punctual'], ['forgets things', 'forgetful'], ['never tells lies', 'honest'], ["doesn't talk to new people", 'shy'], ['tells jokes', 'funny']] },
    ],
  },
  {
    id: 'pdg', lesson: 'u2-pdg', title: 'play, do, go kuralı',
    keys: ['play do go', 'play mi', 'do mu', 'go mu', 'hangi fiil', 'spor fiil', 'play', 'go swimming'],
    blocks: [
      { t: 'table', head: ['Fiil', 'Ne zaman?', 'Örnek'], rows: [['PLAY', 'top ya da rakip var', 'play football, play tennis, play chess'], ['DO', 'dövüş sporu ya da bireysel, topsuz', 'do karate, do yoga, do gymnastics'], ['GO', '-ing ile biter, bir yere gidilir', 'go swimming, go cycling, go camping']] },
      { t: 'warn', text: 'İstisnalar: **do** boxing / wrestling / fencing / weightlifting, **go** bowling.' },
    ],
  },
  {
    id: 'pdg-ex', lesson: 'u2-pdg', title: 'play / do / go istisnaları',
    keys: ['istisna', 'boxing', 'bowling', 'wrestling', 'fencing', 'weightlifting'],
    blocks: [
      { t: 'p', text: '-ing ile bittiği halde **do** alanlar: ==do boxing, do wrestling, do fencing, do weightlifting==. Çünkü bunlar dövüş ve güç sporlarıdır.' },
      { t: 'p', text: 'Topla oynandığı halde **go** alan: ==go bowling==.' },
    ],
  },
  {
    id: 'present', lesson: 'u2-present', title: 'Simple Present (geniş zaman)',
    keys: ['simple present', 'genis zaman', 'present tense', 'rutin', 'aliskanlik'],
    blocks: [
      { t: 'p', text: 'Düzenli yaptığımız şeyleri, alışkanlıkları ==Simple Present== ile anlatırız.' },
      { t: 'table', head: ['', 'Olumlu', 'Olumsuz', 'Soru'], rows: [['I / You / We / They', 'play', "don't play", 'Do you play?'], ['He / She / It', 'plays', "doesn't play", 'Does she play?']] },
      { t: 'ex', en: 'She goes swimming after school.', tr: 'Okuldan sonra yüzmeye gider.' },
    ],
  },
  {
    id: 'third', lesson: 'u2-present', title: 'He / She ile fiile -s',
    keys: ['he she it', 's takisi', 's eki', 'es eki', 'ies', 'goes', 'does', 'plays', 'neden s', 'ucuncu tekil', 'fiile s'],
    blocks: [
      { t: 'table', head: ['Kural', 'Örnek'], rows: [['Çoğu fiil: -s', 'play → plays, swim → swims'], ['-o, -ch, -sh, -ss, -x: -es', 'go → goes, do → does, watch → watches'], ['sessiz + y: -ies', 'study → studies'], ['Düzensiz', 'have → has']] },
      { t: 'warn', text: "Olumsuz ve soruda -s kalkar: She doesn't **play**. Does he **play**?" },
    ],
  },
  {
    id: 'dodoes', lesson: 'u2-present', title: 'do mu, does mu?',
    keys: ['do does', 'does ne zaman', 'do mu does', 'dont doesnt', "don't doesn't", 'doesnt', 'olumsuz', 'soru nasil'],
    blocks: [
      { t: 'p', text: 'He / She / It ile ==does / doesn\'t==, diğerleriyle ==do / don\'t== kullanılır. Sonrasında fiil **yalın** kalır.' },
      { t: 'ex', en: "Does your sister play basketball? Yes, she does.", tr: 'Kız kardeşin basketbol oynar mı? Evet, oynar.' },
      { t: 'ex', en: "Ali doesn't like golf.", tr: 'Ali golfü sevmez.' },
      { t: 'right', ok: "He doesn't play chess.", bad: "He doesn't plays chess.", why: 'doesn\'t sonrası fiil yalın.' },
    ],
  },
  {
    id: 'freq', lesson: 'u2-freq', title: 'Sıklık zarfları',
    keys: ['siklik', 'adverbs of frequency', 'always usually', 'always', 'usually', 'often', 'sometimes', 'rarely', 'seldom', 'yuzde', 'siklik zarf'],
    blocks: [
      { t: 'scale' },
      { t: 'tip', text: '*rarely* ve *seldom* aynı anlamdadır (nadiren).' },
    ],
  },
  {
    id: 'freq-pos', lesson: 'u2-freq', title: 'Sıklık zarfının yeri',
    keys: ['zarfin yeri', 'nereye gelir', 'cumledeki yeri', 'always nereye', 'yeri neresi', 'hangi siraya'],
    blocks: [
      { t: 'p', text: 'Sıklık zarfı **asıl fiilin önüne** gelir: ==I always go swimming.==' },
      { t: 'p', text: 'Ama **am / is / are**\'dan **sonra** gelir: ==She is always happy.==' },
      { t: 'right', ok: 'She always goes swimming.', bad: 'She goes always swimming.', why: 'Zarf asıl fiilin önünde.' },
    ],
  },
  {
    id: 'never', lesson: 'u2-freq', title: 'never ile olumsuz',
    keys: ['never', 'dont never', 'never olumsuz', 'never ile'],
    blocks: [
      { t: 'p', text: '*never* zaten olumsuzdur; yanına ==don\'t / doesn\'t== gelmez.' },
      { t: 'right', ok: 'I never play golf.', bad: "I don't never play golf.", why: 'Çift olumsuz olmaz.' },
    ],
  },
  {
    id: 'howoften', lesson: 'u2-freq', title: 'How often? once, twice',
    keys: ['how often', 'once', 'twice', 'three times', 'kac kez', 'haftada', 'ayda', 'ne siklikla'],
    blocks: [
      { t: 'p', text: '==How often...?== = Ne sıklıkla? Cevap bir sıklık olur.' },
      { t: 'table', head: ['İfade', 'Anlamı'], rows: [['once a week', 'haftada bir kez'], ['twice a month', 'ayda iki kez'], ['three times a year', 'yılda üç kez'], ['every day', 'her gün']] },
      { t: 'ex', en: 'How often do you play basketball? Twice a week.', tr: 'Ne sıklıkla basketbol oynarsın? Haftada iki kez.' },
    ],
  },
  {
    id: 'ing', lesson: 'u2-likes', title: 'love / like / enjoy + -ing',
    keys: ['ing', 'enjoy', 'love ing', 'like ing', 'like to', 'neden ing', 'cant stand', 'dont mind', 'hate'],
    blocks: [
      { t: 'p', text: '*love, like, enjoy, hate, don\'t mind, can\'t stand* sonrasında fiil ==-ing== alır.' },
      { t: 'ex', en: 'She enjoys doing yoga.', tr: 'Yoga yapmaktan keyif alır.' },
      { t: 'right', ok: 'I enjoy swimming.', bad: 'I enjoy to swim.', why: 'enjoy + -ing' },
      { t: 'tip', text: '*like / love / hate* sonrasında *to* da olabilir (I like to swim) ama sınavda **-ing** en güvenlisi.' },
    ],
  },
  {
    id: 'preps', lesson: 'u2-likes', title: 'good at, interested in...',
    keys: ['good at', 'interested in', 'keen on', 'fond of', 'crazy about', 'edat', 'good in'],
    blocks: [
      { t: 'table', head: ['Kalıp', 'Anlamı'], rows: [['be good at', '-de iyi olmak'], ['be interested in', '-e ilgi duymak'], ['be keen on', '-e meraklı olmak'], ['be fond of', '-e düşkün olmak'], ['be crazy about', '-e bayılmak']] },
      { t: 'ex', en: "I'm good at playing chess.", tr: 'Satranç oynamakta iyiyim.' },
    ],
  },
  {
    id: 'prefer', lesson: 'u2-likes', title: 'prefer (tercih etmek)',
    keys: ['prefer', 'tercih'],
    blocks: [
      { t: 'p', text: '==prefer A to B== = A\'yı B\'ye tercih etmek.' },
      { t: 'ex', en: 'I prefer basketball to football.', tr: 'Basketbolu futbola tercih ederim.' },
    ],
  },
  {
    id: 'winbeat', lesson: 'u2-kit', title: 'win mi, beat mi?',
    keys: ['win beat', 'kazanmak yenmek', 'yenmek', 'kazanmak'],
    blocks: [
      { t: 'p', text: '==win== maçı, kupayı, madalyayı kazanmaktır. ==beat== bir rakibi yenmektir.' },
      { t: 'ex', en: 'We win the match.', tr: 'Maçı kazanırız.' },
      { t: 'ex', en: 'We beat the other team.', tr: 'Diğer takımı yeneriz.' },
    ],
  },
  {
    id: 'kit-places', lesson: 'u2-kit', title: 'Spor yerleri ve malzemeleri',
    keys: ['court', 'pitch', 'field', 'saha', 'kort', 'ring', 'rink', 'slope', 'malzeme', 'nerede yapilir'],
    blocks: [
      { t: 'table', head: ['Spor', 'Malzeme', 'Yer'], rows: [['tennis', 'racket', 'court'], ['football', 'ball', 'pitch'], ['swimming', 'goggles', 'swimming pool'], ['boxing', 'gloves', 'ring'], ['skiing', 'skis', 'slope'], ['ice skating', 'skates', 'rink'], ['running', 'trainers', 'track']] },
    ],
  },
  {
    id: 'onatin', lesson: 'u2-present', title: 'on / at / in (zaman)',
    keys: ['on at in', 'on mondays', 'at weekends', 'in winter', 'zaman edat', 'gun edat'],
    blocks: [
      { t: 'table', head: ['Edat', 'Nerede?', 'Örnek'], rows: [['on', 'günler', 'on Mondays'], ['at', 'saatler, hafta sonu', "at 7 o'clock, at weekends"], ['in', 'aylar, mevsimler, gün bölümleri', 'in July, in winter, in the morning']] },
    ],
  },
  {
    id: 'funfunny', lesson: 'u2-likes', title: 'fun mı, funny mi?',
    keys: ['fun funny', 'funny fun', 'eglenceli komik'],
    blocks: [
      { t: 'p', text: '==fun== eğlenceli (bir etkinlik), ==funny== komik (güldüren) demektir.' },
      { t: 'ex', en: 'Bowling with friends is fun.', tr: 'Arkadaşlarla bovling eğlencelidir.' },
      { t: 'ex', en: 'My uncle tells funny jokes.', tr: 'Amcam komik fıkralar anlatır.' },
    ],
  },
  {
    id: 'study', title: 'Sınava nasıl çalışmalıyım?',
    keys: ['nasil calis', 'sinava nasil', 'tavsiye', 'ipucu ver', 'taktik', 'sinava hazir', 'calisma plani', 'ne yapmaliyim'],
    blocks: [
      { t: 'list', items: ['**1.** Her gün 15 dakika **kelime kartı** çalış. Bildiklerin defterden yavaş yavaş çıkar.', '**2.** Konuları sırayla bitir, her konunun sonundaki **hızlı sorulara** mutlaka cevap ver.', '**3.** Her konudan sonra o konunun **alıştırmasını** 3 yıldız olana kadar tekrar et.', '**4.** **Yanlışlarım** bölümünü her gün temizle. Sınavdan önce en değerli yer burası!', '**5.** Sınavdan 2-3 gün önce **deneme sınavı** çöz ve **Özet** sayfasını oku.'] },
      { t: 'tip', text: 'Sınavda soruyu iki kez oku. *look like / be like* ve *play / do / go* sorularında acele etme!' },
    ],
  },
  {
    id: 'units', title: 'Hangi konuları öğreniyoruz?',
    keys: ['konular neler', 'hangi konu', 'unite 1', 'unite 2', 'neler ogren', 'mufredat', 'konu listesi'],
    blocks: [
      { t: 'p', text: '**Ünite 1: Appearance and Personality** → dış görünüş, kişilik sıfatları, look like / be like, karşılaştırma (taller than), paragraf yazma.' },
      { t: 'p', text: '**Ünite 2: Sports** → play / do / go, Simple Present, sıklık zarfları (always, twice a week), sevme bildiren yapılar (love + -ing), spor malzemeleri ve yerleri.' },
    ],
  },
  {
    id: 'paragraph', lesson: 'u1-write', title: 'Paragraf nasıl yazılır?',
    keys: ['paragraf', 'yazili', 'write about', 'arkadasimi anlat', 'kompozisyon', 'yazma'],
    blocks: [
      { t: 'list', items: ['**Tanıtım:** adı ve yaşı', '**Görünüş:** is ve has got ile', '**Kişilik:** sıfat + bir davranış örneği', '**Karşılaştırma:** taller than me', '**Bitiş:** I love her because...'] },
      { t: 'tip', text: 'Konu anlatımındaki **Paragraf Makinesi** ile seçim yaparak örnek paragraf oluşturabilirsin.' },
    ],
  },
  {
    id: 'reading-tips', title: 'Okuma ve tablo soruları',
    keys: ['okuma sorusu', 'paragraf sorusu', 'reading', 'tablo', 'chart', 'grafik', 'which is true', 'which is false', 'not true'],
    blocks: [
      { t: 'list', items: ['Önce **soruyu** oku, sonra metne dön: ne aradığını bilirsin.', '**NOT / FALSE** kelimesine dikkat: yanlış olanı arıyorsun!', 'Tabloda her satırı say: 7 gün = **every day / always**, hiç yok = **never**, 2 gün = **twice a week**.', 'Seçenekteki her kelimeyi metinle karşılaştır; bir kelime bile farklıysa yanlıştır.'] },
    ],
  },
  {
    id: 'both', title: 'both (ikisi de)',
    keys: ['both', 'ikisi de', 'ikisinin de'],
    blocks: [
      { t: 'p', text: '==both== = ikisi de.' },
      { t: 'ex', en: 'Both of them have got curly hair.', tr: 'İkisinin de kıvırcık saçı var.' },
    ],
  },
];

// Yanlış cevaplanan sorunun konusuna göre hangi bilgi kartı açılsın
export const TOPIC_FAQ = {
  opposites: 'prefix',
  comp: 'comp',
  appearance: 'is-has',
  personality: 'behaviour',
  looklike: 'looklike',
  like: 'looklike',
  hair: 'hairorder',
  pdg: 'pdg',
  freq: 'freq-pos',
  likes: 'ing',
  present: 'third',
  kit: 'kit-places',
  reading: 'reading-tips',
  sports: 'pdg',
};
