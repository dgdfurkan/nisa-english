// Görsel anlatım blokları: konuyu resim, animasyon ve dokunarak keşfettiren küçük etkileşimli sahneler.
// Her blok mountViz(kap, blok) ile kurulur ve temizleme fonksiyonu döner.

import { html, raw, toHTML, shuffle } from '../lib/dom.js';
import { tappable } from '../lib/text.js';
import { lineId } from '../data/units.js';
import { WORDS, WORD, slug } from '../data/words.js';
import { sayBtn } from './kit.js';
import { personSVG, personG, fill, isMale } from './person.js';
import { sfx } from '../audio/sfx.js';
import { say } from '../audio/voice.js';
import { MOODS, QUAD, FAMILY, PARA_PLAN, ROUTINE, WEEK, WEEK_TIMES, LOVE, LOVE_SPORTS, PLACES, WINBEAT } from '../data/viz-data.js';

const en = (s) => raw(tappable(s));
const line = (s, tr = '') => html`<div class="vz-line"><div class="vz-en">${en(s)}</div>${tr ? html`<div class="vz-tr">${tr}</div>` : ''}${sayBtn(lineId(s))}</div>`;
const wordSay = (w) => { const x = WORD.get(slug(w)); return x ? sayBtn(`w-${x.id}`) : ''; };
const pop = (node) => node && node.animate([{ transform: 'scale(.92)', opacity: 0.4 }, { transform: 'scale(1.04)', opacity: 1 }, { transform: 'none' }], { duration: 380, easing: 'cubic-bezier(.34,1.56,.64,1)' });
// Türkçe ayrılma eki: Ali'den, Elif'ten, Can'dan
function abl(name) {
  const v = (name.toLocaleLowerCase('tr').match(/[aeıioöuü]/g) || ['e']).pop();
  const back = 'aıou'.includes(v);
  const hard = /[fstkçşhp]$/i.test(name);
  return `${name}'${hard ? 't' : 'd'}${back ? 'an' : 'en'}`;
}
const join = (list) => (list.length <= 1 ? list.join('') : `${list.slice(0, -1).join(', ')} and ${list.at(-1)}`);

// Ekrana girince bir kez oynayan animasyonlar
function onSeen(node, fn) {
  if (!('IntersectionObserver' in window)) { fn(); return () => {}; }
  const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); fn(); } }, { threshold: 0.25 });
  io.observe(node);
  return () => io.disconnect();
}

const optRow = (name, label, opts, value) => html`<div class="st-row"><span class="st-lab">${label}</span><div class="st-opts" data-opt="${name}">${opts.map(([v, txt, extra]) => html`<button type="button" class="st-o ${v === value ? 'on' : ''}" data-v="${v}" ${extra ? raw(`style="--sw:${extra}"`) : ''}>${txt}</button>`)}</div></div>`;

/* ---------- 1. Karakter Stüdyosu ---------- */

const KINDS = [['girl', '👧 girl'], ['boy', '👦 boy'], ['woman', '👩 woman'], ['man', '👨 man'], ['grandma', '👵 grandma'], ['grandpa', '👴 grandpa']];
function studioText(s) {
  const p = fill(s);
  const he = isMale(p.kind) ? 'He' : 'She';
  const isP = [];
  if (p.h === 'tall') isP.push('tall');
  else if (p.h === 'short') isP.push('short');
  else isP.push('of medium height');
  if (p.build === 'slim') isP.push('slim');
  if (p.build === 'plump') isP.push('a bit plump');
  if (p.build === 'strong') isP.push('well-built');
  if (p.kind === 'grandma' || p.kind === 'grandpa') isP.push('old');
  if (p.kind === 'girl' || p.kind === 'boy') isP.push('young');
  if (p.hairLen === 'bald') isP.push('bald');
  const hasP = [];
  if (p.hairLen !== 'bald') hasP.push(`${{ long: 'long', shoulder: 'shoulder-length', short: 'short', bun: '' }[p.hairLen]} ${p.hairType} ${p.hairColor} hair`.replace(/^\s+/, ''));
  if (p.eyes) hasP.push(`${p.eyes} eyes`);
  if (isMale(p.kind) && p.beard) hasP.push('a beard');
  if (isMale(p.kind) && p.moustache) hasP.push('a moustache');
  if (p.freckles) hasP.push('freckles');
  if (p.braces) hasP.push('braces');
  const wear = [];
  if (p.glasses) wear.push('glasses');
  if (p.earrings) wear.push('earrings');
  return {
    is: `${he} is ${join(isP)}.`,
    has: hasP.length ? `${he} has got ${join(hasP)}.` : '',
    wear: wear.length ? `${he} wears ${join(wear)}.` : `${he} doesn't wear glasses.`,
    formula: p.hairLen === 'bald' ? null : [{ long: 'long', shoulder: 'shoulder-length', short: 'short', bun: 'short' }[p.hairLen], p.hairType, p.hairColor],
  };
}

