"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Laptop, Monitor } from "lucide-react";

const brands = [
  {
    name: "Lenovo",
    letters: "L",
    description: "Business & everyday",
  },
  {
    name: "Dell",
    letters: "D",
    description: "Professional computing",
  },
  {
    name: "HP",
    letters: "HP",
    description: "Work & home",
  },
  {
    name: "ASUS",
    letters: "A",
    description: "Gaming & performance",
  },
  {
    name: "Acer",
    letters: "AC",
    description: "Value & performance",
  },
  {
    name: "MSI",
    letters: "M",
    description: "Gaming & creators",
  },
  {
    name: "Apple",
    letters: "",
    description: "Premium computing",
  },
  {
    name: "Samsung",
    letters: "S",
    description: "Displays & technology",
  },
];

export default function PopularBrands() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="container-main">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              Trusted Technology
            </p>

            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Popular Brands
            </h2>

            <p className="mt-2 text-gray-500">
              Explore products from some of the world's most recognized
              technology brands.
            </p>
          </div>

          <Link
            href="/brands"
            className="hidden items-center gap-2 text-sm font-bold text-blue-600 sm:flex"
          >
            View all brands
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: index * 0.04,
              }}
            >
              <Link
                href={`/search?brand=${encodeURIComponent(brand.name)}`}
                className="group flex min-h-[145px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-4 text-center transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-xl font-black text-slate-800 transition group-hover:bg-blue-600 group-hover:text-white">
                  {brand.letters}
                </div>

                <h3 className="mt-4 text-sm font-black text-slate-900">
                  {brand.name}
                </h3>

                <p className="mt-1 text-[10px] text-gray-400">
                  {brand.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Small technology highlight */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-5 rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Laptop size={28} />
            </div>

            <div>
              <h3 className="font-black text-slate-900">
                Find your next laptop
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Compare options for business, study, gaming and everyday use.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5 rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <Monitor size={28} />
            </div>

            <div>
              <h3 className="font-black text-slate-900">
                Build your perfect setup
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Discover monitors, components and accessories for your desk.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}