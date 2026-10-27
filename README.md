# English Notebook · 7. Sınıf İngilizce

Saadet Nisa için hazırlanmış, okul yazılısına yönelik İngilizce çalışma sitesi. MEB 7. sınıf müfredatındaki ilk iki üniteyi kapsar:

- **Unit 1 · Appearance and Personality**: dış görünüş, kişilik sıfatları, look like / be like, karşılaştırma (taller than, more generous than)
- **Unit 2 · Sports**: play / do / go, Simple Present, sıklık zarfları, How often?, love / enjoy + -ing, spor malzemeleri ve yerleri

Canlı adres: https://dgdfurkan.github.io/nisa-english/

## Neler var?

| Bölüm | İçerik |
| --- | --- |
| Konu anlatımı | 10 konu, adım adım kartlar, örnekler, "Sınavda dikkat!" uyarıları, ara sorular, Paragraf Makinesi |
| Sözlük | 288 kelime: anlam, okunuş, doğal sesli telaffuz (normal ve yavaş), örnek cümle, zıt anlam, karşılaştırma hali |
| Kelime kartları | Dönen kartlar, kaydırarak "biliyorum / tekrar et", kelime kutuları |
| Alıştırmalar | 21 set: kelime, dinleme, zıt anlam eşleştirme, kişi tarifi (çizilen karakterler), karşılaştırma, play/do/go sıralama, tablo okuma, cümle kurma... Sorular her açılışta yeniden üretilir |
| Okuma | 4 metin, sesli paragraflar, anlama soruları |
| Deneme sınavı | Okul yazılısı görünümü: 20 soru, süre, optik form, kırmızı kalemle okuma, açıklamalar |
| Yanlışlarım | Yanlış yapılan sorular birikir; iki kez doğru çözülünce silinir |
| Muffin'e Sor | Takılınca soru-cevap: kelime anlamı, Türkçeden İngilizceye, zıt anlam, karşılaştırma, play/do/go, konu açıklamaları, "beni test et". İnternet gerektirmez; Ayarlar'a Gemini anahtarı girilirse serbest sorulara da yapay zekâ ile cevap verir |
| Özet | Sınavdan önce okunacak tek sayfa, yazdırılabilir |

Öğrencinin adı, ses ayarları, günlük hedef ve sınav süresi **Ayarlar**'dan değiştirilebilir. İlerleme tarayıcıda saklanır.

## Yapı

Derleme adımı yok: saf HTML, CSS ve ES modülleri. GitHub Pages `main` dalının kökünden yayınlanır.

```
index.html, css/            görünüm
js/data/                    kelimeler, konular, sınav bankası, okuma metinleri, genel sözlük
js/quiz/                    soru üreticileri, alıştırma setleri, soru çizici, yanlışlar defteri
js/ask/                     Muffin'in bilgi bankası ve cevap motoru (isteğe bağlı Gemini)
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

Her satır Whisper ile dinlenip metinle karşılaştırılır; `js/data/audio.js` hangi kayıtların hazır olduğunu tutar.
