"use client";

import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

import ProductFilters from "@/components/products/ProductFilters";
import ProductGrid from "@/components/products/ProductGrid";
import SortProducts from "@/components/products/SortProducts";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    category: [],
    brand: [],
    ram: [],
    storage: [],
    minPrice: "",
    maxPrice: "",
    rating: null,
  });

  const [sort, setSort] = useState("featured");

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/products",
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Failed to load products."
          );
        }

        const apiProducts =
          Array.isArray(data.products)
            ? data.products
            : [];

        const formattedProducts =
          apiProducts.map((product) => ({
            ...product,

            // IMPORTANT:
            // Always use the real MongoDB _id.
            id:
              product._id?.toString() ||
              product.id,

            image:
              product.image ||
              product.images?.[0] ||
              "",

            images:
              Array.isArray(product.images)
                ? product.images
                : product.image
                  ? [product.image]
                  : [],

            category:
              product.category ||
              product.categoryId?.name ||
              "",

            seller:
              product.sellerName ||
              product.seller ||
              "",

            rating:
              Number(product.rating || 0),

            reviews:
              Number(product.reviews || 0),

            price:
              Number(product.price || 0),

            oldPrice:
              Number(product.oldPrice || 0),

            discount:
              Number(product.discount || 0),

            stock:
              Number(product.stock || 0),
          }));

        setProducts(formattedProducts);
      } catch (err) {
        console.error(
          "Products loading error:",
          err
        );

        setError(
          err.message ||
            "Unable to load products."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: [],
      brand: [],
      ram: [],
      storage: [],
      minPrice: "",
      maxPrice: "",
      rating: null,
    });
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filters.category.length > 0) {
      result = result.filter((product) =>
        filters.category.includes(
          product.category
        )
      );
    }

    if (filters.brand.length > 0) {
      result = result.filter((product) =>
        filters.brand.includes(
          product.brand
        )
      );
    }

    if (filters.ram.length > 0) {
      result = result.filter((product) =>
        filters.ram.includes(product.ram)
      );
    }

    if (filters.storage.length > 0) {
      result = result.filter((product) =>
        filters.storage.includes(
          product.storage
        )
      );
    }

    if (filters.minPrice !== "") {
      result = result.filter(
        (product) =>
          Number(product.price) >=
          Number(filters.minPrice)
      );
    }

    if (filters.maxPrice !== "") {
      result = result.filter(
        (product) =>
          Number(product.price) <=
          Number(filters.maxPrice)
      );
    }

    if (filters.rating) {
      result = result.filter(
        (product) =>
          Number(product.rating) >=
          Number(filters.rating)
      );
    }

    switch (sort) {
      case "price-low":
        result.sort(
          (a, b) =>
            Number(a.price) -
            Number(b.price)
        );
        break;

      case "price-high":
        result.sort(
          (a, b) =>
            Number(b.price) -
            Number(a.price)
        );
        break;

      case "rating":
        result.sort(
          (a, b) =>
            Number(b.rating) -
            Number(a.rating)
        );
        break;

      case "discount":
        result.sort(
          (a, b) =>
            Number(b.discount) -
            Number(a.discount)
        );
        break;

      case "newest":
        result.sort(
          (a, b) =>
            new Date(
              b.createdAt || 0
            ).getTime() -
            new Date(
              a.createdAt || 0
            ).getTime()
        );
        break;

      case "featured":
      default:
        result.sort(
          (a, b) =>
            Number(b.featured) -
            Number(a.featured)
        );
        break;
    }

    return result;
  }, [products, filters, sort]);

  const activeFilterCount =
    filters.category.length +
    filters.brand.length +
    filters.ram.length +
    filters.storage.length +
    (filters.minPrice !== "" ? 1 : 0) +
    (filters.maxPrice !== "" ? 1 : 0) +
    (filters.rating ? 1 : 0);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* PAGE HEADER */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-sm font-medium text-blue-600">
            ComputerHub
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            All Products
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-gray-500">
            Browse laptops, desktops,
            components, monitors,
            accessories and gaming products.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* MOBILE FILTER BUTTON */}
        <div className="mb-5 lg:hidden">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700"
          >
            <SlidersHorizontal size={18} />

            Filters

            {activeFilterCount > 0 && (
              <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-5">
            <h2 className="font-semibold text-red-700">
              Unable to load products
            </h2>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          {/* FILTER SIDEBAR */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-xl border border-gray-200 bg-white">
              <div className="flex items-center justify-between border-b border-gray-200 p-5">
                <h2 className="font-bold text-gray-900">
                  Filters
                </h2>

                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <ProductFilters
                filters={filters}
                onFilterChange={
                  handleFilterChange
                }
                products={products}
              />
            </div>
          </aside>

          {/* PRODUCTS */}
          <section>
            {/* TOP BAR */}
            <div className="mb-5 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {loading ? (
                  <p className="text-sm text-gray-500">
                    Loading products...
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Showing{" "}
                    <span className="font-semibold text-gray-900">
                      {filteredProducts.length}
                    </span>{" "}
                    products
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="hidden items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 sm:flex"
                  >
                    <X size={15} />
                    Clear filters
                  </button>
                )}

                <SortProducts
                  value={sort}
                  onChange={setSort}
                />
              </div>
            </div>

            {/* LOADING */}
            {loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({
                  length: 8,
                }).map((_, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                  >
                    <div className="h-56 animate-pulse bg-gray-100" />

                    <div className="space-y-3 p-4">
                      <div className="h-4 animate-pulse rounded bg-gray-100" />
                      <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
                      <div className="h-6 w-1/2 animate-pulse rounded bg-gray-100" />
                      <div className="h-10 animate-pulse rounded bg-gray-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ProductGrid
                products={filteredProducts}
              />
            )}
          </section>
        </div>
      </div>
    </main>
  );
}