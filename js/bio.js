/* ============================================================
   Mahmoud Alyosify — Biography page
   The small amount of behaviour this page needs: the shared nav
   (stuck state, mobile drawer), reading progress, back-to-top,
   the contents list that follows the reader, and the same
   Mahmoud AI assistant as the home page, loaded on first click.
   ============================================================ */

(() => {
  'use strict';

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ── Nav, progress, back-to-top ─────────────────────────── */
  const nav = $('#nav');
  const toTop = $('#to-top');
  const fill = $('.scroll-rail__fill');

  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const y = window.scrollY;
    nav.classList.toggle('is-stuck', y > 40);
    toTop.classList.toggle('is-on', y > 700);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (fill) fill.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    spy();
  };
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } };
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);

  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const links = $('#nav-links');
  const burger = $('#nav-burger');
  const closeMenu = () => {
    links.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
  links.addEventListener('click', (e) => { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && links.classList.contains('is-open')) closeMenu(); });

  /* ── Contents ───────────────────────────────────────────── */
  const toc = $('.bio-toc');
  const small = window.matchMedia('(max-width: 820px)');

  // Open in the margin on wide screens; a single foldable line on phones.
  const fitToc = () => { if (small.matches) toc.removeAttribute('open'); else toc.setAttribute('open', ''); };
  fitToc();
  small.addEventListener('change', fitToc);

  // On wide screens the list is always open — its summary is hidden, so
  // the only way to fold it would be a stray click we should ignore.
  toc.addEventListener('toggle', () => { if (!small.matches && !toc.open) toc.open = true; });
  toc.addEventListener('click', (e) => { if (e.target.closest('a') && small.matches) toc.removeAttribute('open'); });

  const tocLinks = $$('.bio-toc a[href^="#"]');
  const heads = tocLinks
    .map((a) => ({ a, el: document.getElementById(a.getAttribute('href').slice(1)) }))
    .filter((x) => x.el);

  let active = null;
  function spy() {
    const line = 120;                     // just under the fixed nav
    let current = null;
    for (const h of heads) {
      if (h.el.getBoundingClientRect().top - line <= 0) current = h;
      else break;
    }
    if (current === active) return;
    if (active) active.a.classList.remove('is-active');
    active = current;
    if (active) {
      active.a.classList.add('is-active');
      active.a.setAttribute('aria-current', 'location');
      keepInView(active.a);
    }
    tocLinks.forEach((a) => { if (!active || a !== active.a) a.removeAttribute('aria-current'); });
  }

  // The list can be taller than the window: scroll it (never the page)
  // so the current entry stays visible.
  function keepInView(a) {
    if (toc.scrollHeight <= toc.clientHeight + 1) return;
    const box = toc.getBoundingClientRect();
    const r = a.getBoundingClientRect();
    if (r.top < box.top + 8) toc.scrollTop -= box.top + 8 - r.top;
    else if (r.bottom > box.bottom - 8) toc.scrollTop += r.bottom - (box.bottom - 8);
  }

  onScroll();

  /* ── Mahmoud AI — nothing loads until the visitor asks ─────── */
  const fab = $('#bot-fab');
  if (fab) {
    let loading = false;
    const load1 = (src) => new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src; s.onload = resolve; s.onerror = reject;
      document.body.appendChild(s);
    });
    const load = async () => {
      if (loading) return;
      loading = true;
      fab.classList.add('is-loading');

      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = '../css/chatbot.css';
      document.head.appendChild(css);

      window.MAHMOUD_AI_ASSET_BASE = '../';
      window.MAHMOUD_AI_DATA_URL = '../data/mahmoud-profile.json';
      try {
        await load1('../js/i18n.js');
        await load1('../js/security.js');
        await load1('../js/providers.js');
        await load1('../js/retriever.js');
        await load1('../js/chatbot.js');
        const t = (k) => (window.I18N && window.I18N.en[k]) || k;
        window.MahmoudAI.mount({ lang: 'en', t });
        window.MahmoudAI.open();
        fab.removeEventListener('click', load);
        fab.addEventListener('click', () => window.MahmoudAI.toggle());
      } catch (_) {
        loading = false;
      } finally {
        fab.classList.remove('is-loading');
      }
    };
    fab.addEventListener('click', load);
  }
})();
