// Muffin'e Sor: sohbet paneli. Masaüstünde yandan açılan çekmece, telefonda tam ekran; ayrıca #/sor sayfası.
// Cevaplar önce yerel bilgi bankasından anında gelir; Gemini anahtarı varsa serbest sorulara yapay zekâ cevap verir.

import { html, raw, toHTML, el } from '../lib/dom.js';
import { store } from '../lib/store.js';
import { displayName, miniMarkdown } from '../lib/text.js';
import { icon } from '../ui/icons.js';
import { muffin } from '../ui/mascot.js';
import { fmt, sayBtn } from '../ui/kit.js';
import { blocksHTML, bindBlocks } from '../ui/blocks.js';
import { openWord, wordPic } from '../ui/word.js';
import { tappable } from '../lib/text.js';
import { POS } from '../data/words.js';
import { lessonById, lineId } from '../data/units.js';
import { localAnswer, suggestions, faqById, simplifyFaq, faqExamples } from '../ask/engine.js';
import { chatTurn } from '../ask/chat.js';
import { hasAI, askAI } from '../ask/gemini.js';
import { mountQuestion } from '../quiz/engine.js';
import { addXP, checkBadges } from '../lib/rewards.js';
import { sfx } from '../audio/sfx.js';

// Konuşma bütün açılışlarda ortak
const log = [];
const aiHistory = [];
// Sohbetin bağlamı: son kelime ve konu, İngilizce sohbet modu, bilmece, beklenen cevap
const convo = { mode: null, enAsked: [], enScore: { ok: 0, total: 0 }, enQ: null, expect: null, lastWord: null, lastFaq: null, greeted: false, riddle: null, lastJoke: null };

// Önce sohbet katmanı, sonra bilgi bankası
function respond(q, ctx) {
  if (ctx && ctx.faq) return faqById(ctx.faq);
  if (ctx && ctx.forceAI) return { unknown: true, ai: true, text: 'Bunu şu an daha ayrıntılı anlatamıyorum.', chips: suggestions() };
  if (ctx && ctx.question) return localAnswer(q, ctx);
  const c = chatTurn(q, convo);
  if (!c) return localAnswer(q);
  if (c.simplify) return simplifyFaq(c.simplify) || localAnswer(q);
  if (c.examplesFor) return faqExamples(c.examplesFor) || localAnswer(q);
  if (c.forward == null) return c;
  const a = localAnswer(c.forward);
  if (c.prefix) a.text = `${c.prefix}${a.text ? `\n${a.text}` : ''}`;
  if (c.say) { a.say = [...c.say, ...(a.say || [])]; a.sayAfter = true; }
  if (c.chips) a.chips = c.chips;
  if (c.keepEn) a.chips = ['İngilizce sohbete dön', ...(a.chips || []).slice(0, 2)];
  if (c.prefix && a.unknown) {
    // Selamdan sonraki kısım anlaşılmadıysa yine de sıcak bir cevap
    a.unknown = false;
    a.text = `${c.prefix}\nBunu tam anlayamadım ama yardım etmeye hazırım. Bir kelime ya da konu sorabilirsin. 😺`;
  }
  return a;
}

function sayLinesHTML(list) {
  return html`<div class="say-lines">${list.map((l) => html`<div class="say-line">
    <div class="sl-main"><div class="sl-en">${raw(tappable(l.en))}</div>${l.tr ? html`<div class="sl-tr">${l.tr}</div>` : ''}</div>${sayBtn(l.id)}
  </div>`)}</div>`;
}

function fixHTML(f) {
  return html`<div class="fixcard">
    <div class="fx-row bad"><span class="fx-tag">Senin cümlen</span><s>${f.original}</s></div>
    <div class="fx-row good"><span class="fx-tag">Doğrusu</span><b>${f.fixed}</b>${sayBtn(lineId(f.fixed))}</div>
    <ul class="fx-notes">${f.notes.map((n) => html`<li><span class="fx-w">${n.wrong}</span><span class="fx-arrow">→</span><span class="fx-r">${n.right}</span><div class="fx-why">${fmt(n.why)}</div></li>`)}</ul>
  </div>`;
}
let drawer = null;
let activeChat = null;

