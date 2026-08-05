const params=new URLSearchParams(location.search);
const IDX=Math.min(CATALOGUE.length-1,Math.max(0,parseInt(params.get('i')||'1',10)));
const W=CATALOGUE[IDX];
const $=id=>document.getElementById(id);

const shotHTML=(im,on)=>`<div class="gshot${on?' on':''}">${im.img?`<img src="${im.img}" alt="">`
  :`<div class="ph"><div class="l1">${im.ph[0]}</div><div class="l2">${im.ph[1]}</div></div>`}</div>`;

function paint(){
  document.title=W.b+' '+W.m+' — One Street Watches';
  $('cbbrand').textContent=W.b; $('cbref').textContent=W.m;
  $('pbrand').textContent=W.b; $('pmodel').textContent=W.m;
  $('pref').textContent='Ref. '+W.r+'  ·  '+W.y+'  ·  '+W.size+' mm';
  $('pprice').dataset.aed=W.aed;
  document.querySelector('.dfin .money').dataset.aed=Math.round(W.aed/12);
  $('ploc').innerHTML='<b>In the case now</b> — '+W.loc+'. One of one.';
  $('pdel').innerHTML=W.loc==='Dubai'
    ? '<b>Order by 4pm</b> — insured delivery tomorrow in the UAE, Thursday in the UK.'
    : '<b>Order by 4pm</b> — insured delivery tomorrow in the UK, Thursday in the UAE.';

  /* gallery */
  const gm=$('gmain');
  gm.querySelectorAll('.gshot').forEach(n=>n.remove());
  gm.insertAdjacentHTML('afterbegin', W.ims.map((im,i)=>shotHTML(im,i===0)).join(''));
  $('gcount').textContent='1 / '+W.ims.length;
  $('gthumbs').innerHTML=W.ims.map((im,i)=>
    `<div class="gthumb${i===0?' on':''}" data-i="${i}">${im.img?`<img src="${im.img}" alt="">`
      :`<span>${im.ph[0]}</span>`}</div>`).join('');
  const missing=W.ims.filter(i=>!i.img).length;
  $('galnote').innerHTML = missing
    ? `<i></i>Photography to come — ${missing} of ${W.ims.length} frames are art-direction briefs.`
    : `<i></i>Photographed in the Dubai gallery.`;

  const show=k=>{
    document.querySelectorAll('.gshot').forEach((s,j)=>s.classList.toggle('on',j===k));
    document.querySelectorAll('.gthumb').forEach((x,j)=>x.classList.toggle('on',j===k));
    $('gcount').textContent=(k+1)+' / '+W.ims.length;};
  document.querySelectorAll('.gthumb').forEach(t=>{
    const go=()=>show(+t.dataset.i);
    t.addEventListener('mouseenter',go); t.addEventListener('click',go);});
  gm.addEventListener('click',()=>gm.classList.toggle('zoom'));

  /* specs */
  const kit=(on,l)=>`<span class="inc ${on?'on':'off'}"><span class="bx"></span>${l}</span>`;
  $('pspecs').innerHTML=[['Reference',W.r],['Year',W.y],['Case size',W.size+' mm'],
    ['Dial',W.dial],['Condition',W.c],['Held in',W.loc]]
    .map(([a,b])=>`<div class="dspec"><span>${a}</span><span>${b}</span></div>`).join('')
    +`<div class="dspec full"><span>Box &amp; papers</span><span class="dkit">${kit(W.box,'Box')}${kit(W.pap,'Papers')}</span></div>`;

  /* accordions */
  const set=W.box&&W.pap?'Complete with its original box and papers.'
    :W.pap?'Papers present; the box is no longer with the watch.'
    :W.box?'Original box present; papers are no longer with the watch.'
    :'Watch only — box and papers are no longer with it.';
  const ACC=[
    ['About this watch',`<p>${W.b} ${W.m}, reference ${W.r}, from ${W.y}. ${set} Graded <b>${W.c.toLowerCase()}</b> against our own scale, and held in ${W.loc}.</p>`],
    ['What our grading means',`<ul>
      <li><b>Unworn</b>Never worn. Stickers may be intact, current production.</li>
      <li><b>Excellent</b>Barely worn. Nothing visible at arm's length.</li>
      <li><b>Very good</b>Light wear consistent with occasional use. No damage.</li>
      <li><b>Good</b>Honest wear — visible marks to case or bracelet, nothing structural.</li></ul>`],
    ['Authentication report',`<p>This watch passed all 41 checks at our bench: register and provenance, case and bracelet geometry, dial, hands and lume under loupe and UV, movement and engravings with the caseback open, six-position timing on the timegrapher, and a dry pressure test. The signed sheet is filed against this serial and travels with the watch.</p>`],
    ['Delivery &amp; returns',`<ul>
      <li><b>UAE</b>Insured next-day delivery, or collect from the Dubai boutique.</li>
      <li><b>United Kingdom</b>Insured next-day delivery, tracked and signed for.</li>
      <li><b>Worldwide</b>Insured courier, 2–5 working days. Duties quoted before dispatch.</li>
      <li><b>Returns</b>14 days from delivery, unworn and complete, no questions asked.</li></ul>`],
    ['Payment, finance &amp; part-exchange',`<p>Card, bank transfer or cash at either location. Finance over 6, 12 or 24 months, 0% on selected pieces. Put the value of your current watch straight against this one — a firm offer within the hour.</p>`]
  ];
  $('acc').innerHTML=ACC.map((a,i)=>
    `<div class="acci${i===0?' open':''}"><button class="acch">${a[0]}<i>+</i></button><div class="accb">${a[1]}</div></div>`).join('');
  document.querySelectorAll('.acch').forEach(h=>h.addEventListener('click',()=>h.parentElement.classList.toggle('open')));

  /* prev / next through the case */
  linkBooking(IDX);
  $('prevw').href='product.html?i='+((IDX-1+CATALOGUE.length)%CATALOGUE.length);
  $('nextw').href='product.html?i='+((IDX+1)%CATALOGUE.length);

  /* related */
  const rel=CATALOGUE.map((w,i)=>({w,i})).filter(o=>o.i!==IDX &&
    (o.w.b===W.b || Math.abs(o.w.aed-W.aed)/W.aed<.6)).slice(0,8);
  $('reltrack').innerHTML=rel.map(o=>productCard(o.w,o.i)).join('');
  document.querySelectorAll('#reltrack .pcard').forEach((c,k)=>c.setAttribute('href','product.html?i='+rel[k].i));
  bindZones();

  /* sticky buy bar */
  const im=W.ims.find(x=>x.img);
  $('bbim').innerHTML=im?`<img src="${im.img}" alt="">`:'';
  $('bbn').textContent=W.m;
  $('bbm').textContent='Ref. '+W.r+' · '+W.y+' · '+W.loc;
  $('bbp').dataset.aed=W.aed;
  const acts=document.querySelector('.dacts');
  const io=new IntersectionObserver(([e])=>{
    $('buybar').classList.toggle('on', !e.isIntersecting && e.boundingClientRect.top<0);
  },{threshold:0});
  io.observe(acts);

  repaintMoney();
}
function linkBooking(i){
  const q='book.html?i='+i+'&type=specific';
  const b=document.getElementById('dbook'); if(b) b.href=q;
  const r=document.getElementById('pres');  if(r) r.href=q;
  const w=CATALOGUE[i];
  document.querySelectorAll('a[href^="https://wa.me"]').forEach(a=>{
    a.href=waURL(
      `Hello — I am interested in the ${w.b} ${w.m}, ref ${w.r}.`);
  });
}
document.addEventListener('DOMContentLoaded',paint);

