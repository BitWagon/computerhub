"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Edit3,
  Package,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadProducts(showRefresh = false) {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");
      setMessage("");

      const response = await fetch(
        "/api/products?includeInactive=true",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load products."
        );
      }

      setProducts(
        Array.isArray(data.products)
          ? data.products
          : []
      );
    } catch (err) {
      console.error(
        "Admin products load error:",
        err
      );

      setError(
        err.message ||
          "Unable to load products."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function deactivateProduct(productId) {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response = await fetch(
        "/api/products",
        {
          method: "DELETE",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            productId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to deactivate product."
        );
      }

      setMessage(
        "Product deactivated successfully."
      );

      await loadProducts(true);
    } catch (err) {
      console.error(
        "Deactivate product error:",
        err
      );

      setError(
        err.message ||
          "Unable to deactivate product."
      );
    }
  }

  async function activateProduct(productId) {
    try {
      setError("");
      setMessage("");

      const response = await fetch(
        "/api/products",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            productId,
            isActive: true,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to activate product."
        );
      }

      setMessage(
        "Product activated successfully."
      );

      await loadProducts(true);
    } catch (err) {
      console.error(
        "Activate product error:",
        err
      );

      setError(
        err.message ||
          "Unable to activate product."
      );
    }
  }

  const filteredProducts =
    useMemo(() => {
      const value =
        search.trim().toLowerCase();

      if (!value) {
        return products;
      }

      return products.filter(
        (product) => {
          return (
            product.name
              ?.toLowerCase()
              .includes(value) ||
            product.brand
              ?.toLowerCase()
              .includes(value) ||
            product.category
              ?.toLowerCase()
              .includes(value) ||
            product.sku
              ?.toLowerCase()
              .includes(value) ||
            product.sellerName
              ?.toLowerCase()
              .includes(value)
          );
        }
      );
    }, [products, search]);

  const totalProducts =
    products.length;

  const activeProducts =
    products.filter(
      (product) =>
        product.isActive
    ).length;

  const inactiveProducts =
    products.filter(
      (product) =>
        !product.isActive
    ).length;

  const lowStockProducts =
    products.filter(
      (product) =>
        product.isActive &&
        Number(product.stock) <= 5
    ).length;

  function formatPrice(price) {
    return `£${Number(
      price || 0
    ).toFixed(2)}`;
  }

  function getProductImage(product) {
    if (
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      return product.images[0];
    }

    return null;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
              <Link
                href="/admin"
                className="flex items-center gap-1 transition hover:text-blue-600"
              >
                <ArrowLeft
                  className="h-4 w-4"
                />
                Admin Dashboard
              </Link>

              <span>/</span>

              <span className="text-slate-700">
                Products
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Products
            </h1>

            <p className="mt-1 text-slate-600">
              Manage all ComputerHub products.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                loadProducts(true)
              }
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing
                    ? "animate-spin"
                    : ""
                }`}
              />
              Refresh
            </button>

            <Link
              href="/seller/products/add"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Plus
                className="h-4 w-4"
              />
              Add Product
            </Link>
          </div>
        </div>

        {/* MESSAGES */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            <XCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-semibold">
                Error
              </p>

              <p className="text-sm">
                {error}
              </p>
            </div>
          </div>
        )}

        {message && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-semibold">
                Success
              </p>

              <p className="text-sm">
                {message}
              </p>
            </div>
          </div>
        )}

        {/* STATS */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-xl bg-blue-50 p-3">
                <Package className="h-5 w-5 text-blue-600" />
              </div>

              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Total
              </span>
            </div>

            <p className="text-3xl font-bold text-slate-900">
              {totalProducts}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Total products
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-xl bg-green-50 p-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>

              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Active
              </span>
            </div>

            <p className="text-3xl font-bold text-slate-900">
              {activeProducts}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Active products
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-xl bg-red-50 p-3">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>

              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Inactive
              </span>
            </div>

            <p className="text-3xl font-bold text-slate-900">
              {inactiveProducts}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Inactive products
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-xl bg-amber-50 p-3">
                <Package className="h-5 w-5 text-amber-600" />
              </div>

              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Stock
              </span>
            </div>

            <p className="text-3xl font-bold text-slate-900">
              {lowStockProducts}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Low stock products
            </p>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search products by name, brand, category, SKU or seller..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* PRODUCT TABLE */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="flex items-center gap-3 text-slate-600">
                <RefreshCw className="h-5 w-5 animate-spin" />

                <span className="font-medium">
                  Loading products...
                </span>
              </div>
            </div>
          ) : filteredProducts.length ===
            0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 rounded-2xl bg-slate-100 p-4">
                <Package className="h-8 w-8 text-slate-400" />
              </div>

              <h2 className="text-lg font-bold text-slate-900">
                No products found
              </h2>

              <p className="mt-1 max-w-md text-sm text-slate-500">
                {search
                  ? "No products match your search."
                  : "There are currently no products in MongoDB."}
              </p>

              {!search && (
                <Link
                  href="/seller/products/add"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <Plus
                    className="h-4 w-4"
                  />
                  Add First Product
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Product
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Category
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Price
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Stock
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Seller
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map(
                      (product) => {
                        const image =
                          getProductImage(
                            product
                          );

                        return (
                          <tr
                            key={
                              product._id ||
                              product.id
                            }
                            className="transition hover:bg-slate-50"
                          >
                            <td className="px-5 py-4">
                              <div className="flex min-w-[280px] items-center gap-4">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                                  {image ? (
                                    <img
                                      src={
                                        image
                                      }
                                      alt={
                                        product.name
                                      }
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <Package className="h-6 w-6 text-slate-400" />
                                  )}
                                </div>

                                <div>
                                  <p className="font-semibold text-slate-900">
                                    {
                                      product.name
                                    }
                                  </p>

                                  {product.brand && (
                                    <p className="mt-1 text-xs text-slate-500">
                                      {
                                        product.brand
                                      }
                                    </p>
                                  )}

                                  {product.sku && (
                                    <p className="mt-1 text-xs text-slate-400">
                                      SKU:{" "}
                                      {
                                        product.sku
                                      }
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <div>
                                <p className="font-medium text-slate-800">
                                  {
                                    product.category ||
                                    "—"
                                  }
                                </p>

                                {product.subcategory && (
                                  <p className="mt-1 text-xs text-slate-500">
                                    {
                                      product.subcategory
                                    }
                                  </p>
                                )}
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <p className="font-bold text-slate-900">
                                {formatPrice(
                                  product.price
                                )}
                              </p>

                              {Number(
                                product.oldPrice
                              ) > 0 && (
                                <p className="text-xs text-slate-400 line-through">
                                  {formatPrice(
                                    product.oldPrice
                                  )}
                                </p>
                              )}
                            </td>

                            <td className="px-5 py-4">
                              <span
                                className={`font-semibold ${
                                  Number(
                                    product.stock
                                  ) <= 5
                                    ? "text-red-600"
                                    : "text-slate-800"
                                }`}
                              >
                                {product.stock ??
                                  0}
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              <p className="max-w-[160px] truncate text-sm text-slate-700">
                                {
                                  product.sellerName
                                }
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              {product.isActive ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                                  <XCircle className="h-3.5 w-3.5" />
                                  Inactive
                                </span>
                              )}
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex justify-end gap-2">
                                <Link
                                  href={`/products/${product.slug}`}
                                  target="_blank"
                                  className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                                  title="View product"
                                >
                                  <Package className="h-4 w-4" />
                                </Link>

                                <button
                                  type="button"
                                  disabled
                                  className="cursor-not-allowed rounded-lg border border-slate-200 p-2 text-slate-300"
                                  title="Edit will be added in the next step"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </button>

                                {product.isActive ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      deactivateProduct(
                                        product._id ||
                                          product.id
                                      )
                                    }
                                    className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50"
                                    title="Deactivate product"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      activateProduct(
                                        product._id ||
                                          product.id
                                      )
                                    }
                                    className="rounded-lg border border-green-200 p-2 text-green-600 transition hover:bg-green-50"
                                    title="Activate product"
                                  >
                                    <CheckCircle2 className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS */}
              <div className="divide-y divide-slate-100 lg:hidden">
                {filteredProducts.map(
                  (product) => {
                    const image =
                      getProductImage(
                        product
                      );

                    return (
                      <div
                        key={
                          product._id ||
                          product.id
                        }
                        className="p-5"
                      >
                        <div className="flex gap-4">
                          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                            {image ? (
                              <img
                                src={image}
                                alt={
                                  product.name
                                }
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Package className="h-7 w-7 text-slate-400" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h3 className="font-bold text-slate-900">
                                  {
                                    product.name
                                  }
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                  {
                                    product.category
                                  }
                                </p>
                              </div>

                              {product.isActive ? (
                                <span className="shrink-0 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                                  Active
                                </span>
                              ) : (
                                <span className="shrink-0 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                                  Inactive
                                </span>
                              )}
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <p className="text-xs text-slate-400">
                                  Price
                                </p>

                                <p className="font-bold text-slate-900">
                                  {formatPrice(
                                    product.price
                                  )}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-slate-400">
                                  Stock
                                </p>

                                <p
                                  className={`font-bold ${
                                    Number(
                                      product.stock
                                    ) <= 5
                                      ? "text-red-600"
                                      : "text-slate-900"
                                  }`}
                                >
                                  {
                                    product.stock
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            <Package className="h-4 w-4" />
                            View
                          </Link>

                          {product.isActive ? (
                            <button
                              type="button"
                              onClick={() =>
                                deactivateProduct(
                                  product._id ||
                                    product.id
                                )
                              }
                              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              Deactivate
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                activateProduct(
                                  product._id ||
                                    product.id
                                )
                              }
                              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-green-200 px-3 py-2 text-sm font-semibold text-green-600 transition hover:bg-green-50"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Activate
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </>
          )}
        </div>

        {/* FOOTER INFORMATION */}
        {!loading &&
          filteredProducts.length > 0 && (
            <div className="mt-4 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Showing{" "}
                <span className="font-semibold text-slate-700">
                  {filteredProducts.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700">
                  {products.length}
                </span>{" "}
                products
              </p>

              <p>
                Product management is connected
                to MongoDB.
              </p>
            </div>
          )}
      </div>
    </main>
  );
}