const typing = () => el(html`<div class="msg bot typing"><span class="msg-ava">${raw(muffin({ mood: 'think' }))}</span><div class="msg-body"><span class="dots"><i></i><i></i><i></i></span></div></div>`);

function wordCard(w) {
  return html`<div class="wc">
    <div class="wc-pic">${wordPic(w)}</div>
    <div class="wc-main">
      <div class="wc-top"><b class="wc-en">${w.en}</b>${sayBtn(`w-${w.id}`)}<span class="tag">${POS[w.pos] || ''}</span></div>
      <div class="wc-say hand">/${w.say}/</div>
      <div class="wc-tr">${w.tr}</div>
      <div class="wc-ex"><span>${raw(tappable(w.ex))}</span>${sayBtn(`s-${w.id}`)}</div>
      <div class="wc-ex-tr">${w.exTr}</div>
      <div class="wc-more">
        ${w.opp ? html`<span class="tag gray">Zıttı: ${w.opp}</span>` : ''}
        ${w.comp ? html`<span class="tag gray">Karşılaştırma: ${w.comp}</span>` : ''}
        ${w.verb ? html`<span class="tag gray">${w.verb} ${w.en}</span>` : ''}
      </div>
      ${w.note ? html`<div class="wc-note">${icon('bulb')}<span>${w.note}</span></div>` : ''}
      <button type="button" class="btn btn--small wc-open" data-open-word="${w.id}">${icon('book')}Sözlükte aç</button>
    </div>
  </div>`;
}

function botHTML(a) {
  const lesson = a.lesson && lessonById(a.lesson);
  // Muffin'in İngilizce cümlesi önce gelir; düzeltmede ve "İngilizcesi:" gibi girişlerde sonra
  const sayTop = !!(a.say && a.say.length && !a.fix && !a.sayAfter);
  return html`
    ${a.title ? html`<h4 class="ans-title">${a.title}</h4>` : ''}
    ${sayTop ? sayLinesHTML(a.say) : ''}
    ${a.text ? html`<div class="ans-text">${a.text.split('\n').map((l) => html`<p>${fmt(l)}</p>`)}</div>` : ''}
    ${a.fix ? fixHTML(a.fix) : ''}
    ${!sayTop && a.say && a.say.length ? sayLinesHTML(a.say) : ''}
    ${a.word ? wordCard(a.word) : ''}
    ${a.list && a.list.length ? html`<div class="ans-list"><div class="t-small">Diğer karşılıklar:</div>${a.list.map((x) => (x.word ? html`<button type="button" class="ans-li" data-open-word="${x.word.id}"><b>${x.word.en}</b><span>${x.word.tr}</span></button>` : html`<div class="ans-li"><b>${x.gloss}</b><span>${x.tr}</span></div>`))}</div>` : ''}
    ${a.examples && a.examples.length ? html`<div class="ans-blocks">${blocksHTML(a.examples)}</div>` : ''}
    ${a.blocks && a.blocks.length ? html`<div class="ans-blocks">${blocksHTML(a.blocks)}</div>` : ''}
    ${a.quiz ? html`<div class="ans-quiz"></div>` : ''}
    ${a.aiText ? html`<div class="ans-ai">${raw(miniMarkdown(a.aiText))}</div>` : ''}
    ${a.aiError ? html`<div class="ans-err">${icon('alert')}<span>${a.aiError}</span></div>` : ''}
    ${lesson ? html`<a class="btn btn--small ans-lesson" href="#/ders/${lesson.id}">${icon('book')}Konu anlatımı: ${lesson.title}</a>` : ''}
    ${a.links && a.links.length ? html`<div class="ans-links">${a.links.map((l) => (l.href === '#ayarlar' ? html`<button type="button" class="btn btn--small" data-open-settings="1">${icon(l.icon || 'sliders')}${l.label}</button>` : html`<a class="btn btn--small" href="${l.href}">${icon(l.icon || 'arrow')}${l.label}</a>`))}</div>` : ''}
  `;
}

