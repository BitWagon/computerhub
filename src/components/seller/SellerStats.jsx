"use client";

import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
} from "lucide-react";

export default function SellerStats({ stats = {} }) {
  const cards = [
    {
      title: "Total Products",
      value: stats.totalProducts ?? 0,
      icon: Package,
      color: "blue",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders ?? 0,
      icon: ShoppingCart,
      color: "green",
    },
    {
      title: "Revenue",
      value: `PKR ${(stats.revenue ?? 0).toLocaleString()}`,
      icon: DollarSign,
      color: "purple",
    },
    {
      title: "Growth",
      value: `${stats.growth ?? 0}%`,
      icon: TrendingUp,
      color: "orange",
    },
  ];

  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {card.title}
                </p>

                <h3 className="mt-2 text-3xl font-bold text-gray-900">
                  {card.value}
                </h3>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  colors[card.color]
                }`}
              >
                <Icon size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}