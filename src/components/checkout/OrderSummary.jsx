"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Package, Truck } from "lucide-react";

export default function OrderSummary({
  cartItems,
  subtotal,
  delivery,
  total,
  onPlaceOrder,
  isPlacingOrder,
}) {
  return (
    <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Order Summary
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {cartItems.length}{" "}
            {cartItems.length === 1 ? "item" : "items"}
          </p>
        </div>

        <Package className="text-blue-600" size={24} />
      </div>

      <div className="max-h-[380px] space-y-4 overflow-y-auto pr-1">
        {cartItems.map((item) => {
          const image =
            item.images?.[0] ||
            "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=300&q=80";

          return (
            <div
              key={item.id}
              className="flex gap-3 border-b border-gray-100 pb-4"
            >
              <Link
                href={`/products/${item.id}`}
                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100"
              >
                <Image
                  src={image}
                  alt={item.name || "Product"}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </Link>

              <div className="min-w-0 flex-1">
                <Link
                  href={`/products/${item.id}`}
                  className="line-clamp-2 text-sm font-semibold text-gray-900 hover:text-blue-600"
                >
                  {item.name}
                </Link>

                <p className="mt-1 text-xs text-gray-500">
                  Quantity: {item.quantity}
                </p>

                <p className="mt-2 font-bold text-gray-900">
                  $
                  {(
                    Number(item.price || 0) *
                    Number(item.quantity || 0)
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 space-y-3 border-t border-gray-200 pt-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>

          <span className="font-semibold text-gray-900">
            ${subtotal.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-gray-600">
            <Truck size={16} />
            Delivery
          </span>

          <span className="font-semibold text-gray-900">
            {delivery === 0
              ? "FREE"
              : `$${delivery.toLocaleString()}`}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <span className="text-lg font-bold text-gray-900">
            Total
          </span>

          <span className="text-2xl font-bold text-blue-600">
            ${total.toLocaleString()}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onPlaceOrder}
        disabled={isPlacingOrder}
        className="mt-6 flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPlacingOrder ? "Processing..." : "Place Order"}
      </button>

      <Link
        href="/cart"
        className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
      >
        <ArrowLeft size={17} />
        Back to Cart
      </Link>

      <div className="mt-5 rounded-xl bg-gray-50 p-4 text-center">
        <p className="text-xs leading-5 text-gray-500">
          By placing your order, you agree to ComputerHub&apos;s
          terms and conditions.
        </p>
      </div>
    </div>
  );
}