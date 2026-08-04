/* ================= HOME ================= */

/* ---------- hero: the shoppable boutique ---------- */
const SHOTS=[
 ["__IMG_CAM1__","The main salon — Dubai",[
   {x:29,y:74,t:"Steel sports case",w:[1,3]},
   {x:63,y:80,t:"Rolex counter",w:[2,4]},
   {x:92,y:52,t:"Gold & two-tone wall",w:[6,13]}]],
 ["__IMG_CAM4__","The corridor, looking east",[
   {x:47,y:70,t:"Centre vitrine",w:[8,2]},
   {x:16,y:58,t:"Complications wall",w:[14,11]}]],
 ["__IMG_CAM3__","The lounge",[
   {x:17,y:70,t:"Arrivals case",w:[3,17]},
   {x:47,y:76,t:"Seating vitrine",w:[1,20]}]],
 ["__IMG_EXT__","Vida Hills, Dubai",[
   {x:50,y:62,t:"Step inside",w:[1,2]}]],
 ["__IMG_CAM2__","The high-complication wall",[
   {x:38,y:74,t:"Island vitrine",w:[14,8]},
   {x:74,y:70,t:"Patek & AP case",w:[12,13]}]]
];
const $h=id=>document.getElementById(id);
let front=0,cur=0,auto=null;

function spots(i){
  const box=$h('spots'); if(!box) return;
  box.innerHTML=SHOTS[i][2].map((s,j)=>{
    const left=s.x>62;
    return `<button class="spot" data-j="${j}" aria-expanded="false" aria-label="${s.t}" style="left:${s.x}%;top:${s.y}%"></button>
    <div class="pop" data-p="${j}" style="left:${left?'auto':s.x+'%'};right:${left?(100-s.x)+'%':'auto'};top:${s.y}%;transform:translateY(-108%)">
      <h4>${s.t}</h4>
      ${s.w.map(k=>{const w=CATALOGUE[k];const im=w.ims.find(x=>x.img);
        return `<a class="row" href="product.html?i=${k}">${im?`<img src="${im.img}" alt="${w.b} ${w.m}">`:`<span class="rimg"></span>`}
        <div><div class="rn">${w.m}</div><div class="rp money" data-aed="${w.aed}">${money(w.aed)}</div></div></a>`;}).join('')}
      <a class="all" href="shop.html">See everything in this case →</a>
    </div>`;}).join('');
  box.querySelectorAll('.spot').forEach(sp=>{
    const pop=box.querySelector(`.pop[data-p="${sp.dataset.j}"]`);
    const open=()=>{box.querySelectorAll('.pop').forEach(p=>p.classList.remove('on'));
      box.querySelectorAll('.spot').forEach(s=>s.setAttribute('aria-expanded','false'));
      pop.classList.add('on');sp.setAttribute('aria-expanded','true');};
    const shut=()=>{pop.classList.remove('on');sp.setAttribute('aria-expanded','false');};
    sp.addEventListener('mouseenter',open); sp.addEventListener('focus',open);
    sp.addEventListener('mouseleave',()=>{if(!pop.matches(':hover'))shut()});
    pop.addEventListener('mouseleave',shut);
  });
  repaintMoney();
}
function showShot(i){
  if(i===cur)return; cur=i;
  const back=front?$h('L0'):$h('L1');
  back.style.backgroundImage=`url(${SHOTS[i][0]})`;
  back.classList.add('on');(front?$h('L1'):$h('L0')).classList.remove('on');
  front=front?0:1;
  const r=$h('room'); r.style.opacity=0;
  setTimeout(()=>{r.innerHTML='<span class="dot"></span>'+SHOTS[i][1];r.style.opacity=1;spots(i);},400);
  document.querySelectorAll('.th').forEach(t=>t.setAttribute('aria-current',String(+t.dataset.i===i)));
}
function initHero(){
  if(!$h('L0')) return;
  $h('L0').style.backgroundImage=`url(${SHOTS[0][0]})`;
  $h('thumbs').innerHTML=SHOTS.map((s,i)=>
    `<button class="th" data-i="${i}" aria-current="${i===0}" aria-label="View ${s[1]}" style="background-image:url(${s[0]})"></button>`).join('');
  spots(0);
  document.querySelectorAll('.th').forEach(t=>{
    t.addEventListener('click',()=>{clearInterval(auto);auto=null;showShot(+t.dataset.i)});
    t.addEventListener('focus',()=>showShot(+t.dataset.i));});
  const run=()=>{if(!auto)auto=setInterval(()=>showShot((cur+1)%SHOTS.length),9000)};
  run();
  document.querySelector('.shot').addEventListener('mouseenter',()=>{clearInterval(auto);auto=null});
  document.addEventListener('visibilitychange',()=>document.hidden?(clearInterval(auto),auto=null):run());

  /* featured card — first watch with a real image */
  const k=CATALOGUE.findIndex(w=>w.ims.some(x=>x.img));
  const w=CATALOGUE[k], im=w.ims.find(x=>x.img);
  $h('w-img').src=im.img; $h('w-brand').textContent=w.b; $h('w-name').textContent=w.m;
  $h('w-ref').textContent=w.r+' · '+w.y+' · '+(w.box&&w.pap?'Full set':'See details');
  const pr=$h('w-price'); pr.classList.add('money'); pr.dataset.aed=w.aed; pr.textContent=money(w.aed);
  document.querySelector('.cbody').setAttribute('href','product.html?i='+k);
  $h('fromPrice').classList.add('money'); $h('fromPrice').dataset.aed=16400;
}

