const CACHE_NAME = "fsalyda-cache-v1";
const urlsToCache = [
  "/",
  "/icon-192.png",
  "/icon-512.png",
  "/screenshot1.png",
  "/screenshot2.png",
];

// Installation
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)).then(() => self.skipWaiting())
  );
});

// Activation
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Interception des requêtes - stratégie cache d'abord, puis fetch
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Retourne la réponse en cache ou récupère en réseau
      return cachedResponse || fetch(event.request).catch(() => {
        // Optionnel : tu peux renvoyer une page de fallback si fetch échoue
        // return caches.match('/offline.html');
      });
    })
  );
});
