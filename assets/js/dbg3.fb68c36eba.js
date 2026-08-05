const {chromium}=require('playwright');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const p=await ctx.newPage();
  p.on('pageerror',e=>console.log('ERR',e.message));
  await p.goto('file:///home/claude/work/osw/prod/sell.html',{waitUntil:'load'});
  await p.waitForTimeout(900);
  console.log(await p.evaluate(()=>JSON.stringify({
    page:document.body.dataset.page,
    hasFlowFn:typeof buildFlowPage,
    flowKeys:typeof FLOW!=='undefined'?Object.keys(FLOW):'undefined',
    phead:!!document.querySelector('.phead'),
    mflow:!!document.querySelector('.mflow'),
    mobile:window.osMobile&&osMobile()
  })));
  await b.close();
})();
