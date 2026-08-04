/* ============================================================
   ONE STREET WATCHES — shared core
   currency · catalogue data · mega menu · header · carousels
   ============================================================ */
const RATE = 4.70;                      // AED per GBP (indicative — replace with a live feed)
let CUR = localStorage.getItem('osw-cur') || 'AED';
const money = aed => CUR === 'AED'
  ? 'Dhs. ' + aed.toLocaleString('en-US')
  : '£' + Math.round(aed / RATE).toLocaleString('en-GB');

/* ---------------- the catalogue ---------------- */
const SHOT = (a, b) => ({ ph: [a, b] });
const CATALOGUE = [
 {b:"Rolex",m:"Daytona",r:"116520",y:2010,c:"Very good",box:1,pap:1,aed:82250,loc:"Dubai",tag:"Popular",dial:"White",size:40,cat:["Sports","Chronographs"],
  ims:[SHOT("Three-quarter","Steel Daytona at 45°, soft top light, sand plate"),SHOT("Dial macro","Sub-dials filling the frame"),SHOT("Caseback","Serial between the lugs"),SHOT("Box & papers","Full set laid flat")]},
 {b:"Rolex",m:"Submariner “Hulk”",r:"116610LV",y:2019,c:"Excellent",box:1,pap:1,aed:58500,loc:"Dubai",tag:"In Dubai",dial:"Green",size:40,cat:["Sports"],
  ims:[{img:"assets/img/rolex-submariner-hulk.cbc6259304.webp"},SHOT("Dial macro","Green dial, maxi markers, at 1:1"),SHOT("Clasp","Glidelock open"),SHOT("Box & papers","Card, booklets and green box")]},
 {b:"Rolex",m:"GMT-Master II “Sprite”",r:"126720VTNR",y:2023,c:"Unworn",box:1,pap:1,aed:74500,loc:"Dubai",tag:"Unworn",dial:"Black",size:40,cat:["Sports"],
  ims:[{img:"assets/img/rolex-gmt-sprite.d4cfc1f7c4.webp"},SHOT("Bezel detail","Green and black Cerachrom"),SHOT("Left-hand crown","Case profile"),SHOT("Box & papers","Full 2023 set")]},
 {b:"Rolex",m:"Submariner “Starbucks”",r:"126610LV",y:2022,c:"Excellent",box:1,pap:0,aed:52800,loc:"United Kingdom",tag:"In the UK",dial:"Black",size:41,cat:["Sports"],
  ims:[{img:"assets/img/rolex-submariner-starbucks.678e9fb7db.webp"},SHOT("Dial macro","Black dial, green bezel"),SHOT("Caseback","Serial and rehaut"),SHOT("Box only","Box without papers")]},
 {b:"Rolex",m:"Submariner — White gold",r:"126619LB",y:2021,c:"Excellent",box:1,pap:1,aed:139000,loc:"United Kingdom",tag:"In the UK",dial:"Blue",size:41,cat:["Sports","Gold & two-tone"],
  ims:[{img:"assets/img/rolex-submariner-white-gold.3150d025fa.webp"},SHOT("Dial macro","Blue dial, white gold surrounds"),SHOT("Weight & profile","Case on its side"),SHOT("Box & papers","Full set")]},
 {b:"Rolex",m:"Datejust 41",r:"126334",y:2020,c:"Very good",box:1,pap:1,aed:44600,loc:"Dubai",tag:"",dial:"Blue",size:41,cat:["Dress"],
  ims:[SHOT("Three-quarter","Datejust on sand, fluted bezel catching light"),SHOT("Dial macro","Sunburst blue, applied indices"),SHOT("Jubilee bracelet","Five-link detail"),SHOT("Box & papers","Full set")]},
 {b:"Rolex",m:"Day-Date 40",r:"228238",y:2018,c:"Very good",box:1,pap:1,aed:172000,loc:"Dubai",tag:"",dial:"Champagne",size:40,cat:["Dress","Gold & two-tone"],
  ims:[SHOT("Three-quarter","Yellow gold Day-Date, president bracelet"),SHOT("Dial macro","Champagne sunburst, day aperture"),SHOT("Clasp","Crownclasp detail"),SHOT("Box & papers","Full set")]},
 {b:"Rolex",m:"Explorer 36",r:"124270",y:2022,c:"Unworn",box:1,pap:1,aed:36900,loc:"United Kingdom",tag:"Unworn",dial:"Black",size:36,cat:["Sports"],
  ims:[SHOT("Three-quarter","Explorer at 45°, matte black dial"),SHOT("Dial macro","3-6-9 numerals and lume"),SHOT("Caseback","Plain steel back"),SHOT("Box & papers","Full 2022 set")]},
 {b:"Patek Philippe",m:"Nautilus",r:"5711/1A-010",y:2019,c:"Very good",box:1,pap:1,aed:446500,loc:"Dubai",tag:"Grail",dial:"Blue",size:40,cat:["Sports"],
  ims:[SHOT("Three-quarter","Blue dial Nautilus 45°, single key light"),SHOT("Dial macro","Horizontal embossing raked left"),SHOT("Caseback","Sapphire back, movement visible"),SHOT("Box & papers","Full set with outer carton")]},
 {b:"Patek Philippe",m:"Aquanaut",r:"5167A-001",y:2020,c:"Excellent",box:1,pap:1,aed:298000,loc:"Dubai",tag:"",dial:"Black",size:40,cat:["Sports"],
  ims:[SHOT("Three-quarter","Aquanaut on sand, tropical strap curled"),SHOT("Dial macro","Embossed grid pattern"),SHOT("Strap & buckle","Composite strap detail"),SHOT("Box & papers","Full set")]},
 {b:"Patek Philippe",m:"Calatrava",r:"5227G",y:2017,c:"Very good",box:0,pap:1,aed:186000,loc:"United Kingdom",tag:"Papers only",dial:"White",size:39,cat:["Dress","Gold & two-tone"],
  ims:[SHOT("Three-quarter","White gold Calatrava, alligator strap"),SHOT("Dial macro","Applied gold indices"),SHOT("Officer's back","Hinged caseback open"),SHOT("Papers","Certificate flat, serial legible")]},
 {b:"Audemars Piguet",m:"Royal Oak",r:"15400ST",y:2018,c:"Good",box:0,pap:1,aed:112800,loc:"United Kingdom",tag:"Papers only",dial:"Blue",size:41,cat:["Sports"],
  ims:[SHOT("Three-quarter","Steel Royal Oak, bracelet fanned right"),SHOT("Tapisserie macro","Raking light across the dial"),SHOT("Bracelet & clasp","Integrated links"),SHOT("Papers","Certificate flat")]},
 {b:"Audemars Piguet",m:"Royal Oak Offshore",r:"26470ST",y:2019,c:"Excellent",box:1,pap:1,aed:158000,loc:"Dubai",tag:"",dial:"Black",size:42,cat:["Sports","Chronographs"],
  ims:[SHOT("Three-quarter","Offshore chronograph, rubber strap"),SHOT("Dial macro","Méga tapisserie and sub-dials"),SHOT("Pushers","Case flank showing pushers"),SHOT("Box & papers","Full set")]},
 {b:"Audemars Piguet",m:"Royal Oak Double Balance",r:"15468OR",y:2022,c:"Excellent",box:1,pap:1,aed:214000,loc:"Dubai",tag:"",dial:"Grey",size:41,cat:["Sports","Gold & two-tone","Complications"],
  ims:[{img:"assets/img/rolex-submariner-white-gold.3150d025fa.webp"},SHOT("Dial macro","Openworked balance at 9"),SHOT("Rose gold bracelet","Link and bevel detail"),SHOT("Box & papers","Full set")]},
 {b:"Richard Mille",m:"RM 67-01 Extra Flat",r:"RM 67-01",y:2019,c:"Excellent",box:1,pap:1,aed:780000,loc:"Dubai",tag:"Vault",dial:"Skeleton",size:38,cat:["Sports","Complications"],
  ims:[{img:"assets/img/rolex-gmt-sprite.d4cfc1f7c4.webp"},SHOT("Movement macro","Skeleton calibre filling the frame"),SHOT("Case profile","Showing the 7.75mm thickness"),SHOT("Box & papers","Full set with pouch")]},
 {b:"Richard Mille",m:"RM 011 Felipe Massa",r:"RM 011",y:2016,c:"Very good",box:1,pap:1,aed:640000,loc:"Dubai",tag:"Vault",dial:"Skeleton",size:44,cat:["Sports","Chronographs","Complications"],
  ims:[SHOT("Three-quarter","RM 011 at 45°, rubber strap curled behind"),SHOT("Movement macro","Flyback chronograph bridges"),SHOT("Case band","Tripartite case screws"),SHOT("Box & papers","Full set")]},
 {b:"Cartier",m:"Santos — Large",r:"WSSA0018",y:2022,c:"Excellent",box:1,pap:1,aed:29140,loc:"United Kingdom",tag:"Entry",dial:"White",size:40,cat:["Dress"],
  ims:[SHOT("Three-quarter","Santos on sand, bracelet curving behind"),SHOT("Dial macro","Roman numerals, railroad track"),SHOT("QuickSwitch","Bracelet detached, second strap"),SHOT("Box & papers","Full set with both straps")]},
 {b:"Cartier",m:"Santos — Green dial",r:"WSSA0062",y:2023,c:"Unworn",box:1,pap:1,aed:31800,loc:"Dubai",tag:"Unworn",dial:"Green",size:40,cat:["Dress"],
  ims:[{img:"assets/img/rolex-submariner-starbucks.678e9fb7db.webp"},SHOT("Dial macro","Green lacquer, sword hands"),SHOT("Case profile","Exposed screws on the bezel"),SHOT("Box & papers","Full 2023 set")]},
 {b:"Cartier",m:"Tank Must — Large",r:"WSTA0053",y:2021,c:"Very good",box:1,pap:0,aed:16400,loc:"United Kingdom",tag:"",dial:"Black",size:36,cat:["Dress"],
  ims:[SHOT("Three-quarter","Tank Must on leather, three-quarter"),SHOT("Dial macro","Roman numerals, blued hands"),SHOT("Strap & buckle","Leather grain and pin buckle"),SHOT("Box only","Box without papers")]},
 {b:"Cartier",m:"Ballon Bleu 42",r:"W69012Z4",y:2015,c:"Good",box:0,pap:0,aed:19800,loc:"United Kingdom",tag:"Watch only",dial:"Silver",size:42,cat:["Dress"],
  ims:[SHOT("Three-quarter","Ballon Bleu, two-tone bracelet"),SHOT("Crown guard","Blue cabochon detail"),SHOT("Dial macro","Guilloché silver dial"),SHOT("Watch only","Watch photographed alone on sand")]},
 {b:"Vacheron Constantin",m:"Overseas",r:"4500V/110A",y:2020,c:"Excellent",box:1,pap:1,aed:186500,loc:"Dubai",tag:"",dial:"Blue",size:41,cat:["Sports"],
  ims:[SHOT("Three-quarter","Overseas blue dial, bracelet fanned"),SHOT("Dial macro","Sunburst blue and applied indices"),SHOT("Interchangeable straps","All three straps laid out"),SHOT("Box & papers","Full set")]},
 {b:"Vacheron Constantin",m:"Patrimony",r:"81180/000G",y:2016,c:"Very good",box:1,pap:1,aed:98000,loc:"United Kingdom",tag:"",dial:"Silver",size:40,cat:["Dress","Gold & two-tone"],
  ims:[SHOT("Three-quarter","White gold Patrimony on alligator"),SHOT("Dial macro","Minimal baton indices"),SHOT("Caseback","Maltese cross hallmark"),SHOT("Box & papers","Full set")]},
 {b:"Hublot",m:"Big Bang Unico",r:"411.NX.1170.RX",y:2021,c:"Excellent",box:1,pap:1,aed:64200,loc:"Dubai",tag:"",dial:"Skeleton",size:44,cat:["Sports","Chronographs"],
  ims:[SHOT("Three-quarter","Big Bang Unico, titanium, rubber strap"),SHOT("Movement macro","Unico calibre through the dial"),SHOT("Bezel screws","H-screws on the bezel"),SHOT("Box & papers","Full set")]},
 {b:"Hublot",m:"Classic Fusion 45",r:"511.NX.1171.RX",y:2019,c:"Very good",box:1,pap:1,aed:38600,loc:"United Kingdom",tag:"",dial:"Black",size:45,cat:["Dress"],
  ims:[SHOT("Three-quarter","Classic Fusion titanium, matte black dial"),SHOT("Dial macro","Applied indices and date"),SHOT("Strap","Rubber strap with deployant"),SHOT("Box & papers","Full set")]}
];

