/* ============================================================
   Business card — the preview from business-card/, framed

   The card is drawn once, in business-card/index.html. Here it
   is shown with ?embed, which leaves only the two faces and the
   ten thoughts. The frame reports its height (bcard:size) and
   is told when the site's theme changes (bcard:theme): ink on
   the dark theme, paper on the light one.
   ============================================================ */

(() => {
  'use strict';

  const frame = document.getElementById('bcard');
  if (!frame) return;

  const root = document.documentElement;
  const theme = () => (root.getAttribute('data-theme') === 'light' ? 'paper' : 'ink');
  const tell = () => frame.contentWindow?.postMessage({ type: 'bcard:theme', theme: theme() }, '*');

  window.addEventListener('message', (e) => {
    if (e.source !== frame.contentWindow || !e.data || e.data.type !== 'bcard:size') return;
    const h = Number(e.data.height);
    if (h > 0) frame.style.height = `${h}px`;
  });

  // On load as well: the frame read the theme for itself on its first
  // paint, but the visitor may have switched since.
  frame.addEventListener('load', tell);
  new MutationObserver(tell).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
})();
