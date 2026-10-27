// Konu anlatımı blokları: açıklama, örnek, kural, tablo, ipucu, uyarı, doğru/yanlış, kişiler,
// ara soru, liste, diyalog, zıt çiftler, sıklık ölçeği ve paragraf makinesi.
// Hem ders ekranında hem Muffin'in cevaplarında kullanılır.

import { html, raw, toHTML } from '../lib/dom.js';
import { tappable } from '../lib/text.js';
import { lineId } from '../data/units.js';
import { WORD } from '../data/words.js';
import { icon } from './icons.js';
import { muffin } from './mascot.js';
import { fmt, sayBtn, tableHTML } from './kit.js';
import { personSVG } from './person.js';
import { mountQuestion } from '../quiz/engine.js';
import { mountBuilder } from './builder.js';
import { mountViz } from './viz.js';
import { openWord } from './word.js';

const SCALE = [['always', 100], ['usually', 90], ['often', 70], ['sometimes', 50], ['rarely / seldom', 10], ['never', 0]];

function block(b, k) {
  switch (b.t) {
    case 'p':
      return html`<p class="b-p">${fmt(b.text)}</p>`;
    case 'ex':
      return html`<div class="b-ex"><div class="ex-main"><div class="ex-en">${raw(tappable(b.en))}</div><div class="ex-tr">${b.tr}</div></div>${sayBtn(b.say || lineId(b.en))}</div>`;
    case 'rule':
      return html`<div class="b-rule">${b.parts.map((p, i) => html`${i ? html`<span class="rule-plus">+</span>` : ''}<span class="rule-part">${p}</span>`)}</div>`;
    case 'table':
      return html`<div class="b-table">${tableHTML(b)}</div>`;
    case 'tip':
      return html`<div class="b-tip"><span class="tip-face">${raw(muffin({ mood: 'wink' }))}</span><div><b class="tip-who">Muffin'in ipucu</b><div>${fmt(b.text)}</div></div></div>`;
    case 'warn':
      return html`<div class="b-warn"><span class="warn-ico">${icon('alert')}</span><div><b>Sınavda dikkat!</b><div>${fmt(b.text)}</div></div></div>`;
    case 'right':
      return html`<div class="b-right">
        <div class="rw ok">${icon('check')}<span>${raw(tappable(b.ok))}</span></div>
        <div class="rw bad">${icon('x')}<span><s>${b.bad}</s></span></div>
        ${b.why ? html`<div class="rw-why">${fmt(b.why)}</div>` : ''}
      </div>`;
    case 'people':
      return html`<div class="b-people">${b.list.map((p) => html`<figure class="pp">${raw(personSVG(p.look))}<figcaption>${raw(tappable(p.cap))}</figcaption></figure>`)}</div>`;
    case 'check':
      return html`<div class="b-check" data-check="${k}"><div class="check-tag">${icon('target')}Hızlı soru</div><div class="check-host"></div><div class="check-why" hidden></div></div>`;
    case 'list':
      return html`<ul class="b-list">${b.items.map((it) => html`<li>${fmt(it)}</li>`)}</ul>`;
    case 'dialog':
      return html`<div class="b-dialog">${b.lines.map(([who, text], i) => html`<div class="dlg-b ${i % 2 ? 'r' : 'l'}"><span class="b-who">${who}</span><div class="b-say"><span>${raw(tappable(text))}</span>${sayBtn(lineId(text))}</div></div>`)}</div>`;
    case 'pairs':
      return html`<div class="b-pairs">${b.list.map(([a, c]) => html`<div class="pair">${wordBtn(a)}<span class="pair-arrow">↔</span>${wordBtn(c)}</div>`)}</div>`;
    case 'scale':
      return html`<div class="b-scale">${SCALE.map(([w, p], i) => html`<div class="sc-row" style="--p:${p / 100};--i:${i}"><span class="sc-w">${w}</span><span class="sc-bar"><i></i></span><span class="sc-p">%${p}</span></div>`)}</div>`;
    case 'builder':
      return html`<div class="b-builder" data-builder="${b.kind}"></div>`;
    case 'viz':
      return html`<div class="b-viz" data-viz="${k}"></div>`;
    case 'h':
      return html`<h3 class="b-h">${fmt(b.text)}</h3>`;
    case 'compare':
      return html`<div class="b-compare">${b.cols.map((c) => html`<div class="cmp-col ${c.tone || ''}"><div class="cmp-head">${c.e ? html`<span class="cmp-e">${c.e}</span>` : ''}<b>${c.title}</b>${c.sub ? html`<span>${c.sub}</span>` : ''}</div><ul>${c.items.map((it) => html`<li>${fmt(it)}</li>`)}</ul></div>`)}</div>`;
    default:
      return '';
  }
}

function wordBtn(en) {
  const w = WORD.get(en.replace(/\s+/g, '-'));
  return w ? html`<button type="button" class="pair-w" data-word="${w.id}">${en}</button>` : html`<span class="pair-w">${en}</span>`;
}

export const blocksHTML = (blocks) => html`${blocks.map((b, k) => html`<div class="blk rise" style="--i:${k}">${block(b, k)}</div>`)}`;

// Ara soruları ve paragraf makinesini çalıştırır. onCheck(correct, x, y) her ara soru cevaplanınca çağrılır.
export function bindBlocks(root, blocks, { onCheck } = {}) {
  const cleanups = [];
  root.querySelectorAll('[data-check]').forEach((node) => {
    const b = blocks[Number(node.dataset.check)];
    const host = node.querySelector('.check-host');
    const why = node.querySelector('.check-why');
    cleanups.push(mountQuestion(host, { type: 'mc', q: b.q, opts: b.opts, a: b.a, why: b.why }, {
      onAnswer: ({ correct }) => {
        why.hidden = false;
        why.innerHTML = toHTML(html`<span class="${correct ? 'cw-ok' : 'cw-no'}">${icon(correct ? 'check' : 'x')}${correct ? 'Doğru!' : 'Doğrusu işaretli.'}</span> ${fmt(b.why || '')}`);
        why.animate([{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'none' }], { duration: 300 });
        node.classList.add(correct ? 'is-ok' : 'is-no');
        const r = node.getBoundingClientRect();
        if (onCheck) onCheck(correct, r.left + r.width / 2, r.top + 30, b);
      },
    }));
  });
  root.querySelectorAll('[data-builder]').forEach((node) => cleanups.push(mountBuilder(node, node.dataset.builder)));
  root.querySelectorAll('[data-viz]').forEach((node) => cleanups.push(mountViz(node, blocks[Number(node.dataset.viz)])));
  const onClick = (e) => {
    const w = e.target.closest('[data-word]');
    if (w) openWord(w.dataset.word);
  };
  root.addEventListener('click', onClick);
  cleanups.push(() => root.removeEventListener('click', onClick));
  return () => cleanups.forEach((fn) => { try { fn(); } catch (err) { console.error(err); } });
}
