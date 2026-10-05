"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Calendar,
  RefreshCw,
  CheckCircle,
  Truck,
  Clock,
  XCircle,
} from "lucide-react";

const STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

function getStatusIcon(status) {
  switch (status) {
    case "delivered":
      return <CheckCircle size={17} />;
    case "shipped":
      return <Truck size={17} />;
    case "processing":
      return <Package size={17} />;
    case "cancelled":
      return <XCircle size={17} />;
    default:
      return <Clock size={17} />;
  }
}

function getStatusClass(status) {
  switch (status) {
    case "delivered":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "shipped":
      return "bg-blue-50 text-blue-700 ring-blue-200";
    case "processing":
      return "bg-violet-50 text-violet-700 ring-violet-200";
    case "confirmed":
      return "bg-indigo-50 text-indigo-700 ring-indigo-200";
    case "cancelled":
      return "bg-red-50 text-red-700 ring-red-200";
    default:
      return "bg-amber-50 text-amber-700 ring-amber-200";
  }
}

function formatStatus(status) {
  if (!status) return "Pending";

  return (
    status.charAt(0).toUpperCase() +
    status.slice(1)
  );
}

function formatDate(value) {
  if (!value) return "N/A";

  return new Date(value).toLocaleDateString(
    "en-PK",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function formatTime(value) {
  if (!value) return "";

  return new Date(value).toLocaleTimeString(
    "en-PK",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

export default function SellerOrderDetailsPage() {
  const params = useParams();

  /*
   * IMPORTANT:
   * The folder is [orderId], so the correct
   * parameter is params.orderId.
   */
  const orderId = params?.orderId;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function fetchOrder() {
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
        throw new Error(
          data?.message ||
            "Failed to load order."
        );
      }

      const orders = Array.isArray(data)
        ? data
        : Array.isArray(data?.orders)
        ? data.orders
        : [];

      const foundOrder = orders.find(
        (item) =>
          String(item._id) ===
          String(orderId)
      );

      if (!foundOrder) {
        throw new Error(
          "Order not found or you do not have access to this order."
        );
      }

      setOrder(foundOrder);
    } catch (err) {
      console.error(
        "Fetch seller order error:",
        err
      );

      setError(
        err?.message ||
          "Failed to load order."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  async function updateOrderStatus(
    newStatus
  ) {
    if (!order?._id) return;

    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        "/api/orders",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            orderId: order._id,
            orderStatus: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to update order status."
        );
      }

      setOrder((current) => ({
        ...current,
        orderStatus: newStatus,
      }));

      setSuccess(
        "Order status updated successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(
        "Update order status error:",
        err
      );

      setError(
        err?.message ||
          "Failed to update order status."
      );
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex min-h-[420px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                  <RefreshCw
                    size={25}
                    className="animate-spin text-slate-500"
                  />
                </div>

                <h2 className="text-lg font-semibold text-slate-900">
                  Loading order
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Please wait while we load the order details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error && !order) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            href="/seller/orders"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950"
          >
            <ArrowLeft size={17} />
            Back to Orders
          </Link>

          <div className="rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <XCircle size={24} />
            </div>

            <h1 className="text-xl font-bold text-slate-900">
              Unable to load order
            </h1>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

            <button
              onClick={fetchOrder}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!order) {
    return null;
  }

  const sellerSubtotal = Number(
    order.sellerSubtotal ??
      order.total ??
      0
  );

  const customer =
    order.customer || {};

  const items = Array.isArray(
    order.items
  )
    ? order.items
    : [];

  const status =
    order.orderStatus || "pending";

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <Link
                href="/seller/orders"
                className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
              >
                <ArrowLeft size={17} />
                Back to Orders
              </Link>

              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                  Order Details
                </h1>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  Seller Center
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Order #
                {order.orderNumber ||
                  String(order._id).slice(-8)}
              </p>
            </div>

            <button
              onClick={fetchOrder}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />
              Refresh Order
            </button>
          </div>
        </div>

        {/* Messages */}
        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            <CheckCircle size={18} />
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            <XCircle size={18} />
            {error}
          </div>
        )}

        {/* Summary */}
        <div className="mb-6 grid gap-5 md:grid-cols-3">

          {/* Status */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Order Status
                </p>

                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  Current Status
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                <Package size={21} />
              </div>
            </div>

            <div
              className={`mb-5 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-bold ring-1 ${getStatusClass(
                status
              )}`}
            >
              {getStatusIcon(status)}
              {formatStatus(status)}
            </div>

            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
              Update Status
            </label>

            <select
              value={status}
              onChange={(event) =>
                updateOrderStatus(
                  event.target.value
                )
              }
              disabled={updating}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            >
              {STATUS_OPTIONS.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {formatStatus(item)}
                  </option>
                )
              )}
            </select>

            {updating && (
              <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-500">
                <RefreshCw
                  size={13}
                  className="animate-spin"
                />
                Updating order status...
              </div>
            )}
          </div>

          {/* Date */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Order Date
                </p>

                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  Purchase Time
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                <Calendar size={21} />
              </div>
            </div>

            <p className="text-xl font-bold text-slate-950">
              {formatDate(
                order.createdAt
              )}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              {formatTime(
                order.createdAt
              )}
            </p>
          </div>

          {/* Sales */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Your Sales
                </p>

                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  Seller Revenue
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                <CreditCard size={21} />
              </div>
            </div>

            <p className="text-2xl font-black tracking-tight text-slate-950">
              Rs.{" "}
              {sellerSubtotal.toLocaleString()}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Revenue from your products
            </p>
          </div>
        </div>

        {/* Customer / Shipping */}
        <div className="mb-6 grid gap-5 lg:grid-cols-2">

          {/* Customer */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                <User size={20} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Customer
                </p>

                <h2 className="text-lg font-bold text-slate-900">
                  Customer Information
                </h2>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Name
                </p>

                <p className="mt-1.5 font-semibold text-slate-900">
                  {customer.firstName ||
                    customer.lastName
                    ? `${customer.firstName || ""} ${
                        customer.lastName || ""
                      }`.trim()
                    : "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Phone
                </p>

                <p className="mt-1.5 font-semibold text-slate-900">
                  {customer.phone ||
                    "N/A"}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Email
                </p>

                <p className="mt-1.5 break-all text-sm font-medium text-slate-700">
                  {customer.email ||
                    "N/A"}
                </p>
              </div>
            </div>
          </section>

          {/* Shipping / Payment */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                <MapPin size={20} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Fulfillment
                </p>

                <h2 className="text-lg font-bold text-slate-900">
                  Shipping & Payment
                </h2>
              </div>
            </div>

            <div className="space-y-5">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Shipping Address
                </p>

                <p className="mt-1.5 text-sm font-medium leading-6 text-slate-700">
                  {customer.address ||
                    "N/A"}
                  {customer.city
                    ? `, ${customer.city}`
                    : ""}
                  {customer.postalCode
                    ? `, ${customer.postalCode}`
                    : ""}
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Payment Method
                  </p>

                  <p className="mt-1.5 font-semibold text-slate-900">
                    {String(
                      order.paymentMethod ||
                        "cod"
                    ).toUpperCase()}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Payment Status
                  </p>

                  <p className="mt-1.5 font-semibold text-slate-900">
                    {formatStatus(
                      order.paymentStatus ||
                        "pending"
                    )}
                  </p>
                </div>

              </div>
            </div>
          </section>
        </div>

        {/* Products */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Order Items
                </p>

                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  Your Products
                </h2>
              </div>

              <p className="text-sm text-slate-500">
                {items.length}{" "}
                {items.length === 1
                  ? "product"
                  : "products"}
              </p>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Only products belonging to your store are shown here.
            </p>
          </div>

          {items.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Package size={25} />
              </div>

              <h3 className="font-semibold text-slate-900">
                No products found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                There are no seller products available in this order.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {items.map(
                (item, index) => {
                  const price = Number(
                    item.price || 0
                  );

                  const quantity =
                    Number(
                      item.quantity || 0
                    );

                  const subtotal =
                    Number(
                      item.subtotal ??
                        price *
                          quantity
                    );

                  return (
                    <div
                      key={`${item.productId || "item"}-${index}`}
                      className="p-5 sm:p-6"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                        <div className="flex min-w-0 items-center gap-4">

                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
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
                              <div className="flex h-full w-full items-center justify-center text-slate-400">
                                <Package
                                  size={27}
                                />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <h3 className="line-clamp-2 font-bold text-slate-900">
                              {item.name ||
                                "Unnamed Product"}
                            </h3>

                            <p className="mt-1.5 break-all text-xs text-slate-400">
                              Product ID:{" "}
                              {item.productId ||
                                "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 rounded-2xl bg-slate-50 p-4 lg:min-w-[390px]">
                          <div>
                            <p className="text-xs font-medium text-slate-400">
                              Price
                            </p>

                            <p className="mt-1 text-sm font-bold text-slate-900">
                              Rs.{" "}
                              {price.toLocaleString()}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-medium text-slate-400">
                              Quantity
                            </p>

                            <p className="mt-1 text-sm font-bold text-slate-900">
                              {quantity}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-medium text-slate-400">
                              Subtotal
                            </p>

                            <p className="mt-1 text-sm font-bold text-slate-900">
                              Rs.{" "}
                              {subtotal.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}

          {/* Total */}
          <div className="border-t border-slate-200 bg-slate-50 px-6 py-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Seller Total
                </p>

                <p className="mt-1 font-bold text-slate-900">
                  Your Total Sales
                </p>
              </div>

              <p className="text-2xl font-black tracking-tight text-slate-950">
                Rs.{" "}
                {sellerSubtotal.toLocaleString()}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}