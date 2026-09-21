"use client";

import {
  Package,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Clock3,
} from "lucide-react";

export default function SellerStats({
  products = 0,
  orders = 0,
  sales = 0,
  pendingOrders = 0,
  activeProducts = 0,
}) {
  const stats = [
    {
      label: "Total Products",
      value: products,
      helper: `${activeProducts} active`,
      icon: Package,
    },
    {
      label: "Total Orders",
      value: orders,
      helper: `${pendingOrders} pending`,
      icon: ShoppingBag,
    },
    {
      label: "Total Sales",
      value: `Rs. ${Number(
        sales || 0
      ).toLocaleString("en-PK")}`,
      helper: "Gross sales",
      icon: DollarSign,
    },
    {
      label: "Pending Orders",
      value: pendingOrders,
      helper: "Need attention",
      icon: Clock3,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.label}
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {stat.helper}
                </p>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <Icon
                  size={21}
                  className="text-blue-600"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}