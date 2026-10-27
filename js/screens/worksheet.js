// Çalışma kağıtları: liste (#/calisma) ve kağıt (#/calisma/<id>).
// Kağıt ekranda doldurulur, "Kontrol et" ile kırmızı kalemle okunur, "Yazdır" ile A4 çıktısı alınır.

import { html, raw, toHTML } from '../lib/dom.js';
import { store } from '../lib/store.js';
import { displayName, tappable } from '../lib/text.js';
import { icon } from '../ui/icons.js';
import { personSVG, peopleSVG } from '../ui/person.js';
import { addXP } from '../lib/rewards.js';
import { toast } from '../ui/overlay.js';
import { sfx } from '../audio/sfx.js';
import { burst } from '../fx/confetti.js';
import { SHEETS, buildSheet, norm } from '../ws/sheets.js';
import { checkSentence } from '../ask/grammar.js';
import { UNITS } from '../data/units.js';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const SPREAD = { 7: [0, 1, 2, 3, 4, 5, 6], 6: [0, 1, 2, 3, 4, 5], 4: [0, 2, 4, 5], 3: [0, 2, 4], 2: [1, 4], 1: [5], 0: [] };

/* ---------- Liste ---------- */

function mountHub(view) {
  const res = store.get('sheets');
  view.innerHTML = toHTML(html`
    <div class="page ws-hub">
      <header class="ws-hero rise">
        <div class="ws-hero-art" aria-hidden="true"><span class="wh-paper p1"></span><span class="wh-paper p2"></span><span class="wh-e">📝</span><span class="wh-pencil">✏️</span></div>
        <div>
          <div class="eyebrow">Resimli, bol soruluk, yazdırılabilir</div>
          <h1 class="t-title">Çalışma Kağıtları</h1>
          <p class="t-lead">Her konu için hazır kağıtlar. Ekranda doldur ve <b>Kontrol et</b>'e bas, istersen yazdırıp kalemle çöz. <b>Yeni kağıt</b> her seferinde farklı sorular üretir.</p>
        </div>
      </header>
      ${UNITS.filter((u) => !u.locked).map((u) => html`<section class="ws-unit" style="--uc:${u.color};--ud:${u.deep};--us:${u.soft}">
        <div class="sec-head"><h2 class="t-big">Unit ${u.n} · ${u.title}</h2></div>
        <div class="ws-cards">${SHEETS.filter((s) => s.unit === u.n).map((s, i) => {
          const r = res[s.id];
          const n = buildSheet(s.id, 1).total;
          return html`<a class="ws-card rise" style="--i:${i}" href="#/calisma/${s.id}">
            <span class="wc-sheet" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
            <span class="wc-e">${s.e}</span>
            <b>${s.title}</b><span class="wc-tr">${s.tr}</span>
            <span class="wc-foot"><span class="tag gray">${n} soru</span>${r ? html`<span class="tag ${r.best >= 85 ? 'good' : 'gold'}">en iyi %${r.best}</span>` : ''}</span>
          </a>`;
        })}</div>
      </section>`)}
    </div>`);
  return {};
}

/* ---------- Kağıt ---------- */

const inp = (id, cls = '') => html`<input class="ws-in ${cls}" data-id="${id}" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Cevap">`;
const pen = (id) => html`<span class="ws-pen" data-pen="${id}"></span>`;

function weekMini(d) {
  return html`<span class="ws-week">${DAYS.map((x, k) => html`<span class="${SPREAD[d].includes(k) ? 'y' : ''}"><small>${x}</small>${SPREAD[d].includes(k) ? '✓' : ''}</span>`)}</span>`;
}

