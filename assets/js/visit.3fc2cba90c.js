const GAL=["assets/img/boutique-salon.ea631f9f49.jpg","assets/img/boutique-corridor.598b73a1f7.jpg","assets/img/boutique-lounge.cc6e46eb3b.jpg","assets/img/boutique-exterior.374cb6d191.jpg","assets/img/boutique-wall.5ec75b6f36.jpg"];
const CAPS=["The main salon","The corridor","The lounge","The entrance","The complication wall"];
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
