/* ================= RESERVE =================
   A watch or a bag, held for 24 hours. Deliberately the shortest form on the
   site: name, number, email. No date, no time, no viewing type — someone who
   has decided to reserve should not be handed a calendar and a decision to
   reconsider. What they are reserving stays on screen beside the form. */

const RV={kind:null, i:null, item:null, ref:null};

function rvParams(){
  const p=new URLSearchParams(location.search);
  const w=p.get('w'), b=p.get('b');
  if(b!==null && BAGS && BAGS[+b])        return {kind:'bag',   i:+b, item:BAGS[+b]};
  if(w!==null && CATALOGUE[+w])           return {kind:'watch', i:+w, item:CATALOGUE[+w]};
  /* a bare ?i= is a watch, which is how the product page used to link */
  const i=p.get('i');
  if(i!==null && CATALOGUE[+i])           return {kind:'watch', i:+i, item:CATALOGUE[+i]};
  return null;
}

function rvTitle(){
  return RV.kind==='bag'
    ? `Hermès ${RV.item.fam}`
    : `${RV.item.b} ${RV.item.m}`;
}
function rvSub(){
  const it=RV.item;
  return RV.kind==='bag'
    ? [it.colour, it.leather, it.hw+' hardware', it.size].filter(Boolean).join(' · ')
    : ['Ref. '+it.r, it.y, it.mat, it.size+' mm'].filter(Boolean).join(' · ');
}

function paintItem(){
  const it=RV.item, isBag=RV.kind==='bag';
  /* a brief overview, not a product page: a thumbnail, what it is, and the
     specification on one line. The detail collection below is the point. */
  const spec = isBag
    ? [it.colour, it.leather, it.hw, 'Size '+it.size, it.c].filter(Boolean)
    : ['Ref. '+it.r, it.y, it.mat, it.size+' mm', it.c].filter(Boolean);
  const kit = it.box&&it.pap ? 'Full set' : it.box ? 'Box only' : it.pap ? 'Papers only'
            : (isBag?'Bag only':'Watch only');
  const im=(it.ims||[]).find(x=>x.img);
  document.getElementById('rvcard').innerHTML=`
    <div class="rvthumb">${im
      ? `<img src="${im.img}" alt="${rvTitle()}">`
      : `<span>${isBag?'Hermès':it.b}</span>`}</div>
    <div class="rvinfo">
      <div class="rvbrand">${isBag?'Hermès':it.b}</div>
      <div class="rvmodel">${isBag?it.fam:it.m}</div>
      <div class="rvspecline">${spec.join('  ·  ')}  ·  ${kit}</div>
    </div>
    <div class="rvright">
      <div class="rvprice money" data-aed="${it.aed}">${money(it.aed)}</div>
      <div class="rvloc"><i></i>${it.loc}</div>
    </div>`;
  const ex=document.getElementById('rvexit');
  if(ex){ ex.href = isBag ? 'bag.html?i='+RV.i : 'product.html?i='+RV.i;
          ex.textContent = '← Back to the '+(isBag?'handbag':'watch'); }
  if(window.repaintMoney) repaintMoney();
}

function rvBadge(){
  const d=new Date();
  return 'OSW-R'+String(d.getFullYear()).slice(2)+String(d.getMonth()+1).padStart(2,'0')+
         String(d.getDate()).padStart(2,'0')+'-'+Math.random().toString(36).slice(2,5).toUpperCase();
}

document.addEventListener('DOMContentLoaded',()=>{
  const found=rvParams();
  const wrap=document.querySelector('.rvcol');
  if(!found){
    /* someone landed here without a piece — send them where the pieces are */
    wrap.innerHTML=`<div class="rvempty"><h2 class="bh">Nothing selected</h2>
      <p class="blede">Choose a piece and the reserve button is on its page.</p>
      <div class="bdoneacts"><a class="b1" href="shop.html">Browse the watches <span class="a">→</span></a>
      <a class="b2" href="bags.html">Browse the handbags <span class="a">→</span></a></div></div>`;
    return;
  }
  Object.assign(RV,found);

  const isBag=RV.kind==='bag';
  document.getElementById('rvh1').textContent = isBag ? 'Reserve this handbag' : 'Reserve this watch';
  document.title = 'Reserve — '+rvTitle()+' | One Street Watches';
  paintItem();

  const tel=telField(document.getElementById('rv-telmount'),
                     {inputClass:'', placeholder:'55 389 2824'});
  const first=document.getElementById('rv-first'), last=document.getElementById('rv-last');
  const email=document.getElementById('rv-email');
  const go=document.getElementById('rv-go'), err=document.getElementById('rv-err');
  const emailOK=v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((v||'').trim());
  let sending=false;

  document.getElementById('rvform').addEventListener('submit',async e=>{
    e.preventDefault();
    if(sending) return;
    const bad=[];
    if(first.value.trim().length<2) bad.push(first);
    if(last.value.trim().length<2)  bad.push(last);
    if(!tel.valid())                bad.push(tel.input);
    if(!emailOK(email.value))       bad.push(email);
    [first,last,tel.input,email].forEach(el=>el.classList.toggle('bad',bad.includes(el)));
    if(bad.length){
      err.hidden=false;
      err.textContent='Please check your name, number and email — we need all four to hold it.';
      bad[0].focus(); return;
    }
    err.hidden=true; sending=true;
    go.disabled=true; go.querySelector('.lbl').textContent='Reserving…';

    RV.ref=rvBadge();
    const name=first.value.trim()+' '+last.value.trim();
    const msg=`Hello — I would like to reserve this ${isBag?'handbag':'watch'}.\n\n`+
              `${rvTitle()}\n${rvSub()}\n${money(RV.item.aed)}\n\n`+
              `${name}\n${tel.value()}\n${email.value.trim()}\nReference ${RV.ref}`;
    try{
      const r=await fetch('/api/enquiry',{method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({page:'reserve', kind:RV.kind, ref:RV.ref,
          item:rvTitle(), spec:rvSub(), aed:RV.item.aed,
          first:first.value.trim(), last:last.value.trim(),
          phone:tel.value(), email:email.value.trim(), photos:[]})});
      if(!r.ok) throw new Error('send failed');
      done(name, msg);
    }catch(e2){
      /* the endpoint is not wired up yet, or the network dropped — WhatsApp
         still gets the reservation through, carrying every detail */
      sending=false; go.disabled=false;
      go.querySelector('.lbl').textContent='Reserve it';
      err.hidden=false;
      err.innerHTML='That did not send. <a href="'+waURL(msg)+'">Reserve it on WhatsApp instead →</a>';
    }
  });

  function done(name,msg){
    document.getElementById('rvform').hidden=true;
    const d=document.getElementById('rvdone');
    d.hidden=false;
    document.getElementById('rvdonelede').textContent=
      `${rvTitle()} is off the floor until this time tomorrow, ${name.split(' ')[0]}. `+
      `We will confirm by WhatsApp within the hour.`;
    document.getElementById('rvref').textContent='Your reference is '+RV.ref+'.';
    document.getElementById('rvwa').href=waURL(msg);
    document.getElementById('rvcard').classList.add('held');
    if(d.getBoundingClientRect().top<0) d.scrollIntoView({block:'nearest',behavior:'smooth'});
  }
});
