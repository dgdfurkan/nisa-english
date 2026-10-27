// Muffin'in sohbette kullandığı sabit İngilizce cümleler: selamlar, şakalar, bilmeceler, hikayeler, sohbet soruları.
// Hepsi önceden seslendirilir (voiceLines).

export const CHAT_EN = {
  hi: ['Hello! Nice to see you!', 'Merhaba! Seni görmek güzel!'],
  hiThere: ['Hi there! How are you today?', 'Selam! Bugün nasılsın?'],
  fine: ["I'm great, thanks! And you?", 'Harikayım, teşekkürler! Ya sen?'],
  fine2: ["I'm very well, thank you. I'm ready to study!", 'Çok iyiyim, teşekkür ederim. Çalışmaya hazırım!'],
  glad: ["I'm glad to hear that!", 'Bunu duyduğuma sevindim!'],
  sorry: ["Oh, I'm sorry to hear that.", 'Ah, buna üzüldüm.'],
  name: ['My name is Muffin. I am an orange cat with round glasses.', 'Benim adım Muffin. Yuvarlak gözlüklü turuncu bir kediyim.'],
  meet: ['Nice to meet you!', 'Tanıştığıma memnun oldum!'],
  age: ['I am three years old. That is quite old for a cat!', 'Üç yaşındayım. Bir kedi için epey büyük sayılır!'],
  from: ['I am from İstanbul. I live in your English notebook!', 'İstanbulluyum. Senin İngilizce defterinde yaşıyorum!'],
  look: ['I have got orange fur and green eyes. I wear round glasses. I am short and a bit plump!', 'Turuncu tüylerim ve yeşil gözlerim var. Yuvarlak gözlük takarım. Kısa boyluyum ve biraz tombulum!'],
  like: ['I am friendly, curious and a bit lazy. I love sleeping in the sun!', 'Cana yakın, meraklı ve biraz tembelim. Güneşte uyumaya bayılırım!'],
  sport: ['My favourite sport is table tennis. I love chasing the ball!', 'En sevdiğim spor masa tenisi. Topu kovalamaya bayılırım!'],
  swim: ["I don't like swimming. Cats hate water!", 'Yüzmeyi sevmem. Kediler sudan nefret eder!'],
  thanks: ["You're welcome!", 'Rica ederim!'],
  bye: ['Goodbye! See you soon!', 'Hoşça kal! Yakında görüşürüz!'],
  night: ['Good night! Sweet dreams!', 'İyi geceler! Tatlı rüyalar!'],
  morning: ['Good morning! Are you ready to learn?', 'Günaydın! Öğrenmeye hazır mısın?'],
  evening: ['Good evening! How was your day?', 'İyi akşamlar! Günün nasıldı?'],
  love: ['I love you too! You are a great student.', 'Ben de seni seviyorum! Harika bir öğrencisin.'],
  turkish: ['Yes, I can speak Turkish and English!', 'Evet, Türkçe ve İngilizce konuşabiliyorum!'],
  wellDone: ['Well done! That sentence is perfect.', 'Aferin! Bu cümle kusursuz.'],
  great: ['Great answer!', 'Harika cevap!'],
  nice: ['Nice sentence!', 'Güzel cümle!'],
  almost: ['Almost! Look at the small fix.', 'Neredeyse! Küçük düzeltmeye bak.'],
  tryEn: ['Can you say it in English?', 'Bunu İngilizce söyleyebilir misin?'],
  letsChat: ["Let's chat in English! I ask, you answer.", 'Hadi İngilizce sohbet edelim! Ben sorarım, sen cevaplarsın.'],
  chatEnd: ['Great chat! See you next time.', 'Harika bir sohbetti! Bir dahaki sefere görüşürüz.'],
  meToo: ['Me too!', 'Ben de!'],
  sportsGood: ['Sports are good for our health.', 'Spor sağlığımız için iyidir.'],
  dangerous: ['Yes, some sports are dangerous. We must be careful.', 'Evet, bazı sporlar tehlikelidir. Dikkatli olmalıyız.'],
  imagine: ['Thanks! Now I can imagine you.', 'Teşekkürler! Şimdi seni gözümde canlandırabiliyorum.'],
  lovely: ['That sounds lovely!', 'Kulağa çok hoş geliyor!'],
  goodFriend: ['Your friend sounds really nice!', 'Arkadaşın gerçekten çok hoş birine benziyor!'],
  healthy: ['That is a healthy habit!', 'Bu sağlıklı bir alışkanlık!'],
  interesting: ['Interesting! Tell me more.', 'İlginç! Biraz daha anlat.'],
  bored: ["Let's do something fun!", 'Hadi eğlenceli bir şey yapalım!'],
  joke: ['Here is a joke for you!', 'Sana bir şaka!'],
  riddle: ['Can you guess? Here is a riddle!', 'Bilebilir misin? İşte bir bilmece!'],
};

