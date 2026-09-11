"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";

import ProductCard from "@/components/products/ProductCard";

const products = [
  {
    id: 1,
    name: "Dell Inspiron 15 Laptop - Intel Core i5, 8GB RAM, 512GB SSD",
    image:
      "https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf?auto=format&fit=crop&w=900&q=80",
    price: 699,
    oldPrice: 799,
    discount: 13,
    rating: 4.6,
    reviews: 124,
    seller: "ComputerHub Store",
    category: "Laptops",
    brand: "Dell",
    freeDelivery: true,
  },
  {
    id: 2,
    name: "HP Pavilion Gaming Laptop - Core i7, 16GB RAM, 1TB SSD",
    image:
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=900&q=80",
    price: 1099,
    oldPrice: 1249,
    discount: 12,
    rating: 4.8,
    reviews: 89,
    seller: "Tech World",
    category: "Laptops",
    brand: "HP",
    freeDelivery: true,
  },
  {
    id: 3,
    name: "Lenovo ThinkPad Business Laptop - Core i5, 16GB RAM",
    image:
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=900&q=80",
    price: 849,
    oldPrice: 949,
    discount: 11,
    rating: 4.7,
    reviews: 76,
    seller: "Laptop Center",
    category: "Laptops",
    brand: "Lenovo",
    freeDelivery: true,
  },
  {
    id: 4,
    name: "Apple MacBook Air M3 - 13-inch, 16GB RAM, 512GB SSD",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
    price: 1299,
    oldPrice: 1399,
    discount: 7,
    rating: 4.9,
    reviews: 215,
    seller: "Apple Technology Store",
    category: "Laptops",
    brand: "Apple",
    freeDelivery: true,
  },
  {
    id: 5,
    name: "ASUS ROG Gaming Desktop PC - Ryzen 7, 32GB RAM, RTX Graphics",
    image:
      "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=900&q=80",
    price: 1599,
    oldPrice: 1799,
    discount: 11,
    rating: 4.8,
    reviews: 94,
    seller: "Gaming Zone",
    category: "Desktops",
    brand: "ASUS",
    freeDelivery: true,
  },
  {
    id: 6,
    name: "MSI Gaming Desktop - Intel Core i7, 32GB RAM, RTX 4070",
    image:
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=900&q=80",
    price: 1899,
    oldPrice: 2099,
    discount: 10,
    rating: 4.7,
    reviews: 67,
    seller: "PC Masters",
    category: "Desktops",
    brand: "MSI",
    freeDelivery: true,
  },
  {
    id: 7,
    name: "Samsung 27-inch 4K UHD Monitor",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80",
    price: 399,
    oldPrice: 469,
    discount: 15,
    rating: 4.5,
    reviews: 143,
    seller: "Display Store",
    category: "Monitors",
    brand: "Samsung",
    freeDelivery: true,
  },
  {
    id: 8,
    name: "Acer 24-inch Gaming Monitor 165Hz",
    image:
      "https://images.unsplash.com/photo-1616763355548-1b606f439f86?auto=format&fit=crop&w=900&q=80",
    price: 279,
    oldPrice: 329,
    discount: 15,
    rating: 4.4,
    reviews: 98,
    seller: "Gaming Zone",
    category: "Monitors",
    brand: "Acer",
    freeDelivery: true,
  },
  {
    id: 9,
    name: "Corsair 32GB DDR5 RAM Kit",
    image:
      "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=900&q=80",
    price: 119,
    oldPrice: 149,
    discount: 20,
    rating: 4.8,
    reviews: 187,
    seller: "PC Components Hub",
    category: "PC Components",
    brand: "Corsair",
    freeDelivery: true,
  },
  {
    id: 10,
    name: "Samsung 1TB NVMe SSD",
    image:
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=900&q=80",
    price: 89,
    oldPrice: 109,
    discount: 18,
    rating: 4.9,
    reviews: 241,
    seller: "Storage World",
    category: "PC Components",
    brand: "Samsung",
    freeDelivery: true,
  },
  {
    id: 11,
    name: "ASUS Mechanical Gaming Keyboard RGB",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80",
    price: 79,
    oldPrice: 99,
    discount: 20,
    rating: 4.6,
    reviews: 154,
    seller: "Gaming Accessories",
    category: "Accessories",
    brand: "ASUS",
    freeDelivery: true,
  },
  {
    id: 12,
    name: "Logitech Wireless Gaming Mouse",
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80",
    price: 59,
    oldPrice: 79,
    discount: 25,
    rating: 4.7,
    reviews: 203,
    seller: "Gaming Accessories",
    category: "Accessories",
    brand: "Logitech",
    freeDelivery: true,
  },
];

export default function SearchPage() {
  const searchParams = useSearchParams();

  const searchQuery =
    searchParams.get("q")?.trim().toLowerCase() || "";

  const results = products.filter((product) => {
    if (!searchQuery) {
      return true;
    }

    const searchableText = `
      ${product.name}
      ${product.category}
      ${product.brand}
      ${product.seller}
    `.toLowerCase();

    return searchableText.includes(searchQuery);
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-blue-600">
            <Search size={20} />

            <span className="text-sm font-semibold">
              ComputerHub Search
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">
            {searchQuery
              ? `Search results for "${searchParams.get("q")}"`
              : "Search Products"}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {results.length} product
            {results.length !== 1 ? "s" : ""} found
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {results.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Search
                size={28}
                className="text-gray-400"
              />
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900">
              No products found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              We couldn't find any products matching your
              search. Try another keyword such as laptop,
              gaming, Dell, SSD or monitor.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}