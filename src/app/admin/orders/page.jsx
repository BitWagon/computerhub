"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Eye,
  Package,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] =
    useState(null);

  const [statusFilter, setStatusFilter] =
    useState("all");

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/orders",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href =
            "/login?redirect=/admin/orders";

          return;
        }

        if (response.status === 403) {
          setError(
            "Admin access is required to view orders."
          );

          return;
        }

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
        "Admin orders loading error:",
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

    try {
      return new Date(date).toLocaleDateString(
        "en-US",
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
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  }

  function getOrderStatusClasses(status) {
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

  function getPaymentStatusClasses(status) {
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

  async function updateOrder(
    orderId,
    orderStatus,
    paymentStatus
  ) {
    try {
      setUpdatingId(orderId);
      setError("");

      const body = {
        orderId,
      };

      if (orderStatus !== undefined) {
        body.orderStatus = orderStatus;
      }

      if (paymentStatus !== undefined) {
        body.paymentStatus = paymentStatus;
      }

      const response = await fetch(
        "/api/orders",
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to update order."
        );
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          String(order._id) ===
          String(orderId)
            ? {
                ...order,
                ...(data.order || {}),
              }
            : order
        )
      );
    } catch (error) {
      console.error(
        "Order update error:",
        error
      );

      setError(
        error?.message ||
          "Unable to update order."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter(
          (order) =>
            order.orderStatus ===
            statusFilter
        );

  const pendingCount =
    orders.filter(
      (order) =>
        order.orderStatus ===
        "pending"
    ).length;

  const processingCount =
    orders.filter(
      (order) =>
        order.orderStatus ===
          "processing" ||
        order.orderStatus ===
          "confirmed"
    ).length;

  const shippedCount =
    orders.filter(
      (order) =>
        order.orderStatus ===
        "shipped"
    ).length;

  const deliveredCount =
    orders.filter(
      (order) =>
        order.orderStatus ===
        "delivered"
    ).length;

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container-main">
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

              <p className="mt-4 text-sm text-gray-500">
                Loading admin orders...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="container-main">

        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
                <ShoppingBag
                  size={23}
                  className="text-blue-600"
                />
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                  Admin Panel
                </p>

                <h1 className="text-3xl font-bold text-gray-900">
                  Order Management
                </h1>
              </div>
            </div>

            <p className="mt-3 max-w-2xl text-gray-500">
              Manage customer orders,
              update delivery status and
              track payment status.
            </p>
          </div>

          <button
            type="button"
            onClick={loadOrders}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <RefreshCw size={17} />

            Refresh Orders
          </button>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="font-semibold text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* STATISTICS */}

        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Orders
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {orders.length}
            </p>
          </div>

          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
            <p className="text-sm text-yellow-700">
              Pending
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-800">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5">
            <p className="text-sm text-purple-700">
              Processing
            </p>

            <p className="mt-2 text-3xl font-bold text-purple-800">
              {processingCount}
            </p>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <p className="text-sm text-blue-700">
              Shipped
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-800">
              {shippedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
            <p className="text-sm text-green-700">
              Delivered
            </p>

            <p className="mt-2 text-3xl font-bold text-green-800">
              {deliveredCount}
            </p>
          </div>

        </div>

        {/* FILTER */}

        <div className="mb-6 flex flex-wrap gap-2">

          {[
            "all",
            "pending",
            "confirmed",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
          ].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() =>
                setStatusFilter(status)
              }
              className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
                statusFilter === status
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {status === "all"
                ? "All Orders"
                : status}
            </button>
          ))}

        </div>

        {/* EMPTY */}

        {filteredOrders.length === 0 && (
          <div className="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">

            <Package
              size={48}
              className="mx-auto text-gray-300"
            />

            <h2 className="mt-5 text-xl font-bold text-gray-900">
              No Orders Found
            </h2>

            <p className="mt-2 text-gray-500">
              There are no orders matching
              this filter.
            </p>

          </div>
        )}

        {/* ORDERS */}

        {filteredOrders.length > 0 && (
          <div className="space-y-5">

            {filteredOrders.map(
              (order) => {
                const customer =
                  order.customer ||
                  {};

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

                const isUpdating =
                  String(
                    updatingId
                  ) ===
                  String(order._id);

                return (
                  <div
                    key={order._id}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                  >

                    {/* ORDER TOP */}

                    <div className="border-b border-gray-200 bg-gray-50 px-5 py-5 md:px-6">

                      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                        <div>

                          <div className="flex flex-wrap items-center gap-3">

                            <h2 className="text-lg font-bold text-gray-900">
                              {order.orderNumber ||
                                "Order"}
                            </h2>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${getOrderStatusClasses(
                                order.orderStatus
                              )}`}
                            >
                              {order.orderStatus ||
                                "pending"}
                            </span>

                          </div>

                          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">

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

                        <div className="text-left xl:text-right">

                          <p className="text-xs uppercase tracking-wide text-gray-400">
                            Total
                          </p>

                          <p className="text-2xl font-bold text-blue-600">
                            $
                            {formatMoney(
                              order.total
                            )}
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* CUSTOMER + PRODUCTS */}

                    <div className="grid gap-6 p-5 md:p-6 lg:grid-cols-2">

                      {/* CUSTOMER */}

                      <div>

                        <div className="mb-4 flex items-center gap-2">

                          <ShieldCheck
                            size={19}
                            className="text-blue-600"
                          />

                          <h3 className="font-bold text-gray-900">
                            Customer
                          </h3>

                        </div>

                        <div className="rounded-xl bg-gray-50 p-4">

                          <p className="font-semibold text-gray-900">
                            {customer.fullName ||
                              "—"}
                          </p>

                          <p className="mt-1 break-all text-sm text-gray-600">
                            {customer.email ||
                              "—"}
                          </p>

                          <p className="mt-1 text-sm text-gray-600">
                            {customer.phone ||
                              "—"}
                          </p>

                          <p className="mt-3 text-sm leading-6 text-gray-600">
                            {customer.address ||
                              "—"}
                            <br />

                            {customer.city ||
                              ""}
                            {customer.state
                              ? `, ${customer.state}`
                              : ""}
                            <br />

                            {customer.postalCode ||
                              ""}
                            {customer.country
                              ? `, ${customer.country}`
                              : ""}
                          </p>

                        </div>

                      </div>

                      {/* PRODUCTS */}

                      <div>

                        <div className="mb-4 flex items-center gap-2">

                          <Package
                            size={19}
                            className="text-blue-600"
                          />

                          <h3 className="font-bold text-gray-900">
                            Products
                          </h3>

                        </div>

                        <div className="space-y-3">

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
                                    className="flex items-center gap-3 rounded-xl border border-gray-200 p-3"
                                  >

                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50">

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
                                            22
                                          }
                                          className="text-gray-300"
                                        />
                                      )}

                                    </div>

                                    <div className="min-w-0 flex-1">

                                      <p className="line-clamp-1 text-sm font-semibold text-gray-900">
                                        {item.name ||
                                          "Product"}
                                      </p>

                                      <p className="mt-1 text-xs text-gray-500">
                                        Qty:{" "}
                                        {item.quantity ||
                                          1}
                                      </p>

                                    </div>

                                    <p className="font-semibold text-gray-900">
                                      $
                                      {formatMoney(
                                        item.total
                                      )}
                                    </p>

                                  </div>
                                )
                              )}

                          {itemCount > 4 && (
                            <p className="text-sm text-gray-500">
                              +{" "}
                              {itemCount -
                                4}{" "}
                              more items
                            </p>
                          )}

                        </div>

                      </div>

                    </div>

                    {/* ADMIN CONTROLS */}

                    <div className="border-t border-gray-200 bg-white px-5 py-5 md:px-6">

                      <div className="grid gap-4 lg:grid-cols-3">

                        {/* ORDER STATUS */}

                        <div>

                          <label
                            htmlFor={`order-status-${order._id}`}
                            className="mb-2 block text-sm font-semibold text-gray-700"
                          >
                            Order Status
                          </label>

                          <select
                            id={`order-status-${order._id}`}
                            value={
                              order.orderStatus ||
                              "pending"
                            }
                            disabled={
                              isUpdating
                            }
                            onChange={(event) =>
                              updateOrder(
                                order._id,
                                event.target
                                  .value,
                                undefined
                              )
                            }
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                          >
                            <option value="pending">
                              Pending
                            </option>

                            <option value="confirmed">
                              Confirmed
                            </option>

                            <option value="processing">
                              Processing
                            </option>

                            <option value="shipped">
                              Shipped
                            </option>

                            <option value="delivered">
                              Delivered
                            </option>

                            <option value="cancelled">
                              Cancelled
                            </option>
                          </select>

                        </div>

                        {/* PAYMENT STATUS */}

                        <div>

                          <label
                            htmlFor={`payment-status-${order._id}`}
                            className="mb-2 block text-sm font-semibold text-gray-700"
                          >
                            Payment Status
                          </label>

                          <select
                            id={`payment-status-${order._id}`}
                            value={
                              order.paymentStatus ||
                              "pending"
                            }
                            disabled={
                              isUpdating
                            }
                            onChange={(event) =>
                              updateOrder(
                                order._id,
                                undefined,
                                event.target
                                  .value
                              )
                            }
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                          >
                            <option value="pending">
                              Pending
                            </option>

                            <option value="paid">
                              Paid
                            </option>

                            <option value="failed">
                              Failed
                            </option>

                            <option value="refunded">
                              Refunded
                            </option>
                          </select>

                        </div>

                        {/* VIEW */}

                        <div className="flex items-end">

                          <Link
                            href={`/orders/${order._id}`}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                          >
                            <Eye
                              size={18}
                            />

                            View Full Order

                            <ArrowRight
                              size={17}
                            />

                          </Link>

                        </div>

                      </div>

                      {isUpdating && (
                        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600">

                          <RefreshCw
                            size={16}
                            className="animate-spin"
                          />

                          Updating order...

                        </div>
                      )}

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