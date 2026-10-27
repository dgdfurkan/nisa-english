// Ünite 1 konu anlatımları
// Metin biçimi: **kalın**, ==vurgu==, *İngilizce* (dokununca sözlükte açılır)
// Blok türleri: p, h, ex, rule, table, tip, warn, right, people, check, list, dialog, pairs, compare, viz (görsel anlatım)

export const U1_LESSONS = [
  {
    id: 'u1-look',
    title: 'Dış Görünüşü Anlatmak',
    en: 'What does she look like?',
    pic: '🪞',
    minutes: 12,
    steps: [
      {
        title: 'Birini nasıl tarif ederiz?',
        blocks: [
          { t: 'p', text: 'Birini anlatırken iki şeyden bahsederiz: **dış görünüşü** (*appearance*) ve **kişiliği** (*personality*). Bu derste dış görünüşü öğreneceksin.' },
          { t: 'p', text: 'Birinin dış görünüşünü sormak için bu kalıbı kullanırız:' },
          { t: 'rule', parts: ['What', 'does', 'he / she', 'look like', '?'] },
          { t: 'ex', en: 'What does your sister look like?', tr: 'Kız kardeşin nasıl görünüyor? (Dış görünüşü nasıl?)' },
          { t: 'ex', en: 'She is tall and slim. She has got long curly hair.', tr: 'Uzun boylu ve ince. Uzun kıvırcık saçı var.' },
          { t: 'tip', text: 'Soruda *look like* var ama cevapta yok! Cevapta doğrudan görünüşü anlatırız: ==She is tall.==' },
          { t: 'right', ok: 'What does she look like?', bad: 'What is she look like?', why: 'Soruda yardımcı fiil "does" kullanılır, "is" kullanılmaz.' },
          { t: 'h', text: 'Üç fiil, üç görev' },
          { t: 'p', text: 'Birini anlatırken her özelliğin kendi fiili vardır. Bu tabloyu aklına yaz, sınavdaki tarif sorularının yarısı bu kadar!' },
          {
            t: 'compare',
            cols: [
              { e: '📏', title: 'is', sub: 'boy, vücut, yaş', items: ['*tall, short, slim*', '*young, old, middle-aged*', '*bald* (kel)'] },
              { e: '💇‍♀️', title: 'has got', sub: 'sahip olduğumuz özellikler', tone: 'gold', items: ['*long hair, blue eyes*', '*a beard, a moustache*', '*freckles, dimples*'] },
              { e: '👓', title: 'wears', sub: 'üzerimizde taşıdıklarımız', tone: 'good', items: ['*glasses, earrings*', '*a hat, a uniform*', '*braces* (diş teli)'] },
            ],
          },
          { t: 'viz', kind: 'anatomy' },
        ],
      },
      {
        title: 'IS ile anlattıklarımız: boy, vücut, yaş',
        blocks: [
          { t: 'p', text: 'Boy, vücut yapısı ve yaş anlatılırken ==am / is / are== kullanılır.' },
          { t: 'rule', parts: ['He / She', 'is', 'tall / short / slim / young'] },
          {
            t: 'people',
            list: [
              { look: { kind: 'boy', h: 'tall', build: 'slim' }, cap: 'He is tall and slim.' },
              { look: { kind: 'girl', h: 'short', hairLen: 'shoulder', hairColor: 'brown' }, cap: 'She is short.' },
              { look: { kind: 'man', build: 'plump', hairColor: 'brown' }, cap: 'He is a bit overweight.' },
              { look: { kind: 'grandma' }, cap: 'She is old.' },
            ],
          },
          { t: 'ex', en: 'My father is tall and well-built.', tr: 'Babam uzun boylu ve iri yapılı.' },
          { t: 'ex', en: 'My mother is of medium height.', tr: 'Annem orta boylu.' },
          { t: 'ex', en: 'Our teacher is middle-aged.', tr: 'Öğretmenimiz orta yaşlı.' },
          { t: 'warn', text: 'İnsan boyu için *long* kullanılmaz! ==He is tall.== doğru, "He is long." yanlış. *long* saç ve eşyalar içindir.' },
          { t: 'tip', text: 'Bir insana *fat* demek kaba kaçabilir. Kibar olmak için ==a bit overweight== ya da ==a bit plump== deriz.' },
        ],
      },
      {
        title: 'HAS GOT ile anlattıklarımız: saç, göz, sakal',
        blocks: [
          { t: 'p', text: 'Saç, göz, sakal, bıyık, çil gibi **sahip olduğumuz** özellikleri anlatırken ==have got / has got== kullanırız.' },
          { t: 'rule', parts: ['He / She', 'has got', 'long hair / blue eyes / a beard'] },
          {
            t: 'table',
            head: ['', 'Olumlu', 'Olumsuz', 'Soru'],
            rows: [
              ['I / You / We / They', 'have got', "haven't got", 'Have you got...?'],
              ['He / She / It', 'has got', "hasn't got", 'Has she got...?'],
            ],
          },
          { t: 'ex', en: 'She has got blue eyes.', tr: 'Onun mavi gözleri var.' },
          { t: 'ex', en: 'I have got freckles on my nose.', tr: 'Burnumda çillerim var.' },
          { t: 'ex', en: "Has he got a moustache? No, he hasn't.", tr: 'Onun bıyığı var mı? Hayır, yok.' },
          { t: 'right', ok: 'She has got long hair.', bad: 'She is long hair.', why: 'Saç bir özelliğe sahip olmaktır, bu yüzden "has got" kullanılır.' },
          { t: 'tip', text: '*has got* yerine sadece *has* da diyebilirsin: ==She has long hair.== İkisi de doğrudur.' },
        ],
      },
      {
        title: 'Saçı doğru sırayla anlatmak',
        blocks: [
          { t: 'p', text: 'Saçı anlatırken sıfatların bir **sırası** vardır: önce uzunluk, sonra şekil, en son renk gelir. Sınavlarda bu sıra çok sorulur!' },
          {
            t: 'table',
            head: ['1. Uzunluk', '2. Şekil', '3. Renk', ''],
            rows: [
              ['long', 'curly', 'black', 'hair'],
              ['short', 'straight', 'blonde', 'hair'],
              ['shoulder-length', 'wavy', 'brown', 'hair'],
            ],
          },
          {
            t: 'people',
            list: [
              { look: { kind: 'girl', hairLen: 'long', hairType: 'curly', hairColor: 'black' }, cap: 'long curly black hair' },
              { look: { kind: 'boy', hairLen: 'short', hairType: 'straight', hairColor: 'blonde' }, cap: 'short straight blonde hair' },
              { look: { kind: 'woman', hairLen: 'shoulder', hairType: 'wavy', hairColor: 'brown' }, cap: 'shoulder-length wavy brown hair' },
            ],
          },
          { t: 'ex', en: 'She has got long curly black hair.', tr: 'Onun uzun kıvırcık siyah saçı var.' },
          { t: 'right', ok: 'He has got short straight brown hair.', bad: 'He has got brown straight short hair.', why: 'Sıra: uzunluk, şekil, renk.' },
          { t: 'warn', text: '*hair* sayılamaz, çoğul olmaz: "long hairs" yanlış. Ayrıca ==Her hair is long.== deriz, "are" değil.' },
        ],
      },
      {
        title: 'WEAR ve WITH',
        blocks: [
          { t: 'p', text: 'Gözlük, diş teli ve küpe için ==wear== (takmak) fiilini kullanırız. Birini bir özelliğiyle tanıtırken ==with== (-li / -lı) çok işe yarar.' },
          { t: 'ex', en: 'He wears glasses.', tr: 'O gözlük takar.' },
          { t: 'ex', en: 'She wears braces.', tr: 'O diş teli takar.' },
          { t: 'ex', en: 'The girl with glasses is my cousin.', tr: 'Gözlüklü kız benim kuzenim.' },
          { t: 'ex', en: 'The man with a beard is our neighbour.', tr: 'Sakallı adam bizim komşumuz.' },
          {
            t: 'people',
            list: [
              { look: { kind: 'boy', glasses: true, hairColor: 'black' }, cap: 'the boy with glasses' },
              { look: { kind: 'man', beard: true, hairColor: 'brown' }, cap: 'the man with a beard' },
              { look: { kind: 'girl', ponytail: true, hairLen: 'long', hairColor: 'blonde' }, cap: 'the girl with a ponytail' },
            ],
          },
          { t: 'dialog', lines: [['A', 'Which one is your brother?'], ['B', 'The tall boy with curly hair.']] },
        ],
      },
      {
        title: 'Karakter Stüdyosu: kendin dene',
        blocks: [
          { t: 'p', text: 'Şimdi öğrendiklerini birleştirelim. Aşağıdaki stüdyoda bir karakter tasarla. Her seçimde İngilizce tarif **kendiliğinden** yazılır. Hangi özelliğin **is**, hangisinin **has got**, hangisinin **wears** ile söylendiğine dikkat et!' },
          { t: 'viz', kind: 'studio' },
          { t: 'tip', text: 'Sınavda bir resim verip *Describe the person.* derlerse sırayla git: önce **boy ve vücut** (is), sonra **saç ve gözler** (has got), en son **gözlük, küpe** (wears).' },
          { t: 'ex', en: 'She is short and slim. She has got straight black hair and brown eyes. She wears glasses.', tr: 'Kısa boylu ve ince. Düz siyah saçları ve kahverengi gözleri var. Gözlük takıyor.' },
          { t: 'ex', en: 'He is tall and well-built. He has got short curly hair and a beard.', tr: 'Uzun boylu ve iri yapılı. Kısa kıvırcık saçları ve sakalı var.' },
        ],
      },
      {
        title: 'Hızlı kontrol',
        blocks: [
          { t: 'check', q: 'A: What does your father look like?\nB: ______', opts: ['He is tall and he has got a beard.', 'He is kind and funny.', 'He likes football.', 'He is fine, thanks.'], a: 0, why: '"look like" dış görünüşü sorar. Boy ve sakal dış görünüştür.' },
          { t: 'check', q: 'She ______ got short black hair.', opts: ['is', 'has', 'have', 'does'], a: 1, why: 'Saç için "has got" kullanılır. "She" ile "has" gelir.' },
          { t: 'check', q: 'Hangisi doğru sırada?', opts: ['curly long red hair', 'long curly red hair', 'red long curly hair', 'long red curly hair'], a: 1, why: 'Sıra: uzunluk (long), şekil (curly), renk (red).' },
          { t: 'check', q: 'My grandfather is very ______.', opts: ['long', 'tall', 'long hair', 'curly'], a: 1, why: 'İnsan boyu için "tall" kullanılır.' },
        ],
      },
    ],
    summary: [
      'Dış görünüş sorusu: **What does he/she look like?**',
      'Boy, vücut, yaş: **He is tall / slim / old.**',
      'Saç, göz, sakal: **She has got long hair / blue eyes.**',
      'Saç sırası: **uzunluk + şekil + renk** (long curly black hair)',
      'Gözlük: **He wears glasses.** Gözlüklü kız: **the girl with glasses**',
      'Boy için *long* değil **tall**; *hair* çoğul olmaz.',
    ],
  },
  {
    id: 'u1-like',
    title: 'Kişiliği Anlatmak',
    en: 'What is she like?',
    pic: '💭',
    minutes: 11,
    steps: [
      {
        title: 'Nasıl biri?',
        blocks: [
          { t: 'p', text: 'Birinin **kişiliğini** (nasıl biri olduğunu) sormak için bu kalıbı kullanırız:' },
          { t: 'rule', parts: ['What', 'is', 'he / she', 'like', '?'] },
          { t: 'ex', en: 'What is your best friend like?', tr: 'En yakın arkadaşın nasıl biri?' },
          { t: 'ex', en: 'She is friendly and helpful.', tr: 'Cana yakın ve yardımsever biri.' },
          { t: 'ex', en: 'What are your parents like? They are kind and patient.', tr: 'Annenle baban nasıl insanlar? Nazik ve sabırlılar.' },
          { t: 'tip', text: 'Buradaki *like* "sevmek" demek değildir, "gibi" anlamındadır. Kelimesi kelimesine: "O nasıl biri?"' },
          { t: 'rule', parts: ['He / She', 'is', 'friendly / generous / lazy'] },
          { t: 'h', text: 'Sıfatı bir davranışla destekle' },
          {
            t: 'compare',
            cols: [
              { e: '🙂', title: 'Sadece sıfat', sub: 'doğru ama kısa', items: ['*She is helpful.*'] },
              { e: '🌟', title: 'Sıfat + davranış', sub: 'yazılıda tam puan', tone: 'good', items: ['*She is helpful. She always helps me with my homework.*'] },
            ],
          },
        ],
      },
      {
        title: 'Zıt anlamlılar',
        blocks: [
          { t: 'p', text: 'Kişilik sıfatlarını **zıt anlamlılarıyla** öğrenmek çok kolaylaştırır. Sınavda zıt anlam soruları sık çıkar.' },
          {
            t: 'pairs',
            list: [
              ['friendly', 'unfriendly'], ['hard-working', 'lazy'], ['generous', 'selfish'], ['polite', 'rude'],
              ['outgoing', 'shy'], ['talkative', 'quiet'], ['patient', 'impatient'], ['careful', 'careless'],
              ['tidy', 'messy'], ['cheerful', 'grumpy'], ['honest', 'dishonest'], ['calm', 'nervous'],
              ['modest', 'arrogant'], ['funny', 'serious'], ['kind', 'cruel'],
            ],
          },
          { t: 'tip', text: '==un-==, ==dis-==, ==im-== ön ekleri kelimeyi zıt yapar: *friendly* → *unfriendly*, *honest* → *dishonest*, *patient* → *impatient*.' },
          { t: 'warn', text: '==-ful== ve ==-less== zıttır: *careful* (dikkatli) → *careless* (dikkatsiz).' },
        ],
      },
      {
        title: 'Davranıştan kişiliği bulmak',
        blocks: [
          { t: 'p', text: 'Sınavlarda çoğu zaman birinin **ne yaptığı** anlatılır ve senden **nasıl biri** olduğunu bulman istenir. İpuçlarını yakala!' },
          { t: 'viz', kind: 'moods' },
          {
            t: 'table',
            head: ['Ne yapıyor?', 'Nasıl biri?'],
            rows: [
              ['He always helps his friends.', 'helpful'],
              ['She never shares her things.', 'selfish'],
              ['He often gives presents to people.', 'generous'],
              ['She often forgets her homework.', 'forgetful'],
              ['He is never late. He is always on time.', 'punctual'],
              ["She doesn't talk much with new people.", 'shy'],
              ['He studies every day.', 'hard-working'],
              ['She tells jokes and makes us laugh.', 'funny'],
              ['He never tells lies.', 'honest'],
              ['Her room is always clean.', 'tidy'],
            ],
          },
          { t: 'check', q: 'Ali always says "please" and "thank you". He is ______.', opts: ['rude', 'polite', 'lazy', 'messy'], a: 1, why: '"please" ve "thank you" diyen biri kibardır: polite.' },
        ],
      },
      {
        title: 'very, quite, a bit ile derece',
        blocks: [
          { t: 'p', text: 'Bir özelliğin ne kadar güçlü olduğunu da söyleyebiliriz:' },
          {
            t: 'table',
            head: ['Kelime', 'Anlamı', 'Örnek'],
            rows: [
              ['very / really / so', 'çok', 'He is very kind.'],
              ['quite', 'oldukça', 'She is quite shy.'],
              ['a bit / a little', 'biraz', 'He is a bit lazy.'],
            ],
          },
          { t: 'tip', text: '*a bit* genelde olumsuz özelliklerle kullanılır: ==a bit lazy, a bit messy, a bit bossy==.' },
          { t: 'p', text: 'Özellikleri bağlarken ==and== (ve) ve ==but== (ama) kullanırız. *but* zıt bir fikir getirir.' },
          { t: 'ex', en: 'She is clever and hard-working.', tr: 'O zeki ve çalışkan.' },
          { t: 'ex', en: 'He is funny, but he is a bit lazy.', tr: 'O komik ama biraz tembel.' },
          { t: 'viz', kind: 'degree' },
          { t: 'ex', en: 'My brother is quite shy, but he is very kind.', tr: 'Kardeşim oldukça utangaç ama çok nazik.' },
        ],
      },
      {
        title: 'Görünüş mü, kişilik mi?',
        blocks: [
          { t: 'p', text: 'Sınavın en sevdiği soru: verilen cevap **dış görünüşü** mü anlatıyor, **kişiliği** mi?' },
          {
            t: 'table',
            head: ['Soru', 'Neyi sorar?', 'Örnek cevap'],
            rows: [
              ['What does he look like?', 'Dış görünüş', 'He is tall. He has got a beard.'],
              ['What is he like?', 'Kişilik', 'He is kind and funny.'],
            ],
          },
          { t: 'check', q: 'A: What is your teacher like?\nB: ______', opts: ['She is short and slim.', 'She has got wavy hair.', 'She is patient and kind.', 'She wears glasses.'], a: 2, why: '"What is ... like?" kişiliği sorar. patient ve kind kişilik sıfatlarıdır.' },
          { t: 'check', q: 'Hangisi bir kişilik sıfatı DEĞİLDİR?', opts: ['generous', 'curly', 'honest', 'stubborn'], a: 1, why: '"curly" (kıvırcık) saçı anlatır, yani dış görünüştür.' },
        ],
      },
    ],
    summary: [
      'Kişilik sorusu: **What is he/she like?** (Nasıl biri?)',
      'Cevap: **He is friendly and helpful.**',
      'Zıtlar: friendly / unfriendly, honest / dishonest, careful / careless, tidy / messy',
      'Davranıştan kişilik: always helps → **helpful**, never shares → **selfish**',
      'Derece: **very** kind, **quite** shy, **a bit** lazy',
    ],
  },
  {
    id: 'u1-looklike',
    title: 'look like, be like, look',
    en: 'Who do you look like?',
    pic: '👯',
    minutes: 8,
    steps: [
      {
        title: 'Karıştırılan dört kalıp',
        blocks: [
          { t: 'p', text: 'Bu dört kalıp birbirine çok benzer ama anlamları farklıdır. Sınavda mutlaka karşına çıkar!' },
          { t: 'viz', kind: 'quad' },
          {
            t: 'table',
            head: ['Kalıp', 'Anlamı', 'Örnek cevap'],
            rows: [
              ['What does she look like?', 'Dış görünüşü nasıl?', 'She is tall. She has got curly hair.'],
              ['What is she like?', 'Nasıl biri? (kişilik)', 'She is friendly and generous.'],
              ['Who does she look like?', 'Kime benziyor?', 'She looks like her mother.'],
              ['She looks happy.', 'Mutlu görünüyor.', '(şu anki hali)'],
            ],
          },
        ],
      },
      {
        title: 'look like = benzemek',
        blocks: [
          { t: 'p', text: '*look like* + kişi, "birine **görünüşçe benzemek**" demektir.' },
          { t: 'rule', parts: ['I / You / We / They', 'look like', 'my father'] },
          { t: 'rule', parts: ['He / She', 'looks like', 'his mother'] },
          { t: 'ex', en: 'I look like my mother.', tr: 'Anneme benziyorum.' },
          { t: 'ex', en: 'Who does Ali look like? He looks like his grandfather.', tr: 'Ali kime benziyor? Dedesine benziyor.' },
          { t: 'ex', en: "Do you look like your father? No, I don't.", tr: 'Babana benziyor musun? Hayır, benzemiyorum.' },
          { t: 'ex', en: "She doesn't look like her sister.", tr: 'O, kız kardeşine benzemiyor.' },
          { t: 'tip', text: '*resemble* da "benzemek" demektir ama yanına *like* almaz: ==She resembles her father.==' },
          { t: 'viz', kind: 'family' },
        ],
      },
      {
        title: 'Sık yapılan hatalar',
        blocks: [
          { t: 'right', ok: 'What does he look like?', bad: 'What does he looks like?', why: '"does" kullandıktan sonra fiil yalın kalır, -s almaz.' },
          { t: 'right', ok: 'What is he like?', bad: 'How is he like?', why: 'Kişilik sorusu "What" ile başlar.' },
          { t: 'right', ok: 'I look like my mum.', bad: 'I am look like my mum.', why: '"look like" bir fiildir, önüne "am" gelmez.' },
          { t: 'warn', text: '==How is she?== kişiliği değil, **hatırını** sorar: "Nasıl, iyi mi?" Cevabı: *She is fine, thanks.*' },
        ],
      },
      {
        title: 'Bir diyalog',
        blocks: [
          {
            t: 'dialog',
            lines: [
              ['Nisa', 'What does your cousin look like?'],
              ['Ece', 'She is short and a bit plump. She has got wavy black hair.'],
              ['Nisa', 'What is she like?'],
              ['Ece', 'She is very funny and talkative.'],
              ['Nisa', 'Who does she look like?'],
              ['Ece', 'She looks like her mother.'],
            ],
          },
          { t: 'check', q: 'A: ______?\nB: He looks like his father.', opts: ['What does he look like', 'Who does he look like', 'What is he like', 'How is he'], a: 1, why: 'Cevap "kime benzediğini" söylüyor, bu yüzden soru "Who does he look like?" olur.' },
          { t: 'check', q: 'A: How is your grandmother?\nB: ______', opts: ['She is old and short.', 'She is fine, thanks.', 'She looks like my mum.', 'She has got grey hair.'], a: 1, why: '"How is she?" hatır sorar: "Nasıl, iyi mi?"' },
        ],
      },
    ],
    summary: [
      '**What does she look like?** → dış görünüş',
      '**What is she like?** → kişilik',
      '**Who does she look like?** → kime benziyor; **She looks like her mother.**',
      '**She looks happy.** → mutlu görünüyor',
      '**How is she?** → hatır sorma: She is fine, thanks.',
      'does + yalın fiil: What does he **look** like? (looks değil)',
    ],
  },
  {
    id: 'u1-comp',
    title: 'Karşılaştırma Yapmak',
    en: 'Comparatives: taller than',
    pic: '⚖️',
    minutes: 15,
    steps: [
      {
        title: 'İki kişiyi karşılaştırmak',
        blocks: [
          { t: 'p', text: 'İki kişiyi ya da iki şeyi karşılaştırırken sıfatı değiştiririz ve ==than== (-den / -dan) kullanırız.' },
          { t: 'rule', parts: ['A', 'is', 'sıfat + er  /  more + sıfat', 'than', 'B'] },
          { t: 'ex', en: 'Ali is taller than Ayşe.', tr: 'Ali, Ayşe\'den daha uzun boylu.' },
          { t: 'ex', en: 'My sister is more hard-working than me.', tr: 'Kız kardeşim benden daha çalışkan.' },
          {
            t: 'people',
            list: [
              { look: { kind: 'boy', h: 'tall', hairColor: 'black' }, cap: 'Tom is taller than Sam.' },
              { look: { kind: 'boy', h: 'short', hairColor: 'blonde', hairType: 'curly' }, cap: 'Sam is shorter than Tom.' },
            ],
          },
          { t: 'tip', text: '*than* "-den daha" demektir. *then* (sonra) ile karıştırma!' },
          { t: 'viz', kind: 'lineup' },
        ],
      },
      {
        title: 'Kural 1: Kısa sıfatlara -er',
        blocks: [
          { t: 'p', text: 'Tek heceli (kısa) sıfatların sonuna ==-er== ekleriz.' },
          { t: 'table', head: ['Sıfat', 'Karşılaştırma'], rows: [['tall', 'taller'], ['short', 'shorter'], ['old', 'older'], ['young', 'younger'], ['long', 'longer'], ['strong', 'stronger'], ['kind', 'kinder'], ['fast', 'faster']] },
          { t: 'p', text: 'Sonu zaten ==-e== ile biten sıfatlara sadece ==-r== ekleriz.' },
          { t: 'table', head: ['Sıfat', 'Karşılaştırma'], rows: [['nice', 'nicer'], ['brave', 'braver'], ['cute', 'cuter'], ['safe', 'safer'], ['rude', 'ruder']] },
          { t: 'viz', kind: 'morph', items: [['tall', 'taller', 'er'], ['short', 'shorter', 'er'], ['old', 'older', 'er'], ['young', 'younger', 'er'], ['nice', 'nicer', 'r'], ['cute', 'cuter', 'r']] },
        ],
      },
      {
        title: 'Kural 2: Son harf çiftlenir',
        blocks: [
          { t: 'p', text: 'Tek heceli sıfat **sessiz + sesli + sessiz** harfle bitiyorsa son harf ==çiftlenir==, sonra -er eklenir.' },
          { t: 'table', head: ['Sıfat', 'Karşılaştırma'], rows: [['big', 'bigger'], ['thin', 'thinner'], ['fat', 'fatter'], ['slim', 'slimmer'], ['hot', 'hotter'], ['sad', 'sadder']] },
          { t: 'warn', text: 'İki sesli harf yan yanaysa çiftlenmez: ==cheap → cheaper==, ==weak → weaker==. Sonu iki sessizle bitiyorsa da çiftlenmez: ==short → shorter==.' },
          { t: 'right', ok: 'My cat is fatter than your cat.', bad: 'My cat is fater than your cat.', why: '"fat" sessiz-sesli-sessiz ile biter, "t" çiftlenir.' },
          { t: 'viz', kind: 'morph', items: [['big', 'bigger', 'dbl'], ['thin', 'thinner', 'dbl'], ['slim', 'slimmer', 'dbl'], ['fat', 'fatter', 'dbl'], ['hot', 'hotter', 'dbl']] },
        ],
      },
      {
        title: 'Kural 3: -y ile bitenler',
        blocks: [
          { t: 'p', text: 'Sonu ==-y== ile biten sıfatlarda *y* düşer, yerine ==-ier== gelir.' },
          { t: 'table', head: ['Sıfat', 'Karşılaştırma'], rows: [['funny', 'funnier'], ['lazy', 'lazier'], ['happy', 'happier'], ['busy', 'busier'], ['pretty', 'prettier'], ['tidy', 'tidier'], ['messy', 'messier'], ['easy', 'easier'], ['healthy', 'healthier'], ['curly', 'curlier']] },
          { t: 'right', ok: 'My brother is funnier than me.', bad: 'My brother is more funny than me.', why: '-y ile biten iki heceli sıfatlar -ier alır.' },
          { t: 'viz', kind: 'morph', items: [['funny', 'funnier', 'y'], ['lazy', 'lazier', 'y'], ['happy', 'happier', 'y'], ['pretty', 'prettier', 'y'], ['easy', 'easier', 'y']] },
        ],
      },
      {
        title: 'Kural 4: Uzun sıfatlara more',
        blocks: [
          { t: 'p', text: 'İki ya da daha fazla heceli sıfatların (sonu -y ile bitmeyenler) önüne ==more== getiririz. Sıfatın kendisi değişmez.' },
          { t: 'table', head: ['Sıfat', 'Karşılaştırma'], rows: [['beautiful', 'more beautiful'], ['intelligent', 'more intelligent'], ['generous', 'more generous'], ['hard-working', 'more hard-working'], ['helpful', 'more helpful'], ['patient', 'more patient'], ['popular', 'more popular'], ['dangerous', 'more dangerous']] },
          { t: 'tip', text: 'Sonu ==-ful, -less, -ous, -ing, -ive== ile biten sıfatlar hep *more* alır: more careful, more careless, more generous, more boring, more creative.' },
          { t: 'ex', en: 'My grandmother is more patient than my grandfather.', tr: 'Büyükannem dedemden daha sabırlı.' },
          { t: 'viz', kind: 'morph', items: [['beautiful', 'more beautiful', 'more'], ['intelligent', 'more intelligent', 'more'], ['generous', 'more generous', 'more'], ['careful', 'more careful', 'more']] },
        ],
      },
      {
        title: 'Kural 5: Düzensizler',
        blocks: [
          { t: 'p', text: 'Bazı sıfatlar hiçbir kurala uymaz. Bunları **ezberlemelisin**:' },
          { t: 'table', head: ['Sıfat', 'Karşılaştırma', 'Anlamı'], rows: [['good', 'better', 'daha iyi'], ['bad', 'worse', 'daha kötü'], ['far', 'farther / further', 'daha uzak'], ['many / much', 'more', 'daha çok'], ['little', 'less', 'daha az']] },
          { t: 'ex', en: 'My English is better than my Maths.', tr: 'İngilizcem matematiğimden daha iyi.' },
          { t: 'ex', en: 'Today the weather is worse than yesterday.', tr: 'Bugün hava dünkünden daha kötü.' },
          { t: 'right', ok: 'She is better at tennis than me.', bad: 'She is gooder at tennis than me.', why: '"good" düzensizdir: good → better.' },
          { t: 'viz', kind: 'morph', items: [['good', 'better', 'irr'], ['bad', 'worse', 'irr'], ['far', 'farther', 'irr']] },
        ],
      },
      {
        title: 'Laboratuvar: kendin karşılaştır',
        blocks: [
          { t: 'p', text: 'Beş kuralı da gördün. Şimdi laboratuvarda dene: bir sıfat seç, Ali ve Elif\'in çubuklarını kaydır. Cümle ve kullanılan **kural** anında değişir. Çubuklar eşit olunca ne olduğuna da bak!' },
          { t: 'viz', kind: 'complab' },
          { t: 'tip', text: 'Hangi kuralı uygulayacağını bulmak için sıfatı yüksek sesle söyle: tek hece mi (tall), sessiz-sesli-sessiz ile mi bitiyor (big), -y ile mi bitiyor (funny), yoksa uzun mu (beautiful)?' },
        ],
      },
      {
        title: 'Sık yapılan hatalar',
        blocks: [
          { t: 'right', ok: 'She is taller than me.', bad: 'She is more taller than me.', why: '-er ve more birlikte kullanılmaz.' },
          { t: 'right', ok: 'He is more generous than his brother.', bad: 'He is generouser than his brother.', why: 'Uzun sıfatlar -er almaz, more alır.' },
          { t: 'right', ok: 'Ali is older than Can.', bad: 'Ali is older from Can.', why: 'Türkçedeki "-den" İngilizcede "than" olur, "from" değil.' },
          { t: 'tip', text: '*than*\'dan sonra ==me / him / her== ya da ==I am / he is== gelebilir: *She is taller than me.* ya da *She is taller than I am.*' },
        ],
      },
      {
        title: 'Bonus: as ... as',
        blocks: [
          { t: 'p', text: 'İki kişi **aynıysa** ==as + sıfat + as== kullanırız. Olumsuzu "o kadar değil" demektir.' },
          { t: 'ex', en: 'Can is as tall as Cem.', tr: 'Can, Cem kadar uzun boylu. (Aynı boydalar.)' },
          { t: 'ex', en: 'I am not as tall as my brother.', tr: 'Ağabeyim kadar uzun boylu değilim.' },
          { t: 'tip', text: '==I am not as tall as my brother.== ile ==My brother is taller than me.== aynı anlama gelir.' },
          { t: 'p', text: 'Farkın büyüklüğünü de söyleyebiliriz: ==much taller== (çok daha uzun), ==a bit taller== (biraz daha uzun).' },
        ],
      },
      {
        title: 'Hızlı kontrol',
        blocks: [
          { t: 'check', q: 'Ece is 12. Deniz is 14. Ece is ______ Deniz.', opts: ['older than', 'younger than', 'more young than', 'as old as'], a: 1, why: 'Ece daha küçük: young → younger than.' },
          { t: 'check', q: 'Hangisi YANLIŞ?', opts: ['big → bigger', 'funny → funnier', 'thin → thiner', 'nice → nicer'], a: 2, why: '"thin" sessiz-sesli-sessiz ile biter: thin → thinner (n çiftlenir).' },
          { t: 'check', q: 'My father is ______ than my uncle.', opts: ['more generous', 'generouser', 'more generouser', 'generous'], a: 0, why: '"generous" uzun bir sıfattır: more generous.' },
          { t: 'check', q: 'This film is ______ than that one. It is my favourite!', opts: ['gooder', 'more good', 'better', 'worse'], a: 2, why: '"good" düzensizdir: better. "favourite" dediği için daha iyi demek istiyor.' },
        ],
      },
    ],
    summary: [
      'Kalıp: **A is ...er / more ... than B**',
      'Kısa sıfat: tall → **taller**, nice → **nicer**',
      'Çiftlenme: big → **bigger**, thin → **thinner**, slim → **slimmer**',
      '-y: funny → **funnier**, lazy → **lazier**, easy → **easier**',
      'Uzun sıfat: **more** beautiful, **more** generous, **more** hard-working',
      'Düzensiz: good → **better**, bad → **worse**, far → **farther**',
      'Asla: more taller, gooder, older from',
    ],
  },
  {
    id: 'u1-write',
    title: 'Bir Arkadaşını Anlat',
    en: 'Writing a description',
    pic: '✍️',
    minutes: 9,
    steps: [
      {
        title: 'İyi bir paragrafın planı',
        blocks: [
          { t: 'p', text: 'Yazılıda sık sık **"Write a paragraph about your best friend."** gibi bir soru gelir. Bu plana uyarsan her zaman tam puan alırsın:' },
          {
            t: 'list',
            items: [
              '**1. Tanıtım:** Adı ve yaşı. *My best friend\'s name is Defne. She is twelve years old.*',
              '**2. Dış görünüş:** is ve has got ile. *She is tall and slim. She has got long straight hair.*',
              '**3. Kişilik:** sıfatlar ve bir örnek davranış. *She is helpful. She always helps me with Maths.*',
              '**4. Karşılaştırma:** kendinle kıyasla. *She is taller than me, but I am more talkative.*',
              '**5. Bitiş:** neden seviyorsun? *I love her because she is a great friend.*',
            ],
          },
          { t: 'viz', kind: 'paraplan' },
        ],
      },
      {
        title: 'Örnek paragraf',
        blocks: [
          { t: 'p', text: 'Aşağıdaki paragrafta **dış görünüş** ve **kişilik** cümlelerini fark et:' },
          { t: 'ex', en: "My best friend's name is Defne. She is twelve years old.", tr: 'En yakın arkadaşımın adı Defne. On iki yaşında.' },
          { t: 'ex', en: 'She is tall and slim. She has got long straight black hair and big brown eyes.', tr: 'Uzun boylu ve ince. Uzun düz siyah saçı ve iri kahverengi gözleri var.' },
          { t: 'ex', en: 'She is very friendly and helpful. She always helps me with my homework.', tr: 'Çok cana yakın ve yardımsever. Ödevlerimde bana her zaman yardım eder.' },
          { t: 'ex', en: 'She is taller than me, but I am more talkative than her.', tr: 'Benden daha uzun boylu ama ben ondan daha konuşkanım.' },
          { t: 'ex', en: 'I love her because she is a great friend.', tr: 'Onu seviyorum çünkü harika bir arkadaş.' },
          { t: 'tip', text: 'Bağlaçlar paragrafı güzelleştirir: ==and== (ve), ==but== (ama), ==also== (ayrıca), ==because== (çünkü), ==so== (bu yüzden).' },
        ],
      },
      {
        title: 'Sıra sende: Paragraf Makinesi',
        blocks: [
          { t: 'p', text: 'Arkadaşını seç, özelliklerini işaretle; paragrafın hazır! Sonra defterine yazmayı unutma.' },
          { t: 'builder', kind: 'friend' },
        ],
      },
    ],
    summary: [
      'Paragraf planı: **tanıtım → görünüş → kişilik → karşılaştırma → bitiş**',
      'Bağlaçlar: **and, but, also, because, so**',
      'Kişilik sıfatını bir davranışla destekle: *She is helpful. She always helps me.*',
    ],
  },
];
