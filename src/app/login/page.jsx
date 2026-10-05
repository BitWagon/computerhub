import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  ShoppingBag,
  Zap,
} from "lucide-react";

import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Login | ComputerHub",
  description: "Login to your ComputerHub account.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl lg:grid-cols-2">
        {/* LEFT SIDE */}

        <div className="hidden flex-col justify-center px-8 py-16 lg:flex xl:px-16">
          <Link
            href="/"
            className="mb-12 inline-flex w-fit items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to ComputerHub
          </Link>

          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700">
              <ShieldCheck size={14} />
              Secure Account Access
            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight text-slate-950 xl:text-6xl">
              Welcome back to
              <span className="block text-blue-600">
                ComputerHub.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-slate-500">
              Sign in to manage your orders, wishlist, account details,
              and technology purchases.
            </p>

            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <CheckCircle2
                  size={18}
                  className="text-blue-600"
                />
                Fast and secure checkout
              </div>

              <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <CheckCircle2
                  size={18}
                  className="text-blue-600"
                />
                Track your orders in one place
              </div>

              <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <CheckCircle2
                  size={18}
                  className="text-blue-600"
                />
                Save products to your wishlist
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-10">
          <div className="w-full max-w-md">
            {/* MOBILE BRAND */}

            <div className="mb-8 text-center lg:hidden">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-2xl font-black tracking-tight text-blue-600"
              >
                <ShoppingBag size={25} />
                ComputerHub
              </Link>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
              <div className="mb-7">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Zap size={21} />
                </div>

                <h2 className="text-2xl font-black tracking-tight text-slate-950">
                  Sign in
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Enter your account details to continue.
                </p>
              </div>

              <LoginForm />
            </div>

            <div className="mt-6 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-bold text-blue-600 transition hover:text-blue-700"
              >
                Create an account
              </Link>
            </div>

            <div className="mt-4 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition hover:text-blue-600"
              >
                <ArrowLeft size={14} />
                Back to ComputerHub
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}