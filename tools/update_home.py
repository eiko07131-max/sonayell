from pathlib import Path
import re

path = Path('index.html')
html = path.read_text(encoding='utf-8')

new_section = r'''<section id="homeScreen" class="screen">
<header class="header"><div class="headerLogo">🌱 そなYELL</div><div class="yellBadge">YELL 🌟 <span class="yellCount">0</span></div></header>
<main class="pageContent homePage">
  <div class="welcomeCard homeWelcome">
    <div class="homeSun">☀️</div>
    <p class="homeGreeting">おかえりなさい！</p>
    <h2>今日も一歩、そなえよう！</h2>
    <p>小さな備えが、未来の安心につながるよ。</p>
  </div>

  <div class="homeToday">
    <div class="todayLabel">🌱 TODAY'S SONAE</div>
    <h3>今日の一歩を、ひとつだけ。</h3>
    <p>全部やらなくて大丈夫。<br><strong>今日は「知る」だけでも立派な備えだよ。</strong></p>
    <button class="todayButton" onclick="showScreen('encyclopediaScreen')">📖 防災図鑑から一歩選ぶ <span>›</span></button>
  </div>

  <div class="homeProgressCard">
    <div class="homeProgressHead"><span>🏠 我が家の備え</span><strong><span id="homePrepareProgress">0 / 5</span></strong></div>
    <div class="homeMiniBar"><span id="homePrepareBar"></span></div>
    <p id="homePrepareMessage">まずは、気になるカテゴリーをひとつ選んでみよう。</p>
    <button class="mainButton" onclick="showScreen('prepareScreen')">備えをチェックする <span>→</span></button>
  </div>

  <div class="homeGrid">
    <button class="homeFeature" onclick="showScreen('encyclopediaScreen')"><div class="featureIcon">📖</div><div><strong>防災図鑑</strong><small>知りたいことを探そう</small></div><span>›</span></button>
    <button class="homeFeature" onclick="showScreen('forestScreen')"><div class="featureIcon">🌳</div><div><strong>みんなのYELL</strong><small>みんなの一歩で森が育つ</small></div><span>›</span></button>
  </div>

  <div class="homeMotto">
    <div class="mottoLeaf">🍃</div>
    <div><strong>一人の100点より、みんなの一歩。</strong><p>できることから、少しずつ。</p></div>
  </div>
</main>
</section>'''

pattern = re.compile(r'<section id="homeScreen" class="screen">.*?</section>', re.S)
new_html, n = pattern.subn(new_section, html, count=1)
if n != 1:
    raise SystemExit('homeScreen section not found exactly once')

styles = r'''
<style id="reinforced-home-styles">
.homePage{padding-top:16px}.homeWelcome{position:relative;overflow:hidden;padding:20px 18px 19px}.homeSun{position:absolute;right:18px;top:12px;font-size:42px;opacity:.72}.homeGreeting{margin:0 0 2px!important;color:#78907a;font-size:12px!important;font-weight:bold}.homeWelcome h2{margin:0 0 6px!important;font-size:22px}.homeWelcome p:last-child{font-size:13px!important}.homeToday{margin-top:14px;background:linear-gradient(135deg,#edf9e9,#fff8d9);border:1px solid #dbead5;border-radius:22px;padding:17px 16px;box-shadow:0 4px 14px rgba(50,90,50,.07)}.todayLabel{display:inline-block;background:#4e9956;color:#fff;border-radius:99px;padding:5px 9px;font-size:10px;font-weight:bold;letter-spacing:.5px}.homeToday h3{margin:10px 0 5px;color:#397a44;font-size:18px}.homeToday p{margin:0 0 12px;font-size:13px;line-height:1.65;color:#527056}.todayButton{width:100%;display:flex;justify-content:space-between;align-items:center;padding:12px 13px;border-radius:15px;background:#fff;color:#397a44;box-shadow:0 3px 10px rgba(50,90,50,.07);font-weight:bold;text-align:left}.todayButton span{font-size:22px}.homeProgressCard{margin-top:14px;padding:17px;background:#fff;border-radius:22px;box-shadow:0 4px 15px rgba(50,90,50,.08)}.homeProgressHead{display:flex;justify-content:space-between;align-items:center;color:#397a44;font-size:14px;font-weight:bold}.homeMiniBar{height:9px;background:#e4efdf;border-radius:99px;overflow:hidden;margin:9px 0 8px}.homeMiniBar span{display:block;width:0;height:100%;background:#4e9956;border-radius:99px;transition:width .3s}.homeProgressCard p{margin:0 0 12px;color:#78907a;font-size:12px;line-height:1.5}.homeProgressCard .mainButton{display:flex;justify-content:center;gap:8px}.homeGrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}.homeFeature{min-width:0;display:flex;align-items:center;gap:9px;text-align:left;padding:14px 11px;background:#fff;border-radius:19px;box-shadow:0 3px 12px rgba(50,90,50,.07);color:#397a44}.featureIcon{width:42px;height:42px;flex:0 0 42px;display:flex;align-items:center;justify-content:center;background:#edf7e9;border-radius:14px;font-size:25px}.homeFeature strong{display:block;font-size:14px}.homeFeature small{display:block;margin-top:3px;color:#78907a;font-size:10px;line-height:1.35}.homeFeature>span{margin-left:auto;font-size:23px;color:#4e9956}.homeMotto{display:flex;align-items:center;gap:11px;margin-top:13px;padding:14px 15px;background:rgba(255,255,255,.72);border-radius:18px;color:#4b7651}.mottoLeaf{font-size:25px}.homeMotto strong{font-size:13px}.homeMotto p{margin:3px 0 0;font-size:11px;color:#78907a}@media(max-width:430px){.homeGrid{grid-template-columns:1fr}.homeWelcome h2{font-size:20px}}
</style>
'''

if 'id="reinforced-home-styles"' not in new_html:
    new_html = new_html.replace('</head>', styles + '</head>', 1)
else:
    new_html = re.sub(r'<style id="reinforced-home-styles">.*?</style>', styles.strip(), new_html, count=1, flags=re.S)

# Add a lightweight home progress sync before the closing script tag if the function is available.
sync = r'''
<script id="home-progress-sync">
(function(){
  window.syncHomeProgress=function(){
    try{
      var done=Number(localStorage.getItem('sonayell_prepare_done')||0);
      var total=5;
      var text=document.getElementById('homePrepareProgress');
      var bar=document.getElementById('homePrepareBar');
      var msg=document.getElementById('homePrepareMessage');
      if(text)text.textContent=Math.min(done,total)+' / '+total;
      if(bar)bar.style.width=(Math.min(done,total)/total*100)+'%';
      if(msg)msg.textContent=done>=total?'🎉 我が家の備え、コンプリート！次は知識をひとつ育てよう。':done>0?'いい一歩！この調子で、もうひとつ進めてみよう。':'まずは、気になるカテゴリーをひとつ選んでみよう。';
    }catch(e){}
  };
  window.addEventListener('load',syncHomeProgress);
  setTimeout(syncHomeProgress,300);
})();
</script>
'''
if 'id="home-progress-sync"' not in new_html:
    new_html = new_html.replace('</body>', sync + '</body>', 1)

path.write_text(new_html, encoding='utf-8')
print('reinforced home')
