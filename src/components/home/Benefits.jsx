"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Truck,
  BadgeCheck,
  RotateCcw,
  Headphones,
  CreditCard,
} from "lucide-react";

const benefits = [
  {
    icon: Truck,
    title: "Fast Delivery",
    description:
      "Get your technology products delivered quickly and safely.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Shopping",
    description:
      "Shop with confidence through a secure marketplace experience.",
  },
  {
    icon: BadgeCheck,
    title: "Genuine Products",
    description:
      "Discover quality products from trusted technology sellers.",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description:
      "Simple return support for eligible products and orders.",
  },
  {
    icon: Headphones,
    title: "Customer Support",
    description:
      "Our support team is here to help with your shopping journey.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description:
      "Your payment information is handled through secure checkout.",
  },
];

export default function Benefits() {
  return (
    <section className="bg-white py-16">
      <div className="container-main">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
            Why ComputerHub
          </p>

          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Technology shopping made easier
          </h2>

          <p className="mt-3 text-gray-500">
            Everything you need to shop for computers and technology with
            confidence.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.05,
                }}
                className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon size={24} />
                </div>

                <h3 className="mt-5 text-lg font-black text-slate-900">
                  {benefit.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Final CTA */}
        <div className="mt-12 overflow-hidden rounded-3xl bg-slate-950 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-black text-white sm:text-3xl">
            Ready to upgrade your setup?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-400">
            Browse laptops, PCs, components, monitors and accessories and
            find the technology that fits your needs.
          </p>

          <a
            href="/products"
            className="mt-7 inline-flex rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-blue-500"
          >
            Start Shopping
          </a>
        </div>
      </div>
    </section>
  );
}