"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Image as ImageIcon,
  Loader2,
  PackagePlus,
  Save,
} from "lucide-react";
import { toast } from "sonner";

export default function AddSellerProductPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    description: "",
    price: "",
    oldPrice: "",
    brand: "",
    categoryId: "",
    subcategory: "",
    stock: "",
    processor: "",
    ram: "",
    storage: "",
    graphics: "",
    screenSize: "",
    images: "",
    featured: false,
    freeDelivery: true,
    isActive: true,
  });

  useEffect(() => {
    async function loadCategories() {
      try {
        setCategoriesLoading(true);

        const response = await fetch("/api/categories", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to load categories."
          );
        }

        const loadedCategories = Array.isArray(data)
          ? data
          : Array.isArray(data?.categories)
          ? data.categories
          : Array.isArray(data?.data)
          ? data.data
          : [];

        setCategories(
          loadedCategories.filter(
            (category) => category?.isActive !== false
          )
        );
      } catch (error) {
        console.error("Category loading error:", error);

        toast.error(
          error?.message || "Failed to load categories."
        );

        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    }

    loadCategories();
  }, []);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  const calculatedDiscount = useMemo(() => {
    const price = Number(formData.price);
    const oldPrice = Number(formData.oldPrice);

    if (
      !Number.isFinite(price) ||
      !Number.isFinite(oldPrice) ||
      price <= 0 ||
      oldPrice <= price
    ) {
      return 0;
    }

    return Math.round(((oldPrice - price) / oldPrice) * 100);
  }, [formData.price, formData.oldPrice]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter a product name.");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter a product description.");
      return;
    }

    const price = Number(formData.price);

    if (
      formData.price === "" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      toast.error("Please enter a valid selling price.");
      return;
    }

    const oldPrice =
      formData.oldPrice === ""
        ? price
        : Number(formData.oldPrice);

    if (
      !Number.isFinite(oldPrice) ||
      oldPrice < price
    ) {
      toast.error(
        "Original price cannot be lower than selling price."
      );
      return;
    }

    if (!formData.categoryId) {
      toast.error("Please select a category.");
      return;
    }

    const stock =
      formData.stock === "" ? 0 : Number(formData.stock);

    if (!Number.isFinite(stock) || stock < 0) {
      toast.error("Please enter a valid stock quantity.");
      return;
    }

    const images = formData.images
      .split(/\r?\n|,/)
      .map((image) => image.trim())
      .filter(Boolean);

    try {
      setLoading(true);

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name.trim(),
          shortDescription: formData.shortDescription.trim(),
          description: formData.description.trim(),
          price,
          oldPrice,
          categoryId: formData.categoryId,
          subcategory: formData.subcategory.trim(),
          brand: formData.brand.trim(),
          stock,
          processor: formData.processor.trim(),
          ram: formData.ram.trim(),
          storage: formData.storage.trim(),
          graphics: formData.graphics.trim(),
          screenSize: formData.screenSize.trim(),
          images,
          featured: formData.featured,
          freeDelivery: formData.freeDelivery,
          isActive: formData.isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok || data?.success === false) {
        throw new Error(
          data?.message || "Failed to create product."
        );
      }

      toast.success("Product added successfully.");

      router.push("/seller/products");
      router.refresh();
    } catch (error) {
      console.error("Add seller product error:", error);

      toast.error(
        error?.message || "Failed to create product."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 py-8">
      <div className="container-main">
        <div className="mx-auto max-w-5xl">

          <Link
            href="/seller/products"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to My Products
          </Link>

          <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50 to-white p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                  <PackagePlus size={24} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                    Seller Center
                  </p>

                  <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                    Add Product
                  </h1>

                  <p className="mt-2 text-sm text-slate-500">
                    Add a new product to your ComputerHub store.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 divide-x border-t border-slate-100 bg-white">
              <div className="p-4">
                <p className="text-xs font-semibold text-slate-400">
                  STATUS
                </p>
                <p className="mt-1 text-sm font-bold text-slate-900">
                  Ready
                </p>
              </div>

              <div className="p-4">
                <p className="text-xs font-semibold text-slate-400">
                  CATEGORY
                </p>
                <p className="mt-1 text-sm font-bold text-slate-900">
                  {categoriesLoading
                    ? "Loading..."
                    : `${categories.length} available`}
                </p>
              </div>

              <div className="p-4">
                <p className="text-xs font-semibold text-slate-400">
                  DISCOUNT
                </p>
                <p className="mt-1 text-sm font-bold text-slate-900">
                  {calculatedDiscount > 0
                    ? `${calculatedDiscount}%`
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* BASIC INFORMATION */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-xl font-bold text-slate-900">
                  Basic Information
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Enter the main details customers will see.
                </p>
              </div>

              <div className="space-y-5">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Product Name *
                  </label>

                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Example: Lenovo ThinkPad E14"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Short Description
                  </label>

                  <input
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleChange}
                    placeholder="Short product summary"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Description *
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Detailed product description"
                    className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </div>
              </div>
            </section>

            {/* PRICE AND STOCK */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-xl font-bold text-slate-900">
                  Pricing & Inventory
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Set pricing and available stock.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-3">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Selling Price *
                  </label>

                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Original Price
                  </label>

                  <input
                    name="oldPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.oldPrice}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Stock *
                  </label>

                  <input
                    name="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>
            </section>

            {/* CATEGORY */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-xl font-bold text-slate-900">
                  Category
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Category *
                  </label>

                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    disabled={categoriesLoading}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
                  >
                    <option value="">
                      {categoriesLoading
                        ? "Loading categories..."
                        : "Select a category"}
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category._id}
                        value={category._id}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>

                  {!categoriesLoading &&
                    categories.length === 0 && (
                      <p className="mt-2 text-xs text-red-600">
                        No active categories are available.
                      </p>
                    )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Subcategory
                  </label>

                  <input
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                    placeholder="Example: Business Laptops"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>
            </section>

            {/* BRAND & SPECS */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-xl font-bold text-slate-900">
                  Product Specifications
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Brand
                  </label>

                  <input
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Dell, HP, Lenovo..."
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {[
                  ["processor", "Processor"],
                  ["ram", "RAM"],
                  ["storage", "Storage"],
                  ["graphics", "Graphics"],
                  ["screenSize", "Screen Size"],
                ].map(([name, label]) => (
                  <div key={name}>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      {label}
                    </label>

                    <input
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      placeholder={label}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* IMAGES */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <ImageIcon size={20} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Product Images
                  </h2>

                  <p className="text-sm text-slate-500">
                    Add one image URL per line.
                  </p>
                </div>
              </div>

              <textarea
                name="images"
                value={formData.images}
                onChange={handleChange}
                rows={6}
                placeholder={"https://example.com/image-1.jpg\nhttps://example.com/image-2.jpg"}
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </section>

            {/* OPTIONS */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-bold text-slate-900">
                Product Options
              </h2>

              <div className="grid gap-4 md:grid-cols-3">

                {[
                  ["featured", "Featured Product"],
                  ["freeDelivery", "Free Delivery"],
                  ["isActive", "Active Product"],
                ].map(([name, label]) => (
                  <label
                    key={name}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/40"
                  >
                    <input
                      type="checkbox"
                      name={name}
                      checked={formData[name]}
                      onChange={handleChange}
                      className="h-5 w-5 rounded"
                    />

                    <span className="text-sm font-semibold text-slate-700">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            {/* ACTIONS */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                href="/seller/products"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={
                  loading ||
                  categoriesLoading ||
                  categories.length === 0
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Add Product
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </main>
  );
}