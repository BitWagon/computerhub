"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}) {
  useEffect(() => {
    console.error("Global Error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle
            size={38}
            className="text-red-600"
          />
        </div>

        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Something went wrong
        </h1>

        <p className="mt-3 text-gray-500">
          An unexpected error occurred while loading this page.
        </p>

        <p className="mt-2 break-all text-xs text-gray-400">
          {error?.message}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">

          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <RotateCw size={18} />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <Home size={18} />
            Go Home
          </Link>

        </div>

      </div>
    </main>
  );
}