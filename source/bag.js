/* ================= A SINGLE BAG ================= */
document.addEventListener('DOMContentLoaded',()=>{
  const box=document.getElementById('bagpdp'); if(!box) return;
  const i=Math.max(0,Math.min(BAGS.length-1,+(new URLSearchParams(location.search).get('i')||0)));
  const g=BAGS[i];
  document.getElementById('bagcrumb').textContent=g.fam;
  document.title=`Hermès ${g.fam} | One Street Watches`;

  const art = g.img
    ? `<img src="${g.img}" alt="Hermès ${g.fam}">`
    : `<div class="ph"><div class="l1">${g.ph[0]}</div><div class="l2">${g.ph[1]}</div></div>`;
  const row=(l,v)=>`<div class="bgrow"><em>${l}</em><span>${v}</span></div>`;
  box.innerHTML=`
    <div class="bagart bagart--pdp">${art}${g.tag?`<span class="ptag">${g.tag}</span>`:''}</div>
    <div class="bagbd">
      <div class="pbrand">Hermès</div>
      <h1>${g.fam}</h1>
      <div class="bagprice money" data-aed="${g.aed}">${money(g.aed)}</div>
      <p class="bagd">${g.d}</p>
      <div class="bagspecs">
        ${row('Size',g.size+' cm')}${row('Leather',g.leather)}
        ${row('Colour',g.colour)}${row('Hardware',g.hw)}
        ${row('Blind stamp',g.stamp)}${row('Condition',g.c)}
        ${row('Includes',[g.box&&'Box',g.pap&&'Receipt'].filter(Boolean).join(' · ')||'Bag only')}
        ${row('Held in',g.loc)}
      </div>
      <div class="bagacts">
        <button class="b1" id="bagwa">Enquire on WhatsApp <span class="a">→</span></button>
        <a class="b2" href="book.html">Book a viewing <span class="a">→</span></a>
      </div>
      <div class="bagassure">
        <span>Authenticated by hand</span><i></i><span>Insured delivery</span><i></i>
        <span>Part-exchange welcome</span>
      </div>
    </div>`;
  document.getElementById('bagwa').addEventListener('click',()=>{
    location.href=waURL(`Hello — I'm interested in this bag.\n\nHermès ${g.fam}\n`+
      `${g.colour} ${g.leather}, ${g.hw} hardware\n${money(g.aed)}\n\nIs it still available?`);
  });

  const prev=(i-1+BAGS.length)%BAGS.length, next=(i+1)%BAGS.length;
  document.getElementById('prevb').href='bag.html?i='+prev;
  document.getElementById('nextb').href='bag.html?i='+next;

  const rel=BAGS.map((x,n)=>({x,n})).filter(o=>o.n!==i && o.x.m===g.m);
  const pool=(rel.length?rel:BAGS.map((x,n)=>({x,n})).filter(o=>o.n!==i)).slice(0,6);
  document.getElementById('relh').textContent=rel.length?`More ${g.m}`:'More handbags';
  document.getElementById('relbags').innerHTML=pool.map(o=>bagCard(o.x,o.n)).join('');
  repaintMoney();
});
