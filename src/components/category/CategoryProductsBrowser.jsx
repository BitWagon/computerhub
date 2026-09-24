"use client";

import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import ProductFilters from "@/components/products/ProductFilters";
import ProductGrid from "@/components/products/ProductGrid";
import SortProducts from "@/components/products/SortProducts";

const emptyFilters = {
  brand: [],
  ram: [],
  storage: [],
  processor: [],
  graphics: [],
  minPrice: "",
  maxPrice: "",
  rating: null,
};

export default function CategoryProductsBrowser({
  category,
  products = [],
  databaseError = "",
  initialSubcategory = "",
}) {
  const [filters, setFilters] =
    useState(emptyFilters);

  const [sort, setSort] =
    useState("featured");

  const [search, setSearch] =
    useState("");

  const [mobileFiltersOpen, setMobileFiltersOpen] =
    useState(false);

  const [subcategory, setSubcategory] =
    useState(initialSubcategory || "");

  /*
   * Build filter options from REAL products.
   *
   * Nothing is invented here.
   */
  const availableOptions = useMemo(() => {
    const unique = (key) =>
      [
        ...new Set(
          products
            .map((product) =>
              String(
                product[key] || ""
              ).trim()
            )
            .filter(Boolean)
        ),
      ].sort((a, b) =>
        a.localeCompare(b)
      );

    return {
      brand: unique("brand"),
      ram: unique("ram"),
      storage: unique("storage"),
      processor: unique("processor"),
      graphics: unique("graphics"),
    };
  }, [products]);

  /*
   * FILTER + SEARCH + SORT
   */
  const filteredProducts =
    useMemo(() => {
      let result = [...products];

      const query =
        search.trim().toLowerCase();

      /*
       * Search
       */
      if (query) {
        result =
          result.filter((product) =>
            [
              product.name,
              product.brand,
              product.description,
              product.subcategory,
              product.processor,
              product.graphics,
            ]
              .filter(Boolean)
              .some((value) =>
                String(value)
                  .toLowerCase()
                  .includes(query)
              )
          );
      }

      /*
       * Subcategory
       */
      if (subcategory) {
        const selected =
          category.subcategories?.find(
            (item) =>
              item.slug ===
              subcategory
          );

        if (selected) {
          result =
            result.filter(
              (product) =>
                String(
                  product.subcategory ||
                    ""
                ).toLowerCase() ===
                selected.name.toLowerCase()
            );
        }
      }

      /*
       * Multi-select filters
       */
      [
        "brand",
        "ram",
        "storage",
        "processor",
        "graphics",
      ].forEach((key) => {
        if (filters[key]?.length) {
          result =
            result.filter((product) =>
              filters[key].includes(
                product[key]
              )
            );
        }
      });

      /*
       * Minimum price
       */
      if (filters.minPrice !== "") {
        result =
          result.filter(
            (product) =>
              Number(product.price) >=
              Number(
                filters.minPrice
              )
          );
      }

      /*
       * Maximum price
       */
      if (filters.maxPrice !== "") {
        result =
          result.filter(
            (product) =>
              Number(product.price) <=
              Number(
                filters.maxPrice
              )
          );
      }

      /*
       * Rating
       */
      if (filters.rating) {
        result =
          result.filter(
            (product) =>
              Number(
                product.rating
              ) >=
              Number(
                filters.rating
              )
          );
      }

      /*
       * SORTING
       */
      switch (sort) {
        case "price-low":
          result.sort(
            (a, b) =>
              Number(a.price) -
              Number(b.price)
          );
          break;

        case "price-high":
          result.sort(
            (a, b) =>
              Number(b.price) -
              Number(a.price)
          );
          break;

        case "rating":
          result.sort(
            (a, b) =>
              Number(b.rating) -
              Number(a.rating)
          );
          break;

        case "discount":
          result.sort(
            (a, b) =>
              Number(b.discount) -
              Number(a.discount)
          );
          break;

        case "newest":
          result.sort(
            (a, b) =>
              new Date(
                b.createdAt || 0
              ).getTime() -
              new Date(
                a.createdAt || 0
              ).getTime()
          );
          break;

        default:
          result.sort(
            (a, b) =>
              Number(b.featured) -
              Number(a.featured)
          );
          break;
      }

      return result;
    }, [
      products,
      filters,
      sort,
      search,
      subcategory,
      category,
    ]);

  const activeFilterCount =
    filters.brand.length +
    filters.ram.length +
    filters.storage.length +
    filters.processor.length +
    filters.graphics.length +
    (filters.minPrice !== ""
      ? 1
      : 0) +
    (filters.maxPrice !== ""
      ? 1
      : 0) +
    (filters.rating ? 1 : 0) +
    (subcategory ? 1 : 0);

  function handleFilterChange(
    key,
    value
  ) {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function clearFilters() {
    setFilters({
      ...emptyFilters,
    });

    setSubcategory("");
    setSearch("");
    setSort("featured");
  }

  const selectedSubcategoryName =
    category.subcategories?.find(
      (item) =>
        item.slug === subcategory
    )?.name;

  return (
    <section className="mt-8">
      {/* TOP CATEGORY BAR */}

      <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
              ComputerHub Marketplace
            </p>

            <h2 className="mt-1 text-2xl font-black text-slate-900">
              {category.name} Products
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {filteredProducts.length}{" "}
              product
              {filteredProducts.length !==
              1
                ? "s"
                : ""}{" "}
              available in this
              category.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            {/* SEARCH */}

            <div className="relative min-w-0 flex-1 sm:min-w-[280px]">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={17}
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder={`Search ${category.name.toLowerCase()}...`}
                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {/* MOBILE FILTER */}

            <button
              type="button"
              onClick={() =>
                setMobileFiltersOpen(
                  true
                )
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-bold text-gray-700 lg:hidden"
            >
              <SlidersHorizontal
                size={17}
              />

              Filters

              {activeFilterCount >
                0 && (
                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* SUBCATEGORY ACTIVE */}

        {selectedSubcategoryName && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-800">
            <span>
              Subcategory:
            </span>

            <strong>
              {selectedSubcategoryName}
            </strong>

            <button
              type="button"
              onClick={() =>
                setSubcategory("")
              }
              className="ml-auto rounded-lg p-1 hover:bg-blue-100"
              aria-label="Clear subcategory"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {/* DATABASE ERROR */}

      {databaseError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h3 className="text-lg font-black text-red-700">
            Products could not
            be loaded
          </h3>

          <p className="mt-2 text-sm text-red-600">
            {databaseError}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[270px_minmax(0,1fr)]">
          {/* DESKTOP FILTERS */}

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <ProductFilters
                filters={filters}
                options={
                  availableOptions
                }
                onFilterChange={
                  handleFilterChange
                }
                onClearFilters={
                  clearFilters
                }
                showCategory={false}
              />
            </div>
          </aside>

          {/* PRODUCTS */}

          <div className="min-w-0">
            <SortProducts
              value={sort}
              onChange={setSort}
              productCount={
                filteredProducts.length
              }
            />

            <div className="mt-4">
              <ProductGrid
                products={
                  filteredProducts
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* MOBILE FILTER DRAWER */}

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() =>
              setMobileFiltersOpen(
                false
              )
            }
            className="absolute inset-0 bg-black/40"
          />

          <div className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-y-auto rounded-t-3xl bg-gray-50 p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">
                Filters
              </h3>

              <button
                type="button"
                onClick={() =>
                  setMobileFiltersOpen(
                    false
                  )
                }
                className="rounded-full bg-white p-2 text-gray-600 shadow-sm"
              >
                <X size={19} />
              </button>
            </div>

            <ProductFilters
              filters={filters}
              options={
                availableOptions
              }
              onFilterChange={
                handleFilterChange
              }
              onClearFilters={
                clearFilters
              }
              showCategory={false}
            />

            <button
              type="button"
              onClick={() =>
                setMobileFiltersOpen(
                  false
                )
              }
              className="mt-4 w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white hover:bg-blue-700"
            >
              Show{" "}
              {filteredProducts.length}{" "}
              Products
            </button>
          </div>
        </div>
      )}
    </section>
  );
}