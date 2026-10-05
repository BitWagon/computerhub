import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Cookie,
  Lock,
  Mail,
  Settings,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react";

export const metadata = {
  title: "Cookie Policy | ComputerHub",
  description:
    "Learn how ComputerHub uses cookies and browser storage to improve your shopping experience.",
};

const sections = [
  {
    icon: Cookie,
    title: "What are cookies?",
    content:
      "Cookies are small files stored in your browser that help websites remember your preferences and improve your browsing experience.",
  },
  {
    icon: ShoppingCart,
    title: "Essential cookies",
    content:
      "These cookies keep your shopping cart, checkout information, and account session working correctly while you use ComputerHub.",
  },
  {
    icon: ShieldCheck,
    title: "Security cookies",
    content:
      "Security-related cookies help protect your account, prevent unauthorized access, and support secure authentication.",
  },
  {
    icon: BarChart3,
    title: "Performance cookies",
    content:
      "We may use performance and analytics technologies to understand how visitors use our website so we can improve speed and usability.",
  },
  {
    icon: Settings,
    title: "Managing cookies",
    content:
      "You can control or remove cookies through your browser settings. Some features of ComputerHub may not work properly if essential cookies are disabled.",
  },
];

const cookieTypes = [
  {
    title: "Essential Cookies",
    text: "Required for login, shopping cart and checkout.",
  },
  {
    title: "Preference Cookies",
    text: "Remember settings such as language and preferences.",
  },
  {
    title: "Performance Cookies",
    text: "Help improve website speed and usability.",
  },
  {
    title: "Security Cookies",
    text: "Support account protection and fraud prevention.",
  },
];

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-slate-950 text-white">
        <div className="container-main py-14 sm:py-18 lg:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-300">
              <Cookie size={15} />
              Legal Information
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
              Cookie Policy
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Learn how ComputerHub uses cookies and browser storage to
              provide a secure, faster and more useful shopping experience.
            </p>

            <p className="mt-5 text-xs font-semibold text-slate-400">
              Last updated: September 29, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="container-main -mt-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Highlight
            icon={ShoppingCart}
            title="Cart Memory"
            text="Helps keep products in your cart."
          />

          <Highlight
            icon={Lock}
            title="Secure Login"
            text="Supports your account session."
          />

          <Highlight
            icon={BarChart3}
            title="Better Experience"
            text="Helps improve website performance."
          />

          <Highlight
            icon={Settings}
            title="Your Choice"
            text="Manage cookies through your browser."
          />
        </div>
      </section>

      {/* Main */}
      <section className="container-main py-10 sm:py-14">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
          <div className="space-y-4">
            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <article
                  key={section.title}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-5 sm:p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                      <Icon size={21} />
                    </div>

                    <div>
                      <h2 className="text-lg font-black text-slate-950 sm:text-xl">
                        {section.title}
                      </h2>

                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Types */}
          <div className="mt-8 border-t border-slate-200 pt-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
              Cookie Types
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-950">
              Types of cookies we use
            </h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {cookieTypes.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-blue-600"
                    />

                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Browser controls */}
          <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600">
                <Settings size={19} />
              </div>

              <div>
                <h2 className="text-lg font-black text-slate-950">
                  How to manage cookies
                </h2>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Most browsers allow you to view, block or delete cookies
                  from the browser settings menu. Disabling essential
                  cookies may affect login, cart functionality and
                  checkout.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-main pb-14 sm:pb-20">
        <div className="rounded-3xl bg-blue-600 p-8 text-white sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-100">
                Cookie Support
              </p>

              <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                Questions about our Cookie Policy?
              </h2>

              <p className="mt-3 text-sm leading-6 text-blue-100">
                Contact our support team if you need more information about
                how cookies are used on ComputerHub.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-blue-700 hover:bg-slate-100"
              >
                Contact Support
                <ArrowRight size={16} />
              </Link>

              <a
                href="mailto:support@computerhub.com?subject=ComputerHub%20Cookie%20Policy"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-5 py-3.5 text-sm font-bold text-white hover:bg-white/10"
              >
                <Mail size={16} />
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Highlight({ icon: Icon, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon size={21} />
      </div>

      <h3 className="mt-4 text-sm font-black text-slate-950">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {text}
      </p>
    </div>
  );
}