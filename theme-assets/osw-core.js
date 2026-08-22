/* ============================================================
   ONE STREET WATCHES — shared core
   currency · catalogue data · mega menu · header · carousels
   ============================================================ */
/* WhatsApp — the only conversion on this site. One source of truth.
   Short links carry the business's own pre-set greeting; ?text= is honoured
   by most clients but is only guaranteed on a wa.me/<number> link. */
/* WhatsApp: a wa.me/message/<code> vanity link opens the chat but SILENTLY
   DROPS ?text=, so every prefilled message we built was being thrown away.
   Prefill only works on a number link — wa.me/<E.164 digits>?text=…
   Put the boutique's WhatsApp number here (digits only, no + or spaces,
   e.g. '9715XXXXXXXX') and every prefilled message on the site starts working. */
const WA_PHONE = '971553892824';
const WA_LINK = 'https://wa.me/971553892824';
const waCanPrefill = () => !!WA_PHONE;
const waURL = msg =>
  WA_PHONE ? 'https://wa.me/' + WA_PHONE + (msg ? '?text=' + encodeURIComponent(msg) : '')
           : WA_LINK;      /* no number yet — send them to the chat, unprefilled */

const RATE = 4.70;                      // AED per GBP (indicative — replace with a live feed)
let CUR = localStorage.getItem('osw-cur') || 'AED';
const money = aed => CUR === 'AED'
  ? 'Dhs. ' + aed.toLocaleString('en-US')
  : '£' + Math.round(aed / RATE).toLocaleString('en-GB');

/* ---------------- the catalogue ---------------- */
const SHOT = (a, b) => ({ ph: [a, b] });
/* The catalogue now comes from Shopify: snippets/osw-catalogue.liquid renders
   it from real products and their metafields before this script loads. */
const CATALOGUE = (window.OSW_CATALOGUE || []);



/* ---------------- handbags ----------------
   A second department, deliberately its own small array: bags have
   their own vocabulary (size, leather, hardware) and do not belong
   inside a catalogue keyed on dials and case sizes. */
const BAGS = (window.OSW_BAGS || []);

const bagImg = g => g.img || null;
const nBags = f => BAGS.filter(f).length;
const bagsURL = o => '/collections/handbags' + (o && Object.keys(o).length
  ? '?' + Object.entries(o).map(([k,v]) => k + '=' + encodeURIComponent(v)).join('&') : '');


/* ================= MOBILE NUMBER + DIALLING CODE =================
   One implementation, mounted anywhere a contact number is asked for. It uses
   no ids, so several can live on the same page (the header booking drawdown
   and a page's own form, for instance). Flags come from the ISO code rather
   than image files, and the dial code is always printed beside them so the
   control still reads on a device with no flag glyphs. */
