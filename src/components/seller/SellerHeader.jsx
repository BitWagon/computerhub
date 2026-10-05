"use client";

import Link from "next/link";
import {
  Bell,
  Menu,
  Store,
  User,
} from "lucide-react";

export default function SellerHeader({
  user,
  onMenuClick,
}) {
  const sellerName =
    user?.firstName ||
    user?.name ||
    "Seller";

  const storeName =
    user?.storeName ||
    `${sellerName}'s Store`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        <div className="flex min-w-0 items-center gap-3">
          {onMenuClick && (
            <button
              type="button"
              onClick={onMenuClick}
              className="rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100 lg:hidden"
              aria-label="Open seller menu"
            >
              <Menu size={21} />
            </button>
          )}

          <Link
            href="/seller"
            className="flex min-w-0 items-center gap-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <Store size={20} />
            </div>

            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-sm font-black text-slate-950">
                {storeName}
              </p>

              <p className="text-xs font-medium text-slate-500">
                Seller Center
              </p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">

          <button
            type="button"
            className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100"
            aria-label="Notifications"
          >
            <Bell size={20} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600" />
          </button>

          <Link
            href="/account"
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-slate-100"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50">
              <User
                size={18}
                className="text-blue-600"
              />
            </div>

            <div className="hidden text-left md:block">
              <p className="text-xs font-bold text-slate-900">
                {sellerName}
              </p>

              <p className="text-[11px] text-slate-500">
                Account
              </p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}