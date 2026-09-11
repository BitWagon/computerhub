"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Star, Truck } from "lucide-react";
import { useState } from "react";

export default function ProductCard({ product }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const {
    id,
    name,
    image,
    price,
    oldPrice,
    discount,
    rating,
    reviews,
    seller,
    freeDelivery,
  } = product;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl">
      {/* Wishlist */}
      <button
        type="button"
        onClick={() => setIsFavorite(!isFavorite)}
        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-105"
        aria-label="Add to wishlist"
      >
        <Heart
          size={19}
          className={
            isFavorite
              ? "fill-red-500 text-red-500"
              : "text-gray-500"
          }
        />
      </button>

      {/* Product Image */}
      <Link href={`/products/${id}`} className="block">
        <div className="relative flex h-56 items-center justify-center bg-gray-50 p-5">
          {image ? (
            <Image
              src={image}
              alt={name}
              width={260}
              height={220}
              className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
              No Image
            </div>
          )}

          {discount && (
            <span className="absolute left-3 top-3 rounded-md bg-red-500 px-2.5 py-1 text-xs font-bold text-white">
              -{discount}%
            </span>
          )}
        </div>
      </Link>

      {/* Product Content */}
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/products/${id}`}>
          <h3 className="line-clamp-2 min-h-[48px] text-sm font-semibold leading-6 text-gray-800 transition hover:text-blue-600">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1">
          <div className="flex items-center gap-0.5">
            <Star
              size={15}
              className="fill-yellow-400 text-yellow-400"
            />
            <span className="text-sm font-medium text-gray-700">
              {rating || "0.0"}
            </span>
          </div>

          <span className="text-xs text-gray-400">
            ({reviews || 0})
          </span>
        </div>

        {/* Price */}
        <div className="mt-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">
              ${Number(price || 0).toLocaleString()}
            </span>

            {oldPrice && (
              <span className="text-sm text-gray-400 line-through">
                ${Number(oldPrice).toLocaleString()}
              </span>
            )}
          </div>

          {discount && oldPrice && (
            <p className="mt-1 text-xs font-medium text-green-600">
              Save $
              {(Number(oldPrice) - Number(price)).toLocaleString()}
            </p>
          )}
        </div>

        {/* Delivery */}
        {freeDelivery && (
          <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-green-600">
            <Truck size={14} />
            Free delivery
          </div>
        )}

        {/* Seller */}
        {seller && (
          <p className="mt-2 text-xs text-gray-500">
            Sold by{" "}
            <span className="font-medium text-gray-700">
              {seller}
            </span>
          </p>
        )}

        {/* Add Cart */}
        <button
          type="button"
          className="mt-auto flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
        >
          <ShoppingCart size={17} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}