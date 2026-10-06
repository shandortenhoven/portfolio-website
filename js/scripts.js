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
  b.setAttribute('aria-pressed',String(on)); b.firstChild.textContent=on?b.dataset.on:b.dataset.off; });
/* long images open in a full-screen viewer instead of scrolling inside a small frame */
let lb=null;
document.addEventListener('click',e=>{ const b=e.target.closest('.full'); if(!b) return;
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

/* =================== HOME =================== */
if(isHome){
  const splash=$('#splash'), panel=$('#panel'), pIn=$('#pIn'), big=$('#big'), bigSh=$('#bigSh'), bigSh2=$('#bigSh2');
  const stack=$('#work'), panels=$$('.p'), inter=$('#inter'), v1=$('#v1'), v2=$('#v2');
  let VH=innerHeight, VW=innerWidth;
  const foldEnd = () => VH*.75, PIN = 0;        // the first 28% of the fold keeps the splash pinned
  let bigW=0, navW=0;
  function layoutBig(){
    big.style.transform=''; bigSh.style.fontSize='100px';
    const w100=bigSh.getBoundingClientRect().width, base=100*innerWidth*(innerWidth<700?1.0:1.04)/w100;
    bigSh.style.fontSize=base+'px'; bigSh2.style.fontSize=base+'px';
    bigW=bigSh.getBoundingClientRect().width; navW=navTarget||navSh.getBoundingClientRect().width;
  }
  addEventListener('resize',()=>{ if(innerWidth!==VW){ VW=innerWidth; VH=innerHeight; } clearTimeout(window.__rz); window.__rz=setTimeout(layoutBig,150); });

  /* rewards for curiosity on the three routes (desktop) */
  const FILL=$$('.p .shot .over').map(i=>i.getAttribute('src')); let fillT=null;
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

  const naturalTop = el => { let y=stack.offsetTop; for(const c of stack.children){ if(c===el) break; y+=c.offsetHeight; } return y; };
  stack.addEventListener('focusin',e=>{ const p=e.target.closest('.p'); if(!p) return; const nt=naturalTop(p); if(Math.abs(scrollY-nt)>4) scrollTo(0,nt); });

  fontsReady.then(()=>{ layoutBig(); });
  if(document.fonts) document.fonts.addEventListener('loadingdone',()=>{ layoutBig(); measureNav(); });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(()=>{
    layoutBig();
    const h=location.hash.slice(1); if(['work','about','contact'].includes(h)) scrollTo(0,target(h));
    if(reduce){ const hh=bigSh.getBoundingClientRect().height, mm=parseFloat(getComputedStyle(pIn).paddingLeft)||20; big.style.transform=`translate(${innerWidth<700?mm:mm*.4}px,${innerHeight-hh*(innerWidth<700?.98:.72)}px)`; nav.classList.add('landed'); }
  });

  function loop(){
    const vh=innerHeight, y=scrollY, k=reduce?1:clamp(y/foldEnd(),0,1);
    if(!reduce){
      const e=1-Math.pow(1-k,2);
      // a hover reward (e.g. project images inside the letters) never travels along: scrolling clears it
      if(k>0.003&&splash.dataset.hint) hint('');
      // 2. reveal: the grey surface's bottom edge rises, the first project is already underneath
      const r=clamp((k-PIN)/(1-PIN),0,1), eE=1-Math.pow(1-r,3);
      panel.style.clipPath=`inset(0 0 ${eE*100}% 0)`; pIn.style.transform=`translateY(${-eE*30}vh)`;
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
      if(innerWidth>860) panels.forEach((p,i)=>{ const nx=panels[i+1]; if(!nx) return; const q=clamp(1-nx.getBoundingClientRect().top/vh,0,1); p.firstElementChild.style.transform=q>0&&q<1?`translateY(${-q*5}vh)`:(q>=1?'translateY(-5vh)':''); });
    }
    nav.classList.toggle('glass',k>=.9);
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
  const bas=$$('.ba').map(b=>({b, fig:b.querySelector('.fig'), after:b.querySelector('.after'), seam:b.querySelector('.seam')}));
  function loop(){
    if(!reduce) bas.forEach(o=>{
      // before/after: one mask follows the image through the screen
      const r=o.fig.getBoundingClientRect(); if(r.bottom<0||r.top>innerHeight) return;
      const w=eio(clamp((innerHeight*.8-r.top)/(innerHeight*.55),0,1));
      o.after.style.clipPath=`inset(0 ${(1-w)*100}% 0 0)`; o.seam.style.transform=`translateX(${w*o.fig.offsetWidth}px)`; o.seam.style.opacity=w>0&&w<1?1:0;
      o.b.classList.toggle('done',w>.5);
    });
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}
})();
