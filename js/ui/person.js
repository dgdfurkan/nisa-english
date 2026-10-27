// Özelliklerden çizilen kişi: boy, yapı, saç (uzunluk, şekil, renk), gözlük, sakal, çil...
// Ünite 1'de tarif sorularında ve kelime kartlarında kullanılır.

const INK = '#22264b';
const HAIR = { black: '#2c2633', brown: '#7a4a26', blonde: '#f3c65a', red: '#d4572b', grey: '#c3c3cc' };
const SKIN = ['#f7d6b8', '#eec19b', '#d9a47d', '#b98057'];
const EYE = { blue: '#5aa5e8', green: '#4caf6e', brown: '#8a5a2b', grey: '#9aa3b5' };
const SHIRT = { girl: '#ff8fb1', boy: '#5aa5e8', woman: '#9d86d6', man: '#3f9a85', grandma: '#e8b923', grandpa: '#9b836c' };
const HEIGHT = { tall: 1, mid: 0.89, short: 0.76 };
const WIDTH = { slim: 27, mid: 34, plump: 46, strong: 44 };

const KIND_DEFAULTS = {
  girl: { hairLen: 'long', hairType: 'straight', hairColor: 'brown', h: 'mid', build: 'mid' },
  boy: { hairLen: 'short', hairType: 'straight', hairColor: 'brown', h: 'mid', build: 'mid' },
  woman: { hairLen: 'long', hairType: 'straight', hairColor: 'black', h: 'mid', build: 'mid' },
  man: { hairLen: 'short', hairType: 'straight', hairColor: 'black', h: 'mid', build: 'mid' },
  grandma: { hairLen: 'bun', hairType: 'straight', hairColor: 'grey', h: 'mid', build: 'mid' },
  grandpa: { hairLen: 'short', hairType: 'straight', hairColor: 'grey', h: 'mid', build: 'mid' },
};

export const isMale = (kind) => kind === 'boy' || kind === 'man' || kind === 'grandpa';
export const isOld = (kind) => kind === 'grandma' || kind === 'grandpa';

export function fill(p) {
  const kind = p.kind || 'girl';
  const base = KIND_DEFAULTS[kind];
  const out = { ...base, ...p, kind };
  if (out.hairLen === 'bun' && kind !== 'grandma') out.hairLen = 'short';
  if (isOld(kind) && !p.hairColor) out.hairColor = 'grey';
  return out;
}

function skinOf(p) {
  if (typeof p.skin === 'number') return SKIN[p.skin % SKIN.length];
  const s = `${p.kind}${p.hairColor}${p.hairLen}${p.h}`;
  let h = 0;
  for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return SKIN[p.hairColor === 'red' || p.hairColor === 'blonde' ? h % 2 : h % SKIN.length];
}

const st = (w = 2) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

function curlRow(points, r, color) {
  return points.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" ${st(1.8)}/>`).join('');
}

function hairBack(p, c) {
  const { hairLen, hairType, ponytail } = p;
  let out = '';
  if (ponytail) {
    out += `<path d="M66 44 C 84 44, 92 62, 86 84 C 84 96, 78 104, 74 110 C 76 96, 78 80, 70 62 Z" fill="${c}" ${st()}/>`;
    return out;
  }
  if (p.braids) return '';
  if (hairLen === 'long' || hairLen === 'shoulder') {
    const bottom = hairLen === 'long' ? 124 : 96;
    if (hairType === 'curly') {
      const pts = [];
      for (let y = 50; y <= bottom - 6; y += 11) pts.push([24 - (y % 2 ? 2 : 0), y], [76 + (y % 2 ? 2 : 0), y]);
      pts.push([30, bottom - 2], [70, bottom - 2]);
      return curlRow(pts, 9.5, c);
    }
    if (hairType === 'wavy') {
      return `<path d="M25 52 C 17 66, 27 76, 20 90 C 15 102, 26 ${bottom - 8}, 22 ${bottom} L 78 ${bottom} C 74 ${bottom - 8}, 85 102, 80 90 C 73 76, 83 66, 75 52 Z" fill="${c}" ${st()}/>`;
    }
    return `<path d="M24 54 L 22 ${bottom - 4} Q 22 ${bottom} 27 ${bottom} L 73 ${bottom} Q 78 ${bottom} 78 ${bottom - 4} L 76 54 Z" fill="${c}" ${st()}/>`;
  }
  return out;
}

