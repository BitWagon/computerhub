"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Edit,
  Eye,
  Package,
  Plus,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await fetch(
        "/api/products?includeInactive=true",
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to load products."
        );
      }

      setProducts(
        Array.isArray(data?.products)
          ? data.products
          : Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error("Admin products error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function toggleProduct(product) {
    try {
      setError("");
      setMessage("");

      const response = await fetch("/api/products", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productId: product._id,
          isActive: !product.isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to update product status."
        );
      }

      setMessage(
        product.isActive
          ? "Product deactivated successfully."
          : "Product activated successfully."
      );

      await loadProducts();
    } catch (err) {
      console.error(
        "Product status update error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update product."
      );
    }
  }

  const filteredProducts = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return products;
    }

    return products.filter((product) => {
      const categoryName =
        typeof product?.categoryId === "object"
          ? product?.categoryId?.name
          : product?.categoryId;

      const sellerName =
        typeof product?.sellerId === "object"
          ? product?.sellerId?.name ||
            product?.sellerId?.email
          : product?.sellerId;

      const fields = [
        product?.name,
        product?.brand,
        product?.sku,
        product?.subcategory,
        categoryName,
        sellerName,
      ];

      return fields.some((field) =>
        String(field || "")
          .toLowerCase()
          .includes(value)
      );
    });
  }, [products, search]);

  const activeProducts = filteredProducts.filter(
    (product) => product.isActive
  );

  const inactiveProducts = filteredProducts.filter(
    (product) => !product.isActive
  );

  const lowStockProducts = products.filter(
    (product) =>
      product.isActive &&
      Number(product?.stock || 0) > 0 &&
      Number(product?.stock || 0) <= 5
  );

  const outOfStockProducts = products.filter(
    (product) =>
      product.isActive &&
      Number(product?.stock || 0) <= 0
  );

  function formatPrice(value) {
    return `PKR ${Number(value || 0).toLocaleString()}`;
  }

  function getCategoryName(product) {
    if (
      product?.categoryId &&
      typeof product.categoryId === "object"
    ) {
      return (
        product.categoryId.name ||
        product.categoryId.slug ||
        "Uncategorized"
      );
    }

    return "Uncategorized";
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <Package size={21} />
              </div>

              <span className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Administration
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Product Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
              Manage marketplace products, availability,
              inventory, and product listings.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={loadProducts}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={
                  loading ? "animate-spin" : ""
                }
              />

              Refresh
            </button>

            <Link
              href="/admin/products/add"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              <Plus size={17} />
              Add Product
            </Link>
          </div>
        </div>

        {/* ALERTS */}
        {message && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-medium text-emerald-700">
            <CheckCircle2 size={18} />
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* STATS */}
        <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Total Products
              </span>

              <Package
                size={19}
                className="text-slate-400"
              />
            </div>

            <p className="text-3xl font-bold text-slate-950">
              {products.length}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Active
              </span>

              <CheckCircle2
                size={19}
                className="text-emerald-500"
              />
            </div>

            <p className="text-3xl font-bold text-slate-950">
              {products.filter(
                (product) => product.isActive
              ).length}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Low Stock
              </span>

              <AlertTriangle
                size={19}
                className="text-amber-500"
              />
            </div>

            <p className="text-3xl font-bold text-slate-950">
              {lowStockProducts.length}
            </p>
          </div>

          <div className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Out of Stock
              </span>

              <XCircle
                size={19}
                className="text-red-500"
              />
            </div>

            <p className="text-3xl font-bold text-slate-950">
              {outOfStockProducts.length}
            </p>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mb-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search products, SKU, category or seller..."
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
            />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-800">
                {filteredProducts.length}
              </span>{" "}
              products
            </p>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-sm font-semibold text-slate-700 hover:text-slate-950"
              >
                Clear search
              </button>
            )}
          </div>
        </div>

        {/* ACTIVE PRODUCTS */}
        <section className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-950">
                Active Products
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Products currently visible in the marketplace.
              </p>
            </div>

            <span className="w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
              {activeProducts.length} active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[950px] w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Product
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Category
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Price
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Stock
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-14 text-center"
                    >
                      <RefreshCw
                        size={24}
                        className="mx-auto animate-spin text-slate-400"
                      />

                      <p className="mt-3 text-sm text-slate-500">
                        Loading products...
                      </p>
                    </td>
                  </tr>
                ) : activeProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-14 text-center text-sm text-slate-500"
                    >
                      No active products found.
                    </td>
                  </tr>
                ) : (
                  activeProducts.map((product) => (
                    <ProductRow
                      key={product._id}
                      product={product}
                      getCategoryName={getCategoryName}
                      formatPrice={formatPrice}
                      onToggle={toggleProduct}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* INACTIVE PRODUCTS */}
        {inactiveProducts.length > 0 && (
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  Inactive Products
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Products currently hidden from the marketplace.
                </p>
              </div>

              <span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                {inactiveProducts.length} inactive
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[950px] w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Product
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Category
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Price
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Stock
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {inactiveProducts.map((product) => (
                    <ProductRow
                      key={product._id}
                      product={product}
                      getCategoryName={getCategoryName}
                      formatPrice={formatPrice}
                      onToggle={toggleProduct}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <p className="mt-4 text-center text-xs text-slate-400 lg:hidden">
          Swipe horizontally to view all product details.
        </p>
      </div>
    </main>
  );
}

function ProductRow({
  product,
  getCategoryName,
  formatPrice,
  onToggle,
}) {
  const stock = Number(product?.stock || 0);

  const stockClass =
    stock <= 0
      ? "text-red-600"
      : stock <= 5
      ? "text-amber-600"
      : "text-emerald-600";

  return (
    <tr className="transition hover:bg-slate-50/80">
      <td className="px-5 py-5">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100">
            {product?.image ? (
              <img
                src={product.image}
                alt={product?.name || "Product"}
                className="h-full w-full object-cover"
              />
            ) : Array.isArray(product?.images) &&
              product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product?.name || "Product"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Package
                  size={20}
                  className="text-slate-400"
                />
              </div>
            )}
          </div>

          <div className="max-w-[260px]">
            <p className="truncate font-semibold text-slate-950">
              {product?.name || "Unnamed Product"}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {product?.sku
                ? `SKU: ${product.sku}`
                : product?.brand || "No SKU"}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-5">
        <span className="text-sm text-slate-600">
          {getCategoryName(product)}
        </span>
      </td>

      <td className="px-5 py-5">
        <span className="font-semibold text-slate-950">
          {formatPrice(product?.price)}
        </span>
      </td>

      <td className="px-5 py-5">
        <span className={`font-semibold ${stockClass}`}>
          {stock}
        </span>
      </td>

      <td className="px-5 py-5">
        {product?.isActive ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <CheckCircle2 size={14} />
            Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
            <XCircle size={14} />
            Inactive
          </span>
        )}
      </td>

      <td className="px-5 py-5">
        <div className="flex justify-end gap-2">
          <Link
            href={`/products/${product._id}`}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <Eye size={14} />
            View
          </Link>

          <Link
            href={`/admin/products/edit/${product._id}`}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <Edit size={14} />
            Edit
          </Link>

          <button
            type="button"
            onClick={() => onToggle(product)}
            className={`inline-flex h-9 items-center rounded-lg px-3 text-xs font-semibold transition ${
              product?.isActive
                ? "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            {product?.isActive
              ? "Deactivate"
              : "Activate"}
          </button>
        </div>
      </td>
    </tr>
  );
}