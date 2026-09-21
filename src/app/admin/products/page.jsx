"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Package,
  Plus,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] =
    useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(
          "/api/products?includeInactive=true",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

      const data =
        await response.json();

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
        "Admin products error:",
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

  useEffect(() => {
    loadProducts();
  }, []);

  async function updateProductStatus(
    productId,
    isActive
  ) {
    try {
      setActionLoading(productId);
      setError("");
      setMessage("");

      const response =
        await fetch(
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
              isActive,
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
          String(
            product._id ||
              product.id
          ) === String(productId)
            ? {
                ...product,
                isActive,
              }
            : product
        )
      );

      setMessage(
        isActive
          ? "Product activated successfully."
          : "Product deactivated successfully."
      );
    } catch (err) {
      console.error(
        "Product status error:",
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

  async function permanentlyDeleteProduct(
    productId,
    productName
  ) {
    const confirmed =
      window.confirm(
        `Permanently delete "${productName}"?\n\nThis can only be done for an inactive product and cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(productId);
      setError("");
      setMessage("");

      const response =
        await fetch(
          `/api/products?productId=${encodeURIComponent(
            productId
          )}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete product."
        );
      }

      setProducts((current) =>
        current.filter(
          (product) =>
            String(
              product._id ||
                product.id
            ) !== String(productId)
        )
      );

      setMessage(
        "Product permanently deleted."
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
            .includes(query) ||
          String(
            product.sellerName || ""
          )
            .toLowerCase()
            .includes(query)
      );
    }, [products, search]);

  const activeCount =
    products.filter(
      (product) =>
        product.isActive !== false
    ).length;

  const inactiveCount =
    products.filter(
      (product) =>
        product.isActive === false
    ).length;

  const lowStockCount =
    products.filter(
      (product) =>
        product.isActive !== false &&
        Number(product.stock || 0) <= 5
    ).length;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/admin"
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600"
            >
              <ArrowLeft size={17} />
              Back to Admin
            </Link>

            <h1 className="text-3xl font-bold text-gray-900">
              Products
            </h1>

            <p className="mt-1 text-gray-500">
              Manage all ComputerHub products.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={loadProducts}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />
              Refresh
            </button>

            <Link
              href="/seller/products/add"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Plus size={17} />
              Add Product
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {message}
          </div>
        )}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Products
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {products.length}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Active
            </p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {activeCount}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Inactive
            </p>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {inactiveCount}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Low Stock
            </p>
            <p className="mt-2 text-3xl font-bold text-orange-600">
              {lowStockCount}
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border bg-white p-4 shadow-sm">
          <div className="relative">
            <Search
              size={19}
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
              placeholder="Search products, SKU, category or seller..."
              className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="text-center">
                <RefreshCw
                  className="mx-auto animate-spin text-blue-600"
                  size={30}
                />
                <p className="mt-3 text-sm text-gray-500">
                  Loading products...
                </p>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <Package
                size={40}
                className="mx-auto text-gray-300"
              />

              <h2 className="mt-4 text-lg font-bold text-gray-900">
                No products found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {search
                  ? "Try another search."
                  : "There are no products yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Product
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Category
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Price
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Stock
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Seller
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map(
                    (product) => {
                      const id =
                        product._id ||
                        product.id;

                      const isActive =
                        product.isActive !==
                        false;

                      const busy =
                        actionLoading === id;

                      const image =
                        product.images?.[0];

                      return (
                        <tr
                          key={id}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100">
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
                                  <div className="flex h-full items-center justify-center">
                                    <Package
                                      size={20}
                                      className="text-gray-400"
                                    />
                                  </div>
                                )}
                              </div>

                              <div>
                                <p className="font-semibold text-gray-900">
                                  {product.name}
                                </p>

                                {product.brand && (
                                  <p className="text-xs text-gray-500">
                                    {product.brand}
                                  </p>
                                )}

                                {product.sku && (
                                  <p className="text-xs text-gray-400">
                                    SKU:{" "}
                                    {product.sku}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-600">
                            {product.category ||
                              "—"}
                          </td>

                          <td className="px-5 py-4 font-semibold text-gray-900">
                            Rs.{" "}
                            {Number(
                              product.price ||
                                0
                            ).toLocaleString(
                              "en-PK"
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={
                                Number(
                                  product.stock ||
                                    0
                                ) <= 5
                                  ? "font-bold text-red-600"
                                  : "font-semibold text-gray-800"
                              }
                            >
                              {Number(
                                product.stock ||
                                  0
                              )}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-600">
                            {product.sellerName ||
                              "—"}
                          </td>

                          <td className="px-5 py-4">
                            {isActive ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                <CheckCircle2
                                  size={14}
                                />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                                <XCircle
                                  size={14}
                                />
                                Inactive
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">
                              <Link
                                href={`/products/${id}`}
                                target="_blank"
                                className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                              >
                                View
                              </Link>

                              {isActive ? (
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() => {
                                    const confirmed =
                                      window.confirm(
                                        "Deactivate this product?"
                                      );

                                    if (
                                      confirmed
                                    ) {
                                      updateProductStatus(
                                        id,
                                        false
                                      );
                                    }
                                  }}
                                  className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                                >
                                  Deactivate
                                </button>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    disabled={busy}
                                    onClick={() =>
                                      updateProductStatus(
                                        id,
                                        true
                                      )
                                    }
                                    className="rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-100 disabled:opacity-50"
                                  >
                                    Activate
                                  </button>

                                  <button
                                    type="button"
                                    disabled={busy}
                                    onClick={() =>
                                      permanentlyDeleteProduct(
                                        id,
                                        product.name
                                      )
                                    }
                                    className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                                  >
                                    Delete
                                  </button>
                                </>
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
          )}
        </div>
      </div>
    </main>
  );
}