function fillBody(s) {
  const parts = [];
  if (s.bank) parts.push(html`<div class="ws-bank">${s.bank.map((w) => html`<span class="ws-bw" data-bw="${w}">${w}</span>`)}</div>`);
  if (s.lineup) parts.push(html`<div class="ws-lineup">${s.lineup.map((p) => html`<figure>${raw(personSVG(p.look))}<figcaption><b>${p.name}</b><span>${p.cm} cm · ${p.age} yaş</span></figcaption></figure>`)}</div>`);
  if (s.chart) parts.push(html`<div class="ws-chart-wrap"><table class="ws-chart"><thead><tr><th></th>${s.chart.acts.map(([e, a]) => html`<th><span class="ws-ce">${e}</span>${a}</th>`)}</tr></thead><tbody>${s.chart.people.map((p, i) => html`<tr><th>${p}</th>${s.chart.data[i].map((d) => html`<td><b>${d}</b><small>${d === 7 ? 'her gün' : 'gün'}</small></td>`)}</tr>`)}</tbody></table><div class="ws-cap">Haftada kaç gün?</div></div>`);
  if (s.grid) {
    parts.push(html`<div class="ws-grid">${s.items.map((it, k) => html`<div class="ws-gi" data-item="${it.id}"><span class="ws-n">${k + 1}</span>${it.e ? html`<span class="ws-ge">${it.e}</span>` : ''}${it.week != null ? weekMini(it.week) : ''}${inp(it.id)}${it.hint ? html`<span class="ws-hint">${it.hint}</span>` : ''}${pen(it.id)}</div>`)}</div>`);
    return parts;
  }
  // Resimli gruplar: resim solda, ilgili cümleler sağda
  const groups = [];
  s.items.forEach((it) => {
    if (it.look || !groups.length) groups.push({ look: it.look, label: it.label, items: [] });
    groups[groups.length - 1].items.push(it);
  });
  let k = 0;
  for (const g of groups) {
    const rows = g.items.map((it) => {
      k++;
      return html`<div class="ws-it ${it.long ? 'long' : ''}" data-item="${it.id}">
        <span class="ws-n">${k}</span>
        ${it.e ? html`<span class="ws-ie">${it.e}</span>` : ''}
        <span class="ws-q">${it.show ? html`<span class="ws-show">${it.show}</span>` : ''}${it.pre ? raw(tappable(it.pre)) : ''}${inp(it.id, it.long ? 'long' : '')}${it.post ? raw(tappable(it.post)) : ''}${it.hint ? html`<span class="ws-hint">(${it.hint})</span>` : ''}${pen(it.id)}</span>
      </div>`;
    });
    parts.push(g.look ? html`<div class="ws-pg"><figure class="ws-pic">${raw(personSVG(g.look))}${g.label ? html`<figcaption>${g.label}</figcaption>` : ''}</figure><div class="ws-rows">${rows}</div></div>` : html`<div class="ws-rows">${rows}</div>`);
  }
  return parts;
}