/* ---------- shop by maison ---------- */
const BRANDS=[
 {n:"Rolex",c:58,k:1},{n:"Patek Philippe",c:16,ph:["Nautilus 5711","Rose gold, 45° on sand, one soft key light"]},
 {n:"Audemars Piguet",c:21,k:13},{n:"Richard Mille",c:6,k:14},
 {n:"Cartier",c:14,k:17},{n:"Vacheron Constantin",c:7,ph:["Overseas","Blue dial at 45°, bracelet fanned right"]},
 {n:"Hublot",c:9,ph:["Big Bang Unico","Three-quarter on sand, skeleton dial, rubber strap"]}
];
function initBrands(){
  const t=$h('btrack'); if(!t) return;
  t.innerHTML=BRANDS.map(b=>{
    const im = b.k!==undefined ? (CATALOGUE[b.k].ims.find(x=>x.img)) : null;
    return `<a class="bcard" href="${shopURL({brand:b.n})}">
      <div class="art">${im?`<img src="${im.img}" alt="${b.n}">`
        :`<div class="ph"><div class="l1">${b.ph[0]}</div><div class="l2">${b.ph[1]}</div></div>`}</div>
      <div class="foot"><div><div class="bname">${b.n}</div><div class="bcount">${nWhere(w=>w.b===b.n)} in stock</div></div>
      <div class="bgo" aria-hidden="true">→</div></div></a>`;}).join('');
}

/* ---------- popular right now ---------- */
function initPopular(){
  const t=$h('track'); if(!t) return;
  const picks=[0,1,2,8,3,12,4,17];
  t.innerHTML=picks.map(i=>productCard(CATALOGUE[i],i)).join('');
  t.querySelectorAll('.pcard').forEach((c,n)=>c.setAttribute('href','product.html?i='+picks[n]));
  bindZones(t);
}

