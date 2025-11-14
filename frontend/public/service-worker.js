/* Service Worker for Sheba Caregiver PWA */

const CACHE_NAME = "sheba-caregiver-v1";
const urlsToCache = ["/", "/index.html", "/src/main.jsx", "/src/index.css"];

// Install event - cache essential assets
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first strategy with offline fallback
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Handle API requests differently
  if (
    event.request.url.includes("/api/") ||
    event.request.url.includes("supabase")
  ) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone and cache successful responses
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Return offline error response
          return caches.match(event.request).then((response) => {
            if (response) {
              return response;
            }
            // Return offline page or placeholder
            return new Response(
              JSON.stringify({
                error: "offline",
                message:
                  "You are currently offline. Limited features available.",
              }),
              { status: 503, statusText: "Service Unavailable" }
            );
          });
        })
    );
  } else {
    // For static assets, use cache first strategy
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then((response) => {
            if (
              !response ||
              response.status !== 200 ||
              response.type === "error"
            ) {
              return response;
            }
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
            return response;
          })
          .catch(() => {
            // Return offline page for failed static requests
            return new Response("Offline - Resource not available", {
              status: 503,
              statusText: "Service Unavailable",
            });
          });
      })
    );
  }
});

// Handle push notifications (for future features)
self.addEventListener("push", (event) => {
  console.log("Push notification received:", event.data);
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: "/pwa-192x192.png",
      badge: "/pwa-192x192.png",
      tag: "sheba-notification",
      requireInteraction: false,
    };
    event.waitUntil(
      self.registration.showNotification("Sheba Caregiver", options)
    );
  }
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === "/" && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    })
  );
});
