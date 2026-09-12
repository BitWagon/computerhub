"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  ShieldCheck,
  LogOut,
  Package,
  Heart,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export default function AccountPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

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
      } catch (error) {
        console.error("Failed to load account:", error);
        toast.error("Unable to load your account.");
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

      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to logout."
        );
      }

      toast.success("Logged out successfully.");

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
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
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4">
          <div className="flex items-center gap-3 text-gray-600">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading your account...</span>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            My Account
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Welcome, {user.firstName}
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your ComputerHub account, orders and wishlist.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">

          {/* Profile */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Your account details
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                <User className="h-6 w-6 text-blue-600" />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">

              <div className="rounded-xl border border-gray-200 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                  <User className="h-4 w-4" />
                  First Name
                </div>

                <p className="font-semibold text-gray-900">
                  {user.firstName}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                  <User className="h-4 w-4" />
                  Last Name
                </div>

                <p className="font-semibold text-gray-900">
                  {user.lastName}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-4 sm:col-span-2">
                <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                  <Mail className="h-4 w-4" />
                  Email Address
                </div>

                <p className="font-semibold text-gray-900">
                  {user.email}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                  <ShieldCheck className="h-4 w-4" />
                  Account Role
                </div>

                <p className="font-semibold capitalize text-gray-900">
                  {user.role}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                  <ShieldCheck className="h-4 w-4" />
                  Account Status
                </div>

                <p className="font-semibold text-green-600">
                  {user.isActive ? "Active" : "Disabled"}
                </p>
              </div>

            </div>
          </section>

          {/* Account Actions */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage your shopping account
            </p>

            <div className="mt-6 space-y-3">

              <button
                type="button"
                onClick={() => router.push("/orders")}
                className="flex w-full items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-left transition hover:border-blue-300 hover:bg-blue-50"
              >
                <Package className="h-5 w-5 text-blue-600" />

                <div>
                  <p className="font-semibold text-gray-900">
                    My Orders
                  </p>

                  <p className="text-xs text-gray-500">
                    View your orders
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => router.push("/wishlist")}
                className="flex w-full items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-left transition hover:border-blue-300 hover:bg-blue-50"
              >
                <Heart className="h-5 w-5 text-blue-600" />

                <div>
                  <p className="font-semibold text-gray-900">
                    Wishlist
                  </p>

                  <p className="text-xs text-gray-500">
                    View saved products
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loggingOut ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut className="h-5 w-5" />
                    Logout
                  </>
                )}
              </button>

            </div>
          </section>
        </div>
      </div>
    </main>
  );
}