// XP, günlük hedef, seviye atlama ve rozetler

import { store, dayKey, todayXP, streak, level, isLearned } from './store.js';
import { toast } from '../ui/overlay.js';
import { burst, cannons } from '../fx/confetti.js';
import { sfx } from '../audio/sfx.js';
import { WORDS } from '../data/words.js';
import { LESSONS, READINGS } from '../data/units.js';
import { esc } from './dom.js';

export const BADGES = [
  { id: 'first-lesson', pic: '🎒', name: 'İlk Ders', how: 'Bir konuyu bitir.' },
  { id: 'lessons-u1', pic: '🪞', name: 'Ünite 1 Konuları', how: 'Ünite 1\'deki bütün konuları bitir.' },
  { id: 'lessons-u2', pic: '🏅', name: 'Ünite 2 Konuları', how: 'Ünite 2\'deki bütün konuları bitir.' },
  { id: 'words-25', pic: '🔤', name: 'Kelime Avcısı', how: '25 kelimeyi öğren (kartlarda 3 kez bil).' },
  { id: 'words-100', pic: '📚', name: 'Kelime Ustası', how: '100 kelimeyi öğren.' },
  { id: 'dict-20', pic: '🔍', name: 'Sözlük Kurdu', how: 'Sözlükte 20 kelimeye bak.' },
  { id: 'ask-10', pic: '🐱', name: 'Meraklı Kedi', how: 'Muffin\'e 10 soru sor.' },
  { id: 'streak-3', pic: '🔥', name: '3 Gün Seri', how: '3 gün üst üste çalış.' },
  { id: 'streak-7', pic: '🌟', name: '1 Hafta Seri', how: '7 gün üst üste çalış.' },
  { id: 'goal', pic: '🎯', name: 'Hedef Tamam', how: 'Günlük XP hedefini tamamla.' },
  { id: 'stars-3', pic: '⭐', name: 'Üç Yıldız', how: 'Bir alıştırmadan 3 yıldız al.' },
  { id: 'reader', pic: '📖', name: 'Kitap Kurdu', how: 'Bütün okuma parçalarını bitir.' },
  { id: 'exam-u1', pic: '🏆', name: 'Ünite 1 Uzmanı', how: 'Ünite 1 deneme sınavından 85 ve üstü al.' },
  { id: 'exam-u2', pic: '🥇', name: 'Ünite 2 Uzmanı', how: 'Ünite 2 deneme sınavından 85 ve üstü al.' },
  { id: 'exam-100', pic: '💯', name: 'Kusursuz', how: 'Bir deneme sınavından 100 al.' },
  { id: 'fixer', pic: '🩹', name: 'Hatasız Defter', how: 'Yanlışlarım\'dan 10 soruyu düzelt.' },
];

function unlock(id) {
  if (store.get('badges')[id]) return false;
  store.patch('badges', id, Date.now());
  const b = BADGES.find((x) => x.id === id);
  if (b) {
    setTimeout(() => {
      toast(`<span class="badge-pic">${b.pic}</span><span>Yeni rozet: <b>${esc(b.name)}</b></span>`, { tone: 'good', ms: 3600, html: true });
      sfx.fanfare();
      cannons();
    }, 500);
  }
  return true;
}

export function checkBadges() {
  const lessons = store.get('lessons');
  const done = (u) => LESSONS.filter((l) => l.unit === u).every((l) => lessons[l.id]);
  if (Object.keys(lessons).length) unlock('first-lesson');
  if (done(1)) unlock('lessons-u1');
  if (done(2)) unlock('lessons-u2');
  const learned = WORDS.filter((w) => isLearned(w.id)).length;
  if (learned >= 25) unlock('words-25');
  if (learned >= 100) unlock('words-100');
  if (store.get('lookups') >= 20) unlock('dict-20');
  if (store.get('asked') >= 10) unlock('ask-10');
  const s = streak();
  if (s >= 3) unlock('streak-3');
  if (s >= 7) unlock('streak-7');
  if (todayXP() >= store.get('goal')) unlock('goal');
  if (Object.values(store.get('sets')).some((x) => x.stars >= 3)) unlock('stars-3');
  if (READINGS.every((r) => store.get('readings')[r.id])) unlock('reader');
  const exams = store.get('exams');
  if (exams.some((e) => e.u === 1 && e.score >= 85)) unlock('exam-u1');
  if (exams.some((e) => e.u === 2 && e.score >= 85)) unlock('exam-u2');
  if (exams.some((e) => e.score === 100)) unlock('exam-100');
  if (store.get('fixed') >= 10) unlock('fixer');
}

// XP ekler; isteğe bağlı olarak verilen noktadan üst çubuğa uçan "+10" gösterir
export function addXP(n, from = null) {
  if (!n) return;
  const beforeLevel = level().n;
  const beforeToday = todayXP();
  const goal = store.get('goal');
  const days = { ...store.get('days') };
  const k = dayKey();
  days[k] = (days[k] || 0) + n;
  // Çok eski günleri tutma (seri için son 400 gün yeter)
  const keys = Object.keys(days).sort();
  while (keys.length > 400) delete days[keys.shift()];
  store.set('days', days);
  store.set('xp', store.get('xp') + n);
  if (from) fly(n, from);
  const after = level();
  if (after.n > beforeLevel) {
    setTimeout(() => {
      toast(`<span class="badge-pic">🚀</span><span>Seviye atladın! Artık <b>${after.name}</b> seviyesindesin.</span>`, { tone: 'good', ms: 3600, html: true });
      sfx.fanfare();
      cannons();
    }, 600);
  }
  if (beforeToday < goal && beforeToday + n >= goal) {
    setTimeout(() => {
      toast('<span class="badge-pic">🎯</span><span>Bugünkü hedefini tamamladın. Harikasın!</span>', { tone: 'good', ms: 3200, html: true });
      burst(window.innerWidth / 2, window.innerHeight * 0.3, { count: 70, power: 13 });
    }, 300);
  }
  checkBadges();
}

function fly(n, { x, y }) {
  const target = document.getElementById('xp-chip');
  const node = document.createElement('div');
  node.className = 'xp-fly';
  node.textContent = `+${n}`;
  document.body.append(node);
  const r = target && target.offsetParent ? target.getBoundingClientRect() : null;
  const tx = r ? r.left + r.width / 2 - x : 0;
  const ty = r ? r.top + r.height / 2 - y : -120;
  node.style.left = `${x}px`;
  node.style.top = `${y}px`;
  const a = node.animate([
    { transform: 'translate(-50%, -50%) scale(.6)', opacity: 0 },
    { transform: 'translate(-50%, -150%) scale(1.25)', opacity: 1, offset: 0.25 },
    { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(.7)`, opacity: 0.9 },
  ], { duration: 900, easing: 'cubic-bezier(.5,0,.3,1)' });
  a.finished.then(() => {
    node.remove();
    if (target) {
      target.classList.remove('bump');
      void target.offsetWidth;
      target.classList.add('bump');
    }
  }, () => node.remove());
}
