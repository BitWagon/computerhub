"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  Package,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";

export default function SellerProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState("");

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
          data.message || "Unable to load products."
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
        err.message || "Unable to load products."
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
      setSuccess("");

      const response = await fetch(
        "/api/products",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            productId,
            isActive: !currentStatus,
          }),
        }
      );

      const data = await response.json();

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
                isActive: !currentStatus,
              }
            : product
        )
      );

      setSuccess(
        currentStatus
          ? "Product deactivated successfully."
          : "Product activated successfully."
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

  async function deleteProduct(
    productId,
    productName
  ) {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${productName}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(productId);
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/products?productId=${encodeURIComponent(
          productId
        )}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete product."
        );
      }

      setProducts((current) =>
        current.filter(
          (product) =>
            product._id !== productId
        )
      );

      setSuccess(
        data.message ||
          "Product permanently deleted successfully."
      );
    } catch (err) {
      console.error(
        "Delete product error:",
        err
      );

      setError(
        err.message ||
          "Unable to delete product."
      );
    } finally {
      setActionLoading("");
    }
  }

  function matchesSearch(
    product,
    query
  ) {
    return (
      String(product.name || "")
        .toLowerCase()
        .includes(query) ||
      String(product.brand || "")
        .toLowerCase()
        .includes(query) ||
      String(product.category || "")
        .toLowerCase()
        .includes(query) ||
      String(product.sku || "")
        .toLowerCase()
        .includes(query)
    );
  }

  const filteredProducts =
    useMemo(() => {
      const query = search
        .trim()
        .toLowerCase();

      if (!query) {
        return products;
      }

      return products.filter(
        (product) =>
          matchesSearch(product, query)
      );
    }, [products, search]);

  const activeProducts =
    filteredProducts.filter(
      (product) =>
        product.isActive !== false
    );

  const inactiveProducts =
    filteredProducts.filter(
      (product) =>
        product.isActive === false
    );

  const activeProductCount =
    products.filter(
      (product) =>
        product.isActive !== false
    ).length;

  const inactiveProductCount =
    products.filter(
      (product) =>
        product.isActive === false
    ).length;

  const lowStockProducts =
    products.filter(
      (product) =>
        Number(product.stock || 0) <= 5 &&
        product.isActive !== false
    ).length;

  function ProductCard({
    product,
    inactive = false,
  }) {
    const isActive =
      product.isActive !== false;

    const image =
      product.images?.[0] ||
      product.image ||
      "";

    const stock = Number(
      product.stock || 0
    );

    const isProcessing =
      actionLoading === product._id;

    return (
      <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
        <div className="p-5">
          <div className="flex gap-4">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
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
                  size={30}
                  className="text-slate-300"
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="line-clamp-2 font-black text-slate-950">
                    {product.name ||
                      "Unnamed Product"}
                  </h3>

                  {product.brand && (
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      {product.brand}
                    </p>
                  )}
                </div>

                {isActive ? (
                  <CheckCircle2
                    size={19}
                    className="shrink-0 text-emerald-500"
                  />
                ) : (
                  <XCircle
                    size={19}
                    className="shrink-0 text-red-500"
                  />
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {product.category && (
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                    {product.category}
                  </span>
                )}

                {product.sku && (
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500">
                    SKU: {product.sku}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Price
              </p>

              <p className="mt-1 font-black text-slate-950">
                PKR{" "}
                {Number(
                  product.price || 0
                ).toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Stock
              </p>

              <p
                className={`mt-1 font-black ${
                  stock <= 5
                    ? "text-orange-600"
                    : "text-slate-950"
                }`}
              >
                {stock}
              </p>
            </div>

            <div className="col-span-2 rounded-2xl bg-slate-50 p-3 sm:col-span-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Status
              </p>

              <p
                className={`mt-1 text-sm font-black ${
                  isActive
                    ? "text-emerald-600"
                    : "text-red-600"
                }`}
              >
                {isActive
                  ? "Active"
                  : "Inactive"}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href={`/products/${product._id}`}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <Eye size={16} />
              View
            </Link>

            {!inactive && (
              <button
                type="button"
                disabled={isProcessing}
                onClick={() =>
                  toggleProduct(
                    product._id,
                    true
                  )
                }
                className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isProcessing
                  ? "Updating..."
                  : "Deactivate"}
              </button>
            )}

            {inactive && (
              <>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() =>
                    toggleProduct(
                      product._id,
                      false
                    )
                  }
                  className="rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isProcessing
                    ? "Updating..."
                    : "Activate"}
                </button>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() =>
                    deleteProduct(
                      product._id,
                      product.name
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </article>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container-main py-8 sm:py-10">

        {/* Breadcrumb */}
        <div className="mb-7 flex items-center gap-2 text-sm">
          <Link
            href="/seller"
            className="font-medium text-slate-500 hover:text-blue-600"
          >
            Seller Center
          </Link>

          <span className="text-slate-300">
            /
          </span>

          <span className="font-semibold text-slate-900">
            Products
          </span>
        </div>

        {/* Header */}
        <section className="overflow-hidden rounded-3xl bg-slate-950 text-white shadow-sm">
          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-blue-300">
                  <Package size={14} />
                  Product Management
                </div>

                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                  Your Products
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                  Monitor product listings, stock,
                  availability and product status.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={loadProducts}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10 disabled:opacity-50"
                >
                  <RefreshCw
                    size={17}
                    className={
                      isLoading
                        ? "animate-spin"
                        : ""
                    }
                  />
                  Refresh
                </button>

                <Link
                  href="/seller/products/add"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
                >
                  <Plus size={17} />
                  Add Product
                </Link>
              </div>
            </div>
          </div>

          <div className="grid border-t border-white/10 sm:grid-cols-3">
            <Stat
              label="Total Products"
              value={products.length}
            />

            <Stat
              label="Active"
              value={activeProductCount}
              border
            />

            <Stat
              label="Inactive"
              value={inactiveProductCount}
              border
            />
          </div>
        </section>

        {/* Alerts */}
        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-red-800">
                  Product action failed
                </p>

                <p className="mt-1 text-sm text-red-700">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={loadProducts}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700"
              >
                <RefreshCw size={15} />
                Try Again
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2
                size={19}
                className="text-emerald-600"
              />

              <p className="text-sm font-bold text-emerald-800">
                {success}
              </p>
            </div>
          </div>
        )}

        {/* Search + low stock */}
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search by product, brand, category or SKU..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-orange-50 px-4 py-3">
              <Package
                size={18}
                className="text-orange-600"
              />

              <div>
                <p className="text-xs font-bold text-orange-700">
                  Low Stock
                </p>

                <p className="text-sm font-black text-orange-900">
                  {lowStockProducts} products
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Loading */}
        {isLoading && (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
            <RefreshCw
              size={30}
              className="mx-auto animate-spin text-blue-600"
            />

            <p className="mt-4 text-sm font-bold text-slate-500">
              Loading products...
            </p>
          </div>
        )}

        {/* No products */}
        {!isLoading &&
          filteredProducts.length === 0 && (
            <div className="mt-6 rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50">
                <Package
                  size={35}
                  className="text-blue-600"
                />
              </div>

              <h2 className="mt-6 text-2xl font-black text-slate-950">
                No products found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {search
                  ? "Try another search term."
                  : "There are no products available in your seller account."}
              </p>

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}

        {/* Active products */}
        {!isLoading &&
          activeProducts.length > 0 && (
            <section className="mt-7">
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
                    Live Catalog
                  </p>

                  <h2 className="mt-1 text-2xl font-black text-slate-950">
                    Active Products
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Products currently available in
                    the catalog.
                  </p>
                </div>

                <span className="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 sm:block">
                  {activeProducts.length} active
                </span>
              </div>

              <div className="grid gap-5 xl:grid-cols-2">
                {activeProducts.map(
                  (product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                    />
                  )
                )}
              </div>
            </section>
          )}

        {/* Inactive */}
        {!isLoading &&
          inactiveProducts.length > 0 && (
            <section className="mt-10">
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-red-600">
                  Archived Catalog
                </p>

                <h2 className="mt-1 text-2xl font-black text-slate-950">
                  Inactive Products
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Products currently disabled from the
                  active catalog.
                </p>
              </div>

              <div className="grid gap-5 xl:grid-cols-2">
                {inactiveProducts.map(
                  (product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      inactive
                    />
                  )
                )}
              </div>
            </section>
          )}
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  border = false,
}) {
  return (
    <div
      className={`px-6 py-5 sm:px-8 ${
        border
          ? "border-t border-white/10 sm:border-l sm:border-t-0"
          : ""
      }`}
    >
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-2xl font-black text-white">
        {value}
      </p>
    </div>
  );
}