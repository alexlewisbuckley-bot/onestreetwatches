/* ================= THE CASE — filtering ================= */
const uniq=k=>[...new Set(CATALOGUE.map(w=>w[k]))];
const countBy=(k,v)=>CATALOGUE.filter(w=>w[k]===v).length;
const bounds=k=>[Math.min(...CATALOGUE.map(w=>w[k])), Math.max(...CATALOGUE.map(w=>w[k]))];

const B={aed:bounds('aed'), y:bounds('y'), size:bounds('size')};
const round=(v,s)=>Math.round(v/s)*s;
B.aed=[round(B.aed[0]-2000,1000), round(B.aed[1]+10000,10000)];

const F={brand:new Set(),fam:new Set(),cat:new Set(),dial:new Set(),cond:new Set(),loc:new Set(),kit:new Set()};
const R={aed:[...B.aed], y:[...B.y], size:[...B.size]};
let Q='';

/* ---------- markup builders ---------- */
const fmt={
  aed:v=>money(v),
  y:v=>String(v),
  size:v=>v+' mm'
};
function rangeGroup(title,key,step,note){
  return `<div class="fgroup"><button class="fhead">${title}<b></b><span>⌄</span></button>
    <div class="fbody"><div class="rng" data-r="${key}" data-step="${step}">
      <div class="rngval"><span class="lo"></span><em>to</em><span class="hi"></span></div>
      ${key==='aed'?'<div class="rnghist"></div>':''}
      <div class="rngtrack"><div class="rngfill"></div>
        <button class="rngh lo" aria-label="Minimum ${title}"></button>
        <button class="rngh hi" aria-label="Maximum ${title}"></button></div>
      <div class="rngends"><span class="e0"></span><span class="e1"></span></div>
      ${note?`<div class="rngends" style="margin-top:6px">${note}</div>`:''}
      <span class="rngreset">Reset</span>
    </div></div></div>`;
}
const checkRows=(key,items)=>items.map(i=>`<label class="frow" data-k="${key}" data-v="${i.v}">
      <input type="checkbox"><span class="fbx"></span>
      ${i.sw!==undefined?`<span class="fsw" style="background:${i.sw||'transparent'};${i.sw?'':'box-shadow:inset 0 0 0 1px rgba(28,27,25,.4)'}"></span>`:''}
      <span class="fl">${i.l}</span><em>${i.c!==undefined?i.c:''}</em></label>`).join('');
function checkGroup(title,key,items,bodyId){
  return `<div class="fgroup"><button class="fhead">${title}<b></b><span>⌄</span></button>
    <div class="fbody list"${bodyId?` id="${bodyId}"`:''}>${checkRows(key,items)}</div></div>`;
}
function segGroup(title,key,items){
  return `<div class="fgroup"><button class="fhead">${title}<b></b><span>⌄</span></button>
    <div class="fbody"><div class="segs">`+
    items.map(i=>`<button data-k="${key}" data-v="${i.v}" aria-pressed="false">${i.l}</button>`).join('')+
    `</div></div></div>`;
}

/* families available under the current maison selection — keeps the
   model list short instead of listing every family we have ever held */
function famPool(){
  const pool = F.brand.size ? CATALOGUE.filter(w=>F.brand.has(w.b)) : CATALOGUE;
  return [...new Set(pool.map(famOf))].sort()
    .map(f=>({v:f,l:f,c:pool.filter(w=>famOf(w)===f).length}));
}
function paintFam(){
  const body=document.getElementById('fambody'); if(!body) return;
  body.innerHTML=checkRows('fam',famPool());
  bindRows(body);
}
function bindRows(scope){
  scope.querySelectorAll('.frow').forEach(r=>{
    if(r.dataset.bound) return; r.dataset.bound=1;
    r.addEventListener('click',e=>{e.preventDefault();toggle(r.dataset.k,r.dataset.v);});
  });
}