/* ---------------- shared UI helpers ---------------- */
const inc = (on, label) => `<span class="inc ${on?'on':'off'}"><span class="bx"></span>${label}</span>`;

function productCard(w, i){
  const shots = w.ims.map((im,j)=>`
    <div class="pshot${j===0?' on':''}" data-s="${j}">
      ${im.img ? `<img src="${im.img}" alt="${w.b} ${w.m}">`
               : `<div class="ph"><div class="l1">${im.ph[0]}</div><div class="l2">${im.ph[1]}</div></div>`}
    </div>`).join('');
  return `
  <a class="pcard" href="product.html" data-c="${i}">
    <div class="part">
      ${shots}
      ${w.tag?`<span class="ptag">${w.tag}</span>`:''}
      <div class="zones">${w.ims.map((_,j)=>`<span data-z="${j}"></span>`).join('')}</div>
      <div class="bars">${w.ims.map((_,j)=>`<i class="${j===0?'on':''}"></i>`).join('')}</div>
    </div>
    <div class="pbody">
      <div class="pbrand">${w.b}</div>
      <div class="prow"><span class="pmodel">${w.m}</span>
        <span class="pprice money" data-aed="${w.aed}">${money(w.aed)}</span></div>
      <div class="pmeta">Ref. ${w.r} &nbsp;·&nbsp; ${w.y}</div>
      <div class="pspec">${inc(w.box,'Box')}${inc(w.pap,'Papers')}<span class="cond">${w.c}</span></div>
    </div>
  </a>`;
}

