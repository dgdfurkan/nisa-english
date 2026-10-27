// Ünite 2 konu anlatımları
// Metin biçimi: **kalın**, ==vurgu==, *İngilizce* (dokununca sözlükte açılır)

export const U2_LESSONS = [
  {
    id: 'u2-pdg',
    title: 'PLAY, DO ya da GO?',
    en: 'play football, do karate, go swimming',
    pic: '🏅',
    minutes: 9,
    steps: [
      {
        title: 'Sporlarla üç fiil',
        blocks: [
          { t: 'p', text: 'Türkçede "futbol oynamak", "karate yapmak", "yüzmeye gitmek" deriz. İngilizcede de her spor belli bir fiille kullanılır: ==play==, ==do== ya da ==go==.' },
          {
            t: 'table',
            head: ['PLAY', 'DO', 'GO'],
            rows: [
              ['football', 'karate', 'swimming'],
              ['basketball', 'judo', 'cycling'],
              ['volleyball', 'yoga', 'skiing'],
              ['tennis', 'gymnastics', 'hiking'],
              ['chess', 'archery', 'camping'],
            ],
          },
          { t: 'tip', text: 'Kuralı bir kez anlarsan ezberlemene gerek kalmaz. Hadi tek tek bakalım!' },
        ],
      },
      {
        title: 'PLAY: Top ve rakip varsa',
        blocks: [
          { t: 'p', text: '==play== **topla oynanan** oyunlar ve **rakibe karşı** oynanan oyunlarla kullanılır. Genelde bir takım ya da bir rakip vardır, biri kazanır.' },
          { t: 'ex', en: 'We play volleyball at school.', tr: 'Okulda voleybol oynarız.' },
          { t: 'ex', en: 'My grandpa and I play chess every evening.', tr: 'Dedemle her akşam satranç oynarız.' },
          { t: 'list', items: ['*football, basketball, volleyball, handball*', '*tennis, table tennis, badminton, golf, baseball*', '*ice hockey, water polo, chess*'] },
        ],
      },
      {
        title: 'DO: Dövüş sporları ve bireysel etkinlikler',
        blocks: [
          { t: 'p', text: '==do== **dövüş sporları** (karate, judo) ve topsuz, takımsız, **kendi başına** yapılan etkinliklerle kullanılır.' },
          { t: 'ex', en: 'She does yoga every morning.', tr: 'Her sabah yoga yapar.' },
          { t: 'ex', en: 'I do karate at a sports club.', tr: 'Bir spor kulübünde karate yapıyorum.' },
          { t: 'list', items: ['*karate, judo, taekwondo, boxing, wrestling, fencing*', '*yoga, gymnastics, aerobics, ballet*', '*athletics, archery, weightlifting*'] },
        ],
      },
      {
        title: 'GO: -ing ile biten hareketli etkinlikler',
        blocks: [
          { t: 'p', text: '==go== çoğunlukla sonu **-ing** ile biten ve bir yere **gidilerek** yapılan etkinliklerle kullanılır.' },
          { t: 'ex', en: 'We go camping in summer.', tr: 'Yazın kampa gideriz.' },
          { t: 'ex', en: 'My dad goes jogging every morning.', tr: 'Babam her sabah koşuya çıkar.' },
          { t: 'list', items: ['*swimming, cycling, running, jogging, skiing, ice skating*', '*surfing, sailing, rafting, canoeing, rowing*', '*hiking, fishing, camping, horse riding, mountain climbing*'] },
        ],
      },
      {
        title: 'Sınavın sevdiği istisnalar',
        blocks: [
          { t: 'warn', text: '**boxing, wrestling, fencing, weightlifting** -ing ile bittiği halde ==do== alır. Çünkü bunlar dövüş ya da güç sporudur, bir yere gitmeyi anlatmaz.' },
          { t: 'warn', text: '**bowling** topla oynandığı halde ==go== alır: *We go bowling on Fridays.*' },
          { t: 'right', ok: 'He does boxing.', bad: 'He goes boxing.', why: 'boxing bir istisnadır: do boxing.' },
          { t: 'right', ok: 'We go bowling.', bad: 'We play bowling.', why: 'bowling bir istisnadır: go bowling.' },
          { t: 'tip', text: 'He / She ile fiiller değişir: ==plays==, ==does==, ==goes==. *She goes swimming. He does judo. She plays tennis.*' },
        ],
      },
      {
        title: 'Hızlı kontrol',
        blocks: [
          { t: 'check', q: 'We ______ camping every summer.', opts: ['play', 'do', 'go', 'make'], a: 2, why: 'camping -ing ile biter ve bir yere gidilir: go camping.' },
          { t: 'check', q: 'My sister ______ gymnastics.', opts: ['plays', 'does', 'goes', 'makes'], a: 1, why: 'gymnastics topsuz, bireysel bir spordur: do gymnastics. She ile does olur.' },
          { t: 'check', q: 'Hangisi YANLIŞ?', opts: ['play tennis', 'do judo', 'go swimming', 'play cycling'], a: 3, why: 'cycling -ing ile biter: go cycling.' },
          { t: 'check', q: 'Hangisi bir istisnadır? (-ing ile bitiyor ama "do" alıyor)', opts: ['swimming', 'wrestling', 'skiing', 'fishing'], a: 1, why: 'wrestling (güreş) -ing ile bittiği halde "do" alır.' },
        ],
      },
    ],
    summary: [
      '**PLAY** + top / rakip: play football, play tennis, play chess',
      '**DO** + dövüş ve bireysel: do karate, do yoga, do gymnastics',
      '**GO** + -ing hareket: go swimming, go cycling, go camping',
      'İstisnalar: **do** boxing / wrestling / fencing / weightlifting, **go** bowling',
      'He / She: **plays, does, goes**',
    ],
  },
  {
    id: 'u2-present',
    title: 'Rutinler: Simple Present',
    en: 'She plays tennis on Mondays.',
    pic: '🔁',
    minutes: 9,
    steps: [
      {
        title: 'Alışkanlıkları anlatmak',
        blocks: [
          { t: 'p', text: 'Düzenli yaptığımız şeyleri, alışkanlıkları ve rutinleri ==Simple Present Tense== (geniş zaman) ile anlatırız.' },
          { t: 'ex', en: 'I play tennis on Saturdays.', tr: 'Cumartesileri tenis oynarım.' },
          { t: 'ex', en: 'She goes swimming after school.', tr: 'Okuldan sonra yüzmeye gider.' },
          {
            t: 'table',
            head: ['Özne', 'Fiil'],
            rows: [['I / You / We / They', 'play'], ['He / She / It', 'plays']],
          },
          { t: 'warn', text: 'He / She / It ile fiile ==-s== eklemeyi unutma! Sınavda en çok kaybedilen puan budur.' },
        ],
      },
      {
        title: '-s, -es, -ies kuralları',
        blocks: [
          {
            t: 'table',
            head: ['Kural', 'Örnek'],
            rows: [
              ['Çoğu fiil: -s', 'play → plays, swim → swims, run → runs'],
              ['-o, -ch, -sh, -ss, -x: -es', 'go → goes, do → does, watch → watches'],
              ['sessiz + y: -ies', 'study → studies, fly → flies'],
              ['sesli + y: -s', 'play → plays, enjoy → enjoys'],
              ['Düzensiz', 'have → has'],
            ],
          },
          { t: 'ex', en: 'My brother watches football matches on TV.', tr: 'Ağabeyim televizyonda futbol maçları izler.' },
          { t: 'ex', en: 'Zeynep studies English every day.', tr: 'Zeynep her gün İngilizce çalışır.' },
        ],
      },
      {
        title: 'Olumsuz: don\'t / doesn\'t',
        blocks: [
          { t: 'rule', parts: ['I / You / We / They', "don't", 'play'] },
          { t: 'rule', parts: ['He / She / It', "doesn't", 'play'] },
          { t: 'ex', en: "I don't like golf.", tr: 'Golfü sevmem.' },
          { t: 'ex', en: "She doesn't play chess.", tr: 'O satranç oynamaz.' },
          { t: 'right', ok: "He doesn't play chess.", bad: "He doesn't plays chess.", why: '"doesn\'t" zaten -s taşır, fiil yalın kalır.' },
        ],
      },
      {
        title: 'Sorular ve kısa cevaplar',
        blocks: [
          {
            t: 'table',
            head: ['Soru', 'Evet', 'Hayır'],
            rows: [
              ['Do you play football?', 'Yes, I do.', "No, I don't."],
              ['Does she do yoga?', 'Yes, she does.', "No, she doesn't."],
              ['Do they go skiing?', 'Yes, they do.', "No, they don't."],
            ],
          },
          { t: 'p', text: 'Soru kelimeleriyle (Wh- soruları) daha çok bilgi isteriz:' },
          { t: 'ex', en: 'What sport do you do? I do judo.', tr: 'Hangi sporu yapıyorsun? Judo yapıyorum.' },
          { t: 'ex', en: 'When does she go swimming? On Wednesdays.', tr: 'Ne zaman yüzmeye gider? Çarşambaları.' },
          { t: 'ex', en: 'Where do they play football? In the park.', tr: 'Nerede futbol oynarlar? Parkta.' },
          { t: 'ex', en: 'What time does the match start? At seven.', tr: 'Maç saat kaçta başlıyor? Yedide.' },
        ],
      },
      {
        title: 'Zaman ifadeleri ve edatlar',
        blocks: [
          {
            t: 'table',
            head: ['Edat', 'Nerede kullanılır?', 'Örnek'],
            rows: [
              ['on', 'günler', 'on Monday, on Sundays'],
              ['at', 'saatler, hafta sonu', 'at 7 o\'clock, at weekends'],
              ['in', 'aylar, mevsimler, gün bölümleri', 'in July, in winter, in the morning'],
            ],
          },
          { t: 'ex', en: 'We go skiing in winter.', tr: 'Kışın kayağa gideriz.' },
          { t: 'ex', en: 'I go to the gym at weekends.', tr: 'Hafta sonları spor salonuna giderim.' },
          { t: 'tip', text: '*on Monday* bir pazartesi, *on Mondays* her pazartesi demektir. Rutin anlatırken çoğul kullanırız: ==on Mondays==.' },
        ],
      },
      {
        title: 'Hızlı kontrol',
        blocks: [
          { t: 'check', q: 'My father ______ jogging every morning.', opts: ['go', 'goes', 'going', 'is go'], a: 1, why: '"My father" = he. go → goes.' },
          { t: 'check', q: '______ your sister play basketball?\nYes, she does.', opts: ['Do', 'Does', 'Is', 'Are'], a: 1, why: 'She ile soru "Does" ile kurulur.' },
          { t: 'check', q: "Ali ______ like golf. He thinks it is boring.", opts: ["don't", "doesn't", "isn't", 'not'], a: 1, why: 'Ali = he. Olumsuz: doesn\'t + yalın fiil.' },
          { t: 'check', q: 'We go skiing ______ winter.', opts: ['on', 'at', 'in', 'to'], a: 2, why: 'Mevsimlerle "in" kullanılır: in winter.' },
        ],
      },
    ],
    summary: [
      'Rutin: **I play / She plays**',
      'He / She / It: **-s** (plays), **-es** (goes, does, watches), **-ies** (studies), **has**',
      "Olumsuz: **don't / doesn't + yalın fiil**",
      'Soru: **Do / Does ... ?** Yes, she does. / No, she doesn\'t.',
      'Edatlar: **on** Mondays, **at** weekends, **in** winter',
    ],
  },
  {
    id: 'u2-freq',
    title: 'Ne Sıklıkla? Sıklık Zarfları',
    en: 'How often do you play tennis?',
    pic: '📅',
    minutes: 9,
    steps: [
      {
        title: 'Sıklık ölçeği',
        blocks: [
          { t: 'p', text: 'Bir şeyi **ne sıklıkla** yaptığımızı anlatan kelimelere ==adverbs of frequency== (sıklık zarfları) denir.' },
          { t: 'scale' },
          { t: 'tip', text: '*rarely* ve *seldom* aynı anlamdadır: nadiren. *never* = asla, hiçbir zaman.' },
        ],
      },
      {
        title: 'Cümledeki yeri',
        blocks: [
          { t: 'p', text: 'Sıklık zarfları **asıl fiilin önüne** gelir.' },
          { t: 'rule', parts: ['I', 'always', 'go swimming'] },
          { t: 'ex', en: 'I always go swimming on Sundays.', tr: 'Pazar günleri her zaman yüzmeye giderim.' },
          { t: 'ex', en: 'She usually plays tennis after school.', tr: 'Genellikle okuldan sonra tenis oynar.' },
          { t: 'p', text: 'Ama ==am / is / are== varsa zarf onlardan **sonra** gelir.' },
          { t: 'rule', parts: ['She', 'is', 'always', 'cheerful'] },
          { t: 'ex', en: 'He is never late for training.', tr: 'Antrenmana asla geç kalmaz.' },
          { t: 'right', ok: 'She always goes swimming.', bad: 'She goes always swimming.', why: 'Zarf asıl fiilin (goes) önüne gelir.' },
          { t: 'right', ok: 'He is often tired.', bad: 'He often is tired.', why: '"is" varsa zarf ondan sonra gelir.' },
        ],
      },
      {
        title: 'never ile dikkat!',
        blocks: [
          { t: 'warn', text: '*never* zaten olumsuz anlam taşır. Yanına ==don\'t / doesn\'t== gelmez!' },
          { t: 'right', ok: 'I never play golf.', bad: "I don't never play golf.", why: 'never cümleyi zaten olumsuz yapar.' },
          { t: 'p', text: 'Soru ve olumsuz cümlelerde de zarf asıl fiilin önüne gelir:' },
          { t: 'ex', en: 'Do you often go cycling?', tr: 'Sık sık bisiklete biner misin?' },
          { t: 'ex', en: "I don't usually watch tennis.", tr: 'Genelde tenis izlemem.' },
        ],
      },
      {
        title: 'once, twice, three times',
        blocks: [
          { t: 'p', text: 'Daha net söylemek için **sıklık ifadeleri** kullanırız. Bunlar genelde **cümlenin sonuna** gelir.' },
          {
            t: 'table',
            head: ['İfade', 'Anlamı'],
            rows: [
              ['once a week', 'haftada bir kez'],
              ['twice a month', 'ayda iki kez'],
              ['three times a year', 'yılda üç kez'],
              ['every day / every week', 'her gün / her hafta'],
              ['on Sundays / at weekends', 'pazarları / hafta sonları'],
            ],
          },
          { t: 'ex', en: 'How often do you play basketball? Twice a week.', tr: 'Ne sıklıkla basketbol oynarsın? Haftada iki kez.' },
          { t: 'ex', en: 'She goes horse riding once a month.', tr: 'Ayda bir kez ata binmeye gider.' },
          { t: 'tip', text: '1 = ==once==, 2 = ==twice==, 3 ve sonrası = ==three times, four times...==' },
        ],
      },
      {
        title: 'Tablo okumak',
        blocks: [
          { t: 'p', text: 'Sınavlarda çoğu zaman bir **tablo** verilir ve hangi cümlenin doğru olduğu sorulur. Tabloyu dikkatle oku!' },
          {
            t: 'table',
            head: ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            rows: [
              ['swimming', '✓', '✓', '✓', '✓', '✓', '✓', '✓'],
              ['tennis', '✓', '', '', '✓', '', '', ''],
              ['chess', '', '', '', '', '', '', ''],
            ],
            cap: 'Emre\'nin haftası',
          },
          { t: 'ex', en: 'Emre always goes swimming. He goes swimming every day.', tr: 'Emre her zaman yüzmeye gider. Her gün yüzmeye gider.' },
          { t: 'ex', en: 'He plays tennis twice a week.', tr: 'Haftada iki kez tenis oynar.' },
          { t: 'ex', en: 'He never plays chess.', tr: 'Asla satranç oynamaz.' },
          { t: 'check', q: 'Tabloya göre hangisi DOĞRU?', opts: ['Emre never goes swimming.', 'Emre plays tennis twice a week.', 'Emre always plays chess.', 'Emre plays tennis every day.'], a: 1, why: 'Tenis yalnızca pazartesi ve perşembe işaretli: haftada iki kez (twice a week).' },
        ],
      },
      {
        title: 'Hızlı kontrol',
        blocks: [
          { t: 'check', q: 'Hangisi doğru?', opts: ['She goes always swimming.', 'She always goes swimming.', 'Always she goes swimming.', 'She goes swimming always on.'], a: 1, why: 'Zarf asıl fiilin önüne gelir: She always goes...' },
          { t: 'check', q: 'A: ______ do you go to the gym?\nB: Three times a week.', opts: ['What', 'How often', 'Where', 'Which'], a: 1, why: 'Cevap bir sıklık bildiriyor: How often?' },
          { t: 'check', q: "I ______ go skiing. I hate cold weather.", opts: ['always', 'usually', 'never', 'often'], a: 2, why: 'Soğuk havadan nefret ettiği için kayağa asla gitmez: never.' },
        ],
      },
    ],
    summary: [
      'Ölçek: **always** %100 → **usually** → **often** → **sometimes** → **rarely / seldom** → **never** %0',
      'Yeri: asıl fiilden **önce** (I always go), **am/is/are**\'dan **sonra** (She is always happy)',
      "**never** ile don't kullanılmaz",
      'Soru: **How often ...?** Cevap: once / twice / three times **a week**',
    ],
  },
  {
    id: 'u2-likes',
    title: 'Sevdiklerimiz ve Fikirlerimiz',
    en: 'I love swimming!',
    pic: '❤️',
    minutes: 9,
    steps: [
      {
        title: 'Ne kadar seviyorsun?',
        blocks: [
          { t: 'p', text: 'Bir şeyi ne kadar sevdiğimizi bu kelimelerle anlatırız (en çoktan en aza):' },
          {
            t: 'table',
            head: ['', 'İngilizce', 'Anlamı'],
            rows: [
              ['😍', 'love / be crazy about', 'bayılmak, deli olmak'],
              ['😊', 'like / enjoy', 'sevmek, keyif almak'],
              ['🤷', "don't mind", 'fark etmez, sorun etmem'],
              ['😕', "don't like / dislike", 'sevmemek'],
              ['😖', 'hate', 'nefret etmek'],
              ['🙅', "can't stand", 'hiç dayanamamak'],
            ],
          },
        ],
      },
      {
        title: 'Fiil + -ing',
        blocks: [
          { t: 'p', text: 'Bu fiillerden sonra başka bir fiil gelirse o fiil ==-ing== alır.' },
          { t: 'rule', parts: ['I', 'love / like / enjoy / hate', 'swimming'] },
          { t: 'ex', en: 'I love playing volleyball.', tr: 'Voleybol oynamaya bayılırım.' },
          { t: 'ex', en: 'She enjoys doing yoga.', tr: 'Yoga yapmaktan keyif alır.' },
          { t: 'ex', en: "I can't stand losing.", tr: 'Kaybetmeye hiç dayanamam.' },
          { t: 'right', ok: 'She enjoys swimming.', bad: 'She enjoys to swim.', why: '"enjoy" sonrasında fiil her zaman -ing alır.' },
          { t: 'tip', text: '*like, love, hate* sonrasında *to* da kullanılabilir (I like to swim) ama *enjoy, don\'t mind, can\'t stand* mutlaka ==-ing== ister. Emin değilsen -ing kullan!' },
        ],
      },
      {
        title: 'good at, interested in...',
        blocks: [
          { t: 'p', text: 'Bu kalıplar belli bir **edatla** gelir. Edattan sonra fiil gelirse yine ==-ing== olur.' },
          {
            t: 'table',
            head: ['Kalıp', 'Anlamı', 'Örnek'],
            rows: [
              ['be good at', '-de iyi olmak', "I'm good at playing chess."],
              ['be interested in', '-e ilgi duymak', 'He is interested in sports.'],
              ['be keen on', '-e meraklı olmak', 'She is keen on cycling.'],
              ['be fond of', '-e düşkün olmak', "They're fond of hiking."],
              ['be crazy about', '-e bayılmak', "Ahmet is crazy about football."],
            ],
          },
          { t: 'right', ok: 'I am good at swimming.', bad: 'I am good in swimming.', why: '"good" ile "at" edatı kullanılır.' },
        ],
      },
      {
        title: 'Soru sormak ve cevaplamak',
        blocks: [
          { t: 'ex', en: "Do you like doing yoga? Yes, I do.", tr: 'Yoga yapmayı sever misin? Evet, severim.' },
          { t: 'ex', en: 'What is your favourite sport? My favourite sport is tennis.', tr: 'En sevdiğin spor ne? En sevdiğim spor tenis.' },
          { t: 'ex', en: 'Which sport do you prefer, tennis or badminton? I prefer tennis.', tr: 'Hangi sporu tercih edersin, tenis mi badminton mu? Tenisi tercih ederim.' },
          { t: 'ex', en: 'What do you think about boxing? I think it is dangerous.', tr: 'Boks hakkında ne düşünüyorsun? Bence tehlikeli.' },
          { t: 'ex', en: 'Why do you like swimming? Because it is relaxing.', tr: 'Yüzmeyi neden seviyorsun? Çünkü rahatlatıcı.' },
          { t: 'tip', text: '==Why?== sorusuna ==Because...== ile cevap veririz.' },
        ],
      },
      {
        title: 'Sporları karşılaştırmak',
        blocks: [
          { t: 'p', text: 'Ünite 1\'deki karşılaştırma kurallarını sporlar için de kullanırız!' },
          { t: 'ex', en: 'Rafting is more exciting than fishing.', tr: 'Rafting balık tutmaktan daha heyecan verici.' },
          { t: 'ex', en: 'Running is cheaper than skiing.', tr: 'Koşmak kayaktan daha ucuz.' },
          { t: 'ex', en: 'Mountain climbing is more dangerous than cycling.', tr: 'Dağ tırmanışı bisikletten daha tehlikeli.' },
          { t: 'ex', en: 'Yoga is more relaxing than boxing.', tr: 'Yoga bokstan daha rahatlatıcı.' },
          { t: 'table', head: ['Sıfat', 'Karşılaştırma'], rows: [['safe', 'safer'], ['cheap', 'cheaper'], ['easy', 'easier'], ['healthy', 'healthier'], ['exciting', 'more exciting'], ['dangerous', 'more dangerous'], ['expensive', 'more expensive'], ['fun', 'more fun']] },
        ],
      },
      {
        title: 'Hızlı kontrol',
        blocks: [
          { t: 'check', q: 'She enjoys ______ yoga in the morning.', opts: ['do', 'to do', 'doing', 'does'], a: 2, why: '"enjoy" sonrasında fiil -ing alır: doing.' },
          { t: 'check', q: 'I am good ______ playing chess.', opts: ['in', 'at', 'on', 'of'], a: 1, why: 'be good at: -de iyi olmak.' },
          { t: 'check', q: "I love volleyball, but I ______ boxing. It's too dangerous.", opts: ['enjoy', "can't stand", 'am crazy about', 'love'], a: 1, why: '"but" zıt bir fikir getiriyor ve boksun tehlikeli olduğunu söylüyor: can\'t stand.' },
          { t: 'check', q: 'Skiing is ______ than running.', opts: ['more expensive', 'expensiver', 'more expensiver', 'expensive'], a: 0, why: '"expensive" uzun bir sıfattır: more expensive.' },
        ],
      },
    ],
    summary: [
      'Sevgi ölçeği: **love > like > don\'t mind > don\'t like > hate > can\'t stand**',
      'Bu fiillerden sonra **-ing**: I love swimming, she enjoys doing yoga',
      'Edatlar: good **at**, interested **in**, keen **on**, fond **of**, crazy **about**',
      'Sorular: **Do you like...? What\'s your favourite...? Why? → Because...**',
      'Karşılaştırma: rafting is **more exciting than** fishing',
    ],
  },
  {
    id: 'u2-kit',
    title: 'Malzemeler, Yerler, Kişiler',
    en: 'racket, court, referee',
    pic: '🎾',
    minutes: 7,
    steps: [
      {
        title: 'Hangi sporda ne kullanılır, nerede yapılır?',
        blocks: [
          { t: 'p', text: 'Sınavlarda bir sporun **malzemesi** ya da **yapıldığı yer** sorulabilir. Bu tabloyu bir kez iyice incele:' },
          {
            t: 'table',
            head: ['Spor', 'Malzeme', 'Yer'],
            rows: [
              ['tennis', 'racket, ball, net', 'court'],
              ['football', 'ball, goal', 'pitch / stadium'],
              ['swimming', 'swimsuit, goggles', 'swimming pool'],
              ['boxing', 'gloves', 'ring'],
              ['skiing', 'skis, goggles', 'slope'],
              ['ice skating', 'skates', 'rink'],
              ['running', 'trainers', 'track'],
              ['cycling', 'bike, helmet', 'road, park'],
              ['golf', 'ball', 'golf course'],
              ['yoga', 'mat', 'gym'],
            ],
          },
          { t: 'tip', text: 'tennis, basketball ve volleyball ==court==\'ta, football ==pitch==\'te oynanır.' },
        ],
      },
      {
        title: 'Spordaki kişiler',
        blocks: [
          {
            t: 'table',
            head: ['Kelime', 'Anlamı'],
            rows: [
              ['athlete', 'sporcu'],
              ['player', 'oyuncu'],
              ['coach', 'antrenör'],
              ['referee', 'hakem'],
              ['captain', 'kaptan'],
              ['fan', 'taraftar'],
              ['champion', 'şampiyon'],
            ],
          },
          { t: 'ex', en: 'The referee blows the whistle.', tr: 'Hakem düdüğü çalar.' },
          { t: 'ex', en: 'Our coach is strict but fair.', tr: 'Antrenörümüz katı ama adildir.' },
        ],
      },
      {
        title: 'win mi, beat mi?',
        blocks: [
          { t: 'p', text: '==win== bir **maçı, kupayı, madalyayı** kazanmaktır. ==beat== ise bir **rakibi yenmektir**.' },
          { t: 'ex', en: 'We win the match.', tr: 'Maçı kazanırız.' },
          { t: 'ex', en: 'We beat the other team.', tr: 'Diğer takımı yeneriz.' },
          { t: 'right', ok: 'Our team wins the cup.', bad: 'Our team beats the cup.', why: 'Kupa kazanılır (win), yenilmez.' },
          { t: 'tip', text: 'Sporcu kelimeleri bazen fiilden **-er** ile yapılır: run → ==runner==, swim → ==swimmer== (m çiftlenir), cycle → ==cyclist==, ski → ==skier==.' },
        ],
      },
      {
        title: 'Sıra sende: Spor Paragrafım',
        blocks: [
          { t: 'p', text: 'Yazılıda **"Write about your favourite sport."** sorusu çıkabilir. Seçimlerini yap, paragrafını oluştur!' },
          { t: 'builder', kind: 'sport' },
        ],
      },
    ],
    summary: [
      'tennis → **racket, court**; football → **pitch**; boxing → **gloves, ring**',
      'skiing → **skis, slope**; ice skating → **skates, rink**; running → **trainers, track**',
      '**referee** hakem, **coach** antrenör, **fan** taraftar',
      '**win** maç / kupa; **beat** rakip',
    ],
  },
];
