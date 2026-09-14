"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Package,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";

export default function OrdersPage() {
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
        await fetch(
          "/api/orders",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        if (
          response.status === 401
        ) {
          window.location.href =
            "/login?redirect=/orders";

          return;
        }

        throw new Error(
          data?.message ||
            "Failed to load orders."
        );
      }

      setOrders(
        Array.isArray(
          data?.orders
        )
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
    if (!date) {
      return "—";
    }

    try {
      return new Date(
        date
      ).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
    } catch {
      return "—";
    }
  }

  function formatMoney(value) {
    return Number(
      value || 0
    ).toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  }

  function getStatusClasses(
    status
  ) {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";

      case "shipped":
        return "bg-blue-100 text-blue-700";

      case "processing":
        return "bg-purple-100 text-purple-700";

      case "confirmed":
        return "bg-cyan-100 text-cyan-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  }

  function getPaymentClasses(
    status
  ) {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";

      case "failed":
        return "bg-red-100 text-red-700";

      case "refunded":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container-main">

          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="text-center">

              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

              <p className="mt-4 text-sm text-gray-500">
                Loading your orders...
              </p>

            </div>
          </div>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 md:py-14">

      <div className="container-main">

        {/* PAGE HEADER */}

        <div className="mb-8">

          <Link
            href="/products"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-blue-600"
          >
            <ShoppingBag
              size={17}
            />

            Continue Shopping
          </Link>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

            <div>

              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Account
              </p>

              <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
                My Orders
              </h1>

              <p className="mt-2 max-w-2xl text-gray-500">
                View and track all your
                ComputerHub orders.
              </p>

            </div>

            <button
              type="button"
              onClick={
                loadOrders
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              <RefreshCw
                size={17}
              />

              Refresh Orders
            </button>

          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">

            <p className="font-semibold text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={
                loadOrders
              }
              className="mt-3 text-sm font-semibold text-red-700 underline"
            >
              Try again
            </button>

          </div>
        )}

        {/* EMPTY */}

        {!error &&
          orders.length === 0 && (
            <div className="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
                <Package
                  size={40}
                  className="text-blue-600"
                />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-gray-900">
                No Orders Yet
              </h2>

              <p className="mx-auto mt-3 max-w-md text-gray-500">
                You haven't placed an
                order yet. Browse our
                products and find
                something you like.
              </p>

              <Link
                href="/products"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Browse Products

                <ArrowRight
                  size={18}
                />
              </Link>

            </div>
          )}

        {/* ORDERS */}

        {orders.length > 0 && (
          <div className="space-y-5">

            {orders.map(
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
                  <div
                    key={
                      order._id
                    }
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                  >

                    {/* ORDER HEADER */}

                    <div className="border-b border-gray-200 bg-gray-50 px-5 py-5 md:px-6">

                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                        <div>

                          <div className="flex flex-wrap items-center gap-3">

                            <h2 className="text-lg font-bold text-gray-900">
                              {order.orderNumber ||
                                "Order"}
                            </h2>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${getStatusClasses(
                                order.orderStatus
                              )}`}
                            >
                              {order.orderStatus ||
                                "pending"}
                            </span>

                          </div>

                          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">

                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays
                                size={
                                  15
                                }
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

                        <div className="text-left md:text-right">

                          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Order Total
                          </p>

                          <p className="mt-1 text-2xl font-bold text-blue-600">
                            $
                            {formatMoney(
                              order.total
                            )}
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* ORDER BODY */}

                    <div className="p-5 md:p-6">

                      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                        {/* PRODUCTS */}

                        <div className="min-w-0 flex-1">

                          <div className="flex flex-wrap gap-3">

                            {Array.isArray(
                              order.items
                            ) &&
                              order.items
                                .slice(
                                  0,
                                  4
                                )
                                .map(
                                  (
                                    item,
                                    index
                                  ) => (
                                    <div
                                      key={
                                        item.productId ||
                                        index
                                      }
                                      className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
                                    >

                                      {item.image ? (
                                        <img
                                          src={
                                            item.image
                                          }
                                          alt={
                                            item.name ||
                                            "Product"
                                          }
                                          className="h-full w-full object-cover"
                                        />
                                      ) : (
                                        <Package
                                          size={
                                            24
                                          }
                                          className="text-gray-300"
                                        />
                                      )}

                                    </div>
                                  )
                                )}

                            {itemCount >
                              4 && (
                              <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-sm font-bold text-gray-500">
                                +
                                {itemCount -
                                  4}
                              </div>
                            )}

                          </div>

                        </div>

                        {/* PAYMENT */}

                        <div className="flex flex-col gap-3 text-sm lg:min-w-[210px]">

                          <div className="flex items-center justify-between gap-6">

                            <span className="text-gray-500">
                              Payment
                            </span>

                            <span className="font-semibold capitalize text-gray-900">
                              {order.paymentMethod ===
                              "cod"
                                ? "Cash on Delivery"
                                : order.paymentMethod ||
                                  "—"}
                            </span>

                          </div>

                          <div className="flex items-center justify-between gap-6">

                            <span className="text-gray-500">
                              Payment Status
                            </span>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${getPaymentClasses(
                                order.paymentStatus
                              )}`}
                            >
                              {order.paymentStatus ||
                                "pending"}
                            </span>

                          </div>

                        </div>

                        {/* DETAILS BUTTON */}

                        <Link
                          href={`/orders/${order._id}`}
                          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                        >
                          View Order

                          <ArrowRight
                            size={18}
                          />
                        </Link>

                      </div>

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

      </div>

    </main>
  );
}