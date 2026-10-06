"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  Package,
  Save,
  Tag,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminEditProductPage() {
  const router = useRouter();
  const params = useParams();

  const productId = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    description: "",
    price: "",
    oldPrice: "",
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
    stock: "",
    image: "",
    featured: false,
    freeDelivery: false,
    isActive: true,
  });

  // ============================================================
  // LOAD PRODUCT
  // ============================================================

  useEffect(() => {
    if (!productId) {
      return;
    }

    async function loadProduct() {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/products/${encodeURIComponent(productId)}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Unable to load product."
          );
        }

        const product =
          data?.product ||
          data?.data ||
          data;

        const firstImage = Array.isArray(product?.images)
          ? product.images[0] || ""
          : product?.image || "";

        let resolvedCategoryId = "";

        if (
          product?.categoryId &&
          typeof product.categoryId === "object"
        ) {
          resolvedCategoryId = String(
            product.categoryId?._id ||
              product.categoryId?.id ||
              ""
          );
        } else if (product?.categoryId) {
          resolvedCategoryId = String(product.categoryId);
        }

        setFormData({
          name: product?.name || "",

          shortDescription:
            product?.shortDescription || "",

          description:
            product?.description || "",

          price:
            product?.price !== undefined &&
            product?.price !== null
              ? String(product.price)
              : "",

          oldPrice:
            product?.oldPrice !== undefined &&
            product?.oldPrice !== null
              ? String(product.oldPrice)
              : product?.originalPrice !== undefined &&
                product?.originalPrice !== null
              ? String(product.originalPrice)
              : "",

          sku: product?.sku || "",

          brand: product?.brand || "",

          category:
            typeof product?.category === "object"
              ? product?.category?.name ||
                product?.category?.slug ||
                ""
              : product?.category || "",

          categoryId: resolvedCategoryId,

          subcategory:
            product?.subcategory || "",

          processor:
            product?.processor || "",

          ram:
            product?.ram || "",

          storage:
            product?.storage || "",

          graphics:
            product?.graphics || "",

          screenSize:
            product?.screenSize || "",

          stock:
            product?.stock !== undefined &&
            product?.stock !== null
              ? String(product.stock)
              : "0",

          image: firstImage,

          featured:
            product?.featured === true,

          freeDelivery:
            product?.freeDelivery === true,

          isActive:
            product?.isActive !== false,
        });
      } catch (error) {
        console.error(
          "Admin edit product loading error:",
          error
        );

        toast.error(
          error?.message ||
            "Unable to load product."
        );

        router.push("/admin/products");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId, router]);

  // ============================================================
  // LOAD CATEGORIES
  // ============================================================

  useEffect(() => {
    async function loadCategories() {
      try {
        setCategoriesLoading(true);

        const response = await fetch(
          "/api/categories",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Unable to load categories."
          );
        }

        const loadedCategories =
          Array.isArray(data)
            ? data
            : Array.isArray(data?.categories)
            ? data.categories
            : Array.isArray(data?.data)
            ? data.data
            : [];

        setCategories(
          loadedCategories.filter(
            (category) =>
              category?.isActive !== false
          )
        );
      } catch (error) {
        console.error(
          "Category loading error:",
          error
        );

        toast.error(
          error?.message ||
            "Unable to load categories."
        );

        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    }

    loadCategories();
  }, []);

  // ============================================================
  // INPUT CHANGE
  // ============================================================

  function handleChange(event) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  }

  function handleCategoryChange(event) {
    const selectedCategoryId =
      event.target.value;

    const selectedCategory =
      categories.find(
        (category) =>
          String(
            category?._id ||
              category?.id ||
              ""
          ) === selectedCategoryId
      );

    setFormData((previous) => ({
      ...previous,

      categoryId:
        selectedCategoryId,

      category:
        selectedCategory?.name ||
        selectedCategory?.slug ||
        "",
    }));
  }

  // ============================================================
  // DISCOUNT
  // ============================================================

  const calculatedDiscount = useMemo(() => {
    const price = Number(formData.price);
    const oldPrice = Number(formData.oldPrice);

    if (
      !Number.isFinite(price) ||
      !Number.isFinite(oldPrice) ||
      price <= 0 ||
      oldPrice <= 0 ||
      oldPrice <= price
    ) {
      return 0;
    }

    return Math.round(
      ((oldPrice - price) /
        oldPrice) *
        100
    );
  }, [
    formData.price,
    formData.oldPrice,
  ]);

  // ============================================================
  // SUBMIT
  // ============================================================

  async function handleSubmit(event) {
    event.preventDefault();

    if (!productId) {
      toast.error("Product ID is missing.");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Please enter a product name.");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter a product description.");
      return;
    }

    if (!formData.categoryId.trim()) {
      toast.error("Please select a category.");
      return;
    }

    const cleanCategoryId =
      typeof formData.categoryId === "object"
        ? String(
            formData.categoryId?._id ||
              formData.categoryId?.id ||
              ""
          )
        : String(formData.categoryId || "");

    if (!cleanCategoryId) {
      toast.error("Please select a valid category.");
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
      oldPrice < 0
    ) {
      toast.error("Please enter a valid original price.");
      return;
    }

    if (oldPrice < price) {
      toast.error(
        "Original price cannot be lower than selling price."
      );
      return;
    }

    const stock =
      formData.stock === ""
        ? 0
        : Number(formData.stock);

    if (
      !Number.isFinite(stock) ||
      stock < 0
    ) {
      toast.error(
        "Please enter a valid stock quantity."
      );
      return;
    }

    if (!formData.sku.trim()) {
      toast.error("SKU is required.");
      return;
    }

    try {
      setSaving(true);

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
            productId,

            name:
              formData.name.trim(),

            shortDescription:
              formData.shortDescription.trim(),

            description:
              formData.description.trim(),

            price,

            oldPrice,

            originalPrice:
              oldPrice,

            sku:
              formData.sku.trim(),

            brand:
              formData.brand.trim(),

            categoryId:
              cleanCategoryId,

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

            images:
              formData.image.trim()
                ? [
                    formData.image.trim(),
                  ]
                : [],

            image:
              formData.image.trim(),

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

      if (
        !response.ok ||
        data?.success === false
      ) {
        throw new Error(
          data?.message ||
            "Unable to update product."
        );
      }

      toast.success(
        "Product updated successfully."
      );

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error(
        "Admin edit product error:",
        error
      );

      toast.error(
        error?.message ||
          "Unable to update product."
      );
    } finally {
      setSaving(false);
    }
  }

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[600px] max-w-6xl items-center justify-center">
          <div className="rounded-2xl border border-slate-200 bg-white px-10 py-12 text-center shadow-sm">
            <Loader2 className="mx-auto h-9 w-9 animate-spin text-blue-600" />

            <p className="mt-4 text-sm font-medium text-slate-600">
              Loading product...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* TOP NAVIGATION */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() =>
              router.push("/admin/products")
            }
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to Products
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Package size={15} />
            Product Management
          </div>
        </div>

        {/* HEADER */}

        <div className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="relative overflow-hidden px-6 py-8 sm:px-8 lg:px-10">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-50 blur-3xl" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                <Package className="h-7 w-7" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                  Admin Dashboard
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Edit Product
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Update pricing, inventory, specifications,
                  images and storefront settings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FORM */}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-3">

            {/* MAIN COLUMN */}

            <div className="space-y-6 lg:col-span-2">

              {/* BASIC INFORMATION */}

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-slate-900">
                    Product Information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Keep the product title and description clear.
                  </p>
                </div>

                <div className="space-y-5">

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      Product Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Example: ASUS Gaming Laptop"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      Short Description
                    </label>

                    <input
                      type="text"
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleChange}
                      placeholder="Short product summary"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      Product Description
                    </label>

                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={7}
                      placeholder="Write a detailed product description..."
                      className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </section>

              {/* PRICING */}

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <div className="mb-6 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Tag size={19} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Pricing & Inventory
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Manage pricing, SKU and available stock.
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-3">

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      Selling Price
                    </label>

                    <input
                      type="number"
                      name="price"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      Original Price
                    </label>

                    <input
                      type="number"
                      name="oldPrice"
                      min="0"
                      step="0.01"
                      value={formData.oldPrice}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      Stock Quantity
                    </label>

                    <input
                      type="number"
                      name="stock"
                      min="0"
                      step="1"
                      value={formData.stock}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {calculatedDiscount > 0 && (
                  <div className="mt-5 flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-emerald-800">
                        Active Discount
                      </p>

                      <p className="mt-1 text-xs text-emerald-700">
                        Rs.{" "}
                        {Number(
                          formData.oldPrice
                        ).toLocaleString("en-PK")}{" "}
                        → Rs.{" "}
                        {Number(
                          formData.price
                        ).toLocaleString("en-PK")}
                      </p>
                    </div>

                    <span className="w-fit rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-bold text-white">
                      {calculatedDiscount}% OFF
                    </span>
                  </div>
                )}

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    SKU
                  </label>

                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="Product SKU"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    SKU must remain unique.
                  </p>
                </div>
              </section>

              {/* CATALOG */}

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-slate-900">
                    Catalog Details
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Organize the product for customers.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      Category
                    </label>

                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleCategoryChange}
                      disabled={categoriesLoading}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
                    >
                      <option value="">
                        {categoriesLoading
                          ? "Loading categories..."
                          : "Select category"}
                      </option>

                      {categories.map(
                        (category) => (
                          <option
                            key={
                              category._id ||
                              category.id ||
                              category.slug
                            }
                            value={
                              category._id ||
                              category.id
                            }
                          >
                            {category.name}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      Brand
                    </label>

                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      placeholder="Example: ASUS"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      Subcategory
                    </label>

                    <input
                      type="text"
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleChange}
                      placeholder="Optional subcategory"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </section>

              {/* SPECIFICATIONS */}

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-slate-900">
                    Technical Specifications
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Add the key hardware specifications.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      Processor
                    </label>

                    <input
                      type="text"
                      name="processor"
                      value={formData.processor}
                      onChange={handleChange}
                      placeholder="Example: Intel Core i7"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      RAM
                    </label>

                    <input
                      type="text"
                      name="ram"
                      value={formData.ram}
                      onChange={handleChange}
                      placeholder="Example: 16GB"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      Storage
                    </label>

                    <input
                      type="text"
                      name="storage"
                      value={formData.storage}
                      onChange={handleChange}
                      placeholder="Example: 512GB SSD"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      Graphics
                    </label>

                    <input
                      type="text"
                      name="graphics"
                      value={formData.graphics}
                      onChange={handleChange}
                      placeholder="Example: RTX 4060"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      Screen Size
                    </label>

                    <input
                      type="text"
                      name="screenSize"
                      value={formData.screenSize}
                      onChange={handleChange}
                      placeholder="Example: 15.6 inch"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </section>

              {/* IMAGE */}

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <div className="mb-6 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <ImageIcon size={19} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Product Image
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Use a direct image URL for the product.
                    </p>
                  </div>
                </div>

                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/product-image.jpg"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />

                {formData.image && (
                  <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Preview
                    </p>

                    <div className="flex min-h-[240px] items-center justify-center rounded-xl bg-white p-4">
                      <img
                        src={formData.image}
                        alt="Product preview"
                        className="max-h-64 w-full object-contain"
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* SIDE COLUMN */}

            <aside className="space-y-6">

              {/* STATUS */}

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-slate-900">
                    Store Settings
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Control how this product appears.
                  </p>
                </div>

                <div className="space-y-3">

                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/40">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4"
                    />

                    <span>
                      <span className="block text-sm font-semibold text-slate-900">
                        Product Active
                      </span>

                      <span className="mt-1 block text-xs leading-5 text-slate-500">
                        Customers can view this product.
                      </span>
                    </span>
                  </label>

                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/40">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4"
                    />

                    <span>
                      <span className="block text-sm font-semibold text-slate-900">
                        Featured Product
                      </span>

                      <span className="mt-1 block text-xs leading-5 text-slate-500">
                        Highlight this product on the store.
                      </span>
                    </span>
                  </label>

                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/40">
                    <input
                      type="checkbox"
                      name="freeDelivery"
                      checked={formData.freeDelivery}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4"
                    />

                    <span>
                      <span className="block text-sm font-semibold text-slate-900">
                        Free Delivery
                      </span>

                      <span className="mt-1 block text-xs leading-5 text-slate-500">
                        Show free delivery for this product.
                      </span>
                    </span>
                  </label>
                </div>
              </section>

              {/* QUICK STATUS */}

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <CheckCircle2 size={19} />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      Product Status
                    </h2>

                    <p className="text-xs text-slate-500">
                      Current storefront state
                    </p>
                  </div>
                </div>

                <div
                  className={`rounded-xl px-4 py-3 ${
                    formData.isActive
                      ? "bg-emerald-50"
                      : "bg-slate-100"
                  }`}
                >
                  <p
                    className={`text-sm font-bold ${
                      formData.isActive
                        ? "text-emerald-700"
                        : "text-slate-600"
                    }`}
                  >
                    {formData.isActive
                      ? "Active"
                      : "Inactive"}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {formData.isActive
                      ? "Visible to customers."
                      : "Hidden from the storefront."}
                  </p>
                </div>
              </section>

              {/* DELIVERY */}

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Truck size={19} />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      Delivery
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      {formData.freeDelivery
                        ? "Free delivery is enabled."
                        : "Standard delivery applies."}
                    </p>
                  </div>
                </div>
              </section>
            </aside>
          </div>

          {/* ACTION BAR */}

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Ready to save changes?
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Your existing product data will be updated.
                </p>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() =>
                    router.push("/admin/products")
                  }
                  disabled={saving}
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving ||
                    categoriesLoading
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}