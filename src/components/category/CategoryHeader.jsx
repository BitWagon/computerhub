import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function CategoryHeader({ category }) {
  return (
    <section className="border-b border-gray-200 bg-white">
      <div className="container-main py-6">
        <div className="mb-5 flex items-center gap-2 text-xs text-gray-500">
          <Link
            href="/"
            className="flex items-center gap-1 transition hover:text-blue-600"
          >
            <Home size={13} />
            Home
          </Link>

          <ChevronRight size={13} />

          <span className="font-medium text-gray-700">
            {category.name}
          </span>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-blue-900 px-6 py-8 text-white sm:px-10 sm:py-10">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-200">
              ComputerHub Marketplace
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              {category.name}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-300 sm:text-base">
              {category.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}