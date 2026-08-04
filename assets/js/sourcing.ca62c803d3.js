document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.acch').forEach(h=>h.addEventListener('click',()=>h.parentElement.classList.toggle('open')));
});
