import Link from "next/link";
import {
  FileText,
  Shield,
  ShoppingCart,
  CreditCard,
  Truck,
  RotateCcw,
  Scale,
} from "lucide-react";

export const metadata = {
  title: "Terms & Conditions",
  description: "ComputerHub Terms & Conditions",
};

export default function TermsPage() {
  const sections = [
    {
      icon: ShoppingCart,
      title: "Using ComputerHub",
      text: "By using ComputerHub, you agree to use our website responsibly and provide accurate information when creating an account or placing an order.",
    },
    {
      icon: CreditCard,
      title: "Payments",
      text: "All prices are displayed in Pakistani Rupees (PKR). Orders are confirmed after successful payment verification or Cash on Delivery confirmation.",
    },
    {
      icon: Truck,
      title: "Shipping",
      text: "Delivery times may vary depending on your location and product availability. ComputerHub will keep customers informed about order status.",
    },
    {
      icon: RotateCcw,
      title: "Returns & Refunds",
      text: "Eligible products may be returned according to our return policy. Items must be unused and returned within the applicable return period.",
    },
    {
      icon: Shield,
      title: "Accounts",
      text: "Customers are responsible for keeping their account credentials secure. ComputerHub reserves the right to suspend accounts that violate our policies.",
    },
    {
      icon: Scale,
      title: "Limitation of Liability",
      text: "ComputerHub is not responsible for delays or issues caused by third-party shipping services or circumstances beyond our reasonable control.",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="container-main py-12">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
              <FileText size={16} />
              Legal Information
            </div>

            <h1 className="text-4xl font-bold text-gray-900">
              Terms & Conditions
            </h1>

            <p className="mt-4 text-lg text-gray-600">
              These terms explain how ComputerHub operates and what you agree
              to when using our marketplace.
            </p>

            <p className="mt-3 text-sm text-gray-500">
              Last updated: January 2026
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-main">
          <div className="grid gap-6 md:grid-cols-2">
            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <div
                  key={section.title}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={24} />
                  </div>

                  <h2 className="text-xl font-bold text-gray-900">
                    {section.title}
                  </h2>

                  <p className="mt-3 leading-7 text-gray-600">
                    {section.text}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-6">
            <h3 className="text-xl font-bold text-gray-900">
              Questions About These Terms?
            </h3>

            <p className="mt-2 text-gray-600">
              If you need clarification about our Terms & Conditions, our
              support team is here to help.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Contact Support
              </Link>

              <Link
                href="/privacy"
                className="rounded-xl border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
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