(function(){
  function install(){
    try{
      const d=document;
      const btn=d.getElementById('profileSave');
      if(!btn||btn.dataset.profilePatch==='1')return !!btn;
      btn.dataset.profilePatch='1';
      const parentWin=window.parent;
      const originalAlert=parentWin.alert.bind(parentWin);
      function ensureStatus(){
        let box=d.getElementById('profileSaveStatus');
        if(!box){
          box=d.createElement('div');
          box.id='profileSaveStatus';
          box.style.cssText='display:none;margin-top:10px;padding:11px 13px;border-radius:12px;background:#eef8e9;color:#397a44;font-weight:700;font-size:13px;text-align:center';
          btn.insertAdjacentElement('afterend',box);
        }
        return box;
      }
      const status=ensureStatus();
      btn.addEventListener('click',()=>{
        const prev=parentWin.alert;
        parentWin.alert=(msg)=>{
          const text=String(msg||'');
          if(text.includes('マイページを保存したよ')){
            status.textContent='🌱 保存しました。次の投稿から新しいプロフィールで表示されます。';
            status.style.display='block';
            setTimeout(()=>{status.style.display='none'},4000);
          }else{
            prev(msg);
          }
        };
        setTimeout(()=>{parentWin.alert=originalAlert},2500);
      },true);
      return true;
    }catch(e){return false}
  }
  if(!install()){
    let n=0;
    const t=setInterval(()=>{if(install()||++n>50)clearInterval(t)},100);
  }
})();