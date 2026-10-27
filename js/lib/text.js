// Yazı yardımcıları: aramaya uygun sadeleştirme, satır içi biçim, Türkçe ekler, yazım hatası toleransı

import { esc } from './dom.js';

// Türkçe ve İngilizce harfleri aynı tabana indirir: "Şık İnce" → "sik ince"
export function fold(s) {
  return String(s || '')
    .replace(/İ/g, 'i')
    .replace(/I/g, 'ı')
    .toLocaleLowerCase('tr')
    .replace(/ı/g, 'i')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’`´]/g, "'")
    .replace(/[^a-z0-9' ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Satır içi biçim: **kalın**, ==vurgu==, *İngilizce* (dokunulabilir)
export function inline(text) {
  let s = esc(text);
  s = s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  s = s.replace(/==(.+?)==/g, '<mark class="hl">$1</mark>');
  s = s.replace(/\*(.+?)\*/g, (m, inner) => {
    // Uzun İngilizce cümleler kelime kelime dokunulabilir olur
    if (inner.split(/\s+/).length > 3) return `<i class="ens">${tappable(unesc(inner))}</i>`;
    return `<i class="en" data-look="${inner}">${inner}</i>`;
  });
  return s;
}

const UNESC = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" };
const unesc = (s) => s.replace(/&(amp|lt|gt|quot|#39);/g, (m) => UNESC[m]);

// Basit markdown (Gemini cevapları için): kaçış sonrası kalın, italik, liste, satır sonu
export function miniMarkdown(text) {
  const lines = esc(String(text || '').trim()).split(/\n/);
  const out = [];
  let list = null;
  for (const raw of lines) {
    const line = raw.trimEnd();
    const m = line.match(/^\s*(?:[-*•]|\d+[.)])\s+(.*)$/);
    if (m) {
      if (!list) {
        list = [];
        out.push(list);
      }
      list.push(m[1]);
      continue;
    }
    list = null;
    out.push(line);
  }
  const fmt = (s) => s
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/(^|[^*])\*([^*\n]+?)\*/g, '$1<i>$2</i>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^#{1,4}\s*(.+)$/, '<b>$1</b>');
  return out
    .map((x) => (Array.isArray(x) ? `<ul>${x.map((i) => `<li>${fmt(i)}</li>`).join('')}</ul>` : x ? `<p>${fmt(x)}</p>` : ''))
    .join('');
}

// Türkçe ilgi eki: Nisa → Nisa'nın, Elif → Elif'in, Su → Su'nun
export function genitive(name) {
  const n = String(name).trim();
  const lower = n.toLocaleLowerCase('tr');
  const vowels = lower.match(/[aeıioöuü]/g);
  const last = vowels ? vowels[vowels.length - 1] : 'e';
  const v = { a: 'ı', ı: 'ı', e: 'i', i: 'i', o: 'u', u: 'u', ö: 'ü', ü: 'ü' }[last];
  const endsVowel = /[aeıioöuü]$/.test(lower);
  return `${n}'${endsVowel ? 'n' : ''}${v}n`;
}

// Öğrenciye her yerde tam adıyla seslenilir (Saadet Nisa)
export const displayName = (name) => String(name).replace(/\s+/g, ' ').trim();

// İki kelime arasındaki düzenleme uzaklığı (yazım hatalarını yakalamak için)
export function lev(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}

// İngilizce cümleyi dokunulabilir kelimelere böler
export function tappable(sentence) {
  return String(sentence)
    .split(/([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'’-]*)/)
    .map((part, i) => (i % 2 ? `<span class="tw" data-w="${esc(part)}">${esc(part)}</span>` : esc(part)))
    .join('');
}
