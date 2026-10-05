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
    <section className="relative overflow-hidden bg-slate-950">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_45%,rgba(37,99,235,0.35),transparent_38%),radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.16),transparent_30%)]" />

      <div className="absolute right-[-8%] top-[-20%] h-[500px] w-[500px] rounded-full border border-blue-400/10" />
      <div className="absolute right-[4%] top-[-8%] h-[360px] w-[360px] rounded-full border border-blue-400/10" />

      <div className="container-main relative">
        <div className="grid min-h-[620px] items-center gap-12 py-14 lg:grid-cols-2 lg:py-20">

          {/* LEFT */}
          <motion.div
            initial={{
              opacity: 0,
              x: -30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            className="relative z-10"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-300">
              <Zap
                size={15}
                className="text-yellow-300"
              />

              ComputerHub Marketplace
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Technology
              <span className="block text-blue-400">
                Built for You.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Discover laptops, PCs, components, monitors and accessories for
              work, gaming and everyday performance.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-blue-50"
              >
                Shop Technology
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/category/gaming"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Explore Gaming
                <span>🎮</span>
              </Link>
            </div>

            <div className="mt-9 grid gap-3 sm:grid-cols-3">
              <TrustPoint text="Quality Products" />

              <TrustPoint text="Secure Checkout" />

              <TrustPoint text="Fast Delivery" />
            </div>
          </motion.div>

          {/* RIGHT VISUAL */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.92,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.8,
              delay: 0.1,
            }}
            className="relative mx-auto w-full max-w-xl"
          >
            <div className="relative aspect-square">

              {/* Glow */}
              <div className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/20 blur-3xl" />

              {/* Laptop */}
              <div className="absolute left-[8%] top-[18%] w-[82%] rotate-[-4deg]">
                <div className="relative rounded-2xl border border-white/20 bg-slate-900 p-3 shadow-2xl shadow-black/50">

                  <div className="flex aspect-[16/10] items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-slate-950">

                    <div className="text-center">
                      <Laptop
                        size={92}
                        strokeWidth={1.1}
                        className="mx-auto text-white/90"
                      />

                      <p className="mt-4 text-xs font-bold uppercase tracking-[0.35em] text-blue-100">
                        ComputerHub
                      </p>
                    </div>

                  </div>
                </div>

                <div className="mx-auto h-3 w-[86%] rounded-b-xl bg-slate-500 shadow-xl" />

                <div className="mx-auto h-2 w-[34%] rounded-b-xl bg-slate-700" />
              </div>

              {/* CPU */}
              <div className="absolute bottom-[11%] left-[1%] flex h-24 w-24 rotate-6 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-2xl backdrop-blur-xl">
                <Cpu
                  size={46}
                  className="text-blue-200"
                />
              </div>

              {/* Monitor */}
              <div className="absolute right-[0%] top-[10%] flex h-28 w-28 -rotate-6 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-2xl backdrop-blur-xl">
                <Monitor
                  size={52}
                  className="text-blue-200"
                />
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

function TrustPoint({ text }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-300">
      <CheckCircle2
        size={17}
        className="shrink-0 text-emerald-400"
      />

      <span>{text}</span>
    </div>
  );
}