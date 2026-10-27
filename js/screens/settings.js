// Ayarlar: öğrencinin adı, sesler, telaffuz hızı, günlük hedef, sınav süresi, veli bölümü (Gemini anahtarı), sıfırlama

import { html } from '../lib/dom.js';
import { store, cleanName, DEFAULT_NAME } from '../lib/store.js';
import { openSheet, confirmSheet, toast } from '../ui/overlay.js';
import { sliderHTML, bindSlider, switchHTML, bindSwitch, stepperHTML, bindStepper } from '../ui/controls.js';
import { icon } from '../ui/icons.js';
import { sfx } from '../audio/sfx.js';
import { hasAudio, say } from '../audio/voice.js';

export function openSettings() {
  const { el, close } = openSheet(html`
    <h2 class="t-big">Ayarlar</h2>
    <div class="set-block">
      <div class="lbl"><b>Öğrencinin adı</b></div>
      <input class="field" data-name maxlength="24" value="${store.get('name')}" aria-label="Öğrencinin adı" autocomplete="off">
      <span class="note">Ana sayfada ve Muffin'in mesajlarında bu ad kullanılır.</span>
    </div>
    <div class="set-list">
      <div class="set-row"><span class="lbl"><b>Efekt sesleri</b><span>Doğru, yanlış ve dokunma sesleri</span></span>${switchHTML('sfx', store.get('sfx'), 'Efekt sesleri')}</div>
      <div class="set-row"><span class="lbl"><b>Efekt ses düzeyi</b></span>${sliderHTML('sfxVol', store.get('sfxVol'), 'Efekt ses düzeyi')}</div>
      <div class="set-row"><span class="lbl"><b>Yavaş telaffuz</b><span>Kelimeler daha yavaş okunur</span></span>${switchHTML('slow', store.get('slow'), 'Yavaş telaffuz')}</div>
      <div class="set-row"><span class="lbl"><b>Kelimeyi otomatik oku</b><span>Kelime kartı ve sözlükte açılınca</span></span>${switchHTML('autoplay', store.get('autoplay'), 'Otomatik okuma')}</div>
      <div class="set-row"><span class="lbl"><b>Günlük XP hedefi</b><span>Bir alıştırma yaklaşık 100 XP</span></span>${stepperHTML('goal', store.get('goal'))}</div>
      <div class="set-row"><span class="lbl"><b>Deneme sınavı süresi</b><span>Dakika</span></span>${stepperHTML('examMinutes', store.get('examMinutes'), (v) => `${v} dk`)}</div>
    </div>
    <details class="set-block parent">
      <summary><b>Veli bölümü: Yapay zekâ desteği</b>${icon('chevron')}</summary>
      <span class="note">Muffin normalde internete gerek duymadan, kendi bilgi bankasıyla anında cevap verir. Buraya bir Google Gemini API anahtarı girilirse listede olmayan serbest sorulara da yapay zekâ ile cevap verir. Anahtar yalnızca bu tarayıcıda saklanır. <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">Ücretsiz anahtar al</a></span>
      <input class="field" data-gemini type="password" autocomplete="off" spellcheck="false" placeholder="İsteğe bağlı" value="${store.get('geminiKey')}" aria-label="Gemini API anahtarı">
    </details>
    <div class="row">
      <button class="btn btn--ghost" data-act="reset">${icon('trash')}İlerlemeyi sıfırla</button>
      <button class="btn btn--primary" data-act="done" data-primary>Tamam</button>
    </div>`, {
    actions: {
      done: (t, e, closeIt) => closeIt(),
      reset: async (t, e, closeIt) => {
        closeIt();
        const ok = await confirmSheet({ title: 'Her şey sıfırlansın mı?', text: 'XP, seri, rozetler, öğrenilen kelimeler, sınav sonuçları ve yanlışlar silinir. Ad ve ayarlar kalır.', ok: 'Sıfırla', cancel: 'Vazgeç', okClass: 'btn--bad' });
        if (ok) {
          store.reset();
          toast('İlerleme sıfırlandı. Yeni bir başlangıç!', { tone: 'good' });
          location.hash = '#/';
        }
      },
    },
  });

  const name = el.querySelector('[data-name]');
  const saveName = () => {
    const v = cleanName(name.value);
    if (v !== store.get('name')) {
      store.set('name', v);
      toast(`Merhaba ${v}!`, { tone: 'good' });
    }
    name.value = v;
  };
  name.addEventListener('change', saveName);
  name.addEventListener('keydown', (e) => { if (e.key === 'Enter') name.blur(); });
  name.placeholder = DEFAULT_NAME;
  const gem = el.querySelector('[data-gemini]');
  gem.addEventListener('change', () => {
    store.set('geminiKey', gem.value.trim());
    toast(gem.value.trim() ? 'Yapay zekâ desteği açıldı.' : 'Yapay zekâ desteği kapatıldı.', { tone: 'good' });
  });
  bindSwitch(el.querySelector('[data-switch="sfx"]'), { value: store.get('sfx'), onChange: (v) => store.set('sfx', v) });
  bindSwitch(el.querySelector('[data-switch="slow"]'), {
    value: store.get('slow'),
    onChange: (v) => {
      store.set('slow', v);
      if (hasAudio('w-generous')) say('w-generous');
    },
  });
  bindSwitch(el.querySelector('[data-switch="autoplay"]'), { value: store.get('autoplay'), onChange: (v) => store.set('autoplay', v) });
  bindSlider(el.querySelector('[data-slider="sfxVol"]'), { value: store.get('sfxVol'), onInput: (v) => store.set('sfxVol', v), onChange: () => sfx.right() });
  bindStepper(el.querySelector('[data-stepper="goal"]'), { value: store.get('goal'), min: 20, max: 300, step: 20, format: (v) => `${v}`, onChange: (v) => store.set('goal', v) });
  bindStepper(el.querySelector('[data-stepper="examMinutes"]'), { value: store.get('examMinutes'), min: 10, max: 90, step: 5, format: (v) => `${v} dk`, onChange: (v) => store.set('examMinutes', v) });
  return close;
}
