"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Heart,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductCard({ product }) {
  const {
    id,
    _id,
    name,
    image,
    images,
    price,
    oldPrice,
    discount,
    rating,
    reviews,
    seller,
    sellerName,
    freeDelivery,
    stock,
  } = product;

  const { addToCart } = useCart();

  const {
    isInWishlist,
    toggleWishlist,
  } = useWishlist();

  const [addingToCart, setAddingToCart] =
    useState(false);

  /*
   * SUPPORT BOTH id AND _id
   */
  const productId =
    id || _id?.toString();

  /*
   * PRODUCT IMAGE
   */
  const productImage =
    image ||
    (Array.isArray(images) &&
      images.length > 0
      ? images[0]
      : "");

  /*
   * PRICE VALUES
   */
  const currentPrice =
    Number(price) || 0;

  const originalPrice =
    Number(oldPrice) || 0;

  /*
   * USE DATABASE DISCOUNT WHEN AVAILABLE.
   *
   * If discount is missing but oldPrice exists,
   * calculate it automatically.
   */
  let discountPercentage =
    Number(discount) || 0;

  if (
    discountPercentage <= 0 &&
    originalPrice > currentPrice &&
    originalPrice > 0
  ) {
    discountPercentage = Math.round(
      ((originalPrice - currentPrice) /
        originalPrice) *
        100
    );
  }

  /*
   * SAVINGS
   */
  const savings =
    originalPrice > currentPrice
      ? originalPrice - currentPrice
      : 0;

  /*
   * RATING
   */
  const productRating =
    Number(rating) || 0;

  const reviewCount =
    Number(reviews) || 0;

  /*
   * STOCK
   */
  const productStock =
    Number(stock) || 0;

  const isOutOfStock =
    productStock <= 0;

  /*
   * SELLER
   *
   * Use the product seller when available.
   * Otherwise show ComputerHub Official.
   */
  const productSeller =
    sellerName ||
    seller ||
    "ComputerHub Official";

  /*
   * WISHLIST
   */
  const wished =
    productId
      ? isInWishlist(productId)
      : false;

  /*
   * ADD TO CART
   */
  async function handleAddToCart(event) {
    event.preventDefault();
    event.stopPropagation();

    if (isOutOfStock) {
      toast.error(
        "This product is out of stock."
      );
      return;
    }

    try {
      setAddingToCart(true);

      addToCart({
        ...product,
        id: productId,
        _id: productId,
        image: productImage,
        price: currentPrice,
        oldPrice: originalPrice,
        discount:
          discountPercentage,
        quantity: 1,
      });

      toast.success(
        "Product added to cart."
      );
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      toast.error(
        "Unable to add product to cart."
      );
    } finally {
      setAddingToCart(false);
    }
  }

  /*
   * WISHLIST
   */
  function handleWishlist(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!productId) {
      toast.error(
        "Product ID is missing."
      );
      return;
    }

    try {
      toggleWishlist({
        ...product,
        id: productId,
        _id: productId,
        image: productImage,
        price: currentPrice,
        oldPrice: originalPrice,
        discount:
          discountPercentage,
      });

      if (wished) {
        toast.success(
          "Removed from wishlist."
        );
      } else {
        toast.success(
          "Added to wishlist."
        );
      }
    } catch (error) {
      console.error(
        "Wishlist error:",
        error
      );

      toast.error(
        "Unable to update wishlist."
      );
    }
  }

  return (
    <Link
      href={`/products/${productId}`}
      className="group block h-full"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">

        {/* IMAGE */}

        <div className="relative aspect-square overflow-hidden bg-gray-50">

          {productImage ? (
            <img
              src={productImage}
              alt={name || "Product"}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
              No image
            </div>
          )}

          {/* DISCOUNT BADGE */}

          {discountPercentage > 0 && (
            <div className="absolute left-3 top-3 rounded-lg bg-red-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
              -{discountPercentage}%
            </div>
          )}

          {/* WISHLIST */}

          <button
            type="button"
            onClick={handleWishlist}
            aria-label={
              wished
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-gray-600 shadow-sm backdrop-blur transition hover:bg-white hover:text-red-500"
          >
            <Heart
              size={19}
              className={
                wished
                  ? "fill-red-500 text-red-500"
                  : ""
              }
            />
          </button>

        </div>

        {/* CONTENT */}

        <div className="flex flex-1 flex-col p-4">

          {/* BRAND */}

          {product.brand && (
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {product.brand}
            </p>
          )}

          {/* NAME */}

          <h2 className="mt-1 line-clamp-2 min-h-[48px] text-base font-bold text-gray-900 transition group-hover:text-blue-600">
            {name}
          </h2>

          {/* RATING */}

          <div className="mt-2 flex items-center gap-1.5">

            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map(
                (star) => (
                  <Star
                    key={star}
                    size={14}
                    className={
                      star <=
                      Math.round(
                        productRating
                      )
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                )
              )}
            </div>

            <span className="text-xs text-gray-500">
              {productRating > 0
                ? productRating.toFixed(1)
                : "No rating"}
            </span>

            {reviewCount > 0 && (
              <span className="text-xs text-gray-400">
                ({reviewCount})
              </span>
            )}

          </div>

          {/* PRICE */}

          <div className="mt-4">

            <div className="flex flex-wrap items-end gap-2">

              <span className="text-2xl font-extrabold text-gray-900">
                £{currentPrice.toFixed(2)}
              </span>

              {originalPrice >
                currentPrice && (
                <span className="pb-0.5 text-sm text-gray-400 line-through">
                  £{originalPrice.toFixed(2)}
                </span>
              )}

            </div>

            {savings > 0 && (
              <p className="mt-1 text-xs font-semibold text-green-600">
                Save £{savings.toFixed(2)}
              </p>
            )}

          </div>

          {/* DELIVERY */}

          <div className="mt-4">

            {freeDelivery ? (
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-600">
                <Truck
                  size={15}
                  className="shrink-0"
                />

                <span>
                  Free delivery
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                <Truck
                  size={15}
                  className="shrink-0"
                />

                <span>
                  Delivery available
                </span>
              </div>
            )}

          </div>

          {/* SELLER */}

          <p className="mt-2 text-xs text-gray-500">
            Sold by{" "}
            <span className="font-semibold text-gray-700">
              {productSeller}
            </span>
          </p>

          {/* STOCK */}

          <div className="mt-3">

            {isOutOfStock ? (
              <span className="text-xs font-semibold text-red-600">
                Out of stock
              </span>
            ) : productStock <= 5 ? (
              <span className="text-xs font-semibold text-orange-600">
                Only {productStock} left
              </span>
            ) : (
              <span className="text-xs font-semibold text-green-600">
                In stock
              </span>
            )}

          </div>

          {/* ADD TO CART */}

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={
              addingToCart ||
              isOutOfStock
            }
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            <ShoppingCart size={17} />

            {addingToCart
              ? "Adding..."
              : isOutOfStock
              ? "Out of Stock"
              : "Add to Cart"}

          </button>

        </div>

      </article>
    </Link>
  );
}