/* ================= MOBILE =================
   Nothing is bought on this site. The only conversion is a question, and
   it happens on WhatsApp. So the mobile product page has one job: give a
   buyer everything they need to ask a confident question, then get out of
   the way. Enquire is primary; the booking flow is secondary. */
const ICWA='<svg viewBox="0 0 24 24"><path d="M3 21l1.6-4.4A8.5 8.5 0 1 1 12 20.5a8.4 8.4 0 0 1-4.2-1.1L3 21Z"/></svg>';

function waLink(w){
  const msg=`Hello — I'm interested in this watch.\n\n`+
    `${w.b} ${w.m}\nRef. ${w.r} · ${w.y}\n${money(w.aed)}\n\n`+
    `Is it still available?`;
  return waURL(msg);
}

/* the six facts a buyer checks before asking — as chips, not a spec table */
function factStrip(w){
  const f=[
    [w.c,'Condition'],
    [w.box?'Box':'No box', 'Box'],
    [w.pap?'Papers':'No papers','Papers'],
    [w.size+' mm','Case'],
    [w.dial,'Dial'],
    [w.loc==='Dubai'?'In Dubai':'In the UK','Held']
  ];
  return `<div class="mfacts">${f.map(([v,l])=>
    `<div class="mfact"><span class="v">${v}</span><span class="l">${l}</span></div>`).join('')}</div>`;
}

function buildMobileProduct(){
  const W=CATALOGUE[IDX];
  const gm=document.getElementById('gmain');
  if(gm){
    gm.parentElement.classList.add('gwrap');
    const n=gm.querySelectorAll('.gshot').length;
    const dots=document.createElement('div');
    dots.className='gdots';
    dots.innerHTML=Array.from({length:n},(_,i)=>
      `<button class="${i?'':'on'}" aria-label="Image ${i+1} of ${n}"></button>`).join('');
    gm.parentElement.appendChild(dots);
    dots.querySelectorAll('button').forEach((d,i)=>d.addEventListener('click',()=>
      gm.scrollTo({left:i*gm.clientWidth,behavior:'smooth'})));
    let tick=0;
    gm.addEventListener('scroll',()=>{
      if(tick) return;
      tick=requestAnimationFrame(()=>{tick=0;
        const k=Math.round(gm.scrollLeft/gm.clientWidth);
        dots.querySelectorAll('button').forEach((d,j)=>d.classList.toggle('on',j===k));});
    },{passive:true});
  }

  /* facts sit directly under the price, where the questions form */
  const price=document.getElementById('pprice');
  const host=document.querySelector('.dprice');
  if(host) host.insertAdjacentHTML('afterend', factStrip(W));

  /* one bar, one action */
  const bar=document.createElement('div');
  bar.className='mbuy';
  bar.innerHTML=`<a class="mbuy__wa" id="mwa" href="${waLink(W)}">
      ${ICWA}<span><b>Ask about this watch</b><em>WhatsApp · replies in minutes</em></span></a>
    <a class="mbuy__alt" id="mres" href="book.html?i=${IDX}&type=specific" aria-label="Book a viewing">See it</a>`;
  document.body.appendChild(bar);
  const io=new IntersectionObserver(e=>bar.classList.toggle('on',!e[0].isIntersecting),
    {rootMargin:'-90px 0px 0px 0px'});
  io.observe(document.querySelector('.dprice'));
}
document.addEventListener('DOMContentLoaded',()=>{
  if(window.osMobile && osMobile()) setTimeout(buildMobileProduct,0);
});
