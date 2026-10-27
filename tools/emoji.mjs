// Sitede geçen emojileri bulur, eksik olanların üç boyutlu Fluent Emoji çizimini indirir
// (Microsoft Fluent Emoji, MIT lisanslı; @lobehub/fluent-emoji-3d@1.1.0 paketinden) ve js/data/emoji.js dizinini yazar.
// Kullanım: node tools/emoji.mjs

import { readdirSync, readFileSync, statSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const OUT = join(ROOT, 'img', 'e');
const PKG = '@lobehub/fluent-emoji-3d@1.1.0';
mkdirSync(OUT, { recursive: true });

const files = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(js|html)$/.test(f) && !p.endsWith('data/emoji.js')) files.push(p);
  }
})(join(ROOT, 'js'));
files.push(join(ROOT, 'index.html'));

const found = new Set();
for (const f of files) for (const m of readFileSync(f, 'utf8').matchAll(/\p{RGI_Emoji}/gv)) found.add(m[0]);

const hex = (e, keepFe) => [...e].map((c) => c.codePointAt(0)).filter((c) => keepFe || c !== 0xfe0f).map((c) => c.toString(16).padStart(4, '0'));
const key = (e) => hex(e, false).join('-');

const list = await (await fetch(`https://data.jsdelivr.com/v1/packages/npm/${PKG}?structure=flat`)).json();
const names = new Set(list.files.map((f) => f.name).filter((n) => n.endsWith('.webp')).map((n) => n.slice('/assets/'.length, -5)));

const missing = [];
for (const e of found) {
  const dest = join(OUT, `${key(e)}.webp`);
  if (existsSync(dest)) continue;
  const p = hex(e, false);
  const cands = [hex(e, true).join('-'), p.join('-'), [p[0], 'fe0f', ...p.slice(1)].join('-')];
  const name = cands.find((c) => names.has(c));
  if (!name) { missing.push(e); continue; }
  const res = await fetch(`https://cdn.jsdelivr.net/npm/${PKG}/assets/${name}.webp`);
  writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

const have = readdirSync(OUT).filter((f) => f.endsWith('.webp')).map((f) => f.slice(0, -5)).sort();
writeFileSync(join(ROOT, 'js', 'data', 'emoji.js'), `// Üç boyutlu Fluent Emoji çizimleri (Microsoft, MIT): img/e/<kod>.webp. node tools/emoji.mjs ile güncellenir.\nexport const EMO = new Set(${JSON.stringify(have)});\n`);
console.log(`emoji: ${found.size} kullanılıyor, ${have.length} çizim hazır${missing.length ? `, bulunamayan: ${missing.join(' ')}` : ''}`);
