const CACHE = 'kkepik-v2';
const SHELL = ['./', './manifest.webmanifest', './icon.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Запросы к API всегда идут в сеть — свежие данные
  if (url.hostname === 'kkepik.rub1kub.ru') return;
  // Остальное — сначала кэш, потом сеть
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request))
  );
});