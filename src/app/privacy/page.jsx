import {
  Shield,
  Lock,
  User,
  ShoppingBag,
  Mail,
  Eye,
  Cookie,
  Clock,
} from "lucide-react";

export const metadata = {
  title: "Privacy Policy | ComputerHub",
  description: "Learn how ComputerHub collects, uses and protects your personal information.",
};

const sections = [
  {
    icon: User,
    title: "Information We Collect",
    content:
      "We collect the information you provide when creating an account, placing an order, contacting support, or becoming a seller. This may include your name, email address, phone number, shipping address, and order details.",
  },
  {
    icon: ShoppingBag,
    title: "How We Use Your Information",
    content:
      "Your information is used to process orders, provide customer support, improve our marketplace, communicate important updates, and maintain account security.",
  },
  {
    icon: Lock,
    title: "How We Protect Your Data",
    content:
      "We use secure authentication, encrypted connections (HTTPS), and restricted access to protect your personal information from unauthorized access or misuse.",
  },
  {
    icon: Eye,
    title: "Information Sharing",
    content:
      "We do not sell your personal information. Information is only shared when necessary to complete your order, comply with legal requirements, or support essential marketplace services.",
  },
  {
    icon: Cookie,
    title: "Cookies",
    content:
      "ComputerHub uses cookies to remember your preferences, keep you signed in, and improve website performance. You can manage cookies through your browser settings.",
  },
  {
    icon: Mail,
    title: "Your Rights",
    content:
      "You can update your account information, request support regarding your personal data, and contact us with privacy-related questions.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300">
              <Shield size={16} />
              Privacy & Security
            </div>

            <h1 className="text-5xl font-bold leading-tight">
              Your privacy matters.
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              ComputerHub is committed to protecting your personal information.
              This policy explains what we collect, how we use it, and how we
              keep it secure while you shop on our marketplace.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <Clock size={16} />
                Updated: September 2026
              </div>

              <div className="flex items-center gap-2">
                <Lock size={16} />
                Secure Marketplace
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Highlights */}
      <section className="mx-auto -mt-10 max-w-7xl px-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
            <Shield className="mb-3 text-blue-600" size={32} />
            <h3 className="font-bold text-slate-900">Secure Shopping</h3>
            <p className="mt-2 text-sm text-slate-600">
              We protect your account and order information using secure
              technologies.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
            <Eye className="mb-3 text-blue-600" size={32} />
            <h3 className="font-bold text-slate-900">No Data Selling</h3>
            <p className="mt-2 text-sm text-slate-600">
              We do not sell your personal information to third parties.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
            <Lock className="mb-3 text-blue-600" size={32} />
            <h3 className="font-bold text-slate-900">Protected Payments</h3>
            <p className="mt-2 text-sm text-slate-600">
              Sensitive information is handled through secure encrypted
              connections.
            </p>
          </div>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6">
          {sections.map((section, index) => {
            const Icon = section.icon;

            return (
              <div
                key={index}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start gap-5">
                  <div className="rounded-2xl bg-blue-50 p-4">
                    <Icon className="text-blue-600" size={28} />
                  </div>

                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-900">
                      {section.title}
                    </h2>

                    <p className="mt-3 leading-8 text-slate-600">
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-10 text-white">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold">Questions about your privacy?</h2>

            <p className="mt-4 text-blue-100 leading-7">
              If you have any questions about this Privacy Policy or how your
              information is handled, our support team is here to help.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/contact"
                className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-slate-100"
              >
                Contact Support
                  </a>

                        <a
                         href="mailto:support@computerhub.com?subject=ComputerHub%20Support"
                         className="rounded-xl border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                        >
                      support@computerhub.com
                  </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}