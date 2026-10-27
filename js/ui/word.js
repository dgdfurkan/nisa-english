// Kelime ayrıntı penceresi ve cümlelerde dokunulan kelimenin anlam kutusu

import { html, raw, toHTML, esc } from '../lib/dom.js';
import { store, isFav, toggleFav, wordBox } from '../lib/store.js';
import { WORDS, WORD, POS, catOf } from '../data/words.js';
import { lookupToken, findWord } from '../lib/lookup.js';
import { openSheet } from './overlay.js';
import { icon } from './icons.js';
import { sayBtn, picHTML } from './kit.js';
import { personSVG } from './person.js';
import { tappable } from '../lib/text.js';
import { sfx } from '../audio/sfx.js';
import { checkBadges } from '../lib/rewards.js';

let askHook = null;
export const setAskHook = (fn) => { askHook = fn; };

function detail(label, value) {
  return value ? html`<div class="wd-row"><span>${label}</span><b>${value}</b></div>` : '';
}

const verbLine = (w) => (w.verb ? html`<span class="verb-pill v-${w.verb}">${w.verb}</span> ${w.en}` : '');

export function wordPic(w, cls = '') {
  if (w.look) return raw(`<span class="pic person-pic ${cls}">${personSVG(w.look)}</span>`);
  return picHTML(w, { cls });
}

export function openWord(id) {
  const w = WORD.get(id);
  if (!w) return;
  store.set('lookups', store.get('lookups') + 1);
  checkBadges();
  const cat = catOf(w);
  const fav = isFav(w.id);
  const box = wordBox(w.id);
  const oppWords = w.opp ? w.opp.split('/').map((s) => s.trim()) : [];
  const oppHTML = oppWords.map((o) => (findWord(o) ? html`<button type="button" class="link-word" data-open="${findWord(o).id}">${o}</button>` : html`<span>${o}</span>`));
  const { el, close } = openSheet(html`
    <div class="wd">
      <div class="wd-pic">${wordPic(w, 'big')}</div>
      <div class="wd-head">
        <h2 class="wd-en">${w.en}</h2>
        <div class="wd-say">${sayBtn(`w-${w.id}`, { big: true })}${sayBtn(`w-${w.id}`, { slow: true })}</div>
      </div>
      <div class="wd-meta"><span class="hand wd-read">/${w.say}/</span><span class="tag">${POS[w.pos] || w.pos}</span><span class="tag gray">Ünite ${w.unit} · ${cat ? cat.title : ''}</span>${box >= 3 ? html`<span class="tag good">${icon('check')}Öğrendin</span>` : ''}</div>
      <p class="wd-tr">${w.tr}</p>
      <div class="wd-ex">
        <div class="wd-ex-en">${raw(tappable(w.ex))}</div>
        ${sayBtn(`s-${w.id}`)}
        <div class="wd-ex-tr">${w.exTr}</div>
      </div>
      <div class="wd-rows">
        ${oppWords.length ? html`<div class="wd-row"><span>Zıt anlamlısı</span><b>${oppHTML.map((x, i) => html`${i ? ' / ' : ''}${x}`)}</b></div>` : ''}
        ${detail('Karşılaştırma', w.comp ? `${w.comp}${w.compAlt ? ` (ya da ${w.compAlt})` : ''}` : '')}
        ${w.verb ? html`<div class="wd-row"><span>Hangi fiille?</span><b>${verbLine(w)}</b></div>` : ''}
        ${w.pct != null ? detail('Sıklık', `yaklaşık %${w.pct}`) : ''}
      </div>
      ${w.note ? html`<div class="wd-note">${icon('bulb')}<span>${w.note}</span></div>` : ''}
      <div class="row">
        <button class="btn btn--small ${fav ? 'fav-on' : ''}" data-act="fav">${icon(fav ? 'starFill' : 'star')}<span>${fav ? 'Defterimde' : 'Defterime ekle'}</span></button>
        <button class="btn btn--small" data-act="ask">${icon('chat')}<span>Muffin'e sor</span></button>
      </div>
    </div>`, {
    actions: {
      fav: (t) => {
        const on = toggleFav(w.id);
        sfx.pop();
        t.classList.toggle('fav-on', on);
        t.innerHTML = toHTML(html`${icon(on ? 'starFill' : 'star')}<span>${on ? 'Defterimde' : 'Defterime ekle'}</span>`);
      },
      ask: (t, e, closeIt) => {
        closeIt();
        if (askHook) askHook(`${w.en} ne demek? Örnek cümle verir misin?`);
      },
    },
  });
  el.addEventListener('click', (e) => {
    const b = e.target.closest('[data-open]');
    if (b) {
      close();
      setTimeout(() => openWord(b.dataset.open), 220);
    }
  });
  if (store.get('autoplay')) setTimeout(() => {
    const b = el.querySelector('.say.big');
    if (b) b.click();
  }, 380);
}

