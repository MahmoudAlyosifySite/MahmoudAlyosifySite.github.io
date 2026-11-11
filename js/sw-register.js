/* Repeat visits load from the local cache (sw.js). Only registered on a
   secure origin; a failure here must never affect the page. */
if ('serviceWorker' in navigator &&
    (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
  window.addEventListener('load', () => {
    // updateViaCache:'none' — the worker script itself must never come
    // from the HTTP cache, or a deploy can be invisible for as long as
    // the host's max-age (GitHub Pages sends 10 minutes).
    navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' })
      .then((reg) => reg.update())
      .catch(() => { /* offline caching unavailable */ });
  });
  // A new deploy takes over → refresh once so nobody is left looking at
  // last week's CSS. The flag stops this becoming a reload loop.
  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading) return;
    reloading = true;
    location.reload();
  });
}
