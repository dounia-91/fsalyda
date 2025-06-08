const CACHE_NAME = "fsalyda-cache-v1";
const urlsToCache = [
  "/",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/screenshot1.png",
  "/screenshot2.png",
  "/adminDashboard"
  // "/offline.html" // si tu crées une page hors-ligne dédiée
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(urlsToCache).catch((error) => {
        console.error("Erreur lors de l'ajout au cache : ", error);
      })
    )
  );
});

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
  return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || !event.request.url.startsWith("http")) {
    return;
  }

  if (
    event.request.url.includes("icon-") ||
    event.request.url.includes("screenshot") ||
    event.request.url.includes("manifest")
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
    );
  } else {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (
            response &&
            response.status === 200 &&
            response.type === "basic"
          ) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, response.clone()).catch((e) => {
                console.warn("Erreur cache.put", e);
              });
            });
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  }
});

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

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