function mountStudio(node) {
  const s = { kind: 'girl', h: 'tall', build: 'slim', hairLen: 'long', hairType: 'curly', hairColor: 'red', eyes: 'green', glasses: true, freckles: true, beard: false, moustache: false, earrings: false, braces: false };
  node.innerHTML = toHTML(html`<div class="vz studio">
    <div class="vz-head"><span class="vz-badge">🎨 Karakter Stüdyosu</span><span class="vz-sub">Seçimleri değiştir, cümleler kendiliğinden yazılsın!</span></div>
    <div class="st-grid">
      <div class="st-stage"><div class="st-ruler" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div><div class="st-person"></div></div>
      <div class="st-ctrl">
        ${optRow('kind', 'Kim?', KINDS, s.kind)}
        ${optRow('h', 'Boy', [['short', 'short'], ['mid', 'medium'], ['tall', 'tall']], s.h)}
        ${optRow('build', 'Vücut', [['slim', 'slim'], ['mid', 'normal'], ['plump', 'plump'], ['strong', 'well-built']], s.build)}
        ${optRow('hairLen', 'Saç boyu', [['short', 'short'], ['shoulder', 'shoulder-length'], ['long', 'long'], ['bald', 'bald']], s.hairLen)}
        ${optRow('hairType', 'Saç şekli', [['straight', 'straight'], ['wavy', 'wavy'], ['curly', 'curly']], s.hairType)}
        ${optRow('hairColor', 'Saç rengi', [['black', 'black', '#2c2633'], ['brown', 'brown', '#7a4a26'], ['blonde', 'blonde', '#f3c65a'], ['red', 'red', '#d4572b'], ['grey', 'grey', '#c3c3cc']], s.hairColor)}
        ${optRow('eyes', 'Gözler', [['brown', 'brown', '#8a5a2b'], ['blue', 'blue', '#5aa5e8'], ['green', 'green', '#4caf6e']], s.eyes)}
        <div class="st-row"><span class="st-lab">Ekstra</span><div class="st-opts" data-tog="1">
          ${[['glasses', '👓 glasses'], ['freckles', 'freckles'], ['earrings', 'earrings'], ['braces', 'braces'], ['beard', '🧔 beard'], ['moustache', 'moustache']].map(([k, t]) => html`<button type="button" class="st-o tog ${s[k] ? 'on' : ''}" data-k="${k}">${t}</button>`)}
        </div></div>
      </div>
    </div>
    <div class="st-out">
      <div class="st-line is"><span class="st-tag">is</span><span class="st-en"></span></div>
      <div class="st-line has"><span class="st-tag">has got</span><span class="st-en"></span></div>
      <div class="st-line wear"><span class="st-tag">wears</span><span class="st-en"></span></div>
      <div class="st-formula" aria-label="Saç sırası"></div>
    </div>
  </div>`);
  const person = node.querySelector('.st-person');
  const outs = { is: node.querySelector('.is .st-en'), has: node.querySelector('.has .st-en'), wear: node.querySelector('.wear .st-en') };
  const formula = node.querySelector('.st-formula');
  const draw = (first) => {
    person.innerHTML = personSVG({ ...s, beard: isMale(s.kind) && s.beard, moustache: isMale(s.kind) && s.moustache });
    const t = studioText(s);
    for (const k of ['is', 'has', 'wear']) {
      const v = t[k];
      const row = outs[k].parentElement;
      row.hidden = !v;
      if (outs[k].dataset.v !== v) {
        outs[k].dataset.v = v;
        outs[k].innerHTML = tappable(v);
        if (!first) pop(row);
      }
    }
    formula.innerHTML = t.formula ? toHTML(html`<span class="sf-lab">Saç sırası:</span>${t.formula.map((w, i) => html`<span class="sf-p p${i}"><b>${w}</b><small>${['uzunluk', 'şekil', 'renk'][i]}</small></span><span class="sf-plus">${i < 2 ? '+' : ''}</span>`)}<span class="sf-p hair"><b>hair</b></span>`) : '';
    node.querySelectorAll('[data-k="beard"], [data-k="moustache"]').forEach((b) => { b.disabled = !isMale(s.kind); });
  };
  const onClick = (e) => {
    const b = e.target.closest('.st-o');
    if (!b || b.disabled) return;
    const row = b.parentElement;
    if (row.dataset.tog) {
      s[b.dataset.k] = !s[b.dataset.k];
      b.classList.toggle('on', s[b.dataset.k]);
    } else {
      const key = row.dataset.opt;
      s[key] = b.dataset.v;
      row.querySelectorAll('.st-o').forEach((x) => x.classList.toggle('on', x === b));
      if (key === 'kind') {
        const d = fill({ kind: s.kind });
        Object.assign(s, { hairLen: d.hairLen === 'bun' ? 'short' : d.hairLen, hairColor: d.hairColor });
        node.querySelectorAll('[data-opt="hairLen"] .st-o').forEach((x) => x.classList.toggle('on', x.dataset.v === s.hairLen));
        node.querySelectorAll('[data-opt="hairColor"] .st-o').forEach((x) => x.classList.toggle('on', x.dataset.v === s.hairColor));
      }
    }
    sfx.pop();
    draw(false);
    pop(person.firstElementChild);
  };
  node.addEventListener('click', onClick);
  draw(true);
  return () => node.removeEventListener('click', onClick);
}

/* ---------- 2. Etiketli karakter ---------- */

function mountAnatomy(node, b) {
  const look = b.look || { kind: 'girl', h: 'tall', build: 'slim', hairLen: 'long', hairType: 'wavy', hairColor: 'blonde', eyes: 'blue', glasses: true, freckles: true };
  const p = fill(look);
  const sc = 1.25;
  const k = typeof p.h === 'number' ? p.h : { tall: 1, mid: 0.89, short: 0.76 }[p.h] || 0.89;
  const pt = (x, y) => [150 + (50 + (x - 50) * k - 50) * sc, 8 + (199 + (y - 199) * k) * sc];
  const labels = b.labels || [
    { t: 'tall', type: 'is', at: [12, 90], side: 'l', y: 40 },
    { t: 'slim', type: 'is', at: [50, 130], side: 'l', y: 170 },
    { t: 'long wavy blonde hair', type: 'has', at: [77, 104], side: 'r', y: 50 },
    { t: 'blue eyes', type: 'has', at: [59, 63], side: 'r', y: 110 },
    { t: 'freckles', type: 'has', at: [66, 73], side: 'r', y: 160 },
    { t: 'glasses', type: 'wear', at: [41, 61], side: 'l', y: 105 },
  ];
  const svgLabels = labels.map((l, i) => {
    const [ax, ay] = pt(l.at[0], l.at[1]);
    const w = l.t.length * 7.2 + 22;
    const x = l.side === 'l' ? 8 : 392 - w;
    const ex = l.side === 'l' ? x + w : x;
    return `<g class="an-l t-${l.type}" style="--d:${i * 140}ms"><path class="an-line" d="M${ex} ${l.y} C ${(ex + ax) / 2} ${l.y}, ${(ex + ax) / 2} ${ay}, ${ax} ${ay}" pathLength="1"/><circle class="an-dot" cx="${ax}" cy="${ay}" r="3.4"/><rect x="${x}" y="${l.y - 13}" width="${w}" height="26" rx="13"/><text x="${x + w / 2}" y="${l.y + 4.5}" text-anchor="middle">${l.t}</text></g>`;
  }).join('');
  node.innerHTML = toHTML(html`<div class="vz anatomy">
    <div class="vz-head"><span class="vz-badge">🔎 Parça parça tarif</span><span class="vz-sub">Renkler hangi fiili kullanacağını gösteriyor.</span></div>
    <div class="an-wrap">${raw(`<svg class="an-svg" viewBox="0 0 400 260" role="img" aria-label="Etiketli karakter"><g transform="translate(${150 - 50 * sc} 8) scale(${sc})"><path class="an-h" d="M12 ${199 + (36 - 199) * k} V197 M7 ${199 + (36 - 199) * k + 6} L12 ${199 + (36 - 199) * k} L17 ${199 + (36 - 199) * k + 6} M7 191 L12 197 L17 191"/>${personG(look)}</g>${svgLabels}</svg>`)}</div>
    <div class="an-legend"><span class="t-is">is</span><span class="t-has">has got</span><span class="t-wear">wears</span></div>
    ${b.say ? line(b.say, b.sayTr || '') : ''}
  </div>`);
  return onSeen(node, () => node.querySelector('.anatomy').classList.add('play'));
}

