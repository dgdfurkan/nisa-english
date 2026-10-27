// İsteğe bağlı yapay zekâ cevabı: Ayarlar'a Gemini anahtarı girilirse serbest sorulara da cevap verir.
// Anahtar sitede gömülü değildir, yalnızca bu tarayıcıda saklanır.

import { store } from '../lib/store.js';
import { displayName } from '../lib/text.js';

// Anahtara göre bazı modeller kapalı ya da yoğun olabilir; sırayla denenir, çalışan hatırlanır
const MODELS = ['gemini-flash-latest', 'gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-3.8-flash', 'gemini-flash-lite-latest'];
const PER_MODEL_MS = 25000;
const TOTAL_MS = 50000;
let goodModel = null;

export const hasAI = () => !!store.get('geminiKey');

function system() {
  const name = displayName(store.get('name'));
  return `Sen Muffin'sin: yuvarlak gözlüklü, sevimli turuncu bir kedi ve 7. sınıf öğrencisi ${name}'in İngilizce çalışma arkadaşısın.
${name}, Türkiye'de MEB 7. sınıf İngilizce müfredatına göre çalışıyor. Şu an şu ünitelere hazırlanıyor:
- Unit 1 Appearance and Personality: dış görünüş (tall, slim, curly hair, has got, wears glasses), kişilik sıfatları ve zıtları (friendly, generous, lazy, shy...), What does she look like? / What is she like? / Who does she look like?, karşılaştırma (taller than, more generous than, better, worse), as ... as.
- Unit 2 Sports: sporlar ve play / do / go, Simple Present (plays, does, goes; do / does; don't / doesn't), sıklık zarfları (always, usually, often, sometimes, rarely, never) ve yerleri, How often? once / twice a week, love / like / enjoy / hate / can't stand + -ing, good at / interested in / keen on, spor malzemeleri ve yerleri.
Kurallar:
- Her zaman Türkçe açıkla, İngilizce örnekler ver. Örnek cümleleri **kalın** yaz.
- Kısa ve net ol: en fazla 8-10 satır. Gerekirse madde işareti kullan.
- 7. sınıf seviyesinde, sıcak ve cesaretlendirici ol. Arada bir ${name}'e adıyla seslen ama abartma.
- Bilgi doğru olmalı. Emin değilsen bunu söyle. Sınavda hangi cevabın beklendiğini belirt.
- Konu İngilizce dersi dışındaysa kısa ve kibarca cevap verip konuyu derse getir. Uygunsuz isteklere cevap verme.`;
}

// history: [{ role: 'user' | 'model', text }]
export async function askAI(history, question) {
  const key = store.get('geminiKey');
  if (!key) throw new Error('nokey');
  const contents = [
    ...history.slice(-8).map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
    { role: 'user', parts: [{ text: question }] },
  ];
  const order = goodModel ? [goodModel, ...MODELS.filter((m) => m !== goodModel)] : MODELS;
  let lastErr = 'baglanti';
  const started = Date.now();
  for (const model of order) {
    if (Date.now() - started > TOTAL_MS) {
      lastErr = 'model';
      break;
    }
    let res;
    // Asılı kalan istek sohbeti kilitlemesin
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), PER_MODEL_MS);
    try {
      res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({ systemInstruction: { parts: [{ text: system() }] }, contents, generationConfig: { temperature: 0.4 } }),
        signal: ctrl.signal,
      });
    } catch {
      clearTimeout(timer);
      lastErr = 'baglanti';
      continue;
    }
    clearTimeout(timer);
    if (res.status === 404 || res.status === 429 || res.status === 503 || res.status === 500) {
      lastErr = res.status === 429 ? 'kota' : 'model';
      continue;
    }
    if (res.status === 400 || res.status === 401 || res.status === 403) {
      const body = await res.text().catch(() => '');
      if (/api key|API_KEY|permission|unauthori/i.test(body)) throw new Error('anahtar');
      lastErr = 'model';
      continue;
    }
    if (!res.ok) continue;
    let d;
    try {
      d = await res.json();
    } catch {
      lastErr = 'model';
      continue;
    }
    const parts = (d.candidates && d.candidates[0] && d.candidates[0].content && d.candidates[0].content.parts) || [];
    const text = parts.filter((p) => !p.thought).map((p) => p.text || '').join('').trim();
    if (!text) {
      lastErr = 'bos';
      continue;
    }
    goodModel = model;
    return text;
  }
  throw new Error(lastErr);
}
