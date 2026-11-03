'use strict';
/* ====== ข้อมูลตัวเลือกกระทง ====== */
const BASES = [{id:'leaf',name:'ใบตอง'},{id:'lotus',name:'ดอกบัว'},{id:'heart',name:'หัวใจ'}];
const FLOWERS = [{id:'🌸',name:'🌸'},{id:'🪷',name:'🪷'},{id:'🌼',name:'🌼'}];
const CANDLES = [{id:'#ffc2d6',name:'ชมพู'},{id:'#fff3e0',name:'ครีม'},{id:'#d9c8f5',name:'ลาเวนเดอร์'}];
/* State: เก็บคำอธิษฐานไว้ในหน่วยความจำของหน้าเว็บเท่านั้น (ไม่ส่งไปที่ไหน) */
const state = {wish: ''};
const choice = {base:'lotus',flower:'🌸',candle:'#ffc2d6'};

/* ====== SVG: น้องหมี ====== */
const BEAR_SVG = `<svg class="bear" viewBox="0 0 120 130" aria-hidden="true">
<circle cx="28" cy="26" r="16" fill="#e7b98f"/><circle cx="92" cy="26" r="16" fill="#e7b98f"/>
<circle cx="28" cy="26" r="8" fill="#ffc2d6"/><circle cx="92" cy="26" r="8" fill="#ffc2d6"/>
<ellipse cx="60" cy="100" rx="34" ry="28" fill="#e7b98f"/><ellipse cx="60" cy="104" rx="20" ry="18" fill="#fff3e0"/>
<circle cx="60" cy="52" r="38" fill="#f0c9a3"/><ellipse cx="60" cy="64" rx="17" ry="13" fill="#fff3e0"/>
<circle cx="46" cy="48" r="4" fill="#1c2352"/><circle cx="74" cy="48" r="4" fill="#1c2352"/>
<ellipse cx="60" cy="60" rx="5" ry="3.5" fill="#1c2352"/><path d="M52 68q8 7 16 0" stroke="#1c2352" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<circle cx="36" cy="62" r="6" fill="#ffb3cf" opacity=".7"/><circle cx="84" cy="62" r="6" fill="#ffb3cf" opacity=".7"/></svg>`;

/* ====== SVG: กระทงตามที่เลือก (lit = จุดเทียนแล้ว) ====== */
function krathongSVG(lit) {
  const bases = {
    leaf: '<ellipse cx="100" cy="128" rx="82" ry="22" fill="#b5dcb4"/><ellipse cx="100" cy="118" rx="68" ry="18" fill="#d4efcb"/>',
    lotus: [-60,-30,0,30,60].map(a => `<ellipse cx="100" cy="116" rx="16" ry="38" fill="${a%60?'#ffb3cf':'#ffc2d6'}" transform="rotate(${a} 100 134)"/>`).join('') + '<ellipse cx="100" cy="134" rx="70" ry="14" fill="#fff3e0"/>',
    heart: '<path d="M100 152C20 108 36 68 100 104 164 68 180 108 100 152Z" fill="#ffc2d6"/><path d="M100 140C46 108 58 88 100 110 142 88 154 108 100 140Z" fill="#fff3e0"/>'
  };
  const flowers = [58,100,142].map((x,i) => `<text x="${x}" y="${i===1?118:124}" font-size="30" text-anchor="middle">${choice.flower}</text>`).join('');
  const candle = `<rect x="92" y="62" width="16" height="42" rx="3" fill="${choice.candle}"/>` +
    (lit ? '<g class="lit-in"><g class="flame"><path d="M100 36c10 14 10 22 0 26-10-4-10-12 0-26z" fill="#ffd36e"/><path d="M100 46c5 7 5 11 0 13-5-2-5-6 0-13z" fill="#fff6d6"/></g></g>' : '');
  const glow = lit ? '<circle class="glow" cx="100" cy="70" r="90" fill="url(#g)"/>' : '';
  return `<svg viewBox="0 0 200 170" aria-label="กระทง"><defs><radialGradient id="g"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".75"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient></defs>${glow}${bases[choice.base]}${flowers}${candle}</svg>`;
}

/* ====== ตัวช่วย ====== */
const $ = id => document.getElementById(id);
const scenes = [...document.querySelectorAll('.scene')];
let current = 0, busy = false;      // busy = กันการกดซ้ำระหว่างเปลี่ยน Scene

function goTo(next) {
  if (busy || next === current) return;
  busy = true;
  const from = scenes[current], to = scenes[next];
  from.classList.remove('active');
  setTimeout(() => {
    from.hidden = true; to.hidden = false;
    current = next; onEnter(next);
    requestAnimationFrame(() => to.classList.add('active'));
    setTimeout(() => { busy = false; }, 500);
  }, 500);
}