/* ---------- 3. Kişilik kartları ---------- */

function mountMoods(node, b) {
  const list = (b.only ? MOODS.filter((m) => b.only.includes(m.adj)) : MOODS).slice(0, b.n || 9);
  node.innerHTML = toHTML(html`<div class="vz moods">
    <div class="vz-head"><span class="vz-badge">🃏 Davranıştan kişiliğe</span><span class="vz-sub">Cümleyi oku, tahmin et, sonra karta dokun.</span></div>
    <div class="md-grid">${list.map((m, i) => html`<button type="button" class="md-card" style="--i:${i}" aria-label="${m.adj}">
      <span class="md-in">
        <span class="md-f"><span class="md-e">${m.e}</span><span class="md-s">${m.en}</span><span class="md-q">Nasıl biri?</span></span>
        <span class="md-b"><span class="md-e sm">${m.e}</span><b class="md-adj">${m.adj}</b><span class="md-tr">${(WORD.get(slug(m.adj)) || {}).tr || ''}</span>${m.opp ? html`<span class="md-opp">zıttı: <b>${m.opp}</b></span>` : ''}</span>
      </span>
    </button>`)}</div>
  </div>`);
  const onClick = (e) => {
    const c = e.target.closest('.md-card');
    if (!c) return;
    c.classList.toggle('flip');
    sfx.flip();
    if (c.classList.contains('flip')) {
      const w = WORD.get(slug(c.getAttribute('aria-label')));
      if (w) say(`w-${w.id}`);
    }
  };
  node.addEventListener('click', onClick);
  return () => node.removeEventListener('click', onClick);
}

/* ---------- 4. Derece: a bit / quite / very ---------- */

function mountDegree(node) {
  const rows = [['normal', 0.82, ''], ['a bit tall', 0.88, 'biraz uzun'], ['quite tall', 0.94, 'oldukça uzun'], ['very tall', 1.0, 'çok uzun']];
  node.innerHTML = toHTML(html`<div class="vz degree">
    <div class="vz-head"><span class="vz-badge">📶 Ne kadar?</span><span class="vz-sub">a bit &lt; quite &lt; very</span></div>
    <div class="dg-row">${rows.map(([t, h, tr], i) => html`<div class="dg-col" style="--i:${i}">
      <div class="dg-fig">${raw(personSVG({ kind: 'boy', h, hairColor: 'black', build: 'slim' }))}</div>
      <div class="dg-meter"><i style="--p:${(i + 0.4) / 3.4}"></i></div>
      <b>${t}</b><span>${tr}</span>
    </div>`)}</div>
    ${line('He is very tall, but his sister is quite short.', 'O çok uzun ama kız kardeşi oldukça kısa.')}
  </div>`);
  return onSeen(node, () => node.querySelector('.degree').classList.add('play'));
}

/* ---------- 5. Dört soru ---------- */

function mountQuad(node) {
  node.innerHTML = toHTML(html`<div class="vz quad">
    <div class="vz-head"><span class="vz-badge">🧭 Dört soru, dört anlam</span><span class="vz-sub">Karta dokun, cevabı gör ve dinle.</span></div>
    <div class="qd-grid">${QUAD.map((q, i) => html`<button type="button" class="qd" style="--c:${q.c};--i:${i}">
      <span class="qd-e">${q.e}</span><span class="qd-tag">${q.tag}</span>
      <b class="qd-q">${q.q}</b><span class="qd-tr">${q.tr}</span>
      <span class="qd-a"><span class="qd-arrow">↳</span>${q.a}</span>
    </button>`)}</div>
  </div>`);
  const onClick = (e) => {
    const c = e.target.closest('.qd');
    if (!c) return;
    const open = !c.classList.contains('open');
    c.classList.toggle('open', open);
    sfx.soft();
    if (open) say(lineId(QUAD[[...c.parentElement.children].indexOf(c)].a));
  };
  node.addEventListener('click', onClick);
  return () => node.removeEventListener('click', onClick);
}

/* ---------- 6. Aile: look like / be like ---------- */

function mountFamily(node) {
  const mom = { kind: 'woman', hairLen: 'long', hairType: 'curly', hairColor: 'red', glasses: true, freckles: true, eyes: 'green' };
  const kid = { kind: 'girl', h: 'short', hairLen: 'shoulder', hairType: 'curly', hairColor: 'red', glasses: true, freckles: true, eyes: 'green' };
  const dad = { kind: 'man', hairColor: 'black', beard: true, mood: 'big' };
  const son = { kind: 'boy', h: 'short', hairColor: 'blonde', mood: 'big' };
  node.innerHTML = toHTML(html`<div class="vz family">
    <div class="vz-head"><span class="vz-badge">👪 look like mı, be like mı?</span></div>
    <div class="fm-grid">
      <div class="fm-card look">
        <div class="fm-tag">look like · dış görünüş</div>
        <div class="fm-pair">${raw(personSVG(mom))}${raw(personSVG(kid))}<svg class="fm-arc" viewBox="0 0 200 60" aria-hidden="true"><path d="M50 50 Q100 -10 150 50" pathLength="1"/></svg></div>
        <div class="fm-same"><span>🧡 same curly red hair</span><span>👓 same glasses</span><span>✨ same freckles</span></div>
        ${line(FAMILY.look.en, FAMILY.look.tr)}
      </div>
      <div class="fm-card like">
        <div class="fm-tag">be like · kişilik</div>
        <div class="fm-pair">${raw(personSVG(dad))}${raw(personSVG(son))}<span class="fm-heart">😂</span></div>
        <div class="fm-same"><span>😂 both funny</span><span>🙅 different hair</span></div>
        ${line(FAMILY.like.en, FAMILY.like.tr)}
      </div>
    </div>
  </div>`);
  return onSeen(node, () => node.querySelector('.family').classList.add('play'));
}

