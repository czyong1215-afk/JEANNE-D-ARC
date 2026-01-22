
const CACHE_NAME = 'jalter-ai-v4';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
});

self.addEventListener('fetch', (event) => {
  // 采用“网络优先，超时回退”策略
  event.respondWith(
    Promise.race([
      fetch(event.request),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
    ]).catch(() => caches.match(event.request))
  );
});
