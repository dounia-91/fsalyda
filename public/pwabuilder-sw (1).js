const CACHE = "pwabuilder-offline-page-v1";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const offlineFallbackPage = "offline.html";

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => {
      return cache.addAll([
        offlineFallbackPage,
        // Tu peux ajouter ici d’autres fichiers à mettre en cache au besoin
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

// Gestion de la navigation : fetch + fallback offline
workbox.routing.registerRoute(
  ({ request }) => request.mode === 'navigate',
  async ({ event }) => {
    try {
      const preloadResponse = await event.preloadResponse;
      if (preloadResponse) {
        return preloadResponse;
      }
      const networkResponse = await fetch(event.request);
      return networkResponse;
    } catch (error) {
      const cache = await caches.open(CACHE);
      const cachedResponse = await cache.match(offlineFallbackPage);
      return cachedResponse;
    }
  }
);

// Autres assets statiques si besoin (images, CSS, JS)
// Exemple : mettre en cache les fichiers JS et CSS avec stratégie cache-first
workbox.routing.registerRoute(
  /\.(?:js|css|png|jpg|jpeg|svg|woff2?)$/i,
  new workbox.strategies.CacheFirst({
    cacheName: 'static-resources',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
      }),
    ],
  })
);
