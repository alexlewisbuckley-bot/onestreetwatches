/* ============================================================
   MOBILE — header menu and search.
   No dock, no bottom sheets. The phone gets the same site as the
   desktop, navigated the way the web is normally navigated.
   ============================================================ */
const MQ = matchMedia('(max-width:979px)');
const ICON = {
  search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/>',
  menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',
  close:'<path d="M5 5l14 14M19 5L5 19"/>',
  wa:'<path d="M3 21l1.6-4.4A8.5 8.5 0 1 1 12 20.5a8.4 8.4 0 0 1-4.2-1.1L3 21Z"/>'
};
const svg = d => `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;

/* every destination, visible — nothing hidden behind "More" */
const NAV = [
  {g:'Shop', rows:[
    {t:'All watches', href:'shop.html'},
    {t:'Book a viewing', href:'book.html'}]},
  {g:'Services', rows:[
    {t:'Sell or part-exchange', href:'sell.html'},
    {t:'Concierge sourcing',    href:'sourcing.html'},
    {t:'Servicing & authentication', href:'servicing.html'}]},
  {g:'One Street', rows:[
    {t:'Visit us',    href:'visit.html'},
    {t:'The journal', href:'journal.html'},
    {t:'About',       href:'about.html'},
    {t:'Contact',     href:'contact.html'}]}
];
const WANO='https://wa.me/97140000000';

let built=false;
function buildShell(){
  if(built) return; built=true;
  const nav=document.querySelector('nav');

  if(nav && !nav.querySelector('.mact')){
    const a=document.createElement('div');
    a.className='mact';
    a.innerHTML=`<button class="mbtn" id="m-search" aria-label="Search">${svg(ICON.search)}</button>
      <button class="mbtn" id="m-menu" aria-label="Menu" aria-expanded="false">${svg(ICON.menu)}</button>`;
    nav.appendChild(a);
  }

  if(!document.getElementById('navmenu')){
    const m=document.createElement('div');
    m.id='navmenu'; m.className='navmenu';
    m.setAttribute('role','dialog'); m.setAttribute('aria-modal','true'); m.setAttribute('aria-label','Menu');
    m.innerHTML=`<div class="navmenu__bar">
        <span class="t-label">Menu</span>
        <button class="mbtn" id="m-close" aria-label="Close menu">${svg(ICON.close)}</button>
      </div>
      <div class="navmenu__body">
        ${NAV.map(g=>`<div class="navgroup"><div class="t-label">${g.g}</div>
          ${g.rows.map(r=>`<a class="navlink" href="${r.href}">${r.t}</a>`).join('')}</div>`).join('')}
        <div class="navgroup">
          <div class="t-label">Currency</div>
          <div class="navcur">
            <button data-c="AED" aria-pressed="${CUR==='AED'}">AED</button>
            <button data-c="GBP" aria-pressed="${CUR==='GBP'}">GBP</button>
          </div>
          <a class="navwa" href="${WANO}">${svg(ICON.wa)}WhatsApp us</a>
        </div>
      </div>`;
    document.body.appendChild(m);
    document.getElementById('m-close').addEventListener('click',closeMenu);
    m.querySelectorAll('.navcur button').forEach(b=>b.addEventListener('click',()=>{
      CUR=b.dataset.c; localStorage.setItem('osw-cur',CUR);
      m.querySelectorAll('.navcur button').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.c===CUR)));
      document.querySelectorAll('.seg button').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.cur===CUR)));
      repaintMoney();
    }));
  }

  if(!document.getElementById('msearch')){
    const s=document.createElement('div');
    s.id='msearch'; s.className='msearch';
    s.innerHTML=`<div class="msbar">
        <label class="fld">${svg(ICON.search)}
          <input id="mq" type="search" enterkeyhint="search" autocomplete="off"
                 placeholder="Search a model or a reference"></label>
        <button class="cancel" id="mcancel">Cancel</button>
      </div><div class="msres" id="msres"></div>`;
    document.body.appendChild(s);
    document.getElementById('mcancel').addEventListener('click',closeSearch);
    document.getElementById('mq').addEventListener('input',paintSearch);
  }

  document.getElementById('m-menu').addEventListener('click',openMenu);
  document.getElementById('m-search').addEventListener('click',openSearch);
  addEventListener('keydown',e=>{ if(e.key==='Escape'){closeMenu();closeSearch();} });

  const shade=()=>nav&&nav.classList.toggle('stuck',scrollY>4);
  addEventListener('scroll',shade,{passive:true}); shade();

  const page=document.body.dataset.page||'';
  const here={shop:'shop.html',sell:'sell.html',sourcing:'sourcing.html',
              servicing:'servicing.html',visit:'visit.html',book:'book.html'}[page];
  if(here) document.querySelectorAll(`.navlink[href="${here}"]`).forEach(a=>a.classList.add('on'));
}

function openMenu(){
  document.getElementById('navmenu').classList.add('on');
  document.getElementById('m-menu').setAttribute('aria-expanded','true');
  document.body.style.overflow='hidden';
}
function closeMenu(){
  const m=document.getElementById('navmenu'); if(!m) return;
  m.classList.remove('on');
  document.getElementById('m-menu')?.setAttribute('aria-expanded','false');
  document.body.style.overflow='';
}
function openSearch(){
  document.getElementById('msearch').classList.add('on');
  document.body.style.overflow='hidden';
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
    return `<a class="navlink navlink--w" href="product.html?i=${i}">
      <span class="im">${im?`<img src="${im.img}" alt="">`:''}</span>
      <span class="tx"><span class="n">${w.b} ${w.m}</span>
      <span class="s">Ref. ${w.r} · ${w.y}</span></span>
      <span class="p">${money(w.aed)}</span></a>`;};
  if(!q){
    box.innerHTML=`<div class="navgroup"><div class="t-label">By maison</div>`+
      BRANDLIST().map(b=>`<a class="navlink" href="${shopURL({brand:b.n})}">${b.n}<em>${b.c}</em></a>`).join('')+
      `</div><div class="navgroup"><div class="t-label">Jump to</div>`+
      [['Unworn only',shopURL({cond:'Unworn'})],['Full set',shopURL({kit:'full'})],
       ['Everything in the case','shop.html']]
      .map(([t,h])=>`<a class="navlink" href="${h}">${t}</a>`).join('')+`</div>`;
    return;
  }
  const ql=q.toLowerCase();
  const hits=CATALOGUE.map((w,i)=>({w,i})).filter(o=>
    (o.w.b+' '+o.w.m+' '+o.w.r+' '+o.w.dial+' '+o.w.y).toLowerCase().includes(ql));
  box.innerHTML = hits.length
    ? `<div class="navgroup"><div class="t-label">${hits.length} watch${hits.length>1?'es':''}</div>`+
      hits.map(o=>row(o.w,o.i)).join('')+
      `<a class="navwa navwa--plain" href="${shopURL({q})}">Open in the case</a></div>`
    : `<div class="navgroup"><div class="t-label">No match</div>
       <p class="t-body">Nothing in the case matches “${q}”. Our concierge can source it.</p>
       <a class="navwa navwa--plain" href="sourcing.html">Start a sourcing request</a></div>`;
}

function sync(){ if(MQ.matches) buildShell(); else { closeMenu(); closeSearch(); } }
window.osMobile=()=>MQ.matches;
document.addEventListener('DOMContentLoaded',()=>{ sync(); MQ.addEventListener?.('change',sync); });
