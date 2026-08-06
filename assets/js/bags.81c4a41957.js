/* ================= HANDBAGS — filtering =================
   The same grammar as the watch shop, with the vocabulary bags use:
   model, size, leather, colour, hardware. Built as a drawer over a
   4-up grid so the department scales past a hundred pieces. */

const uniqB=k=>[...new Set(BAGS.map(g=>g[k]))];
const cntB=(k,v)=>BAGS.filter(g=>g[k]===v).length;

const FB={model:new Set(),size:new Set(),leather:new Set(),colour:new Set(),
          hw:new Set(),cond:new Set(),band:new Set(),loc:new Set()};
let QB='';

const BBANDS=()=>CUR==='AED'
  ? [['Under 50,000',0,50000],['50,000 – 150,000',50000,150000],
     ['150,000 – 250,000',150000,250000],['250,000 +',250000,null]]
  : [['Under £10,000',0,47000],['£10,000 – £30,000',47000,141000],
     ['£30,000 – £55,000',141000,258500],['£55,000 +',258500,null]];

const BGROUPS=[
  {k:'model',   t:'Model'},
  {k:'band',    t:'Price'},
  {k:'size',    t:'Size'},
  {k:'leather', t:'Leather'},
  {k:'colour',  t:'Colour'},
  {k:'hw',      t:'Hardware', seg:1},
  {k:'cond',    t:'Condition', seg:1}
];
const BITEMS={
  model:()=>uniqB('m').sort().map(v=>({v,l:v,c:cntB('m',v)})),
  band:()=>BBANDS().map(([l,lo,hi])=>({v:lo+'-'+(hi==null?'x':hi),l,
        c:BAGS.filter(g=>g.aed>=lo&&(hi==null||g.aed<hi)).length})),
  size:()=>uniqB('size').sort((a,b)=>a-b).map(v=>({v:String(v),l:v+' cm',c:cntB('size',v)})),
  leather:()=>uniqB('leather').sort().map(v=>({v,l:v,c:cntB('leather',v)})),
  colour:()=>uniqB('colour').sort().map(v=>({v,l:v,c:cntB('colour',v),
        sw:(BAGS.find(g=>g.colour===v)||{}).hex})),
  hw:()=>uniqB('hw').map(v=>({v,l:v})),
  cond:()=>['Unworn','Excellent','Very good','Good'].filter(c=>cntB('c',c)).map(v=>({v,l:v}))
};

const bRows=(key,items)=>items.map(i=>`
  <label class="frow" data-k="${key}" data-v="${i.v}">
    <input type="checkbox"><span class="fbx"></span>
    ${i.sw!==undefined?`<span class="fsw" style="background:${i.sw||'transparent'}"></span>`:''}
    <span class="fl">${i.l}</span><em>${i.c!==undefined?i.c:''}</em></label>`).join('');

function bBody(g){
  if(g.seg) return `<div class="segs">`+BITEMS[g.k]().map(i=>
    `<button data-k="${g.k}" data-v="${i.v}" aria-pressed="false">${i.l}</button>`).join('')+`</div>`;
  return `<div class="flist">${bRows(g.k,BITEMS[g.k]())}</div>`;
}

function bMatch(g){
  if(FB.model.size && !FB.model.has(g.m)) return false;
  if(FB.size.size && !FB.size.has(String(g.size))) return false;
  if(FB.leather.size && !FB.leather.has(g.leather)) return false;
  if(FB.colour.size && !FB.colour.has(g.colour)) return false;
  if(FB.hw.size && !FB.hw.has(g.hw)) return false;
  if(FB.cond.size && !FB.cond.has(g.c)) return false;
  if(FB.loc.size && !FB.loc.has(g.loc)) return false;
  if(FB.band.size){
    const ok=[...FB.band].some(b=>{const [lo,hi]=b.split('-');
      return g.aed>=+lo && (hi==='x'||g.aed<+hi);});
    if(!ok) return false;
  }
  if(QB){
    const hay=('Hermès '+g.fam+' '+g.t+' '+g.leather+' '+g.colour+' '+g.hw+' '+g.y+' '+g.loc).toLowerCase();
    if(!QB.toLowerCase().split(/\s+/).every(t=>hay.includes(t))) return false;
  }
  return true;
}

const BLABEL={band:v=>{const [lo,hi]=v.split('-');
  return (BBANDS().find(b=>b[1]===+lo)||[v])[0];}, size:v=>v+' cm', loc:v=>'In '+v};

let BCARDS=null;
function bRender(){
  if(!BCARDS) return;
  let list=BAGS.map((g,i)=>({g,i})).filter(o=>bMatch(o.g));
  const s=document.getElementById('sort').value;
  if(s==='plow') list.sort((a,b)=>a.g.aed-b.g.aed);
  if(s==='phigh') list.sort((a,b)=>b.g.aed-a.g.aed);
  if(s==='size') list.sort((a,b)=>a.g.size-b.g.size);
  if(s==='new') list.sort((a,b)=>b.g.y-a.g.y);
  const shown=new Map(list.map((o,n)=>[o.i,n]));
  BCARDS.forEach((c,i)=>{
    const n=shown.get(i), off=n===undefined;
    if(c.hidden!==off) c.hidden=off;
    if(!off && c.style.order!=n) c.style.order=n;
  });
  document.getElementById('cnt').textContent=list.length;
  document.getElementById('ofTotal').textContent=list.length===BAGS.length?'':'of '+BAGS.length;
  document.getElementById('empty').style.display=list.length?'none':'block';
  bChips(); bSync(); bHead();
}

