// Ana sayfa: selam, günlük hedef, kaldığın yer, kitabın içindekiler sayfası gibi üniteler, araçlar, günün kelimesi

import { html, raw, toHTML } from '../lib/dom.js';
import { store, todayXP, streak, level, isLearned, dayKey } from '../lib/store.js';
import { displayName } from '../lib/text.js';
import { icon } from '../ui/icons.js';
import { muffin } from '../ui/mascot.js';
import { ring, underline, sayBtn } from '../ui/kit.js';
import { wordPic, openWord } from '../ui/word.js';
import { UNITS, LESSONS } from '../data/units.js';
import { WORDS, POS } from '../data/words.js';
import { setsOf } from '../quiz/sets.js';
import { mistakeCount } from '../quiz/mistakes.js';
import { BADGES } from '../lib/rewards.js';
import { openBadges } from './badges.js';
import { sfx } from '../audio/sfx.js';

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return 'İyi geceler';
  if (h < 12) return 'Günaydın';
  if (h < 18) return 'İyi günler';
  return 'İyi akşamlar';
}

export function unitProgress(n) {
  const lessons = LESSONS.filter((l) => l.unit === n);
  const done = lessons.filter((l) => store.get('lessons')[l.id]).length;
  const words = WORDS.filter((w) => w.unit === n);
  const learned = words.filter((w) => isLearned(w.id)).length;
  const sets = setsOf(n);
  const stars = sets.reduce((a, s) => a + ((store.get('sets')[s.id] || {}).stars || 0), 0);
  const pct = (done / lessons.length) * 0.4 + (learned / words.length) * 0.3 + (stars / (sets.length * 3)) * 0.3;
  return { lessons: lessons.length, done, words: words.length, learned, stars, maxStars: sets.length * 3, pct };
}

// Günün kelimesi her gün değişir ama gün içinde aynı kalır
function wordOfDay() {
  const k = dayKey();
  let h = 0;
  for (const ch of k) h = (h * 33 + ch.charCodeAt(0)) >>> 0;
  return WORDS[h % WORDS.length];
}

const MOTTO = [
  'Bugün küçük bir adım, sınavda büyük fark!',
  'Her gün 15 dakika, sınavda tam puan.',
  'Kelimeler cebinde, konular avucunda.',
  'Yanlış yapmaktan korkma, Muffin yanında!',
  'Bir konu, bir alıştırma, bir yıldız. Hadi başlayalım!',
];

