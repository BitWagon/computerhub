"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  FolderTree,
  Image as ImageIcon,
  Loader2,
  Save,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();

  const categoryId = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    isActive: true,
    featured: false,
    sortOrder: 0,
  });

  useEffect(() => {
    if (!categoryId) return;

    async function loadCategory() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/categories?id=${encodeURIComponent(categoryId)}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load category."
          );
        }

        const category =
          data.category ||
          data.categories?.find(
            (item) =>
              String(item._id) === String(categoryId)
          );

        if (!category) {
          throw new Error("Category not found.");
        }

        setFormData({
          name: category.name || "",
          description: category.description || "",
          image: category.image || "",
          isActive: category.isActive !== false,
          featured: category.featured === true,
          sortOrder: Number(category.sortOrder || 0),
        });
      } catch (err) {
        console.error("Load category error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load category."
        );
      } finally {
        setLoading(false);
      }
    }

    loadCategory();
  }, [categoryId]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    if (!categoryId) {
      toast.error("Category ID is missing.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch("/api/categories", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id: categoryId,
          name: formData.name.trim(),
          description: formData.description.trim(),
          image: formData.image.trim(),
          isActive: formData.isActive,
          featured: formData.featured,
          sortOrder: Number(formData.sortOrder || 0),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to update category."
        );
      }

      toast.success("Category updated successfully.");

      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      console.error("Update category error:", err);

      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to update category."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
              <Loader2
                size={26}
                className="animate-spin text-blue-600"
              />
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-600">
              Loading category...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to Categories
          </Link>

          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6">
            <h1 className="text-lg font-bold text-red-800">
              Unable to load category
            </h1>

            <p className="mt-2 text-sm text-red-700">
              {error}
            </p>

            <Link
              href="/admin/categories"
              className="mt-5 inline-flex rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
            >
              Return to Categories
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="mb-8">
          <Link
            href="/admin/categories"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to Categories
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <FolderTree size={25} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                Catalog Management
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Edit Category
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Update your category information and storefront settings.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          {/* CATEGORY INFORMATION */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-5 sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FolderTree size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-950">
                    Category Information
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Update the category details below.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 p-5 sm:p-7">

              {/* NAME */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Category Name
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  maxLength={100}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Add a concise category description..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* IMAGE */}
              <div>
                <label
                  htmlFor="image"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Category Image URL
                </label>

                <div className="relative">
                  <ImageIcon
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="image"
                    name="image"
                    type="url"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/category-image.jpg"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                {formData.image.trim() && (
                  <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    <div className="border-b border-slate-200 px-4 py-3">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                        <ImageIcon size={14} />
                        Image Preview
                      </div>
                    </div>

                    <div className="p-4">
                      <img
                        src={formData.image}
                        alt="Category preview"
                        className="h-52 w-full rounded-xl object-cover"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* SORT ORDER */}
              <div className="max-w-sm">
                <label
                  htmlFor="sortOrder"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Sort Order
                </label>

                <input
                  id="sortOrder"
                  name="sortOrder"
                  type="number"
                  min="0"
                  value={formData.sortOrder}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Lower numbers appear first.
                </p>
              </div>
            </div>
          </section>

          {/* SETTINGS */}
          <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-5 sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Sparkles size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-950">
                    Category Settings
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Control visibility and featured placement.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 p-5 sm:p-7 md:grid-cols-2">

              {/* ACTIVE */}
              <label
                className={`flex cursor-pointer gap-4 rounded-2xl border p-5 transition ${
                  formData.isActive
                    ? "border-emerald-200 bg-emerald-50/60"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="mt-1 h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />

                <span>
                  <span className="flex items-center gap-2 font-bold text-slate-900">
                    Active Category
                    {formData.isActive && (
                      <CheckCircle2
                        size={16}
                        className="text-emerald-600"
                      />
                    )}
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    Customers can see this category when active.
                  </span>
                </span>
              </label>

              {/* FEATURED */}
              <label
                className={`flex cursor-pointer gap-4 rounded-2xl border p-5 transition ${
                  formData.featured
                    ? "border-amber-200 bg-amber-50/60"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="mt-1 h-5 w-5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />

                <span>
                  <span className="flex items-center gap-2 font-bold text-slate-900">
                    Featured Category
                    {formData.featured && (
                      <Sparkles
                        size={16}
                        className="text-amber-600"
                      />
                    )}
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    Highlight this category in featured areas.
                  </span>
                </span>
              </label>
            </div>
          </section>

          {/* ACTIONS */}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/admin/categories"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}