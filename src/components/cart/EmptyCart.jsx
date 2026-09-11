"use client";

import Link from "next/link";
import { ArrowRight, ShoppingCart } from "lucide-react";

export default function EmptyCart() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
        <ShoppingCart
          size={36}
          className="text-blue-600"
        />
      </div>

      <h1 className="mt-6 text-2xl font-bold text-gray-900">
        Your cart is empty
      </h1>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
        You haven't added any products to your cart yet.
        Explore ComputerHub and find the technology you
        need.
      </p>

      <Link
        href="/products"
        className="mt-7 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        Start Shopping
        <ArrowRight size={17} />
      </Link>
    </div>
  );
}