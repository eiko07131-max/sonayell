(function(){
  function norm(s){return String(s||'').toLowerCase().replace(/[　\s、。,.!！?？・「」『』（）()]/g,'').replace(/ヶ/g,'ケ')}
  function install(){
    const d=document;
    if(d.getElementById('actionSearchEmphasisStyle'))return true;
    const screen=d.getElementById('encyclopediaScreen');
    if(!screen)return false;
    const style=d.createElement('style');
    style.id='actionSearchEmphasisStyle';
    style.textContent=`#actionResults:not(:empty){margin:12px 0 18px;padding:14px;background:#fff4d8;border:4px solid #e86838;border-radius:22px;box-shadow:0 7px 20px rgba(164,75,53,.18)}#actionResults:not(:empty)::before{content:attr(data-label);display:block;margin:0 0 10px;padding:8px 10px;border-radius:12px;background:#e86838;color:#fff;font-size:16px;font-weight:800;letter-spacing:.02em}#actionResults .actList{margin-bottom:0!important}#actionResults .actRow{border:3px solid #efb04d!important;background:#fff!important;padding:18px!important;box-shadow:0 4px 12px rgba(0,0,0,.08)!important}#actionResults .actRow b{font-size:19px!important;color:#a44b35!important;margin-bottom:7px}#actionResults .actRow small{font-size:14px!important;color:#5b664f!important;font-weight:700}#actionResults .actRow small:after{content:'  → 今すぐ確認';color:#c64d2d;font-weight:900}#actionResults .actRow[data-search-rank="0"]{border-color:#e86838!important;background:#fffaf3!important;box-shadow:0 7px 18px rgba(232,104,56,.2)!important}#actionBody:has(#actionSearch:not(:placeholder-shown)) .actCats{opacity:.25;filter:grayscale(.35)}#actionBody:has(#actionSearch:not(:placeholder-shown))>.actList{opacity:.25}@media(max-width:520px){#actionResults:not(:empty){padding:11px;border-width:3px}#actionResults .actRow b{font-size:18px!important}}`;
    d.head.appendChild(style);
    const rankResults=()=>{
      const box=d.getElementById('actionResults'),inp=d.getElementById('actionSearch');
      if(!box||!inp)return;
      const q=norm(inp.value);
      const list=box.querySelector('.actList');
      if(!q||!list)return;
      const rows=[...list.querySelectorAll('.actRow')];
      rows.forEach((row,i)=>{
        const title=norm((row.querySelector('b')||{}).textContent||'');
        const now=norm((row.querySelector('small')||{}).textContent||'');
        let score=100+i;
        if(title===q)score=0;
        else if(title.includes(q))score=1;
        else if(now.includes(q))score=2;
        row.dataset.searchScore=String(score);
      });
      rows.sort((a,b)=>Number(a.dataset.searchScore)-Number(b.dataset.searchScore)).forEach((row,i)=>{row.dataset.searchRank=String(i);list.appendChild(row)});
    };
    const refresh=()=>{
      const box=d.getElementById('actionResults'),inp=d.getElementById('actionSearch');
      if(!box)return;
      rankResults();
      const n=box.querySelectorAll('.actRow').length,q=inp?(inp.value||'').trim():'';
      if(!q){box.removeAttribute('data-label');return}
      box.setAttribute('data-label',n?`🔎 検索結果が見つかりました！「${q}」 ${n}件`:`🔎 「${q}」の検索結果`);
    };
    const watch=()=>{
      const box=d.getElementById('actionResults');if(!box)return false;
      if(box.dataset.emphasisWatch)return true;
      box.dataset.emphasisWatch='1';
      let busy=false;
      new MutationObserver(()=>{if(busy)return;busy=true;setTimeout(()=>{refresh();busy=false},0)}).observe(box,{childList:true,subtree:true});
      const inp=d.getElementById('actionSearch');if(inp)inp.addEventListener('input',()=>setTimeout(refresh,0));
      refresh();return true;
    };
    new MutationObserver(()=>watch()).observe(screen,{childList:true,subtree:true});watch();return true;
  }
  if(!install()){let n=0;const t=setInterval(()=>{if(install()||++n>40)clearInterval(t)},100)}
})();