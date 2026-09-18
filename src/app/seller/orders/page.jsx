"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Eye,
  Loader2,
  Package,
  RefreshCw,
  Search,
  Truck,
  XCircle,
} from "lucide-react";

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");
  const [refreshing, setRefreshing] =
    useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders(showRefresh = false) {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setIsLoading(true);
      }

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
        throw new Error(
          data.message ||
            "Unable to load orders."
        );
      }

      setOrders(
        Array.isArray(data.orders)
          ? data.orders
          : []
      );
    } catch (err) {
      console.error(
        "Load seller orders error:",
        err
      );

      setError(
        err.message ||
          "Unable to load orders."
      );
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }

  const filteredOrders = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return orders.filter((order) => {
      const customerName =
        `${order.customer?.firstName || ""} ${
          order.customer?.lastName || ""
        }`
          .trim()
          .toLowerCase();

      const orderNumber =
        String(
          order.orderNumber || ""
        ).toLowerCase();

      const email =
        String(
          order.customer?.email || ""
        ).toLowerCase();

      const matchesSearch =
        !query ||
        orderNumber.includes(query) ||
        customerName.includes(query) ||
        email.includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        order.orderStatus ===
          statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    orders,
    search,
    statusFilter,
  ]);

  const totalOrders = orders.length;

  const pendingOrders =
    orders.filter(
      (order) =>
        order.orderStatus ===
        "pending"
    ).length;

  const processingOrders =
    orders.filter(
      (order) =>
        order.orderStatus ===
          "confirmed" ||
        order.orderStatus ===
          "processing"
    ).length;

  const shippedOrders =
    orders.filter(
      (order) =>
        order.orderStatus ===
        "shipped"
    ).length;

  const deliveredOrders =
    orders.filter(
      (order) =>
        order.orderStatus ===
        "delivered"
    ).length;

  const cancelledOrders =
    orders.filter(
      (order) =>
        order.orderStatus ===
        "cancelled"
    ).length;

  const totalSellerSales = orders.reduce(
    (sum, order) =>
      sum +
      Number(
        order.sellerSubtotal ??
          order.total ??
          0
      ),
    0
  );

  function getStatusLabel(status) {
    const labels = {
      pending: "Pending",
      confirmed: "Confirmed",
      processing: "Processing",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
    };

    return (
      labels[status] ||
      status ||
      "Pending"
    );
  }

  function getStatusClasses(status) {
    const classes = {
      pending:
        "bg-yellow-50 text-yellow-700",
      confirmed:
        "bg-blue-50 text-blue-700",
      processing:
        "bg-indigo-50 text-indigo-700",
      shipped:
        "bg-purple-50 text-purple-700",
      delivered:
        "bg-green-50 text-green-700",
      cancelled:
        "bg-red-50 text-red-700",
    };

    return (
      classes[status] ||
      "bg-gray-100 text-gray-700"
    );
  }

  function getStatusIcon(status) {
    if (status === "delivered") {
      return (
        <CheckCircle2 size={14} />
      );
    }

    if (status === "shipped") {
      return <Truck size={14} />;
    }

    if (status === "cancelled") {
      return <XCircle size={14} />;
    }

    if (
      status === "processing" ||
      status === "confirmed"
    ) {
      return <Package size={14} />;
    }

    return <Clock3 size={14} />;
  }

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
      undefined,
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  }

  function formatTime(date) {
    if (!date) {
      return "";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "";
    }

    return parsedDate.toLocaleTimeString(
      undefined,
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
  }

  function getSellerSubtotal(order) {
    if (
      order.sellerSubtotal !==
      undefined
    ) {
      return Number(
        order.sellerSubtotal || 0
      );
    }

    return Number(
      order.total || 0
    );
  }

  function OrderCard({ order }) {
    const customerName =
      `${order.customer?.firstName || ""} ${
        order.customer?.lastName || ""
      }`.trim() ||
      "Customer";

    const itemCount =
      Array.isArray(order.items)
        ? order.items.reduce(
            (sum, item) =>
              sum +
              Number(
                item.quantity || 0
              ),
            0
          )
        : 0;

    const sellerSubtotal =
      getSellerSubtotal(order);

    const status =
      order.orderStatus ||
      "pending";

    return (
      <div className="border-b border-gray-100 p-5 last:border-b-0">
        <div className="flex flex-col gap-5">
          {/* Top row */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-lg font-bold text-gray-900">
                  #
                  {order.orderNumber ||
                    order._id}
                </h3>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                    status
                  )}`}
                >
                  {getStatusIcon(
                    status
                  )}

                  {getStatusLabel(
                    status
                  )}
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-500">
                {formatDate(
                  order.createdAt
                )}

                {formatTime(
                  order.createdAt
                ) && (
                  <>
                    {" "}
                    at{" "}
                    {formatTime(
                      order.createdAt
                    )}
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/seller/orders/${order._id}`}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
              >
                <Eye size={16} />
                View
              </Link>
            </div>
          </div>

          {/* Order details */}
          <div className="grid grid-cols-1 gap-4 rounded-xl bg-gray-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Customer
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {customerName}
              </p>

              {order.customer?.email && (
                <p className="mt-1 break-all text-xs text-gray-500">
                  {order.customer.email}
                </p>
              )}
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Items
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {itemCount}{" "}
                {itemCount === 1
                  ? "item"
                  : "items"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Your Sales
              </p>

              <p className="mt-1 text-lg font-bold text-gray-900">
                $
                {sellerSubtotal.toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Payment
              </p>

              <p className="mt-1 font-semibold capitalize text-gray-900">
                {order.paymentMethod ===
                "cod"
                  ? "Cash on Delivery"
                  : order.paymentMethod ||
                    "—"}
              </p>

              <p
                className={`mt-1 text-xs font-medium capitalize ${
                  order.paymentStatus ===
                  "paid"
                    ? "text-green-600"
                    : order.paymentStatus ===
                      "failed"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {order.paymentStatus ||
                  "pending"}
              </p>
            </div>
          </div>

          {/* Products */}
          {Array.isArray(
            order.items
          ) &&
            order.items.length > 0 && (
              <div>
                <p className="mb-3 text-sm font-bold text-gray-900">
                  Your Products
                </p>

                <div className="flex flex-col gap-3">
                  {order.items.map(
                    (item, index) => (
                      <div
                        key={`${order._id}-${item.productId}-${index}`}
                        className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3"
                      >
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={
                                item.name ||
                                "Product"
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package
                              size={22}
                              className="text-gray-400"
                            />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm font-semibold text-gray-900">
                            {item.name ||
                              "Product"}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            Qty:{" "}
                            {item.quantity ||
                              0}{" "}
                            × $
                            {Number(
                              item.price ||
                                0
                            ).toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </p>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="text-sm font-bold text-gray-900">
                            $
                            {Number(
                              item.subtotal ||
                                0
                            ).toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link
              href="/seller"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700"
            >
              <ArrowLeft size={17} />
              Back to Seller Dashboard
            </Link>

            <h1 className="text-3xl font-bold text-gray-900">
              Seller Orders
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              View and manage orders containing
              your products.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              loadOrders(true)
            }
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {refreshing ? (
              <Loader2
                size={18}
                className="animate-spin"
              />
            ) : (
              <RefreshCw size={18} />
            )}

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <XCircle
              size={20}
              className="shrink-0 text-red-600"
            />

            <p className="text-sm font-semibold text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* Statistics */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Total */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Orders
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {totalOrders}
            </p>
          </div>

          {/* Pending */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Pending
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {pendingOrders}
            </p>
          </div>

          {/* Processing */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Processing
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {processingOrders}
            </p>
          </div>

          {/* Shipped */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Shipped
            </p>

            <p className="mt-2 text-3xl font-bold text-purple-600">
              {shippedOrders}
            </p>
          </div>

          {/* Delivered */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Delivered
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {deliveredOrders}
            </p>
          </div>
        </div>

        {/* Sales Summary */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Your Order Sales
              </p>

              <p className="mt-1 text-3xl font-bold text-gray-900">
                $
                {totalSellerSales.toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </p>
            </div>

            <div className="text-sm text-gray-500">
              Based on the orders currently shown
              by your seller account.
            </div>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search by order number, customer name or email..."
                className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 lg:w-56"
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

        {/* Orders */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Orders
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {filteredOrders.length} order
                  {filteredOrders.length === 1
                    ? ""
                    : "s"} shown
                </p>
              </div>

              <Package
                className="text-blue-600"
                size={24}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <Loader2
                size={38}
                className="mx-auto animate-spin text-blue-600"
              />

              <p className="mt-4 text-sm text-gray-500">
                Loading your orders...
              </p>
            </div>
          ) : filteredOrders.length ===
            0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <Package size={28} />
              </div>

              <h3 className="mt-4 text-lg font-bold text-gray-900">
                No orders found
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                {search ||
                statusFilter !==
                  "all"
                  ? "Try changing your search or status filter."
                  : "Orders containing your products will appear here."}
              </p>
            </div>
          ) : (
            <div>
              {filteredOrders.map(
                (order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                  />
                )
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}