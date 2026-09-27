"use client";

import { TrendingUp } from "lucide-react";

export default function StatsCard({
  title,
  value,
  icon: Icon,
  color = "blue",
  change,
}) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold text-gray-900">
            {value}
          </h3>

          {change && (
            <div className="mt-3 flex items-center gap-1 text-sm text-green-600">
              <TrendingUp size={16} />
              <span>{change}</span>
            </div>
          )}
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${
            colors[color] || colors.blue
          }`}
        >
          {Icon && <Icon size={24} />}
        </div>
      </div>
    </div>
  );
}