/* ========================================
   THEME TOGGLE
   System preference detection + localStorage persistence
   ======================================== */
(function () {
  const STORAGE_KEY = 'shandor-theme';
  const root = document.documentElement;

  // Initial theme: stored choice → system preference → light
  const stored = localStorage.getItem(STORAGE_KEY);
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = stored || (systemDark ? 'dark' : 'light');
  root.setAttribute('data-theme', initial);

  // Toggle handler
  document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', function () {
      const current = root.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem(STORAGE_KEY, next);
    });
  });

  // Respect system changes when user hasn't made an explicit choice
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem(STORAGE_KEY)) {
      root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  });
})();

/* ========================================
   PROJECT ROW NAVIGATION
   Make entire row clickable
   ======================================== */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.project-row[data-href]').forEach(function (row) {
    row.addEventListener('click', function () {
      window.location.href = row.dataset.href;
    });
  });
});

/* ========================================
   LIGHTBOX
   Click case-images to view at full size
   ======================================== */
document.addEventListener('DOMContentLoaded', function () {
  // Create lightbox structure once
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Close">×</button>
    <div class="lightbox-inner">
      <img class="lightbox-img" alt="">
      <div class="lightbox-caption"></div>
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxClose = lightbox.querySelector('.lightbox-close');

  function openLightbox(src, alt, caption) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightboxCaption.textContent = caption || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 200);
  }

  // Wire up every case-image
  document.querySelectorAll('.case-image').forEach(function (frame) {
    frame.addEventListener('click', function (e) {
      // Don't open if clicking inside caption text only
      const img = frame.querySelector('img');
      if (!img) return;
      const captionEl = frame.querySelector('.caption');
      const captionText = captionEl ? captionEl.textContent.replace(/View full\s*→\s*$/i, '').trim() : '';
      openLightbox(img.src, img.alt, captionText);
    });
  });

  // Close handlers
  lightboxClose.addEventListener('click', function (e) {
    e.stopPropagation();
    closeLightbox();
  });
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
  });
});
