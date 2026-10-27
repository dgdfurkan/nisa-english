// Yanlışlarım: yanlış yapılan sorular, doğru cevapları ve açıklamalarıyla. İki kez doğru çözülünce defterden çıkar.

import { html, raw, toHTML } from '../lib/dom.js';
import { store } from '../lib/store.js';
import { icon } from '../ui/icons.js';
import { muffin } from '../ui/mascot.js';
import { fmt } from '../ui/kit.js';
import { personSVG } from '../ui/person.js';
import { answerText } from '../quiz/engine.js';
import { mistakeList } from '../quiz/mistakes.js';
import { confirmSheet, toast } from '../ui/overlay.js';

export function mountMistakes(view) {
  const draw = () => {
    const list = mistakeList();
    view.innerHTML = toHTML(html`
      <div class="page narrow mistakes">
        <header class="phead">
          <div class="eyebrow">Sınavdan önceki en değerli sayfa</div>
          <h1 class="t-title">Yanlışlarım</h1>
          <p class="t-lead">Alıştırmalarda ve sınavlarda yanlış yaptığın sorular burada birikir. Bir soruyu <b>iki kez doğru</b> çözünce defterden silinir.</p>
        </header>
        ${list.length ? html`
          <div class="card mis-cta">
            <span class="mis-face bob">${raw(muffin({ mood: 'wink' }))}</span>
            <div><b class="t-mid">${list.length} soru seni bekliyor</b><span class="t-small">Her turda en yeni 10 soru gelir. Toplam ${store.get('fixed')} soruyu düzelttin.</span></div>
            <a class="btn btn--primary" href="#/alistirma/yanlis">${icon('redo')}Hepsini çöz</a>
          </div>
          <div class="mis-list">
            ${list.map((m, i) => html`<div class="card mis rise" style="--i:${Math.min(i, 10)}">
              <div class="mis-top"><span class="tag bad">${m.n} kez yanlış</span>${m.ok ? html`<span class="tag good">${m.ok}/2 düzeltildi</span>` : ''}${m.q.unit ? html`<span class="tag gray">Ünite ${m.q.unit}</span>` : ''}</div>
              ${m.q.people && !m.q.pickPeople ? raw(`<div class="mis-people">${m.q.people.map((p) => personSVG(p)).join('')}</div>`) : ''}
              <div class="mis-q">${(m.q.type === 'order' ? m.q.hint : m.q.q || '').split('\n').map((l) => html`<div>${l}</div>`)}</div>
              <div class="mis-a">${icon('check')}<span>${answerText(m.q)}</span></div>
              ${m.q.why ? html`<div class="mis-why">${fmt(m.q.why.replace(/\n/g, ' · '))}</div>` : ''}
            </div>`)}
          </div>
          <div class="row"><button type="button" class="btn btn--ghost" id="clear-all">${icon('trash')}Defteri temizle</button></div>
        ` : html`<div class="card pad empty-card">
            <span class="empty-face bob">${raw(muffin({ mood: 'happy' }))}</span>
            <h2 class="t-big">Defterin tertemiz!</h2>
            <p class="t-lead">Şu an düzeltilecek yanlışın yok. Alıştırma ya da deneme sınavı çözdükçe yanlışların buraya gelir.</p>
            <div class="row"><a class="btn btn--primary" href="#/sinav">${icon('exam')}Deneme sınavı</a><a class="btn" href="#/">Ana sayfa</a></div>
          </div>`}
      </div>`);
    const c = view.querySelector('#clear-all');
    if (c) {
      c.addEventListener('click', async () => {
        const ok = await confirmSheet({ title: 'Defter temizlensin mi?', text: 'Bütün yanlışlar silinir. Bu işlem geri alınamaz.', ok: 'Temizle', cancel: 'Vazgeç', okClass: 'btn--bad' });
        if (ok) {
          store.set('mistakes', {});
          toast('Yanlışlar defteri temizlendi.', { tone: 'good' });
          draw();
        }
      });
    }
  };
  draw();
  return {};
}
