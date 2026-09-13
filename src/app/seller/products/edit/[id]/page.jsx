"use client";

import { useEffect, useState } from "react";
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

  /*
   * Load active categories
   */
  useEffect(() => {
    async function loadCategories() {
      try {
        setLoadingCategories(true);

        const response = await fetch(
          "/api/categories",
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        const data = await response.json();

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
      } catch (error) {
        console.error(
          "Category loading error:",
          error
        );

        toast.error(
          error.message ||
            "Failed to load categories."
        );
      } finally {
        setLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);

  /*
   * Load product
   */
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
            credentials: "include",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load products."
          );
        }

        const product =
          data.products?.find(
            (item) =>
              item._id?.toString() ===
                productId ||
              item.id?.toString() ===
                productId
          );

        if (!product) {
          throw new Error(
            "Product not found."
          );
        }

        /*
         * Get category ID from the new
         * categoryId relationship.
         */
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

          price:
            product.price ?? "",

          oldPrice:
            product.oldPrice ?? "",

          stock:
            product.stock ?? "",

          sku:
            product.sku || "",

          brand:
            product.brand || "",

          category:
            product.category || "",

          categoryId:
            existingCategoryId,

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

          images:
            Array.isArray(product.images)
              ? product.images.join("\n")
              : "",

          featured:
            Boolean(product.featured),

          freeDelivery:
            Boolean(product.freeDelivery),

          isActive:
            product.isActive !== false,
        });
      } catch (error) {
        console.error(error);

        toast.error(
          error.message ||
            "Failed to load product."
        );

        router.push(
          "/seller/products"
        );
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId, router]);

  /*
   * For older products that have a category
   * name but no categoryId, automatically find
   * the matching active category.
   */
  useEffect(() => {
    if (
      !formData.categoryId &&
      formData.category &&
      categories.length > 0
    ) {
      const matchingCategory =
        categories.find(
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
          categoryId:
            matchingCategory._id,
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

    /*
     * When seller selects a category,
     * also store its name locally.
     */
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
          selectedCategory?.name ||
          "",
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

  async function handleSubmit(event) {
    event.preventDefault();

    if (!productId) {
      toast.error(
        "Product ID is missing."
      );
      return;
    }

    if (!formData.name.trim()) {
      toast.error(
        "Product name is required."
      );
      return;
    }

    if (!formData.description.trim()) {
      toast.error(
        "Product description is required."
      );
      return;
    }

    /*
     * Category is now selected from the
     * Category collection.
     */
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
      toast.error(
        "Enter a valid price."
      );
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
        .split("\n")
        .map((image) =>
          image.trim()
        )
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

            name:
              formData.name,

            shortDescription:
              formData.shortDescription,

            description:
              formData.description,

            price:
              Number(formData.price),

            oldPrice:
              formData.oldPrice === ""
                ? null
                : Number(
                    formData.oldPrice
                  ),

            stock:
              Number(formData.stock),

            sku:
              formData.sku,

            brand:
              formData.brand,

            /*
             * NEW:
             * Send the Category ObjectId.
             */
            categoryId:
              formData.categoryId,

            /*
             * Keep category name as well
             * for backward compatibility.
             */
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
          data.message ||
            "Failed to update product."
        );
      }

      toast.success(
        "Product updated successfully."
      );

      router.push(
        "/seller/products"
      );

      router.refresh();
    } catch (error) {
      console.error(error);

      toast.error(
        error.message ||
          "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="h-6 w-6 animate-spin" />
          Loading product...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/seller/products"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>

          <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-900">
            <Package className="h-8 w-8 text-blue-600" />
            Edit Product
          </h1>

          <p className="mt-2 text-slate-600">
            Update your product information.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Basic Information */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold text-slate-900">
              Basic Information
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              {/* Product Name */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Product Name *
                </label>

                <input
                  name="name"
                  value={
                    formData.name
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              {/* Short Description */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Short Description
                </label>

                <input
                  name="shortDescription"
                  value={
                    formData.shortDescription
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description *
                </label>

                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={
                    handleChange
                  }
                  rows={6}
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              {/* Brand */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Brand
                </label>

                <input
                  name="brand"
                  value={
                    formData.brand
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* SKU */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  SKU
                </label>

                <input
                  name="sku"
                  value={
                    formData.sku
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

            </div>
          </section>

          {/* Pricing & Stock */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold text-slate-900">
              Pricing & Stock
            </h2>

            <div className="grid gap-5 md:grid-cols-3">

              {/* Price */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Price *
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="price"
                  value={
                    formData.price
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              {/* Original Price */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Original Price
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="oldPrice"
                  value={
                    formData.oldPrice
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Stock *
                </label>

                <input
                  type="number"
                  min="0"
                  name="stock"
                  value={
                    formData.stock
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

            </div>
          </section>

          {/* Category */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold text-slate-900">
              Category
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              {/* Category Dropdown */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Category *
                </label>

                <select
                  name="categoryId"
                  value={
                    formData.categoryId ||
                    ""
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    loadingCategories
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                  required
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
                        {
                          category.name
                        }
                      </option>
                    )
                  )}
                </select>

                {!loadingCategories &&
                  categories.length ===
                    0 && (
                    <p className="mt-2 text-xs text-red-600">
                      No active categories
                      are available.
                      Create a category
                      from the admin panel
                      first.
                    </p>
                  )}
              </div>

              {/* Subcategory */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Subcategory
                </label>

                <input
                  name="subcategory"
                  value={
                    formData.subcategory
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

            </div>
          </section>

          {/* Computer Specifications */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold text-slate-900">
              Computer Specifications
            </h2>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              {/* Processor */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Processor
                </label>

                <input
                  name="processor"
                  value={
                    formData.processor
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* RAM */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  RAM
                </label>

                <input
                  name="ram"
                  value={
                    formData.ram
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Storage */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Storage
                </label>

                <input
                  name="storage"
                  value={
                    formData.storage
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Graphics */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Graphics
                </label>

                <input
                  name="graphics"
                  value={
                    formData.graphics
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Screen Size */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Screen Size
                </label>

                <input
                  name="screenSize"
                  value={
                    formData.screenSize
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

            </div>
          </section>

          {/* Product Images */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-slate-900">
              <ImageIcon className="h-6 w-6 text-blue-600" />
              Product Images
            </h2>

            <textarea
              name="images"
              value={
                formData.images
              }
              onChange={
                handleChange
              }
              rows={6}
              placeholder="One image URL per line"
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </section>

          {/* Product Options */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold text-slate-900">
              Product Options
            </h2>

            <div className="grid gap-4 md:grid-cols-3">

              {/* Featured */}
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4">
                <input
                  type="checkbox"
                  name="featured"
                  checked={
                    formData.featured
                  }
                  onChange={
                    handleChange
                  }
                  className="h-5 w-5"
                />

                <span className="text-sm font-medium text-slate-700">
                  Featured Product
                </span>
              </label>

              {/* Free Delivery */}
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4">
                <input
                  type="checkbox"
                  name="freeDelivery"
                  checked={
                    formData.freeDelivery
                  }
                  onChange={
                    handleChange
                  }
                  className="h-5 w-5"
                />

                <span className="text-sm font-medium text-slate-700">
                  Free Delivery
                </span>
              </label>

              {/* Active */}
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={
                    formData.isActive
                  }
                  onChange={
                    handleChange
                  }
                  className="h-5 w-5"
                />

                <span className="text-sm font-medium text-slate-700">
                  Active Product
                </span>
              </label>

            </div>
          </section>

          {/* Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">

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
                loadingCategories ||
                categories.length === 0
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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
    </main>
  );
}