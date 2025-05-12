const CACHE_NAME = "fsalyda-cache-v1";
const urlsToCache = [
  "/",
  "/icon-192.png",
  "/icon-512.png",
  "/screenshot1.png",
  "/screenshot2.png",
  "/adminDashboard", // ce chemin doit être statique
];

// Installation du service worker
self.addEventListener("install", (event) => {
  self.skipWaiting(); // active immédiatement le SW
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((error) => {
        console.error("Erreur lors de l'ajout au cache : ", error);
      });
    })
  );
});

// Activation du service worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
  return self.clients.claim(); // prend le contrôle sans rechargement
});

// Intercepter les requêtes réseau
self.addEventListener("fetch", (event) => {
  // Ignorer les méthodes non-GET ou requêtes non HTTP
  if (
    event.request.method !== "GET" ||
    !event.request.url.startsWith("http")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((response) => {
          // Mise en cache dynamique
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch((error) => {
          console.error("Erreur fetch :", error);
          throw error;
        });
    })
  );
});