function bChips(){
  const out=[];
  if(QB) out.push(`<span class="pill2" data-t="q">“${QB}” <i>×</i></span>`);
  for(const k of Object.keys(FB)) for(const v of FB[k]){
    const map=BLABEL[k];
    out.push(`<span class="pill2" data-t="set" data-k="${k}" data-v="${v}">${
      typeof map==='function'?map(v):v} <i>×</i></span>`);
  }
  const el=document.getElementById('active');
  el.innerHTML=out.join('');
  document.getElementById('clear').hidden=!out.length;
  const fc=document.getElementById('filcount');
  fc.hidden=!out.length; fc.textContent=out.length;
  el.querySelectorAll('.pill2').forEach(p=>p.addEventListener('click',()=>{
    if(p.dataset.t==='q'){ QB=''; const sq=document.getElementById('shopq');
      if(sq){sq.value=''; sq.closest('.shopsearch').classList.remove('has');} }
    else FB[p.dataset.k].delete(p.dataset.v);
    bRender();
  }));
}
function bSync(){
  document.querySelectorAll('.frow').forEach(r=>{
    const on=FB[r.dataset.k].has(r.dataset.v);
    r.querySelector('input').checked=on; r.classList.toggle('on',on);
  });
  document.querySelectorAll('.segs button').forEach(b=>
    b.setAttribute('aria-pressed',String(FB[b.dataset.k].has(b.dataset.v))));
  const seg=document.getElementById('locseg');
  const one=FB.loc.size===1?[...FB.loc][0]:'';
  seg.querySelectorAll('button').forEach(b=>
    b.setAttribute('aria-pressed',String(b.dataset.l===one)));
}
function bHead(){
  const h=document.getElementById('bagTitle'); if(!h) return;
  const bits=[];
  if(FB.model.size) bits.push([...FB.model].join(', '));
  if(!bits.length && FB.colour.size) bits.push([...FB.colour].join(', '));
  if(!bits.length && FB.leather.size) bits.push([...FB.leather].join(', '));
  h.textContent=bits.length?bits.join(' — '):'Handbags';
}
function bToggle(k,v){ FB[k].has(v)?FB[k].delete(v):FB[k].add(v); bRender(); }

function bApplyURL(){
  const p=new URLSearchParams(location.search);
  const take=(param,key)=>{const v=p.get(param); if(v) v.split(',').forEach(x=>FB[key].add(x));};
  take('model','model'); take('size','size'); take('leather','leather');
  take('colour','colour'); take('hw','hw'); take('cond','cond');
  take('band','band'); take('loc','loc');
  QB=(p.get('q')||'').trim();
  const s=p.get('sort'), sel=document.getElementById('sort');
  if(s && sel && [...sel.options].some(o=>o.value===s)) sel.value=s;
}

document.addEventListener('DOMContentLoaded',()=>{
  const grid=document.getElementById('pgrid'); if(!grid) return;
  bApplyURL();
  grid.innerHTML=BAGS.map((g,i)=>bagCard(g,i)).join('');
  BCARDS=[...grid.children];

  const rail=document.getElementById('frail');
  rail.innerHTML=BGROUPS.map((g,n)=>`
    <div class="rsec${n<3?' open':''}" data-g="${g.k}">
      <button class="rsech" aria-expanded="${n<3}">${g.t}<i>${n<3?'−':'+'}</i></button>
      <div class="rsecb">${bBody(g)}</div>
    </div>`).join('');
  rail.querySelectorAll('.rsech').forEach(h=>h.addEventListener('click',()=>{
    const sec=h.parentElement, open=sec.classList.toggle('open');
    h.setAttribute('aria-expanded',String(open));
    h.querySelector('i').textContent=open?'−':'+';
  }));
  rail.querySelectorAll('.frow').forEach(r=>r.addEventListener('click',e=>{
    e.preventDefault(); bToggle(r.dataset.k,r.dataset.v);
  }));
  rail.querySelectorAll('.segs button').forEach(b=>
    b.addEventListener('click',()=>bToggle(b.dataset.k,b.dataset.v)));

  const wrap=document.querySelector('.shopwrap'), tog=document.getElementById('filtoggle');
  tog.addEventListener('click',()=>{
    const open=wrap.classList.toggle('open');
    tog.setAttribute('aria-expanded',String(open));
    document.getElementById('filtoggletext').textContent=open?'Hide':'Filters';
  });

  document.querySelectorAll('#locseg button').forEach(b=>b.addEventListener('click',()=>{
    FB.loc.clear(); if(b.dataset.l) FB.loc.add(b.dataset.l); bRender();
  }));

  const sq=document.getElementById('shopq'), clr=document.getElementById('sqclear');
  const has=()=>sq.closest('.shopsearch').classList.toggle('has',!!sq.value);
  if(QB) sq.value=QB;
  has();
  sq.addEventListener('input',()=>{ QB=sq.value.trim(); has(); bRender(); });
  clr.addEventListener('click',()=>{ sq.value=''; QB=''; has(); bRender(); sq.focus(); });

  document.getElementById('clear').addEventListener('click',()=>{
    Object.keys(FB).forEach(k=>FB[k].clear());
    QB=''; sq.value=''; has();
    history.replaceState(null,'','bags.html');
    bRender();
  });
  document.getElementById('sort').addEventListener('change',bRender);
  document.querySelectorAll('.acch').forEach(h=>
    h.addEventListener('click',()=>h.parentElement.classList.toggle('open')));

  repaintMoney();          /* once, after the cards exist */
  window.onCurrency=()=>{
    const el=document.querySelector('.rsec[data-g="band"] .flist');
    if(el){ el.innerHTML=bRows('band',BITEMS.band());
      el.querySelectorAll('.frow').forEach(r=>r.addEventListener('click',e=>{
        e.preventDefault(); bToggle(r.dataset.k,r.dataset.v);}));
    }
    bRender();
  };
  bRender();
});
