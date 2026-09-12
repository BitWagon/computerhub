"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  RefreshCw,
  Save,
} from "lucide-react";

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const PAYMENT_STATUSES = [
  "pending",
  "paid",
  "failed",
  "refunded",
];

function formatStatus(status) {
  if (!status) return "Pending";

  return (
    status.charAt(0).toUpperCase() +
    status.slice(1)
  );
}

function getStatusClasses(status) {
  switch (status) {
    case "delivered":
    case "paid":
      return "bg-green-100 text-green-700";

    case "shipped":
      return "bg-blue-100 text-blue-700";

    case "processing":
      return "bg-yellow-100 text-yellow-700";

    case "cancelled":
    case "failed":
    case "refunded":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/orders",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to load orders."
        );
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error(
        "Admin orders error:",
        error
      );

      setError(
        error.message ||
          "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateOrder = async (
    orderId,
    orderStatus,
    paymentStatus
  ) => {
    try {
      setSavingId(orderId);

      const response = await fetch(
        "/api/orders",
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            orderId,
            orderStatus,
            paymentStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to update order."
        );
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? data.order
            : order
        )
      );
    } catch (error) {
      console.error(
        "Order update error:",
        error
      );

      alert(
        error.message ||
          "Unable to update order."
      );
    } finally {
      setSavingId("");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <Link
              href="/admin"
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600"
            >
              <ArrowLeft size={16} />
              Back to Admin
            </Link>

            <h1 className="text-3xl font-bold text-gray-900">
              Orders
            </h1>

            <p className="mt-2 text-gray-600">
              Manage real orders stored in MongoDB.
            </p>
          </div>

          <button
            type="button"
            onClick={loadOrders}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
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
        </div>

        {/* Stats */}
        {!loading && !error && (
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Total Orders
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {orders.length}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Pending
              </p>

              <p className="mt-2 text-3xl font-bold text-yellow-600">
                {
                  orders.filter(
                    (order) =>
                      order.orderStatus ===
                      "pending"
                  ).length
                }
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Processing
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-600">
                {
                  orders.filter(
                    (order) =>
                      order.orderStatus ===
                      "processing"
                  ).length
                }
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Delivered
              </p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                {
                  orders.filter(
                    (order) =>
                      order.orderStatus ===
                      "delivered"
                  ).length
                }
              </p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <RefreshCw
              size={32}
              className="mx-auto animate-spin text-blue-600"
            />

            <p className="mt-4 font-medium text-gray-700">
              Loading orders from MongoDB...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-semibold text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          orders.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">

              <Package
                size={42}
                className="mx-auto text-gray-400"
              />

              <h2 className="mt-4 text-xl font-bold text-gray-900">
                No orders found
              </h2>

              <p className="mt-2 text-gray-500">
                Orders created through checkout
                will appear here.
              </p>
            </div>
          )}

        {/* Orders */}
        {!loading &&
          !error &&
          orders.length > 0 && (
            <div className="space-y-6">

              {orders.map((order) => (
                <div
                  key={order._id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                >

                  {/* Top */}
                  <div className="border-b border-gray-200 p-5">

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Order
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-gray-900">
                          {order.orderNumber}
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                          {order.createdAt
                            ? new Date(
                                order.createdAt
                              ).toLocaleString()
                            : ""}
                        </p>
                      </div>

                      <div className="text-left lg:text-right">
                        <p className="text-sm text-gray-500">
                          Order Total
                        </p>

                        <p className="text-2xl font-bold text-blue-600">
                          $
                          {Number(
                            order.total || 0
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Customer */}
                  <div className="grid grid-cols-1 gap-6 border-b border-gray-200 p-5 md:grid-cols-2">

                    <div>
                      <h3 className="font-bold text-gray-900">
                        Customer
                      </h3>

                      <div className="mt-3 space-y-1 text-sm text-gray-600">
                        <p>
                          <strong>Name:</strong>{" "}
                          {order.customer?.fullName}
                        </p>

                        <p>
                          <strong>Email:</strong>{" "}
                          {order.customer?.email}
                        </p>

                        <p>
                          <strong>Phone:</strong>{" "}
                          {order.customer?.phone}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-900">
                        Delivery Address
                      </h3>

                      <div className="mt-3 space-y-1 text-sm text-gray-600">
                        <p>
                          {order.customer?.address}
                        </p>

                        <p>
                          {order.customer?.city},{" "}
                          {order.customer?.state}
                        </p>

                        <p>
                          {order.customer?.country}{" "}
                          {order.customer?.postalCode}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="border-b border-gray-200 p-5">

                    <h3 className="font-bold text-gray-900">
                      Products
                    </h3>

                    <div className="mt-4 space-y-3">

                      {order.items?.map(
                        (item, index) => (
                          <div
                            key={`${order._id}-${index}`}
                            className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 p-4"
                          >

                            <div>
                              <p className="font-semibold text-gray-900">
                                {item.name}
                              </p>

                              <p className="mt-1 text-sm text-gray-500">
                                $
                                {Number(
                                  item.price || 0
                                ).toLocaleString()}{" "}
                                ×{" "}
                                {item.quantity}
                              </p>
                            </div>

                            <p className="font-bold text-gray-900">
                              $
                              {Number(
                                item.total || 0
                              ).toLocaleString()}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Status Controls */}
                  <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-3">

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Order Status
                      </label>

                      <select
                        value={
                          order.orderStatus ||
                          "pending"
                        }
                        onChange={(event) => {
                          const value =
                            event.target.value;

                          setOrders(
                            (current) =>
                              current.map(
                                (item) =>
                                  item._id ===
                                  order._id
                                    ? {
                                        ...item,
                                        orderStatus:
                                          value,
                                      }
                                    : item
                              )
                          );
                        }}
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      >
                        {ORDER_STATUSES.map(
                          (status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {formatStatus(
                                status
                              )}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Payment Status
                      </label>

                      <select
                        value={
                          order.paymentStatus ||
                          "pending"
                        }
                        onChange={(event) => {
                          const value =
                            event.target.value;

                          setOrders(
                            (current) =>
                              current.map(
                                (item) =>
                                  item._id ===
                                  order._id
                                    ? {
                                        ...item,
                                        paymentStatus:
                                          value,
                                      }
                                    : item
                              )
                          );
                        }}
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      >
                        {PAYMENT_STATUSES.map(
                          (status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {formatStatus(
                                status
                              )}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        type="button"
                        disabled={
                          savingId ===
                          order._id
                        }
                        onClick={() =>
                          updateOrder(
                            order._id,
                            order.orderStatus,
                            order.paymentStatus
                          )
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {savingId ===
                        order._id ? (
                          <>
                            <RefreshCw
                              size={17}
                              className="animate-spin"
                            />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={17} />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Current Status */}
                  <div className="flex flex-wrap gap-3 border-t border-gray-200 bg-gray-50 p-5">

                    <span
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusClasses(
                        order.orderStatus
                      )}`}
                    >
                      Order:{" "}
                      {formatStatus(
                        order.orderStatus
                      )}
                    </span>

                    <span
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusClasses(
                        order.paymentStatus
                      )}`}
                    >
                      Payment:{" "}
                      {formatStatus(
                        order.paymentStatus
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </main>
  );
}