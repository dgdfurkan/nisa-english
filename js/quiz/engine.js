// Soru çizici: çoktan seçmeli, eşleştirme, cümle kurma ve gruplama.
// mountQuestion(host, q, { onAnswer }) soruyu kurar ve cevap verilince bir kez onAnswer({ correct }) çağırır.

import { html, raw, toHTML, el, shuffle } from '../lib/dom.js';
import { tappable } from '../lib/text.js';
import { icon } from '../ui/icons.js';
import { fmt, sayBtn, tableHTML } from '../ui/kit.js';
import { personSVG, peopleSVG } from '../ui/person.js';
import { say } from '../audio/voice.js';
import { sfx } from '../audio/sfx.js';

const KEYS = ['A', 'B', 'C', 'D', 'E'];

// Soru metni: satırlar, "A: ..." diyalog satırları, ______ boşlukları
export function promptHTML(q, { tap = true } = {}) {
  const lines = String(q.q || '').split('\n').filter((l) => l.length);
  const line = (l) => {
    const m = l.match(/^([A-ZÇĞİÖŞÜ][a-zA-ZçğıöşüÇĞİÖŞÜ]{0,12}):\s(.*)$/);
    const body = (t) => raw((tap ? tappable(t) : toHTML(html`${t}`)).replace(/_{3,}/g, '<span class="blank"></span>'));
    if (m) return html`<div class="dl"><span class="dl-who">${m[1]}</span><span class="dl-say">${body(m[2])}</span></div>`;
    return html`<div class="ql">${body(l)}</div>`;
  };
  return html`
    ${q.people ? raw(`<div class="q-people">${q.people.length > 1 ? peopleSVG(q.people) : personSVG(q.people[0])}</div>`) : ''}
    ${q.table ? tableHTML(q.table) : ''}
    ${q.listen ? html`<div class="q-listen">${sayBtn(q.audio, { big: true })}${sayBtn(q.audio, { slow: true })}</div>` : ''}
    ${lines.length ? html`<div class="q-text ${q.big ? 'big' : ''} ${lines.some((l) => /^[A-Z][a-z]*:\s/.test(l)) ? 'dialog' : ''}">${lines.map(line)}${q.audio && !q.listen ? sayBtn(q.audio) : ''}</div>` : ''}
    ${q.hint ? html`<div class="q-hint">${icon('bulb')}<span>${q.hint}</span></div>` : ''}`;
}

function mountMC(host, q, done, opts) {
  host.innerHTML = toHTML(html`
    <div class="q q-mc">
      <div class="q-top">${q.sub ? html`<div class="q-sub">${q.sub}</div>` : ''}${promptHTML(q, opts)}</div>
      <div class="q-opts ${q.pickPeople ? 'pics' : ''} ${q.opts.every((o) => typeof o === 'string' && o.length < 22) ? 'short' : ''}">
        ${q.opts.map((o, i) => html`<button type="button" class="opt rise" style="--i:${i}" data-i="${i}">
          <span class="opt-key">${KEYS[i]}</span>
          ${q.pickPeople ? raw(personSVG(o)) : html`<span class="opt-txt">${o}</span>`}
          <span class="opt-mark"></span>
        </button>`)}
      </div>
    </div>`);
  let answered = false;
  const buttons = [...host.querySelectorAll('.opt')];
  const choose = (i) => {
    if (answered) return;
    answered = true;
    const correct = i === q.a;
    buttons.forEach((b, j) => {
      b.disabled = true;
      if (j === q.a) b.classList.add('right');
      if (j === i && !correct) b.classList.add('wrong');
      if (j !== i && j !== q.a) b.classList.add('dim');
    });
    const mark = buttons[i].querySelector('.opt-mark');
    mark.innerHTML = toHTML(icon(correct ? 'check' : 'x'));
    if (!correct) buttons[q.a].querySelector('.opt-mark').innerHTML = toHTML(icon('check'));
    done({ correct, picked: i });
  };
  host.addEventListener('click', (e) => {
    const b = e.target.closest('.opt');
    if (b) choose(Number(b.dataset.i));
  });
  const onKey = (e) => {
    if (answered || e.target.closest('input, textarea') || document.querySelector('.sheet-back')) return;
    const k = e.key.toUpperCase();
    const i = KEYS.indexOf(k) >= 0 ? KEYS.indexOf(k) : Number(e.key) - 1;
    if (i >= 0 && i < q.opts.length) choose(i);
  };
  window.addEventListener('keydown', onKey);
  if (q.autoplay && q.audio) setTimeout(() => { if (host.isConnected) say(q.audio, { btn: host.querySelector('.say.big') }); }, 450);
  return () => window.removeEventListener('keydown', onKey);
}

