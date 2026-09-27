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
    description: "",
    categoryId: "",
    price: "",
    oldPrice: "",
    stock: "",
    brand: "",
    sku: "",
    images: [""],
    specifications: [{ key: "", value: "" }],
    featured: false,
    freeDelivery: true,
  });

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch("/api/categories");

        const data = await response.json();

        if (data.success) {
          setCategories(data.categories || []);
        }
      } catch {
        toast.error("Unable to load categories.");
      } finally {
        setCategoriesLoading(false);
      }
    }

    loadCategories();
  }, []);

  const discount = useMemo(() => {
    const price = Number(formData.price);
    const oldPrice = Number(formData.oldPrice);

    if (
      !price ||
      !oldPrice ||
      oldPrice <= price
    ) {
      return 0;
    }

    return Math.round(
      ((oldPrice - price) / oldPrice) * 100
    );
  }, [formData.price, formData.oldPrice]);

  function updateField(key, value) {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function updateImage(index, value) {
    const updated = [...formData.images];
    updated[index] = value;

    setFormData((prev) => ({
      ...prev,
      images: updated,
    }));
  }

  function addImageField() {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }));
  }

  function removeImageField(index) {
    if (formData.images.length === 1) return;

    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter(
        (_, i) => i !== index
      ),
    }));
  }

  function updateSpecification(index, key, value) {
    const updated = [...formData.specifications];
    updated[index][key] = value;

    setFormData((prev) => ({
      ...prev,
      specifications: updated,
    }));
  }

  function addSpecification() {
    setFormData((prev) => ({
      ...prev,
      specifications: [
        ...prev.specifications,
        { key: "", value: "" },
      ],
    }));
  }

  function removeSpecification(index) {
    if (formData.specifications.length === 1) return;

    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter(
        (_, i) => i !== index
      ),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

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
      toast.error("Enter a valid price.");
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
      Number.isNaN(stock) ||
      stock < 0
    ) {
      toast.error("Enter a valid stock value.");
      return;
    }

    setLoading(true);

    try {
      const cleanedImages = formData.images
        .map((image) => image.trim())
        .filter(Boolean);

      const cleanedSpecifications =
        formData.specifications.filter(
          (item) =>
            item.key.trim() &&
            item.value.trim()
        );

      const payload = {
        name: formData.name.trim(),
        description:
          formData.description.trim(),
        categoryId: formData.categoryId,
        price,
        oldPrice:
          Number(formData.oldPrice) || 0,
        stock,
        brand: formData.brand.trim(),
        sku: formData.sku.trim(),
        images: cleanedImages,
        specifications:
          cleanedSpecifications,
        featured: formData.featured,
        freeDelivery:
          formData.freeDelivery,
      };

      const response = await fetch(
        "/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to add product."
        );
      }

      toast.success(
        "Product added successfully."
      );

      router.push("/seller/products");

    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to add product."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container-main py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/seller/products"
              className="mb-3 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600"
            >
              <ArrowLeft size={16} />
              Back to Products
            </Link>

            <h1 className="text-3xl font-bold text-slate-900">
              Add New Product
            </h1>

            <p className="mt-2 text-slate-600">
              Create a new product for your ComputerHub store.
            </p>
          </div>
        </div>
                <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-[2fr_1fr]"
        >
          {/* LEFT SIDE */}

          <div className="space-y-8">

            {/* BASIC INFORMATION */}

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-bold text-slate-900">
                Basic Information
              </h2>

              <div className="space-y-5">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Product Name *
                  </label>

                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      updateField("name", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Description
                  </label>

                  <textarea
                    rows={6}
                    value={formData.description}
                    onChange={(e) =>
                      updateField("description", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
                    placeholder="Describe your product"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Category *
                  </label>

                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      updateField("categoryId", e.target.value)
                    }
                    disabled={categoriesLoading}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
                    required
                  >
                    <option value="">
                      {categoriesLoading
                        ? "Loading categories..."
                        : "Select category"}
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
              </div>
            </div>

            {/* PRICING */}

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-bold text-slate-900">
                Pricing
              </h2>

              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Price (PKR) *
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={formData.price}
                    onChange={(e) =>
                      updateField("price", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Old Price (PKR)
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={formData.oldPrice}
                    onChange={(e) =>
                      updateField("oldPrice", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Stock
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) =>
                      updateField("stock", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Discount
                  </label>

                  <div className="flex h-[50px] items-center rounded-xl border border-slate-300 bg-slate-50 px-4 text-slate-700">
                    {discount > 0
                      ? `${discount}% OFF`
                      : "No discount"}
                  </div>
                </div>
              </div>
            </div>

            {/* BRAND */}

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-bold text-slate-900">
                Brand & SKU
              </h2>

              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Brand
                  </label>

                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) =>
                      updateField("brand", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    SKU
                  </label>

                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) =>
                      updateField("sku", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* PRODUCT IMAGES */}

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  Product Images
                </h2>

                <button
                  type="button"
                  onClick={addImageField}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Add Image
                </button>
              </div>

              <div className="space-y-4">
                {formData.images.map((image, index) => (
                  <div
                    key={index}
                    className="flex gap-3"
                  >
                    <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-300 px-4">
                      <ImageIcon
                        size={18}
                        className="text-slate-400"
                      />

                      <input
                        type="url"
                        value={image}
                        onChange={(e) =>
                          updateImage(index, e.target.value)
                        }
                        placeholder="https://example.com/image.jpg"
                        className="w-full py-3 outline-none"
                      />
                    </div>

                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeImageField(index)
                        }
                        className="rounded-lg border border-red-300 px-3 text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
                        {/* SPECIFICATIONS */}

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  Specifications
                </h2>

                <button
                  type="button"
                  onClick={addSpecification}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Add Specification
                </button>
              </div>

              <div className="space-y-4">
                {formData.specifications.map((spec, index) => (
                  <div
                    key={index}
                    className="grid gap-3 md:grid-cols-[1fr_1fr_auto]"
                  >
                    <input
                      type="text"
                      value={spec.key}
                      onChange={(e) =>
                        updateSpecification(index, "key", e.target.value)
                      }
                      placeholder="Specification"
                      className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
                    />

                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) =>
                        updateSpecification(index, "value", e.target.value)
                      }
                      placeholder="Value"
                      className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
                    />

                    {formData.specifications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSpecification(index)}
                        className="rounded-lg border border-red-300 px-4 py-3 text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}

          <div className="space-y-6">

            {/* PRODUCT SETTINGS */}

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-bold text-slate-900">
                Product Settings
              </h2>

              <div className="space-y-4">

                <label className="flex items-center justify-between rounded-xl border border-slate-200 p-4 cursor-pointer">
                  <div>
                    <p className="font-semibold text-slate-900">
                      Featured Product
                    </p>

                    <p className="text-sm text-slate-500">
                      Show this product in featured sections.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      updateField("featured", e.target.checked)
                    }
                    className="h-5 w-5"
                  />
                </label>

                <label className="flex items-center justify-between rounded-xl border border-slate-200 p-4 cursor-pointer">
                  <div>
                    <p className="font-semibold text-slate-900">
                      Free Delivery
                    </p>

                    <p className="text-sm text-slate-500">
                      Display free delivery for this product.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={formData.freeDelivery}
                    onChange={(e) =>
                      updateField("freeDelivery", e.target.checked)
                    }
                    className="h-5 w-5"
                  />
                </label>

              </div>
            </div>

            {/* LIVE PREVIEW */}

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-bold text-slate-900">
                Live Preview
              </h2>

              <div className="overflow-hidden rounded-xl border border-slate-200">

                <div className="aspect-square bg-slate-100 flex items-center justify-center">
                  {formData.images[0] ? (
                    <img
                      src={formData.images[0]}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-slate-400">
                      <ImageIcon size={40} className="mx-auto mb-2" />
                      <p className="text-sm">No Image</p>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 line-clamp-2">
                    {formData.name || "Product Name"}
                  </h3>

                  <p className="mt-2 text-xl font-bold text-blue-600">
                    PKR {Number(formData.price || 0).toLocaleString()}
                  </p>

                  {Number(formData.oldPrice) > Number(formData.price) && (
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm text-slate-400 line-through">
                        PKR {Number(formData.oldPrice).toLocaleString()}
                      </span>

                      <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
                        {discount}% OFF
                      </span>
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      Stock
                    </span>

                    <span className="font-semibold text-slate-900">
                      {formData.stock || "0"}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      Brand
                    </span>

                    <span className="font-semibold text-slate-900">
                      {formData.brand || "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SUBMIT */}

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save Product
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => router.push("/seller/products")}
                className="mt-3 w-full rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
              </div>
    </main>
  );
}