/* ================= SELL (v2.1) =================
   The page is the enquiry. Four questions fill a live summary,
   and the only submit is the only conversion — WhatsApp. */

const BRANDS_S=['Rolex','Patek Philippe','Audemars Piguet','Cartier','Omega','Other'];
const CONDS_S=['Unworn','Excellent','Very good','Good'];
const KITS_S=['Full set','Box only','Papers only','Watch only'];

document.addEventListener('DOMContentLoaded',()=>{
  const box=document.getElementById('composer');
  if(box) initComposer(box);
  document.querySelectorAll('.acch').forEach(h=>
    h.addEventListener('click',()=>h.parentElement.classList.toggle('open')));
});

function initComposer(box){
  /* SEL is what was tapped; V is what we send — they differ for "Other",
     where the tap asks a question and the typed answer is the value. */
  const SEL={}, V={};
  const chipset=(id,opts)=>{
    document.getElementById(id).innerHTML=
      opts.map(o=>`<button class="qchip" data-v="${o}">${o}</button>`).join('');
  };
  chipset('q-brand',BRANDS_S);
  chipset('q-cond',CONDS_S);
  chipset('q-kit',KITS_S);

  const other=document.getElementById('q-brand-other');
  const model=document.getElementById('q-model');
  const go=document.getElementById('cswa');

  const put=(id,txt)=>{
    const s=document.querySelector('#'+id+' span');
    s.textContent=txt||'—'; s.classList.toggle('empty',!txt);
  };
  const refresh=()=>{
    V.brand = SEL.brand==='Other' ? (other.value.trim()||null) : (SEL.brand||null);
    V.model=(model.value||'').trim();
    V.cond=SEL.cond||null; V.kit=SEL.kit||null;
    put('s-watch',[V.brand,V.model].filter(Boolean).join(' '));
    put('s-cond',V.cond); put('s-kit',V.kit);
    const ok=V.brand && V.model.length>1;
    go.disabled=!ok;
    go.onclick=ok?()=>{ location.href=waURL(
      `Hello — I would like a valuation.\n\n${V.brand} ${V.model}\n`+
      `Condition: ${V.cond||'—'}\nIncludes: ${V.kit||'—'}\n\nI will send photographs next.`);}:null;
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
  refresh();
}
