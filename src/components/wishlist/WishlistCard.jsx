"use client";

import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  Trash2,
  Star,
} from "lucide-react";
import { toast } from "sonner";

import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export default function WishlistCard({ product }) {
  const {
    removeFromWishlist,
  } = useWishlist();

  const {
    addToCart,
  } = useCart();

  if (!product) {
    return null;
  }

  const productId =
    product.id ||
    product._id?.toString();

  const productName =
    product.name || "Product";

  const productImage =
    product.image ||
    (Array.isArray(product.images) &&
    product.images.length > 0
      ? product.images[0]
      : "");

  const currentPrice =
    Number(product.price) || 0;

  const originalPrice =
    Number(product.oldPrice) || 0;

  const productStock =
    Number(product.stock);

  const hasStock =
    Number.isFinite(productStock)
      ? productStock > 0
      : true;

  const rating =
    Number(product.rating) || 0;

  const reviews =
    Number(product.reviews) || 0;

  let discount =
    Number(product.discount) || 0;

  if (
    discount <= 0 &&
    originalPrice > currentPrice &&
    originalPrice > 0
  ) {
    discount = Math.round(
      ((originalPrice - currentPrice) /
        originalPrice) *
        100
    );
  }

  function handleRemove() {
    if (!productId) {
      toast.error(
        "Product ID is missing."
      );
      return;
    }

    removeFromWishlist(productId);

    toast.success(
      "Product removed from wishlist."
    );
  }

  function handleAddToCart() {
    if (!productId) {
      toast.error(
        "Product ID is missing."
      );
      return;
    }

    if (!hasStock) {
      toast.error(
        "This product is out of stock."
      );
      return;
    }

    try {
      addToCart({
        ...product,
        id: productId,
        _id: productId,
        image: productImage,
        price: currentPrice,
        oldPrice: originalPrice,
        discount,
        quantity: 1,
      });

      toast.success(
        "Product added to cart."
      );
    } catch (error) {
      console.error(
        "Wishlist cart error:",
        error
      );

      toast.error(
        "Unable to add product to cart."
      );
    }
  }

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* IMAGE */}

      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Link
          href={
            productId
              ? `/products/${productId}`
              : "#"
          }
          className="block h-full w-full"
        >
          {productImage ? (
            <img
              src={productImage}
              alt={productName}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
              No image
            </div>
          )}
        </Link>

        {/* DISCOUNT */}

        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-lg bg-red-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            -{discount}%
          </span>
        )}

        {/* REMOVE */}

        <button
          type="button"
          onClick={handleRemove}
          aria-label={`Remove ${productName} from wishlist`}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-gray-600 shadow-sm backdrop-blur transition hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* CONTENT */}

      <div className="flex flex-col p-4">
        {/* BRAND */}

        {product.brand && (
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {product.brand}
          </p>
        )}

        {/* NAME */}

        <Link
          href={
            productId
              ? `/products/${productId}`
              : "#"
          }
        >
          <h2 className="mt-1 line-clamp-2 min-h-[48px] text-base font-bold text-gray-900 transition hover:text-blue-600">
            {productName}
          </h2>
        </Link>

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
                    Math.round(rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }
                />
              )
            )}
          </div>

          <span className="text-xs text-gray-500">
            {rating > 0
              ? rating.toFixed(1)
              : "No rating"}
          </span>

          {reviews > 0 && (
            <span className="text-xs text-gray-400">
              ({reviews})
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

          {originalPrice >
            currentPrice && (
            <p className="mt-1 text-xs font-semibold text-green-600">
              Save £
              {(
                originalPrice -
                currentPrice
              ).toFixed(2)}
            </p>
          )}
        </div>

        {/* STOCK */}

        <div className="mt-3">
          {hasStock ? (
            <span className="text-xs font-semibold text-green-600">
              In stock
            </span>
          ) : (
            <span className="text-xs font-semibold text-red-600">
              Out of stock
            </span>
          )}
        </div>

        {/* ACTIONS */}

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!hasStock}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            <ShoppingCart size={17} />
            {hasStock
              ? "Add to Cart"
              : "Out of Stock"}
          </button>

          <button
            type="button"
            onClick={handleRemove}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
          >
            <Heart
              size={17}
              className="fill-red-500 text-red-500"
            />
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}