/* ---------- authentication steps ---------- */
const STEPS=[
 ["01","Provenance &amp; register check","Serial and reference logged, then run through The Watch Register and our own purchase history before a penny changes hands."],
 ["02","Case, bracelet &amp; clasp","Lug geometry, chamfers and finishing compared against a known reference. Weights and micron measurements recorded."],
 ["03","Dial, hands &amp; lume","Ten-times loupe and UV. Font, print density, lume colour and applied index seating all checked for correct-period parts."],
 ["04","Movement &amp; engravings","Caseback opened. Calibre, bridge finishing, rotor engraving and screw heads inspected — the fastest place a fake gives itself away."],
 ["05","Timing &amp; pressure","Six positions on the timegrapher for rate, amplitude and beat error, then a dry pressure test to the stated depth."],
 ["06","Catalogued &amp; warranted","Photographed, the 41-point sheet filed against the serial, and the 24-month warranty issued in your name."]
];
/* ---------- services ---------- */
const SVCS=[
 {t:"Servicing &amp; polishing",d:"Full strip-down, ultrasonic clean, lubrication and regulation by Swiss-trained watchmakers — plus factory-spec refinishing when a case deserves it.",ph:["The bench","Watchmaker at the bench, loupe in eye, movement open on the mat"]},
 {t:"Authentication",d:"Bring us anything, bought from us or not. 41 checks, a written report against the serial, and an honest answer either way.",ph:["Loupe &amp; movement","Macro of a movement under the loupe, tweezers in frame"]},
 {t:"Sourcing",d:"Name the reference. We hunt it through our dealer network across four time zones and come back with real options and real prices. Average: eleven days.",k:2},
 {t:"Selling &amp; part-exchange",d:"Outright purchase or trade against anything in the case. A firm offer within the hour and payment the same day, in the UAE or the UK.",ph:["The counter","Watch and papers on the desk mid-valuation, hands only"]}
];
const SELL=[
 ["01","Send us photos","Front, back, clasp and papers on WhatsApp, or book a five-minute appointment at either location. No forms."],
 ["02","A firm offer within the hour","Priced against live market data, not a lowball opener. We show you the comparables we used."],
 ["03","Paid the same day","Bank transfer on collection, or put the value straight against anything in the case and walk out with it."]
];
const PLAY='<svg width="8" height="9" viewBox="0 0 8 9"><path d="M0 0l8 4.5L0 9z"/></svg>';
const SOCIAL=[
 {bg:"__IMG_CAM1__",cap:"The salon, Tuesday morning",reel:0},
 {bg:"__IMG_EXT__",cap:"Vida Hills, Dubai",reel:0},
 {ph:["Reel","Hulk unboxing, vertical 9:16, hands only"],cap:"Hulk unboxing",reel:1},
 {bg:"__IMG_CAM4__",cap:"New in — five pieces this week",reel:0},
 {ph:["Reel","Sizing a bracelet, close crop, TikTok cut"],cap:"Sizing a bracelet",reel:1},
 {ph:["Carousel","Box, papers and tags flat-lay for a full set"],cap:"What a full set means",reel:0}
];

/* ---------- client reviews ----------
   PLACEHOLDER COPY — replace with the real Trustpilot / Google feed before launch,
   and swap each .rvav for the client's own photo (or keep initials if they decline). */
const STAR='<svg viewBox="0 0 20 19" aria-hidden="true"><path d="M10 0l3.09 6.26L20 7.27l-5 4.87 1.18 6.88L10 15.77 3.82 19 5 12.14 0 7.27l6.91-1.01z"/></svg>';
const REVIEWS=[
 {n:"Faisal A.",l:"Dubai",r:5,t:"They opened it in front of me",
  q:"I have bought four watches in this city and this is the first time a dealer put the caseback on the bench and showed me the movement before I paid. The 41-point sheet came in the box with my name on it.",
  w:"GMT-Master II “Sprite”",d:"March 2026"},
 {n:"Charlotte M.",l:"London",r:5,t:"Priced honestly, delivered next day",
  q:"They showed me the three comparables they had priced against, told me where their margin sat, and then it arrived insured the following morning. No theatre, no waiting list, no being managed.",
  w:"Datejust 41",d:"February 2026"},
 {n:"Rajiv S.",l:"Dubai",r:5,t:"Part-exchange was painless",
  q:"Traded a Speedmaster against a Royal Oak. The offer landed within about forty minutes of sending photos on WhatsApp and it was the same number when I walked in. The difference cleared the same day.",
  w:"Royal Oak 15400ST",d:"February 2026"},
 {n:"Sarah K.",l:"Manchester",r:5,t:"Bought it entirely over video",
  q:"I never set foot in the boutique. They walked the watch round on camera, showed me the serial and the papers, answered every awkward question I had about the bracelet stretch, then sent it insured.",
  w:"Santos — Large",d:"January 2026"},
 {n:"Omar B.",l:"Dubai",r:5,t:"Sourced something I had chased for two years",
  q:"Gave them a reference and a dial colour and forgot about it. Nine days later there were photographs of three of them, with prices, and no pressure to take any of the three. I took the second.",
  w:"Nautilus 5711/1A",d:"December 2025"},
 {n:"James T.",l:"Surrey",r:4,t:"Service took a week longer than quoted",
  q:"The work itself was excellent — it is keeping better time than when it was new, and the case refinish is restrained rather than over-polished. It ran a week past the estimate, and they called me rather than me chasing.",
  w:"Submariner “Starbucks”",d:"December 2025"},
 {n:"Aisha R.",l:"Dubai",r:5,t:"Coffee, a tray, and no pressure",
  q:"I said up front I was only looking. They still brought out six pieces, sized two of them to my wrist and let me sit with it for the better part of an hour. I came back a fortnight later and bought.",
  w:"Tank Must — Large",d:"November 2025"},
 {n:"Daniel O.",l:"Edinburgh",r:5,t:"The one time it went wrong, they fixed it",
  q:"A clasp came loose three weeks in. They collected it, repaired it under the warranty and returned it within four days without a single form. That is the part nobody can show you before you buy.",
  w:"Explorer 36",d:"November 2025"}
];
const DIST=[[5,89],[4,8],[3,2],[2,0],[1,1]];
const initials=n=>n.split(/\s+/).map(p=>p[0]).join('').toUpperCase();

