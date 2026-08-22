/* ================= SOURCING (v2.2) =================
   Same composer grammar as Sell: the page is the search request.
   "Start the search" posts to /api/enquiry; WhatsApp stays the
   fast lane, primary on the phone. */

const BRANDS_S=['Rolex','Patek Philippe','Audemars Piguet','Cartier','Omega','Other'];
const BUDGETS_S=['Under 50k','50–150k','150–350k','350k +','Open'];

document.addEventListener('DOMContentLoaded',()=>{
  const box=document.getElementById('composer');
  if(box) initComposer(box);
  document.querySelectorAll('.acch').forEach(h=>
    h.addEventListener('click',()=>h.parentElement.classList.toggle('open')));
});

function initComposer(box){
  const SEL={}, V={}; let SENDING=false;
  const chipset=(id,opts)=>{
    document.getElementById(id).innerHTML=
      opts.map(o=>`<button class="qchip" data-v="${o}">${o}</button>`).join('');
  };
  chipset('q-brand',BRANDS_S);
  chipset('q-budget',BUDGETS_S);

  const other=document.getElementById('q-brand-other');
  const model=document.getElementById('q-model');
  const email=document.getElementById('q-email');
  const send=document.getElementById('cssubmit');
  const wa=document.getElementById('cswa');
  const err=document.getElementById('cserr');

  const put=(id,txt)=>{
    const s=document.querySelector('#'+id+' span');
    s.textContent=txt||'—'; s.classList.toggle('empty',!txt);
  };
  const emailOK=v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const tel=telField(document.getElementById('telmount'),{placeholder:'55 389 2824'}).on(()=>refresh());

  const refresh=()=>{
    V.brand = SEL.brand==='Other' ? (other.value.trim()||null) : (SEL.brand||null);
    V.model=(model.value||'').trim();
    V.budget=SEL.budget||null;
    V.phone = tel.valid() ? tel.value() : null;
    V.email = emailOK((email.value||'').trim()) ? email.value.trim() : null;
    V.contact = [V.phone,V.email].filter(Boolean).join('  ·  ') || null;
    put('s-watch',[V.brand,V.model].filter(Boolean).join(' '));
    put('s-budget',V.budget);
    put('s-contact',V.contact);
    const base=V.brand && V.model.length>1;
    send.disabled=!(base && (V.phone||V.email)) || SENDING;
    wa.disabled=!base;
    wa.onclick=base?()=>{ location.href=waURL(
      `Hello — I am looking for a watch.\n\n${V.brand} ${V.model}\n`+
      `Budget: ${V.budget||'—'}\n\nCan you find it?`);}:null;
  };

  box.querySelectorAll('.qchips').forEach(set=>{
    const field=set.closest('.qf'), k=field.dataset.k;
    set.querySelectorAll('.qchip').forEach(c=>c.addEventListener('click',()=>{
      const on=SEL[k]===c.dataset.v;
      SEL[k]=on?null:c.dataset.v;
      set.querySelectorAll('.qchip').forEach(x=>x.classList.toggle('on',!on&&x===c));
      if(k==='brand'){
        const ask=SEL.brand==='Other';
        field.classList.toggle('askother',ask);
        if(ask) requestAnimationFrame(()=>other.focus());
        else other.value='';
      }
      refresh();
    }));
  });
  other.addEventListener('input',refresh);
  model.addEventListener('input',refresh);
  email.addEventListener('input',refresh);

  send.addEventListener('click',async()=>{
    if(send.disabled) return;
    SENDING=true; err.hidden=true;
    send.innerHTML='Sending…'; send.disabled=true;
    try{
      const r=await fetch('/api/enquiry',{method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({page:'sourcing',brand:V.brand,model:V.model,budget:V.budget,
                             phone:V.phone,email:V.email,contact:V.contact,photos:[]})});
      if(!r.ok) throw new Error('send failed');
      document.querySelector('.csin').innerHTML=`
        <div class="csh">The search is on</div>
        <p class="csdone">Thank you — we are looking for a ${V.brand} ${V.model}.
        Options go to <b>${V.contact}</b>, usually within 48 hours.</p>
        <a class="csalt" href="shop.html">Browse all watches while you wait</a>`;
    }catch(e){
      SENDING=false;
      send.innerHTML='Start the search <span class="a">→</span>';
      err.hidden=false;
      refresh();
    }
  });

  refresh();
}
