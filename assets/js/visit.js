const GAL=["assets/img/boutique-salon.jpg","assets/img/boutique-corridor.jpg","assets/img/boutique-lounge.jpg","assets/img/boutique-exterior.jpg","assets/img/boutique-wall.jpg"];
const CAPS=["The main salon","The corridor","The lounge","Building 5","The complication wall"];
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