function sectionBody(s) {
  switch (s.type) {
    case 'fill':
      return fillBody(s);
    case 'choice':
      return html`<div class="ws-rows">${s.items.map((it, k) => html`<div class="ws-it" data-item="${it.id}"><span class="ws-n">${k + 1}</span><span class="ws-q">${raw(tappable(it.pre))}<span class="ws-ch">${it.opts.map((o, j) => html`${j ? html`<span class="ws-slash">/</span>` : ''}<button type="button" class="ws-opt" data-pick="${it.id}" data-v="${j}">${o}</button>`)}</span>${raw(tappable(it.post))}${pen(it.id)}</span></div>`)}</div>`;
    case 'match':
      return html`<div class="ws-keys ${s.keys[0].look ? 'pics' : s.keys[0].text ? 'texts' : 'nums'}">${s.keys.filter((x) => x.look || x.text).map((x) => html`<div class="ws-key">${x.look ? raw(personSVG(x.look)) : ''}<b>${x.key}</b>${x.text ? html`<span>${raw(tappable(x.text))}</span>` : ''}</div>`)}</div>
        <div class="ws-rows">${s.items.map((it, k) => html`<div class="ws-it" data-item="${it.id}"><span class="ws-n">${k + 1}</span><span class="ws-q">${it.e ? html`<span class="ws-ie">${it.e}</span>` : ''}${raw(tappable(it.text))}</span><span class="ws-letters">${s.keys.map((x) => html`<button type="button" class="ws-l" data-pick="${it.id}" data-v="${x.key}">${x.key}</button>`)}</span>${pen(it.id)}</div>`)}</div>`;
    case 'tf':
      return html`${s.people ? html`<div class="ws-people">${raw(peopleSVG(s.people))}</div>` : ''}<div class="ws-text">${raw(tappable(s.text))}</div>
        <div class="ws-rows">${s.items.map((it, k) => html`<div class="ws-it" data-item="${it.id}"><span class="ws-n">${k + 1}</span><span class="ws-q">${raw(tappable(it.text))}</span><span class="ws-letters"><button type="button" class="ws-l" data-pick="${it.id}" data-v="T">T</button><button type="button" class="ws-l" data-pick="${it.id}" data-v="F">F</button></span>${pen(it.id)}</div>`)}</div>`;
    case 'order':
      return html`<div class="ws-rows">${s.items.map((it, k) => html`<div class="ws-it ws-ord" data-item="${it.id}"><span class="ws-n">${k + 1}</span><div class="ws-oq"><div class="ws-tiles">${it.words.map((w, j) => html`<button type="button" class="ws-tile" data-tile="${it.id}" data-j="${j}">${w}</button>`)}<button type="button" class="ws-reset" data-reset="${it.id}" aria-label="Temizle">${icon('redo')}</button></div>${inp(it.id, 'long')}${pen(it.id)}</div></div>`)}</div>`;
    case 'table':
      return html`<div class="ws-tbl-wrap"><table class="ws-tbl"><thead><tr>${s.head.map((h) => html`<th>${h}</th>`)}</tr></thead><tbody>${s.rows.map((r) => html`<tr data-item="${r.id}"><td><b>${r.cells[0]}</b></td><td>${inp(r.id)}${pen(r.id)}</td></tr>`)}</tbody></table></div>`;
    case 'sort':
      return html`<div class="ws-pool">${s.words.map((w) => html`<button type="button" class="ws-sw" data-sw="${w.id}">${w.e ? html`<span>${w.e}</span>` : ''}${w.w}</button>`)}</div>
        <div class="ws-cols" style="--n:${s.cols.length}">${s.cols.map((c, i) => html`<div class="ws-col" data-col="${i}"><b>${c}</b><div class="ws-drop"></div></div>`)}</div>`;
    case 'search':
      return html`<div class="ws-search"><div class="ws-sgrid" style="--n:${s.grid.length}">${s.grid.map((row, r) => row.map((ch, c) => html`<button type="button" class="ws-cell" data-rc="${r},${c}">${ch}</button>`))}</div>
        <div class="ws-slist">${s.words.map((w, i) => html`<span class="ws-sword" data-sword="${i}"><span class="ws-se">${w.e}</span>${w.w}</span>`)}</div></div>`;
    case 'odd':
      return html`<div class="ws-rows">${s.items.map((it, k) => html`<div class="ws-it" data-item="${it.id}"><span class="ws-n">${k + 1}</span><span class="ws-odd">${it.opts.map((o, j) => html`<button type="button" class="ws-opt" data-pick="${it.id}" data-v="${j}">${o}</button>`)}</span>${pen(it.id)}</div>`)}</div>`;
    case 'write':
      return html`<div class="ws-write"><textarea class="ws-ta" rows="${s.lines}" placeholder="Write here..." data-write="${s.no}"></textarea><div class="ws-check">${s.checklist.map(([k, label]) => html`<span class="ws-ck" data-ck="${k}">${icon('check')}${label}</span>`)}</div><div class="ws-fb" data-fb="${s.no}"></div></div>`;
    default:
      return '';
  }
}

const COUNT = (s) => (s.type === 'sort' ? s.words.length : s.type === 'search' ? s.words.length : s.rows ? s.rows.length : s.type === 'write' ? 0 : s.items.length);

function keyHTML(sheet) {
  return html`<section class="ws-akey"><h2>Answer Key · Cevap Anahtarı</h2>${sheet.sections.map((s) => {
    let list = [];
    if (s.type === 'sort') list = s.cols.map((c, i) => `${c}: ${s.words.filter((w) => w.col === i).map((w) => w.w).join(', ')}`);
    else if (s.type === 'search') list = [s.words.map((w) => w.w).join(', ')];
    else if (s.type === 'write') list = ['Kendi cevabın.'];
    else if (s.rows) list = s.rows.map((r) => `${r.cells[0]} → ${r.ans[0]}`);
    else if (s.type === 'choice') list = s.items.map((it) => it.opts[it.ans]);
    else if (s.type === 'odd') list = s.items.map((it) => it.opts[it.ans]);
    else if (s.type === 'tf') list = s.items.map((it) => (it.ans ? 'T' : 'F'));
    else list = s.items.map((it) => (Array.isArray(it.ans) ? it.ans[0] : it.ans));
    return html`<div class="ws-kr"><b>${s.no}.</b> <span>${list.map((x, i) => html`${i ? ' · ' : ''}${s.type === 'sort' || s.type === 'search' || s.type === 'write' ? '' : html`<i>${i + 1})</i> `}${x}`)}</span></div>`;
  })}</section>`;
}

