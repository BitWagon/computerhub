"use client";

import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";

export default function CategorySidebar({
  category,
}) {
  const [open, setOpen] =
    useState(true);

  return (
    <aside className="w-full lg:w-64 lg:shrink-0">
      <div className="sticky top-28 rounded-2xl border border-gray-200 bg-white">
        <button
          type="button"
          onClick={() =>
            setOpen(
              (value) => !value
            )
          }
          className="flex w-full items-center justify-between border-b border-gray-200 p-5 text-left"
        >
          <span className="flex items-center gap-2 font-black text-slate-900">
            <SlidersHorizontal
              size={18}
              className="text-blue-600"
            />

            Browse{" "}
            {category.name}
          </span>

          {open ? (
            <ChevronUp size={17} />
          ) : (
            <ChevronDown size={17} />
          )}
        </button>

        {open && (
          <div className="p-4">
            <div className="space-y-1">
              {category.subcategories?.map(
                (item) => (
                  <Link
                    key={item.slug}
                    href={`/category/${item.parent}?subcategory=${encodeURIComponent(
                      item.slug
                    )}`}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-blue-50 hover:text-blue-600"
                  >
                    {item.name}
                  </Link>
                )
              )}
            </div>

            <div className="mt-4 border-t border-gray-200 pt-4">
              <Link
                href={`/category/${category.slug}`}
                className="block rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-700"
              >
                View All{" "}
                {category.name}
              </Link>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}