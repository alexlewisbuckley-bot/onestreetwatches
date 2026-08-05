const GAL=["__IMG_CAM1__","__IMG_CAM4__","__IMG_CAM3__","__IMG_EXT__","__IMG_CAM2__"];
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
