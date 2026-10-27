// Ekranlarda ortak kullanılan küçük parçalar

import { html, raw } from '../lib/dom.js';
import { icon } from './icons.js';
import { hasAudio } from '../audio/voice.js';
import { inline } from '../lib/text.js';

export const sayBtn = (id, { big = false, slow = false, label = 'Dinle' } = {}) =>
  hasAudio(id)
    ? html`<button type="button" class="say ${big ? 'big' : ''} ${slow ? 'slow' : ''}" data-say="${id}" ${slow ? raw('data-slow="1"') : ''} aria-label="${slow ? 'Yavaş dinle' : label}" title="${slow ? 'Yavaş dinle' : label}">${icon(slow ? 'turtle' : 'speaker')}</button>`
    : '';

export const fmt = (text) => raw(inline(text));

export function ring(pct, { size = 64, label = null, stroke = 7 } = {}) {
  const r = 50 - stroke;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.max(0, Math.min(1, pct)));
  return html`<div class="ring" style="--s:${size}px">
    <svg viewBox="0 0 100 100"><circle class="bg" cx="50" cy="50" r="${r}" fill="none" stroke-width="${stroke * 1.4}"/><circle class="fg" cx="50" cy="50" r="${r}" fill="none" stroke-width="${stroke * 1.4}" stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"/></svg>
    <div class="val">${label == null ? `${Math.round(pct * 100)}%` : label}</div>
  </div>`;
}

export const starsHTML = (n, of = 3) => html`<span class="stars" aria-label="${n} yıldız">${Array.from({ length: of }, (_, i) => html`<span class="${i < n ? 'on' : ''}">${icon(i < n ? 'starFill' : 'star')}</span>`)}</span>`;

const UNDER = '<svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true"><path d="M3 13 C 40 5, 90 4, 120 9 S 180 15, 197 7" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/></svg>';
export const underline = (text) => html`<span class="under">${text}${raw(UNDER)}</span>`;

export function pageHead({ back = null, backLabel = 'Geri', eyebrow = '', title = '', sub = '', right = '' } = {}) {
  return html`<header class="phead">
    ${back ? html`<a class="back-link" href="${back}">${icon('back')}<span>${backLabel}</span></a>` : ''}
    <div class="phead-row">
      <div class="phead-txt">
        ${eyebrow ? html`<div class="eyebrow">${eyebrow}</div>` : ''}
        <h1 class="t-title">${title}</h1>
        ${sub ? html`<p class="t-lead">${sub}</p>` : ''}
      </div>
      ${right}
    </div>
  </header>`;
}

export const tableHTML = (t) => html`<div class="tbl-wrap"><table class="tbl ${t.head.length > 4 ? 'center' : ''}">
  <thead><tr>${t.head.map((h) => html`<th>${h}</th>`)}</tr></thead>
  <tbody>${t.rows.map((r) => html`<tr>${r.map((c) => html`<td class="${c === '✓' ? 'tick' : ''}">${fmt(c)}</td>`)}</tr>`)}</tbody>
</table>${t.cap ? html`<div class="tbl-cap">${t.cap}</div>` : ''}</div>`;

// Emoji ya da çizilmiş kişi
export function picHTML(w, { cls = '' } = {}) {
  return w.pic ? html`<span class="pic ${cls}" aria-hidden="true">${w.pic}</span>` : html`<span class="pic mono ${cls}" aria-hidden="true">${w.en.slice(0, 1).toUpperCase()}</span>`;
}
