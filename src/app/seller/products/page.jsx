"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Edit3,
  Eye,
  Package,
  Plus,
  Search,
  XCircle,
} from "lucide-react";

export default function SellerProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] =
    useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setIsLoading(true);
      setError("");

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
        "Load seller products error:",
        err
      );

      setError(
        err.message ||
          "Unable to load products."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function toggleProduct(
    productId,
    currentStatus
  ) {
    try {
      setActionLoading(productId);
      setError("");

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
            isActive:
              !currentStatus,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to update product."
        );
      }

      setProducts((current) =>
        current.map((product) =>
          product._id === productId
            ? {
                ...product,
                isActive:
                  !currentStatus,
              }
            : product
        )
      );
    } catch (err) {
      console.error(
        "Toggle product error:",
        err
      );

      setError(
        err.message ||
          "Unable to update product."
      );
    } finally {
      setActionLoading("");
    }
  }

  const filteredProducts =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      if (!query) {
        return products;
      }

      return products.filter(
        (product) =>
          String(
            product.name || ""
          )
            .toLowerCase()
            .includes(query) ||
          String(
            product.brand || ""
          )
            .toLowerCase()
            .includes(query) ||
          String(
            product.category || ""
          )
            .toLowerCase()
            .includes(query) ||
          String(
            product.sku || ""
          )
            .toLowerCase()
            .includes(query)
      );
    }, [products, search]);

  const activeProducts =
    products.filter(
      (product) =>
        product.isActive !== false
    );

  const inactiveProducts =
    products.filter(
      (product) =>
        product.isActive === false
    );

  const lowStockProducts =
    products.filter(
      (product) =>
        Number(product.stock || 0) <= 5
    );

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link
              href="/seller"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700"
            >
              <ArrowLeft size={17} />
              Back to Seller Dashboard
            </Link>

            <h1 className="text-3xl font-bold text-gray-900">
              My Products
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage your ComputerHub products,
              stock and product status.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={loadProducts}
              className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              Refresh
            </button>

            <Link
              href="/seller/products/add"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Plus size={18} />
              Add Product
            </Link>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Total Products
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {products.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Package size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Active
                </p>

                <p className="mt-2 text-3xl font-bold text-green-600">
                  {activeProducts.length}
                </p>
              </div>

              <CheckCircle2
                className="text-green-600"
                size={25}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Inactive
                </p>

                <p className="mt-2 text-3xl font-bold text-red-600">
                  {inactiveProducts.length}
                </p>
              </div>

              <XCircle
                className="text-red-600"
                size={25}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Low Stock
                </p>

                <p className="mt-2 text-3xl font-bold text-orange-600">
                  {lowStockProducts.length}
                </p>
              </div>

              <Package
                className="text-orange-600"
                size={25}
              />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search your products by name, brand, category or SKU..."
              className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Product list */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="text-lg font-bold text-gray-900">
              Your Products
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {filteredProducts.length} product
              {filteredProducts.length === 1
                ? ""
                : "s"} shown
            </p>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

              <p className="mt-4 text-sm text-gray-500">
                Loading your products...
              </p>
            </div>
          ) : filteredProducts.length ===
            0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <Package size={28} />
              </div>

              <h3 className="mt-4 text-lg font-bold text-gray-900">
                No products found
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                {search
                  ? "Try another search."
                  : "You have not added any products yet."}
              </p>

              {!search && (
                <Link
                  href="/seller/products/add"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Plus size={17} />
                  Add Your First Product
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredProducts.map(
                (product) => {
                  const isActive =
                    product.isActive !==
                    false;

                  const image =
                    product.images?.[0];

                  const stock =
                    Number(
                      product.stock || 0
                    );

                  return (
                    <div
                      key={product._id}
                      className="p-5 transition hover:bg-gray-50"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                        {/* Product */}
                        <div className="flex min-w-0 flex-1 gap-4">
                          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                            {image ? (
                              <img
                                src={image}
                                alt={
                                  product.name ||
                                  "Product"
                                }
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Package
                                className="text-gray-400"
                                size={28}
                              />
                            )}
                          </div>

                          <div className="min-w-0">
                            <h3 className="line-clamp-2 font-bold text-gray-900">
                              {product.name}
                            </h3>

                            <div className="mt-2 flex flex-wrap gap-2">
                              {product.brand && (
                                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                                  {
                                    product.brand
                                  }
                                </span>
                              )}

                              {product.category && (
                                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                                  {
                                    product.category
                                  }
                                </span>
                              )}

                              {product.sku && (
                                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                                  SKU:{" "}
                                  {
                                    product.sku
                                  }
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="lg:w-32">
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Price
                          </p>

                          <p className="mt-1 text-lg font-bold text-gray-900">
                            $
                            {Number(
                              product.price ||
                                0
                            ).toLocaleString()}
                          </p>
                        </div>

                        {/* Stock */}
                        <div className="lg:w-28">
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Stock
                          </p>

                          <p
                            className={`mt-1 text-lg font-bold ${
                              stock <= 5
                                ? "text-orange-600"
                                : "text-gray-900"
                            }`}
                          >
                            {stock}
                          </p>
                        </div>

                        {/* Status */}
                        <div className="lg:w-28">
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Status
                          </p>

                          <div className="mt-2">
                            {isActive ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                <CheckCircle2
                                  size={13}
                                />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                                <XCircle
                                  size={13}
                                />
                                Inactive
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 lg:w-auto lg:justify-end">
                          <Link
                            href={`/products/${product._id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                          >
                            <Eye
                              size={16}
                            />
                            View
                          </Link>

                          <Link
                            href={`/seller/products/edit/${product._id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                          >
                            <Edit3
                              size={16}
                            />
                            Edit
                          </Link>

                          <button
                            type="button"
                            disabled={
                              actionLoading ===
                              product._id
                            }
                            onClick={() =>
                              toggleProduct(
                                product._id,
                                isActive
                              )
                            }
                            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                              isActive
                                ? "bg-red-50 text-red-700 hover:bg-red-100"
                                : "bg-green-50 text-green-700 hover:bg-green-100"
                            }`}
                          >
                            {actionLoading ===
                            product._id
                              ? "Updating..."
                              : isActive
                              ? "Deactivate"
                              : "Activate"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}