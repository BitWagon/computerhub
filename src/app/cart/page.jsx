"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ShoppingCart,
  Trash2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { useCart } from "@/context/CartContext";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import EmptyCart from "@/components/cart/EmptyCart";

export default function CartPage() {
  const {
    cartItems,
    itemCount,
    clearCart,
    isLoaded,
  } = useCart();

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="container-main flex min-h-[70vh] items-center justify-center">
          <div className="rounded-2xl border border-slate-200 bg-white px-10 py-8 text-center shadow-sm">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm font-medium text-slate-600">
              Loading your cart...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
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
              Cart
            </span>
          </div>

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50 to-white px-6 py-7 sm:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100">
                  <ShoppingCart
                    size={22}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                    ComputerHub
                  </p>

                  <h1 className="text-2xl font-black text-slate-950">
                    Shopping Cart
                  </h1>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <EmptyCart />
            </div>
          </section>
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
            Cart
          </span>
        </div>

        {/* Header */}
        <section className="mb-7 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="relative p-6 sm:p-8">

            <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-blue-50 blur-3xl" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
                    <ShoppingCart
                      size={24}
                      className="text-blue-600"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                      Your selection
                    </p>

                    <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                      Shopping Cart
                    </h1>
                  </div>
                </div>

                <p className="mt-3 text-sm text-slate-500">
                  {itemCount}{" "}
                  {itemCount === 1 ? "item" : "items"}{" "}
                  ready for checkout.
                </p>
              </div>

              <button
                type="button"
                onClick={clearCart}
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
              >
                <Trash2 size={17} />
                Clear Cart
              </button>
            </div>
          </div>

          <div className="grid border-t border-slate-100 sm:grid-cols-3">
            <div className="px-6 py-4 sm:border-r sm:border-slate-100">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Items
              </p>

              <p className="mt-1 text-lg font-black text-slate-950">
                {itemCount}
              </p>
            </div>

            <div className="border-t border-slate-100 px-6 py-4 sm:border-t-0 sm:border-r">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Checkout
              </p>

              <p className="mt-1 text-sm font-bold text-slate-900">
                Secure & simple
              </p>
            </div>

            <div className="border-t border-slate-100 px-6 py-4 sm:border-t-0">
              <div className="flex items-center gap-2">
                <ShieldCheck
                  size={17}
                  className="text-emerald-600"
                />

                <p className="text-sm font-bold text-slate-900">
                  Protected
                </p>
              </div>

              <p className="mt-1 text-xs text-slate-500">
                ComputerHub checkout
              </p>
            </div>
          </div>
        </section>

        {/* Cart */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                  Cart details
                </p>

                <h2 className="mt-1 text-lg font-black text-slate-950">
                  Your Items
                </h2>
              </div>

              <div className="hidden items-center gap-2 text-xs font-semibold text-slate-500 sm:flex">
                <Sparkles size={15} />
                Ready to checkout
              </div>
            </div>

            <div>
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                />
              ))}
            </div>
          </section>

          {/* Existing summary component */}
          <div>
            <CartSummary />
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="mt-7">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}