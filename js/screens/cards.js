// Kelime kartları: dokununca dönen kartlar, sağa kaydır "biliyorum", sola kaydır "tekrar et"

import { html, raw, toHTML, Life, shuffle } from '../lib/dom.js';
import { store, markWord, wordBox } from '../lib/store.js';
import { addXP } from '../lib/rewards.js';
import { icon } from '../ui/icons.js';
import { muffin } from '../ui/mascot.js';
import { sayBtn } from '../ui/kit.js';
import { wordPic, openWord } from '../ui/word.js';
import { tappable } from '../lib/text.js';
import { CATS, POS } from '../data/words.js';
import { say, stopVoice } from '../audio/voice.js';
import { sfx } from '../audio/sfx.js';
import { burst } from '../fx/confetti.js';

export function mountCards(view, n, catId) {
  const life = new Life();
  const unit = Number(n);
  const cat = catId ? CATS[unit].find((c) => c.id === catId) : null;
  const all = cat ? cat.words : CATS[unit].flatMap((c) => c.words);
  const title = cat ? cat.title : 'Bütün kelimeler';
  store.set('last', { hash: `#/kartlar/${unit}${cat ? `/${cat.id}` : ''}`, title: `Kelime kartları: ${title}`, sub: `Ünite ${unit}`, pic: cat ? cat.pic : '🃏' });

  let deck = [];
  let i = 0;
  let known = [];
  let again = [];
  let flipped = false;
  let busy = false;

  view.innerHTML = toHTML(html`
    <div class="page narrow cards">
      <a class="back-link" href="#/unite/${unit}/kelimeler">${icon('back')}<span>Ünite ${unit} kelimeleri</span></a>
      <header class="cards-head">
        <h1 class="t-title">${title}</h1>
        <div class="cards-count"><span class="cc-ok">${icon('check')}<b>0</b></span><span class="cc-no">${icon('redo')}<b>0</b></span><span class="cc-left"></span></div>
      </header>
      <div class="bar cards-bar"><i></i></div>
      <div class="deck-stage"></div>
      <div class="cards-ctrl">
        <button type="button" class="btn btn--bad cc-again">${icon('redo')}Tekrar et</button>
        <button type="button" class="btn cc-flip">${icon('cards')}Çevir</button>
        <button type="button" class="btn btn--good cc-know">${icon('check')}Biliyorum</button>
      </div>
      <p class="t-small center cards-hint">Karta dokun ya da boşluk tuşuna bas: kart döner. Sağa kaydır: biliyorum. Sola kaydır: tekrar et.</p>
    </div>`);
  const stage = view.querySelector('.deck-stage');
  const ctrl = view.querySelector('.cards-ctrl');
  const bar = view.querySelector('.cards-bar');

  function start(list) {
    // Az bilinenler önce, aynı kutudakiler karışık
    deck = shuffle(list).sort((a, b) => wordBox(a.id) - wordBox(b.id));
    i = 0;
    known = [];
    again = [];
    ctrl.hidden = false;
    view.querySelector('.cards-hint').hidden = false;
    show();
  }

  function counts() {
    view.querySelector('.cc-ok b').textContent = String(known.length);
    view.querySelector('.cc-no b').textContent = String(again.length);
    view.querySelector('.cc-left').textContent = `${Math.min(i + 1, deck.length)} / ${deck.length}`;
    bar.style.setProperty('--p', (i / deck.length).toFixed(3));
  }

  function cardHTML(w) {
    return html`<div class="fc" tabindex="0" aria-label="${w.en} kartı">
      <div class="fc-in">
        <div class="fc-face fc-front">
          <div class="fc-pic">${wordPic(w, 'big')}</div>
          <div class="fc-en">${w.en}</div>
          <div class="hand fc-say">/${w.say}/</div>
          <div class="fc-audio">${sayBtn(`w-${w.id}`, { big: true })}${sayBtn(`w-${w.id}`, { slow: true })}</div>
          <span class="fc-tip">${icon('redo')}Anlamı için çevir</span>
        </div>
        <div class="fc-face fc-back">
          <span class="tag">${POS[w.pos] || ''}</span>
          <div class="fc-tr">${w.tr}</div>
          <div class="fc-ex"><span>${raw(tappable(w.ex))}</span>${sayBtn(`s-${w.id}`)}</div>
          <div class="fc-ex-tr">${w.exTr}</div>
          ${w.opp ? html`<div class="fc-extra"><span>Zıttı</span><b>${w.opp}</b></div>` : ''}
          ${w.comp ? html`<div class="fc-extra"><span>Karşılaştırma</span><b>${w.comp}</b></div>` : ''}
          ${w.verb ? html`<div class="fc-extra"><span>Fiili</span><b>${w.verb} ${w.en}</b></div>` : ''}
          <button type="button" class="btn btn--small btn--ghost fc-more" data-more="${w.id}">${icon('book')}Ayrıntılar</button>
        </div>
      </div>
    </div>`;
  }

  function show() {
    stopVoice();
    flipped = false;
    counts();
    const w = deck[i];
    stage.innerHTML = toHTML(html`<div class="fc-shadow"></div><div class="fc-shadow two"></div>${cardHTML(w)}`);
    const fc = stage.querySelector('.fc');
    fc.animate([{ opacity: 0, transform: 'translateY(30px) scale(.94) rotate(-2deg)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.22,1.2,.36,1)' });
    bindDrag(fc);
    if (store.get('autoplay')) life.timeout(() => say(`w-${w.id}`, { btn: fc.querySelector('.fc-front .say.big') }), 380);
  }

  function flip() {
    const fc = stage.querySelector('.fc');
    if (!fc || busy) return;
    flipped = !flipped;
    fc.classList.toggle('flipped', flipped);
    sfx.flip();
  }

  function decide(ok) {
    if (busy || i >= deck.length) return;
    busy = true;
    const w = deck[i];
    const fc = stage.querySelector('.fc');
    markWord(w.id, ok);
    (ok ? known : again).push(w);
    const r = fc.getBoundingClientRect();
    if (ok) { sfx.right(); addXP(3, { x: r.left + r.width / 2, y: r.top + 30 }); } else { sfx.soft(); addXP(1); }
    const dx = ok ? 1 : -1;
    const a = fc.animate([{ transform: fc.style.transform || 'none', opacity: 1 }, { transform: `translateX(${dx * 130}%) rotate(${dx * 18}deg)`, opacity: 0 }], { duration: 360, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards' });
    a.finished.then(() => {
      if (!life.alive) return;
      busy = false;
      i++;
      if (i >= deck.length) done();
      else show();
    }, () => { busy = false; });
  }

  function bindDrag(fc) {
    let x0 = 0;
    let y0 = 0;
    let dx = 0;
    let down = false;
    let moved = false;
    fc.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button, .tw')) return;
      down = true;
      moved = false;
      x0 = e.clientX;
      y0 = e.clientY;
      dx = 0;
      fc.setPointerCapture(e.pointerId);
    });
    fc.addEventListener('pointermove', (e) => {
      if (!down) return;
      dx = e.clientX - x0;
      if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(e.clientY - y0)) moved = true;
      if (!moved) return;
      fc.style.transform = `translateX(${dx}px) rotate(${dx / 18}deg)`;
      fc.classList.toggle('lean-ok', dx > 60);
      fc.classList.toggle('lean-no', dx < -60);
    });
    const end = () => {
      if (!down) return;
      down = false;
      fc.classList.remove('lean-ok', 'lean-no');
      if (moved && Math.abs(dx) > 90) {
        decide(dx > 0);
        return;
      }
      fc.style.transform = '';
      if (!moved) flip();
    };
    fc.addEventListener('pointerup', end);
    fc.addEventListener('pointercancel', () => { down = false; fc.style.transform = ''; });
  }

  function done() {
    stopVoice();
    ctrl.hidden = true;
    view.querySelector('.cards-hint').hidden = true;
    bar.style.setProperty('--p', '1');
    const pct = known.length / deck.length;
    stage.innerHTML = toHTML(html`<div class="card pad cards-done">
      <div class="bob">${raw(muffin({ mood: pct >= 0.7 ? 'happy' : 'wink' }))}</div>
      <h2 class="t-big">${pct >= 0.9 ? 'Bu desteyi fethettin!' : pct >= 0.6 ? 'Çok iyi gidiyorsun!' : 'Tekrar ettikçe akılda kalacak!'}</h2>
      <p class="t-lead">${known.length} kelimeyi bildin, ${again.length} kelimeyi tekrar etmek istedin.</p>
      ${again.length ? html`<div class="again-list">${again.map((w) => html`<button type="button" class="chip" data-more="${w.id}">${w.en}</button>`)}</div>` : ''}
      <div class="row">
        ${again.length ? html`<button type="button" class="btn btn--primary" id="redo-again">${icon('redo')}Bilmediklerimi tekrar et</button>` : ''}
        <button type="button" class="btn" id="redo-all">${icon('shuffle')}Baştan karıştır</button>
        <a class="btn btn--ghost" href="#/alistirma/u${unit}-vocab">${icon('target')}Kelime testi</a>
      </div>
    </div>`);
    if (pct >= 0.6) burst(window.innerWidth / 2, window.innerHeight * 0.35, { count: 60, power: 12 });
    sfx.success();
    const ra = stage.querySelector('#redo-again');
    if (ra) ra.addEventListener('click', () => start(again.slice()));
    stage.querySelector('#redo-all').addEventListener('click', () => start(all));
  }

  ctrl.addEventListener('click', (e) => {
    if (e.target.closest('.cc-flip')) flip();
    else if (e.target.closest('.cc-know')) decide(true);
    else if (e.target.closest('.cc-again')) decide(false);
  });
  stage.addEventListener('click', (e) => {
    const m = e.target.closest('[data-more]');
    if (m) openWord(m.dataset.more);
  });
  life.on(window, 'keydown', (e) => {
    if (e.target.closest('input, textarea') || document.querySelector('.sheet-back') || document.body.classList.contains('ask-on') || ctrl.hidden) return;
    if (e.code === 'Space') { e.preventDefault(); flip(); }
    if (e.key === 'ArrowRight') decide(true);
    if (e.key === 'ArrowLeft') decide(false);
  });
  start(all);
  return { unmount: () => { stopVoice(); life.dispose(); } };
}
