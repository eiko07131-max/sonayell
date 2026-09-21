const pages = [
  { src: 'pages/01-cover.png', alt: '表紙：ハカセとこねことあなたのものがたり　ゆきとこおりのまちへ' },
  { src: 'pages/02-arrival.png', alt: 'ゆきとこおりのまちに到着した三人' },
  { src: 'pages/03-luru-pepe.png', alt: 'ルルとぺぺとの出会い' },
  { src: 'pages/04-snow-flower.png', alt: '雪の花とルルとぺぺ' },
  { src: 'pages/05-dinner.png', alt: 'ルルとぺぺのおうちでの食事' },
  { src: 'pages/06-map.png', alt: '地図を囲んで話すみんな' },
  { src: 'pages/07-waterway.png', alt: 'こわれた水路' },
  { src: 'pages/08-repair.png', alt: 'みんなで水路を修理する' },
  { src: 'pages/09-bloom.png', alt: '大輪の雪の花' },
  { src: 'pages/10-farewell.png', alt: '次の冒険へ出発するハカセたち' },
  { src: 'pages/11-back-cover.png', alt: '裏表紙' },
];

let current = 0;
let scale = 1;
let panX = 0;
let panY = 0;
let swipeStart = null;
let dragStart = null;
let pinchStart = null;
let usedPinch = false;
const pointers = new Map();
const image = document.querySelector('#page-image');
const backdrop = document.querySelector('#backdrop');
const reader = document.querySelector('#reader');
const previous = document.querySelector('#previous');
const next = document.querySelector('#next');
const counter = document.querySelector('#counter');
const hint = document.querySelector('.hint');
const fullscreen = document.querySelector('#fullscreen');

function setView() { image.style.setProperty('--zoom', scale); image.style.setProperty('--pan-x', `${panX}px`); image.style.setProperty('--pan-y', `${panY}px`); }
function resetView() { scale = 1; panX = 0; panY = 0; setView(); }
function update(page) {
  if (page < 0 || page >= pages.length || page === current) return;
  current = page;
  image.classList.add('changing');
  window.setTimeout(() => {
    resetView();
    image.src = pages[current].src;
    image.alt = pages[current].alt;
    backdrop.style.backgroundImage = `url("${pages[current].src}")`;
    previous.disabled = current === 0;
    next.disabled = current === pages.length - 1;
    counter.textContent = `${current + 1} / ${pages.length}`;
    image.classList.remove('changing');
  }, 120);
  hint.classList.add('hidden');
}
function go(delta) { update(current + delta); }
function distance() { const [a, b] = [...pointers.values()]; return Math.hypot(a.x - b.x, a.y - b.y); }

backdrop.style.backgroundImage = `url("${pages[current].src}")`;
previous.disabled = true;
previous.addEventListener('click', () => go(-1));
next.addEventListener('click', () => go(1));
window.addEventListener('keydown', (event) => { if (event.key === 'ArrowLeft') go(-1); if (event.key === 'ArrowRight') go(1); });
reader.addEventListener('pointerdown', (event) => {
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY }); reader.setPointerCapture(event.pointerId);
  if (pointers.size === 1) { swipeStart = { x: event.clientX, y: event.clientY }; dragStart = { x: event.clientX, y: event.clientY, panX, panY }; usedPinch = false; }
  else if (pointers.size === 2) { pinchStart = { distance: distance(), scale }; usedPinch = true; }
});
reader.addEventListener('pointermove', (event) => {
  if (!pointers.has(event.pointerId)) return;
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  if (pointers.size === 2 && pinchStart) { scale = Math.max(1, Math.min(3, pinchStart.scale * (distance() / pinchStart.distance))); if (scale === 1) { panX = 0; panY = 0; } setView(); }
  else if (pointers.size === 1 && dragStart && scale > 1.01) { panX = dragStart.panX + event.clientX - dragStart.x; panY = dragStart.panY + event.clientY - dragStart.y; setView(); }
});
function release(event) {
  const point = pointers.get(event.pointerId); pointers.delete(event.pointerId);
  if (pointers.size === 1) { const remaining = [...pointers.values()][0]; dragStart = { x: remaining.x, y: remaining.y, panX, panY }; pinchStart = null; }
  if (!pointers.size && point && swipeStart && scale <= 1.01 && !usedPinch) { const horizontal = point.x - swipeStart.x; const vertical = point.y - swipeStart.y; if (Math.abs(horizontal) > 48 && Math.abs(horizontal) > Math.abs(vertical)) go(horizontal < 0 ? 1 : -1); }
  if (!pointers.size) { swipeStart = null; dragStart = null; pinchStart = null; }
}
reader.addEventListener('pointerup', release);
reader.addEventListener('pointercancel', release);
fullscreen.addEventListener('click', async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch (_) {} });
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
