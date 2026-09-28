import Link from "next/link";
import {
  FileText,
  ShieldCheck,
  CreditCard,
  Truck,
  RotateCcw,
  AlertCircle,
  Scale,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | ComputerHub",
  description:
    "Read the Terms & Conditions for using ComputerHub, including orders, payments, returns and customer responsibilities.",
};

const sections = [
  {
    icon: FileText,
    title: "1. Acceptance of Terms",
    content:
      "By accessing or using ComputerHub, you agree to these Terms & Conditions. If you do not agree, please do not use our website or services.",
  },
  {
    icon: ShieldCheck,
    title: "2. Account Responsibilities",
    content:
      "You are responsible for maintaining accurate account information and keeping your login credentials secure. You are responsible for activities performed through your account.",
  },
  {
    icon: CreditCard,
    title: "3. Orders & Payments",
    content:
      "Orders are subject to availability and confirmation. Prices are displayed in PKR and may change without prior notice. Payments are processed through supported payment methods, including Cash on Delivery where available.",
  },
  {
    icon: Truck,
    title: "4. Shipping & Delivery",
    content:
      "Delivery times are estimates and may vary depending on your location and product availability. We are not responsible for delays caused by courier services or unforeseen circumstances.",
  },
  {
    icon: RotateCcw,
    title: "5. Returns & Refunds",
    content:
      "Eligible products may be returned according to our return policy. Items must be returned in their original condition with applicable accessories.",
  },
  {
    icon: AlertCircle,
    title: "6. Product Information",
    content:
      "We strive to provide accurate product descriptions, specifications and images. Minor variations may occur depending on manufacturers or display settings.",
  },
  {
    icon: Scale,
    title: "7. Limitation of Liability",
    content:
      "ComputerHub is not liable for indirect or consequential damages arising from the use of our platform, except where required by applicable law.",
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="container-main py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <Scale size={16} />
              Legal Information
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight md:text-5xl">
              Terms & Conditions
            </h1>

            <p className="mt-5 text-lg text-blue-100">
              These terms explain how ComputerHub works, your rights as a
              customer, and our responsibilities when you use our marketplace.
            </p>

            <p className="mt-4 text-sm text-blue-200">
              Last updated: September 29, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="container-main -mt-8 pb-6">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <ShieldCheck className="mb-3 text-blue-600" size={28} />
            <h3 className="font-semibold">Secure Shopping</h3>
            <p className="mt-2 text-sm text-slate-600">
              Safe accounts and protected transactions.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <Truck className="mb-3 text-blue-600" size={28} />
            <h3 className="font-semibold">Reliable Delivery</h3>
            <p className="mt-2 text-sm text-slate-600">
              Estimated delivery based on availability.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <RotateCcw className="mb-3 text-blue-600" size={28} />
            <h3 className="font-semibold">Returns</h3>
            <p className="mt-2 text-sm text-slate-600">
              Eligible products can be returned.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <CreditCard className="mb-3 text-blue-600" size={28} />
            <h3 className="font-semibold">Payments</h3>
            <p className="mt-2 text-sm text-slate-600">
              Multiple supported payment options.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-main py-8">
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200 md:p-10">
          <div className="space-y-8">
            {sections.map((section, index) => {
              const Icon = section.icon;

              return (
                <div
                  key={index}
                  className="flex gap-5 border-b border-slate-100 pb-8 last:border-0 last:pb-0"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={24} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {section.title}
                    </h2>

                    <p className="mt-3 leading-8 text-slate-600">
                      {section.content}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Seller Rules */}
            <div className="rounded-2xl bg-slate-50 p-6 border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">
                Seller Guidelines
              </h2>

              <ul className="mt-4 space-y-3 text-slate-600">
                <li>• Products must be genuine and accurately described.</li>
                <li>• Prices and stock should remain up to date.</li>
                <li>• Sellers are responsible for fulfilling valid orders.</li>
                <li>• Misleading listings may be removed.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="container-main pb-16">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white md:p-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold">
                Need help understanding our terms?
              </h2>

              <p className="mt-3 text-blue-100">
                Our support team is available to answer questions about orders,
                returns or marketplace policies.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-slate-100"
              >
                Contact Support
              </Link>

              <a
                href="mailto:support@computerhub.com?subject=ComputerHub%20Support"
                className="flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                support@computerhub.com
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}