function bindZones(scope){
  (scope||document).querySelectorAll('.pcard').forEach(card=>{
    if(card.dataset.bound) return; card.dataset.bound=1;
    const shots=card.querySelectorAll('.pshot'), bars=card.querySelectorAll('.bars i');
    card.querySelectorAll('.zones span').forEach(z=>{
      z.addEventListener('mouseenter',()=>{const k=+z.dataset.z;
        shots.forEach(s=>s.classList.toggle('on',+s.dataset.s===k));
        bars.forEach((b,j)=>b.classList.toggle('on',j===k));});
    });
    card.addEventListener('mouseleave',()=>{
      shots.forEach(s=>s.classList.toggle('on',+s.dataset.s===0));
      bars.forEach((b,j)=>b.classList.toggle('on',j===0));});
  });
}

function carousel(trackId,prevId,nextId,arrowsId,perStep){
  const track=document.getElementById(trackId); if(!track) return;
  const prev=document.getElementById(prevId), next=document.getElementById(nextId), arrows=document.getElementById(arrowsId);
  const step=()=>{const c=track.firstElementChild;return c?c.offsetWidth+parseFloat(getComputedStyle(track).gap||14):340;};
  next.addEventListener('click',()=>track.scrollBy({left:step()*perStep,behavior:'smooth'}));
  prev.addEventListener('click',()=>track.scrollBy({left:-step()*perStep,behavior:'smooth'}));
  function edges(){const over=track.scrollWidth>track.clientWidth+4;
    arrows.classList.toggle('hide',!over);
    prev.disabled=track.scrollLeft<8;
    next.disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-8;}
  track.addEventListener('scroll',edges);addEventListener('resize',edges);requestAnimationFrame(edges);
}

