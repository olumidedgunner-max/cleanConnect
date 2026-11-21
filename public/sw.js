const CACHE = "cleanersmarketplace-v2";
const STATIC = [
  "/",
  "/post-job",
  "/cleaners",
  "/dashboard",
  "/register-cleaner",
  "/register-business",
  "/privacy",
  "/terms",
  "/support",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// Install — cache static shell
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(STATIC)).then(() => self.skipWaiting())
  );
});

// Activate — remove old caches
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — network first for API, cache first for static
self.addEventListener("fetch", (e) => {
  const { request } = e;
  const url = new URL(request.url);

  // Always network for API routes and external resources
  if (url.pathname.startsWith("/api/") || url.origin !== location.origin) {
    return;
  }

  // Videos — network only (too large to cache)
  if (url.pathname.endsWith(".mp4")) {
    return;
  }

  const isPageView =
    request.mode === "navigate" ||
    (request.headers.get("accept") || "").includes("text/html");

  // Pages are network-first. Cache-first served a stale shell on every
  // return visit, so copy changes — branding, prices, legal terms —
  // stayed invisible to anyone who had been here before, which is the
  // wrong default for text we are legally on the hook for. Cache is
  // still the offline fallback.
  if (isPageView) {
    e.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(request, clone));
          }
          return res;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match("/")))
    );
    return;
  }

  // Static assets keep cache-first: they are content-hashed, so a stale
  // hit is the same bytes.
  e.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request).then((res) => {
        if (res.ok && request.method === "GET") {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(request, clone));
        }
        return res;
      });
      return cached || network;
    })
  );
});
