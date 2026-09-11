"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartSummary() {
  const { cartItems, itemCount, subtotal } =
    useCart();

  const delivery =
    subtotal >= 500 || cartItems.length === 0
      ? 0
      : 15;

  const total = subtotal + delivery;

  return (
    <aside className="lg:sticky lg:top-24">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">
          Order Summary
        </h2>

        {/* Price Details */}
        <div className="mt-5 space-y-4 border-b border-gray-200 pb-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              Items ({itemCount})
            </span>

            <span className="font-medium text-gray-900">
              ${subtotal.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              Delivery
            </span>

            <span
              className={
                delivery === 0
                  ? "font-semibold text-green-600"
                  : "font-medium text-gray-900"
              }
            >
              {delivery === 0
                ? "FREE"
                : `$${delivery.toLocaleString()}`}
            </span>
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between py-5">
          <span className="text-base font-bold text-gray-900">
            Total
          </span>

          <span className="text-2xl font-bold text-gray-900">
            ${total.toLocaleString()}
          </span>
        </div>

        {/* Checkout */}
        <Link
          href="/checkout"
          className={`flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3.5 text-sm font-semibold transition ${
            cartItems.length > 0
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "pointer-events-none bg-gray-200 text-gray-400"
          }`}
          aria-disabled={cartItems.length === 0}
        >
          Proceed to Checkout
          <ArrowRight size={17} />
        </Link>

        {/* Benefits */}
        <div className="mt-6 space-y-4">
          <div className="flex items-start gap-3">
            <Truck
              size={19}
              className="mt-0.5 flex-shrink-0 text-green-600"
            />

            <div>
              <p className="text-sm font-semibold text-gray-800">
                Fast delivery
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Reliable delivery for eligible products.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShieldCheck
              size={19}
              className="mt-0.5 flex-shrink-0 text-blue-600"
            />

            <div>
              <p className="text-sm font-semibold text-gray-800">
                Secure shopping
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Your shopping experience is protected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}