/* Shandor ten Hoven · Portfolio scripts */

// ---------- marquee: repeat content until it more than fills the screen ----------
const mq = document.getElementById('marquee');
if (mq) {
  const chunk = mq.innerHTML;
  // keep doubling until one half of the track is wider than the viewport,
  // so the -50% loop never shows a gap
  while (mq.scrollWidth < window.innerWidth * 2) {
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
  const bgs = {};
  document.querySelectorAll('.bg-reveal .bg').forEach(b => bgs[b.dataset.for] = b);
  document.querySelectorAll('.course').forEach(c => {
    c.addEventListener('mouseenter', () => {
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
