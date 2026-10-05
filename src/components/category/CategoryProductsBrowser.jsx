"use client";

import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  PackageSearch,
  RotateCcw,
  Sparkles,
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
  const [filters, setFilters] = useState(emptyFilters);

  const [sort, setSort] = useState("featured");

  const [search, setSearch] = useState("");

  const [mobileFiltersOpen, setMobileFiltersOpen] =
    useState(false);

  const [subcategory, setSubcategory] = useState(
    initialSubcategory || ""
  );

  /*
   * ==========================================================
   * BUILD FILTER OPTIONS FROM REAL PRODUCTS
   * ==========================================================
   */

  const availableOptions = useMemo(() => {
    const unique = (key) =>
      [
        ...new Set(
          products
            .map((product) =>
              String(product?.[key] || "").trim()
            )
            .filter(Boolean)
        ),
      ].sort((a, b) => a.localeCompare(b));

    return {
      brand: unique("brand"),
      ram: unique("ram"),
      storage: unique("storage"),
      processor: unique("processor"),
      graphics: unique("graphics"),
    };
  }, [products]);

  /*
   * ==========================================================
   * FILTER + SEARCH + SORT
   * ==========================================================
   */

  const filteredProducts = useMemo(() => {
    let result = [...products];

    const query = search.trim().toLowerCase();

    /*
     * SEARCH
     */

    if (query) {
      result = result.filter((product) =>
        [
          product?.name,
          product?.brand,
          product?.description,
          product?.shortDescription,
          product?.subcategory,
          product?.processor,
          product?.graphics,
          product?.ram,
          product?.storage,
          product?.sku,
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
     * SUBCATEGORY
     */

    if (subcategory) {
      const selected =
        category?.subcategories?.find(
          (item) => item.slug === subcategory
        );

      if (selected) {
        result = result.filter(
          (product) =>
            String(
              product?.subcategory || ""
            )
              .trim()
              .toLowerCase() ===
            String(selected.name || "")
              .trim()
              .toLowerCase()
        );
      }
    }

    /*
     * MULTI-SELECT FILTERS
     */

    [
      "brand",
      "ram",
      "storage",
      "processor",
      "graphics",
    ].forEach((key) => {
      if (filters[key]?.length) {
        result = result.filter((product) =>
          filters[key].includes(
            String(product?.[key] || "")
          )
        );
      }
    });

    /*
     * MINIMUM PRICE
     */

    if (filters.minPrice !== "") {
      result = result.filter(
        (product) =>
          Number(product?.price || 0) >=
          Number(filters.minPrice)
      );
    }

    /*
     * MAXIMUM PRICE
     */

    if (filters.maxPrice !== "") {
      result = result.filter(
        (product) =>
          Number(product?.price || 0) <=
          Number(filters.maxPrice)
      );
    }

    /*
     * RATING
     */

    if (filters.rating) {
      result = result.filter(
        (product) =>
          Number(product?.rating || 0) >=
          Number(filters.rating)
      );
    }

    /*
     * SORTING
     */

    switch (sort) {
      case "price-low":
        result.sort(
          (a, b) =>
            Number(a?.price || 0) -
            Number(b?.price || 0)
        );
        break;

      case "price-high":
        result.sort(
          (a, b) =>
            Number(b?.price || 0) -
            Number(a?.price || 0)
        );
        break;

      case "rating":
        result.sort(
          (a, b) =>
            Number(b?.rating || 0) -
            Number(a?.rating || 0)
        );
        break;

      case "discount":
        result.sort(
          (a, b) =>
            Number(b?.discount || 0) -
            Number(a?.discount || 0)
        );
        break;

      case "newest":
        result.sort(
          (a, b) =>
            new Date(
              b?.createdAt || 0
            ).getTime() -
            new Date(
              a?.createdAt || 0
            ).getTime()
        );
        break;

      default:
        result.sort(
          (a, b) =>
            Number(Boolean(b?.featured)) -
            Number(Boolean(a?.featured))
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

  /*
   * ==========================================================
   * ACTIVE FILTER COUNT
   * ==========================================================
   */

  const activeFilterCount =
    filters.brand.length +
    filters.ram.length +
    filters.storage.length +
    filters.processor.length +
    filters.graphics.length +
    (filters.minPrice !== "" ? 1 : 0) +
    (filters.maxPrice !== "" ? 1 : 0) +
    (filters.rating ? 1 : 0) +
    (subcategory ? 1 : 0);

  /*
   * ==========================================================
   * FILTER HANDLER
   * ==========================================================
   */

  function handleFilterChange(key, value) {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  /*
   * ==========================================================
   * CLEAR EVERYTHING
   * ==========================================================
   */

  function clearFilters() {
    setFilters({
      ...emptyFilters,
      brand: [],
      ram: [],
      storage: [],
      processor: [],
      graphics: [],
      minPrice: "",
      maxPrice: "",
      rating: null,
    });

    setSubcategory("");
    setSearch("");
    setSort("featured");
  }

  /*
   * ==========================================================
   * SELECTED SUBCATEGORY
   * ==========================================================
   */

  const selectedSubcategoryName =
    category?.subcategories?.find(
      (item) => item.slug === subcategory
    )?.name || "";

  return (
    <section className="mt-10">
      {/* ======================================================
          DATABASE ERROR
      ======================================================= */}

      {databaseError ? (
        <div className="rounded-3xl border border-red-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="mx-auto max-w-lg text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <PackageSearch size={27} />
            </div>

            <h3 className="mt-5 text-xl font-black text-slate-900">
              Products could not be loaded
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {databaseError}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
            >
              <RotateCcw size={16} />
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* ==================================================
              PRODUCTS HEADER
          =================================================== */}

          <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                  <Sparkles size={14} />
                  ComputerHub Marketplace
                </div>

                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  {category?.name || "Products"}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1
                    ? "product"
                    : "products"}{" "}
                  available
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
                {/* SEARCH */}

                <div className="relative min-w-0 flex-1 sm:min-w-[320px]">
                  <Search
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="search"
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target.value
                      )
                    }
                    placeholder={`Search ${
                      category?.name?.toLowerCase() ||
                      "products"
                    }...`}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-10 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                  />
                </div>

                {/* MOBILE FILTER BUTTON */}

                <button
                  type="button"
                  onClick={() =>
                    setMobileFiltersOpen(true)
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 lg:hidden"
                >
                  <SlidersHorizontal size={17} />

                  Filters

                  {activeFilterCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[11px] font-black text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* ACTIVE SUBCATEGORY */}

            {selectedSubcategoryName && (
              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                <div className="min-w-0">
                  <span className="text-blue-600">
                    Browsing:
                  </span>{" "}
                  <strong>
                    {selectedSubcategoryName}
                  </strong>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSubcategory("")
                  }
                  className="ml-auto shrink-0 rounded-lg p-1.5 transition hover:bg-blue-100"
                  aria-label="Clear subcategory"
                >
                  <X size={17} />
                </button>
              </div>
            )}

            {/* ACTIVE FILTER SUMMARY */}

            {activeFilterCount > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Active filters
                </span>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                >
                  <RotateCcw size={13} />
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* ==================================================
              MAIN CONTENT
          =================================================== */}

          <div className="grid grid-cols-1 gap-7 lg:grid-cols-[270px_minmax(0,1fr)]">
            {/* ==================================================
                DESKTOP FILTERS
            =================================================== */}

            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <ProductFilters
                  filters={filters}
                  options={availableOptions}
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

            {/* ==================================================
                PRODUCTS
            =================================================== */}

            <div className="min-w-0">
              <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <SortProducts
                  value={sort}
                  onChange={setSort}
                  productCount={
                    filteredProducts.length
                  }
                />
              </div>

              {filteredProducts.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                    <Search size={27} />
                  </div>

                  <h3 className="mt-5 text-xl font-black text-slate-900">
                    No products found
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Try changing your search or
                    removing some filters to see
                    more products.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
                  >
                    <RotateCcw size={16} />
                    Reset Filters
                  </button>
                </div>
              ) : (
                <ProductGrid
                  products={filteredProducts}
                />
              )}
            </div>
          </div>
        </>
      )}

      {/* ========================================================
          MOBILE FILTER DRAWER
      ========================================================= */}

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* BACKDROP */}

          <button
            type="button"
            aria-label="Close filters"
            onClick={() =>
              setMobileFiltersOpen(false)
            }
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
          />

          {/* DRAWER */}

          <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto rounded-t-3xl bg-slate-50 p-4 shadow-2xl sm:p-6">
            <div className="mx-auto max-w-2xl">
              {/* DRAWER HEADER */}

              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Refine Results
                  </p>

                  <h3 className="mt-1 text-xl font-black text-slate-950">
                    Filters
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setMobileFiltersOpen(false)
                  }
                  className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition hover:text-slate-900"
                  aria-label="Close filters"
                >
                  <X size={19} />
                </button>
              </div>

              <ProductFilters
                filters={filters}
                options={availableOptions}
                onFilterChange={
                  handleFilterChange
                }
                onClearFilters={
                  clearFilters
                }
                showCategory={false}
              />

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setMobileFiltersOpen(false)
                  }
                  className="flex-[1.5] rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  Show {filteredProducts.length}{" "}
                  {filteredProducts.length === 1
                    ? "Product"
                    : "Products"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}