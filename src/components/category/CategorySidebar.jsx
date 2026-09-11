"use client";

import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";

export default function CategorySidebar({ category }) {
  const [openSections, setOpenSections] = useState({
    subcategories: true,
    price: true,
    brands: true,
    condition: true,
  });

  function toggleSection(section) {
    setOpenSections((previous) => ({
      ...previous,
      [section]: !previous[section],
    }));
  }

  return (
    <aside className="w-full lg:w-64 lg:shrink-0">
      <div className="sticky top-28 rounded-2xl border border-gray-200 bg-white">
        <div className="flex items-center gap-2 border-b border-gray-200 p-5">
          <SlidersHorizontal size={18} className="text-blue-600" />

          <h2 className="font-black text-slate-900">
            Filter Products
          </h2>
        </div>

        {/* Subcategories */}
        <FilterSection
          title="Subcategories"
          open={openSections.subcategories}
          onToggle={() => toggleSection("subcategories")}
        >
          <div className="space-y-1">
            {category.subcategories.slice(0, 8).map((item) => (
              <Link
                key={item.slug}
                href={`/products?category=${category.slug}&subcategory=${item.slug}`}
                className="block rounded-lg px-2 py-2 text-sm text-gray-600 transition hover:bg-blue-50 hover:text-blue-600"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </FilterSection>

        {/* Price */}
        <FilterSection
          title="Price"
          open={openSections.price}
          onToggle={() => toggleSection("price")}
        >
          <div className="space-y-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              Under $100
            </label>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              $100 - $500
            </label>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              $500 - $1,000
            </label>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              $1,000+
            </label>
          </div>
        </FilterSection>

        {/* Brands */}
        <FilterSection
          title="Popular Brands"
          open={openSections.brands}
          onToggle={() => toggleSection("brands")}
        >
          <div className="space-y-3">
            {category.brands.map((brand) => (
              <label
                key={brand}
                className="flex cursor-pointer items-center gap-2 text-sm text-gray-600"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
                {brand}
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Condition */}
        <FilterSection
          title="Condition"
          open={openSections.condition}
          onToggle={() => toggleSection("condition")}
        >
          <div className="space-y-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              New
            </label>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              Used
            </label>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              Refurbished
            </label>
          </div>
        </FilterSection>

        <div className="border-t border-gray-200 p-4">
          <button
            type="button"
            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </aside>
  );
}

function FilterSection({ title, open, onToggle, children }) {
  return (
    <div className="border-b border-gray-200 p-5">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-sm font-black text-slate-900">
          {title}
        </span>

        {open ? (
          <ChevronUp size={17} className="text-gray-400" />
        ) : (
          <ChevronDown size={17} className="text-gray-400" />
        )}
      </button>

      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}