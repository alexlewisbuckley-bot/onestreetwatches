/* ============================================================
   MOBILE APP SHELL
   Bottom dock, bottom sheets, full-screen search. Built only below
   980px and torn down above it, so desktop carries none of the cost.
   ============================================================ */
const MQ = matchMedia('(max-width:979px)');
const ICON = {
  case:'<path d="M3 6h18v13H3z"/><path d="M3 10h18M9 6V3h6v3"/>',
  search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/>',
  book:'<rect x="3" y="5" width="18" height="16"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="m9 15 2 2 4-4"/>',
  sell:'<path d="M3 12V4h8l10 10-8 8L3 12Z"/><circle cx="7.5" cy="7.5" r="1.4"/>',
  more:'<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>',
  bell:'<path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  wa:'<path d="M3 21l1.6-4.4A8.5 8.5 0 1 1 12 20.5a8.4 8.4 0 0 1-4.2-1.1L3 21Z"/>',
  pin:'<path d="M12 22s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="11" r="2.5"/>',
  doc:'<path d="M6 2h8l4 4v16H6z"/><path d="M14 2v4h4M9 12h6M9 16h6"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  tool:'<path d="M14.5 4.5a4 4 0 0 0 5 5L21 8v3l-8 8-4-4 8-8h3l-1.5-1.5Z"/><path d="m6 14-3 3 4 4 3-3"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
};
const svg=(d,c='')=>`<svg class="${c}" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;

const DOCK=[
  {t:'Case',   i:'case',   href:'shop.html',  match:['shop','product']},
  {t:'Search', i:'search', act:'search'},
  {t:'Book',   i:'book',   href:'book.html',  match:['book']},
  {t:'Sell',   i:'sell',   href:'sell.html',  match:['sell']},
  {t:'More',   i:'more',   act:'menu'}
];
const MENU=[
  {g:'Services', rows:[
    {t:'Concierge sourcing', s:'Name the reference', href:'sourcing.html', i:'search'},
    {t:'Servicing & authentication', s:'Our own bench', href:'servicing.html', i:'tool'},
    {t:'Book an appointment', s:'Bring a watch in', href:'book.html?type=service', i:'clock'}]},
  {g:'One Street', rows:[
    {t:'Visit us', s:'Dubai & the UK', href:'visit.html', i:'pin'},
    {t:'The journal', s:'Notes from the case', href:'journal.html', i:'doc'},
    {t:'About', s:'Who we are', href:'about.html', i:'info'},
    {t:'Contact', s:'A real person, seven days', href:'contact.html', i:'info'}]}
];
const WANO='https://wa.me/97140000000';

let built=false;
function buildShell(){
  if(built) return; built=true;
  const page=document.body.dataset.page||'';

  /* --- top bar action --- */
  const nav=document.querySelector('nav');
  if(nav && !nav.querySelector('.mact')){
    const a=document.createElement('div');
    a.className='mact';
    a.innerHTML=`<button class="mbtn" id="m-search" aria-label="Search">${svg(ICON.search)}</button>
                 <button class="mbtn" id="m-menu" aria-label="Menu">${svg(ICON.more)}</button>`;
    nav.appendChild(a);
  }

  /* --- dock --- */
  if(!document.querySelector('.dock')){
    const d=document.createElement('div');
    d.className='dock'; d.setAttribute('role','navigation'); d.setAttribute('aria-label','Main');
    d.innerHTML=DOCK.map(x=>{
      const on=x.match && x.match.includes(page) ? ' on':'';
      return x.href
        ? `<a class="${on.trim()}" href="${x.href}">${svg(ICON[x.i])}<span>${x.t}</span></a>`
        : `<a class="" href="#" data-act="${x.act}">${svg(ICON[x.i])}<span>${x.t}</span></a>`;
    }).join('');
    document.body.appendChild(d);
    d.querySelectorAll('[data-act]').forEach(a=>a.addEventListener('click',e=>{
      e.preventDefault();
      a.dataset.act==='search' ? openSearch() : openSheet('menu');
    }));
  }

  /* --- sheet host --- */
  if(!document.getElementById('sheet')){
    const s=document.createElement('div');
    s.id='sheet'; s.className='sheet'; s.setAttribute('role','dialog'); s.setAttribute('aria-modal','true');
    s.innerHTML=`<div class="sheetbg" data-close></div>
      <div class="sheetbody">
        <div class="grab" id="grab"><i></i></div>
        <div class="sheeth"><h2 id="sheettitle"></h2>
          <button class="sheetx" data-close aria-label="Close">×</button></div>
        <div class="sheetc" id="sheetc"></div>
        <div class="sheetf" id="sheetf" hidden></div>
      </div>`;
    document.body.appendChild(s);
    s.querySelectorAll('[data-close]').forEach(x=>x.addEventListener('click',closeSheet));
    dragToDismiss(s);
  }

  /* --- search overlay --- */
  if(!document.getElementById('msearch')){
    const m=document.createElement('div');
    m.id='msearch'; m.className='msearch';
    m.innerHTML=`<div class="msbar">
        <label class="fld">${svg(ICON.search)}
          <input id="mq" type="search" enterkeyhint="search" autocomplete="off"
                 placeholder="Search a model or a reference"></label>
        <button class="cancel" id="mcancel">Cancel</button>
      </div><div class="msres" id="msres"></div>`;
    document.body.appendChild(m);
    document.getElementById('mcancel').addEventListener('click',closeSearch);
    document.getElementById('mq').addEventListener('input',paintSearch);
  }
  addEventListener('keydown',e=>{ if(e.key==='Escape'){closeSheet();closeSearch();} });
  document.getElementById('m-menu')?.addEventListener('click',()=>openSheet('menu'));
  document.getElementById('m-search')?.addEventListener('click',openSearch);

  const shade=()=>nav?.classList.toggle('stuck',scrollY>4);
  addEventListener('scroll',shade,{passive:true}); shade();
}

/* ---------- sheet ---------- */
let lastFocus=null;
function showSheet(title, html, footer){
  const s=document.getElementById('sheet');
  lastFocus=document.activeElement;
  document.getElementById('sheettitle').textContent=title;
  const c=document.getElementById('sheetc');
  c.innerHTML='';
  if(html instanceof Node) c.appendChild(html); else c.innerHTML=html;
  const f=document.getElementById('sheetf');
  f.hidden=!footer; f.innerHTML=footer||'';
  s.classList.add('on');
  document.body.style.overflow='hidden';
  requestAnimationFrame(()=>s.classList.add('in'));
  s.querySelector('.sheetbody').focus?.();
  return s;
}
function closeSheet(){
  const s=document.getElementById('sheet'); if(!s||!s.classList.contains('on')) return;
  s.classList.remove('in');
  setTimeout(()=>{s.classList.remove('on');document.body.style.overflow='';},300);
  lastFocus?.focus?.();
}
window.osSheet={show:showSheet, close:closeSheet};
window.osMobile=()=>MQ.matches;

function openSheet(kind){
  if(kind!=='menu') return;
  const rows=MENU.map(g=>
    `<div class="msub">${g.g}</div>`+
    g.rows.map(r=>`<a class="mrow" href="${r.href}">
        <span class="ic">${svg(ICON[r.i])}</span>
        <span><span class="n">${r.t}</span></span><em>${r.s}</em></a>`).join('')
  ).join('');
  const cur=`<div class="msub">Currency</div>
    <div class="mcur">
      <button data-c="AED" aria-pressed="${CUR==='AED'}">AED</button>
      <button data-c="GBP" aria-pressed="${CUR==='GBP'}">GBP</button>
    </div>
    <a class="mwa" href="${WANO}">${svg(ICON.wa)}WhatsApp us</a>`;
  showSheet('Menu', rows+cur);
  document.querySelectorAll('.mcur button').forEach(b=>b.addEventListener('click',()=>{
    CUR=b.dataset.c; localStorage.setItem('osw-cur',CUR);
    document.querySelectorAll('.mcur button').forEach(x=>
      x.setAttribute('aria-pressed',String(x.dataset.c===CUR)));
    document.querySelectorAll('.seg button').forEach(x=>
      x.setAttribute('aria-pressed',String(x.dataset.cur===CUR)));
    repaintMoney();
  }));
}

/* drag the grab handle down to dismiss */
function dragToDismiss(s){
  const body=s.querySelector('.sheetbody'), grab=s.querySelector('#grab');
  let y0=null,dy=0;
  const down=e=>{y0=e.touches?e.touches[0].clientY:e.clientY;dy=0;body.style.transition='none';};
  const move=e=>{
    if(y0===null) return;
    const y=e.touches?e.touches[0].clientY:e.clientY;
    dy=Math.max(0,y-y0);
    body.style.transform=`translateY(${dy}px)`;
  };
  const up=()=>{
    if(y0===null) return;
    body.style.transition=''; body.style.transform='';
    if(dy>90) closeSheet();
    y0=null;
  };
  grab.addEventListener('touchstart',down,{passive:true});
  grab.addEventListener('touchmove',move,{passive:true});
  grab.addEventListener('touchend',up);
  grab.addEventListener('mousedown',down);
  addEventListener('mousemove',move); addEventListener('mouseup',up);
}

/* ---------- full-screen search ---------- */
function openSearch(){
  const m=document.getElementById('msearch');
  m.classList.add('on'); document.body.style.overflow='hidden';
  paintSearch();
  setTimeout(()=>document.getElementById('mq').focus(),60);
}
function closeSearch(){
  document.getElementById('msearch').classList.remove('on');
  document.body.style.overflow='';
}
function paintSearch(){
  const q=(document.getElementById('mq').value||'').trim();
  const box=document.getElementById('msres');
  const row=(w,i)=>{const im=w.ims.find(x=>x.img);
    return `<a class="mrow" href="product.html?i=${i}">
      <span class="ic" style="width:44px;height:44px;background-image:var(--plate);border:1px solid var(--line)">
        ${im?`<img src="${im.img}" alt="" style="width:80%;height:80%;object-fit:contain">`:''}</span>
      <span><span class="n">${w.b} ${w.m}</span>
      <span style="display:block;font-size:11.5px;color:var(--muted);margin-top:3px">Ref. ${w.r} · ${w.y}</span></span>
      <em>${money(w.aed)}</em></a>`;};
  if(!q){
    box.innerHTML=`<div class="msub">By maison</div>`+
      BRANDLIST().map(b=>`<a class="mrow" href="${shopURL({brand:b.n})}">
        <span><span class="n">${b.n}</span></span><em>${b.c}</em></a>`).join('')+
      `<div class="msub">Jump to</div>`+
      [['Unworn only',shopURL({cond:'Unworn'})],
       ['Full set — box and papers',shopURL({kit:'full'})],
       ['Everything in the case','shop.html']]
      .map(([t,h])=>`<a class="mrow" href="${h}"><span><span class="n">${t}</span></span></a>`).join('');
    return;
  }
  const ql=q.toLowerCase();
  const hits=CATALOGUE.map((w,i)=>({w,i})).filter(o=>
    (o.w.b+' '+o.w.m+' '+o.w.r+' '+o.w.dial+' '+o.w.y).toLowerCase().includes(ql));
  box.innerHTML = hits.length
    ? `<div class="msub">${hits.length} watch${hits.length>1?'es':''}</div>`+
      hits.map(o=>row(o.w,o.i)).join('')+
      `<a class="mwa" style="background:none;border:1px solid var(--line2);color:var(--ink)"
          href="${shopURL({q})}">Open in the case</a>`
    : `<div class="msub">No match</div>
       <p style="font-size:13px;color:var(--muted);line-height:1.75">Nothing in the case matches
       “${q}”. Our concierge can source it — average eleven days.</p>
       <a class="mwa" href="sourcing.html">Start a sourcing request</a>`;
}

/* ---------- boot / teardown ---------- */
function sync(){
  if(MQ.matches) buildShell();
  else { closeSheet(); closeSearch(); }
}
document.addEventListener('DOMContentLoaded',()=>{ sync(); MQ.addEventListener?.('change',sync); });
