"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params?.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) {
      return;
    }

    async function loadOrder() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/orders/${encodeURIComponent(orderId)}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = `/login?redirect=/orders/${orderId}`;
            return;
          }

          throw new Error(
            data?.message || "Failed to load order."
          );
        }

        setOrder(data?.order || null);
      } catch (error) {
        console.error("Order details error:", error);

        setError(
          error?.message || "Unable to load this order."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderId]);

  function formatDate(date) {
    if (!date) {
      return "—";
    }

    try {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "—";
    }
  }

  function formatMoney(value) {
    return Number(value || 0).toLocaleString("en-PK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function getStatusClasses(status) {
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

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container-main">
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

              <p className="mt-4 text-sm text-gray-500">
                Loading order...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container-main">
          <div className="mx-auto max-w-2xl rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm md:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
              <Package
                size={40}
                className="text-red-500"
              />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-gray-900">
              Order Not Found
            </h1>

            <p className="mt-3 text-gray-500">
              {error || "We could not find this order."}
            </p>

            <Link
              href="/orders"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              <ArrowLeft size={18} />
              Back to Orders
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const customer = order.customer || {};

  const items = Array.isArray(order.items)
    ? order.items
    : [];

  const customerName =
    [customer.firstName, customer.lastName]
      .filter(Boolean)
      .join(" ") || "—";

  const subtotal = Number(order.subtotal || 0);

  const deliveryFee = Number(
    order.deliveryFee || 0
  );

  const total = Number(
    order.total || subtotal + deliveryFee
  );

  const statusOrder = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
  ];

  const currentIndex = statusOrder.indexOf(
    order.orderStatus
  );

  return (
    <main className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="container-main">
        {/* BACK */}

        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to My Orders
        </Link>

        {/* HEADER */}

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Order Details
              </p>

              <h1 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">
                {order.orderNumber || "Order"}
              </h1>

              <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={16} />
                  {formatDate(order.createdAt)}
                </span>

                <span>
                  {items.length}{" "}
                  {items.length === 1
                    ? "product"
                    : "products"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <span
                className={`rounded-full px-4 py-2 text-sm font-bold capitalize ${getStatusClasses(
                  order.orderStatus
                )}`}
              >
                {order.orderStatus || "pending"}
              </span>
            </div>
          </div>
        </div>

        {/* ORDER STATUS */}

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <Truck
                size={20}
                className="text-blue-600"
              />
            </div>

            <div>
              <h2 className="font-bold text-gray-900">
                Order Status
              </h2>

              <p className="text-sm capitalize text-gray-500">
                {order.orderStatus || "pending"}
              </p>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-4 md:grid-cols-5">
            {statusOrder.map((status, index) => {
              const active =
                currentIndex >= index &&
                order.orderStatus !== "cancelled";

              return (
                <div
                  key={status}
                  className="text-center"
                >
                  <div
                    className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full ${
                      active
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {active ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <span className="text-xs font-bold">
                        {index + 1}
                      </span>
                    )}
                  </div>

                  <p
                    className={`mt-2 text-xs font-semibold capitalize ${
                      active
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  >
                    {status}
                  </p>
                </div>
              );
            })}
          </div>

          {order.orderStatus === "cancelled" && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-700">
                This order has been cancelled.
              </p>
            </div>
          )}
        </div>

        {/* MAIN CONTENT */}

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* PRODUCTS */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center justify-between border-b border-gray-200 pb-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Ordered Products
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Products included in this order.
                </p>
              </div>

              <Package
                size={24}
                className="text-blue-600"
              />
            </div>

            <div className="divide-y divide-gray-100">
              {items.map((item, index) => {
                const image =
                  item.image ||
                  item.images?.[0] ||
                  "";

                const price = Number(
                  item.price || 0
                );

                const quantity = Math.max(
                  1,
                  Number(item.quantity || 1)
                );

                const itemTotal = Number(
                  item.subtotal ||
                    price * quantity
                );

                return (
                  <div
                    key={
                      item.productId || index
                    }
                    className="flex gap-4 py-5"
                  >
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                      {image ? (
                        <img
                          src={image}
                          alt={
                            item.name ||
                            "Product"
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package
                          size={30}
                          className="text-gray-300"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.name || "Product"}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Quantity: {quantity}
                      </p>

                      <p className="mt-2 text-sm text-gray-500">
                        Unit Price: Rs.{" "}
                        {formatMoney(price)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        Rs.{" "}
                        {formatMoney(itemTotal)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT SIDE */}

          <div className="space-y-6">
            {/* DELIVERY */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                <MapPin
                  size={21}
                  className="text-blue-600"
                />

                <h2 className="text-lg font-bold text-gray-900">
                  Delivery Information
                </h2>
              </div>

              <div className="mt-5 space-y-4 text-sm">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Customer
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {customerName}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Email
                  </p>

                  <p className="mt-1 break-all text-gray-700">
                    {customer.email || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Phone
                  </p>

                  <p className="mt-1 text-gray-700">
                    {customer.phone || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Address
                  </p>

                  <p className="mt-1 leading-6 text-gray-700">
                    {customer.address || "—"}
                    <br />
                    {customer.city || "—"}
                    <br />
                    {customer.postalCode || ""}
                  </p>
                </div>
              </div>
            </div>

            {/* PAYMENT */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                <ShieldCheck
                  size={21}
                  className="text-green-600"
                />

                <h2 className="text-lg font-bold text-gray-900">
                  Payment
                </h2>
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-gray-500">
                    Method
                  </span>

                  <span className="text-right font-semibold capitalize text-gray-900">
                    {order.paymentMethod ===
                    "cod"
                      ? "Cash on Delivery"
                      : order.paymentMethod ||
                        "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-gray-500">
                    Status
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                      order.paymentStatus ===
                      "paid"
                        ? "bg-green-100 text-green-700"
                        : order.paymentStatus ===
                          "failed"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.paymentStatus ||
                      "pending"}
                  </span>
                </div>
              </div>
            </div>

            {/* TOTAL */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                Order Total
              </h2>

              <div className="mt-5 space-y-3 border-b border-gray-200 pb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span className="font-semibold text-gray-900">
                    Rs. {formatMoney(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Delivery
                  </span>

                  <span className="font-semibold text-gray-900">
                    {deliveryFee === 0
                      ? "FREE"
                      : `Rs. ${formatMoney(
                          deliveryFee
                        )}`}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">
                  Total
                </span>

                <span className="text-2xl font-bold text-blue-600">
                  Rs. {formatMoney(total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/orders"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <ArrowLeft size={18} />
            Back to My Orders
          </Link>

          <Link
            href="/products"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}