"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Image as ImageIcon,
  Loader2,
  Package,
  Save,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminEditProductPage() {
  const router = useRouter();
  const params = useParams();

  const productId = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categoriesLoading, setCategoriesLoading] =
    useState(true);

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

  /*
  |--------------------------------------------------------------------------
  | LOAD PRODUCT
  |--------------------------------------------------------------------------
  */

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
            data?.message ||
              "Unable to load product."
          );
        }

        const product =
          data?.product ||
          data?.data ||
          data;

        const firstImage =
          Array.isArray(product?.images)
            ? product.images[0] || ""
            : product?.image || "";

        /*
         * IMPORTANT:
         *
         * categoryId can come from the API as either:
         *
         * 1. A normal ObjectId string
         * 2. A populated category object
         *
         * Example populated object:
         *
         * {
         *   _id: "64....",
         *   name: "Laptops",
         *   slug: "laptops"
         * }
         *
         * We must extract the _id instead of doing
         * String(categoryId), which produces:
         *
         * "[object Object]"
         */

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
          resolvedCategoryId = String(
            product.categoryId
          );
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
              : product?.originalPrice !==
                    undefined &&
                product?.originalPrice !== null
              ? String(product.originalPrice)
              : "",

          sku: product?.sku || "",

          brand: product?.brand || "",

          category:
            typeof product?.category ===
            "object"
              ? product?.category?.name ||
                product?.category?.slug ||
                ""
              : product?.category || "",

          categoryId:
            resolvedCategoryId,

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

  /*
  |--------------------------------------------------------------------------
  | LOAD CATEGORIES
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | NORMAL INPUT CHANGE
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | DISCOUNT
  |--------------------------------------------------------------------------
  */

  const calculatedDiscount = useMemo(() => {
    const price = Number(formData.price);
    const oldPrice = Number(
      formData.oldPrice
    );

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

  /*
  |--------------------------------------------------------------------------
  | CATEGORY CHANGE
  |--------------------------------------------------------------------------
  */

  function handleCategoryChange(event) {
    const selectedValue =
      event.target.value;

    const selectedCategory =
      categories.find(
        (category) =>
          String(
            category?.name || ""
          ) === selectedValue ||
          String(
            category?.slug || ""
          ) === selectedValue
      );

    const selectedCategoryId =
      selectedCategory?._id ||
      selectedCategory?.id ||
      "";

    setFormData((previous) => ({
      ...previous,

      category:
        selectedValue,

      categoryId:
        selectedCategoryId
          ? String(
              selectedCategoryId
            )
          : "",
    }));
  }

  /*
  |--------------------------------------------------------------------------
  | SUBMIT
  |--------------------------------------------------------------------------
  */

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
        "Please enter a product name."
      );
      return;
    }

    if (!formData.description.trim()) {
      toast.error(
        "Please enter a product description."
      );
      return;
    }

    if (!formData.category.trim()) {
      toast.error(
        "Please select a category."
      );
      return;
    }

    /*
     * Make absolutely sure categoryId is a string.
     *
     * This prevents:
     *
     * [object Object]
     *
     * from ever being sent to the API.
     */

    const cleanCategoryId =
      typeof formData.categoryId ===
      "object"
        ? String(
            formData.categoryId?._id ||
              formData.categoryId?.id ||
              ""
          )
        : String(
            formData.categoryId || ""
          );

    if (!cleanCategoryId) {
      toast.error(
        "Please select a valid category."
      );
      return;
    }

    const price = Number(
      formData.price
    );

    if (
      formData.price === "" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      toast.error(
        "Please enter a valid selling price."
      );
      return;
    }

    const oldPrice =
      formData.oldPrice === ""
        ? price
        : Number(
            formData.oldPrice
          );

    if (
      !Number.isFinite(oldPrice) ||
      oldPrice < 0
    ) {
      toast.error(
        "Please enter a valid original price."
      );
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
      toast.error(
        "SKU is required."
      );
      return;
    }

    try {
      setSaving(true);

      const response =
        await fetch(
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

              category:
                formData.category.trim(),

              /*
               * IMPORTANT:
               * Send only the real MongoDB ObjectId.
               */
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

      router.push(
        "/admin/products"
      );

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

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto flex min-h-[500px] max-w-4xl items-center justify-center">
          <div className="text-center">

            <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />

            <p className="mt-3 text-sm text-gray-500">
              Loading product...
            </p>

          </div>
        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | PAGE
  |--------------------------------------------------------------------------
  */

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* BACK BUTTON */}

        <button
          type="button"
          onClick={() =>
            router.push(
              "/admin/products"
            )
          }
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to Products
        </button>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* HEADER */}

          <div className="border-b border-gray-200 p-6 sm:p-8">
            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <Package className="h-6 w-6 text-blue-600" />
              </div>

              <div>

                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                  Admin Dashboard
                </p>

                <h1 className="mt-1 text-3xl font-bold text-gray-900">
                  Edit Product
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  Update the product information shown on ComputerHub.
                </p>

              </div>

            </div>
          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8"
          >

            <div className="grid gap-6">

              {/* PRODUCT NAME */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Example: ASUS Gaming Laptop"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* SHORT DESCRIPTION */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Short Description
                </label>

                <input
                  type="text"
                  name="shortDescription"
                  value={
                    formData.shortDescription
                  }
                  onChange={handleChange}
                  placeholder="Short product summary"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Product Description
                </label>

                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={handleChange}
                  rows={6}
                  placeholder="Write a detailed description..."
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* PRICE */}

              <div className="grid gap-6 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Selling Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Original Price
                  </label>

                  <input
                    type="number"
                    name="oldPrice"
                    min="0"
                    step="0.01"
                    value={
                      formData.oldPrice
                    }
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

              </div>

              {/* DISCOUNT */}

              {calculatedDiscount >
                0 && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3">

                  <div className="flex items-center justify-between gap-3">

                    <div>

                      <p className="text-sm font-semibold text-green-800">
                        Discount
                      </p>

                      <p className="text-xs text-green-700">
                        Original price Rs.{" "}
                        {Number(
                          formData.oldPrice
                        ).toLocaleString(
                          "en-PK"
                        )}

                        {" → "}

                        Selling price Rs.{" "}
                        {Number(
                          formData.price
                        ).toLocaleString(
                          "en-PK"
                        )}
                      </p>

                    </div>

                    <span className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-bold text-white">
                      {calculatedDiscount}
                      % OFF
                    </span>

                  </div>

                </div>
              )}

              {/* CATEGORY + BRAND */}

              <div className="grid gap-6 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Category
                  </label>

                  <select
                    name="category"
                    value={
                      formData.category
                    }
                    onChange={
                      handleCategoryChange
                    }
                    disabled={
                      categoriesLoading
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-gray-100"
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
                            category.name ||
                            category.slug
                          }
                        >
                          {category.name}
                        </option>
                      )
                    )}

                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Brand
                  </label>

                  <input
                    type="text"
                    name="brand"
                    value={
                      formData.brand
                    }
                    onChange={handleChange}
                    placeholder="Example: ASUS"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

              </div>

              {/* SKU + STOCK */}

              <div className="grid gap-6 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    SKU
                  </label>

                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="Product SKU"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                  <p className="mt-2 text-xs text-gray-500">
                    SKU must remain unique.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Stock Quantity
                  </label>

                  <input
                    type="number"
                    name="stock"
                    min="0"
                    step="1"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

              </div>

              {/* SUBCATEGORY */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Subcategory
                </label>

                <input
                  type="text"
                  name="subcategory"
                  value={
                    formData.subcategory
                  }
                  onChange={handleChange}
                  placeholder="Optional"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* PRODUCT SPECIFICATIONS */}

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">

                <h2 className="mb-5 text-lg font-bold text-gray-900">
                  Product Specifications
                </h2>

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* PROCESSOR */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-800">
                      Processor
                    </label>

                    <input
                      type="text"
                      name="processor"
                      value={
                        formData.processor
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Example: Intel Core i7"
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  {/* RAM */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-800">
                      RAM
                    </label>

                    <input
                      type="text"
                      name="ram"
                      value={formData.ram}
                      onChange={
                        handleChange
                      }
                      placeholder="Example: 16GB"
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  {/* STORAGE */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-800">
                      Storage
                    </label>

                    <input
                      type="text"
                      name="storage"
                      value={
                        formData.storage
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Example: 512GB SSD"
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  {/* GRAPHICS */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-800">
                      Graphics
                    </label>

                    <input
                      type="text"
                      name="graphics"
                      value={
                        formData.graphics
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Example: RTX 4060"
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  {/* SCREEN SIZE */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-800">
                      Screen Size
                    </label>

                    <input
                      type="text"
                      name="screenSize"
                      value={
                        formData.screenSize
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Example: 15.6 inch"
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                </div>

              </div>

              {/* IMAGE */}

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900">

                  <ImageIcon className="h-4 w-4" />

                  Product Image URL

                </label>

                <input
                  type="url"
                  name="image"
                  value={
                    formData.image
                  }
                  onChange={handleChange}
                  placeholder="https://example.com/product-image.jpg"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />

                {formData.image && (
                  <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-4">

                    <p className="mb-3 text-sm font-semibold text-gray-700">
                      Image Preview
                    </p>

                    <img
                      src={
                        formData.image
                      }
                      alt="Product preview"
                      className="h-64 w-full rounded-lg object-contain"
                      onError={(
                        event
                      ) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />

                  </div>
                )}
              </div>

              {/* OPTIONS */}

              <div className="grid gap-4 sm:grid-cols-3">

                {/* FEATURED */}

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">

                  <input
                    type="checkbox"
                    name="featured"
                    checked={
                      formData.featured
                    }
                    onChange={
                      handleChange
                    }
                    className="h-4 w-4"
                  />

                  <span className="text-sm font-semibold text-gray-800">
                    Featured Product
                  </span>

                </label>

                {/* FREE DELIVERY */}

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">

                  <input
                    type="checkbox"
                    name="freeDelivery"
                    checked={
                      formData.freeDelivery
                    }
                    onChange={
                      handleChange
                    }
                    className="h-4 w-4"
                  />

                  <span className="text-sm font-semibold text-gray-800">
                    Free Delivery
                  </span>

                </label>

                {/* ACTIVE */}

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">

                  <input
                    type="checkbox"
                    name="isActive"
                    checked={
                      formData.isActive
                    }
                    onChange={
                      handleChange
                    }
                    className="h-4 w-4"
                  />

                  <span className="text-sm font-semibold text-gray-800">
                    Product Active
                  </span>

                </label>

              </div>

            </div>

            {/* BUTTONS */}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/admin/products"
                  )
                }
                disabled={saving}
                className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  saving ||
                  categoriesLoading
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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

          </form>

        </div>

      </div>
    </main>
  );
}