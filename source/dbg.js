const {chromium}=require('playwright');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const p=await ctx.newPage();
  p.on('pageerror',e=>console.log('ERR',e.message));
  await p.goto('http://localhost:8099/shop.html',{waitUntil:'networkidle'});
  await p.waitForTimeout(600);
  console.log(await p.evaluate(()=>{
    const m=document.getElementById('msearch');
    const before=m?getComputedStyle(m).display:'no element';
    document.querySelector('[data-act="search"]').click();
    const after=m?getComputedStyle(m).display:'no element';
    return JSON.stringify({exists:!!m, before, after, cls:m&&m.className,
      openSearchDefined:typeof openSearch});
  }));
  await b.close();
})();