function mountMatch(host, q, done) {
  const left = shuffle(q.pairs.map(([a], i) => ({ t: a, i })));
  const right = shuffle(q.pairs.map(([, b], i) => ({ t: b, i })));
  host.innerHTML = toHTML(html`
    <div class="q q-match">
      <div class="q-top"><div class="q-text"><div class="ql">${q.q}</div></div>${q.sub ? html`<div class="q-sub">${q.sub}</div>` : ''}</div>
      <div class="match">
        <div class="m-col">${left.map((x, k) => html`<button type="button" class="m-item rise" style="--i:${k}" data-side="l" data-i="${x.i}">${x.t}</button>`)}</div>
        <div class="m-col">${right.map((x, k) => html`<button type="button" class="m-item rise" style="--i:${k + 1}" data-side="r" data-i="${x.i}">${x.t}</button>`)}</div>
      </div>
    </div>`);
  let sel = null;
  let mistakes = 0;
  let matched = 0;
  host.addEventListener('click', (e) => {
    const b = e.target.closest('.m-item');
    if (!b || b.classList.contains('done')) return;
    if (!sel || sel.dataset.side === b.dataset.side) {
      if (sel) sel.classList.remove('sel');
      sel = b;
      b.classList.add('sel');
      sfx.tap();
      return;
    }
    const a = sel;
    sel = null;
    a.classList.remove('sel');
    if (a.dataset.i === b.dataset.i) {
      matched++;
      const hue = matched;
      [a, b].forEach((x) => { x.classList.add('done', `c${hue % 5}`); x.disabled = true; });
      sfx.right();
      if (matched === q.pairs.length) setTimeout(() => done({ correct: mistakes <= 1, mistakes }), 350);
    } else {
      mistakes++;
      sfx.wrong();
      [a, b].forEach((x) => { x.classList.remove('shake'); void x.offsetWidth; x.classList.add('shake'); });
    }
  });
}

function mountOrder(host, q, done) {
  const tokens = q.tokens.map((t, i) => ({ t, i }));
  let bank = shuffle(tokens);
  // Karışık hali cevapla aynı çıkarsa bir kez daha karıştır
  if (bank.map((x) => x.t).join(' ') === q.answer) bank = bank.slice().reverse();
  const placed = [];
  host.innerHTML = toHTML(html`
    <div class="q q-order">
      <div class="q-top"><div class="q-text"><div class="ql">${q.q}</div></div>${q.hint ? html`<div class="q-hint">${icon('bulb')}<span>${q.hint}</span></div>` : ''}</div>
      <div class="o-line" aria-label="Cümlen"></div>
      <div class="o-bank"></div>
      <div class="row"><button type="button" class="btn btn--primary o-check" disabled>${icon('check')}Kontrol et</button></div>
    </div>`);
  const line = host.querySelector('.o-line');
  const bankEl = host.querySelector('.o-bank');
  const check = host.querySelector('.o-check');
  let answered = false;
  const tile = (x, where) => html`<button type="button" class="tile" data-k="${x.i}" data-where="${where}">${x.t}</button>`;
  const draw = () => {
    // FLIP: kutucuk yeni yerine kayarak gider
    const before = new Map([...host.querySelectorAll('.tile')].map((b) => [b.dataset.k, b.getBoundingClientRect()]));
    line.innerHTML = toHTML(html`${placed.map((x, n) => html`${n && q.sep ? html`<span class="o-sep">${q.sep}</span>` : ''}${tile(x, 'line')}`)}`);
    bankEl.innerHTML = toHTML(html`${bank.map((x) => tile(x, 'bank'))}`);
    line.classList.toggle('empty', !placed.length);
    host.querySelectorAll('.tile').forEach((b) => {
      const r0 = before.get(b.dataset.k);
      if (!r0) return;
      const r1 = b.getBoundingClientRect();
      const dx = r0.left - r1.left;
      const dy = r0.top - r1.top;
      if (dx || dy) b.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 320, easing: 'cubic-bezier(.22,1,.36,1)' });
    });
    check.disabled = bank.length > 0 || answered;
  };
  draw();
  host.addEventListener('click', (e) => {
    const b = e.target.closest('.tile');
    if (!b || answered) return;
    const k = Number(b.dataset.k);
    if (b.dataset.where === 'bank') {
      const i = bank.findIndex((x) => x.i === k);
      placed.push(bank.splice(i, 1)[0]);
    } else {
      const i = placed.findIndex((x) => x.i === k);
      bank.push(placed.splice(i, 1)[0]);
    }
    sfx.tap();
    draw();
  });
  check.addEventListener('click', () => {
    if (answered) return;
    answered = true;
    check.disabled = true;
    const got = placed.map((x) => x.t).join(' ');
    const norm = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim();
    const correct = [q.answer, ...(q.alts || [])].some((a) => norm(a) === norm(got));
    line.classList.add(correct ? 'right' : 'wrong');
    if (!correct) {
      line.insertAdjacentHTML('afterend', toHTML(html`<div class="o-answer">${icon('check')}<span>${q.answer}${q.end || ''}</span></div>`));
    }
    done({ correct });
  });
}

