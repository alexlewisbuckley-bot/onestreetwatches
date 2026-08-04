/* ---------------- filters ---------------- */
const uniq=(k)=>[...new Set(CATALOGUE.map(w=>w[k]))];
const countBy=(k,v)=>CATALOGUE.filter(w=>w[k]===v).length;
const PRICE_BANDS=[[0,25000],[25000,50000],[50000,150000],[150000,1e9]];
const F={brand:new Set(),dial:new Set(),size:new Set(),cond:new Set(),loc:new Set(),band:new Set(),kit:new Set()};

const DIALHEX={Black:'#1C1B19',Blue:'#24406B',Green:'#2C5B41',White:'#F4F1EA',Silver:'#C3C2BF',
  Champagne:'#D8C295',Grey:'#8B8A86',Skeleton:'transparent'};

function group(title,key,items,type){
  const body = type==='chip'
    ? `<div class="fchips">${items.map(i=>`<span class="fchip" data-k="${key}" data-v="${i.v}">${i.l}</span>`).join('')}</div>`
    : items.map(i=>`<label class="frow" data-k="${key}" data-v="${i.v}">
        <input type="checkbox"><span class="fbx"></span>
        ${i.sw!==undefined?`<span class="fsw" style="background:${i.sw}"></span>`:''}
        ${i.l}<em>${i.c!==undefined?i.c:''}</em></label>`).join('');
  return `<div class="fgroup"><button class="fhead">${title}<span>⌄</span></button><div class="fbody">${body}</div></div>`;
}
function buildRail(){
  const brands=uniq('b').map(b=>({v:b,l:b,c:countBy('b',b)}));
  const dials=uniq('dial').map(d=>({v:d,l:d,c:countBy('dial',d),sw:DIALHEX[d]||'transparent'}));
  const sizes=[...new Set(CATALOGUE.map(w=>w.size))].sort((a,b)=>a-b).map(s=>({v:s,l:s+' mm'}));
  const conds=['Unworn','Excellent','Very good','Good'].filter(c=>countBy('c',c)).map(c=>({v:c,l:c,c:countBy('c',c)}));
  const locs=uniq('loc').map(l=>({v:l,l:l,c:countBy('loc',l)}));
  const kit=[{v:'box',l:'Box included',c:CATALOGUE.filter(w=>w.box).length},
             {v:'pap',l:'Papers included',c:CATALOGUE.filter(w=>w.pap).length},
             {v:'full',l:'Full set',c:CATALOGUE.filter(w=>w.box&&w.pap).length}];
  document.getElementById('rail').innerHTML=
    group('Maison','brand',brands)+
    group('Price','band',BANDS[CUR].map((l,i)=>({v:i,l})),'chip')+
    group('Dial','dial',dials)+
    group('Case size','size',sizes,'chip')+
    group('Box &amp; papers','kit',kit)+
    group('Condition','cond',conds)+
    group('Held in','loc',locs)+
    `<div class="fclear" id="clear">Clear all filters</div>`;
  bindRail();
}
function bindRail(){
  document.querySelectorAll('.fhead').forEach(h=>h.addEventListener('click',()=>h.parentElement.classList.toggle('shut')));
  document.querySelectorAll('.frow').forEach(r=>{
    const k=r.dataset.k,v=r.dataset.v;
    const on=F[k].has(isNaN(v)||k!=='size'?v:+v);
    r.querySelector('input').checked=on; r.classList.toggle('on',on);
    r.addEventListener('click',e=>{e.preventDefault();toggle(k,v);});
  });
  document.querySelectorAll('.fchip').forEach(c=>{
    const k=c.dataset.k,v=c.dataset.v;
    c.classList.toggle('on',F[k].has(k==='size'||k==='band'?+v:v));
    c.addEventListener('click',()=>toggle(k,v));
  });
  const cl=document.getElementById('clear');
  if(cl) cl.addEventListener('click',()=>{Object.keys(F).forEach(k=>F[k].clear());render();});
}
function toggle(k,v){
  const val=(k==='size'||k==='band')?+v:v;
  F[k].has(val)?F[k].delete(val):F[k].add(val);
  render();
}
function matches(w){
  if(F.brand.size && !F.brand.has(w.b)) return false;
  if(F.dial.size && !F.dial.has(w.dial)) return false;
  if(F.size.size && !F.size.has(w.size)) return false;
  if(F.cond.size && !F.cond.has(w.c)) return false;
  if(F.loc.size && !F.loc.has(w.loc)) return false;
  if(F.kit.size){
    for(const k of F.kit){
      if(k==='box' && !w.box) return false;
      if(k==='pap' && !w.pap) return false;
      if(k==='full' && !(w.box&&w.pap)) return false;
    }
  }
  if(F.band.size){
    const ok=[...F.band].some(i=>w.aed>=PRICE_BANDS[i][0] && w.aed<PRICE_BANDS[i][1]);
    if(!ok) return false;
  }
  return true;
}
function activeChips(){
  const out=[];
  const label={brand:'',dial:'Dial: ',size:'',cond:'',loc:'In ',kit:'',band:''};
  for(const k of Object.keys(F)) for(const v of F[k]){
    let txt = k==='band' ? BANDS[CUR][v] : k==='size' ? v+' mm'
            : k==='kit' ? ({box:'Box included',pap:'Papers included',full:'Full set'})[v] : label[k]+v;
    out.push(`<span class="pill2" data-k="${k}" data-v="${v}">${txt} <i>×</i></span>`);
  }
  const el=document.getElementById('active');
  el.innerHTML=out.join('');
  el.querySelectorAll('.pill2').forEach(p=>p.addEventListener('click',()=>toggle(p.dataset.k,p.dataset.v)));
}
function render(){
  let list=CATALOGUE.map((w,i)=>({w,i})).filter(o=>matches(o.w));
  const s=document.getElementById('sort').value;
  if(s==='plow') list.sort((a,b)=>a.w.aed-b.w.aed);
  if(s==='phigh') list.sort((a,b)=>b.w.aed-a.w.aed);
  if(s==='year') list.sort((a,b)=>b.w.y-a.w.y);
  document.getElementById('pgrid').innerHTML=list.map(o=>productCard(o.w,o.i)).join('');
  document.getElementById('cnt').textContent=list.length;
  document.getElementById('ofTotal').textContent = list.length===CATALOGUE.length ? '' : 'of '+CATALOGUE.length;
  document.getElementById('empty').style.display = list.length? 'none':'block';
  bindZones();
  activeChips();
  document.querySelectorAll('.frow').forEach(r=>{
    const k=r.dataset.k,v=r.dataset.v; const val=(k==='size')?+v:v;
    const on=F[k].has(val); r.querySelector('input').checked=on; r.classList.toggle('on',on);});
  document.querySelectorAll('.fchip').forEach(c=>{
    const k=c.dataset.k,v=c.dataset.v; c.classList.toggle('on',F[k].has(+v));});
}
window.onCurrency=()=>{buildRail();render();};
document.addEventListener('DOMContentLoaded',()=>{
  buildRail(); document.getElementById('sort').addEventListener('change',render); render();
});
