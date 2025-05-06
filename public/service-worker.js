const CACHE_NAME = "fsalyda-cache-v1";
const urlsToCache = [
  "/",
  "/icon-192.png",
  "/icon-512.png",
  "/screenshot1.png",
  "/screenshot2.png",
  "/adminDashboard",
];

// Installation du service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((error) => {
        console.error("Erreur lors de l'ajout des URLs au cache : ", error);
      });
    })
  );
});

// Activation du service worker
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName).catch((error) => {
              console.error("Erreur lors de la suppression des anciens caches : ", error);
            });
          }
        })
      );
    })
  );
});

// Intercepter les requêtes et les servir depuis le cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Si trouvé dans le cache, retourne la réponse en cache
      }
      return fetch(event.request).catch((error) => {
        console.error("Erreur lors de la récupération du fichier : ", error);
        throw error;
      }); // Sinon, effectuer une requête réseau
    })
  );
});