/* ---------------- mega menus ---------------- */
/* Every figure below is derived from real stock, and every link carries the
   filter state it promises — so a click always lands on the count shown. */
const famOf = w => w.m.split(/\s*[—–]\s*|\s*“/)[0].trim();
const CAT_ORDER = ["Sports","Dress","Chronographs","Complications","Gold & two-tone","Ladies","Vintage — pre-2000"];
const DIAL_ORDER = ["Black","Blue","Green","White","Silver","Champagne","Grey","Skeleton"];
const DIALHEX = {Black:'#1C1B19',Blue:'#24406B',Green:'#2C5B41',White:'#F4F1EA',
                 Silver:'#C3C2BF',Champagne:'#D8C295',Grey:'#8B8A86',Skeleton:null};
const nWhere = f => CATALOGUE.filter(f).length;
const shopURL = o => 'shop.html' + (o && Object.keys(o).length
  ? '?' + Object.entries(o).map(([k,v]) => k + '=' + encodeURIComponent(v)).join('&') : '');
const AEDMAX = Math.max(...CATALOGUE.map(w => w.aed));
const YMAX = Math.max(...CATALOGUE.map(w => w.y));

const UNDER = () => CUR === 'AED' ? ['Under Dhs. 50,000', 0, 50000] : ['Under £10,000', 0, 47000];
const VAULT = () => CUR === 'AED' ? ['The vault — Dhs. 250,000 +', 250000, null] : ['The vault — £50,000 +', 235000, null];
const BANDS = () => CUR === 'AED'
  ? [['Under 25,000',0,25000],['25,000 – 50,000',25000,50000],['50,000 – 150,000',50000,150000],['150,000 +',150000,null]]
  : [['Under £5,000',0,23500],['£5,000 – £10,000',23500,47000],['£10,000 – £30,000',47000,141000],['£30,000 +',141000,null]];
