'use strict';
/* ====== กระทง 3 แบบ (สี กลีบ ดอกไม้ และเทียนของแต่ละแบบ) ====== */
const THEMES = {
  pink:  {name:'Pink Blossom',   p:['#fff0f5','#ffc0d6','#ff93bb'], line:'#ff7fae', trim:'#ff7fae', fl:['#ffffff','#ffd3e3','#ffffff','#ffd3e3','#ffffff'], candle:'#ffe9f1'},
  moon:  {name:'Moonlight',      p:['#fffef8','#fff1d0','#f1d79a'], line:'#e2c27a', trim:'#e8b94f', fl:['#ffffff','#fffbe9','#ffffff','#fffbe9','#ffffff'], candle:'#fff8e1'},
  lav:   {name:'Lavender Dream', p:['#f4edff','#d3bff5','#a98be0'], line:'#977ad6', trim:'#8f6fd8', fl:['#ffd3e3','#cfe6ff','#ffe9a8','#cfe6ff','#ffd3e3'], candle:'#efe6ff'}
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

/* ====== SVG: กระทงไทยมุมมอง 3/4 ======
   โครงสร้าง: ฐานหยวกกล้วย -> ใบตองพับเป็นกลีบแหลม 2 ชั้น -> ดอกบัว -> เทียน + ธูป -> ดอกมะลิประดับ
   3 แบบใช้โครงเดียวกัน ต่างกันที่สีกลีบบัว สีดอกไม้ และสีขอบประดับ */
let svgCount = 0;                     // ทำให้ id ของ gradient ไม่ซ้ำกันเมื่อมีหลายภาพในหน้าเดียว
function krathongSVG(lit, theme = choice.theme, ripple = true) {
  const t = THEMES[theme], id = 'k' + (svgCount++), f = n => n.toFixed(1);
  const petal = 'M0 0C-20 -14 -20 -52 0 -70C20 -52 20 -14 0 0Z';
  const row = (angles, scale, fill) => angles.map(a =>
    `<path d="${petal}" transform="translate(120 118) rotate(${a}) scale(${scale})" fill="${fill}" stroke="${t.line}" stroke-width="${(.9 / scale).toFixed(2)}"/>`).join('');
  // ใบตองพับเป็นกลีบแหลมเรียงรอบฐานวงรี (ครึ่งหลังวาดก่อน ครึ่งหน้าวาดทีหลัง)
  const pleats = (cy, R, r, h, hw, n, c1, c2, front, dots) => {
    const list = [];
    for (let i = 0; i < n; i++) { const th = (i + .5) / n * Math.PI * 2; if ((Math.sin(th) > 0) === front) list.push(th); }
    list.sort((a, b) => Math.abs(Math.cos(b)) - Math.abs(Math.cos(a)));      // ด้านข้างก่อน ตรงกลางทีหลัง
    return list.map(th => {
      const s = Math.sin(th), x = 120 + R * Math.cos(th), y = cy + r * s, w = hw * (.55 + .45 * Math.abs(s)), tx = x + .07 * R * Math.cos(th), ty = y - h;
      return `<path d="M${f(x-w)} ${f(y)}L${f(tx)} ${f(ty)}L${f(x)} ${f(y+3)}Z" fill="${c1}" stroke="rgba(70,130,100,.4)" stroke-width=".5"/><path d="M${f(x)} ${f(y+3)}L${f(tx)} ${f(ty)}L${f(x+w)} ${f(y)}Z" fill="${c2}" stroke="rgba(70,130,100,.4)" stroke-width=".5"/>` +
        (dots ? `<circle cx="${f(tx)}" cy="${f(ty)}" r="1.6" fill="${t.trim}"/>` : '');
    }).join('');
  };
  const flower = (x, y, c) => [0,72,144,216,288].map(a =>
    `<ellipse cx="${x}" cy="${y-6}" rx="5" ry="8" fill="${c}" stroke="rgba(0,0,0,.12)" stroke-width=".5" transform="rotate(${a} ${x} ${y})"/>`).join('') + `<circle cx="${x}" cy="${y}" r="3.2" fill="#f6c96b"/>`;
  const grad = (n, c1, c2, h) => `<linearGradient id="${id}${n}" x1="0" y1="0" x2="${h ? 1 : 0}" y2="${h ? 0 : 1}"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>`;
  const spots = [[62,158],[96,168],[144,168],[178,158],[120,173]];
  const ember = (x, y) => `<circle cx="${x}" cy="${y}" r="2.2" fill="#ff9b6a"/>` + (lit ? `<circle class="glow" cx="${x}" cy="${y}" r="7" fill="#ffb27a" opacity=".45"/>` : '');
  return `<svg viewBox="0 0 240 200" aria-label="กระทง ${t.name}"><defs>
    ${grad('b', t.p[1], t.p[2])}${grad('m', t.p[0], t.p[1])}${grad('f', t.p[0], t.p[1])}${grad('t', '#f6f0cd', '#d8d0a4', true)}${grad('c', t.candle, '#d8c2bd', true)}
    <radialGradient id="${id}g"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".8"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient></defs>
    ${ripple ? '<ellipse cx="120" cy="184" rx="100" ry="9" fill="rgba(20,15,60,.35)"/>' : ''}
    ${lit ? `<circle class="glow" cx="120" cy="64" r="100" fill="url(#${id}g)"/>` : ''}
    <path d="M28 150v14a92 20 0 0 0 184 0v-14z" fill="url(#${id}t)"/><ellipse cx="120" cy="150" rx="92" ry="20" fill="#f8f3d6"/>
    <ellipse cx="120" cy="150" rx="70" ry="15" fill="none" stroke="#e6dcb0" stroke-width=".8"/><ellipse cx="120" cy="150" rx="46" ry="10" fill="none" stroke="#e6dcb0" stroke-width=".8"/>
    <ellipse cx="120" cy="150" rx="92" ry="20" fill="none" stroke="${t.trim}" stroke-width="1.6" stroke-dasharray="5 4" opacity=".85"/>
    ${ripple ? '<ellipse class="ring" cx="120" cy="182" rx="112" ry="11" fill="none" stroke="rgba(255,255,255,.45)"/><ellipse class="ring r2" cx="120" cy="184" rx="90" ry="8" fill="none" stroke="rgba(255,255,255,.35)"/>' : ''}
    ${pleats(138, 92, 20, 30, 16, 24, '#c9ecb8', '#8fcb9d', false, false)}${pleats(126, 60, 13, 28, 13, 18, '#dff5c8', '#a9d9a9', false, false)}
    <path d="M104 110L88 46M138 110L154 42" stroke="#8a5a3a" stroke-width="2" stroke-linecap="round"/>${ember(88, 46)}${ember(154, 42)}
    ${row([-72,-48,-24,0,24,48,72], .85, `url(#${id}b)`)}${row([-56,-28,0,28,56], .7, `url(#${id}m)`)}
    <rect x="112" y="44" width="16" height="70" fill="url(#${id}c)"/><ellipse cx="120" cy="44" rx="8" ry="2.6" fill="#fff" opacity=".8"/><rect x="115" y="46" width="3" height="66" fill="#fff" opacity=".4"/><path d="M120 44v-8" stroke="#6b4a3a" stroke-width="1.6" stroke-linecap="round"/>
    ${lit ? '<g transform="translate(0 -28)"><g class="lit-in"><g class="flame"><path d="M120 36c10 14 10 24 0 28-10-4-10-14 0-28z" fill="#ffd36e"/><path d="M120 46c5 7 5 12 0 14-5-2-5-7 0-14z" fill="#fff6d6"/></g></g></g>' : ''}
    ${row([-36,-12,12,36], .55, `url(#${id}f)`)}
    ${pleats(126, 60, 13, 28, 13, 18, '#dff5c8', '#a9d9a9', true, false)}${pleats(138, 92, 20, 30, 16, 24, '#c9ecb8', '#8fcb9d', true, true)}
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
  if (i === 4) resetRiver();
  if (i === 5) {                      // Scene คำอธิษฐาน (กล้องที่เงยขึ้นหาพระจันทร์ค่อย ๆ กลับลงมา)
    setCam(null); riverScene.classList.remove('sky');   // กลับมาที่โหมดเขียน (ข้อความเดิมยังอยู่)
    setWishMode('edit');
    ['saveWish','keepWish','confirmWish','editWish'].forEach(id => { $(id).disabled = false; });
    document.querySelector('.wish-card').classList.remove('sending');
  }
  if (i === 6) {                      // Scene จดหมาย: มีคำอธิษฐานให้แสดงการ์ดก่อน ไม่มีก็แสดงซองเลย
    const has = state.wish !== '';
    $('finalText').textContent = state.wish;   // textContent กันโค้ดแปลกปลอม
    $('wishFinal').hidden = !has;
    $('envelope').hidden = has; $('envHint').hidden = has;
    $('envelope').classList.remove('open'); $('replayBtn').hidden = true; $('letterSheet').hidden = true; $('scrollHint').hidden = true;
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
// Scene 6: เปิดซอง / เล่นใหม่
$('envelope').onclick = () => {
  if ($('envelope').classList.contains('open')) return;          // กันกดซ้ำ
  $('envelope').classList.add('open'); $('envHint').hidden = true;
  setTimeout(() => {                                             // ซองเปิดเสร็จ -> แสดงจดหมายฉบับเต็มให้อ่าน
    $('envelope').hidden = true; $('letterSheet').hidden = false; $('letterSheet').scrollTop = 0; $('scrollHint').hidden = false;
    setTimeout(() => { $('replayBtn').hidden = false; }, 900);
  }, 2000);
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

$('letterSheet').addEventListener('scroll', () => { $('scrollHint').hidden = true; }, {passive: true});   // อ่านเลื่อนแล้วไม่ต้องบอกใบ้อีก

/* ====== Scene 5: ระบบปล่อยกระทง (ลำดับเหตุการณ์ควบคุมด้วย class บน Scene + กล้องที่ body) ======
   touch   = กระทงลดระดับลงแตะน้ำ + กล้องซูมเข้า
   ripple  = เกิดวงคลื่นและเงาเทียนบนน้ำ
   afloat  = กระทงลอยตัว โยกตามคลื่น
   away    = ลอยห่างออกไป (เล็กลงตามระยะ) กล้องตามไป
   sky     = กล้องเงยขึ้นหาพระจันทร์ แล้วเข้าสู่ My Little Wish */
const riverScene = scenes[4];
let riverTimers = [];
const CAMS = ['cam-in', 'cam-follow', 'cam-sky'];
function setCam(name) { document.body.classList.remove(...CAMS); if (name) document.body.classList.add(name); }
function setRiverText(html) {
  const el = $('riverText'); el.innerHTML = html;
  el.classList.remove('fadein'); void el.offsetWidth; el.classList.add('fadein');
}
function resetRiver() {
  riverTimers.forEach(clearTimeout); riverTimers = [];
  riverScene.classList.remove('touch', 'ripple', 'afloat', 'away', 'sky'); setCam(null);
  $('kBob').innerHTML = krathongSVG(true, choice.theme, false);
  $('riverText').innerHTML = 'ค่อย ๆ วางกระทงลงบนผิวน้ำ<br>แล้วให้คำอธิษฐานของเธอลอยไปพร้อมกับสายน้ำ ♡';
  $('wishToast').classList.remove('show'); $('releaseBtn').disabled = false;
}
$('releaseBtn').onclick = () => {
  if ($('releaseBtn').disabled) return;                         // กันกดซ้ำ
  $('releaseBtn').disabled = true;
  const k = matchMedia('(prefers-reduced-motion: reduce)').matches ? .25 : 1;   // ลดการเคลื่อนไหว = ย่นเวลา
  const at = (ms, fn) => riverTimers.push(setTimeout(fn, ms * k));
  riverScene.classList.add('touch'); setCam('cam-in'); setRiverText('ค่อย ๆ วางลง… เบา ๆ นะ');
  at(2600,  () => { riverScene.classList.add('ripple'); setRiverText('วงคลื่นแรกเกิดขึ้นแล้ว'); });
  at(3400,  () => { riverScene.classList.add('afloat'); setRiverText('กระทงของเธอเริ่มลอยแล้ว…'); });
  at(5400,  () => { riverScene.classList.add('away'); setCam('cam-follow'); setRiverText('ลอยไปไกล ๆ นะ'); });
  at(10200, () => {
    riverScene.classList.add('sky'); setCam('cam-sky');
    setRiverText('ขอให้คำอธิษฐานของเธอ<br>ลอยไปถึงดวงจันทร์ 🌙');
  });
  at(14000, () => goTo(5));
};
