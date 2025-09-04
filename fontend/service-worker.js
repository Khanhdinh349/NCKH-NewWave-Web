// frontend/service-worker.js
const CACHE_NAME = 'plantcare-v1';

// Liệt kê các asset quan trọng để dùng offline.
// Cứ thêm file mới ở /frontend vào đây (css/js/html chính).
const PRECACHE = [
  './',
  './index.html',
  './main.css',

  './login.html',
  './login.css',
  './login.js',

  './signup.html',
  './signup.css',
  './signup.js',

  './plant.html',
  './plant.css',
  './plant.js'
];

// ===== Install: precache =====
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

// ===== Activate: cleanup old caches =====
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ===== Fetch strategy =====
// - HTML/navigation: network-first (fallback cache khi offline)
// - CSS/JS/Image: cache-first (fallback network)
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Với navigation/HTML
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          // Lưu bản mới vào cache
          caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
    );
    return;
  }

  // Với static assets: CSS/JS/IMG → cache-first
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        // Lưu vào cache cho lần sau
        const copy = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(req, copy));
        return res;
      });
    })
  );
});
