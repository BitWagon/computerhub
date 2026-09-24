"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  PackagePlus,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminAddProductPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] =
    useState(true);

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    brand: "",
    stock: "",
    image: "",
  });

  /*
   * LOAD CATEGORIES
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
              "Failed to load categories."
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
            "Failed to load categories."
        );

        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    }

    loadCategories();
  }, []);

  /*
   * HANDLE INPUT
   */
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  /*
   * DISCOUNT
   */
  const calculatedDiscount = useMemo(() => {
    const price = Number(formData.price);

    const originalPrice = Number(
      formData.originalPrice
    );

    if (
      !price ||
      !originalPrice ||
      originalPrice <= price
    ) {
      return 0;
    }

    return Math.round(
      ((originalPrice - price) /
        originalPrice) *
        100
    );
  }, [
    formData.price,
    formData.originalPrice,
  ]);

  /*
   * SUBMIT
   */
  async function handleSubmit(event) {
    event.preventDefault();

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

    const price = Number(formData.price);

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

    const originalPrice =
      formData.originalPrice === ""
        ? price
        : Number(formData.originalPrice);

    if (
      !Number.isFinite(originalPrice) ||
      originalPrice < 0
    ) {
      toast.error(
        "Please enter a valid original price."
      );
      return;
    }

    if (originalPrice < price) {
      toast.error(
        "Original price cannot be lower than selling price."
      );
      return;
    }

    if (!formData.category.trim()) {
      toast.error(
        "Please select a category."
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

    try {
      setLoading(true);

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
            name: formData.name.trim(),

            description:
              formData.description.trim(),

            price,

            /*
             * Product API uses oldPrice.
             */
            oldPrice: originalPrice,

            /*
             * Kept for compatibility.
             */
            originalPrice,

            category:
              formData.category.trim(),

            brand:
              formData.brand.trim(),

            stock,

            image:
              formData.image.trim(),
          }),
        }
      );

      const data = await response.json();

      if (
        !response.ok ||
        data?.success === false
      ) {
        throw new Error(
          data?.message ||
            "Failed to add product."
        );
      }

      toast.success(
        "Product added successfully."
      );

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error(
        "Admin add product error:",
        error
      );

      toast.error(
        error?.message ||
          "Failed to add product."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="container-main">
        <div className="mx-auto max-w-4xl">

          {/* BACK */}

          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/products"
              )
            }
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to Products
          </button>

          {/* CARD */}

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            {/* HEADER */}

            <div className="border-b border-gray-200 p-6 sm:p-8">
              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                  <PackagePlus className="h-6 w-6 text-blue-600" />
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                    Admin Dashboard
                  </p>

                  <h1 className="mt-1 text-3xl font-bold text-gray-900">
                    Add New Product
                  </h1>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Add product information and publish it to ComputerHub.
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

                {/* NAME */}

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
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* DESCRIPTION */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Product Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Write a detailed description of your product..."
                    className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
                      placeholder="79"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-900">
                      Original Price
                    </label>

                    <input
                      type="number"
                      name="originalPrice"
                      min="0"
                      step="0.01"
                      value={
                        formData.originalPrice
                      }
                      onChange={handleChange}
                      placeholder="100"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                </div>

                {/* DISCOUNT */}

                {calculatedDiscount > 0 && (
                  <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3">

                    <div className="flex flex-wrap items-center justify-between gap-2">

                      <div>
                        <p className="text-sm font-semibold text-green-800">
                          Discount
                        </p>

                        <p className="text-xs text-green-700">
                          Original price $
                          {Number(
                            formData.originalPrice
                          ).toFixed(2)}

                          {" → "}

                          Selling price $
                          {Number(
                            formData.price
                          ).toFixed(2)}
                        </p>
                      </div>

                      <span className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-bold text-white">
                        {calculatedDiscount}% OFF
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
                      onChange={handleChange}
                      disabled={
                        categoriesLoading
                      }
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                    >
                      <option value="">
                        {categoriesLoading
                          ? "Loading categories..."
                          : "Select a category"}
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
                      value={formData.brand}
                      onChange={handleChange}
                      placeholder="Example: ASUS"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                </div>

                {/* STOCK */}

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
                    placeholder="Example: 10"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
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
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/product-image.jpg"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                  <p className="mt-2 text-xs text-gray-500">
                    Paste a direct product image URL.
                  </p>
                </div>

                {/* IMAGE PREVIEW */}

                {formData.image && (
                  <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-4">

                    <p className="mb-3 text-sm font-semibold text-gray-700">
                      Image Preview
                    </p>

                    <img
                      src={formData.image}
                      alt="Product preview"
                      className="h-64 w-full rounded-lg object-contain"
                      onError={(event) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />

                  </div>
                )}

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
                  disabled={loading}
                  className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    loading ||
                    categoriesLoading
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Adding Product...
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
      </div>
    </main>
  );
}