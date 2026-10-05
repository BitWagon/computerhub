import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  FolderTree,
} from "lucide-react";

export default function CategoryHeader({
  category,
}) {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="container-main py-10 sm:py-14 lg:py-16">
        {/* Breadcrumb */}

        <div className="mb-7 flex items-center gap-2 text-xs font-medium text-slate-400">
          <Link
            href="/"
            className="transition hover:text-blue-600"
          >
            Home
          </Link>

          <ChevronRight size={14} />

          <Link
            href="/category"
            className="transition hover:text-blue-600"
          >
            Categories
          </Link>

          <ChevronRight size={14} />

          <span className="font-semibold text-slate-600">
            {category?.name || "Category"}
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700">
              <FolderTree size={14} />

              ComputerHub Category
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              {category?.name || "Products"}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              {category?.description ||
                `Explore the latest ${category?.name || "technology"} products on ComputerHub.`}
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            View All Products

            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}