const inBand = (lo,hi) => nWhere(w => w.aed >= lo && (hi == null || w.aed < hi));
const bandURL = (lo,hi) => shopURL({aed: lo + '-' + (hi == null ? AEDMAX : hi)});

const BROWSE = () => {
  const u = UNDER(), v = VAULT();
  return [
    ['All ' + CATALOGUE.length + ' watches', CATALOGUE.length, shopURL({})],
    ['Latest arrivals',            nWhere(w => w.y >= YMAX - 1), shopURL({y:(YMAX-1)+'-'+YMAX, sort:'year'})],
    ['Unworn',                     nWhere(w => w.c === 'Unworn'), shopURL({cond:'Unworn'})],
    ['Full set — box and papers',  nWhere(w => w.box && w.pap), shopURL({kit:'full'})],
    [u[0],                         inBand(u[1], u[2]), bandURL(u[1], u[2])],
    [v[0],                         inBand(v[1], v[2]), bandURL(v[1], v[2])],
    ['Held in Dubai',              nWhere(w => w.loc === 'Dubai'), shopURL({loc:'Dubai'})],
    ['Held in the UK',             nWhere(w => w.loc === 'United Kingdom'), shopURL({loc:'United Kingdom'})]
  ];
};
const CATS = () => CAT_ORDER
  .map(c => [c, nWhere(w => (w.cat||[]).includes(c)), shopURL({cat:c})])
  .filter(x => x[1]);
const DIALS = () => DIAL_ORDER
  .filter(d => nWhere(w => w.dial === d))
  .map(d => [d, DIALHEX[d], nWhere(w => w.dial === d), shopURL({dial:d})]);
const SIZES = () => [...new Set(CATALOGUE.map(w => w.size))].sort((a,b) => a-b)
  .map(s => [s + ' mm', shopURL({size:s + '-' + s})]);
const BRANDLIST = () => [...new Set(CATALOGUE.map(w => w.b))].map(b => ({
  n: b,
  c: nWhere(w => w.b === b),
  m: [...new Set(CATALOGUE.filter(w => w.b === b).map(famOf))]
       .map(f => [f, nWhere(w => w.b === b && famOf(w) === f)])
       .sort((x,y) => y[1] - x[1])
}));

const $m = id => document.getElementById(id);
const linkList = items => items.map(([a,b,href]) =>
  `<a href="${href || 'shop.html'}">${a}${b ? `<span>${b}</span>` : ''}</a>`).join('');
const miniRow=(w,i)=>{const im=w.ims.find(x=>x.img);
  return `<a class="ni" href="product.html?i=${i}"><span class="im">${im?`<img src="${im.img}" alt="">`:''}</span>
    <span><span class="n">${w.b} ${w.m}</span><span class="p money" data-aed="${w.aed}">${money(w.aed)}</span></span></a>`;};

