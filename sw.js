// Service Worker for PWA
const CACHE_NAME = 'md-to-docx-v1';
const urlsToCache = [
    '/',
    '/manifest.json',
    '/android-launchericon-192-192.png',
    '/android-launchericon-512-512.png',
    '/AppImages (1)/ios/180.png',
    '/AppImages (1)/ios/152.png',
    '/AppImages (1)/ios/167.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve from cache if available
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});