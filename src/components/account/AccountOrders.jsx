"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  ArrowRight,
  CalendarDays,
  RefreshCw,
} from "lucide-react";

export default function AccountOrders({
  limit = 3,
}) {
  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const response =
        await fetch("/api/orders", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to load orders."
        );
      }

      setOrders(
        Array.isArray(data?.orders)
          ? data.orders
          : []
      );
    } catch (error) {
      console.error(
        "Account orders error:",
        error
      );

      setError(
        error?.message ||
          "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  function formatDate(date) {
    if (!date) {
      return "—";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "—";
    }

    return parsedDate.toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  }

  function formatMoney(value) {
    return Number(
      value || 0
    ).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function getStatusClasses(status) {
    switch (
      String(status || "").toLowerCase()
    ) {
      case "delivered":
        return "bg-green-100 text-green-700";

      case "shipped":
        return "bg-blue-100 text-blue-700";

      case "processing":
        return "bg-purple-100 text-purple-700";

      case "confirmed":
        return "bg-cyan-100 text-cyan-700";

      case "cancelled":
      case "canceled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  }

  if (loading) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />

          <span className="text-sm">
            Loading your orders...
          </span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-red-700">
              Unable to load orders
            </h2>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={loadOrders}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </section>
    );
  }

  const visibleOrders =
    Number.isFinite(Number(limit)) &&
    Number(limit) > 0
      ? orders.slice(
          0,
          Number(limit)
        )
      : orders;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Orders
          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            Recent Orders
          </h2>
        </div>

        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
        >
          View All

          <ArrowRight size={16} />
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-5 py-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
            <Package className="h-7 w-7 text-blue-600" />
          </div>

          <h3 className="mt-4 font-bold text-gray-900">
            No orders yet
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Your orders will appear here after
            you complete a purchase.
          </p>

          <Link
            href="/products"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Browse Products
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleOrders.map(
            (order) => {
              const itemCount =
                Array.isArray(
                  order.items
                )
                  ? order.items.reduce(
                      (
                        total,
                        item
                      ) =>
                        total +
                        Number(
                          item?.quantity ||
                            1
                        ),
                      0
                    )
                  : 0;

              return (
                <Link
                  key={order._id}
                  href={`/orders/${order._id}`}
                  className="block rounded-xl border border-gray-200 p-4 transition hover:border-blue-300 hover:bg-blue-50/40"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-gray-900">
                          {order.orderNumber ||
                            "Order"}
                        </h3>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${getStatusClasses(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus ||
                            "pending"}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-500">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays
                            size={14}
                          />

                          {formatDate(
                            order.createdAt
                          )}
                        </span>

                        <span>
                          {itemCount}{" "}
                          {itemCount ===
                          1
                            ? "item"
                            : "items"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-5 md:justify-end">
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          Total
                        </p>

                        <p className="font-bold text-gray-900">
                          {formatMoney(
                            order.total
                          )}
                        </p>
                      </div>

                      <ArrowRight
                        size={18}
                        className="text-gray-400"
                      />
                    </div>
                  </div>
                </Link>
              );
            }
          )}
        </div>
      )}
    </section>
  );
}