function buildRail(){
  const brands=uniq('b').map(b=>({v:b,l:b,c:countBy('b',b)}));
  const dials=DIALS().map(([n,hex,c])=>({v:n,l:n,c,sw:hex}));
  const cats=CATS().map(([c,n])=>({v:c,l:c,c:n}));
  document.getElementById('rail').innerHTML=
    rangeGroup('Budget','aed',1000)+
    checkGroup('Maison','brand',brands)+
    checkGroup('Model','fam',famPool(),'fambody')+
    checkGroup('Type','cat',cats)+
    rangeGroup('Year of production','y',1)+
    rangeGroup('Case size','size',1,'Measured across the case, excluding the crown.')+
    checkGroup('Dial','dial',dials)+
    segGroup('Box &amp; papers','kit',[{v:'full',l:'Full set'},{v:'box',l:'Box'},{v:'pap',l:'Papers'}])+
    segGroup('Condition','cond',['Unworn','Excellent','Very good','Good'].filter(c=>countBy('c',c)).map(c=>({v:c,l:c})))+
    segGroup('Held in','loc',uniq('loc').map(l=>({v:l,l:l})))+
    `<div class="fclear" id="clear">Clear all filters</div>`;
  // collapse the secondary groups by default — the rail stays short
  document.querySelectorAll('.fgroup').forEach((g,i)=>{ if(i>1) g.classList.add('shut'); });
  document.querySelectorAll('.fhead').forEach(h=>h.addEventListener('click',()=>h.parentElement.classList.toggle('shut')));
  bindRows(document);
  document.querySelectorAll('.segs button').forEach(b=>b.addEventListener('click',()=>toggle(b.dataset.k,b.dataset.v)));
  document.getElementById('clear').addEventListener('click',()=>{
    Object.keys(F).forEach(k=>F[k].clear());
    R.aed=[...B.aed];R.y=[...B.y];R.size=[...B.size];
    Q=''; const q=document.getElementById('q'); if(q) q.value='';
    history.replaceState(null,'','shop.html');
    paintFam();
    document.querySelectorAll('.rng').forEach(paintRange); render();});
  document.querySelectorAll('.rng').forEach(initRange);
}

/* open any group that arrived with a filter already applied */
function revealActive(){
  document.querySelectorAll('.fgroup').forEach(g=>{
    if(g.classList.contains('has')) g.classList.remove('shut');
  });
}

/* ---------- deep links from the mega menu, search and home page ---------- */
function applyURL(){
  const p=new URLSearchParams(location.search);
  const take=(param,key)=>{const v=p.get(param); if(v) v.split(',').forEach(x=>F[key].add(x));};
  take('brand','brand'); take('fam','fam'); take('cat','cat');
  take('dial','dial'); take('cond','cond'); take('loc','loc'); take('kit','kit');
  ['aed','y','size'].forEach(k=>{
    const v=p.get(k); if(!v) return;
    const m=v.split('-');
    const lo=m[0]===''||m[0]==null?B[k][0]:+m[0];
    const hi=m[1]===''||m[1]==null?B[k][1]:+m[1];
    if(isNaN(lo)||isNaN(hi)) return;
    const a=Math.max(B[k][0],Math.min(lo,B[k][1])), b=Math.min(B[k][1],Math.max(hi,B[k][0]));
    R[k] = a<=b ? [a,b] : [...B[k]];
  });
  Q=(p.get('q')||'').trim();
  if(Q){ const q=document.getElementById('q'); if(q) q.value=Q; }
  const s=p.get('sort'), sel=document.getElementById('sort');
  if(s && sel && [...sel.options].some(o=>o.value===s)) sel.value=s;
}

/* the page tells you what you clicked, not just "The case" */
function paintHead(){
  const h=document.getElementById('shopTitle'), c=document.getElementById('crumbTail');
  if(!h) return;
  const bits=[];
  if(F.brand.size) bits.push([...F.brand].join(', '));
  if(F.fam.size) bits.push([...F.fam].join(', '));
  if(!bits.length && F.cat.size) bits.push([...F.cat].join(', '));
  if(!bits.length && F.dial.size) bits.push([...F.dial].join(', ')+' dials');
  if(!bits.length && F.loc.size) bits.push([...F.loc].map(l=>'Held in '+l).join(', '));
  if(!bits.length && F.cond.size) bits.push([...F.cond].join(', '));
  if(!bits.length && Q) bits.push('“'+Q+'”');
  const title = bits.length ? bits.join(' — ') : 'The case';
  h.textContent=title;
  if(c) c.textContent = bits.length ? title : 'All watches';
}

