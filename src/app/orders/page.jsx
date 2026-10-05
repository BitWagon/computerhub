"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Package,
  RefreshCw,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/orders", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "/login?redirect=/orders";
          return;
        }

        throw new Error(
          data?.message || "Failed to load orders."
        );
      }

      setOrders(
        Array.isArray(data?.orders)
          ? data.orders
          : []
      );
    } catch (error) {
      console.error(
        "Orders loading error:",
        error
      );

      setError(
        error?.message ||
          "Unable to load your orders."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  function formatDate(date) {
    if (!date) return "—";

    try {
      return new Date(date).toLocaleDateString(
        "en-PK",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      );
    } catch {
      return "—";
    }
  }

  function formatMoney(value) {
    return Number(value || 0).toLocaleString(
      "en-PK",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  }

  function getStatusClasses(status) {
    switch (
      String(status || "").toLowerCase()
    ) {
      case "delivered":
        return "border-emerald-200 bg-emerald-50 text-emerald-700";

      case "shipped":
        return "border-blue-200 bg-blue-50 text-blue-700";

      case "processing":
        return "border-violet-200 bg-violet-50 text-violet-700";

      case "confirmed":
        return "border-cyan-200 bg-cyan-50 text-cyan-700";

      case "cancelled":
        return "border-red-200 bg-red-50 text-red-700";

      default:
        return "border-amber-200 bg-amber-50 text-amber-700";
    }
  }

  function getPaymentClasses(status) {
    switch (
      String(status || "").toLowerCase()
    ) {
      case "paid":
        return "bg-emerald-50 text-emerald-700";

      case "failed":
        return "bg-red-50 text-red-700";

      case "refunded":
        return "bg-violet-50 text-violet-700";

      default:
        return "bg-amber-50 text-amber-700";
    }
  }

  function getStatusIcon(status) {
    switch (
      String(status || "").toLowerCase()
    ) {
      case "delivered":
        return CheckCircle2;

      case "shipped":
        return Truck;

      case "cancelled":
        return XCircle;

      case "processing":
        return Clock3;

      default:
        return Package;
    }
  }

  function formatStatus(status) {
    if (!status) return "Pending";

    return (
      String(status).charAt(0).toUpperCase() +
      String(status).slice(1)
    );
  }

  const totalOrders = orders.length;

  const deliveredOrders = orders.filter(
    (order) =>
      String(
        order.orderStatus || ""
      ).toLowerCase() === "delivered"
  ).length;

  const activeOrders = orders.filter(
    (order) =>
      !["delivered", "cancelled"].includes(
        String(
          order.orderStatus || ""
        ).toLowerCase()
      )
  ).length;

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="container-main flex min-h-[70vh] items-center justify-center px-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
              <RefreshCw
                size={25}
                className="animate-spin text-blue-600"
              />
            </div>

            <h1 className="mt-5 text-lg font-bold text-slate-900">
              Loading your orders
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Please wait while we retrieve your order history.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container-main px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">

        {/* Breadcrumb */}
        <div className="mb-7 flex items-center gap-2 text-sm">
          <Link
            href="/"
            className="font-medium text-slate-500 transition hover:text-blue-600"
          >
            Home
          </Link>

          <span className="text-slate-300">
            /
          </span>

          <span className="font-semibold text-slate-900">
            My Orders
          </span>
        </div>

        {/* Header */}
        <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 text-white shadow-sm">
          <div className="relative p-6 sm:p-8 lg:p-10">

            <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />

            <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">

              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-300">
                  <Package size={14} />
                  Order Center
                </div>

                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                  My Orders
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                  Track your purchases, payment status and delivery progress in one place.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
                >
                  <ShoppingBag size={17} />
                  Continue Shopping
                </Link>

                <button
                  type="button"
                  onClick={loadOrders}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  <RefreshCw size={17} />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid border-t border-white/10 sm:grid-cols-3">
            <Stat
              label="Total Orders"
              value={totalOrders}
            />

            <Stat
              label="Active Orders"
              value={activeOrders}
              border
            />

            <Stat
              label="Delivered"
              value={deliveredOrders}
              border
            />
          </div>
        </section>

        {/* Error */}
        {error && (
          <section className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-red-800">
                  Unable to load orders
                </p>

                <p className="mt-1 text-sm text-red-700">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={loadOrders}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
              >
                <RefreshCw size={15} />
                Try Again
              </button>
            </div>
          </section>
        )}

        {/* Empty State */}
        {!error && orders.length === 0 && (
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-blue-50">
              <Package
                size={42}
                className="text-blue-600"
              />
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              Order Center
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
              No orders yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
              Your purchases will appear here after you place an order.
            </p>

            <Link
              href="/products"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Browse Products
              <ArrowRight size={17} />
            </Link>
          </section>
        )}

        {/* Orders */}
        {!error && orders.length > 0 && (
          <section className="mt-7 space-y-5">
            {orders.map((order) => {
              const itemCount =
                Array.isArray(order.items)
                  ? order.items.reduce(
                      (total, item) =>
                        total +
                        Number(
                          item?.quantity || 1
                        ),
                      0
                    )
                  : 0;

              const StatusIcon =
                getStatusIcon(
                  order.orderStatus
                );

              const status =
                String(
                  order.orderStatus ||
                    "pending"
                ).toLowerCase();

              return (
                <article
                  key={order._id}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-200 hover:shadow-md"
                >
                  {/* Order Header */}
                  <div className="border-b border-slate-100 p-5 sm:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                      <div className="flex min-w-0 items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                          <StatusIcon size={22} />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <h2 className="truncate text-lg font-black text-slate-950">
                              {order.orderNumber ||
                                `Order #${String(
                                  order._id
                                ).slice(-8)}`}
                            </h2>

                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusClasses(
                                status
                              )}`}
                            >
                              {formatStatus(
                                status
                              )}
                            </span>
                          </div>

                          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
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
                              {itemCount === 1
                                ? "item"
                                : "items"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="lg:text-right">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Order Total
                        </p>

                        <p className="mt-1 text-2xl font-black text-blue-600">
                          PKR{" "}
                          {formatMoney(
                            order.total
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="p-5 sm:p-6">
                    <div className="grid gap-6 lg:grid-cols-[1fr_240px_auto] lg:items-center">

                      {/* Product Images */}
                      <div>
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                          Products
                        </p>

                        <div className="flex flex-wrap gap-3">
                          {Array.isArray(
                            order.items
                          ) &&
                            order.items
                              .slice(0, 5)
                              .map(
                                (
                                  item,
                                  index
                                ) => {
                                  const image =
                                    item?.image ||
                                    item?.images?.[0] ||
                                    "";

                                  return (
                                    <div
                                      key={
                                        item?.productId ||
                                        index
                                      }
                                      className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                                    >
                                      {image ? (
                                        <img
                                          src={image}
                                          alt={
                                            item?.name ||
                                            "Product"
                                          }
                                          className="h-full w-full object-cover"
                                        />
                                      ) : (
                                        <Package
                                          size={23}
                                          className="text-slate-300"
                                        />
                                      )}
                                    </div>
                                  );
                                }
                              )}

                          {itemCount > 5 && (
                            <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm font-black text-slate-500">
                              +{itemCount - 5}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Payment */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-4 text-sm">
                          <span className="text-slate-500">
                            Payment
                          </span>

                          <span className="text-right font-bold capitalize text-slate-900">
                            {order.paymentMethod ===
                            "cod"
                              ? "Cash on Delivery"
                              : order.paymentMethod ||
                                "—"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-4 text-sm">
                          <span className="text-slate-500">
                            Status
                          </span>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${getPaymentClasses(
                              order.paymentStatus
                            )}`}
                          >
                            {formatStatus(
                              order.paymentStatus ||
                                "pending"
                            )}
                          </span>
                        </div>
                      </div>

                      {/* View Button */}
                      <Link
                        href={`/orders/${order._id}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700"
                      >
                        View Order
                        <ArrowRight size={17} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
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