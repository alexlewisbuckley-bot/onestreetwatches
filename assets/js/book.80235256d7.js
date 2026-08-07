/* ================= SCHEDULE A VIEWING =================
   The UI is ours; availability and confirmation come from Cal.com through
   /api/slots and /api/book, which hold the API key server-side.
   If those endpoints are not configured yet the flow still works: slots are
   generated from the opening hours below and the booking hands off to
   WhatsApp, so nothing on the page is dead while the account is set up. */

const TYPES=[
  {id:'dubai', h:'Vida Hotel, Emirates Hills',
   m:'Open seven days, 10:00–20:00', tz:'Asia/Dubai', mins:45,
   days:[0,1,2,3,4,5,6], open:'10:00', close:'19:00', step:45},
  {id:'uk', h:'The United Kingdom',
   m:'Tuesday to Saturday, by appointment', tz:'Europe/London', mins:60,
   days:[2,3,4,5,6], open:'10:00', close:'16:00', step:60},
  {id:'video', h:'A video viewing',
   m:'Twenty minutes, any time zone', tz:'Asia/Dubai', mins:20,
   days:[1,2,3,4,5,6], open:'09:00', close:'18:00', step:30}
];
/* the two toggles decide the type: video overrides place, because a call
   is a call wherever the watch happens to sit. */
const typeFor=(place,mode)=> mode==='video' ? TYPES[2] : (place==='uk'?TYPES[1]:TYPES[0]);
const WA=WA_LINK;           /* replace with the real number */
const TZ=Intl.DateTimeFormat().resolvedOptions().timeZone||'Asia/Dubai';
const tzLabel=z=>((z||'').split('/').pop()||'').replace(/_/g,' ')||'your local';
const S={type:null, date:null, slot:null, watch:null, ref:null};
const $b=id=>document.getElementById(id);

/* ---------- date helpers (local, no library) ---------- */
const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const midnight=d=>{const x=new Date(d);x.setHours(0,0,0,0);return x;};
const addDays=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x;};
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const longDate=d=>d.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'});
const hhmm=d=>d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false});

/* ---------- availability ---------- */
const SLOTCACHE={};
let LIVE=null;               /* null = unknown, false = Cal not wired up yet */
async function slotsFor(dateStr){
  const key=S.type.id+'|'+dateStr;
  if(SLOTCACHE[key]) return SLOTCACHE[key];
  let out=null;
  if(LIVE!==false){
    try{
      const r=await fetch(`/api/slots?type=${encodeURIComponent(S.type.id)}&date=${dateStr}&tz=${encodeURIComponent(TZ)}`);
      if(r.ok){ const j=await r.json(); if(Array.isArray(j.slots)){ out=j.slots.map(s=>new Date(s)); LIVE=true; } }
      else LIVE=false;       /* 501 until CAL_API_KEY is set — stop asking */
    }catch(e){ LIVE=false; }
  }
  if(!out) out=localSlots(dateStr);
  SLOTCACHE[key]=out;
  return out;
}
/* opening-hours fallback, in the boutique's own time zone */
function localSlots(dateStr){
  const t=S.type, d=new Date(dateStr+'T00:00:00');
  if(!t.days.includes(d.getDay())) return [];
  const [oh,om]=t.open.split(':').map(Number), [ch,cm]=t.close.split(':').map(Number);
  const out=[]; const now=new Date();
  for(let m=oh*60+om; m<=ch*60+cm; m+=t.step){
    const s=new Date(dateStr+'T00:00:00');
    s.setHours(Math.floor(m/60), m%60, 0, 0);
    if(s>now) out.push(s);
  }
  return out;
}
async function dayHasSlots(dateStr){ return (await slotsFor(dateStr)).length>0; }

/* ---------- one page, two toggles ----------
   The old first step asked people to choose between five cards before they
   could see a single date. Place and format are two toggles now, and the
   calendar and the form sit under them on the same page. */
