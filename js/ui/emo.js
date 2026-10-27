// Emojiler her cihazda aynı görünsün diye üç boyutlu Fluent Emoji çizimleriyle değiştirilir.
// Sayfaya eklenen her metin izlenir; çizimi olmayan emoji olduğu gibi kalır, çizim yüklenemezse emojiye döner.

import { EMO } from '../data/emoji.js';

// Eski tarayıcılarda "v" bayrağı yoksa genişletilmiş resimli karakter deseniyle yetinilir
let EMOJI_RE;
try {
  EMOJI_RE = new RegExp('\\p{RGI_Emoji}', 'gv');
} catch {
  EMOJI_RE = /(?:\p{Extended_Pictographic}|[0-9#*]️?⃣)(?:️|‍\p{Extended_Pictographic}️?|[\u{1F3FB}-\u{1F3FF}])*/gu;
}

const BASE = new URL('../../img/e/', import.meta.url).href;
const keyOf = (e) => [...e].map((c) => c.codePointAt(0)).filter((c) => c !== 0xfe0f).map((c) => c.toString(16).padStart(4, '0')).join('-');

export function emoSrc(e) {
  const k = keyOf(e);
  return EMO.has(k) ? `${BASE}${k}.webp` : null;
}

// Şablonlarda doğrudan kullanmak için <img> metni
export function emoImg(e, cls = '') {
  const src = emoSrc(e);
  return src ? `<img class="emo ${cls}" src="${src}" alt="${e}" draggable="false" decoding="async">` : `<span class="${cls}">${e}</span>`;
}

const SKIP = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'OPTION', 'TITLE', 'NOSCRIPT', 'text', 'tspan']);

function replaceText(node) {
  const text = node.nodeValue;
  EMOJI_RE.lastIndex = 0;
  if (!text || !EMOJI_RE.test(text)) return;
  const parent = node.parentNode;
  if (!parent || SKIP.has(parent.nodeName) || (parent.closest && parent.closest('.no-emo, [contenteditable], svg'))) return;
  EMOJI_RE.lastIndex = 0;
  const frag = document.createDocumentFragment();
  let last = 0;
  let changed = false;
  for (const m of text.matchAll(EMOJI_RE)) {
    const src = emoSrc(m[0]);
    if (!src) continue;
    if (m.index > last) frag.append(text.slice(last, m.index));
    const img = document.createElement('img');
    img.className = 'emo';
    img.src = src;
    img.alt = m[0];
    img.draggable = false;
    img.decoding = 'async';
    frag.append(img);
    last = m.index + m[0].length;
    changed = true;
  }
  if (!changed) return;
  if (last < text.length) frag.append(text.slice(last));
  parent.replaceChild(frag, node);
}

export function emojify(root) {
  if (!root) return;
  if (root.nodeType === 3) {
    replaceText(root);
    return;
  }
  if (root.nodeType !== 1 && root.nodeType !== 11) return;
  if (root.nodeType === 1 && SKIP.has(root.nodeName)) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(replaceText);
}

// Sayfadaki bütün değişiklikleri izler; değişiklik boyanmadan önce işlenir, yerli emoji bir an bile görünmez
export function watchEmoji(root = document.body) {
  emojify(root);
  const mo = new MutationObserver((list) => {
    for (const m of list) {
      if (m.type === 'characterData') replaceText(m.target);
      else m.addedNodes.forEach((n) => { if (!(n.nodeType === 1 && n.classList && n.classList.contains('emo'))) emojify(n); });
    }
  });
  mo.observe(root, { childList: true, subtree: true, characterData: true });
  // Çizim yüklenemezse emojinin kendisi görünür
  document.addEventListener('error', (e) => {
    const t = e.target;
    if (t && t.tagName === 'IMG' && t.classList.contains('emo')) t.replaceWith(document.createTextNode(t.alt));
  }, true);
  return mo;
}
