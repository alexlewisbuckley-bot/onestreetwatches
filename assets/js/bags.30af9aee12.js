/* ================= HANDBAGS =================
   A short catalogue read as full entries rather than a grid — with
   four pieces, each deserves its own row. */

document.addEventListener('DOMContentLoaded',()=>{
  const list=document.getElementById('baglist');
  if(!list) return;
  let LOC='';

  const spec=(l,v)=>`<div class="bgrow"><em>${l}</em><span>${v}</span></div>`;
  const paint=()=>{
    const show=BAGS.map((g,i)=>({g,i})).filter(o=>!LOC||o.g.loc===LOC);
    document.getElementById('bcnt').textContent=show.length;
    list.innerHTML=show.map(({g,i})=>`
      <article class="bagrow" id="b${i}">
        <div class="bagart">
          <img src="${g.img}" alt="${g.b} ${g.m}">
          ${g.tag?`<span class="ptag">${g.tag}</span>`:''}
        </div>
        <div class="bagbd">
          <div class="pbrand">${g.b}</div>
          <h2>${g.m}</h2>
          <div class="bagprice money" data-aed="${g.aed}">${money(g.aed)}</div>
          <p class="bagd">${g.d}</p>
          <div class="bagspecs">
            ${spec('Size',g.size)}${spec('Leather',g.leather)}
            ${spec('Colour',g.colour)}${spec('Hardware',g.hw)}
            ${spec('Stamp',g.stamp)}${spec('Condition',g.c)}
            ${spec('Includes',[g.box&&'Box',g.pap&&'Receipt'].filter(Boolean).join(' · ')||'Bag only')}
            ${spec('Held in',g.loc)}
          </div>
          <div class="bagacts">
            <button class="b1 bagwa" data-i="${i}">Enquire on WhatsApp <span class="a">→</span></button>
            <a class="b2" href="book.html">Book a viewing <span class="a">→</span></a>
          </div>
        </div>
      </article>`).join('');
    list.querySelectorAll('.bagwa').forEach(b=>b.addEventListener('click',()=>{
      const g=BAGS[+b.dataset.i];
      location.href=waURL(`Hello — I'm interested in this bag.\n\n${g.b} ${g.m}\n`+
        `${g.colour} ${g.leather}, ${g.hw} hardware\n${money(g.aed)}\n\nIs it still available?`);
    }));
    repaintMoney();
  };

  document.querySelectorAll('#blocseg button').forEach(b=>b.addEventListener('click',()=>{
    LOC=b.dataset.l;
    document.querySelectorAll('#blocseg button').forEach(x=>
      x.setAttribute('aria-pressed',String(x.dataset.l===LOC)));
    paint();
  }));

  document.querySelectorAll('.acch').forEach(h=>
    h.addEventListener('click',()=>h.parentElement.classList.toggle('open')));

  paint();
  window.onCurrency=paint;
  if(location.hash) setTimeout(()=>{
    const el=document.querySelector(location.hash);
    if(el) el.scrollIntoView({block:'center'});
  },80);
});
