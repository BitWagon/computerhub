"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ChevronDown,
  Loader2,
  Search as SearchIcon,
  SlidersHorizontal,
  X,
} from "lucide-react";

import ProductCard from "@/components/products/ProductCard";

function SearchPageContent() {
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("q") || "";
  const brandQuery = searchParams.get("brand") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/products", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data?.success) {
          throw new Error(
            data?.message || "Unable to load products."
          );
        }

        if (!cancelled) {
          setProducts(Array.isArray(data.products) ? data.products : []);
        }
      } catch (err) {
        console.error("Search products error:", err);

        if (!cancelled) {
          setError(
            err?.message || "Unable to load products right now."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const normalizedProducts = useMemo(() => {
    return products.map((product) => {
      const category =
        typeof product.categoryId === "object"
          ? product.categoryId
          : null;

      const images = Array.isArray(product.images)
        ? product.images.filter(Boolean)
        : [];

      const image =
        product.image ||
        images[0] ||
        "/placeholder-product.png";

      const price = Number(product.price || 0);

      const oldPrice =
        Number(product.oldPrice || product.originalPrice || 0) ||
        null;

      return {
        ...product,

        id: product._id || product.id,

        name: product.name || "Unnamed Product",

        image,

        images,

        price,

        oldPrice,

        originalPrice: Number(product.originalPrice || 0),

        stock: Number(product.stock || 0),

        brand: product.brand || "",

        categoryName:
          category?.name ||
          product.category ||
          "",

        categorySlug:
          category?.slug ||
          "",

        sellerName:
          product.sellerName ||
          product.seller?.name ||
          product.createdBy?.name ||
          "",

        description:
          product.description ||
          product.shortDescription ||
          "",

        sku: product.sku || "",

        featured: Boolean(product.featured),

        rating: Number(
          product.rating ||
            product.averageRating ||
            0
        ),

        freeDelivery: Boolean(product.freeDelivery),
      };
    });
  }, [products]);

  const categories = useMemo(() => {
    const values = normalizedProducts
      .map((product) => product.categoryName)
      .filter(Boolean);

    return [...new Set(values)].sort((a, b) =>
      a.localeCompare(b)
    );
  }, [normalizedProducts]);

  const brands = useMemo(() => {
    const values = normalizedProducts
      .map((product) => product.brand)
      .filter(Boolean);

    return [...new Set(values)].sort((a, b) =>
      a.localeCompare(b)
    );
  }, [normalizedProducts]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const brand = brandQuery.trim().toLowerCase();

    let result = normalizedProducts.filter((product) => {
      const searchableText = [
        product.name,
        product.brand,
        product.categoryName,
        product.categorySlug,
        product.sellerName,
        product.description,
        product.shortDescription,
        product.sku,
        product.processor,
        product.ram,
        product.storage,
        product.graphics,
        product.screenSize,
        product.subcategory,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query || searchableText.includes(query);

      const matchesBrand =
        !brand ||
        product.brand.toLowerCase().includes(brand);

      const matchesCategory =
        !selectedCategory ||
        product.categoryName === selectedCategory;

      const matchesPrice =
        !maxPrice ||
        product.price <= Number(maxPrice);

      return (
        matchesSearch &&
        matchesBrand &&
        matchesCategory &&
        matchesPrice
      );
    });

    result = [...result].sort((a, b) => {
      if (sortBy === "price-low") {
        return a.price - b.price;
      }

      if (sortBy === "price-high") {
        return b.price - a.price;
      }

      if (sortBy === "rating") {
        return b.rating - a.rating;
      }

      if (sortBy === "newest") {
        return (
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        );
      }

      if (sortBy === "featured") {
        return Number(b.featured) - Number(a.featured);
      }

      return 0;
    });

    return result;
  }, [
    normalizedProducts,
    searchQuery,
    brandQuery,
    selectedCategory,
    maxPrice,
    sortBy,
  ]);

  const heading = searchQuery.trim()
    ? `Search results for "${searchQuery.trim()}"`
    : brandQuery.trim()
      ? `${brandQuery.trim()} products`
      : "Search products";

  const hasActiveFilters =
    Boolean(brandQuery.trim()) ||
    Boolean(selectedCategory) ||
    Boolean(maxPrice);

  function clearFilters() {
    setSelectedCategory("");
    setMaxPrice("");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
              <SearchIcon className="h-3.5 w-3.5" />
              Product Search
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              {heading}
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
              Find laptops, desktops, components, accessories
              and other technology from the ComputerHub marketplace.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Toolbar */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {loading
                  ? "Finding products..."
                  : `${filteredProducts.length} ${
                      filteredProducts.length === 1
                        ? "product"
                        : "products"
                    } found`}
              </p>

              {(searchQuery || brandQuery) && (
                <p className="mt-1 text-xs text-slate-500">
                  {searchQuery
                    ? `Search: ${searchQuery}`
                    : `Brand: ${brandQuery}`}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() =>
                  setShowFilters((current) => !current)
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>

              <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3">
                <span className="whitespace-nowrap text-xs font-semibold text-slate-500">
                  Sort
                </span>

                <select
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(event.target.value)
                  }
                  className="bg-transparent py-2.5 text-sm font-semibold text-slate-800 outline-none"
                >
                  <option value="featured">
                    Featured
                  </option>

                  <option value="newest">
                    Newest
                  </option>

                  <option value="price-low">
                    Price: Low to High
                  </option>

                  <option value="price-high">
                    Price: High to Low
                  </option>

                  <option value="rating">
                    Top Rated
                  </option>
                </select>

                <ChevronDown className="h-4 w-4 text-slate-400" />
              </label>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          {/* Desktop Filters */}
          <aside
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block`}
          >
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-950">
                    Filters
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Refine your results
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowFilters(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden"
                  aria-label="Close filters"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {brandQuery && (
                <div className="mb-5 rounded-xl bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Brand
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {brandQuery}
                  </p>
                </div>
              )}

              {/* Category */}
              <div className="border-b border-slate-100 pb-5">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Category
                </label>

                <select
                  value={selectedCategory}
                  onChange={(event) =>
                    setSelectedCategory(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400"
                >
                  <option value="">
                    All categories
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div className="border-b border-slate-100 py-5">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Maximum price
                </label>

                <select
                  value={maxPrice}
                  onChange={(event) =>
                    setMaxPrice(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400"
                >
                  <option value="">Any price</option>
                  <option value="25000">Up to 25,000</option>
                  <option value="50000">Up to 50,000</option>
                  <option value="100000">
                    Up to 100,000
                  </option>
                  <option value="200000">
                    Up to 200,000
                  </option>
                  <option value="500000">
                    Up to 500,000
                  </option>
                </select>
              </div>

              {/* Brands */}
              {brands.length > 0 && (
                <div className="pt-5">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Available brands
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {brands.slice(0, 12).map((brand) => {
                      const active =
                        brandQuery.toLowerCase() ===
                        brand.toLowerCase();

                      return (
                        <span
                          key={brand}
                          className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium ${
                            active
                              ? "border-slate-900 bg-slate-900 text-white"
                              : "border-slate-200 bg-white text-slate-600"
                          }`}
                        >
                          {brand}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Clear filters
                </button>
              )}
            </div>
          </aside>

          {/* Products */}
          <section>
            {loading ? (
              <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
                <div className="text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-slate-400" />

                  <p className="mt-4 text-sm font-semibold text-slate-700">
                    Loading products
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Please wait while we find the latest products.
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                </div>

                <h2 className="mt-4 text-lg font-bold text-slate-950">
                  Unable to load products
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-5 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Try again
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                  <SearchIcon className="h-6 w-6 text-slate-500" />
                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-950">
                  No products found
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Try a different search term or remove some
                  filters to see more products.
                </p>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-50">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </main>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}