export function mountHome(view) {
  const name = displayName(store.get('name'));
  const lv = level();
  const s = streak();
  const today = todayXP();
  const goal = store.get('goal');
  const last = store.get('last');
  const wod = wordOfDay();
  const mc = mistakeCount();
  const badges = store.get('badges');
  const motto = MOTTO[new Date().getDate() % MOTTO.length];

  view.innerHTML = toHTML(html`
    <div class="page home">
      <section class="hero">
        <div class="hero-txt">
          <div class="eyebrow rise">${greeting()}</div>
          <h1 class="t-hero rise" style="--i:1">Hi, ${underline(name)}!</h1>
          <p class="t-lead rise" style="--i:2">${motto}</p>
          <div class="hero-stats rise" style="--i:3">
            <div class="hs">${ring(Math.min(1, today / goal), { size: 58, label: html`${icon('bolt')}` })}<div><b>${today} / ${goal} XP</b><span>Bugünkü hedef</span></div></div>
            <div class="hs">${raw(`<span class="hs-ico flame ${s ? '' : 'cold'}">${toHTML(icon('flame'))}</span>`)}<div><b>${s} gün</b><span>Çalışma serisi</span></div></div>
            <div class="hs">${raw(`<span class="hs-ico lvl">${lv.n}</span>`)}<div><b>${lv.name}</b><span>Seviye ${lv.n} · ${store.get('xp')} XP</span></div></div>
          </div>
        </div>
        <div class="hero-art rise" style="--i:2">
          <div class="hero-muffin bob">${raw(muffin({ mood: 'happy' }))}</div>
          <div class="speech hand">Takılırsan bana sor!</div>
        </div>
      </section>

      ${last ? html`<a class="card continue rise" style="--i:4" href="${last.hash}">
        <span class="cont-pic">${last.pic || '📘'}</span>
        <span class="cont-txt"><span class="eyebrow">Kaldığın yerden devam et</span><b>${last.title}</b><span class="t-small">${last.sub || ''}</span></span>
        <span class="cont-go">${icon('arrow')}</span>
      </a>` : html`<a class="card continue first rise" style="--i:4" href="#/ders/u1-look">
        <span class="cont-pic">🚀</span>
        <span class="cont-txt"><span class="eyebrow">Buradan başla</span><b>Ünite 1 · Dış Görünüşü Anlatmak</b><span class="t-small">İlk konu 8 dakika sürüyor</span></span>
        <span class="cont-go">${icon('arrow')}</span>
      </a>`}

      <section class="contents">
        <div class="sec-head"><h2 class="t-big">İçindekiler</h2><span class="t-small">Kitabındaki sırayla</span></div>
        <div class="units">
          ${UNITS.map((u, i) => {
            if (u.locked) {
              return html`<div class="unit-bar locked rise" style="--i:${i + 5};--uc:${u.color};--us:${u.soft}">
                <span class="ub-n">UNIT ${u.n}</span><span class="ub-t">${u.title.toUpperCase()}</span><span class="ub-tag">${icon('lock')}Yakında</span><span class="ub-p">${u.pages}</span>
              </div>`;
            }
            const p = unitProgress(u.n);
            return html`<a class="unit-bar rise" style="--i:${i + 5};--uc:${u.color};--ud:${u.deep};--us:${u.soft}" href="#/unite/${u.n}">
              <span class="ub-n">UNIT ${u.n}</span>
              <span class="ub-t">${u.title.toUpperCase()}<small>${u.tr}</small></span>
              <span class="ub-prog"><span class="ub-bar"><i style="width:${Math.round(p.pct * 100)}%"></i></span><span>%${Math.round(p.pct * 100)}</span></span>
              <span class="ub-p">${u.pages}</span>
            </a>`;
          })}
        </div>
      </section>

      <section class="tools">
        <a class="tool card rise" style="--i:10" href="#/sozluk"><span class="tool-ico t1">${icon('dict')}</span><b>Sözlük</b><span>${WORDS.length} kelime, sesli</span></a>
        <a class="tool card rise" style="--i:11" href="#/sor"><span class="tool-ico t2">${icon('chat')}</span><b>Muffin'e Sor</b><span>Takıldığın her şey</span></a>
        <a class="tool card rise" style="--i:12" href="#/sinav"><span class="tool-ico t3">${icon('exam')}</span><b>Deneme Sınavı</b><span>Okul yazılısı gibi</span></a>
        <a class="tool card rise" style="--i:13" href="#/yanlislar"><span class="tool-ico t4">${icon('redo')}</span><b>Yanlışlarım</b><span>${mc ? `${mc} soru seni bekliyor` : 'Şu an tertemiz'}</span></a>
      </section>

      <section class="duo">
        <div class="card wod tape rise" style="--i:14">
          <div class="eyebrow">Günün kelimesi</div>
          <div class="wod-row">
            <div class="wod-pic">${wordPic(wod)}</div>
            <div class="wod-txt">
              <div class="wod-en"><b>${wod.en}</b>${sayBtn(`w-${wod.id}`)}</div>
              <div class="hand wod-say">/${wod.say}/ · ${POS[wod.pos] || ''}</div>
              <div class="wod-tr">${wod.tr}</div>
            </div>
          </div>
          <p class="wod-ex">“${wod.ex}”</p>
          <button type="button" class="btn btn--small" id="wod-open">${icon('book')}Ayrıntılar</button>
        </div>
        <div class="card stickers rise" style="--i:15">
          <div class="sec-head"><div class="eyebrow">Rozet defterim</div><button type="button" class="btn btn--ghost btn--small" id="all-badges">Hepsi${icon('chevron')}</button></div>
          <div class="sticker-row">
            ${BADGES.slice(0, 8).map((b) => html`<span class="sticker ${badges[b.id] ? 'got' : ''}" title="${b.name}: ${b.how}"><span>${b.pic}</span></span>`)}
          </div>
          <p class="t-small">${Object.keys(badges).length} / ${BADGES.length} rozet kazandın. ${Object.keys(badges).length ? 'Harika gidiyorsun!' : 'İlk rozet ilk konunda seni bekliyor.'}</p>
        </div>
      </section>
    </div>`);

  view.querySelector('#wod-open').addEventListener('click', () => { sfx.tap(); openWord(wod.id); });
  view.querySelector('#all-badges').addEventListener('click', () => { sfx.tap(); openBadges(); });
  return {};
}
