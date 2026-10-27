// Okuma parçası: sesli paragraflar, dokununca anlamı çıkan kelimeler ve anlama soruları

import { html, raw, toHTML, Life } from '../lib/dom.js';
import { store } from '../lib/store.js';
import { addXP } from '../lib/rewards.js';
import { tappable } from '../lib/text.js';
import { icon } from '../ui/icons.js';
import { muffin } from '../ui/mascot.js';
import { fmt, sayBtn } from '../ui/kit.js';
import { peopleSVG } from '../ui/person.js';
import { readingById, lineId } from '../data/units.js';
import { mountQuestion } from '../quiz/engine.js';
import { recordMistake } from '../quiz/mistakes.js';
import { say, stopVoice, hasAudio } from '../audio/voice.js';
import { sfx } from '../audio/sfx.js';
import { burst } from '../fx/confetti.js';
import { openAsk } from './ask.js';

export function mountReading(view, id) {
  const life = new Life();
  const r = readingById(id);
  if (!r) {
    view.innerHTML = toHTML(html`<div class="page narrow"><p class="t-lead">Bu okuma parçası bulunamadı.</p></div>`);
    return {};
  }
  store.set('last', { hash: `#/okuma/${id}`, title: r.title, sub: `Ünite ${r.unit} · okuma`, pic: r.pic });
  const allAudio = r.paras.every((p) => hasAudio(lineId(p)));
  let playingAll = false;
  let right = 0;
  let answered = 0;
  const cleanups = [];

  view.innerHTML = toHTML(html`
    <div class="page narrow reading">
      <div class="ls-top"><a class="back-link" href="#/unite/${r.unit}/okuma">${icon('back')}<span>Ünite ${r.unit} okuma</span></a><button type="button" class="btn btn--small btn--ghost ls-ask">${icon('chat')}Muffin'e sor</button></div>
      <article class="card paper-sheet">
        <header class="rd-head">
          <span class="rd-pic">${r.pic}</span>
          <div><div class="eyebrow">Reading · ${r.tr}</div><h1 class="t-title">${r.title}</h1></div>
          ${allAudio ? html`<button type="button" class="btn btn--small rd-all">${icon('speaker')}Hepsini dinle</button>` : ''}
        </header>
        ${r.people ? raw(`<div class="rd-people">${peopleSVG(r.people)}</div>`) : ''}
        <div class="rd-text">
          ${r.paras.map((p, i) => html`<div class="rd-p" data-p="${i}"><p>${raw(tappable(p))}</p>${sayBtn(lineId(p))}</div>`)}
        </div>
        <p class="t-small rd-tip">${icon('bulb')}Bilmediğin kelimeye dokun, anlamı çıksın.</p>
      </article>
      <section class="rd-qs">
        <h2 class="t-big">Sorular</h2>
        ${r.questions.map((q, i) => html`<div class="card rd-q" data-q="${i}"><div class="rd-qn">${i + 1}</div><div class="rd-qhost"></div><div class="rd-why" hidden></div></div>`)}
      </section>
      <div class="rd-result"></div>
    </div>`);

  view.querySelectorAll('.rd-q').forEach((node) => {
    const i = Number(node.dataset.q);
    const q = { type: 'mc', ...r.questions[i], topic: 'reading', id: `${r.id}-q${i}` };
    cleanups.push(mountQuestion(node.querySelector('.rd-qhost'), q, {
      onAnswer: ({ correct }) => {
        answered++;
        const why = node.querySelector('.rd-why');
        why.hidden = false;
        why.innerHTML = toHTML(html`<span class="${correct ? 'cw-ok' : 'cw-no'}">${icon(correct ? 'check' : 'x')}${correct ? 'Doğru!' : 'Doğrusu işaretli.'}</span> ${fmt(q.why)}`);
        node.classList.add(correct ? 'is-ok' : 'is-no');
        const rc = node.getBoundingClientRect();
        if (correct) { right++; sfx.right(); addXP(10, { x: rc.left + rc.width / 2, y: rc.top + 20 }); } else { sfx.wrong(); recordMistake(q); }
        if (answered === r.questions.length) finish();
      },
    }));
  });

  function finish() {
    const prev = store.get('readings')[r.id];
    store.patch('readings', r.id, Math.max(prev || 0, right));
    const res = view.querySelector('.rd-result');
    res.innerHTML = toHTML(html`<div class="card pad rd-done">
      <span class="bob">${raw(muffin({ mood: right >= 4 ? 'happy' : 'wink' }))}</span>
      <div><h3 class="t-big">${right} / ${r.questions.length} doğru</h3><p class="t-lead">${right === r.questions.length ? 'Hepsini bildin, harika okuyucu!' : 'Yanlışlarını metne dönüp tekrar bulmaya çalış.'}</p></div>
      <a class="btn btn--primary" href="#/unite/${r.unit}/okuma">Diğer metinler${icon('arrow')}</a>
    </div>`);
    res.animate([{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'none' }], { duration: 400, easing: 'cubic-bezier(.22,1,.36,1)' });
    if (right >= 4) burst(window.innerWidth / 2, window.innerHeight * 0.5, { count: 60, power: 12 });
  }

  view.querySelector('.ls-ask').addEventListener('click', () => { sfx.meow(); openAsk(); });
  const allBtn = view.querySelector('.rd-all');
  if (allBtn) {
    allBtn.addEventListener('click', async () => {
      if (playingAll) {
        playingAll = false;
        stopVoice();
        return;
      }
      playingAll = true;
      allBtn.classList.add('on');
      for (let i = 0; i < r.paras.length && playingAll && life.alive; i++) {
        const p = view.querySelector(`.rd-p[data-p="${i}"]`);
        p.classList.add('reading-now');
        await say(lineId(r.paras[i]), { btn: p.querySelector('.say') });
        p.classList.remove('reading-now');
        if (!playingAll) break;
      }
      playingAll = false;
      allBtn.classList.remove('on');
    });
  }
  return {
    unmount() {
      playingAll = false;
      stopVoice();
      cleanups.forEach((fn) => fn());
      life.dispose();
    },
  };
}
