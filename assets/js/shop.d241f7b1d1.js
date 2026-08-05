/* ================= THE CASE (v2) — filtering =================
   Filters live in a left rail that scrolls with the page — always open,
   nothing sticky, nothing to trap. Same state engine as before; only the
   furniture changed. */
const uniq=k=>[...new Set(CATALOGUE.map(w=>w[k]))];
const countBy=(k,v)=>CATALOGUE.filter(w=>w[k]===v).length;
const bounds=k=>[Math.min(...CATALOGUE.map(w=>w[k])), Math.max(...CATALOGUE.map(w=>w[k]))];

const B={aed:bounds('aed'), y:bounds('y'), size:bounds('size')};
const round=(v,s)=>Math.round(v/s)*s;
B.aed=[round(B.aed[0]-2000,1000), round(B.aed[1]+10000,10000)];

const F={brand:new Set(),fam:new Set(),cat:new Set(),dial:new Set(),cond:new Set(),loc:new Set(),kit:new Set()};
const R={aed:[...B.aed], y:[...B.y], size:[...B.size]};
let Q='';

const fmt={ aed:v=>money(v), y:v=>String(v), size:v=>v+' mm' };
const shortMoney=v=>CUR==='AED'
  ? (v>=1000 ? Math.round(v/1000)+'k' : String(v))
  : (Math.round(v/RATE)>=1000 ? '£'+Math.round(v/RATE/1000)+'k' : '£'+Math.round(v/RATE));

/* ---------- what sits in the bar ---------- */
const GROUPS=[
  {k:'aed',   t:'Budget',          type:'range', step:1000, wide:1},
  {k:'brand', t:'Brand',           type:'check'},
  {k:'fam',   t:'Model',           type:'check'},
  {k:'cat',   t:'Type',            type:'check'},
  {k:'y',     t:'Year',            type:'range', step:1},
  {k:'size',  t:'Case size',       type:'range', step:1, note:'Measured across the case, excluding the crown.'},
  {k:'dial',  t:'Dial',            type:'check'},
  {k:'kit',   t:'Box &amp; papers', type:'seg'},
  {k:'cond',  t:'Condition',       type:'seg'},
  {k:'loc',   t:'Held in',         type:'seg'}
];
const ITEMS={
  brand:()=>uniq('b').map(b=>({v:b,l:b,c:countBy('b',b)})),
  fam:()=>famPool(),
  cat:()=>CATS().map(([c,n])=>({v:c,l:c,c:n})),
  dial:()=>DIALS().map(([n,hex,c])=>({v:n,l:n,c,sw:hex})),
  kit:()=>[{v:'full',l:'Full set'},{v:'box',l:'Box'},{v:'pap',l:'Papers'}],
  cond:()=>['Unworn','Excellent','Very good','Good'].filter(c=>countBy('c',c)).map(c=>({v:c,l:c})),
  loc:()=>uniq('loc').map(l=>({v:l,l:l}))
};

/* families available under the current maison selection */
function famPool(){
  const pool = F.brand.size ? CATALOGUE.filter(w=>F.brand.has(w.b)) : CATALOGUE;
  return [...new Set(pool.map(famOf))].sort()
    .map(f=>({v:f,l:f,c:pool.filter(w=>famOf(w)===f).length}));
}

/* ---------- markup ---------- */
const checkRows=(key,items)=>items.length
  ? items.map(i=>`<label class="frow" data-k="${key}" data-v="${i.v}">
      <input type="checkbox"><span class="fbx"></span>
      ${i.sw!==undefined?`<span class="fsw" style="background:${i.sw||'transparent'};${i.sw?'':'box-shadow:inset 0 0 0 1px rgba(28,27,25,.4)'}"></span>`:''}
      <span class="fl">${i.l}</span><em>${i.c!==undefined?i.c:''}</em></label>`).join('')
  : `<div class="fnone">Nothing to choose here yet.</div>`;

