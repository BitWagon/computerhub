// =====================================
// ComputerHub PWA Manifest
// src/app/manifest.js
// =====================================

export default function manifest() {
  return {
    name: "ComputerHub",
    short_name: "ComputerHub",
    description:
      "ComputerHub - Buy and sell computers, laptops and accessories.",

    start_url: "/",
    scope: "/",
    display: "standalone",

    background_color: "#ffffff",
    theme_color: "#2563eb",

    orientation: "portrait",

    lang: "en",

    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],

    categories: [
      "shopping",
      "business",
      "technology",
    ],
  };
}