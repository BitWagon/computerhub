import Link from "next/link";
import {
  ArrowRight,
  CreditCard,
  FileText,
  RotateCcw,
  Scale,
  Shield,
  ShoppingCart,
  Truck,
} from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | ComputerHub",
  description:
    "ComputerHub Terms & Conditions for using our technology marketplace.",
};

const sections = [
  {
    icon: ShoppingCart,
    number: "01",
    title: "Using ComputerHub",
    text:
      "By using ComputerHub, you agree to use our website responsibly and provide accurate information when creating an account or placing an order.",
  },
  {
    icon: CreditCard,
    number: "02",
    title: "Payments",
    text:
      "All prices are displayed in Pakistani Rupees (PKR). Orders are confirmed after successful payment verification or Cash on Delivery confirmation.",
  },
  {
    icon: Truck,
    number: "03",
    title: "Shipping",
    text:
      "Delivery times may vary depending on your location and product availability. ComputerHub will keep customers informed about order status.",
  },
  {
    icon: RotateCcw,
    number: "04",
    title: "Returns & Refunds",
    text:
      "Eligible products may be returned according to our return policy. Items must be unused and returned within the applicable return period.",
  },
  {
    icon: Shield,
    number: "05",
    title: "Accounts",
    text:
      "Customers are responsible for keeping their account credentials secure. ComputerHub reserves the right to suspend accounts that violate our policies.",
  },
  {
    icon: Scale,
    number: "06",
    title: "Limitation of Liability",
    text:
      "ComputerHub is not responsible for delays or issues caused by third-party shipping services or circumstances beyond our reasonable control.",
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-slate-950 text-white">
        <div className="container-main py-14 sm:py-18 lg:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-300">
              <FileText size={15} />
              Legal Information
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
              Terms & Conditions
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              These terms explain how ComputerHub operates and what you
              agree to when using our marketplace.
            </p>

            <p className="mt-5 text-xs font-semibold text-slate-400">
              Last updated: January 2026
            </p>
          </div>
        </div>
      </section>

      {/* Terms */}
      <section className="container-main py-10 sm:py-14">
        <div className="grid gap-4 md:grid-cols-2">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <article
                key={section.title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                    <Icon size={21} />
                  </div>

                  <span className="text-xs font-black tracking-[0.16em] text-slate-300">
                    {section.number}
                  </span>
                </div>

                <h2 className="mt-5 text-xl font-black text-slate-950">
                  {section.title}
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {section.text}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Important notice */}
      <section className="container-main pb-10">
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 sm:p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600">
              <Scale size={19} />
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-950">
                Please review these terms before using the marketplace.
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                If you have questions about these Terms & Conditions,
                contact the ComputerHub support team before completing
                your transaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-main pb-14 sm:pb-20">
        <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-9">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                Need clarification?
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-950">
                Questions about these terms?
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Our support team can help explain marketplace questions.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white hover:bg-blue-700"
              >
                Contact Support
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/privacy"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}