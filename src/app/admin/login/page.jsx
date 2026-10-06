"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  Store,
} from "lucide-react";
import toast from "react-hot-toast";

function AdminLoginForm() {
  const searchParams = useSearchParams();

  const redirect =
    searchParams.get("redirect") || "/admin";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError("");

    const email =
      formData.email.trim().toLowerCase();

    if (!email) {
      const message =
        "Please enter your email address.";

      setError(message);
      toast.error(message);
      return;
    }

    if (!formData.password) {
      const message =
        "Please enter your password.";

      setError(message);
      toast.error(message);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          cache: "no-store",
          body: JSON.stringify({
            email,
            password: formData.password,
          }),
        }
      );

      let data = null;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "The server returned an invalid login response."
        );
      }

      console.log(
        "ADMIN LOGIN RESPONSE:",
        data
      );

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message ||
            "Invalid email or password."
        );
      }

      if (!data.user) {
        throw new Error(
          "Login succeeded, but no user information was returned."
        );
      }

      if (data.user.role !== "admin") {
        throw new Error(
          "Access denied. This account is not an administrator."
        );
      }

      /*
       * Save the authenticated user for the
       * client-side navigation/header UI.
       */
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
          "Unable to save admin user locally:",
          storageError
        );
      }

      toast.success(
        "Admin login successful!"
      );

      /*
       * Give the browser a short moment to
       * receive/process the authentication cookie.
       */
      await new Promise((resolve) =>
        setTimeout(resolve, 150)
      );

      /*
       * Hard navigation ensures /admin is requested
       * again with the newly-created auth cookie.
       */
      window.location.replace(redirect);
    } catch (error) {
      console.error(
        "Admin login error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Unable to login.";

      setError(message);
      toast.error(message);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">

        {/* LEFT PANEL */}
        <section className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-slate-900 to-slate-950" />

          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

            <Link
              href="/"
              className="inline-flex w-fit items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-700 shadow-lg">
                <Store size={23} />
              </div>

              <span className="text-xl font-bold tracking-tight text-white">
                ComputerHub
              </span>
            </Link>

            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-blue-100 backdrop-blur">
                <ShieldCheck size={15} />
                Secure Administration
              </div>

              <h1 className="text-5xl font-bold leading-tight tracking-tight text-white xl:text-6xl">
                Manage your
                <span className="block text-blue-300">
                  technology marketplace.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-slate-300">
                Control products, categories, orders,
                customers and marketplace operations
                from one secure administration panel.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <p className="text-lg font-bold text-white">
                    Products
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Manage catalog
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <p className="text-lg font-bold text-white">
                    Orders
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Track purchases
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <p className="text-lg font-bold text-white">
                    Users
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Manage accounts
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              ComputerHub Administration
            </p>
          </div>
        </section>

        {/* RIGHT PANEL */}
        <section className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 sm:px-6">
          <div className="w-full max-w-md">

            {/* MOBILE BRAND */}
            <div className="mb-8 text-center lg:hidden">
              <Link
                href="/"
                className="inline-flex items-center gap-3"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
                  <Store size={22} />
                </div>

                <span className="text-xl font-bold text-slate-950">
                  ComputerHub
                </span>
              </Link>
            </div>

            {/* TITLE */}
            <div className="mb-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/20">
                <ShieldCheck size={31} />
              </div>

              <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-950">
                Admin Login
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Sign in to access the ComputerHub
                administration panel.
              </p>
            </div>

            {/* LOGIN CARD */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">

              {/* SECURITY NOTICE */}
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <ShieldCheck size={20} />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Authorized access only
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Only accounts with administrator
                    privileges can access this area.
                  </p>
                </div>
              </div>

              {/* ERROR */}
              {error && (
                <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                  <AlertCircle
                    size={19}
                    className="mt-0.5 shrink-0 text-red-600"
                  />

                  <p className="text-sm leading-5 text-red-700">
                    {error}
                  </p>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={19}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="admin@example.com"
                      autoComplete="email"
                      disabled={loading}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={19}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="password"
                      name="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={loading}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) => !current
                        )
                      }
                      disabled={loading}
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={19}
                        className="animate-spin"
                      />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in to Admin
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* CUSTOMER LOGIN */}
              <div className="mt-7 border-t border-slate-100 pt-6 text-center">
                <p className="text-sm text-slate-500">
                  Need the customer storefront?
                </p>

                <Link
                  href="/login"
                  className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Go to customer login
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-slate-400">
              Protected ComputerHub administration area
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-950">
          <Loader2
            size={30}
            className="animate-spin text-blue-400"
          />
        </main>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}