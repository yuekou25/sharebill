const CACHE_NAME = 'sharebill-v2';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll([
      './',
      './index.html',
    ])),
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // Có mạng -> Ưu tiên tải bản web mới nhất và lưu đè vào Cache
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Không có mạng -> Lấy bản cũ trong Cache ra dùng Offline
        return caches.match(e.request);
      })
  );
});
