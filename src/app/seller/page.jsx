"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  Plus,
  ArrowRight,
  RefreshCw,
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
  const [loggingOut, setLoggingOut] =
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

      setUser(
        userData.user || null
      );

      setProducts(
        Array.isArray(
          productsData.products
        )
          ? productsData.products
          : []
      );

      setOrders(
        Array.isArray(
          ordersData.orders
        )
          ? ordersData.orders
          : []
      );
    } catch (err) {
      console.error(
        "Seller dashboard error:",
        err
      );

      setError(
        err.message ||
          "Unable to load seller dashboard."
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

      const response =
        await fetch(
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

      window.location.href =
        "/login";
    } catch (err) {
      console.error(
        "Logout error:",
        err
      );

      setError(
        err.message ||
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
    orders.filter(
      (order) =>
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

  const sales =
    orders.reduce(
      (total, order) =>
        total +
        Number(
          order.sellerSubtotal ??
            0
        ),
      0
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <SellerHeader
        user={user}
        onMenuClick={() => {
          // Desktop sidebar is always visible.
          // Mobile navigation is available
          // through the normal seller links.
        }}
      />

      <div className="flex min-h-[calc(100vh-4rem)]">
        <div className="hidden lg:block">
          <SellerSidebar
            onLogout={handleLogout}
            loggingOut={loggingOut}
          />
        </div>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-600">
                  Seller Center
                </p>

                <h1 className="mt-1 text-3xl font-bold text-gray-900">
                  Welcome back
                  {user?.firstName
                    ? `, ${user.firstName}`
                    : ""}
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  Manage your products and customer orders.
                </p>
              </div>

              <button
                type="button"
                onClick={loadDashboard}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw
                  size={17}
                  className={
                    loading
                      ? "animate-spin"
                      : ""
                  }
                />
                Refresh
              </button>
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <SellerStats
              products={products.length}
              orders={orders.length}
              sales={sales}
              pendingOrders={
                pendingOrders.length
              }
              activeProducts={
                activeProducts.length
              }
            />

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Link
                href="/seller/products"
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                      <Package
                        size={22}
                        className="text-blue-600"
                      />
                    </div>

                    <h2 className="mt-4 text-lg font-bold text-gray-900">
                      My Products
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      View, edit, activate or deactivate your products.
                    </p>
                  </div>

                  <ArrowRight
                    className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-blue-600"
                    size={20}
                  />
                </div>
              </Link>

              <Link
                href="/seller/products/add"
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
                      <Plus
                        size={22}
                        className="text-green-600"
                      />
                    </div>

                    <h2 className="mt-4 text-lg font-bold text-gray-900">
                      Add Product
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Add a new product to your ComputerHub store.
                    </p>
                  </div>

                  <ArrowRight
                    className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-blue-600"
                    size={20}
                  />
                </div>
              </Link>
            </div>

            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Recent Orders
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Orders containing your products.
                  </p>
                </div>

                <Link
                  href="/seller/orders"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  View all
                  <ArrowRight size={16} />
                </Link>
              </div>

              <SellerOrderTable
                orders={orders.slice(0, 5)}
                loading={loading}
              />
            </div>

            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <ShoppingBag
                  size={21}
                  className="text-blue-600"
                />

                <div>
                  <h2 className="font-bold text-gray-900">
                    Seller account
                  </h2>

                  <p className="text-sm text-gray-500">
                    {user?.email ||
                      "Seller account"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}