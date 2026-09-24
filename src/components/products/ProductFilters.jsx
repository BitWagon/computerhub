"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Filter,
  X,
} from "lucide-react";

const GROUPS = [
  ["Brand", "brand"],
  ["Processor", "processor"],
  ["RAM", "ram"],
  ["Storage", "storage"],
  ["Graphics", "graphics"],
];

export default function ProductFilters({
  filters = {},
  options = {},
  onFilterChange,
  onClearFilters,
  showCategory = false,
}) {
  const [openGroups, setOpenGroups] =
    useState({
      Brand: true,
      Processor: true,
      RAM: true,
      Storage: true,
      Graphics: false,
    });

  function toggleGroup(title) {
    setOpenGroups((previous) => ({
      ...previous,
      [title]:
        !previous[title],
    }));
  }

  function handleCheckbox(
    key,
    value
  ) {
    const currentValues =
      filters[key] || [];

    const updatedValues =
      currentValues.includes(value)
        ? currentValues.filter(
            (item) =>
              item !== value
          )
        : [
            ...currentValues,
            value,
          ];

    onFilterChange?.(
      key,
      updatedValues
    );
  }

  const groups = [
    ...GROUPS,
  ];

  if (showCategory) {
    groups.unshift([
      "Category",
      "category",
    ]);
  }

  return (
    <aside className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {/* HEADER */}

      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <Filter
            size={18}
            className="text-blue-600"
          />

          <h2 className="font-black text-gray-900">
            Filters
          </h2>
        </div>

        <button
          type="button"
          onClick={
            onClearFilters
          }
          className="text-xs font-bold text-blue-600 hover:text-blue-800"
        >
          Clear all
        </button>
      </div>

      {/* PRICE */}

      <div className="border-b border-gray-200 p-4">
        <h3 className="mb-3 text-sm font-bold text-gray-900">
          Price
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min="0"
            value={
              filters.minPrice ||
              ""
            }
            onChange={(event) =>
              onFilterChange?.(
                "minPrice",
                event.target.value
              )
            }
            placeholder="Min"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <input
            type="number"
            min="0"
            value={
              filters.maxPrice ||
              ""
            }
            onChange={(event) =>
              onFilterChange?.(
                "maxPrice",
                event.target.value
              )
            }
            placeholder="Max"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* DYNAMIC FILTER GROUPS */}

      {groups.map(
        ([title, key]) => {
          const values =
            Array.isArray(
              options[key]
            )
              ? options[key]
              : [];

          if (!values.length) {
            return null;
          }

          const isOpen =
            openGroups[title] !==
            false;

          return (
            <div
              key={key}
              className="border-b border-gray-200 last:border-b-0"
            >
              <button
                type="button"
                onClick={() =>
                  toggleGroup(
                    title
                  )
                }
                className="flex w-full items-center justify-between px-4 py-4 text-left"
              >
                <span className="text-sm font-bold text-gray-900">
                  {title}
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
                <div className="max-h-56 space-y-3 overflow-y-auto px-4 pb-4 pr-2">
                  {values.map(
                    (option) => (
                      <label
                        key={
                          option
                        }
                        className="flex cursor-pointer items-center gap-3 text-sm text-gray-600 hover:text-gray-900"
                      >
                        <input
                          type="checkbox"
                          checked={
                            (
                              filters[
                                key
                              ] || []
                            ).includes(
                              option
                            )
                          }
                          onChange={() =>
                            handleCheckbox(
                              key,
                              option
                            )
                          }
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />

                        <span>
                          {
                            option
                          }
                        </span>
                      </label>
                    )
                  )}
                </div>
              )}
            </div>
          );
        }
      )}

      {/* RATING */}

      <div className="border-b border-gray-200 p-4">
        <h3 className="mb-3 text-sm font-bold text-gray-900">
          Rating
        </h3>

        <div className="space-y-3">
          {[4, 3, 2].map(
            (rating) => (
              <label
                key={rating}
                className="flex cursor-pointer items-center gap-3 text-sm text-gray-600"
              >
                <input
                  type="radio"
                  name="product-rating"
                  checked={
                    filters.rating ===
                    rating
                  }
                  onChange={() =>
                    onFilterChange?.(
                      "rating",
                      rating
                    )
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />

                <span>
                  {rating}+ stars
                </span>
              </label>
            )
          )}

          <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-600">
            <input
              type="radio"
              name="product-rating"
              checked={
                !filters.rating
              }
              onChange={() =>
                onFilterChange?.(
                  "rating",
                  null
                )
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />

            <span>
              All ratings
            </span>
          </label>
        </div>
      </div>

      {/* RESET */}

      <div className="p-4">
        <button
          type="button"
          onClick={
            onClearFilters
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
        >
          <X size={16} />
          Reset filters
        </button>
      </div>
    </aside>
  );
}