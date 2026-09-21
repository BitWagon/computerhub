"use client";

import {
  TrendingUp,
} from "lucide-react";

export default function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendLabel,
  href,
}) {
  const content = (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p className="mt-2 break-words text-2xl font-bold text-gray-900">
            {value ?? 0}
          </p>

          {description && (
            <p className="mt-1 text-xs text-gray-500">
              {description}
            </p>
          )}

          {trend !== undefined &&
            trend !== null && (
              <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-green-600">
                <TrendingUp size={14} />

                <span>
                  {trend}
                </span>

                {trendLabel && (
                  <span className="font-normal text-gray-400">
                    {trendLabel}
                  </span>
                )}
              </div>
            )}
        </div>

        {Icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Icon size={21} />
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className="block"
      >
        {content}
      </a>
    );
  }

  return content;
}