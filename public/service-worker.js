const CACHE_NAME = "fsalyda-cache-v1";
const urlsToCache = [
  "/",
  "/icon-192.png",
  "/icon-512.png",
  "/screenshot1.png",
  "/screenshot2.png",
  "/adminDashboard" // Ce chemin doit être statique et accessible directement
];

// Installation du service worker
self.addEventListener("install", (event) => {
  self.skipWaiting(); // Active immédiatement le SW
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
  return self.clients.claim(); // Prend le contrôle sans rechargement
});

// Interception des requêtes réseau
self.addEventListener("fetch", (event) => {
  // Ignorer les méthodes non-GET ou les requêtes non-HTTP
  if (event.request.method !== "GET" || !event.request.url.startsWith("http")) {
    return;
  }

  // Pour des ressources statiques (comme les icônes et les captures d'écran), utiliser une stratégie cache-first
  if (event.request.url.includes('icon-') || event.request.url.includes('screenshot')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
    );
  } else {
    // Pour les autres requêtes, utiliser la stratégie network-first
    event.respondWith(
      fetch(event.request).then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      }).catch(() => caches.match(event.request))
    );
  }
});

// Gestion des notifications push
self.addEventListener("push", (event) => {
  const options = {
    body: event.data.text(),
    icon: "/icon-192.png",
    badge: "/icon-192.png",
  };

  event.waitUntil(
    self.registration.showNotification("Nouvelle notification", options)
  );
});

// Gestion du clic sur la notification
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("/") // Ouvre la page d'accueil ou la page spécifique
  );
});

