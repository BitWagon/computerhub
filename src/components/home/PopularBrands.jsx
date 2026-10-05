"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Laptop,
  Monitor,
  Cpu,
  Gamepad2,
  Headphones,
  HardDrive,
} from "lucide-react";

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
    letters: "A",
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
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className="container-main">

        <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
              Popular Brands
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Shop Brands You Know
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Explore products from leading names across computing and
              technology.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 transition hover:text-blue-700"
          >
            Browse products
            <ArrowRight size={17} />
          </Link>

        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">

          {brands.map(
            (brand, index) => (
              <motion.div
                key={brand.name}
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.35,
                  delay:
                    index * 0.03,
                }}
              >
                <Link
                  href={`/search?brand=${encodeURIComponent(
                    brand.name
                  )}`}
                  className="group flex min-h-[140px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 text-center transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-lg font-black text-slate-800 transition group-hover:bg-blue-600 group-hover:text-white">
                    {brand.letters}
                  </div>

                  <h3 className="mt-4 text-sm font-black text-slate-950">
                    {brand.name}
                  </h3>

                  <p className="mt-1 text-[10px] text-slate-400">
                    {brand.description}
                  </p>
                </Link>
              </motion.div>
            )
          )}

        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">

          <Highlight
            icon={Laptop}
            title="Find your laptop"
            text="Compare options for work, study, gaming and everyday use."
            href="/category/laptops"
          />

          <Highlight
            icon={Cpu}
            title="Upgrade your PC"
            text="Discover processors, graphics, memory and storage."
            href="/category/components"
          />

          <Highlight
            icon={Gamepad2}
            title="Build your setup"
            text="Complete your desk with gaming and computer accessories."
            href="/category/gaming"
          />

        </div>

      </div>
    </section>
  );
}

function Highlight({
  icon: Icon,
  title,
  text,
  href,
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
        <Icon size={23} />
      </div>

      <div>
        <h3 className="font-black text-slate-950">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {text}
        </p>
      </div>
    </Link>
  );
}