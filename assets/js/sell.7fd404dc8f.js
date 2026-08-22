/* ================= SELL (v2.2) =================
   The page is the enquiry. Six questions fill a live summary.
   Two exits: "Send enquiry" posts photos + details to /api/enquiry
   (desktop-first — no WhatsApp needed), and WhatsApp remains the
   fast lane, primary on the phone. */

const BRANDS_S=['Rolex','Patek Philippe','Audemars Piguet','Richard Mille','Cartier','Omega','Other'];
const CONDS_S=['Unworn','Excellent','Very good','Good'];
/* the old single "what comes with it" chip could not answer proof of purchase
   or factory stickers, and a valuation turns on all four. One row each. */
const ASKS=[
  {k:'box',    q:'Do you have the original box?'},
  {k:'papers', q:'Do you have the original papers?'},
  {k:'proof',  q:'Do you have proof of purchase?'},
  {k:'unworn', q:'Is your watch unworn with factory stickers intact?'}
];
const THIS_YEAR=new Date().getFullYear();
const MAXPHOTOS=6;

document.addEventListener('DOMContentLoaded',()=>{
  const box=document.getElementById('composer');
  if(box) initComposer(box);
  document.querySelectorAll('.acch').forEach(h=>
    h.addEventListener('click',()=>h.parentElement.classList.toggle('open')));
});

/* shrink a photo before it travels — 1280px JPEG is plenty for a valuation */
function shrink(file){
  return new Promise(res=>{
    const img=new Image();
    img.onload=()=>{
      const s=Math.min(1,1280/Math.max(img.width,img.height));
      const c=document.createElement('canvas');
      c.width=Math.round(img.width*s); c.height=Math.round(img.height*s);
      c.getContext('2d').drawImage(img,0,0,c.width,c.height);
      res({name:file.name.replace(/\.[^.]+$/,'')+'.jpg', data:c.toDataURL('image/jpeg',.82)});
      URL.revokeObjectURL(img.src);
    };
    img.onerror=()=>res(null);
    img.src=URL.createObjectURL(file);
  });
}