export const PHRASES = [
  ['How are you?', 'Nasılsın?', 'nasilsin'], ["I'm fine, thank you.", 'İyiyim, teşekkür ederim.', 'iyiyim'], ['Nice to meet you.', 'Tanıştığıma memnun oldum.', 'tanistigima memnun oldum|memnun oldum'],
  ["What's your name?", 'Adın ne?', 'adin ne|ismin ne'], ['My name is ...', 'Benim adım ...', 'benim adim|adim'], ['How old are you?', 'Kaç yaşındasın?', 'kac yasindasin|yasin kac'],
  ['Where are you from?', 'Nerelisin?', 'nerelisin'], ['Good morning!', 'Günaydın!', 'gunaydin'], ['Good afternoon!', 'Tünaydın! (öğleden sonra selamı)', 'tunaydin|iyi gunler'],
  ['Good evening!', 'İyi akşamlar!', 'iyi aksamlar'], ['Good night!', 'İyi geceler!', 'iyi geceler'], ['See you!', 'Görüşürüz!', 'gorusuruz'],
  ['See you later!', 'Sonra görüşürüz!', 'sonra gorusuruz'], ['Thank you!', 'Teşekkür ederim!', 'tesekkur ederim|tesekkurler|sagol'], ["You're welcome.", 'Rica ederim.', 'rica ederim'],
  ['Excuse me.', 'Affedersiniz.', 'affedersiniz|pardon'], ["I'm sorry.", 'Özür dilerim.', 'ozur dilerim'], ['Of course!', 'Tabii ki!', 'tabii ki|tabiki|elbette'],
  ["I don't know.", 'Bilmiyorum.', 'bilmiyorum'], ["I don't understand.", 'Anlamıyorum.', 'anlamiyorum|anlamadim'], ['Can you help me?', 'Bana yardım eder misin?', 'yardim eder misin'],
  ['Well done!', 'Aferin! / Çok iyi!', 'aferin'], ['Good luck!', 'İyi şanslar! / Bol şans!', 'iyi sanslar|bol sans'], ['Have a nice day!', 'İyi günler dilerim!', 'iyi gunler dilerim'],
  ["What's up?", 'Naber? / Ne var ne yok?', 'naber|ne haber'], ['Me too!', 'Ben de!', 'ben de'], ['I agree.', 'Katılıyorum.', 'katiliyorum'],
  ['What time is it?', 'Saat kaç?', 'saat kac'], ['Happy birthday!', 'İyi ki doğdun!', 'iyi ki dogdun|dogum gunun kutlu olsun'], ['I love you.', 'Seni seviyorum.', 'seni seviyorum'],
  ['Never mind.', 'Boş ver. / Önemli değil.', 'bos ver|onemli degil'], ["Let's go!", 'Hadi gidelim!', 'hadi gidelim'], ['Hurry up!', 'Acele et!', 'acele et'],
  ['I miss you.', 'Seni özledim.', 'seni ozledim'], ['Be careful!', 'Dikkatli ol!', 'dikkatli ol'], ['Good job!', 'İyi iş! / Aferin!', 'iyi is'],
  ["What's the matter?", 'Ne oldu? Sorun ne?', 'ne oldu|sorun ne'], ['How was your day?', 'Günün nasıldı?', 'gunun nasildi'], ['I am hungry.', 'Acıktım.', 'aciktim'],
  ['I am tired.', 'Yoruldum.', 'yoruldum'], ['I am bored.', 'Sıkıldım.', 'sikildim'], ['Can I go out?', 'Dışarı çıkabilir miyim?', 'disari cikabilir miyim'],
];
export const JOKES = [
  { en: 'Why did the cat sit on the computer? To keep an eye on the mouse!', tr: '**mouse** hem "fare" hem "bilgisayar faresi" demek. Kedi fareye göz kulak oluyor!' },
  { en: "Why can't Cinderella play football? Because she always runs away from the ball!", tr: '**ball** hem "top" hem "balo" demek. Külkedisi balodan kaçmıştı, hatırladın mı?' },
  { en: 'Why are fish so clever? Because they live in schools!', tr: '**school** hem "okul" hem "balık sürüsü" demek.' },
  { en: 'Why do basketball players love cookies? Because they can dunk them!', tr: '**dunk** hem "smaç yapmak" hem "kurabiyeyi süte batırmak" demek.' },
  { en: 'Why is tennis such a loud sport? Because the players raise a racket!', tr: '**racket** hem "raket" hem "gürültü, patırtı" demek.' },
  { en: "What is a cat's favourite colour? Purr-ple!", tr: 'Kediler mırlar: **purr**. Purple (mor) kelimesine benziyor!' },
  { en: 'What kind of tree fits in your hand? A palm tree!', tr: '**palm** hem "avuç içi" hem "palmiye" demek.' },
  { en: 'Why did the student eat his homework? The teacher said it was a piece of cake!', tr: '**a piece of cake** "çok kolay, çocuk oyuncağı" demek. Ama kelimesi kelimesine "bir dilim pasta"!' },
];
export const RIDDLES = [
  { en: 'I am tall when I am young, and short when I am old. What am I?', tr: 'Gençken uzunum, yaşlanınca kısalırım. Ben neyim?', a: ['candle', 'mum'], ans: 'A candle! (Mum!) Yandıkça kısalır. Bak, bilmecede **tall, short, young, old** var: Ünite 1 kelimeleri!' },
  { en: 'I have hands, but I cannot clap. What am I?', tr: 'Ellerim var ama alkışlayamam. Ben neyim?', a: ['clock', 'saat', 'watch'], ans: 'A clock! (Saat!) Saatin akrep ve yelkovanına İngilizcede **hands** denir.' },
  { en: 'What has keys but cannot open locks?', tr: 'Anahtarları (tuşları) var ama kilit açamaz. Nedir?', a: ['piano', 'piyano', 'keyboard', 'klavye'], ans: 'A piano! (Piyano!) **key** hem "anahtar" hem "tuş" demek.' },
  { en: 'What gets wetter the more it dries?', tr: 'Kuruladıkça daha çok ıslanan şey nedir?', a: ['towel', 'havlu'], ans: 'A towel! (Havlu!)' },
  { en: 'What has a neck but no head?', tr: 'Boynu var ama kafası yok. Nedir?', a: ['bottle', 'sise'], ans: 'A bottle! (Şişe!) Şişenin boğazına İngilizcede **neck** denir.' },
  { en: 'What runs but never walks?', tr: 'Koşar ama hiç yürümez. Nedir?', a: ['water', 'river', 'su', 'nehir', 'irmak'], ans: 'Water or a river! (Su ya da nehir!) Akarsu için İngilizcede **run** kullanılır.' },
  { en: 'What goes up but never comes down?', tr: 'Hep yükselir ama hiç inmez. Nedir?', a: ['age', 'yas', 'your age'], ans: 'Your age! (Yaşın!) Her yıl biraz daha **older** oluyoruz.' },
];
// Ünite kelimeleriyle kısa hikayeler
export const STORIES = [
  { title: '📖 The Twins', en: ['Ece and Ela are twins.', 'They look like their mother. They have got curly red hair and green eyes.', 'But they are very different. Ece is outgoing and talkative, but Ela is shy and quiet.', 'Ece loves playing volleyball. Ela prefers reading books.'], tr: ['Ece ve Ela ikizdir.', 'Annelerine benziyorlar. Kıvırcık kızıl saçları ve yeşil gözleri var.', 'Ama çok farklılar. Ece dışa dönük ve konuşkan, Ela ise utangaç ve sessiz.', 'Ece voleybol oynamaya bayılır. Ela kitap okumayı tercih eder.'], q: 'Soru: İkizler dış görünüşte mi, kişilikte mi birbirine benziyor? (Cevap: dış görünüşte!)' },
  { title: '📖 Grandpa Ali', en: ['My grandfather is seventy years old.', 'He is short and a bit plump. He has got grey hair and a white beard.', 'He is very kind and patient. He always helps me with my homework.', 'Every morning he goes walking in the park.'], tr: ['Dedem yetmiş yaşında.', 'Kısa boylu ve biraz tombul. Gri saçları ve beyaz sakalı var.', 'Çok nazik ve sabırlı. Ödevlerimde bana hep yardım eder.', 'Her sabah parkta yürüyüşe çıkar.'], q: 'Soru: Dede ne sıklıkla yürüyüşe çıkıyor? (Cevap: every morning, her sabah)' },
  { title: '📖 Can and the Race', en: ['Can is a fast runner. He trains three times a week.', 'Last week, he ran a race against his friend Mert.', 'Mert is taller than Can, but Can is faster than Mert.', 'Can won the race and got a gold medal!'], tr: ['Can hızlı bir koşucu. Haftada üç kez antrenman yapar.', 'Geçen hafta arkadaşı Mert\'e karşı bir yarışta koştu.', 'Mert Can\'dan daha uzun ama Can Mert\'ten daha hızlı.', 'Can yarışı kazandı ve altın madalya aldı!'], q: 'Soru: Kim daha uzun, kim daha hızlı? (Cevap: Mert daha uzun, Can daha hızlı.)' },
];

