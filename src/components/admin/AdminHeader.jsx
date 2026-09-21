"use client";

import Link from "next/link";
import {
  Bell,
  ShieldCheck,
  User,
  Menu,
} from "lucide-react";

export default function AdminHeader({
  user,
  onMenuClick,
}) {
  const adminName =
    user?.firstName || user?.name || "Admin";

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* LEFT */}

        <div className="flex min-w-0 items-center gap-3">
          {onMenuClick && (
            <button
              type="button"
              onClick={onMenuClick}
              aria-label="Open admin menu"
              className="rounded-xl p-2 text-gray-600 transition hover:bg-gray-100 lg:hidden"
            >
              <Menu size={21} />
            </button>
          )}

          <Link
            href="/admin"
            className="flex min-w-0 items-center gap-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
              <ShieldCheck size={21} />
            </div>

            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-sm font-bold text-gray-900">
                ComputerHub
              </p>

              <p className="text-xs text-gray-500">
                Admin Panel
              </p>
            </div>
          </Link>
        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label="Notifications"
            className="relative rounded-xl p-2.5 text-gray-600 transition hover:bg-gray-100"
          >
            <Bell size={20} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <Link
            href="/account"
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-gray-100"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
              <User
                size={18}
                className="text-blue-600"
              />
            </div>

            <div className="hidden md:block">
              <p className="text-sm font-semibold text-gray-800">
                {adminName}
              </p>

              <p className="text-xs text-gray-500">
                Administrator
              </p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}