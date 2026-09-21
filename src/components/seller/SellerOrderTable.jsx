"use client";

import Link from "next/link";
import {
  Eye,
  Package,
  CalendarDays,
} from "lucide-react";

export default function SellerOrderTable({
  orders = [],
  loading = false,
}) {
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
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  }

  function formatMoney(value) {
    return Number(
      value || 0
    ).toLocaleString("en-PK", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }

  function getStatusClass(status) {
    const classes = {
      pending:
        "bg-yellow-100 text-yellow-700",
      confirmed:
        "bg-blue-100 text-blue-700",
      processing:
        "bg-purple-100 text-purple-700",
      shipped:
        "bg-indigo-100 text-indigo-700",
      delivered:
        "bg-green-100 text-green-700",
      cancelled:
        "bg-red-100 text-red-700",
    };

    return (
      classes[
        String(status || "").toLowerCase()
      ] ||
      "bg-gray-100 text-gray-700"
    );
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex min-h-[220px] items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />

            Loading orders...
          </div>
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
          <Package className="text-blue-600" />
        </div>

        <h3 className="mt-4 font-bold text-gray-900">
          No orders found
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Customer orders containing your
          products will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                Order
              </th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                Customer
              </th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                Date
              </th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                Items
              </th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                Total
              </th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                Status
              </th>

              <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => {
              const customerName =
                `${order.customer?.firstName || ""} ${
                  order.customer?.lastName || ""
                }`.trim() ||
                "Customer";

              const itemCount =
                Array.isArray(
                  order.items
                )
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
                  className="transition hover:bg-gray-50"
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-900">
                      {order.orderNumber ||
                        "Order"}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      #{String(
                        orderId || ""
                      ).slice(-8)}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900">
                      {customerName}
                    </p>

                    {order.customer
                      ?.email && (
                      <p className="mt-1 text-xs text-gray-500">
                        {
                          order
                            .customer
                            .email
                        }
                      </p>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                      <CalendarDays
                        size={14}
                      />

                      {formatDate(
                        order.createdAt
                      )}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {itemCount}{" "}
                    {itemCount === 1
                      ? "item"
                      : "items"}
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-900">
                      Rs.{" "}
                      {formatMoney(
                        order.sellerSubtotal ??
                          order.total
                      )}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${getStatusClass(
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
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Eye size={15} />
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}