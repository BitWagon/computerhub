"use client";

import { useEffect, useState } from "react";
import {
  Package,
  RefreshCw,
  Search,
  Filter,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("all");

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
  const filteredOrders = orders.filter((order) => {
  const orderNumber = String(order._id).slice(-6);

 const customer =
  `${order.customer?.firstName || ""} ${order.customer?.lastName || ""}`
    .trim()
    .toLowerCase();

  const matchesSearch =
    orderNumber.includes(search.toLowerCase()) ||
    customer.includes(search.toLowerCase());

  const matchesStatus =
    statusFilter === "all" ||
    (order.orderStatus  || "pending") === statusFilter

  return matchesSearch && matchesStatus;
});

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
        <div className="mb-6 flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search by Order ID or Customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 outline-none focus:border-blue-500"
              />
            </div>

            <div className="relative w-full md:w-60">
              <Filter
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 outline-none focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

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
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-4 py-4 font-medium text-gray-900">
                        #{String(order._id).slice(-6)}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {`${order.customer?.firstName || ""} ${order.customer?.lastName || ""}`.trim() || "Customer"}
                      </td>

                      <td className="px-4 py-4 font-semibold text-gray-900">
                        PKR {Number(order.total || 0).toLocaleString()}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-medium ${
                            (order.orderStatus || "pending") === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : (order.orderStatus || "pending") === "confirmed"
                              ? "bg-cyan-100 text-cyan-700"
                              : (order.orderStatus || "pending") === "processing"
                              ? "bg-blue-100 text-blue-700"
                              : (order.orderStatus || "pending") === "shipped"
                              ? "bg-purple-100 text-purple-700"
                              : (order.orderStatus || "pending") === "delivered"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.orderStatus || "pending"}
                        </span>
                                              </td>

                      <td className="px-4 py-4 text-gray-600">
                        {order.paymentStatus || "pending"}
                      </td>

                      <td className="px-4 py-4">
                        <select
                          value={order.orderStatus || "pending"}
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