"use client";
import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
          <Search className="text-blue-600" size={36} />
        </div>

        <h1 className="mt-6 text-5xl font-bold text-gray-900">
          404
        </h1>

        <h2 className="mt-3 text-2xl font-bold text-gray-800">
          Page Not Found
        </h2>

        <p className="mt-3 text-gray-500">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Home size={18} />
            Go Home
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

        </div>

      </div>
    </main>
  );
}