from pathlib import Path
import re

# 防災図鑑ビルド: 既存のアプリ本体を壊さず対象セクションだけ更新します。
path = Path('index.html')
html = path.read_text(encoding='utf-8')

new_section = r'''<section id="encyclopediaScreen" class="screen">
<header class="header"><div class="headerLogo">🌱 そなYELL</div><div class="yellBadge">YELL 🌟 <span class="yellCount">0</span></div></header>
<main class="pageContent encyclopediaPage">
<button class="backButton" onclick="showScreen('homeScreen')">← ホームへ戻る</button>
<div class="encyHero">
  <div class="encyBook">📖</div>
  <h2 class="pageTitle">防災図鑑</h2>
  <p>難しいことを一気に覚えなくて大丈夫。<br><strong>「あれってどうすれば？」</strong>を、ここで見つけよう。</p>
</div>
<div class="encySearchWrap"><span>🔎</span><input id="encySearch" type="search" placeholder="知りたいことを検索…" oninput="filterEncyclopedia()"></div>
<div class="encyQuick" id="encyQuick"><button onclick="filterEncyclopedia('水')">💧 水</button><button onclick="filterEncyclopedia('トイレ')">🚽 トイレ</button><button onclick="filterEncyclopedia('停電')">🔦 停電</button><button onclick="filterEncyclopedia('避難')">🎒 避難</button><button onclick="filterEncyclopedia('連絡')">👨‍👩‍👧 連絡</button></div>
<div class="encyCount" id="encyCount">5件の備え</div>
<div id="encyList" class="encyList">
<article class="encyItem" data-keywords="水 飲み水 生活用水 断水 備蓄" onclick="openEncyclopediaItem(this)"><div class="encyIcon">💧</div><div><span class="tag">水・食料</span><h3>水は飲むだけじゃない</h3><p>飲み水だけでなく、手洗いや生活用水も必要。家族の人数や季節に合わせて備えよう。</p></div><span class="encyArrow">›</span><div class="encyDetail"><strong>まず覚えておきたいこと</strong><p>断水すると、飲み水だけでなく手洗い・調理・清潔を保つ水も必要になるよ。普段から「飲む水」と「生活に使う水」を分けて考えておこう。</p><div class="encyTip">🌱 今日できる一歩：家にある水の本数を数えてみよう。</div></div></article>
<article class="encyItem" data-keywords="トイレ 断水 携帯トイレ 凝固剤" onclick="openEncyclopediaItem(this)"><div class="encyIcon">🚽</div><div><span class="tag">断水</span><h3>トイレは早めの備え</h3><p>断水すると普段のトイレが使えないことがある。携帯トイレの準備と使い方確認を。</p></div><span class="encyArrow">›</span><div class="encyDetail"><strong>まず覚えておきたいこと</strong><p>地震や断水の直後は、見た目では分からない排水管の損傷があることも。安全が確認できるまでは、無理に水を流さないことが大切だよ。</p><div class="encyTip">🌱 今日できる一歩：携帯トイレを家族が見つけられる場所に置こう。</div></div></article>
<article class="encyItem" data-keywords="停電 明かり 電源 ライト 夜" onclick="openEncyclopediaItem(this)"><div class="encyIcon">🔦</div><div><span class="tag">停電</span><h3>明かりは家族分</h3><p>夜の停電では、一人ひとりが安全に動ける明かりがあると安心。置き場所も決めておこう。</p></div><span class="encyArrow">›</span><div class="encyDetail"><strong>まず覚えておきたいこと</strong><p>懐中電灯は「ある」だけでなく「すぐ取れる」が大事。寝室・玄関など、夜に必要な場所を意識して備えよう。</p><div class="encyTip">🌱 今日できる一歩：今夜、暗い中でもライトを取れるか試してみよう。</div></div></article>
<article class="encyItem" data-keywords="避難 持ち出し 防災バッグ 避難所" onclick="openEncyclopediaItem(this)"><div class="encyIcon">🎒</div><div><span class="tag">避難</span><h3>持ち出す物は「使う物」から</h3><p>避難するときに持ち出せる量には限りがある。家族に必要な物を先に決めておこう。</p></div><span class="encyArrow">›</span><div class="encyDetail"><strong>まず覚えておきたいこと</strong><p>防災バッグは重くしすぎず、家族それぞれに必要な物を優先。持ち出す場所も決めておくと、いざという時に迷いにくいよ。</p><div class="encyTip">🌱 今日できる一歩：玄関から30秒で持ち出せる物を確認しよう。</div></div></article>
<article class="encyItem" data-keywords="家族 連絡 安否確認 集合場所 電話" onclick="openEncyclopediaItem(this)"><div class="encyIcon">👨‍👩‍👧</div><div><span class="tag">家族・連絡</span><h3>家族の連絡方法を決めておく</h3><p>災害時は電話がつながりにくいことも。連絡方法と集合場所を平時に決めておこう。</p></div><span class="encyArrow">›</span><div class="encyDetail"><strong>まず覚えておきたいこと</strong><p>「誰に連絡するか」「どこに集まるか」「電話が使えない時はどうするか」を家族で共有しておくと安心だよ。</p><div class="encyTip">🌱 今日できる一歩：家族で集合場所を一つ決めよう。</div></div></article>
</div>
<div id="encyEmpty" class="encyEmpty" hidden>🔎 見つからなかったよ。<br>別の言葉でも探してみてね。</div>
<p class="smallNote">※防災図鑑は、みんなの「知りたい」をもとに少しずつ増やしていくよ。</p>
</main>
<script>
(function(){const list=document.getElementById('encyList');if(!list)return;window.openEncyclopediaItem=function(item){const was=item.classList.contains('open');document.querySelectorAll('.encyItem.open').forEach(x=>x.classList.remove('open'));if(!was)item.classList.add('open');};window.filterEncyclopedia=function(term){const input=document.getElementById('encySearch');if(term!==undefined)input.value=term;const q=(input.value||'').trim().toLowerCase();let shown=0;list.querySelectorAll('.encyItem').forEach(item=>{const hit=!q||(item.dataset.keywords+' '+item.innerText).toLowerCase().includes(q);item.style.display=hit?'flex':'none';if(hit)shown++;});document.getElementById('encyCount').textContent=shown+'件の備え';document.getElementById('encyEmpty').hidden=shown!==0;};})();
</script>
<style>
.encyHero{background:linear-gradient(135deg,#dff4d9,#fff3b8);border-radius:24px;padding:20px;text-align:center;box-shadow:0 5px 18px rgba(50,90,50,.08)}.encyBook{font-size:42px;line-height:1}.encyHero .pageTitle{margin:5px 0}.encyHero p{margin:0;font-size:13px;line-height:1.7}.encySearchWrap{display:flex;align-items:center;gap:8px;margin:16px 0 9px;background:#fff;border-radius:17px;padding:12px 14px;box-shadow:0 3px 12px rgba(50,90,50,.07)}.encySearchWrap input{width:100%;border:0;outline:0;font:inherit;background:transparent;color:#36563b}.encySearchWrap input::placeholder{color:#94a994}.encyQuick{display:flex;gap:7px;overflow-x:auto;padding:2px 1px 9px;scrollbar-width:none}.encyQuick::-webkit-scrollbar{display:none}.encyQuick button{white-space:nowrap;background:#fff;border-radius:99px;padding:8px 12px;color:#4b7651;box-shadow:0 2px 8px rgba(50,90,50,.06);font-size:12px}.encyCount{font-size:12px;color:#78907a;margin:4px 2px 8px}.encyList{display:flex;flex-direction:column;gap:10px}.encyItem{position:relative;display:flex;align-items:flex-start;gap:13px;background:#fff;border-radius:20px;padding:16px 42px 16px 14px;box-shadow:0 3px 12px rgba(50,90,50,.07);cursor:pointer;flex-wrap:wrap}.encyIcon{width:48px;height:48px;display:flex;align-items:center;justify-content:center;flex:0 0 48px;background:#edf7e9;border-radius:15px;font-size:28px}.encyItem>div:nth-child(2){flex:1;min-width:0}.encyItem h3{margin:0 0 5px;color:#397a44;font-size:17px}.encyItem p{margin:0;font-size:12px;line-height:1.65;color:#527056}.encyArrow{position:absolute;right:17px;top:31px;font-size:28px;color:#4e9956}.encyDetail{display:none!important;flex-basis:100%;padding:13px 4px 2px;border-top:1px solid #e6efe2;margin-top:3px}.encyItem.open .encyDetail{display:block!important}.encyItem.open .encyArrow{transform:rotate(90deg)}.encyTip{margin-top:10px;padding:10px 12px;background:#f2f9ed;border-radius:13px;font-size:12px;line-height:1.6}.encyEmpty{margin-top:14px;background:#fff;border-radius:18px;padding:22px;text-align:center;color:#66806a;line-height:1.8}.encyPage>.smallNote{margin-top:15px;text-align:center}
</style>
</section>'''

pattern = re.compile(r'<section id="encyclopediaScreen" class="screen">.*?</section>', re.S)
new_html, n = pattern.subn(new_section, html, count=1)
if n != 1:
    raise SystemExit('encyclopediaScreen section not found exactly once')
if new_html == html:
    raise SystemExit('no change made')
path.write_text(new_html, encoding='utf-8')
print('updated encyclopediaScreen')