let STEP=1;
function paintSteps(){}                    /* the numbered rail is gone */
function go(n){                            /* only the confirmation still swaps views */
  STEP=n;
  if(n===4){
    document.querySelectorAll('.bstep').forEach(s=>s.classList.remove('on'));
    $b('bdoneStep').classList.add('on');
    window.scrollTo({top:0,behavior:'smooth'});
  }
  paintSide();
  if(window.__bsum) setTimeout(window.__bsum,0);
}

const PICK={place:'uae', mode:'person'};
function applyPick(){
  S.type=typeFor(PICK.place,PICK.mode);
  S.date=null; S.slot=null;
  $b('slotlist').innerHTML='';
  $b('slotday').textContent='Pick a day';
  $b('slotcount').textContent='';
  const t=S.type;
  const where = PICK.mode==='video'
    ? 'On camera from ' + (PICK.place==='uk'?'the United Kingdom':'Dubai')
    : t.h;
  $b('btogmeta').textContent=`${where} · ${t.m} · about ${t.mins} minutes`;
  /* a video call is offered from either country, so the place toggle stays live */
  paintCal(); paintSubmit(); paintSide();
  if(window.__paintRail) window.__paintRail();
}
function buildToggles(){
  const bind=(id,key)=>{
    const box=$b(id); if(!box) return;
    box.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{
      if(PICK[key]===b.dataset.v) return;
      PICK[key]=b.dataset.v;
      box.querySelectorAll('button').forEach(x=>
        x.setAttribute('aria-pressed',String(x===b)));
      applyPick();
    }));
  };
  bind('tog-place','place'); bind('tog-mode','mode');
}
function setPick(place,mode){
  PICK.place=place; PICK.mode=mode;
  $b('tog-place').querySelectorAll('button').forEach(b=>
    b.setAttribute('aria-pressed',String(b.dataset.v===place)));
  $b('tog-mode').querySelectorAll('button').forEach(b=>
    b.setAttribute('aria-pressed',String(b.dataset.v===mode)));
}
function paintSubmit(){
  const b=$b('bsubmit'); if(!b) return;
  b.disabled=!S.slot;
  b.querySelector('.lbl').textContent=S.slot?'Confirm the viewing':'Pick a date and time first';
}

