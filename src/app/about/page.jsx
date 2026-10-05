import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Headphones,
  Laptop,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Users,
} from "lucide-react";

export default function AboutPage() {
  const features = [
    {
      icon: Laptop,
      title: "Technology Selection",
      text: "Laptops, desktops, components, monitors, gaming products and accessories in one marketplace.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Shopping",
      text: "A straightforward shopping and checkout experience designed around customer confidence.",
    },
    {
      icon: Truck,
      title: "Reliable Delivery",
      text: "Clear order handling and delivery tracking from purchase to arrival.",
    },
    {
      icon: Headphones,
      title: "Customer Support",
      text: "Helpful support for product questions, orders and your ComputerHub experience.",
    },
  ];

  const values = [
    "Quality technology products",
    "Clear and transparent shopping",
    "Reliable customer experience",
    "Simple technology buying",
  ];

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="container-main relative py-16 sm:py-20 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">

            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-300">
                <ShoppingBag size={14} />
                About ComputerHub
              </div>

              <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Technology shopping,
                <span className="text-blue-400">
                  {" "}made simple.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                ComputerHub is a technology marketplace built to make it
                easier to discover and shop for laptops, desktops,
                components, monitors, gaming products and accessories.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  Explore Products
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur">
                <div className="rounded-2xl bg-slate-900 p-6">

                  <div className="flex items-center justify-between border-b border-white/10 pb-5">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-400">
                        ComputerHub
                      </p>

                      <p className="mt-1 text-lg font-black text-white">
                        Technology Marketplace
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
                      <Laptop size={22} />
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <VisualCard
                      icon={Laptop}
                      title="Laptops"
                    />

                    <VisualCard
                      icon={Users}
                      title="PC Systems"
                    />

                    <VisualCard
                      icon={ShieldCheck}
                      title="Components"
                    />

                    <VisualCard
                      icon={ShoppingBag}
                      title="Accessories"
                    />
                  </div>

                  <div className="mt-5 rounded-2xl border border-blue-400/10 bg-blue-500/10 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
                        <CheckCircle2 size={18} />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-white">
                          One place for your technology needs
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Simple discovery. Simple shopping.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="container-main py-12 sm:py-16">
        <div className="mx-auto max-w-3xl text-center">

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
            Why ComputerHub
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Built around a better technology shopping experience
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
            We focus on making technology easier to discover, compare and
            purchase through a clean marketplace experience.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <StatCard
            number="01"
            title="Discover"
            text="Find technology products across the categories you use every day."
          />

          <StatCard
            number="02"
            title="Choose"
            text="Review product information and select the option that fits your needs."
          />

          <StatCard
            number="03"
            title="Order"
            text="Complete checkout and keep your order information organized."
          />
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-slate-200 bg-white">
        <div className="container-main py-14 sm:py-18">

          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              The ComputerHub Difference
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Everything focused on a better customer experience
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              From product discovery to delivery, ComputerHub keeps the
              experience focused and straightforward.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                    <Icon size={22} />
                  </div>

                  <h3 className="mt-5 text-lg font-black text-slate-950">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {feature.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="container-main py-14 sm:py-18">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              Our Approach
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Technology should feel easier to buy
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">
              ComputerHub brings technology products into one organized
              marketplace so customers can spend less time searching and
              more time choosing what works for them.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              Whether you're upgrading a workspace, building a PC,
              improving your gaming setup or simply looking for accessories,
              our goal is to keep the buying journey clear and convenient.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {values.map((value) => (
                <div
                  key={value}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4"
                >
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-blue-600"
                  />

                  <span className="text-sm font-semibold text-slate-700">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="rounded-2xl bg-slate-950 p-7 text-white sm:p-9">

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-400">
                ComputerHub
              </p>

              <h3 className="mt-4 text-2xl font-black leading-tight sm:text-3xl">
                A focused marketplace for modern technology.
              </h3>

              <div className="mt-8 space-y-4">
                <FeatureLine text="Technology-focused product categories" />
                <FeatureLine text="Simple product discovery" />
                <FeatureLine text="Straightforward checkout" />
                <FeatureLine text="Order management in one place" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="container-main pb-14 sm:pb-20">
        <div className="overflow-hidden rounded-3xl bg-blue-600 p-8 text-white sm:p-10 lg:p-12">

          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-100">
                Start Shopping
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Find your next technology upgrade.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
                Explore the ComputerHub marketplace and discover products
                for work, gaming and everyday computing.
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-blue-700 transition hover:bg-slate-100"
            >
              Browse Products
              <ArrowRight size={18} />
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}

function VisualCard({ icon: Icon, title }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <Icon
        size={20}
        className="text-blue-400"
      />

      <p className="mt-3 text-sm font-bold text-white">
        {title}
      </p>
    </div>
  );
}

function StatCard({ number, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-black tracking-[0.18em] text-blue-600">
        {number}
      </p>

      <h3 className="mt-4 text-xl font-black text-slate-950">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {text}
      </p>
    </div>
  );
}

function FeatureLine({ text }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2
        size={18}
        className="shrink-0 text-blue-400"
      />

      <span className="text-sm font-medium text-slate-300">
        {text}
      </span>
    </div>
  );
}