function hairFront(p, c) {
  const { hairLen, hairType } = p;
  if (hairLen === 'bald') {
    return `<path d="M38 44 q8 -5 16 -3" stroke="#fff" stroke-width="2.4" stroke-linecap="round" fill="none" opacity=".7"/>`;
  }
  let out = '';
  if (hairLen === 'bun') {
    out += `<circle cx="50" cy="35" r="9" fill="${c}" ${st()}/>`;
  }
  if (hairType === 'curly' && !p.fringe && !p.ponytail && !p.braids) {
    const pts = [];
    for (let i = 0; i <= 8; i++) {
      const a = Math.PI * (1.08 + (i / 8) * 0.84);
      pts.push([50 + Math.cos(a) * 23, 60 + Math.sin(a) * 22]);
    }
    out += curlRow(pts.map(([x, y]) => [Math.round(x * 10) / 10, Math.round(y * 10) / 10]), 8, c);
    if (hairLen !== 'short') out += curlRow([[26, 62], [74, 62], [25, 72], [75, 72]], 7.5, c);
    return out;
  }
  if (p.fringe) {
    out += `<path d="M25 62 C 22 32, 78 32, 75 62 L 74 56 L 26 56 Z" fill="${c}" ${st()}/>`;
  } else if (hairType === 'wavy') {
    out += `<path d="M25 64 C 21 32, 79 32, 75 64 C 73 56, 70 50, 64 49 C 60 53, 55 51, 52 47 C 48 52, 42 53, 38 49 C 32 51, 28 56, 25 64 Z" fill="${c}" ${st()}/>`;
  } else {
    out += `<path d="M25 64 C 22 32, 78 32, 75 64 C 73 55, 68 49, 61 47 C 53 51, 42 51, 36 47 C 30 51, 27 56, 25 64 Z" fill="${c}" ${st()}/>`;
  }
  if ((hairLen === 'long' || hairLen === 'shoulder') && !p.ponytail && !p.braids) {
    const end = hairLen === 'long' ? 92 : 84;
    out += `<path d="M25 56 L 24 ${end} L 30 ${end - 4} L 30 58 Z" fill="${c}" ${st()}/><path d="M75 56 L 76 ${end} L 70 ${end - 4} L 70 58 Z" fill="${c}" ${st()}/>`;
  }
  if (p.ponytail) out += `<rect x="66" y="45" width="6" height="7" rx="2" fill="#ff5e8a" ${st(1.5)} transform="rotate(30 69 48)"/>`;
  if (p.braids) {
    for (const x of [27, 73]) {
      for (let y = 74; y <= 116; y += 9) out += `<ellipse cx="${x}" cy="${y}" rx="5.5" ry="5.2" fill="${c}" ${st(1.6)}/>`;
      out += `<rect x="${x - 3.5}" y="121" width="7" height="4" rx="1.5" fill="#ff5e8a" ${st(1.4)}/>`;
    }
  }
  return out;
}