function initComposer(box){
  const SEL={}, V={}; let PHOTOS=[], SENDING=false;
  const chipset=(id,opts)=>{
    document.getElementById(id).innerHTML=
      opts.map(o=>`<button class="qchip" data-v="${o}">${o}</button>`).join('');
  };
  chipset('q-brand',BRANDS_S);
  chipset('q-cond',CONDS_S);

  /* ---------- four yes / no answers ---------- */
  const ANS={};
  const ynBox=document.getElementById('q-yesno');
  ynBox.innerHTML=ASKS.map(a=>`
    <div class="ynrow" data-a="${a.k}">
      <span class="ynq">${a.q}</span>
      <span class="ynb" role="group" aria-label="${a.q}">
        <button class="ynopt" type="button" data-v="yes">Yes</button>
        <button class="ynopt" type="button" data-v="no">No</button>
      </span>
    </div>`).join('');
  ynBox.querySelectorAll('.ynrow').forEach(row=>{
    const k=row.dataset.a;
    row.querySelectorAll('.ynopt').forEach(b=>b.addEventListener('click',()=>{
      const off=ANS[k]===b.dataset.v;              /* click again to unset */
      ANS[k]=off?undefined:b.dataset.v;
      row.querySelectorAll('.ynopt').forEach(x=>
        x.classList.toggle('on', !off && x===b));
      refresh();
    }));
  });

  /* ---------- the year ---------- */
  const yr=document.getElementById('yr-range');
  const yrn=document.getElementById('yr-n'), yra=document.getElementById('yr-a');
  let YEAR=null;                                   /* null until they choose */
  yr.max=String(THIS_YEAR);
  document.getElementById('yr-scale').innerHTML=
    [1950,1970,1990,2010,THIS_YEAR].map(y=>`<span>${y}</span>`).join('');
  const ageLine=y=>{
    const a=THIS_YEAR-y;
    return a<=0 ? 'Made this year'
         : a===1 ? 'A year old'
         : a<=4  ? `${a} years old`
         : a<=9  ? `${a} years old — recent pre-owned`
         : a<=29 ? `${a} years old`
         :         `${a} years old — vintage`;
  };
  const paintYear=()=>{
    /* fill the track up to the handle so the slider reads as a gauge */
    const pct=(yr.value-yr.min)/(yr.max-yr.min)*100;
    yr.style.setProperty('--fill', pct+'%');
    yrn.textContent = YEAR===null ? 'Not sure' : YEAR;
    yrn.classList.toggle('unset', YEAR===null);
    yra.textContent = YEAR===null
      ? 'Drag the slider, or say you are not sure'
      : ageLine(YEAR);
  };
  const setYear=(v,{quiet}={})=>{
    YEAR = v===null ? null : Math.min(THIS_YEAR, Math.max(1950, +v));
    if(YEAR!==null) yr.value=String(YEAR);
    document.querySelectorAll('.yrq').forEach(b=>b.classList.remove('on'));
    if(YEAR===null) document.querySelector('.yrq[data-yr="unsure"]').classList.add('on');
    document.getElementById('q-year').classList.toggle('set', YEAR!==null);
    paintYear();
    if(!quiet) refresh();
  };
  yr.addEventListener('input',()=>setYear(yr.value));
  document.querySelectorAll('.yrq').forEach(b=>b.addEventListener('click',()=>{
    const v=b.dataset.yr;
    setYear(v==='unsure' ? null : v==='thisyear' ? THIS_YEAR : 1985);
  }));

  const other=document.getElementById('q-brand-other');
  const model=document.getElementById('q-model');
  const email=document.getElementById('q-email');
  /* the action exists twice — in the sticky rail and at the foot of the
     questions — so treat them as one control rather than two code paths */
  const sends=[...document.querySelectorAll('#cssubmit,#cssubmit2')];
  const was=[...document.querySelectorAll('#cswa,#cswa2')];
  const send=sends[0], wa=was[0];
  const err=document.getElementById('cserr');

  const put=(id,txt)=>{
    const s=document.querySelector('#'+id+' span');
    s.textContent=txt||'—'; s.classList.toggle('empty',!txt);
  };
  const emailOK=v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  const refresh=()=>{
    V.brand = SEL.brand==='Other' ? (other.value.trim()||null) : (SEL.brand||null);
    V.model=(model.value||'').trim();
    V.cond=SEL.cond||null;
    V.year=YEAR;
    V.box=ANS.box||null; V.papers=ANS.papers||null;
    V.proof=ANS.proof||null; V.unworn=ANS.unworn||null;
    /* "includes" is now derived, so the summary still reads in one line */
    const has=[];
    if(ANS.box==='yes') has.push('Box');
    if(ANS.papers==='yes') has.push('Papers');
    if(ANS.proof==='yes') has.push('Proof of purchase');
    if(ANS.unworn==='yes') has.push('Unworn, stickers on');
    V.kit = has.length ? has.join(', ')
          : (ANS.box==='no'&&ANS.papers==='no') ? 'Watch only' : null;
    V.phone = tel.valid() ? tel.value() : null;
    V.email = emailOK((email.value||'').trim()) ? email.value.trim() : null;
    V.contact = [V.phone, V.email].filter(Boolean).join('  ·  ') || null;
    V.intent = INTENT;
    V.want = INTENT==='px' ? (pxField.value||'').trim() || null : null;
    put('s-intent', V.intent==='px' ? 'Part-exchange' : 'Sell outright');
    put('s-watch',[V.brand,V.model].filter(Boolean).join(' '));
    put('s-year',V.year?String(V.year):'');
    put('s-cond',V.cond); put('s-kit',V.kit);
    put('s-photos',PHOTOS.length?PHOTOS.length+' attached':'');
    put('s-contact',V.contact);
    const base=V.brand && V.model.length>1;
    const ready=!(base && (V.phone || V.email)) || SENDING;
    sends.forEach(b=>b.disabled=ready);
    was.forEach(b=>{
      b.disabled=!base;
      b.onclick=base?()=>{ location.href=waURL(waMessage()); }:null;
    });
  };

  /* ---------- sell outright, or part-exchange ---------- */
  let INTENT='sell';
  const pxField=document.getElementById('q-px');
  const intentBox=document.getElementById('q-intent');
  intentBox.querySelectorAll('.ynopt').forEach(b=>b.addEventListener('click',()=>{
    INTENT=b.dataset.v;
    intentBox.querySelectorAll('.ynopt').forEach(x=>x.classList.toggle('on',x===b));
    const px=INTENT==='px';
    intentBox.closest('.qf').classList.toggle('wantpx',px);
    if(px) requestAnimationFrame(()=>pxField.focus()); else pxField.value='';
    refresh();
  }));
  pxField.addEventListener('input',refresh);

  /* the number control is shared with sourcing, booking and every panel */
  const tel=telField(document.getElementById('telmount'),{placeholder:'55 389 2824'}).on(refresh);

  /* everything they typed travels with them into the chat, so nobody has to
     ask "what is it and what comes with it" a second time. Only answered
     questions appear — a half-filled form should not read as a form. */
  const waMessage=()=>{
    const yn=v=>v==='yes'?'Yes':v==='no'?'No':null;
    const L=[];
    L.push(V.intent==='px'
      ? 'Hello — I would like to part-exchange a watch.'
      : 'Hello — I would like a valuation.');
    L.push('');
    L.push(`Watch: ${[V.brand,V.model].filter(Boolean).join(' ')}`);
    if(V.year)  L.push(`Year: ${V.year}`);
    if(V.cond)  L.push(`Condition: ${V.cond}`);
    const kit=[];
    if(yn(V.box))    kit.push(`Box: ${yn(V.box)}`);
    if(yn(V.papers)) kit.push(`Papers: ${yn(V.papers)}`);
    if(kit.length) L.push(kit.join('  ·  '));
    const extra=[];
    if(yn(V.proof))  extra.push(`Proof of purchase: ${yn(V.proof)}`);
    if(yn(V.unworn)) extra.push(`Unworn, stickers intact: ${yn(V.unworn)}`);
    if(extra.length) L.push(extra.join('  ·  '));
    if(V.want)    L.push(`Looking at: ${V.want}`);
    if(V.contact) L.push(`Contact: ${V.contact}`);
    L.push('');
    L.push(PHOTOS.length
      ? `I have ${PHOTOS.length} photograph${PHOTOS.length>1?'s':''} to send — attaching them now.`
      : 'I will send photographs next.');
    return L.join('\n');
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

  /* ---------- the dropzone ---------- */
  const dz=document.getElementById('dz'), dzin=document.getElementById('dzin');
  const grid=document.getElementById('dzgrid');
  const paintPhotos=()=>{
    grid.innerHTML=PHOTOS.map((p,i)=>`
      <div class="dzth"><img src="${p.data}" alt="">
        <button type="button" data-x="${i}" aria-label="Remove photograph">×</button></div>`).join('');
    grid.querySelectorAll('[data-x]').forEach(b=>b.addEventListener('click',()=>{
      PHOTOS.splice(+b.dataset.x,1); paintPhotos(); refresh();
    }));
    dz.classList.toggle('has',PHOTOS.length>0);
  };
  const addFiles=async list=>{
    const room=MAXPHOTOS-PHOTOS.length;
    const files=[...list].filter(f=>f.type.startsWith('image/')).slice(0,room);
    for(const f of files){ const p=await shrink(f); if(p) PHOTOS.push(p); }
    paintPhotos(); refresh();
  };
  dz.addEventListener('click',()=>dzin.click());
  dz.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){e.preventDefault();dzin.click();} });
  dzin.addEventListener('change',()=>{ addFiles(dzin.files); dzin.value=''; });
  ['dragover','dragenter'].forEach(t=>dz.addEventListener(t,e=>{e.preventDefault();dz.classList.add('drag');}));
  ['dragleave','drop'].forEach(t=>dz.addEventListener(t,e=>{e.preventDefault();dz.classList.remove('drag');}));
  dz.addEventListener('drop',e=>addFiles(e.dataTransfer.files));

  /* ---------- submit ---------- */
  const doSend=async()=>{
    if(send.disabled) return;
    SENDING=true; err.hidden=true;
    sends.forEach(b=>{ b.innerHTML='Sending…'; b.disabled=true; });
    try{
      const r=await fetch('/api/enquiry',{method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({page:'sell',intent:V.intent,want:V.want,
                             brand:V.brand,model:V.model,year:V.year,
                             cond:V.cond,kit:V.kit,box:V.box,papers:V.papers,
                             proof:V.proof,unworn:V.unworn,
                             phone:V.phone,email:V.email,contact:V.contact,
                             photos:PHOTOS})});
      if(!r.ok) throw new Error('send failed');
      document.querySelector('.csin').innerHTML=`
        <div class="csh">Received</div>
        <p class="csdone">Thank you — your ${V.brand} ${V.model} is with us.
        ${V.intent==='px' ? 'A part-exchange figure' : 'A firm number'} goes to
        <b>${V.contact}</b> within 24 hours.</p>
        <a class="csalt" href="shop.html">Browse all watches while you wait</a>`;
      const foot=document.querySelector('.qsend');
      if(foot) foot.innerHTML='<p class="qsendn">Sent — a firm number is on its way to '+V.contact+'.</p>';
    }catch(e){
      SENDING=false;
      sends.forEach(b=>b.innerHTML='Send enquiry <span class="a">→</span>');
      err.hidden=false;
      refresh();
    }
  };
  sends.forEach(b=>b.addEventListener('click',doSend));

  setYear(null,{quiet:true});
  refresh();
}