function popBody(g){
  if(g.type==='range') return `
    <div class="rng" data-r="${g.k}" data-step="${g.step}">
      <div class="rngval"><span class="lo"></span><em>to</em><span class="hi"></span></div>
      ${g.k==='aed'?'<div class="rnghist"></div>':''}
      <div class="rngtrack"><div class="rngfill"></div>
        <button class="rngh lo" aria-label="Minimum ${g.t}"></button>
        <button class="rngh hi" aria-label="Maximum ${g.t}"></button></div>
      <div class="rngends"><span class="e0"></span><span class="e1"></span></div>
      ${g.note?`<div class="rngnote">${g.note}</div>`:''}
    </div>`;
  if(g.type==='seg') return `<div class="segs">`+
    ITEMS[g.k]().map(i=>`<button data-k="${g.k}" data-v="${i.v}" aria-pressed="false">${i.l}</button>`).join('')+
    `</div>`;
  return `<div class="flist" id="list-${g.k}">${checkRows(g.k,ITEMS[g.k]())}</div>`;
}

function buildRail(){
  const rail=document.getElementById('frail'); if(!rail) return;
  rail.innerHTML=GROUPS.map(g=>`
    <div class="rsec open" data-g="${g.k}">
      <button class="rsech" aria-expanded="true">${g.t}<i>−</i></button>
      <div class="rsecb">${popBody(g)}</div>
    </div>`).join('');
  rail.querySelectorAll('.rsech').forEach(h=>h.addEventListener('click',()=>{
    const sec=h.parentElement, open=sec.classList.toggle('open');
    h.setAttribute('aria-expanded',String(open));
    h.querySelector('i').textContent=open?'−':'+';
    if(open) sec.querySelectorAll('.rng').forEach(paintRange);
  }));
  bindRows(rail);
  rail.querySelectorAll('.segs button').forEach(b=>
    b.addEventListener('click',()=>toggle(b.dataset.k,b.dataset.v)));
  rail.querySelectorAll('.rng').forEach(initRange);
  document.getElementById('clear').addEventListener('click',clearAll);

  /* the rail is a drawer — closed by default, 4-up; open, 3-up */
  const wrap=document.querySelector('.shopwrap'), tog=document.getElementById('filtoggle');
  if(tog) tog.addEventListener('click',()=>{
    const open=wrap.classList.toggle('open');
    tog.setAttribute('aria-expanded',String(open));
    const t=document.getElementById('filtoggletext');
    if(t) t.textContent=open?'Hide':'Filters';
    if(open) rail.querySelectorAll('.rng').forEach(paintRange);   /* sliders need width */
  });
}
function closePop(){}   /* the rail never opens or closes — kept for callers */

function bindRows(scope){
  scope.querySelectorAll('.frow').forEach(r=>{
    if(r.dataset.bound) return; r.dataset.bound=1;
    r.addEventListener('click',e=>{e.preventDefault();toggle(r.dataset.k,r.dataset.v);});
  });
}
function paintFam(){
  const body=document.getElementById('list-fam'); if(!body) return;
  body.innerHTML=checkRows('fam',famPool());
  bindRows(body);
}
function resetGroup(k){
  if(F[k]) F[k].clear();
  else { R[k]=[...B[k]]; document.querySelectorAll('.rng').forEach(paintRange); }
  if(k==='brand') paintFam();
  render();
}
function clearAll(){
  Object.keys(F).forEach(k=>F[k].clear());
  R.aed=[...B.aed];R.y=[...B.y];R.size=[...B.size];
  Q=''; const q=document.getElementById('q'); if(q) q.value='';
  history.replaceState(null,'','shop.html');
  paintFam();
  document.querySelectorAll('.rng').forEach(paintRange);
  closePop(); render();
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

/* the page says what you clicked, not just "The case" */
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
  const title = bits.length ? bits.join(' — ') : 'All products';
  h.textContent=title;
  if(c) c.textContent = bits.length ? title : 'All watches';
}

