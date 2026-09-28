"use client";

import { useEffect } from "react";

export default function PWARegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then(() => {
            console.log("✅ Service Worker Registered");
          })
          .catch((error) => {
            console.log("❌ Service Worker Registration Failed:", error);
          });
      });
    }
  }, []);

  return null;
}