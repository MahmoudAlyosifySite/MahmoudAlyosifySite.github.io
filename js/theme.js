/* ============================================================
   Mahmoud Alyosify — theme switch
   Dark is the default. The first paint is decided by a tiny
   inline script in each page's <head> (so nothing flashes);
   this file wires the switch buttons and remembers the choice.

   Shared by the home page, the biography and the CV page. On
   the home page the button labels follow the site language
   (window.MASite); elsewhere they fall back to English.
   ============================================================ */

(() => {
  'use strict';

  const root = document.documentElement;
  const KEY = 'ma-theme';
  const BAR = { dark: '#0B0B0C', light: '#F4F2ED' };

  const current = () => (root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

  /** The label says what pressing the button will do. */
  function label(theme) {
    const key = theme === 'dark' ? 'nav.themeLight' : 'nav.themeDark';
    // Pages without the home page's language machinery (the biography, the CV page,
    // the Arabic profile) name the button in their own language.
    const ar = root.lang === 'ar';
    const fallback = ar
      ? (theme === 'dark' ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن')
      : (theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    return (window.MASite && window.MASite.t(key)) || fallback;
  }

  function sync() {
    const theme = current();
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      const text = label(theme);
      btn.setAttribute('aria-label', text);
      btn.setAttribute('title', text);
      const shown = btn.querySelector('[data-theme-label]');   // the menu's switch says it aloud
      if (shown) shown.textContent = text;
    });
    const bar = document.querySelector('meta[name="theme-color"]');
    if (bar) bar.setAttribute('content', BAR[theme]);
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(KEY, theme); } catch (_) { /* private mode: the choice lasts this page only */ }
    sync();
    document.dispatchEvent(new CustomEvent('site:theme', { detail: { theme } }));
  }

  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-theme-toggle]')) return;
    apply(current() === 'dark' ? 'light' : 'dark');
  });

  // Another tab changed the theme — follow it.
  window.addEventListener('storage', (e) => {
    if (e.key !== KEY) return;
    root.setAttribute('data-theme', e.newValue === 'light' ? 'light' : 'dark');
    sync();
  });

  // The home page re-labels everything when the language changes.
  document.addEventListener('site:lang', sync);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', sync);
  else sync();
})();
