// Paragraf Makinesi: seçimlerden doğru İngilizce bir paragraf kurar (yazılı sınav hazırlığı)

import { html, toHTML } from '../lib/dom.js';
import { store } from '../lib/store.js';
import { displayName } from '../lib/text.js';
import { segHTML, bindSeg, switchHTML, bindSwitch, stepperHTML, bindStepper } from './controls.js';
import { icon } from './icons.js';
import { toast } from './overlay.js';
import { WORDS } from '../data/words.js';
import { sfx } from '../audio/sfx.js';

const TRAITS = ['friendly', 'kind', 'helpful', 'funny', 'hard-working', 'generous', 'honest', 'clever', 'cheerful', 'talkative', 'shy', 'calm', 'patient', 'creative'];
const DOES = {
  friendly: '{S} always smiles and says hello to everybody.',
  kind: '{S} is always nice to people and animals.',
  helpful: '{S} always helps me with my homework.',
  funny: '{S} tells jokes and makes me laugh.',
  'hard-working': '{S} studies every day.',
  generous: '{S} always shares {P} things with me.',
  honest: '{S} never tells lies.',
  clever: '{S} solves Maths problems very quickly.',
  cheerful: '{S} is always happy and smiling.',
  talkative: '{S} talks all the time!',
  shy: "{S} doesn't talk much with new people.",
  calm: '{S} never gets angry.',
  patient: '{S} always listens to me carefully.',
  creative: '{S} draws beautiful pictures.',
};

const chipsRow = (name, list, sel) => html`<div class="chips" data-chips="${name}">${list.map(([v, label]) => html`<button type="button" class="chip ${sel.includes(v) ? 'on' : ''}" data-value="${v}">${label}</button>`)}</div>`;

function bindChipsMax(root, { values, max, onChange }) {
  let sel = values.slice();
  root.addEventListener('click', (e) => {
    const b = e.target.closest('.chip');
    if (!b) return;
    const v = b.dataset.value;
    if (sel.includes(v)) {
      if (sel.length <= 1) {
        b.classList.remove('shake');
        void b.offsetWidth;
        b.classList.add('shake');
        return;
      }
      sel = sel.filter((x) => x !== v);
    } else {
      if (max === 1) sel = [];
      sel.push(v);
      if (sel.length > max) sel.shift();
    }
    root.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', sel.includes(c.dataset.value)));
    sfx.soft();
    onChange(sel.slice());
  });
}

function friendUI() {
  return html`
    <div class="bd-grid">
      <label class="bd-f"><span>Arkadaşının adı</span><input class="field" data-k="name" maxlength="16" value="Defne" autocomplete="off"></label>
      <div class="bd-f"><span>Yaşı</span>${stepperHTML('age', 12)}</div>
      <div class="bd-f"><span>Kız mı, erkek mi?</span>${segHTML('who', [['she', 'Kız'], ['he', 'Erkek']], 'she')}</div>
      <div class="bd-f"><span>Boyu</span>${segHTML('height', [['tall', 'tall'], ['mid', 'medium'], ['short', 'short']], 'tall')}</div>
      <div class="bd-f"><span>Vücudu</span>${segHTML('build', [['slim', 'slim'], ['well-built', 'well-built'], ['plump', 'plump']], 'slim')}</div>
      <div class="bd-f"><span>Saç uzunluğu</span>${segHTML('len', [['long', 'long'], ['shoulder-length', 'shoulder'], ['short', 'short']], 'long')}</div>
      <div class="bd-f"><span>Saç şekli</span>${segHTML('type', [['straight', 'straight'], ['wavy', 'wavy'], ['curly', 'curly']], 'straight')}</div>
      <div class="bd-f"><span>Saç rengi</span>${segHTML('color', [['black', 'black'], ['brown', 'brown'], ['blonde', 'blonde'], ['red', 'red']], 'black')}</div>
      <div class="bd-f row-f"><span>Gözlük takıyor mu?</span>${switchHTML('glasses', true, 'Gözlük')}</div>
      <div class="bd-f wide"><span>Kişiliği (en fazla 2)</span>${chipsRow('traits', TRAITS.map((t) => [t, t]), ['friendly', 'helpful'])}</div>
      <div class="bd-f wide"><span>Seninle karşılaştır</span>${segHTML('cmp', [['taller', 'taller than me'], ['shorter', 'shorter than me'], ['same', 'as tall as me']], 'taller')}</div>
    </div>`;
}

function friendText(s) {
  const S = s.who === 'she' ? 'She' : 'He';
  const P = s.who === 'she' ? 'her' : 'his';
  const O = s.who === 'she' ? 'her' : 'him';
  const name = (s.name || '').trim() || 'Defne';
  const h = s.height === 'mid' ? 'of medium height' : s.height;
  const build = s.build === 'plump' ? 'a bit plump' : s.build;
  const [t1, t2] = s.traits;
  const traits = t2 ? `very ${t1} and ${t2}` : `very ${t1}`;
  const cmp = s.cmp === 'same' ? `${S} is as tall as me.` : `${S} is ${s.cmp} than me.`;
  return [
    `My best friend's name is ${name}. ${S} is ${s.age} years old.`,
    `${S} is ${h} and ${build}. ${S} has got ${s.len} ${s.type} ${s.color} hair${s.glasses ? ` and ${s.who} wears glasses` : ''}.`,
    `${S} is ${traits}. ${DOES[t1].replace('{S}', S).replace('{P}', P)}`,
    `${cmp} I love ${O} because ${s.who} is a great friend.`,
  ];
}

