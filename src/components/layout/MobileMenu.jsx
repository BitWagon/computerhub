"use client";

import Link from "next/link";
import {
  X,
  Laptop,
  Monitor,
  Cpu,
  Gamepad2,
  Headphones,
  Tag,
  User,
  ShoppingCart,
  HardDrive,
} from "lucide-react";

export default function MobileMenu({ onClose }) {
  const links = [
    {
      label: "All Products",
      href: "/products",
      icon: Tag,
    },
    {
      label: "Laptops",
      href: "/category/laptops",
      icon: Laptop,
    },
    {
      label: "Desktop PCs",
      href: "/category/desktops",
      icon: Monitor,
    },
    {
      label: "PC Components",
      href: "/category/components",
      icon: Cpu,
    },
    {
      label: "Gaming",
      href: "/category/gaming",
      icon: Gamepad2,
    },
    {
      label: "Monitors",
      href: "/category/monitors",
      icon: Monitor,
    },
    {
      label: "Accessories",
      href: "/category/accessories",
      icon: Headphones,
    },
    {
      label: "Storage",
      href: "/category/storage",
      icon: HardDrive,
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        aria-label="Close menu"
      />

      <aside className="relative h-full w-[86%] max-w-sm overflow-y-auto bg-white shadow-2xl">
        {/* Header */}
        <div className="flex h-20 items-center justify-between border-b border-gray-200 px-5">
          <Link
            href="/"
            onClick={onClose}
            className="text-xl font-black tracking-tight text-slate-900"
          >
            Computer<span className="text-blue-600">Hub</span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-gray-600 transition hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Account */}
        <div className="border-b border-gray-200 p-5">
          <Link
            href="/login"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl bg-slate-900 p-4 text-white"
          >
            <User size={21} />

            <div>
              <p className="text-xs text-gray-300">
                Welcome to ComputerHub
              </p>

              <p className="font-bold">
                Sign In / Create Account
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <div className="p-4">
          <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-gray-400">
            Shop Technology
          </p>

          <div className="space-y-1">
            {links.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-4 rounded-xl px-3 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-blue-50 hover:text-blue-600"
                >
                  <Icon size={19} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Cart */}
        <div className="border-t border-gray-200 p-4">
          <Link
            href="/cart"
            onClick={onClose}
            className="flex items-center gap-4 rounded-xl px-3 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            <ShoppingCart size={19} />
            Shopping Cart
          </Link>
        </div>
      </aside>
    </div>
  );
}