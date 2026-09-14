"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronRight,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";

import ProductImages from "@/components/products/ProductImages";
import ProductInfo from "@/components/products/ProductInfo";
import ProductReviews from "@/components/products/ProductsReviews"; 
import RelatedProducts from "@/components/products/RelatedProducts";

export default function ProductDetailsPage() {
  const params = useParams();

  const productId = params?.id?.toString();

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!productId) {
      return;
    }

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/products/${encodeURIComponent(productId)}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (
          !response.ok ||
          !data.success ||
          !data.product
        ) {
          throw new Error(
            data.message || "Product not found."
          );
        }

        const apiProduct = data.product;

        const formattedProduct = {
          ...apiProduct,

          id:
            apiProduct._id?.toString() ||
            apiProduct.id,

          image:
            apiProduct.image ||
            apiProduct.images?.[0] ||
            "",

          images:
            Array.isArray(apiProduct.images)
              ? apiProduct.images
              : apiProduct.image
                ? [apiProduct.image]
                : [],

          category:
            apiProduct.category ||
            apiProduct.categoryId?.name ||
            "",

          seller:
            apiProduct.sellerName ||
            apiProduct.seller ||
            "",

          price: Number(
            apiProduct.price || 0
          ),

          oldPrice: Number(
            apiProduct.oldPrice || 0
          ),

          discount: Number(
            apiProduct.discount || 0
          ),

          stock: Number(
            apiProduct.stock || 0
          ),

          rating: Number(
            apiProduct.rating || 0
          ),

          reviews: Number(
            apiProduct.reviews || 0
          ),
        };

        setProduct(formattedProduct);
      } catch (err) {
        console.error(
          "Product details error:",
          err
        );

        setError(
          err.message ||
            "Unable to load this product."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  /* -------------------------
     LOADING
  ------------------------- */

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-5 w-64 rounded bg-gray-200" />

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="h-[500px] rounded-xl bg-gray-200" />

              <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-7">
                <div className="h-8 w-3/4 rounded bg-gray-200" />

                <div className="h-5 w-1/3 rounded bg-gray-200" />

                <div className="h-10 w-1/2 rounded bg-gray-200" />

                <div className="h-24 rounded bg-gray-200" />

                <div className="h-12 rounded bg-gray-200" />

                <div className="h-12 rounded bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* -------------------------
     NOT FOUND / ERROR
  ------------------------- */

  if (error || !product) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-lg rounded-xl border border-gray-200 bg-white p-10">
            <h1 className="text-2xl font-bold text-gray-900">
              Product Not Found
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              {error ||
                "The product you are looking for does not exist or may have been removed."}
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* BREADCRUMB */}

      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
            <Link
              href="/"
              className="transition hover:text-blue-600"
            >
              Home
            </Link>

            <ChevronRight size={15} />

            <Link
              href="/products"
              className="transition hover:text-blue-600"
            >
              Products
            </Link>

            <ChevronRight size={15} />

            {product.category && (
              <>
                <span className="text-gray-600">
                  {product.category}
                </span>

                <ChevronRight size={15} />
              </>
            )}

            <span className="line-clamp-1 text-gray-700">
              {product.name}
            </span>
          </div>
        </div>
      </div>

      {/* PRODUCT */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* IMAGES */}

          <div>
            <ProductImages
              images={product.images || []}
              productName={product.name}
            />
          </div>

          {/* PRODUCT INFORMATION */}

          <div className="rounded-xl border border-gray-200 bg-white p-5 md:p-7">
            <ProductInfo
              product={product}
            />
          </div>
        </div>

        {/* FEATURES */}

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* DELIVERY */}

          <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50">
              <Truck
                size={22}
                className="text-blue-600"
              />
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Fast Delivery
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                Reliable delivery to your address
              </p>
            </div>
          </div>

          {/* SECURITY */}

          <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-50">
              <ShieldCheck
                size={22}
                className="text-green-600"
              />
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Secure Shopping
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                Shop with confidence on ComputerHub
              </p>
            </div>
          </div>

          {/* RETURNS */}

          <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-50">
              <RotateCcw
                size={22}
                className="text-purple-600"
              />
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Easy Returns
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                Simple return support for eligible items
              </p>
            </div>
          </div>
        </div>

        {/* SPECIFICATIONS */}

        <section className="mt-8 rounded-xl border border-gray-200 bg-white p-5 md:p-7">
          <h2 className="text-xl font-bold text-gray-900">
            Product Specifications
          </h2>

          <div className="mt-5 grid grid-cols-1 overflow-hidden rounded-lg border border-gray-200 sm:grid-cols-2">
            <Specification
              label="Brand"
              value={product.brand}
            />

            <Specification
              label="Category"
              value={product.category}
            />

            <Specification
              label="Subcategory"
              value={product.subcategory}
            />

            <Specification
              label="Processor"
              value={product.processor}
            />

            <Specification
              label="RAM"
              value={product.ram}
            />

            <Specification
              label="Storage"
              value={product.storage}
            />

            <Specification
              label="Graphics"
              value={product.graphics}
            />

            <Specification
              label="Screen Size"
              value={product.screenSize}
            />

            <Specification
              label="Availability"
              value={
                product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"
              }
            />

            <Specification
              label="Seller"
              value={product.seller}
            />

            <Specification
              label="SKU"
              value={product.sku}
            />
          </div>
        </section>

        {/* DESCRIPTION */}

        {product.description && (
          <section className="mt-8 rounded-xl border border-gray-200 bg-white p-5 md:p-7">
            <h2 className="text-xl font-bold text-gray-900">
              Product Description
            </h2>

            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-600">
              {product.description}
            </p>
          </section>
        )}

        {/* REVIEWS */}

        <ProductReviews
          productId={productId}
        />

        {/* RELATED PRODUCTS */}

        <RelatedProducts
          productId={productId}
          categoryId={
            product.categoryId?._id?.toString() ||
            product.categoryId?.toString()
          }
          category={product.category}
        />
      </section>
    </main>
  );
}

/* -------------------------
   SPECIFICATION
------------------------- */

function Specification({
  label,
  value,
}) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 border-b border-gray-200 p-4 last:border-b-0 sm:[&:nth-child(odd)]:border-r">
      <span className="text-sm font-medium text-gray-500">
        {label}
      </span>

      <span className="text-right text-sm font-semibold text-gray-900">
        {value}
      </span>
    </div>
  );
}