// Ünite özeti: sınavdan önce okunacak tek sayfa (kurallar, tablolar, sık yapılan hatalar). Yazdırılabilir.

import { html, toHTML } from '../lib/dom.js';
import { icon } from '../ui/icons.js';
import { fmt } from '../ui/kit.js';
import { blocksHTML, bindBlocks } from '../ui/blocks.js';
import { unitByN } from '../data/units.js';

const KEY_BLOCKS = {
  1: [
    { t: 'table', head: ['Soru', 'Neyi sorar?', 'Örnek cevap'], rows: [['What does she look like?', 'Dış görünüş', 'She is tall. She has got curly hair.'], ['What is she like?', 'Kişilik', 'She is kind and funny.'], ['Who does she look like?', 'Kime benziyor?', 'She looks like her dad.']] },
    { t: 'table', head: ['Sıfat', 'Karşılaştırma', 'Kural'], rows: [['tall', 'taller', '-er'], ['nice', 'nicer', '-r'], ['big', 'bigger', 'harf çiftlenir'], ['funny', 'funnier', 'y → ier'], ['generous', 'more generous', 'more'], ['good / bad', 'better / worse', 'düzensiz']] },
    { t: 'pairs', list: [['friendly', 'unfriendly'], ['hard-working', 'lazy'], ['generous', 'selfish'], ['polite', 'rude'], ['outgoing', 'shy'], ['talkative', 'quiet'], ['patient', 'impatient'], ['careful', 'careless'], ['tidy', 'messy'], ['honest', 'dishonest'], ['tall', 'short'], ['straight', 'curly']] },
  ],
  2: [
    { t: 'table', head: ['PLAY', 'DO', 'GO'], rows: [['football, volleyball', 'karate, judo', 'swimming, cycling'], ['tennis, basketball', 'yoga, gymnastics', 'skiing, hiking'], ['chess, golf', 'boxing, wrestling (!)', 'camping, bowling (!)']] },
    { t: 'scale' },
    { t: 'table', head: ['Kalıp', 'Örnek'], rows: [['love / like / enjoy + -ing', 'I enjoy swimming.'], ["don't mind / can't stand + -ing", "I can't stand losing."], ['good at / interested in', "I'm good at chess."], ['How often...?', 'Twice a week.']] },
  ],
};

export function mountSummary(view, n) {
  const u = unitByN(n);
  const mistakes = u.lessons.flatMap((l) => l.steps.flatMap((s) => s.blocks.filter((b) => b.t === 'right')));
  const key = KEY_BLOCKS[u.n];
  view.innerHTML = toHTML(html`
    <div class="page narrow summary">
      <a class="back-link" href="#/unite/${u.n}">${icon('back')}<span>Ünite ${u.n}</span></a>
      <header class="sum-head">
        <div><div class="eyebrow">Sınavdan önce oku</div><h1 class="t-title">Ünite ${u.n} Özeti</h1><p class="t-lead">${u.title} · ${u.tr}</p></div>
        <button type="button" class="btn btn--small" id="print">${icon('note')}Yazdır</button>
      </header>
      <div class="sum-grid">
        ${u.lessons.map((l, i) => html`<section class="card sum-card tape ${i % 2 ? 'pink' : ''}">
          <div class="sum-title"><span>${l.pic}</span><h2 class="t-mid">${l.title}</h2></div>
          <ul class="b-list">${l.summary.map((x) => html`<li>${fmt(x)}</li>`)}</ul>
          <a class="sum-link" href="#/ders/${l.id}">Konuya git${icon('chevron')}</a>
        </section>`)}
      </div>
      <section class="card pad sum-key">
        <h2 class="t-big">Tablolar</h2>
        <div class="sum-blocks">${blocksHTML(key)}</div>
      </section>
      <section class="card pad sum-key">
        <h2 class="t-big">Sık yapılan hatalar</h2>
        <div class="sum-blocks mistakes-blocks">${blocksHTML(mistakes)}</div>
      </section>
    </div>`);
  const unbind = [bindBlocks(view.querySelector('.sum-blocks'), key), bindBlocks(view.querySelector('.mistakes-blocks'), mistakes)];
  view.querySelector('#print').addEventListener('click', () => window.print());
  return { unmount: () => unbind.forEach((f) => f()) };
}
