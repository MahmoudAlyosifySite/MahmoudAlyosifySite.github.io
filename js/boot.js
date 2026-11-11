/* ============================================================
   First-paint decisions — loaded in <head>, before anything is
   drawn, so the page never flashes the wrong theme.

   Kept in a file rather than inline so every page's
   Content-Security-Policy can forbid inline scripts altogether.

   Dark is the default; a saved choice of the light theme is
   applied here. On the home page (the tag carries data-prologue)
   it also decides how the scroll prologue opens:
     · first arrival in this tab  → the film opens the page and
       the site's chrome stays hidden until it ends (is-prologue)
     · the film was already watched or skipped in this tab, and
       this is a fresh navigation → the page opens at the hero
       (intro-seen; js/prologue.js does the jump). The film is
       still there above, one scroll up.
   ============================================================ */
(function () {
  var root = document.documentElement;
  var me = document.currentScript;

  var t = 'dark';
  try { if (localStorage.getItem('ma-theme') === 'light') t = 'light'; } catch (e) { /* storage blocked */ }
  root.setAttribute('data-theme', t);
  if (t === 'light') {
    var bar = document.querySelector('meta[name="theme-color"]');
    if (bar) bar.setAttribute('content', '#F4F2ED');
  }

  if (!me || !me.hasAttribute('data-prologue')) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (location.hash) return;

  var seen = false;
  try { seen = sessionStorage.getItem('ma-intro') === '1'; } catch (e) { /* storage blocked */ }
  // A reload or a step back returns to where the visitor was; only a fresh
  // arrival at the top is carried past the film.
  var nav = window.performance && performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
  var fresh = !nav || nav.type === 'navigate';

  root.classList.add(seen && fresh ? 'intro-seen' : 'is-prologue');
})();
