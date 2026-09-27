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
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
            <Link
              href="/admin"
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600"
            >
              <ArrowLeft size={17} />
              Back to Admin
            </Link>

            <h1 className="text-3xl font-bold text-gray-900">
              Categories
            </h1>

            <p className="mt-1 text-gray-500">
              Manage all ComputerHub product categories.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={loadCategories}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <Link
              href="/admin/categories/add"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Plus size={17} />
              Add Category
            </Link>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* STATS */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <FolderTree className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">
                  Total Categories
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {totalCategories}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-green-600" />
              <div>
                <p className="text-sm text-gray-500">
                  Active
                </p>
                <p className="mt-2 text-3xl font-bold text-green-600">
                  {activeCategories}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <XCircle className="text-red-600" />
              <div>
                <p className="text-sm text-gray-500">
                  Inactive
                </p>
                <p className="mt-2 text-3xl font-bold text-red-600">
                  {inactiveCategories}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <ImageIcon className="text-orange-600" />
              <div>
                <p className="text-sm text-gray-500">
                  Featured
                </p>
                <p className="mt-2 text-3xl font-bold text-orange-600">
                  {featuredCategories}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mb-6 rounded-2xl border bg-white p-4 shadow-sm">
          <div className="relative">
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
              className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="text-center">
                <RefreshCw
                  className="mx-auto animate-spin text-blue-600"
                  size={30}
                />

                <p className="mt-3 text-sm text-gray-500">
                  Loading categories...
                </p>
              </div>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="p-12 text-center">
              <FolderTree
                size={40}
                className="mx-auto text-gray-300"
              />

              <h2 className="mt-4 text-lg font-bold text-gray-900">
                No categories found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {search
                  ? "Try another search."
                  : "No categories available yet."}
              </p>

              {!search && (
                <Link
                  href="/admin/categories/add"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Plus size={17} />
                  Add First Category
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Category
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Slug
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Products
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredCategories.map((category) => {
                    const toggleBusy =
                      actionLoading === `toggle-${category._id}`;

                    const deleteBusy =
                      actionLoading === `delete-${category._id}`;

                    return (
                      <tr
                        key={category._id}
                        className="hover:bg-gray-50"
                      >
                                                {/* CATEGORY */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-14 w-14 overflow-hidden rounded-xl bg-gray-100">
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
                                    className="text-gray-400"
                                  />
                                </div>
                              )}
                            </div>

                            <div>
                              <p className="font-semibold text-gray-900">
                                {category.name}
                              </p>

                              <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                                {category.description || "No description"}
                              </p>

                              {category.featured && (
                                <span className="mt-2 inline-flex rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-700">
                                  Featured
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* SLUG */}
                        <td className="px-5 py-4">
                          <code className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">
                            {category.slug}
                          </code>
                        </td>

                        {/* PRODUCTS */}
                        <td className="px-5 py-4">
                          <span className="font-semibold text-gray-900">
                            {Number(category.productCount || 0)}
                          </span>
                        </td>

                        {/* STATUS */}
                        <td className="px-5 py-4">
                          {category.isActive !== false ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                              <CheckCircle2 size={14} />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                              <XCircle size={14} />
                              Inactive
                            </span>
                          )}
                        </td>

                        {/* ACTIONS */}
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">

                            <Link
                              href={`/admin/categories/edit/${category._id}`}
                              className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                            >
                              <Edit size={14} />
                              Edit
                            </Link>

                            <button
                              type="button"
                              onClick={() => toggleCategory(category)}
                              disabled={toggleBusy}
                              className={`rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-50 ${
                                category.isActive !== false
                                  ? "bg-red-50 text-red-700 hover:bg-red-100"
                                  : "bg-green-50 text-green-700 hover:bg-green-100"
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
                              onClick={() => deleteCategory(category)}
                              disabled={deleteBusy}
                              className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                            >
                              <Trash2 size={14} />
                              {deleteBusy ? "Deleting..." : "Delete"}
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })}
                                  </tbody>
              </table>
            </div>
          )}
        </div>

        {/* QUICK ACTIONS */}
        <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Common category management shortcuts.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/admin/categories/add"
              className="group rounded-xl border border-gray-200 p-5 transition hover:border-blue-300 hover:bg-blue-50"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-3">
                  <Plus
                    size={22}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Add Category
                  </h3>

                  <p className="text-sm text-gray-500">
                    Create a new category.
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/products"
              className="group rounded-xl border border-gray-200 p-5 transition hover:border-green-300 hover:bg-green-50"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-3">
                  <FolderTree
                    size={22}
                    className="text-green-600"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Manage Products
                  </h3>

                  <p className="text-sm text-gray-500">
                    View products by category.
                  </p>
                </div>
              </div>
            </Link>

            <button
              type="button"
              onClick={loadCategories}
              className="group rounded-xl border border-gray-200 p-5 text-left transition hover:border-orange-300 hover:bg-orange-50"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-orange-100 p-3">
                  <RefreshCw
                    size={22}
                    className="text-orange-600"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Refresh
                  </h3>

                  <p className="text-sm text-gray-500">
                    Reload category data.
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