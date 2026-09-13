"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  FolderTree,
  Image as ImageIcon,
  Loader2,
  Save,
  XCircle,
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
    if (!categoryId) {
      return;
    }

    async function loadCategory() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/categories?includeInactive=true`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Failed to load category."
          );
        }

        const category = Array.isArray(
          data.categories
        )
          ? data.categories.find(
              (item) =>
                String(item._id) ===
                String(categoryId)
            )
          : null;

        if (!category) {
          throw new Error(
            "Category was not found."
          );
        }

        setFormData({
          name: category.name || "",
          description:
            category.description || "",
          image: category.image || "",
          isActive:
            category.isActive !== false,
          featured:
            category.featured === true,
          sortOrder: Number(
            category.sortOrder || 0
          ),
        });
      } catch (err) {
        console.error(
          "Load category error:",
          err
        );

        setError(
          err.message ||
            "Unable to load category."
        );
      } finally {
        setLoading(false);
      }
    }

    loadCategory();
  }, [categoryId]);

  function handleChange(event) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast.error(
        "Category name is required."
      );
      return;
    }

    try {
      setSaving(true);

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
            name: formData.name.trim(),
            description:
              formData.description.trim(),
            image: formData.image.trim(),
            isActive: formData.isActive,
            featured: formData.featured,
            sortOrder: Number(
              formData.sortOrder || 0
            ),
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

      toast.success(
        "Category updated successfully."
      );

      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      console.error(
        "Update category error:",
        err
      );

      toast.error(
        err.message ||
          "Failed to update category."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <section className="border-b border-gray-200 bg-white">
          <div className="container-main py-8">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/categories"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-blue-500 hover:text-blue-600"
              >
                <ArrowLeft size={19} />
              </Link>

              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                  Admin Panel
                </p>

                <h1 className="mt-1 text-3xl font-bold text-gray-900">
                  Edit Category
                </h1>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container-main">
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

                <p className="mt-4 text-sm text-gray-500">
                  Loading category...
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50">
        <section className="border-b border-gray-200 bg-white">
          <div className="container-main py-8">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/categories"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-blue-500 hover:text-blue-600"
              >
                <ArrowLeft size={19} />
              </Link>

              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                  Admin Panel
                </p>

                <h1 className="mt-1 text-3xl font-bold text-gray-900">
                  Edit Category
                </h1>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container-main">
            <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                <XCircle
                  size={28}
                  className="text-red-600"
                />
              </div>

              <h2 className="mt-4 text-xl font-bold text-red-800">
                Unable to Load Category
              </h2>

              <p className="mt-2 text-sm leading-6 text-red-600">
                {error}
              </p>

              <Link
                href="/admin/categories"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                <ArrowLeft size={17} />
                Back to Categories
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container-main py-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/categories"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-blue-500 hover:text-blue-600"
              aria-label="Back to categories"
            >
              <ArrowLeft size={19} />
            </Link>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Admin Panel
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
                Edit Category
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Update the information and settings
                for this category.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="py-10 md:py-12">
        <div className="container-main">
          <div className="mx-auto max-w-4xl">
            <form
              onSubmit={handleSubmit}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              {/* FORM HEADER */}
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-5 md:px-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                    <FolderTree
                      size={23}
                      className="text-blue-600"
                    />
                  </div>

                  <div>
                    <h2 className="font-bold text-gray-900">
                      Category Information
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                      Update the details below and
                      save your changes.
                    </p>
                  </div>
                </div>
              </div>

              {/* FORM BODY */}
              <div className="space-y-6 p-6 md:p-8">
                {/* NAME */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Category Name
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    maxLength={100}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    Changing the name may also change
                    the category URL slug.
                  </p>
                </div>

                {/* DESCRIPTION */}
                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    value={
                      formData.description
                    }
                    onChange={handleChange}
                    rows={5}
                    placeholder="Describe this category..."
                    className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* IMAGE */}
                <div>
                  <label
                    htmlFor="image"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Category Image URL
                  </label>

                  <div className="relative">
                    <ImageIcon
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="image"
                      name="image"
                      type="url"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="https://example.com/category-image.jpg"
                      className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* IMAGE PREVIEW */}
                  {formData.image.trim() && (
                    <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                      <div className="p-3">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Image Preview
                        </p>

                        <div className="relative h-52 w-full overflow-hidden rounded-lg bg-gray-100">
                          <Image
                            src={formData.image}
                            alt={
                              formData.name ||
                              "Category preview"
                            }
                            fill
                            sizes="(max-width: 768px) 100vw, 800px"
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* SORT ORDER */}
                <div>
                  <label
                    htmlFor="sortOrder"
                    className="mb-2 block text-sm font-semibold text-gray-700"
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
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    Lower numbers appear first.
                  </p>
                </div>

                {/* STATUS OPTIONS */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* ACTIVE */}
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:border-blue-300">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={
                        formData.isActive
                      }
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />

                    <span>
                      <span className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                        {formData.isActive ? (
                          <CheckCircle2
                            size={16}
                            className="text-green-600"
                          />
                        ) : (
                          <XCircle
                            size={16}
                            className="text-gray-400"
                          />
                        )}
                        Active Category
                      </span>

                      <span className="mt-1 block text-xs leading-5 text-gray-500">
                        Customers can see this
                        category when active.
                      </span>
                    </span>
                  </label>

                  {/* FEATURED */}
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:border-blue-300">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={
                        formData.featured
                      }
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />

                    <span>
                      <span className="block text-sm font-semibold text-gray-900">
                        Featured Category
                      </span>

                      <span className="mt-1 block text-xs leading-5 text-gray-500">
                        Mark this category as featured
                        for the storefront.
                      </span>
                    </span>
                  </label>
                </div>
              </div>

              {/* FOOTER */}
              <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 px-6 py-5 sm:flex-row sm:justify-end md:px-8">
                <Link
                  href="/admin/categories"
                  className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-100"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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
        </div>
      </section>
    </main>
  );
}