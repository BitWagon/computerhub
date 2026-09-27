// =====================================
// ComputerHub SEO Robots
// src/app/robots.js
// =====================================

export default function robots() {
  const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",

        disallow: [
          "/admin/",
          "/seller/",
          "/account/",
          "/api/",
          "/checkout/",
        ],
      },
    ],

    sitemap: `${siteUrl}/sitemap.xml`,

    host: siteUrl,
  };
}