function chipsHTML(chips) {
  return html`<div class="chat-chips">${chips.map((c, i) => html`<button type="button" class="chip" data-chip="${i}">${typeof c === 'string' ? c : c.label}</button>`)}</div>`;
}

const AI_ERR = {
  anahtar: 'Gemini anahtarı geçersiz görünüyor. Ayarlar\'dan kontrol edebilirsin.',
  kota: 'Yapay zekânın bugünkü kotası dolmuş. Biraz sonra tekrar dene.',
  baglanti: 'İnternete bağlanamadım. Bağlantını kontrol et.',
  model: 'Yapay zekâ şu an cevap veremedi. Biraz sonra tekrar dene.',
  bos: 'Yapay zekâ boş cevap verdi. Soruyu biraz farklı sorabilir misin?',
};

function createChat(host, { compact = false } = {}) {
  host.innerHTML = toHTML(html`
    <div class="chat ${compact ? 'compact' : ''}">
      <div class="chat-log" aria-live="polite"></div>
      <form class="chat-input" autocomplete="off">
        <textarea rows="1" maxlength="400" placeholder="Bir şey sor... (ör. generous ne demek?)" aria-label="Sorunu yaz"></textarea>
        <button type="submit" class="send" aria-label="Gönder">${icon('send')}</button>
      </form>
    </div>`);
  const logEl = host.querySelector('.chat-log');
  const form = host.querySelector('form');
  const ta = host.querySelector('textarea');
  const cleanups = [];
  let busy = false;

  const scroll = () => requestAnimationFrame(() => { logEl.scrollTop = logEl.scrollHeight + 999; });

  function renderMsg(m, animate) {
    let node;
    if (m.from === 'me') {
      node = el(html`<div class="msg me"><div class="msg-body">${m.text}</div></div>`);
    } else {
      node = el(html`<div class="msg bot"><span class="msg-ava">${raw(muffin({ mood: m.a.mood || 'idle' }))}</span><div class="msg-body">${botHTML(m.a)}${m.a.chips && m.a.chips.length ? chipsHTML(m.a.chips) : ''}</div></div>`);
      const body = node.querySelector('.msg-body');
      const blocks = [...(m.a.examples || []), ...(m.a.blocks || [])];
      if (blocks.length) {
        // Örnekler ve bloklar ayrı kaplarda; her kap kendi bloklarıyla bağlanır
        const hosts = body.querySelectorAll('.ans-blocks');
        let k = 0;
        if (m.a.examples && m.a.examples.length) cleanups.push(bindBlocks(hosts[k++], m.a.examples));
        if (m.a.blocks && m.a.blocks.length) cleanups.push(bindBlocks(hosts[k], m.a.blocks));
      }
      if (m.a.quiz) {
        const qh = body.querySelector('.ans-quiz');
        cleanups.push(mountQuestion(qh, m.a.quiz, {
          onAnswer: ({ correct }) => {
            if (m.a.quizDone) return;
            m.a.quizDone = true;
            const r = qh.getBoundingClientRect();
            if (correct) { sfx.right(); addXP(10, { x: r.left + r.width / 2, y: r.top }); } else sfx.wrong();
            qh.insertAdjacentHTML('beforeend', toHTML(html`<div class="ans-qwhy ${correct ? 'ok' : 'no'}">${correct ? 'Doğru! ' : 'Olmadı. '}${fmt((m.a.quiz.why || '').replace(/\n/g, ' · '))}</div>`));
            scroll();
          },
        }));
      }
    }
    logEl.append(node);
    if (animate) node.animate([{ opacity: 0, transform: `translateY(14px) scale(.97)` }, { opacity: 1, transform: 'none' }], { duration: 360, easing: 'cubic-bezier(.22,1.2,.36,1)' });
    return node;
  }

  function renderAll() {
    logEl.innerHTML = '';
    if (!log.length) {
      const name = displayName(store.get('name'));
      log.push({ from: 'bot', a: { mood: 'happy', text: `Merhaba ${name}! Ben **Muffin**, İngilizce çalışma arkadaşın.\nTakıldığın her şeyi bana sorabilirsin: kelime anlamı, Türkçeden İngilizceye, zıt anlam, karşılaştırma, konu anlatımı... Hemen cevaplarım!`, chips: suggestions() } });
    }
    log.forEach((m) => renderMsg(m, false));
    scroll();
  }

  async function send(text, ctx = null) {
    if (busy) return;
    const q = String(text || '').trim();
    if (!q && !ctx) return;
    busy = true;
    // Önceki mesajlardaki öneri fişleri kalkar
    logEl.querySelectorAll('.chat-chips').forEach((c) => c.remove());
    log.forEach((m) => { if (m.a) m.a.chips = null; });
    const shown = ctx && ctx.label ? ctx.label : ctx && ctx.question ? 'Bu soruyu anlamadım, açıklar mısın?' : q;
    log.push({ from: 'me', text: shown });
    renderMsg(log[log.length - 1], true);
    store.set('asked', store.get('asked') + 1);
    checkBadges();
    scroll();
    const t = typing();
    logEl.append(t);
    scroll();
    let a;
    try {
      a = respond(q, ctx);
    } catch (err) {
      console.error(err);
      a = null;
    }
    if (!a) a = { text: 'Bunu tam anlayamadım. Başka türlü sorar mısın? 😺', unknown: true, ai: true, chips: suggestions() };
    if (a.word) convo.lastWord = a.word;
    if (a.faqId) { convo.lastFaq = a.faqId; if (!a.word) convo.lastWord = null; }
    await new Promise((r) => setTimeout(r, 380 + Math.random() * 300));
    const ai = hasAI();
    const wantAI = ai && (a.unknown || (ctx && ctx.question) || (ctx && ctx.forceAI));
    if (wantAI) {
      try {
        const prompt = ctx && ctx.question
          ? `Şu alıştırma sorusunu yanlış yaptım, bana kısaca açıklar mısın?\nSoru: ${String(ctx.question.q || ctx.question.hint || '').replace(/\n/g, ' / ')}\nSeçenekler: ${(ctx.question.opts || []).filter((o) => typeof o === 'string').join(' | ')}\nDoğru cevap: ${ctx.answer}\nKısa açıklama: ${ctx.question.why || ''}`
          : q;
        const text2 = await askAI(aiHistory, prompt);
        aiHistory.push({ role: 'user', text: prompt }, { role: 'model', text: text2 });
        if (a.unknown) {
          a.text = '';
          a.chips = suggestions();
          a.mood = 'happy';
        }
        a.aiText = text2;
      } catch (err) {
        if (!a.unknown) a.aiError = AI_ERR[err.message] || AI_ERR.model;
        else a.text = `${a.text}\n\n${AI_ERR[err.message] || AI_ERR.model}`;
      }
    } else if (ai && a.ai && !a.unknown) {
      a.chips = [...(a.chips || []), { label: 'Daha ayrıntılı anlat', more: q || (ctx && ctx.question && ctx.question.q) || '' }];
    }
    aiHistory.push({ role: 'user', text: shown }, { role: 'model', text: a.aiText || a.title || a.text || (a.word ? `${a.word.en}: ${a.word.tr}` : '') });
    t.remove();
    log.push({ from: 'bot', a });
    const node = renderMsg(log[log.length - 1], true);
    sfx.pop();
    if (a.xp) {
      const r = node.getBoundingClientRect();
      setTimeout(() => addXP(a.xp, { x: r.left + 60, y: r.top + 20 }), 300);
    }
    scroll();
    busy = false;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = ta.value;
    ta.value = '';
    ta.style.height = '';
    send(v);
  });
  ta.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });
  ta.addEventListener('input', () => {
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(120, ta.scrollHeight)}px`;
  });
  logEl.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-chip]');
    if (chip) {
      const msg = log.filter((m) => m.a && m.a.chips).pop();
      const c = msg && msg.a.chips[Number(chip.dataset.chip)];
      if (!c) return;
      sfx.tap();
      if (typeof c === 'string') send(c);
      else if (c.faq) send('', { faq: c.faq, label: c.label });
      else if (c.more != null) send(c.more, { forceAI: true, label: 'Daha ayrıntılı anlatır mısın?' });
      return;
    }
    const w = e.target.closest('[data-open-word]');
    if (w) openWord(w.dataset.openWord);
    if (e.target.closest('[data-open-settings]')) {
      closeAsk();
      const b = document.getElementById('btn-settings') || document.querySelector('[data-act-settings]');
      if (b) setTimeout(() => b.click(), 200);
    }
  });

  renderAll();
  activeChat = { send };
  return {
    send,
    focus: () => ta.focus({ preventScroll: true }),
    destroy() {
      cleanups.forEach((fn) => { try { fn(); } catch (err) { console.error(err); } });
      if (activeChat && activeChat.send === send) activeChat = null;
    },
  };
}

/* ---------- Çekmece ---------- */

export const askOpen = () => !!drawer;

export function openAsk(prefill = null, ctx = null) {
  if (location.hash.startsWith('#/sor') && activeChat) {
    if (prefill || ctx) activeChat.send(prefill || '', ctx);
    return;
  }
  if (!drawer) {
    const root = document.getElementById('ask-root');
    const node = el(html`<div class="ask-wrap">
      <div class="ask-back"></div>
      <section class="ask-drawer" role="dialog" aria-label="Muffin'e sor">
        <header class="ask-head">
          <span class="ask-face bob">${raw(muffin({ mood: 'happy' }))}</span>
          <div class="ask-title"><b>Muffin</b><span>İngilizce çalışma arkadaşın</span></div>
          <button type="button" class="ibtn ask-close" aria-label="Kapat">${icon('x')}</button>
        </header>
        <div class="ask-body"></div>
      </section>
    </div>`);
    root.append(node);
    const chat = createChat(node.querySelector('.ask-body'), { compact: true });
    drawer = { node, chat };
    node.querySelector('.ask-back').addEventListener('click', closeAsk);
    node.querySelector('.ask-close').addEventListener('click', () => { sfx.tap(); closeAsk(); });
    node.querySelector('.ask-drawer').animate([{ transform: 'translateX(105%)' }, { transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.22,1.1,.36,1)' });
    node.querySelector('.ask-back').animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
    window.addEventListener('keydown', escClose);
    document.body.classList.add('ask-on');
    if (!prefill && !ctx) setTimeout(() => chat.focus(), 420);
  }
  if (prefill || ctx) drawer.chat.send(prefill || '', ctx);
}

function escClose(e) {
  if (e.key === 'Escape' && !document.querySelector('.sheet-back')) closeAsk();
}

export function closeAsk() {
  if (!drawer) return;
  const { node, chat } = drawer;
  drawer = null;
  window.removeEventListener('keydown', escClose);
  document.body.classList.remove('ask-on');
  chat.destroy();
  const a = node.querySelector('.ask-drawer').animate([{ transform: 'none' }, { transform: 'translateX(105%)' }], { duration: 300, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards' });
  node.querySelector('.ask-back').animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' });
  a.finished.then(() => node.remove(), () => node.remove());
}

/* ---------- Sayfa ---------- */

export function mountAskPage(view) {
  view.innerHTML = toHTML(html`
    <div class="page narrow ask-page">
      <header class="ask-hero">
        <span class="ask-face big bob">${raw(muffin({ mood: 'happy' }))}</span>
        <div><div class="eyebrow">Takıldığın yerde</div><h1 class="t-title">Muffin'e Sor</h1><p class="t-lead">Kelime, konu, örnek cümle... Ne sorarsan anında cevaplar.</p></div>
      </header>
      <div class="card ask-card"></div>
    </div>`);
  const chat = createChat(view.querySelector('.ask-card'));
  if (window.matchMedia('(min-width: 961px)').matches) setTimeout(() => chat.focus(), 300);
  return { unmount: () => chat.destroy() };
}
