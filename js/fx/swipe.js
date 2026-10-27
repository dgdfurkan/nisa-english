// Sayfa geçişi: ekranı fosforlu kalem darbesi gibi çapraz geçen iki renkli şerit.
// Yalnızca transform ile hareket eder; ekran kartı yeniden çizmeden kaydırır.

const root = () => document.getElementById('swipe');

export async function cover({ a = '#ff7a9c', b = '#ffd84d' } = {}) {
  const w = root();
  w.style.setProperty('--sw-a', a);
  w.style.setProperty('--sw-b', b);
  w.classList.add('on');
  document.body.classList.add('swiping');
  const [la, lb] = w.children;
  la.getAnimations().forEach((an) => an.cancel());
  lb.getAnimations().forEach((an) => an.cancel());
  const opts = { duration: 380, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' };
  const p1 = la.animate([{ transform: 'translateX(-135%) skewX(-14deg)' }, { transform: 'translateX(0) skewX(-14deg)' }], opts).finished;
  const p2 = lb.animate([{ transform: 'translateX(-135%) skewX(-14deg)' }, { transform: 'translateX(0) skewX(-14deg)' }], { ...opts, delay: 70 }).finished;
  await Promise.all([p1, p2]).catch(() => {});
}

export async function reveal() {
  const w = root();
  w.classList.remove('on');
  const [la, lb] = w.children;
  const opts = { duration: 420, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' };
  const p1 = lb.animate([{ transform: 'translateX(0) skewX(-14deg)' }, { transform: 'translateX(135%) skewX(-14deg)' }], opts).finished;
  const p2 = la.animate([{ transform: 'translateX(0) skewX(-14deg)' }, { transform: 'translateX(135%) skewX(-14deg)' }], { ...opts, delay: 60 }).finished;
  await Promise.all([p1, p2]).catch(() => {});
  document.body.classList.remove('swiping');
}
