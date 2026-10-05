"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronRight,
  RotateCcw,
  ShieldCheck,
  Truck,
  Store,
  ArrowLeft,
  PackageCheck,
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
    if (!productId) return;

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

        if (!response.ok || !data.success || !data.product) {
          throw new Error(
            data.message || "Product not found."
          );
        }

        const apiProduct = data.product;

        const productPrice = Number(
          apiProduct.price || 0
        );

        const productOldPrice = Number(
          apiProduct.oldPrice ||
            apiProduct.originalPrice ||
            0
        );

        let productDiscount = Number(
          apiProduct.discount || 0
        );

        if (
          !productDiscount &&
          productOldPrice > productPrice &&
          productOldPrice > 0
        ) {
          productDiscount = Math.round(
            ((productOldPrice - productPrice) /
              productOldPrice) *
              100
          );
        }

        const productImages = Array.isArray(
          apiProduct.images
        )
          ? apiProduct.images.filter(Boolean)
          : apiProduct.image
            ? [apiProduct.image]
            : [];

        const productSeller =
          apiProduct.sellerName ||
          apiProduct.seller ||
          "ComputerHub Official";

        const formattedProduct = {
          ...apiProduct,

          id:
            apiProduct._id?.toString() ||
            apiProduct.id ||
            productId,

          name:
            apiProduct.name ||
            "ComputerHub Product",

          image:
            apiProduct.image ||
            productImages[0] ||
            "",

          images: productImages,

          category:
            apiProduct.category ||
            apiProduct.categoryId?.name ||
            "",

          categoryId:
            apiProduct.categoryId || null,

          seller: productSeller,

          sellerName: productSeller,

          price: productPrice,

          oldPrice: productOldPrice,

          originalPrice: productOldPrice,

          discount: productDiscount,

          stock: Number(
            apiProduct.stock || 0
          ),

          rating: Number(
            apiProduct.rating || 0
          ),

          reviews: Number(
            apiProduct.reviews || 0
          ),

          freeDelivery:
            apiProduct.freeDelivery !== false,

          featured:
            apiProduct.featured === true,

          isActive:
            apiProduct.isActive !== false,
        };

        setProduct(formattedProduct);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load this product."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="container-main py-8">
          <div className="animate-pulse">
            <div className="h-4 w-72 rounded bg-slate-200" />

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="min-h-[520px] rounded-2xl bg-slate-200" />

              <div className="rounded-2xl border border-slate-200 bg-white p-7">
                <div className="h-4 w-32 rounded bg-slate-200" />

                <div className="mt-5 h-9 w-4/5 rounded bg-slate-200" />

                <div className="mt-3 h-9 w-3/5 rounded bg-slate-200" />

                <div className="mt-7 h-12 w-1/2 rounded bg-slate-200" />

                <div className="mt-7 space-y-3">
                  <div className="h-12 rounded-xl bg-slate-200" />
                  <div className="h-12 rounded-xl bg-slate-200" />
                  <div className="h-12 rounded-xl bg-slate-200" />
                </div>
              </div>
            </div>

            <div className="mt-8 h-28 rounded-2xl bg-slate-200" />
          </div>
        </div>
      </main>
    );
  }

  /* ============================================================
     ERROR
  ============================================================ */

  if (error || !product) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="container-main flex min-h-[70vh] items-center justify-center py-16">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <PackageCheck size={30} />
            </div>

            <h1 className="mt-5 text-2xl font-black text-slate-950">
              Product unavailable
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {error ||
                "This product is no longer available in the ComputerHub marketplace."}
            </p>

            <Link
              href="/products"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
            >
              <ArrowLeft size={17} />
              Browse Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const stockCount = Number(
    product.stock || 0
  );

  const isInStock = stockCount > 0;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ========================================================
          BREADCRUMBS
      ======================================================== */}

      <div className="border-b border-slate-200 bg-white">
        <div className="container-main flex min-w-0 items-center gap-2 overflow-hidden py-4 text-sm">
          <Link
            href="/"
            className="shrink-0 font-medium text-slate-400 transition hover:text-blue-600"
          >
            Home
          </Link>

          <ChevronRight
            size={15}
            className="shrink-0 text-slate-300"
          />

          <Link
            href="/products"
            className="shrink-0 font-medium text-slate-400 transition hover:text-blue-600"
          >
            Products
          </Link>

          {product.category && (
            <>
              <ChevronRight
                size={15}
                className="shrink-0 text-slate-300"
              />

              <span className="shrink-0 font-medium text-slate-400">
                {product.category}
              </span>
            </>
          )}

          <ChevronRight
            size={15}
            className="shrink-0 text-slate-300"
          />

          <span className="truncate font-semibold text-slate-800">
            {product.name}
          </span>
        </div>
      </div>

      {/* ========================================================
          PRODUCT
      ======================================================== */}

      <div className="container-main py-8 sm:py-10">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]">
          {/* IMAGE AREA */}

          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5">
            <ProductImages product={product} />
          </div>

          {/* INFO AREA */}

          <div className="min-w-0">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* ======================================================
            TRUST BAR
        ====================================================== */}

        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            <div className="flex items-start gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Truck size={21} />
              </div>

              <div>
                <h3 className="text-sm font-black text-slate-950">
                  Fast Delivery
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Nationwide shipping across Pakistan.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck size={21} />
              </div>

              <div>
                <h3 className="text-sm font-black text-slate-950">
                  Genuine Products
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Quality hardware from trusted sellers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <RotateCcw size={21} />
              </div>

              <div>
                <h3 className="text-sm font-black text-slate-950">
                  Easy Returns
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Return eligible products with ease.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Store size={21} />
              </div>

              <div>
                <h3 className="text-sm font-black text-slate-950">
                  Trusted Seller
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Verified ComputerHub marketplace sellers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================
            DESCRIPTION
        ====================================================== */}

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-2 border-b border-slate-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                Product Overview
              </p>

              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                Product Description
              </h2>
            </div>

            {product.brand && (
              <p className="text-sm font-bold text-slate-400">
                {product.brand}
              </p>
            )}
          </div>

          <div className="mt-6 max-w-4xl whitespace-pre-line text-sm leading-7 text-slate-600">
            {product.description ||
              "No description available for this product."}
          </div>
        </section>

        {/* ======================================================
            SPECIFICATIONS
        ====================================================== */}

        {product.specifications &&
          Object.keys(
            product.specifications
          ).length > 0 && (
            <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="border-b border-slate-100 pb-5">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                  Technical Details
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                  Specifications
                </h2>
              </div>

              <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
                {Object.entries(
                  product.specifications
                ).map(
                  ([key, value], index) => (
                    <div
                      key={key}
                      className={`grid grid-cols-1 gap-2 px-4 py-4 sm:grid-cols-[220px_1fr] sm:gap-6 ${
                        index % 2 === 0
                          ? "bg-slate-50/70"
                          : "bg-white"
                      }`}
                    >
                      <div className="text-xs font-black uppercase tracking-wide text-slate-500">
                        {key}
                      </div>

                      <div className="text-sm font-medium text-slate-800">
                        {String(value)}
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>
          )}

        {/* ======================================================
            REVIEWS
        ====================================================== */}

        <section className="mt-8">
          <ProductReviews product={product} />
        </section>

        {/* ======================================================
            RELATED PRODUCTS
        ====================================================== */}

        <section className="mt-10">
          <RelatedProducts
            category={product.category}
            currentProductId={product.id}
          />
        </section>

        {/* ======================================================
            JSON-LD
        ====================================================== */}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context":
                "https://schema.org",
              "@type": "Product",
              name: product.name,
              image:
                product.images || [],
              description:
                product.description,
              sku: product.id,
              brand: {
                "@type": "Brand",
                name:
                  product.brand ||
                  "ComputerHub",
              },
              offers: {
                "@type": "Offer",
                priceCurrency: "PKR",
                price: product.price,
                availability:
                  isInStock
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
                seller: {
                  "@type":
                    "Organization",
                  name:
                    product.sellerName ||
                    "ComputerHub",
                },
              },
              aggregateRating:
                product.rating > 0
                  ? {
                      "@type":
                        "AggregateRating",
                      ratingValue:
                        product.rating,
                      reviewCount:
                        product.reviews ||
                        0,
                    }
                  : undefined,
            }),
          }}
        />
      </div>
    </main>
  );
}