"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Minus,
  Plus,
  Trash2,
  Truck,
  CheckCircle2,
} from "lucide-react";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function CartItem({ item }) {
  const {
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const {
    isInWishlist,
    toggleWishlist,
  } = useWishlist();

  const productId =
    item.id ||
    item._id?.toString();

  const image =
    item.image ||
    item.images?.[0] ||
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80";

  const price = Number(
    item.price || 0
  );

  const oldPrice = Number(
    item.oldPrice ||
      item.originalPrice ||
      0
  );

  let discount = Number(
    item.discount || 0
  );

  if (
    !discount &&
    oldPrice > price &&
    oldPrice > 0
  ) {
    discount = Math.round(
      ((oldPrice - price) /
        oldPrice) *
        100
    );
  }

  const quantity = Number(
    item.quantity || 1
  );

  const stock = Number(
    item.stock || 0
  );

  const itemTotal =
    price * quantity;

  const totalOriginalPrice =
    oldPrice > price
      ? oldPrice * quantity
      : 0;

  const totalSavings =
    totalOriginalPrice > itemTotal
      ? totalOriginalPrice -
        itemTotal
      : 0;

  const seller =
    item.sellerName ||
    item.seller ||
    "ComputerHub Official";

  const freeDelivery =
    item.freeDelivery !== false;

  const isWishlisted =
    productId
      ? isInWishlist(productId)
      : false;

  const canIncrease =
    stock <= 0 ||
    quantity < stock;

  function handleWishlist() {
    if (!productId) {
      return;
    }

    toggleWishlist({
      ...item,
      id: productId,
      _id: productId,
      image,
      images:
        item.images?.length
          ? item.images
          : [image],
      price,
      oldPrice,
      discount,
      seller,
      sellerName: seller,
      freeDelivery,
    });
  }

  return (
    <article className="border-b border-gray-200 p-5 last:border-b-0">
      <div className="flex flex-col gap-5 sm:flex-row">
        {/* PRODUCT IMAGE */}

        <Link
          href={`/products/${productId}`}
          className="flex h-32 w-full flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white sm:h-32 sm:w-32"
        >
          <Image
            src={image}
            alt={
              item.name ||
              "Product"
            }
            width={300}
            height={300}
            className="h-full w-full object-contain p-2 transition duration-300 hover:scale-105"
          />
        </Link>

        {/* PRODUCT DETAILS */}

        <div className="min-w-0 flex-1">
          <Link
            href={`/products/${productId}`}
            className="line-clamp-2 text-base font-semibold leading-6 text-gray-900 transition hover:text-blue-600"
          >
            {item.name ||
              "Product"}
          </Link>

          {/* BRAND */}

          {item.brand && (
            <p className="mt-1 text-sm text-gray-500">
              Brand:{" "}
              <span className="font-medium text-gray-700">
                {item.brand}
              </span>
            </p>
          )}

          {/* SELLER */}

          <div className="mt-2 flex items-center gap-1.5 text-sm">
            <span className="text-gray-500">
              Sold by
            </span>

            <span className="font-semibold text-gray-900">
              {seller}
            </span>

            <CheckCircle2
              size={15}
              className="text-blue-600"
            />
          </div>

          {/* FREE DELIVERY */}

          {freeDelivery && (
            <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-green-600">
              <Truck
                size={16}
                strokeWidth={2}
              />

              <span>
                Free delivery
              </span>
            </div>
          )}

          {/* PRICE */}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              $
              {price.toLocaleString()}
            </span>

            {oldPrice > price && (
              <span className="text-sm text-gray-400 line-through">
                $
                {oldPrice.toLocaleString()}
              </span>
            )}

            {discount > 0 && (
              <span className="rounded bg-red-50 px-2 py-1 text-xs font-bold text-red-600">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* SAVINGS */}

          {totalSavings > 0 && (
            <p className="mt-1 text-xs font-semibold text-green-600">
              You save $
              {totalSavings.toLocaleString()}
            </p>
          )}

          {/* STOCK */}

          {stock > 0 && (
            <p
              className={`mt-2 text-xs font-medium ${
                quantity >= stock
                  ? "text-orange-600"
                  : "text-gray-500"
              }`}
            >
              {quantity >= stock
                ? "Maximum available quantity selected"
                : `${stock} available`}
            </p>
          )}

          {stock === 0 && (
            <p className="mt-2 text-xs font-semibold text-red-600">
              Out of stock
            </p>
          )}
        </div>

        {/* ACTIONS */}

        <div className="flex flex-row items-center justify-between gap-4 sm:w-40 sm:flex-col sm:items-end sm:justify-between">
          {/* REMOVE / WISHLIST */}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleWishlist}
              className={`transition ${
                isWishlisted
                  ? "text-red-500"
                  : "text-gray-400 hover:text-red-500"
              }`}
              aria-label={
                isWishlisted
                  ? `Remove ${item.name} from wishlist`
                  : `Save ${item.name} for later`
              }
              title={
                isWishlisted
                  ? "Remove from wishlist"
                  : "Save for later"
              }
            >
              <Heart
                size={19}
                fill={
                  isWishlisted
                    ? "currentColor"
                    : "none"
                }
              />
            </button>

            <button
              type="button"
              onClick={() =>
                removeFromCart(
                  productId
                )
              }
              className="text-gray-400 transition hover:text-red-600"
              aria-label={`Remove ${item.name}`}
              title="Remove from cart"
            >
              <Trash2 size={19} />
            </button>
          </div>

          {/* QUANTITY */}

          <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">
            <button
              type="button"
              onClick={() =>
                decreaseQuantity(
                  productId
                )
              }
              disabled={
                quantity <= 1
              }
              className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              <Minus size={15} />
            </button>

            <span className="flex h-9 min-w-10 items-center justify-center border-x border-gray-300 px-2 text-sm font-semibold text-gray-900">
              {quantity}
            </span>

            <button
              type="button"
              onClick={() =>
                increaseQuantity(
                  productId
                )
              }
              disabled={
                !canIncrease
              }
              className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <Plus size={15} />
            </button>
          </div>

          {/* ITEM TOTAL */}

          <div className="text-right">
            <p className="text-xs text-gray-500">
              Item total
            </p>

            <p className="font-bold text-gray-900">
              $
              {itemTotal.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}