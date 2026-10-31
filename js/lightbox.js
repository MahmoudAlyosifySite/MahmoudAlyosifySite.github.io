/* ============================================================
   Pop-up picture — a document opens over the page, never in a
   new tab.

   Anything with  data-lightbox="<image url>"  opens it. Optional:
   data-lightbox-title, data-lightbox-alt, data-lightbox-caption,
   and data-lightbox-translation — a JSON reading of a document in
   another language, laid over each printed line where it stands
   ({ size: [w, h], lines: [{ b: [x, y, w, h], fs, bg, t, k }] },
   all in the picture's own pixels). A "Translate" button then
   shows in the bar.

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
  let reading = null;     // the translation of the picture now open, if it has one
  let fitted = false;

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
          <button class="lb__tr" type="button" aria-pressed="false" hidden>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7"
              stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M3 5h9M7.5 3v2M5 5c.6 3.3 2.9 6 6 7.3"/><path d="M10.5 5c-.7 3.8-3.4 7-7 8.3"/>
              <path d="M12.5 21l4-9.5 4 9.5M14 17.6h5"/>
            </svg>
            <span class="lb__tr-long"></span><span class="lb__tr-short"></span>
          </button>
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
        <div class="lb__stage">
          <div class="lb__doc">
            <img class="lb__img" alt="" decoding="async" />
            <div class="lb__read" lang="en" dir="ltr" aria-hidden="true"></div>
          </div>
        </div>
        <p class="lb__cap"></p>
      </div>`;
    document.body.appendChild(dlg);

    els = {
      title: dlg.querySelector('.lb__title'),
      tr: dlg.querySelector('.lb__tr'),
      trLong: dlg.querySelector('.lb__tr-long'),
      trShort: dlg.querySelector('.lb__tr-short'),
      zoom: dlg.querySelector('.lb__zoom'),
      x: dlg.querySelector('.lb__x'),
      stage: dlg.querySelector('.lb__stage'),
      doc: dlg.querySelector('.lb__doc'),
      img: dlg.querySelector('.lb__img'),
      read: dlg.querySelector('.lb__read'),
      cap: dlg.querySelector('.lb__cap'),
    };

    els.x.addEventListener('click', () => dlg.close());
    els.zoom.addEventListener('click', () => setZoom(!els.doc.classList.contains('is-zoomed')));
    els.doc.addEventListener('click', () => setZoom(!els.doc.classList.contains('is-zoomed')));
    els.tr.addEventListener('click', () => setReading(els.tr.getAttribute('aria-pressed') !== 'true'));
    els.img.addEventListener('load', ready);
    els.img.addEventListener('error', () => els.doc.classList.add('is-ready'));

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

  /* The frame takes the picture's own proportions, so whatever is laid
     over it lands where it belongs at every size. */
  function ready() {
    const { naturalWidth: w, naturalHeight: h } = els.img;
    if (w && h) {
      els.doc.style.setProperty('--ar', String(w / h));
      els.doc.style.setProperty('--nw', w + 'px');
    }
    els.doc.classList.add('is-ready');
    if (reading) requestAnimationFrame(fit);
  }

  function setZoom(on) {
    els.doc.classList.toggle('is-zoomed', on);
    els.zoom.setAttribute('aria-pressed', String(on));
    const label = on ? t('lightbox.zoomOut', 'Fit to screen') : t('lightbox.zoomIn', 'Zoom in');
    els.zoom.setAttribute('aria-label', label);
    els.zoom.title = label;
    if (on) { els.stage.scrollLeft = 0; els.stage.scrollTop = 0; }
  }

  /* ── The translation, laid over the original ───────────────── */
  function lay(tr) {
    const [W, H] = tr.size;
    const pct = (v, of) => (v / of * 100).toFixed(3) + '%';
    els.read.innerHTML = '';
    tr.lines.forEach((line, i) => {
      const [x, y, w, h] = line.b;
      const el = document.createElement('span');
      el.className = 'lb__line' + (line.k ? ` lb__line--${line.k}` : '');
      el.textContent = line.t;
      el.style.cssText = `left:${pct(x, W)};top:${pct(y, H)};width:${pct(w, W)};height:${pct(h, H)};`
        + `--bg:${line.bg || '#e2dfd7'};--i:${i}`;
      // Type is sized against the frame's width (cqw), so it scales with the picture.
      el.dataset.fs = String((line.fs || 20) / W * 100);
      el.style.fontSize = el.dataset.fs + 'cqw';
      els.read.appendChild(el);
    });
    fitted = false;
  }

  /* A line that runs longer than the Arabic it covers is set a little
     smaller until it fits. The type scales with the frame, so this is
     done once, at whatever size the picture first shows. */
  function fit() {
    if (fitted || !els.doc.classList.contains('is-ready') || !els.doc.clientWidth) return;
    els.read.querySelectorAll('.lb__line').forEach((el) => {
      let fs = parseFloat(el.dataset.fs);
      const min = fs * 0.55;
      while ((el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1) && fs > min) {
        fs *= 0.94;
        el.style.fontSize = fs.toFixed(4) + 'cqw';
      }
    });
    fitted = true;
  }

  function setReading(on) {
    on = Boolean(on && reading);
    els.doc.classList.toggle('is-read', on);
    els.read.setAttribute('aria-hidden', String(!on));
    els.tr.setAttribute('aria-pressed', String(on));
    els.tr.classList.remove('is-new');
    const label = on ? t('lightbox.original', 'Show the Arabic original') : t('lightbox.translate', 'Translate to English');
    els.tr.setAttribute('aria-label', label);
    els.tr.title = label;
    els.trLong.textContent = label;
    els.trShort.textContent = on ? t('lightbox.originalShort', 'Original') : t('lightbox.translateShort', 'English');
    els.cap.textContent = on && els.cap.dataset.base
      ? `${els.cap.dataset.base} ${t('lightbox.trNote', '· English translation laid over the original, for reference.')}`
      : els.cap.dataset.base || '';
    if (on) { fit(); els.doc.classList.remove('is-swept'); void els.doc.offsetWidth; els.doc.classList.add('is-swept'); }
  }

  function open({ src, title = '', alt = '', caption = '', translation = null, trigger = null }) {
    if (!src) return;
    if (!dlg) build();

    lastFocus = trigger || document.activeElement;
    els.title.textContent = title;
    els.cap.dataset.base = caption;
    els.cap.textContent = caption;
    els.cap.hidden = !caption;
    const close = t('lightbox.close', 'Close');
    els.x.setAttribute('aria-label', close);
    els.x.title = close;

    reading = null;
    try { reading = translation ? JSON.parse(translation) : null; } catch (e) { reading = null; }
    els.tr.hidden = !reading;
    els.read.innerHTML = '';
    if (reading) { lay(reading); els.tr.classList.add('is-new'); }
    setReading(false);

    setZoom(false);
    els.doc.classList.remove('is-ready', 'is-swept');
    els.img.alt = alt || title;
    els.img.src = src;
    if (els.img.complete && els.img.naturalWidth) ready();

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
      translation: el.dataset.lightboxTranslation,
      trigger: el.matches('button, a') ? el : (el.closest('li') || el).querySelector('button.facts__open') || el,
    });
  });

  window.MALightbox = { open, close: () => dlg && dlg.open && dlg.close() };
})();
