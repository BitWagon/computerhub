"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Edit,
  FolderTree,
  ImageIcon,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function loadCategories() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/categories?includeInactive=true",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load categories."
        );
      }

      setCategories(
        Array.isArray(data.categories)
          ? data.categories
          : []
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load categories."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return categories;
    }

    return categories.filter((category) => {
      return (
        category.name?.toLowerCase().includes(value) ||
        category.slug?.toLowerCase().includes(value) ||
        category.description?.toLowerCase().includes(value)
      );
    });
  }, [categories, search]);

  const totalCategories = categories.length;

  const activeCategories = categories.filter(
    (category) => category.isActive !== false
  ).length;

  const inactiveCategories = categories.filter(
    (category) => category.isActive === false
  ).length;

  const featuredCategories = categories.filter(
    (category) => category.featured === true
  ).length;

  async function toggleCategory(category) {
    const categoryId = category._id;

    try {
      setActionLoading(`toggle-${categoryId}`);

      const response = await fetch("/api/categories", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id: categoryId,
          isActive: category.isActive === false,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to update category."
        );
      }

      setCategories((currentCategories) =>
        currentCategories.map((item) =>
          item._id === categoryId
            ? {
                ...item,
                ...data.category,
              }
            : item
        )
      );

      toast.success(
        category.isActive !== false
          ? "Category deactivated."
          : "Category activated."
      );
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to update category."
      );
    } finally {
      setActionLoading("");
    }
  }

  async function deleteCategory(category) {
    const categoryId = category._id;

    const confirmed = window.confirm(
      `Delete "${category.name}" permanently?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(`delete-${categoryId}`);

      const response = await fetch(
        `/api/categories?id=${categoryId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to delete category."
        );
      }

      setCategories((currentCategories) =>
        currentCategories.filter(
          (item) => item._id !== categoryId
        )
      );

      toast.success("Category deleted successfully.");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to delete category."
      );
    } finally {
      setActionLoading("");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link
              href="/admin"
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
            >
              <ArrowLeft size={16} />
              Admin Dashboard
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                <FolderTree size={23} />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                  Categories
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Organize and manage your product catalog.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={loadCategories}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <Link
              href="/admin/categories/add"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              <Plus size={17} />
              Add Category
            </Link>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* STATS */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-950">
                  {totalCategories}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FolderTree size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Active
                </p>

                <p className="mt-2 text-3xl font-bold text-emerald-600">
                  {activeCategories}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Inactive
                </p>

                <p className="mt-2 text-3xl font-bold text-rose-600">
                  {inactiveCategories}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <XCircle size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Featured
                </p>

                <p className="mt-2 text-3xl font-bold text-amber-600">
                  {featuredCategories}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <ImageIcon size={21} />
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by category name, slug or description..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
        </div>

        {/* CATEGORY LIST */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex min-h-[360px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
                  <RefreshCw
                    size={25}
                    className="animate-spin text-blue-600"
                  />
                </div>

                <p className="mt-4 text-sm font-medium text-slate-500">
                  Loading categories...
                </p>
              </div>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <FolderTree
                  size={28}
                  className="text-slate-400"
                />
              </div>

              <h2 className="mt-5 text-lg font-bold text-slate-900">
                No categories found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                {search
                  ? "Try a different search term."
                  : "Your catalog does not have any categories yet."}
              </p>

              {!search && (
                <Link
                  href="/admin/categories/add"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <Plus size={17} />
                  Create Category
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[1050px]">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                        Category
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                        Slug
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                        Products
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredCategories.map((category) => {
                      const toggleBusy =
                        actionLoading ===
                        `toggle-${category._id}`;

                      const deleteBusy =
                        actionLoading ===
                        `delete-${category._id}`;

                      return (
                        <tr
                          key={category._id}
                          className="transition hover:bg-slate-50/70"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                                {category.image ? (
                                  <Image
                                    src={category.image}
                                    alt={category.name}
                                    width={56}
                                    height={56}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center">
                                    <ImageIcon
                                      size={20}
                                      className="text-slate-400"
                                    />
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="font-semibold text-slate-900">
                                  {category.name}
                                </p>

                                <p className="mt-1 max-w-sm truncate text-xs text-slate-500">
                                  {category.description ||
                                    "No description"}
                                </p>

                                {category.featured && (
                                  <span className="mt-2 inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                                    Featured
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <code className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs text-slate-600">
                              {category.slug}
                            </code>
                          </td>

                          <td className="px-6 py-5">
                            <span className="font-semibold text-slate-900">
                              {Number(
                                category.productCount || 0
                              )}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            {category.isActive !== false ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                                <CheckCircle2 size={14} />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700">
                                <XCircle size={14} />
                                Inactive
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex justify-end gap-2">
                              <Link
                                href={`/admin/categories/edit/${category._id}`}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                              >
                                <Edit size={14} />
                                Edit
                              </Link>

                              <button
                                type="button"
                                onClick={() =>
                                  toggleCategory(category)
                                }
                                disabled={toggleBusy}
                                className={`rounded-lg px-3 py-2 text-xs font-bold transition disabled:opacity-50 ${
                                  category.isActive !== false
                                    ? "bg-rose-50 text-rose-700 hover:bg-rose-100"
                                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                }`}
                              >
                                {toggleBusy
                                  ? "Saving..."
                                  : category.isActive !== false
                                  ? "Deactivate"
                                  : "Activate"}
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  deleteCategory(category)
                                }
                                disabled={deleteBusy}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
                              >
                                <Trash2 size={14} />
                                {deleteBusy
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* MOBILE / TABLET CARDS */}
              <div className="divide-y divide-slate-100 lg:hidden">
                {filteredCategories.map((category) => {
                  const toggleBusy =
                    actionLoading ===
                    `toggle-${category._id}`;

                  const deleteBusy =
                    actionLoading ===
                    `delete-${category._id}`;

                  return (
                    <div
                      key={category._id}
                      className="p-5 sm:p-6"
                    >
                      <div className="flex gap-4">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                          {category.image ? (
                            <Image
                              src={category.image}
                              alt={category.name}
                              width={64}
                              height={64}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <ImageIcon
                                size={22}
                                className="text-slate-400"
                              />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-slate-900">
                              {category.name}
                            </h3>

                            {category.featured && (
                              <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">
                                Featured
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-xs text-slate-500">
                            {category.description ||
                              "No description"}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <code className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] text-slate-600">
                              {category.slug}
                            </code>

                            {category.isActive !== false ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                                <CheckCircle2 size={12} />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700">
                                <XCircle size={12} />
                                Inactive
                              </span>
                            )}

                            <span className="text-xs font-semibold text-slate-500">
                              {Number(
                                category.productCount || 0
                              )}{" "}
                              products
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-2">
                        <Link
                          href={`/admin/categories/edit/${category._id}`}
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2.5 text-xs font-bold text-blue-700"
                        >
                          <Edit size={14} />
                          Edit
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            toggleCategory(category)
                          }
                          disabled={toggleBusy}
                          className={`rounded-lg px-3 py-2.5 text-xs font-bold disabled:opacity-50 ${
                            category.isActive !== false
                              ? "bg-rose-50 text-rose-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {toggleBusy
                            ? "Saving..."
                            : category.isActive !== false
                            ? "Disable"
                            : "Enable"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteCategory(category)
                          }
                          disabled={deleteBusy}
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2.5 text-xs font-bold text-white disabled:opacity-50"
                        >
                          <Trash2 size={14} />
                          {deleteBusy
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* QUICK ACTIONS */}
        <div className="mt-8">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-950">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Common catalog management tasks.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Link
              href="/admin/categories/add"
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Plus size={21} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Add Category
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Create a new catalog category.
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/products"
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <FolderTree size={21} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Manage Products
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Review and manage catalog products.
                  </p>
                </div>
              </div>
            </Link>

            <button
              type="button"
              onClick={loadCategories}
              className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <RefreshCw size={21} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Refresh Data
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Reload the latest category data.
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}