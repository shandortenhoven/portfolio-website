/* Shandor ten Hoven · Portfolio scripts */

// ---------- marquee: repeat content until it more than fills the screen ----------
const mq = document.getElementById('marquee');
if (mq) {
  const chunk = mq.innerHTML;
  // keep doubling until one half of the track is wider than the viewport,
  // so the -50% loop never shows a gap
  // the counter is a guard: if scrollWidth ever reports 0 this would never end
  let guard = 0;
  while (mq.scrollWidth < window.innerWidth * 2 && guard++ < 12) {
    mq.innerHTML += chunk;
  }
  // ensure an even number of chunks so the halfway point lines up seamlessly
  mq.innerHTML += mq.innerHTML;
}

// ---------- scroll reveals ----------
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.rv:not(.in)').forEach(el => io.observe(el));
} else {
  document.querySelectorAll('.rv').forEach(el => el.classList.add('in'));
}

// ---------- menu hover: reveal project image behind the card ----------
const work = document.getElementById('work');
if (work) {
  // The collage is desktop-only (CSS hides it under 1180px) and hover-driven,
  // so its images stay unfetched until a group is about to be shown.
  const hydrate = group => {
    if (!group) return;
    group.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  };

  const bgs = {};
  document.querySelectorAll('.bg-reveal .bg').forEach(b => bgs[b.dataset.for] = b);
  document.querySelectorAll('.course').forEach(c => {
    c.addEventListener('mouseenter', () => {
      hydrate(bgs[c.dataset.bg]);
      Object.values(bgs).forEach(b => b.classList.remove('on'));
      if (bgs[c.dataset.bg]) bgs[c.dataset.bg].classList.add('on');
      work.classList.add('lit');
    });
    c.addEventListener('mouseleave', () => {
      if (bgs[c.dataset.bg]) bgs[c.dataset.bg].classList.remove('on');
      work.classList.remove('lit');
    });
  });
}

// ---------- nav border on scroll ----------
const nav = document.getElementById('nav');
if (nav) {
  addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', scrollY > 10);
  }, { passive: true });
}


// ---------- the ingredients: bilingual skill filter ----------
// Progressive enhancement. The block ships hidden and is only revealed here,
// so a failed script leaves the menu exactly as it was.
(() => {
  const box = document.getElementById('ingredients');
  if (!box) return;

  // [english, nederlands]
  const SKILLS = {
    'user-research':   ['User research',         'Gebruikersonderzoek'],
    'interviews':      ['User interviews',       'Gebruikersinterviews'],
    'stakeholder':     ['Stakeholder interviews','Stakeholdergesprekken'],
    'competitive':     ['Competitive research',  'Concurrentieonderzoek'],
    'affinity':        ['Affinity mapping',      'Affinity mapping'],
    'personas':        ['Personas',              'Persona\u2019s'],
    'flows':           ['User flows',            'Gebruikersflows'],
    'ia':              ['Information architecture','Informatiearchitectuur'],
    'wireframing':     ['Wireframing',           'Wireframing'],
    'ui':              ['UI design',             'UI-ontwerp'],
    'visual':          ['Visual design',         'Visueel ontwerp'],
    'interaction':     ['Interaction design',    'Interactieontwerp'],
    'prototyping':     ['Prototyping',           'Prototyping'],
    'usability':       ['Usability testing',     'Usabilityonderzoek'],
    'designsystem':    ['Design system',         'Designsysteem'],
    'typography':      ['Typography',            'Typografie'],
    'motion':          ['Motion design',         'Motion design'],
    'uxwriting':       ['UX writing',            'UX-teksten'],
    'contentstrategy': ['Content strategy',      'Contentstrategie'],
    'brandstrategy':   ['Brand strategy',        'Merkstrategie'],
    'artdirection':    ['Art direction',         'Artdirection'],
    'concept':         ['Concept development',   'Conceptontwikkeling'],
    'mobile':          ['Mobile design',         'Mobiel ontwerp'],
    'b2b':             ['B2B',                   'B2B']
  };

  const COURSE = {
    energy: ['competitive','stakeholder','brandstrategy','contentstrategy','uxwriting',
             'artdirection','visual','typography','designsystem','wireframing','ui','b2b'],
    expert: ['user-research','interviews','affinity','personas','flows','ia',
             'wireframing','ui','interaction','prototyping','usability'],
    kubo:   ['ia','flows','mobile','interaction','ui','visual','prototyping'],
    mood:   ['concept','designsystem','visual','ui','typography','motion','prototyping']
  };

  const UI = {
    label: ['The ingredients', 'De ingredi\u00ebnten'],
    all:   ['Everything', 'Alles'],
    idle:  ['Pick an ingredient to see where it went.',
            'Kies een ingredi\u00ebnt om te zien waar het in zit.'],
    count: [n => `Used in ${n} of 4 courses.`, n => `Zit in ${n} van de 4 gerechten.`],
    none:  ['No course uses that one yet.', 'Nog geen gerecht met dat ingredi\u00ebnt.'],
    swap:  ['Toon vaardigheden in het Nederlands', 'Show skills in English']
  };

  const chipbox = document.getElementById('chips');
  const note    = document.getElementById('ingNote');
  const toggle  = document.getElementById('langToggle');
  const label   = box.querySelector('.ing-label');
  const courses = [...document.querySelectorAll('.course')];

  let lang = 0;        // 0 = en, 1 = nl
  let active = 'all';

  // most-used ingredients first, then alphabetical
  const keys = Object.keys(SKILLS).filter(k => Object.values(COURSE).some(l => l.includes(k)));
  const freq = k => Object.values(COURSE).filter(l => l.includes(k)).length;
  keys.sort((a, b) => freq(b) - freq(a) || SKILLS[a][0].localeCompare(SKILLS[b][0]));

  const mk = (skill, cls) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = cls;
    b.dataset.skill = skill;
    chipbox.appendChild(b);
    return b;
  };
  const allChip = mk('all', 'chip all');
  keys.forEach(k => mk(k, 'chip'));
  const chips = [...chipbox.querySelectorAll('.chip')];

  function render() {
    label.textContent = UI.label[lang];
    allChip.textContent = UI.all[lang];
    toggle.textContent = lang === 0 ? 'NL' : 'EN';
    toggle.setAttribute('aria-label', UI.swap[lang]);

    chips.forEach(c => {
      if (c.dataset.skill !== 'all') c.textContent = SKILLS[c.dataset.skill][lang];
      c.setAttribute('aria-pressed', String(c.dataset.skill === active));
    });

    let hits = 0;
    courses.forEach(course => {
      const list = COURSE[course.dataset.bg] || [];
      const match = active === 'all' || list.includes(active);
      course.classList.toggle('dim', !match);
      if (match && active !== 'all') hits++;
      course.querySelector('.meta').innerHTML = list
        .map(k => k === active ? `<em>${SKILLS[k][lang]}</em>` : SKILLS[k][lang])
        .join(' &middot; ');
    });

    note.textContent = active === 'all' ? UI.idle[lang]
                     : hits ? UI.count[lang](hits) : UI.none[lang];
  }

  chipbox.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    active = chip.dataset.skill === active ? 'all' : chip.dataset.skill;
    render();
  });

  toggle.addEventListener('click', () => { lang = lang ? 0 : 1; render(); });

  box.hidden = false;
  render();
})();
