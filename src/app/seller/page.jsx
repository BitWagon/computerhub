"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Menu,
  Package,
  RefreshCw,
  ShoppingBag,
  Store,
  X,
} from "lucide-react";

import SellerHeader from "@/components/seller/SellerHeader";
import SellerSidebar from "@/components/seller/SellerSidebar";
import SellerStats from "@/components/seller/SellerStats";
import SellerOrderTable from "@/components/seller/SellerOrderTable";

export default function SellerDashboardPage() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const [
        userResponse,
        productsResponse,
        ordersResponse,
      ] = await Promise.all([
        fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        }),

        fetch(
          "/api/products?includeInactive=true",
          {
            credentials: "include",
            cache: "no-store",
          }
        ),

        fetch("/api/orders", {
          credentials: "include",
          cache: "no-store",
        }),
      ]);

      const userData =
        await userResponse.json();

      const productsData =
        await productsResponse.json();

      const ordersData =
        await ordersResponse.json();

      if (!userResponse.ok) {
        throw new Error(
          userData.message ||
            "Unable to load seller account."
        );
      }

      if (!productsResponse.ok) {
        throw new Error(
          productsData.message ||
            "Unable to load seller products."
        );
      }

      if (!ordersResponse.ok) {
        throw new Error(
          ordersData.message ||
            "Unable to load seller orders."
        );
      }

      setUser(userData.user || null);

      setProducts(
        Array.isArray(productsData.products)
          ? productsData.products
          : []
      );

      setOrders(
        Array.isArray(ordersData.orders)
          ? ordersData.orders
          : []
      );
    } catch (err) {
      console.error(
        "Seller dashboard error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load seller dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function handleLogout() {
    try {
      setLoggingOut(true);

      const response = await fetch(
        "/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Unable to logout."
        );
      }

      window.location.href = "/login";
    } catch (err) {
      console.error(
        "Logout error:",
        err
      );

      setError(
        err?.message ||
          "Unable to logout."
      );
    } finally {
      setLoggingOut(false);
    }
  }

  const activeProducts =
    products.filter(
      (product) =>
        product.isActive !== false
    );

  const pendingOrders =
    orders.filter((order) =>
      [
        "pending",
        "confirmed",
        "processing",
      ].includes(
        String(
          order.orderStatus || ""
        ).toLowerCase()
      )
    );

  const sales = orders.reduce(
    (total, order) =>
      total +
      Number(
        order.sellerSubtotal ?? 0
      ),
    0
  );

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    sales,
    pendingOrders: pendingOrders.length,
    activeProducts:
      activeProducts.length,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SellerHeader
        user={user}
        onMenuClick={() =>
          setMobileSidebarOpen(true)
        }
      />

      {/* Mobile sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Close seller menu"
            onClick={() =>
              setMobileSidebarOpen(false)
            }
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
          />

          <div className="relative h-full w-[290px] max-w-[85vw] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <Store size={20} />
                </div>

                <div>
                  <p className="font-black text-slate-950">
                    ComputerHub
                  </p>

                  <p className="text-xs text-slate-500">
                    Seller Center
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setMobileSidebarOpen(false)
                }
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <SellerSidebar
              onLogout={handleLogout}
              loggingOut={loggingOut}
              onNavigate={() =>
                setMobileSidebarOpen(false)
              }
            />
          </div>
        </div>
      )}

      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <SellerSidebar
            onLogout={handleLogout}
            loggingOut={loggingOut}
          />
        </div>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-7xl">

            {/* Header */}
            <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
                  <Store size={13} />
                  Seller Center
                </div>

                <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  Welcome back
                  {user?.firstName
                    ? `, ${user.firstName}`
                    : ""}
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                  Monitor your products, customer
                  orders and seller performance from
                  one place.
                </p>
              </div>

              <button
                type="button"
                onClick={loadDashboard}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={17}
                  className={
                    loading
                      ? "animate-spin"
                      : ""
                  }
                />
                Refresh Dashboard
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-black text-red-800">
                      Dashboard error
                    </p>

                    <p className="mt-1 text-sm text-red-700">
                      {error}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={loadDashboard}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700"
                  >
                    <RefreshCw size={15} />
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Stats */}
            <SellerStats stats={stats} />

            {/* Quick actions */}
            <div className="mt-7 grid gap-5 lg:grid-cols-2">

              <Link
                href="/seller/orders"
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg sm:p-7"
              >
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-50 transition group-hover:scale-125" />

                <div className="relative flex items-start justify-between gap-5">
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      <ShoppingBag size={23} />
                    </div>

                    <h2 className="mt-5 text-xl font-black text-slate-950">
                      Customer Orders
                    </h2>

                    <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                      Review orders containing your
                      products and manage their
                      progress.
                    </p>

                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600">
                      View Orders
                      <ArrowRight
                        size={16}
                        className="transition group-hover:translate-x-1"
                      />
                    </div>
                  </div>

                  <div className="hidden h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-400 sm:flex">
                    <ArrowRight size={19} />
                  </div>
                </div>
              </Link>

              <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm sm:p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                  <Package size={23} />
                </div>

                <h2 className="mt-5 text-xl font-black text-slate-950">
                  Product Management
                </h2>

                <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600">
                  Product listings are managed by
                  ComputerHub administrators. Seller
                  accounts can monitor product-related
                  orders and performance.
                </p>

                <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-blue-700 shadow-sm">
                  {activeProducts.length} active products
                </div>
              </div>
            </div>

            {/* Recent orders */}
            <section className="mt-8">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
                    Recent Activity
                  </p>

                  <h2 className="mt-1 text-2xl font-black text-slate-950">
                    Recent Orders
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Latest orders containing your
                    products.
                  </p>
                </div>

                <Link
                  href="/seller/orders"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700"
                >
                  View all orders
                  <ArrowRight size={16} />
                </Link>
              </div>

              <SellerOrderTable
                orders={orders.slice(0, 5)}
                loading={loading}
              />
            </section>

            {/* Account */}
            <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                    <Store size={22} />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Seller Account
                    </p>

                    <h2 className="mt-1 font-black text-slate-950">
                      {user?.firstName ||
                        user?.name ||
                        "Seller"}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {user?.email ||
                        "Seller account"}
                    </p>
                  </div>
                </div>

                <Link
                  href="/account"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  Account Settings
                  <ArrowRight size={16} />
                </Link>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}