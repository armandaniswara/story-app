// src/sw.js

import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate, CacheFirst } from "workbox-strategies"; // Pastikan 'CacheFirst' diimpor
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration"; // Pastikan 'ExpirationPlugin' diimpor

// (1) Kriteria 3 (Basic): Precache App Shell
precacheAndRoute(self.__WB_MANIFEST);

// (2) Kriteria 3 (Advance): Runtime Caching untuk API
// (INI SUDAH DIPERBAIKI)
registerRoute(
  ({ url }) => url.href.startsWith("https://story-api.dicoding.dev/v1/stories"),
  new StaleWhileRevalidate({
    cacheName: "story-api-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// (3) (BARU & PENTING) Kriteria 3 Advance: Cache untuk Gambar Cerita
// Ini akan memperbaiki masalah "gambar tidak tampil offline"
registerRoute(
  ({ request, url }) =>
    request.destination === "image" &&
    url.origin === "https://story-api.dicoding.dev",
  new CacheFirst({
    cacheName: "story-image-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 60, // Simpan 60 gambar
        maxAgeSeconds: 30 * 24 * 60 * 60, // Simpan selama 30 hari
      }),
    ],
  })
);

// (4) Cache Google Fonts (Sudah benar, dipisah)
registerRoute(
  ({ url }) =>
    url.origin === "https://fonts.googleapis.com" ||
    url.origin === "https://fonts.gstatic.com",
  new StaleWhileRevalidate({
    cacheName: "google-fonts-cache",
    plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })],
  })
);

// (5) Kriteria 2 (Basic/Skilled): Menangani Push Notification
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push Diterima.");

  const notificationData = event.data.json();
  const title = notificationData.title || "Notifikasi Baru";
  const options = {
    body: notificationData.body || "Ada konten baru untuk Anda.",
    icon: "images/favicon.png",
    badge: "images/favicon.png",
    data: {
      // (INI SUDAH DIPERBAIKI) Gunakan 'self' bukan 'window'
      url: self.location.origin + "/#/",
    },
    actions: [{ action: "explore-action", title: "Lihat Sekarang" }],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// (6) Kriteria 2 Advanced: Menangani klik notifikasi (Sudah benar)
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const defaultUrl = event.notification.data.url || "/#/";

  if (event.action === "explore-action") {
    event.waitUntil(clients.openWindow(defaultUrl));
  } else {
    event.waitUntil(clients.openWindow(defaultUrl));
  }
});
