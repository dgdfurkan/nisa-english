// Dijital sözlük: İngilizce ve Türkçe arama, ünite ve "Defterim" süzgeci, harf grupları, sesli telaffuz

import { html, toHTML, Life } from '../lib/dom.js';
import { store, isFav, isLearned } from '../lib/store.js';
import { fold } from '../lib/text.js';
import { icon } from '../ui/icons.js';
import { muffin } from '../ui/mascot.js';
import { sayBtn } from '../ui/kit.js';
import { segHTML, bindSeg } from '../ui/controls.js';
import { openWord } from '../ui/word.js';
import { WORDS, POS, CATS } from '../data/words.js';
import { openAsk } from './ask.js';

const FILTERS = [['all', 'Tümü'], ['u1', 'Ünite 1'], ['u2', 'Ünite 2'], ['fav', 'Defterim']];
const INDEX = WORDS.map((w) => ({ w, en: w.en.toLowerCase(), tr: fold(w.tr), senses: w.tr.replace(/\(.*?\)/g, '').split(/[,;/]/).map((x) => fold(x)) }));

export function mountDict(view, arg) {
  const life = new Life();
  let filter = ['u1', 'u2', 'fav'].includes(arg) ? arg : 'all';
  let query = arg && !['u1', 'u2', 'fav'].includes(arg) ? arg : '';
  let cat = '';

  view.innerHTML = toHTML(html`
    <div class="page dict">
      <header class="phead"><div class="eyebrow">Dijital sözlük</div><h1 class="t-title">Sözlük</h1><p class="t-lead">${WORDS.length} kelime; her biri sesli, örnek cümleli. İngilizce ya da Türkçe ara.</p></header>
      <div class="search">
        ${icon('search')}
        <input class="field" type="search" placeholder="Ara: generous, cömert, play..." value="${query}" aria-label="Sözlükte ara" autocomplete="off" spellcheck="false">
        <button type="button" class="ibtn s-clear" aria-label="Temizle" ${query ? '' : 'hidden'}>${icon('x')}</button>
      </div>
      <div class="dict-filters">${segHTML('f', FILTERS, filter)}</div>
      <div class="cat-chips"></div>
      <div class="dict-count t-small"></div>
      <div class="dict-list"></div>
    </div>`);
  const input = view.querySelector('input');
  const list = view.querySelector('.dict-list');
  const countEl = view.querySelector('.dict-count');
  const catsEl = view.querySelector('.cat-chips');
  const clear = view.querySelector('.s-clear');

  function drawCats() {
    const cats = filter === 'u1' ? CATS[1] : filter === 'u2' ? CATS[2] : [];
    catsEl.innerHTML = toHTML(cats.length ? html`<div class="chips">${[['', 'Hepsi'], ...cats.map((c) => [c.id, `${c.pic} ${c.title}`])].map(([id, t]) => html`<button type="button" class="chip ${cat === id ? 'on' : ''}" data-cat="${id}">${t}</button>`)}</div>` : '');
  }

  function results() {
    const q = fold(query);
    let pool = INDEX;
    if (filter === 'u1') pool = pool.filter((x) => x.w.unit === 1);
    if (filter === 'u2') pool = pool.filter((x) => x.w.unit === 2);
    if (filter === 'fav') pool = pool.filter((x) => isFav(x.w.id));
    if (cat) pool = pool.filter((x) => x.w.cat === cat);
    if (!q) return pool.slice().sort((a, b) => a.en.localeCompare(b.en)).map((x) => x.w);
    const scored = [];
    for (const x of pool) {
      let s = 0;
      if (x.en === q) s = 100;
      else if (x.en.startsWith(q)) s = 80;
      else if (x.en.includes(q)) s = 60;
      else if (x.senses.some((t) => t === q)) s = 90;
      else if (x.tr.split(' ').some((t) => t.startsWith(q))) s = 50;
      else if (q.length > 3 && x.tr.includes(q)) s = 30;
      if (s) scored.push({ w: x.w, s });
    }
    scored.sort((a, b) => b.s - a.s || a.w.en.localeCompare(b.w.en));
    return scored.map((x) => x.w);
  }

  const row = (w, k) => html`<div class="d-row ${k < 24 ? 'rise' : ''}" style="--i:${Math.min(k, 12)}" data-id="${w.id}" role="button" tabindex="0" aria-label="${w.en}: ${w.tr}">
    <span class="d-pic">${w.pic || w.en[0].toUpperCase()}</span>
    <span class="d-main"><b>${w.en}</b><span>${w.tr}</span></span>
    <span class="d-tags">${isFav(w.id) ? html`<span class="d-star">${icon('starFill')}</span>` : ''}${isLearned(w.id) ? html`<span class="tag good">${icon('check')}</span>` : ''}<span class="tag gray">${POS[w.pos] || ''}</span></span>
    ${sayBtn(`w-${w.id}`)}
  </div>`;

  function draw() {
    const res = results();
    countEl.textContent = query ? `${res.length} sonuç` : `${res.length} kelime`;
    if (!res.length) {
      list.innerHTML = toHTML(html`<div class="card pad empty-card">
        <span class="empty-face">${{ __html: muffin({ mood: 'think' }) }}</span>
        <p class="t-lead">${filter === 'fav' && !query ? 'Defterin henüz boş. Bir kelimeyi açıp yıldıza dokunarak ekleyebilirsin.' : `"${query}" için sonuç bulamadım.`}</p>
        ${query ? html`<button type="button" class="btn btn--primary" id="ask-q">${icon('chat')}Muffin'e sor: "${query}"</button>` : ''}
      </div>`);
      const b = list.querySelector('#ask-q');
      if (b) b.addEventListener('click', () => openAsk(`${query} ne demek?`));
      return;
    }
    if (!query) {
      // Harf gruplarıyla sözlük görünümü
      const groups = new Map();
      res.forEach((w) => {
        const L = w.en[0].toUpperCase();
        if (!groups.has(L)) groups.set(L, []);
        groups.get(L).push(w);
      });
      let k = 0;
      list.innerHTML = toHTML(html`${[...groups.entries()].map(([L, ws]) => html`<div class="d-group"><div class="d-letter">${L}</div>${ws.map((w) => row(w, k++))}</div>`)}`);
    } else {
      list.innerHTML = toHTML(html`${res.map((w, k) => row(w, k))}`);
    }
  }

  let t = 0;
  input.addEventListener('input', () => {
    query = input.value.trim();
    clear.hidden = !query;
    clearTimeout(t);
    t = setTimeout(draw, 90);
  });
  clear.addEventListener('click', () => {
    input.value = '';
    query = '';
    clear.hidden = true;
    draw();
    input.focus();
  });
  const seg = bindSeg(view.querySelector('[data-seg="f"]'), { value: filter, onChange: (v) => { filter = v; cat = ''; drawCats(); draw(); } });
  catsEl.addEventListener('click', (e) => {
    const c = e.target.closest('[data-cat]');
    if (!c) return;
    cat = c.dataset.cat;
    drawCats();
    draw();
  });
  list.addEventListener('click', (e) => {
    if (e.target.closest('[data-say]')) return;
    const r = e.target.closest('.d-row');
    if (r) openWord(r.dataset.id);
  });
  list.addEventListener('keydown', (e) => {
    const r = e.target.closest('.d-row');
    if (r && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      openWord(r.dataset.id);
    }
  });
  // Pencereden yıldız eklenince liste yenilensin
  life.add(store.subscribe((key) => { if (key === 'fav') draw(); }));
  drawCats();
  draw();
  if (window.matchMedia('(min-width: 961px)').matches && !arg) setTimeout(() => input.focus({ preventScroll: true }), 300);
  return { unmount: () => { seg.destroy(); life.dispose(); } };
}
