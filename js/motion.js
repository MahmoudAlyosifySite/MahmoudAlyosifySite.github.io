/* ============================================================
   Mahmoud Alyosify — Motion orchestration
   GSAP + ScrollTrigger + Lenis, with a canvas particle field.
   Bails out entirely on prefers-reduced-motion; falls back to
   IntersectionObserver reveals if the CDN never loads.
   ============================================================ */

(() => {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile  = window.matchMedia('(max-width: 767px)').matches;
  const finePtr = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

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
        en.target.style.setProperty('--d', Math.min(i * 70, 420) + 'ms');
        en.target.classList.add('is-in');
        revealIO.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    $$('[data-reveal]').forEach((el) => revealIO.observe(el));
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
     Scroll progress rail
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
     1 · HERO — split lines, layered parallax, particles
     ══════════════════════════════════════════════════════════ */
  function splitHeroLines() {
    $$('[data-split]').forEach((line) => {
      // applyI18n() rewrites textContent on language change, so re-split
      // whenever the character spans are gone rather than trusting a flag.
      if (line.querySelector('.ch')) return;

      const text = line.textContent;
      line.textContent = '';

      // Split per word first. Characters inside a word must not become wrap
      // opportunities, or narrow screens break words mid-way.
      let i = 0;
      text.split(/(\s+)/).forEach((chunk) => {
        if (!chunk) return;
        if (/^\s+$/.test(chunk)) {
          line.appendChild(document.createTextNode(' '));
          return;
        }
        const word = document.createElement('span');
        word.className = 'wd';
        if (document.documentElement.dir === 'rtl') {
          const span = document.createElement('span');
          span.className = 'ch';
          span.textContent = chunk;
          span.style.transitionDelay = (i++ * 28) + 'ms';
          word.appendChild(span);
        } else {
          [...chunk].forEach((ch) => {
            const span = document.createElement('span');
            span.className = 'ch';
            span.textContent = ch;
            span.style.transitionDelay = (i++ * 28) + 'ms';
            word.appendChild(span);
          });
        }
        line.appendChild(word);
      });
    });

    requestAnimationFrame(() => {
      $$('.hero__line .ch').forEach((ch) => ch.classList.add('is-in'));
    });
  }

  function initHeroParallax() {
    if (reduced) return;
    const stage = $('.hero__stage');
    const layers = $$('.hero__layer');
    if (!stage || !layers.length) return;

    let mx = 0, my = 0, tx = 0, ty = 0, sy = 0, raf = null;

    const onMove = (e) => {
      const r = window.innerWidth;
      mx = (e.clientX / r - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onScroll = () => {
      sy = Math.min(window.scrollY, window.innerHeight);
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const loop = () => {
      tx += (mx - tx) * 0.07;
      ty += (my - ty) * 0.07;
      layers.forEach((el) => {
        const d = parseFloat(el.dataset.depth) || 0.2;
        const px = tx * d * 26;
        const py = ty * d * 16 + sy * d * 0.22;
        el.style.transform = `translate3d(${px}px, ${py}px, 0)`;
      });
      raf = Math.abs(mx - tx) > 0.001 || Math.abs(my - ty) > 0.001
        ? requestAnimationFrame(loop) : null;
    };

    if (finePtr) window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initParticles() {
    const canvas = $('#hero-particles');
    if (!canvas || reduced) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    const COLORS = ['rgba(234,244,255,', 'rgba(177,75,216,', 'rgba(240,161,58,'];
    let dots = [], w = 0, h = 0, dpr = 1, raf = null, visible = true;

    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = mobile ? 34 : Math.round((w * h) / 26000);
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.14,
        vy: -(Math.random() * 0.22 + 0.04),
        a: Math.random() * 0.5 + 0.15,
        c: COLORS[(Math.random() * COLORS.length) | 0],
        tw: Math.random() * Math.PI * 2
      }));
    };

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.x += d.vx; d.y += d.vy; d.tw += 0.02;
        if (d.y < -6) { d.y = h + 6; d.x = Math.random() * w; }
        if (d.x < -6) d.x = w + 6;
        if (d.x > w + 6) d.x = -6;
        const alpha = d.a * (0.65 + 0.35 * Math.sin(d.tw));
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = d.c + alpha.toFixed(3) + ')';
        ctx.fill();
      }
      raf = visible ? requestAnimationFrame(frame) : null;
    };

    size();
    window.addEventListener('resize', size);
    frame();

    // Stop burning frames when the hero is off-screen or the tab is hidden.
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting && !document.hidden;
      if (visible && !raf) frame();
    }, { threshold: 0 });
    io.observe(canvas);

    document.addEventListener('visibilitychange', () => {
      visible = !document.hidden && canvas.getBoundingClientRect().bottom > 0;
      if (visible && !raf) frame();
    });
  }

  /* ══════════════════════════════════════════════════════════
     2 · ABOUT — words light up as you scroll through them
     ══════════════════════════════════════════════════════════ */
  function initWordReveal(gsap, register) {
    const lead = $('#about-lead');
    if (!lead || reduced) return;
    const words = $$('.w', lead);
    if (!words.length) return;

    if (gsap && window.ScrollTrigger) {
      // Scrub the scroll position onto how many words are lit.
      register(window.ScrollTrigger.create({
        trigger: lead,
        start: 'top 80%',
        end: 'bottom 60%',
        scrub: true,
        onUpdate: (self) => {
          const lit = Math.round(self.progress * words.length);
          words.forEach((w, i) => w.classList.toggle('lit', i < lit));
        }
      }));
    } else {
      const io = new IntersectionObserver(([en]) => {
        if (!en.isIntersecting) return;
        words.forEach((w, i) => setTimeout(() => w.classList.add('lit'), i * 28));
        io.disconnect();
      }, { threshold: 0.3 });
      io.observe(lead);
    }
  }

  /* ══════════════════════════════════════════════════════════
     3 · EXPERIENCE — the timeline draws itself
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
     4 · PROJECTS — 3D tilt + cursor-tracked glow
     ══════════════════════════════════════════════════════════ */
  function initTilt() {
    if (reduced || mobile || !finePtr) return;

    $$('[data-tilt]').forEach((card) => {
      if (card.dataset.tiltBound) return;
      card.dataset.tiltBound = '1';
      const glow = $('.pcard__glow', card);
      let raf = null, rx = 0, ry = 0;

      const onMove = (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry = (px - 0.5) * 7;
        rx = (0.5 - py) * 7;
        if (glow) { glow.style.left = (px * 100) + '%'; glow.style.top = (py * 100) + '%'; }
        if (!raf) raf = requestAnimationFrame(() => {
          card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
          raf = null;
        });
      };
      const reset = () => {
        card.classList.remove('is-tilting');
        card.style.transform = '';
      };

      card.addEventListener('mouseenter', () => card.classList.add('is-tilting'));
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', reset);
    });
  }

  /* ══════════════════════════════════════════════════════════
     5 · SKILLS — vertical scroll drives the horizontal rail
     ══════════════════════════════════════════════════════════ */
  function initRail(gsap, register) {
    const rail = $('#rail');
    const track = $('#rail-track');
    if (!rail || !track) return;

    // Pointer drag works on every device, motion preference or not.
    if (!rail.dataset.dragBound) {
      rail.dataset.dragBound = '1';
      let down = false, startX = 0, startScroll = 0;
      rail.addEventListener('pointerdown', (e) => {
        down = true; startX = e.clientX; startScroll = rail.scrollLeft;
        rail.setPointerCapture(e.pointerId);
        rail.style.cursor = 'grabbing';
      });
      rail.addEventListener('pointermove', (e) => {
        if (!down) return;
        rail.scrollLeft = startScroll - (e.clientX - startX);
      });
      const up = (e) => {
        down = false; rail.style.cursor = '';
        if (e.pointerId != null && rail.hasPointerCapture?.(e.pointerId)) rail.releasePointerCapture(e.pointerId);
      };
      rail.addEventListener('pointerup', up);
      rail.addEventListener('pointercancel', up);
    }

    // The rail scrolls horizontally on its own (drag, shift+wheel, trackpad,
    // touch). Vertical page scroll is deliberately NOT mapped onto it — that
    // would hijack the wheel and is exactly what we want to avoid.
  }

  /* ══════════════════════════════════════════════════════════
     6 · IMPACT — the ring draws with scroll
     ══════════════════════════════════════════════════════════ */
  function initRing(gsap, register) {
    const arc = $('.impact__ring-arc');
    if (!arc) return;
    const LEN = 2 * Math.PI * 104;
    arc.style.strokeDasharray = LEN;

    if (reduced) { arc.style.strokeDashoffset = LEN * 0.12; return; }

    if (gsap && window.ScrollTrigger) {
      const tw = gsap.fromTo(arc,
        { strokeDashoffset: LEN },
        {
          strokeDashoffset: LEN * 0.12,
          ease: 'none',
          scrollTrigger: { trigger: '#impact', start: 'top 75%', end: 'bottom 70%', scrub: 0.6 }
        });
      register(tw.scrollTrigger);
    } else {
      const io = new IntersectionObserver(([en]) => {
        if (!en.isIntersecting) return;
        arc.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(.16,1,.3,1)';
        arc.style.strokeDashoffset = LEN * 0.12;
        io.disconnect();
      }, { threshold: 0.4 });
      io.observe($('#impact'));
    }
  }

  /* ══════════════════════════════════════════════════════════
     8 · FAT FOOTER — the artwork rises into place
     ══════════════════════════════════════════════════════════ */
  function initFatFooter(gsap, register) {
    const ff = $('#fatfooter');
    const img = $('.fatfooter__img');
    if (!ff) return;

    if (!ff.dataset.ffBound) {
      ff.dataset.ffBound = '1';
      const io = new IntersectionObserver(([en]) => {
        ff.classList.toggle('is-in', en.isIntersecting);
      }, { threshold: 0.25 });
      io.observe(ff);
    }

    if (reduced || !img) return;

    if (gsap && window.ScrollTrigger) {
      const tw = gsap.fromTo(img,
        { yPercent: 18 },
        {
          yPercent: 0,
          ease: 'none',
          scrollTrigger: { trigger: ff, start: 'top bottom', end: 'bottom bottom', scrub: 0.7 }
        });
      register(tw.scrollTrigger);
    }
  }

  /* ══════════════════════════════════════════════════════════
     Magnetic buttons + custom cursor
     ══════════════════════════════════════════════════════════ */
  function initMagnetic() {
    if (reduced || !finePtr || mobile) return;
    $$('[data-magnetic]').forEach((el) => {
      if (el.dataset.magBound) return;
      el.dataset.magBound = '1';
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.22}px, ${y * 0.3}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  function initCursor() {
    if (reduced || !finePtr || window.innerWidth < 1024) return;
    const cur = $('.cursor');
    const dot = $('.cursor__dot');
    const ring = $('.cursor__ring');
    if (!cur) return;

    let x = 0, y = 0, rxp = 0, ryp = 0;
    window.addEventListener('mousemove', (e) => {
      x = e.clientX; y = e.clientY;
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    }, { passive: true });

    const loop = () => {
      rxp += (x - rxp) * 0.16;
      ryp += (y - ryp) * 0.16;
      ring.style.transform = `translate(${rxp}px, ${ryp}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    };
    loop();

    document.addEventListener('mouseover', (e) => {
      cur.classList.toggle('is-hot', !!e.target.closest('a, button, [data-tilt], .cert, input, textarea, select'));
    });
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

    splitHeroLines();
    initReveals();
    initWordReveal(gsap, register);
    initTimeline(gsap, register);
    initTilt();
    initRail(gsap, register);
    initRing(gsap, register);
    initFatFooter(gsap, register);
    initMagnetic();

    if (gsap && window.ScrollTrigger) window.ScrollTrigger.refresh();
  }

  function boot() {
    // Only hide content for animation if we can actually observe it again.
    if (!reduced && 'IntersectionObserver' in window) {
      document.documentElement.classList.add('motion-ready');
      guardReveals();
    }

    initScrollRail();
    initHeroParallax();
    initParticles();
    initCursor();

    // Content is injected by ui.js — build after each render pass.
    document.addEventListener('site:rendered', () => {
      // Let the browser lay the new nodes out before measuring.
      requestAnimationFrame(() => requestAnimationFrame(build));
    });

    build();

    // Idle FAB pulse until the visitor engages with the chatbot.
    const fab = document.getElementById('bot-fab');
    if (fab) {
      fab.classList.add('is-idle');
      fab.addEventListener('click', () => fab.classList.remove('is-idle'), { once: true });
    }
  }

  if (document.readyState === 'complete') boot();
  else window.addEventListener('load', boot);
})();
