/* ============================================================
   Certificates — five categories, in-page gallery

   Everything is driven by data/certificates.json, which is
   generated from the Certificates/ folders by:

       node tools/build-certificates.mjs

   Add a file to a folder, re-run that, and it appears here.
   No markup changes needed, ever.
   ============================================================ */

(() => {
  'use strict';

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let manifest = null;
  let cat = null;      // active category
  let idx = 0;         // active certificate within the category
  let lastFocus = null;

  const L = () => (window.MASite ? window.MASite.lang : 'en');
  const t = (k, fallback) => (window.MASite ? window.MASite.t(k) : '') || fallback;
  const loc = (v) => (v && typeof v === 'object' ? (v[L()] ?? v.en) : v);

  /* Category icons, matching the site's line-art style. */
  const ICON = {
    coursera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M12 3L2 8l10 5 10-5-10-5z"/><path d="M5 10.5V16c0 1.7 3.1 3 7 3s7-1.3 7-3v-5.5"/></svg>',
    trophy:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3"/><path d="M10 14v3H8v3h8v-3h-2v-3"/></svg>',
    people:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 6.5a2.8 2.8 0 0 1 0 5.4M18 20a6 6 0 0 0-3-5.2"/></svg>',
    code:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 8L4 12l4.5 4M15.5 8L20 12l-4.5 4M13.5 5l-3 14"/></svg>',
    doc:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>'
  };

  const PDF_GLYPH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z"/><path d="M14 3v5h5"/><text x="12" y="17.5" font-size="6.5" font-family="monospace" text-anchor="middle" fill="currentColor" stroke="none">PDF</text></svg>';

  /* Mobile browsers routinely refuse to render a PDF inside an iframe, so we
     offer a proper "open" affordance there instead of an empty grey box. */
  const canEmbedPdf = () => window.matchMedia('(min-width: 861px)').matches;

  /** Arabic counts don't pluralise like English: 1 singular, 2 dual,
      3–10 plural, 11+ back to singular. */
  function countLabel(n) {
    if (L() !== 'ar') return n === 1 ? t('certs.one', 'certificate') : t('certs.many', 'certificates');
    if (n === 1) return 'شهادة';
    if (n === 2) return 'شهادتان';
    if (n >= 3 && n <= 10) return 'شهادات';
    return 'شهادة';
  }

  /* ══════════════════════════════════════════════════════════
     CATEGORY CARDS
     ══════════════════════════════════════════════════════════ */
  function renderCategories() {
    const host = $('#cert-cats');
    if (!host || !manifest) return;

    host.innerHTML = manifest.categories.map((c) => {
      const label = esc(loc(c.name));
      const blurb = esc(loc(c.blurb));
      const n = c.count;
      const unit = countLabel(n);

      return `
      <button class="cert-cat" type="button" data-cat="${c.id}" data-reveal
              ${n === 0 ? 'disabled aria-disabled="true"' : ''}>
        <span class="cert-cat__icon" aria-hidden="true">${ICON[c.icon] || ICON.doc}</span>
        <span class="cert-cat__body">
          <span class="cert-cat__name">${label}</span>
          <span class="cert-cat__blurb">${blurb}</span>
        </span>
        <span class="cert-cat__foot">
          <span class="cert-cat__count mono">${n} ${esc(unit)}</span>
          <span class="cert-cat__go" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13M13 6l6 6-6 6"/></svg>
          </span>
        </span>
      </button>`;
    }).join('');

    // Hand the new nodes to the shared reveal observer.
    document.dispatchEvent(new CustomEvent('site:rendered'));
  }

  /* ══════════════════════════════════════════════════════════
     GALLERY
     ══════════════════════════════════════════════════════════ */
  const els = {};

  function cacheEls() {
    els.gal = $('#gal');
    els.catName = $('#gal-cat');
    els.count = $('#gal-count');
    els.viewer = $('#gal-viewer');
    els.title = $('#gal-title');
    els.issuer = $('#gal-issuer');
    els.actions = $('#gal-actions');
    els.strip = $('#gal-strip');
    els.prev = $('#gal-prev');
    els.next = $('#gal-next');
  }

  function item() { return cat ? cat.items[idx] : null; }

  /** A Coursera search for the exact title — an official URL that cannot
      point at the wrong course. An explicit `course` override wins. */
  function courseLink(it) {
    if (it.course) return it.course;
    if (cat && cat.id === 'coursera') {
      return 'https://www.coursera.org/search?query=' + encodeURIComponent(it.title);
    }
    return null;
  }

  function renderViewer() {
    const it = item();
    if (!it) return;

    els.viewer.replaceChildren();

    if (it.type === 'image') {
      const wrap = document.createElement('div');
      wrap.className = 'gal__img-wrap';

      const img = document.createElement('img');
      img.className = 'gal__img';
      img.src = it.src;
      img.alt = it.title;
      img.decoding = 'async';
      img.addEventListener('load', () => wrap.classList.add('is-ready'), { once: true });
      img.addEventListener('error', () => {
        wrap.classList.add('is-ready');
        wrap.replaceChildren(fallbackCard(it));
      }, { once: true });

      wrap.appendChild(img);
      els.viewer.appendChild(wrap);

    } else if (canEmbedPdf()) {
      const frame = document.createElement('iframe');
      frame.className = 'gal__pdf';
      frame.src = it.src + '#view=FitH&toolbar=1';
      frame.title = it.title;
      frame.loading = 'lazy';
      els.viewer.appendChild(frame);

    } else {
      els.viewer.appendChild(fallbackCard(it));
    }

    // Warm the neighbours so prev/next feel instant.
    [idx - 1, idx + 1].forEach((i) => {
      const n = cat.items[(i + cat.items.length) % cat.items.length];
      if (n && n.type === 'image') { const p = new Image(); p.src = n.src; }
    });
  }

  /** Shown for PDFs on small screens, and for anything that fails to load. */
  function fallbackCard(it) {
    const card = document.createElement('div');
    card.className = 'gal__fallback';

    const glyph = document.createElement('span');
    glyph.className = 'gal__fallback-glyph';
    glyph.innerHTML = PDF_GLYPH;

    const name = document.createElement('p');
    name.className = 'gal__fallback-name';
    name.textContent = it.title;

    const a = document.createElement('a');
    a.className = 'btn btn--primary';
    a.href = it.original || it.src;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = t('gal.openPdf', 'Open certificate');

    card.append(glyph, name, a);
    return card;
  }

  function renderMeta() {
    const it = item();
    if (!it) return;

    els.title.textContent = it.title;

    const bits = [];
    if (it.issuer) bits.push(it.issuer);
    if (it.year) bits.push(it.year);
    els.issuer.textContent = bits.join(' · ');
    els.issuer.hidden = bits.length === 0;

    els.count.textContent = `${idx + 1} / ${cat.items.length}`;

    // Actions
    els.actions.replaceChildren();

    const open = document.createElement('a');
    open.className = 'btn btn--ghost btn--sm';
    // Always the untouched original — the gallery only ever showed a
    // downscaled copy.
    open.href = it.original || it.src;
    open.target = '_blank';
    open.rel = 'noopener';
    open.textContent = it.type === 'pdf'
      ? t('gal.openPdf', 'Open PDF')
      : t('gal.openFull', 'Open full size');
    els.actions.appendChild(open);

    if (it.verify) {
      const v = document.createElement('a');
      v.className = 'btn btn--ghost btn--sm';
      v.href = it.verify;
      v.target = '_blank';
      v.rel = 'noopener';
      v.textContent = t('gal.verify', 'Verify');
      els.actions.appendChild(v);
    }

    const course = courseLink(it);
    if (course) {
      const c = document.createElement('a');
      c.className = 'btn btn--primary btn--sm';
      c.href = course;
      c.target = '_blank';
      c.rel = 'noopener';
      // Non-course items (a forum, a programme page) can label their own link.
      c.textContent = it.courseLabel || t('gal.course', 'View course');
      els.actions.appendChild(c);
    }

    const single = cat.items.length < 2;
    els.prev.hidden = single;
    els.next.hidden = single;
  }

  function renderStrip() {
    els.strip.replaceChildren();
    if (cat.items.length < 2) { els.strip.hidden = true; return; }
    els.strip.hidden = false;

    cat.items.forEach((it, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'gal__thumb' + (i === idx ? ' is-on' : '');
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', String(i === idx));
      b.title = it.title;

      if (it.type === 'image') {
        const im = document.createElement('img');
        im.src = it.thumb || it.src;   // small derivative, not the full image
        im.alt = '';
        im.loading = 'lazy';
        im.decoding = 'async';
        b.appendChild(im);
      } else {
        const g = document.createElement('span');
        g.className = 'gal__thumb-pdf';
        g.innerHTML = PDF_GLYPH;
        b.appendChild(g);
      }

      const n = document.createElement('span');
      n.className = 'gal__thumb-n';
      n.textContent = String(i + 1);
      b.appendChild(n);

      b.addEventListener('click', () => go(i));
      els.strip.appendChild(b);
    });
  }

  function syncStrip() {
    $$('.gal__thumb', els.strip).forEach((b, i) => {
      const on = i === idx;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-selected', String(on));
      if (on) b.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  function go(i) {
    if (!cat) return;
    const n = cat.items.length;
    idx = ((i % n) + n) % n;
    renderViewer();
    renderMeta();
    syncStrip();
  }

  /* ── Scroll lock: only while the gallery is open ──────────
     The page keeps its scrollbar width so nothing shifts, and
     the lock is removed the moment the gallery closes.        */
  let scrollY = 0;
  function lockScroll() {
    scrollY = window.scrollY;
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    if (sbw > 0) document.body.style.paddingRight = sbw + 'px';
  }
  function unlockScroll() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.paddingRight = '';
    window.scrollTo(0, scrollY);
  }

  function open(catId, startIndex = 0) {
    cat = manifest.categories.find((c) => c.id === catId);
    if (!cat || !cat.items.length) return;

    lastFocus = document.activeElement;
    idx = startIndex;

    els.catName.textContent = loc(cat.name);
    renderStrip();
    go(idx);

    els.gal.hidden = false;
    lockScroll();
    requestAnimationFrame(() => els.gal.classList.add('is-open'));
    $('#gal-close').focus();
  }

  function close() {
    els.gal.classList.remove('is-open');
    unlockScroll();
    const done = () => {
      els.gal.hidden = true;
      els.viewer.replaceChildren();   // drop the iframe / big image
      cat = null;
    };
    if (reduced) done(); else setTimeout(done, 260);
    if (lastFocus && lastFocus.isConnected) lastFocus.focus();
  }

  const isOpen = () => els.gal && !els.gal.hidden;

  function trapFocus(e) {
    if (e.key !== 'Tab' || !isOpen()) return;
    const list = $$('button:not([hidden]):not([disabled]), a[href]', els.gal)
      .filter((el) => el.offsetParent !== null);
    if (!list.length) return;
    const first = list[0];
    const last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ══════════════════════════════════════════════════════════
     WIRING
     ══════════════════════════════════════════════════════════ */
  function wire() {
    cacheEls();

    document.addEventListener('click', (e) => {
      const card = e.target.closest('.cert-cat');
      if (card && !card.disabled) { open(card.dataset.cat); return; }
      if (e.target.closest('[data-gal-close]')) close();
    });

    els.prev.addEventListener('click', () => go(idx - 1));
    els.next.addEventListener('click', () => go(idx + 1));

    document.addEventListener('keydown', (e) => {
      if (!isOpen()) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); go(idx + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx - 1); }
      else if (e.key === 'Home') { e.preventDefault(); go(0); }
      else if (e.key === 'End') { e.preventDefault(); go(cat.items.length - 1); }
      else trapFocus(e);
    });

    // Swipe between certificates on touch devices.
    let x0 = null, y0 = null;
    els.viewer.addEventListener('touchstart', (e) => {
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
    }, { passive: true });
    els.viewer.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      const dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.6) go(idx + (dx < 0 ? 1 : -1));
      x0 = y0 = null;
    }, { passive: true });

    // Re-render on language switch and on the desktop/mobile PDF boundary.
    document.addEventListener('site:lang', () => {
      renderCategories();
      if (isOpen()) { els.catName.textContent = loc(cat.name); renderMeta(); }
    });
    window.matchMedia('(min-width: 861px)').addEventListener('change', () => {
      if (isOpen()) renderViewer();
    });
  }

  async function boot() {
    wire();
    try {
      const res = await fetch('data/certificates.json', { cache: 'no-cache' });
      if (!res.ok) throw new Error('manifest unavailable');
      manifest = await res.json();
      renderCategories();
    } catch (_) {
      const host = $('#cert-cats');
      if (host) {
        host.innerHTML =
          `<p class="lead">${esc(t('certs.err', 'Certificates could not be loaded right now.'))}</p>`;
      }
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  window.MACerts = { open, close };
})();
