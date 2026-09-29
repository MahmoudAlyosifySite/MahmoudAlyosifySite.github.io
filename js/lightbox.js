/* ============================================================
   Pop-up picture — a document opens over the page, never in a
   new tab.

   Anything with  data-lightbox="<image url>"  opens it. Optional:
   data-lightbox-title, data-lightbox-alt, data-lightbox-caption.

   Built on <dialog>: the page behind goes inert, Escape closes,
   and focus goes back to whatever opened it. Press the picture
   (or the magnifier) to look at it larger; it then scrolls.
   ============================================================ */

(() => {
  'use strict';

  const t = (key, fallback) => {
    const v = window.MASite ? window.MASite.t(key) : '';
    return v && v !== key ? v : fallback;
  };

  let dlg = null;
  let els = null;
  let lastFocus = null;
  let scrollY = 0;

  /* ── The page behind keeps its place and its scrollbar width ── */
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
    // instant: the page's own smooth scrolling would animate it back from the top
    window.scrollTo({ top: scrollY, left: 0, behavior: 'instant' });
  }

  function build() {
    dlg = document.createElement('dialog');
    dlg.className = 'lb';
    dlg.setAttribute('aria-labelledby', 'lb-title');
    dlg.innerHTML = `
      <div class="lb__panel">
        <div class="lb__bar">
          <h2 class="lb__title" id="lb-title"></h2>
          <button class="lb__btn lb__zoom" type="button" aria-pressed="false">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"
              stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>
              <path d="M8.5 11h5"/><path d="M11 8.5v5" class="lb__v"/>
            </svg>
          </button>
          <button class="lb__btn lb__x" type="button" autofocus>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"
              stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>
        <div class="lb__stage"><img class="lb__img" alt="" decoding="async" /></div>
        <p class="lb__cap"></p>
      </div>`;
    document.body.appendChild(dlg);

    els = {
      title: dlg.querySelector('.lb__title'),
      zoom: dlg.querySelector('.lb__zoom'),
      x: dlg.querySelector('.lb__x'),
      stage: dlg.querySelector('.lb__stage'),
      img: dlg.querySelector('.lb__img'),
      cap: dlg.querySelector('.lb__cap'),
    };

    els.x.addEventListener('click', () => dlg.close());
    els.zoom.addEventListener('click', () => setZoom(!els.img.classList.contains('is-zoomed')));
    els.img.addEventListener('click', () => setZoom(!els.img.classList.contains('is-zoomed')));
    els.img.addEventListener('load', () => els.img.classList.add('is-ready'));
    els.img.addEventListener('error', () => els.img.classList.add('is-ready'));

    // The panel fills the dialog, so a press that lands on the dialog itself is a press on the backdrop.
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });

    // Escape and the buttons both end here.
    dlg.addEventListener('close', () => {
      unlockScroll();
      setZoom(false);
      els.img.removeAttribute('src');
      if (lastFocus && lastFocus.isConnected) lastFocus.focus();
    });
  }

  function setZoom(on) {
    els.img.classList.toggle('is-zoomed', on);
    els.zoom.setAttribute('aria-pressed', String(on));
    const label = on ? t('lightbox.zoomOut', 'Fit to screen') : t('lightbox.zoomIn', 'Zoom in');
    els.zoom.setAttribute('aria-label', label);
    els.zoom.title = label;
    if (on) { els.stage.scrollLeft = 0; els.stage.scrollTop = 0; }
  }

  function open({ src, title = '', alt = '', caption = '', trigger = null }) {
    if (!src) return;
    if (!dlg) build();

    lastFocus = trigger || document.activeElement;
    els.title.textContent = title;
    els.cap.textContent = caption;
    els.cap.hidden = !caption;
    const close = t('lightbox.close', 'Close');
    els.x.setAttribute('aria-label', close);
    els.x.title = close;

    setZoom(false);
    els.img.classList.remove('is-ready');
    els.img.alt = alt || title;
    els.img.src = src;

    dlg.showModal();
    lockScroll();
  }

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-lightbox]');
    if (!el) return;
    e.preventDefault();
    open({
      src: el.dataset.lightbox,
      title: el.dataset.lightboxTitle,
      alt: el.dataset.lightboxAlt,
      caption: el.dataset.lightboxCaption,
      trigger: el.matches('button, a') ? el : (el.closest('li') || el).querySelector('button.facts__open') || el,
    });
  });

  window.MALightbox = { open, close: () => dlg && dlg.open && dlg.close() };
})();
