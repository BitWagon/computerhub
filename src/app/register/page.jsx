import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Create Account | ComputerHub",
  description: "Create your ComputerHub customer account.",
};

export default function RegisterPage() {
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
              <Sparkles size={14} />
              Start Shopping Smarter
            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight text-slate-950 xl:text-6xl">
              Create your
              <span className="block text-blue-600">
                ComputerHub account.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-slate-500">
              Create your account and keep your technology shopping,
              orders, and wishlist organized in one place.
            </p>

            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <CheckCircle2
                  size={18}
                  className="text-blue-600"
                />
                Faster checkout experience
              </div>

              <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <CheckCircle2
                  size={18}
                  className="text-blue-600"
                />
                Easy order tracking
              </div>

              <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <CheckCircle2
                  size={18}
                  className="text-blue-600"
                />
                Save your favorite products
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-lg">
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
                  <ShieldCheck size={21} />
                </div>

                <h2 className="text-2xl font-black tracking-tight text-slate-950">
                  Create account
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Enter your details to create your customer account.
                </p>
              </div>

              <RegisterForm />
            </div>

            <div className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-blue-600 transition hover:text-blue-700"
              >
                Sign in
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