/* ---------- Dokununca anlam kutusu ---------- */

let pop = null;
let lit = null;

function closePop() {
  if (lit) lit.classList.remove('lit');
  lit = null;
  if (!pop) return;
  const p = pop;
  pop = null;
  const a = p.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(6px) scale(.96)' }], { duration: 150, fill: 'forwards' });
  a.finished.then(() => p.remove(), () => p.remove());
}

function showPop(target, hit) {
  closePop();
  const node = document.createElement('div');
  node.className = 'wpop';
  const w = hit.word;
  const derived = w && hit.form !== w.en.toLowerCase();
  const formNote = derived
    ? (w.comp && w.comp.toLowerCase() === hit.form ? `"${hit.form}" = ${w.en} kelimesinin karşılaştırma hali` : `"${hit.form}" kelimesinin kökü: ${w.en}`)
    : (!w && hit.form !== hit.base ? `"${hit.form}" kelimesinin kökü: ${hit.base}` : '');
  node.innerHTML = toHTML(w
    ? html`<div class="wpop-head"><b>${w.en}</b>${sayBtn(`w-${w.id}`)}<span class="tag">${POS[w.pos] || ''}</span></div>
      <div class="wpop-tr">${w.tr}</div>${formNote ? html`<div class="t-small">${formNote}</div>` : ''}
      <div class="wpop-foot"><button class="btn btn--small" data-open-word="${w.id}">${icon('book')}Ayrıntılar</button></div>`
    : html`<div class="wpop-head"><b>${hit.base}</b></div><div class="wpop-tr">${hit.tr}</div>${formNote ? html`<div class="t-small">${formNote}</div>` : ''}`);
  document.body.append(node);
  const r = target.getBoundingClientRect();
  const pw = node.offsetWidth;
  const ph = node.offsetHeight;
  let x = r.left + r.width / 2 - pw / 2;
  x = Math.max(12, Math.min(window.innerWidth - pw - 12, x));
  let y = r.bottom + 10;
  if (y + ph > window.innerHeight - 12) y = r.top - ph - 10;
  node.style.left = `${x}px`;
  node.style.top = `${Math.max(12, y)}px`;
  node.animate([{ opacity: 0, transform: 'translateY(8px) scale(.94)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'cubic-bezier(.34,1.56,.64,1)' });
  pop = node;
  lit = target;
  target.classList.add('lit');
  sfx.soft();
  node.addEventListener('click', (e) => {
    const b = e.target.closest('[data-open-word]');
    if (b) {
      closePop();
      openWord(b.dataset.openWord);
    }
  });
}

document.addEventListener('click', (e) => {
  if (pop && pop.contains(e.target)) return;
  const t = e.target.closest && e.target.closest('.tw, i.en[data-look]');
  if (!t) {
    closePop();
    return;
  }
  const token = t.dataset.w || t.dataset.look;
  // Kalıp halinde yazılmış İngilizce ifade (ör. *look like*) önce bütün olarak aranır
  const whole = findWord(token);
  const hit = whole ? { word: whole, form: token.toLowerCase(), base: token.toLowerCase() } : lookupToken(token);
  if (!hit) {
    const first = String(token).split(/\s+/)[0];
    const h2 = first !== token ? lookupToken(first) : null;
    if (!h2) {
      closePop();
      return;
    }
    showPop(t, h2);
    return;
  }
  showPop(t, hit);
});
window.addEventListener('scroll', () => closePop(), { passive: true, capture: true });
window.addEventListener('hashchange', () => closePop());

export { esc, lookupToken, findWord };
