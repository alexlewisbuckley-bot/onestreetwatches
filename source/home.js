/* ================= HOME (v2.1) =================
   Image-led. The hero keeps its shoppable hotspots — that IS product —
   and everything else on the page is either a watch or a door. */

/* ---------- hero: the shoppable boutique ---------- */
const SHOTS=[
 ["__IMG_CAM1__","The main boutique — Dubai",[
   {x:29,y:74,t:"Steel sports case",w:[1,3]},
   {x:63,y:80,t:"Rolex counter",w:[2,4]},
   {x:92,y:52,t:"Gold & two-tone wall",w:[6,13]}]],
 ["__IMG_CAM4__","The corridor, looking east",[
   {x:47,y:70,t:"Centre vitrine",w:[8,2]},
   {x:16,y:58,t:"Complications wall",w:[14,11]}]],
 ["__IMG_CAM3__","The lounge",[
   {x:17,y:70,t:"Arrivals case",w:[3,17]},
   {x:47,y:76,t:"Seating vitrine",w:[1,20]}]],
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
/* brand photography shot on black, cropped to one scale */
const TILES=[
 {n:"Rolex",img:"__B_ROLEX__"},
 {n:"Audemars Piguet",img:"__B_AP__"},
 {n:"Patek Philippe",img:"__B_PATEK__"}
];
function initMaisons(){
  const box=$h('mtiles'); if(!box) return;
  box.innerHTML=TILES.map(t=>`
    <a class="mtile" href="${shopURL({brand:t.n})}">
      <div class="art"><img src="${t.img}" alt="${t.n}"></div>
      <div class="lbl">Shop ${t.n}<em>${nWhere(w=>w.b===t.n)}</em></div>
    </a>`).join('');
  const rest=[...new Set(CATALOGUE.map(w=>w.b))].filter(b=>!TILES.some(t=>t.n===b));
  $h('mrowlinks').innerHTML=rest.map(b=>`<a href="${shopURL({brand:b})}">${b}</a>`).join('')
    +`<a href="shop.html">All brands</a>`;
}

/* ---------- spotlight: a rotating, explorable showcase ----------
   Every watch with genuinely its own photography takes a turn on the
   plate: auto-advancing with a progress bar, switchable by thumbnail,
   and each one carries a lens tour — the spec rows glide the image in
   to bezel, dial, crown, bracelet. */
const REAL=[1,2,3,4];
const TOURS={
  1:[ /* Submariner "Hulk" */
    {l:'Bezel',   v:'Green Cerachrom, 60-click', o:'50% 26%', z:2.2,
     n:'Unidirectional ceramic bezel in the same green as the dial — the pairing that earned the nickname.'},
    {l:'Dial',    v:'Green sunburst',            o:'50% 42%', z:2.4,
     n:'Sunburst green with maxi markers — discontinued in 2020, which is exactly why it is wanted.'},
    {l:'Crown',   v:'Triplock, screw-down',      o:'71% 43%', z:2.6,
     n:'Triple-sealed behind the crown guards, rated to 300 metres.'},
    {l:'Bracelet',v:'Oyster, Glidelock',         o:'46% 78%', z:2.1,
     n:'Solid-link Oyster; the Glidelock clasp adjusts 20mm without a tool.'}],
  2:[ /* GMT "Sprite" */
    {l:'Bezel',   v:'Green & black Cerachrom',   o:'50% 26%', z:2.2,
     n:'Two-colour ceramic, 24-hour graduations — tracks a second time zone at a glance.'},
    {l:'Crown',   v:'Left-hand drive',           o:'29% 43%', z:2.6,
     n:'The crown sits on the left — the first left-handed GMT Rolex ever catalogued.'},
    {l:'Dial',    v:'Black, Chromalight',        o:'50% 42%', z:2.4,
     n:'Black dial with the green GMT hand mirroring the bezel.'},
    {l:'Bracelet',v:'Jubilee, Oysterlock',       o:'46% 78%', z:2.1,
     n:'Five-link Jubilee with the Oysterlock safety clasp.'}],
  3:[ /* Submariner "Starbucks" */
    {l:'Bezel',   v:'Green Cerachrom, 60-click', o:'50% 26%', z:2.2,
     n:'The green ceramic bezel over a black dial — the current-generation 41mm case.'},
    {l:'Dial',    v:'Black lacquer',             o:'50% 42%', z:2.4,
     n:'Gloss black with white gold surrounds and blue-glowing Chromalight.'},
    {l:'Crown',   v:'Triplock, screw-down',      o:'71% 43%', z:2.6,
     n:'Triple-sealed crown, rated to 300 metres.'},
    {l:'Bracelet',v:'Oyster, Glidelock',         o:'46% 78%', z:2.1,
     n:'Oyster bracelet, tool-free Glidelock adjustment.'}],
  4:[ /* Submariner white gold */
    {l:'Bezel',   v:'Blue Cerachrom, 60-click',  o:'50% 26%', z:2.2,
     n:'Unidirectional ceramic bezel — the blue is fired in, not coated, so it cannot fade.'},
    {l:'Dial',    v:'Black lacquer',             o:'50% 42%', z:2.4,
     n:'Maxi markers in 18k white gold surrounds, Chromalight lume that glows blue.'},
    {l:'Crown',   v:'Triplock, screw-down',      o:'71% 43%', z:2.6,
     n:'Triple-sealed crown behind the guards — rated to 300 metres.'},
    {l:'Bracelet',v:'Oyster, Glidelock',         o:'46% 78%', z:2.1,
     n:'Solid white gold links; the clasp adjusts 20mm without a tool.'}]
};
const SPAUTO=7000;
function initSpotlight(){
  const box=$h('spotlight'); if(!box) return;
  box.innerHTML=`<div class="in">
    <div class="artcol">
      <div class="art" id="sp-art"><img id="sp-img" alt="">
        <div class="lensnote" id="sp-note" aria-live="polite"></div></div>
      <div class="spthumbs" id="sp-thumbs">${REAL.map((k,j)=>{
        const w=CATALOGUE[k], im=w.ims.find(x=>x.img);
        return `<button class="spth" data-j="${j}" aria-current="false"
          aria-label="${w.b} ${w.m}"><img src="${im.img}" alt="">
          <i class="pg"><b></b></i></button>`;}).join('')}</div>
    </div>
    <div class="bd" id="sp-bd"></div>
  </div>`;

  const img=$h('sp-img'), note=$h('sp-note'), bd=$h('sp-bd');
  let cur=0, pinned=-1, timer=null;

  const lens=i=>{
    const tour=TOURS[REAL[cur]];
    bd.querySelectorAll('.sprow--lens').forEach((r,j)=>{
      r.setAttribute('aria-pressed',String(j===i)); r.classList.toggle('on',j===i);
    });
    if(i<0){ img.style.transform='none'; note.classList.remove('on'); return; }
    const f=tour[i];
    img.style.transformOrigin=f.o; img.style.transform='scale('+f.z+')';
    note.textContent=f.n; note.classList.add('on');
  };

  const renderBd=()=>{
    const idx=REAL[cur], w=CATALOGUE[idx], tour=TOURS[idx];
    bd.innerHTML=`
      <div class="k">Featured this week &nbsp;·&nbsp; ${cur+1} / ${REAL.length}</div>
      <h2>${w.b} ${w.m}</h2>
      <div class="meta"><span class="money" data-aed="${w.aed}">${money(w.aed)}</span>
        <i></i><span>${w.y}</span><i></i><span>${w.c}</span>
        <i></i><span>${w.box&&w.pap?'Full set':'See details'}</span>
        <i></i><span>Ref. ${w.r}</span></div>
      <div class="specs specs--tour">${tour.map((f,i)=>
        `<button class="sprow sprow--lens" data-f="${i}" aria-pressed="false">
           <em>${f.l}</em><span>${f.v}</span></button>`).join('')}</div>
      <div class="tourhint">Select a detail to look closer</div>
      <div class="acts">
        <a class="b1" href="product.html?i=${idx}">View this watch <span class="a">→</span></a>
        <a class="b2" href="shop.html">Explore all watches <span class="a">→</span></a>
      </div>`;
    bd.querySelectorAll('.sprow--lens').forEach((r,i)=>{
      r.addEventListener('mouseenter',()=>lens(i));
      r.addEventListener('click',()=>{ pinned = pinned===i ? -1 : i; lens(pinned); });
    });
    bd.querySelector('.specs').addEventListener('mouseleave',()=>lens(pinned));
    repaintMoney();
  };

  const bar=j=>box.querySelectorAll('.spth')[j].querySelector('.pg b');
  const resetBars=()=>box.querySelectorAll('.pg b').forEach(b=>{
    b.style.transition='none'; b.style.width='0';});
  const runBar=()=>{
    const b=bar(cur);
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      b.style.transition='width '+SPAUTO+'ms linear'; b.style.width='100%';
    }));
  };

  const show=j=>{
    cur=j; pinned=-1;
    const w=CATALOGUE[REAL[j]], im=w.ims.find(x=>x.img);
    img.style.opacity='0'; img.style.transform='none'; note.classList.remove('on');
    setTimeout(()=>{ img.src=im.img; img.alt=w.b+' '+w.m; img.style.opacity='1'; },220);
    box.querySelectorAll('.spth').forEach((t,i)=>t.setAttribute('aria-current',String(i===j)));
    renderBd(); resetBars();
  };
  const play=()=>{ if(timer) return; runBar();
    timer=setInterval(()=>{ show((cur+1)%REAL.length); runBar(); },SPAUTO); };
  const pause=()=>{ if(!timer) return; clearInterval(timer); timer=null;
    const b=bar(cur), wNow=getComputedStyle(b).width;
    b.style.transition='none'; b.style.width=wNow; };

  box.querySelectorAll('.spth').forEach(t=>t.addEventListener('click',()=>{
    pause(); show(+t.dataset.j);
  }));
  $h('sp-art').addEventListener('click',()=>{ pinned=-1; lens(-1); });
  box.addEventListener('mouseenter',pause);
  box.addEventListener('mouseleave',()=>{ resetBars(); play(); });

  show(0); play();
}

/* ---------- social ---------- */
const PLAY='<svg width="8" height="9" viewBox="0 0 8 9"><path d="M0 0l8 4.5L0 9z"/></svg>';
const SOCIAL=[
 {bg:"__IMG_CAM1__",cap:"The boutique, Tuesday morning",reel:0},
 {bg:"__IMG_EXT__",cap:"Vida Hotel, Emirates Hills",reel:0},
 {ph:["Reel","Hulk unboxing, vertical 9:16, hands only"],cap:"Hulk unboxing",reel:1},
 {bg:"__IMG_CAM4__",cap:"New in — five pieces this week",reel:0},
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
