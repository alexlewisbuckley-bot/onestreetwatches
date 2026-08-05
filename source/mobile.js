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
/* Three things people come to do, then the rest. Labels in their words,
   not ours — "Find me a watch", not "Concierge sourcing". */
const PRIMARY = [
  {t:'Browse the case', s:'', href:'shop.html', k:'case'},
  {t:'Ask us anything', s:'On WhatsApp, seven days', href:'#wa', k:'wa'},
  {t:'Book a viewing',  s:'Dubai, the UK or on camera', href:'book.html', k:'book'}
];
const NAV = [
  {t:'Sell a watch',        href:'sell.html'},
  {t:'Find me a watch',     href:'sourcing.html'},
  {t:'Service a watch',     href:'servicing.html'},
  {t:'Visit us',            href:'visit.html'},
  {t:'About One Street',    href:'about.html'}
];
const WANO=WA_LINK;

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
        <div class="navbig">
          ${PRIMARY.map(r=>`<a class="navtile" href="${r.k==='wa'?WANO:r.href}" data-k="${r.k}">
            <span class="navtile__t">${r.t}</span>
            ${r.s?`<span class="navtile__s">${r.s}</span>`:'<span class="navtile__s" data-n="stock"></span>'}
            <span class="navtile__a">→</span></a>`).join('')}
        </div>
        <div class="navrest">
          ${NAV.map(r=>`<a class="navlink" href="${r.href}">${r.t}</a>`).join('')}
        </div>
        <div class="navfoot">
          <div class="navcur">
            <button data-c="AED" aria-pressed="${CUR==='AED'}">AED</button>
            <button data-c="GBP" aria-pressed="${CUR==='GBP'}">GBP</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(m);
    document.getElementById('m-close').addEventListener('click',closeMenu);
    const sc=m.querySelector('[data-n="stock"]'); if(sc) sc.textContent=CATALOGUE.length+' in stock now';
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
  const m=document.getElementById('navmenu'); if(!m) return;
  m.classList.add('on');
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
  const s=document.getElementById('msearch'); if(!s) return;
  s.classList.add('on');
  document.body.style.overflow='hidden';
  paintSearch();
  setTimeout(()=>document.getElementById('mq').focus(),60);
}
function closeSearch(){
  const s=document.getElementById('msearch'); if(!s) return;   /* never built on desktop */
  s.classList.remove('on');
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

/* ============================================================
   SELL & SOURCING — mobile
   Both pages asked for 16 fields before giving anything back, on a site
   where the only conversion is a WhatsApp message. They become a short
   composer: three taps and a model name produce a complete enquiry.
   ============================================================ */
const MAISONS=['Rolex','Patek Philippe','Audemars Piguet','Cartier','Omega','Other'];
const FLOW={
  sell:{
    eyebrow:'Free valuation',
    title:'What is your watch worth?',
    lede:'Four photographs and two minutes is usually enough for a real number.',
    fields:[
      {k:'brand', l:'What are you selling?', type:'chips', opts:MAISONS, otherPh:'Which brand? e.g. Tudor'},
      {k:'model', l:'Model or reference',    type:'text',  ph:'Submariner 116610LV'},
      {k:'cond',  l:'Condition',             type:'chips', opts:['Unworn','Excellent','Very good','Good']},
      {k:'kit',   l:'What is included',      type:'chips', opts:['Full set','Box only','Papers only','Watch only']}
    ],
    cta:'Get a valuation on WhatsApp',
    note:'Send four photos — front, back, clasp and papers — and we come back with a firm number, usually within the hour.',
    msg:v=>`Hello — I would like a valuation.\n\n${v.brand||''} ${v.model||''}\n`+
           `Condition: ${v.cond||'—'}\nIncludes: ${v.kit||'—'}\n\nI will send photographs next.`
  },
  sourcing:{
    eyebrow:'No fee unless we find it',
    title:'Name the reference.',
    lede:'Tell us what you are after. Most searches close in about 48 hours.',
    fields:[
      {k:'brand',  l:'Which maison?',        type:'chips', opts:MAISONS, otherPh:'Which maison? e.g. Vacheron Constantin'},
      {k:'model',  l:'Model or reference',   type:'text',  ph:'Daytona 116500LN, white dial'},
      {k:'budget', l:'Budget',               type:'chips', opts:['Under 50k','50–150k','150–350k','350k +','Open']}
    ],
    cta:'Start the search on WhatsApp',
    note:'One person looks after your search from the first message to the handover. No fee unless we find it.',
    msg:v=>`Hello — I am looking for a watch.\n\n${v.brand||''} ${v.model||''}\n`+
           `Budget: ${v.budget||'—'}\n\nCan you find it?`
  }
};

function buildFlowPage(){
  const page=document.body.dataset.page;
  const cfg=FLOW[page]; if(!cfg) return;
  const head=document.querySelector('.phead'); if(!head) return;

  /* compact intro — the 40-word lede goes */
  const h1=head.querySelector('h1'); if(h1) h1.textContent=cfg.title;
  const lede=head.querySelector('.lede'); if(lede) lede.textContent=cfg.lede;
  if(h1 && !head.querySelector('.t-label')){
    const e=document.createElement('div'); e.className='t-label';
    e.textContent=cfg.eyebrow; h1.before(e);       /* h1 may be nested in .wrap */
  }

  /* SEL is what was tapped; V is what we actually send. They differ for
     "Other", where the tap only asks a question and the typed answer is
     the value. */
  const SEL={}, V={};
  const box=document.createElement('section');
  box.className='mflow';
  box.innerHTML=cfg.fields.map(f=>`
    <div class="mfield" data-k="${f.k}">
      <div class="t-label">${f.l}</div>
      ${f.type==='chips'
        ? `<div class="mchipset">${f.opts.map(o=>`<button class="mchip2" data-v="${o}">${o}</button>`).join('')}</div>`
          + (f.opts.indexOf('Other')>-1
             ? `<input class="mtext mother" type="text" autocomplete="off"
                       placeholder="${f.otherPh||'Tell us which'}" aria-label="${f.otherPh||'Tell us which'}">`
             : '')
        : `<input class="mtext" data-k="${f.k}" type="text" placeholder="${f.ph}" autocomplete="off">`}
    </div>`).join('')
    + `<button class="mflowgo" id="mflowgo" disabled>${cfg.cta} <span class="a">→</span></button>
       <p class="mflownote">${cfg.note}</p>`;
  head.after(box);

  const go=document.getElementById('mflowgo');
  const refresh=()=>{
    const ok=V.brand && (V.model||'').trim().length>1;
    go.disabled=!ok;
    go.onclick=ok?()=>{ location.href=waURL(cfg.msg(V)); }:null;
  };
  box.querySelectorAll('.mchipset').forEach(set=>{
    const field=set.parentElement, k=field.dataset.k;
    const other=field.querySelector('.mother');
    const settle=()=>{ V[k]=SEL[k]==='Other' ? ((other&&other.value.trim())||null) : (SEL[k]||null); refresh(); };
    set.querySelectorAll('.mchip2').forEach(c=>c.addEventListener('click',()=>{
      const on=SEL[k]===c.dataset.v;                 /* tapping the live chip clears it */
      SEL[k]=on?null:c.dataset.v;
      set.querySelectorAll('.mchip2').forEach(x=>x.classList.toggle('on',!on&&x===c));
      if(other){
        const ask=SEL[k]==='Other';
        field.classList.toggle('askother',ask);
        if(ask) requestAnimationFrame(()=>other.focus());
        else other.value='';
      }
      settle();
    }));
    if(other) other.addEventListener('input',settle);
  });
  box.querySelectorAll('.mtext[data-k]').forEach(t=>
    t.addEventListener('input',()=>{V[t.dataset.k]=t.value;refresh();}));
  refresh();

  /* the numbered process list becomes taps, like the authentication section */
  const list=document.querySelector('.nlist');
  if(list){
    const rows=[...list.querySelectorAll('.nrow')].map(r=>[
      (r.querySelector('.n')||{}).textContent||'',
      (r.querySelector('h4')||{}).textContent||'',
      (r.querySelector('p')||{}).textContent||'']);
    if(rows.length){
      list.classList.add('msteps');
      list.innerHTML=`<div class="mstepchips" role="tablist">${rows.map((r,i)=>
          `<button role="tab" aria-selected="${i===0}" data-i="${i}"><b>${r[0].trim()}</b><span>${r[1]}</span></button>`).join('')}</div>
        <div class="msteppanel"></div>`;
      const panel=list.querySelector('.msteppanel');
      const show=i=>{panel.innerHTML=`<h4>${rows[i][1]}</h4><p>${rows[i][2]}</p>`;
        list.querySelectorAll('[role=tab]').forEach((t,j)=>t.setAttribute('aria-selected',String(j===i)));};
      list.querySelectorAll('[role=tab]').forEach(t=>t.addEventListener('click',()=>{
        show(+t.dataset.i); t.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'});}));
      show(0);
    }
  }
}
document.addEventListener('DOMContentLoaded',()=>{
  if(window.osMobile && osMobile()) setTimeout(buildFlowPage,0);
});
