"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Filter,
  Loader2,
  PackageSearch,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import ProductCard from "@/components/products/ProductCard";

const CATEGORIES = [
  {
    value: "Laptops",
    label: "Laptops",
    slug: "laptops",
  },
  {
    value: "Desktops",
    label: "Desktop PCs",
    slug: "desktops",
  },
  {
    value: "Components",
    label: "PC Components",
    slug: "components",
  },
  {
    value: "Monitors",
    label: "Monitors",
    slug: "monitors",
  },
  {
    value: "Gaming",
    label: "Gaming",
    slug: "gaming",
  },
  {
    value: "Accessories",
    label: "Accessories",
    slug: "accessories",
  },
];

const SORT_OPTIONS = [
  {
    value: "featured",
    label: "Featured",
  },
  {
    value: "newest",
    label: "Newest",
  },
  {
    value: "price-low",
    label: "Price: Low to High",
  },
  {
    value: "price-high",
    label: "Price: High to Low",
  },
  {
    value: "rating",
    label: "Customer Rating",
  },
];

const PRICE_RANGES = [
  {
    value: "all",
    label: "All Prices",
    min: 0,
    max: Infinity,
  },
  {
    value: "0-500",
    label: "Under $500",
    min: 0,
    max: 500,
  },
  {
    value: "500-1000",
    label: "$500 - $1,000",
    min: 500,
    max: 1000,
  },
  {
    value: "1000-2000",
    label: "$1,000 - $2,000",
    min: 1000,
    max: 2000,
  },
  {
    value: "2000-5000",
    label: "$2,000 - $5,000",
    min: 2000,
    max: 5000,
  },
  {
    value: "5000-plus",
    label: "$5,000+",
    min: 5000,
    max: Infinity,
  },
];

function normalizeProduct(product) {
  const id =
    product?._id?.toString?.() ||
    product?.id?.toString?.() ||
    "";

  const images = Array.isArray(product?.images)
    ? product.images
        .map((image) => String(image || "").trim())
        .filter(Boolean)
    : [];

  const price = Number(product?.price) || 0;
  const oldPrice = Number(product?.oldPrice) || 0;

  let discount = Number(product?.discount) || 0;

  if (discount <= 0 && oldPrice > price && oldPrice > 0) {
    discount = Math.round(
      ((oldPrice - price) / oldPrice) * 100
    );
  }

  return {
    ...product,

    _id: id,
    id,

    name: product?.name || "Unnamed Product",

    slug: product?.slug || "",

    description: product?.description || "",

    category: product?.category || "",

    brand: product?.brand || "",

    price,

    oldPrice,

    discount,

    images,

    image: images[0] || product?.image || "",

    stock: Number(product?.stock) || 0,

    rating: Number(product?.rating) || 0,

    reviews: Number(product?.reviews) || 0,

    featured: Boolean(product?.featured),

    freeDelivery: Boolean(product?.freeDelivery),

    sellerName:
      product?.sellerName ||
      product?.seller ||
      "ComputerHub Official",
  };
}

