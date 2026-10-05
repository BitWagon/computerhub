"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Laptop,
  Monitor,
  Cpu,
  Gamepad2,
  Headphones,
  HardDrive,
  ArrowUpRight,
} from "lucide-react";

const categories = [
  {
    title: "Laptops",
    description: "Portable performance for work, study and everyday use.",
    href: "/category/laptops",
    icon: Laptop,
  },
  {
    title: "Desktop PCs",
    description: "Powerful systems for productivity, business and gaming.",
    href: "/category/desktops",
    icon: Monitor,
  },
  {
    title: "Components",
    description: "Build or upgrade your PC with essential hardware.",
    href: "/category/components",
    icon: Cpu,
  },
  {
    title: "Monitors",
    description: "Clear, fast displays for work, creativity and gaming.",
    href: "/category/monitors",
    icon: Monitor,
  },
  {
    title: "Gaming",
    description: "Performance hardware and gear for your gaming setup.",
    href: "/category/gaming",
    icon: Gamepad2,
  },
  {
    title: "Accessories",
    description: "Keyboards, mice, headsets and everyday essentials.",
    href: "/category/accessories",
    icon: Headphones,
  },
  {
    title: "Storage",
    description: "SSD and storage solutions for speed and capacity.",
    href: "/category/storage",
    icon: HardDrive,
  },
];

export default function CategorySection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-main">

        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
              Explore
            </p>

            <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Shop by Category
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Find the right technology for your setup, your work and your
              everyday needs.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 transition hover:text-blue-700"
          >
            View all products
            <ArrowUpRight size={17} />
          </Link>

        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

          {categories.map(
            (category, index) => {
              const Icon = category.icon;

              return (
                <motion.div
                  key={category.title}
                  initial={{
                    opacity: 0,
                    y: 18,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.15,
                  }}
                  transition={{
                    duration: 0.4,
                    delay:
                      index * 0.04,
                  }}
                >
                  <Link
                    href={category.href}
                    className="group block h-full rounded-2xl border border-slate-200 bg-slate-50 p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-xl"
                  >

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm ring-1 ring-slate-200 transition group-hover:bg-blue-600 group-hover:text-white group-hover:ring-blue-600">
                      <Icon size={23} />
                    </div>

                    <h3 className="mt-6 text-lg font-black text-slate-950">
                      {category.title}
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {category.description}
                    </p>

                    <div className="mt-5 flex items-center gap-1 text-xs font-bold text-blue-600 opacity-0 transition group-hover:opacity-100">
                      Explore
                      <ArrowUpRight size={14} />
                    </div>

                  </Link>
                </motion.div>
              );
            }
          )}

        </div>
      </div>
    </section>
  );
}