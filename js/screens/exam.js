// Deneme sınavı: okul yazılısı görünümünde kâğıt, süre, optik form; bitince kırmızı kalemle okunur

import { html, raw, toHTML, Life, shuffle } from '../lib/dom.js';
import { store } from '../lib/store.js';
import { addXP, checkBadges } from '../lib/rewards.js';
import { icon } from '../ui/icons.js';
import { muffin } from '../ui/mascot.js';
import { fmt } from '../ui/kit.js';
import { promptHTML } from '../quiz/engine.js';
import { recordMistake } from '../quiz/mistakes.js';
import { EXAM_BANK } from '../data/units.js';
import { confirmSheet } from '../ui/overlay.js';
import { sfx } from '../audio/sfx.js';
import { cannons, burst } from '../fx/confetti.js';
import { personSVG } from '../ui/person.js';

const KEYS = ['A', 'B', 'C', 'D'];

export function mountExamHub(view) {
  const past = store.get('exams').slice(-8).reverse();
  const best = (u) => Math.max(0, ...store.get('exams').filter((e) => e.u === u).map((e) => e.score));
  view.innerHTML = toHTML(html`
    <div class="page exam-hub">
      <header class="phead"><div class="eyebrow">Okul yazılısı provası</div><h1 class="t-title">Deneme Sınavları</h1><p class="t-lead">Gerçek sınav gibi: 20 soru, her soru 5 puan, ${store.get('examMinutes')} dakika. Sonunda her sorunun açıklaması gelir.</p></header>
      <div class="exam-cards">
        ${[[1, 'Ünite 1', 'Appearance and Personality', '#8a6fd1'], [2, 'Ünite 2', 'Sports', '#3f9a85'], ['karma', 'Karma Deneme', 'İki ünite birlikte', '#ff7a9c']].map(([k, t, s, c], i) => html`<a class="card exam-card rise" style="--i:${i};--ec:${c}" href="#/sinav/${k}">
          <span class="ec-paper"><span></span><span></span><span></span><b>${k === 'karma' ? '1+2' : k}</b></span>
          <b class="ec-t">${t}</b><span class="ec-s">${s}</span>
          ${k !== 'karma' && best(k) ? html`<span class="tag good">En iyi: ${best(k)}</span>` : html`<span class="tag gray">20 soru</span>`}
        </a>`)}
      </div>
      ${past.length ? html`<section class="card pad past-card"><h2 class="t-mid">Son sınavların</h2>${past.map((e) => html`<div class="past-row"><span>${e.u === 0 ? 'Karma' : `Ünite ${e.u}`} · ${new Date(e.t).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}</span><span class="t-small">${e.right}/${e.n} doğru</span><b class="${e.score >= 85 ? 'good' : e.score >= 60 ? 'mid' : 'low'}">${e.score}</b></div>`)}</section>` : ''}
    </div>`);
  return {};
}

function pickQuestions(scope) {
  const pool = (u) => EXAM_BANK.filter((q) => q.unit === u);
  // Konulara dengeli dağıtım: her konudan sırayla bir soru
  const balanced = (list, n) => {
    const by = new Map();
    shuffle(list).forEach((q) => { if (!by.has(q.topic)) by.set(q.topic, []); by.get(q.topic).push(q); });
    const groups = shuffle([...by.values()]);
    const out = [];
    while (out.length < n && groups.some((g) => g.length)) groups.forEach((g) => { if (g.length && out.length < n) out.push(g.shift()); });
    return out;
  };
  if (scope === 'karma') return shuffle([...balanced(pool(1), 10), ...balanced(pool(2), 10)]);
  return balanced(pool(Number(scope)), 20);
}

