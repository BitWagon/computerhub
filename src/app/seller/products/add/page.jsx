"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Image as ImageIcon,
  Plus,
  Save,
  X,
} from "lucide-react";

export default function AddProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);

  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    categoryId: "",
    brand: "",
    stock: "",
    image: "",
  });

  const [imagePreview, setImagePreview] =
    useState("");

  /*
   * Load active categories.
   */
  useEffect(() => {
    async function loadCategories() {
      try {
        setLoadingCategories(true);

        const response = await fetch(
          "/api/categories",
          {
            cache: "no-store",
            credentials: "include",
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
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
      } catch (err) {
        console.error(
          "Category loading error:",
          err
        );

        setError(
          err.message ||
            "Failed to load categories."
        );
      } finally {
        setLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);

  function handleChange(event) {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");

    if (name === "image") {
      setImagePreview(value);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!formData.name.trim()) {
      setError(
        "Product name is required."
      );
      return;
    }

    if (!formData.price) {
      setError(
        "Product price is required."
      );
      return;
    }

    if (!formData.categoryId) {
      setError(
        "Please select a category."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        "/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: formData.name,
            description:
              formData.description,
            price: Number(
              formData.price
            ),
            originalPrice:
              formData.originalPrice
                ? Number(
                    formData.originalPrice
                  )
                : null,
            categoryId:
              formData.categoryId,
            brand:
              formData.brand,
            stock:
              formData.stock
                ? Number(formData.stock)
                : 0,
            image:
              formData.image,
            images:
              formData.image
                ? [formData.image]
                : [],
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create product."
        );
      }

      alert(
        "Product added successfully!"
      );

      router.push(
        "/seller/products"
      );

      router.refresh();
    } catch (err) {
      console.error(
        "Add product error:",
        err
      );

      setError(
        err.message ||
          "Failed to create product."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/seller/products"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>

          <h1 className="text-3xl font-bold text-slate-900">
            Add Product
          </h1>

          <p className="mt-2 text-slate-600">
            Add a new product to your
            store.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="grid gap-6 md:grid-cols-2">
            {/* Product Name */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Product Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Description
              </label>

              <textarea
                name="description"
                value={
                  formData.description
                }
                onChange={handleChange}
                placeholder="Enter product description"
                rows={5}
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Price */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Price
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Original Price */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Original Price
              </label>

              <input
                type="number"
                name="originalPrice"
                value={
                  formData.originalPrice
                }
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="Optional"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Category
              </label>

              <select
                name="categoryId"
                value={
                  formData.categoryId
                }
                onChange={handleChange}
                disabled={
                  loadingCategories
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              >
                <option value="">
                  {loadingCategories
                    ? "Loading categories..."
                    : "Select a category"}
                </option>

                {categories.map(
                  (category) => (
                    <option
                      key={
                        category._id
                      }
                      value={
                        category._id
                      }
                    >
                      {category.name}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Brand */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Brand
              </label>

              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Dell, HP, Lenovo"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Stock
              </label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                placeholder="0"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Image */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Image URL
              </label>

              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Image Preview */}
            <div className="md:col-span-2">
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <ImageIcon className="h-5 w-5" />
                  Image Preview
                </div>

                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="h-64 w-full rounded-xl object-cover"
                    onError={() =>
                      setImagePreview("")
                    }
                  />
                ) : (
                  <div className="flex h-64 items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-500">
                    Enter an image URL to
                    see the preview.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
            <Link
              href="/seller/products"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <X className="h-5 w-5" />
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Save className="h-5 w-5 animate-pulse" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}