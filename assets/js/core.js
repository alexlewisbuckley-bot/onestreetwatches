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
 {b:"Rolex",m:"Daytona",r:"116520",y:2010,c:"Very good",box:1,pap:1,aed:82250,loc:"Dubai",tag:"Popular",dial:"White",size:40,
  ims:[SHOT("Three-quarter","Steel Daytona at 45°, soft top light, sand plate"),SHOT("Dial macro","Sub-dials filling the frame"),SHOT("Caseback","Serial between the lugs"),SHOT("Box & papers","Full set laid flat")]},
 {b:"Rolex",m:"Submariner “Hulk”",r:"116610LV",y:2019,c:"Excellent",box:1,pap:1,aed:58500,loc:"Dubai",tag:"In Dubai",dial:"Green",size:40,
  ims:[{img:"assets/img/rolex-submariner-hulk.webp"},SHOT("Dial macro","Green dial, maxi markers, at 1:1"),SHOT("Clasp","Glidelock open"),SHOT("Box & papers","Card, booklets and green box")]},
 {b:"Rolex",m:"GMT-Master II “Sprite”",r:"126720VTNR",y:2023,c:"Unworn",box:1,pap:1,aed:74500,loc:"Dubai",tag:"Unworn",dial:"Black",size:40,
  ims:[{img:"assets/img/rolex-gmt-sprite.webp"},SHOT("Bezel detail","Green and black Cerachrom"),SHOT("Left-hand crown","Case profile"),SHOT("Box & papers","Full 2023 set")]},
 {b:"Rolex",m:"Submariner “Starbucks”",r:"126610LV",y:2022,c:"Excellent",box:1,pap:0,aed:52800,loc:"United Kingdom",tag:"In the UK",dial:"Black",size:41,
  ims:[{img:"assets/img/rolex-submariner-starbucks.webp"},SHOT("Dial macro","Black dial, green bezel"),SHOT("Caseback","Serial and rehaut"),SHOT("Box only","Box without papers")]},
 {b:"Rolex",m:"Submariner — White gold",r:"126619LB",y:2021,c:"Excellent",box:1,pap:1,aed:139000,loc:"United Kingdom",tag:"In the UK",dial:"Blue",size:41,
  ims:[{img:"assets/img/rolex-submariner-white-gold.webp"},SHOT("Dial macro","Blue dial, white gold surrounds"),SHOT("Weight & profile","Case on its side"),SHOT("Box & papers","Full set")]},
 {b:"Rolex",m:"Datejust 41",r:"126334",y:2020,c:"Very good",box:1,pap:1,aed:44600,loc:"Dubai",tag:"",dial:"Blue",size:41,
  ims:[SHOT("Three-quarter","Datejust on sand, fluted bezel catching light"),SHOT("Dial macro","Sunburst blue, applied indices"),SHOT("Jubilee bracelet","Five-link detail"),SHOT("Box & papers","Full set")]},
 {b:"Rolex",m:"Day-Date 40",r:"228238",y:2018,c:"Very good",box:1,pap:1,aed:172000,loc:"Dubai",tag:"",dial:"Champagne",size:40,
  ims:[SHOT("Three-quarter","Yellow gold Day-Date, president bracelet"),SHOT("Dial macro","Champagne sunburst, day aperture"),SHOT("Clasp","Crownclasp detail"),SHOT("Box & papers","Full set")]},
 {b:"Rolex",m:"Explorer 36",r:"124270",y:2022,c:"Unworn",box:1,pap:1,aed:36900,loc:"United Kingdom",tag:"Unworn",dial:"Black",size:36,
  ims:[SHOT("Three-quarter","Explorer at 45°, matte black dial"),SHOT("Dial macro","3-6-9 numerals and lume"),SHOT("Caseback","Plain steel back"),SHOT("Box & papers","Full 2022 set")]},
 {b:"Patek Philippe",m:"Nautilus",r:"5711/1A-010",y:2019,c:"Very good",box:1,pap:1,aed:446500,loc:"Dubai",tag:"Grail",dial:"Blue",size:40,
  ims:[SHOT("Three-quarter","Blue dial Nautilus 45°, single key light"),SHOT("Dial macro","Horizontal embossing raked left"),SHOT("Caseback","Sapphire back, movement visible"),SHOT("Box & papers","Full set with outer carton")]},
 {b:"Patek Philippe",m:"Aquanaut",r:"5167A-001",y:2020,c:"Excellent",box:1,pap:1,aed:298000,loc:"Dubai",tag:"",dial:"Black",size:40,
  ims:[SHOT("Three-quarter","Aquanaut on sand, tropical strap curled"),SHOT("Dial macro","Embossed grid pattern"),SHOT("Strap & buckle","Composite strap detail"),SHOT("Box & papers","Full set")]},
 {b:"Patek Philippe",m:"Calatrava",r:"5227G",y:2017,c:"Very good",box:0,pap:1,aed:186000,loc:"United Kingdom",tag:"Papers only",dial:"White",size:39,
  ims:[SHOT("Three-quarter","White gold Calatrava, alligator strap"),SHOT("Dial macro","Applied gold indices"),SHOT("Officer's back","Hinged caseback open"),SHOT("Papers","Certificate flat, serial legible")]},
 {b:"Audemars Piguet",m:"Royal Oak",r:"15400ST",y:2018,c:"Good",box:0,pap:1,aed:112800,loc:"United Kingdom",tag:"Papers only",dial:"Blue",size:41,
  ims:[SHOT("Three-quarter","Steel Royal Oak, bracelet fanned right"),SHOT("Tapisserie macro","Raking light across the dial"),SHOT("Bracelet & clasp","Integrated links"),SHOT("Papers","Certificate flat")]},
 {b:"Audemars Piguet",m:"Royal Oak Offshore",r:"26470ST",y:2019,c:"Excellent",box:1,pap:1,aed:158000,loc:"Dubai",tag:"",dial:"Black",size:42,
  ims:[SHOT("Three-quarter","Offshore chronograph, rubber strap"),SHOT("Dial macro","Méga tapisserie and sub-dials"),SHOT("Pushers","Case flank showing pushers"),SHOT("Box & papers","Full set")]},
 {b:"Audemars Piguet",m:"Royal Oak Double Balance",r:"15468OR",y:2022,c:"Excellent",box:1,pap:1,aed:214000,loc:"Dubai",tag:"",dial:"Grey",size:41,
  ims:[{img:"assets/img/rolex-submariner-white-gold.webp"},SHOT("Dial macro","Openworked balance at 9"),SHOT("Rose gold bracelet","Link and bevel detail"),SHOT("Box & papers","Full set")]},
 {b:"Richard Mille",m:"RM 67-01 Extra Flat",r:"RM 67-01",y:2019,c:"Excellent",box:1,pap:1,aed:780000,loc:"Dubai",tag:"Vault",dial:"Skeleton",size:38,
  ims:[{img:"assets/img/rolex-gmt-sprite.webp"},SHOT("Movement macro","Skeleton calibre filling the frame"),SHOT("Case profile","Showing the 7.75mm thickness"),SHOT("Box & papers","Full set with pouch")]},
 {b:"Richard Mille",m:"RM 011 Felipe Massa",r:"RM 011",y:2016,c:"Very good",box:1,pap:1,aed:640000,loc:"Dubai",tag:"Vault",dial:"Skeleton",size:44,
  ims:[SHOT("Three-quarter","RM 011 at 45°, rubber strap curled behind"),SHOT("Movement macro","Flyback chronograph bridges"),SHOT("Case band","Tripartite case screws"),SHOT("Box & papers","Full set")]},
 {b:"Cartier",m:"Santos — Large",r:"WSSA0018",y:2022,c:"Excellent",box:1,pap:1,aed:29140,loc:"United Kingdom",tag:"Entry",dial:"White",size:40,
  ims:[SHOT("Three-quarter","Santos on sand, bracelet curving behind"),SHOT("Dial macro","Roman numerals, railroad track"),SHOT("QuickSwitch","Bracelet detached, second strap"),SHOT("Box & papers","Full set with both straps")]},
 {b:"Cartier",m:"Santos — Green dial",r:"WSSA0062",y:2023,c:"Unworn",box:1,pap:1,aed:31800,loc:"Dubai",tag:"Unworn",dial:"Green",size:40,
  ims:[{img:"assets/img/rolex-submariner-starbucks.webp"},SHOT("Dial macro","Green lacquer, sword hands"),SHOT("Case profile","Exposed screws on the bezel"),SHOT("Box & papers","Full 2023 set")]},
 {b:"Cartier",m:"Tank Must — Large",r:"WSTA0053",y:2021,c:"Very good",box:1,pap:0,aed:16400,loc:"United Kingdom",tag:"",dial:"Black",size:36,
  ims:[SHOT("Three-quarter","Tank Must on leather, three-quarter"),SHOT("Dial macro","Roman numerals, blued hands"),SHOT("Strap & buckle","Leather grain and pin buckle"),SHOT("Box only","Box without papers")]},
 {b:"Cartier",m:"Ballon Bleu 42",r:"W69012Z4",y:2015,c:"Good",box:0,pap:0,aed:19800,loc:"United Kingdom",tag:"Watch only",dial:"Silver",size:42,
  ims:[SHOT("Three-quarter","Ballon Bleu, two-tone bracelet"),SHOT("Crown guard","Blue cabochon detail"),SHOT("Dial macro","Guilloché silver dial"),SHOT("Watch only","Watch photographed alone on sand")]},
 {b:"Vacheron Constantin",m:"Overseas",r:"4500V/110A",y:2020,c:"Excellent",box:1,pap:1,aed:186500,loc:"Dubai",tag:"",dial:"Blue",size:41,
  ims:[SHOT("Three-quarter","Overseas blue dial, bracelet fanned"),SHOT("Dial macro","Sunburst blue and applied indices"),SHOT("Interchangeable straps","All three straps laid out"),SHOT("Box & papers","Full set")]},
 {b:"Vacheron Constantin",m:"Patrimony",r:"81180/000G",y:2016,c:"Very good",box:1,pap:1,aed:98000,loc:"United Kingdom",tag:"",dial:"Silver",size:40,
  ims:[SHOT("Three-quarter","White gold Patrimony on alligator"),SHOT("Dial macro","Minimal baton indices"),SHOT("Caseback","Maltese cross hallmark"),SHOT("Box & papers","Full set")]},
 {b:"Hublot",m:"Big Bang Unico",r:"411.NX.1170.RX",y:2021,c:"Excellent",box:1,pap:1,aed:64200,loc:"Dubai",tag:"",dial:"Skeleton",size:44,
  ims:[SHOT("Three-quarter","Big Bang Unico, titanium, rubber strap"),SHOT("Movement macro","Unico calibre through the dial"),SHOT("Bezel screws","H-screws on the bezel"),SHOT("Box & papers","Full set")]},
 {b:"Hublot",m:"Classic Fusion 45",r:"511.NX.1171.RX",y:2019,c:"Very good",box:1,pap:1,aed:38600,loc:"United Kingdom",tag:"",dial:"Black",size:45,
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
const MEGA=[
 {n:"Rolex",c:58,m:[["Submariner",14],["GMT-Master II",9],["Datejust",11],["Daytona",7],["Day-Date",6],["Explorer",4],["Sea-Dweller",3],["Sky-Dweller",2]]},
 {n:"Patek Philippe",c:16,m:[["Nautilus",6],["Aquanaut",3],["Calatrava",4],["Complications",3]]},
 {n:"Audemars Piguet",c:21,m:[["Royal Oak",12],["Royal Oak Offshore",6],["Code 11.59",3]]},
 {n:"Richard Mille",c:6,m:[["RM 011",2],["RM 035",2],["RM 67-01",1],["RM 010",1]]},
 {n:"Cartier",c:14,m:[["Santos",5],["Tank",4],["Ballon Bleu",3],["Panthère",2]]},
 {n:"Vacheron Constantin",c:7,m:[["Overseas",4],["Patrimony",2],["Traditionnelle",1]]},
 {n:"Hublot",c:9,m:[["Big Bang",5],["Classic Fusion",3],["Spirit of Big Bang",1]]}
];
const BROWSE=[["All 142 watches",142],["New this week",11],["Unworn",9],["Full set only",96],
              ["Under Dhs. 50,000",47],["The vault — price on request",6],["Recently sold",0]];
const CATS=[["Sports",64],["Dress",31],["Gold & two-tone",28],["Complications",19],["Chronographs",22],
            ["Vintage — pre-2000",11],["Ladies",8]];
const DIALS=[["Black","#1C1B19",44],["Blue","#24406B",27],["Green","#2C5B41",21],["White","#F4F1EA",23],
             ["Silver","#C3C2BF",12],["Champagne","#D8C295",9],["Grey","#8B8A86",6],["Skeleton",null,5]];
const SIZES=["36 mm","38 mm","40 mm","41 mm","42 mm","44 mm"];
const BANDS={AED:["Under 25,000","25,000 – 50,000","50,000 – 150,000","150,000 +"],
             GBP:["Under £5,000","£5,000 – £10,000","£10,000 – £30,000","£30,000 +"]};
const $m=id=>document.getElementById(id);
const linkList=(items)=>items.map(([a,b])=>
  `<a href="shop.html">${a}${b?`<span>${b}</span>`:''}</a>`).join('');
const miniRow=(w,i)=>{const im=w.ims.find(x=>x.img);
  return `<a class="ni" href="product.html?i=${i}"><span class="im">${im?`<img src="${im.img}" alt="">`:''}</span>
    <span><span class="n">${w.b} ${w.m}</span><span class="p money" data-aed="${w.aed}">${money(w.aed)}</span></span></a>`;};

function buildShopPanel(){
  if(!$m('sh-browse')) return;
  $m('sh-browse').innerHTML=linkList(BROWSE);
  $m('sh-cat').innerHTML=linkList(CATS);
  $m('sh-dials').innerHTML=DIALS.map(d=>`<a class="dial" href="shop.html"><i style="background:${d[1]||'transparent'};${d[1]?'':'box-shadow:inset 0 0 0 1px #1C1B19'}"></i>${d[0]}<em>${d[2]}</em></a>`).join('');
  $m('sh-sizes').innerHTML=SIZES.map(s=>`<a class="chip" href="shop.html">${s}</a>`).join('');
  window.bands=()=>{const p=$m('sh-prices'); if(p) p.innerHTML=BANDS[CUR].map(x=>`<a class="chip" href="shop.html">${x}</a>`).join('');};
  window.bands();
  $m('sh-new').innerHTML=CATALOGUE.slice(0,4).map((w,i)=>miniRow(w,i)).join('');
}

function buildBrandPanel(){
  if(!$m('br-list')) return;
  $m('br-list').innerHTML=MEGA.map((b,i)=>
    `<button class="mbrand" data-b="${i}" aria-selected="${i===0}">${b.n}<em>${b.c}</em></button>`).join('');
  const show=i=>{
    const b=MEGA[i];
    $m('br-modelh').textContent=b.n+' — by model';
    $m('br-models').innerHTML=`<a href="shop.html">All ${b.n}<span>${b.c}</span></a>`+linkList(b.m);
    $m('br-sigh').textContent='In stock — '+b.n;
    const stock=CATALOGUE.map((w,k)=>({w,k})).filter(o=>o.w.b===b.n).slice(0,3);
    $m('br-sig').innerHTML = stock.length
      ? stock.map(o=>miniRow(o.w,o.k)).join('')
      : `<p class="mnone">None in the case this week — our concierge can source one.</p>`;
    document.querySelectorAll('.mbrand').forEach(x=>x.setAttribute('aria-selected',String(+x.dataset.b===i)));
    repaintMoney();
  };
  show(0);
  document.querySelectorAll('.mbrand').forEach(b=>{const go=()=>show(+b.dataset.b);
    b.addEventListener('mouseenter',go);b.addEventListener('focus',go);
    b.addEventListener('click',e=>{e.preventDefault();go();});});
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
  const page=document.body.dataset.page;
  document.querySelectorAll('.links a, .links .mtrigger').forEach(a=>{
    if(a.dataset.nav===page) a.classList.add('current');
  });
}

document.addEventListener('DOMContentLoaded',()=>{ buildMega(); initCurrency(); initHeader(); repaintMoney(); });
