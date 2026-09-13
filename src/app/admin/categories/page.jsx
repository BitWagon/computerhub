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
      console.error(
        "Admin categories loading error:",
        err
      );

      setError(
        err.message ||
          "Unable to load categories. Please try again."
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
        category.name
          ?.toLowerCase()
          .includes(value) ||
        category.slug
          ?.toLowerCase()
          .includes(value) ||
        category.description
          ?.toLowerCase()
          .includes(value)
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

      const response = await fetch(
        "/api/categories",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            id: categoryId,
            isActive: !category.isActive,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to update category."
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
        category.isActive
          ? "Category deactivated."
          : "Category activated."
      );
    } catch (err) {
      console.error(
        "Category status update error:",
        err
      );

      toast.error(
        err.message ||
          "Failed to update category."
      );
    } finally {
      setActionLoading("");
    }
  }

  async function deleteCategory(category) {
    const categoryId = category._id;

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${category.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(`delete-${categoryId}`);

      const response = await fetch(
        `/api/categories?id=${encodeURIComponent(
          categoryId
        )}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to delete category."
        );
      }

      setCategories((currentCategories) =>
        currentCategories.filter(
          (item) => item._id !== categoryId
        )
      );

      toast.success(
        "Category deleted successfully."
      );
    } catch (err) {
      console.error(
        "Category delete error:",
        err
      );

      toast.error(
        err.message ||
          "Failed to delete category."
      );
    } finally {
      setActionLoading("");
    }
  }

  function clearSearch() {
    setSearch("");
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container-main py-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Link
                  href="/admin"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-blue-500 hover:text-blue-600"
                  aria-label="Back to admin dashboard"
                >
                  <ArrowLeft size={19} />
                </Link>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                    Admin Panel
                  </p>

                  <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
                    Categories
                  </h1>
                </div>
              </div>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                Manage product categories, category
                visibility, featured categories and
                sorting.
              </p>
            </div>

            <Link
              href="/admin/categories/add"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Plus size={19} />
              Add Category
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-8">
        <div className="container-main">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {/* TOTAL */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Categories
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {totalCategories}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                  <FolderTree
                    size={24}
                    className="text-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* ACTIVE */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Active
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {activeCategories}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                  <CheckCircle2
                    size={24}
                    className="text-green-600"
                  />
                </div>
              </div>
            </div>

            {/* INACTIVE */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Inactive
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {inactiveCategories}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
                  <XCircle
                    size={24}
                    className="text-orange-600"
                  />
                </div>
              </div>
            </div>

            {/* FEATURED */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Featured
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {featuredCategories}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50">
                  <FolderTree
                    size={24}
                    className="text-purple-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="pb-12">
        <div className="container-main">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* SEARCH BAR */}
            <div className="border-b border-gray-200 p-4 md:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-md">
                  <Search
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search categories..."
                    className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-10 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                      aria-label="Clear search"
                    >
                      <X size={17} />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={loadCategories}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-blue-500 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <RefreshCw
                    size={17}
                    className={
                      loading
                        ? "animate-spin"
                        : ""
                    }
                  />
                  Refresh
                </button>
              </div>

              <div className="mt-4 text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {filteredCategories.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {totalCategories}
                </span>{" "}
                categories
              </div>
            </div>

            {/* LOADING */}
            {loading && (
              <div className="flex min-h-[350px] items-center justify-center p-8">
                <div className="text-center">
                  <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

                  <p className="mt-4 text-sm text-gray-500">
                    Loading categories...
                  </p>
                </div>
              </div>
            )}

            {/* ERROR */}
            {!loading && error && (
              <div className="p-8">
                <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
                  <h2 className="text-xl font-bold text-red-800">
                    Unable to Load Categories
                  </h2>

                  <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-red-600">
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={loadCategories}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    <RefreshCw size={17} />
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* EMPTY */}
            {!loading &&
              !error &&
              filteredCategories.length === 0 && (
                <div className="px-6 py-16 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                    <FolderTree
                      size={30}
                      className="text-blue-600"
                    />
                  </div>

                  <h2 className="mt-5 text-2xl font-bold text-gray-900">
                    {search
                      ? "No Categories Found"
                      : "No Categories Yet"}
                  </h2>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                    {search
                      ? "No categories match your search. Try another search term."
                      : "Create your first product category to get started."}
                  </p>

                  {search ? (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="mt-6 inline-flex items-center justify-center rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-blue-500 hover:text-blue-600"
                    >
                      Clear Search
                    </button>
                  ) : (
                    <Link
                      href="/admin/categories/add"
                      className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      <Plus size={18} />
                      Add Your First Category
                    </Link>
                  )}
                </div>
              )}

            {/* DESKTOP TABLE */}
            {!loading &&
              !error &&
              filteredCategories.length > 0 && (
                <div className="hidden overflow-x-auto lg:block">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Category
                        </th>

                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Slug
                        </th>

                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Sort
                        </th>

                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Featured
                        </th>

                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Status
                        </th>

                        <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {filteredCategories.map(
                        (category) => {
                          const categoryId =
                            category._id;

                          const isActive =
                            category.isActive !== false;

                          const isToggleLoading =
                            actionLoading ===
                            `toggle-${categoryId}`;

                          const isDeleteLoading =
                            actionLoading ===
                            `delete-${categoryId}`;

                          return (
                            <tr
                              key={categoryId}
                              className="transition hover:bg-gray-50"
                            >
                              {/* CATEGORY */}
                              <td className="px-5 py-4">
                                <div className="flex min-w-[280px] items-center gap-4">
                                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                                    {category.image ? (
                                      <Image
                                        src={
                                          category.image
                                        }
                                        alt={
                                          category.name
                                        }
                                        fill
                                        sizes="56px"
                                        className="object-cover"
                                      />
                                    ) : (
                                      <ImageIcon
                                        size={22}
                                        className="text-gray-400"
                                      />
                                    )}
                                  </div>

                                  <div className="min-w-0">
                                    <p className="truncate font-semibold text-gray-900">
                                      {category.name}
                                    </p>

                                    <p className="mt-1 line-clamp-1 max-w-xs text-xs text-gray-500">
                                      {category.description ||
                                        "No description"}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* SLUG */}
                              <td className="px-5 py-4">
                                <span className="rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-600">
                                  /{category.slug}
                                </span>
                              </td>

                              {/* SORT */}
                              <td className="px-5 py-4">
                                <span className="text-sm font-semibold text-gray-700">
                                  {Number(
                                    category.sortOrder ||
                                      0
                                  )}
                                </span>
                              </td>

                              {/* FEATURED */}
                              <td className="px-5 py-4">
                                {category.featured ? (
                                  <span className="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                                    Featured
                                  </span>
                                ) : (
                                  <span className="text-sm text-gray-400">
                                    No
                                  </span>
                                )}
                              </td>

                              {/* STATUS */}
                              <td className="px-5 py-4">
                                {isActive ? (
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                    <CheckCircle2
                                      size={14}
                                    />
                                    Active
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                                    <XCircle
                                      size={14}
                                    />
                                    Inactive
                                  </span>
                                )}
                              </td>

                              {/* ACTIONS */}
                              <td className="px-5 py-4">
                                <div className="flex items-center justify-end gap-2">
                                  <Link
                                    href={`/admin/categories/edit/${categoryId}`}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-blue-500 hover:text-blue-600"
                                  >
                                    <Edit
                                      size={14}
                                    />
                                    Edit
                                  </Link>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      toggleCategory(
                                        category
                                      )
                                    }
                                    disabled={
                                      isToggleLoading ||
                                      isDeleteLoading
                                    }
                                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                      isActive
                                        ? "border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
                                        : "border border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                                    }`}
                                  >
                                    {isToggleLoading ? (
                                      <RefreshCw
                                        size={14}
                                        className="animate-spin"
                                      />
                                    ) : isActive ? (
                                      <XCircle
                                        size={14}
                                      />
                                    ) : (
                                      <CheckCircle2
                                        size={14}
                                      />
                                    )}

                                    {isActive
                                      ? "Deactivate"
                                      : "Activate"}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      deleteCategory(
                                        category
                                      )
                                    }
                                    disabled={
                                      isToggleLoading ||
                                      isDeleteLoading
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    {isDeleteLoading ? (
                                      <RefreshCw
                                        size={14}
                                        className="animate-spin"
                                      />
                                    ) : (
                                      <Trash2
                                        size={14}
                                      />
                                    )}

                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              )}

            {/* MOBILE CARDS */}
            {!loading &&
              !error &&
              filteredCategories.length > 0 && (
                <div className="space-y-4 p-4 lg:hidden">
                  {filteredCategories.map(
                    (category) => {
                      const categoryId =
                        category._id;

                      const isActive =
                        category.isActive !== false;

                      const isToggleLoading =
                        actionLoading ===
                        `toggle-${categoryId}`;

                      const isDeleteLoading =
                        actionLoading ===
                        `delete-${categoryId}`;

                      return (
                        <div
                          key={categoryId}
                          className="rounded-2xl border border-gray-200 p-4"
                        >
                          <div className="flex gap-4">
                            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                              {category.image ? (
                                <Image
                                  src={
                                    category.image
                                  }
                                  alt={
                                    category.name
                                  }
                                  fill
                                  sizes="64px"
                                  className="object-cover"
                                />
                              ) : (
                                <ImageIcon
                                  size={24}
                                  className="text-gray-400"
                                />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <h2 className="truncate font-bold text-gray-900">
                                    {category.name}
                                  </h2>

                                  <p className="mt-1 truncate text-xs text-gray-500">
                                    /{category.slug}
                                  </p>
                                </div>

                                {isActive ? (
                                  <span className="shrink-0 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700">
                                    Active
                                  </span>
                                ) : (
                                  <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600">
                                    Inactive
                                  </span>
                                )}
                              </div>

                              <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-500">
                                {category.description ||
                                  "No description"}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                            <span className="rounded-lg bg-gray-100 px-2.5 py-1.5 font-medium text-gray-600">
                              Sort:{" "}
                              {Number(
                                category.sortOrder ||
                                  0
                              )}
                            </span>

                            {category.featured && (
                              <span className="rounded-lg bg-purple-50 px-2.5 py-1.5 font-semibold text-purple-700">
                                Featured
                              </span>
                            )}
                          </div>

                          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                            <Link
                              href={`/admin/categories/edit/${categoryId}`}
                              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-300 px-3 py-2.5 text-xs font-semibold text-gray-700 transition hover:border-blue-500 hover:text-blue-600"
                            >
                              <Edit size={14} />
                              Edit
                            </Link>

                            <button
                              type="button"
                              onClick={() =>
                                toggleCategory(
                                  category
                                )
                              }
                              disabled={
                                isToggleLoading ||
                                isDeleteLoading
                              }
                              className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                isActive
                                  ? "border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
                                  : "border border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                              }`}
                            >
                              {isToggleLoading ? (
                                <RefreshCw
                                  size={14}
                                  className="animate-spin"
                                />
                              ) : isActive ? (
                                <XCircle
                                  size={14}
                                />
                              ) : (
                                <CheckCircle2
                                  size={14}
                                />
                              )}

                              {isActive
                                ? "Deactivate"
                                : "Activate"}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                deleteCategory(
                                  category
                                )
                              }
                              disabled={
                                isToggleLoading ||
                                isDeleteLoading
                              }
                              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isDeleteLoading ? (
                                <RefreshCw
                                  size={14}
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2
                                  size={14}
                                />
                              )}

                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
          </div>
        </div>
      </section>
    </main>
  );
}