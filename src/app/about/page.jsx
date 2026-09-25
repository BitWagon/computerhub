import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Users,
} from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-slate-950 py-16 text-white md:py-20">
        <div className="container-main">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-400">
            About ComputerHub
          </p>

          <h1 className="mt-3 max-w-3xl text-4xl font-black md:text-5xl">
            Technology shopping made simple.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300">
            ComputerHub is a technology marketplace designed to make it
            easier to discover computers, components, accessories and
            other technology products in one place.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container-main">
          <div className="grid gap-6 md:grid-cols-3">
            <InfoCard
              icon={ShoppingBag}
              title="Wide Product Selection"
              text="Browse computers, components, monitors, gaming products and accessories."
            />

            <InfoCard
              icon={ShieldCheck}
              title="Simple & Secure"
              text="We focus on a straightforward shopping experience from product discovery to checkout."
            />

            <InfoCard
              icon={Users}
              title="Marketplace"
              text="ComputerHub is designed to connect customers with technology products and sellers."
            />
          </div>

          <div className="mt-12 rounded-3xl border border-gray-200 bg-white p-7 shadow-sm md:p-10">
            <h2 className="text-2xl font-bold text-gray-900">
              Our goal
            </h2>

            <p className="mt-4 max-w-3xl leading-7 text-gray-600">
              Our goal is to create a convenient place where customers
              can find technology products, compare their options and
              place orders without unnecessary complexity.
            </p>

            <Link
              href="/products"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Browse Products
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon size={21} />
      </div>

      <h2 className="mt-5 text-lg font-bold text-gray-900">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-gray-600">
        {text}
      </p>
    </div>
  );
}