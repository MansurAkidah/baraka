(function () {
  var root = document.documentElement;
  var themeBtn = document.getElementById('theme');
  var menuBtn = document.getElementById('menu');
  var nav = document.getElementById('nav');
  var toTop = document.getElementById('totop');

  // Theme toggle (initial value is set in <head> to avoid a flash)
  function syncLabel() {
    var dark = root.dataset.theme === 'dark';
    themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }
  syncLabel();
  themeBtn.addEventListener('click', function () {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
    syncLabel();
  });

  // Mobile menu
  function closeMenu() { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') closeMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  // Scroll to top
  window.addEventListener('scroll', function () {
    toTop.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  // Count-up stats, once, when visible
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, end = +el.dataset.count, start = null;
        function step(ts) {
          start = start || ts;
          var p = Math.min((ts - start) / 1200, 1);
          el.textContent = Math.round(end * p) + '+';
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { io.observe(c); });
  }

  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
