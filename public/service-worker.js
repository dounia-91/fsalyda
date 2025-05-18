const CACHE_NAME = "fsalyda-cache-v1";
const urlsToCache = [
  "/",
  "/icon-192.png",
  "/icon-512.png",
  "/screenshot1.png",
  "/screenshot2.png",
  "/adminDashboard" // Ce chemin doit être statique et accessible directement
];

// Installation du service worker : cache les ressources essentielles
self.addEventListener("install", (event) => {
  self.skipWaiting(); // Prendre contrôle immédiatement après installation
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((error) => {
        console.error("Erreur lors de l'ajout au cache : ", error);
      });
    })
  );
});

// Activation du service worker : supprime les anciens caches
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
  return self.clients.claim(); // Prend le contrôle des pages sans rechargement
});

// Interception des requêtes réseau
self.addEventListener("fetch", (event) => {
  // On gère uniquement les requêtes GET et HTTP/HTTPS
  if (event.request.method !== "GET" || !event.request.url.startsWith("http")) {
    return;
  }

  // Pour les ressources statiques (icônes, screenshots), stratégie cache-first
  if (
    event.request.url.includes("icon-") ||
    event.request.url.includes("screenshot")
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
    );
  } else {
    // Pour les autres requêtes, stratégie network-first avec fallback cache
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Mise à jour du cache avec la nouvelle réponse
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => caches.match(event.request)) // Si offline, renvoyer la réponse du cache si possible
    );
  }
});

// Gestion des notifications push (si tu comptes les utiliser)
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "Notification reçue",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
  };

  event.waitUntil(
    self.registration.showNotification("Nouvelle notification", options)
  );
});

// Gestion du clic sur la notification : ouvre la page d'accueil
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
