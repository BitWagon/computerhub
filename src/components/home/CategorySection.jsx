"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Laptop,
  Monitor,
  Cpu,
  Gamepad2,
  Headphones,
  Mouse,
  ArrowUpRight,
  ShoppingBag,
} from "lucide-react";

const categories = [
  {
    title: "Laptops",
    description:
      "Business laptops, student notebooks, premium ultrabooks and powerful gaming laptops.",
    href: "/category/laptops",
    icon: Laptop,
    gradient: "from-blue-50 to-blue-100",
    iconBg: "bg-blue-600",
    points: [
      "Business laptops",
      "Student laptops",
      "Gaming laptops",
    ],
  },

  {
    title: "Desktop PCs",
    description:
      "Complete desktop computers for home, office, professional work and gaming.",
    href: "/category/desktops",
    icon: Monitor,
    gradient: "from-violet-50 to-violet-100",
    iconBg: "bg-violet-600",
    points: [
      "Office desktops",
      "Gaming PCs",
      "Workstations",
    ],
  },

  {
    title: "PC Components",
    description:
      "Upgrade your computer with processors, SSDs, graphics cards, memory and essential components.",
    href: "/category/components",
    icon: Cpu,
    gradient: "from-emerald-50 to-emerald-100",
    iconBg: "bg-emerald-600",
    points: [
      "Processors",
      "Graphics cards",
      "SSD & memory",
    ],
  },

  {
    title: "Monitors",
    description:
      "Find displays for office productivity, creative work, entertainment and competitive gaming.",
    href: "/category/monitors",
    icon: Monitor,
    gradient: "from-cyan-50 to-cyan-100",
    iconBg: "bg-cyan-600",
    points: [
      "4K monitors",
      "Gaming monitors",
      "Professional displays",
    ],
  },

  {
    title: "Gaming",
    description:
      "Gaming PCs, gaming laptops, high-refresh displays and peripherals for serious setups.",
    href: "/category/gaming",
    icon: Gamepad2,
    gradient: "from-red-50 to-red-100",
    iconBg: "bg-red-600",
    points: [
      "Gaming PCs",
      "Gaming laptops",
      "Gaming peripherals",
    ],
  },

  {
    title: "Accessories",
    description:
      "Complete your setup with keyboards, mice, headsets and other computer accessories.",
    href: "/category/accessories",
    icon: Headphones,
    gradient: "from-orange-50 to-orange-100",
    iconBg: "bg-orange-600",
    points: [
      "Keyboards",
      "Gaming mice",
      "Headsets",
    ],
  },
];

export default function CategorySection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-main">

        {/* HEADER */}

        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div className="max-w-3xl">

            <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              Explore ComputerHub
            </p>

            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Shop Computers & Technology
            </h2>

            <p className="mt-3 text-sm leading-7 text-gray-500 sm:text-base">
              Browse real computer products across laptops, desktop PCs,
              components, monitors, gaming equipment and accessories.
              Whether you are building a workstation, upgrading your PC,
              preparing a gaming setup or buying your first computer,
              ComputerHub keeps the main categories together in one place.
            </p>

          </div>

          <Link
            href="/products"
            className="inline-flex w-fit items-center gap-2 text-sm font-bold text-blue-600 transition hover:text-blue-700"
          >
            View all products
            <ArrowUpRight size={17} />
          </Link>

        </div>

        {/* CATEGORY GRID */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.div
                key={category.title}
                initial={{
                  opacity: 0,
                  y: 20,
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
                  duration: 0.45,
                  delay: index * 0.05,
                }}
              >

                <Link
                  href={category.href}
                  className={`group relative block h-full overflow-hidden rounded-2xl bg-gradient-to-br ${category.gradient} p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl`}
                >

                  {/* ICON */}

                  <div
                    className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${category.iconBg} text-white shadow-lg`}
                  >
                    <Icon size={27} />
                  </div>

                  {/* TITLE */}

                  <h3 className="text-xl font-black text-slate-900">
                    {category.title}
                  </h3>

                  {/* DESCRIPTION */}

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {category.description}
                  </p>

                  {/* POINTS */}

                  <div className="mt-5 space-y-2">

                    {category.points.map((point) => (
                      <div
                        key={point}
                        className="flex items-center gap-2 text-xs font-semibold text-gray-600"
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/80 text-blue-600">
                          ✓
                        </span>

                        {point}
                      </div>
                    ))}

                  </div>

                  {/* BOTTOM */}

                  <div className="mt-6 flex items-center justify-between border-t border-black/5 pt-4">

                    <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
                      <ShoppingBag size={16} />
                      Browse category
                    </span>

                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-gray-600 transition group-hover:bg-blue-600 group-hover:text-white">
                      <ArrowUpRight size={17} />
                    </span>

                  </div>

                </Link>

              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
}