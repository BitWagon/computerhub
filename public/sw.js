const CACHE_NAME =
  "computerhub-static-v2";

const STATIC_ASSETS = [
  "/",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/favicon.ico",
];

self.addEventListener(
  "install",
  (event) => {
    event.waitUntil(
      caches
        .open(CACHE_NAME)
        .then((cache) =>
          cache.addAll(
            STATIC_ASSETS
          )
        )
    );

    self.skipWaiting();
  }
);

self.addEventListener(
  "activate",
  (event) => {
    event.waitUntil(
      Promise.all([
        caches
          .keys()
          .then((keys) =>
            Promise.all(
              keys
                .filter(
                  (key) =>
                    key !==
                    CACHE_NAME
                )
                .map((key) =>
                  caches.delete(key)
                )
            )
          ),

        self.clients.claim(),
      ])
    );
  }
);

self.addEventListener(
  "fetch",
  (event) => {
    const request =
      event.request;

    /*
     * Never cache POST/PUT/PATCH/DELETE.
     */
    if (
      request.method !== "GET"
    ) {
      return;
    }

    const url =
      new URL(
        request.url
      );

    /*
     * Only handle requests belonging
     * to this ComputerHub installation.
     */
    if (
      url.origin !==
      self.location.origin
    ) {
      return;
    }

    /*
     * AUTHENTICATION AND PRIVATE/DYNAMIC
     * PAGES MUST ALWAYS USE THE NETWORK.
     *
     * This is the important fix.
     *
     * We must never cache:
     * /api/auth/me
     * /api/*
     * /admin
     * /seller
     * /account
     * /orders
     * etc.
     */
    if (
      url.pathname.startsWith(
        "/api/"
      ) ||
      url.pathname.startsWith(
        "/admin"
      ) ||
      url.pathname.startsWith(
        "/seller"
      ) ||
      url.pathname.startsWith(
        "/account"
      ) ||
      url.pathname.startsWith(
        "/orders"
      ) ||
      url.pathname.startsWith(
        "/checkout"
      ) ||
      url.pathname.startsWith(
        "/wishlist"
      ) ||
      url.pathname.startsWith(
        "/login"
      ) ||
      url.pathname.startsWith(
        "/register"
      )
    ) {
      event.respondWith(
        fetch(request)
      );

      return;
    }

    /*
     * Only explicitly listed static assets
     * may use the cache.
     */
    if (
      STATIC_ASSETS.includes(
        url.pathname
      )
    ) {
      event.respondWith(
        caches
          .match(request)
          .then((cached) => {
            if (cached) {
              return cached;
            }

            return fetch(
              request
            ).then(
              (response) => {
                if (
                  !response ||
                  response.status !==
                    200
                ) {
                  return response;
                }

                const copy =
                  response.clone();

                caches
                  .open(
                    CACHE_NAME
                  )
                  .then(
                    (cache) => {
                      cache.put(
                        request,
                        copy
                      );
                    }
                  );

                return response;
              }
            );
          })
      );
    }
  }
);