"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartItem({ item }) {
  const {
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const image =
    item.images?.[0] ||
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80";

  const itemTotal =
    Number(item.price || 0) *
    Number(item.quantity || 0);

  return (
    <article className="border-b border-gray-200 p-5 last:border-b-0">
      <div className="flex flex-col gap-5 sm:flex-row">
        {/* Product Image */}
        <Link
          href={`/products/${item.id}`}
          className="flex h-32 w-full flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white sm:h-32 sm:w-32"
        >
          <Image
            src={image}
            alt={item.name || "Product"}
            width={300}
            height={300}
            className="h-full w-full object-contain p-2 transition duration-300 hover:scale-105"
          />
        </Link>

        {/* Product Details */}
        <div className="min-w-0 flex-1">
          <Link
            href={`/products/${item.id}`}
            className="line-clamp-2 text-base font-semibold leading-6 text-gray-900 transition hover:text-blue-600"
          >
            {item.name}
          </Link>

          {item.brand && (
            <p className="mt-1 text-sm text-gray-500">
              Brand: {item.brand}
            </p>
          )}

          {item.seller && (
            <p className="mt-1 text-sm text-gray-500">
              Seller: {item.seller}
            </p>
          )}

          {item.freeDelivery && (
            <p className="mt-2 text-xs font-semibold text-green-600">
              Free delivery
            </p>
          )}

          {/* Price */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              $
              {Number(
                item.price || 0
              ).toLocaleString()}
            </span>

            {item.oldPrice && (
              <span className="text-sm text-gray-400 line-through">
                $
                {Number(
                  item.oldPrice
                ).toLocaleString()}
              </span>
            )}

            {item.discount && (
              <span className="text-xs font-bold text-red-600">
                {item.discount}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-row items-center justify-between gap-4 sm:w-40 sm:flex-col sm:items-end sm:justify-between">
          {/* Remove / Wishlist */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="text-gray-400 transition hover:text-blue-600"
              aria-label="Save for later"
            >
              <Heart size={19} />
            </button>

            <button
              type="button"
              onClick={() =>
                removeFromCart(item.id)
              }
              className="text-gray-400 transition hover:text-red-600"
              aria-label={`Remove ${item.name}`}
            >
              <Trash2 size={19} />
            </button>
          </div>

          {/* Quantity */}
          <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">
            <button
              type="button"
              onClick={() =>
                decreaseQuantity(item.id)
              }
              className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-gray-100"
              aria-label="Decrease quantity"
            >
              <Minus size={15} />
            </button>

            <span className="flex h-9 min-w-10 items-center justify-center border-x border-gray-300 px-2 text-sm font-semibold text-gray-900">
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={() =>
                increaseQuantity(item.id)
              }
              disabled={
                item.stock &&
                item.quantity >= item.stock
              }
              className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <Plus size={15} />
            </button>
          </div>

          {/* Item Total */}
          <p className="font-bold text-gray-900">
            ${itemTotal.toLocaleString()}
          </p>
        </div>
      </div>
    </article>
  );
}