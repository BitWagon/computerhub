"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Loader2,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { useWishlist } from "@/context/WishlistContext";
import WishlistCard from "@/components/wishlist/WishlistCard";

export default function WishlistPage() {
  const {
    wishlistItems,
    wishlistCount,
    isLoaded,
    clearWishlist,
  } = useWishlist();

  const hasItems =
    wishlistItems.length > 0;

  const productCount = useMemo(
    () => wishlistItems.length,
    [wishlistItems]
  );

  function handleClearWishlist() {
    if (!hasItems) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to remove all products from your wishlist?"
      );

    if (!confirmed) {
      return;
    }

    clearWishlist();

    toast.success(
      "Wishlist cleared successfully."
    );
  }

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="container-main flex min-h-[70vh] items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <Loader2
              size={21}
              className="animate-spin text-blue-600"
            />

            Loading your wishlist...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-8 sm:py-10">
      <div className="container-main">
        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/products"
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-blue-600"
            >
              <ArrowLeft size={16} />

              Continue Shopping
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                <Heart
                  size={24}
                  className="fill-red-500 text-red-500"
                />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  ComputerHub
                </p>

                <h1 className="text-3xl font-black text-slate-900">
                  My Wishlist
                </h1>
              </div>
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
              Save your favorite laptops,
              desktops, components and accessories
              for later.
            </p>
          </div>

          {hasItems && (
            <button
              type="button"
              onClick={handleClearWishlist}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
            >
              <Trash2 size={17} />

              Clear Wishlist
            </button>
          )}
        </div>

        {/* SUMMARY */}

        {hasItems && (
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Saved Products
                </p>

                <p className="mt-1 text-lg font-black text-gray-900">
                  {productCount}{" "}
                  {productCount === 1
                    ? "product"
                    : "products"}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Heart
                  size={17}
                  className="fill-red-500 text-red-500"
                />

                <span>
                  {wishlistCount} saved
                </span>
              </div>
            </div>
          </div>
        )}

        {/* EMPTY STATE */}

        {!hasItems && (
          <section className="flex min-h-[55vh] items-center justify-center rounded-3xl border border-gray-200 bg-white px-6 py-16 shadow-sm">
            <div className="max-w-lg text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-50">
                <Heart
                  size={44}
                  className="text-red-500"
                />
              </div>

              <h2 className="mt-7 text-2xl font-black text-gray-900">
                Your wishlist is empty
              </h2>

              <p className="mt-3 leading-7 text-gray-500">
                You haven't saved any products yet.
                Browse ComputerHub and add your
                favorite products to your wishlist.
              </p>

              <Link
                href="/products"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white transition hover:bg-blue-700"
              >
                <ShoppingBag size={19} />

                Browse Products
              </Link>
            </div>
          </section>
        )}

        {/* WISHLIST PRODUCTS */}

        {hasItems && (
          <section>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlistItems.map(
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
          </section>
        )}

        {/* INFORMATION */}

        {hasItems && (
          <div className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-center">
            <p className="text-sm text-blue-800">
              Your wishlist is currently saved
              on this device using ComputerHub's
              existing wishlist system.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}