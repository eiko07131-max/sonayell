const pages=['01-cover.jpg','02-arrival.jpg','03-luru-pepe.jpg','04-snow-flower.jpg','05-dinner.jpg','06-map.jpg','07-waterway.jpg','08-repair.jpg','09-bloom.jpg','10-farewell.jpg','11-back-cover.jpg'];
let n=0,start=null,zoom=1,pan={x:0,y:0},drag=null;const page=document.querySelector('#page'),prev=document.querySelector('#prev'),next=document.querySelector('#next'),count=document.querySelector('#count'),hint=document.querySelector('.hint'),backdrop=document.querySelector('#backdrop'),full=document.querySelector('#full'),landscape=document.querySelector('#landscape'),rotateNote=document.querySelector('#rotate-note');
function draw(){page.style.backgroundImage=`url("pages/${pages[n]}")`;backdrop.style.backgroundImage=page.style.backgroundImage;page.style.transform=`translate(${pan.x}px,${pan.y}px) scale(${zoom})`;page.setAttribute('aria-label',`${n+1}ページ目`);prev.disabled=n===0;next.disabled=n===pages.length-1;count.textContent=`${n+1} / ${pages.length}`}
function move(d){if(n+d<0||n+d>=pages.length)return;n+=d;zoom=1;pan={x:0,y:0};draw();hint.classList.add('hidden')}
prev.onclick=()=>move(-1);next.onclick=()=>move(1);addEventListener('keydown',e=>{if(e.key==='ArrowLeft')move(-1);if(e.key==='ArrowRight')move(1)});
page.addEventListener('pointerdown',e=>{page.setPointerCapture(e.pointerId);start={x:e.clientX,y:e.clientY};drag={x:e.clientX,y:e.clientY,pan:{...pan}}});page.addEventListener('pointermove',e=>{if(!drag||zoom===1)return;pan={x:drag.pan.x+e.clientX-drag.x,y:drag.pan.y+e.clientY-drag.y};draw()});page.addEventListener('pointerup',e=>{if(!start)return;let dx=e.clientX-start.x,dy=e.clientY-start.y;if(zoom===1&&Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))move(dx<0?1:-1);start=drag=null});
page.addEventListener('touchstart',e=>{if(e.touches.length===2){const[a,b]=e.touches;page.dataset.pinch=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);page.dataset.base=zoom}}, {passive:true});page.addEventListener('touchmove',e=>{if(e.touches.length===2){const[a,b]=e.touches,d=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);zoom=Math.min(3,Math.max(1,+page.dataset.base*d/+page.dataset.pinch));if(zoom===1)pan={x:0,y:0};draw()}},{passive:true});
async function enterLandscape(){
  try {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen)
      await document.documentElement.requestFullscreen({navigationUI:'hide'});
  } catch (_) { /* Fullscreen is restricted on some browsers. */ }
  try {
    if (screen.orientation && typeof screen.orientation.lock === 'function')
      await screen.orientation.lock('landscape');
  } catch (_) { /* Show the manual-rotation guidance below. */ }
  if (matchMedia('(orientation: portrait)').matches)
    rotateNote.textContent='端末の自動回転をONにして、スマホを横向きにしてください';
}
landscape.addEventListener('click',enterLandscape);
full.addEventListener('click',()=>{
  if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});
  else enterLandscape();
});
document.addEventListener('fullscreenchange',()=>{
  full.textContent=document.fullscreenElement?'✕ 全画面を終了':'⛶ 全画面';
  if(!document.fullscreenElement && screen.orientation && typeof screen.orientation.unlock==='function'){
    try{screen.orientation.unlock()}catch(_){}
  }
});
draw();
if('serviceWorker' in navigator)
  addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
if(matchMedia('(display-mode: standalone)').matches && screen.orientation && typeof screen.orientation.lock==='function'){
  screen.orientation.lock('landscape').catch(()=>{});
}
