const CACHE_NAME = 'flashex-shell-v3';
const APP_SHELL = [
  './',
  './index.html',
  './privacy-policy.html',
  './terms.html',
  './licenses.html',
  './style.css',
  './fonts/rP2Yp2ywxg089UriI5-g4vlH9VoD8Cmcqbu0-K4.woff2',
  './fonts/V8mDoQDjQSkFtoMM3T6r8E7mPbF4Cw.woff2',
  './app.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  if (event.request.url.includes('/api/') || event.request.url.includes('google-analytics')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        const copy = response.clone();
        if (response.ok && event.request.url.startsWith(self.location.origin)) {
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        return new Response('Offline — FlashEx shell is unavailable. Please reconnect to the internet and retry.', { status: 503, statusText: 'Offline' });
      });
    })
  );
});
