"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Store,
  FolderTree,
  MessageSquare,
  ArrowLeft,
  LogOut,
  ShieldCheck,
} from "lucide-react";

export default function AdminSidebar({
  onLogout,
  loggingOut = false,
}) {
  const pathname = usePathname();

  const links = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Products",
      href: "/admin/products",
      icon: Package,
    },
    {
      label: "Orders",
      href: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      label: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      label: "Sellers",
      href: "/admin/sellers",
      icon: Store,
    },
    {
      label: "Categories",
      href: "/admin/categories",
      icon: FolderTree,
    },
    {
      label: "Reviews",
      href: "/admin/reviews",
      icon: MessageSquare,
    },
  ];

  function isActive(href) {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname.startsWith(href);
  }

  return (
    <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">
      {/* BRAND */}

      <div className="border-b border-gray-200 p-5">
        <Link
          href="/admin"
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
            <ShieldCheck size={20} />
          </div>

          <div>
            <p className="font-bold text-gray-900">
              ComputerHub
            </p>

            <p className="text-xs text-gray-500">
              Admin Panel
            </p>
          </div>
        </Link>
      </div>

      {/* NAVIGATION */}

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(
            link.href
          );

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                active
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon size={19} />

              <span>{link.label}</span>
            </Link>
          );
        })}

        <div className="my-4 border-t border-gray-200" />

        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
        >
          <ArrowLeft size={19} />

          <span>View Store</span>
        </Link>
      </nav>

      {/* LOGOUT */}

      {onLogout && (
        <div className="border-t border-gray-200 p-4">
          <button
            type="button"
            onClick={onLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
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