const DIAL=[
  ['AE','United Arab Emirates','971'],['GB','United Kingdom','44'],
  ['SA','Saudi Arabia','966'],['QA','Qatar','974'],['KW','Kuwait','965'],
  ['BH','Bahrain','973'],['OM','Oman','968'],
  ['US','United States','1'],['CA','Canada','1'],['AU','Australia','61'],
  ['AT','Austria','43'],['BD','Bangladesh','880'],['BE','Belgium','32'],
  ['BR','Brazil','55'],['CN','China','86'],['CY','Cyprus','357'],
  ['CZ','Czechia','420'],['DK','Denmark','45'],['EG','Egypt','20'],
  ['FI','Finland','358'],['FR','France','33'],['DE','Germany','49'],
  ['GR','Greece','30'],['HK','Hong Kong','852'],['IN','India','91'],
  ['ID','Indonesia','62'],['IE','Ireland','353'],['IL','Israel','972'],
  ['IT','Italy','39'],['JP','Japan','81'],['JO','Jordan','962'],
  ['KE','Kenya','254'],['LB','Lebanon','961'],['LU','Luxembourg','352'],
  ['MY','Malaysia','60'],['MV','Maldives','960'],['MT','Malta','356'],
  ['MX','Mexico','52'],['MC','Monaco','377'],['MA','Morocco','212'],
  ['NL','Netherlands','31'],['NZ','New Zealand','64'],['NG','Nigeria','234'],
  ['NO','Norway','47'],['PK','Pakistan','92'],['PH','Philippines','63'],
  ['PL','Poland','48'],['PT','Portugal','351'],['RO','Romania','40'],
  ['RU','Russia','7'],['SG','Singapore','65'],['ZA','South Africa','27'],
  ['KR','South Korea','82'],['ES','Spain','34'],['LK','Sri Lanka','94'],
  ['SE','Sweden','46'],['CH','Switzerland','41'],['TH','Thailand','66'],
  ['TN','Tunisia','216'],['TR','Turkey','90'],['UA','Ukraine','380'],
  ['VN','Vietnam','84']
];
const flagOf = cc => {
  try{ return String.fromCodePoint(...[...cc].map(c=>0x1F1E6+c.charCodeAt(0)-65)); }
  catch(e){ return cc; }
};
const guessCC = () => {
  const z=(Intl.DateTimeFormat().resolvedOptions().timeZone||'').toLowerCase();
  if(z.includes('dubai')||z.includes('abu_dhabi')) return 'AE';
  if(z.includes('london')||z.includes('belfast')) return 'GB';
  const m={riyadh:'SA',qatar:'QA',doha:'QA',kuwait:'KW',bahrain:'BH',muscat:'OM',
           karachi:'PK',kolkata:'IN',calcutta:'IN',singapore:'SG',hong_kong:'HK',
           tokyo:'JP',sydney:'AU',paris:'FR',berlin:'DE',madrid:'ES',rome:'IT',
           amsterdam:'NL',zurich:'CH',dublin:'IE',new_york:'US',los_angeles:'US',
           chicago:'US',toronto:'CA',johannesburg:'ZA',lagos:'NG',cairo:'EG'};
  for(const k in m) if(z.includes(k)) return m[k];
  return 'AE';
};
/* national digits, minus the trunk zero people type out of habit (07… on +44) */
const telDigits = v => (v||'').replace(/\D/g,'').replace(/^0+/,'');
/* keep the grouping they typed — "7911 123456" reads, "7911123456" does not */
const telPretty = v => (v||'').replace(/[^\d\s]/g,'').replace(/\s+/g,' ')
                              .trim().replace(/^0+\s?/,'');

function telField(mount, opts){
  opts = opts || {};
  let CC = DIAL.find(d=>d[0]===guessCC()) || DIAL[0];
  const wrap=document.createElement('div');
  wrap.className='telrow';
  wrap.innerHTML=`
    <div class="telcc">
      <button class="telbtn" type="button" aria-haspopup="listbox" aria-expanded="false"
              aria-label="Country dialling code">
        <span class="telflag" aria-hidden="true"></span><span class="teldial"></span>
        <span class="telcar" aria-hidden="true"></span>
      </button>
      <div class="tellist" role="listbox" aria-label="Country dialling code" hidden>
        <input class="telsearch" type="text" autocomplete="off"
               placeholder="Search country or code" aria-label="Search country">
        <div class="telopts"></div>
      </div>
    </div>
    <input class="telnum ${opts.inputClass||'qtext'}" type="tel" inputmode="tel"
           autocomplete="tel-national" placeholder="${opts.placeholder||'55 389 2824'}"
           aria-label="${opts.label||'Mobile number'}">`;
  mount.appendChild(wrap);

  const btn=wrap.querySelector('.telbtn'), list=wrap.querySelector('.tellist');
  const optbox=wrap.querySelector('.telopts'), search=wrap.querySelector('.telsearch');
  const num=wrap.querySelector('.telnum');

  const paint=()=>{
    wrap.querySelector('.telflag').textContent=flagOf(CC[0]);
    wrap.querySelector('.teldial').textContent='+'+CC[2];
    btn.title=CC[1]+' +'+CC[2];
  };
  const draw=(q='')=>{
    const t=(q||'').trim().toLowerCase().replace(/^\+/,'');
    const hits=DIAL.filter(d=>!t || d[1].toLowerCase().includes(t) ||
                              d[2].startsWith(t) || d[0].toLowerCase()===t);
    optbox.innerHTML = hits.length
      ? hits.map(d=>`<button class="telopt${d===CC?' on':''}" type="button" role="option"
          aria-selected="${d===CC}" data-cc="${d[0]}" data-dial="${d[2]}">
          <span class="f">${flagOf(d[0])}</span><span class="n">${d[1]}</span>
          <span class="d">+${d[2]}</span></button>`).join('')
      : '<div class="telnone">No country matches that.</div>';
    optbox.querySelectorAll('.telopt').forEach(b=>b.addEventListener('click',()=>{
      CC=DIAL.find(d=>d[0]===b.dataset.cc && d[2]===b.dataset.dial)||CC;
      paint(); close(); num.focus(); fire();
    }));
  };
  const open=()=>{
    list.hidden=false; btn.setAttribute('aria-expanded','true');
    search.value=''; draw();
    const on=optbox.querySelector('.telopt.on'); if(on) on.scrollIntoView({block:'center'});
    requestAnimationFrame(()=>search.focus());
  };
  const close=()=>{ list.hidden=true; btn.setAttribute('aria-expanded','false'); };
  btn.addEventListener('click',()=>list.hidden?open():close());
  search.addEventListener('input',()=>draw(search.value));
  search.addEventListener('keydown',e=>{
    if(e.key==='Escape'){ close(); btn.focus(); }
    if(e.key==='Enter'){ e.preventDefault(); const f=optbox.querySelector('.telopt'); if(f) f.click(); }
  });
  document.addEventListener('click',e=>{ if(!list.hidden && !wrap.contains(e.target)) close(); });
  let handler=null;
  const fire=()=>{ if(handler) handler(api); };
  num.addEventListener('input',fire);
  paint();

  const api={
    el:wrap, input:num,
    digits:()=>telDigits(num.value),
    valid:()=>telDigits(num.value).length>=6,
    value:()=>api.valid() ? '+'+CC[2]+' '+(telPretty(num.value)||telDigits(num.value)) : null,
    e164:()=>api.valid() ? '+'+CC[2]+telDigits(num.value) : null,
    country:()=>CC[1],
    on:fn=>{ handler=fn; return api; },
    focus:()=>num.focus()
  };
  return api;
}

