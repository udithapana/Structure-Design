// Regen Structure BOQ – offline cache for the app shell (GitHub Pages)
const CACHE = 'regen-structure-boq-v5';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
  .then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // network first, fall back to cache (keeps the app current when online, usable on site when offline)
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone();
      if (r.ok && (e.request.url.startsWith(self.location.origin) || /cdnjs|jsdelivr|fonts\.g/.test(e.request.url))) caches.open(CACHE).then(c => c.put(e.request, copy));
      return r; }).catch(() => caches.match(e.request).then(m => m || caches.match('./index.html'))));
});
