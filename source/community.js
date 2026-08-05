/* ================= COMMUNITY =================
   Events are data; a seat request and the access request go through
   the same enquiry relay as everything else on the site. */

const EVENTS=[
 {t:'Collector dinner — Emirates Hills', city:'Dubai', when:'Thursday 17 September, 8pm',
  d:'Twelve seats at one table. Bring what you wear; the tray comes out after dessert.',
  seats:'12 seats', img:'__IMG_CAM3__'},
 {t:'GTG — what a full set is actually worth', city:'London', when:'Saturday 10 October, 3pm',
  d:'An open get-together with a short talk from our bench on boxes, papers and provenance.',
  seats:'20 seats', ph:['The back room','Loupes out over a long table — venue to be announced']},
 {t:'An evening at the bench', city:'Dubai', when:'Monthly — next date to members first',
  d:'Watch an authentication end to end: caseback off, timegrapher on, questions welcome.',
  seats:'8 seats', img:'__IMG_CAM2__'}
];

const GAL_C=[
 ['The long table','Collector dinner, watches between the plates, low light'],
 ['Wrist shots','A row of wrists over the table — no faces'],
 ['The tray arrives','Six pieces on a tray between coffees'],
 ['At the bench','Members around the watchmaker, movement open'],
 ['London GTG','A pub back room, loupes out'],
 ['The group','Wide shot of the room mid-conversation']
];

document.addEventListener('DOMContentLoaded',()=>{
  const list=document.getElementById('evlist');
  if(list){
    list.innerHTML=EVENTS.map((e,i)=>`
      <div class="evrow">
        <div class="evim">${e.img
          ?`<div class="bg" style="background-image:url(${e.img})"></div>`
          :`<div class="ph"><div class="l1">${e.ph[0]}</div><div class="l2">${e.ph[1]}</div></div>`}</div>
        <div class="evwhen"><b>${e.city}</b><span>${e.when}</span></div>
        <div class="evbody"><h3>${e.t}</h3><p>${e.d}</p></div>
        <div class="evside"><span class="evseats">${e.seats}</span>
          <button class="evgo" data-ev="${i}">Request a seat</button></div>
      </div>`).join('');
    list.querySelectorAll('.evgo').forEach(b=>b.addEventListener('click',()=>{
      const e=EVENTS[+b.dataset.ev];
      window.__evt=e.t+' ('+e.city+', '+e.when+')';
      const lab=document.getElementById('jc-evlabel'), box=document.getElementById('jc-event');
      lab.hidden=false; box.hidden=false; box.textContent=e.t+' — '+e.city+', '+e.when;
      document.getElementById('joincard').scrollIntoView({block:'center',behavior:'smooth'});
      const go=document.getElementById('jc-go');
      if(go && !go.disabled) return;
    }));
  }

  const gal=document.getElementById('commgal');
  if(gal) gal.innerHTML=GAL_C.map(g=>`
    <a class="tile6" href="#"><div class="ph"><div class="l1">${g[0]}</div><div class="l2">${g[1]}</div></div>
    <div class="ov"><span>${g[0]}</span></div></a>`).join('');

  const card=document.getElementById('joincard');
  if(!card) return;
  const S={}; let sending=false;
  const go=document.getElementById('jc-go');
  const name=document.getElementById('jc-name'), contact=document.getElementById('jc-contact');
  const contactOK=v=>/@.+\./.test(v)||(v.replace(/\D/g,'').length>=7);
  const refresh=()=>{ go.disabled=sending||!(name.value.trim()&&contactOK(contact.value.trim())); };
  card.querySelectorAll('.bpchips').forEach(set=>{
    set.addEventListener('click',e=>{
      const c=e.target.closest('.bpc'); if(!c) return;
      c.classList.toggle('on');               /* collect is multi-select */
      refresh();
    });
  });
  [name,contact].forEach(i=>i.addEventListener('input',refresh));

  go.addEventListener('click',async()=>{
    if(go.disabled) return;
    sending=true; refresh(); go.innerHTML='Sending…';
    document.getElementById('jc-err').hidden=true;
    const collects=[...card.querySelectorAll('.bpc.on')].map(c=>c.dataset.v).join(', ');
    try{
      const r=await fetch('/api/enquiry',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({page:'community',
          brand:collects||'Not said', model:window.__evt||'General access',
          contact:name.value.trim()+' · '+contact.value.trim(),photos:[]})});
      if(!r.ok) throw 0;
      card.innerHTML=`<div class="bph"><span>Requested</span></div>
        <p class="bpdone">Thank you — you are on the list. We keep the community small,
        so give us a day or two and we will be in touch on the details you left.</p>
        <a class="bpfull" href="shop.html">Browse all watches meanwhile →</a>`;
    }catch(e){
      sending=false; go.innerHTML='Request access <span class="a">→</span>';
      document.getElementById('jc-err').hidden=false; refresh();
    }
  });
  refresh();
});
