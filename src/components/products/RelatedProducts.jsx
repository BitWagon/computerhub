"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import {
  ArrowRight,
  ShoppingCart,
  Star,
} from "lucide-react";

export default function RelatedProducts({
  productId,
  categoryId,
  category,
}) {
  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!productId) {
      return;
    }

    async function loadRelatedProducts() {
      try {
        setLoading(true);
        setError("");

        const params =
          new URLSearchParams();

        params.set(
          "productId",
          productId
        );

        if (categoryId) {
          params.set(
            "categoryId",
            categoryId
          );
        }

        if (category) {
          params.set(
            "category",
            category
          );
        }

        const response =
          await fetch(
            `/api/products/related?${params.toString()}`,
            {
              cache: "no-store",
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Unable to load related products."
          );
        }

        setProducts(
          Array.isArray(
            data.products
          )
            ? data.products
            : []
        );
      } catch (err) {
        console.error(
          "Related products error:",
          err
        );

        setError(
          err.message ||
            "Unable to load related products."
        );
      } finally {
        setLoading(false);
      }
    }

    loadRelatedProducts();
  }, [
    productId,
    categoryId,
    category,
  ]);

  /* -------------------------
     NOTHING TO SHOW
  ------------------------- */

  if (
    !loading &&
    !error &&
    products.length === 0
  ) {
    return null;
  }

  return (
    <section className="mt-8 rounded-xl border border-gray-200 bg-white p-5 md:p-7">
      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            You May Also Like
          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            Related Products
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            More products you may be interested in.
          </p>
        </div>

        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
        >
          View All
          <ArrowRight size={17} />
        </Link>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            1,
            2,
            3,
            4,
          ].map((item) => (
            <div
              key={item}
              className="animate-pulse overflow-hidden rounded-xl border border-gray-200"
            >
              <div className="h-52 bg-gray-200" />

              <div className="space-y-3 p-4">
                <div className="h-4 rounded bg-gray-200" />

                <div className="h-4 w-2/3 rounded bg-gray-200" />

                <div className="h-6 w-1/2 rounded bg-gray-200" />

                <div className="h-10 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="mt-6 rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* PRODUCTS */}
      {!loading &&
        !error &&
        products.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map(
              (product) => {
                const productIdValue =
                  product._id?.toString() ||
                  product.id?.toString();

                const image =
                  product.image ||
                  product.images?.[0] ||
                  "";

                const rating =
                  Number(
                    product.rating || 0
                  );

                const reviews =
                  Number(
                    product.reviews || 0
                  );

                const price =
                  Number(
                    product.price || 0
                  );

                const oldPrice =
                  Number(
                    product.oldPrice || 0
                  );

                const discount =
                  Number(
                    product.discount || 0
                  );

                return (
                  <div
                    key={
                      productIdValue
                    }
                    className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                  >
                    {/* IMAGE */}
                    <Link
                      href={`/products/${productIdValue}`}
                      className="block"
                    >
                      <div className="relative flex h-52 items-center justify-center overflow-hidden bg-gray-50 p-4">
                        {image ? (
                          <img
                            src={image}
                            alt={
                              product.name ||
                              "Product"
                            }
                            className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="text-sm text-gray-400">
                            No image
                          </div>
                        )}

                        {discount >
                          0 && (
                          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white">
                            -{discount}%
                          </span>
                        )}
                      </div>
                    </Link>

                    {/* CONTENT */}
                    <div className="p-4">
                      <Link
                        href={`/products/${productIdValue}`}
                      >
                        <h3 className="line-clamp-2 min-h-[48px] text-sm font-semibold text-gray-900 transition hover:text-blue-600">
                          {product.name}
                        </h3>
                      </Link>

                      {/* RATING */}
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {[
                            1,
                            2,
                            3,
                            4,
                            5,
                          ].map(
                            (star) => (
                              <Star
                                key={
                                  star
                                }
                                size={14}
                                className={
                                  star <=
                                  rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }
                              />
                            )
                          )}
                        </div>

                        <span className="text-xs text-gray-500">
                          {rating > 0
                            ? rating.toFixed(
                                1
                              )
                            : "No rating"}

                          {reviews >
                            0 &&
                            ` (${reviews})`}
                        </span>
                      </div>

                      {/* PRICE */}
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          ${price.toFixed(
                            2
                          )}
                        </span>

                        {oldPrice >
                          price && (
                          <span className="text-xs text-gray-400 line-through">
                            $
                            {oldPrice.toFixed(
                              2
                            )}
                          </span>
                        )}
                      </div>

                      {/* SELLER */}
                      {product.seller && (
                        <p className="mt-2 truncate text-xs text-gray-500">
                          Sold by{" "}
                          <span className="font-medium text-gray-700">
                            {
                              product.seller
                            }
                          </span>
                        </p>
                      )}

                      {/* BUTTON */}
                      <Link
                        href={`/products/${productIdValue}`}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        <ShoppingCart
                          size={16}
                        />
                        View Product
                      </Link>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
    </section>
  );
}