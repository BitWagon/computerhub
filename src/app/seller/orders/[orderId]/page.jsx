"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
      return <CheckCircle size={18} />;
    case "shipped":
      return <Truck size={18} />;
    case "processing":
      return <Package size={18} />;
    case "cancelled":
      return <XCircle size={18} />;
    default:
      return <Clock size={18} />;
  }
}

function getStatusClass(status) {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-700";
    case "shipped":
      return "bg-blue-100 text-blue-700";
    case "processing":
      return "bg-purple-100 text-purple-700";
    case "confirmed":
      return "bg-indigo-100 text-indigo-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

function formatStatus(status) {
  if (!status) return "Pending";

  return status
    .charAt(0)
    .toUpperCase() + status.slice(1);
}

export default function SellerOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();

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

      const response = await fetch("/api/orders", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to load order."
        );
      }

      const orders = Array.isArray(data)
        ? data
        : data?.orders || [];

      const foundOrder = orders.find(
        (item) => String(item._id) === String(orderId)
      );

      if (!foundOrder) {
        throw new Error(
          "Order not found or you do not have access to this order."
        );
      }

      setOrder(foundOrder);
    } catch (err) {
      console.error("Fetch seller order error:", err);
      setError(err.message || "Failed to load order.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  async function updateOrderStatus(newStatus) {
    if (!order?._id) return;

    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          orderId: order._id,
          orderStatus: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to update order status."
        );
      }

      setOrder((current) => ({
        ...current,
        orderStatus: newStatus,
      }));

      setSuccess("Order status updated successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Update order status error:", err);
      setError(
        err.message || "Failed to update order status."
      );
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <RefreshCw
                className="mx-auto mb-3 animate-spin text-gray-500"
                size={32}
              />
              <p className="text-gray-600">
                Loading order...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/seller/orders"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={18} />
            Back to Orders
          </Link>

          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const sellerSubtotal =
    Number(order.sellerSubtotal ?? order.total ?? 0);

  const customer = order.customer || {};
  const items = Array.isArray(order.items)
    ? order.items
    : [];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/seller/orders"
              className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={18} />
              Back to Orders
            </Link>

            <h1 className="text-2xl font-bold text-gray-900">
              Order Details
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {order.orderNumber || order._id}
            </p>
          </div>

          <button
            onClick={fetchOrder}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* Messages */}
        {success && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Top information */}
        <div className="mb-6 grid gap-5 md:grid-cols-3">
          {/* Order status */}
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-gray-500">
              <Package size={19} />
              <span className="text-sm font-medium">
                Order Status
              </span>
            </div>

            <div
              className={`mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${getStatusClass(
                order.orderStatus
              )}`}
            >
              {getStatusIcon(order.orderStatus)}
              {formatStatus(order.orderStatus)}
            </div>

            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500">
              Update Status
            </label>

            <select
              value={order.orderStatus || "pending"}
              onChange={(e) =>
                updateOrderStatus(e.target.value)
              }
              disabled={updating}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-500"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {formatStatus(status)}
                </option>
              ))}
            </select>

            {updating && (
              <p className="mt-2 text-xs text-gray-500">
                Updating...
              </p>
            )}
          </div>

          {/* Order date */}
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-gray-500">
              <Calendar size={19} />
              <span className="text-sm font-medium">
                Order Date
              </span>
            </div>

            <p className="text-lg font-semibold text-gray-900">
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString(
                    "en-PK",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )
                : "N/A"}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {order.createdAt
                ? new Date(order.createdAt).toLocaleTimeString(
                    "en-PK",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )
                : ""}
            </p>
          </div>

          {/* Seller sales */}
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-gray-500">
              <CreditCard size={19} />
              <span className="text-sm font-medium">
                Your Sales
              </span>
            </div>

            <p className="text-2xl font-bold text-gray-900">
              Rs. {sellerSubtotal.toLocaleString()}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Your products in this order
            </p>
          </div>
        </div>

        {/* Customer + Payment */}
        <div className="mb-6 grid gap-5 md:grid-cols-2">
          {/* Customer */}
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <User size={20} className="text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Customer Information
              </h2>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Name
                </p>
                <p className="mt-1 font-medium text-gray-900">
                  {customer.firstName || ""}{" "}
                  {customer.lastName || ""}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Email
                </p>
                <p className="mt-1 text-gray-700">
                  {customer.email || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Phone
                </p>
                <p className="mt-1 text-gray-700">
                  {customer.phone || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping + Payment */}
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <MapPin size={20} className="text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Shipping & Payment
              </h2>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Shipping Address
                </p>

                <p className="mt-1 text-gray-700">
                  {customer.address || "N/A"}
                </p>

                <p className="text-gray-700">
                  {customer.city || ""}
                  {customer.postalCode
                    ? `, ${customer.postalCode}`
                    : ""}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Payment Method
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {String(
                    order.paymentMethod || "cod"
                  ).toUpperCase()}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Payment Status
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {formatStatus(
                    order.paymentStatus || "pending"
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="border-b p-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Your Products
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Products from this order that belong to your store.
            </p>
          </div>

          {items.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              No products found in this order.
            </div>
          ) : (
            <div className="divide-y">
              {items.map((item, index) => {
                const price = Number(item.price || 0);
                const quantity = Number(
                  item.quantity || 0
                );

                const subtotal = Number(
                  item.subtotal ??
                    price * quantity
                );

                return (
                  <div
                    key={`${item.productId || "item"}-${index}`}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-gray-100">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name || "Product"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-400">
                            <Package size={24} />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-gray-900">
                          {item.name || "Unnamed Product"}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Product ID:{" "}
                          {item.productId || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 text-sm sm:min-w-[330px]">
                      <div>
                        <p className="text-xs text-gray-500">
                          Price
                        </p>
                        <p className="mt-1 font-medium text-gray-900">
                          Rs. {price.toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Quantity
                        </p>
                        <p className="mt-1 font-medium text-gray-900">
                          {quantity}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Subtotal
                        </p>
                        <p className="mt-1 font-semibold text-gray-900">
                          Rs.{" "}
                          {subtotal.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Total */}
          <div className="border-t bg-gray-50 p-5">
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-gray-900">
                Your Total Sales
              </span>

              <span className="text-xl font-bold text-gray-900">
                Rs. {sellerSubtotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}