/* ---------------- shared UI helpers ---------------- */
const inc = (on, label) => `<span class="inc ${on?'on':'off'}"><span class="bx"></span>${label}</span>`;

function productCard(w, i){
  const shots = w.ims.map((im,j)=>`
    <div class="pshot${j===0?' on':''}" data-s="${j}">
      ${im.img ? `<img src="${im.img}" alt="${w.b} ${w.m}">`
               : `<div class="ph"><div class="l1">${im.ph[0]}</div><div class="l2">${im.ph[1]}</div></div>`}
    </div>`).join('');
  /* v2 card — the Sellier grammar: image, small-caps brand, one long
     descriptive title that carries the spec, price. Nothing else. */
  const tag = w.hold ? '<span class="ptag ptag--hold">Reserved</span>'
            : w.tag  ? `<span class="ptag">${w.tag}</span>` : '';
  return `
  <a class="pcard${w.hold?' pcard--hold':''}" href="/products/${w.h}" data-c="${i}">
    <div class="part">
      ${shots}
      ${tag}
      <div class="zones">${w.ims.map((_,j)=>`<span data-z="${j}"></span>`).join('')}</div>
      <div class="bars">${w.ims.map((_,j)=>`<i class="${j===0?'on':''}"></i>`).join('')}</div>
      <span class="pcta">View watch <em>→</em></span>
    </div>
    <div class="pbody">
      <div class="pbrand">${w.b}</div>
      <div class="pname">${w.t||w.m}</div>
      <div class="pprice money" data-aed="${w.aed}">${money(w.aed)}</div>
      <div class="pspec">${inc(w.box,'Box')}${inc(w.pap,'Papers')}<span class="cond">${w.c}</span></div>
    </div>
  </a>`;
}