const SPORTS = ['football', 'basketball', 'volleyball', 'tennis', 'table tennis', 'chess', 'swimming', 'cycling', 'running', 'skiing', 'ice skating', 'karate', 'judo', 'yoga', 'gymnastics', 'archery', 'horse riding'];
const verbOf = (en) => (WORDS.find((w) => w.en === en) || { verb: 'play' }).verb;
const compOf = (adj) => (WORDS.find((w) => w.en === adj) || { comp: `more ${adj}` }).comp;

function sportUI() {
  const chipsList = (list) => list.map((x) => [x, x]);
  return html`
    <div class="bd-grid">
      <div class="bd-f wide"><span>En sevdiğin spor</span>${chipsRow('sport', chipsList(SPORTS), ['volleyball'])}</div>
      <div class="bd-f wide"><span>Ne sıklıkla?</span>${segHTML('freq', [['every day', 'every day'], ['twice a week', 'twice a week'], ['three times a week', '3 times a week'], ['at weekends', 'at weekends']], 'twice a week')}</div>
      <div class="bd-f wide"><span>Kiminle?</span>${segHTML('with', [['with my friends', 'friends'], ['with my family', 'family'], ['with my team', 'team']], 'with my friends')}</div>
      <div class="bd-f wide"><span>Neden seviyorsun? (2 tane)</span>${chipsRow('why', chipsList(['exciting', 'fun', 'healthy', 'relaxing', 'challenging']), ['exciting', 'fun'])}</div>
      <div class="bd-f wide"><span>Sevmediğin spor</span>${chipsRow('hate', chipsList(['boxing', 'golf', 'wrestling', 'weightlifting', 'mountain climbing', 'fishing']), ['boxing'])}</div>
      <div class="bd-f wide"><span>Neden sevmiyorsun?</span>${segHTML('reason', [['dangerous', 'dangerous'], ['boring', 'boring'], ['tiring', 'tiring'], ['expensive', 'expensive']], 'dangerous')}</div>
    </div>`;
}

function sportText(s) {
  const me = displayName(store.get('name'));
  const [sp] = s.sport;
  const v = verbOf(sp);
  const [a1, a2] = s.why;
  const [hate] = s.hate;
  const hv = verbOf(hate);
  const cap = (x) => x.charAt(0).toUpperCase() + x.slice(1);
  const comp = compOf(a1);
  return [
    `My name is ${me} and I am crazy about sports! My favourite sport is ${sp}.`,
    `I ${v} ${sp} ${s.freq} ${s.with}.`,
    `I love it because it is ${a1}${a2 ? ` and ${a2}` : ''}.`,
    `I don't like ${hate} because I think it is ${s.reason}. I never ${hv} ${hate}.`,
    `${cap(sp)} is ${comp} than ${hate}!`,
  ];
}

export function mountBuilder(node, kind) {
  const state = kind === 'sport'
    ? { sport: ['volleyball'], freq: 'twice a week', with: 'with my friends', why: ['exciting', 'fun'], hate: ['boxing'], reason: 'dangerous' }
    : { name: 'Defne', age: 12, who: 'she', height: 'tall', build: 'slim', len: 'long', type: 'straight', color: 'black', glasses: true, traits: ['friendly', 'helpful'], cmp: 'taller' };
  node.innerHTML = toHTML(html`
    <div class="builder">
      <div class="bd-head">${icon('pencil')}<b>Paragraf Makinesi</b></div>
      ${kind === 'sport' ? sportUI() : friendUI()}
      <div class="bd-out">
        <div class="bd-paper" aria-live="polite"></div>
        <button type="button" class="btn btn--small bd-copy">${icon('note')}Kopyala</button>
      </div>
    </div>`);
  const paper = node.querySelector('.bd-paper');
  const segs = [];
  const draw = () => {
    const lines = kind === 'sport' ? sportText(state) : friendText(state);
    paper.innerHTML = toHTML(html`${lines.map((l) => html`<span class="bd-line">${l} </span>`)}`);
    paper.animate([{ opacity: 0.5 }, { opacity: 1 }], { duration: 250 });
  };
  const input = node.querySelector('[data-k="name"]');
  node.querySelectorAll('[data-seg]').forEach((root) => {
    const k = root.dataset.seg;
    segs.push(bindSeg(root, {
      value: state[k],
      onChange: (v) => {
        state[k] = v;
        // Örnek ad değiştirilmediyse cinsiyete uygun bir örnek ada geç
        if (k === 'who' && input && ['Defne', 'Can'].includes(input.value.trim())) {
          input.value = v === 'he' ? 'Can' : 'Defne';
          state.name = input.value;
        }
        draw();
      },
    }));
  });
  node.querySelectorAll('[data-switch]').forEach((root) => {
    const k = root.dataset.switch;
    bindSwitch(root, { value: state[k], onChange: (v) => { state[k] = v; draw(); } });
  });
  node.querySelectorAll('[data-stepper]').forEach((root) => {
    const k = root.dataset.stepper;
    bindStepper(root, { value: state[k], min: 10, max: 15, onChange: (v) => { state[k] = v; draw(); } });
  });
  node.querySelectorAll('[data-chips]').forEach((root) => {
    const k = root.dataset.chips;
    const max = k === 'traits' || k === 'why' ? 2 : 1;
    bindChipsMax(root, { values: state[k], max, onChange: (v) => { state[k] = v; draw(); } });
  });
  if (input) input.addEventListener('input', () => { state.name = input.value; draw(); });
  node.querySelector('.bd-copy').addEventListener('click', async () => {
    const text = paper.textContent.trim();
    try {
      await navigator.clipboard.writeText(text);
      toast('Paragraf kopyalandı. Şimdi defterine yaz!', { tone: 'good' });
    } catch {
      toast('Kopyalanamadı; paragrafı defterine bakarak yazabilirsin.', { tone: 'warn' });
    }
    sfx.pop();
  });
  draw();
  return () => segs.forEach((s) => s.destroy && s.destroy());
}
