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
  const contact=document.getElementById('q-contact');
  const send=document.getElementById('cssubmit');
  const wa=document.getElementById('cswa');
  const err=document.getElementById('cserr');

  const put=(id,txt)=>{
    const s=document.querySelector('#'+id+' span');
    s.textContent=txt||'—'; s.classList.toggle('empty',!txt);
  };
  const contactOK=v=>/@.+\./.test(v) || (v.replace(/\D/g,'').length>=7);

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
    V.contact=(contact.value||'').trim();
    put('s-watch',[V.brand,V.model].filter(Boolean).join(' '));
    put('s-year',V.year?String(V.year):'');
    put('s-cond',V.cond); put('s-kit',V.kit);
    put('s-photos',PHOTOS.length?PHOTOS.length+' attached':'');
    put('s-contact',V.contact);
    const base=V.brand && V.model.length>1;
    send.disabled=!(base && contactOK(V.contact)) || SENDING;
    wa.disabled=!base;
    wa.onclick=base?()=>{ location.href=waURL(
      `Hello — I would like a valuation.\n\n${V.brand} ${V.model}\n`+
      `Year: ${V.year||'not sure'}\nCondition: ${V.cond||'—'}\n`+
      `Box: ${V.box||'—'}  ·  Papers: ${V.papers||'—'}\n`+
      `Proof of purchase: ${V.proof||'—'}  ·  Unworn with stickers: ${V.unworn||'—'}\n\n`+
      `I will send photographs next.`);}:null;
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
  contact.addEventListener('input',refresh);

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
  send.addEventListener('click',async()=>{
    if(send.disabled) return;
    SENDING=true; err.hidden=true;
    send.innerHTML='Sending…'; send.disabled=true;
    try{
      const r=await fetch('/api/enquiry',{method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({page:'sell',brand:V.brand,model:V.model,year:V.year,
                             cond:V.cond,kit:V.kit,box:V.box,papers:V.papers,
                             proof:V.proof,unworn:V.unworn,
                             contact:V.contact,photos:PHOTOS})});
      if(!r.ok) throw new Error('send failed');
      document.querySelector('.csin').innerHTML=`
        <div class="csh">Received</div>
        <p class="csdone">Thank you — your ${V.brand} ${V.model} is with us.
        A firm number goes to <b>${V.contact}</b> within 24 hours.</p>
        <a class="csalt" href="shop.html">Browse all watches while you wait</a>`;
    }catch(e){
      SENDING=false;
      send.innerHTML='Send enquiry <span class="a">→</span>';
      err.hidden=false;
      refresh();
    }
  });

  setYear(null,{quiet:true});
  refresh();
}