function face(p) {
  let out = '';
  const old = isOld(p.kind);
  // gözler (renkli göz ve yüz ifadesi isteğe bağlı)
  const mood = p.mood || '';
  if (mood === 'sleepy') {
    out += `<path d="M37.5 63.5 q3.5 2.4 7 0 M55.5 63.5 q3.5 2.4 7 0" fill="none" ${st(1.8)}/>`;
  } else if (mood === 'big') {
    out += `<path d="M37.5 64 q3.5 -4 7 0 M55.5 64 q3.5 -4 7 0" fill="none" ${st(2)}/>`;
  } else if (EYE[p.eyes]) {
    out += `<circle cx="41" cy="63" r="3.4" fill="${EYE[p.eyes]}" ${st(1.2)}/><circle cx="59" cy="63" r="3.4" fill="${EYE[p.eyes]}" ${st(1.2)}/>`;
    out += `<circle cx="41" cy="63" r="1.5" fill="${INK}"/><circle cx="59" cy="63" r="1.5" fill="${INK}"/><circle cx="42.1" cy="61.9" r=".9" fill="#fff"/><circle cx="60.1" cy="61.9" r=".9" fill="#fff"/>`;
  } else {
    const dy = mood === 'shy' ? 1.6 : 0;
    out += `<circle cx="41" cy="${63 + dy}" r="2.7" fill="${INK}"/><circle cx="59" cy="${63 + dy}" r="2.7" fill="${INK}"/>`;
    out += `<circle cx="42" cy="${62 + dy}" r=".9" fill="#fff"/><circle cx="60" cy="${62 + dy}" r=".9" fill="#fff"/>`;
  }
  if (mood === 'angry') out += `<path d="M36 56.5 l8 3 M64 56.5 l-8 3" ${st(2)} fill="none"/>`;
  if (mood === 'sad') out += `<path d="M36 59 l7 -2.5 M64 59 l-7 -2.5" ${st(1.8)} fill="none"/>`;
  // burun
  out += `<path d="M50 66 q 2.4 3.4 -.6 4.6" fill="none" ${st(1.6)}/>`;
  // yanaklar (utangaçken kızarır)
  const blush = mood === 'shy' ? '.9' : '.45';
  out += `<ellipse cx="34" cy="71" rx="4.2" ry="2.4" fill="#ff8fa3" opacity="${blush}"/><ellipse cx="66" cy="71" rx="4.2" ry="2.4" fill="#ff8fa3" opacity="${blush}"/>`;
  if (p.freckles) {
    out += [[34, 68], [37, 70], [33, 72], [63, 68], [66, 70], [67, 72], [36, 66.5], [64, 66.5]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".95" fill="#a0522d"/>`).join('');
  }
  if (old || p.wrinkles) {
    out += `<path d="M32 60 l-3 -1.5 M32 64 l-3 1.5 M68 60 l3 -1.5 M68 64 l3 1.5" ${st(1.3)} fill="none"/>`;
    out += `<path d="M44 78.5 q 6 2 12 0" ${st(1.1)} fill="none" opacity=".6"/>`;
  }
  // ağız
  if (p.braces) {
    out += `<path d="M43 73.5 q 7 7.5 14 0 z" fill="#fff" ${st(1.8)}/><path d="M44.5 75 h11" stroke="#8b95a8" stroke-width="1.6"/><path d="M47 74.3v2M50 74.3v2.6M53 74.3v2" stroke="#8b95a8" stroke-width="1.2"/>`;
  } else if (mood === 'big') {
    out += `<path d="M43 73 q 7 9 14 0 z" fill="#fff" ${st(1.8)}/><path d="M46 76.5 q 4 2.6 8 0" fill="#ff8fa3"/>`;
  } else if (mood === 'angry' || mood === 'sad') {
    out += `<path d="M45 77 q 5 -4 10 0" fill="none" ${st(2)}/>`;
  } else if (mood === 'wow') {
    out += `<ellipse cx="50" cy="75.5" rx="2.6" ry="3.2" fill="${INK}"/>`;
  } else if (mood === 'shy') {
    out += `<path d="M47 75 q 3 2 6 0" fill="none" ${st(1.8)}/>`;
  } else if (mood === 'sleepy') {
    out += `<ellipse cx="50" cy="75.5" rx="2" ry="1.6" fill="none" ${st(1.6)}/>`;
  } else {
    out += `<path d="M44.5 74 q 5.5 5 11 0" fill="none" ${st(2)}/>`;
  }
  if (p.dimples) out += `<path d="M41.5 75.5 q -1.5 1.5 0 3 M58.5 75.5 q 1.5 1.5 0 3" fill="none" ${st(1.4)}/>`;
  if (p.mole) out += `<circle cx="61" cy="73" r="1.4" fill="#5a3a22"/>`;
  return out;
}

function facialHair(p, c) {
  let out = '';
  if (p.beard) {
    out += `<path d="M26.5 64 C 27 90, 40 99, 50 99 C 60 99, 73 90, 73.5 64 C 70 76, 62 82.5, 50 82.5 C 38 82.5, 30 76, 26.5 64 Z" fill="${c}" ${st()}/>`;
  }
  if (p.moustache || p.beard) {
    out += `<path d="M41.5 72.6 C 44.5 69.2, 48.6 70, 50 72 C 51.4 70, 55.5 69.2, 58.5 72.6 C 55.6 75.2, 51.6 74.6, 50 73.4 C 48.4 74.6, 44.4 75.2, 41.5 72.6 Z" fill="${c}" ${st(1.6)}/>`;
  }
  return out;
}

function extras(p) {
  let out = '';
  if (p.glasses) {
    out += `<g fill="#fff" fill-opacity=".28" ${st(2)}><circle cx="41" cy="63" r="7.2"/><circle cx="59" cy="63" r="7.2"/></g><path d="M48.2 62.6 q1.8 -1.6 3.6 0 M33.8 62 L 26 60 M66.2 62 L 74 60" fill="none" ${st(2)}/>`;
  }
  if (p.scar) out += `<path d="M38 41 l3.2 4.2 -3 1 3.6 4.6" fill="none" stroke="#c0392b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  if (p.earrings) out += `<circle cx="25.5" cy="73" r="2.6" fill="#f3c65a" ${st(1.4)}/><circle cx="74.5" cy="73" r="2.6" fill="#f3c65a" ${st(1.4)}/>`;
  return out;
}

function body(p, skin) {
  const w = WIDTH[p.build] || WIDTH.mid;
  const x0 = 50 - w / 2;
  const x1 = 50 + w / 2;
  const shirt = SHIRT[p.kind] || '#5aa5e8';
  const skirt = !isMale(p.kind);
  let out = '';
  // bacaklar ve ayakkabılar
  const legC = skirt ? skin : '#3a4170';
  const legW = p.build === 'plump' ? 11 : 9;
  out += `<rect x="${50 - 3 - legW}" y="146" width="${legW}" height="48" rx="4" fill="${legC}" ${st()}/>`;
  out += `<rect x="53" y="146" width="${legW}" height="48" rx="4" fill="${legC}" ${st()}/>`;
  out += `<ellipse cx="${50 - 3 - legW / 2}" cy="195.5" rx="7.5" ry="3.6" fill="${INK}"/><ellipse cx="${53 + legW / 2}" cy="195.5" rx="7.5" ry="3.6" fill="${INK}"/>`;
  // kollar
  const armL = `<rect x="${x0 - 8.5}" y="99" width="8.5" height="46" rx="4.2" fill="${shirt}" ${st()} transform="rotate(7 ${x0 - 4} 101)"/>`;
  const armR = `<rect x="${x1}" y="99" width="8.5" height="46" rx="4.2" fill="${shirt}" ${st()} transform="rotate(-7 ${x1 + 4} 101)"/>`;
  const handL = `<circle cx="${x0 - 1.5}" cy="146" r="4.6" fill="${skin}" ${st(1.8)}/>`;
  const handR = `<circle cx="${x1 + 1.5}" cy="146" r="4.6" fill="${skin}" ${st(1.8)}/>`;
  out += armL + armR + handL + handR;
  // gövde
  let torso;
  if (p.build === 'plump') {
    torso = `<path d="M${x0 + 4} 98 Q 50 92 ${x1 - 4} 98 Q ${x1 + 6} 124 ${x1 - 2} 150 L ${x0 + 2} 150 Q ${x0 - 6} 124 ${x0 + 4} 98 Z" fill="${shirt}" ${st()}/>`;
  } else if (p.build === 'strong') {
    torso = `<path d="M${x0} 98 Q 50 93 ${x1} 98 L ${x1 - 6} 150 L ${x0 + 6} 150 Z" fill="${shirt}" ${st()}/>`;
  } else {
    torso = `<rect x="${x0}" y="96" width="${w}" height="54" rx="9" fill="${shirt}" ${st()}/>`;
  }
  out += torso;
  if (skirt) {
    out += `<path d="M${x0 - 1} 128 L ${x1 + 1} 128 L ${x1 + 8} 156 Q 50 160 ${x0 - 8} 156 Z" fill="${p.kind === 'grandma' ? '#7d6a9e' : '#6b52b8'}" ${st()}/>`;
  } else {
    out += `<path d="M${x0 + 2} 140 h${w - 4}" stroke="${INK}" stroke-width="1.6" opacity=".35"/>`;
  }
  // boyun
  out += `<rect x="45" y="82" width="10" height="16" rx="3" fill="${skin}" ${st(1.8)}/>`;
  return out;
}

// Tek bir kişinin svg içeriği (0..100 x 0..200 kutusunda)
export function personG(raw) {
  const p = fill(raw);
  const skin = skinOf(p);
  const c = HAIR[p.hairColor] || HAIR.brown;
  // Boy: short / mid / tall ya da doğrudan oran (0.8 gibi)
  const s = typeof p.h === 'number' ? p.h : HEIGHT[p.h] || HEIGHT.mid;
  const ears = `<circle cx="25.5" cy="65" r="4.6" fill="${skin}" ${st(1.8)}/><circle cx="74.5" cy="65" r="4.6" fill="${skin}" ${st(1.8)}/>`;
  const inner = [
    hairBack(p, c),
    body(p, skin),
    ears,
    `<circle cx="50" cy="62" r="24" fill="${skin}" ${st()}/>`,
    face(p),
    facialHair(p, c),
    hairFront(p, c),
    extras(p),
  ].join('');
  return `<g transform="translate(50 199) scale(${s}) translate(-50 -199)">${inner}</g>`;
}

export function personSVG(p, { cls = '', label = '' } = {}) {
  return `<svg class="person ${cls}" viewBox="0 0 100 200" role="img" aria-label="${label}"><ellipse cx="50" cy="197" rx="30" ry="3.5" fill="${INK}" opacity=".08"/>${personG(p)}</svg>`;
}

// Birden fazla kişi aynı zeminde: boy farkları birbirine göre görünür
export function peopleSVG(list, { cls = '' } = {}) {
  const w = list.length * 100;
  const g = list.map((p, i) => `<g transform="translate(${i * 100} 0)"><ellipse cx="50" cy="197" rx="30" ry="3.5" fill="${INK}" opacity=".08"/>${personG(p)}</g>`).join('');
  return `<svg class="people-row ${cls}" viewBox="0 0 ${w} 200" role="img">${g}</svg>`;
}

/* ---------- Tarif üretimi ---------- */

const HAIR_WORD = { black: 'black', brown: 'brown', blonde: 'blonde', red: 'red', grey: 'grey' };
const LEN_WORD = { long: 'long', shoulder: 'shoulder-length', short: 'short' };

export function hairPhrase(p) {
  const q = fill(p);
  if (q.hairLen === 'bald') return null;
  if (q.hairLen === 'bun') return `${HAIR_WORD[q.hairColor]} hair`;
  const parts = [LEN_WORD[q.hairLen], q.hairType, HAIR_WORD[q.hairColor]].filter(Boolean);
  return `${parts.join(' ')} hair`;
}

export function pronoun(p) {
  return isMale(fill(p).kind) ? 'He' : 'She';
}

// Görünüşü İngilizce cümlelerle anlatır; features: hangi özelliklerin söyleneceği
export function describe(p, features = ['hair', 'glasses', 'beard', 'freckles']) {
  const q = fill(p);
  const he = pronoun(q);
  const out = [];
  if (features.includes('height') && q.h !== 'mid') out.push(`${he} is ${q.h}.`);
  if (features.includes('hair')) {
    if (q.hairLen === 'bald') out.push(`${he} is bald.`);
    else out.push(`${he} has got ${hairPhrase(q)}.`);
  }
  if (features.includes('ponytail') && q.ponytail) out.push(`${he} has got a ponytail.`);
  if (features.includes('glasses')) out.push(q.glasses ? `${he} wears glasses.` : `${he} doesn't wear glasses.`);
  if (features.includes('beard') && isMale(q.kind)) out.push(q.beard ? `${he} has got a beard.` : `${he} hasn't got a beard.`);
  if (features.includes('freckles') && q.freckles) out.push(`${he} has got freckles.`);
  return out.join(' ');
}
