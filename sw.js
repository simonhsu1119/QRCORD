
// Minimal service worker (cache bust vQC1)
const CACHE_NAME = 'qr-qrcord-vQC1';
const CORE = ['/', '/index.html'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE)).then(self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k!==CACHE_NAME).map(k => caches.delete(k)))).then(self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const req = event.request;
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(resp => {
      if(req.method==='GET' && resp.status===200 && !req.url.includes('chrome-extension')){
        const clone = resp.clone();
        caches.open(CACHE_NAME).then(c => c.put(req, clone));
      }
      return resp;
    }).catch(()=>cached))
  );
});
