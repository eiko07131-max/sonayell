(function(){
  if(window.__sonaIncomingYellSync)return;
  if(localStorage.getItem('sonayell_trial_mode')==='1')return;
  window.__sonaIncomingYellSync=true;
  const U='https://illnptsvaieyacjajlfm.supabase.co';
  const K='sb_publishable_QfSUIWFyzrr0v9t941s8dg_-GPvjwzx';
  let busy=false;
  function localYell(){try{return Number(JSON.parse(localStorage.getItem('sonayell_v2')||'{}').yell)||0}catch(e){return 0}}
  function setLocalYell(y){let s={};try{s=JSON.parse(localStorage.getItem('sonayell_v2')||'{}')}catch(e){}s.yell=y;localStorage.setItem('sonayell_v2',JSON.stringify(s));try{eval('state.yell='+Number(y)+';save();update();')}catch(e){try{if(typeof update==='function')update()}catch(_){}}}
  function showReceived(delta){try{if(typeof leaf==='function')leaf()}catch(e){}
    try{
      let n=document.getElementById('incomingYellNotice');
      if(!n){n=document.createElement('div');n.id='incomingYellNotice';n.style.cssText='position:fixed;left:50%;top:78px;transform:translateX(-50%);z-index:5000;background:#fff4b8;color:#5f591d;border:2px solid #e8cf68;border-radius:999px;padding:10px 16px;font-weight:800;box-shadow:0 5px 18px #0002;transition:.25s;pointer-events:none';document.body.appendChild(n)}
      n.textContent='🌟 応援YELLが '+delta+' 届いたよ！ 🍃';n.style.opacity='1';clearTimeout(n._t);n._t=setTimeout(()=>{n.style.opacity='0'},3500);
    }catch(e){}
  }
  async function check(){
    if(busy||document.visibilityState==='hidden')return;
    const token=localStorage.getItem('sonayell_access_token')||'';
    if(!token)return;
    busy=true;
    try{
      const r=await fetch(U+'/rest/v1/rpc/sona_get_my_account',{method:'POST',headers:{apikey:K,Authorization:'Bearer '+token,'Content-Type':'application/json'},body:'{}'});
      if(!r.ok)return;
      const rows=await r.json();if(!rows||!rows[0])return;
      const next=Number(rows[0].yell)||0,prev=localYell();
      if(next!==prev)setLocalYell(next);
      if(next>prev)showReceived(next-prev);
    }catch(e){}finally{busy=false}
  }
  setTimeout(check,700);
  setInterval(check,5000);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')setTimeout(check,150)});
  window.addEventListener('focus',()=>setTimeout(check,100));
})();