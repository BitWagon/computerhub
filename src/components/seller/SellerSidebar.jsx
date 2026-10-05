"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  LayoutDashboard,
  LogOut,
  Package,
  Plus,
  ShoppingBag,
  Store,
} from "lucide-react";

export default function SellerSidebar({
  onLogout,
  loggingOut = false,
  onNavigate,
}) {
  const pathname = usePathname();

  const links = [
    {
      label: "Dashboard",
      href: "/seller",
      icon: LayoutDashboard,
    },
    {
      label: "My Products",
      href: "/seller/products",
      icon: Package,
    },
    {
      label: "Add Product",
      href: "/seller/products/add",
      icon: Plus,
    },
    {
      label: "Orders",
      href: "/seller/orders",
      icon: ShoppingBag,
    },
  ];

  function isActive(href) {
    if (href === "/seller") {
      return pathname === "/seller";
    }

    return pathname.startsWith(href);
  }

  return (
    <aside className="flex h-full min-h-[calc(100vh-4rem)] w-64 flex-col border-r border-slate-200 bg-white">

      <div className="border-b border-slate-100 p-5">
        <Link
          href="/seller"
          onClick={onNavigate}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <Store size={20} />
          </div>

          <div>
            <p className="font-black text-slate-950">
              ComputerHub
            </p>

            <p className="text-xs font-medium text-slate-500">
              Seller Center
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        <p className="mb-3 px-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
          Workspace
        </p>

        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(
            link.href
          );

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
              }`}
            >
              <Icon
                size={19}
                className={
                  active
                    ? "text-white"
                    : "text-slate-400 group-hover:text-blue-600"
                }
              />

              <span>{link.label}</span>
            </Link>
          );
        })}

        <div className="my-5 border-t border-slate-100" />

        <p className="mb-3 px-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
          Store
        </p>

        <Link
          href="/products"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
        >
          <ArrowLeft
            size={19}
            className="text-slate-400"
          />

          <span>View Store</span>
        </Link>
      </nav>

      {onLogout && (
        <div className="border-t border-slate-100 p-4">
          <button
            type="button"
            onClick={onLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
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