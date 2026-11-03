'use strict';
/* ====== กระทง 3 แบบ (สี กลีบ ดอกไม้ และเทียนของแต่ละแบบ) ====== */
const THEMES = {
  pink:  {name:'Pink Blossom',   p:['#fff0f5','#ffc0d6','#ff93bb'], line:'#ff7fae', fl:['#ffffff','#ffd3e3','#ffffff','#ffd3e3','#ffffff'], candle:'#ffe9f1'},
  moon:  {name:'Moonlight',      p:['#fffef8','#fff1d0','#f1d79a'], line:'#e2c27a', fl:['#ffffff','#fffbe9','#ffffff','#fffbe9','#ffffff'], candle:'#fff8e1'},
  lav:   {name:'Lavender Dream', p:['#f4edff','#d3bff5','#a98be0'], line:'#977ad6', fl:['#ffd3e3','#cfe6ff','#ffe9a8','#cfe6ff','#ffd3e3'], candle:'#efe6ff'}
};
/* State: เก็บคำอธิษฐานไว้ในหน่วยความจำของหน้าเว็บเท่านั้น (ไม่ส่งไปที่ไหน) */
const state = {wish: ''};
const choice = {theme: 'pink'};

/* ====== SVG: น้องหมี ====== */
const BEAR_SVG = `<svg class="bear" viewBox="0 0 120 130" aria-hidden="true">
<circle cx="28" cy="26" r="16" fill="#e7b98f"/><circle cx="92" cy="26" r="16" fill="#e7b98f"/>
<circle cx="28" cy="26" r="8" fill="#ffc2d6"/><circle cx="92" cy="26" r="8" fill="#ffc2d6"/>
<ellipse cx="60" cy="100" rx="34" ry="28" fill="#e7b98f"/><ellipse cx="60" cy="104" rx="20" ry="18" fill="#fff3e0"/>
<circle cx="60" cy="52" r="38" fill="#f0c9a3"/><ellipse cx="60" cy="64" rx="17" ry="13" fill="#fff3e0"/>
<g class="eyes"><circle cx="46" cy="48" r="4" fill="#1c2352"/><circle cx="74" cy="48" r="4" fill="#1c2352"/></g>
<ellipse cx="60" cy="60" rx="5" ry="3.5" fill="#1c2352"/><path d="M52 68q8 7 16 0" stroke="#1c2352" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<circle cx="36" cy="62" r="6" fill="#ffb3cf" opacity=".7"/><circle cx="84" cy="62" r="6" fill="#ffb3cf" opacity=".7"/></svg>`;

/* ====== SVG: ท่าน้ำ และใบบัว ====== */
const PIER_SVG = `<svg class="pier" viewBox="0 0 300 80" aria-hidden="true">
<g fill="#6d4a2a"><rect x="26" y="22" width="14" height="52" rx="4"/><rect x="143" y="22" width="14" height="52" rx="4"/><rect x="260" y="22" width="14" height="52" rx="4"/></g>
<g fill="none" stroke="rgba(255,255,255,.4)"><ellipse cx="33" cy="74" rx="17" ry="4"/><ellipse cx="150" cy="74" rx="17" ry="4"/><ellipse cx="267" cy="74" rx="17" ry="4"/></g>
<rect width="300" height="16" rx="6" fill="#e0b078"/><rect y="16" width="300" height="9" rx="3" fill="#8a5d34"/>
<path d="M50 0v16M100 0v16M150 0v16M200 0v16M250 0v16" stroke="#a8743f" stroke-width="1.5"/></svg>`;
const PADS_SVG = `<svg viewBox="0 0 160 70" aria-hidden="true"><ellipse cx="40" cy="56" rx="34" ry="9" fill="#5fa37f"/><ellipse cx="38" cy="54" rx="26" ry="6" fill="#79bf97"/>
<ellipse cx="116" cy="60" rx="27" ry="7" fill="#5fa37f"/><g transform="translate(80 54)" fill="#ffd3e3" stroke="#ff93bb" stroke-width=".8">
<path d="M0 0C-9-6-9-22 0-30 9-22 9-6 0 0Z" transform="rotate(-28) scale(.8)"/><path d="M0 0C-9-6-9-22 0-30 9-22 9-6 0 0Z" transform="rotate(28) scale(.8)"/><path d="M0 0C-9-6-9-22 0-30 9-22 9-6 0 0Z"/></g></svg>`;

