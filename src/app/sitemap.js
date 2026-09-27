// =====================================
// ComputerHub SEO Sitemap
// src/app/sitemap.js
// =====================================

export default async function sitemap() {
  const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  const pages = [
    "",
    "/products",
    "/categories",
    "/search",
    "/login",
    "/register",
    "/faq",
    "/privacy",
  ];

  const staticPages = pages.map((page) => ({
    url: `${siteUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: page === "" ? 1 : 0.8,
  }));

  try {
    const response = await fetch(
      `${siteUrl}/api/products`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return staticPages;
    }

    const data = await response.json();

    const productPages = Array.isArray(data.products)
      ? data.products.map((product) => ({
          url: `${siteUrl}/products/${
            product.slug || product._id
          }`,
          lastModified: product.updatedAt
            ? new Date(product.updatedAt)
            : new Date(),
          changeFrequency: "daily",
          priority: 0.9,
        }))
      : [];

    return [...staticPages, ...productPages];
  } catch {
    return staticPages;
  }
}