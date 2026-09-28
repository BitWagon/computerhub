import {
  ShieldCheck,
  Truck,
  Headphones,
  Store,
  Laptop,
  Users,
  CheckCircle,
} from "lucide-react";

export default function AboutPage() {
  const features = [
    {
      icon: <Laptop className="h-8 w-8 text-blue-600" />,
      title: "Quality Technology",
      text: "Carefully selected laptops, desktops, monitors and PC components.",
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-blue-600" />,
      title: "Secure Shopping",
      text: "Your orders are protected with secure checkout and trusted payments.",
    },
    {
      icon: <Truck className="h-8 w-8 text-blue-600" />,
      title: "Fast Delivery",
      text: "Reliable delivery across Pakistan with order tracking.",
    },
    {
      icon: <Headphones className="h-8 w-8 text-blue-600" />,
      title: "Customer Support",
      text: "Friendly support whenever you need help before or after purchase.",
    },
  ];

  const values = [
    "Genuine technology products",
    "Fair and transparent pricing",
    "Reliable customer support",
    "Fast and secure shopping experience",
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-[#020B2F] text-white">
        <div className="container-main px-6 py-20 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
                About ComputerHub
              </p>

              <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
                Technology Shopping Made Simple.
              </h1>

              <p className="max-w-xl text-lg leading-8 text-slate-300">
                ComputerHub is a modern technology marketplace that helps
                customers discover laptops, desktops, PC components, monitors
                and accessories—all in one trusted place.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="/products"
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  Explore Products
                </a>

                <a
                  href="/contact"
                  className="rounded-xl border border-slate-600 px-6 py-3 font-semibold text-slate-200 transition hover:border-slate-400"
                >
                  Contact Us
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80"
                alt="ComputerHub technology store"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="container-main px-6 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            <Store className="mx-auto mb-4 h-10 w-10 text-blue-600" />
            <h3 className="text-3xl font-bold text-slate-900">Technology</h3>
            <p className="mt-2 text-slate-600">Marketplace</p>
          </div>

          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            <Users className="mx-auto mb-4 h-10 w-10 text-blue-600" />
            <h3 className="text-3xl font-bold text-slate-900">Trusted</h3>
            <p className="mt-2 text-slate-600">Customer Experience</p>
          </div>

          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            <Truck className="mx-auto mb-4 h-10 w-10 text-blue-600" />
            <h3 className="text-3xl font-bold text-slate-900">Fast</h3>
            <p className="mt-2 text-slate-600">Delivery Service</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container-main px-6 py-12">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            Why Shop with ComputerHub?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            We focus on making technology shopping simple, secure and reliable.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((item, index) => (
            <div
              key={index}
              className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="mb-2 text-lg font-bold text-slate-900">
                {item.title}
              </h3>
              <p className="text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section className="container-main px-6 py-12">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80"
              alt="Computer workspace"
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
              Our Story
            </p>

            <h2 className="mb-5 text-3xl font-bold text-slate-900">
              Built for Modern Technology Buyers
            </h2>

            <p className="mb-4 leading-8 text-slate-600">
              ComputerHub brings together quality technology products with a
              clean and easy shopping experience. Whether you're upgrading your
              workspace, building a gaming PC or buying accessories, everything
              is organized in one place.
            </p>

            <p className="leading-8 text-slate-600">
              Our goal is to make buying technology easier with trusted products,
              transparent pricing and helpful customer support.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container-main px-6 py-12">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-3xl font-bold text-slate-900">
            What We Believe In
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {values.map((value, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <span className="text-slate-700">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-main px-6 py-12 pb-20">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-700 p-10 text-center text-white">
          <h2 className="mb-4 text-3xl font-bold">
            Ready to Find Your Next Device?
          </h2>

          <p className="mx-auto mb-8 max-w-2xl text-blue-100">
            Browse our collection of laptops, desktops, monitors and PC
            components with confidence.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/products"
              className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-slate-100"
            >
              Shop Now
            </a>

            <a
              href="/contact"
              className="rounded-xl border border-blue-300 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}