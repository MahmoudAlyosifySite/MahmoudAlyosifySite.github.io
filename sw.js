/* ============================================================
   Service worker — makes every visit after the first one instant.

   Strategy
     · HTML          network-first  (you always get the latest page)
     · CSS / JS      stale-while-revalidate (instant, updates quietly)
     · images / data cache-first     (they never change in place —
                                      a new photo is a new filename)

   VERSION is stamped automatically by tools/stamp-sw.mjs (part of
   `npm run build`) from a hash of every file listed below — do not
   edit it by hand. Old caches are deleted on activate.
   ============================================================ */

const VERSION = 'ma-603a276953';
const SHELL = `shell-${VERSION}`;
const ASSETS = `assets-${VERSION}`;

/* Requested up front so the first repeat visit is already warm. */
const PRECACHE = [
  './',
  'index.html',
  'css/theme.css',
  'css/layout.css',
  'css/motion.css',
  'js/data.js',
  'js/i18n.js',
  'js/ui.js',
  'js/photo-gallery.js',
  'js/certificates.js',
  'js/motion.js',
  'data/certificates.json',
  'data/photo-gallery.json',
  'img/FatFooter-En.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(SHELL)
      // Individual failures must not abort the whole install.
      .then((c) => Promise.allSettled(PRECACHE.map((u) => c.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== SHELL && k !== ASSETS).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

const isImage = (url) =>
  /\.(webp|png|jpe?g|gif|avif|svg|ico)$/i.test(url.pathname);
const isData = (url) =>
  /\.json$/i.test(url.pathname);
const isCode = (url) =>
  /\.(css|js)$/i.test(url.pathname);

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Never touch other origins — API calls, fonts, analytics, the
  // visitor's own LLM provider. Those must go straight to the network.
  if (url.origin !== self.location.origin) return;

  // HTML: always try the network so content updates land immediately.
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(SHELL).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match('index.html')))
    );
    return;
  }

  // Images and data: cache-first. These are the heavy, immutable ones.
  if (isImage(url) || isData(url)) {
    event.respondWith(
      caches.match(request).then((hit) => hit || fetch(request).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(ASSETS).then((c) => c.put(request, copy));
        }
        return res;
      }))
    );
    return;
  }

  // CSS/JS: serve from cache instantly, refresh in the background.
  if (isCode(url)) {
    event.respondWith(
      caches.match(request).then((hit) => {
        const net = fetch(request).then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(SHELL).then((c) => c.put(request, copy));
          }
          return res;
        }).catch(() => hit);
        return hit || net;
      })
    );
  }
});

/* Let the page force an update after a deploy. */
self.addEventListener('message', (e) => {
  if (e.data === 'skip-waiting') self.skipWaiting();
});
