// Ünite sayfası: başlık bandı, hedefler ve sekmeler (Konular, Kelimeler, Okuma, Alıştırmalar, Sınav, Özet)

import { html, raw, toHTML } from '../lib/dom.js';
import { store, isLearned } from '../lib/store.js';
import { icon } from '../ui/icons.js';
import { starsHTML } from '../ui/kit.js';
import { segHTML, bindSeg } from '../ui/controls.js';
import { unitByN, readingsOf } from '../data/units.js';
import { CATS } from '../data/words.js';
import { setsOf } from '../quiz/sets.js';
import { unitProgress } from './home.js';
import { SHEETS } from '../ws/sheets.js';

const TABS = [['konular', 'Konular'], ['kelimeler', 'Kelimeler'], ['okuma', 'Okuma'], ['alistirma', 'Alıştırmalar'], ['kagit', 'Kağıtlar'], ['sinav', 'Sınav'], ['ozet', 'Özet']];

function lessonsTab(u) {
  const done = store.get('lessons');
  const steps = store.get('steps');
  return html`<div class="road">
    ${u.lessons.map((l, i) => {
      const isDone = !!done[l.id];
      const started = steps[l.id] != null && !isDone;
      return html`<a class="road-item card rise ${isDone ? 'done' : ''}" style="--i:${i}" href="#/ders/${l.id}">
        <span class="road-n">${isDone ? icon('check') : i + 1}</span>
        <span class="road-pic">${l.pic}</span>
        <span class="road-txt"><b>${l.title}</b><span class="hand">${l.en}</span></span>
        <span class="road-meta">${isDone ? html`<span class="tag good">Bitti</span>` : started ? html`<span class="tag gold">Devam et</span>` : html`<span class="tag gray">${icon('clock')}${l.minutes} dk</span>`}</span>
      </a>`;
    })}
  </div>`;
}

function wordsTab(u) {
  const cats = CATS[u.n];
  const all = cats.flatMap((c) => c.words);
  const learnedAll = all.filter((w) => isLearned(w.id)).length;
  return html`
    <a class="card deck-all rise" href="#/kartlar/${u.n}">
      <span class="deck-stack"><i></i><i></i><i></i></span>
      <span class="deck-txt"><b>Bütün kelimeler</b><span>${all.length} kart · ${learnedAll} tanesini öğrendin</span></span>
      <span class="btn btn--primary btn--small">${icon('cards')}Çalış</span>
    </a>
    <div class="decks">
      ${cats.map((c, i) => {
        const learned = c.words.filter((w) => isLearned(w.id)).length;
        return html`<a class="deck card rise" style="--i:${i + 1}" href="#/kartlar/${u.n}/${c.id}">
          <span class="deck-pic">${c.pic}</span>
          <b>${c.title}</b>
          <span class="hand">${c.en}</span>
          <span class="deck-foot"><span class="bar" style="--p:${(learned / c.words.length).toFixed(3)}"><i></i></span><span class="t-small">${learned}/${c.words.length}</span></span>
        </a>`;
      })}
    </div>
    <a class="btn btn--ghost" href="#/sozluk/u${u.n}">${icon('list')}Kelimeleri liste halinde gör</a>`;
}

function readingTab(u) {
  const res = store.get('readings');
  return html`<div class="readings">${readingsOf(u.n).map((r, i) => html`<a class="card reading-card rise" style="--i:${i}" href="#/okuma/${r.id}">
    <span class="rc-pic">${r.pic}</span>
    <span class="rc-txt"><b>${r.title}</b><span>${r.tr} · ${r.questions.length} soru</span></span>
    ${res[r.id] != null ? html`<span class="tag good">${res[r.id]}/${r.questions.length}</span>` : html`<span class="tag gray">${icon('read')}Oku</span>`}
  </a>`)}</div>
  <p class="t-small center">Okurken bilmediğin kelimeye dokun, anlamı hemen çıksın.</p>`;
}

function practiceTab(u) {
  const sets = setsOf(u.n);
  const res = store.get('sets');
  return html`<div class="sets">${sets.map((s, i) => {
    const r = res[s.id];
    return html`<a class="set card rise" style="--i:${i}" href="#/alistirma/${s.id}">
      <span class="set-pic">${s.pic}</span>
      <b>${s.title}</b>
      <span class="set-desc">${s.desc}</span>
      <span class="set-foot">${starsHTML(r ? r.stars : 0)}${r ? html`<span class="t-small">en iyi %${r.best}</span>` : ''}</span>
    </a>`;
  })}</div>`;
}

