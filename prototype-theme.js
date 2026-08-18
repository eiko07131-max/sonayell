(function(){
  function install(){
    if(document.getElementById('sonaPrototypeTheme')) return true;
    const style=document.createElement('style');
    style.id='sonaPrototypeTheme';
    style.textContent=`
      :root{--sy-green:#0f6f39;--sy-green2:#2f8e4c;--sy-cream:#fffaf0;--sy-gold:#e5b64d;--sy-line:#d9ead4;--sy-shadow:0 10px 28px rgba(42,92,54,.12)}
      body{background:linear-gradient(180deg,#eef9e9 0%,#f9f7e8 100%)!important;color:#314b35!important}
      .header{background:linear-gradient(90deg,#0b6533,#187c40)!important;border:0!important;box-shadow:0 4px 18px rgba(22,86,42,.18)!important;padding:14px 18px!important}
      .headerLogo{color:#fff!important;font-weight:900!important;letter-spacing:.02em}
      .header .yellBadge{background:#fff8cf!important;color:#715715!important;border:1px solid rgba(255,255,255,.7)!important}
      .pageContent{max-width:820px!important;padding:18px 16px 42px!important}
      .backButton,.myBack{background:rgba(255,255,255,.9)!important;color:#17683a!important;border:1px solid #dbead7!important;border-radius:999px!important;box-shadow:0 3px 10px rgba(55,96,61,.08)!important}
      .mainButton,.primaryBtn,.profileSave,.postForm button{background:linear-gradient(180deg,#279d54,#178040)!important;box-shadow:0 5px 0 #116735!important}

      /* 起動画面：合格画像の森と大樹の世界観へ */
      #startScreen{background:linear-gradient(180deg,#8fd1f2 0%,#d9f2ff 31%,#e8f5cb 58%,#5fae59 100%)!important;padding:22px 16px 28px!important}
      #startScreen:before{content:"";position:absolute;inset:auto -8% -10% -8%;height:43%;background:radial-gradient(ellipse at 50% 100%,#247b3b 0 19%,transparent 20%),radial-gradient(ellipse at 12% 100%,#3b964d 0 20%,transparent 21%),radial-gradient(ellipse at 88% 100%,#3b964d 0 20%,transparent 21%);opacity:.45;pointer-events:none}
      #startScreen .logoArea{margin-bottom:360px!important}
      #startScreen .logo{font-size:clamp(42px,9vw,68px)!important;color:#075d2c!important;text-shadow:0 3px 0 #fff,0 0 20px rgba(255,255,255,.8)!important;font-weight:900!important}
      #startScreen .catch{font-size:16px!important;color:#203f2a!important}
      #startScreen .worldMessage{font-size:14px!important;color:#2f5637!important}
      #startScreen .tree{transform:translateX(-50%) scale(1.12)!important;bottom:126px!important}
      #startScreen .crown{background:#3b8e3f!important;box-shadow:-48px 60px 0 #64a84a,48px 65px 0 #2f7d38,0 104px 0 #4e9742!important}
      #startScreen .fruit{background:linear-gradient(145deg,#f6d95a,#e98739)!important}
      #startScreen .characters{font-size:46px!important;bottom:148px!important;filter:drop-shadow(0 4px 3px rgba(0,0,0,.08))}
      #startScreen .startMessage{background:rgba(255,250,234,.96)!important;border:2px solid #e4d19a!important;border-radius:18px!important;color:#4c432a!important;box-shadow:var(--sy-shadow)!important}
      #startScreen .startButton{background:linear-gradient(180deg,#27984c,#0d6d35)!important;border:2px solid rgba(255,255,255,.55)!important;border-radius:999px!important;box-shadow:0 5px 0 #07552a,0 8px 18px rgba(20,80,35,.22)!important}
      #startScreen .startButton.secondary{background:#fffaf0!important;color:#156b39!important;box-shadow:0 4px 0 #d9cfaa!important}

      /* 決定そなピーに近づける：白い顔＋緑のフード＋二枚葉 */
      .sonaPeeBox{background:rgba(255,255,255,.84)!important;border:2px solid #d7e8d2!important}
      .peeHead{background:#7eaa16!important;border:2px solid #557e13!important;box-shadow:none!important;overflow:visible!important}
      .peeHead:after{content:"";position:absolute;left:9px;top:11px;width:55px;height:50px;background:#fffdf6;border-radius:48% 48% 45% 45%;z-index:0}
      .peeHead:before{width:23px!important;height:14px!important;left:26px!important;top:-15px!important;background:#72a317!important;border-radius:80% 15% 80% 15%!important;box-shadow:18px 4px 0 #82b51b;transform:rotate(-22deg)!important}
      .peeFace{z-index:2!important;left:29px!important;top:39px!important}
      .peeBody{background:#0e6f36!important;border:2px solid #075528!important}
      .sonaPeeName{color:#0c6a34!important;font-size:20px!important}

      /* ホーム */
      #homeScreen{background:linear-gradient(180deg,#dff3ff 0%,#eff8dd 38%,#dcedbd 100%)!important}
      #homeScreen .pageContent{position:relative}
      #homeScreen .homeHero{gap:12px!important}
      #homeScreen .woodSign{background:linear-gradient(#fff9df,#f9e8bd)!important;border-color:#9a6938!important;box-shadow:inset 0 0 0 2px #d6ad72,0 7px 20px rgba(84,62,29,.13)!important}
      #homeScreen .homeIntro{background:linear-gradient(145deg,#f1fadf,#fff0c9)!important;border:2px solid #dbeabf!important}
      #homeScreen .imakoko{background:#fff!important;border-style:solid!important;border-color:#efb1b1!important;box-shadow:var(--sy-shadow)!important}
      #homeScreen .myTreeCard{background:linear-gradient(180deg,#fffef8,#f6f9e9)!important;border:2px solid #d5e7cc!important;box-shadow:var(--sy-shadow)!important}
      #homeScreen .myTreeVisual{min-height:230px!important;background:linear-gradient(180deg,#cceefe 0%,#edf8d8 58%,#8bcf67 100%)!important;border:2px solid #d5e7cc!important}
      #homeScreen .myTreeVisual:before{content:"🐦     🦋";position:absolute;top:15px;left:15px;right:15px;text-align:space-between;font-size:25px;opacity:.88}
      #homeScreen .myTreeVisual:after{content:"🐻   🐿️   🐰";position:absolute;left:0;right:0;bottom:8px;text-align:center;font-size:31px;letter-spacing:12px;pointer-events:none}
      #homeScreen .myTreeEmoji{filter:drop-shadow(0 8px 6px rgba(57,94,38,.17))}
      #homePostBars{grid-template-columns:1fr 1fr!important;gap:11px!important;margin-top:13px!important}
      #homePostBars .homePostBar{min-height:96px!important;text-align:center!important;border-radius:20px!important;padding:16px 12px!important;font-size:16px!important;box-shadow:var(--sy-shadow)!important}
      #homePostBars .hallBar{background:linear-gradient(145deg,#fff4b9,#fffaf0)!important;border-color:#e7c65f!important}
      #homePostBars #openProfileBtn{grid-column:1/-1!important;min-height:auto!important;text-align:left!important}
      #homeScreen .homeCard,#homeScreen .homeNext,#homeScreen .homeQuote{border:1px solid #dcead5!important;box-shadow:var(--sy-shadow)!important}

      /* 私のYELLの木 */
      #forestScreen{background:linear-gradient(180deg,#bfe8fb 0%,#e9f8db 46%,#cdeba9 100%)!important}
      #forestScreen .header{background:linear-gradient(90deg,#075f31,#0d7138)!important}
      #forestScreen .pageContent{max-width:820px!important}
      #forestScreen .myTreeVisual{min-height:440px!important;background:linear-gradient(180deg,#bce9ff 0 38%,#dff3cd 39% 65%,#7fc85b 66% 100%)!important;border-radius:28px!important;border:2px solid rgba(255,255,255,.75)!important;box-shadow:0 12px 32px rgba(39,89,46,.14)!important;overflow:hidden!important;position:relative!important}
      #forestScreen .myTreeVisual:before{content:"🐦  🦋                     🦌";position:absolute;top:30px;left:20px;right:20px;font-size:34px;white-space:pre;z-index:1}
      #forestScreen .myTreeVisual:after{content:"🐻    🐰   🐿️";position:absolute;bottom:20px;left:0;right:0;text-align:center;font-size:44px;letter-spacing:15px;z-index:1}
      #forestScreen .myTreeEmoji{font-size:210px!important;z-index:2!important;filter:drop-shadow(0 12px 8px rgba(71,96,40,.18))}
      #forestScreen .treeProgress,#forestScreen .progressWrap{background:rgba(255,255,255,.93)!important;border-radius:22px!important;padding:16px!important;box-shadow:var(--sy-shadow)!important}

      /* みんなの防災投稿 */
      #postsScreen{background:linear-gradient(180deg,#dff3ff 0%,#eff8df 35%,#f8f6e8 100%)!important}
      #postsScreen .header{background:rgba(255,255,255,.94)!important;border-bottom:1px solid #d8ead5!important;box-shadow:none!important}
      #postsScreen .headerLogo{color:#0d6a35!important}
      #postsScreen .postForm{background:linear-gradient(145deg,#e7f7d6,#fff2bd)!important;border:2px solid #e1e7b6!important;box-shadow:var(--sy-shadow)!important;border-radius:24px!important}
      #postsScreen .postCard{border:1px solid #dcead4!important;box-shadow:var(--sy-shadow)!important;border-radius:22px!important}
      #postsScreen .sonaPostMedia{border-radius:18px!important;max-height:520px!important}
      #postsScreen .postActions button{border:1px solid #d8e9d3!important;background:#edf7e9!important}
      #postsScreen .postActions button.on{background:#fff1a6!important}

      /* 殿堂入り */
      #hallScreen{background:linear-gradient(180deg,#fff8cf 0%,#f7f7e7 38%,#edf7e9 100%)!important}
      #hallScreen .header{background:linear-gradient(90deg,#8a6b16,#b28b24)!important}
      #hallScreen .hallHero{background:linear-gradient(145deg,#fff0a4,#fffaf0)!important;border:2px solid #e2c65b!important;box-shadow:0 8px 22px rgba(120,91,20,.13)!important}
      #hallScreen .postCard{border:2px solid #eee0a7!important;box-shadow:0 8px 22px rgba(120,91,20,.1)!important}

      /* マイページ */
      #profileScreen,.mySubScreen{background:linear-gradient(180deg,#eef9e7 0%,#f8f7e9 100%)!important}
      #profileScreen .header{background:linear-gradient(90deg,#0d6935,#217f46)!important}
      #profileSummary{background:linear-gradient(145deg,#dff5d5,#fff3bb)!important;border:2px solid #dbe7b8!important;box-shadow:var(--sy-shadow)!important;padding:20px!important}
      #profileAvatarBig{font-size:50px!important;background:#fff!important;width:70px;height:70px;border-radius:50%;display:grid;place-items:center;box-shadow:0 4px 14px rgba(59,94,51,.13)}
      .myMenuBtn{border:1px solid #dcead5!important;box-shadow:var(--sy-shadow)!important;border-radius:20px!important;padding:18px!important;background:rgba(255,255,255,.94)!important}
      .myMenuBtn.memo{background:linear-gradient(145deg,#eaf8de,#fff4c9)!important}
      .memoComposer,.memoCard,.helpCard,.settingsCard{border:1px solid #dcead5!important;box-shadow:var(--sy-shadow)!important}

      /* 我が家の備え・災害別アクションも同じ世界観に */
      #prepareScreen,#checkScreen,#encyclopediaScreen{background:linear-gradient(180deg,#edf8e8 0%,#fbf7e7 100%)!important}
      .categoryButton,.checkCard,.encyItem,.progressWrap,.encyHero{border:1px solid #dcead5!important;box-shadow:var(--sy-shadow)!important}
      .encyHero{background:linear-gradient(145deg,#e7f6d8,#fff0c0)!important}

      @media(max-width:700px){
        #startScreen .logoArea{margin-bottom:335px!important}
        #startScreen .tree{transform:translateX(-50%) scale(.95)!important;bottom:145px!important}
        #homeScreen .homeHero{grid-template-columns:1fr 1fr!important}
        #homeScreen .woodSign{grid-column:1/-1!important}
        #homeScreen .homeIntro{grid-column:1!important}
        #homeScreen .sonaPeeBox{grid-column:2!important}
        #forestScreen .myTreeVisual{min-height:390px!important}
        #forestScreen .myTreeEmoji{font-size:175px!important}
      }
      @media(max-width:430px){
        #homeScreen .homeHero{display:block!important}
        #homeScreen .homeIntro,#homeScreen .sonaPeeBox{margin-top:10px!important}
        #homePostBars{grid-template-columns:1fr!important}
        #homePostBars #openProfileBtn{grid-column:auto!important}
        #forestScreen .myTreeVisual{min-height:360px!important}
        #forestScreen .myTreeEmoji{font-size:155px!important}
      }
    `;
    document.head.appendChild(style);

    // ホームの並びを今日の合格設計に近づける：YELLの木→投稿→その他。
    const home=document.getElementById('homeScreen');
    const bars=document.getElementById('homePostBars');
    const tree=document.getElementById('myTreeCard');
    if(home&&bars&&tree&&bars.parentElement===tree.parentElement){
      tree.insertAdjacentElement('afterend',bars);
    }

    // 防災図鑑という旧表記だけを画面上から残さない。
    document.querySelectorAll('button,h1,h2,h3,.headerLogo,.pageTitle,.homeCard').forEach(el=>{
      const t=(el.textContent||'').trim();
      if(t==='防災図鑑'||t.includes('防災図鑑')){
        el.childNodes.forEach(n=>{if(n.nodeType===3)n.textContent=n.textContent.replace(/防災図鑑/g,'災害別!! 防災アクション')});
      }
    });

    return true;
  }

  if(!install()){
    let n=0;
    const timer=setInterval(()=>{if(install()||++n>80)clearInterval(timer)},100);
  }
  const mo=new MutationObserver(()=>install());
  mo.observe(document.documentElement,{childList:true,subtree:true});
})();