"use client";

import {
  DollarSign,
  Package,
  ShoppingCart,
  Clock3,
  Activity,
} from "lucide-react";

export default function SellerStats({
  stats = {},
}) {
  const cards = [
    {
      title: "Total Products",
      value: stats.totalProducts ?? 0,
      icon: Package,
      description: `${stats.activeProducts ?? 0} active`,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders ?? 0,
      icon: ShoppingCart,
      description: "Orders containing your products",
    },
    {
      title: "Seller Sales",
      value: `Rs. ${Number(
        stats.sales ?? 0
      ).toLocaleString("en-PK")}`,
      icon: DollarSign,
      description: "Your order sales",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders ?? 0,
      icon: Clock3,
      description: "Needs attention",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                <Icon size={21} />
              </div>

              <Activity
                size={17}
                className="text-slate-300"
              />
            </div>

            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">
              {card.title}
            </p>

            <p className="mt-1 break-words text-2xl font-black text-slate-950">
              {card.value}
            </p>

            <p className="mt-2 text-xs font-medium text-slate-500">
              {card.description}
            </p>
          </div>
        );
      })}
    </section>
  );
}