"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Filter,
  Package,
  RefreshCw,
  Search,
  ShoppingBag,
  Truck,
  XCircle,
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
          data?.message || "Unable to load orders."
        );
      }

      setOrders(
        Array.isArray(data?.orders)
          ? data.orders
          : []
      );
    } catch (err) {
      console.error("Admin orders error:", err);

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
      setError("");

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
          data?.message || "Unable to update order."
        );
      }

      await loadOrders();
    } catch (err) {
      console.error("Order status update error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update order."
      );
    }
  }

  const filteredOrders = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return orders.filter((order) => {
      const orderId = String(order?._id || "").toLowerCase();

      const orderNumber = String(
        order?.orderNumber || ""
      ).toLowerCase();

      const customerName = `${order?.customer?.firstName || ""} ${
        order?.customer?.lastName || ""
      }`
        .trim()
        .toLowerCase();

      const customerEmail = String(
        order?.customer?.email || ""
      ).toLowerCase();

      const matchesSearch =
        !searchValue ||
        orderId.includes(searchValue) ||
        orderNumber.includes(searchValue) ||
        customerName.includes(searchValue) ||
        customerEmail.includes(searchValue);

      const currentStatus =
        order?.orderStatus || "pending";

      const matchesStatus =
        statusFilter === "all" ||
        currentStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: orders.length,

      pending: orders.filter(
        (order) =>
          (order?.orderStatus || "pending") ===
          "pending"
      ).length,

      processing: orders.filter(
        (order) =>
          (order?.orderStatus || "pending") ===
          "processing"
      ).length,

      shipped: orders.filter(
        (order) =>
          (order?.orderStatus || "pending") ===
          "shipped"
      ).length,

      delivered: orders.filter(
        (order) =>
          (order?.orderStatus || "pending") ===
          "delivered"
      ).length,
    };
  }, [orders]);

  function getCustomerName(order) {
    const name = `${order?.customer?.firstName || ""} ${
      order?.customer?.lastName || ""
    }`.trim();

    return name || "Customer";
  }

  function getStatusClasses(status) {
    switch (status) {
      case "confirmed":
        return "border-cyan-200 bg-cyan-50 text-cyan-700";

      case "processing":
        return "border-blue-200 bg-blue-50 text-blue-700";

      case "shipped":
        return "border-purple-200 bg-purple-50 text-purple-700";

      case "delivered":
        return "border-emerald-200 bg-emerald-50 text-emerald-700";

      case "cancelled":
        return "border-red-200 bg-red-50 text-red-700";

      default:
        return "border-amber-200 bg-amber-50 text-amber-700";
    }
  }

  function getStatusIcon(status) {
    switch (status) {
      case "confirmed":
        return <CheckCircle2 size={15} />;

      case "processing":
        return <Package size={15} />;

      case "shipped":
        return <Truck size={15} />;

      case "delivered":
        return <CheckCircle2 size={15} />;

      case "cancelled":
        return <XCircle size={15} />;

      default:
        return <Clock3 size={15} />;
    }
  }

  function formatStatus(status) {
    return String(status || "pending")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                <ShoppingBag size={21} />
              </div>

              <span className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Administration
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Order Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
              Review customer orders, monitor delivery progress,
              and manage order status from one place.
            </p>
          </div>

          <button
            type="button"
            onClick={loadOrders}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={
                loading ? "animate-spin" : ""
              }
            />

            Refresh Orders
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* STATS */}
        <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Total Orders
              </span>

              <ShoppingBag
                size={19}
                className="text-slate-400"
              />
            </div>

            <p className="text-3xl font-bold text-slate-950">
              {stats.total}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Pending
              </span>

              <Clock3
                size={19}
                className="text-amber-500"
              />
            </div>

            <p className="text-3xl font-bold text-slate-950">
              {stats.pending}
            </p>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Processing
              </span>

              <Package
                size={19}
                className="text-blue-500"
              />
            </div>

            <p className="text-3xl font-bold text-slate-950">
              {stats.processing}
            </p>
          </div>

          <div className="rounded-2xl border border-purple-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Shipped
              </span>

              <Truck
                size={19}
                className="text-purple-500"
              />
            </div>

            <p className="text-3xl font-bold text-slate-950">
              {stats.shipped}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm col-span-2 lg:col-span-1">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Delivered
              </span>

              <CheckCircle2
                size={19}
                className="text-emerald-500"
              />
            </div>

            <p className="text-3xl font-bold text-slate-950">
              {stats.delivered}
            </p>
          </div>
        </div>

        {/* FILTERS */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search order, customer, or email..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
              />
            </div>

            <div className="relative lg:w-64">
              <Filter
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
              >
                <option value="all">
                  All Statuses
                </option>

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
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-800">
                {filteredOrders.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800">
                {orders.length}
              </span>{" "}
              orders
            </p>

            {(search || statusFilter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                }}
                className="text-sm font-semibold text-slate-700 hover:text-slate-950"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* ORDERS TABLE */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-950">
              Customer Orders
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage order progress and payment information.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Order
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Customer
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Total
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Payment
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Update
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-14 text-center"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <RefreshCw
                          size={24}
                          className="mb-3 animate-spin text-slate-400"
                        />

                        <p className="text-sm font-medium text-slate-600">
                          Loading orders...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-14 text-center"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                          <ShoppingBag
                            size={25}
                            className="text-slate-400"
                          />
                        </div>

                        <h3 className="font-semibold text-slate-900">
                          No orders found
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Try changing your search or filter.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const status =
                      order?.orderStatus ||
                      "pending";

                    const customerName =
                      getCustomerName(order);

                    return (
                      <tr
                        key={order._id}
                        className="transition hover:bg-slate-50/80"
                      >
                        {/* ORDER */}
                        <td className="px-5 py-5">
                          <div>
                            <p className="font-semibold text-slate-950">
                              #
                              {String(
                                order?.orderNumber ||
                                  order?._id ||
                                  ""
                              ).slice(-10)}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {order?.createdAt
                                ? new Date(
                                    order.createdAt
                                  ).toLocaleDateString()
                                : "—"}
                            </p>
                          </div>
                        </td>

                        {/* CUSTOMER */}
                        <td className="px-5 py-5">
                          <div>
                            <p className="font-medium text-slate-900">
                              {customerName}
                            </p>

                            {order?.customer?.email && (
                              <p className="mt-1 text-xs text-slate-500">
                                {order.customer.email}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* TOTAL */}
                        <td className="px-5 py-5">
                          <p className="font-bold text-slate-950">
                            PKR{" "}
                            {Number(
                              order?.total || 0
                            ).toLocaleString()}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {Array.isArray(
                              order?.items
                            )
                              ? order.items.length
                              : 0}{" "}
                            item
                            {Array.isArray(
                              order?.items
                            ) &&
                            order.items.length !== 1
                              ? "s"
                              : ""}
                          </p>
                        </td>

                        {/* STATUS */}
                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                              status
                            )}`}
                          >
                            {getStatusIcon(status)}
                            {formatStatus(status)}
                          </span>
                        </td>

                        {/* PAYMENT */}
                        <td className="px-5 py-5">
                          <div>
                            <p className="text-sm font-semibold capitalize text-slate-800">
                              {String(
                                order?.paymentStatus ||
                                  "pending"
                              ).replace(
                                /_/g,
                                " "
                              )}
                            </p>

                            <p className="mt-1 text-xs capitalize text-slate-400">
                              {String(
                                order?.paymentMethod ||
                                  "—"
                              ).replace(
                                /_/g,
                                " "
                              )}
                            </p>
                          </div>
                        </td>

                        {/* UPDATE */}
                        <td className="px-5 py-5">
                          <select
                            value={status}
                            onChange={(event) =>
                              updateStatus(
                                order._id,
                                event.target.value
                              )
                            }
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-slate-500"
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
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MOBILE NOTE */}
        <p className="mt-4 text-center text-xs text-slate-400 lg:hidden">
          Swipe horizontally to view all order details.
        </p>
      </div>
    </main>
  );
}