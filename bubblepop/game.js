'use strict';
/* Bubble Pop for Toddlers — © AugustInnovations LLC */
const $ = s => document.querySelector(s), TAU = Math.PI * 2;
const canvas = $('#c'), ctx = canvas.getContext('2d');
const COLORS = [
  { n: 'red', c: '#ff5c5c' }, { n: 'orange', c: '#ff9f43' }, { n: 'yellow', c: '#ffe14d' }, { n: 'green', c: '#5ad66f' },
  { n: 'blue', c: '#4d8cff' }, { n: 'purple', c: '#b36bff' }, { n: 'pink', c: '#ff7ad9' },
];
const ANIMALS = [['🐥', 'chick'], ['🐶', 'dog'], ['🐱', 'cat'], ['🐸', 'frog'], ['🐷', 'pig'], ['🐮', 'cow'], ['🦁', 'lion'], ['🐵', 'monkey'], ['🐰', 'bunny'], ['🐢', 'turtle'], ['🦋', 'butterfly'], ['🐟', 'fish'], ['🦆', 'duck'], ['🐘', 'elephant']];
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');

const SAVE = 'bubblepop.v1';
let opt = { sound: true, speak: true, size: 1, speed: 1, lock: false, mode: 'free', total: 0 };
try { Object.assign(opt, JSON.parse(localStorage.getItem(SAVE)) || {}); } catch (e) { }
const save = () => { try { localStorage.setItem(SAVE, JSON.stringify(opt)); } catch (e) { } };

/* ---- audio ---- */
const Sfx = {
  ctx: null, init() { if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; } try { const AC = window.AudioContext || window.webkitAudioContext; this.ctx = new AC(); } catch (e) { } },
  pop(size) {
    if (!opt.sound || !this.ctx || this.ctx.state !== 'running') return;
    const c = this.ctx, t = c.currentTime, o = c.createOscillator(), g = c.createGain(), f = 900 - size * 5 + Math.random() * 200;
    o.type = 'sine'; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 0.4, t + 0.12);
    g.gain.setValueAtTime(0.25, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + 0.16);
  },
  chime() {
    if (!opt.sound || !this.ctx || this.ctx.state !== 'running') return;
    const c = this.ctx; [523, 659, 784, 1046].forEach((f, i) => { const t = c.currentTime + i * 0.09, o = c.createOscillator(), g = c.createGain(); o.type = 'triangle'; o.frequency.value = f; g.gain.setValueAtTime(0.18, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.4); o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + 0.42); });
  },
  say(txt) {
    if (!opt.speak || !('speechSynthesis' in window)) return;
    try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(txt); u.rate = 0.9; u.pitch = 1.1; u.lang = 'en-US'; speechSynthesis.speak(u); } catch (e) { }
  },
};

