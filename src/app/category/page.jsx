"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  FolderTree,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function loadCategories() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/categories", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message || "Failed to load categories."
        );
      }

      setCategories(
        Array.isArray(data.categories)
          ? data.categories
          : []
      );
    } catch (err) {
      console.error("Categories loading error:", err);

      setError(
        err?.message || "Unable to load categories."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return categories;
    }

    return categories.filter((category) => {
      const name = String(category?.name || "").toLowerCase();

      const description = String(
        category?.description || ""
      ).toLowerCase();

      const slug = String(
        category?.slug || ""
      ).toLowerCase();

      return (
        name.includes(query) ||
        description.includes(query) ||
        slug.includes(query)
      );
    });
  }, [categories, search]);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO */}

      <section className="border-b border-slate-200 bg-white">
        <div className="container-main py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-blue-700">
              <FolderTree size={14} />

              ComputerHub Marketplace
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Shop by Category
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              Explore computers, components, monitors,
              gaming hardware and accessories from the
              ComputerHub marketplace.
            </p>
          </div>

          {/* SEARCH */}

          <div className="mt-8 max-w-2xl">
            <label
              htmlFor="category-search"
              className="sr-only"
            >
              Search categories
            </label>

            <div className="relative">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="category-search"
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search categories..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-11 pr-12 text-sm font-medium text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear category search"
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}

      <section className="container-main py-8 sm:py-10 lg:py-12">
        {/* TOP BAR */}

        {!loading && !error && categories.length > 0 && (
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Explore ComputerHub
              </p>

              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                Technology Categories
              </h2>
            </div>

            <p className="text-sm font-medium text-slate-500">
              {filteredCategories.length}{" "}
              {filteredCategories.length === 1
                ? "category"
                : "categories"}
              {search ? " found" : " available"}
            </p>
          </div>
        )}

        {/* LOADING */}

        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="animate-pulse">
                    <div className="h-14 w-14 rounded-2xl bg-slate-200" />

                    <div className="mt-5 h-5 w-2/3 rounded bg-slate-200" />

                    <div className="mt-3 space-y-2">
                      <div className="h-3 w-full rounded bg-slate-100" />
                      <div className="h-3 w-5/6 rounded bg-slate-100" />
                    </div>

                    <div className="mt-6 h-4 w-28 rounded bg-slate-200" />
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="rounded-3xl border border-red-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <FolderTree size={28} />
            </div>

            <h2 className="mt-5 text-xl font-black text-slate-950">
              Unable to load categories
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {error}
            </p>

            <button
              type="button"
              onClick={loadCategories}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              <RefreshCw size={16} />

              Try Again
            </button>
          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          filteredCategories.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Search size={28} />
              </div>

              <h2 className="mt-5 text-xl font-black text-slate-950">
                No categories found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Try a different category name or clear
                your search.
              </p>

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-6 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}

        {/* CATEGORY GRID */}

        {!loading &&
          !error &&
          filteredCategories.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCategories.map((category) => {
                const categoryId =
                  category?._id ||
                  category?.slug ||
                  category?.name;

                return (
                  <Link
                    key={categoryId}
                    href={`/category/${category.slug}`}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                  >
                    {/* TOP */}

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 text-blue-600">
                        {category?.image ? (
                          <img
                            src={category.image}
                            alt={
                              category.name ||
                              "Category"
                            }
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <FolderTree size={24} />
                        )}
                      </div>

                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition duration-300 group-hover:bg-blue-50 group-hover:text-blue-600">
                        <ArrowRight size={17} />
                      </div>
                    </div>

                    {/* CONTENT */}

                    <div className="mt-6">
                      <h3 className="text-lg font-black tracking-tight text-slate-950 transition group-hover:text-blue-600">
                        {category?.name ||
                          "Category"}
                      </h3>

                      <p className="mt-2 line-clamp-3 min-h-[60px] text-sm leading-5 text-slate-500">
                        {category?.description ||
                          `Explore ${category?.name || "category"} products on ComputerHub.`}
                      </p>
                    </div>

                    {/* FOOTER */}

                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-sm font-bold text-blue-600">
                        Browse Products
                      </span>

                      <span className="text-xs font-medium text-slate-400 transition group-hover:text-blue-500">
                        Explore
                      </span>
                    </div>

                    {/* HOVER ACCENT */}

                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full" />
                  </Link>
                );
              })}
            </div>
          )}
      </section>
    </main>
  );
}