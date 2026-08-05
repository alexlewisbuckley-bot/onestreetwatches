/* ================= HOME (v2.1) =================
   Image-led. The hero keeps its shoppable hotspots — that IS product —
   and everything else on the page is either a watch or a door. */

/* ---------- hero: the shoppable boutique ---------- */
const SHOTS=[
 ["assets/img/boutique-salon.ea631f9f49.jpg","The main salon — Dubai",[
   {x:29,y:74,t:"Steel sports case",w:[1,3]},
   {x:63,y:80,t:"Rolex counter",w:[2,4]},
   {x:92,y:52,t:"Gold & two-tone wall",w:[6,13]}]],
 ["assets/img/boutique-corridor.598b73a1f7.jpg","The corridor, looking east",[
   {x:47,y:70,t:"Centre vitrine",w:[8,2]},
   {x:16,y:58,t:"Complications wall",w:[14,11]}]],
 ["assets/img/boutique-lounge.cc6e46eb3b.jpg","The lounge",[
   {x:17,y:70,t:"Arrivals case",w:[3,17]},
   {x:47,y:76,t:"Seating vitrine",w:[1,20]}]],
 ["assets/img/boutique-exterior.374cb6d191.jpg","Vida Hotel, Emirates Hills",[
   {x:50,y:62,t:"Step inside",w:[1,2]}]],
 ["assets/img/boutique-wall.5ec75b6f36.jpg","The high-complication wall",[
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
  document.querySelector('.h2shot').addEventListener('mouseenter',()=>{clearInterval(auto);auto=null});
  document.addEventListener('visibilitychange',()=>document.hidden?(clearInterval(auto),auto=null):run());
}

/* ---------- new this week: the eight most recent, product cards only ---------- */
function initNew(){
  const t=$h('track'); if(!t) return;
  const picks=CATALOGUE.map((w,i)=>({w,i})).sort((a,b)=>b.w.y-a.w.y).slice(0,8);
  t.innerHTML=picks.map(o=>productCard(o.w,o.i)).join('');
  t.querySelectorAll('.pcard').forEach((c,n)=>c.setAttribute('href','product.html?i='+picks[n].i));
  bindZones(t);
}

/* ---------- shop by brand: three tiles + a link row ----------
   Only Rolex has real photography today; the other two tiles carry
   art-directed placeholders rather than borrowing the wrong watch. */
const TILES=[
 {n:"Rolex",k:1},
 {n:"Audemars Piguet",ph:["Royal Oak","Rose gold Double Balance, three-quarter on grey"]},
 {n:"Cartier",ph:["Santos de Cartier","Green lacquer dial, three-quarter on grey"]}
];
function initMaisons(){
  const box=$h('mtiles'); if(!box) return;
  box.innerHTML=TILES.map(t=>{
    const im=t.k!==undefined ? CATALOGUE[t.k].ims.find(x=>x.img) : null;
    return `<a class="mtile" href="${shopURL({brand:t.n})}">
      <div class="art">${im?`<img src="${im.img}" alt="${t.n}">`
        :`<div class="ph"><div class="l1">${t.ph[0]}</div><div class="l2">${t.ph[1]}</div></div>`}</div>
      <div class="lbl">Shop ${t.n}<em>${nWhere(w=>w.b===t.n)}</em></div>
    </a>`;}).join('');
  const rest=[...new Set(CATALOGUE.map(w=>w.b))].filter(b=>!TILES.some(t=>t.n===b));
  $h('mrowlinks').innerHTML=rest.map(b=>`<a href="${shopURL({brand:b})}">${b}</a>`).join('')
    +`<a href="shop.html">All brands</a>`;
}

/* ---------- spotlight ----------
   Only these four indices carry genuinely their own photography —
   the other image tokens are aliased stand-ins, and a spotlight must
   never wear another watch's picture. */
const REAL=[1,2,3,4];
function initSpotlight(){
  const box=$h('spotlight'); if(!box) return;
  let idx=-1;
  REAL.forEach(i=>{ if(idx<0||CATALOGUE[i].aed>CATALOGUE[idx].aed) idx=i; });
  const w=CATALOGUE[idx], im=w.ims.find(x=>x.img);
  box.innerHTML=`<div class="in">
    <div class="art"><img src="${im.img}" alt="${w.b} ${w.m}"></div>
    <div class="bd">
      <div class="k">Featured this week</div>
      <h2>${w.b} ${w.m}</h2>
      <div class="pr money" data-aed="${w.aed}">${money(w.aed)}</div>
      <p class="why">${w.y} · ${w.c} · ${w.box&&w.pap?'Full set':'See details'} · held in ${w.loc}</p>
      <div class="acts">
        <a class="b1" href="product.html?i=${idx}">View this watch <span class="a">→</span></a>
        <a class="b2" href="${bandURL(250000,null)}">The vault <span class="a">→</span></a>
      </div>
    </div>
  </div>`;
  repaintMoney();
}

/* ---------- social ---------- */
const PLAY='<svg width="8" height="9" viewBox="0 0 8 9"><path d="M0 0l8 4.5L0 9z"/></svg>';
const SOCIAL=[
 {bg:"assets/img/boutique-salon.ea631f9f49.jpg",cap:"The salon, Tuesday morning",reel:0},
 {bg:"assets/img/boutique-exterior.374cb6d191.jpg",cap:"Vida Hotel, Emirates Hills",reel:0},
 {ph:["Reel","Hulk unboxing, vertical 9:16, hands only"],cap:"Hulk unboxing",reel:1},
 {bg:"assets/img/boutique-corridor.598b73a1f7.jpg",cap:"New in — five pieces this week",reel:0},
 {ph:["Reel","Sizing a bracelet, close crop, TikTok cut"],cap:"Sizing a bracelet",reel:1},
 {ph:["Carousel","Box, papers and tags flat-lay for a full set"],cap:"What a full set means",reel:0}
];
function initSocial(){
  if(!$h('social')) return;
  $h('social').innerHTML=SOCIAL.map(s=>
    `<a class="tile6" href="#">${s.bg?`<div class="bg" style="background-image:url(${s.bg})"></div>`
      :`<div class="ph"><div class="l1">${s.ph[0]}</div><div class="l2">${s.ph[1]}</div></div>`}
     ${s.reel?`<span class="reel${s.bg?'':' dark'}">${PLAY}</span>`:''}
     <div class="ov"><span>${s.cap}</span></div></a>`).join('');
}

/* ---------- client reviews ----------
   PLACEHOLDER COPY — replace with the real Trustpilot / Google feed before launch. */
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
const initials=n=>n.split(/\s+/).map(p=>p[0]).join('').toUpperCase();
function initReviews(){
  const t=$h('rvtrack'); if(!t) return;
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

document.addEventListener('DOMContentLoaded',()=>{
  initHero(); initNew(); initMaisons(); initSpotlight(); initSocial(); initReviews();
  repaintMoney();
});

/* ================= MOBILE =================
   Hotspots open on tap — same popover the desktop uses. */
function buildMobileHome(){
  const box=$h('spots'); if(!box) return;
  const bind=()=>box.querySelectorAll('.spot').forEach(sp=>{
    if(sp.dataset.tap) return; sp.dataset.tap=1;
    sp.addEventListener('click',e=>{
      e.preventDefault(); e.stopPropagation();
      const pop=box.querySelector(`.pop[data-p="${sp.dataset.j}"]`);
      const on=pop.classList.contains('on');
      box.querySelectorAll('.pop').forEach(p=>p.classList.remove('on'));
      box.querySelectorAll('.spot').forEach(s=>s.setAttribute('aria-expanded','false'));
      if(!on){ pop.classList.add('on'); sp.setAttribute('aria-expanded','true'); }
    });
  });
  bind();
  new MutationObserver(bind).observe(box,{childList:true});
  document.addEventListener('click',e=>{
    if(!e.target.closest('.spots')) box.querySelectorAll('.pop').forEach(p=>p.classList.remove('on'));
  });
}
document.addEventListener('DOMContentLoaded',()=>{
  if(window.osMobile && osMobile()) setTimeout(buildMobileHome,60);
});
