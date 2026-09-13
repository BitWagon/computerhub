"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Store,
  Package,
  ShoppingBag,
  UserRound,
  LogOut,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

export default function SellerPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch(
          "/api/auth/me",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          router.push("/login");
          return;
        }

        if (data.user?.role !== "seller") {
          if (data.user?.role === "admin") {
            router.push("/admin");
          } else {
            router.push("/account");
          }

          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error(
          "Seller account error:",
          error
        );

        toast.error(
          "Unable to load seller account."
        );

        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [router]);

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

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to logout."
        );
      }

      toast.success(
        "Logged out successfully."
      );

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error(
        "Seller logout error:",
        error
      );

      toast.error(
        error.message || "Unable to logout."
      );
    } finally {
      setLoggingOut(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="flex items-center gap-3 text-gray-600">
            <Loader2
              size={24}
              className="animate-spin"
            />
            Loading seller dashboard...
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
                <Store size={17} />
                Seller Panel
              </div>

              <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                Welcome, {user.firstName}
              </h1>

              <p className="mt-3 text-gray-600">
                Manage your ComputerHub seller account,
                products, and orders.
              </p>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white">
              <Store size={30} />
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-gray-900">
              Seller Dashboard
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Your seller account is active.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/seller/products"
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white">
                <Package size={23} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900">
                My Products
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Manage the products you sell on ComputerHub.
              </p>
            </Link>

            <Link
              href="/seller/orders"
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white">
                <ShoppingBag size={23} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900">
                Seller Orders
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                View orders related to your seller account.
              </p>
            </Link>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <UserRound size={23} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900">
                Seller Account
              </h3>

              <p className="mt-2 break-all text-sm text-gray-500">
                {user.email}
              </p>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                <ShieldCheck size={14} />
                Seller
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
            >
              {loggingOut ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <LogOut size={18} />
              )}

              {loggingOut
                ? "Logging out..."
                : "Logout"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}