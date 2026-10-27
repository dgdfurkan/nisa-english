// Alıştırma ekranı: soruları tek tek sorar, anında geri bildirim verir, sonunda yıldız ve özet gösterir.
// "yanlis" kimliğiyle açılırsa Yanlışlarım defterindeki soruları çözdürür.

import { html, raw, toHTML, Life, pick } from '../lib/dom.js';
import { store, markWord } from '../lib/store.js';
import { addXP } from '../lib/rewards.js';
import { icon } from '../ui/icons.js';
import { muffin } from '../ui/mascot.js';
import { fmt, starsHTML } from '../ui/kit.js';
import { setById } from '../quiz/sets.js';
import { mountQuestion, answerText } from '../quiz/engine.js';
import { recordMistake, recordFix, mistakeList } from '../quiz/mistakes.js';
import { openAsk } from './ask.js';
import { sfx } from '../audio/sfx.js';
import { burst, cannons } from '../fx/confetti.js';
import { stopVoice } from '../audio/voice.js';

const PRAISE = ['Harika!', 'Süpersin!', 'Doğru!', 'Tam isabet!', 'Aynen böyle!', 'Mükemmel!', 'Çok iyi!'];
const COMBO = { 3: '3 doğru üst üste!', 5: '5 doğru üst üste! Alev aldın!', 8: '8 doğru üst üste! Durdurulamıyorsun!' };

