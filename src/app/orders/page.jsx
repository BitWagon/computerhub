"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Package,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

function getStatusClasses(status) {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-700";

    case "shipped":
      return "bg-blue-100 text-blue-700";

    case "processing":
      return "bg-yellow-100 text-yellow-700";

    case "confirmed":
      return "bg-indigo-100 text-indigo-700";

    case "cancelled":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

function formatStatus(status) {
  if (!status) return "Pending";

  return status
    .charAt(0)
    .toUpperCase() +
    status.slice(1);
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
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
        "Orders loading error:",
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

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <Link
              href="/"
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>

            <h1 className="text-3xl font-bold text-gray-900">
              My Orders
            </h1>

            <p className="mt-2 text-gray-600">
              View your ComputerHub orders.
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

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <RefreshCw
              size={32}
              className="mx-auto animate-spin text-blue-600"
            />

            <p className="mt-4 font-medium text-gray-700">
              Loading your orders...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-semibold text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={loadOrders}
              className="mt-4 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          orders.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Package size={30} />
              </div>

              <h2 className="mt-5 text-2xl font-bold text-gray-900">
                No Orders Yet
              </h2>

              <p className="mt-2 text-gray-500">
                You have not placed any orders yet.
              </p>

              <Link
                href="/products"
                className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Start Shopping
              </Link>
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

                  {/* Order Header */}
                  <div className="flex flex-col gap-4 border-b border-gray-200 bg-gray-50 p-5 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Order Number
                      </p>

                      <p className="mt-1 text-lg font-bold text-gray-900">
                        {order.orderNumber}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {order.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleString()
                          : ""}
                      </p>
                    </div>

                    <span
                      className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-bold ${getStatusClasses(
                        order.orderStatus
                      )}`}
                    >
                      {formatStatus(
                        order.orderStatus
                      )}
                    </span>
                  </div>

                  {/* Products */}
                  <div className="space-y-4 p-5">

                    {order.items?.map(
                      (item, index) => (
                        <div
                          key={`${order._id}-${index}`}
                          className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
                        >

                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900">
                              {item.name}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              Quantity:{" "}
                              {item.quantity}
                            </p>
                          </div>

                          <p className="shrink-0 font-bold text-gray-900">
                            $
                            {Number(
                              item.total || 0
                            ).toLocaleString()}
                          </p>
                        </div>
                      )
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex flex-col gap-4 border-t border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">

                    <div className="text-sm text-gray-600">
                      Payment:{" "}
                      <span className="font-semibold text-gray-900">
                        {formatStatus(
                          order.paymentMethod
                        )}
                      </span>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        Total
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
              ))}
            </div>
          )}
      </div>
    </main>
  );
}