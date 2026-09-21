"use client";

import Link from "next/link";
import {
  Heart,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

import { useWishlist } from "@/context/WishlistContext";
import WishlistCard from "@/components/wishlist/WishlistCard";

export default function AccountWishlist({
  limit = 4,
}) {
  const {
    wishlistItems,
    wishlistCount,
    isLoaded,
  } = useWishlist();

  if (!isLoaded) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />

          Loading your wishlist...
        </div>
      </section>
    );
  }

  const visibleItems =
    Number.isFinite(Number(limit)) &&
    Number(limit) > 0
      ? wishlistItems.slice(
          0,
          Number(limit)
        )
      : wishlistItems;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-red-500">
            <Heart
              size={16}
              className="fill-red-500"
            />

            Wishlist
          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            Saved Products
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {wishlistCount}{" "}
            {wishlistCount === 1
              ? "product"
              : "products"}{" "}
            saved.
          </p>
        </div>

        <Link
          href="/wishlist"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
        >
          View Wishlist

          <ArrowRight size={16} />
        </Link>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-5 py-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <Heart className="h-7 w-7 text-red-500" />
          </div>

          <h3 className="mt-4 font-bold text-gray-900">
            Your wishlist is empty
          </h3>

          <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
            Save products you like and come
            back to them later.
          </p>

          <Link
            href="/products"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <ShoppingBag size={16} />

            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {visibleItems.map(
            (product, index) => (
              <WishlistCard
                key={
                  product.id ||
                  product._id ||
                  index
                }
                product={product}
              />
            )
          )}
        </div>
      )}
    </section>
  );
}