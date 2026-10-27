// Rozetler penceresi: kazanılanlar renkli, kalanlar nasıl kazanılacağıyla birlikte

import { html } from '../lib/dom.js';
import { store, level, todayXP, streak } from '../lib/store.js';
import { openSheet } from '../ui/overlay.js';
import { BADGES } from '../lib/rewards.js';

export function openBadges() {
  const got = store.get('badges');
  const lv = level();
  openSheet(html`
    <h2 class="t-big">Rozet Defterim</h2>
    <div class="lvl-box">
      <div class="lvl-n">${lv.n}</div>
      <div class="lvl-txt"><b>${lv.name}</b><span>${store.get('xp')} XP · sonraki seviyeye ${Math.max(0, lv.to - store.get('xp'))} XP</span><span class="bar" style="--p:${lv.pct.toFixed(3)}"><i></i></span></div>
    </div>
    <p class="t-small">Bugün ${todayXP()} XP kazandın · ${streak()} günlük seri</p>
    <div class="badge-grid">
      ${BADGES.map((b) => html`<div class="badge ${got[b.id] ? 'got' : ''}">
        <span class="badge-pic">${b.pic}</span>
        <b>${b.name}</b>
        <span>${got[b.id] ? `Kazanıldı · ${new Date(got[b.id]).toLocaleDateString('tr-TR')}` : b.how}</span>
      </div>`)}
    </div>
    <button class="btn btn--primary" data-act="ok" data-primary>Süper</button>`, {
    wide: true,
    actions: { ok: (t, e, close) => close() },
  });
}