/* ====== SVG: กระทงดอกบัวซ้อนกลีบ (theme = pink/moon/lav, lit = จุดเทียนแล้ว) ====== */
let svgCount = 0;                     // ทำให้ id ของ gradient ไม่ซ้ำกันเมื่อมีหลายภาพในหน้าเดียว
function krathongSVG(lit, theme = choice.theme, ripple = true) {
  const t = THEMES[theme], id = 'k' + (svgCount++);
  const petal = 'M0 0C-20 -14 -20 -52 0 -70C20 -52 20 -14 0 0Z';
  const row = (angles, scale, fill) => angles.map(a =>
    `<path d="${petal}" transform="translate(120 142) rotate(${a}) scale(${scale})" fill="${fill}" stroke="${t.line}" stroke-width=".9"/>`).join('');
  const flower = (x, y, c) => [0,72,144,216,288].map(a =>
    `<ellipse cx="${x}" cy="${y-6}" rx="4.5" ry="7" fill="${c}" stroke="rgba(0,0,0,.1)" stroke-width=".5" transform="rotate(${a} ${x} ${y})"/>`).join('') + `<circle cx="${x}" cy="${y}" r="3" fill="#f6c96b"/>`;
  const grad = (n, c1, c2) => `<linearGradient id="${id}${n}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>`;
  const spots = [[56,150],[90,160],[150,160],[184,150],[120,164]];
  return `<svg viewBox="0 0 240 190" aria-label="กระทง ${t.name}"><defs>
    ${grad('b', t.p[1], t.p[2])}${grad('m', t.p[0], t.p[1])}${grad('f', t.p[0], t.p[1])}${grad('l', '#a9dcae', '#6db08c')}
    <linearGradient id="${id}c" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${t.candle}"/><stop offset="1" stop-color="#d8c2bd"/></linearGradient>
    <radialGradient id="${id}g"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".8"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient></defs>
    ${ripple ? '<ellipse cx="120" cy="170" rx="100" ry="10" fill="rgba(20,15,60,.35)"/><ellipse class="ring" cx="120" cy="174" rx="116" ry="11" fill="none" stroke="rgba(255,255,255,.45)"/><ellipse class="ring r2" cx="120" cy="176" rx="92" ry="8" fill="none" stroke="rgba(255,255,255,.35)"/>' : ''}
    ${lit ? `<circle class="glow" cx="120" cy="90" r="100" fill="url(#${id}g)"/>` : ''}
    <ellipse cx="120" cy="150" rx="104" ry="26" fill="url(#${id}l)"/><ellipse cx="120" cy="146" rx="96" ry="22" fill="none" stroke="#d3efcf" stroke-width="3" stroke-dasharray="10 8"/>
    ${row([-72,-48,-24,0,24,48,72], 1, `url(#${id}b)`)}${row([-56,-28,0,28,56], .86, `url(#${id}m)`)}
    <rect x="112" y="76" width="16" height="60" rx="4" fill="url(#${id}c)"/><rect x="115" y="78" width="3" height="54" rx="1.5" fill="#fff" opacity=".45"/><path d="M120 76v-8" stroke="#6b4a3a" stroke-width="1.6" stroke-linecap="round"/>
    ${lit ? '<g transform="translate(0 7)"><g class="lit-in"><g class="flame"><path d="M120 36c10 14 10 24 0 28-10-4-10-14 0-28z" fill="#ffd36e"/><path d="M120 46c5 7 5 12 0 14-5-2-5-7 0-14z" fill="#fff6d6"/></g></g></g>' : ''}
    ${row([-36,-12,12,36], .66, `url(#${id}f)`)}
    ${spots.map((s, i) => flower(s[0], s[1], t.fl[i])).join('')}</svg>`;
}

/* ====== ตัวช่วย ====== */
document.body.dataset.scene = 0;   // ใช้ให้ CSS ขยับกล้องฉากหลังตาม Scene
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
    current = next; document.body.dataset.scene = next; onEnter(next);
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
function renderPreview(animate) {
  const box = $('preview1');
  box.innerHTML = krathongSVG(false);
  $('krathongName').textContent = THEMES[choice.theme].name;
  if (animate) { box.classList.remove('swap'); void box.offsetWidth; box.classList.add('swap'); }   // เปลี่ยนแบบแล้วค่อย ๆ ลอยขึ้นมา
}

/* ====== ปุ่มเลือกกระทง 3 แบบ (แสดงเป็นรูปกระทงจิ๋ว) ====== */
function buildThemeChoices() {
  const box = $('chooseTheme');
  Object.keys(THEMES).forEach(key => {
    const b = document.createElement('button');
    b.className = 'theme-chip'; b.innerHTML = krathongSVG(false, key, false);
    b.setAttribute('aria-label', THEMES[key].name); b.setAttribute('aria-pressed', choice.theme === key);
    b.onclick = () => {
      choice.theme = key;
      box.querySelectorAll('.theme-chip').forEach(c => c.setAttribute('aria-pressed', c === b));
      renderPreview(true);
    };
    box.appendChild(b);
  });
}

/* ====== เริ่มต้น ====== */
document.querySelectorAll('[data-bear]').forEach(el => { el.outerHTML = BEAR_SVG; });
document.querySelectorAll('[data-pier]').forEach(el => { el.outerHTML = PIER_SVG; });
document.querySelectorAll('[data-pads]').forEach(el => { el.innerHTML = PADS_SVG; });
buildThemeChoices();
scenes.forEach(s => [...s.children].forEach((el, k) => el.style.setProperty('--i', k)));   // ลำดับการปรากฏของแต่ละชิ้น
const starBox = $('stars');
for (let i = 0; i < 45; i++) {      // สร้างดาวสุ่มตำแหน่ง
  const s = document.createElement('i'); s.className = 'star';
  s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:${Math.random()*3}s`;
  starBox.appendChild(s);
}

document.querySelectorAll('[data-go]').forEach(b => b.onclick = () => goTo(+b.dataset.go));

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