function examTab(u) {
  const past = store.get('exams').filter((e) => e.u === u.n).slice(-5).reverse();
  return html`<div class="card pad exam-cta rise">
    <div class="exam-paper-mini"><span></span><span></span><span></span><b>A</b></div>
    <div>
      <h3 class="t-mid">Ünite ${u.n} Deneme Sınavı</h3>
      <p class="t-lead">Okul yazılısı gibi: 20 soru, ${store.get('examMinutes')} dakika, her soru 5 puan. Sonunda bütün cevapların açıklamasıyla gelir.</p>
      <a class="btn btn--primary" href="#/sinav/${u.n}">${icon('exam')}Sınava başla</a>
    </div>
  </div>
  ${past.length ? html`<div class="past-list"><div class="eyebrow">Son sınavların</div>${past.map((e) => html`<div class="past-row"><span>${new Date(e.t).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}</span><b class="${e.score >= 85 ? 'good' : e.score >= 60 ? 'mid' : 'low'}">${e.score}</b></div>`)}</div>` : ''}`;
}

function summaryTab(u) {
  return html`<div class="card pad sum-cta rise">
    <h3 class="t-mid">Sınavdan önce oku!</h3>
    <p class="t-lead">Ünitedeki bütün kurallar, tablolar ve sık yapılan hatalar tek sayfada.</p>
    <ul class="b-list">${u.lessons.map((l) => html`<li><b>${l.title}</b></li>`)}</ul>
    <a class="btn btn--primary" href="#/ozet/${u.n}">${icon('note')}Özeti aç</a>
  </div>`;
}

function sheetsTab(u) {
  const res = store.get('sheets');
  return html`<div class="ws-cards in-unit">${SHEETS.filter((s) => s.unit === u.n).map((s, i) => html`<a class="ws-card rise" style="--i:${i}" href="#/calisma/${s.id}">
    <span class="wc-sheet" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
    <span class="wc-e">${s.e}</span><b>${s.title}</b><span class="wc-tr">${s.tr}</span>
    <span class="wc-foot">${res[s.id] && res[s.id].best != null ? html`<span class="tag ${res[s.id].best >= 85 ? 'good' : 'gold'}">en iyi %${res[s.id].best}</span>` : html`<span class="tag gray">${icon('note')}Yazdırılabilir</span>`}</span>
  </a>`)}</div>
  <p class="t-small center">Her kağıtta resimli, farklı türde sorular var. "Yeni kağıt" ile sınırsız soru!</p>`;
}

const RENDER = { konular: lessonsTab, kelimeler: wordsTab, okuma: readingTab, alistirma: practiceTab, kagit: sheetsTab, sinav: examTab, ozet: summaryTab };

export function mountUnit(view, n, tab) {
  const u = unitByN(n);
  let current = RENDER[tab] ? tab : 'konular';
  const p = unitProgress(u.n);
  view.innerHTML = toHTML(html`
    <div class="page unit">
      <section class="unit-hero" style="--uc:${u.color};--ud:${u.deep};--us:${u.soft}">
        <div class="uh-txt">
          <a class="back-link light" href="#/">${icon('back')}<span>Ana sayfa</span></a>
          <span class="uh-pill">UNIT ${u.n} · s. ${u.pages}</span>
          <h1 class="t-title">${u.title}</h1>
          <p class="uh-tr">${u.tr}</p>
          <div class="uh-stats">
            <span>${icon('book')}${p.done}/${p.lessons} konu</span>
            <span>${icon('cards')}${p.learned}/${p.words} kelime</span>
            <span>${icon('starFill')}${p.stars}/${p.maxStars} yıldız</span>
            <span>${icon('target')}%${Math.round(p.pct * 100)} tamam</span>
          </div>
        </div>
        <div class="uh-art" aria-hidden="true">${u.art.map((e, k) => html`<span class="ua a${k}">${e}</span>`)}</div>
      </section>
      <details class="card goals" ${store.get('lessons')[u.lessons[0].id] ? '' : raw('open')}>
        <summary><span>${icon('target')}<b>Bu ünitede neler öğreneceksin?</b></span>${icon('chevron')}</summary>
        <ul>${u.goals.map((g) => html`<li>${icon('check')}<span>${g}</span></li>`)}</ul>
      </details>
      <div class="tabs-wrap">${segHTML('tab', TABS, current)}</div>
      <div class="tab-body"></div>
    </div>`);
  const body = view.querySelector('.tab-body');
  const draw = (animate) => {
    body.innerHTML = toHTML(RENDER[current](u));
    if (animate) body.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 300, easing: 'cubic-bezier(.22,1,.36,1)' });
  };
  draw(false);
  const seg = bindSeg(view.querySelector('[data-seg="tab"]'), {
    value: current,
    onChange: (v) => {
      current = v;
      history.replaceState(null, '', `#/unite/${u.n}/${v}`);
      draw(true);
    },
  });
  return { unmount: () => seg.destroy() };
}