/* ---------- range slider ---------- */
function initRange(el){
  const key=el.dataset.r, step=+el.dataset.step, [min,max]=B[key];
  const track=el.querySelector('.rngtrack');
  el.querySelector('.e0').textContent=fmt[key](min);
  el.querySelector('.e1').textContent=fmt[key](max);
  const fromX=x=>{
    const r=track.getBoundingClientRect();
    let v=min+((x-r.left)/r.width)*(max-min);
    return Math.min(max,Math.max(min,round(v,step)));
  };
  let drag=null;
  const start=(h,e)=>{drag=h;track.setPointerCapture?.(e.pointerId);e.preventDefault();};
  el.querySelector('.rngh.lo').addEventListener('pointerdown',e=>start('lo',e));
  el.querySelector('.rngh.hi').addEventListener('pointerdown',e=>start('hi',e));
  const move=e=>{
    if(!drag) return;
    const v=fromX(e.clientX);
    if(drag==='lo') R[key][0]=Math.min(v,R[key][1]-step);
    else            R[key][1]=Math.max(v,R[key][0]+step);
    paintRange(el); scheduleRender();
  };
  addEventListener('pointermove',move);
  addEventListener('pointerup',()=>{if(drag){drag=null;render();}});
  track.addEventListener('pointerdown',e=>{
    if(e.target.classList.contains('rngh')) return;
    const v=fromX(e.clientX);
    const d0=Math.abs(v-R[key][0]), d1=Math.abs(v-R[key][1]);
    if(d0<d1) R[key][0]=Math.min(v,R[key][1]-step); else R[key][1]=Math.max(v,R[key][0]+step);
    paintRange(el); render();
  });
  [['lo',0],['hi',1]].forEach(([cls,i])=>{
    el.querySelector('.rngh.'+cls).addEventListener('keydown',e=>{
      const d=e.key==='ArrowRight'?step:e.key==='ArrowLeft'?-step:0; if(!d) return;
      e.preventDefault();
      R[key][i]=Math.min(max,Math.max(min,R[key][i]+d));
      if(R[key][0]>R[key][1]-step) R[key][i===0?0:1]=i===0?R[key][1]-step:R[key][0]+step;
      paintRange(el); render();
    });
  });
  el.querySelector('.rngreset').addEventListener('click',()=>{R[key]=[...B[key]];paintRange(el);render();});
  const hist=el.querySelector('.rnghist');
  if(hist){
    const N=22, st=(max-min)/N;
    const buckets=Array.from({length:N},(_,i)=>CATALOGUE.filter(w=>w.aed>=min+i*st && w.aed<min+(i+1)*st).length);
    const peak=Math.max(1,...buckets);
    hist.innerHTML=buckets.map(c=>
      `<i data-c="${c}" style="height:${Math.max(2,(c/peak)*34)}px"></i>`).join('');
  }
  paintRange(el);
}
function paintRange(el){
  const key=el.dataset.r, [min,max]=B[key], [a,b]=R[key];
  const p=v=>((v-min)/(max-min))*100;
  el.querySelector('.rngfill').style.left=p(a)+'%';
  el.querySelector('.rngfill').style.right=(100-p(b))+'%';
  el.querySelector('.rngh.lo').style.left=p(a)+'%';
  el.querySelector('.rngh.hi').style.left=p(b)+'%';
  el.querySelector('.lo').textContent=fmt[key](a);
  el.querySelector('.hi').textContent=fmt[key](b);
  el.classList.toggle('dirty', a!==min || b!==max);
  el.querySelector('.e0').textContent=fmt[key](min);
  el.querySelector('.e1').textContent=fmt[key](max);
  const hist=el.querySelector('.rnghist');
  if(hist && hist.children.length){
    const N=hist.children.length, st=(max-min)/N;
    for(let i=0;i<N;i++){
      const bar=hist.children[i], has=bar.dataset.c!=='0';
      const inRange = (min+(i+1)*st)>a && (min+i*st)<b;
      bar.classList.toggle('hit', has && inRange);
      bar.classList.toggle('on',  has && !inRange);
    }
  }
}
let raf=0;
const scheduleRender=()=>{ if(raf) return; raf=requestAnimationFrame(()=>{raf=0;render();}); };

