// Konu anlatımı: adım adım kartlar, ara sorular, sonda özet ve ödül

import { html, raw, toHTML, Life } from '../lib/dom.js';
import { store } from '../lib/store.js';
import { addXP } from '../lib/rewards.js';
import { icon } from '../ui/icons.js';
import { muffin } from '../ui/mascot.js';
import { fmt } from '../ui/kit.js';
import { blocksHTML, bindBlocks } from '../ui/blocks.js';
import { lessonById, unitByN } from '../data/units.js';
import { sfx } from '../audio/sfx.js';
import { stopVoice } from '../audio/voice.js';
import { cannons } from '../fx/confetti.js';
import { openAsk } from './ask.js';

const NEXT_SET = {
  'u1-look': 'u1-who', 'u1-like': 'u1-behave', 'u1-looklike': 'u1-looklike', 'u1-comp': 'u1-comp', 'u1-write': 'u1-order',
  'u2-pdg': 'u2-pdg', 'u2-present': 'u2-present', 'u2-freq': 'u2-freq', 'u2-likes': 'u2-likes', 'u2-kit': 'u2-kit',
};

export function mountLesson(view, id) {
  const life = new Life();
  const lesson = lessonById(id);
  if (!lesson) {
    view.innerHTML = toHTML(html`<div class="page narrow"><p class="t-lead">Bu konu bulunamadı.</p><a class="btn" href="#/">Ana sayfa</a></div>`);
    return {};
  }
  const u = unitByN(lesson.unit);
  const idx = u.lessons.findIndex((l) => l.id === id);
  const nextLesson = u.lessons[idx + 1];
  const total = lesson.steps.length;
  let step = Math.min(total - 1, store.get('steps')[id] || 0);
  if (store.get('lessons')[id]) step = 0;
  let unbind = () => {};
  store.set('last', { hash: `#/ders/${id}`, title: lesson.title, sub: `Ünite ${lesson.unit} · konu anlatımı`, pic: lesson.pic });

  view.innerHTML = toHTML(html`
    <div class="page narrow lesson">
      <div class="ls-top"><a class="back-link" href="#/unite/${lesson.unit}">${icon('back')}<span>Ünite ${lesson.unit}</span></a><button type="button" class="btn btn--small btn--ghost ls-ask">${icon('chat')}Muffin'e sor</button></div>
      <header class="ls-head">
        <span class="ls-pic">${lesson.pic}</span>
        <div><div class="eyebrow">Konu ${idx + 1} / ${u.lessons.length}</div><h1 class="t-title">${lesson.title}</h1><p class="hand ls-en">${lesson.en}</p></div>
      </header>
      <div class="ls-dots" role="tablist">${lesson.steps.map((s, i) => html`<button type="button" class="ls-dot" data-go="${i}" aria-label="Adım ${i + 1}: ${s.title}"><i></i></button>`)}</div>
      <article class="card ls-card"></article>
      <nav class="ls-nav">
        <button type="button" class="btn ls-prev">${icon('back')}Geri</button>
        <span class="ls-count"></span>
        <button type="button" class="btn btn--primary ls-next">İleri${icon('arrow')}</button>
      </nav>
    </div>`);
  const card = view.querySelector('.ls-card');
  const prev = view.querySelector('.ls-prev');
  const next = view.querySelector('.ls-next');
  const count = view.querySelector('.ls-count');
  const dots = [...view.querySelectorAll('.ls-dot')];

  function draw(dir = 0) {
    unbind();
    stopVoice();
    const s = lesson.steps[step];
    card.innerHTML = toHTML(html`
      <div class="ls-step-head"><span class="ls-step-n hand">Adım ${step + 1}</span><h2 class="t-big">${s.title}</h2></div>
      <div class="ls-blocks">${blocksHTML(s.blocks)}</div>`);
    unbind = bindBlocks(card, s.blocks, {
      onCheck: (ok, x, y) => {
        if (ok) { sfx.right(); addXP(5, { x, y }); } else sfx.wrong();
      },
    });
    if (dir) card.animate([{ opacity: 0, transform: `translateX(${dir * 36}px)` }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'cubic-bezier(.22,1,.36,1)' });
    dots.forEach((d, i) => { d.classList.toggle('on', i === step); d.classList.toggle('past', i < step); });
    prev.disabled = step === 0;
    count.textContent = `${step + 1} / ${total}`;
    next.innerHTML = toHTML(step === total - 1 ? html`Konuyu bitir${icon('check')}` : html`İleri${icon('arrow')}`);
    store.patch('steps', id, step);
    if (dir) {
      const top = view.querySelector('.ls-dots').getBoundingClientRect().top + window.scrollY - 80;
      if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  function finish() {
    unbind();
    stopVoice();
    const first = !store.get('lessons')[id];
    store.patch('lessons', id, Date.now());
    store.patch('steps', id, undefined);
    const r = card.getBoundingClientRect();
    addXP(first ? 30 : 5, { x: r.left + r.width / 2, y: r.top + 60 });
    sfx.fanfare();
    cannons();
    const setId = NEXT_SET[id];
    view.querySelector('.ls-nav').hidden = true;
    dots.forEach((d) => d.classList.add('past'));
    card.innerHTML = toHTML(html`
      <div class="ls-done">
        <div class="ls-done-face bob">${raw(muffin({ mood: 'happy' }))}</div>
        <h2 class="t-title">Konu bitti, tebrikler!</h2>
        <p class="t-lead">${first ? '+30 XP kazandın.' : 'Tekrar etmek harika bir fikir. +5 XP'} Şimdi öğrendiklerini bir alıştırmayla pekiştir.</p>
        <div class="ls-sum">
          <div class="eyebrow">Akılda kalsın</div>
          <ul class="b-list">${lesson.summary.map((x) => html`<li>${fmt(x)}</li>`)}</ul>
        </div>
        <div class="row">
          ${setId ? html`<a class="btn btn--primary" href="#/alistirma/${setId}">${icon('target')}Alıştırmaya geç</a>` : ''}
          <a class="btn" href="#/calisma/${lesson.id}">${icon('note')}Çalışma kağıdı</a>
          ${nextLesson ? html`<a class="btn" href="#/ders/${nextLesson.id}">Sonraki konu: ${nextLesson.title}${icon('arrow')}</a>` : html`<a class="btn" href="#/unite/${lesson.unit}/sinav">${icon('exam')}Deneme sınavı</a>`}
          <a class="btn btn--ghost" href="#/unite/${lesson.unit}">Üniteye dön</a>
        </div>
      </div>`);
    card.animate([{ opacity: 0, transform: 'scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.22,1.2,.36,1)' });
  }

  view.querySelector('.ls-ask').addEventListener('click', () => { sfx.meow(); openAsk(); });
  next.addEventListener('click', () => {
    sfx.page();
    if (step < total - 1) { step++; draw(1); } else finish();
  });
  prev.addEventListener('click', () => {
    if (step === 0) return;
    sfx.page();
    step--;
    draw(-1);
  });
  dots.forEach((d) => d.addEventListener('click', () => {
    const to = Number(d.dataset.go);
    if (to === step) return;
    sfx.page();
    const dir = to > step ? 1 : -1;
    step = to;
    view.querySelector('.ls-nav').hidden = false;
    draw(dir);
  }));
  life.on(window, 'keydown', (e) => {
    if (e.target.closest('input, textarea') || document.querySelector('.sheet-back') || document.body.classList.contains('ask-on')) return;
    if (e.key === 'ArrowRight' && !view.querySelector('.ls-nav').hidden) next.click();
    if (e.key === 'ArrowLeft' && !view.querySelector('.ls-nav').hidden) prev.click();
  });
  draw(0);
  return { unmount: () => { unbind(); life.dispose(); } };
}
