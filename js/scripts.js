/* Shandor ten Hoven, portfolio. One script for every page; each part only runs where its elements exist.
   Motion language: compress, stretch, reveal. Transforms and masks only, no fades. */
(() => {
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
const clamp = (v,a,b) => Math.min(b,Math.max(a,v)), lerp = (a,b,t) => a+(b-a)*t;
const eio = t => t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;
const isHome = !!$('#splash');
const nav = $('#nav'), navSh = $('#navSh');

/* ---------- SHANDOR wears several typefaces (all sans), each fitted to the same width ---------- */
const FONTS=[['Mona Sans',800,'normal'],['Doto',900,'normal'],['Silkscreen',700,'normal'],['Syne',800,'normal'],['Unbounded',900,'normal'],['Sixtyfour',400,'normal'],['Major Mono Display',400,'normal'],['Monoton',400,'normal']];
const shbox=$('#shbox'); let navFont=0, navTarget=0;
function fitFont(el,f,targetW,base){ el.style.fontFamily=`'${f[0]}','Mona Sans',sans-serif`; el.style.fontWeight=f[1]; el.style.fontSize=base+'px'; const w=el.getBoundingClientRect().width||1; el.style.fontSize=(base*targetW/w)+'px'; }
function measureNav(){ navSh.style.fontFamily=''; navSh.style.fontWeight=''; navSh.style.fontSize=''; navTarget=navSh.getBoundingClientRect().width; shbox.style.width=navTarget+'px'; fitFont(navSh,FONTS[navFont],navTarget,20); }
function setNavFont(i){ if(i===navFont) return; navFont=i; fitFont(navSh,FONTS[i],navTarget,20); }
const fontsReady=document.fonts?Promise.race([Promise.all([document.fonts.ready,...FONTS.map(f=>document.fonts.load(`${f[2]} ${f[1]} 100px "${f[0]}"`,'SHANDOR').catch(()=>null))]),new Promise(r=>setTimeout(r,2500))]):Promise.resolve();
fontsReady.then(measureNav); addEventListener('resize',()=>setTimeout(measureNav,160));
/* while you scroll it changes face every so often; when you stop it settles on the chapter's face */
const SIG={work:1,background:5,about:2,contact:4,case:1};
let travelled=0, lastY=scrollY, idleT=null, secNow=isHome?'work':'case';
addEventListener('scroll',()=>{ const dy=Math.abs(scrollY-lastY); lastY=scrollY; if(reduce||!nav.classList.contains('landed')) return;
  travelled+=dy; if(travelled>170){ travelled=0; setNavFont((navFont+1)%FONTS.length); }
  clearTimeout(idleT); idleT=setTimeout(()=>setNavFont(SIG[secNow]??0),320); },{passive:true});

/* hover reveals only respond to a moving mouse, not to a resting cursor that content scrolls under */
const root=document.documentElement;
addEventListener('pointermove',e=>{ if(e.pointerType==='mouse') root.classList.add('hv-ok'); },{passive:true});
addEventListener('wheel',()=>root.classList.remove('hv-ok'),{passive:true});

/* "Where it started": a deliberate switch on a project image */
document.addEventListener('click',e=>{ const b=e.target.closest('.cmp'); if(!b) return; e.preventDefault();
  const shot=b.closest('.shot'), on=!shot.classList.contains('show'); shot.classList.toggle('show',on);
  b.setAttribute('aria-pressed',String(on)); b.firstChild.textContent=on?b.dataset.on:b.dataset.off;
  const v=shot.querySelector('video.over'); if(v){ if(on) v.pause(); else document.dispatchEvent(new Event('loops:sync')); } });
/* long images open in a full-screen viewer instead of scrolling inside a small frame */
let lb=null;
document.addEventListener('click',e=>{ const b=e.target.closest('.fullbtn'); if(!b) return;
  if(!lb){ lb=document.createElement('dialog'); lb.className='lb'; lb.setAttribute('aria-label','Full image');
    lb.innerHTML='<button class="x" type="button">Close</button><img alt="">'; document.body.appendChild(lb);
    lb.querySelector('.x').addEventListener('click',()=>lb.close());
    lb.addEventListener('click',ev=>{ if(ev.target===lb) lb.close(); });
    lb.addEventListener('close',()=>{ if(lb._from) lb._from.focus(); }); }
  const img=lb.querySelector('img'); img.src=b.dataset.full; img.alt=b.dataset.alt||''; lb._from=b; lb.showModal(); lb.scrollTop=0; lb.querySelector('.x').focus(); });

/* ---------- small shared things ---------- */
const copyBtn = $('#copy');
if(copyBtn) copyBtn.addEventListener('click', async()=>{ try{ await navigator.clipboard.writeText('shandortenhoven@gmail.com'); }catch(e){} copyBtn.classList.add('done'); $('#copyStatus').textContent='Email address copied'; setTimeout(()=>{ copyBtn.classList.remove('done'); $('#copyStatus').textContent=''; },2200); });
const seen = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in','on'); seen.unobserve(e.target); } }), {rootMargin:'0px 0px -12% 0px'});
$$('.cr,.stmt,.portrait-rv,.contact,.rise').forEach(el => seen.observe(el));
$$('video[data-loop]').forEach(v => { if(reduce){ v.removeAttribute('autoplay'); v.controls = true; v.pause(); } else { v.play().catch(()=>{ v.controls = true; }); } });

/* ---------- page transitions: name only the elements that should travel ---------- */
const KEYMAP = {'moodstream.html':'mood','energycheck.html':'energy','kubo.html':'kubo','expert.html':'expert'};
const keyOf = u => { try{ return KEYMAP[new URL(u,location.href).pathname.split('/').pop()] || null; }catch(e){ return null; } };
const vtn = (el,n) => { if(el) el.style.viewTransitionName = n; };
addEventListener('pageswap', e => {
  if(!e.viewTransition || !e.activation || !e.activation.entry) return;
  const url = e.activation.entry.url, k = keyOf(url);
  if(isHome){ if(k){ vtn($('#pl-'+k),'cover-'+k); vtn($('#t-'+k),'title-'+k); } return; }
  const toHome = !k && /\/(index\.html)?$/.test(new URL(url,location.href).pathname);
  if(toHome) return;
  vtn($('#caseCover'),'none'); vtn($('#caseTitle'),'none');
  const nn = $('#nextName'); if(k && nn && nn.dataset.key===k){ vtn($('#nextImg'),'cover-'+k); vtn(nn,'title-'+k); }
});

/* ---------- phones: the editorial menu, built from the bar's own links so there is one source ---------- */
(() => {
  const row=nav && nav.querySelector('.row'), links=nav ? [...nav.querySelectorAll('nav a')] : [];
  if(!row || !links.length) return;
  const HINT={work:'4 projects',about:'Background and skills',cv:'PDF',contact:'Email, LinkedIn'};
  const kindOf=a=>/cv/i.test(a.textContent)?'cv':(a.dataset.sec||(a.getAttribute('href').split('#')[1])||'').toLowerCase();
  const page=location.pathname.split('/').pop();
  const isCase=/^(moodstream|expert|energycheck|kubo)\.html$/.test(page);
  const btn=document.createElement('button'); btn.className='mbtn'; btn.type='button'; btn.textContent='Menu';
  btn.setAttribute('aria-haspopup','dialog'); btn.setAttribute('aria-expanded','false'); btn.setAttribute('aria-controls','mnav');
  row.appendChild(btn);
  const dlg=document.createElement('dialog'); dlg.className='mnav'; dlg.id='mnav'; dlg.setAttribute('aria-label','Menu');
  dlg.innerHTML=`<div class="mn-top px"><span class="mn-lab">Menu</span><button class="mn-x" type="button">Close</button></div>
    <ul class="mn-list">${links.map((a,i)=>`<li><a href="${a.getAttribute('href')}" data-i="${i}" style="--i:${i}"><span class="l">${a.textContent.trim()}</span><span class="h">${HINT[kindOf(a)]||''}</span></a></li>`).join('')}</ul>
    <div class="mn-foot"><a href="mailto:shandortenhoven@gmail.com">shandortenhoven@gmail.com</a><a href="https://www.linkedin.com/in/shandortenhoven" target="_blank" rel="noopener">LinkedIn<span class="sr"> (opens in a new tab)</span></a></div>
    <div class="mn-name" aria-hidden="true"><span>Shandor</span></div>`;
  document.body.appendChild(dlg);
  document.documentElement.classList.add('has-mnav');
  const mLinks=[...dlg.querySelectorAll('.mn-list a')], nameEl=dlg.querySelector('.mn-name span');
  const fitName=()=>{ nameEl.style.fontSize='100px'; const w=nameEl.getBoundingClientRect().width||1; nameEl.style.fontSize=(100*nameEl.parentElement.clientWidth/w)+'px'; };
  let busy=false;
  function open(){
    if(dlg.open) return;
    // which part of the site you are in
    mLinks.forEach((m,i)=>{ const a=links[i], k=kindOf(a);
      const cur = a.getAttribute('aria-current')==='true' || (isCase && k==='work') || (page==='contact.html' && k==='contact');
      m.setAttribute('aria-current',String(!!cur)); });
    dlg.showModal(); document.documentElement.classList.add('mn-open'); btn.setAttribute('aria-expanded','true');
    fitName(); void dlg.offsetWidth; dlg.classList.add('on');
  }
  function close(after){
    if(!dlg.open || busy) return; busy=true; dlg.classList.remove('on');
    setTimeout(()=>{ dlg.close(); busy=false; document.documentElement.classList.remove('mn-open'); btn.setAttribute('aria-expanded','false'); if(after) after(); else btn.focus(); }, reduce?0:420);
  }
  btn.addEventListener('click',open);
  dlg.querySelector('.mn-x').addEventListener('click',()=>close());
  dlg.addEventListener('cancel',e=>{ e.preventDefault(); close(); });
  // a menu link closes the menu first, then does exactly what the same link in the bar does
  mLinks.forEach((m,i)=>m.addEventListener('click',e=>{ if(e.metaKey||e.ctrlKey||e.shiftKey) return; e.preventDefault(); close(()=>links[i].click()); }));
  addEventListener('resize',()=>{ if(innerWidth>860 && dlg.open){ dlg.classList.remove('on'); dlg.close(); document.documentElement.classList.remove('mn-open'); btn.setAttribute('aria-expanded','false'); } });
})();

/* ---------- Gus. Type "gus" anywhere, or find him in the colophon. Edit his lines here. ---------- */
const GUS = {
  src: 'img/gus/gus.svg',
  colophon: ['Hi, I’m Gus.', 'Boop.', 'Again?', 'Okay, back to supervising.'],
  typed:    ['You called?', 'Boop.', 'Again?', 'Okay, back to supervising.'],
  lost:     ['Gus denies everything.', 'Boop.', 'Still denies it.']
};
let gus=null, gusLines=[], gusStep=0, gusT=null, gusStay=false, gusFrom=null;
const gusPreload = () => { if(!gusPreload.done){ gusPreload.done=true; new Image().src=GUS.src; } };
function gusBuild(){
  gus=document.createElement('div'); gus.className='gus'; gus.hidden=true;
  gus.innerHTML=`<p class="gus-tag" role="status"><span></span></p><button class="gus-dog" type="button" aria-label="Boop Gus"><img src="${GUS.src}" alt="" width="916" height="859"></button>`;
  gus.querySelector('.gus-dog').addEventListener('click',gusBoop);
  gus.addEventListener('pointerenter',()=>clearTimeout(gusT)); gus.addEventListener('pointerleave',gusIdle);
}
const gusUp = () => gus && gus.classList.contains('up');
function gusSay(t){
  const tag=gus.querySelector('.gus-tag'); gus.classList.remove('talk','side','flip'); void gus.offsetWidth; tag.firstChild.textContent=t;
  // his line sits left of his head; no room there, then to his right; no room there either, above him
  if(tag.getBoundingClientRect().left<8){ gus.classList.add('side'); if(tag.getBoundingClientRect().right>innerWidth-8){ gus.classList.remove('side'); gus.classList.add('flip'); } }
  gus.classList.add('talk');
}
function gusIdle(){ clearTimeout(gusT); if(gus && !gusStay) gusT=setTimeout(gusHide,9000); }
/* on: a colophon line he climbs out of (otherwise the bottom edge of the screen) */
function gusShow(lines,{stay=false,on=null}={}){
  if(!gus) gusBuild(); gusLines=lines; gusStep=0; gusStay=stay;
  if(gusUp()){ gusSay(lines[0]); gusIdle(); return; }
  (on||document.body).appendChild(gus);
  gus.classList.toggle('line',!!on); gus.classList.toggle('gus-xl',stay); gus.style.left='';
  if(on){ gus.hidden=false; const w=gus.offsetWidth, cr=on.getBoundingClientRect(), b=on.querySelector('.gusbtn'), br=b?b.getBoundingClientRect():cr;
    gus.style.left=clamp(br.left+br.width/2-cr.left-w*.4,0,cr.width-w)+'px'; gus.hidden=true; }
  const img=gus.querySelector('img');
  (img.decode?img.decode():Promise.resolve()).catch(()=>{}).then(()=>{
    gus.hidden=false; void gus.offsetWidth; gus.classList.add('up');
    setTimeout(()=>gusSay(gusLines[0]), reduce?0:430); gusIdle();
  });
}
function gusHide(){
  if(!gusUp()) return; clearTimeout(gusT);
  if(gus.contains(document.activeElement) && gusFrom) gusFrom.focus();
  gus.classList.remove('talk');
  setTimeout(()=>{ gus.classList.remove('up','boop'); setTimeout(()=>{ if(!gusUp()) gus.hidden=true; }, reduce?0:400); }, reduce?0:200);
}
function gusBoop(){
  if(!gusUp()) return;
  gusStep = gusStay ? (gusStep % (gusLines.length-1)) + 1 : gusStep + 1;
  if(!reduce){ gus.classList.remove('boop'); void gus.offsetWidth; gus.classList.add('boop'); }
  if(gusStep >= gusLines.length-1 && !gusStay){ gusSay(gusLines[gusLines.length-1]); clearTimeout(gusT); gusT=setTimeout(gusHide,1800); return; }
  gusSay(gusLines[gusStep]); gusIdle();
}
$$('.gusbtn').forEach(b=>{
  b.addEventListener('pointerenter',gusPreload); b.addEventListener('focus',gusPreload);
  b.addEventListener('click',()=>{ gusFrom=b; if(gusUp() && !gusStay) gusHide(); else gusShow(GUS.colophon,{on:b.closest('.colo')}); });
});
let gusKeys='';
addEventListener('keydown',e=>{
  if(e.key==='Escape'){ if(gusUp() && !gusStay) gusHide(); return; }
  if(e.ctrlKey||e.metaKey||e.altKey||e.repeat||!e.key||e.key.length!==1) return;
  if(e.target.closest && e.target.closest('input,textarea,select,[contenteditable]')) return;
  gusKeys=(gusKeys+e.key.toLowerCase()).slice(-3);
  if(gusKeys.endsWith('g')) gusPreload();
  if(gusKeys!=='gus') return; gusKeys=''; gusFrom=null;
  if(gusStay && gusUp()){ gusBoop(); return; }
  // if a colophon is on screen he climbs out of that line, otherwise out of the bottom edge
  const colo=$$('.colo').find(c=>{ const r=c.getBoundingClientRect(); return r.top>innerHeight*.35 && r.top<innerHeight-20; });
  gusShow(GUS.typed,{on:colo||null});
});
if($('[data-gus-home]')) setTimeout(()=>gusShow(GUS.lost,{stay:true}), reduce?0:700);
console.log('%cHi, you found the console. Someone is hiding on every page of this site. Type “gus” to say hi.','font:600 13px/1.5 "Mona Sans",system-ui,sans-serif;color:#3657FF');

/* =================== HOME =================== */
if(isHome){
  const splash=$('#splash'), panel=$('#panel'), pIn=$('#pIn'), big=$('#big'), bigSh=$('#bigSh'), bigSh2=$('#bigSh2');
  const stack=$('#work'), inter=$('#inter'), v1=$('#v1'), v2=$('#v2');
  let VH=innerHeight, VW=innerWidth;
  const foldEnd = () => VH*.75, PIN = 0;        // the first 28% of the fold keeps the splash pinned
  let bigW=0, navW=0;
  function layoutBig(){
    big.style.transform=''; bigSh.style.fontSize='100px';
    const w100=bigSh.getBoundingClientRect().width, base=100*innerWidth*(innerWidth<700?1.0:1.04)/w100;
    bigSh.style.fontSize=base+'px'; bigSh2.style.fontSize=base+'px';
    bigW=bigSh.getBoundingClientRect().width; navW=navTarget||navSh.getBoundingClientRect().width;
    if(reduce) placeStill();
  }
  // reduced motion: SHANDOR simply sits at the foot of the first screen, every time the layout is measured
  function placeStill(){ const hh=bigSh.getBoundingClientRect().height, mm=parseFloat(getComputedStyle(pIn).paddingLeft)||20; big.style.transform=`translate(${innerWidth<700?mm:mm*.4}px,${innerHeight-hh*(innerWidth<700?.98:.72)}px)`; }
  addEventListener('resize',()=>{ if(innerWidth!==VW){ VW=innerWidth; VH=innerHeight; } clearTimeout(window.__rz); window.__rz=setTimeout(layoutBig,150); });

  /* rewards for curiosity on the three routes (desktop) */
  const FILL=$$('#work .shot .over').map(i=>i.getAttribute('poster')||i.getAttribute('src')); let fillT=null;
  function hint(h){ splash.dataset.hint=h||''; clearInterval(fillT); big.classList.remove('fill'); bigSh.style.backgroundImage='';
    if(h==='contact'){ bigSh.style.setProperty('--g',220); bigSh2.style.setProperty('--g',220); } else { bigSh.style.removeProperty('--g'); bigSh2.style.removeProperty('--g'); }
    if(h==='work'&&!reduce){ let j=0; const step=()=>{ bigSh.style.backgroundImage=`url(${FILL[j%FILL.length]})`; j++; }; big.classList.add('fill'); step(); fillT=setInterval(step,650); } }
  if(fine) $$('.index a').forEach(a=>{ a.addEventListener('pointerenter',()=>{ if(scrollY<4) hint(a.dataset.hint); }); a.addEventListener('pointerleave',()=>hint('')); a.addEventListener('focus',()=>hint(a.dataset.hint)); a.addEventListener('blur',()=>hint('')); });

  const clock=$('#clock'); const tick=()=>{ clock.textContent=new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Amsterdam'}); }; tick(); setInterval(tick,30000);

  function glide(to,ms=900){ if(reduce){ scrollTo(0,to); return; } const from=scrollY, t0=performance.now(); const st=t=>{ const k=clamp((t-t0)/ms,0,1); scrollTo(0,lerp(from,to,eio(k))); if(k<1) requestAnimationFrame(st); }; requestAnimationFrame(st); }
  const target = s => s==='work' ? (reduce ? stack.offsetTop : foldEnd()) : $('#'+s).offsetTop-(nav.offsetHeight||60)-40;
  $$('[data-go]').forEach(a=>a.addEventListener('click',e=>{ e.preventDefault(); hint(''); glide(target(a.dataset.go), a.dataset.go==='work'?1100:1500); history.replaceState(null,'','#'+a.dataset.go); }));
  $$('.nav a[data-sec]').forEach(a=>a.addEventListener('click',e=>{ e.preventDefault(); glide(target(a.dataset.sec),900); history.replaceState(null,'','#'+a.dataset.sec); }));
  $('.nav .name').addEventListener('click',e=>{ e.preventDefault(); glide(0,900); history.replaceState(null,'',location.pathname); });

  /* selected work: scrolling walks through the four projects; pointing at a title or tabbing to it shows that one */
  const wProj=$$('.w-proj'), wide=()=>innerWidth>860;
  let wT=null;
  const wShots=wProj.map(a=>a.querySelector('.shot')), wCur=()=>Math.max(0,wProj.findIndex(a=>a.classList.contains('on')));
  function setWork(i){
    const cur=wCur(); if(i===cur || !wProj[i]) return;
    const prev=wProj[cur];
    wProj.forEach((a,j)=>{ a.classList.toggle('on',j===i); a.classList.toggle('was',a===prev); });
    wInert(); clearTimeout(wT); wT=setTimeout(()=>prev&&prev.classList.remove('was'), reduce?0:900);
    const nv=wVids[i]; if(nv && canLoop){ try{ nv.currentTime=0; }catch(e){} } syncLoops();
  }
  /* project loops: on a wide screen only the project on stage plays; on a phone, whatever is on screen.
     Reduced motion or data saver: the still frame stays. */
  const wVids=wProj.map(a=>a.querySelector('video.over'));
  const canLoop=!reduce && !(navigator.connection && navigator.connection.saveData);
  let workSeen=false; const vSeen=new Set();
  const vPlay=v=>{ if(!v||!canLoop||v.closest('.shot.show')) return; if(!v.getAttribute('src')&&v.dataset.src) v.src=v.dataset.src+(v.canPlayType('video/mp4; codecs="avc1.640028"')?'.mp4':'.webm'); const p=v.play(); if(p&&p.catch) p.catch(()=>{}); };
  const vStop=v=>{ if(v&&!v.paused) v.pause(); };
  function syncLoops(){
    const c=wCur();
    wVids.forEach((v,j)=>{ if(!v) return;
      const go = wide() ? (workSeen && j===c) : vSeen.has(v);
      if(go) vPlay(v); else if(wide() && j!==c && workSeen) setTimeout(()=>{ if(wCur()!==j) vStop(v); },900); else vStop(v); });
  }
  new IntersectionObserver(es=>es.forEach(e=>{ workSeen=e.isIntersecting; syncLoops(); }),{threshold:.2}).observe(stack);
  const vObs=new IntersectionObserver(es=>{ es.forEach(e=>{ if(e.isIntersecting) vSeen.add(e.target); else vSeen.delete(e.target); }); if(!wide()) syncLoops(); },{threshold:.5});
  wVids.forEach(v=>v&&vObs.observe(v));
  document.addEventListener('loops:sync',syncLoops);
  const wInert=()=>{ const c=wCur(); wShots.forEach((s,j)=>{ s.inert = wide() && j!==c; }); };
  const wStep=()=>innerHeight*.7;
  const scrollIdx=()=>{ if(!wide()) return -1; const y=scrollY-stack.offsetTop-(reduce?0:foldEnd()); return y<-innerHeight*.5?-1:clamp(Math.floor(y/wStep()),0,wProj.length-1); };
  let wScroll=null, wHold=false;   // coming back from a case keeps that case on stage until you scroll yourself
  wProj.forEach((a,i)=>{ const t=a.querySelector('.w-t a'); if(fine) t.addEventListener('pointermove',e=>{ if(e.movementX||e.movementY) setWork(i); }); /* a cursor merely resting there after a page load doesn't count */ a.addEventListener('focusin',()=>setWork(i)); });
  // a tall window gets the stacked composition: it gives the image more room than a column beside the list would
  const wIn=$('.w-in'), wLab=$('.w-lab'), wLast=wProj[wProj.length-1].querySelector('.w-t');
  const wFit=()=>{ const W=innerWidth, H=innerHeight, tall=wide() && (H-400)*1.6 > W*.62; stack.classList.toggle('tall',tall);
    if(!tall) return; const cs=getComputedStyle(wIn), gap=parseFloat(getComputedStyle(stack).getPropertyValue('--stageGap'))||30;
    const list=wLast.getBoundingClientRect().bottom-wLab.getBoundingClientRect().top;
    stack.style.setProperty('--stage', Math.max(240, H-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom)-list-gap)+'px'); };
  wFit(); wInert(); addEventListener('resize',()=>{ wFit(); wInert(); });
  // phones: each project's image is revealed from its bottom edge when it scrolls in
  const wSeen=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); wSeen.unobserve(e.target); } }),{rootMargin:'0px 0px -15% 0px'});
  wProj.forEach(a=>wSeen.observe(a));

  fontsReady.then(()=>{ layoutBig(); });
  if(document.fonts) document.fonts.addEventListener('loadingdone',()=>{ layoutBig(); measureNav(); });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(()=>{
    layoutBig();
    const h=location.hash.slice(1); if(['work','about','contact'].includes(h)) scrollTo(0,target(h));
    if(reduce){ placeStill(); nav.classList.add('landed'); }
  });

  function loop(){
    const vh=innerHeight, y=scrollY, k=reduce?1:clamp(y/foldEnd(),0,1);
    if(!reduce){
      const e=1-Math.pow(1-k,2);
      // a hover reward (e.g. project images inside the letters) never travels along: scrolling clears it
      if(k>0.003&&splash.dataset.hint) hint('');
      // 2. reveal: the grey surface's bottom edge rises, the first project is already underneath
      const r=clamp((k-PIN)/(1-PIN),0,1), eE=1-Math.pow(1-r,3);
      const nh=nav.offsetHeight||60, edge=vh*(1-eE);
      panel.style.clipPath=`inset(${nh}px 0 ${eE*100}% 0)`; pIn.style.transform=`translateY(${-eE*30}vh)`;
      nav.classList.toggle('onpanel', edge>nh+1);
      splash.style.visibility=k>=1?'hidden':'visible'; panel.inert=k>.05;
      // 3. SHANDOR travels into the nav; its colour splits exactly at the surface's edge
      if(bigW&&k<1){
        const eT=e;
        const bw=bigSh.offsetWidth||bigW, nw=navSh.offsetWidth||navW;
        const nb=navSh.getBoundingClientRect(), s=lerp(1,nw/bw,eT);
        const mm=parseFloat(getComputedStyle(pIn).paddingLeft)||20, x0=innerWidth<700?mm:mm*.4;
        const h=bigSh.offsetHeight;
        const y0=vh-h*(innerWidth<700?.98:.72), x1=nb.left, y1=nb.top+nb.height/2-(h*nw/bw)/2;
        const ty=lerp(y0,y1,eT); big._s=s; big.style.transform=`translate(${lerp(x0,x1,eT)}px,${ty}px) scale(${s})`;
        const edge=vh*(1-eE), local=(edge-ty)/s;
        bigSh2.style.clipPath=`inset(${clamp(local,0,h)}px 0 0 0)`; bigSh.style.clipPath=`inset(0 0 ${clamp(h-local,0,h)}px 0)`;
      }
      const landed=k>=.97; big.style.visibility=landed?'hidden':'visible'; nav.classList.toggle('landed',landed); if(!landed) setNavFont(0);
    }
    { const si=scrollIdx();
      if(window.__wFrom){ if(!wHold){ wHold=true; wInert(); const go=()=>{ window.__wFrom=null; wScroll=null; }; ['wheel','touchstart','keydown','pointerdown'].forEach(ev=>addEventListener(ev,go,{once:true,passive:true})); } }
      else if(wScroll===null){ wScroll=si; if(si>=0) setWork(si); wInert(); }
      else if(si>=0 && si!==wScroll){ wScroll=si; setWork(si); } }
    nav.classList.toggle('glass',k>=.9 || (!reduce && !nav.classList.contains('onpanel') && k>0));
    let sec='work'; $$('section[data-sec]').forEach(el=>{ const r=el.getBoundingClientRect(); if(r.top<vh*.45&&r.bottom>vh*.45) sec=el.dataset.sec; }); secNow=sec;
    $$('.nav a[data-sec]').forEach(a=>a.setAttribute('aria-current',String(k>=.98&&a.dataset.sec===sec)));
    if(!reduce&&inter){ const r=inter.getBoundingClientRect(); if(r.bottom>0&&r.top<vh){ const t=clamp((vh-r.top)/(vh+r.height),0,1); v1.style.setProperty('--w',lerp(75,125,t)); v1.style.setProperty('--g',lerp(800,300,t)); v2.style.setProperty('--w',lerp(125,75,t)); v2.style.setProperty('--g',lerp(300,800,t)); } }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

/* =================== CASE PAGES =================== */
else {
  nav.classList.add('landed','solid');
  // before | after: you decide where the seam sits
  $$('.ba .fig').forEach(fig=>{
    const range=fig.querySelector('.cmpr'), set=v=>{ fig.style.setProperty('--x',v+'%'); range.value=Math.round(v); };
    range.addEventListener('input',()=>{ fig.classList.add('live'); set(+range.value); });
    range.addEventListener('change',()=>fig.classList.remove('live'));
    if(fine) fig.addEventListener('pointermove',e=>{ const r=fig.getBoundingClientRect(); fig.classList.add('live'); set(clamp((e.clientX-r.left)/r.width*100,0,100)); });
    fig.addEventListener('pointerleave',()=>{ fig.classList.remove('live'); });
  });
}
})();
