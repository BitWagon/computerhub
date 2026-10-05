"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Truck,
  Headphones,
  CreditCard,
  Laptop,
  Mail,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      {/* CTA */}
      <div className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-400">
              ComputerHub
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Upgrade your setup with confidence.
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Shop laptops, desktops, components, gaming hardware and
              accessories from ComputerHub.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Shop products
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-3"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                <Laptop size={22} />
              </span>

              <span className="text-xl font-bold tracking-tight text-white">
                Computer<span className="text-blue-500">Hub</span>
              </span>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-6 text-slate-400">
              Your trusted destination for modern computing technology,
              performance hardware and everyday tech essentials.
            </p>

            <div className="mt-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                Follow ComputerHub
              </p>

              <div className="flex items-center gap-3">
                {/* Instagram */}
                <a
                  href="#"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-sm font-bold text-slate-400 transition hover:bg-pink-500 hover:text-white"
                >
                  IG
                </a>

                {/* Facebook */}
                <a
                  href="#"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-sm font-bold text-slate-400 transition hover:bg-blue-600 hover:text-white"
                >
                  f
                </a>

                {/* Twitter / X */}
                <a
                  href="#"
                  aria-label="Twitter"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-sm font-bold text-slate-400 transition hover:bg-sky-500 hover:text-white"
                >
                  𝕏
                </a>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-bold text-white">Shop</h3>

            <div className="mt-4 space-y-3 text-sm">
              <Link
                href="/products"
                className="block transition hover:text-white"
              >
                All Products
              </Link>

              <Link
                href="/category/laptops"
                className="block transition hover:text-white"
              >
                Laptops
              </Link>

              <Link
                href="/category/desktops"
                className="block transition hover:text-white"
              >
                Desktops
              </Link>

              <Link
                href="/category/components"
                className="block transition hover:text-white"
              >
                Components
              </Link>

              <Link
                href="/category/gaming"
                className="block transition hover:text-white"
              >
                Gaming
              </Link>
            </div>
          </div>

          {/* Customer */}
          <div>
            <h3 className="text-sm font-bold text-white">Customer</h3>

            <div className="mt-4 space-y-3 text-sm">
              <Link
                href="/account"
                className="block transition hover:text-white"
              >
                My Account
              </Link>

              <Link
                href="/orders"
                className="block transition hover:text-white"
              >
                Orders
              </Link>

              <Link
                href="/wishlist"
                className="block transition hover:text-white"
              >
                Wishlist
              </Link>

              <Link
                href="/cart"
                className="block transition hover:text-white"
              >
                Cart
              </Link>

              <Link
                href="/faq"
                className="block transition hover:text-white"
              >
                FAQ
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-bold text-white">Company</h3>

            <div className="mt-4 space-y-3 text-sm">
              <Link
                href="/about"
                className="block transition hover:text-white"
              >
                About Us
              </Link>

              <Link
                href="/contact"
                className="block transition hover:text-white"
              >
                Contact
              </Link>

              <Link
                href="/privacy"
                className="block transition hover:text-white"
              >
                Privacy
              </Link>

              <Link
                href="/terms"
                className="block transition hover:text-white"
              >
                Terms
              </Link>

              <Link
                href="/cookies"
                className="block transition hover:text-white"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>

        {/* Trust features */}
        <div className="mt-12 grid gap-4 border-t border-slate-800 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
              <ShieldCheck size={19} className="text-blue-400" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Secure shopping
              </p>
              <p className="text-xs text-slate-500">
                Protected checkout
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
              <Truck size={19} className="text-blue-400" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Fast delivery
              </p>
              <p className="text-xs text-slate-500">
                Reliable order handling
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
              <Headphones size={19} className="text-blue-400" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Customer support
              </p>
              <p className="text-xs text-slate-500">
                Help when you need it
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
              <CreditCard size={19} className="text-blue-400" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Easy checkout
              </p>
              <p className="text-xs text-slate-500">
                Simple and convenient
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-white/[0.02] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <Mail size={18} className="text-blue-400" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Need help?
              </p>

              <p className="text-xs text-slate-500">
                Our support team is ready to assist.
              </p>
            </div>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 transition hover:text-blue-300"
          >
            Contact us
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>
            © {new Date().getFullYear()} ComputerHub. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/privacy"
              className="transition hover:text-white"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="transition hover:text-white"
            >
              Terms
            </Link>

            <Link
              href="/cookies"
              className="transition hover:text-white"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}