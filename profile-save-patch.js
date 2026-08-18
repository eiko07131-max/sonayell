(function(){
  const U='https://illnptsvaieyacjajlfm.supabase.co';
  const K='sb_publishable_QfSUIWFyzrr0v9t941s8dg_-GPvjwzx';
  const GUEST_MEMO_KEY='sonayell_guest_memos_v1';

  function token(){ return localStorage.getItem('sonayell_access_token')||''; }
  function guestToken(){
    let g=localStorage.getItem('sonayell_guest_token');
    if(!g){ g=crypto.randomUUID(); localStorage.setItem('sonayell_guest_token',g); }
    return g;
  }
  function registered(){ return !!token(); }
  function headers(json=true){
    const h={apikey:K};
    if(json) h['Content-Type']='application/json';
    if(token()) h.Authorization='Bearer '+token();
    return h;
  }
  async function rpc(name,body={}){
    const r=await fetch(U+'/rest/v1/rpc/'+name,{method:'POST',headers:headers(true),body:JSON.stringify(body)});
    if(!r.ok) throw new Error(await r.text());
    const t=await r.text();
    return t?JSON.parse(t):null;
  }
  function esc(s){
    return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }
  function fmtDate(s){
    try{return new Date(s).toLocaleDateString('ja-JP')}catch(e){return ''}
  }
  function uidFromToken(){
    try{
      const p=token().split('.')[1];
      if(!p)return '';
      const json=JSON.parse(decodeURIComponent(escape(atob(p.replace(/-/g,'+').replace(/_/g,'/')))));
      return json.sub||'';
    }catch(e){return ''}
  }
  function openScreen(s){
    document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));
    s.classList.add('active');
    window.scrollTo(0,0);
  }
  function profileScreen(){ return document.getElementById('profileScreen'); }
  function homeScreen(){ return document.getElementById('homeScreen'); }

  function ensureStyle(){
    if(document.getElementById('mypageV2Style'))return;
    const s=document.createElement('style');
    s.id='mypageV2Style';
    s.textContent=`
      #profileScreen .yellBadge{display:none!important}
      #profileRegionSummary{display:none!important}
      .myMenu{display:grid;gap:10px;margin:14px 0}
      .myMenuBtn{width:100%;border:0;border-radius:18px;background:#fff;padding:16px 17px;box-shadow:0 3px 12px rgba(50,90,50,.08);font:inherit;font-weight:800;color:#397a44;text-align:left;display:flex;align-items:center;justify-content:space-between}
      .myMenuBtn span{font-size:13px;color:#8aa08d;font-weight:600}
      .myMenuBtn.memo{background:linear-gradient(135deg,#eff9e9,#fff8d7)}
      .mySubScreen{display:none;min-height:100vh;flex-direction:column;background:#f5faef}
      .mySubScreen.active{display:flex}
      .myPageHeader{padding:18px 18px 10px;font-size:20px;font-weight:900;color:#397a44}
      .myPageMain{padding:0 16px 28px}
      .myBack{border:0;background:transparent;color:#4e7f55;font-weight:800;padding:10px 0 14px;font-size:14px}
      .myEmpty{background:#fff;border-radius:18px;padding:24px;text-align:center;color:#6f8572;line-height:1.8}
      .memoComposer,.helpCard,.settingsCard{background:#fff;border-radius:20px;padding:16px;box-shadow:0 3px 12px rgba(50,90,50,.08);margin-bottom:13px}
      .memoComposer textarea,.helpCard textarea,.helpCard input{width:100%;box-sizing:border-box;border:2px solid #e0eadb;border-radius:14px;padding:12px;font:inherit;outline:none;background:#fcfffa}
      .memoComposer textarea,.helpCard textarea{min-height:110px;resize:vertical}
      .memoPhotoRow{display:flex;gap:10px;align-items:center;margin-top:10px;flex-wrap:wrap}
      .memoFile{font-size:13px}
      .primaryBtn{width:100%;border:0;border-radius:14px;padding:13px;background:#4e9956;color:#fff;font-weight:900;font-size:15px;margin-top:10px}
      .memoCard{background:#fff;border-radius:18px;padding:14px;margin:10px 0;box-shadow:0 3px 12px rgba(50,90,50,.08)}
      .memoBody{white-space:pre-wrap;line-height:1.7;font-size:14px}
      .memoDate{font-size:11px;color:#8ba08d;margin-bottom:7px}
      .memoImg{display:block;width:100%;max-height:320px;object-fit:cover;border-radius:14px;margin-top:10px;background:#eef4ea}
      .memoDelete{border:0;background:#fff0ee;color:#a5534b;border-radius:11px;padding:8px 11px;font-weight:800;margin-top:10px}
      .tinyNote{font-size:11px;color:#78907a;line-height:1.6;margin-top:7px}
      .sectionTitle{font-size:18px;color:#397a44;margin:3px 0 12px}
      .helpCard h3,.settingsCard h3{margin:0 0 8px;color:#397a44}
      .helpCard p,.settingsCard p{font-size:13px;line-height:1.7;color:#667d69}
      .postCard{background:#fff;border-radius:20px;padding:16px;margin:9px 0;box-shadow:0 3px 12px rgba(50,90,50,.08)}
      .postTitle{font-size:14px;font-weight:bold;color:#397a44;margin:7px 0}.postMeta{font-size:11px;color:#78907a}.postBody{font-size:14px;line-height:1.7;margin:8px 0 12px;white-space:pre-wrap}
      .postActions{display:flex;gap:7px}.postActions button{flex:1;padding:10px;border:0;border-radius:12px;background:#edf7e9;color:#4b7651;font-weight:bold;font-size:12px}.postActions button.on{background:#fff1a6;color:#755c20}
    `;
    document.head.appendChild(s);
  }

  function postHtml(p){
    return `<article class="postCard">
      <div class="postMeta">${esc(p.avatar||'🌱')} ${esc(p.name||'ゲスト')}　${fmtDate(p.created_at)}</div>
      <div class="postTitle">${esc(p.title||'防災の工夫')}</div>
      <div class="postBody">${esc(p.text||'')}</div>
      <div class="postActions">
        <button class="${p.liked?'on':''}" data-like="${p.id}">👍 いいね ${p.likes||0}${p.liked?' 済':''}</button>
        <button class="${p.saved?'on':''}" data-save="${p.id}">🔖 保存 ${p.saves||0}${p.saved?' 済':''}</button>
      </div>
    </article>`;
  }

  async function toggleReaction(postId,kind){
    await rpc('sona_toggle_reaction_v2',{p_post_id:Number(postId),p_guest_token:guestToken(),p_kind:kind});
  }
  function bindPostActions(box,reload){
    box.querySelectorAll('[data-like]').forEach(b=>b.onclick=async()=>{
      b.disabled=true; try{ await toggleReaction(b.dataset.like,'like'); await reload(); }catch(e){alert('いいねを反映できませんでした。')} finally{b.disabled=false}
    });
    box.querySelectorAll('[data-save]').forEach(b=>b.onclick=async()=>{
      b.disabled=true; try{ await toggleReaction(b.dataset.save,'save'); await reload(); }catch(e){alert('保存を反映できませんでした。')} finally{b.disabled=false}
    });
  }

  function createSubScreen(id,title){
    let s=document.getElementById(id);
    if(s)return s;
    s=document.createElement('section');
    s.id=id;s.className='screen mySubScreen';
    s.innerHTML=`<div class="myPageHeader">${title}</div><main class="myPageMain"><button class="myBack">← マイページへ戻る</button><div class="mySubBody"></div></main>`;
    document.body.appendChild(s);
    s.querySelector('.myBack').onclick=()=>openScreen(profileScreen());
    return s;
  }

  async function renderMyPosts(){
    const s=createSubScreen('myPostsScreen','📝 自分の投稿');
    const box=s.querySelector('.mySubBody');
    box.innerHTML='<div class="myEmpty">🌱 投稿を読み込み中…</div>';
    openScreen(s);
    try{
      const rows=await rpc('sona_list_my_posts_v2',{p_guest_token:guestToken(),p_limit:100})||[];
      if(!rows.length){box.innerHTML='<div class="myEmpty">まだ投稿はありません。</div>';return}
      box.innerHTML=rows.map(postHtml).join('');
      bindPostActions(box,renderMyPosts);
    }catch(e){box.innerHTML='<div class="myEmpty">投稿を読み込めませんでした。</div>'}
  }

  async function renderSavedPosts(){
    const s=createSubScreen('savedPostsScreen','🔖 保存した投稿');
    const box=s.querySelector('.mySubBody');
    box.innerHTML='<div class="myEmpty">🌱 保存した投稿を読み込み中…</div>';
    openScreen(s);
    try{
      const rows=await rpc('sona_list_saved_posts_v2',{p_guest_token:guestToken(),p_limit:100})||[];
      if(!rows.length){box.innerHTML='<div class="myEmpty">保存した投稿はまだありません。</div>';return}
      box.innerHTML=rows.map(postHtml).join('');
      bindPostActions(box,renderSavedPosts);
    }catch(e){box.innerHTML='<div class="myEmpty">保存した投稿を読み込めませんでした。</div>'}
  }

  function readGuestMemos(){
    try{return JSON.parse(localStorage.getItem(GUEST_MEMO_KEY)||'[]')}catch(e){return []}
  }
  function writeGuestMemos(v){localStorage.setItem(GUEST_MEMO_KEY,JSON.stringify(v))}
  function fileDataUrl(file){
    return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)});
  }
  async function uploadMemoImage(file){
    if(!registered())return '';
    if(!file)return '';
    if(file.size>5*1024*1024)throw new Error('画像は5MB以下にしてください');
    const uid=uidFromToken();
    if(!uid)throw new Error('ユーザー情報を確認できません');
    const ext=(file.name.split('.').pop()||'jpg').replace(/[^a-zA-Z0-9]/g,'').toLowerCase()||'jpg';
    const path=uid+'/'+Date.now()+'-'+crypto.randomUUID()+'.'+ext;
    const r=await fetch(U+'/storage/v1/object/sonayell-memos/'+path,{
      method:'POST',
      headers:{apikey:K,Authorization:'Bearer '+token(),'Content-Type':file.type||'image/jpeg','x-upsert':'false'},
      body:file
    });
    if(!r.ok)throw new Error(await r.text());
    return path;
  }
  async function attachPrivateImage(path,img){
    if(!path||!registered())return;
    try{
      const r=await fetch(U+'/storage/v1/object/authenticated/sonayell-memos/'+path,{headers:{apikey:K,Authorization:'Bearer '+token()}});
      if(!r.ok)return;
      img.src=URL.createObjectURL(await r.blob());
    }catch(e){}
  }
  async function deleteStorageImage(path){
    if(!path||!registered())return;
    try{await fetch(U+'/storage/v1/object/sonayell-memos/'+path,{method:'DELETE',headers:{apikey:K,Authorization:'Bearer '+token()}})}catch(e){}
  }

  async function renderMemos(){
    const s=createSubScreen('memoScreen','📝 フリーメモ');
    const box=s.querySelector('.mySubBody');
    box.innerHTML=`
      <div class="memoComposer">
        <h2 class="sectionTitle">自由に残しておけるメモ</h2>
        <textarea id="memoText" maxlength="2000" placeholder="家族の薬、避難について決めたこと、ペットのことなど自由にどうぞ"></textarea>
        <div class="memoPhotoRow"><input class="memoFile" id="memoPhoto" type="file" accept="image/*"></div>
        <button class="primaryBtn" id="memoSaveBtn">保存する</button>
        <div class="tinyNote">${registered()?'文字と写真をアカウントに保存します。':'ゲスト中はこの端末だけに保存します。登録後のクラウド引き継ぎは今後対応予定です。'}</div>
      </div>
      <div id="memoList"><div class="myEmpty">メモを読み込み中…</div></div>`;
    openScreen(s);
    const list=box.querySelector('#memoList');
    let rows=[];
    try{
      if(registered()) rows=await rpc('sona_list_my_memos',{})||[];
      else rows=readGuestMemos();
    }catch(e){list.innerHTML='<div class="myEmpty">メモを読み込めませんでした。</div>';return}
    renderMemoList(list,rows);
    box.querySelector('#memoSaveBtn').onclick=async()=>{
      const text=box.querySelector('#memoText').value.trim();
      const file=box.querySelector('#memoPhoto').files[0]||null;
      if(!text){alert('メモを入力してね。');return}
      const btn=box.querySelector('#memoSaveBtn');btn.disabled=true;btn.textContent='保存中…';
      try{
        if(registered()){
          const path=await uploadMemoImage(file);
          await rpc('sona_create_my_memo',{p_body:text,p_image_path:path||null});
        }else{
          let img='';
          if(file){
            if(file.size>900*1024)throw new Error('ゲスト中の写真は900KB以下にしてね');
            img=await fileDataUrl(file);
          }
          const v=readGuestMemos();
          v.unshift({id:'g-'+Date.now(),body:text,image_data:img,created_at:new Date().toISOString()});
          writeGuestMemos(v.slice(0,30));
        }
        await renderMemos();
      }catch(e){alert(e.message||'メモを保存できませんでした。')}
      finally{btn.disabled=false;btn.textContent='保存する'}
    };
  }

  function renderMemoList(list,rows){
    if(!rows.length){list.innerHTML='<div class="myEmpty">まだメモはありません。<br>家族の薬やペットのことなど、自由に使ってね。</div>';return}
    list.innerHTML=rows.map(m=>`<article class="memoCard" data-memo="${m.id}">
      <div class="memoDate">${fmtDate(m.created_at)}</div>
      <div class="memoBody">${esc(m.body||'')}</div>
      ${(m.image_path||m.image_data)?'<img class="memoImg" alt="メモの写真">':''}
      <button class="memoDelete">削除</button>
    </article>`).join('');
    rows.forEach(m=>{
      const card=list.querySelector(`[data-memo="${CSS.escape(String(m.id))}"]`);
      if(!card)return;
      const img=card.querySelector('.memoImg');
      if(img){
        if(m.image_data)img.src=m.image_data;
        else attachPrivateImage(m.image_path,img);
      }
      card.querySelector('.memoDelete').onclick=async()=>{
        if(!confirm('このメモを削除しますか？'))return;
        try{
          if(registered()){
            if(m.image_path)await deleteStorageImage(m.image_path);
            await rpc('sona_delete_my_memo',{p_id:Number(m.id)});
          }else{
            writeGuestMemos(readGuestMemos().filter(x=>String(x.id)!==String(m.id)));
          }
          await renderMemos();
        }catch(e){alert('削除できませんでした。')}
      };
    });
  }

  function renderSettings(){
    const s=createSubScreen('settingsScreen','⚙️ 設定');
    const box=s.querySelector('.mySubBody');
    openScreen(s);
    const oldCard=document.querySelector('#profileScreen .profileCard') || document.querySelector('#settingsScreen .profileCard');
    if(oldCard){
      if(!box.querySelector('.settingsCard')){
        box.insertAdjacentHTML('afterbegin','<div class="settingsCard"><h3>プロフィール設定</h3><p>ニックネーム・居住地域・投稿アイコンを変更できます。</p></div>');
      }
      if(oldCard.parentElement!==box) box.appendChild(oldCard);
      oldCard.style.display='block';
    }else{
      box.innerHTML='<div class="myEmpty">設定を読み込めませんでした。</div>';
    }
  }

  function renderHelp(){
    const s=createSubScreen('helpScreen','❓ ヘルプ・お問い合わせ');
    const box=s.querySelector('.mySubBody');
    box.innerHTML=`
      <div class="helpCard"><h3>ヘルプ</h3>
        <p>そなYELLは、普段の備え・学び・みんなの防災投稿を通して、少しずつ防災を続けるためのアプリです。</p>
        <p>困った時は、このお問い合わせから内容を送れます。</p>
      </div>
      <div class="helpCard"><h3>お問い合わせ</h3>
        <input id="contactEmail" type="email" maxlength="200" placeholder="返信が必要な場合のメールアドレス（任意）">
        <textarea id="inquiryText" maxlength="2000" placeholder="お問い合わせ内容"></textarea>
        <button class="primaryBtn" id="inquirySend">送信する</button>
        <div id="inquiryStatus" class="tinyNote"></div>
      </div>`;
    openScreen(s);
    box.querySelector('#inquirySend').onclick=async()=>{
      const body=box.querySelector('#inquiryText').value.trim();
      const email=box.querySelector('#contactEmail').value.trim();
      if(!body){alert('お問い合わせ内容を入力してね。');return}
      const b=box.querySelector('#inquirySend');b.disabled=true;b.textContent='送信中…';
      try{
        await rpc('sona_send_inquiry',{p_guest_token:guestToken(),p_contact_email:email||null,p_body:body});
        box.querySelector('#inquiryText').value='';
        box.querySelector('#inquiryStatus').textContent='送信しました。ありがとうございます。';
      }catch(e){alert('お問い合わせを送信できませんでした。')}
      finally{b.disabled=false;b.textContent='送信する'}
    };
  }

  function buildMyPage(){
    ensureStyle();
    const ps=profileScreen();
    if(!ps)return false;
    const main=ps.querySelector('.pageContent');
    const summary=document.getElementById('profileSummary');
    const card=ps.querySelector('.profileCard');
    if(!main||!summary||!card)return false;
    if(ps.dataset.mypageV2==='1')return true;
    ps.dataset.mypageV2='1';

    const oldBack=document.getElementById('profileBack');
    if(oldBack) oldBack.onclick=()=>openScreen(homeScreen());

    const menu=document.createElement('div');
    menu.className='myMenu';
    menu.innerHTML=`
      <button class="myMenuBtn" id="myPostsBtn">📝 自分の投稿一覧 <span>›</span></button>
      <button class="myMenuBtn" id="savedPostsBtn">🔖 保存した投稿 <span>›</span></button>
      <button class="myMenuBtn memo" id="freeMemoBtn">📝 フリーメモ <span>文字・写真 ›</span></button>
      <button class="myMenuBtn" id="settingsBtn">⚙️ 設定 <span>›</span></button>
      <button class="myMenuBtn" id="helpBtn">❓ ヘルプ・お問い合わせ <span>›</span></button>`;
    summary.insertAdjacentElement('afterend',menu);
    card.style.display='none';

    document.getElementById('myPostsBtn').onclick=renderMyPosts;
    document.getElementById('savedPostsBtn').onclick=renderSavedPosts;
    document.getElementById('freeMemoBtn').onclick=renderMemos;
    document.getElementById('settingsBtn').onclick=renderSettings;
    document.getElementById('helpBtn').onclick=renderHelp;
    return true;
  }

  function installSaveStatus(){
    try{
      const btn=document.getElementById('profileSave');
      if(!btn||btn.dataset.profilePatch==='1')return !!btn;
      btn.dataset.profilePatch='1';
      function ensureStatus(){
        let box=document.getElementById('profileSaveStatus');
        if(!box){
          box=document.createElement('div');
          box.id='profileSaveStatus';
          box.style.cssText='display:none;margin-top:10px;padding:11px 13px;border-radius:12px;background:#eef8e9;color:#397a44;font-weight:700;font-size:13px;text-align:center';
          btn.insertAdjacentElement('afterend',box);
        }
        return box;
      }
      const status=ensureStatus();
      btn.addEventListener('click',()=>{
        setTimeout(()=>{
          status.textContent='🌱 保存しました。次の投稿から新しいプロフィールで表示されます。';
          status.style.display='block';
          setTimeout(()=>{status.style.display='none'},4000);
        },500);
      },true);
      return true;
    }catch(e){return false}
  }

  function install(){
    const a=buildMyPage();
    const b=installSaveStatus();
    return a&&b;
  }
  if(!install()){
    let n=0;
    const t=setInterval(()=>{if(install()||++n>80)clearInterval(t)},100);
  }
})();