"use client";

import { useEffect, useState } from "react";
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
  LayoutDashboard,
  LogOut,
} from "lucide-react";

import { useCart } from "@/context/CartContext";

export default function MobileMenu({ open, onClose }) {
  const { itemCount } = useCart();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = () => {
      try {
        const saved = localStorage.getItem("user");
        setUser(saved ? JSON.parse(saved) : null);
      } catch {
        setUser(null);
      }
    };

    loadUser();
    window.addEventListener("storage", loadUser);

    return () => window.removeEventListener("storage", loadUser);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    onClose();
    window.location.href = "/";
  };

  if (!open) return null;

  const links = [
    { label: "All Products", href: "/products", icon: Tag },
    { label: "Laptops", href: "/category/laptops", icon: Laptop },
    { label: "Desktop PCs", href: "/category/desktops", icon: Monitor },
    { label: "PC Components", href: "/category/components", icon: Cpu },
    { label: "Gaming", href: "/category/gaming", icon: Gamepad2 },
    { label: "Monitors", href: "/category/monitors", icon: Monitor },
    { label: "Accessories", href: "/category/accessories", icon: Headphones },
    { label: "Storage", href: "/category/storage", icon: HardDrive },
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
            className="rounded-xl p-2 text-gray-600 hover:bg-gray-100"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <div className="border-b border-gray-200 p-5">
          {user ? (
            <div className="rounded-xl bg-slate-900 p-4 text-white">
              <div className="flex items-center gap-3">
                <User size={21} />

                <div>
                  <p className="text-xs text-gray-300">Welcome back</p>

                  <p className="font-bold">
                    {user?.firstName ||
                      user?.lastName ||
                      user?.fullName?.split(" ")[0] ||
                      user?.name?.split(" ")[0] ||
                      user?.email?.split("@")[0] ||
                      "User"}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2">

                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={onClose}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 font-semibold text-white hover:bg-blue-700"
                  >
                    <LayoutDashboard size={18} />
                    Admin Dashboard
                  </Link>
                )}

                {user.role === "seller" && (
                  <Link
                    href="/seller"
                    onClick={onClose}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 font-semibold text-white hover:bg-blue-700"
                  >
                    <LayoutDashboard size={18} />
                    Seller Dashboard
                  </Link>
                )}

                {user.role === "customer" && (
                  <>
                    <Link
                      href="/account"
                      onClick={onClose}
                      className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 font-semibold text-gray-700 hover:bg-gray-100"
                    >
                      <User size={18} />
                      My Account
                    </Link>

                    <Link
                      href="/orders"
                      onClick={onClose}
                      className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 font-semibold text-gray-700 hover:bg-gray-100"
                    >
                      <ShoppingCart size={18} />
                      My Orders
                    </Link>
                  </>
                )}

                <div className="mt-4 space-y-2">

                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={onClose}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 font-semibold text-white hover:bg-blue-700"
                  >
                    <LayoutDashboard size={18} />
                    Admin Dashboard
                  </Link>
                )}

                {user.role === "seller" && (
                  <Link
                    href="/seller"
                    onClick={onClose}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 font-semibold text-white hover:bg-blue-700"
                  >
                    <LayoutDashboard size={18} />
                    Seller Dashboard
                  </Link>
                )}

                {user.role === "customer" && (
                  <>
                    <Link
                      href="/account"
                      onClick={onClose}
                      className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 font-semibold text-gray-700 hover:bg-gray-100"
                    >
                      <User size={18} />
                      My Account
                    </Link>

                    <Link
                      href="/orders"
                      onClick={onClose}
                      className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 font-semibold text-gray-700 hover:bg-gray-100"
                    >
                      <ShoppingCart size={18} />
                      My Orders
                    </Link>
                  </>
                )}

                <button
                  onClick={logout}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-2 font-semibold text-white hover:bg-red-700"
                >
                  <LogOut size={18} />
                  Logout
                </button>

              </div>

              </div>
            </div>
          ) : (
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
          )}
        </div>

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

        <div className="border-t border-gray-200 p-4">
          <Link
            href="/cart"
            onClick={onClose}
            className="flex items-center justify-between rounded-xl px-3 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            <div className="flex items-center gap-4">
              <ShoppingCart size={19} />
              Shopping Cart
            </div>

            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-600 px-2 text-xs font-bold text-white">
              {itemCount}
            </span>
          </Link>
        </div>
      </aside>
    </div>
  );
}