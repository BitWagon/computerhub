"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Laptop,
  Monitor,
  Zap,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="hero-gradient relative overflow-hidden">
      <div className="container-main relative">
        <div className="grid min-h-[560px] items-center gap-12 py-14 lg:grid-cols-2 lg:py-20">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative z-10"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100 backdrop-blur">
              <Zap size={16} className="text-yellow-300" />
              Your Technology Marketplace
            </div>

            <h1 className="max-w-2xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Upgrade Your Tech.
              <span className="block text-blue-300">
                Power Your World.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-blue-100 sm:text-lg">
              Discover laptops, desktop PCs, components, monitors and gaming
              gear from trusted sellers — all in one place.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/category/laptops"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-slate-900 transition hover:bg-blue-50"
              >
                Shop Laptops
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/category/gaming"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                Explore Gaming
                <span>🎮</span>
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3">
              <div className="flex items-center gap-2 text-sm text-blue-100">
                <CheckCircle2
                  size={17}
                  className="text-emerald-300"
                />
                Genuine Products
              </div>

              <div className="flex items-center gap-2 text-sm text-blue-100">
                <CheckCircle2
                  size={17}
                  className="text-emerald-300"
                />
                Secure Checkout
              </div>

              <div className="flex items-center gap-2 text-sm text-blue-100">
                <CheckCircle2
                  size={17}
                  className="text-emerald-300"
                />
                Fast Delivery
              </div>
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative mx-auto w-full max-w-xl"
          >
            <div className="relative aspect-square">
              <div className="absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />

              <div className="absolute left-1/2 top-1/2 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />

              {/* Laptop */}
              <div className="absolute left-[12%] top-[20%] w-[76%] rotate-[-4deg]">
                <div className="relative rounded-2xl border border-white/30 bg-slate-900 p-3 shadow-2xl shadow-black/40">
                  <div className="flex aspect-[16/10] items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-slate-950">
                    <div className="text-center">
                      <Laptop
                        size={100}
                        strokeWidth={1}
                        className="mx-auto text-white/90"
                      />

                      <p className="mt-3 text-xs font-bold uppercase tracking-[0.3em] text-blue-100">
                        ComputerHub
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mx-auto h-3 w-[85%] rounded-b-xl bg-slate-500 shadow-xl" />
                <div className="mx-auto h-2 w-[35%] rounded-b-xl bg-slate-700" />
              </div>

              {/* CPU */}
              <div className="absolute bottom-[13%] left-[2%] flex h-24 w-24 rotate-6 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl">
                <Cpu size={48} className="text-blue-200" />
              </div>

              {/* Monitor */}
              <div className="absolute right-[1%] top-[12%] flex h-28 w-28 -rotate-6 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl">
                <Monitor size={54} className="text-blue-200" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}