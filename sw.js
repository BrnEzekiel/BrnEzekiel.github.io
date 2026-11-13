// Offline-first cache for the portfolio. Bump V to refresh.
const V = 'v2';
const CORE = ['index.html', 'styles.css', 'app.js', 'hero3d.js', 'offline.html', 'banner.jpg', 'portrait.png'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(V).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    caches.match(e.request).then((hit) => {
      const net = fetch(e.request).then((res) => {
        if (res.ok) caches.open(V).then((c) => c.put(e.request, res.clone()));
        return res;
      }).catch(() => (e.request.mode === 'navigate' ? caches.match('offline.html') : undefined));
      return hit || net;
    })
  );
});
