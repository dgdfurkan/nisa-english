// Uygulama girişi: iskelet (yan menü, üst çubuk, alt sekmeler), yönlendirme ve ekran geçişleri

import { html, raw, toHTML, $ } from './lib/dom.js';
import { store, streak, todayXP, level } from './lib/store.js';
import { displayName } from './lib/text.js';
import { ensureAudio, setBusVolume } from './audio/engine.js';
import { sfx } from './audio/sfx.js';
import { stopVoice } from './audio/voice.js';
import { icon } from './ui/icons.js';
import { muffin } from './ui/mascot.js';
import { confirmSheet, toast } from './ui/overlay.js';
import { setAskHook } from './ui/word.js';
import { initConfetti } from './fx/confetti.js';
import { cover, reveal } from './fx/swipe.js';
import { checkBadges } from './lib/rewards.js';
import { openSettings } from './screens/settings.js';
import { openBadges } from './screens/badges.js';
import { openAsk, closeAsk, askOpen } from './screens/ask.js';
import { mistakeCount } from './quiz/mistakes.js';

const view = document.getElementById('view');
const side = document.getElementById('side');
const topbar = document.getElementById('topbar');
const tabbar = document.getElementById('tabbar');
const fab = document.getElementById('fab');
let current = null;
let routing = Promise.resolve();
let first = true;

/* ---------- Ses ---------- */

function applyVolumes() {
  setBusVolume('sfx', store.get('sfx') ? store.get('sfxVol') : 0, 0.1);
}
// Tarayıcı sesi ilk dokunuşta açar
const unlockAudio = () => {
  if (ensureAudio()) applyVolumes();
};
window.addEventListener('pointerdown', unlockAudio, { once: true, capture: true });
window.addEventListener('keydown', unlockAudio, { once: true, capture: true });

/* ---------- Yönlendirme tablosu ---------- */

const ROUTES = [
  [/^$/, () => import('./screens/home.js').then((m) => ({ mount: m.mountHome, unit: 0, nav: 'home' }))],
  [/^unite\/([12])(?:\/([a-z]+))?$/, (u) => import('./screens/unit.js').then((m) => ({ mount: m.mountUnit, unit: Number(u), nav: `u${u}` }))],
  [/^ders\/([a-z0-9-]+)$/, (id) => import('./screens/lesson.js').then((m) => ({ mount: m.mountLesson, unit: id.startsWith('u2') ? 2 : 1, nav: id.startsWith('u2') ? 'u2' : 'u1' }))],
  [/^kartlar\/([12])(?:\/([a-z0-9-]+))?$/, (u) => import('./screens/cards.js').then((m) => ({ mount: m.mountCards, unit: Number(u), nav: `u${u}` }))],
  [/^alistirma\/([a-z0-9-]+)$/, (id) => import('./screens/practice.js').then((m) => ({ mount: m.mountPractice, unit: id.startsWith('u2') ? 2 : id.startsWith('u1') ? 1 : 0, nav: id.startsWith('u2') ? 'u2' : id.startsWith('u1') ? 'u1' : 'mistakes' }))],
  [/^okuma\/([a-z0-9-]+)$/, (id) => import('./screens/reading.js').then((m) => ({ mount: m.mountReading, unit: id.startsWith('r2') ? 2 : 1, nav: id.startsWith('r2') ? 'u2' : 'u1' }))],
  [/^ozet\/([12])$/, (u) => import('./screens/summary.js').then((m) => ({ mount: m.mountSummary, unit: Number(u), nav: `u${u}` }))],
  [/^sinav$/, () => import('./screens/exam.js').then((m) => ({ mount: m.mountExamHub, unit: 0, nav: 'exam' }))],
  [/^sinav\/(1|2|karma)$/, (s) => import('./screens/exam.js').then((m) => ({ mount: m.mountExam, unit: s === 'karma' ? 0 : Number(s), nav: 'exam' }))],
  [/^sozluk(?:\/(.*))?$/, () => import('./screens/dict.js').then((m) => ({ mount: m.mountDict, unit: 0, nav: 'dict' }))],
  [/^sor$/, () => import('./screens/ask.js').then((m) => ({ mount: m.mountAskPage, unit: 0, nav: 'ask' }))],
  [/^yanlislar$/, () => import('./screens/mistakes.js').then((m) => ({ mount: m.mountMistakes, unit: 0, nav: 'mistakes' }))],
];

