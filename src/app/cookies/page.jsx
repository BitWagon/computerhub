import Link from "next/link";
import {
  Cookie,
  ShieldCheck,
  ShoppingCart,
  Lock,
  BarChart3,
  Settings,
  Mail,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "Cookie Policy | ComputerHub",
  description:
    "Learn how ComputerHub uses cookies and browser storage to improve your shopping experience.",
};

const sections = [
  {
    icon: Cookie,
    title: "1. What are cookies?",
    content:
      "Cookies are small files stored in your browser that help websites remember your preferences and improve your browsing experience.",
  },
  {
    icon: ShoppingCart,
    title: "2. Essential cookies",
    content:
      "These cookies keep your shopping cart, checkout information, and account session working correctly while you use ComputerHub.",
  },
  {
    icon: ShieldCheck,
    title: "3. Security cookies",
    content:
      "Security-related cookies help protect your account, prevent unauthorized access, and support secure authentication.",
  },
  {
    icon: BarChart3,
    title: "4. Performance cookies",
    content:
      "We may use performance and analytics technologies to understand how visitors use our website so we can improve speed and usability.",
  },
  {
    icon: Settings,
    title: "5. Managing cookies",
    content:
      "You can control or remove cookies through your browser settings. Some features of ComputerHub may not work properly if essential cookies are disabled.",
  },
];

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="container-main py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <Cookie size={16} />
              Legal Information
            </div>

            <h1 className="mt-6 text-4xl font-bold md:text-5xl">
              Cookie Policy
            </h1>

            <p className="mt-5 text-lg text-blue-100">
              Learn how ComputerHub uses cookies and browser storage to provide
              a secure, faster and more personalized shopping experience.
            </p>

            <p className="mt-4 text-sm text-blue-200">
              Last updated: September 29, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Quick Highlights */}
      <section className="container-main -mt-8 pb-6">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <ShoppingCart className="mb-3 text-blue-600" size={28} />
            <h3 className="font-semibold">Cart Memory</h3>
            <p className="mt-2 text-sm text-slate-600">
              Keeps products in your cart.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <Lock className="mb-3 text-blue-600" size={28} />
            <h3 className="font-semibold">Secure Login</h3>
            <p className="mt-2 text-sm text-slate-600">
              Protects your account session.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <BarChart3 className="mb-3 text-blue-600" size={28} />
            <h3 className="font-semibold">Better Experience</h3>
            <p className="mt-2 text-sm text-slate-600">
              Helps improve website performance.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <Settings className="mb-3 text-blue-600" size={28} />
            <h3 className="font-semibold">Your Choice</h3>
            <p className="mt-2 text-sm text-slate-600">
              Manage cookies anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-main py-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
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

            {/* Cookie Types */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Types of cookies we use
              </h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-white p-4 border border-slate-200">
                  <h3 className="font-semibold text-slate-900">
                    Essential Cookies
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Required for login, shopping cart and checkout.
                  </p>
                </div>

                <div className="rounded-xl bg-white p-4 border border-slate-200">
                  <h3 className="font-semibold text-slate-900">
                    Preference Cookies
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Remember settings such as language and preferences.
                  </p>
                </div>

                <div className="rounded-xl bg-white p-4 border border-slate-200">
                  <h3 className="font-semibold text-slate-900">
                    Performance Cookies
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Help improve website speed and usability.
                  </p>
                </div>

                <div className="rounded-xl bg-white p-4 border border-slate-200">
                  <h3 className="font-semibold text-slate-900">
                    Security Cookies
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Support account protection and fraud prevention.
                  </p>
                </div>
              </div>
            </div>

            {/* Browser Control */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
              <h2 className="text-2xl font-bold text-slate-900">
                How to manage cookies
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                Most browsers allow you to view, block or delete cookies from
                the browser settings menu. Disabling essential cookies may
                affect login, cart functionality and checkout.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Banner */}
      <section className="container-main pb-16">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white md:p-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold">
                Questions about our Cookie Policy?
              </h2>

              <p className="mt-3 text-blue-100">
                Our support team is happy to explain how cookies are used on
                ComputerHub.
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
                href="mailto:support@computerhub.com?subject=ComputerHub%20Cookie%20Policy"
                className="flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                <Mail size={18} />
                Email Us
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}