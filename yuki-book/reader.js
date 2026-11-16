const pages=['01-cover.jpg','02-arrival.jpg','03-luru-pepe.jpg','04-snow-flower.jpg','05-dinner.jpg','06-map.jpg','07-waterway.jpg','08-repair.jpg','09-bloom.jpg','10-farewell.jpg','11-back-cover.jpg'];
let n=0,start=null,zoom=1,pan={x:0,y:0},drag=null;const page=document.querySelector('#page'),prev=document.querySelector('#prev'),next=document.querySelector('#next'),count=document.querySelector('#count'),hint=document.querySelector('.hint'),backdrop=document.querySelector('#backdrop'),full=document.querySelector('#full'),landscape=document.querySelector('#landscape'),rotateNote=document.querySelector('#rotate-note');

/*
 * 表示専用の文字校正。元の11枚のJPEGと物語は保存したまま、
 * 3/7/9ページの指定箇所だけをスマホ表示で重ねて修正する。
 */
const correctionLayer=document.createElement('div');
correctionLayer.className='correction-layer';
correctionLayer.setAttribute('aria-hidden','true');
page.appendChild(correctionLayer);
const correctedCaptions={
  2: {
    patch:[{left:40.2,top:84,width:21.4,height:13.1}],
    labels:[{left:42,top:85.1,size:1.63,lines:['さんにんをみて、','びっくりぎょうてん！']}]
  },
  6: {
    patch:[{left:31.5,top:77.5,width:37.2,height:21.5}],
    labels:[
      {left:3.1,top:80.3,size:1.5,lines:['ルルとぺぺに　あんないされ、','さんにんは　オーロラのしずくが','あつまるばしょへ　むかいました。'],redFirst:'さんにんは'},
      {left:52.6,top:80.3,size:1.5,lines:['おおゆきでこわれた　ゆきよけのやねが、','ゆきのはなへの　すいろを','ふさいでいました。']}
    ]
  },
  8: {
    patch:[{left:1.4,top:83.6,width:35.8,height:13.4}],
    labels:[{left:3.1,top:85.3,size:1.56,lines:['いろがかわり、','みるみる　ゆきのはなが　さいていきました。']}]
  }
};
function renderCorrections(){
  const spec=correctedCaptions[n];
  correctionLayer.replaceChildren();
  if(!spec){correctionLayer.style.display='none';return}
  correctionLayer.style.display='block';
  // 画像は全ページほぼ1672×941。background-size:contain と同じ位置・比率で重ねる。
  const artW=Math.min(page.clientWidth,page.clientHeight*1672/941);
  const artH=artW*941/1672;
  correctionLayer.style.width=artW+'px';
  correctionLayer.style.height=artH+'px';
  for(const area of spec.patch){
    const el=document.createElement('div');
    el.className='correction-patch';
    Object.assign(el.style,{left:area.left+'%',top:area.top+'%',width:area.width+'%',height:area.height+'%'});
    correctionLayer.appendChild(el);
  }
  for(const part of spec.labels){
    const el=document.createElement('div');
    el.className='correction-caption';
    Object.assign(el.style,{left:part.left+'%',top:part.top+'%',fontSize:artW*part.size/100+'px'});
    for(const words of part.lines){
      const line=document.createElement('div');
      if(part.redFirst&&words.startsWith(part.redFirst)){
        const red=document.createElement('span');red.className='correction-red';red.textContent=part.redFirst;
        line.append(red,document.createTextNode(words.slice(part.redFirst.length)));
      }else{line.textContent=words}
      el.appendChild(line);
    }
    correctionLayer.appendChild(el);
  }
}
addEventListener('resize',renderCorrections);

function draw(){page.style.backgroundImage=`url("pages/${pages[n]}")`;backdrop.style.backgroundImage=page.style.backgroundImage;page.style.transform=`translate(${pan.x}px,${pan.y}px) scale(${zoom})`;page.setAttribute('aria-label',`${n+1}ページ目`);prev.disabled=n===0;next.disabled=n===pages.length-1;count.textContent=`${n+1} / ${pages.length}`;renderCorrections()}
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
