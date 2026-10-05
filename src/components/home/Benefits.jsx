"use client";

import { motion } from "framer-motion";

import {
  ShieldCheck,
  Truck,
  BadgeCheck,
  RotateCcw,
  Headphones,
  CreditCard,
  ArrowRight,
} from "lucide-react";

import Link from "next/link";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Secure Shopping",
    description:
      "A protected shopping experience from product discovery to checkout.",
  },
  {
    icon: BadgeCheck,
    title: "Quality Products",
    description:
      "Browse technology products from sellers across the marketplace.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description:
      "Get your technology delivered quickly and safely.",
  },
  {
    icon: CreditCard,
    title: "Secure Checkout",
    description:
      "Complete your order through a simple and secure checkout flow.",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description:
      "Return support is available for eligible products and orders.",
  },
  {
    icon: Headphones,
    title: "Customer Support",
    description:
      "Get help when you need it throughout your shopping journey.",
  },
];

export default function Benefits() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-main">

        <div className="mx-auto mb-10 max-w-2xl text-center">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
            Why ComputerHub
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            A better way to shop technology
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
            Everything you need to discover, compare and buy technology with
            confidence.
          </p>

        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {benefits.map(
            (benefit, index) => {
              const Icon =
                benefit.icon;

              return (
                <motion.div
                  key={
                    benefit.title
                  }
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
                  className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                >

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={23} />
                  </div>

                  <h3 className="mt-5 text-lg font-black text-slate-950">
                    {benefit.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {
                      benefit.description
                    }
                  </p>

                </motion.div>
              );
            }
          )}

        </div>

        <div className="mt-12 overflow-hidden rounded-3xl bg-slate-950 px-7 py-10 sm:px-10 sm:py-12">

          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

            <div className="max-w-2xl">

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
                Ready when you are
              </p>

              <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                Find the technology that fits your setup.
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Explore laptops, PCs, components, monitors and accessories in
                one marketplace.
              </p>

            </div>

            <Link
              href="/products"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-500"
            >
              Browse Products
              <ArrowRight size={17} />
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
}