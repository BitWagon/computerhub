"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  FolderTree,
  RefreshCw,
  Search,
} from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  async function loadCategories() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/categories",
        {
          cache: "no-store",
        }
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to load categories."
        );
      }

      setCategories(
        Array.isArray(data.categories)
          ? data.categories
          : []
      );
    } catch (error) {
      console.error(
        "Categories loading error:",
        error
      );

      setError(
        error.message ||
          "Unable to load categories."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategories =
    categories.filter((category) => {
      const searchText =
        search.trim().toLowerCase();

      if (!searchText) {
        return true;
      }

      return (
        category.name
          ?.toLowerCase()
          .includes(searchText) ||
        category.description
          ?.toLowerCase()
          .includes(searchText)
      );
    });

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO */}

      <section className="border-b border-gray-200 bg-white">
        <div className="container-main py-10 sm:py-14">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-600">
              <FolderTree size={14} />

              ComputerHub Marketplace
            </div>

            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Shop by Category
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
              Explore laptops, desktop PCs,
              components, monitors, accessories,
              gaming products and other computer
              technology available on ComputerHub.
            </p>
          </div>

          {/* SEARCH */}

          <div className="mt-8 max-w-xl">
            <label
              htmlFor="category-search"
              className="sr-only"
            >
              Search categories
            </label>

            <div className="relative">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="category-search"
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search categories..."
                className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}

      <div className="container-main py-8 sm:py-10">
        {/* LOADING */}

        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({
              length: 8,
            }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5"
              >
                <div className="h-12 w-12 rounded-xl bg-gray-200" />

                <div className="mt-5 h-5 w-2/3 rounded bg-gray-200" />

                <div className="mt-3 h-10 w-full rounded bg-gray-100" />

                <div className="mt-5 h-4 w-28 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-red-500">
              <FolderTree size={25} />
            </div>

            <h2 className="mt-4 text-xl font-bold text-red-700">
              Unable to load categories
            </h2>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={loadCategories}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
            >
              <RefreshCw size={16} />

              Try Again
            </button>
          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          filteredCategories.length ===
            0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                <Search size={28} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-gray-900">
                No categories found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Try a different category name.
              </p>

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}

        {/* CATEGORY GRID */}

        {!loading &&
          !error &&
          filteredCategories.length >
            0 && (
            <>
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    All Categories
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {filteredCategories.length}{" "}
                    {filteredCategories.length ===
                    1
                      ? "category"
                      : "categories"}{" "}
                    available
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredCategories.map(
                  (category) => (
                    <Link
                      key={
                        category._id ||
                        category.slug
                      }
                      href={`/category/${category.slug}`}
                      className="group rounded-2xl border border-gray-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-50 text-blue-600">
                          {category.image ? (
                            <img
                              src={
                                category.image
                              }
                              alt={
                                category.name ||
                                "Category"
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <FolderTree
                              size={22}
                            />
                          )}
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition group-hover:bg-blue-50 group-hover:text-blue-600">
                          <ArrowRight
                            size={17}
                          />
                        </div>
                      </div>

                      <h3 className="mt-5 text-lg font-black text-slate-900 transition group-hover:text-blue-600">
                        {category.name}
                      </h3>

                      <p className="mt-2 line-clamp-3 min-h-[60px] text-sm leading-5 text-gray-500">
                        {category.description ||
                          `Explore ${category.name} products on ComputerHub.`}
                      </p>

                      <div className="mt-5 border-t border-gray-100 pt-4">
                        <span className="text-sm font-bold text-blue-600">
                          Browse Products
                        </span>
                      </div>
                    </Link>
                  )
                )}
              </div>
            </>
          )}
      </div>
    </main>
  );
}