export default function ProductsClient() {
  const searchParams = useSearchParams();

  const initialSearch =
    searchParams.get("search") ||
    searchParams.get("q") ||
    "";

  const initialCategory =
    searchParams.get("category") ||
    "";

  const initialSort =
    searchParams.get("sort") ||
    "featured";

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] =
    useState(initialSearch);

  const [category, setCategory] =
    useState(initialCategory);

  const [brand, setBrand] =
    useState("");

  const [priceRange, setPriceRange] =
    useState("all");

  const [sort, setSort] =
    useState(initialSort);

  const [mobileFiltersOpen, setMobileFiltersOpen] =
    useState(false);

  const [showAllBrands, setShowAllBrands] =
    useState(false);

  const [page, setPage] = useState(1);

  const PRODUCTS_PER_PAGE = 12;

  /*
  |--------------------------------------------------------------------------
  | LOAD REAL PRODUCTS FROM MONGODB API
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/products",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Unable to load products."
          );
        }

        /*
        |--------------------------------------------------------------------------
        | SUPPORT COMMON API RESPONSE FORMATS
        |--------------------------------------------------------------------------
        */

        let apiProducts = [];

        if (Array.isArray(data)) {
          apiProducts = data;
        } else if (
          Array.isArray(data?.products)
        ) {
          apiProducts = data.products;
        } else if (
          Array.isArray(data?.data)
        ) {
          apiProducts = data.data;
        }

        const normalizedProducts =
          apiProducts
            .map(normalizeProduct)
            .filter(
              (product) => product.id
            );

        if (!cancelled) {
          setProducts(normalizedProducts);
        }
      } catch (err) {
        console.error(
          "ComputerHub products loading error:",
          err
        );

        if (!cancelled) {
          setProducts([]);

          setError(
            err?.message ||
              "Unable to load products from the marketplace."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | AVAILABLE BRANDS
  |--------------------------------------------------------------------------
  */

  const brands = useMemo(() => {
    const uniqueBrands = new Set();

    products.forEach((product) => {
      if (product.brand) {
        uniqueBrands.add(
          String(product.brand).trim()
        );
      }
    });

    return Array.from(uniqueBrands).sort(
      (a, b) =>
        a.localeCompare(b)
    );
  }, [products]);

  /*
  |--------------------------------------------------------------------------
  | FILTER PRODUCTS
  |--------------------------------------------------------------------------
  */

  const filteredProducts = useMemo(() => {
    let result = [...products];

    const normalizedSearch =
      search.trim().toLowerCase();

    /*
    |--------------------------------------------------------------------------
    | SEARCH
    |--------------------------------------------------------------------------
    */

    if (normalizedSearch) {
      result = result.filter(
        (product) => {
          const searchableText = [
            product.name,
            product.description,
            product.category,
            product.brand,
            product.sellerName,
            product.specifications?.processor,
            product.specifications?.ram,
            product.specifications?.storage,
            product.specifications?.screen,
            product.specifications?.graphics,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return searchableText.includes(
            normalizedSearch
          );
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | CATEGORY
    |--------------------------------------------------------------------------
    */

    if (category) {
      const normalizedCategory =
        category.toLowerCase();

      result = result.filter(
        (product) =>
          String(
            product.category || ""
          ).toLowerCase() ===
          normalizedCategory
      );
    }

    /*
    |--------------------------------------------------------------------------
    | BRAND
    |--------------------------------------------------------------------------
    */

    if (brand) {
      result = result.filter(
        (product) =>
          String(
            product.brand || ""
          ).toLowerCase() ===
          brand.toLowerCase()
      );
    }

    /*
    |--------------------------------------------------------------------------
    | PRICE
    |--------------------------------------------------------------------------
    */

    if (priceRange !== "all") {
      const selectedRange =
        PRICE_RANGES.find(
          (range) =>
            range.value === priceRange
        );

      if (selectedRange) {
        result = result.filter(
          (product) =>
            product.price >=
              selectedRange.min &&
            product.price <=
              selectedRange.max
        );
      }
    }

    /*
    |--------------------------------------------------------------------------
    | SORT
    |--------------------------------------------------------------------------
    */

    if (sort === "price-low") {
      result.sort(
        (a, b) =>
          a.price - b.price
      );
    } else if (
      sort === "price-high"
    ) {
      result.sort(
        (a, b) =>
          b.price - a.price
      );
    } else if (sort === "rating") {
      result.sort(
        (a, b) =>
          b.rating - a.rating
      );
    } else if (sort === "newest") {
      result.sort((a, b) => {
        const dateA = new Date(
          a.createdAt || 0
        ).getTime();

        const dateB = new Date(
          b.createdAt || 0
        ).getTime();

        return dateB - dateA;
      });
    } else {
      result.sort((a, b) => {
        if (
          a.featured &&
          !b.featured
        ) {
          return -1;
        }

        if (
          !a.featured &&
          b.featured
        ) {
          return 1;
        }

        const dateA = new Date(
          a.createdAt || 0
        ).getTime();

        const dateB = new Date(
          b.createdAt || 0
        ).getTime();

        return dateB - dateA;
      });
    }

    return result;
  }, [
    products,
    search,
    category,
    brand,
    priceRange,
    sort,
  ]);

  /*
  |--------------------------------------------------------------------------
  | PAGINATION
  |--------------------------------------------------------------------------
  */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredProducts.length /
        PRODUCTS_PER_PAGE
    )
  );

  const safePage = Math.min(
    page,
    totalPages
  );

  const paginatedProducts =
    filteredProducts.slice(
      (safePage - 1) *
        PRODUCTS_PER_PAGE,
      safePage *
        PRODUCTS_PER_PAGE
    );

  /*
  |--------------------------------------------------------------------------
  | RESET PAGE WHEN FILTER CHANGES
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    setPage(1);
  }, [
    search,
    category,
    brand,
    priceRange,
    sort,
  ]);

  /*
  |--------------------------------------------------------------------------
  | CLEAR FILTERS
  |--------------------------------------------------------------------------
  */

  function clearFilters() {
    setSearch("");
    setCategory("");
    setBrand("");
    setPriceRange("all");
    setSort("featured");
    setPage(1);
  }

  const hasActiveFilters =
    Boolean(search) ||
    Boolean(category) ||
    Boolean(brand) ||
    priceRange !== "all";

  /*
  |--------------------------------------------------------------------------
  | CATEGORY NAME
  |--------------------------------------------------------------------------
  */

  const selectedCategory =
    CATEGORIES.find(
      (item) =>
        item.value.toLowerCase() ===
        category.toLowerCase()
    );

  /*
  |--------------------------------------------------------------------------
  | VISIBLE BRANDS
  |--------------------------------------------------------------------------
  */

  const visibleBrands =
    showAllBrands
      ? brands
      : brands.slice(0, 8);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* =========================================================
          HEADER
      ========================================================= */}

      <section className="border-b border-gray-200 bg-white">
        <div className="container-main py-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                ComputerHub Marketplace
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                {selectedCategory
                  ? selectedCategory.label
                  : "All Products"}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                Browse laptops, desktop PCs,
                components, monitors, gaming
                products and computer accessories
                available in the ComputerHub
                marketplace.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 ring-1 ring-gray-200">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "product"
                : "products"}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SEARCH BAR
      ========================================================= */}

      <section className="border-b border-gray-200 bg-white">
        <div className="container-main py-5">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search laptops, PCs, components, monitors, gaming products..."
                className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Clear search"
                >
                  <X size={17} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                setMobileFiltersOpen(
                  true
                )
              }
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 text-sm font-bold text-gray-800 transition hover:bg-gray-50 lg:hidden"
            >
              <SlidersHorizontal
                size={18}
              />
              Filters
            </button>

            <div className="relative">
              <select
                value={sort}
                onChange={(event) =>
                  setSort(
                    event.target.value
                  )
                }
                className="h-12 min-w-[220px] appearance-none rounded-xl border border-gray-300 bg-white px-4 pr-10 text-sm font-semibold text-gray-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              >
                {SORT_OPTIONS.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={
                        option.value
                      }
                    >
                      {option.label}
                    </option>
                  )
                )}
              </select>

              <ChevronDown
                size={17}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          MAIN SHOP AREA
      ========================================================= */}

      <div className="container-main py-8">
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-[260px_1fr]">
          {/* =====================================================
              DESKTOP FILTER SIDEBAR
          ===================================================== */}

          <aside className="hidden lg:block">
            <div className="sticky top-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter
                    size={18}
                    className="text-blue-600"
                  />

                  <h2 className="font-black text-slate-900">
                    Filters
                  </h2>
                </div>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={
                      clearFilters
                    }
                    className="text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* CATEGORY */}

              <div className="mt-6 border-t border-gray-100 pt-5">
                <h3 className="text-sm font-black text-slate-900">
                  Category
                </h3>

                <div className="mt-3 space-y-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCategory("")
                    }
                    className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                      !category
                        ? "bg-blue-50 font-bold text-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    All Products
                  </button>

                  {CATEGORIES.map(
                    (item) => (
                      <button
                        type="button"
                        key={
                          item.value
                        }
                        onClick={() =>
                          setCategory(
                            item.value
                          )
                        }
                        className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                          category.toLowerCase() ===
                          item.value.toLowerCase()
                            ? "bg-blue-50 font-bold text-blue-700"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        {item.label}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* BRAND */}

              {brands.length > 0 && (
                <div className="mt-6 border-t border-gray-100 pt-5">
                  <h3 className="text-sm font-black text-slate-900">
                    Brand
                  </h3>

                  <div className="mt-3 space-y-2">
                    {visibleBrands.map(
                      (item) => (
                        <label
                          key={item}
                          className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
                        >
                          <input
                            type="radio"
                            name="brand"
                            value={item}
                            checked={
                              brand ===
                              item
                            }
                            onChange={() =>
                              setBrand(
                                item
                              )
                            }
                            className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                          />

                          <span>
                            {item}
                          </span>
                        </label>
                      )
                    )}
                  </div>

                  {brands.length >
                    8 && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowAllBrands(
                          (value) =>
                            !value
                        )
                      }
                      className="mt-2 px-2 text-xs font-bold text-blue-600 hover:text-blue-700"
                    >
                      {showAllBrands
                        ? "Show Less"
                        : "Show More"}
                    </button>
                  )}

                  {brand && (
                    <button
                      type="button"
                      onClick={() =>
                        setBrand("")
                      }
                      className="mt-3 text-xs font-semibold text-gray-500 hover:text-gray-800"
                    >
                      Clear brand
                    </button>
                  )}
                </div>
              )}

              {/* PRICE */}

              <div className="mt-6 border-t border-gray-100 pt-5">
                <h3 className="text-sm font-black text-slate-900">
                  Price
                </h3>

                <div className="mt-3 space-y-2">
                  {PRICE_RANGES.map(
                    (range) => (
                      <label
                        key={
                          range.value
                        }
                        className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
                      >
                        <input
                          type="radio"
                          name="price"
                          value={
                            range.value
                          }
                          checked={
                            priceRange ===
                            range.value
                          }
                          onChange={() =>
                            setPriceRange(
                              range.value
                            )
                          }
                          className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                        />

                        <span>
                          {range.label}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* =====================================================
              PRODUCTS
          ===================================================== */}

          <section>
            {/* ACTIVE FILTERS */}

            {hasActiveFilters && (
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs font-bold uppercase tracking-wide text-gray-400">
                  Active filters:
                </span>

                {category && (
                  <button
                    type="button"
                    onClick={() =>
                      setCategory("")
                    }
                    className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700"
                  >
                    {
                      selectedCategory?.label ||
                      category
                    }
                    <X size={13} />
                  </button>
                )}

                {brand && (
                  <button
                    type="button"
                    onClick={() =>
                      setBrand("")
                    }
                    className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700"
                  >
                    {brand}
                    <X size={13} />
                  </button>
                )}

                {priceRange !==
                  "all" && (
                  <button
                    type="button"
                    onClick={() =>
                      setPriceRange(
                        "all"
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700"
                  >
                    {
                      PRICE_RANGES.find(
                        (item) =>
                          item.value ===
                          priceRange
                      )?.label
                    }
                    <X size={13} />
                  </button>
                )}

                {search && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearch("")
                    }
                    className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700"
                  >
                    <span className="max-w-[180px] truncate">
                      Search:{" "}
                      {search}
                    </span>

                    <X size={13} />
                  </button>
                )}
              </div>
            )}

            {/* LOADING */}

            {loading && (
              <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-gray-200 bg-white">
                <div className="text-center">
                  <Loader2
                    size={38}
                    className="mx-auto animate-spin text-blue-600"
                  />

                  <p className="mt-4 text-sm font-semibold text-gray-600">
                    Loading ComputerHub
                    products...
                  </p>
                </div>
              </div>
            )}

            {/* ERROR */}

            {!loading && error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                  <PackageSearch
                    size={28}
                  />
                </div>

                <h2 className="mt-5 text-xl font-black text-red-800">
                  Products could not be
                  loaded
                </h2>

                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-red-700">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    window.location.reload()
                  }
                  className="mt-5 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* NO RESULTS */}

            {!loading &&
              !error &&
              filteredProducts.length ===
                0 && (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-20 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <PackageSearch
                      size={31}
                    />
                  </div>

                  <h2 className="mt-5 text-2xl font-black text-slate-900">
                    No products found
                  </h2>

                  <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500">
                    {products.length ===
                    0
                      ? "There are currently no active products in your ComputerHub MongoDB catalog."
                      : "No products match your current search and filter settings."}
                  </p>

                  {products.length >
                    0 && (
                    <button
                      type="button"
                      onClick={
                        clearFilters
                      }
                      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                    >
                      Clear Filters
                      <ArrowRight
                        size={17}
                      />
                    </button>
                  )}

                  {products.length ===
                    0 && (
                    <Link
                      href="/seller/products/add"
                      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                    >
                      Add Your First Product
                      <ArrowRight
                        size={17}
                      />
                    </Link>
                  )}
                </div>
              )}

            {/* PRODUCT GRID */}

            {!loading &&
              !error &&
              paginatedProducts.length >
                0 && (
                <>
                  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-500">
                        Showing{" "}
                        <span className="font-bold text-gray-800">
                          {(safePage -
                            1) *
                            PRODUCTS_PER_PAGE +
                            1}
                        </span>{" "}
                        -
                        <span className="font-bold text-gray-800">
                          {" "}
                          {Math.min(
                            safePage *
                              PRODUCTS_PER_PAGE,
                            filteredProducts.length
                          )}
                        </span>{" "}
                        of{" "}
                        <span className="font-bold text-gray-800">
                          {
                            filteredProducts.length
                          }
                        </span>{" "}
                        products
                      </p>
                    </div>

                    <div className="relative lg:hidden">
                      <select
                        value={sort}
                        onChange={(
                          event
                        ) =>
                          setSort(
                            event.target
                              .value
                          )
                        }
                        className="h-10 appearance-none rounded-lg border border-gray-300 bg-white px-3 pr-9 text-sm font-semibold text-gray-700"
                      >
                        {SORT_OPTIONS.map(
                          (
                            option
                          ) => (
                            <option
                              key={
                                option.value
                              }
                              value={
                                option.value
                              }
                            >
                              {
                                option.label
                              }
                            </option>
                          )
                        )}
                      </select>

                      <ChevronDown
                        size={15}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {paginatedProducts.map(
                      (product) => (
                        <ProductCard
                          key={
                            product.id
                          }
                          product={
                            product
                          }
                        />
                      )
                    )}
                  </div>

                  {/* PAGINATION */}

                  {totalPages > 1 && (
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        disabled={
                          safePage === 1
                        }
                        onClick={() =>
                          setPage(
                            (current) =>
                              Math.max(
                                1,
                                current -
                                  1
                              )
                          )
                        }
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Previous
                      </button>

                      {Array.from(
                        {
                          length:
                            totalPages,
                        },
                        (_, index) =>
                          index + 1
                      )
                        .filter(
                          (
                            pageNumber
                          ) => {
                            if (
                              totalPages <=
                              7
                            ) {
                              return true;
                            }

                            if (
                              pageNumber ===
                                1 ||
                              pageNumber ===
                                totalPages
                            ) {
                              return true;
                            }

                            return (
                              Math.abs(
                                pageNumber -
                                  safePage
                              ) <= 1
                            );
                          }
                        )
                        .map(
                          (
                            pageNumber
                          ) => (
                            <button
                              type="button"
                              key={
                                pageNumber
                              }
                              onClick={() =>
                                setPage(
                                  pageNumber
                                )
                              }
                              className={`h-10 min-w-10 rounded-lg px-3 text-sm font-bold transition ${
                                safePage ===
                                pageNumber
                                  ? "bg-blue-600 text-white"
                                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {
                                pageNumber
                              }
                            </button>
                          )
                        )}

                      <button
                        type="button"
                        disabled={
                          safePage ===
                          totalPages
                        }
                        onClick={() =>
                          setPage(
                            (current) =>
                              Math.min(
                                totalPages,
                                current +
                                  1
                              )
                          )
                        }
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
          </section>
        </div>
      </div>

      {/* =========================================================
          MOBILE FILTER DRAWER
      ========================================================= */}

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
            className="absolute inset-0 bg-black/50"
          />

          <div className="absolute right-0 top-0 h-full w-full max-w-sm overflow-y-auto bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal
                  size={19}
                  className="text-blue-600"
                />

                <h2 className="font-black text-slate-900">
                  Filters
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setMobileFiltersOpen(
                    false
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5">
              {/* CATEGORY */}

              <div>
                <h3 className="text-sm font-black text-slate-900">
                  Category
                </h3>

                <div className="mt-3 space-y-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCategory("")
                    }
                    className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
                      !category
                        ? "bg-blue-50 font-bold text-blue-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    All Products
                  </button>

                  {CATEGORIES.map(
                    (item) => (
                      <button
                        type="button"
                        key={
                          item.value
                        }
                        onClick={() =>
                          setCategory(
                            item.value
                          )
                        }
                        className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
                          category.toLowerCase() ===
                          item.value.toLowerCase()
                            ? "bg-blue-50 font-bold text-blue-700"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {item.label}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* BRAND */}

              {brands.length > 0 && (
                <div className="mt-7 border-t border-gray-100 pt-6">
                  <h3 className="text-sm font-black text-slate-900">
                    Brand
                  </h3>

                  <div className="mt-3 space-y-2">
                    {brands.map(
                      (item) => (
                        <label
                          key={item}
                          className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-gray-600"
                        >
                          <input
                            type="radio"
                            name="mobile-brand"
                            checked={
                              brand ===
                              item
                            }
                            onChange={() =>
                              setBrand(
                                item
                              )
                            }
                            className="h-4 w-4 text-blue-600"
                          />

                          {item}
                        </label>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* PRICE */}

              <div className="mt-7 border-t border-gray-100 pt-6">
                <h3 className="text-sm font-black text-slate-900">
                  Price
                </h3>

                <div className="mt-3 space-y-2">
                  {PRICE_RANGES.map(
                    (range) => (
                      <label
                        key={
                          range.value
                        }
                        className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-gray-600"
                      >
                        <input
                          type="radio"
                          name="mobile-price"
                          checked={
                            priceRange ===
                            range.value
                          }
                          onChange={() =>
                            setPriceRange(
                              range.value
                            )
                          }
                          className="h-4 w-4 text-blue-600"
                        />

                        {range.label}
                      </label>
                    )
                  )}
                </div>
              </div>

              <div className="mt-8 flex gap-3 border-t border-gray-100 pt-6">
                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                  className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
                >
                  Clear
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setMobileFiltersOpen(
                      false
                    )
                  }
                  className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}