/* ---------- 7. Boy sırası ---------- */

const LINE_PEOPLE = [
  { name: 'Ali', look: { kind: 'boy', h: 1, hairColor: 'black', build: 'slim' }, cm: 165, age: 14 },
  { name: 'Elif', look: { kind: 'girl', h: 0.9, hairColor: 'brown', hairType: 'wavy' }, cm: 150, age: 13 },
  { name: 'Can', look: { kind: 'boy', h: 0.8, hairColor: 'blonde', build: 'plump' }, cm: 138, age: 10 },
];
function mountLineup(node) {
  let sel = [0, 1];
  let mode = 'tall';
  node.innerHTML = toHTML(html`<div class="vz lineup">
    <div class="vz-head"><span class="vz-badge">📏 Boy ölçümü</span><span class="vz-sub">İki kişiye dokun, karşılaştırma cümlesi çıksın.</span></div>
    <div class="ln-modes"><button type="button" class="st-o on" data-m="tall">📏 tall / short</button><button type="button" class="st-o" data-m="old">🎂 old / young</button></div>
    <div class="ln-stage">
      <div class="ln-wall" aria-hidden="true">${[170, 160, 150, 140, 130].map((c) => html`<div class="ln-mark"><span>${c}</span></div>`)}</div>
      ${LINE_PEOPLE.map((p, i) => html`<button type="button" class="ln-p" data-i="${i}">${raw(personSVG(p.look))}<span class="ln-name">${p.name}</span><span class="ln-val" data-cm="${p.cm} cm" data-age="${p.age} yaş">${p.cm} cm</span></button>`)}
    </div>
    <div class="ln-out"></div>
  </div>`);
  const out = node.querySelector('.ln-out');
  const draw = () => {
    node.querySelectorAll('.ln-p').forEach((b, i) => { b.classList.toggle('on', sel.includes(i)); b.querySelector('.ln-val').textContent = mode === 'tall' ? `${LINE_PEOPLE[i].cm} cm` : `${LINE_PEOPLE[i].age} yaş`; });
    const [a, c] = sel.map((i) => LINE_PEOPLE[i]);
    const key = mode === 'tall' ? 'cm' : 'age';
    const [big, small] = a[key] >= c[key] ? [a, c] : [c, a];
    const [up, down] = mode === 'tall' ? ['taller', 'shorter'] : ['older', 'younger'];
    out.innerHTML = toHTML(html`<div class="ln-s"><span class="ln-who">${big.name}</span> is <mark>${up}</mark> than <span class="ln-who">${small.name}</span>.</div><div class="ln-s"><span class="ln-who">${small.name}</span> is <mark>${down}</mark> than <span class="ln-who">${big.name}</span>.</div><div class="vz-tr">${big.name}, ${abl(small.name)} daha ${mode === 'tall' ? 'uzun' : 'büyük'}. ${small.name}, ${abl(big.name)} daha ${mode === 'tall' ? 'kısa' : 'küçük'}.</div>`);
    pop(out);
  };
  const onClick = (e) => {
    const m = e.target.closest('[data-m]');
    if (m) {
      mode = m.dataset.m;
      node.querySelectorAll('[data-m]').forEach((x) => x.classList.toggle('on', x === m));
      node.querySelector('.lineup').classList.toggle('age', mode === 'old');
      sfx.tap();
      draw();
      return;
    }
    const p = e.target.closest('.ln-p');
    if (!p) return;
    const i = Number(p.dataset.i);
    if (sel.includes(i)) return;
    sel = [sel[1], i];
    sfx.pop();
    draw();
  };
  node.addEventListener('click', onClick);
  draw();
  return () => node.removeEventListener('click', onClick);
}

/* ---------- 8. Karşılaştırma laboratuvarı ---------- */

