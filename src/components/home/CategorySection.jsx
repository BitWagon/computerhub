"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Laptop,
  Monitor,
  Cpu,
  HardDrive,
  Keyboard,
  Mouse,
  Gamepad2,
  ArrowUpRight,
} from "lucide-react";

const categories = [
  {
    title: "Laptops",
    description: "Work, study & everyday computing",
    href: "/category/laptops",
    icon: Laptop,
    gradient: "from-blue-50 to-blue-100",
    iconBg: "bg-blue-600",
  },
  {
    title: "Desktop PCs",
    description: "Powerful setups for every need",
    href: "/category/desktops",
    icon: Monitor,
    gradient: "from-violet-50 to-violet-100",
    iconBg: "bg-violet-600",
  },
  {
    title: "PC Components",
    description: "Build and upgrade your PC",
    href: "/category/components",
    icon: Cpu,
    gradient: "from-emerald-50 to-emerald-100",
    iconBg: "bg-emerald-600",
  },
  {
    title: "Monitors",
    description: "Gaming, office & professional",
    href: "/category/monitors",
    icon: Monitor,
    gradient: "from-cyan-50 to-cyan-100",
    iconBg: "bg-cyan-600",
  },
  {
    title: "Storage",
    description: "SSD, HDD & external storage",
    href: "/category/storage",
    icon: HardDrive,
    gradient: "from-amber-50 to-amber-100",
    iconBg: "bg-amber-600",
  },
  {
    title: "Keyboards",
    description: "Mechanical & everyday keyboards",
    href: "/category/keyboards",
    icon: Keyboard,
    gradient: "from-pink-50 to-pink-100",
    iconBg: "bg-pink-600",
  },
  {
    title: "Mice",
    description: "Precision for work & gaming",
    href: "/category/mice",
    icon: Mouse,
    gradient: "from-sky-50 to-sky-100",
    iconBg: "bg-sky-600",
  },
  {
    title: "Gaming",
    description: "Gear up for your next level",
    href: "/category/gaming",
    icon: Gamepad2,
    gradient: "from-red-50 to-red-100",
    iconBg: "bg-red-600",
  },
];

export default function CategorySection() {
  return (
    <section className="bg-white py-16">
      <div className="container-main">
        <div className="mb-9 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              Explore ComputerHub
            </p>

            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Shop by Category
            </h2>

            <p className="mt-2 max-w-2xl text-gray-500">
              Find exactly what you need for work, gaming, study or your
              personal setup.
            </p>
          </div>

          <Link
            href="/products"
            className="hidden items-center gap-1 text-sm font-bold text-blue-600 sm:flex"
          >
            View all
            <ArrowUpRight size={17} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.04,
                }}
              >
                <Link
                  href={category.href}
                  className={`group relative block overflow-hidden rounded-2xl bg-gradient-to-br ${category.gradient} p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl`}
                >
                  <div
                    className={`mb-7 flex h-12 w-12 items-center justify-center rounded-xl ${category.iconBg} text-white shadow-lg`}
                  >
                    <Icon size={24} />
                  </div>

                  <h3 className="text-lg font-black text-slate-900">
                    {category.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    {category.description}
                  </p>

                  <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-gray-500 opacity-0 transition group-hover:opacity-100">
                    <ArrowUpRight size={15} />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <Link
          href="/products"
          className="mt-5 flex items-center justify-center gap-1 text-sm font-bold text-blue-600 sm:hidden"
        >
          View all products
          <ArrowUpRight size={17} />
        </Link>
      </div>
    </section>
  );
}