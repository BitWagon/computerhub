"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Package,
  Heart,
  ShoppingBag,
  LogOut,
} from "lucide-react";

export default function AccountSidebar({
  user,
  onLogout,
  loggingOut = false,
}) {
  const pathname = usePathname();

  const links = [
    {
      label: "Profile",
      href: "/account",
      icon: User,
    },
    {
      label: "My Orders",
      href: "/orders",
      icon: Package,
    },
    {
      label: "Wishlist",
      href: "/wishlist",
      icon: Heart,
    },
  ];

  return (
    <aside className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="border-b border-gray-200 px-3 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <User className="h-6 w-6 text-blue-600" />
          </div>

          <div className="min-w-0">
            <p className="truncate font-bold text-gray-900">
              {user?.firstName || "Customer"}{" "}
              {user?.lastName || ""}
            </p>

            <p className="truncate text-sm text-gray-500">
              {user?.email || ""}
            </p>
          </div>
        </div>
      </div>

      <nav className="mt-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;

          const isActive =
            link.href === "/account"
              ? pathname === "/account"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon size={19} />

              <span>{link.label}</span>
            </Link>
          );
        })}

        <Link
          href="/products"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
        >
          <ShoppingBag size={19} />

          <span>Continue Shopping</span>
        </Link>
      </nav>

      {onLogout && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={onLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut size={19} />

            <span>
              {loggingOut
                ? "Logging out..."
                : "Logout"}
            </span>
          </button>
        </div>
      )}
    </aside>
  );
}