"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FolderTree,
  Image as ImageIcon,
  Save,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export default function AddCategoryPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    isActive: true,
    featured: false,
    sortOrder: 0,
  });

  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value, type, checked } =
      event.target;

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
      toast.error("Category name is required.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/categories",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
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
            "Failed to create category."
        );
      }

      toast.success(
        "Category created successfully."
      );

      router.push("/admin/categories");
      router.refresh();
    } catch (error) {
      console.error(
        "Create category error:",
        error
      );

      toast.error(
        error.message ||
          "Failed to create category."
      );
    } finally {
      setLoading(false);
    }
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
                Add Category
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Create a new product category for
                your ComputerHub store.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FORM SECTION */}
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
                      Enter the basic information for
                      this category.
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
                    placeholder="e.g. Laptops"
                    maxLength={100}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    Maximum 100 characters.
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
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe this category..."
                    rows={5}
                    className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    A short description that helps
                    customers understand the category.
                  </p>
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

                  <p className="mt-2 text-xs text-gray-400">
                    Paste a public image URL. Image
                    upload will be added later if needed.
                  </p>

                  {/* IMAGE PREVIEW */}
                  {formData.image.trim() && (
                    <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                      <div className="p-3">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Image Preview
                        </p>

                        <img
                          src={formData.image}
                          alt="Category preview"
                          className="h-48 w-full rounded-lg object-cover"
                          onError={(event) => {
                            event.currentTarget.style.display =
                              "none";
                          }}
                        />
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

                {/* OPTIONS */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* ACTIVE */}
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:border-blue-300">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />

                    <span>
                      <span className="block text-sm font-semibold text-gray-900">
                        Active Category
                      </span>

                      <span className="mt-1 block text-xs leading-5 text-gray-500">
                        Customers can see this category
                        when it is active.
                      </span>
                    </span>
                  </label>

                  {/* FEATURED */}
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:border-blue-300">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />

                    <span>
                      <span className="block text-sm font-semibold text-gray-900">
                        Featured Category
                      </span>

                      <span className="mt-1 block text-xs leading-5 text-gray-500">
                        Mark this category as featured
                        for future storefront sections.
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
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Create Category
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