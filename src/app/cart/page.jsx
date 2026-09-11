"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ShoppingCart,
  Trash2,
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
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />

            <p className="mt-4 text-sm text-gray-500">
              Loading your cart...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <Link
              href="/"
              className="transition hover:text-blue-600"
            >
              Home
            </Link>

            <span>/</span>

            <span className="font-medium text-gray-700">
              Cart
            </span>
          </div>

          <EmptyCart />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
              <Link
                href="/"
                className="transition hover:text-blue-600"
              >
                Home
              </Link>

              <span>/</span>

              <span className="font-medium text-gray-700">
                Cart
              </span>
            </div>

            <div className="flex items-center gap-3">
              <ShoppingCart
                size={28}
                className="text-blue-600"
              />

              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                Shopping Cart
              </h1>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              {itemCount}{" "}
              {itemCount === 1
                ? "item"
                : "items"}{" "}
              in your cart
            </p>
          </div>

          {/* Clear Cart */}
          <button
            type="button"
            onClick={clearCart}
            className="flex w-fit items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={16} />
            Clear Cart
          </button>
        </div>

        {/* Cart Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          {/* Items */}
          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-4">
              <h2 className="font-bold text-gray-900">
                Cart Items
              </h2>
            </div>

            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
              />
            ))}
          </section>

          {/* Summary */}
          <CartSummary />
        </div>

        {/* Continue Shopping */}
        <div className="mt-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            <ArrowLeft size={17} />
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}