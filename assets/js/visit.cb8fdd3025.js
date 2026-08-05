const GAL=["assets/img/boutique-salon.ea631f9f49.jpg","assets/img/boutique-corridor.598b73a1f7.jpg","assets/img/boutique-lounge.cc6e46eb3b.jpg","assets/img/boutique-exterior.374cb6d191.jpg","assets/img/boutique-wall.5ec75b6f36.jpg"];
const CAPS=["The main boutique","The corridor","The lounge","The entrance","The complication wall"];
document.addEventListener('DOMContentLoaded',()=>{
  const g=document.getElementById('visitgal'); if(!g) return;
  g.innerHTML=GAL.map((s,i)=>`<a class="tile6" href="#"><div class="bg" style="background-image:url(${s})"></div>
    <div class="ov"><span>${CAPS[i]}</span></div></a>`).join('')
    + `<a class="tile6" href="#"><div class="ph"><div class="l1">The bench</div><div class="l2">Watchmaker at work, loupe in eye, movement open on the mat</div></div>
       <div class="ov"><span>The bench</span></div></a>`;
});
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.acch').forEach(h=>h.addEventListener('click',()=>h.parentElement.classList.toggle('open')));
});

/* ---------- inline booking (same flow as the header drawdown) ---------- */
document.addEventListener('DOMContentLoaded',()=>{
  const box=document.getElementById('bookinline'); if(!box) return;
  const days=[]; const now=new Date();
  for(let i=0;i<7;i++){ const d=new Date(now); d.setDate(now.getDate()+i);
    days.push({v:d.toISOString().slice(0,10),
      l:i===0?'Today':i===1?'Tomorrow':d.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'})}); }
  document.getElementById('bi-days').innerHTML=
    days.map(d=>`<button class="bpc" data-v="${d.v}">${d.l}</button>`).join('');

  const S={}; let sending=false;
  const go=document.getElementById('bi-go');
  const name=document.getElementById('bi-name'), contact=document.getElementById('bi-contact');
  const contactOK=v=>/@.+\./.test(v)||(v.replace(/\D/g,'').length>=7);
  const refresh=()=>{ go.disabled=sending||!(S.type&&S.day&&S.time&&name.value.trim()&&contactOK(contact.value.trim())); };
  box.querySelectorAll('.bpchips').forEach(set=>{
    const k=set.dataset.k;
    set.addEventListener('click',e=>{
      const c=e.target.closest('.bpc'); if(!c) return;
      const on=S[k]===c.dataset.v;
      S[k]=on?null:c.dataset.v;
      set.querySelectorAll('.bpc').forEach(x=>x.classList.toggle('on',!on&&x===c));
      refresh();
    });
  });
  [name,contact].forEach(i=>i.addEventListener('input',refresh));

  go.addEventListener('click',async()=>{
    if(go.disabled) return;
    sending=true; refresh(); go.innerHTML='Sending…';
    document.getElementById('bi-err').hidden=true;
    try{
      const r=await fetch('/api/enquiry',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({page:'viewing',brand:S.type,model:S.day+' — '+S.time,
          contact:name.value.trim()+' · '+contact.value.trim(),photos:[]})});
      if(!r.ok) throw 0;
      box.innerHTML=`<div class="bph"><span>Requested</span></div>
        <p class="bpdone">Thank you — we will confirm your ${S.type} viewing for
        <b>${S.day}, ${S.time.toLowerCase()}</b> shortly, usually within the hour.</p>
        <a class="bpfull" href="book.html">Or pick an exact slot on the calendar →</a>`;
    }catch(e){
      sending=false; go.innerHTML='Request this viewing <span class="a">→</span>';
      document.getElementById('bi-err').hidden=false; refresh();
    }
  });
  refresh();
});
