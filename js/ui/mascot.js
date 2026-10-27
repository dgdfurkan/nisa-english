// Muffin: yuvarlak gözlüklü turuncu kedi. Soru-cevap yardımcısı ve geri bildirim arkadaşı.
// mood: happy, wow, think, sad, wink

const INK = '#22264b';

function eyes(mood) {
  if (mood === 'happy') {
    return `<path d="M35 60 q7 -9 14 0" fill="none" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/><path d="M71 60 q7 -9 14 0" fill="none" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/>`;
  }
  if (mood === 'wink') {
    return `<g class="m-blink"><ellipse cx="42" cy="58" rx="5.6" ry="7.4" fill="${INK}"/><circle cx="44" cy="55" r="2" fill="#fff"/></g><path d="M71 60 q7 -9 14 0" fill="none" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/>`;
  }
  if (mood === 'wow') {
    return `<g class="m-blink"><circle cx="42" cy="58" r="7.8" fill="${INK}"/><circle cx="78" cy="58" r="7.8" fill="${INK}"/><circle cx="45" cy="55" r="2.6" fill="#fff"/><circle cx="81" cy="55" r="2.6" fill="#fff"/></g>`;
  }
  if (mood === 'sad') {
    return `<g class="m-blink"><ellipse cx="42" cy="61" rx="5.4" ry="6.6" fill="${INK}"/><ellipse cx="78" cy="61" rx="5.4" ry="6.6" fill="${INK}"/><circle cx="44" cy="58.5" r="1.8" fill="#fff"/><circle cx="80" cy="58.5" r="1.8" fill="#fff"/></g><path d="M33 50 l12 4 M87 50 l-12 4" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
  }
  if (mood === 'think') {
    return `<g class="m-blink"><ellipse cx="44" cy="55" rx="5.4" ry="7" fill="${INK}"/><ellipse cx="80" cy="55" rx="5.4" ry="7" fill="${INK}"/><circle cx="46" cy="52" r="2" fill="#fff"/><circle cx="82" cy="52" r="2" fill="#fff"/></g>`;
  }
  return `<g class="m-blink"><ellipse cx="42" cy="58" rx="5.6" ry="7.4" fill="${INK}"/><ellipse cx="78" cy="58" rx="5.6" ry="7.4" fill="${INK}"/><circle cx="44" cy="55" r="2" fill="#fff"/><circle cx="80" cy="55" r="2" fill="#fff"/></g>`;
}

function mouth(mood) {
  if (mood === 'wow') return `<ellipse cx="60" cy="84" rx="4.6" ry="5.6" fill="${INK}"/><ellipse cx="60" cy="86" rx="2.6" ry="2" fill="#ff8fa3"/>`;
  if (mood === 'sad') return `<path d="M51 86 q9 -6 18 0" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
  if (mood === 'think') return `<path d="M54 83 q6 2 12 -1" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
  return `<path d="M50 79 q5 7 10 0 q5 7 10 0" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
}

export function muffin({ mood = 'idle', glasses = true, cls = '' } = {}) {
  return `<svg class="muffin ${cls}" data-mood="${mood}" viewBox="0 0 120 112" aria-hidden="true">
  <g class="m-ear-l"><path d="M20 46 L24 7 Q26 3 30 6 L56 28 Z" fill="#f7a54a" stroke="${INK}" stroke-width="3.4" stroke-linejoin="round"/><path d="M28 36 L30 16 L45 29 Z" fill="#ffb3c1"/></g>
  <g class="m-ear-r"><path d="M100 46 L96 7 Q94 3 90 6 L64 28 Z" fill="#f7a54a" stroke="${INK}" stroke-width="3.4" stroke-linejoin="round"/><path d="M92 36 L90 16 L75 29 Z" fill="#ffb3c1"/></g>
  <ellipse cx="60" cy="64" rx="47" ry="41" fill="#f7a54a" stroke="${INK}" stroke-width="3.4"/>
  <path d="M51 27 q3 6 0 11 M60 25 v11 M69 27 q-3 6 0 11" fill="none" stroke="#dd7a1f" stroke-width="3.2" stroke-linecap="round"/>
  <ellipse cx="60" cy="80" rx="24" ry="17" fill="#fff1dc"/>
  <ellipse cx="30" cy="75" rx="7.5" ry="4.4" fill="#ff8fa3" opacity=".55"/><ellipse cx="90" cy="75" rx="7.5" ry="4.4" fill="#ff8fa3" opacity=".55"/>
  ${eyes(mood)}
  ${glasses ? `<g fill="#fff" fill-opacity=".22" stroke="${INK}" stroke-width="3"><circle cx="42" cy="58" r="12.5"/><circle cx="78" cy="58" r="12.5"/></g><path d="M54.5 57 q5.5 -4 11 0" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>` : ''}
  <path d="M54.5 70 h11 l-5.5 6.2 z" fill="#ff8fa3" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>
  ${mouth(mood)}
  <path d="M15 74 l15 2 M15 82 l15 -1 M105 74 l-15 2 M105 82 l-15 -1" stroke="${INK}" stroke-width="2.2" stroke-linecap="round" opacity=".55"/>
</svg>`;
}