/* ---- state ---- */
let W = 0, H = 0, dpr = 1, bubbles = [], parts = [], texts = [], lastT = 0, spawnT = 0, count = 0, streak = 0, target = null, paused = false, blobs = [];
function resize() { dpr = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight; canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
addEventListener('resize', resize); resize();
for (let i = 0; i < 6; i++) blobs.push({ x: Math.random(), y: Math.random(), r: 0.25 + Math.random() * 0.3, s: 0.01 + Math.random() * 0.02 });

function content(mode) {
  if (mode === 'animals') { const a = ANIMALS[Math.random() * ANIMALS.length | 0]; return { emoji: a[0], name: a[1] }; }
  if (mode === 'letters') { const l = LETTERS[Math.random() * LETTERS.length | 0]; return { text: l, name: l }; }
  return {};
}
function spawn() {
  const base = Math.min(W, H) * 0.11 * opt.size, r = base * (0.75 + Math.random() * 0.7);
  const col = (opt.mode === 'colors' && target && Math.random() < 0.45) ? target : COLORS[Math.random() * COLORS.length | 0];
  bubbles.push(Object.assign({ x: r + Math.random() * (W - 2 * r), y: H + r, r, col, vy: H * (0.10 + Math.random() * 0.08) * opt.speed * (base / r) ** 0.4, wob: Math.random() * TAU, ws: 1 + Math.random(), born: 0, popped: false }, content(opt.mode)));
}
function pickTarget() { let t; do { t = COLORS[Math.random() * COLORS.length | 0]; } while (t === target); target = t; const el = $('#target'); el.innerHTML = `<span>Pop</span><i style="background:${t.c}"></i><span>${t.n}</span>`; el.hidden = false; Sfx.say('Pop ' + t.n); }

function pop(b, x, y) {
  b.popped = true; count++; opt.total++; if (opt.total % 25 === 0) save();
  const n = 10 + (b.r / 8 | 0);
  for (let i = 0; i < n; i++) { const a = Math.random() * TAU, s = 80 + Math.random() * 220; parts.push({ x: b.x, y: b.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 60, life: 0.6 + Math.random() * 0.4, max: 1, r: 3 + Math.random() * 6, c: b.col.c }); }
  parts.push({ x: b.x, y: b.y, ring: true, r: b.r, life: 0.3, max: 0.3, c: '#fff' });
  Sfx.pop(b.r);
  if (b.name) { texts.push({ x: b.x, y: b.y, t: b.emoji || b.text, life: 1.1, big: true }); Sfx.say(b.name); }
  else if (opt.mode === 'colors') { Sfx.say(b.col.n); }
  else if (navigator.vibrate) { try { navigator.vibrate(8); } catch (e) { } }
  if (opt.mode === 'colors') { if (b.col === target) { streak++; if (streak >= 5) { streak = 0; celebrate(); pickTarget(); } } }
  else if (count % 20 === 0) celebrate();
  $('#count').textContent = count;
}
function celebrate() {
  Sfx.chime();
  for (let i = 0; i < 90; i++) { const a = -Math.PI / 2 + (Math.random() - .5) * 1.6, s = 300 + Math.random() * 400; parts.push({ x: W / 2, y: H + 10, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1.4 + Math.random() * .6, max: 2, r: 4 + Math.random() * 6, c: COLORS[i % COLORS.length].c, conf: true, rot: Math.random() * TAU }); }
  texts.push({ x: W / 2, y: H * 0.4, t: ['⭐', '🌟', '🎉', '👏'][Math.random() * 4 | 0], life: 1.5, big: true, huge: true });
}

/* ---- loop ---- */
function tick(now) {
  requestAnimationFrame(tick);
  const dt = Math.min(0.05, (now - lastT) / 1000 || 0); lastT = now;
  if (paused) { draw(); return; }
  const want = Math.round(6 + (W * H) / 90000 / opt.size);
  spawnT -= dt; if (spawnT <= 0 && bubbles.length < want) { spawn(); spawnT = 0.45 / opt.speed; }
  for (const b of bubbles) { b.born += dt; b.wob += dt * b.ws; b.y -= b.vy * dt; b.x += Math.sin(b.wob) * 18 * dt; if (b.y < -b.r * 1.5) b.popped = true; }
  bubbles = bubbles.filter(b => !b.popped);
  for (const p of parts) { p.life -= dt; if (!p.ring) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += (p.conf ? 500 : 300) * dt; p.vx *= 0.98; if (p.rot !== undefined) p.rot += dt * 6; } }
  parts = parts.filter(p => p.life > 0);
  for (const t of texts) { t.life -= dt; t.y -= 40 * dt; } texts = texts.filter(t => t.life > 0);
  for (const bl of blobs) { bl.y -= bl.s * dt; if (bl.y < -bl.r) bl.y = 1 + bl.r; }
  draw();
}
function draw() {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#7fd6ff'); g.addColorStop(1, '#2f9be0'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(255,255,255,0.08)'; for (const bl of blobs) { ctx.beginPath(); ctx.arc(bl.x * W, bl.y * H, bl.r * Math.min(W, H), 0, TAU); ctx.fill(); }
  // sea floor hint
  ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, H - 18 - Math.sin(x / 40 + lastT / 900) * 8); ctx.lineTo(W, H); ctx.fill();
  for (const b of bubbles) {
    const sc = Math.min(1, b.born * 4), r = b.r * (0.9 + 0.1 * sc) * (1 + Math.sin(b.wob * 1.5) * 0.03);
    ctx.save(); ctx.translate(b.x, b.y); ctx.scale(sc, sc);
    ctx.fillStyle = b.col.c; ctx.globalAlpha = 0.85; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = Math.max(3, r * 0.08); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.beginPath(); ctx.ellipse(-r * 0.35, -r * 0.4, r * 0.22, r * 0.14, -0.7, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(r * 0.3, r * 0.45, r * 0.07, 0, TAU); ctx.fill();
    if (b.emoji || b.text) { ctx.font = `bold ${r * 1.05}px system-ui, "Apple Color Emoji", "Segoe UI Emoji", sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; if (b.text) { ctx.fillStyle = '#fff'; ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = r * 0.1; ctx.strokeText(b.text, 0, r * 0.05); } ctx.fillStyle = '#fff'; ctx.fillText(b.emoji || b.text, 0, r * 0.05); }
    ctx.restore();
  }
  for (const p of parts) {
    const a = Math.max(0, p.life / p.max); ctx.globalAlpha = a;
    if (p.ring) { ctx.strokeStyle = p.c; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (1.6 - a * 0.6), 0, TAU); ctx.stroke(); }
    else if (p.conf) { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c; ctx.fillRect(-p.r, -p.r * 0.5, p.r * 2, p.r); ctx.restore(); }
    else { ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * a, 0, TAU); ctx.fill(); }
  }
  ctx.globalAlpha = 1;
  for (const t of texts) { ctx.globalAlpha = Math.min(1, t.life); ctx.font = `bold ${t.huge ? Math.min(W, H) * 0.3 : 56}px system-ui, "Apple Color Emoji", "Segoe UI Emoji", sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff'; ctx.fillText(t.t, t.x, t.y); }
  ctx.globalAlpha = 1;
}

/* ---- input (multi-touch) ---- */
canvas.addEventListener('pointerdown', e => {
  Sfx.init(); const x = e.clientX, y = e.clientY; let hit = null;
  for (let i = bubbles.length - 1; i >= 0; i--) { const b = bubbles[i]; if (!b.popped && Math.hypot(b.x - x, b.y - y) <= b.r * 1.15 + 14) { hit = b; break; } }
  if (hit) pop(hit, x, y);
  else { parts.push({ x, y, ring: true, r: 10, life: 0.25, max: 0.25, c: 'rgba(255,255,255,.8)' }); }
});
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dblclick', e => e.preventDefault());

/* ---- modes ---- */
function setMode(m) {
  opt.mode = m; save(); for (const b of document.querySelectorAll('.mode')) b.classList.toggle('on', b.dataset.mode === m);
  bubbles = []; streak = 0; if (m === 'colors') pickTarget(); else { target = null; $('#target').hidden = true; }
  Sfx.init();
}
$('#modes').addEventListener('click', e => { const b = e.target.closest('.mode'); if (b) setMode(b.dataset.mode); });

/* ---- parent gate: hold 2.5s ---- */
let holdT = 0, holdRaf = 0, holdStart = 0;
const gate = $('#gate'), bar = $('#gate .bar i');
function holdTick() { const p = Math.min(1, (performance.now() - holdStart) / 2500); bar.style.width = p * 100 + '%'; if (p >= 1) { endHold(); openParent(); } else holdRaf = requestAnimationFrame(holdTick); }
function startHold(e) { e.preventDefault(); holdStart = performance.now(); gate.hidden = false; bar.style.width = '0%'; cancelAnimationFrame(holdRaf); holdRaf = requestAnimationFrame(holdTick); }
function endHold() { cancelAnimationFrame(holdRaf); gate.hidden = true; }
const pb = $('#btn-parent');
pb.addEventListener('pointerdown', startHold); pb.addEventListener('pointerup', endHold); pb.addEventListener('pointercancel', endHold); pb.addEventListener('pointerleave', endHold);
function openParent() {
  paused = true; $('#parent').hidden = false;
  $('#opt-sound').checked = opt.sound; $('#opt-speak').checked = opt.speak; $('#opt-size').value = opt.size; $('#opt-speed').value = opt.speed; $('#opt-lock').checked = opt.lock;
  try { history.pushState({ p: 1 }, ''); } catch (e) { }
}
function closeParent() { paused = false; $('#parent').hidden = true; applyLock(); }
$('#btn-close').addEventListener('click', () => { if (history.state && history.state.p) history.back(); else closeParent(); });
addEventListener('popstate', () => { if (!$('#parent').hidden) closeParent(); });
$('#parent').addEventListener('change', () => { opt.sound = $('#opt-sound').checked; opt.speak = $('#opt-speak').checked; opt.size = +$('#opt-size').value; opt.speed = +$('#opt-speed').value; opt.lock = $('#opt-lock').checked; save(); });
function applyLock() { $('#modes').hidden = opt.lock; }
document.addEventListener('visibilitychange', () => { if (document.hidden) { try { speechSynthesis.cancel(); } catch (e) { } } });

/* ---- boot ---- */
applyLock(); setMode(opt.mode || 'free'); lastT = performance.now(); requestAnimationFrame(tick);
if ('serviceWorker' in navigator && location.protocol === 'https:') addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => { }));
window.__bubblepop = { get bubbles() { return bubbles; }, pop, setMode, spawn, get count() { return count; }, opt };
