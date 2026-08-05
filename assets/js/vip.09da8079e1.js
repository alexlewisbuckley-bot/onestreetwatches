/* ================= VIP PORTAL =================
   A front-door gate, honestly held: credentials are checked as a
   SHA-256 hash so nothing readable ships in this file, but this is
   concierge privacy, not vault security. Access is granted by hand —
   each member's hash is added here. */

const VIP_USERS={
  /* alex.buckley@bluecroft.com */
  '44aa257c3f1ae469067abe4bd0d3a38e6466eafc6ff4ea6b4c09944352c4c1bb':'Alex Buckley'
};

const VIP_SERVICES=[
 {t:'Luxury chauffeur', d:'Pick-up and drop-off for any viewing or collection, anywhere in Dubai. A car, not a taxi.', k:'Chauffeur pick-up'},
 {t:'Home viewing experience', d:'The tray comes to you — up to six pieces, sized on the spot, papers in hand.', k:'Home viewing'},
 {t:'Complimentary servicing', d:'An annual health check at our bench for anything bought from us: timing, seals, a clean.', k:'Complimentary service'},
 {t:'Complimentary sizing', d:'Any watch, any time, while you wait — bought from us or not.', k:'Sizing'},
 {t:'Member merchandise', d:'The One Street travel pouch, cloth and strap tool — ready at the boutique, or sent.', k:'Merchandise'},
 {t:'First refusal', d:'New arrivals held for you for 24 hours before they reach the site, matched to your wishlist.', k:'First refusal'},
 {t:'Insurance valuation letter', d:'A written valuation for your insurer, updated yearly for anything we have sold you.', k:'Insurance valuation'},
 {t:'The private room', d:'Book the back room at Vida Hotel for a quiet hour — viewings, handovers, or just coffee.', k:'Private room'}
];

const vsha=async s=>{
  if(crypto.subtle){
    const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));
    return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
  }
  return null;
};

document.addEventListener('DOMContentLoaded',()=>{
  const gate=document.getElementById('vipgate'), portal=document.getElementById('vipin');
  if(!gate) return;
  const email=document.getElementById('vip-email'), pass=document.getElementById('vip-pass');
  const go=document.getElementById('vip-go'), err=document.getElementById('vip-err');

  const paintPortal=who=>{
    gate.hidden=true; portal.hidden=false;
    document.getElementById('vip-name').textContent=who.name;
    const grid=document.getElementById('vipgrid');
    grid.innerHTML=VIP_SERVICES.map((s,i)=>`
      <div class="vsvc">
        <h3>${s.t}</h3><p>${s.d}</p>
        <button class="vreq" data-i="${i}">Arrange this <span class="a">→</span></button>
      </div>`).join('');
    grid.querySelectorAll('.vreq').forEach(b=>b.addEventListener('click',async()=>{
      const s=VIP_SERVICES[+b.dataset.i];
      b.disabled=true; b.innerHTML='Sending…';
      try{
        const r=await fetch('/api/enquiry',{method:'POST',headers:{'Content-Type':'application/json'},
          body:JSON.stringify({page:'vip',brand:s.k,model:'VIP portal request',
            contact:who.name+' · '+who.email,photos:[]})});
        if(!r.ok) throw 0;
        b.innerHTML='Requested ✓'; b.classList.add('done');
      }catch(e){
        b.disabled=false;
        b.innerHTML='Arrange on WhatsApp <span class="a">→</span>';
        b.onclick=()=>location.href=waURL('Hello — VIP request: '+s.k+' ('+who.name+')');
      }
    }));
  };

  const saved=localStorage.getItem('osw-vip');
  if(saved){ try{ paintPortal(JSON.parse(saved)); }catch(e){} }

  const attempt=async()=>{
    err.hidden=true;
    const e=email.value.trim().toLowerCase(), p=pass.value;
    if(!e||!p){ err.hidden=false; return; }
    const h=await vsha(e+':'+p);
    if(h && VIP_USERS[h]){
      const who={email:e,name:VIP_USERS[h]};
      localStorage.setItem('osw-vip',JSON.stringify(who));
      paintPortal(who);
    } else err.hidden=false;
  };
  go.addEventListener('click',attempt);
  pass.addEventListener('keydown',e=>{ if(e.key==='Enter') attempt(); });

  document.getElementById('vip-out').addEventListener('click',()=>{
    localStorage.removeItem('osw-vip');
    portal.hidden=true; gate.hidden=false; pass.value='';
  });
});