export function mountPractice(view, id) {
  const life = new Life();
  const fixMode = id === 'yanlis';
  const set = fixMode ? { id: 'yanlis', unit: 0, title: 'Yanlışlarım', pic: '🩹' } : setById(id);
  if (!set) {
    view.innerHTML = toHTML(html`<div class="page narrow"><p class="t-lead">Bu alıştırma bulunamadı.</p><a class="btn" href="#/">Ana sayfaya dön</a></div>`);
    return { unmount: () => life.dispose() };
  }
  const back = fixMode ? '#/yanlislar' : `#/unite/${set.unit}/alistirma`;
  if (!fixMode) store.set('last', { hash: `#/alistirma/${set.id}`, title: set.title, sub: `Ünite ${set.unit} alıştırması`, pic: set.pic });

  let questions = [];
  let i = 0;
  let right = 0;
  let combo = 0;
  let best = 0;
  let xp = 0;
  let wrongs = [];
  let cleanup = () => {};
  let fbKey = null;

  view.innerHTML = toHTML(html`
    <div class="page narrow run">
      <div class="run-top">
        <a class="ibtn" href="${back}" aria-label="Alıştırmadan çık">${icon('x')}</a>
        <div class="run-bar"><i></i></div>
        <div class="run-combo" aria-live="polite"></div>
        <div class="run-count"></div>
      </div>
      <div class="run-title"><span class="run-pic">${set.pic}</span><span>${set.title}</span></div>
      <div class="run-stage"></div>
      <div class="feedback" hidden></div>
    </div>`);
  const stage = view.querySelector('.run-stage');
  const fb = view.querySelector('.feedback');
  const bar = view.querySelector('.run-bar i');
  const countEl = view.querySelector('.run-count');
  const comboEl = view.querySelector('.run-combo');

  function start() {
    questions = fixMode ? mistakeList().slice(0, 10).map((x) => x.q) : set.make();
    i = 0; right = 0; combo = 0; best = 0; xp = 0; wrongs = [];
    if (!questions.length) {
      stage.innerHTML = toHTML(html`<div class="card pad done-card">${raw(muffin({ mood: 'happy' }))}<h2 class="t-big">Defterin tertemiz!</h2><p class="t-lead">Çözülecek yanlış soru kalmadı.</p><a class="btn btn--primary" href="#/">Ana sayfa</a></div>`);
      return;
    }
    show();
  }

  function progress() {
    bar.style.width = `${(i / questions.length) * 100}%`;
    countEl.textContent = `${Math.min(i + 1, questions.length)} / ${questions.length}`;
  }

  function show() {
    cleanup();
    stopVoice();
    hideFeedback();
    progress();
    const q = questions[i];
    const card = document.createElement('div');
    card.className = 'q-card card';
    stage.replaceChildren(card);
    card.animate([{ opacity: 0, transform: 'translateX(40px) rotate(1deg)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
    cleanup = mountQuestion(card, q, { onAnswer: (r) => answered(q, r, card) });
  }

  function answered(q, r, card) {
    if (q.ref && q.topic === 'vocab') markWord(q.ref, r.correct);
    if (r.correct) {
      right++;
      combo++;
      best = Math.max(best, combo);
      const gain = 10 + (combo >= 3 ? 2 : 0);
      xp += gain;
      const rect = card.getBoundingClientRect();
      addXP(gain, { x: rect.left + rect.width / 2, y: rect.top + 40 });
      if (q.type !== 'match' && q.type !== 'sort') sfx.right();
      if (COMBO[combo]) {
        sfx.combo(combo);
        comboEl.innerHTML = toHTML(html`${icon('flame')}<span>${combo}</span>`);
        comboEl.classList.remove('pop');
        void comboEl.offsetWidth;
        comboEl.classList.add('pop');
      } else if (combo >= 3) {
        comboEl.innerHTML = toHTML(html`${icon('flame')}<span>${combo}</span>`);
      }
      if (fixMode) recordFix(q);
    } else {
      combo = 0;
      comboEl.innerHTML = '';
      if (q.type !== 'match' && q.type !== 'sort') sfx.wrong();
      wrongs.push(q);
      recordMistake(q);
      card.classList.remove('shake');
      void card.offsetWidth;
      card.classList.add('shake');
    }
    life.timeout(() => showFeedback(q, r), q.type === 'match' || q.type === 'sort' ? 150 : 380);
  }

  function hideFeedback() {
    fb.hidden = true;
    fb.className = 'feedback';
    if (fbKey) window.removeEventListener('keydown', fbKey);
    fbKey = null;
  }

  function showFeedback(q, r) {
    const ans = answerText(q);
    const ok = r.correct;
    const title = ok ? (COMBO[combo] || pick(PRAISE)) : (q.type === 'match' || q.type === 'sort' ? `${r.mistakes} hata yaptın` : 'Olsun, öğreniyoruz!');
    fb.innerHTML = toHTML(html`
      <div class="fb-in">
        <div class="fb-face">${raw(muffin({ mood: ok ? 'happy' : 'sad' }))}</div>
        <div class="fb-txt">
          <b class="fb-title">${title}</b>
          ${!ok && ans && !(q.why || '').includes(ans) ? html`<div class="fb-ans">Doğrusu: <b>${ans}</b></div>` : ''}
          ${q.why ? html`<div class="fb-why">${fmt(q.why.replace(/\n/g, ' · '))}</div>` : ''}
        </div>
        <div class="fb-btns">
          ${!ok ? html`<button type="button" class="btn btn--small fb-ask">${icon('chat')}Muffin'e sor</button>` : ''}
          <button type="button" class="btn ${ok ? 'btn--good' : 'btn--bad'} fb-next">${i + 1 < questions.length ? 'Devam' : 'Sonucu gör'}${icon('arrow')}</button>
        </div>
      </div>`);
    fb.hidden = false;
    fb.classList.add(ok ? 'ok' : 'no');
    fb.animate([{ transform: 'translateY(110%)' }, { transform: 'none' }], { duration: 380, easing: 'cubic-bezier(.22,1.15,.36,1)' });
    const next = fb.querySelector('.fb-next');
    next.focus({ preventScroll: true });
    next.addEventListener('click', advance);
    const askBtn = fb.querySelector('.fb-ask');
    if (askBtn) askBtn.addEventListener('click', () => openAsk(null, { question: q, answer: ans }));
    fbKey = (e) => {
      if (e.key === 'Enter' && !document.querySelector('.sheet-back') && !e.target.closest('input, textarea')) {
        e.preventDefault();
        advance();
      }
    };
    window.addEventListener('keydown', fbKey);
  }

  function advance() {
    sfx.tap();
    i++;
    if (i >= questions.length) finish();
    else show();
  }

  function finish() {
    cleanup();
    hideFeedback();
    bar.style.width = '100%';
    const pct = right / questions.length;
    const stars = pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : pct >= 0.4 ? 1 : 0;
    if (!fixMode) {
      const prev = store.get('sets')[set.id] || { best: 0, stars: 0, plays: 0 };
      store.patch('sets', set.id, { best: Math.max(prev.best, Math.round(pct * 100)), stars: Math.max(prev.stars, stars), plays: prev.plays + 1, t: Date.now() });
      const bonus = stars * 5;
      if (bonus) addXP(bonus);
      xp += bonus;
    }
    const head = ['Tekrar deneyelim!', 'Güzel başlangıç!', 'Çok iyi!', 'Muhteşem!'][stars];
    stage.innerHTML = toHTML(html`
      <div class="card pad result">
        <div class="result-face">${raw(muffin({ mood: stars >= 2 ? 'happy' : stars === 1 ? 'wink' : 'think' }))}</div>
        <h2 class="t-title">${head}</h2>
        <div class="result-stars">${starsHTML(stars)}</div>
        <div class="result-stats">
          <div><b>${right}/${questions.length}</b><span>doğru</span></div>
          <div><b>%${Math.round(pct * 100)}</b><span>başarı</span></div>
          <div><b>+${xp}</b><span>XP</span></div>
          <div><b>${best}</b><span>en uzun seri</span></div>
        </div>
        ${wrongs.length ? html`<div class="review">
          <div class="eyebrow">Gözden geçir</div>
          ${wrongs.filter((q) => q.type === 'mc' || q.type === 'order').map((q) => html`<div class="rv-item">
            <div class="rv-q">${q.type === 'order' ? q.hint : q.pickPeople ? q.q : q.q.replace(/\n/g, ' / ')}</div>
            <div class="rv-a">${icon('check')}<span>${answerText(q)}</span></div>
            ${q.why ? html`<div class="rv-why">${fmt(q.why.replace(/\n/g, ' · '))}</div>` : ''}
          </div>`)}
        </div>` : ''}
        <div class="row">
          <button type="button" class="btn btn--primary" id="again">${icon('redo')}${fixMode ? 'Devam et' : 'Yeni sorularla tekrar'}</button>
          ${!fixMode && wrongs.length ? html`<a class="btn" href="#/yanlislar">${icon('note')}Yanlışlarım</a>` : ''}
          <a class="btn btn--ghost" href="${back}">${fixMode ? 'Yanlışlarım' : 'Üniteye dön'}</a>
        </div>
      </div>`);
    stage.querySelector('#again').addEventListener('click', () => { sfx.tap(); start(); });
    if (stars >= 2) {
      sfx.fanfare();
      if (stars === 3) cannons();
      else burst(window.innerWidth / 2, window.innerHeight * 0.35, { count: 80, power: 14 });
    } else {
      sfx.success();
    }
    countEl.textContent = '';
    comboEl.innerHTML = '';
  }

  start();
  return {
    unmount() {
      cleanup();
      hideFeedback();
      life.dispose();
    },
  };
}