function buildShopPanel(){
  if(!$m('sh-browse')) return;
  /* re-run on every currency switch — the price language changes with it */
  window.bands = () => {
    $m('sh-browse').innerHTML = linkList(BROWSE());
    const p = $m('sh-prices');
    if(p) p.innerHTML = BANDS().map(([l,lo,hi]) =>
      `<a class="chip" href="${bandURL(lo,hi)}">${l}</a>`).join('');
  };
  window.bands();
  $m('sh-cat').innerHTML = linkList(CATS());
  $m('sh-cond').innerHTML = linkList(['Unworn','Excellent','Very good','Good']
    .map(c => [c, nWhere(w => w.c === c), shopURL({cond:c})]).filter(x => x[1]));
  $m('sh-dials').innerHTML = DIALS().map(([n,hex,c,href]) =>
    `<a class="dial" href="${href}"><i style="background:${hex||'transparent'};${hex?'':'box-shadow:inset 0 0 0 1px #1C1B19'}"></i>${n}<em>${c}</em></a>`).join('');
  $m('sh-sizes').innerHTML = SIZES().map(([l,href]) => `<a class="chip" href="${href}">${l}</a>`).join('');
  $m('sh-new').innerHTML = CATALOGUE.map((w,i) => ({w,i})).sort((a,b) => b.w.y - a.w.y)
    .slice(0,4).map(o => miniRow(o.w,o.i)).join('');
  const full = $m('mb-full'); if(full) full.textContent = nWhere(w => w.box && w.pap);
}

function buildBrandPanel(){
  if(!$m('br-list')) return;
  const BR = BRANDLIST();
  const mm = $m('mb-maisons'); if(mm) mm.textContent = BR.length;
  $m('br-list').innerHTML = BR.map((b,i) =>
    `<button class="mbrand" data-b="${i}" aria-selected="${i===0}">${b.n}<em>${b.c}</em></button>`).join('');
  const show = i => {
    const b = BR[i];
    $m('br-modelh').textContent = b.n + ' — by model';
    $m('br-models').innerHTML =
      `<a href="${shopURL({brand:b.n})}">All ${b.n}<span>${b.c}</span></a>` +
      linkList(b.m.map(([f,c]) => [f, c, shopURL({brand:b.n, fam:f})]));
    $m('br-sigh').textContent = 'In stock — ' + b.n;
    const stock = CATALOGUE.map((w,k) => ({w,k})).filter(o => o.w.b === b.n).slice(0,3);
    $m('br-sig').innerHTML = stock.length
      ? stock.map(o => miniRow(o.w,o.k)).join('')
      : `<p class="mnone">None in the case this week — our concierge can source one.</p>`;
    document.querySelectorAll('.mbrand').forEach(x => x.setAttribute('aria-selected', String(+x.dataset.b === i)));
    repaintMoney();
  };
  show(0);
  document.querySelectorAll('.mbrand').forEach(b => {
    const go = () => show(+b.dataset.b);
    b.addEventListener('mouseenter',go); b.addEventListener('focus',go);
    /* click on a maison goes straight to the filtered case */
    b.addEventListener('click',()=>{ location.href = shopURL({brand: BR[+b.dataset.b].n}); });
  });
}

function initMega(){
  const panels={shop:$m('mega-shop'), brands:$m('mega-brands')};
  const scrim=$m('scrim'), navEl=document.querySelector('nav');
  if(!panels.shop || !navEl) return;
  let openT=null, closeT=null, current=null;
  const shut=()=>{clearTimeout(openT);clearTimeout(closeT);current=null;
    Object.values(panels).forEach(p=>p&&p.classList.remove('on'));
    scrim.classList.remove('on');
    document.querySelectorAll('.mtrigger').forEach(t=>{t.classList.remove('open');t.setAttribute('aria-expanded','false')});};
  const open=key=>{clearTimeout(openT);clearTimeout(closeT);current=key;
    Object.entries(panels).forEach(([k,p])=>p&&p.classList.toggle('on',k===key));
    scrim.classList.add('on');
    document.querySelectorAll('.mtrigger').forEach(t=>{
      const on=t.dataset.mega===key;
      t.classList.toggle('open',on); t.setAttribute('aria-expanded',String(on));});};
  const schedClose=()=>{clearTimeout(openT);clearTimeout(closeT);closeT=setTimeout(shut,240)};

  document.querySelectorAll('.mtrigger').forEach(t=>{
    t.setAttribute('aria-expanded','false');
    t.addEventListener('mouseenter',()=>{clearTimeout(closeT);clearTimeout(openT);
      openT=setTimeout(()=>open(t.dataset.mega),90);});
    t.addEventListener('focus',()=>open(t.dataset.mega));
    /* click follows the link — the panel is a preview, not a gate */
  });
  document.querySelectorAll('.links a:not(.mtrigger)').forEach(a=>a.addEventListener('mouseenter',schedClose));
  navEl.addEventListener('mouseenter',()=>clearTimeout(closeT));
  navEl.addEventListener('mouseleave',schedClose);
  Object.values(panels).forEach(p=>p&&p.addEventListener('mouseenter',()=>{clearTimeout(closeT);clearTimeout(openT)}));
  scrim.addEventListener('click',shut);
  addEventListener('keydown',e=>{if(e.key==='Escape')shut()});
}

