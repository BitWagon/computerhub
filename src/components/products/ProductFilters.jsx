"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Filter,
  X,
} from "lucide-react";

const filterGroups = [
  {
    title: "Category",
    key: "category",
    options: [
      "Laptops",
      "Desktops",
      "PC Components",
      "Monitors",
      "Accessories",
      "Gaming",
    ],
  },
  {
    title: "Brand",
    key: "brand",
    options: [
      "Dell",
      "HP",
      "Lenovo",
      "Apple",
      "ASUS",
      "Acer",
      "MSI",
      "Samsung",
      "Corsair",
      "Logitech",
    ],
  },
  {
    title: "RAM",
    key: "ram",
    options: [
      "4 GB",
      "8 GB",
      "16 GB",
      "32 GB",
      "64 GB",
    ],
  },
  {
    title: "Storage",
    key: "storage",
    options: [
      "256 GB",
      "512 GB",
      "1 TB",
      "2 TB",
    ],
  },
];

export default function ProductFilters({
  filters = {},
  onFilterChange,
  onClearFilters,
}) {
  const [openGroups, setOpenGroups] = useState({
    Category: true,
    Brand: true,
    RAM: true,
    Storage: true,
  });

  const toggleGroup = (title) => {
    setOpenGroups((previous) => ({
      ...previous,
      [title]: !previous[title],
    }));
  };

  const handleCheckbox = (key, value) => {
    const currentValues = filters[key] || [];

    const updatedValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    onFilterChange?.(key, updatedValues);
  };

  return (
    <aside className="w-full rounded-xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <Filter
            size={19}
            className="text-blue-600"
          />

          <h2 className="font-bold text-gray-900">
            Filters
          </h2>
        </div>

        <button
          type="button"
          onClick={onClearFilters}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800"
        >
          Clear all
        </button>
      </div>

      {/* Price */}
      <div className="border-b border-gray-200 p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">
          Price
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={filters.minPrice || ""}
            onChange={(event) =>
              onFilterChange?.(
                "minPrice",
                event.target.value
              )
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <input
            type="number"
            min="0"
            placeholder="Max"
            value={filters.maxPrice || ""}
            onChange={(event) =>
              onFilterChange?.(
                "maxPrice",
                event.target.value
              )
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Filter Groups */}
      {filterGroups.map((group) => {
        const isOpen = openGroups[group.title];

        return (
          <div
            key={group.title}
            className="border-b border-gray-200 last:border-b-0"
          >
            <button
              type="button"
              onClick={() => toggleGroup(group.title)}
              className="flex w-full items-center justify-between px-4 py-4 text-left"
            >
              <span className="text-sm font-semibold text-gray-900">
                {group.title}
              </span>

              {isOpen ? (
                <ChevronUp
                  size={17}
                  className="text-gray-500"
                />
              ) : (
                <ChevronDown
                  size={17}
                  className="text-gray-500"
                />
              )}
            </button>

            {isOpen && (
              <div className="space-y-3 px-4 pb-4">
                {group.options.map((option) => {
                  const checked =
                    filters[group.key]?.includes(
                      option
                    ) || false;

                  return (
                    <label
                      key={option}
                      className="flex cursor-pointer items-center gap-3 text-sm text-gray-600 hover:text-gray-900"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          handleCheckbox(
                            group.key,
                            option
                          )
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />

                      <span>{option}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Rating */}
      <div className="border-b border-gray-200 p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">
          Rating
        </h3>

        <div className="space-y-3">
          {[4, 3, 2].map((rating) => (
            <label
              key={rating}
              className="flex cursor-pointer items-center gap-3 text-sm text-gray-600 hover:text-gray-900"
            >
              <input
                type="radio"
                name="product-rating"
                checked={filters.rating === rating}
                onChange={() =>
                  onFilterChange?.("rating", rating)
                }
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />

              <span>{rating}+ stars</span>
            </label>
          ))}

          <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-600 hover:text-gray-900">
            <input
              type="radio"
              name="product-rating"
              checked={!filters.rating}
              onChange={() =>
                onFilterChange?.("rating", null)
              }
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />

            <span>All ratings</span>
          </label>
        </div>
      </div>

      {/* Mobile Clear */}
      <div className="p-4 lg:hidden">
        <button
          type="button"
          onClick={onClearFilters}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <X size={16} />
          Clear Filters
        </button>
      </div>
    </aside>
  );
}