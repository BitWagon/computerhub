"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  User,
  Laptop,
  Monitor,
  Cpu,
  Gamepad2,
  Headphones,
  Tag,
  Menu,
} from "lucide-react";

import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        {/* Top bar */}
        <div className="hidden bg-slate-950 text-white md:block">
          <div className="container-main flex h-9 items-center justify-between text-xs">
            <p>
              Welcome to ComputerHub — your technology marketplace
            </p>

            <div className="flex items-center gap-5 text-gray-300">
              <span>Fast Delivery</span>
              <span>Secure Payments</span>
              <span>Genuine Products</span>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="container-main flex h-[72px] items-center gap-3 sm:gap-5">
          {/* Mobile menu */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2"
            onClick={() => setMobileOpen(false)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <Laptop size={22} strokeWidth={2.3} />
            </div>

            <div className="leading-none">
              <div className="text-xl font-black tracking-tight text-slate-900">
                Computer<span className="text-blue-600">Hub</span>
              </div>

              <div className="mt-1 hidden text-[9px] font-bold uppercase tracking-[0.16em] text-gray-400 sm:block">
                Technology Marketplace
              </div>
            </div>
          </Link>

          {/* Search */}
          <div className="hidden flex-1 md:block">
            <form
              action="/search"
              className="mx-auto flex h-11 max-w-2xl overflow-hidden rounded-xl border border-gray-300 bg-gray-50 transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10"
            >
              <input
                type="text"
                name="q"
                placeholder="Search laptops, PCs, components & accessories..."
                className="min-w-0 flex-1 bg-transparent px-4 text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />

              <button
                type="submit"
                className="flex w-12 items-center justify-center bg-blue-600 text-white transition hover:bg-blue-700"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            </form>
          </div>

          {/* Login */}
          <Link
            href="/login"
            className="hidden items-center gap-2 rounded-xl px-3 py-2 text-gray-700 transition hover:bg-gray-100 sm:flex"
          >
            <User size={21} />

            <div className="hidden leading-tight xl:block">
              <p className="text-[11px] text-gray-500">Welcome</p>
              <p className="text-sm font-bold text-gray-900">Sign In</p>
            </div>
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex items-center gap-2 rounded-xl px-3 py-2 text-gray-700 transition hover:bg-gray-100"
          >
            <div className="relative">
              <ShoppingCart size={23} />

              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                0
              </span>
            </div>

            <span className="hidden text-sm font-bold xl:block">
              Cart
            </span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden border-t border-gray-100 lg:block">
          <div className="container-main flex h-12 items-center justify-between">
            <div className="flex h-full items-center gap-1">
              <Link
                href="/products"
                className="flex h-full items-center gap-2 rounded-lg px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-blue-600"
              >
                <Tag size={16} />
                All Products
              </Link>

              <Link
                href="/category/laptops"
                className="flex h-full items-center gap-2 rounded-lg px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-blue-600"
              >
                <Laptop size={16} />
                Laptops
              </Link>

              <Link
                href="/category/desktops"
                className="flex h-full items-center gap-2 rounded-lg px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-blue-600"
              >
                <Monitor size={16} />
                Desktops
              </Link>

              <Link
                href="/category/components"
                className="flex h-full items-center gap-2 rounded-lg px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-blue-600"
              >
                <Cpu size={16} />
                Components
              </Link>

              <Link
                href="/category/gaming"
                className="flex h-full items-center gap-2 rounded-lg px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-blue-600"
              >
                <Gamepad2 size={16} />
                Gaming
              </Link>

              <Link
                href="/category/monitors"
                className="flex h-full items-center gap-2 rounded-lg px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-blue-600"
              >
                <Monitor size={16} />
                Monitors
              </Link>

              <Link
                href="/category/accessories"
                className="flex h-full items-center gap-2 rounded-lg px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-blue-600"
              >
                <Headphones size={16} />
                Accessories
              </Link>
            </div>

            <Link
              href="/products?deal=true"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50"
            >
              <Tag size={16} />
              Today's Deals
            </Link>
          </div>
        </nav>

        {/* Mobile search */}
        <div className="border-t border-gray-100 px-4 py-3 md:hidden">
          <form
            action="/search"
            className="flex h-11 overflow-hidden rounded-xl border border-gray-300 bg-gray-50"
          >
            <input
              type="text"
              name="q"
              placeholder="Search technology..."
              className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
            />

            <button
              type="submit"
              className="flex w-12 items-center justify-center bg-blue-600 text-white"
              aria-label="Search"
            >
              <Search size={19} />
            </button>
          </form>
        </div>
      </header>

      {mobileOpen && (
        <MobileMenu onClose={() => setMobileOpen(false)} />
      )}
    </>
  );
}