/* ---------- state ---------- */
function toggle(k,v){
  F[k].has(v)?F[k].delete(v):F[k].add(v);
  if(k==='brand'){
    /* drop model choices that no longer belong to any selected maison */
    if(F.brand.size) [...F.fam].forEach(f=>{
      if(!CATALOGUE.some(w=>F.brand.has(w.b)&&famOf(w)===f)) F.fam.delete(f);
    });
    paintFam();
  }
  render();
}
function matches(w){
  if(F.brand.size && !F.brand.has(w.b)) return false;
  if(F.fam.size && !F.fam.has(famOf(w))) return false;
  if(F.cat.size && !(w.cat||[]).some(c=>F.cat.has(c))) return false;
  if(F.dial.size && !F.dial.has(w.dial)) return false;
  if(F.cond.size && !F.cond.has(w.c)) return false;
  if(F.loc.size && !F.loc.has(w.loc)) return false;
  for(const k of F.kit){
    if(k==='box' && !w.box) return false;
    if(k==='pap' && !w.pap) return false;
    if(k==='full' && !(w.box&&w.pap)) return false;
  }
  if(w.aed<R.aed[0]||w.aed>R.aed[1]) return false;
  if(w.y<R.y[0]||w.y>R.y[1]) return false;
  if(w.size<R.size[0]||w.size>R.size[1]) return false;
  if(Q && !(w.b+' '+w.m+' '+w.r+' '+w.dial+' '+w.y+' '+w.loc).toLowerCase().includes(Q.toLowerCase())) return false;
  return true;
}
const CHIPLABEL={
  kit:{box:'Box included',pap:'Papers included',full:'Full set'},
  loc:v=>'In '+v
};
function activeChips(){
  const out=[];
  if(Q) out.push(`<span class="pill2" data-t="q">“${Q}” <i>×</i></span>`);
  for(const k of Object.keys(F)) for(const v of F[k]){
    const map=CHIPLABEL[k];
    const txt = typeof map==='function' ? map(v) : (map && map[v]) || v;
    out.push(`<span class="pill2" data-t="set" data-k="${k}" data-v="${v}">${txt} <i>×</i></span>`);
  }
  for(const k of ['aed','y','size']){
    if(R[k][0]!==B[k][0]||R[k][1]!==B[k][1])
      out.push(`<span class="pill2" data-t="rng" data-k="${k}">${fmt[k](R[k][0])} – ${fmt[k](R[k][1])} <i>×</i></span>`);
  }
  const el=document.getElementById('active');
  el.innerHTML=out.join('');
  el.querySelectorAll('.pill2').forEach(p=>p.addEventListener('click',()=>{
    if(p.dataset.t==='rng'){ R[p.dataset.k]=[...B[p.dataset.k]];
      document.querySelectorAll('.rng').forEach(paintRange); }
    else if(p.dataset.t==='q'){ Q=''; const q=document.getElementById('q'); if(q) q.value=''; }
    else { F[p.dataset.k].delete(p.dataset.v); if(p.dataset.k==='brand') paintFam(); }
    render();
  }));
}
function syncControls(){
  document.querySelectorAll('.frow').forEach(r=>{
    const on=F[r.dataset.k].has(r.dataset.v);
    r.querySelector('input').checked=on; r.classList.toggle('on',on);});
  document.querySelectorAll('.segs button').forEach(b=>
    b.setAttribute('aria-pressed', String(F[b.dataset.k].has(b.dataset.v))));
  document.querySelectorAll('.fgroup').forEach(g=>{
    const badge=g.querySelector('.fhead b'); if(!badge) return;
    let n=0;
    g.querySelectorAll('.frow').forEach(r=>{ if(F[r.dataset.k].has(r.dataset.v)) n++; });
    g.querySelectorAll('.segs button').forEach(b=>{ if(F[b.dataset.k].has(b.dataset.v)) n++; });
    const rng=g.querySelector('.rng');
    if(rng){ const k=rng.dataset.r; if(R[k][0]!==B[k][0]||R[k][1]!==B[k][1]) n=1; }
    badge.textContent=n||''; g.classList.toggle('has', n>0);
  });
}
/* The grid is built once and never torn down again. Filtering toggles
   [hidden] and reorders with CSS `order`, so images are never re-decoded
   and cards never flash — the old code rebuilt all 24 cards on every click. */
let CARDS=null;
function buildGrid(){
  const grid=document.getElementById('pgrid');
  grid.innerHTML=CATALOGUE.map((w,i)=>productCard(w,i)).join('');
  CARDS=[...grid.children];
  CARDS.forEach((c,i)=>c.setAttribute('href','product.html?i='+i));
  bindZones(grid);
}
function render(){
  if(!CARDS) return;                 /* core.js repaints currency before the grid exists */
  let list=CATALOGUE.map((w,i)=>({w,i})).filter(o=>matches(o.w));
  const s=document.getElementById('sort').value;
  if(s==='plow') list.sort((a,b)=>a.w.aed-b.w.aed);
  if(s==='phigh') list.sort((a,b)=>b.w.aed-a.w.aed);
  if(s==='year') list.sort((a,b)=>b.w.y-a.w.y);
  const shown=new Map(list.map((o,n)=>[o.i,n]));
  for(let i=0;i<CARDS.length;i++){
    const n=shown.get(i);
    const off=n===undefined;
    if(CARDS[i].hidden!==off) CARDS[i].hidden=off;
    if(!off && CARDS[i].style.order!=n) CARDS[i].style.order=n;
  }
  document.getElementById('cnt').textContent=list.length;
  document.getElementById('ofTotal').textContent = list.length===CATALOGUE.length?'':'of '+CATALOGUE.length;
  document.getElementById('empty').style.display=list.length?'none':'block';
  activeChips(); syncControls(); paintHead();
  document.querySelectorAll('.rng').forEach(el=>paintRange(el));
}
window.onCurrency=()=>{document.querySelectorAll('.rng').forEach(paintRange);if(CARDS)render();};
document.addEventListener('DOMContentLoaded',()=>{
  applyURL();
  buildGrid();
  buildRail();
  document.getElementById('sort').addEventListener('change',render);
  render();
  revealActive();
});
