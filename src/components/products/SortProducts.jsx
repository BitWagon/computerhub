"use client";

import { ArrowDownUp } from "lucide-react";

export default function SortProducts({
  value = "featured",
  onChange,
  productCount = 0,
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Product Count */}
      <div>
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {productCount}
          </span>{" "}
          product
          {productCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2">
        <ArrowDownUp
          size={17}
          className="text-gray-500"
        />

        <label
          htmlFor="sort-products"
          className="whitespace-nowrap text-sm font-medium text-gray-700"
        >
          Sort by:
        </label>

        <select
          id="sort-products"
          value={value}
          onChange={(event) =>
            onChange?.(event.target.value)
          }
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="featured">
            Featured
          </option>

          <option value="price-low">
            Price: Low to High
          </option>

          <option value="price-high">
            Price: High to Low
          </option>

          <option value="rating">
            Top Rated
          </option>

          <option value="discount">
            Biggest Discount
          </option>

          <option value="newest">
            Newest
          </option>
        </select>
      </div>
    </div>
  );
}