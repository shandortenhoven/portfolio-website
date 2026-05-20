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
