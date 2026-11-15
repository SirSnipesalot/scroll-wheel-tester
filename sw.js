// Scroll Wheel Tester: offline copy.
// Copyright (C) 2026 SirSnipesalot. Licensed under the GNU General Public License, version 3.
//
// Keeps the page, its icons and its two fonts in a cache so the tester still opens with no
// network. Bump CACHE when the files change so old copies are thrown away.
const CACHE = 'scroll-wheel-tester-v1';
const CORE = ['./', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const isFont = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (url.origin !== self.location.origin && !isFont) return;

  // The page itself: network first, so a new version shows up at once; the cached copy when offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put('./', copy));
          }
          return response;
        })
        .catch(() => caches.match('./'))
    );
    return;
  }

  // Everything else: the cached copy if there is one, otherwise fetch it and keep it.
  event.respondWith(
    caches.match(request).then((hit) => hit || fetch(request).then((response) => {
      if (response.ok || response.type === 'opaque') {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(request, copy));
      }
      return response;
    }))
  );
});