export const EN_QS = [
  { en: 'What do you look like?', tr: 'Nasıl görünüyorsun? (Dış görünüşünü anlat.)', model: 'I am tall and slim. I have got long brown hair and brown eyes.', topic: 'look' },
  { en: 'What are you like?', tr: 'Nasıl birisin? (Kişiliğini anlat.)', model: 'I am friendly and hard-working. I am a bit shy.', topic: 'like' },
  { en: 'Who do you look like in your family?', tr: 'Ailende kime benziyorsun?', model: 'I look like my mother. We have got the same eyes.', topic: 'looklike' },
  { en: 'What does your best friend look like?', tr: 'En iyi arkadaşın nasıl görünüyor?', model: 'She is short. She has got curly black hair and green eyes.', topic: 'look' },
  { en: 'What is your best friend like?', tr: 'En iyi arkadaşın nasıl biri?', model: 'She is kind and funny. She always helps me.', topic: 'like' },
  { en: 'Are you taller than your best friend?', tr: 'En iyi arkadaşından daha mı uzunsun?', model: 'Yes, I am taller than her. / No, she is taller than me.', topic: 'comp' },
  { en: 'What is your favourite sport?', tr: 'En sevdiğin spor ne?', model: 'My favourite sport is volleyball.', topic: 'sport' },
  { en: 'Do you like swimming?', tr: 'Yüzmeyi sever misin?', model: 'Yes, I love swimming. / No, I don\'t like swimming.', topic: 'likes' },
  { en: 'How often do you do sports?', tr: 'Ne sıklıkla spor yaparsın?', model: 'I do sports twice a week.', topic: 'freq' },
  { en: 'Which sports are you good at?', tr: 'Hangi sporlarda iyisin?', model: 'I am good at volleyball and table tennis.', topic: 'likes' },
  { en: 'What do you think about boxing?', tr: 'Boks hakkında ne düşünüyorsun?', model: 'I think boxing is dangerous.', topic: 'opinion' },
  { en: 'What do you usually do at weekends?', tr: 'Hafta sonları genelde ne yaparsın?', model: 'I usually go cycling at weekends.', topic: 'freq' },
  { en: 'Is football more exciting than tennis?', tr: 'Futbol tenisten daha mı heyecanlı?', model: 'Yes, I think football is more exciting than tennis.', topic: 'comp' },
  { en: 'What does your father look like?', tr: 'Baban nasıl görünüyor?', model: 'He is tall and well-built. He has got short black hair and a beard.', topic: 'look' },
  { en: 'Do you play chess?', tr: 'Satranç oynar mısın?', model: 'Yes, I play chess. / No, I don\'t play chess.', topic: 'pdg' },
];

// Seslendirilecek bütün sohbet cümleleri
export function chatVoiceLines() {
  return [
    ...Object.values(CHAT_EN).map(([en]) => en),
    ...PHRASES.map(([en]) => en).filter((en) => !en.includes('...')),
    ...JOKES.map((j) => j.en),
    ...RIDDLES.map((r) => r.en),
    ...STORIES.flatMap((st) => st.en),
    ...EN_QS.map((q) => q.en),
  ];
}
