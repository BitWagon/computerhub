"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart,
  ShoppingCart,
  Star,
  ArrowRight,
} from "lucide-react";

const products = [
  {
    id: 101,
    name: "Business Pro Laptop 15",
    description: "15.6″ Full HD • 16GB • 512GB SSD",
    price: "$749",
    oldPrice: "$849",
    rating: "4.8",
    reviews: "124",
    badge: "Best Seller",
    image: "💻",
    background: "from-blue-100 to-blue-200",
  },
  {
    id: 102,
    name: "Creator Laptop X14",
    description: "14″ Display • 16GB • 1TB SSD",
    price: "$1,099",
    oldPrice: "$1,249",
    rating: "4.9",
    reviews: "87",
    badge: "Top Rated",
    image: "💻",
    background: "from-purple-100 to-violet-200",
  },
  {
    id: 103,
    name: "UltraBook Air 14",
    description: "14″ • 16GB RAM • 512GB SSD",
    price: "$899",
    oldPrice: "$999",
    rating: "4.7",
    reviews: "203",
    badge: "Popular",
    image: "💻",
    background: "from-cyan-100 to-sky-200",
  },
  {
    id: 104,
    name: "Gaming Laptop RTX",
    description: "15.6″ 144Hz • 16GB • RTX Graphics",
    price: "$1,299",
    oldPrice: "$1,499",
    rating: "4.9",
    reviews: "156",
    badge: "Gaming",
    image: "🎮",
    background: "from-red-100 to-orange-200",
  },
];

export default function FeaturedProducts() {
  return (
    <section className="bg-white py-16">
      <div className="container-main">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              Recommended For You
            </p>

            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Featured Laptops
            </h2>

            <p className="mt-2 text-gray-500">
              Popular laptops selected for performance, reliability and value.
            </p>
          </div>

          <Link
            href="/category/laptops"
            className="hidden items-center gap-2 text-sm font-bold text-blue-600 sm:flex"
          >
            See all laptops
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.45,
                delay: index * 0.05,
              }}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative">
                <Link href={`/product/${product.id}`}>
                  <div
                    className={`flex aspect-square items-center justify-center bg-gradient-to-br ${product.background}`}
                  >
                    <div className="text-center transition duration-300 group-hover:scale-105">
                      <div className="text-7xl">
                        {product.image}
                      </div>

                      <p className="mt-3 text-xs font-bold uppercase tracking-widest text-slate-600/60">
                        ComputerHub
                      </p>
                    </div>
                  </div>
                </Link>

                <span className="absolute left-3 top-3 rounded-lg bg-slate-900 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white">
                  {product.badge}
                </span>

                <button
                  type="button"
                  aria-label="Add to wishlist"
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-600 shadow-md transition hover:bg-red-50 hover:text-red-500"
                >
                  <Heart size={17} />
                </button>
              </div>

              <div className="p-4">
                <Link href={`/product/${product.id}`}>
                  <h3 className="min-h-[48px] text-sm font-bold leading-6 text-slate-900 transition group-hover:text-blue-600">
                    {product.name}
                  </h3>
                </Link>

                <p className="mt-1 text-xs text-gray-500">
                  {product.description}
                </p>

                <div className="mt-3 flex items-center gap-1">
                  <Star
                    size={14}
                    fill="currentColor"
                    className="text-yellow-400"
                  />

                  <span className="text-xs font-bold text-gray-800">
                    {product.rating}
                  </span>

                  <span className="text-xs text-gray-400">
                    ({product.reviews})
                  </span>
                </div>

                <div className="mt-3 flex items-end gap-2">
                  <span className="text-xl font-black text-slate-900">
                    {product.price}
                  </span>

                  <span className="text-xs text-gray-400 line-through">
                    {product.oldPrice}
                  </span>
                </div>

                <button
                  type="button"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-600 py-2.5 text-sm font-bold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-7 text-center sm:hidden">
          <Link
            href="/category/laptops"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600"
          >
            See all laptops
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}