/* a bag wears the same card grammar as a watch */
function bagCard(g,i){
  return `
  <a class="pcard" href="/products/${g.h}">
    <div class="part">
      <div class="pshot on">${g.img
        ? `<img src="${g.img}" alt="Hermès ${g.fam}">`
        : `<div class="ph"><div class="l1">${g.ph[0]}</div><div class="l2">${g.ph[1]}</div></div>`}</div>
      ${g.tag?`<span class="ptag">${g.tag}</span>`:''}
    </div>
    <div class="pbody">
      <div class="pbrand">Hermès</div>
      <div class="pname">${g.t}</div>
      <div class="pprice money" data-aed="${g.aed}">${money(g.aed)}</div>
      <div class="pspec">${inc(g.box,'Box')}${inc(g.pap,'Receipt')}<span class="cond">${g.c}</span></div>
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
const shopURL = o => '/collections/all' + (o && Object.keys(o).length
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
const MAT_ORDER = ["Steel","Titanium","Steel & white gold","Steel & yellow gold",
                   "18K white gold","18K yellow gold","18K rose gold","Platinum"];
const MATS = () => MAT_ORDER
  .map(m => [m, nWhere(w => w.mat === m), shopURL({mat:m})])
  .filter(x => x[1]);
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
  `<a href="${href || '/collections/all'}">${a}${b ? `<span>${b}</span>` : ''}</a>`).join('');
const miniRow=(w,i)=>{const im=w.ims.find(x=>x.img);
  return `<a class="ni" href="/products/${w.h}"><span class="im">${im?`<img src="${im.img}" alt="">`:''}</span>
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
  const mt = $m('sh-mats');
  if(mt) mt.innerHTML = MATS().map(([m,c,href]) =>
    `<a class="chip" href="${href}">${m}<em>${c}</em></a>`).join('');
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
  const panels={shop:$m('mega-shop'), bags:$m('mega-bags'),
                services:$m('mega-services'), brands:$m('mega-brands')};
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

function buildBagPanel(){
  if(!$m('bg-browse')) return;
  const B=CUR==='AED'
    ? [['Under Dhs. 50,000',0,50000],['Dhs. 250,000 +',250000,null]]
    : [['Under £10,000',0,47000],['£55,000 +',258500,null]];
  const band=(lo,hi)=>bagsURL({band:lo+'-'+(hi==null?'x':hi)});
  const YB=Math.max(...BAGS.map(g=>g.y));
  $m('bg-browse').innerHTML=[
    ['All '+BAGS.length+' handbags', BAGS.length, bagsURL({})],
    ['Latest arrivals', nBags(g=>g.y>=YB), bagsURL({sort:'new'})],
    ['Unworn', nBags(g=>g.c==='Unworn'), bagsURL({cond:'Unworn'})],
    ['Full set — box and receipt', nBags(g=>g.box&&g.pap), bagsURL({})],
    [B[0][0], nBags(g=>g.aed<B[0][2]), band(B[0][1],B[0][2])],
    [B[1][0], nBags(g=>g.aed>=B[1][1]), band(B[1][1],B[1][2])],
    ['Held in Dubai', nBags(g=>g.loc==='Dubai'), bagsURL({loc:'Dubai'})],
    ['Held in the UK', nBags(g=>g.loc==='United Kingdom'), bagsURL({loc:'United Kingdom'})]
  ].map(([a,b,href])=>`<a href="${href}">${a}<span>${b}</span></a>`).join('');

  $m('bg-model').innerHTML=[...new Set(BAGS.map(g=>g.m))].sort()
    .map(m=>`<a href="${bagsURL({model:m})}">${m}<span>${nBags(g=>g.m===m)}</span></a>`).join('');

  const cols=[...new Set(BAGS.map(g=>g.colour))].sort();
  $m('bg-colour').innerHTML=cols.map(col=>{
    const hex=(BAGS.find(g=>g.colour===col)||{}).hex;
    return `<a class="dial" href="${bagsURL({colour:col})}"><i style="background:${hex}"></i>${col}
      <em>${nBags(g=>g.colour===col)}</em></a>`;}).join('');

  $m('bg-size').innerHTML=[...new Set(BAGS.map(g=>g.size))].sort((a,b)=>a-b)
    .map(s=>`<a class="chip" href="${bagsURL({size:s})}">${s} cm</a>`).join('');
  $m('bg-leather').innerHTML=[...new Set(BAGS.map(g=>g.leather))].sort()
    .map(l=>`<a class="chip" href="${bagsURL({leather:l})}">${l}</a>`).join('');

  const newest=BAGS.map((g,i)=>({g,i})).sort((a,b)=>b.g.y-a.g.y).slice(0,4);
  $m('bg-new').innerHTML=newest.map(({g,i})=>`
    <a class="ni" href="/products/${g.h}">
      <span class="im">${g.img?`<img src="${g.img}" alt="">`:''}</span>
      <span><span class="n">${g.fam}</span>
      <span class="p money" data-aed="${g.aed}">${money(g.aed)}</span></span></a>`).join('');
  $m('bg-count').textContent=BAGS.length;
}

function buildMega(){ buildShopPanel(); buildBagPanel(); buildBrandPanel(); initMega(); }

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
 ['Sell or part-exchange','A firm offer within 24 hours, paid the same day','/pages/sell'],
 ['Concierge sourcing','Name the reference — we hunt it down','/pages/sourcing'],
 ['Servicing &amp; polishing','Swiss-trained watchmakers, our own bench','/pages/services'],
 ['Authentication','41 checks and a written report','/pages/services'],
 ['Visit us','Dubai daily, the UK by appointment','/pages/visit'],
 ['The journal','Notes from the case','/blogs/journal'],
 ['About One Street','Who we are and why we started','/pages/about'],
 ['Contact','A real person, seven days a week','/pages/contact']
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
    return `<a href="/products/${w.h}" role="option">
      <span class="im">${im?`<img src="${im.img}" alt="">`:`<span>${esc(w.b.slice(0,3))}</span>`}</span>
      <span class="tx"><span class="n">${hl(w.b+' '+w.m,q)}</span>
      <span class="s">Ref. ${hl(w.r,q)} &nbsp;·&nbsp; ${w.mat||''} &nbsp;·&nbsp; ${w.y}</span></span>
      <span class="p money" data-aed="${w.aed}">${money(w.aed)}</span></a>`;
  };

  function paint(){
    const q = input.value.trim();
    let h = '';
    if(!q){
      h += `<div class="sughead">By brand</div>`;
      BRANDLIST().slice(0,4).forEach(b => { h += quick(b.c, b.n, shopURL({brand:b.n})); });
      const u = UNDER();
      h += `<div class="sughead sep">Jump straight to</div>`
         + quick('', 'Unworn only', shopURL({cond:'Unworn'}))
         + quick('', 'Full set — box and papers', shopURL({kit:'full'}))
         + quick('', u[0], bandURL(u[1],u[2]))
         + `<div class="sughead sep">Elsewhere on the site</div>`
         + PAGES.slice(0,5).map(p => pageRow(p,'')).join('')
         + `<a class="all" href="/collections/all">Browse all ${CATALOGUE.length} watches →</a>`;
    } else {
      const ql = q.toLowerCase();
      const hits = CATALOGUE.map((w,i) => ({w,i})).filter(o =>
        (o.w.b+' '+o.w.m+' '+o.w.r+' '+o.w.dial+' '+o.w.y+' '+o.w.loc).toLowerCase().includes(ql));
      const brands = [...new Set(CATALOGUE.map(w => w.b))].filter(b => b.toLowerCase().includes(ql));
      const fams = [...new Set(CATALOGUE.map(famOf))].filter(f => f.toLowerCase().includes(ql));
      const pages = PAGES.filter(p => (p[0]+' '+p[1]).toLowerCase().includes(ql));
      if(!hits.length && !brands.length && !fams.length && !pages.length){
        h = `<div class="none">Nothing in the case matches “${esc(q)}” right now.<br>
             Tell our concierge what you are after — average time to source is 48 hours.</div>
             <a class="all" href="/pages/sourcing">Start a sourcing request →</a>`;
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

/* ---------------- book a viewing — drawdown ----------------
   Desktop only: the header link opens a compact request panel under the
   mast instead of leaving the page. The full calendar stays one click
   away, and the link still navigates if JS never runs. */
function initBookPanel(){
  if(!matchMedia('(min-width:980px)').matches) return;
  const trig=document.querySelector('a.bag'); if(!trig) return;
  const nav=document.querySelector('nav'); if(!nav) return;

  const days=[];
  const now=new Date();
  for(let i=0;i<7;i++){
    const d=new Date(now); d.setDate(now.getDate()+i);
    days.push({v:d.toISOString().slice(0,10),
      l:i===0?'Today':i===1?'Tomorrow':d.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'})});
  }
  const chip=(k,v,l)=>`<button class="bpc" data-k="${k}" data-v="${v}">${l}</button>`;
  const panel=document.createElement('div');
  panel.className='bookpanel'; panel.id='bookpanel';
  panel.setAttribute('role','dialog'); panel.setAttribute('aria-label','Book a viewing');
  panel.innerHTML=`
    <div class="bph"><span>Book a viewing</span><button class="bpx" aria-label="Close">×</button></div>
    <div class="bpl">How</div>
    <div class="bpchips">${chip('type','Dubai boutique','In person')}${chip('type','Video call','Video call')}</div>
    <div class="bpl">Day</div>
    <div class="bpchips">${days.map(d=>chip('day',d.v,d.l)).join('')}</div>
    <div class="bpl">Time</div>
    <div class="bpchips">${chip('time','Morning','Morning')}${chip('time','Afternoon','Afternoon')}${chip('time','Evening','Evening')}</div>
    <input class="bpin" id="bp-name" type="text" placeholder="Your name" autocomplete="name">
    <div class="bptel" id="bp-telmount"></div>
    <input class="bpin" id="bp-email" type="email" placeholder="Email (optional)" autocomplete="email">
    <button class="bpgo" id="bp-go" disabled>Request this viewing <span class="a">→</span></button>
    <div class="bperr" id="bp-err" hidden>That didn’t send — <a href="/pages/book">use the full calendar</a>
      or <a href="https://wa.me/971553892824">WhatsApp us</a>.</div>
    <a class="bpfull" href="/pages/book">Prefer an exact slot? Open the full calendar →</a>`;
  nav.appendChild(panel);

  const S={}; let sending=false;
  const go=panel.querySelector('#bp-go');
  const name=panel.querySelector('#bp-name'), email=panel.querySelector('#bp-email');
  const tel=telField(panel.querySelector('#bp-telmount'),
                     {inputClass:'bpin', placeholder:'55 389 2824'});
  const emailOK=v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const contactVal=()=>[tel.value(), emailOK(email.value.trim())?email.value.trim():null]
                        .filter(Boolean).join('  ·  ');
  const refresh=()=>{ go.disabled=sending||!(S.type&&S.day&&S.time&&name.value.trim()&&
                                             (tel.valid()||emailOK(email.value.trim()))); };
  tel.on(refresh);
  panel.querySelectorAll('.bpc').forEach(c=>c.addEventListener('click',()=>{
    const k=c.dataset.k, on=S[k]===c.dataset.v;
    S[k]=on?null:c.dataset.v;
    panel.querySelectorAll(`.bpc[data-k="${k}"]`).forEach(x=>x.classList.toggle('on',!on&&x===c));
    refresh();
  }));
  [name,email].forEach(i=>i.addEventListener('input',refresh));

  go.addEventListener('click',async()=>{
    if(go.disabled) return;
    sending=true; refresh(); go.innerHTML='Sending…';
    panel.querySelector('#bp-err').hidden=true;
    try{
      const r=await fetch('/api/enquiry',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({page:'viewing',brand:S.type,model:S.day+' — '+S.time,
          contact:name.value.trim()+' · '+contactVal(),photos:[]})});
      if(!r.ok) throw 0;
      panel.querySelector('.bph span').textContent='Requested';
      panel.innerHTML=`<div class="bph"><span>Requested</span><button class="bpx" aria-label="Close">×</button></div>
        <p class="bpdone">Thank you — we will confirm your ${S.type} viewing for
        <b>${S.day}, ${S.time.toLowerCase()}</b> shortly, usually within the hour.</p>
        <a class="bpfull" href="/pages/book">Or pick an exact slot on the calendar →</a>`;
      panel.querySelector('.bpx').addEventListener('click',close);
    }catch(e){
      sending=false; go.innerHTML='Request this viewing <span class="a">→</span>';
      panel.querySelector('#bp-err').hidden=false; refresh();
    }
  });

  const open=()=>{ panel.classList.add('on'); trig.setAttribute('aria-expanded','true'); };
  const close=()=>{ panel.classList.remove('on'); trig.setAttribute('aria-expanded','false'); };
  trig.setAttribute('aria-haspopup','dialog'); trig.setAttribute('aria-expanded','false');
  trig.addEventListener('click',e=>{
    e.preventDefault();
    panel.classList.contains('on')?close():open();
  });
  panel.querySelector('.bpx').addEventListener('click',close);
  document.addEventListener('click',e=>{
    if(!e.target.closest('#bookpanel') && !e.target.closest('a.bag')) close();
  });
  addEventListener('keydown',e=>{ if(e.key==='Escape') close(); });
  /* opening a mega closes the panel and vice versa */
  document.querySelectorAll('.mtrigger').forEach(t=>t.addEventListener('mouseenter',close));
}

document.addEventListener('DOMContentLoaded',()=>{ buildMega(); initCurrency(); initHeader(); initSearch(); initBookPanel(); repaintMoney(); });
