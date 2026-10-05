"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  Truck,
  XCircle,
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
          `/api/orders/${encodeURIComponent(
            orderId
          )}`,
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
              `/login?redirect=/orders/${orderId}`;

            return;
          }

          throw new Error(
            data?.message ||
              "Failed to load order."
          );
        }

        setOrder(data?.order || null);
      } catch (error) {
        console.error(
          "Order details error:",
          error
        );

        setError(
          error?.message ||
            "Unable to load this order."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderId]);

  function formatDate(date) {
    if (!date) return "—";

    try {
      return new Date(date).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
    } catch {
      return "—";
    }
  }

  function formatMoney(value) {
    return Number(value || 0).toLocaleString(
      "en-PK",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  }

  function getStatusClasses(status) {
    switch (status) {
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "shipped":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "processing":
        return "bg-purple-50 text-purple-700 border-purple-200";

      case "confirmed":
        return "bg-cyan-50 text-cyan-700 border-cyan-200";

      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  }

  function getStatusIcon(status) {
    switch (status) {
      case "delivered":
        return CheckCircle2;

      case "shipped":
        return Truck;

      case "processing":
        return Clock3;

      case "cancelled":
        return XCircle;

      default:
        return Package;
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="container-main flex min-h-[70vh] items-center justify-center">
          <div className="rounded-3xl border border-slate-200 bg-white px-10 py-9 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
              <Package
                size={24}
                className="animate-pulse text-blue-600"
              />
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-600">
              Loading order details...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="container-main flex min-h-[70vh] items-center justify-center py-12">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50">
              <Package
                size={38}
                className="text-red-500"
              />
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-red-500">
              Order Center
            </p>

            <h1 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
              Order Not Found
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {error ||
                "We could not find this order."}
            </p>

            <Link
              href="/orders"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              <ArrowLeft size={17} />
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
    [
      customer.firstName,
      customer.lastName,
    ]
      .filter(Boolean)
      .join(" ") || "—";

  const subtotal = Number(
    order.subtotal || 0
  );

  const deliveryFee = Number(
    order.deliveryFee || 0
  );

  const total = Number(
    order.total ||
      subtotal + deliveryFee
  );

  const statusOrder = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
  ];

  const currentIndex =
    statusOrder.indexOf(
      order.orderStatus
    );

  const StatusIcon = getStatusIcon(
    order.orderStatus
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container-main py-8 sm:py-10 lg:py-12">

        {/* Breadcrumb */}
        <div className="mb-7 flex flex-wrap items-center gap-2 text-sm">
          <Link
            href="/"
            className="font-medium text-slate-500 hover:text-blue-600"
          >
            Home
          </Link>

          <span className="text-slate-300">
            /
          </span>

          <Link
            href="/orders"
            className="font-medium text-slate-500 hover:text-blue-600"
          >
            My Orders
          </Link>

          <span className="text-slate-300">
            /
          </span>

          <span className="font-semibold text-slate-900">
            {order.orderNumber || "Order"}
          </span>
        </div>

        {/* Header */}
        <section className="overflow-hidden rounded-3xl bg-slate-950 text-white shadow-sm">
          <div className="relative p-6 sm:p-8 lg:p-10">

            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <Link
                  href="/orders"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white"
                >
                  <ArrowLeft size={16} />
                  Back to My Orders
                </Link>

                <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-blue-400">
                  Order Details
                </p>

                <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                  {order.orderNumber ||
                    "Order"}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays size={15} />
                    {formatDate(
                      order.createdAt
                    )}
                  </span>

                  <span>
                    {items.length}{" "}
                    {items.length === 1
                      ? "product"
                      : "products"}
                  </span>
                </div>
              </div>

              <div>
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold capitalize ${getStatusClasses(
                    order.orderStatus
                  )}`}
                >
                  <StatusIcon size={16} />
                  {order.orderStatus ||
                    "pending"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Status */}
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Truck size={21} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
                Delivery Progress
              </p>

              <h2 className="mt-1 text-lg font-black text-slate-950">
                {order.orderStatus ||
                  "Pending"}
              </h2>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-y-7 md:grid-cols-5">
            {statusOrder.map(
              (status, index) => {
                const active =
                  currentIndex >= index &&
                  order.orderStatus !==
                    "cancelled";

                const isCurrent =
                  order.orderStatus ===
                  status;

                return (
                  <div
                    key={status}
                    className="relative text-center"
                  >
                    {index <
                      statusOrder.length -
                        1 && (
                      <div
                        className={`absolute left-1/2 top-5 hidden h-px w-full md:block ${
                          currentIndex > index &&
                          order.orderStatus !==
                            "cancelled"
                            ? "bg-blue-600"
                            : "bg-slate-200"
                        }`}
                      />
                    )}

                    <div
                      className={`relative mx-auto flex h-10 w-10 items-center justify-center rounded-full ${
                        active
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-400"
                      } ${
                        isCurrent
                          ? "ring-4 ring-blue-100"
                          : ""
                      }`}
                    >
                      {active ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <span className="text-xs font-black">
                          {index + 1}
                        </span>
                      )}
                    </div>

                    <p
                      className={`mt-3 text-xs font-bold capitalize ${
                        active
                          ? "text-blue-600"
                          : "text-slate-400"
                      }`}
                    >
                      {status}
                    </p>
                  </div>
                );
              }
            )}
          </div>

          {order.orderStatus ===
            "cancelled" && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
              <XCircle
                size={19}
                className="mt-0.5 shrink-0 text-red-600"
              />

              <div>
                <p className="text-sm font-black text-red-800">
                  This order has been cancelled.
                </p>

                <p className="mt-1 text-xs leading-5 text-red-700">
                  Please contact support if you need
                  assistance with this order.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Main */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">

          {/* Products */}
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 sm:px-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
                  Order Items
                </p>

                <h2 className="mt-1 text-xl font-black text-slate-950">
                  Ordered Products
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Package size={19} />
              </div>
            </div>

            <div className="divide-y divide-slate-100 px-6 sm:px-7">
              {items.map(
                (item, index) => {
                  const image =
                    item.image ||
                    item.images?.[0] ||
                    "";

                  const price = Number(
                    item.price || 0
                  );

                  const quantity = Math.max(
                    1,
                    Number(
                      item.quantity || 1
                    )
                  );

                  const itemTotal = Number(
                    item.subtotal ||
                      price * quantity
                  );

                  return (
                    <div
                      key={
                        item.productId ||
                        index
                      }
                      className="flex gap-4 py-5"
                    >
                      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
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
                            className="text-slate-300"
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-black text-slate-950">
                          {item.name ||
                            "Product"}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Quantity:{" "}
                          {quantity}
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                          Unit Price:{" "}
                          <span className="font-semibold text-slate-700">
                            PKR{" "}
                            {formatMoney(
                              price
                            )}
                          </span>
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Total
                        </p>

                        <p className="mt-1 font-black text-slate-950">
                          PKR{" "}
                          {formatMoney(
                            itemTotal
                          )}
                        </p>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </section>

          {/* Right */}
          <aside className="space-y-6">

            {/* Delivery */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <MapPin size={19} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Delivery
                  </p>

                  <h2 className="text-lg font-black text-slate-950">
                    Delivery Information
                  </h2>
                </div>
              </div>

              <div className="mt-5 space-y-4 text-sm">
                <InfoRow
                  label="Customer"
                  value={customerName}
                />

                <InfoRow
                  label="Email"
                  value={
                    customer.email || "—"
                  }
                />

                <InfoRow
                  label="Phone"
                  value={
                    customer.phone || "—"
                  }
                />

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Address
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    {customer.address ||
                      "—"}
                    <br />
                    {customer.city ||
                      "—"}
                    {customer.state
                      ? `, ${customer.state}`
                      : ""}
                    <br />
                    {customer.postalCode ||
                      ""}
                  </p>
                </div>
              </div>
            </section>

            {/* Payment */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    Payment
                  </p>

                  <h2 className="text-lg font-black text-slate-950">
                    Payment Details
                  </h2>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <InfoRow
                  label="Method"
                  value={
                    order.paymentMethod ===
                    "cod"
                      ? "Cash on Delivery"
                      : order.paymentMethod ||
                        "—"
                  }
                />

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-500">
                    Status
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                      order.paymentStatus ===
                      "paid"
                        ? "bg-emerald-50 text-emerald-700"
                        : order.paymentStatus ===
                          "failed"
                        ? "bg-red-50 text-red-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {order.paymentStatus ||
                      "pending"}
                  </span>
                </div>
              </div>
            </section>

            {/* Total */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
                Payment Summary
              </p>

              <h2 className="mt-1 text-lg font-black text-slate-950">
                Order Total
              </h2>

              <div className="mt-5 space-y-3 border-b border-slate-100 pb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">
                    Subtotal
                  </span>

                  <span className="font-semibold text-slate-900">
                    PKR{" "}
                    {formatMoney(
                      subtotal
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">
                    Delivery
                  </span>

                  <span className="font-semibold text-slate-900">
                    {deliveryFee === 0
                      ? "FREE"
                      : `PKR ${formatMoney(
                          deliveryFee
                        )}`}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-4">
                <span className="text-lg font-black text-slate-950">
                  Total
                </span>

                <span className="text-2xl font-black text-blue-600">
                  PKR{" "}
                  {formatMoney(total)}
                </span>
              </div>
            </section>
          </aside>
        </div>

        {/* Bottom */}
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <Link
            href="/orders"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to My Orders
          </Link>

          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            <ShoppingBag size={17} />
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
}