/* ====== เตรียมแต่ละ Scene เมื่อเข้ามา ====== */
function onEnter(i) {
  if (i === 2) renderPreview();
  if (i === 3) { $('preview2').innerHTML = krathongSVG(false); $('lightBtn').disabled = false; $('candleText').innerHTML = 'กระทงของเธอพร้อมแล้ว<br>ลองจุดเทียนดูนะ'; }
  if (i === 4) { $('floater').innerHTML = krathongSVG(true); $('releaseBtn').disabled = false; $('wishToast').classList.remove('show'); }
  if (i === 5) {                      // Scene คำอธิษฐาน: กลับมาที่โหมดเขียน (ข้อความเดิมยังอยู่)
    setWishMode('edit');
    ['saveWish','keepWish','confirmWish','editWish'].forEach(id => { $(id).disabled = false; });
    document.querySelector('.wish-card').classList.remove('sending');
  }
  if (i === 6) {                      // Scene จดหมาย: มีคำอธิษฐานให้แสดงการ์ดก่อน ไม่มีก็แสดงซองเลย
    const has = state.wish !== '';
    $('finalText').textContent = state.wish;   // textContent กันโค้ดแปลกปลอม
    $('wishFinal').hidden = !has;
    $('envelope').hidden = has; $('envHint').hidden = has;
    $('envelope').classList.remove('open'); $('replayBtn').hidden = has;
  }
}
const renderPreview = () => { $('preview1').innerHTML = krathongSVG(false); };

/* ====== ปุ่มเลือก (กระทง / ดอกไม้ / สีเทียน) ====== */
function buildChoices(boxId, list, key, isSwatch) {
  const box = $(boxId);
  list.forEach(item => {
    const b = document.createElement('button');
    b.className = 'chip' + (isSwatch ? ' swatch' : '');
    b.textContent = isSwatch ? '' : item.name;
    if (isSwatch) { b.style.background = item.id; b.setAttribute('aria-label', item.name); }
    b.onclick = () => {
      choice[key] = item.id;
      box.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', c === b));
      renderPreview();
    };
    b.setAttribute('aria-pressed', choice[key] === item.id);
    box.appendChild(b);
  });
}

/* ====== เริ่มต้น ====== */
document.querySelectorAll('[data-bear]').forEach(el => { el.outerHTML = BEAR_SVG; });
const starBox = $('stars');
for (let i = 0; i < 45; i++) {      // สร้างดาวสุ่มตำแหน่ง
  const s = document.createElement('i'); s.className = 'star';
  s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:${Math.random()*3}s`;
  starBox.appendChild(s);
}
buildChoices('chooseBase', BASES, 'base');
buildChoices('chooseFlower', FLOWERS, 'flower');
buildChoices('chooseCandle', CANDLES, 'candle', true);

document.querySelectorAll('[data-go]').forEach(b => b.onclick = () => goTo(+b.dataset.go));

// Scene 1: เปิดกล่องของขวัญ
$('openGift').onclick = e => {
  e.currentTarget.disabled = true; $('gift').classList.add('open');
  setTimeout(() => goTo(1), 1200);
};
// Scene 4: จุดเทียน
$('lightBtn').onclick = e => {
  e.currentTarget.disabled = true;
  $('preview2').innerHTML = krathongSVG(true);
  $('candleText').innerHTML = 'อบอุ่นจัง ✨<br>แสงเล็ก ๆ ที่พร้อมเดินทางแล้ว';
  setTimeout(() => goTo(4), 2200);
};
// Scene 5: ปล่อยคำอธิษฐาน
$('releaseBtn').onclick = e => {
  e.currentTarget.disabled = true;
  const t = $('wishToast'); t.innerHTML = 'ขอให้คำอธิษฐานของเธอ<br>ลอยไปถึงดวงจันทร์ 🌙'; t.classList.add('show');
  setTimeout(() => goTo(5), 2800);
};
// Scene 6: เปิดซอง / เล่นใหม่
$('envelope').onclick = () => {
  $('envelope').classList.add('open'); $('envHint').hidden = true;
  setTimeout(() => { $('replayBtn').hidden = false; }, 1600);
};
$('replayBtn').onclick = () => {
  state.wish = ''; $('wishInput').value = ''; $('wishCount').textContent = '0';
  $('gift').classList.remove('open'); $('openGift').disabled = false;
  goTo(0);
};

/* ====== My Little Wish ====== */
function setWishMode(mode) {          // 'edit' = เขียน, 'preview' = ดูก่อนยืนยัน
  const preview = mode === 'preview';
  $('wishEdit').hidden = preview; $('actEdit').hidden = preview;
  $('wishPreview').hidden = !preview; $('actPreview').hidden = !preview;
}
function sendWishAndContinue(btnIds) {
  btnIds.forEach(id => { $(id).disabled = true; });       // กันกดซ้ำ
  document.querySelector('.wish-card').classList.add('sending');
  setTimeout(() => goTo(6), 700);
}
$('wishInput').addEventListener('input', e => { $('wishCount').textContent = e.target.value.length; });
$('saveWish').onclick = () => {
  const text = $('wishInput').value.trim();
  if (!text) { state.wish = ''; sendWishAndContinue(['saveWish','keepWish']); return; }  // ไม่ได้เขียน = ข้ามไปได้เลย
  $('wishPreviewText').textContent = text;
  setWishMode('preview');
};
$('editWish').onclick = () => setWishMode('edit');
$('confirmWish').onclick = () => { state.wish = $('wishInput').value.trim(); sendWishAndContinue(['confirmWish','editWish']); };
$('keepWish').onclick = () => { state.wish = ''; sendWishAndContinue(['saveWish','keepWish']); };
$('toLetter').onclick = () => { $('wishFinal').hidden = true; $('envelope').hidden = false; $('envHint').hidden = false; };