function buildMega(){ buildShopPanel(); buildBrandPanel(); initMega(); }

/* ---------------- currency ---------------- */
function repaintMoney(){
  document.querySelectorAll('.money').forEach(el=>el.textContent=money(+el.dataset.aed));
  const cn=document.getElementById('curName'); if(cn) cn.textContent=CUR;
  if(typeof window.bands==='function') window.bands();
  if(typeof window.onCurrency==='function') window.onCurrency();
}
function initCurrency(){
  document.querySelectorAll('.seg button').forEach(b=>{
    b.setAttribute('aria-pressed', String(b.dataset.cur===CUR));
    b.addEventListener('click',()=>{
      CUR=b.dataset.cur; localStorage.setItem('osw-cur',CUR);
      document.querySelectorAll('.seg button').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.cur===CUR)));
      repaintMoney();
    });
  });
}

/* ---------------- header elevation ---------------- */
function initHeader(){
  const n=document.querySelector('nav'); if(!n) return;
  const f=()=>n.classList.toggle('stuck', window.scrollY>10);
  addEventListener('scroll',f,{passive:true}); f();
  document.querySelectorAll('.nstock').forEach(e => e.textContent = CATALOGUE.length);
  const maisons = new Set(CATALOGUE.map(w => w.b)).size;
  document.querySelectorAll('.nmaisons').forEach(e => e.textContent = maisons);
  const page=document.body.dataset.page;
  document.querySelectorAll('.links a, .links .mtrigger').forEach(a=>{
    if(a.dataset.nav===page) a.classList.add('current');
  });
}

/* ---------------- header search ---------------- */
const PAGES=[
 ['Sell or part-exchange','A firm offer within the hour, paid the same day','sell.html'],
 ['Concierge sourcing','Name the reference — we hunt it down','sourcing.html'],
 ['Servicing &amp; polishing','Swiss-trained watchmakers, our own bench','servicing.html'],
 ['Authentication','41 checks and a written report','servicing.html'],
 ['Visit us','Dubai daily, the UK by appointment','visit.html'],
 ['The journal','Notes from the case','journal.html'],
 ['About One Street','Who we are and why we started','about.html'],
 ['Contact','A real person, seven days a week','contact.html']
];
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const hl = (t,q) => {
  if(!q) return esc(t);
  const i = t.toLowerCase().indexOf(q.toLowerCase());
  return i < 0 ? esc(t)
    : esc(t.slice(0,i)) + '<mark>' + esc(t.slice(i,i+q.length)) + '</mark>' + esc(t.slice(i+q.length));
};