const CK = {
  adj: /\b(friendly|kind|generous|helpful|funny|honest|clever|smart|lazy|shy|patient|polite|rude|cheerful|talkative|quiet|calm|hard-working|hardworking|creative|brave|selfish|serious|outgoing|tidy|messy)\b/i,
  always: /\b(always|usually|often|sometimes|never|rarely)\b/i,
  because: /\b(because|and|but|so)\b/i,
  than: /\bthan\b/i,
  er: /\b\w+er than\b/i,
  more: /\b(more \w+|better|worse)\b/i,
  is: /\b(is|am|are)\b/i,
  'has got': /\b(has|have) got\b/i,
  freq: /\b(always|usually|often|sometimes|rarely|seldom|never)\b/i,
  week: /\b(once|twice|three times|four times) a week\b/i,
  never: /\bnever\b/i,
  love: /\b(love|loves|like|likes|enjoy|enjoys)\s+\w+ing\b/i,
  pdg: /\b(play|plays|do|does|go|goes)\s+\w+/i,
  opinion: /\b(exciting|boring|dangerous|safe|relaxing|tiring|healthy|easy|difficult|interesting|expensive|fun|popular)\b/i,
};

function mountSheet(view, id) {
  const seeds = store.get('sheets');
  let seed = (seeds[id] && seeds[id].seed) || 1;
  let sheet = buildSheet(id, seed);
  if (!sheet) {
    location.hash = '#/calisma';
    return {};
  }
  const unit = UNITS.find((u) => u.n === sheet.unit);
  let state = {};
  let checked = false;

  const draw = () => {
    state = {};
    checked = false;
    const today = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    view.innerHTML = toHTML(html`
      <div class="page ws-page" style="--uc:${unit.color};--ud:${unit.deep};--us:${unit.soft}">
        <div class="ws-toolbar">
          <a class="back-link" href="#/calisma">${icon('back')}<span>Kağıtlar</span></a>
          <div class="ws-tools">
            <button type="button" class="btn btn--primary btn--small" data-act="check">${icon('check')}Kontrol et</button>
            <button type="button" class="btn btn--small" data-act="new">${icon('redo')}Yeni kağıt</button>
            <button type="button" class="btn btn--small" data-act="print">${icon('note')}Yazdır</button>
            <button type="button" class="btn btn--ghost btn--small" data-act="key">🔑 Cevap anahtarı</button>
          </div>
        </div>
        <article class="ws-paper rise">
          <header class="ws-top">
            <div class="ws-brand"><span class="ws-e">${sheet.e}</span><div><span class="ws-unit">UNIT ${sheet.unit} · WORKSHEET</span><h1>${sheet.title}</h1><span class="ws-trt">${sheet.tr}</span></div></div>
            <div class="ws-meta">
              <div><span>Name</span><b>${displayName(store.get('name'))}</b></div>
              <div><span>Class</span><b>7 / ...</b></div>
              <div><span>Date</span><b>${today}</b></div>
            </div>
            <div class="ws-stamp" hidden></div>
          </header>
          ${sheet.sections.map((s) => html`<section class="ws-sec t-${s.type}" data-sec="${s.no}">
            <header class="ws-sh"><span class="ws-no">${s.no}</span><div class="ws-st"><b>${s.title}</b><small>${s.tr}</small></div>${COUNT(s) ? html`<span class="ws-pts" data-pts="${s.no}">/ ${COUNT(s)}</span>` : ''}</header>
            <div class="ws-body">${sectionBody(s)}</div>
          </section>`)}
          <footer class="ws-foot"><span>English Notebook · 7. Sınıf</span><span>Kağıt no: ${sheet.id}-${seed}</span></footer>
          <div class="ws-keywrap" hidden>${keyHTML(sheet)}</div>
        </article>
      </div>`);
    bindSorts();
  };

  /* ----- Sıralama (sort) ve kelime avı durumu ----- */
  let selWord = null;
  let selCell = null;
  const found = new Map();
  function bindSorts() {
    selWord = null;
    selCell = null;
    found.clear();
  }

  const secOf = (no) => sheet.sections[Number(no) - 1];
  const itemSec = (itemId) => sheet.sections[Number(String(itemId).split('-')[0])];

  function updateBank(node) {
    const sec = node.closest('.ws-sec');
    if (!sec) return;
    const used = new Set([...sec.querySelectorAll('.ws-in')].map((i) => norm(i.value)).filter(Boolean));
    sec.querySelectorAll('[data-bw]').forEach((b) => b.classList.toggle('used', used.has(norm(b.dataset.bw))));
  }

  function writeCheck(ta) {
    const s = secOf(ta.dataset.write);
    const txt = ta.value;
    ta.closest('.ws-write').querySelectorAll('[data-ck]').forEach((c) => c.classList.toggle('on', CK[c.dataset.ck] ? CK[c.dataset.ck].test(txt) : false));
    return s;
  }

  function check() {
    let right = 0;
    let total = 0;
    view.querySelectorAll('.ws-it, .ws-gi, .ws-tbl tr[data-item]').forEach((n) => n.classList.remove('ok', 'no'));
    view.querySelectorAll('[data-pen]').forEach((p) => { p.textContent = ''; });
    for (const s of sheet.sections) {
      let r = 0;
      const mark = (itemId, ok, correctText) => {
        const node = view.querySelector(`[data-item="${itemId}"]`);
        if (node) node.classList.add(ok ? 'ok' : 'no');
        const p = view.querySelector(`[data-pen="${itemId}"]`);
        if (p && !ok) p.textContent = correctText;
        if (ok) r++;
      };
      if (s.type === 'fill' || s.type === 'order') {
        for (const it of s.items) {
          const v = norm((view.querySelector(`input[data-id="${it.id}"]`) || {}).value);
          mark(it.id, !!v && it.ans.map(norm).includes(v), it.ans[0]);
        }
      } else if (s.type === 'table') {
        for (const row of s.rows) {
          const v = norm((view.querySelector(`input[data-id="${row.id}"]`) || {}).value);
          mark(row.id, !!v && row.ans.map(norm).includes(v), row.ans[0]);
        }
      } else if (s.type === 'choice' || s.type === 'odd') {
        for (const it of s.items) mark(it.id, state[it.id] === String(it.ans), it.opts[it.ans]);
      } else if (s.type === 'match') {
        for (const it of s.items) mark(it.id, state[it.id] === it.ans, it.ans);
      } else if (s.type === 'tf') {
        for (const it of s.items) mark(it.id, state[it.id] === (it.ans ? 'T' : 'F'), it.ans ? 'T' : 'F');
      } else if (s.type === 'sort') {
        for (const w of s.words) {
          const ok = state[w.id] === String(w.col);
          if (ok) r++;
          const chip = view.querySelector(`[data-sw="${w.id}"]`);
          if (chip) { chip.classList.toggle('ok', ok); chip.classList.toggle('no', !ok); if (!ok) chip.title = `Doğrusu: ${s.cols[w.col]}`; }
        }
      } else if (s.type === 'search') {
        r = s.words.filter((w, i) => found.has(`${s.no}:${i}`)).length;
        view.querySelectorAll(`[data-sec="${s.no}"] [data-sword]`).forEach((x) => x.classList.toggle('miss', !found.has(`${s.no}:${x.dataset.sword}`)));
      } else if (s.type === 'write') {
        const ta = view.querySelector(`[data-write="${s.no}"]`);
        const fb = view.querySelector(`[data-fb="${s.no}"]`);
        writeCheck(ta);
        const sents = ta.value.split(/(?<=[.!?])\s+|\n+/).map((x) => x.trim()).filter((x) => x.split(' ').length >= 2);
        if (!sents.length) { fb.innerHTML = '<p class="ws-fbn">Henüz bir şey yazmadın. Birkaç cümle yazıp tekrar kontrol et!</p>'; continue; }
        const fixes = sents.map((x) => [x, checkSentence(x)]).filter(([, c]) => !c.ok);
        fb.innerHTML = fixes.length
          ? `<p class="ws-fbn">✍️ ${sents.length} cümle yazdın. Şunlara bir bak:</p>${fixes.map(([x, c]) => `<div class="ws-fix"><s>${x.replace(/</g, '&lt;')}</s><b>${c.fixed.replace(/</g, '&lt;')}</b><small>${c.notes.map((n) => n.why.replace(/\*\*(.+?)\*\*/g, '$1')).join(' ')}</small></div>`).join('')}`
          : `<p class="ws-fbn ok">🌟 ${sents.length} cümlenin hepsi doğru görünüyor. Harika!</p>`;
        continue;
      }
      const c = COUNT(s);
      total += c;
      right += r;
      const pts = view.querySelector(`[data-pts="${s.no}"]`);
      if (pts) { pts.textContent = `${r} / ${c}`; pts.classList.toggle('full', r === c); }
    }
    const pct = total ? Math.round((right / total) * 100) : 0;
    const stamp = view.querySelector('.ws-stamp');
    stamp.hidden = false;
    stamp.innerHTML = `<b>${right}/${total}</b><span>%${pct}</span>`;
    stamp.className = `ws-stamp ${pct >= 85 ? 'great' : pct >= 60 ? 'good' : 'low'}`;
    stamp.animate([{ transform: 'scale(2.2) rotate(-24deg)', opacity: 0 }, { transform: 'scale(.92) rotate(-12deg)', opacity: 1, offset: 0.7 }, { transform: 'rotate(-12deg)', opacity: 1 }], { duration: 520, easing: 'cubic-bezier(.22,1,.36,1)' });
    sfx.stamp();
    const prev = store.get('sheets')[id] || {};
    const firstTime = !checked;
    checked = true;
    store.patch('sheets', id, { ...prev, seed, best: Math.max(prev.best || 0, pct), t: Date.now() });
    if (firstTime) {
      const gain = Math.min(40, right);
      if (gain) addXP(gain, { x: stamp.getBoundingClientRect().left + 40, y: stamp.getBoundingClientRect().top + 30 });
    }
    if (pct >= 85) { setTimeout(() => sfx.fanfare(), 300); const r = stamp.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, 60); }
    toast(pct >= 85 ? `Harika! %${pct} başarı.` : `%${pct}. Kırmızı kalemle düzeltilenlere bak, sonra tekrar dene!`, { tone: pct >= 60 ? 'good' : 'bad' });
    const firstWrong = view.querySelector('.ws-it.no, .ws-gi.no, tr.no');
    if (firstWrong && pct < 100) setTimeout(() => firstWrong.scrollIntoView({ behavior: 'smooth', block: 'center' }), 700);
  }

  const onClick = (e) => {
    const act = e.target.closest('[data-act]');
    if (act) {
      const a = act.dataset.act;
      sfx.tap();
      if (a === 'check') check();
      if (a === 'new') {
        seed += 1;
        store.patch('sheets', id, { ...(store.get('sheets')[id] || {}), seed });
        sheet = buildSheet(id, seed);
        draw();
        view.querySelector('.ws-paper').animate([{ transform: 'translateX(40px) rotate(2deg)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 480, easing: 'cubic-bezier(.22,1,.36,1)' });
        toast('Yeni sorularla yeni bir kağıt hazır!', { tone: 'good' });
      }
      if (a === 'print') window.print();
      if (a === 'key') {
        const k = view.querySelector('.ws-keywrap');
        k.hidden = !k.hidden;
        act.classList.toggle('on', !k.hidden);
        if (!k.hidden) k.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }
    const pk = e.target.closest('[data-pick]');
    if (pk) {
      const itemId = pk.dataset.pick;
      state[itemId] = pk.dataset.v;
      pk.parentElement.querySelectorAll(`[data-pick="${itemId}"]`).forEach((b) => b.classList.toggle('on', b === pk));
      pk.closest('[data-item]').classList.remove('ok', 'no');
      sfx.pen();
      return;
    }
    const tile = e.target.closest('[data-tile]');
    if (tile) {
      const input = view.querySelector(`input[data-id="${tile.dataset.tile}"]`);
      if (tile.classList.contains('used')) return;
      tile.classList.add('used');
      let v = input.value.trim();
      let w = tile.textContent;
      if (!v) w = w.charAt(0).toUpperCase() + w.slice(1);
      v = `${v ? `${v} ` : ''}${w}`;
      const left = [...tile.parentElement.querySelectorAll('.ws-tile:not(.used)')];
      if (!left.length && !/[.?!]$/.test(v)) v += itemSec(tile.dataset.tile).items.find((x) => x.id === tile.dataset.tile).ans[0].slice(-1);
      input.value = v;
      sfx.tap();
      return;
    }
    const rs = e.target.closest('[data-reset]');
    if (rs) {
      view.querySelector(`input[data-id="${rs.dataset.reset}"]`).value = '';
      rs.parentElement.querySelectorAll('.ws-tile').forEach((t) => t.classList.remove('used'));
      sfx.soft();
      return;
    }
    const sw = e.target.closest('[data-sw]');
    if (sw) {
      if (sw.closest('.ws-drop')) {
        // Yerleşmiş kelime havuza döner
        const pool = sw.closest('.ws-sec').querySelector('.ws-pool');
        pool.append(sw);
        delete state[sw.dataset.sw];
        sw.classList.remove('ok', 'no');
        sfx.soft();
        return;
      }
      sw.closest('.ws-pool').querySelectorAll('.ws-sw').forEach((x) => x.classList.toggle('sel', x === sw && !x.classList.contains('sel')));
      selWord = sw.classList.contains('sel') ? sw : null;
      sfx.tap();
      return;
    }
    const col = e.target.closest('[data-col]');
    if (col && selWord && col.closest('.ws-sec') === selWord.closest('.ws-sec')) {
      col.querySelector('.ws-drop').append(selWord);
      state[selWord.dataset.sw] = col.dataset.col;
      selWord.classList.remove('sel');
      selWord.animate([{ transform: 'scale(1.2)' }, { transform: 'none' }], { duration: 260 });
      selWord = null;
      sfx.pop();
      return;
    }
    const cell = e.target.closest('[data-rc]');
    if (cell) {
      const secNo = cell.closest('.ws-sec').dataset.sec;
      const s = secOf(secNo);
      if (!selCell || selCell.closest('.ws-sec') !== cell.closest('.ws-sec')) {
        if (selCell) selCell.classList.remove('sel');
        selCell = cell;
        cell.classList.add('sel');
        sfx.tap();
        return;
      }
      const a = selCell.dataset.rc.split(',').map(Number);
      const b = cell.dataset.rc.split(',').map(Number);
      selCell.classList.remove('sel');
      selCell = null;
      const idx = s.words.findIndex((w) => {
        const f = w.cells[0];
        const l = w.cells[w.cells.length - 1];
        return (f[0] === a[0] && f[1] === a[1] && l[0] === b[0] && l[1] === b[1]) || (f[0] === b[0] && f[1] === b[1] && l[0] === a[0] && l[1] === a[1]);
      });
      if (idx < 0 || found.has(`${secNo}:${idx}`)) { sfx.wrong(); return; }
      found.set(`${secNo}:${idx}`, true);
      const hue = (idx * 47) % 360;
      for (const [r, c] of s.words[idx].cells) {
        const cl = cell.closest('.ws-sgrid').querySelector(`[data-rc="${r},${c}"]`);
        cl.classList.add('found');
        cl.style.setProperty('--h', hue);
      }
      const wl = cell.closest('.ws-search').querySelector(`[data-sword="${idx}"]`);
      wl.classList.add('found');
      wl.classList.remove('miss');
      sfx.right();
    }
  };
  const onInput = (e) => {
    if (e.target.matches('.ws-in')) {
      e.target.closest('[data-item]').classList.remove('ok', 'no');
      updateBank(e.target);
    }
    if (e.target.matches('.ws-ta')) writeCheck(e.target);
  };
  const onKey = (e) => {
    if (e.key === 'Enter' && e.target.matches('.ws-in')) {
      const all = [...view.querySelectorAll('.ws-in')];
      const next = all[all.indexOf(e.target) + 1];
      if (next) next.focus();
      e.preventDefault();
    }
  };
  draw();
  view.addEventListener('click', onClick);
  view.addEventListener('input', onInput);
  view.addEventListener('keydown', onKey);
  return {
    unmount() {
      view.removeEventListener('click', onClick);
      view.removeEventListener('input', onInput);
      view.removeEventListener('keydown', onKey);
    },
  };
}

export function mountWorksheets(view, id) {
  return id ? mountSheet(view, id) : mountHub(view);
}

