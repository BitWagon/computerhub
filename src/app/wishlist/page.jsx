"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Loader2,
  ShoppingBag,
  Trash2,
  Sparkles,
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

  const hasItems = wishlistItems.length > 0;

  const productCount = useMemo(
    () => wishlistItems.length,
    [wishlistItems]
  );

  function handleClearWishlist() {
    if (!hasItems) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to remove all products from your wishlist?"
    );

    if (!confirmed) {
      return;
    }

    clearWishlist();

    toast.success("Wishlist cleared successfully.");
  }

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="container-main flex min-h-[70vh] items-center justify-center">
          <div className="rounded-2xl border border-slate-200 bg-white px-8 py-7 text-center shadow-sm">
            <Loader2
              size={28}
              className="mx-auto animate-spin text-blue-600"
            />

            <p className="mt-4 text-sm font-medium text-slate-600">
              Loading your wishlist...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container-main py-8 sm:py-10 lg:py-12">

        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm">
          <Link
            href="/"
            className="font-medium text-slate-500 transition hover:text-blue-600"
          >
            Home
          </Link>

          <span className="text-slate-300">/</span>

          <span className="font-semibold text-slate-900">
            Wishlist
          </span>
        </div>

        {/* Header */}
        <section className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="relative p-6 sm:p-8 lg:p-10">

            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-50 blur-3xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

              <div>
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
                    <Heart
                      size={23}
                      className="fill-red-500 text-red-500"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                      ComputerHub
                    </p>

                    <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                      My Wishlist
                    </h1>
                  </div>
                </div>

                <p className="max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                  Keep the products you love in one place and come
                  back whenever you are ready to buy.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
                >
                  <ShoppingBag size={17} />
                  Browse Products
                </Link>

                {hasItems && (
                  <button
                    type="button"
                    onClick={handleClearWishlist}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 size={17} />
                    Clear Wishlist
                  </button>
                )}
              </div>
            </div>
          </div>

          {hasItems && (
            <div className="grid border-t border-slate-100 sm:grid-cols-2">
              <div className="border-b border-slate-100 px-6 py-5 sm:border-b-0 sm:border-r sm:px-8">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Saved Products
                </p>

                <p className="mt-1 text-2xl font-black text-slate-950">
                  {productCount}
                </p>
              </div>

              <div className="px-6 py-5 sm:px-8">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Wishlist Items
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <Heart
                    size={18}
                    className="fill-red-500 text-red-500"
                  />

                  <p className="text-2xl font-black text-slate-950">
                    {wishlistCount}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Empty State */}
        {!hasItems && (
          <section className="flex min-h-[50vh] items-center justify-center rounded-3xl border border-slate-200 bg-white px-6 py-16 shadow-sm">
            <div className="max-w-lg text-center">

              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-red-50">
                <Heart
                  size={43}
                  className="text-red-500"
                />
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                <Sparkles size={14} />
                Your saved products
              </div>

              <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                Your wishlist is empty
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
                Discover laptops, desktops, components, gaming gear
                and accessories, then save your favorites for later.
              </p>

              <Link
                href="/products"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
              >
                <ShoppingBag size={18} />
                Explore Products
              </Link>
            </div>
          </section>
        )}

        {/* Products */}
        {hasItems && (
          <section>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                  Saved for later
                </p>

                <h2 className="mt-1 text-xl font-black text-slate-950 sm:text-2xl">
                  Your Favorites
                </h2>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlistItems.map((product, index) => (
                <WishlistCard
                  key={
                    product.id ||
                    product._id ||
                    index
                  }
                  product={product}
                />
              ))}
            </div>
          </section>
        )}

        {/* Footer Note */}
        {hasItems && (
          <div className="mt-10 rounded-2xl border border-blue-100 bg-blue-50/70 px-5 py-4 text-center">
            <p className="text-sm font-medium text-blue-800">
              Your saved products are available on this device
              through ComputerHub's existing wishlist system.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}