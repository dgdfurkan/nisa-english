# English Notebook · 7. Sınıf İngilizce

Saadet Nisa için hazırlanmış, okul yazılısına yönelik İngilizce çalışma sitesi. MEB 7. sınıf müfredatındaki ilk iki üniteyi kapsar:

- **Unit 1 · Appearance and Personality**: dış görünüş, kişilik sıfatları, look like / be like, karşılaştırma (taller than, more generous than)
- **Unit 2 · Sports**: play / do / go, Simple Present, sıklık zarfları, How often?, love / enjoy + -ing, spor malzemeleri ve yerleri

Canlı adres: https://dgdfurkan.github.io/nisa-english/

## Neler var?

| Bölüm | İçerik |
| --- | --- |
| Konu anlatımı | 10 konu, adım adım kartlar, örnekler, "Sınavda dikkat!" uyarıları, ara sorular, Paragraf Makinesi ve 22 etkileşimli görsel: Karakter Stüdyosu, etiketli karakter, boy ölçümü, Karşılaştırma Laboratuvarı, kişilik kartları, play/do/go oyunu, Rutin Makinesi, haftalık sıklık takvimi, sevgi ölçeği, spor yerleri, win/beat oyunu |
| Çalışma Kağıtları | 12 kağıt (her konu ve ünite tekrarı): resimli tarif, eşleştirme, yuvarlak içine alma, boşluk doldurma, tablo, cümle sıralama, hata bulma, doğru/yanlış, kelime avı, sütunlara ayırma, yazma (cümleler denetlenir). Ekranda kontrol edilir, kırmızı kalemle düzeltilir, A4 yazdırılır; "Yeni kağıt" her seferinde farklı sorular üretir |
| Sözlük | 288 kelime: anlam, okunuş, doğal sesli telaffuz (normal ve yavaş), örnek cümle, zıt anlam, karşılaştırma hali |
| Kelime kartları | Dönen kartlar, kaydırarak "biliyorum / tekrar et", kelime kutuları |
| Alıştırmalar | 21 set: kelime, dinleme, zıt anlam eşleştirme, kişi tarifi (çizilen karakterler), karşılaştırma, play/do/go sıralama, tablo okuma, cümle kurma... Sorular her açılışta yeniden üretilir |
| Okuma | 4 metin, sesli paragraflar, anlama soruları |
| Deneme sınavı | Okul yazılısı görünümü: 20 soru, süre, optik form, kırmızı kalemle okuma, açıklamalar |
| Yanlışlarım | Yanlış yapılan sorular birikir; iki kez doğru çözülünce silinir |
| Muffin'e Sor | Sohbet eden çalışma arkadaşı: selamlaşma ve hal hatır (Türkçe ve İngilizce), konuşmanın bağlamını hatırlama ("bir örnek daha", "anlamadım", "zıttı ne"), İngilizce sohbet modu, cümle düzeltme (-s takısı, has got, karşılaştırma, play/do/go, -ing, zarf yeri...), çalışma planı, şaka, bilmece, hikaye. Kelime ve konu soruları bilgi bankasından anında gelir; internet gerektirmez. Ayarlar'a Gemini anahtarı girilirse serbest sorulara yapay zekâ da cevap verir |
| Özet | Sınavdan önce okunacak tek sayfa, yazdırılabilir |

Öğrencinin adı, ses ayarları, günlük hedef ve sınav süresi **Ayarlar**'dan değiştirilebilir. İlerleme tarayıcıda saklanır.

## Yapı

Derleme adımı yok: saf HTML, CSS ve ES modülleri. GitHub Pages `main` dalının kökünden yayınlanır.

```
index.html, css/            görünüm
js/data/                    kelimeler, konular, sınav bankası, okuma metinleri, genel sözlük
js/quiz/                    soru üreticileri, alıştırma setleri, soru çizici, yanlışlar defteri
js/ask/                     Muffin: sohbet katmanı (chat.js), cümle denetleyicisi (grammar.js), bilgi bankası (engine.js), isteğe bağlı Gemini
js/ws/                      çalışma kağıdı üreticisi (tohumlu, yazdırılabilir)
js/ui/viz.js                konu anlatımındaki etkileşimli görseller
img/e/                      3D emoji çizimleri
js/screens/                 ekranlar
audio/en/                   önceden üretilmiş telaffuz kayıtları
tools/                      seslendirme araçları
```

## Telaffuz kayıtları

Kayıtlar Gemini TTS (Autonoe sesi, İngiliz aksanı) ile bir kez üretildi; site çalışırken yapay ses kullanmaz. Yeni kelime ya da ders eklenince:

```bash
node tools/lines.mjs
python3 tools/seslendir.py
```

Her satır Whisper ile dinlenip metinle karşılaştırılır; `js/data/audio.js` hangi kayıtların hazır olduğunu tutar. Cümlelerdeki genel kelimelerin (dokununca açılan anlam kutusu) ve Muffin'in İngilizce cümlelerinin de sesi vardır.

## 3D emojiler

Emojiler her cihazda aynı görünsün diye Microsoft Fluent Emoji (MIT lisanslı, `@lobehub/fluent-emoji-3d` paketi) çizimleriyle gösterilir. Yeni emoji kullanılınca:

```bash
node tools/emoji.mjs
```