export function mountExam(view, scope) {
  const life = new Life();
  const qs = pickQuestions(scope).map((q) => {
    // Seçeneklerin yeri her sınavda değişir
    const order = shuffle(q.opts.map((_, i) => i));
    return { ...q, opts: order.map((i) => q.opts[i]), a: order.indexOf(q.a) };
  });
  const answers = new Array(qs.length).fill(-1);
  const minutes = store.get('examMinutes');
  let left = minutes * 60;
  let finished = false;
  const title = scope === 'karma' ? 'Ünite 1 ve 2 Karma Deneme Sınavı' : `Ünite ${scope} Deneme Sınavı`;
  const year = new Date().getMonth() >= 8 ? new Date().getFullYear() : new Date().getFullYear() - 1;

  view.innerHTML = toHTML(html`
    <div class="page exam-page">
      <div class="exam-bar">
        <a class="ibtn" href="#/sinav" aria-label="Sınavdan çık">${icon('x')}</a>
        <div class="exam-timer">${icon('clock')}<b class="et-val"></b></div>
        <div class="exam-done-count"><b class="ed-n">0</b> / ${qs.length}</div>
        <button type="button" class="btn btn--primary btn--small exam-finish">${icon('check')}Sınavı bitir</button>
      </div>
      <div class="exam-layout">
        <article class="exam-sheet">
          <header class="es-head">
            <div class="es-school">${year}-${year + 1} EĞİTİM ÖĞRETİM YILI</div>
            <h1>7. SINIF İNGİLİZCE · ${title.toLocaleUpperCase('tr')}</h1>
            <div class="es-meta">
              <span>Adı Soyadı: <b class="hand">${store.get('name')}</b></span>
              <span>Süre: ${minutes} dk</span>
              <span>Her soru 5 puan</span>
            </div>
            <div class="es-score" hidden></div>
          </header>
          <ol class="es-qs">
            ${qs.map((q, i) => html`<li class="es-q" data-q="${i}" id="q${i}">
              <div class="es-qn">${i + 1}</div>
              <div class="es-qbody">
                <div class="es-prompt">${promptHTML(q, { tap: false })}</div>
                <div class="es-opts">${q.opts.map((o, j) => html`<button type="button" class="es-opt" data-o="${j}"><span class="bubble">${KEYS[j]}</span><span>${o}</span></button>`)}</div>
                <div class="es-why" hidden></div>
              </div>
              <span class="pen-mark" aria-hidden="true"></span>
            </li>`)}
          </ol>
          <div class="es-end"><button type="button" class="btn btn--primary exam-finish">${icon('check')}Sınavı bitir</button></div>
        </article>
        <aside class="optic">
          <div class="optic-title">Cevap kâğıdı</div>
          <div class="optic-grid">${qs.map((q, i) => html`<a class="optic-row" href="#q${i}" data-row="${i}"><span class="or-n">${i + 1}</span>${KEYS.map((k, j) => html`<span class="or-b" data-b="${j}">${k}</span>`)}</a>`)}</div>
        </aside>
      </div>
    </div>`);

  const timerEl = view.querySelector('.et-val');
  const countEl = view.querySelector('.ed-n');
  const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  timerEl.textContent = fmtTime(left);
  life.interval(() => {
    if (finished) return;
    left--;
    timerEl.textContent = fmtTime(Math.max(0, left));
    view.querySelector('.exam-timer').classList.toggle('low', left <= 120);
    if (left <= 0) finish(true);
  }, 1000);

  // Optik formdaki satırlar sayfa içinde kaydırır (adres çubuğu değişmez)
  view.querySelectorAll('.optic-row').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const t = view.querySelector(`#q${a.dataset.row}`);
    if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
  }), true);

  view.querySelector('.es-qs').addEventListener('click', (e) => {
    const b = e.target.closest('.es-opt');
    if (!b || finished) return;
    const li = b.closest('.es-q');
    const i = Number(li.dataset.q);
    const j = Number(b.dataset.o);
    answers[i] = answers[i] === j ? -1 : j;
    li.querySelectorAll('.es-opt').forEach((x, k) => x.classList.toggle('on', k === answers[i]));
    const row = view.querySelector(`.optic-row[data-row="${i}"]`);
    row.querySelectorAll('.or-b').forEach((x, k) => x.classList.toggle('on', k === answers[i]));
    countEl.textContent = String(answers.filter((x) => x >= 0).length);
    sfx.pen();
  });

  view.querySelectorAll('.exam-finish').forEach((b) => b.addEventListener('click', async () => {
    if (finished) return;
    const empty = answers.filter((x) => x < 0).length;
    const ok = await confirmSheet({ title: 'Sınav bitsin mi?', text: empty ? `${empty} soru boş. Boş sorular yanlış sayılır.` : 'Bütün soruları cevapladın. Kâğıdını teslim ediyor musun?', ok: 'Teslim et', cancel: 'Kontrol edeyim' });
    if (ok) finish(false);
  }));

  async function finish(timeUp) {
    if (finished) return;
    finished = true;
    view.querySelector('.exam-bar').classList.add('done');
    view.querySelectorAll('.exam-finish').forEach((b) => { b.hidden = true; });
    let right = 0;
    const items = [...view.querySelectorAll('.es-q')];
    window.scrollTo({ top: 0, behavior: 'smooth' });
    items.forEach((li, i) => {
      const q = qs[i];
      const ok = answers[i] === q.a;
      if (ok) right++;
      else recordMistake({ ...q, type: 'mc' });
      li.classList.add(ok ? 'graded-ok' : 'graded-no');
      li.querySelectorAll('.es-opt').forEach((x, k) => {
        x.disabled = true;
        if (k === q.a) x.classList.add('right');
        if (k === answers[i] && !ok) x.classList.add('wrong');
      });
      const why = li.querySelector('.es-why');
      why.hidden = false;
      why.innerHTML = toHTML(html`${answers[i] < 0 ? html`<b>Boş bırakıldı.</b> ` : ''}${fmt(q.why)}`);
      const mark = li.querySelector('.pen-mark');
      mark.innerHTML = ok
        ? '<svg viewBox="0 0 60 50"><path d="M6 26 L22 42 L54 6" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        : '<svg viewBox="0 0 60 50"><path d="M10 8 L50 44 M50 8 L10 44" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/></svg>';
      mark.style.setProperty('--d', `${0.25 + i * 0.06}s`);
      const row = view.querySelector(`.optic-row[data-row="${i}"]`);
      row.classList.add(ok ? 'ok' : 'no');
    });
    const score = Math.round((right / qs.length) * 100);
    const u = scope === 'karma' ? 0 : Number(scope);
    store.set('exams', [...store.get('exams'), { u, score, right, n: qs.length, t: Date.now() }].slice(-40));
    const sc = view.querySelector('.es-score');
    sc.hidden = false;
    sc.innerHTML = toHTML(html`
      <div class="stamp ${score >= 85 ? 'good' : score >= 60 ? 'mid' : 'low'}"><b>${score}</b><span>PUAN</span></div>
      <div class="es-verdict">
        <span class="es-face">${raw(muffin({ mood: score >= 70 ? 'happy' : score >= 50 ? 'wink' : 'think' }))}</span>
        <div><b>${timeUp ? 'Süre doldu! ' : ''}${score >= 85 ? 'Muhteşem! Sınava hazırsın.' : score >= 70 ? 'Çok iyi! Birkaç eksik kaldı.' : score >= 50 ? 'Fena değil, yanlışlarına bir göz at.' : 'Konuları bir kez daha tekrar edelim.'}</b>
        <span>${right} doğru, ${qs.length - right} yanlış/boş. Yanlışların "Yanlışlarım" bölümüne eklendi.</span></div>
      </div>
      <div class="row">
        <a class="btn btn--primary" href="#/yanlislar">${icon('redo')}Yanlışlarımı çalış</a>
        <a class="btn" href="#/sinav">${icon('exam')}Başka sınav</a>
      </div>`);
    setTimeout(() => {
      if (!life.alive) return;
      sfx.stamp();
      if (score >= 85) { sfx.fanfare(); cannons(); } else if (score >= 60) { sfx.success(); burst(window.innerWidth / 2, 200, { count: 60, power: 12 }); }
    }, 600);
    addXP(Math.round(score / 2) + 10);
    checkBadges();
  }

  return {
    guard: () => (finished ? null : { title: 'Sınavdan çıkılsın mı?', text: 'Cevapların kaydedilmeyecek.' }),
    unmount: () => life.dispose(),
  };
}

export { personSVG };
