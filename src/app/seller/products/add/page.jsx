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
  const [categoriesLoading, setCategoriesLoading] =
    useState(true);

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

  /*
   * =========================================================
   * LOAD CATEGORIES
   * =========================================================
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
   * =========================================================
   * INPUT HANDLER
   * =========================================================
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
   * =========================================================
   * DISCOUNT
   * =========================================================
   */

  const calculatedDiscount = useMemo(() => {
    const price = Number(
      formData.price
    );

    const oldPrice = Number(
      formData.oldPrice
    );

    if (
      !Number.isFinite(price) ||
      !Number.isFinite(oldPrice) ||
      price <= 0 ||
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
   * =========================================================
   * SUBMIT
   * =========================================================
   */

  async function handleSubmit(event) {
    event.preventDefault();

    /*
     * PRODUCT NAME
     */

    if (!formData.name.trim()) {
      toast.error(
        "Please enter a product name."
      );
      return;
    }

    /*
     * DESCRIPTION
     */

    if (!formData.description.trim()) {
      toast.error(
        "Please enter a product description."
      );
      return;
    }

    /*
     * PRICE
     */

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

    /*
     * OLD PRICE
     */

    const oldPrice =
      formData.oldPrice === ""
        ? price
        : Number(
            formData.oldPrice
          );

    if (
      !Number.isFinite(oldPrice) ||
      oldPrice < price
    ) {
      toast.error(
        "Original price cannot be lower than selling price."
      );
      return;
    }

    /*
     * CATEGORY
     */

    if (!formData.categoryId) {
      toast.error(
        "Please select a category."
      );
      return;
    }

    /*
     * STOCK
     */

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

    /*
     * IMAGES
     */

    const images = formData.images
      .split(/\r?\n|,/)
      .map((image) =>
        image.trim()
      )
      .filter(Boolean);

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
            name:
              formData.name.trim(),

            shortDescription:
              formData.shortDescription.trim(),

            description:
              formData.description.trim(),

            price,

            oldPrice,

            categoryId:
              formData.categoryId,

            subcategory:
              formData.subcategory.trim(),

            brand:
              formData.brand.trim(),

            stock,

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

      if (
        !response.ok ||
        data?.success === false
      ) {
        throw new Error(
          data?.message ||
            "Failed to create product."
        );
      }

      toast.success(
        "Product added successfully."
      );

      router.push(
        "/seller/products"
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Add seller product error:",
        error
      );

      toast.error(
        error?.message ||
          "Failed to create product."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="container-main">
        <div className="mx-auto max-w-5xl">

          {/* BACK */}

          <Link
            href="/seller/products"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
          >
            <ArrowLeft size={17} />

            Back to My Products
          </Link>

          {/* HEADER */}

          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <PackagePlus
                  className="text-blue-600"
                  size={25}
                />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Seller Dashboard
                </p>

                <h1 className="mt-1 text-3xl font-black text-slate-900">
                  Add Product
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Add a product to your
                  ComputerHub store.
                  SKU will be generated
                  automatically.
                </p>
              </div>

            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* =================================================
                BASIC INFORMATION
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <h2 className="mb-5 text-xl font-bold text-slate-900">
                Basic Information
              </h2>

              <div className="grid gap-5">

                {/* NAME */}

                <div>
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
                    placeholder="Example: Lenovo ThinkPad E14"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </div>

                {/* SHORT DESCRIPTION */}

                <div>
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
                    placeholder="Short product summary"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* DESCRIPTION */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Product Description *
                  </label>

                  <textarea
                    name="description"
                    value={
                      formData.description
                    }
                    onChange={
                      handleChange
                    }
                    rows={7}
                    placeholder="Write the full product description..."
                    className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </div>

              </div>
            </section>

            {/* =================================================
                PRICE / STOCK
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <h2 className="mb-5 text-xl font-bold text-slate-900">
                Price & Stock
              </h2>

              <div className="grid gap-5 md:grid-cols-3">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Selling Price *
                  </label>

                  <input
                    type="number"
                    name="price"
                    min="0"
                    step="0.01"
                    value={
                      formData.price
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="125000"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
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
                    onChange={
                      handleChange
                    }
                    placeholder="140000"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                  {calculatedDiscount >
                    0 && (
                    <p className="mt-2 text-xs font-semibold text-green-600">
                      Discount:{" "}
                      {
                        calculatedDiscount
                      }
                      %
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Stock Quantity *
                  </label>

                  <input
                    type="number"
                    name="stock"
                    min="0"
                    step="1"
                    value={
                      formData.stock
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="10"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

              </div>

              <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-sm font-semibold text-blue-900">
                  SKU
                </p>

                <p className="mt-1 text-xs leading-5 text-blue-700">
                  You do not need to enter
                  an SKU. ComputerHub
                  automatically creates a
                  unique SKU for every
                  product.
                </p>
              </div>

            </section>

            {/* =================================================
                CATEGORY
            ================================================= */}

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
                    value={
                      formData.categoryId
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      categoriesLoading
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
                    required
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
                </div>

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
                    placeholder="Example: Gaming Laptops"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

              </div>

            </section>

            {/* =================================================
                BRAND
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <h2 className="mb-5 text-xl font-bold text-slate-900">
                Brand
              </h2>

              <input
                name="brand"
                value={
                  formData.brand
                }
                onChange={
                  handleChange
                }
                placeholder="Example: Lenovo"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              <p className="mt-2 text-xs text-slate-500">
                You can add any brand.
              </p>
            </section>

            {/* =================================================
                SPECIFICATIONS
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <h2 className="mb-2 text-xl font-bold text-slate-900">
                Product Specifications
              </h2>

              <p className="mb-5 text-sm text-slate-500">
                Fill in the specifications
                that apply to this product.
                You can leave fields blank
                when they are not relevant.
              </p>

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

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
                    placeholder="Intel Core i7-1365U"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

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
                    placeholder="16GB DDR5"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

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
                    placeholder="512GB NVMe SSD"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

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
                    placeholder="NVIDIA RTX 4060"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

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
                    placeholder="14 inch"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

              </div>

            </section>

            {/* =================================================
                IMAGES
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-slate-900">
                <ImageIcon
                  size={22}
                  className="text-blue-600"
                />

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
                placeholder={
                  "Paste one image URL per line.\n\nhttps://...\nhttps://...\nhttps://..."
                }
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              <p className="mt-2 text-xs text-slate-500">
                You can add multiple
                product images.
              </p>

            </section>

            {/* =================================================
                OPTIONS
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <h2 className="mb-5 text-xl font-bold text-slate-900">
                Product Options
              </h2>

              <div className="grid gap-4 md:grid-cols-3">

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

                  <span className="text-sm font-semibold text-slate-700">
                    Featured Product
                  </span>

                </label>

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

                  <span className="text-sm font-semibold text-slate-700">
                    Free Delivery
                  </span>

                </label>

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

                  <span className="text-sm font-semibold text-slate-700">
                    Active Product
                  </span>

                </label>

              </div>

            </section>

            {/* =================================================
                BUTTONS
            ================================================= */}

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
                  categories.length ===
                    0
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2
                      className="animate-spin"
                      size={20}
                    />

                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} />

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