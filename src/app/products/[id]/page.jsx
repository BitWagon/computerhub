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
  CheckCircle2,
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
          throw new Error(data.message || "Product not found.");
        }

        const apiProduct = data.product;

        const productPrice = Number(apiProduct.price || 0);

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

        const productImages = Array.isArray(apiProduct.images)
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

          stock: Number(apiProduct.stock || 0),

          rating: Number(apiProduct.rating || 0),

          reviews: Number(apiProduct.reviews || 0),

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

  if (error || !product) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Product Not Found
          </h1>

          <p className="mt-3 text-gray-500">
            {error || "This product is unavailable."}
          </p>

          <Link
            href="/products"
            className="mt-6 inline-flex items-center rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
          >
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-4 text-sm text-gray-500 sm:px-6 lg:px-8">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>

          <ChevronRight size={16} />

          <Link
            href="/products"
            className="hover:text-blue-600"
          >
            Products
          </Link>

          {product.category && (
            <>
              <ChevronRight size={16} />

              <span>{product.category}</span>
            </>
          )}

          <ChevronRight size={16} />

          <span className="truncate text-gray-900">
            {product.name}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <ProductImages product={product} />

          <ProductInfo product={product} />
        </div>

        <div className="mt-12 grid gap-4 rounded-2xl border border-gray-200 bg-white p-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-3">
            <Truck className="mt-1 text-blue-600" size={22} />

            <div>
              <h3 className="font-semibold text-gray-900">
                Fast Delivery
              </h3>

              <p className="text-sm text-gray-500">
                Nationwide shipping across Pakistan.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShieldCheck
              className="mt-1 text-blue-600"
              size={22}
            />

            <div>
              <h3 className="font-semibold text-gray-900">
                Genuine Products
              </h3>

              <p className="text-sm text-gray-500">
                100% original hardware and accessories.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <RotateCcw className="mt-1 text-blue-600" size={22} />

            <div>
              <h3 className="font-semibold text-gray-900">
                Easy Returns
              </h3>

              <p className="text-sm text-gray-500">
                Return eligible products with ease.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Store className="mt-1 text-blue-600" size={22} />

            <div>
              <h3 className="font-semibold text-gray-900">
                Trusted Seller
              </h3>

              <p className="text-sm text-gray-500">
                Verified ComputerHub marketplace sellers.
              </p>
            </div>
          </div>
        </div>

        {/* PRODUCT DESCRIPTION */}
                

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-bold text-gray-900">
            Product Description
          </h2>

          <div className="mt-4 whitespace-pre-line text-gray-600">
            {product.description || "No description available."}
          </div>
        </div>

        {/* SPECIFICATIONS */}

        {product.specifications &&
          Object.keys(product.specifications).length > 0 && (
            <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Specifications
              </h2>

              <div className="mt-4 divide-y divide-gray-200">
                {Object.entries(product.specifications).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="grid grid-cols-2 gap-4 py-3"
                    >
                      <div className="font-medium text-gray-700">
                        {key}
                      </div>

                      <div className="text-gray-600">
                        {String(value)}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

        {/* REVIEWS */}

        <div className="mt-8">
          <ProductReviews product={product} />
        </div>

        {/* RELATED PRODUCTS */}

        <div className="mt-10">
          <RelatedProducts
            category={product.category}
            currentProductId={product.id}
          />
        </div>

        {/* JSON-LD PRODUCT SCHEMA */}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: product.name,
              image: product.images || [],
              description: product.description,
              sku: product.id,
              brand: {
                "@type": "Brand",
                name: product.brand || "ComputerHub",
              },
              offers: {
                "@type": "Offer",
                priceCurrency: "PKR",
                price: product.price,
                availability:
                  product.stock > 0
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
                seller: {
                  "@type": "Organization",
                  name:
                    product.sellerName || "ComputerHub",
                },
              },
              aggregateRating:
                product.rating > 0
                  ? {
                      "@type": "AggregateRating",
                      ratingValue: product.rating,
                      reviewCount:
                        product.reviews || 0,
                    }
                  : undefined,
            }),
          }}
        />

      </div>
    </main>
  );
}