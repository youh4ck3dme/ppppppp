const CACHE_NAME = 'papi-hair-design-v1.1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/assets/logo.webp',
  '/assets/og-image.jpg',
  '/assets/hero.webp',
  '/assets/robert-papacun-portrait.jpg',
  '/assets/papi-ig-1.jpg',
  '/assets/papi-ig-2.jpg',
  '/assets/papi-ig-3.jpg',
  '/assets/papi-ig-4.jpg',
  '/manifest.json'
];

// Install event: cache all critical assets.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Pre-caching offline assets');
        // Use addAll with a catch block to handle potential failures gracefully,
        // especially for cross-origin resources which might fail if not properly configured.
        const cachePromises = URLS_TO_CACHE.map(urlToCache => {
            return cache.add(urlToCache).catch(err => {
                console.warn(`[ServiceWorker] Failed to cache ${urlToCache}:`, err);
            });
        });
        return Promise.all(cachePromises);
      })
  );
});

// Activate event: clean up old caches.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log(`[ServiceWorker] Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event: serve from cache first, then fall back to network.
self.addEventListener('fetch', event => {
    // Only handle GET requests.
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            // If we have a cached response, return it.
            if (cachedResponse) {
                return cachedResponse;
            }

            // Otherwise, fetch from the network.
            return fetch(event.request).then(networkResponse => {
                // Clone the response to cache it.
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseToCache);
                });
                return networkResponse;
            }).catch(error => {
                console.error('[ServiceWorker] Fetch failed:', error);
                // Here you could return a fallback offline page if you have one cached.
                // For example: return caches.match('/offline.html');
            });
        })
    );
});