const ADJS = [
  ['tall', 'taller', 'er', '📏'], ['old', 'older', 'er', '🎂'], ['fast', 'faster', 'er', '⚡'], ['strong', 'stronger', 'er', '💪'],
  ['big', 'bigger', 'dbl', '🐘'], ['thin', 'thinner', 'dbl', '🥢'], ['funny', 'funnier', 'y', '😂'], ['lazy', 'lazier', 'y', '😴'],
  ['beautiful', 'more beautiful', 'more', '🌸'], ['intelligent', 'more intelligent', 'more', '🧠'], ['generous', 'more generous', 'more', '🎁'],
  ['good', 'better', 'irr', '👍'], ['bad', 'worse', 'irr', '👎'],
];
const RULE = {
  er: ['Kısa sıfat', 'sona **-er** eklenir'],
  dbl: ['Sessiz + sesli + sessiz', 'son harf **çiftlenir**, sonra -er'],
  y: ['-y ile biten', '**y → i**, sonra -er'],
  more: ['Uzun sıfat', 'önüne **more** gelir'],
  irr: ['Düzensiz', 'kendine özgü, **ezberle**'],
};
function morphHTML(base, comp, rule) {
  if (rule === 'er') return html`<span class="mo-b">${base}</span><span class="mo-add">er</span>`;
  if (rule === 'r') return html`<span class="mo-b">${base}</span><span class="mo-add">r</span>`;
  if (rule === 'dbl') return html`<span class="mo-b">${base}</span><span class="mo-add">${base.at(-1)}er</span>`;
  if (rule === 'y') return html`<span class="mo-b">${base.slice(0, -1)}</span><span class="mo-chg">i</span><span class="mo-add">er</span>`;
  if (rule === 'more') return html`<span class="mo-add">more</span> <span class="mo-b">${base}</span>`;
  return html`<span class="mo-chg">${comp}</span>`;
}
function mountCompLab(node) {
  let adj = 0;
  const v = [7, 4];
  const who = [{ name: 'Ali', look: { kind: 'boy', hairColor: 'black' } }, { name: 'Elif', look: { kind: 'girl', hairColor: 'brown', hairType: 'wavy' } }];
  node.innerHTML = toHTML(html`<div class="vz complab">
    <div class="vz-head"><span class="vz-badge">🧪 Karşılaştırma Laboratuvarı</span><span class="vz-sub">Bir sıfat seç, çubukları kaydır.</span></div>
    <div class="cl-adjs">${ADJS.map(([a, , , e], i) => html`<button type="button" class="st-o ${i === adj ? 'on' : ''}" data-a="${i}">${e} ${a}</button>`)}</div>
    <div class="cl-arena">${who.map((w, k) => html`<div class="cl-side">
      <div class="cl-ava">${raw(personSVG(w.look))}</div>
      <div class="cl-meter"><i></i><span class="cl-e"></span></div>
      <b>${w.name}</b>
      <input type="range" min="1" max="10" value="${v[k]}" data-k="${k}" aria-label="${w.name}">
    </div>`)}</div>
    <div class="cl-out"><div class="cl-s"></div><div class="cl-rule"></div></div>
  </div>`);
  const sEl = node.querySelector('.cl-s');
  const rEl = node.querySelector('.cl-rule');
  const draw = (animate) => {
    const [base, comp, rule, e] = ADJS[adj];
    node.querySelectorAll('.cl-side').forEach((side, k) => {
      side.querySelector('.cl-meter i').style.transform = `scaleY(${v[k] / 10})`;
      side.querySelector('.cl-e').textContent = e;
      side.querySelector('.cl-e').style.transform = `translateY(${-(v[k] / 10) * 118}px)`;
    });
    let sent;
    if (v[0] === v[1]) sent = html`<b>Ali</b> is <mark>as ${base} as</mark> <b>Elif</b>.`;
    else {
      const [a, c] = v[0] > v[1] ? ['Ali', 'Elif'] : ['Elif', 'Ali'];
      sent = html`<b>${a}</b> is <mark>${comp}</mark> than <b>${c}</b>.`;
    }
    sEl.innerHTML = toHTML(sent);
    rEl.innerHTML = toHTML(html`<span class="cl-rt">${RULE[rule][0]}</span><span class="cl-morph"><span class="mo-from">${base}</span><span class="mo-arrow">→</span><span class="mo-to">${morphHTML(base, comp, rule)}</span></span><span class="cl-why">${raw(RULE[rule][1].replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'))}</span>`);
    if (animate) { pop(sEl); rEl.querySelectorAll('.mo-add, .mo-chg').forEach((x) => x.animate([{ transform: 'translateY(-10px) scale(1.4)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 480, easing: 'cubic-bezier(.34,1.56,.64,1)' })); }
  };
  const onClick = (e) => {
    const b = e.target.closest('[data-a]');
    if (!b) return;
    adj = Number(b.dataset.a);
    node.querySelectorAll('[data-a]').forEach((x) => x.classList.toggle('on', x === b));
    sfx.pop();
    draw(true);
  };
  let last = '';
  const onInput = (e) => {
    const r = e.target.closest('input[type=range]');
    if (!r) return;
    v[Number(r.dataset.k)] = Number(r.value);
    const key = v[0] > v[1] ? 'a' : v[0] < v[1] ? 'b' : 'eq';
    draw(key !== last);
    if (key !== last) sfx.tick();
    last = key;
  };
  node.addEventListener('click', onClick);
  node.addEventListener('input', onInput);
  draw(false);
  return () => { node.removeEventListener('click', onClick); node.removeEventListener('input', onInput); };
}

/* ---------- 9. Kelime dönüşümü (karşılaştırma kuralları) ---------- */

function mountMorph(node, b) {
  node.innerHTML = toHTML(html`<div class="vz morph">
    <div class="mo-grid">${b.items.map(([base, comp, rule], i) => html`<button type="button" class="mo-card" style="--i:${i}"><span class="mo-from">${base}</span><span class="mo-arrow">↓</span><span class="mo-to">${morphHTML(base, comp, rule)}</span></button>`)}</div>
    <div class="vz-sub center">Karta dokun, dönüşümü tekrar izle.</div>
  </div>`);
  const replay = (card) => card.querySelectorAll('.mo-add, .mo-chg').forEach((x, k) => x.animate([{ transform: 'translateY(-14px) scale(1.5)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 520, delay: 120 + k * 90, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'backwards' }));
  const onClick = (e) => {
    const c = e.target.closest('.mo-card');
    if (!c) return;
    sfx.pop();
    replay(c);
  };
  node.addEventListener('click', onClick);
  const stop = onSeen(node, () => node.querySelectorAll('.mo-card').forEach((c, i) => setTimeout(() => replay(c), i * 160)));
  return () => { node.removeEventListener('click', onClick); stop(); };
}

/* ---------- 10. Paragraf planı ---------- */

function mountParaPlan(node) {
  node.innerHTML = toHTML(html`<div class="vz paraplan">
    <div class="vz-head"><span class="vz-badge">🗺️ Paragrafın yol haritası</span><span class="vz-sub">Beş durak, beş renk.</span></div>
    <div class="pp-path">${PARA_PLAN.map((p, i) => html`<div class="pp-stop" style="--c:${p.c};--i:${i}">
      <span class="pp-node"><span>${p.e}</span><b>${i + 1}</b></span>
      <div class="pp-body"><span class="pp-t">${p.t}</span>${line(p.en, p.tr)}</div>
    </div>`)}</div>
    <div class="pp-full"><div class="eyebrow">Hepsi bir arada</div><p>${PARA_PLAN.map((p) => html`<span class="pp-seg" style="--c:${p.c}">${en(p.en)}</span> `)}</p></div>
  </div>`);
  return onSeen(node, () => node.querySelector('.paraplan').classList.add('play'));
}

/* ---------- 11. play / do / go oyunu ---------- */

function mountPdg(node) {
  const deck = shuffle(WORDS.filter((w) => w.verb && w.pic)).slice(0, 9);
  let i = 0;
  let score = 0;
  node.innerHTML = toHTML(html`<div class="vz pdg">
    <div class="vz-head"><span class="vz-badge">🎯 Hangi fiil?</span><span class="vz-sub">Spora bak, doğru sütuna dokun.</span><span class="pg-score">0 / ${deck.length}</span></div>
    <div class="pg-card"></div>
    <div class="pg-cols">
      ${[['play', '⚽', 'top ya da rakip var'], ['do', '🥋', 'dövüş, bireysel, topsuz'], ['go', '🏊', '-ing, bir yere gidilir']].map(([v, e, why]) => html`<button type="button" class="pg-col v-${v}" data-v="${v}"><span class="pg-h"><span class="pg-e">${e}</span><b>${v.toUpperCase()}</b></span><span class="pg-why">${why}</span><span class="pg-list"></span></button>`)}
    </div>
  </div>`);
  const card = node.querySelector('.pg-card');
  const scoreEl = node.querySelector('.pg-score');
  const show = () => {
    if (i >= deck.length) {
      card.innerHTML = toHTML(html`<div class="pg-done">🏆 <b>${score} / ${deck.length}</b> doğru!<button type="button" class="btn btn--small" data-again="1">Yeniden oyna</button></div>`);
      pop(card);
      return;
    }
    const w = deck[i];
    card.innerHTML = toHTML(html`<div class="pg-sport"><span class="pg-big">${w.pic}</span><b>${w.en}</b><span>${w.tr}</span></div>`);
    card.animate([{ transform: 'translateY(-16px) rotate(-4deg)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 420, easing: 'cubic-bezier(.34,1.56,.64,1)' });
  };
  const onClick = (e) => {
    if (e.target.closest('[data-again]')) {
      i = 0; score = 0; scoreEl.textContent = `0 / ${deck.length}`;
      node.querySelectorAll('.pg-list').forEach((l) => { l.innerHTML = ''; });
      shuffle(deck);
      show();
      return;
    }
    const col = e.target.closest('.pg-col');
    if (!col || i >= deck.length) return;
    const w = deck[i];
    if (col.dataset.v === w.verb) {
      score++;
      sfx.right();
      const target = node.querySelector(`.pg-col.v-${w.verb} .pg-list`);
      target.insertAdjacentHTML('beforeend', toHTML(html`<span class="pg-chip">${w.pic} ${w.en}</span>`));
      pop(target.lastElementChild);
      col.animate([{ transform: 'scale(1.04)' }, { transform: 'none' }], { duration: 300 });
    } else {
      sfx.wrong();
      col.classList.remove('shake');
      void col.offsetWidth;
      col.classList.add('shake');
      const target = node.querySelector(`.pg-col.v-${w.verb} .pg-list`);
      target.insertAdjacentHTML('beforeend', toHTML(html`<span class="pg-chip miss">${w.pic} ${w.en}</span>`));
    }
    scoreEl.textContent = `${score} / ${deck.length}`;
    i++;
    setTimeout(show, 260);
  };
  node.addEventListener('click', onClick);
  show();
  return () => node.removeEventListener('click', onClick);
}

/* ---------- 12. Günlük rutin makinesi ---------- */

const time12 = (t) => {
  const [h, m] = t.split(':').map(Number);
  const hh = h % 12 || 12;
  return `${hh}${m ? `.${String(m).padStart(2, '0')}` : ''} ${h < 12 ? 'am' : 'pm'}`;
};
function routineSentence(r, who, form) {
  const t = `at ${time12(r.time)}`;
  const mark = (full, base) => {
    // Takıyı vurgula: plays, goes, studies, has
    if (r.end === 'has') return full.replace(/^has/, '<mark>has</mark>');
    const v = full.split(' ')[0];
    const b = base.split(' ')[0];
    const stem = r.end === 'ies' ? b.slice(0, -1) : b;
    return full.replace(v, `${stem}<mark>${v.slice(stem.length)}</mark>`);
  };
  if (who === 'i') {
    if (form === '+') return `I ${r.i} ${t}.`;
    if (form === '-') return `I <mark>don't</mark> ${r.i} ${t}.`;
    return `<mark>Do</mark> you ${r.you} ${t}?`;
  }
  if (form === '+') return `She ${mark(r.he, r.heBase)} ${t}.`;
  if (form === '-') return `She <mark>doesn't</mark> ${r.heBase} ${t}.`;
  return `<mark>Does</mark> she ${r.heBase} ${t}?`;
}
function mountRoutine(node) {
  let who = 'she';
  let form = '+';
  node.innerHTML = toHTML(html`<div class="vz routine">
    <div class="vz-head"><span class="vz-badge">⏱️ Rutin Makinesi</span><span class="vz-sub">Özneyi ve cümle türünü değiştir, fiillere ne olduğunu izle.</span></div>
    <div class="rt-ctrl">
      <div class="rt-seg" data-g="who"><button type="button" class="st-o" data-v="i">🙋 I</button><button type="button" class="st-o on" data-v="she">👧 She</button></div>
      <div class="rt-seg" data-g="form"><button type="button" class="st-o on" data-v="+">✅ Olumlu</button><button type="button" class="st-o" data-v="-">❌ Olumsuz</button><button type="button" class="st-o" data-v="?">❓ Soru</button></div>
    </div>
    <div class="rt-line">${ROUTINE.map((r, i) => html`<div class="rt-item" style="--i:${i}"><span class="rt-time">${r.time}</span><span class="rt-dot"><span>${r.e}</span></span><span class="rt-s"></span></div>`)}</div>
    <div class="rt-note"></div>
  </div>`);
  const items = node.querySelectorAll('.rt-s');
  const note = node.querySelector('.rt-note');
  const draw = (animate) => {
    ROUTINE.forEach((r, i) => {
      items[i].innerHTML = routineSentence(r, who, form);
      if (animate) items[i].querySelectorAll('mark').forEach((m) => m.animate([{ transform: 'scale(1.6)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 460, delay: i * 50, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'backwards' }));
    });
    const notes = {
      'i+': 'I, you, we, they: fiil **yalın** kalır.',
      'she+': 'He, she, it: fiile **-s** gelir. -o, -ch, -sh, -x ile bitenlere **-es** (goes, watches), sessiz + y ile bitenlerde **-ies** (studies), have → **has**.',
      'i-': "Olumsuzda **don't** + yalın fiil.",
      'she-': "He, she, it olumsuzda **doesn't** gelir ve fiil **yalın** olur: doesn't play (doesn't plays değil!).",
      'i?': 'Soru **Do** ile başlar: Do you play...? Cevap: Yes, I do. / No, I don\'t.',
      'she?': 'He, she, it sorusu **Does** ile başlar ve fiil **yalın** olur: Does she play...? Cevap: Yes, she does. / No, she doesn\'t.',
    };
    note.innerHTML = notes[`${who}${form}`].replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
    if (animate) pop(note);
  };
  const onClick = (e) => {
    const b = e.target.closest('.rt-seg .st-o');
    if (!b) return;
    const g = b.parentElement.dataset.g;
    if (g === 'who') who = b.dataset.v; else form = b.dataset.v;
    b.parentElement.querySelectorAll('.st-o').forEach((x) => x.classList.toggle('on', x === b));
    sfx.pop();
    draw(true);
  };
  node.addEventListener('click', onClick);
  draw(false);
  return () => node.removeEventListener('click', onClick);
}

/* ---------- 13. Haftalık sıklık takvimi ---------- */

const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const SPREAD = { 7: [0, 1, 2, 3, 4, 5, 6], 6: [0, 1, 2, 3, 4, 5], 4: [0, 2, 4, 5], 3: [0, 2, 4], 2: [1, 4], 1: [5], 0: [] };
function mountWeek(node, b) {
  const rows = b.mode === 'times' ? WEEK_TIMES : WEEK;
  node.innerHTML = toHTML(html`<div class="vz week">
    <div class="vz-head"><span class="vz-badge">📅 Bir haftada kaç gün?</span><span class="vz-sub">Satıra dokun, örnek cümleyi dinle.</span></div>
    <div class="wk-head"><span></span>${DAYS.map((d) => html`<span>${d}</span>`)}<span></span></div>
    ${rows.map((r, i) => html`<button type="button" class="wk-row" data-i="${i}" style="--i:${i}"><b class="wk-w">${r.w}</b>${DAYS.map((d, k) => html`<span class="wk-c ${SPREAD[r.days].includes(k) ? 'y' : ''}" style="--k:${k}"><i>✅</i></span>`)}<span class="wk-p">${r.pct != null ? `%${r.pct}` : `${r.days}/7`}</span></button>`)}
    <div class="wk-out"></div>
  </div>`);
  const out = node.querySelector('.wk-out');
  const onClick = (e) => {
    const r = e.target.closest('.wk-row');
    if (!r) return;
    const d = rows[Number(r.dataset.i)];
    node.querySelectorAll('.wk-row').forEach((x) => x.classList.toggle('on', x === r));
    out.innerHTML = toHTML(line(d.en, d.tr));
    pop(out);
    say(lineId(d.en));
  };
  node.addEventListener('click', onClick);
  const stop = onSeen(node, () => node.querySelector('.week').classList.add('play'));
  return () => { node.removeEventListener('click', onClick); stop(); };
}

/* ---------- 14. Sıklık zarfının yeri ---------- */

function mountAdvPos(node) {
  let adv = 'always';
  node.innerHTML = toHTML(html`<div class="vz advpos">
    <div class="vz-head"><span class="vz-badge">🧲 Zarf nereye yapışır?</span><span class="vz-sub">Bir zarf seç, yerine düşüşünü izle.</span></div>
    <div class="ap-advs">${['always', 'usually', 'often', 'sometimes', 'never'].map((a) => html`<button type="button" class="st-o ${a === adv ? 'on' : ''}" data-a="${a}">${a}</button>`)}</div>
    <div class="ap-lane"><span class="ap-cap">Asıl fiilden <b>ÖNCE</b></span><div class="ap-tiles"><span class="ap-t s">I</span><span class="ap-t slot"><span class="ap-adv"></span></span><span class="ap-t v">play</span><span class="ap-t">tennis</span><span class="ap-t">on Sundays.</span></div></div>
    <div class="ap-lane"><span class="ap-cap">am / is / are'dan <b>SONRA</b></span><div class="ap-tiles"><span class="ap-t s">She</span><span class="ap-t be">is</span><span class="ap-t slot"><span class="ap-adv"></span></span><span class="ap-t">happy.</span></div></div>
  </div>`);
  const drop = () => {
    node.querySelectorAll('.ap-adv').forEach((a, i) => {
      a.textContent = adv;
      a.animate([{ transform: 'translateY(-46px) rotate(-8deg)', opacity: 0 }, { transform: 'translateY(4px)', opacity: 1, offset: 0.7 }, { transform: 'none', opacity: 1 }], { duration: 620, delay: i * 180, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
    });
  };
  const onClick = (e) => {
    const b = e.target.closest('[data-a]');
    if (!b) return;
    adv = b.dataset.a;
    node.querySelectorAll('[data-a]').forEach((x) => x.classList.toggle('on', x === b));
    sfx.whoosh();
    drop();
  };
  node.addEventListener('click', onClick);
  node.querySelectorAll('.ap-adv').forEach((a) => { a.textContent = adv; });
  const stop = onSeen(node, drop);
  return () => { node.removeEventListener('click', onClick); stop(); };
}

/* ---------- 15. Sevgi ölçeği ---------- */

function mountLove(node) {
  let lv = 0;
  let sp = 0;
  node.innerHTML = toHTML(html`<div class="vz love">
    <div class="vz-head"><span class="vz-badge">❤️ Ne kadar seviyorsun?</span><span class="vz-sub">Bir yüz ve bir spor seç.</span></div>
    <div class="lv-scale">${LOVE.map((l, i) => html`<button type="button" class="lv-f ${i === lv ? 'on' : ''}" data-l="${i}" style="--c:${l.c}"><span class="lv-e">${l.e}</span><b>${l.w}</b><small>${l.tr}</small></button>`)}</div>
    <div class="lv-bar" aria-hidden="true"></div>
    <div class="lv-sports">${LOVE_SPORTS.map((s, i) => html`<button type="button" class="st-o ${i === sp ? 'on' : ''}" data-s="${i}">${s.e} ${s.ing}</button>`)}</div>
    <div class="lv-out"></div>
    <div class="vz-sub center">Bu fiillerden sonra gelen fiil <b>-ing</b> alır!</div>
  </div>`);
  const out = node.querySelector('.lv-out');
  const draw = (animate) => {
    const l = LOVE[lv];
    const s = LOVE_SPORTS[sp];
    const ing = s.ing.replace(/(\w+ing)/, '<mark>$1</mark>');
    out.innerHTML = `<span class="lv-big">${l.e}</span><span class="lv-s">I <b style="color:${l.c}">${l.w}</b> ${ing}.</span>`;
    if (animate) pop(out);
  };
  const onClick = (e) => {
    const f = e.target.closest('[data-l]');
    const s = e.target.closest('[data-s]');
    if (f) { lv = Number(f.dataset.l); node.querySelectorAll('[data-l]').forEach((x) => x.classList.toggle('on', x === f)); }
    else if (s) { sp = Number(s.dataset.s); node.querySelectorAll('[data-s]').forEach((x) => x.classList.toggle('on', x === s)); }
    else return;
    sfx.pop();
    draw(true);
  };
  node.addEventListener('click', onClick);
  draw(false);
  return () => node.removeEventListener('click', onClick);
}

/* ---------- 16. Spor yerleri ---------- */

function mountPlaces(node) {
  node.innerHTML = toHTML(html`<div class="vz places">
    <div class="vz-head"><span class="vz-badge">🏟️ Nerede, neyle?</span><span class="vz-sub">Karta dokun, cümleyi gör ve dinle.</span></div>
    <div class="pl-grid">${PLACES.map((p, i) => html`<button type="button" class="pl-card" style="--i:${i}" data-i="${i}">
      <span class="pl-e">${p.e}</span><b class="pl-sport">${p.sport}</b>
      <span class="pl-place">📍 ${p.place}</span>
      <span class="pl-kit">${p.kit.map(([e, w]) => html`<span>${e} ${w}</span>`)}</span>
      <span class="pl-s">${p.en}</span>
    </button>`)}</div>
  </div>`);
  const onClick = (e) => {
    const c = e.target.closest('.pl-card');
    if (!c) return;
    const open = !c.classList.contains('open');
    c.classList.toggle('open', open);
    sfx.soft();
    if (open) say(lineId(PLACES[Number(c.dataset.i)].en));
  };
  node.addEventListener('click', onClick);
  return () => node.removeEventListener('click', onClick);
}

/* ---------- 17. win mi beat mi ---------- */

function mountWinBeat(node) {
  let i = 0;
  let right = 0;
  node.innerHTML = toHTML(html`<div class="vz winbeat">
    <div class="wb-cols">
      <div class="wb-col win"><span class="wb-e">🏆</span><b>WIN</b><span>a match · a game · a race · a cup · a medal</span><small>Kazanılan şey</small></div>
      <div class="wb-vs">VS</div>
      <div class="wb-col beat"><span class="wb-e">🥊</span><b>BEAT</b><span>a team · a player · your friend</span><small>Yenilen rakip</small></div>
    </div>
    <div class="wb-game"></div>
  </div>`);
  const game = node.querySelector('.wb-game');
  const show = () => {
    if (i >= WINBEAT.length) {
      game.innerHTML = toHTML(html`<div class="wb-done">${right === WINBEAT.length ? '🏆' : '💪'} ${right} / ${WINBEAT.length} doğru! <button type="button" class="btn btn--small" data-again="1">Tekrar</button></div>`);
      return;
    }
    const q = WINBEAT[i];
    game.innerHTML = toHTML(html`<div class="wb-q"><span class="wb-n">${i + 1} / ${WINBEAT.length}</span><b>${q.gap.replace('___', '____')}</b></div><div class="wb-opts">${shuffle([q.a, q.other]).map((o) => html`<button type="button" class="btn btn--small" data-o="${o}">${o}</button>`)}</div>`);
  };
  const onClick = (e) => {
    if (e.target.closest('[data-again]')) { i = 0; right = 0; show(); return; }
    const b = e.target.closest('[data-o]');
    if (!b) return;
    const q = WINBEAT[i];
    const ok = b.dataset.o === q.a;
    if (ok) right++;
    (ok ? sfx.right : sfx.wrong)();
    game.innerHTML = toHTML(html`<div class="wb-res ${ok ? 'ok' : 'no'}">${ok ? '✅ Doğru!' : '❌ Olmadı.'} ${raw(q.why.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'))}</div>${line(q.en)}<button type="button" class="btn btn--small" data-next="1">Sıradaki</button>`);
    pop(game);
    say(lineId(q.en));
  };
  const onNext = (e) => { if (e.target.closest('[data-next]')) { i++; show(); } };
  node.addEventListener('click', onClick);
  node.addEventListener('click', onNext);
  show();
  return () => { node.removeEventListener('click', onClick); node.removeEventListener('click', onNext); };
}

const MOUNT = { studio: mountStudio, anatomy: mountAnatomy, moods: mountMoods, degree: mountDegree, quad: mountQuad, family: mountFamily, lineup: mountLineup, complab: mountCompLab, morph: mountMorph, paraplan: mountParaPlan, pdg: mountPdg, routine: mountRoutine, week: mountWeek, advpos: mountAdvPos, love: mountLove, places: mountPlaces, winbeat: mountWinBeat };

export function mountViz(node, b) {
  const fn = MOUNT[b.kind];
  if (!fn) return () => {};
  try {
    return fn(node, b) || (() => {});
  } catch (err) {
    console.error(err);
    node.remove();
    return () => {};
  }
}

