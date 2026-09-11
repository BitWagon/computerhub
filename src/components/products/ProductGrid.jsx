"use client";

import { PackageSearch } from "lucide-react";
import ProductCard from "./ProductCard";

export default function ProductGrid({
  products = [],
}) {
  if (!products.length) {
    return (
      <div className="flex min-h-[350px] flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <PackageSearch
            size={30}
            className="text-gray-400"
          />
        </div>

        <h3 className="text-lg font-bold text-gray-900">
          No products found
        </h3>

        <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
          We could not find any products matching your
          current filters. Try removing a filter or changing
          your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}