function initSearch(){
  const input = $m('q'), box = $m('sug');
  if(!input || !box) return;
  let items = [], cur = -1;
  const shut = () => { box.classList.remove('on'); input.setAttribute('aria-expanded','false'); cur = -1; };

  const quick = (k,label,href) =>
    `<a class="quick" href="${href}" role="option"><span class="k">${k||''}</span>
     <span class="tx"><span class="n">${label}</span></span></a>`;
  const pageRow = (p,q) =>
    `<a href="${p[2]}" role="option"><span class="k" style="width:42px;flex:none"></span>
     <span class="tx"><span class="n">${q?hl(p[0],q):p[0]}</span><span class="s">${p[1]}</span></span></a>`;
  const watchRow = (w,i,q) => {
    const im = w.ims.find(x => x.img);
    return `<a href="product.html?i=${i}" role="option">
      <span class="im">${im?`<img src="${im.img}" alt="">`:`<span>${esc(w.b.slice(0,3))}</span>`}</span>
      <span class="tx"><span class="n">${hl(w.b+' '+w.m,q)}</span>
      <span class="s">Ref. ${hl(w.r,q)} &nbsp;·&nbsp; ${w.y} &nbsp;·&nbsp; ${w.c}</span></span>
      <span class="p money" data-aed="${w.aed}">${money(w.aed)}</span></a>`;
  };

  function paint(){
    const q = input.value.trim();
    let h = '';
    if(!q){
      h += `<div class="sughead">By maison</div>`;
      BRANDLIST().slice(0,4).forEach(b => { h += quick(b.c, b.n, shopURL({brand:b.n})); });
      const u = UNDER();
      h += `<div class="sughead sep">Jump straight to</div>`
         + quick('', 'Unworn only', shopURL({cond:'Unworn'}))
         + quick('', 'Full set — box and papers', shopURL({kit:'full'}))
         + quick('', u[0], bandURL(u[1],u[2]))
         + `<div class="sughead sep">Elsewhere on the site</div>`
         + PAGES.slice(0,5).map(p => pageRow(p,'')).join('')
         + `<a class="all" href="shop.html">Browse all ${CATALOGUE.length} watches →</a>`;
    } else {
      const ql = q.toLowerCase();
      const hits = CATALOGUE.map((w,i) => ({w,i})).filter(o =>
        (o.w.b+' '+o.w.m+' '+o.w.r+' '+o.w.dial+' '+o.w.y+' '+o.w.loc).toLowerCase().includes(ql));
      const brands = [...new Set(CATALOGUE.map(w => w.b))].filter(b => b.toLowerCase().includes(ql));
      const fams = [...new Set(CATALOGUE.map(famOf))].filter(f => f.toLowerCase().includes(ql));
      const pages = PAGES.filter(p => (p[0]+' '+p[1]).toLowerCase().includes(ql));
      if(!hits.length && !brands.length && !fams.length && !pages.length){
        h = `<div class="none">Nothing in the case matches “${esc(q)}” right now.<br>
             Tell our concierge what you are after — average time to source is eleven days.</div>
             <a class="all" href="sourcing.html">Start a sourcing request →</a>`;
      } else {
        if(brands.length || fams.length){
          h += `<div class="sughead">Collections</div>`;
          brands.slice(0,3).forEach(b => { h += quick(nWhere(w => w.b === b), hl(b,q), shopURL({brand:b})); });
          fams.slice(0,4).forEach(f => {
            const b = CATALOGUE.find(w => famOf(w) === f).b;
            h += quick(nWhere(w => famOf(w) === f), esc(b)+' '+hl(f,q), shopURL({brand:b, fam:f}));
          });
        }
        if(hits.length){
          h += `<div class="sughead${(brands.length||fams.length)?' sep':''}">Watches<em>${hits.length} in stock</em></div>`;
          hits.slice(0,5).forEach(o => { h += watchRow(o.w, o.i, q); });
        }
        if(pages.length){
          h += `<div class="sughead sep">Pages</div>` + pages.slice(0,3).map(p => pageRow(p,q)).join('');
        }
        h += `<a class="all" href="${shopURL({q})}">See ${hits.length} result${hits.length===1?'':'s'} for “${esc(q)}” →</a>`;
      }
    }
    box.innerHTML = h;
    box.querySelectorAll('.money').forEach(e => e.textContent = money(+e.dataset.aed));
    items = [...box.querySelectorAll('a')];
    cur = -1;
    box.classList.add('on');
    input.setAttribute('aria-expanded','true');
  }

  input.addEventListener('input', paint);
  input.addEventListener('focus', paint);
  input.addEventListener('keydown', e => {
    if(e.key === 'Escape'){ shut(); input.blur(); return; }
    if(e.key === 'ArrowDown' || e.key === 'ArrowUp'){
      if(!box.classList.contains('on')){ paint(); return; }
      e.preventDefault();
      if(!items.length) return;
      cur = e.key === 'ArrowDown' ? (cur+1) % items.length : (cur-1+items.length) % items.length;
      items.forEach((a,j) => a.classList.toggle('cursor', j === cur));
      items[cur].scrollIntoView({block:'nearest'});
      return;
    }
    if(e.key === 'Enter'){
      e.preventDefault();
      if(cur >= 0 && items[cur]) location.href = items[cur].getAttribute('href');
      else if(input.value.trim()) location.href = shopURL({q: input.value.trim()});
    }
  });
  document.addEventListener('click', e => { if(!e.target.closest('.srchwrap')) shut(); });
  /* the mega menu and the suggestion list must never be open together */
  document.querySelectorAll('.mtrigger').forEach(t => t.addEventListener('mouseenter', shut));
}

document.addEventListener('DOMContentLoaded',()=>{ buildMega(); initCurrency(); initHeader(); initSearch(); repaintMoney(); });
