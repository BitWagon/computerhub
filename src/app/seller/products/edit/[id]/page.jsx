"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Image as ImageIcon,
  Loader2,
  Package,
  Save,
} from "lucide-react";
import { toast } from "sonner";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const productId = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    description: "",
    price: "",
    oldPrice: "",
    stock: "",
    sku: "",
    brand: "",
    category: "",
    categoryId: "",
    subcategory: "",
    processor: "",
    ram: "",
    storage: "",
    graphics: "",
    screenSize: "",
    images: "",
    featured: false,
    freeDelivery: false,
    isActive: true,
  });

  useEffect(() => {
    async function loadCategories() {
      try {
        setLoadingCategories(true);

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
        console.error(
          "Category loading error:",
          error
        );

        toast.error(
          error?.message || "Failed to load categories."
        );
      } finally {
        setLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
    async function loadProduct() {
      if (!productId) {
        return;
      }

      try {
        setLoading(true);

        const response = await fetch(
          "/api/products?includeInactive=true",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to load products."
          );
        }

        const products = Array.isArray(data)
          ? data
          : Array.isArray(data?.products)
          ? data.products
          : Array.isArray(data?.data)
          ? data.data
          : [];

        const product = products.find(
          (item) =>
            item?._id?.toString() === productId ||
            item?.id?.toString() === productId
        );

        if (!product) {
          throw new Error("Product not found.");
        }

        const existingCategoryId =
          product.categoryId?._id ||
          product.categoryId ||
          "";

        setFormData({
          name: product.name || "",

          shortDescription:
            product.shortDescription || "",

          description:
            product.description || "",

          price: product.price ?? "",

          oldPrice: product.oldPrice ?? "",

          stock: product.stock ?? "",

          sku: product.sku || "",

          brand: product.brand || "",

          category: product.category || "",

          categoryId: existingCategoryId,

          subcategory:
            product.subcategory || "",

          processor:
            product.processor || "",

          ram:
            product.ram || "",

          storage:
            product.storage || "",

          graphics:
            product.graphics || "",

          screenSize:
            product.screenSize || "",

          images: Array.isArray(product.images)
            ? product.images.join("\n")
            : "",

          featured: Boolean(product.featured),

          freeDelivery:
            Boolean(product.freeDelivery),

          isActive:
            product.isActive !== false,
        });
      } catch (error) {
        console.error(
          "Product loading error:",
          error
        );

        toast.error(
          error?.message || "Failed to load product."
        );

        router.push("/seller/products");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId, router]);

  useEffect(() => {
    if (
      !formData.categoryId &&
      formData.category &&
      categories.length > 0
    ) {
      const matchingCategory = categories.find(
        (category) =>
          String(category.name)
            .trim()
            .toLowerCase() ===
          String(formData.category)
            .trim()
            .toLowerCase()
      );

      if (matchingCategory) {
        setFormData((previous) => ({
          ...previous,
          categoryId: matchingCategory._id,
        }));
      }
    }
  }, [
    categories,
    formData.categoryId,
    formData.category,
  ]);

  function handleChange(event) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    if (name === "categoryId") {
      const selectedCategory =
        categories.find(
          (category) =>
            String(category._id) ===
            String(value)
        );

      setFormData((previous) => ({
        ...previous,
        categoryId: value,
        category:
          selectedCategory?.name || "",
      }));

      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
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

    return Math.round(
      ((oldPrice - price) / oldPrice) * 100
    );
  }, [
    formData.price,
    formData.oldPrice,
  ]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!productId) {
      toast.error("Product ID is missing.");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Product name is required.");
      return;
    }

    if (!formData.description.trim()) {
      toast.error(
        "Product description is required."
      );
      return;
    }

    if (!formData.categoryId) {
      toast.error(
        "Please select a product category."
      );
      return;
    }

    if (
      formData.price === "" ||
      Number(formData.price) < 0
    ) {
      toast.error("Enter a valid price.");
      return;
    }

    if (
      formData.stock === "" ||
      Number(formData.stock) < 0
    ) {
      toast.error(
        "Enter a valid stock quantity."
      );
      return;
    }

    setSaving(true);

    try {
      const images = formData.images
        .split(/\r?\n|,/)
        .map((image) => image.trim())
        .filter(Boolean);

      const response = await fetch(
        "/api/products",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            id: productId,

            name: formData.name.trim(),

            shortDescription:
              formData.shortDescription.trim(),

            description:
              formData.description.trim(),

            price: Number(formData.price),

            oldPrice:
              formData.oldPrice === ""
                ? null
                : Number(formData.oldPrice),

            stock: Number(formData.stock),

            sku: formData.sku,

            brand: formData.brand,

            categoryId:
              formData.categoryId,

            category:
              formData.category,

            subcategory:
              formData.subcategory,

            processor:
              formData.processor,

            ram:
              formData.ram,

            storage:
              formData.storage,

            graphics:
              formData.graphics,

            screenSize:
              formData.screenSize,

            images,

            featured:
              formData.featured,

            freeDelivery:
              formData.freeDelivery,

            isActive:
              formData.isActive,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to update product."
        );
      }

      toast.success(
        "Product updated successfully."
      );

      router.push("/seller/products");
      router.refresh();
    } catch (error) {
      console.error(
        "Update product error:",
        error
      );

      toast.error(
        error?.message ||
          "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-5 text-slate-600 shadow-sm">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="font-semibold">
            Loading product...
          </span>
        </div>
      </main>
    );
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
                  <Package size={24} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                    Seller Center
                  </p>

                  <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                    Edit Product
                  </h1>

                  <p className="mt-2 text-sm text-slate-500">
                    Update product details, pricing,
                    inventory and visibility.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 divide-x border-t border-slate-100">
              <div className="p-4">
                <p className="text-xs font-semibold text-slate-400">
                  SKU
                </p>
                <p className="mt-1 truncate text-sm font-bold text-slate-900">
                  {formData.sku || "Auto"}
                </p>
              </div>

              <div className="p-4">
                <p className="text-xs font-semibold text-slate-400">
                  STATUS
                </p>
                <p className="mt-1 text-sm font-bold text-slate-900">
                  {formData.isActive
                    ? "Active"
                    : "Inactive"}
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

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* BASIC INFORMATION */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-xl font-bold text-slate-900">
                  Basic Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update the main product information.
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
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Short Description
                  </label>

                  <input
                    name="shortDescription"
                    value={
                      formData.shortDescription
                    }
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
                    className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </div>
              </div>
            </section>

            {/* PRICE */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-bold text-slate-900">
                Pricing & Inventory
              </h2>

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
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </div>
              </div>
            </section>

            {/* CATEGORY */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-bold text-slate-900">
                Category
              </h2>

              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Category *
                  </label>

                  <select
                    name="categoryId"
                    value={formData.categoryId || ""}
                    onChange={handleChange}
                    disabled={loadingCategories}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
                  >
                    <option value="">
                      {loadingCategories
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
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Subcategory
                  </label>

                  <input
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>
            </section>

            {/* SPECIFICATIONS */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-bold text-slate-900">
                Product Specifications
              </h2>

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Brand
                  </label>

                  <input
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
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
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* SKU */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-slate-900">
                Product Identification
              </h2>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  SKU
                </label>

                <input
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
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
                    One image URL per line.
                  </p>
                </div>
              </div>

              <textarea
                name="images"
                value={formData.images}
                onChange={handleChange}
                rows={6}
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
                  saving ||
                  loadingCategories
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Save Changes
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