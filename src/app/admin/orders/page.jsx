"use client";

import { useEffect, useState } from "react";
import {
  Package,
  RefreshCw,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/orders", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load orders."
        );
      }

      setOrders(
        Array.isArray(data.orders)
          ? data.orders
          : []
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateStatus(id, status) {
    try {
      const response = await fetch("/api/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          orderId: id,
          orderStatus: status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Update failed."
        );
      }

      loadOrders();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update order."
      );
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3">
              <Package className="text-blue-600" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Orders
              </h1>

              <p className="text-gray-500">
                Manage customer orders
              </p>
            </div>
          </div>

          <button
            onClick={loadOrders}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw
              size={18}
              className={
                loading ? "animate-spin" : ""
              }
            />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Order
                  </th>

                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Customer
                  </th>

                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Total
                  </th>

                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>

                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Payment
                  </th>

                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-4 py-4 font-medium text-gray-900">
                        #{String(order._id).slice(-6)}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {order.shippingAddress?.fullName ||
                          "Customer"}
                      </td>

                      <td className="px-4 py-4 font-semibold text-gray-900">
                        PKR {Number(order.total || 0).toLocaleString()}
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                          {order.orderStatus || "pending"}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {order.paymentStatus || "pending"}
                      </td>

                      <td className="px-4 py-4">
                        <select
                          value={order.orderStatus}
                          onChange={(e) =>
                            updateStatus(
                              order._id,
                              e.target.value
                            )
                          }
                          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}