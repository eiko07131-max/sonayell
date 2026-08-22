(function(){
  const KEY='sonayell_v2';
  function read(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return{}}}
  function normalize(s){
    s=s||{};
    let y=Math.max(0,Number(s.yell)||0);
    let trees=Math.max(0,Number(s.greatTrees)||0);
    if(y>=50){trees+=Math.floor(y/50);y=y%50;}
    s.yell=y;
    s.greatTrees=trees;
    return s;
  }
  function write(s){s=normalize(s);localStorage.setItem(KEY,JSON.stringify(s));return s;}
  function add(n){
    n=Math.max(0,Number(n)||0);
    let s=normalize(read());
    const total=s.yell+n;
    const made=Math.floor(total/50);
    s.yell=total%50;
    s.greatTrees=(Number(s.greatTrees)||0)+made;
    s.leaves=(Number(s.leaves)||0)+n;
    s.tree_growth=(Number(s.tree_growth)||0)+n;
    write(s);
    return {state:s,madeTrees:made};
  }
  function get(){return write(read())}
  window.SonaYellCycle={get,add,write,normalize};
  get();
})();