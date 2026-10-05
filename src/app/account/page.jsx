"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Heart,
  Loader2,
  LogOut,
  Mail,
  Package,
  ShieldCheck,
  ShoppingBag,
  User,
} from "lucide-react";
import { toast } from "sonner";

export default function AccountPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!user) return;

    if (user.role === "admin") {
      router.push("/admin");
      return;
    }

    if (user.role === "seller") {
      router.push("/seller");
    }
  }, [user, router]);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          router.push("/login");
          return;
        }

        setUser(data.user);

        try {
          localStorage.setItem(
            "user",
            JSON.stringify(data.user)
          );

          window.dispatchEvent(
            new Event("storage")
          );
        } catch (storageError) {
          console.warn(
            "Could not sync account data:",
            storageError
          );
        }
      } catch (error) {
        console.error(
          "Account loading error:",
          error
        );

        toast.error(
          "Unable to load your account."
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

      localStorage.removeItem("user");

      window.dispatchEvent(
        new Event("storage")
      );

      toast.success(
        "Logged out successfully."
      );

      router.push("/login");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to logout."
      );
    } finally {
      setLoggingOut(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-medium text-slate-600 shadow-sm">
            <Loader2
              size={20}
              className="animate-spin text-blue-600"
            />
            Loading your account...
          </div>
        </div>
      </main>
    );
  }

  if (!user) return null;

  const firstName =
    user.firstName ||
    user.name?.split(" ")[0] ||
    "Customer";

  const fullName =
    user.name ||
    `${user.firstName || ""} ${
      user.lastName || ""
    }`.trim() ||
    firstName;

  return (
    <main className="min-h-screen bg-slate-50 py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}

        <div className="mb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700">
                <User size={14} />
                My Account
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Welcome, {firstName}
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Manage your profile, orders, and saved products.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                router.push("/products")
              }
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
            >
              Continue Shopping
              <ArrowRight size={17} />
            </button>
          </div>
        </div>

        {/* ACCOUNT GRID */}

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* PROFILE */}

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-6">
              <div>
                <h2 className="text-xl font-black text-slate-950">
                  Profile Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your account details
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <User size={22} />
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <User size={14} />
                  First Name
                </div>

                <p className="font-bold text-slate-900">
                  {user.firstName || "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <User size={14} />
                  Last Name
                </div>

                <p className="font-bold text-slate-900">
                  {user.lastName || "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:col-span-2">
                <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <Mail size={14} />
                  Email Address
                </div>

                <p className="break-all font-bold text-slate-900">
                  {user.email || "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <ShieldCheck size={14} />
                  Account Role
                </div>

                <p className="font-bold capitalize text-blue-600">
                  {user.role || "customer"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <ShieldCheck size={14} />
                  Account Status
                </div>

                <p
                  className={`font-bold ${
                    user.isActive
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {user.isActive
                    ? "Active"
                    : "Disabled"}
                </p>
              </div>
            </div>
          </section>

          {/* QUICK ACTIONS */}

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div>
              <h2 className="text-xl font-black text-slate-950">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Access your shopping activity.
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() =>
                  router.push("/orders")
                }
                className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  <Package size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-900">
                    My Orders
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Track your orders and delivery.
                  </p>
                </div>

                <ArrowRight
                  size={17}
                  className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
                />
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push("/wishlist")
                }
                className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 p-4 text-left transition hover:border-pink-200 hover:bg-pink-50"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600 transition group-hover:bg-pink-600 group-hover:text-white">
                  <Heart size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-900">
                    Wishlist
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    View your saved products.
                  </p>
                </div>

                <ArrowRight
                  size={17}
                  className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-pink-600"
                />
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push("/products")
                }
                className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 p-4 text-left transition hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <ShoppingBag size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-900">
                    Browse Products
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Explore the latest technology.
                  </p>
                </div>

                <ArrowRight
                  size={17}
                  className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-600"
                />
              </button>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="group mt-4 flex w-full items-center gap-4 rounded-2xl border border-red-200 p-4 text-left transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  {loggingOut ? (
                    <Loader2
                      size={20}
                      className="animate-spin"
                    />
                  ) : (
                    <LogOut size={20} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-bold text-red-600">
                    {loggingOut
                      ? "Logging out..."
                      : "Logout"}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Sign out of your account.
                  </p>
                </div>
              </button>
            </div>
          </section>
        </div>

        {/* ACCOUNT FOOTER INFO */}

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-500 shadow-sm">
          <ShieldCheck
            size={18}
            className="shrink-0 text-emerald-600"
          />

          <span>
            Signed in as{" "}
            <strong className="text-slate-700">
              {fullName}
            </strong>
            .
          </span>
        </div>
      </div>
    </main>
  );
}