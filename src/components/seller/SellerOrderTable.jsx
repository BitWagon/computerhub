"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Package,
} from "lucide-react";

export default function SellerOrderTable({
  orders = [],
  loading = false,
}) {
  function formatDate(date) {
    if (!date) return "—";

    try {
      return new Date(
        date
      ).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  }

  function formatMoney(value) {
    return Number(
      value || 0
    ).toLocaleString("en-PK", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  function getStatusClass(status) {
    const classes = {
      pending:
        "border-amber-200 bg-amber-50 text-amber-700",

      confirmed:
        "border-cyan-200 bg-cyan-50 text-cyan-700",

      processing:
        "border-purple-200 bg-purple-50 text-purple-700",

      shipped:
        "border-blue-200 bg-blue-50 text-blue-700",

      delivered:
        "border-emerald-200 bg-emerald-50 text-emerald-700",

      cancelled:
        "border-red-200 bg-red-50 text-red-700",
    };

    return (
      classes[
        String(
          status || ""
        ).toLowerCase()
      ] ||
      "border-slate-200 bg-slate-50 text-slate-600"
    );
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex min-h-[250px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-100 border-t-blue-600" />
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-500">
              Loading recent orders...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
          <Package
            size={27}
            className="text-blue-600"
          />
        </div>

        <h3 className="mt-5 text-lg font-black text-slate-950">
          No orders yet
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          Customer orders containing your
          products will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[850px] text-left">
          <thead className="border-b border-slate-100 bg-slate-50">
            <tr>
              <th className="px-5 py-4 text-[11px] font-black uppercase tracking-wider text-slate-400">
                Order
              </th>

              <th className="px-5 py-4 text-[11px] font-black uppercase tracking-wider text-slate-400">
                Customer
              </th>

              <th className="px-5 py-4 text-[11px] font-black uppercase tracking-wider text-slate-400">
                Date
              </th>

              <th className="px-5 py-4 text-[11px] font-black uppercase tracking-wider text-slate-400">
                Items
              </th>

              <th className="px-5 py-4 text-[11px] font-black uppercase tracking-wider text-slate-400">
                Sales
              </th>

              <th className="px-5 py-4 text-[11px] font-black uppercase tracking-wider text-slate-400">
                Status
              </th>

              <th className="px-5 py-4 text-right text-[11px] font-black uppercase tracking-wider text-slate-400">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => {
              const customerName =
                [
                  order.customer?.firstName,
                  order.customer?.lastName,
                ]
                  .filter(Boolean)
                  .join(" ") ||
                "Customer";

              const itemCount =
                Array.isArray(order.items)
                  ? order.items.reduce(
                      (
                        total,
                        item
                      ) =>
                        total +
                        Number(
                          item?.quantity ||
                            1
                        ),
                      0
                    )
                  : 0;

              const orderId =
                order._id ||
                order.id;

              return (
                <tr
                  key={orderId}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-5 py-4">
                    <p className="font-black text-slate-950">
                      {order.orderNumber ||
                        "Order"}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      #
                      {String(
                        orderId || ""
                      ).slice(-8)}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">
                      {customerName}
                    </p>

                    {order.customer
                      ?.email && (
                      <p className="mt-1 max-w-[180px] truncate text-xs text-slate-400">
                        {
                          order.customer
                            .email
                        }
                      </p>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-slate-500">
                      <CalendarDays
                        size={14}
                      />

                      {formatDate(
                        order.createdAt
                      )}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-slate-600">
                    {itemCount}{" "}
                    {itemCount === 1
                      ? "item"
                      : "items"}
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-black text-slate-950">
                      Rs.{" "}
                      {formatMoney(
                        order.sellerSubtotal ??
                          order.total
                      )}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold capitalize ${getStatusClass(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus ||
                        "pending"}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/seller/orders/${orderId}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    >
                      View
                      <ArrowRight
                        size={14}
                      />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="divide-y divide-slate-100 md:hidden">
        {orders.map((order) => {
          const customerName =
            [
              order.customer?.firstName,
              order.customer?.lastName,
            ]
              .filter(Boolean)
              .join(" ") ||
            "Customer";

          const itemCount =
            Array.isArray(order.items)
              ? order.items.reduce(
                  (
                    total,
                    item
                  ) =>
                    total +
                    Number(
                      item?.quantity ||
                        1
                    ),
                  0
                )
              : 0;

          const orderId =
            order._id ||
            order.id;

          return (
            <div
              key={orderId}
              className="p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-black text-slate-950">
                    {order.orderNumber ||
                      "Order"}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {formatDate(
                      order.createdAt
                    )}
                  </p>
                </div>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-bold capitalize ${getStatusClass(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus ||
                    "pending"}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Customer
                  </p>

                  <p className="mt-1 truncate text-sm font-bold text-slate-800">
                    {customerName}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Items
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {itemCount}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Seller Sales
                  </p>

                  <p className="mt-1 text-sm font-black text-blue-600">
                    Rs.{" "}
                    {formatMoney(
                      order.sellerSubtotal ??
                        order.total
                    )}
                  </p>
                </div>

                <div className="flex items-end justify-end">
                  <Link
                    href={`/seller/orders/${orderId}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
                  >
                    View
                    <ArrowRight
                      size={14}
                    />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}