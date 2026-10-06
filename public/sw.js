/**
 * Minimal service worker — exists only so the site can be "Added to Home
 * Screen" as a real app (Android/Chrome requires a fetch-handling SW to
 * offer the install prompt). It is deliberately conservative:
 *
 *  - Hashed build assets (/assets/…, filenames are content-hashed by Vite,
 *    so a given URL's content never changes) → cache-first, for a fast
 *    offline-tolerant shell.
 *  - Everything else — the HTML page, and importantly every /api/* call —
 *    goes straight to the network, never cached. Products, stock, prices
 *    and the admin session must always be live; a cached copy of any of
 *    those would be actively wrong.
 */
const CACHE = 'rb-assets-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith('/assets/')) {
    return; // let the browser handle it normally — no caching
  }

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const hit = await cache.match(request);
      if (hit) return hit;
      const res = await fetch(request);
      if (res.ok) cache.put(request, res.clone());
      return res;
    })
  );
});
