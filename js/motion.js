/* ============================================================
   Mahmoud Alyosify — Motion orchestration
   Motion is kept to what explains something: content arriving,
   the key phrase being marked, and one scrubbed moment — the
   career spine filling as you read down it (GSAP ScrollTrigger).
   Bails out entirely on prefers-reduced-motion; falls back to
   IntersectionObserver reveals if the CDN never loads.
   ============================================================ */

(() => {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ══════════════════════════════════════════════════════════
     Reveals — always available, GSAP or not
     ══════════════════════════════════════════════════════════ */
  let revealIO = null;

  /** Last resort: make everything visible. Hidden content is worse than
      unanimated content, so any failure path ends up here. */
  function revealEverything() {
    $$('[data-reveal]').forEach((el) => el.classList.add('is-in'));
    if (revealIO) revealIO.disconnect();
  }

  function initReveals() {
    if (revealIO) revealIO.disconnect();
    revealIO = new IntersectionObserver((entries) => {
      entries.forEach((en, i) => {
        if (!en.isIntersecting) return;
        en.target.style.setProperty('--d', Math.min(i * 60, 360) + 'ms');
        en.target.classList.add('is-in');
        revealIO.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    $$('[data-reveal]:not(.is-in)').forEach((el) => revealIO.observe(el));
  }

  /* Watchdog. If the observer has produced nothing a few seconds after the
     page became visible, something is wrong (no IO support, a thrown error,
     a suspended renderer). Show the content rather than leave a blank page. */
  function guardReveals() {
    let armed = true;
    const check = () => {
      if (!armed || document.hidden) return;
      armed = false;
      setTimeout(() => {
        const total = $$('[data-reveal]').length;
        if (total && !document.querySelector('[data-reveal].is-in')) revealEverything();
      }, 3000);
    };
    document.addEventListener('visibilitychange', check);
    check();
  }

  /* ══════════════════════════════════════════════════════════
     Reading progress
     ══════════════════════════════════════════════════════════ */
  function initScrollRail() {
    const fill = $('.scroll-rail__fill');
    if (!fill) return;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? (window.scrollY / max) * 100 : 0;
      fill.style.width = p + '%';
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }

  /* ══════════════════════════════════════════════════════════
     EXPERIENCE — the spine fills as you read down it
     ══════════════════════════════════════════════════════════ */
  function initTimeline(gsap, register) {
    const line = $('.timeline__progress');
    const items = $$('.tl-item');
    if (!line || !items.length) return;

    if (reduced) { line.style.height = '100%'; items.forEach((i) => i.classList.add('is-on')); return; }

    if (gsap && window.ScrollTrigger) {
      const tw = gsap.to(line, {
        height: '100%',
        ease: 'none',
        scrollTrigger: { trigger: '#timeline', start: 'top 62%', end: 'bottom 78%', scrub: 0.5 }
      });
      register(tw.scrollTrigger);
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => en.target.classList.toggle('is-on', en.isIntersecting));
    }, { rootMargin: '-30% 0px -45% 0px' });
    items.forEach((i) => io.observe(i));
  }

  /* ══════════════════════════════════════════════════════════
     SKILLS — the pipeline scrolls sideways on its own
     ══════════════════════════════════════════════════════════ */
  function initRail() {
    const rail = $('#rail');
    if (!rail || rail.dataset.dragBound) return;
    rail.dataset.dragBound = '1';

    // Pointer drag for mouse users; touch and trackpads scroll natively.
    let down = false, startX = 0, startScroll = 0;
    rail.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse') return;
      down = true; startX = e.clientX; startScroll = rail.scrollLeft;
      rail.setPointerCapture(e.pointerId);
      rail.style.cursor = 'grabbing';
      rail.style.scrollSnapType = 'none';
    });
    rail.addEventListener('pointermove', (e) => {
      if (!down) return;
      rail.scrollLeft = startScroll - (e.clientX - startX);
    });
    const up = (e) => {
      if (!down) return;
      down = false;
      rail.style.cursor = '';
      rail.style.scrollSnapType = '';
      if (e.pointerId != null && rail.hasPointerCapture?.(e.pointerId)) rail.releasePointerCapture(e.pointerId);
    };
    rail.addEventListener('pointerup', up);
    rail.addEventListener('pointercancel', up);

    // Vertical page scroll is deliberately NOT mapped onto the rail —
    // that would hijack the wheel, which this site never does.
  }

  /* ══════════════════════════════════════════════════════════
     BOOT
     ══════════════════════════════════════════════════════════ */
  // ScrollTriggers are rebuilt whenever ui.js re-renders (e.g. a language
  // switch replaces every node). Kill the previous batch first or they
  // pile up and fight over stale elements.
  let triggers = [];
  const register = (st) => { if (st) triggers.push(st); };

  function build() {
    const gsap = window.gsap;
    if (gsap && window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

    triggers.forEach((st) => st.kill());
    triggers = [];

    initReveals();
    initTimeline(gsap, register);
    initRail();

    if (gsap && window.ScrollTrigger) window.ScrollTrigger.refresh();
  }

  function boot() {
    // Only hide content for animation if we can actually observe it again.
    if (!reduced && 'IntersectionObserver' in window) {
      document.documentElement.classList.add('motion-ready');
      guardReveals();
    }

    initScrollRail();

    // Content is injected by ui.js — build after each render pass.
    document.addEventListener('site:rendered', () => {
      // Let the browser lay the new nodes out before measuring.
      requestAnimationFrame(() => requestAnimationFrame(build));
    });

    build();

    // Images arriving late move everything below them; measure again.
    window.addEventListener('load', () => {
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    }, { once: true });
  }

  // Deferred scripts run once the document is parsed — ui.js has already
  // rendered by now, so there is nothing to wait for.
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
