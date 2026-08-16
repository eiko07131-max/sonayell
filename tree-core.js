(function(){
  function cycle(total){
    total=Math.max(0,Number(total)||0);
    if(total===0)return{total:0,step:0,grown:0};
    const rem=total%50;
    return{total,step:rem===0?50:rem,grown:Math.floor(total/50)};
  }

  function ensureStyle(d){
    if(d.getElementById('sonayellTreeCoreStyle'))return;
    const s=d.createElement('style');
    s.id='sonayellTreeCoreStyle';
    s.textContent='.yellBadge,.treeYell{display:none!important}';
    d.head.appendChild(s);
  }

  function render(w){
    const d=w.document;
    if(!d)return;
    ensureStyle(d);
    let total=0;
    try{ total=Math.max(0,Number(w.state&&w.state.yell)||0); }catch(e){}
    const c=cycle(total),step=c.step,max=50;
    const emoji=d.getElementById('myTreeEmoji');
    if(emoji)emoji.textContent=step>=50?'🌳':step>=25?'🌿':'🌱';
    const progress=d.getElementById('treeProgressText');
    if(progress)progress.textContent=step+' / '+max;
    const leaves=d.getElementById('treeLeaves');
    if(leaves){
      leaves.innerHTML='';
      for(let i=0;i<max;i++){
        const leaf=d.createElement('span');
        leaf.className='treeLeaf'+(i<step?' on':'');
        leaf.textContent='🍃';
        leaves.appendChild(leaf);
      }
    }
    const remain=d.getElementById('treeRemain');
    if(remain){
      if(step===50){
        remain.innerHTML='🎉 大樹になったよ！<br><small>次の一歩から、新しい木を育てよう。</small>';
      }else{
        const left=max-step;
        const grown=c.grown>0?'<small>🌳 育てた大樹 '+c.grown+'本</small><br>':'';
        remain.innerHTML=grown+'次の大樹まであと <strong>'+left+'</strong> YELL！<br><small>一歩ずつ、木を育てよう。</small>';
      }
    }
  }

  function install(w){
    if(!w||!w.document)return false;
    ensureStyle(w.document);
    w.renderMyTree=function(){render(w)};
    w.SonaYellTreeCore={cycle:function(total){return cycle(total)},render:function(){render(w)}};
    render(w);
    return true;
  }

  window.SonaYellTreeCore={install,cycle};
})();