/* ---------- range slider ---------- */
function initRange(el){
  const key=el.dataset.r, step=+el.dataset.step, [min,max]=B[key];
  const track=el.querySelector('.rngtrack');
  const fromX=x=>{
    const r=track.getBoundingClientRect();
    if(!r.width) return R[key][0];
    return Math.min(max,Math.max(min,round(min+((x-r.left)/r.width)*(max-min),step)));
  };
  let drag=null;
  const start=(h,e)=>{drag=h;track.setPointerCapture?.(e.pointerId);e.preventDefault();e.stopPropagation();};
  el.querySelector('.rngh.lo').addEventListener('pointerdown',e=>start('lo',e));
  el.querySelector('.rngh.hi').addEventListener('pointerdown',e=>start('hi',e));
  addEventListener('pointermove',e=>{
    if(!drag) return;
    const v=fromX(e.clientX);
    if(drag==='lo') R[key][0]=Math.min(v,R[key][1]-step);
    else            R[key][1]=Math.max(v,R[key][0]+step);
    paintRange(el); scheduleRender();
  });
  addEventListener('pointerup',()=>{if(drag){drag=null;render();}});
  track.addEventListener('pointerdown',e=>{
    if(e.target.classList.contains('rngh')) return;
    const v=fromX(e.clientX);
    if(Math.abs(v-R[key][0])<Math.abs(v-R[key][1])) R[key][0]=Math.min(v,R[key][1]-step);
    else R[key][1]=Math.max(v,R[key][0]+step);
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
  const hist=el.querySelector('.rnghist');
  if(hist){
    const N=22, st=(max-min)/N;
    const buckets=Array.from({length:N},(_,i)=>CATALOGUE.filter(w=>w.aed>=min+i*st && w.aed<min+(i+1)*st).length);
    const peak=Math.max(1,...buckets);
    hist.innerHTML=buckets.map(c=>`<i data-c="${c}" style="height:${Math.max(2,(c/peak)*38)}px"></i>`).join('');
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
  el.querySelector('.e0').textContent=fmt[key](min);
  el.querySelector('.e1').textContent=fmt[key](max);
  const hist=el.querySelector('.rnghist');
  if(hist && hist.children.length){
    const N=hist.children.length, st=(max-min)/N;
    for(let i=0;i<N;i++){
      const bar=hist.children[i], has=bar.dataset.c!=='0';
      const inRange=(min+(i+1)*st)>a && (min+i*st)<b;
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
const CHIPLABEL={ kit:{box:'Box included',pap:'Papers included',full:'Full set'}, loc:v=>'In '+v };
function activeChips(){
  const out=[];
  if(Q) out.push(`<span class="pill2" data-t="q">“${Q}” <i>×</i></span>`);
  for(const k of Object.keys(F)) for(const v of F[k]){
    const map=CHIPLABEL[k];
    const txt = typeof map==='function' ? map(v) : (map && map[v]) || v;
    out.push(`<span class="pill2" data-t="set" data-k="${k}" data-v="${v}">${txt} <i>×</i></span>`);
  }
  for(const k of ['aed','y','size'])
    if(R[k][0]!==B[k][0]||R[k][1]!==B[k][1])
      out.push(`<span class="pill2" data-t="rng" data-k="${k}">${fmt[k](R[k][0])} – ${fmt[k](R[k][1])} <i>×</i></span>`);
  const el=document.getElementById('active');
  el.innerHTML=out.join('');
  document.getElementById('clear').hidden = !out.length;
  const fc=document.getElementById('filcount');
  if(fc){ fc.hidden=!out.length; fc.textContent=out.length; }
  el.querySelectorAll('.pill2').forEach(p=>p.addEventListener('click',()=>{
    if(p.dataset.t==='rng'){ R[p.dataset.k]=[...B[p.dataset.k]];
      document.querySelectorAll('.rng').forEach(paintRange); }
    else if(p.dataset.t==='q'){ Q=''; const q=document.getElementById('q'); if(q) q.value=''; }
    else { F[p.dataset.k].delete(p.dataset.v); if(p.dataset.k==='brand') paintFam(); }
    render();
  }));
}
/* each button carries its own state, so you can read the filters without opening one */
function syncControls(){
  document.querySelectorAll('.frow').forEach(r=>{
    const on=F[r.dataset.k].has(r.dataset.v);
    r.querySelector('input').checked=on; r.classList.toggle('on',on);});
  document.querySelectorAll('.segs button').forEach(b=>
    b.setAttribute('aria-pressed', String(F[b.dataset.k].has(b.dataset.v))));
  GROUPS.forEach(g=>{
    const wrap=document.querySelector(`.fwrap[data-g="${g.k}"]`); if(!wrap) return;
    const btn=wrap.querySelector('.fbtn'), tag=btn.querySelector('b');
    let on=false, label='';
    if(g.type==='range'){
      on = R[g.k][0]!==B[g.k][0] || R[g.k][1]!==B[g.k][1];
      if(on) label = g.k==='aed' ? shortMoney(R.aed[0])+'–'+shortMoney(R.aed[1])
                   : g.k==='size' ? R.size[0]+'–'+R.size[1]+' mm'
                   : R.y[0]+'–'+R.y[1];
    } else {
      const n=F[g.k].size; on=n>0;
      if(on) label = n===1 ? [...F[g.k]][0] : n+' selected';
    }
    if(label.length>18) label=label.slice(0,17)+'…';
    tag.textContent = on ? label : '';
    btn.classList.toggle('has', on);
  });
}
let CARDS=null;
function buildGrid(){
  const grid=document.getElementById('pgrid');
  grid.innerHTML=CATALOGUE.map((w,i)=>productCard(w,i)).join('');
  CARDS=[...grid.children];
  CARDS.forEach((c,i)=>c.setAttribute('href','product.html?i='+i));
  bindZones(grid);
}
function render(){
  if(!CARDS) return;
  let list=CATALOGUE.map((w,i)=>({w,i})).filter(o=>matches(o.w));
  const s=document.getElementById('sort').value;
  if(s==='plow') list.sort((a,b)=>a.w.aed-b.w.aed);
  if(s==='phigh') list.sort((a,b)=>b.w.aed-a.w.aed);
  if(s==='year') list.sort((a,b)=>b.w.y-a.w.y);
  const shown=new Map(list.map((o,n)=>[o.i,n]));
  for(let i=0;i<CARDS.length;i++){
    const n=shown.get(i), off=n===undefined;
    if(CARDS[i].hidden!==off) CARDS[i].hidden=off;
    if(!off && CARDS[i].style.order!=n) CARDS[i].style.order=n;
  }
  document.getElementById('cnt').textContent=list.length;
  document.getElementById('ofTotal').textContent = list.length===CATALOGUE.length?'':'of '+CATALOGUE.length;
  document.getElementById('empty').style.display=list.length?'none':'block';
  activeChips(); syncControls(); paintHead();
  if(window.__afterRender) window.__afterRender();
}
window.onCurrency=()=>{document.querySelectorAll('.rng').forEach(paintRange); if(CARDS) render();};

document.addEventListener('DOMContentLoaded',()=>{
  applyURL();
  buildGrid();
  buildRail();
  document.getElementById('sort').addEventListener('change',render);
  render();
});

/* ================= MOBILE =================
   The bar of ten dropdowns becomes one sticky row: a chip rail of the
   intents people actually arrive with, and a single Filter button that
   opens everything in a sheet with a live count on the apply action. */
const tog=(s,v)=>{ s.has(v)?s.delete(v):s.add(v); };
const QUICK=[
  {t:'Rolex',     on:()=>F.brand.has('Rolex'),        go:()=>tog(F.brand,'Rolex')},
  {t:'Under 50k', on:()=>R.aed[1]<=50000,             go:()=>{R.aed=R.aed[1]<=50000?[...B.aed]:[B.aed[0],50000];}},
  {t:'Full set',  on:()=>F.kit.has('full'),           go:()=>tog(F.kit,'full')},
  {t:'Unworn',    on:()=>F.cond.has('Unworn'),        go:()=>tog(F.cond,'Unworn')},
  {t:'In Dubai',  on:()=>F.loc.has('Dubai'),          go:()=>tog(F.loc,'Dubai')},
  {t:'In the UK', on:()=>F.loc.has('United Kingdom'), go:()=>tog(F.loc,'United Kingdom')}
];
const ICF='<svg viewBox="0 0 24 24"><path d="M3 5h18M6 12h12M10 19h4"/></svg>';

let MSHEET=null;
function filterSheet(){
  if(MSHEET) return MSHEET;
  MSHEET=document.createElement('div');
  MSHEET.innerHTML=GROUPS.map((g,i)=>`
    <div class="fsec${i<2?' open':''}" data-g="${g.k}">
      <button class="fsech">${g.t}<em></em><i>+</i></button>
      <div class="fsecb">${popBody(g)}</div>
    </div>`).join('');
  MSHEET.querySelectorAll('.fsech').forEach(h=>h.addEventListener('click',()=>
    h.parentElement.classList.toggle('open')));
  bindRows(MSHEET);
  MSHEET.querySelectorAll('.segs button').forEach(b=>
    b.addEventListener('click',()=>toggle(b.dataset.k,b.dataset.v)));
  MSHEET.querySelectorAll('.rng').forEach(initRange);
  return MSHEET;
}
function openFilterSheet(){
  const panel=document.getElementById('mfilpanel');
  const open=panel.hasAttribute('hidden');
  if(!open){ panel.setAttribute('hidden',''); return; }
  if(!panel.firstChild){
    panel.appendChild(filterSheet());
    const done=document.createElement('button');
    done.className='b1 mfildone'; done.id='fapply';
    done.innerHTML='Show <span id="fapplyn"></span>';
    done.addEventListener('click',()=>{panel.setAttribute('hidden','');
      document.getElementById('mfilbtn').scrollIntoView({block:'start',behavior:'smooth'});});
    panel.appendChild(done);
  }
  panel.removeAttribute('hidden');
  MSHEET.querySelectorAll('.rng').forEach(paintRange);
  syncControls(); paintApply();
}
function paintApply(){
  const n=document.getElementById('fapplyn'); if(!n) return;
  const c=CATALOGUE.filter(matches).length;
  n.textContent = c===1 ? '1 watch' : c+' watches';
  document.getElementById('fapply').disabled = c===0;
}
function paintMobileBar(){
  const chips=document.getElementById('mchips'); if(!chips) return;
  chips.querySelectorAll('.mchip').forEach((c,i)=>
    c.setAttribute('aria-pressed',String(QUICK[i].on())));
  let n=0; Object.keys(F).forEach(k=>n+=F[k].size);
  ['aed','y','size'].forEach(k=>{ if(R[k][0]!==B[k][0]||R[k][1]!==B[k][1]) n++; });
  const btn=document.getElementById('mfilbtn'), tag=btn.querySelector('b');
  btn.classList.toggle('has',n>0);
  tag.textContent=n||''; tag.style.display=n?'grid':'none';
  const c=CATALOGUE.filter(matches).length;
  document.getElementById('mcnt').innerHTML=
    `<b>${c}</b> ${c===1?'watch':'watches'}`+(c===CATALOGUE.length?'':` of ${CATALOGUE.length}`);
  paintApply();
}
function buildMobileShop(){
  const bar=document.createElement('div');
  bar.className='mfil';
  bar.innerHTML=`<div class="mfilrow">
      <div class="mchips" id="mchips">${QUICK.map(q=>
        `<button class="mchip" aria-pressed="false">${q.t}</button>`).join('')}</div>
      <button class="mfilbtn" id="mfilbtn">${ICF}Filter<b></b></button>
    </div><div class="mcount" id="mcnt"></div>
    <div class="mfilpanel" id="mfilpanel" hidden></div>`;
  document.querySelector('.shopbar').after(bar);
  bar.querySelectorAll('.mchip').forEach((c,i)=>c.addEventListener('click',()=>{
    QUICK[i].go(); document.querySelectorAll('.rng').forEach(paintRange); render();
  }));
  document.getElementById('mfilbtn').addEventListener('click',openFilterSheet);
  window.__afterRender=paintMobileBar;
  paintMobileBar();
}
document.addEventListener('DOMContentLoaded',()=>{
  if(window.osMobile && osMobile()) buildMobileShop();
});
