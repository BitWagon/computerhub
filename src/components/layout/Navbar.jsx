"use client";

import {
  useEffect,
  useState,
} from "react";

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
  HardDrive,
  Menu,
  LogOut,
} from "lucide-react";

import MobileMenu from "./MobileMenu";

import {
  useCart,
} from "@/context/CartContext";

export default function Navbar() {
  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  const [
    user,
    setUser,
  ] = useState(null);

  const {
    itemCount,
  } = useCart();

  useEffect(() => {
    const loadUser = () => {
      try {
        const saved =
          localStorage.getItem(
            "user"
          );

        if (!saved) {
          setUser(null);
          return;
        }

        const parsed =
          JSON.parse(saved);

        setUser(parsed);
      } catch {
        setUser(null);
      }
    };

    loadUser();

    window.addEventListener(
      "storage",
      loadUser
    );

    return () => {
      window.removeEventListener(
        "storage",
        loadUser
      );
    };
  }, []);

  const logout = async () => {
    try {
      await fetch(
        "/api/auth/logout",
        {
          method: "POST",
          credentials:
            "include",
          cache:
            "no-store",
        }
      );
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    } finally {
      localStorage.removeItem(
        "user"
      );

      setUser(null);

      window.dispatchEvent(
        new Event("storage")
      );

      window.location.href =
        "/";
    }
  };

  const displayName =
    user?.firstName ||
    user?.lastName ||
    user?.fullName?.split(
      " "
    )[0] ||
    user?.name?.split(
      " "
    )[0] ||
    user?.email?.split(
      "@"
    )[0] ||
    "User";

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">

        {/* TOP BAR */}
        <div className="hidden bg-slate-950 text-white md:block">
          <div className="container-main flex h-9 items-center justify-between text-[11px]">

            <p className="font-medium text-slate-300">
              Technology made simple.
            </p>

            <div className="flex items-center gap-6 text-slate-400">
              <span>
                Quality Products
              </span>

              <span>
                Secure Checkout
              </span>

              <span>
                Fast Delivery
              </span>
            </div>

          </div>
        </div>

        {/* MAIN NAVBAR */}
        <div className="container-main flex min-h-[76px] items-center gap-3 sm:gap-5">

          {/* MOBILE MENU */}
          <button
            type="button"
            onClick={() =>
              setMobileOpen(true)
            }
            className="rounded-xl p-2.5 text-slate-700 transition hover:bg-slate-100 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={23} />
          </button>

          {/* LOGO */}
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2.5"
            onClick={() =>
              setMobileOpen(false)
            }
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 transition group-hover:bg-blue-700">
              <Laptop
                size={23}
                strokeWidth={2.3}
              />
            </div>

            <div className="leading-none">
              <div className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                Computer
                <span className="text-blue-600">
                  Hub
                </span>
              </div>

              <div className="mt-1 hidden text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400 sm:block">
                Technology Marketplace
              </div>
            </div>
          </Link>

          {/* SEARCH */}
          <div className="hidden flex-1 md:block">
            <form
              action="/search"
              className="mx-auto flex h-11 max-w-2xl overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10"
            >
              <input
                type="text"
                name="q"
                placeholder="Search laptops, PCs, components & accessories..."
                className="min-w-0 flex-1 bg-transparent px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />

              <button
                type="submit"
                className="flex w-12 shrink-0 items-center justify-center bg-blue-600 text-white transition hover:bg-blue-700"
                aria-label="Search"
              >
                <Search size={19} />
              </button>
            </form>
          </div>

          {/* USER */}
          {user ? (
            <div className="hidden items-center gap-2 rounded-xl px-2 py-2 sm:flex">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <User size={20} />
              </div>

              <div className="hidden leading-tight xl:block">
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                  Welcome
                </p>

                <p className="max-w-[100px] truncate text-sm font-bold text-slate-900">
                  {displayName}
                </p>
              </div>

              <button
                type="button"
                onClick={logout}
                className="ml-1 rounded-lg p-2 text-red-500 transition hover:bg-red-50 hover:text-red-600"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut size={18} />
              </button>

            </div>
          ) : (
            <Link
              href="/login"
              className="hidden items-center gap-2 rounded-xl px-3 py-2 text-slate-700 transition hover:bg-slate-100 sm:flex"
            >
              <User size={21} />

              <span className="text-sm font-bold">
                Login
              </span>
            </Link>
          )}

          {/* CART */}
          <Link
            href="/cart"
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100"
            aria-label="Shopping cart"
          >
            <ShoppingCart size={22} />

            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white shadow-sm">
                {itemCount}
              </span>
            )}
          </Link>

        </div>

        {/* CATEGORY NAVIGATION */}
        <nav className="hidden border-t border-slate-100 lg:block">
          <div className="container-main flex h-12 items-center gap-7 overflow-x-auto text-sm font-semibold text-slate-600">

            <NavItem
              href="/products"
              label="All Products"
            />

            <NavItem
              href="/category/laptops"
              label="Laptops"
              icon={Laptop}
            />

            <NavItem
              href="/category/desktops"
              label="Desktop PCs"
              icon={Monitor}
            />

            <NavItem
              href="/category/components"
              label="Components"
              icon={Cpu}
            />

            <NavItem
              href="/category/gaming"
              label="Gaming"
              icon={Gamepad2}
            />

            <NavItem
              href="/category/monitors"
              label="Monitors"
              icon={Monitor}
            />

            <NavItem
              href="/category/accessories"
              label="Accessories"
              icon={Headphones}
            />

            <NavItem
              href="/category/storage"
              label="Storage"
              icon={HardDrive}
            />

          </div>
        </nav>

      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() =>
          setMobileOpen(false)
        }
      />
    </>
  );
}

function NavItem({
  href,
  label,
  icon: Icon,
}) {
  return (
    <Link
      href={href}
      className="flex shrink-0 items-center gap-2 transition hover:text-blue-600"
    >
      {Icon && (
        <Icon
          size={16}
          strokeWidth={2}
        />
      )}

      <span>
        {label}
      </span>
    </Link>
  );
}