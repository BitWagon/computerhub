"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ShoppingCart,
  Package,
  SlidersHorizontal,
  ArrowRight,
  X,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

export default function ProductsPage() {
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
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

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load products."
          );
        }

        const activeProducts = Array.isArray(data.products)
          ? data.products.filter(
              (product) => product.isActive !== false
            )
          : [];

        setProducts(activeProducts);
      } catch (err) {
        console.error("Products loading error:", err);

        setError(
          err.message ||
            "Unable to load products. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    const searchValue = search.trim().toLowerCase();

    if (searchValue) {
      result = result.filter((product) => {
        return (
          product.name
            ?.toLowerCase()
            .includes(searchValue) ||
          product.brand
            ?.toLowerCase()
            .includes(searchValue) ||
          product.category
            ?.toLowerCase()
            .includes(searchValue) ||
          product.description
            ?.toLowerCase()
            .includes(searchValue)
        );
      });
    }

    if (category !== "All") {
      result = result.filter(
        (product) => product.category === category
      );
    }

    if (sortBy === "price-low") {
      result.sort(
        (a, b) =>
          Number(a.price || 0) -
          Number(b.price || 0)
      );
    }

    if (sortBy === "price-high") {
      result.sort(
        (a, b) =>
          Number(b.price || 0) -
          Number(a.price || 0)
      );
    }

    if (sortBy === "name") {
      result.sort((a, b) =>
        String(a.name || "").localeCompare(
          String(b.name || "")
        )
      );
    }

    if (sortBy === "featured") {
      result.sort(
        (a, b) =>
          Number(Boolean(b.featured)) -
          Number(Boolean(a.featured))
      );
    }

    return result;
  }, [products, search, category, sortBy]);

  const handleAddToCart = (product) => {
    if (Number(product.stock || 0) <= 0) {
      toast.error("This product is out of stock.");
      return;
    }

    const cartProduct = {
      id: product._id || product.id,
      name: product.name,
      price: Number(product.price || 0),
      image:
        product.images?.[0] ||
        "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=600&q=80",
      images: product.images || [],
      stock: Number(product.stock || 0),
      quantity: 1,
      category: product.category || "",
      brand: product.brand || "",
    };

    addToCart(cartProduct);

    toast.success("Product added to cart.");
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setSortBy("featured");
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gray-950 py-14 text-white md:py-20">
        <div className="container-main">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              ComputerHub Store
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              Shop Computers & Technology
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-300 md:text-lg">
              Explore laptops, desktops, components,
              monitors and computer accessories from
              ComputerHub sellers.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="container-main">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search products, brands or categories..."
                  className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-10 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                    aria-label="Clear search"
                  >
                    <X size={17} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <SlidersHorizontal
                  size={18}
                  className="hidden text-gray-500 sm:block"
                />

                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-52"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value)
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-52"
              >
                <option value="featured">
                  Featured
                </option>

                <option value="price-low">
                  Price: Low to High
                </option>

                <option value="price-high">
                  Price: High to Low
                </option>

                <option value="name">
                  Name: A to Z
                </option>
              </select>
            </div>

            <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {filteredProducts.length}
                </span>{" "}
                product
                {filteredProducts.length === 1
                  ? ""
                  : "s"}
              </p>

              {(search ||
                category !== "All" ||
                sortBy !== "featured") && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {loading && (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

                <p className="mt-4 text-sm text-gray-500">
                  Loading products...
                </p>
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
              <h2 className="text-xl font-bold text-red-800">
                Unable to Load Products
              </h2>

              <p className="mt-2 text-sm text-red-600">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
                className="mt-5 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading &&
            !error &&
            filteredProducts.length === 0 && (
              <div className="mt-8 rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                  <Package
                    size={30}
                    className="text-blue-600"
                  />
                </div>

                <h2 className="mt-5 text-2xl font-bold text-gray-900">
                  No Products Found
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                  We could not find any products matching
                  your search or filters.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            )}

          {!loading &&
            !error &&
            filteredProducts.length > 0 && (
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => {
                  const productId =
                    product._id || product.id;

                  const image =
                    product.images?.[0] ||
                    "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=700&q=80";

                  const stock = Number(
                    product.stock || 0
                  );

                  const price = Number(
                    product.price || 0
                  );

                  const oldPrice = Number(
                    product.oldPrice || 0
                  );

                  const discount =
                    product.discount ||
                    (oldPrice > price && oldPrice > 0
                      ? Math.round(
                          ((oldPrice - price) /
                            oldPrice) *
                            100
                        )
                      : 0);

                  return (
                    <article
                      key={productId}
                      className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <Link
                        href={`/products/${productId}`}
                        className="relative block aspect-square overflow-hidden bg-gray-100"
                      >
                        <Image
                          src={image}
                          alt={
                            product.name ||
                            "Computer product"
                          }
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />

                        {product.featured && (
                          <span className="absolute left-3 top-3 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                            Featured
                          </span>
                        )}

                        {discount > 0 && (
                          <span className="absolute right-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                            -{discount}%
                          </span>
                        )}

                        {stock <= 0 && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                            <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-gray-900">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </Link>

                      <div className="p-5">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                            {product.category ||
                              "Technology"}
                          </p>

                          {product.brand && (
                            <p className="truncate text-xs text-gray-500">
                              {product.brand}
                            </p>
                          )}
                        </div>

                        <Link
                          href={`/products/${productId}`}
                          className="mt-2 block"
                        >
                          <h2 className="line-clamp-2 min-h-[48px] text-base font-bold text-gray-900 transition hover:text-blue-600">
                            {product.name}
                          </h2>
                        </Link>

                        {product.shortDescription && (
                          <p className="mt-2 line-clamp-2 text-sm leading-5 text-gray-500">
                            {product.shortDescription}
                          </p>
                        )}

                        <div className="mt-4 flex items-end gap-2">
                          <span className="text-xl font-bold text-gray-900">
                            ${price.toLocaleString()}
                          </span>

                          {oldPrice > price && (
                            <span className="text-sm text-gray-400 line-through">
                              $
                              {oldPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <p
                          className={`mt-2 text-xs font-medium ${
                            stock <= 0
                              ? "text-red-600"
                              : stock <= 5
                              ? "text-orange-600"
                              : "text-green-600"
                          }`}
                        >
                          {stock <= 0
                            ? "Out of stock"
                            : stock <= 5
                            ? `Only ${stock} left`
                            : "In stock"}
                        </p>

                        <div className="mt-5 flex gap-2">
                          <Link
                            href={`/products/${productId}`}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 px-3 py-3 text-sm font-semibold text-gray-700 transition hover:border-blue-500 hover:text-blue-600"
                          >
                            View
                            <ArrowRight size={16} />
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              handleAddToCart(
                                product
                              )
                            }
                            disabled={stock <= 0}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                          >
                            <ShoppingCart
                              size={16}
                            />
                            Add
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
        </div>
      </section>
    </main>
  );
}