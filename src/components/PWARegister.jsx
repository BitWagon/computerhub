"use client";

import { useEffect } from "react";

const CLEANUP_KEY =
  "computerhub_service_worker_cleanup_v2";

export default function PWARegister() {
  useEffect(() => {
    if (
      !("serviceWorker" in navigator)
    ) {
      return;
    }

    let cancelled = false;

    async function removeOldServiceWorkers() {
      try {
        const registrations =
          await navigator.serviceWorker.getRegistrations();

        const cacheNames =
          "caches" in window
            ? await caches.keys()
            : [];

        const oldComputerHubCaches =
          cacheNames.filter((name) =>
            name.startsWith(
              "computerhub-"
            )
          );

        const needsCleanup =
          registrations.length > 0 ||
          oldComputerHubCaches.length >
            0;

        if (!needsCleanup) {
          return;
        }

        /*
         * Remove old service workers.
         */
        for (const registration of registrations) {
          try {
            await registration.unregister();
          } catch {
            /*
             * Ignore individual
             * unregister failures.
             */
          }
        }

        /*
         * Remove old ComputerHub caches.
         */
        if ("caches" in window) {
          await Promise.all(
            oldComputerHubCaches.map(
              (name) =>
                caches.delete(name)
            )
          );
        }

        /*
         * Reload exactly once after cleanup.
         *
         * This guarantees that the old service worker
         * cannot continue serving stale authentication data.
         */
        if (
          !cancelled &&
          !sessionStorage.getItem(
            CLEANUP_KEY
          )
        ) {
          sessionStorage.setItem(
            CLEANUP_KEY,
            "1"
          );

          window.location.reload();
        }
      } catch (error) {
        console.warn(
          "ComputerHub service worker cleanup failed:",
          error
        );
      }
    }

    if (
      document.readyState ===
      "complete"
    ) {
      removeOldServiceWorkers();
    } else {
      window.addEventListener(
        "load",
        removeOldServiceWorkers,
        {
          once: true,
        }
      );
    }

    return () => {
      cancelled = true;

      window.removeEventListener(
        "load",
        removeOldServiceWorkers
      );
    };
  }, []);

  return null;
}