function parseHash() {
  const h = decodeURIComponent(location.hash.replace(/^#\/?/, '')).replace(/\/+$/, '');
  for (const [re, load] of ROUTES) {
    const m = h.match(re);
    if (m) return { key: h, args: m.slice(1), load: () => load(...m.slice(1)) };
  }
  return null;
}

export function navigate(hash) {
  if (location.hash === hash) route();
  else location.hash = hash;
}

function route() {
  routing = routing.then(doRoute).catch((err) => console.error(err));
  return routing;
}

async function doRoute() {
  let target = parseHash();
  if (!target) {
    history.replaceState(null, '', '#/');
    target = parseHash();
  }
  if (current && current.key === target.key && !current.force) return;
  let def;
  try {
    def = await target.load();
  } catch (err) {
    console.error(err);
    toast('Sayfa yüklenemedi. Bağlantını kontrol edip tekrar dene.', { tone: 'warn' });
    return;
  }
  const colors = def.unit === 1 ? ['#8a6fd1', '#ffd84d'] : def.unit === 2 ? ['#3f9a85', '#ffd84d'] : ['#ff7a9c', '#ffd84d'];
  if (!first) {
    sfx.page();
    await cover({ a: colors[0], b: colors[1] });
  }
  stopVoice();
  if (current && current.inst && current.inst.unmount) {
    try { current.inst.unmount(); } catch (err) { console.error(err); }
  }
  current = null;
  view.innerHTML = '';
  document.body.dataset.unit = String(def.unit);
  window.scrollTo(0, 0);
  try {
    current = { key: target.key, inst: def.mount(view, ...target.args) || {} };
  } catch (err) {
    console.error(err);
    view.innerHTML = '';
    toast('Bu sayfa açılırken bir sorun oldu.', { tone: 'warn' });
    history.replaceState(null, '', '#/');
    const m = await import('./screens/home.js');
    current = { key: '', inst: m.mountHome(view) || {} };
  }
  markNav(def.nav);
  // Odaklanılan ekranlarda (konu, alıştırma, kartlar, sınav) yüzen düğme düğmelerin üstüne binmesin
  fab.classList.toggle('hide', def.nav === 'ask' || /^(ders|alistirma|kartlar|sinav\/|okuma)/.test(target.key));
  if (first) {
    first = false;
    return;
  }
  await nextFrames(2);
  await reveal();
}

const nextFrames = (n) => new Promise((resolve) => {
  const step = () => (n-- <= 0 ? resolve() : requestAnimationFrame(step));
  requestAnimationFrame(step);
});

window.addEventListener('hashchange', () => {
  if (askOpen()) closeAsk();
  route();
});

// Sınav gibi yarım kalınca kaybolacak ekranlardan çıkarken sor
document.addEventListener('click', async (e) => {
  const a = e.target.closest && e.target.closest('a[href^="#/"]');
  if (!a || e.metaKey || e.ctrlKey) return;
  sfx.tap();
  const guard = current && current.inst && current.inst.guard && current.inst.guard();
  if (!guard) return;
  e.preventDefault();
  const ok = await confirmSheet({ title: guard.title, text: guard.text, ok: 'Çık', cancel: 'Devam et' });
  if (ok) {
    current.inst.guard = null;
    navigate(a.getAttribute('href'));
  }
}, true);

// Sallanma animasyonu bitince sınıfı kaldır; kırmızı çerçeve kalıcı olmasın
document.addEventListener('animationend', (e) => {
  if (e.animationName === 'shake' && e.target.classList) e.target.classList.remove('shake');
});

/* ---------- İskelet ---------- */

const NAV = [
  ['home', '#/', 'home', 'Ana Sayfa'],
  ['sep', 'Üniteler'],
  ['u1', '#/unite/1', 'u1', 'Ünite 1 · Görünüş'],
  ['u2', '#/unite/2', 'u2', 'Ünite 2 · Sporlar'],
  ['sep', 'Çalışma Araçları'],
  ['dict', '#/sozluk', 'dict', 'Sözlük'],
  ['ask', '#/sor', 'chat', "Muffin'e Sor"],
  ['exam', '#/sinav', 'exam', 'Deneme Sınavı'],
  ['mistakes', '#/yanlislar', 'redo', 'Yanlışlarım'],
];

const DOODLES = [
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l4.2-1L19.4 7.8a2 2 0 0 0 0-2.8l-.4-.4a2 2 0 0 0-2.8 0L5 15.8z"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="7"/><path d="M12 9v6M9 12h6"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4h8l-1 6 3 3H6l3-3z"/><path d="M12 13v7"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.5s-7.8-5-7.8-10.6A4.4 4.4 0 0 1 12 7.2a4.4 4.4 0 0 1 7.8 2.7c0 5.6-7.8 10.6-7.8 10.6z"/></svg>',
];

function renderDoodles() {
  const host = document.getElementById('doodles');
  const spots = [[8, 14], [88, 10], [72, 46], [94, 70], [16, 82], [52, 90], [36, 30]];
  host.innerHTML = spots.map(([x, y], i) => `<div class="doodle" style="left:${x}%;top:${y}%;animation-delay:${-i * 2.3}s;animation-duration:${12 + (i % 3) * 3}s">${DOODLES[i % DOODLES.length]}</div>`).join('');
}

function initials(name) {
  const p = String(name).trim().split(/\s+/);
  return ((p[0] || '')[0] || '').toLocaleUpperCase('tr') + ((p[1] || '')[0] || '').toLocaleUpperCase('tr');
}

function renderSide() {
  const lv = level();
  const mc = mistakeCount();
  side.innerHTML = toHTML(html`
    <a class="brand" href="#/" aria-label="Ana sayfa">
      <span class="brand-mark">7</span>
      <span class="brand-text"><b>English Notebook</b><span>7. Sınıf İngilizce</span></span>
    </a>
    <nav class="nav">
      ${NAV.map((n) => (n[0] === 'sep'
        ? html`<div class="nav-label">${n[1]}</div>`
        : html`<a href="${n[1]}" data-nav="${n[0]}">${n[2] === 'u1' || n[2] === 'u2' ? html`<span class="dot-u" style="background:${n[2] === 'u1' ? '#9d86d6' : '#3f9a85'}"></span>` : icon(n[2])}<span>${n[3]}</span>${n[0] === 'mistakes' && mc ? html`<span class="count">${mc}</span>` : ''}</a>`))}
    </nav>
    <div class="side-foot">
      <button class="me-card" id="me-card" type="button" aria-label="Ayarlar">
        <span class="me-ava">${initials(store.get('name'))}</span>
        <span class="me-name">${store.get('name')}</span>
        <span class="me-lvl">Seviye ${lv.n} · ${lv.name}</span>
        <span class="me-bar" style="--p:${lv.pct.toFixed(3)}"><i></i></span>
      </button>
    </div>`);
  $('#me-card', side).addEventListener('click', () => { sfx.tap(); openSettings(); });
  if (current) markNav(document.body.dataset.nav || '');
}

function renderTop() {
  const s = streak();
  topbar.innerHTML = toHTML(html`
    <button class="tb-brand" id="tb-home" type="button" aria-label="Ana sayfa"><span class="brand-mark">7</span><b>English</b></button>
    <div class="tb-stats">
      <button class="stat flame ${s ? '' : 'cold'}" id="streak-chip" type="button" title="Üst üste çalıştığın gün sayısı" aria-label="${s} gün seri">${icon('flame')}<span>${s}</span></button>
      <button class="stat xp" id="xp-chip" type="button" title="Bugün kazandığın XP / günlük hedef" aria-label="Bugünkü XP">${icon('bolt')}<span id="xp-num">${todayXP()}</span><span class="t-small">/ ${store.get('goal')}</span></button>
      <button class="ibtn" id="btn-badges" type="button" aria-label="Rozetler">${icon('trophy')}</button>
      <button class="ibtn" id="btn-settings" type="button" aria-label="Ayarlar">${icon('sliders')}</button>
    </div>`);
  $('#tb-home', topbar).addEventListener('click', () => navigate('#/'));
  $('#btn-settings', topbar).addEventListener('click', () => { sfx.tap(); openSettings(); });
  $('#btn-badges', topbar).addEventListener('click', () => { sfx.tap(); openBadges(); });
  $('#xp-chip', topbar).addEventListener('click', () => { sfx.tap(); openBadges(); });
  $('#streak-chip', topbar).addEventListener('click', () => {
    sfx.tap();
    toast(s ? `${s} gündür üst üste çalışıyorsun. Seriyi bozma!` : 'Bugün biraz çalışınca serin başlayacak.', { tone: 'good' });
  });
}

function renderTabs() {
  tabbar.innerHTML = toHTML(html`
    <a class="tab" href="#/" data-nav="home">${icon('home')}<span>Ana Sayfa</span></a>
    <a class="tab" href="#/sozluk" data-nav="dict">${icon('dict')}<span>Sözlük</span></a>
    <a class="tab tab-ask" href="#/sor" data-nav="ask" aria-label="Muffin'e sor"><span class="muffin-ring">${raw(muffin({ mood: 'idle' }))}</span><span>Sor</span></a>
    <a class="tab" href="#/sinav" data-nav="exam">${icon('exam')}<span>Sınav</span></a>
    <a class="tab" href="#/yanlislar" data-nav="mistakes">${icon('redo')}<span>Yanlışlar</span></a>`);
}

function markNav(key) {
  document.body.dataset.nav = key;
  document.querySelectorAll('[data-nav]').forEach((a) => a.classList.toggle('on', a.dataset.nav === key));
}

/* ---------- Başlangıç ---------- */

let sideTimer = 0;
store.subscribe((key) => {
  if (key === 'sfx' || key === 'sfxVol') applyVolumes();
  if (['xp', 'days', 'goal', 'name', 'mistakes', '*'].includes(key)) {
    // Arka arkaya gelen değişiklikleri tek çizimde topla
    clearTimeout(sideTimer);
    sideTimer = setTimeout(() => {
      renderSide();
      const num = document.getElementById('xp-num');
      if (key === 'xp' || key === 'days') {
        if (num) num.textContent = String(todayXP());
        const st = document.getElementById('streak-chip');
        if (st) {
          const s = streak();
          st.querySelector('span').textContent = String(s);
          st.classList.toggle('cold', !s);
        }
      } else {
        renderTop();
      }
      markNav(document.body.dataset.nav || '');
    }, 30);
  }
  if (key === 'name' || key === '*') {
    if (current && current.key === '') {
      current.force = true;
      route().then(() => { if (current) current.force = false; });
    }
  }
});

function start() {
  initConfetti(document.getElementById('confetti'));
  renderDoodles();
  renderSide();
  renderTop();
  renderTabs();
  fab.innerHTML = toHTML(html`${raw(muffin({ mood: 'idle', cls: 'bob' }))}<span>Muffin'e sor</span>`);
  fab.addEventListener('click', () => { sfx.meow(); openAsk(); });
  setAskHook((q) => openAsk(q));
  document.title = `${displayName(store.get('name'))} · English Notebook`;
  store.subscribe((k) => { if (k === 'name') document.title = `${displayName(store.get('name'))} · English Notebook`; });
  checkBadges();
  route();
}

start();
