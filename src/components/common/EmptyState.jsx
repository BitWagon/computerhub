"use client";

import Link from "next/link";
import { Package, ShoppingCart, Heart, ClipboardList } from "lucide-react";

const icons = {
  products: Package,
  cart: ShoppingCart,
  wishlist: Heart,
  orders: ClipboardList,
  default: Package,
};

export default function EmptyState({
  type = "default",
  title = "Nothing here yet",
  description = "There's nothing to display right now.",
  buttonText,
  buttonHref = "/",
}) {
  const Icon = icons[type] || icons.default;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
        <Icon size={36} className="text-blue-600" />
      </div>

      <h2 className="mt-6 text-2xl font-bold text-gray-900">
        {title}
      </h2>

      <p className="mx-auto mt-3 max-w-md text-gray-500">
        {description}
      </p>

      {buttonText && (
        <Link
          href={buttonHref}
          className="mt-7 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          {buttonText}
        </Link>
      )}
    </div>
  );
}