function initReviews(){
  const t=$h('rvtrack'); if(!t) return;
  $h('rvstars').innerHTML=STAR.repeat(5);
  $h('rvbars').innerHTML=DIST.map(([s,p])=>
    `<div class="rvbar"><span>${s} star</span><i><b style="width:${p}%"></b></i><u>${p}%</u></div>`).join('');
  t.innerHTML=REVIEWS.map(r=>`
    <article class="rv">
      <div class="stars2" aria-label="${r.r} out of 5">${
        STAR.repeat(r.r)+STAR.replace('<svg','<svg class="off"').repeat(5-r.r)}</div>
      <h3>${r.t}</h3>
      <p>${r.q}</p>
      <div class="rvfoot">
        <span class="rvav" title="Client portrait to be supplied — head and shoulders, natural light">${initials(r.n)}</span>
        <div><div class="rvn">${r.n}</div><div class="rvm">${r.l} &nbsp;·&nbsp; ${r.w} &nbsp;·&nbsp; ${r.d}</div></div>
      </div>
      <div class="rvv"><i></i>Verified purchase<span>Trustpilot</span></div>
    </article>`).join('');
}

function initSections(){
  if($h('steps')) $h('steps').innerHTML=STEPS.map(s=>
    `<div class="step"><div class="stepn">${s[0]}</div><div class="stept">${s[1]}</div><div class="stepd">${s[2]}</div></div>`).join('');
  if($h('filmbg')) $h('filmbg').style.backgroundImage='url(__IMG_CAM3__)';
  if($h('svcs')) $h('svcs').innerHTML=SVCS.map(s=>{
    const im = s.k!==undefined ? CATALOGUE[s.k].ims.find(x=>x.img) : null;
    return `<a class="svc" href="servicing.html">
      <div class="art">${im?`<img src="${im.img}" alt="">`
        :`<div class="ph"><div class="l1">${s.ph[0]}</div><div class="l2">${s.ph[1]}</div></div>`}</div>
      <div class="bd"><h3>${s.t}</h3><p>${s.d}</p><span class="go">Find out more <em>→</em></span></div></a>`;}).join('');
  if($h('sellsteps')) $h('sellsteps').innerHTML=SELL.map(s=>
    `<div class="ss"><div class="n">${s[0]}</div><div><h4>${s[1]}</h4><p>${s[2]}</p></div></div>`).join('');
  if($h('social')) $h('social').innerHTML=SOCIAL.map(s=>
    `<a class="tile6" href="#">${s.bg?`<div class="bg" style="background-image:url(${s.bg})"></div>`
      :`<div class="ph"><div class="l1">${s.ph[0]}</div><div class="l2">${s.ph[1]}</div></div>`}
     ${s.reel?`<span class="reel${s.bg?'':' dark'}">${PLAY}</span>`:''}
     <div class="ov"><span>${s.cap}</span></div></a>`).join('');
}

document.addEventListener('DOMContentLoaded',()=>{
  initHero(); initBrands(); initPopular(); initReviews(); initSections();
  carousel('btrack','bprev','bnext','barrows',3);
  carousel('track','prev','next','parrows',2);
  carousel('rvtrack','rvprev','rvnext','rvarrows',2);
  repaintMoney();
});