/* ---------- 2 · calendar ---------- */
let VIEW=midnight(new Date());
function buildCal(){
  $b('caldow').innerHTML=['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
    .map(d=>`<span>${d}</span>`).join('');
  $b('calprev').addEventListener('click',()=>{VIEW=new Date(VIEW.getFullYear(),VIEW.getMonth()-1,1);paintCal();});
  $b('calnext').addEventListener('click',()=>{VIEW=new Date(VIEW.getFullYear(),VIEW.getMonth()+1,1);paintCal();});
  paintCal();
}
async function paintCal(){
  if(!S.type) return;                    /* nothing to look up until a type is picked */
  const first=new Date(VIEW.getFullYear(),VIEW.getMonth(),1);
  const today=midnight(new Date());
  $b('calmonth').textContent=MONTHS[first.getMonth()]+' '+first.getFullYear();
  $b('calprev').disabled = first<=new Date(today.getFullYear(),today.getMonth(),1);
  $b('calnext').disabled = first>=new Date(today.getFullYear(),today.getMonth()+3,1);

  const lead=(first.getDay()+6)%7;                      /* Monday-first */
  const days=new Date(first.getFullYear(),first.getMonth()+1,0).getDate();
  let h='';
  for(let i=0;i<lead;i++) h+='<div class="cday pad"></div>';
  for(let d=1;d<=days;d++){
    const date=new Date(first.getFullYear(),first.getMonth(),d);
    const ds=iso(date);
    const past=date<today, far=date>addDays(today,90);
    h+=`<button class="cday${past||far?' none':''}${ds===iso(today)?' today':''}${S.date===ds?' sel':''}"
        data-d="${ds}" ${past||far?'disabled':''}>${d}</button>`;
  }
  $b('calgrid').innerHTML=h;

  /* mark which days actually have room */
  const cells=[...$b('calgrid').querySelectorAll('.cday[data-d]:not(.none)')];
  await Promise.all(cells.map(async c=>{
    const ok=await dayHasSlots(c.dataset.d);
    c.classList.toggle('free',ok);
    c.classList.toggle('none',!ok);
    if(!ok) c.disabled=true;
    else c.addEventListener('click',()=>pickDay(c.dataset.d));
  }));

  if(!S.date){
    const firstFree=cells.find(c=>c.classList.contains('free'));
    if(firstFree) pickDay(firstFree.dataset.d);
  }
}
async function pickDay(ds){
  S.date=ds; S.slot=null;
  document.querySelectorAll('.cday').forEach(c=>c.classList.toggle('sel',c.dataset.d===ds));
  const d=new Date(ds+'T00:00:00');
  $b('slotday').textContent=longDate(d);
  const list=await slotsFor(ds);
  $b('slotcount').textContent=list.length?`${list.length} time${list.length>1?'s':''}`:'';
  $b('slotlist').innerHTML=list.length
    ? list.map((s,i)=>`<button class="slot" data-i="${i}" aria-pressed="false">${hhmm(s)}</button>`).join('')
    : `<div class="slotempty">Nothing free on this day. Try another, or message us — we open up
        early and stay late more often than the calendar admits.</div>`;
  $b('slotlist').querySelectorAll('.slot').forEach(b=>b.addEventListener('click',()=>{
    S.slot=list[+b.dataset.i];
    document.querySelectorAll('.slot').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
    paintSide();
    paintSubmit();
    $b('bdetails').scrollIntoView({block:'start',behavior:'smooth'});
    if(window.__bsum) window.__bsum();
  }));
  const tzName=tzLabel(S.type.tz);
  $b('slottz').textContent = TZ===S.type.tz
    ? `Times shown in ${tzName} time. Each viewing runs about ${S.type.mins} minutes — stay longer if you like.`
    : `Times shown in ${tzName} time, where the watch is. That is ${tzLabel(TZ)} time for you. About ${S.type.mins} minutes.`;
  paintSide();
}

/* ---------- summary rail ---------- */
function paintSide(){
  const w=S.watch;
  const when = S.slot ? `${longDate(new Date(S.date+'T00:00:00'))}<br>${hhmm(S.slot)}` : null;
  $b('bside').innerHTML=`
    ${w?`<div class="bswatch">
      <span class="im">${w.img?`<img src="${w.img}" alt="">`:`<span>${w.b}</span>`}</span>
      <span><span class="n">${w.b} ${w.m}</span><span class="p">Ref. ${w.r} · ${money(w.aed)}</span></span>
    </div>`:''}
    <div class="bsh">Your viewing</div>
    <div class="bsrow"><span>Type</span><span class="${S.type?'':'todo'}">${S.type?S.type.h:'Not chosen yet'}</span></div>
    <div class="bsrow"><span>When</span><span class="${when?'':'todo'}">${when||'Not chosen yet'}</span></div>
    <div class="bsrow"><span>Length</span><span>${S.type?S.type.mins+' minutes':'—'}</span></div>
    <div class="bsassure">
      <span><i></i>No deposit and no obligation to buy.</span>
      <span><i></i>Every piece authenticated at our own bench before it reaches the tray.</span>
      <span><i></i>Reschedule or cancel from the confirmation email, any time.</span>
    </div>`;
}

/* ---------- 3 · submit ---------- */
function badge(){ return 'OSW-'+iso(new Date(S.date)).slice(2).replace(/-/g,'')+'-'+
  String(Math.floor(Math.random()*9000)+1000); }

async function submit(e){
  e.preventDefault();
  const f=$b('bform'), err=$b('berr'), btn=$b('bsubmit');
  const data=Object.fromEntries(new FormData(f).entries());
  const bad=[];
  if(!data.name || data.name.trim().length<2) bad.push('bname');
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email||'')) bad.push('bemail');
  if(!data.phone || data.phone.replace(/\D/g,'').length<7) bad.push('bphone');
  ['bname','bemail','bphone'].forEach(id=>$b(id).classList.toggle('bad',bad.includes(id)));
  if(bad.length){
    err.hidden=false;
    err.textContent='Please check your name, email and phone number — we need all three to hold the slot.';
    $b(bad[0]).focus(); return;
  }
  err.hidden=true;
  btn.disabled=true; btn.querySelector('.lbl').textContent='Confirming…';

  const payload={ type:S.type.id, start:S.slot.toISOString(), mins:S.type.mins, tz:TZ,
                  watch:S.watch?`${S.watch.b} ${S.watch.m} (${S.watch.r})`:'', ...data };
  let ok=false, ref=null;
  try{
    if(LIVE===false) throw new Error('not wired');
    const r=await fetch('/api/book',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload)});
    if(r.ok){ const j=await r.json(); ok=true; ref=j.reference||null; }
  }catch(e){ /* not wired up yet */ }

  S.ref = ref || badge();
  S.emailed = ok;
  done(data);
}

