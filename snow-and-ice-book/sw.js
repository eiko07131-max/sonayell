const CACHE = 'snow-and-ice-book-v1';
const ASSETS = [
  './', './index.html', './style.css', './reader.js', './manifest.webmanifest',
  './icons/snow-flower-192.png', './icons/snow-flower-512.png',
  './pages/01-cover.png', './pages/02-arrival.png', './pages/03-luru-pepe.png', './pages/04-snow-flower.png', './pages/05-dinner.png', './pages/06-map.png', './pages/07-waterway.png', './pages/08-repair.png', './pages/09-bloom.png', './pages/10-farewell.png', './pages/11-back-cover.png'
];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request))));
