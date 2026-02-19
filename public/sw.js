const CACHE_NAME = 'radio-impacto-digital-v1';
const BASE_PATH = '/radio-impacto/';

// Definimos una lista minimalista de recursos críticos para que la PWA sea instalable
const urlsToCache = [
  BASE_PATH,
  `${BASE_PATH}index.html`,
  `${BASE_PATH}manifest.json`,
  `${BASE_PATH}icon-192.png`,
  `${BASE_PATH}icon-512.png`
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        // Intentamos cargar lo básico. Si esto falla, el SW no se instala y la PWA no es instalable.
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Intercepta las peticiones
self.addEventListener('fetch', event => {
  // Solo interceptamos peticiones GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Estrategia: Cache first, fallback to network
        return response || fetch(event.request);
      })
  );
});

// Actualización del Service Worker (limpieza de cachés viejos)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
