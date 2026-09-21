"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Edit3,
  Eye,
  Package,
  Power,
  Trash2,
} from "lucide-react";

export default function SellerProductTable({
  products = [],
  loading = false,
  actionLoading = "",
  onToggle,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex min-h-[240px] items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />

            Loading products...
          </div>
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
          <Package className="text-blue-600" />
        </div>

        <h3 className="mt-4 font-bold text-gray-900">
          No products found
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Add your first product to start
          selling on ComputerHub.
        </p>

        <Link
          href="/seller/products/add"
          className="mt-5 inline-flex items-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Add Product
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                Product
              </th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                Category
              </th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                Price
              </th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                Stock
              </th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                Status
              </th>

              <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {products.map((product) => {
              const productId =
                product._id ||
                product.id;

              const image =
                product.images?.[0] || "";

              const isActive =
                product.isActive !== false;

              const isActionLoading =
                actionLoading ===
                productId;

              return (
                <tr
                  key={productId}
                  className="transition hover:bg-gray-50"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                        {image ? (
                          <Image
                            src={image}
                            alt={
                              product.name ||
                              "Product"
                            }
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Package
                              size={20}
                              className="text-gray-400"
                            />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="line-clamp-2 font-semibold text-gray-900">
                          {product.name ||
                            "Unnamed Product"}
                        </p>

                        {product.brand && (
                          <p className="mt-1 text-xs text-gray-500">
                            {product.brand}
                          </p>
                        )}

                        {product.sku && (
                          <p className="mt-1 text-xs text-gray-400">
                            SKU: {product.sku}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {product.category ||
                      "—"}
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-900">
                      Rs.{" "}
                      {Number(
                        product.price ||
                          0
                      ).toLocaleString(
                        "en-PK"
                      )}
                    </p>

                    {Number(
                      product.oldPrice ||
                        0
                    ) >
                      Number(
                        product.price ||
                          0
                      ) && (
                      <p className="text-xs text-gray-400 line-through">
                        Rs.{" "}
                        {Number(
                          product.oldPrice
                        ).toLocaleString(
                          "en-PK"
                        )}
                      </p>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={
                        Number(
                          product.stock ||
                            0
                        ) <= 0
                          ? "font-semibold text-red-600"
                          : Number(
                              product.stock
                            ) <= 5
                          ? "font-semibold text-orange-600"
                          : "font-semibold text-green-600"
                      }
                    >
                      {Number(
                        product.stock ||
                          0
                      )}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/products/${productId}`}
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                        title="View product"
                      >
                        <Eye size={17} />
                      </Link>

                      <Link
                        href={`/seller/products/edit/${productId}`}
                        className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                        title="Edit product"
                      >
                        <Edit3 size={17} />
                      </Link>

                      {onToggle && (
                        <button
                          type="button"
                          onClick={() =>
                            onToggle(
                              productId,
                              isActive
                            )
                          }
                          disabled={
                            isActionLoading
                          }
                          className="rounded-lg p-2 text-orange-600 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
                          title={
                            isActive
                              ? "Deactivate"
                              : "Activate"
                          }
                        >
                          <Power
                            size={17}
                          />
                        </button>
                      )}

                      {onDelete && (
                        <button
                          type="button"
                          onClick={() =>
                            onDelete(
                              productId,
                              product.name
                            )
                          }
                          disabled={
                            isActionLoading
                          }
                          className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Delete product"
                        >
                          <Trash2
                            size={17}
                          />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}