/* live component sheet — the demos run on the real system CSS */
const STAR='<svg viewBox="0 0 20 19"><path d="M10 0l3.09 6.26L20 7.27l-5 4.87 1.18 6.88L10 15.77 3.82 19 5 12.14 0 7.27l6.91-1.01z"/></svg>';
const SECS=[['s-type','Type'],['s-space','Space'],['s-nav','Navigation'],['s-btn','Buttons'],
 ['s-card','Cards'],['s-list','Lists'],['s-stat','Stats'],['s-quote','Quotes'],['s-spec','Specs'],
 ['s-filter','Filters'],['s-acc','Accordion'],['s-form','Forms'],['s-state','States'],['s-rules','Rules']];
const RULES=[
 ['When content expands','An accordion, in place, never a new page. One item open at a time so the page length stays predictable. Anything longer than three paragraphs goes to its own screen instead.'],
 ['When content scrolls sideways','Only when the set is browsable and unranked — watches, maisons, reviews. Never for steps, never for anything the user must read all of. Always snap, always show a partial card at the edge so the affordance is visible without a hint.'],
 ['When content paginates','Above 12 items. Twelve, then load on scroll with skeletons in place. Never a numbered pager on mobile.'],
 ['When a sheet is used','Any decision that must not cost the user their place: filters, options, a case of watches. Sheets never navigate — if the result is a new page, it is a link, not a sheet.'],
 ['When something sticks','Two only: the dock, always; and one contextual bar per screen — the filter row on the case, the action bar on a product. Never both at once, never a third.'],
 ['How forms progress','Under five fields, one screen. Over five, split into steps with a progress bar. Validate on submit, not on keystroke. Inputs are 16px so iOS never zooms. The submit button carries the outcome — "Show 8 watches", not "Apply".'],
 ['Animation','Three durations: 160ms for state, 260ms for movement, 400ms for anything entering the screen. One curve. Transform and opacity only — never height, never width. Everything collapses under prefers-reduced-motion.'],
 ['Loading','Skeletons that match the shape of what is coming, never a spinner. If a result is under 300ms, show nothing at all — a flash of skeleton is worse than a pause.'],
 ['Empty and error','Both say what happened, why, and offer the single most useful way out. Never a dead end, never an apology without an action.']
];
document.addEventListener('DOMContentLoaded',()=>{
  const $=id=>document.getElementById(id);
  $('sysnav').innerHTML=SECS.map(([id,t])=>`<a class="c-chip" href="#${id}">${t}</a>`).join('');
  $('qs').innerHTML=STAR.repeat(5);
  document.querySelectorAll('.c-quote__stars').forEach(s=>{if(!s.innerHTML)s.innerHTML=STAR.repeat(5)});

  /* space scale, drawn to scale */
  $('spacedemo').innerHTML=[['s1',4],['s2',8],['s3',12],['s4',16],['s5',20],['s6',24],
    ['s7',32],['s8',40],['s9',56],['s10',72]].map(([n,v])=>
    `<div class="c-row"><span class="c-row__main"><span class="c-row__t">--${n}</span></span>
     <span style="height:10px;width:${v}px;background:var(--char);flex:none"></span>
     <span class="c-row__end" style="width:44px">${v}px</span></div>`).join('');

  $('rulesdemo').innerHTML=RULES.map(([t,b],i)=>
    `<div class="c-acc__i${i?'':' is-open'}"><button class="c-acc__h">${t}<i>+</i></button>
     <div class="c-acc__b">${b}</div></div>`).join('');

  /* one accordion behaviour, used by both demos */
  document.querySelectorAll('.c-acc').forEach(acc=>{
    acc.addEventListener('click',e=>{
      const h=e.target.closest('.c-acc__h'); if(!h) return;
      const item=h.parentElement, open=item.classList.contains('is-open');
      acc.querySelectorAll('.c-acc__i').forEach(x=>x.classList.remove('is-open'));
      if(!open) item.classList.add('is-open');
    });
  });

  document.querySelectorAll('.c-chip[aria-pressed]').forEach(c=>c.addEventListener('click',()=>
    c.setAttribute('aria-pressed', c.getAttribute('aria-pressed')==='true'?'false':'true')));
  document.querySelectorAll('.c-seg button').forEach(b=>b.addEventListener('click',()=>{
    b.parentElement.querySelectorAll('button').forEach(x=>x.setAttribute('aria-selected',String(x===b)));
  }));

  $('demo-sheet')?.addEventListener('click',()=>{
    if(!window.osSheet) return alert('Sheets are mobile-only — narrow the window below 980px.');
    osSheet.show('A sheet',
      `<div class="c-list">
        <div class="c-row"><span class="c-row__main"><span class="c-row__t">It keeps your place</span>
        <span class="c-row__s">The page behind does not move or reload.</span></span></div>
        <div class="c-row"><span class="c-row__main"><span class="c-row__t">It is dismissible three ways</span>
        <span class="c-row__s">Drag the handle, tap outside, or press Escape.</span></span></div>
       </div>`,
      `<button class="c-btn c-btn--block" onclick="osSheet.close()">Show 8 watches</button>`);
  });
  $('demo-search')?.addEventListener('click',()=>document.querySelector('[data-act="search"]')?.click());

  /* skeleton → content, to show the loading rule */
  setTimeout(()=>{
    const d=$('skeldemo'); if(!d) return;
    d.querySelectorAll('.c-skel--line').forEach((l,i)=>{
      l.classList.remove('c-skel','c-skel--line','is-short');
      l.style.height='';
      l.innerHTML=i%2 ? '<span class="c-card__p">Ref. 116610LV · 2019</span>'
                      : '<span class="c-card__t">Submariner “Hulk”</span>';
    });
  },2600);

  $('formdemo')?.addEventListener('submit',e=>{
    e.preventDefault();
    const f=$('d1').closest('.c-field');
    const bad=!$('d1').value.trim();
    f.classList.toggle('is-bad',bad);
    let err=f.querySelector('.c-field__err');
    if(bad && !err){ err=document.createElement('span'); err.className='c-field__err';
      err.textContent='We need a name to hold the slot.'; f.appendChild(err); }
    if(!bad && err) err.remove();
  });
});
