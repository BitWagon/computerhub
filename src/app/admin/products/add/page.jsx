"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Image as ImageIcon,
  PackagePlus,
  Save,
  Loader2,
  Plus,
  Trash2,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminAddProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] =
    useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    description: "",
    price: "",
    oldPrice: "",
    originalPrice: "",
    sku: "",
    brand: "",
    categoryId: "",
    subcategory: "",
    processor: "",
    ram: "",
    storage: "",
    graphics: "",
    screenSize: "",
    stock: "",
    images: [""],
    featured: false,
    freeDelivery: false,
    isActive: true,
  });

  useEffect(() => {
    async function loadCategories() {
      try {
        setLoadingCategories(true);

        const response = await fetch(
          "/api/categories?includeInactive=true",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load categories."
          );
        }

        setCategories(
          Array.isArray(data.categories)
            ? data.categories
            : []
        );
      } catch (error) {
        console.error(
          "Load categories error:",
          error
        );

        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to load categories."
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

  function handleImageChange(index, value) {
    setFormData((current) => {
      const images = [...current.images];
      images[index] = value;

      return {
        ...current,
        images,
      };
    });
  }

  function addImageField() {
    setFormData((current) => ({
      ...current,
      images: [...current.images, ""],
    }));
  }

  function removeImageField(index) {
    setFormData((current) => {
      if (current.images.length === 1) {
        return {
          ...current,
          images: [""],
        };
      }

      return {
        ...current,
        images: current.images.filter(
          (_, imageIndex) =>
            imageIndex !== index
        ),
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Product name is required.");
      return;
    }

    if (!formData.categoryId) {
      toast.error("Please select a category.");
      return;
    }

    const price = Number(formData.price);

    if (!price || price <= 0) {
      toast.error("Enter a valid product price.");
      return;
    }

    const stock =
      formData.stock === ""
        ? 0
        : Number(formData.stock);

    if (
      Number.isNaN(stock) ||
      stock < 0
    ) {
      toast.error("Enter a valid stock value.");
      return;
    }

    try {
      setSaving(true);

      const cleanedImages =
        formData.images
          .map((image) => image.trim())
          .filter(Boolean);

      const payload = {
        name: formData.name.trim(),

        shortDescription:
          formData.shortDescription.trim(),

        description:
          formData.description.trim(),

        price,

        oldPrice:
          Number(formData.oldPrice) || 0,

        originalPrice:
          Number(formData.originalPrice) || 0,

        sku: formData.sku.trim(),

        brand: formData.brand.trim(),

        categoryId:
          formData.categoryId,

        subcategory:
          formData.subcategory.trim(),

        processor:
          formData.processor.trim(),

        ram:
          formData.ram.trim(),

        storage:
          formData.storage.trim(),

        graphics:
          formData.graphics.trim(),

        screenSize:
          formData.screenSize.trim(),

        stock,

        images: cleanedImages,

        featured:
          formData.featured,

        freeDelivery:
          formData.freeDelivery,

        isActive:
          formData.isActive,
      };

      const response = await fetch(
        "/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to add product."
        );
      }

      toast.success(
        "Product added successfully."
      );

      router.push(
        "/admin/products"
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Add product error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to add product."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="mb-8">
          <Link
            href="/admin/products"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to Products
          </Link>

          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <PackagePlus size={26} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                Catalog Management
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Add New Product
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Create a professional product listing
                for the ComputerHub marketplace.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* BASIC INFORMATION */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-5 sm:px-7">
              <h2 className="font-bold text-slate-950">
                Product Information
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Add the main details customers will see.
              </p>
            </div>

            <div className="grid gap-5 p-5 sm:p-7 md:grid-cols-2">

              <div className="md:col-span-2">
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Product Name *
                </label>

                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Lenovo ThinkPad E14 Gen 5"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="shortDescription"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Short Description
                </label>

                <input
                  id="shortDescription"
                  name="shortDescription"
                  value={
                    formData.shortDescription
                  }
                  onChange={handleChange}
                  placeholder="A concise product summary"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Full Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the product, features and key benefits..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3.5 text-sm leading-6 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>
          </section>

          {/* PRICING */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-5 sm:px-7">
              <h2 className="font-bold text-slate-950">
                Pricing & Inventory
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Set pricing and current stock levels.
              </p>
            </div>

            <div className="grid gap-5 p-5 sm:p-7 md:grid-cols-4">

              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Selling Price *
                </label>

                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder="0"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="oldPrice"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Old Price
                </label>

                <input
                  id="oldPrice"
                  name="oldPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.oldPrice}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="originalPrice"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Original Price
                </label>

                <input
                  id="originalPrice"
                  name="originalPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    formData.originalPrice
                  }
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="stock"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Stock
                </label>

                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>
          </section>

          {/* CATEGORY & BRAND */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-5 sm:px-7">
              <h2 className="font-bold text-slate-950">
                Catalog Details
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Organize the product for easier discovery.
              </p>
            </div>

            <div className="grid gap-5 p-5 sm:p-7 md:grid-cols-3">

              <div>
                <label
                  htmlFor="categoryId"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Category *
                </label>

                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                  disabled={loadingCategories}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50"
                >
                  <option value="">
                    {loadingCategories
                      ? "Loading categories..."
                      : "Select category"}
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={category._id}
                        value={category._id}
                      >
                        {category.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label
                  htmlFor="subcategory"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Subcategory
                </label>

                <input
                  id="subcategory"
                  name="subcategory"
                  value={
                    formData.subcategory
                  }
                  onChange={handleChange}
                  placeholder="e.g. Business Laptops"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="brand"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Brand
                </label>

                <input
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="e.g. Dell"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="sku"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  SKU
                </label>

                <input
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="Product SKU"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>
          </section>

          {/* TECHNICAL SPECIFICATIONS */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-5 sm:px-7">
              <h2 className="font-bold text-slate-950">
                Technical Specifications
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Add key hardware specifications.
              </p>
            </div>

            <div className="grid gap-5 p-5 sm:p-7 md:grid-cols-2 lg:grid-cols-3">

              {[
                ["processor", "Processor", "e.g. Intel Core i7"],
                ["ram", "RAM", "e.g. 16GB"],
                ["storage", "Storage", "e.g. 512GB SSD"],
                ["graphics", "Graphics", "e.g. RTX 4060"],
                ["screenSize", "Screen Size", "e.g. 15.6 inch"],
              ].map(
                ([name, label, placeholder]) => (
                  <div key={name}>
                    <label
                      htmlFor={name}
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      {label}
                    </label>

                    <input
                      id={name}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                )
              )}
            </div>
          </section>

          {/* IMAGES */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-5 sm:px-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-bold text-slate-950">
                    Product Images
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Add image URLs for the product gallery.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addImageField}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                >
                  <Plus size={16} />
                  Add Image
                </button>
              </div>
            </div>

            <div className="space-y-3 p-5 sm:p-7">
              {formData.images.map(
                (image, index) => (
                  <div
                    key={index}
                    className="flex gap-2"
                  >
                    <div className="relative flex-1">
                      <ImageIcon
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="url"
                        value={image}
                        onChange={(event) =>
                          handleImageChange(
                            index,
                            event.target.value
                          )
                        }
                        placeholder={`Image URL ${index + 1}`}
                        className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeImageField(index)
                      }
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                      aria-label="Remove image"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                )
              )}
            </div>
          </section>

          {/* STORE SETTINGS */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-5 sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Sparkles size={19} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-950">
                    Store Settings
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Control how the product appears in the store.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 p-5 sm:p-7 md:grid-cols-3">

              <label className="flex cursor-pointer gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />

                <span>
                  <span className="block font-bold text-slate-900">
                    Active
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    Make this product available in the store.
                  </span>
                </span>
              </label>

              <label className="flex cursor-pointer gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />

                <span>
                  <span className="block font-bold text-slate-900">
                    Featured
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    Highlight this product in featured sections.
                  </span>
                </span>
              </label>

              <label className="flex cursor-pointer gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <input
                  type="checkbox"
                  name="freeDelivery"
                  checked={formData.freeDelivery}
                  onChange={handleChange}
                  className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />

                <span>
                  <span className="block font-bold text-slate-900">
                    Free Delivery
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    Mark this product as eligible for free delivery.
                  </span>
                </span>
              </label>
            </div>
          </section>

          {/* ACTIONS */}
          <div className="flex flex-col-reverse gap-3 pb-8 sm:flex-row sm:justify-end">
            <Link
              href="/admin/products"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Creating Product...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Create Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}