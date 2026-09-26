export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },

    sitemap: "https://YOURDOMAIN.com/sitemap.xml",
  };
}