function done(data){
  const when=`${longDate(new Date(S.date+'T00:00:00'))} at ${hhmm(S.slot)}`;
  document.querySelector('.bdone .bh').textContent = S.emailed ? 'You are booked in.' : 'Request received.';
  $b('bdonelede').textContent = S.emailed
    ? `A confirmation is on its way to ${data.email}, with a link to reschedule if anything changes. We will send a reminder the day before.`
    : `We have your request for ${when}. Someone will confirm it by WhatsApp or email within the hour — we do not double-book a tray, so it is worth waiting for that message before you travel.`;
  $b('bcard').innerHTML=`
    <div class="r"><span>Viewing</span><span>${S.type.h}</span></div>
    <div class="r"><span>When</span><span>${when}</span></div>
    <div class="r"><span>Length</span><span>About ${S.type.mins} minutes</span></div>
    ${S.watch?`<div class="r"><span>Watch</span><span>${S.watch.b} ${S.watch.m}<br>Ref. ${S.watch.r}</span></div>`:''}
    <div class="r"><span>Name</span><span>${data.name}</span></div>
    <div class="r"><span>Contact</span><span>${data.email}<br>${data.phone}</span></div>`;
  $b('bref').textContent='Your reference is '+S.ref+'. Quote it if you need to change anything.';
  const msg=`Hello — I have booked a viewing (${S.ref}).%0A${S.type.h}%0A${when}`+
            (S.watch?`%0AWatch: ${S.watch.b} ${S.watch.m} ref ${S.watch.r}`:'');
  $b('bwa').href=`${WA}?text=${msg}`;
  $b('bics').addEventListener('click',downloadICS,{once:true});
  STEP=4; go(4);
}

/* ---------- add to calendar ---------- */
function downloadICS(){
  const st=new Date(S.slot), en=new Date(st.getTime()+S.type.mins*60000);
  const z=d=>d.toISOString().replace(/[-:]/g,'').split('.')[0]+'Z';
  const where = S.type.id==='uk' ? 'One Street Watches — United Kingdom'
              : S.type.id==='video' ? 'Video call — link to follow'
              : 'One Street Watches, Tower A2, Vida Hotel, Emirates Hills, Dubai, United Arab Emirates';
  const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//One Street Watches//EN','BEGIN:VEVENT',
    'UID:'+S.ref+'@onestreetwatches.com','DTSTAMP:'+z(new Date()),
    'DTSTART:'+z(st),'DTEND:'+z(en),
    'SUMMARY:Watch viewing — One Street Watches',
    'LOCATION:'+where,
    'DESCRIPTION:Reference '+S.ref+(S.watch?'\\n'+S.watch.b+' '+S.watch.m+' ref '+S.watch.r:''),
    'END:VEVENT','END:VCALENDAR'].join('\r\n');
  const a=document.createElement('a');
  a.href='data:text/calendar;charset=utf-8,'+encodeURIComponent(ics);
  a.download='one-street-watches-viewing.ics'; a.click();
}