function mountSort(host, q, done) {
  const items = shuffle(q.items.map((x, i) => ({ ...x, i })));
  host.innerHTML = toHTML(html`
    <div class="q q-sort">
      <div class="q-top"><div class="q-text"><div class="ql">${q.q}</div></div>${q.sub ? html`<div class="q-sub">${q.sub}</div>` : ''}</div>
      <div class="bins">${q.bins.map((b) => html`<button type="button" class="bin" data-bin="${b.id}"><span class="bin-label">${b.label}</span><span class="bin-items"></span></button>`)}</div>
      <div class="s-items">${items.map((x, k) => html`<button type="button" class="s-item rise" style="--i:${k}" data-i="${x.i}">${x.pic ? html`<span class="s-pic">${x.pic}</span>` : ''}${x.text}</button>`)}</div>
    </div>`);
  let sel = null;
  let mistakes = 0;
  let left = items.length;
  const bins = [...host.querySelectorAll('.bin')];
  host.addEventListener('click', (e) => {
    const it = e.target.closest('.s-item');
    if (it && !it.classList.contains('done')) {
      if (sel) sel.classList.remove('sel');
      sel = it === sel ? null : it;
      if (sel) sel.classList.add('sel');
      host.classList.toggle('picking', !!sel);
      sfx.tap();
      return;
    }
    const bin = e.target.closest('.bin');
    if (!bin || !sel) return;
    const x = q.items[Number(sel.dataset.i)];
    const node = sel;
    sel = null;
    host.classList.remove('picking');
    node.classList.remove('sel');
    if (x.bin === bin.dataset.bin) {
      const r0 = node.getBoundingClientRect();
      const chip = el(html`<span class="bin-chip">${x.text}</span>`);
      bin.querySelector('.bin-items').append(chip);
      const r1 = chip.getBoundingClientRect();
      chip.animate([{ transform: `translate(${r0.left - r1.left}px, ${r0.top - r1.top}px) scale(1.2)`, opacity: 0.6 }, { transform: 'none', opacity: 1 }], { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
      node.classList.add('done');
      node.disabled = true;
      bin.classList.remove('hit');
      void bin.offsetWidth;
      bin.classList.add('hit');
      sfx.right();
      left--;
      if (!left) setTimeout(() => done({ correct: mistakes <= 1, mistakes }), 400);
    } else {
      mistakes++;
      sfx.wrong();
      [node, bin].forEach((n) => { n.classList.remove('shake'); void n.offsetWidth; n.classList.add('shake'); });
    }
  });
  bins.forEach((b) => b.setAttribute('aria-label', `${b.dataset.bin} kutusu`));
}

export function mountQuestion(host, q, { onAnswer, tap = true } = {}) {
  let fired = false;
  const done = (r) => {
    if (fired) return;
    fired = true;
    if (onAnswer) onAnswer(r);
  };
  if (q.type === 'match') return mountMatch(host, q, done) || (() => {});
  if (q.type === 'order') return mountOrder(host, q, done) || (() => {});
  if (q.type === 'sort') return mountSort(host, q, done) || (() => {});
  return mountMC(host, q, done, { tap }) || (() => {});
}

// Doğru cevabın metni (geri bildirim ve yanlışlar defteri için)
export function answerText(q) {
  if (q.type === 'mc') return q.pickPeople ? 'Resimde işaretli kişi' : q.opts[q.a];
  if (q.type === 'order') return `${q.answer}${q.end || ''}`;
  return '';
}