/* ---------- boot ---------- */
document.addEventListener('DOMContentLoaded',()=>{
  const p=new URLSearchParams(location.search);
  const i=p.get('i');
  if(i!==null && CATALOGUE[+i]){
    const w=CATALOGUE[+i], im=w.ims.find(x=>x.img);
    S.watch={b:w.b,m:w.m,r:w.r,aed:w.aed,img:im?im.img:null};
  }
  buildToggles();

  /* older links still arrive with ?type= — translate them into the toggles */
  const want=p.get('type');
  if(want==='uk')            setPick('uk','person');
  else if(want==='video')    setPick('uae','video');
  else if(want==='service'){
    setPick('uae','person');
    const h=document.querySelector('.phead h1'); if(h) h.textContent='Book an appointment';
    const c=document.querySelector('.phead .crumbs');
    if(c) c.innerHTML=c.innerHTML.replace('Schedule a viewing','Book an appointment');
    const n=$b('bnotes'); if(n) n.value='Servicing or authentication';
  }

  buildCal();
  applyPick();
  $b('bform').addEventListener('submit',submit);
});

/* ================= MOBILE =================
   The desktop layout stacked badly: the summary rail landed above the flow,
   so the first screen was "Not chosen yet", and the numbered step rail
   wrapped and clipped. On a phone this is a three-step task and should read
   as one: progress bar, one decision per screen, summary only once there is
   something to summarise. */
function mDates(n){
  const out=[], t=midnight(new Date());
  for(let i=0;i<n;i++) out.push(addDays(t,i));
  return out;
}
function buildMobileBook(){
  const wrap=document.querySelector('.bwrap'); if(!wrap) return;

  /* slim progress bar replaces the numbered rail */
  const bar=document.createElement('div');
  bar.className='bprog';
  document.querySelector('.bmain').prepend(bar);

  /* one-line summary — the toggles already name the place, so this only
     earns its space once a date and time exist */
  const sum=document.createElement('div');
  sum.className='bsum'; sum.hidden=true;
  bar.after(sum);
  window.__bsum=()=>{
    const bits=[];
    if(S.slot) bits.push(S.type.h, longDate(new Date(S.date+'T00:00:00'))+', '+hhmm(S.slot));
    sum.hidden=!bits.length;
    sum.innerHTML=bits.map(b=>`<span>${b}</span>`).join('');
  };

  /* dates as a rail — a month grid on a phone is 44px cells and a lot of hunting */
  const when=document.querySelector('.bwhen');
  const rail=document.createElement('div');
  rail.className='drail'; rail.id='drail';
  when.prepend(rail);
  const more=document.createElement('button');
  more.className='dmore'; more.textContent='Show the full month';
  more.addEventListener('click',()=>{
    const cal=document.querySelector('.cal');
    const open=cal.classList.toggle('on');
    more.textContent=open?'Hide the month':'Show the full month';
  });
  rail.after(more);

  window.__paintRail=async ()=>{
    const days=mDates(21);
    const flags=await Promise.all(days.map(d=>dayHasSlots(iso(d))));
    rail.innerHTML=days.map((d,i)=>{
      const ds=iso(d), free=flags[i];
      return `<button class="dday${free?'':' off'}${S.date===ds?' sel':''}" data-d="${ds}" ${free?'':'disabled'}>
        <span class="dw">${d.toLocaleDateString('en-GB',{weekday:'short'})}</span>
        <span class="dn">${d.getDate()}</span>
        <span class="dm">${MONTHS[d.getMonth()].slice(0,3)}</span></button>`;}).join('');
    rail.querySelectorAll('.dday:not(.off)').forEach(b=>b.addEventListener('click',()=>{
      pickDay(b.dataset.d);
      rail.querySelectorAll('.dday').forEach(x=>x.classList.toggle('sel',x.dataset.d===b.dataset.d));
      b.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'});
    }));
    const sel=rail.querySelector('.dday.sel')||rail.querySelector('.dday:not(.off)');
    if(sel) sel.scrollIntoView({inline:'start',block:'nearest'});
  };
}
document.addEventListener('DOMContentLoaded',()=>{
  if(!(window.osMobile && osMobile())) return;
  setTimeout(()=>{
    buildMobileBook();
    const _go=go, _pick=pickDay, _cal=paintCal;
    window.go=n=>{_go(n); if(window.__bsum) window.__bsum();};
    paintCal=async()=>{ await _cal(); if(window.__paintRail) window.__paintRail(); };
    if(S.type) paintCal();
    if(window.__bsum) window.__bsum();
  },0);
});
